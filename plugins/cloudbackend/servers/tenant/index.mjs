#!/usr/bin/env node
// cloudbackend-tenant: the plugin's own route to a CloudBackend PaaS account. It needs no sign-in realm on the account
// and nothing installed beyond Claude Code.
//
// Sign-in. tenant_signin serves a page on 127.0.0.1. The user types their CloudBackend e-mail or username and password
// there; the browser sends them straight to the CloudBackend API (POST /login answers cross-origin), and only the session
// token the API returns is posted back to this server. The token is kept in a file only the user can read
// (CBE_SESSION_DIR, the plugin's data folder) and never appears in a tool result. Claude never sees the password.
//
// With the session: list_projects, upload_project (a local package folder, linted first), deploy (a private
// Development deployment: boot page, datatypes, webshare and the console's pipeline record, the steps of the deploy
// connector's tool over the REST calls the developer portal's own deploys use), verify_deployment (served bytes, never a
// bare 200) and enable_deploy_connector (the owner creates the account's sign-in realm, after which the deploy connector
// signs in too). Node's built-ins only.

import { createHash, randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { lint } from '../build/index.mjs';

const VERSION = '2026.11.4';
const SERVER_NAME = 'cloudbackend-tenant';
const HERE = dirname(fileURLToPath(import.meta.url));
/** An environment setting, or '' when it is missing or still holds an unexpanded ${...} placeholder. */
const setting = (name) => { const v = process.env[name]; return v && !v.includes('${') ? v : ''; };
export const API = (setting('CBE_API') || 'https://api.cloudbackend.com/v1').replace(/\/$/, '');
export const AUTH = (setting('CBE_AUTH') || 'https://auth.cloudbackend.com').replace(/\/$/, '');
const SHARE_URL = setting('CBE_SHARE_URL') || 'https://{host}.cloudbackend.cloud';
export const SESSION_DIR = setting('CBE_SESSION_DIR') || join(homedir(), '.cloudbackend', 'sessions');
const SIGNIN_TTL_MS = 15 * 60 * 1000;
const TENANT = /^[a-z0-9]+$/;
const SLUG = /^[a-z0-9]+$/;
const MAX_FILES = 1000;
const TEXT_EXT = new Set(['.xml', '.xsl', '.xslt', '.xsd', '.svg', '.css', '.js', '.mjs', '.json', '.html', '.htm', '.txt', '.md', '.csv']);
const SKIP = new Set(['node_modules', 'Thumbs.db']);
const WRITTEN_BY_DEPLOY = new Set(['index.html', '.types.xml']);

export class ToolError extends Error {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const escXml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const unescXml = (v) => String(v).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const attrOf = (tag, name) => { const m = String(tag).match(new RegExp(`\\s${name}=(['"])(.*?)\\1`)); return m ? unescXml(m[2]) : undefined; };
const extOf = (name) => (String(name).match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
const MIME = {
  '.html': 'text/html', '.htm': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.txt': 'text/plain', '.md': 'text/plain', '.csv': 'text/csv', '.xml': 'text/xml', '.xsl': 'text/xml',
  '.xslt': 'text/xml', '.xsd': 'text/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
};
const contentTypeFor = (name) => MIME[extOf(name)] || 'application/octet-stream';

// ---- the session ------------------------------------------------------------------------------------------------------

/** The identity and the account a login answer describes, and its session token. A login answer lists every account the
 *  identity belongs to; the one whose tenant group is named after `tenant` is taken. */
export function parseLogin(xml, tenant) {
  xml = String(xml || '');
  const one = (tag) => { const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`)); return m ? unescXml(m[1]).trim() : ''; };
  const token = one('session');
  if (!/^[A-Za-z0-9._-]{8,}$/.test(token)) throw new ToolError('The sign-in answer carries no session token.');
  const groups = [];
  const re = /<group\b([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (attrOf(m[1], 'tenantgroup') !== 'true') continue;
    const g = { id: attrOf(m[1], 'id') || '', folderId: attrOf(m[1], 'folderId') || '', name: attrOf(m[1], 'name') || '', owner: attrOf(m[1], 'owner') === 'true', roles: [] };
    if (!m[2]) {
      const end = xml.indexOf('</group>', re.lastIndex);
      const inner = xml.slice(re.lastIndex, end < 0 ? undefined : end);
      g.roles = [...inner.matchAll(/<group\b[^>]*\srole=(['"])(.*?)\1/g)].map((r) => unescXml(r[2]));
    }
    groups.push(g);
  }
  const t = String(tenant || '').toLowerCase();
  const g = groups.find((x) => x.name.toLowerCase() === t) || (groups.length === 1 ? groups[0] : undefined);
  if (!g) throw new ToolError(groups.length ? `This identity signed in, but not to the account ${tenant}: it belongs to ${groups.map((x) => x.name).join(', ')}.` : 'The sign-in answer names no account.');
  const userId = one('userid'), username = one('username'), homeId = one('home');
  if (!userId || !homeId || !username) throw new ToolError('The sign-in answer carries no identity or home drive.');
  return {
    token,
    record: { tenant: t, userId, username, name: `${one('firstname')} ${one('lastname')}`.trim() || username, homeId,
      tenantGroupId: g.id, tenantFolderId: g.folderId, tenantName: g.name || t, owner: g.owner, roles: g.roles },
  };
}

const sessionPath = (tenant) => join(SESSION_DIR, `${tenant}.json`);
/** Keeps a session where only the user can read it. */
export function storeSession(record, token) {
  mkdirSync(SESSION_DIR, { recursive: true, mode: 0o700 });
  const file = sessionPath(record.tenant);
  writeFileSync(file, JSON.stringify({ ...record, token, signedInAt: new Date().toISOString() }, null, 2) + '\n', { mode: 0o600 });
  chmodSync(file, 0o600);
  return file;
}
function storedTenants() {
  try { return readdirSync(SESSION_DIR).filter((f) => /^[a-z0-9]+\.json$/.test(f)).map((f) => f.slice(0, -5)).sort(); } catch { return []; }
}
function checkTenant(tenant) {
  if (tenant !== undefined && tenant !== null && tenant !== '' && !TENANT.test(tenant)) {
    throw new ToolError('tenant is the account name: lowercase letters and digits, as in the console address https://<tenant>.db.cloudbackend.com/.');
  }
}
function readSession(tenant, { quiet = false } = {}) {
  checkTenant(tenant);
  let t = tenant;
  if (!t) {
    const all = storedTenants();
    if (all.length === 1) t = all[0];
    else if (!all.length) { if (quiet) return null; throw new ToolError('Not signed in to any CloudBackend account. tenant_signin opens the sign-in page; the user signs in there.'); }
    else throw new ToolError(`Signed in to several accounts (${all.join(', ')}): pass tenant.`);
  }
  const file = sessionPath(t);
  if (!existsSync(file)) { if (quiet) return null; throw new ToolError(`Not signed in to ${t}. tenant_signin opens the sign-in page; the user signs in there.`); }
  const s = JSON.parse(readFileSync(file, 'utf8'));
  if (!s.token) { if (quiet) return null; throw new ToolError(`The stored session for ${t} is unreadable. tenant_signin starts a new one.`); }
  s.roles = s.roles || [];
  return s;
}
function dropSession(tenant) { try { rmSync(sessionPath(tenant)); } catch { /* already gone */ } }
const isAdmin = (s) => s.owner || s.roles.some((r) => /^(owner|administrator)$/i.test(r));

// ---- the REST calls ---------------------------------------------------------------------------------------------------

const drain = async (r) => { try { await r.arrayBuffer(); } catch { /* nothing to drain */ } };
/** One authenticated request. GETs and uploads (the same file name overwrites the same document) are retried on a
 *  transient answer; a 401 ends the stored session. */
async function call(s, method, path, { body, headers = {}, idempotent = method === 'GET' } = {}) {
  const url = /^https?:/.test(path) ? path : `${API}${path}`;
  const label = `${method} ${url.startsWith(API) ? url.slice(API.length) : url}`;
  for (let attempt = 1; ; attempt++) {
    let r;
    try {
      r = await fetch(url, { method, headers: { Authorization: `WRAP access_token=${s.token}`, tenant: s.tenant, ...headers },
        body: typeof body === 'function' ? body() : body, signal: AbortSignal.timeout(120000) });
    } catch (e) {
      if (!idempotent || attempt >= 4) throw new ToolError(`${label}: ${e.cause?.code || e.message}`);
      await sleep(1000 * 2 ** (attempt - 1));
      continue;
    }
    if (r.status === 401) {
      await drain(r);
      dropSession(s.tenant);
      throw new ToolError(`The session for ${s.tenant} has ended (401 on ${label}). tenant_signin starts a new one.`);
    }
    if (idempotent && (r.status === 408 || r.status === 429 || r.status >= 500) && attempt < 4) { await drain(r); await sleep(1000 * 2 ** (attempt - 1)); continue; }
    return r;
  }
}
async function need(r, what) {
  if (r.ok) return r.text();
  const t = (await r.text().catch(() => '')).trim();
  throw new ToolError(`${what}: HTTP ${r.status}${t ? ` (${t.slice(0, 160)})` : ''}`);
}
const folderIdIn = (text, name) => {
  const s = String(text || ''), esc = escRe(name);
  const m = s.match(new RegExp(`<fs:folder\\s+id=['"](\\d+)['"][^>]*\\bname=['"]${esc}['"]`, 'i'))
    || s.match(new RegExp(`<fs:folder[^>]*\\bname=['"]${esc}['"][^>]*\\bid=['"](\\d+)['"]`, 'i'));
  return m ? m[1] : '';
};
const newFolderIdIn = (text) => (String(text || '').match(/<\s*new(?:Folder|Container)Id\s*>\s*([0-9]+)\s*<\//i) || [])[1] || '';
/** A child folder's id, '' when the API says there is none, an error for any answer that proves neither (creating on it
 *  could leave two folders of the same name). */
async function lookupFolder(s, parentId, name) {
  const r = await call(s, 'GET', `/folderpath/${parentId}/${encodeURIComponent(name)}`);
  if (r.ok) {
    const body = await r.text(), id = folderIdIn(body, name);
    if (!id && new RegExp(`\\bname=['"]${escRe(name)}['"]`, 'i').test(body)) throw new ToolError(`folder ${name}: named in the answer but with no readable id; not creating it blind`);
    return id;
  }
  await drain(r);
  if (r.status === 404) return '';
  throw new ToolError(`looking up folder ${name}: HTTP ${r.status}; not creating it blind`);
}
async function ensureFolder(s, parentId, name) {
  let id = await lookupFolder(s, parentId, name);
  if (id) return id;
  const r = await call(s, 'POST', `/container/${parentId}`, { body: `<newFolder><folder id="${parentId}"/><childFolder>${escXml(name)}</childFolder></newFolder>`, headers: { 'Content-Type': 'application/xml' } });
  const text = await r.text().catch(() => '');
  id = newFolderIdIn(text) || await lookupFolder(s, parentId, name).catch(() => '');
  if (!id) throw new ToolError(`could not create folder ${name} (HTTP ${r.status})${text ? `: ${text.slice(0, 160)}` : ''}`);
  return id;
}
/** A folder's files. The feed is paged at 100; `complete` says whether this is all of them. */
async function listDocuments(s, id) {
  const xml = await need(await call(s, 'GET', `/documents/${id}/`), `listing folder ${id}`);
  const items = [...xml.matchAll(/<atom:entry>([\s\S]*?)<\/atom:entry>/g)].map(([, e]) => ({
    name: unescXml((e.match(/<atom:title>([^<]*)<\/atom:title>/) || [])[1] || ''),
    href: unescXml((e.match(/\bhref=['"]([^'"]+)['"]/) || [])[1] || ''),
  }));
  const total = Number((xml.match(/<os:totalResults>\s*(\d+)\s*</) || [])[1] ?? items.length);
  return { items, complete: !(total > items.length) };
}
async function listSubfolders(s, id) {
  const xml = await need(await call(s, 'GET', `/containers/${id}`), `listing the subfolders of ${id}`);
  return [...xml.matchAll(/<fs:container\b([^>]*)>/g)].map(([, a]) => ({ id: attrOf(a, 'id'), name: attrOf(a, 'name') }))
    .filter((c) => c.name !== undefined && c.id !== String(id));
}
async function putDocument(s, folderId, name, bytes, type = contentTypeFor(name)) {
  const r = await call(s, 'POST', `/documents/${folderId}/?datasrc=datamodel`, {
    body: () => new Blob([bytes]), idempotent: true,
    headers: { 'Content-Type': 'application/octet-stream', 'X-Content-Type': type, 'X-File-Name': name },
  });
  const text = await r.text().catch(() => '');
  if (!r.ok) throw new ToolError(`uploading ${name}: HTTP ${r.status}${text ? ` (${text.slice(0, 160)})` : ''}`);
}
/** The identity's webshares: name, id, what each serves (its description's ProjectHref) and its stage. The list is paged;
 *  a partial list cannot prove an address free, so it is refused. */
async function listShares(s) {
  const xml = await need(await call(s, 'GET', `/users/${s.userId}/webshares/`), 'listing the webshares');
  const list = [...xml.matchAll(/<webshare\s[^>]*>/g)].map(([tag]) => {
    const description = attrOf(tag, 'description') || '';
    return { name: attrOf(tag, 'name'), id: attrOf(tag, 'id'), serves: ((description.match(/ProjectHref:\s*([^,]+)/) || [])[1] || '').trim(),
      stage: (description.match(/Stage:\s*([A-Za-z]+)/) || [])[1] || '' };
  });
  const total = Number((xml.match(/<os:totalResults>\s*(\d+)\s*</) || [])[1]);
  if (total > list.length) throw new ToolError(`the webshare list has ${total} entries but only ${list.length} came back; cannot prove an address is free`);
  return list;
}
const shareUrl = (s, slug) => SHARE_URL.replace('{host}', `${s.tenantName}-${s.username}-${slug}`.toLowerCase()).replace(/\/$/, '');
async function realmExists(tenant) {
  try {
    const r = await fetch(`${AUTH}/realms/${tenant}/.well-known/openid-configuration`, { signal: AbortSignal.timeout(15000) });
    await drain(r);
    return r.ok;
  } catch { return null; }
}
async function sessionAlive(s) {
  try {
    const r = await fetch(`${API}/sessions`, { headers: { Authorization: `WRAP access_token=${s.token}`, tenant: s.tenant }, signal: AbortSignal.timeout(15000) });
    await drain(r);
    return r.status;
  } catch { return 0; }
}

// ---- the local package ------------------------------------------------------------------------------------------------

function walk(root) {
  const out = [];
  const visit = (dir, rel) => {
    for (const name of readdirSync(dir).sort()) {
      if (name.startsWith('.') || SKIP.has(name)) continue;
      const abs = join(dir, name), r = rel ? `${rel}/${name}` : name, st = statSync(abs);
      if (st.isDirectory()) visit(abs, r);
      else if (st.isFile()) out.push({ rel: r, abs, size: st.size });
      if (out.length > MAX_FILES) throw new ToolError(`more than ${MAX_FILES} files under ${root}: path should be the package folder (app/ in the workflow layout).`);
    }
  };
  visit(root, '');
  return out;
}
function packageAt(path) {
  if (!path) throw new ToolError('path is the local package folder, the one holding index.xml (app/ in the workflow layout).');
  const root = resolve(String(path));
  if (!existsSync(join(root, 'index.xml'))) throw new ToolError(`${root} holds no index.xml: path should be the package folder (app/ in the workflow layout).`);
  const files = walk(root);
  const odd = files.filter((f) => !/^[\x20-\x7e]+$/.test(f.rel)).map((f) => f.rel);
  if (odd.length) throw new ToolError(`file names must be ASCII; rename: ${odd.slice(0, 10).join(', ')}`);
  return { root, files };
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await fn(items[i++]); }));
}
function checkProjectName(name) {
  if (!name || typeof name !== 'string' || /[\/\\:*?"<>|]/.test(name) || name.startsWith('.') || !/^[\x20-\x7e]+$/.test(name)) {
    throw new ToolError('project_name is the folder name under home://Applications/: ASCII, no slashes.');
  }
}
function slugFor(project_name, deployment_name) {
  const slug = deployment_name || project_name;
  if (!SLUG.test(slug || '')) {
    throw new ToolError(deployment_name ? 'deployment_name is lowercase letters and digits.'
      : `project_name ${JSON.stringify(project_name)} cannot be an address: pass deployment_name, lowercase letters and digits.`);
  }
  if (slug.startsWith('xios')) throw new ToolError('A deployment name must not begin with xios (rule G18).');
  return slug;
}

// ---- the tools --------------------------------------------------------------------------------------------------------

async function uploadProject({ path, project_name, tenant, lint: runLint = true }) {
  checkProjectName(project_name);
  const { root, files } = packageAt(path);
  let linted = 'skipped (lint: false)';
  if (runLint) {
    const texts = files.filter((f) => TEXT_EXT.has(extOf(f.rel))).map((f) => ({ path: f.rel, content: readFileSync(f.abs, 'utf8') }));
    const res = lint(texts, 'build');
    if (!res.ok) {
      const lines = res.errors.slice(0, 30).map((e) => `${e.rule} ${e.file}${e.line ? `:${e.line}` : ''} ${e.message}${e.fix ? ` (fix: ${e.fix})` : ''}`);
      throw new ToolError(`Nothing was uploaded: lint_project (profile build) found ${res.errors.length} error(s) in ${root}.\n${lines.join('\n')}`);
    }
    linted = `profile build: 0 errors, ${res.warnings.length} warning(s)`;
  }
  const s = readSession(tenant);
  const apps = await ensureFolder(s, s.homeId, 'Applications');
  const projectId = await ensureFolder(s, apps, project_name);
  const dirs = new Set();
  for (const f of files) for (let d = posix.dirname(f.rel); d !== '.'; d = posix.dirname(d)) dirs.add(d);
  const ids = new Map([['.', projectId]]);
  for (const d of [...dirs].sort((a, b) => a.split('/').length - b.split('/').length || (a < b ? -1 : 1))) {
    ids.set(d, await ensureFolder(s, ids.get(posix.dirname(d)), posix.basename(d)));
  }
  let uploaded = 0, bytes = 0;
  await pool(files, 4, async (f) => {
    const buf = readFileSync(f.abs);
    await putDocument(s, ids.get(posix.dirname(f.rel)), posix.basename(f.rel), buf);
    uploaded++; bytes += buf.length;
  });
  const local = new Set(files.map((f) => f.rel));
  const remoteOnly = [];
  let partial = false;
  for (const [dir, id] of ids) {
    const { items, complete } = await listDocuments(s, id);
    if (!complete) partial = true;
    for (const it of items) {
      const rel = dir === '.' ? it.name : `${dir}/${it.name}`;
      if (!local.has(rel) && !WRITTEN_BY_DEPLOY.has(rel)) remoteOnly.push(rel);
    }
  }
  return {
    tenant: s.tenant, project_href: `home://Applications/${project_name}`, from: root, uploaded, bytes, folders: ids.size, lint: linted,
    on_the_tenant_not_in_the_folder: remoteOnly.sort(),
    ...(remoteOnly.length ? { note: 'Files on the tenant that are not in the local folder were left in place; nothing is ever deleted.' } : {}),
    ...(partial ? { listing: 'a folder holds more than 100 files: the comparison covers the first 100' } : {}),
    next: 'deploy',
  };
}

function bootPage(s) {
  return readFileSync(join(HERE, 'files', 'index.html'), 'utf8')
    .replace('$TENANTNAME$', JSON.stringify(s.tenantName).slice(1, -1))
    .replace('$TENANTID$', String(s.tenantGroupId));
}

/** The console's pipeline record for the deployment, tenant://Settings/Pipelines/<project>/<slug>_pipeline (the folder the
 *  console reads, measured 2026-10-25). A record that already holds markup is the console's and is left as it is. */
async function writePipeline(s, { projectName, slug, url }) {
  const settings = s.tenantFolderId ? await lookupFolder(s, s.tenantFolderId, 'Settings') : '';
  const pipes = settings ? await lookupFolder(s, settings, 'Pipelines') : '';
  if (!pipes) return 'not written: tenant://Settings/Pipelines was not found. The address works; the console\'s Deployments view will not list it.';
  const key = String(projectName).toLowerCase().replace(/[^a-z0-9]/g, ''), docName = `${slug}_pipeline`, where = `tenant://Settings/Pipelines/${key}/${docName}`;
  const folder = await lookupFolder(s, pipes, key);
  if (folder) {
    const entry = (await listDocuments(s, folder)).items.find((d) => d.name === docName);
    if (entry && /<pipelines\b/.test(await need(await call(s, 'GET', entry.href), `reading ${where}`))) return `${where} exists and was left as it is (its history is the console's).`;
  }
  const target = folder || await ensureFolder(s, pipes, key);
  const now = new Date().toISOString().slice(0, 19), container = `home://Applications/${projectName}`;
  const who = `user="${escXml(s.name)}" user-name="${escXml(s.username)}"`;
  const deployEl = `<deploy version="1.0" internal-version="${escXml(slug)}" href="${escXml(url)}" ${who} visibility="private" date="${now}" `
    + `test="unchecked" depContainer="${escXml(container)}" container="${escXml(container)}" origin-container="${escXml(container)}" active="true" status="">\n`
    + `      <history date="${now}" ${who} action="Deploy">\n        <message text="created deployment" ${who}/>\n      </history>\n    </deploy>`;
  const doc = `<pipelines name="${escXml(projectName)}" git="" origin="home" shared="">\n  <pipeline name="Web">\n    <development>${deployEl}</development>\n`
    + '    <shared/>\n    <staging/>\n    <production/>\n  </pipeline>\n</pipelines>\n';
  await putDocument(s, target, docName, Buffer.from(doc), 'text/xml');
  const back = (await listDocuments(s, target)).items.find((d) => d.name === docName);
  const xml = back ? await need(await call(s, 'GET', back.href), `reading ${where} back`) : '';
  if (!/<development>\s*<deploy\b/.test(xml)) throw new ToolError(`${where} did not read back with the deployment in it`);
  return `wrote ${where} and read it back.`;
}

async function deploy({ project_name, deployment_name, tenant, keep_index_html = false }) {
  checkProjectName(project_name);
  const slug = slugFor(project_name, deployment_name);
  const s = readSession(tenant);
  const apps = await lookupFolder(s, s.homeId, 'Applications');
  const projectId = apps ? await lookupFolder(s, apps, project_name) : '';
  if (!projectId) throw new ToolError(`home://Applications/${project_name} does not exist on ${s.tenant}: upload_project first.`);
  const { items } = await listDocuments(s, projectId);
  const manifest = items.find((d) => d.name === 'index.xml');
  if (!manifest) throw new ToolError(`home://Applications/${project_name} holds no index.xml, so it is not an application.`);
  const manifestXml = await need(await call(s, 'GET', manifest.href), 'reading index.xml');
  if (!/<application\b/.test(manifestXml)) throw new ToolError('index.xml is not an <application> manifest.');
  const about = (manifestXml.match(/<about\b[\s\S]*?<\/about>/) || [''])[0];
  const description = unescXml((about.match(/<description>([^<]*)<\/description>/) || [])[1] || '').trim();
  const href = `home://Applications/${project_name}`;
  const shares = await listShares(s);
  const existing = shares.find((x) => x.name === slug);
  if (existing && existing.serves !== href) {
    throw new ToolError(`The address ${slug} already ${existing.serves ? `serves ${existing.serves}` : 'belongs to a webshare that does not say what it serves'}: pass another deployment_name.`);
  }
  const other = shares.find((x) => x.name !== slug && x.serves === href);
  if (other) throw new ToolError(`${href} is already deployed as ${other.name}: deploy again with deployment_name "${other.name}".`);
  const wrote = [];
  if (!(keep_index_html && items.some((d) => d.name === 'index.html'))) { await putDocument(s, projectId, 'index.html', Buffer.from(bootPage(s)), 'text/html'); wrote.push('index.html (the boot page)'); }
  await putDocument(s, projectId, '.types.xml', readFileSync(join(HERE, 'files', 'types.xml')), 'text/xml');
  wrote.push('.types.xml (the datatypes)');
  let share = 'reused';
  if (!existing) {
    const desc = `Stage: Development, Deploy: ${s.userId} [[]] ${description.replace(/,/g, ' ')}, Project: ${project_name}, ProjectHref: ${href}`;
    const body = `<webshare name='${escXml(slug)}' visibility='private' access='read' description='${escXml(desc)}'><folder name='${escXml(slug)}' id='${projectId}'/></webshare>`;
    await need(await call(s, 'POST', `/users/${s.userId}/webshares/`, { body, headers: { 'Content-Type': 'application/xml' } }), 'creating the webshare');
    if (!(await listShares(s)).some((x) => x.name === slug && x.serves === href)) throw new ToolError(`the webshare ${slug} was created but does not read back as serving ${href}`);
    share = 'created';
  }
  const url = shareUrl(s, slug);
  let pipeline;
  try { pipeline = await writePipeline(s, { projectName: project_name, slug, url }); }
  catch (e) { pipeline = `not written (${e.message}). The address works; the console's Deployments view will not list it.`; }
  return {
    tenant: s.tenant, url, stage: 'Development, private: anyone with the address and a sign-in to the account', project_href: href, share, wrote, pipeline,
    next: 'verify_deployment. Promotion to Shared, Staging and Production, the login page and a domain are console steps at '
      + `https://${s.tenant}.db.cloudbackend.com/ (the user signs in there).`,
  };
}

async function verifyDeployment({ project_name, deployment_name, tenant, path, sample = 20, paths }) {
  checkProjectName(project_name);
  const slug = slugFor(project_name, deployment_name);
  const s = readSession(tenant);
  const url = shareUrl(s, slug), href = `home://Applications/${project_name}`;
  const served = async (rel) => {
    try {
      const r = await fetch(`${url}/${rel.split('/').map(encodeURIComponent).join('/')}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      if (r.status >= 300 && r.status < 400) { await drain(r); return { status: r.status }; }
      return { status: r.status, bytes: Buffer.from(await r.arrayBuffer()) };
    } catch (e) { return { status: 0, error: e.cause?.code || e.message }; }
  };
  const home = await served('');
  const bootHtml = home.bytes ? home.bytes.toString('utf8') : '';
  const fallbackHash = home.bytes ? sha256(home.bytes) : '';
  const expected = new Map();
  let source;
  if (path) {
    const pkg = packageAt(path);
    for (const f of pkg.files) expected.set(f.rel, async () => readFileSync(f.abs));
    source = `the local folder ${pkg.root}`;
  } else {
    const apps = await lookupFolder(s, s.homeId, 'Applications');
    const projectId = apps ? await lookupFolder(s, apps, project_name) : '';
    if (!projectId) throw new ToolError(`home://Applications/${project_name} does not exist on ${s.tenant}.`);
    const add = (prefix, items) => { for (const d of items) if (!WRITTEN_BY_DEPLOY.has(prefix + d.name)) expected.set(prefix + d.name, async () => Buffer.from(await (await call(s, 'GET', d.href)).arrayBuffer())); };
    add('', (await listDocuments(s, projectId)).items);
    for (const sub of await listSubfolders(s, projectId)) add(`${sub.name}/`, (await listDocuments(s, sub.id)).items);
    source = 'the stored copy on the tenant';
  }
  const order = ['index.xml', ...[...expected.keys()].filter((k) => k !== 'index.xml' && !WRITTEN_BY_DEPLOY.has(k)).sort()];
  const chosen = (Array.isArray(paths) && paths.length ? paths : order).slice(0, Math.max(1, Math.min(Number(sample) || 20, 200)));
  const mismatches = [];
  let manifestText = '';
  for (const rel of chosen) {
    if (!expected.has(rel)) { mismatches.push({ path: rel, problem: `not in ${source}` }); continue; }
    const want = await expected.get(rel)();
    if (rel === 'index.xml') manifestText = want.toString('utf8');
    const got = await served(rel), gotHash = got.bytes ? sha256(got.bytes) : '';
    if (gotHash !== sha256(want)) {
      mismatches.push({ path: rel, status: got.status, expected_sha256: sha256(want), served_sha256: gotHash || null,
        served_is_fallback_page: !!gotHash && gotHash === fallbackHash });
    }
  }
  const share = (await listShares(s)).find((x) => x.name === slug);
  const llms = await served('llms.txt');
  const llmsHash = llms.bytes ? sha256(llms.bytes) : '';
  const indexXmlMatch = chosen.includes('index.xml') && !mismatches.some((m) => m.path === 'index.xml');
  const boots = /\/xios\/boot\.js/.test(bootHtml);
  const live = home.status === 200 && boots && indexXmlMatch && !mismatches.length && !!share && share.serves === href;
  return {
    tenant: s.tenant, url, compared_with: source, reachable: home.status === 200, boots_runtime: boots,
    index_xml_match: indexXmlMatch, checked: chosen.length, mismatches,
    share: share ? { name: share.name, serves: share.serves, stage: share.stage, bound: share.serves === href } : null,
    llms_txt: llms.status === 200 && llmsHash ? (llmsHash === fallbackHash ? 'not served (the boot page answered)' : 'served') : 'not served',
    manifest_login: /<login\b/.test(manifestText) ? 'the manifest declares a login' : 'no login in the manifest: a private webshare is not authentication',
    verdict: live ? 'live: the served files are the ones compared' : 'not live as expected: see mismatches, reachable, boots_runtime and share',
    checked_at: new Date().toISOString(),
  };
}

async function listProjects({ tenant }) {
  const s = readSession(tenant);
  const projects = {};
  for (const [drive, root] of [['home', s.homeId], ['tenant', s.tenantFolderId]]) {
    try {
      const apps = root ? await lookupFolder(s, root, 'Applications') : '';
      projects[`${drive}://Applications`] = apps ? (await listSubfolders(s, apps)).map((c) => c.name).sort() : [];
    } catch (e) { projects[`${drive}://Applications`] = `not readable: ${e.message}`; }
  }
  const deployments = (await listShares(s)).map((x) => ({ name: x.name, serves: x.serves || null, stage: x.stage || null,
    ...(x.serves && x.serves.startsWith('home://') ? { url: shareUrl(s, x.name) } : {}) }));
  return { tenant: s.tenant, identity: s.username, projects, deployments };
}

// The sign-in page and its server on 127.0.0.1 ------------------------------------------------------------------------

const pending = new Map();                                     // state -> {tenant, url, created, promise, resolve}
let signin = null;                                             // {server, port, timer}
function signinPage(tenant, state, nonce) {
  const api = JSON.stringify(API), t = JSON.stringify(tenant), st = JSON.stringify(state);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in to CloudBackend</title>
<style nonce="${nonce}">
:root{color-scheme:light dark;--bg:#f5f6f8;--card:#ffffff;--fg:#14171c;--muted:#5b6472;--line:#d6dae1;--accent:#1f5fd1;--bad:#b42318;--good:#137333}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#181b21;--fg:#e8eaee;--muted:#9aa3b2;--line:#2c3139;--accent:#7aa7ff;--bad:#ff8a80;--good:#7bd88f}}
*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:16px;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{width:100%;max-width:420px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:28px}
h1{font-size:1.35rem;margin:0 0 4px}p{margin:0 0 16px}.muted{color:var(--muted)}.small{font-size:.85rem;color:var(--muted);margin:16px 0 0}
label{display:block;font-weight:600;font-size:.9rem;margin:0 0 12px}input{display:block;width:100%;margin-top:4px;padding:10px 12px;font:inherit;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:8px}
input:focus{outline:2px solid var(--accent);outline-offset:1px}button{width:100%;padding:11px;font:inherit;font-weight:600;color:#fff;background:var(--accent);border:0;border-radius:8px;cursor:pointer}
button[disabled]{opacity:.6;cursor:default}#m{min-height:1.5em;margin:12px 0 0}#m.bad{color:var(--bad)}#m.good{color:var(--good)}
</style></head><body><main>
<h1>Sign in to CloudBackend</h1>
<p class="muted">Account <strong id="t"></strong>. Claude asked to work in this account for you.</p>
<form id="f" autocomplete="on">
<label>E-mail or username<input id="u" name="username" autocomplete="username" required></label>
<label>Password<input id="p" name="password" type="password" autocomplete="current-password" required></label>
<label id="cl" hidden>Code from the e-mail<input id="c" name="code" inputmode="numeric" autocomplete="one-time-code"></label>
<button id="b">Sign in</button>
</form>
<p id="m" role="status" aria-live="polite"></p>
<p class="small">Your password goes from this page straight to CloudBackend. The CloudBackend plugin on this computer keeps only the session CloudBackend returns, in a file only you can read. Claude never sees your password: do not paste it into the chat. Ask Claude to sign out when you are done.</p>
</main>
<script nonce="${nonce}">
(function () {
  var API = ${api}, T = ${t}, S = ${st};
  var f = document.getElementById('f'), u = document.getElementById('u'), p = document.getElementById('p'), c = document.getElementById('c');
  var cl = document.getElementById('cl'), b = document.getElementById('b'), m = document.getElementById('m');
  document.getElementById('t').textContent = T;
  function say(text, kind) { m.textContent = text; m.className = kind || ''; }
  function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function b64(v) { var bytes = new TextEncoder().encode(v), s = ''; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    b.disabled = true; say('Signing in...');
    var code = c.value.trim();
    var body = '<login>' + (code ? '<code>' + esc(code) + '</code>' : '') + '<client>cloudbackend-plugin</client></login>';
    fetch(API + '/login/?tenant=' + encodeURIComponent(T), { method: 'POST', credentials: 'omit',
      headers: { 'Authorization': 'Basic ' + b64(u.value.trim() + ':' + p.value), 'Content-Type': 'text/xml', 'tenant': T }, body: body })
    .then(function (r) { return r.text().then(function (text) { return { r: r, text: text }; }); })
    .then(function (x) {
      if (x.r.status === 401 && /mfa code/i.test(x.text) && !/invalid mfa/i.test(x.text)) {
        cl.hidden = false; c.focus(); b.disabled = false;
        say('CloudBackend e-mailed you a code. Enter it and press Sign in again.'); return;
      }
      if (!x.r.ok) {
        b.disabled = false;
        say(x.r.status === 401 ? (/invalid mfa/i.test(x.text) ? 'That code did not work. Check the e-mail and try again.' : 'CloudBackend did not accept that username and password.')
          : x.r.status === 403 ? 'CloudBackend says this account is suspended or not activated.'
          : x.r.status === 400 ? 'CloudBackend does not know the account ' + T + '.' : 'CloudBackend answered ' + x.r.status + '. Try again.', 'bad');
        return;
      }
      p.value = ''; c.value = '';
      return fetch('/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: S, xml: x.text }) })
        .then(function (h) { return h.json().catch(function () { return {}; }).then(function (j) { return { h: h, j: j }; }); })
        .then(function (y) {
          if (!y.h.ok) { b.disabled = false; say(y.j.error || 'The plugin could not keep the session. Ask Claude for a new sign-in page.', 'bad'); return; }
          f.hidden = true; say('Signed in as ' + y.j.name + '. Close this tab and go back to Claude.', 'good');
        });
    })
    .catch(function () { b.disabled = false; say('Could not reach CloudBackend. Check the connection and try again.', 'bad'); });
  });
  u.focus();
})();
</script>
</body></html>
`;
}
function signinNotice(status, text) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CloudBackend sign-in</title></head>`
    + `<body style="font:16px/1.5 system-ui,sans-serif;padding:24px;max-width:36em;margin:auto"><h1 style="font-size:1.3rem">CloudBackend sign-in</h1><p>${escXml(text)}</p></body></html>`;
}
async function readBody(req, limit = 1 << 20) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new ToolError('too large'); chunks.push(chunk); }
  return Buffer.concat(chunks).toString('utf8');
}
async function handleSignin(req, res) {
  const origin = `http://127.0.0.1:${signin.port}`;
  const json = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
  if (req.headers.host !== `127.0.0.1:${signin.port}`) { res.writeHead(421); return res.end(); }
  const u = new URL(req.url, origin);
  if (req.method === 'GET' && u.pathname === '/signin') {
    const state = u.searchParams.get('state') || '';
    const p = pending.get(state);
    if (!p || Date.now() - p.created > SIGNIN_TTL_MS) {
      res.writeHead(410, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(signinNotice(410, 'This sign-in link has expired or was already used. Ask Claude for a new one.'));
    }
    const nonce = randomBytes(16).toString('base64');
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self' ${new URL(API).origin}; form-action 'none'; frame-ancestors 'none'; base-uri 'none'`,
    });
    return res.end(signinPage(p.tenant, state, nonce));
  }
  if (req.method === 'POST' && u.pathname === '/session') {
    if (req.headers.origin !== origin) return json(403, { error: 'Refused: this page is not the plugin\'s sign-in page.' });
    let msg;
    try { msg = JSON.parse(await readBody(req)); } catch { return json(400, { error: 'Unreadable request.' }); }
    const p = pending.get(String(msg?.state || ''));
    if (!p || Date.now() - p.created > SIGNIN_TTL_MS) return json(403, { error: 'This sign-in link has expired. Ask Claude for a new one.' });
    let login;
    try { login = parseLogin(msg.xml, p.tenant); } catch (e) { return json(400, { error: e.message }); }
    const alive = await sessionAlive({ token: login.token, tenant: p.tenant });
    if (alive !== 200) return json(400, { error: `CloudBackend did not confirm the session (HTTP ${alive}). Try again.` });
    storeSession(login.record, login.token);
    pending.delete(msg.state);
    p.resolve(login.record);
    return json(200, { ok: true, name: login.record.name, tenant: login.record.tenant });
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}
function keepSigninOpen() {
  clearTimeout(signin.timer);
  signin.timer = setTimeout(() => { signin.server.close(); signin = null; pending.clear(); }, SIGNIN_TTL_MS);
  signin.timer.unref();
}
async function ensureSigninServer() {
  if (signin) { keepSigninOpen(); return signin; }
  const server = createServer((req, res) => {
    handleSignin(req, res).catch(() => { try { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('error'); } catch { /* the answer was already sent */ } });
  });
  await new Promise((ok, bad) => { server.once('error', bad); server.listen(0, '127.0.0.1', ok); });
  server.unref();
  signin = { server, port: server.address().port };
  keepSigninOpen();
  return signin;
}
function openInBrowser(url) {
  const [cmd, args] = process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : ['xdg-open', [url]];
  try { const child = spawn(cmd, args, { detached: true, stdio: 'ignore' }); child.on('error', () => {}); child.unref(); return true; } catch { return false; }
}

async function tenantSignin({ tenant, open_browser = true }) {
  if (!tenant || !TENANT.test(tenant)) throw new ToolError('tenant is the account name: lowercase letters and digits, as in the console address https://<tenant>.db.cloudbackend.com/.');
  const { port } = await ensureSigninServer();
  for (const [k, p] of pending) if (p.tenant === tenant) pending.delete(k);    // one open link per account
  const state = randomBytes(16).toString('hex');
  const url = `http://127.0.0.1:${port}/signin?state=${state}`;
  let resolveFn;
  const promise = new Promise((r) => { resolveFn = r; });
  pending.set(state, { tenant, url, created: Date.now(), promise, resolve: resolveFn });
  const tried = open_browser ? openInBrowser(url) : false;
  return {
    tenant, signin_page: url, browser: tried ? 'asked the system to open it' : 'not opened: open signin_page in your built-in browser if you have one, otherwise give the user the address',
    the_tab: 'Leave the page to the user: do not read, screenshot or click in it while they sign in; close it once tenant_status says they are signed in.',
    for_the_user: 'Open the sign-in page and sign in with your CloudBackend e-mail or username and password (and the code CloudBackend e-mails, if your account uses one). '
      + 'Your browser sends them straight to CloudBackend; the plugin keeps only the session, in a file only you can read. Never paste your password into the chat.',
    valid_for: '15 minutes, on this computer only',
    next: 'tenant_status with wait_seconds waits for the sign-in to finish',
  };
}

async function tenantStatus({ tenant, wait_seconds = 0 }) {
  checkTenant(tenant);
  const waiting = [...pending.values()].filter((p) => !tenant || p.tenant === tenant);
  if (Number(wait_seconds) > 0 && waiting.length && !readSession(tenant || waiting[0].tenant, { quiet: true })) {
    await Promise.race([...waiting.map((p) => p.promise), sleep(Math.min(Number(wait_seconds), 120) * 1000)]);
  }
  const s = readSession(tenant || (waiting.length === 1 ? waiting[0].tenant : undefined), { quiet: true });
  if (!s) {
    const open = [...pending.values()].filter((p) => !tenant || p.tenant === tenant);
    return open.length
      ? { signed_in: false, waiting_for: open.map((p) => ({ tenant: p.tenant, signin_page: p.url })), note: 'The sign-in page is open; the user has not finished signing in.' }
      : { signed_in: false, next: 'tenant_signin opens the sign-in page' };
  }
  const alive = await sessionAlive(s);
  if (alive === 401) { dropSession(s.tenant); return { signed_in: false, tenant: s.tenant, note: 'The session has ended. tenant_signin starts a new one.' }; }
  const realm = await realmExists(s.tenant);
  return {
    signed_in: true, tenant: s.tenant, identity: s.username, name: s.name,
    role: s.owner ? 'owner' : (s.roles.join(', ') || 'member'), signed_in_at: s.signedInAt,
    session: alive === 200 ? 'confirmed by CloudBackend' : alive ? `CloudBackend answered HTTP ${alive}` : 'CloudBackend did not answer',
    deploy_connector: realm === true ? 'can sign in: the account has its sign-in realm'
      : realm === false ? `cannot sign in yet: the account has no sign-in realm${isAdmin(s) ? '; enable_deploy_connector creates it (an account change: ask the user first)' : '; the owner or an administrator can create it with enable_deploy_connector'}`
      : 'unknown: the sign-in service did not answer',
    console: `https://${s.tenant}.db.cloudbackend.com/`,
  };
}

async function tenantSignout({ tenant }) {
  const s = readSession(tenant);
  let ended = 'not confirmed';
  try {
    const r = await fetch(`${API}/sessions`, { method: 'POST', headers: { Authorization: `WRAP access_token=${s.token}`, tenant: s.tenant }, signal: AbortSignal.timeout(15000) });
    await drain(r);
    ended = r.ok ? 'ended at CloudBackend' : `CloudBackend answered HTTP ${r.status}`;
  } catch { ended = 'CloudBackend did not answer'; }
  dropSession(s.tenant);
  return { tenant: s.tenant, signed_out: true, session: ended, stored_session: 'deleted from this computer' };
}

async function enableDeployConnector({ tenant }) {
  const s = readSession(tenant);
  if (await realmExists(s.tenant) === true) return { tenant: s.tenant, realm: 'already exists', deploy_connector: 'can sign in: in Claude Code, /mcp, pick cloudbackend-deploy and sign in on the page it opens' };
  if (!isAdmin(s)) throw new ToolError(`${s.username} is not the owner or an administrator of ${s.tenant}. Only they can create the account's sign-in realm; ask them to sign in with tenant_signin and run this once.`);
  const r = await call(s, 'POST', '/keycloak');
  const text = (await r.text().catch(() => '')).trim();
  if (!r.ok) throw new ToolError(`CloudBackend did not create the sign-in realm: HTTP ${r.status}${text ? ` (${text.slice(0, 160)})` : ''}`);
  let ready = false;
  for (let i = 0; i < 10 && !ready; i++) { ready = await realmExists(s.tenant) === true; if (!ready) await sleep(2000); }
  return {
    tenant: s.tenant, realm: ready ? 'created' : 'requested; not answering yet (check with tenant_status in a minute)',
    deploy_connector: ready ? 'can sign in now: in Claude Code, /mcp, pick cloudbackend-deploy and sign in on the account\'s own page' : 'not yet',
    note: 'The realm is part of the account from now on: every identity of the account signs in to the deploy connector through it.',
  };
}

const MAX_RESULT_CHARS = 60000;
const capText = (s) => (s.length <= MAX_RESULT_CHARS ? s : `${s.slice(0, MAX_RESULT_CHARS - 80)}\n\ntruncated at ${MAX_RESULT_CHARS} chars`);
const TENANT_ARG = { type: 'string', description: 'The account name, lowercase letters and digits, as in https://<tenant>.db.cloudbackend.com/. Optional when only one account is signed in.' };
const PROJECT_ARG = { type: 'string', description: 'The project folder under home://Applications/, e.g. "tasks".' };
const DEPLOYMENT_ARG = { type: 'string', description: 'The address part of the deployment, lowercase letters and digits, not beginning with xios. Defaults to project_name.' };
const ro = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
export const TOOLS = {
  tenant_signin: {
    title: 'Sign in to a CloudBackend account',
    description: 'Starts the sign-in to a CloudBackend PaaS account: a page on this computer (127.0.0.1, valid 15 minutes) where the user types their e-mail or username and password, and the e-mailed code when the account uses one. The browser sends them straight to CloudBackend; this server keeps only the session it returns, in a file only the user can read, and never returns it. The result carries the page\'s address for the user and whether the system browser was asked to open it. In the Claude desktop app, pass open_browser false and open the address in the built-in browser. No password passes through the conversation.',
    inputSchema: { type: 'object', properties: { tenant: { ...TENANT_ARG, description: 'The account name, lowercase letters and digits, as in https://<tenant>.db.cloudbackend.com/.' }, open_browser: { type: 'boolean', default: true, description: 'Ask the system to open the page in the default browser. False when the client opens the address itself, as the Claude desktop app does in its built-in browser.' } }, required: ['tenant'] },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    run: tenantSignin,
  },
  tenant_status: {
    title: 'CloudBackend sign-in status',
    description: 'Whether an account is signed in on this computer, as which identity and role, whether CloudBackend still accepts the session, and whether the account has the sign-in realm the deploy connector needs. `wait_seconds` (up to 120) waits for a sign-in page that is still open. The session itself is never returned.',
    inputSchema: { type: 'object', properties: { tenant: TENANT_ARG, wait_seconds: { type: 'integer', minimum: 0, maximum: 120, default: 0, description: 'Seconds to wait for an open sign-in page to finish.' } } },
    annotations: ro,
    run: tenantStatus,
  },
  tenant_signout: {
    title: 'Sign out of a CloudBackend account',
    description: 'Ends the stored session at CloudBackend and deletes it from this computer.',
    inputSchema: { type: 'object', properties: { tenant: TENANT_ARG } },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    run: tenantSignout,
  },
  list_projects: {
    title: 'List projects and deployments',
    description: 'The project folders under home://Applications/ and tenant://Applications/ of the signed-in account, and the identity\'s webshares: each one\'s name, the project it serves, its stage and, for a home project, its address.',
    inputSchema: { type: 'object', properties: { tenant: TENANT_ARG } },
    annotations: ro,
    run: listProjects,
  },
  upload_project: {
    title: 'Upload a package folder',
    description: 'Copies a local XIOS/3 package folder (the one holding index.xml) to home://Applications/<project_name>/ on the signed-in account, folders included, four files at a time. lint_project (profile build) runs first and nothing is uploaded while it reports an error; `lint: false` skips it. Files with the same path are replaced; files on the tenant that are not in the folder are listed and left in place. Dot-files and node_modules are not uploaded.',
    inputSchema: { type: 'object', properties: { path: { type: 'string', description: 'The local package folder, absolute or relative to the working directory; app/ in the workflow layout.' }, project_name: PROJECT_ARG, tenant: TENANT_ARG, lint: { type: 'boolean', default: true, description: 'Run lint_project (profile build) first and refuse on an error.' } }, required: ['path', 'project_name'] },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    run: uploadProject,
  },
  deploy: {
    title: 'Deploy a project to Development',
    description: 'Publishes home://Applications/<project_name> as a private Development deployment at https://<tenant>-<identity>-<deployment_name>.cloudbackend.cloud: writes the boot page index.html (unless keep_index_html and one exists) and .types.xml into the project, creates the webshare or reuses the one that already serves this project, and writes the console\'s pipeline record when there is none. Refuses an address that serves another project. Promotion beyond Development is a console step.',
    inputSchema: { type: 'object', properties: { project_name: PROJECT_ARG, deployment_name: DEPLOYMENT_ARG, tenant: TENANT_ARG, keep_index_html: { type: 'boolean', default: false, description: 'Keep an index.html the project already has instead of writing the boot page.' } }, required: ['project_name'] },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    run: deploy,
  },
  verify_deployment: {
    title: 'Verify a deployment by its served files',
    description: 'Fetches a deployment\'s files anonymously and compares their bytes with the local package folder (`path`) or, without it, with the stored copy on the tenant: index.xml first, then up to `sample` files, or exactly `paths`. An unknown path on a webshare answers 200 with the boot page, so each mismatch says whether the boot page was served instead. Also reports whether the boot page loads the runtime, which webshare serves the project, whether llms.txt is served, and whether the manifest declares a login.',
    inputSchema: { type: 'object', properties: { project_name: PROJECT_ARG, deployment_name: DEPLOYMENT_ARG, tenant: TENANT_ARG, path: { type: 'string', description: 'The local package folder to compare with; without it, the stored copy on the tenant.' }, sample: { type: 'integer', minimum: 1, maximum: 200, default: 20, description: 'How many files to compare, index.xml first.' }, paths: { type: 'array', items: { type: 'string' }, description: 'Exactly these package paths instead of a sample.' } }, required: ['project_name'] },
    annotations: ro,
    run: verifyDeployment,
  },
  enable_deploy_connector: {
    title: 'Create the account\'s sign-in realm',
    description: 'Asks CloudBackend to create the account\'s sign-in realm (POST /keycloak), which the deploy connector (cloudbackend-deploy) signs in through. Only the owner or an administrator may; the realm stays part of the account. Answers at once when the realm already exists.',
    inputSchema: { type: 'object', properties: { tenant: TENANT_ARG } },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    run: enableDeployConnector,
  },
};

// ---- MCP over stdio ---------------------------------------------------------------------------------------------------

const INSTRUCTIONS = 'The plugin\'s own route to a CloudBackend PaaS account, for when the deploy connector cannot sign in. tenant_signin gives the user a sign-in page on this computer: the password goes from their browser to CloudBackend and never through the conversation; never ask for it. Then upload_project (a local package folder, linted first), deploy (Development) and verify_deployment (served bytes). enable_deploy_connector creates the account\'s sign-in realm: an account change only the owner may make, so ask first.';
const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
export async function handle(req) {
  const { id, method, params = {} } = req;
  if (id === undefined) return;
  try {
    if (method === 'initialize') return send({ id, result: { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} },
      serverInfo: { name: SERVER_NAME, title: 'CloudBackend PaaS account', version: VERSION }, instructions: INSTRUCTIONS } });
    if (method === 'ping') return send({ id, result: {} });
    if (method === 'tools/list') return send({ id, result: { tools: Object.entries(TOOLS).map(([name, t]) => ({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: t.annotations })) } });
    if (method === 'tools/call') {
      const tool = TOOLS[params.name];
      if (!tool) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      try {
        const result = await tool.run(params.arguments || {});
        return send({ id, result: { content: [{ type: 'text', text: capText(JSON.stringify(result, null, 2)) }] } });
      } catch (e) {
        const text = e instanceof ToolError ? e.message : `${params.name} failed: ${e.message}`;
        return send({ id, result: { isError: true, content: [{ type: 'text', text }] } });
      }
    }
    send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  } catch (e) { send({ id, error: { code: -32603, message: e.message } }); }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createInterface({ input: process.stdin }).on('line', (line) => {
    if (!line.trim()) return;
    let req;
    try { req = JSON.parse(line); } catch { return send({ id: null, error: { code: -32700, message: 'Parse error' } }); }
    handle(req);
  });
}
