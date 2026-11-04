// Shared by the scripts in this directory: where things are, the servers and their URLs, the version shape, sha256, a
// sorted file walk, and a reader and a writer for zip files. Node's built-ins only; nothing to install.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import zlib from 'node:zlib';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PLUGIN_NAME = 'cloudbackend';
export const MARKETPLACE_NAME = 'cloudbackend';
export const PLUGIN_DIR = path.join(ROOT, 'plugins', PLUGIN_NAME);
export const MANIFEST = path.join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');
export const MARKETPLACE = path.join(ROOT, '.claude-plugin', 'marketplace.json');
export const DIST = path.join(ROOT, 'dist');

// The documentation hub, checked out next to this repo (or CBE_DOCS_HUB). Only its BUILT outputs are read here:
// public/public/skills/ (the .skill zips and index.json), public/portal.json (the portal's address, which is where
// the plugin's marketplace and zip are served), public/dist/mcpb/cloudbackend-docs/server/ (the staged documentation
// server), <corpus>/toc.json, and the publication guard it shares with its own builds; plus each skill's
// _skills/<skill>/evals/evals.json, the one read under its sources (gen-evals.mjs). It writes the hub's
// public/plugin.json and public/public/plugin/ (the release copies the portal serves). The build server is authored
// in this repository (plugins/cloudbackend/servers/build/), a Node port of the deploy server's Python build tools.
export const HUB = path.resolve(process.env.CBE_DOCS_HUB || path.join(ROOT, '..', 'estate-docs'));
export const SKILLS_INDEX = path.join(HUB, 'public', 'public', 'skills', 'index.json');
export const PORTAL_FILE = path.join(HUB, 'public', 'portal.json');
export const DOCS_SERVER_SRC = path.join(HUB, 'public', 'dist', 'mcpb', 'cloudbackend-docs', 'server');
export const HUB_PLUGIN_DIR = path.join(HUB, 'public', 'public', 'plugin');

// CloudBackend's live deploy server. It is CloudBackend's, per tenant, and this is the ONLY thing it is used for:
// the deploy connector's URL form. The documentation and build servers run inside the plugin.
export const HOST = 'https://mcp.cloudbackend.com';
export const DEPLOY_URL_FORM = `${HOST}/mcp/<tenant>`;
export const TENANT_CONFIG_KEY = 'cbe_tenant';
export const TENANT_PATTERN = '[a-z0-9]+';

// The private GitHub repository that mirrors this one and serves as the testers' marketplace: plugin.json's
// `repository` when it is set, else the `mirror` remote's GitHub URL (the remote IS the marketplace testers add),
// else this placeholder in every generated install line until Robin names it.
export const GITHUB_REPO = '<org>/claude-plugin';
export const GITHUB_BRANCH_TESTERS = 'main';
export const GITHUB_BRANCH_WORK = 'dev';

// The three servers the plugin's .mcp.json declares, one description each; gen-clients.mjs writes .mcp.json,
// the client configs and the hub's plugin.json from this table, so no copy can disagree with another. The two local
// ones run with node and nothing else: a tester needs Claude Code and no other install.
export const SERVERS = [
  {key: 'docs', name: 'cloudbackend-docs', kind: 'local', runtime: 'node', tools: 13,
   entry: 'servers/docs/index.mjs',
   what: 'documentation lookups, read-only: topics, REST operation cards with XML bodies, SDK method cards, the nine XIOS/3 reference lookups (components, operations, functions, methods, events, actions, concepts, lists, icons); reads the developer portal, needs no sign-in'},
  {key: 'build', name: 'cloudbackend-build', kind: 'local', runtime: 'node', tools: 2,
   entry: 'servers/build/index.mjs', test: 'servers/build/test.mjs',
   what: 'build tools for a XIOS/3 package, no tenant needed: lint_project (the tenant grammar G01-G20 before an upload; schema validation happens at upload) and benchmark_project (the measured block of a benchmark report)'},
  {key: 'deploy', name: 'cloudbackend-deploy', kind: 'remote', url_form: DEPLOY_URL_FORM,
   what: 'CloudBackend\'s live per-tenant deploy server (OAuth sign-in at your tenant): list_projects, upload_project, deploy, verify_deployment and the rest'},
];
export const serverByKey = key => SERVERS.find(s => s.key === key);

export const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
export function writeText(file, data) { mkdirSync(path.dirname(file), {recursive: true}); writeFileSync(file, data); }
export const writeJson = (file, value) => writeText(file, JSON.stringify(value, null, 2) + '\n');
export const sha256 = data => createHash('sha256').update(data).digest('hex');
export const currentVersion = () => readJson(MANIFEST).version;
export function fail(message) { console.error(message); process.exit(1); }

/** The developer portal's address (the hub's public/portal.json url), without a trailing slash. */
export function portalUrl() {
  if (!existsSync(PORTAL_FILE)) fail(`the hub's public/portal.json is not at ${PORTAL_FILE} (set CBE_DOCS_HUB): the plugin is served from the portal, so its address is needed`);
  const url = readJson(PORTAL_FILE).url;
  if (!url || !/^https:\/\//.test(url)) fail(`public/portal.json has no https url`);
  return url.replace(/\/$/, '');
}
/** Where the portal serves the plugin's marketplace, index and zip: <portal>/plugin. */
export const pluginBaseUrl = () => `${portalUrl()}/plugin`;
export const marketplaceUrl = () => `${pluginBaseUrl()}/marketplace.json`;
export const indexUrl = () => `${pluginBaseUrl()}/index.json`;
export const zipName = version => `${PLUGIN_NAME}-${version}.zip`;
export const zipUrl = version => `${pluginBaseUrl()}/${zipName(version)}`;
/** The GitHub repository as owner/name: plugin.json's `repository` (a string or {url}) when set, else the `mirror`
 *  remote's GitHub URL, else the placeholder. */
export function githubRepo() {
  const parse = raw => { const m = /github\.com[/:]([^/\s]+\/[^/\s.]+)/.exec(raw || '') || /^([\w.-]+\/[\w.-]+)$/.exec(raw || ''); return m ? m[1] : null; };
  const r = readJson(MANIFEST).repository;
  const fromManifest = parse(typeof r === 'string' ? r : r && r.url ? r.url : '');
  if (fromManifest) return fromManifest;
  let mirror = '';
  try { mirror = execFileSync('git', ['-C', ROOT, 'remote', 'get-url', 'mirror'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim(); } catch { /* no mirror yet */ }
  return parse(mirror) || GITHUB_REPO;
}

// Versions read YYYY.MDD.N: the year, the month without a leading zero joined to the two-digit day, and a counter
// per day from 0. 2026-11-04 → 2026.1104.0; a second release that day → 2026.1104.1; 2027-03-05 → 2027.305.0.
// Three numeric parts, so semver-shaped, and later dates sort later.
export const VERSION = /^(\d{4})\.(\d{1,2})(\d{2})\.(\d+)$/;
export function parseVersion(v) {
  const m = VERSION.exec(String(v));
  return m ? {year: +m[1], month: +m[2], day: +m[3], n: +m[4], base: `${m[1]}.${m[2]}${m[3]}`} : null;
}
export function compareVersions(a, b) {
  const x = parseVersion(a), y = parseVersion(b);
  return (x.year - y.year) || (x.month - y.month) || (x.day - y.day) || (x.n - y.n);
}
const two = n => String(n).padStart(2, '0');
export const todayBase = (d = new Date()) => `${d.getFullYear()}.${d.getMonth() + 1}${two(d.getDate())}`;
export const isoDate = (d = new Date()) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;

// Finder and SMB droppings are never content.
const NOISE = name => name === '.DS_Store' || name.startsWith('._') || name.startsWith('.smbdelete');
// Build caches and installed environments are never content either: nothing here ships or compares them.
export const CACHE = name => name === '__pycache__' || name === '.venv' || name === 'venv' || name === 'node_modules' || name.endsWith('.pyc') || name === '.pytest_cache' || name === '.mypy_cache' || name === '.ruff_cache' || name.endsWith('.egg-info');
/** Every file under dir as sorted paths relative to it; skip(rel) prunes a file or a whole directory. */
export function listFiles(dir, {skip = () => false} = {}, rel = '') {
  return readdirSync(path.join(dir, rel)).sort().flatMap(name => {
    if (NOISE(name) || CACHE(name)) return [];
    const child = rel ? `${rel}/${name}` : name;
    if (skip(child)) return [];
    return statSync(path.join(dir, child)).isDirectory() ? listFiles(dir, {skip}, child) : [child];
  });
}

// ---- zip ------------------------------------------------------------------------------------------------------
const LOCAL = 0x04034b50, CENTRAL = 0x02014b50, END = 0x06054b50;
const DOS_DATE = (1 << 5) | 1;                               // 1980-01-01 00:00: the same tree gives the same bytes
const STORED = /\.(png|jpe?g|gif|webp|woff2?|skill|zip|gz)$/i;

/** The entries of a zip as [{name, data}]: directories dropped, every entry size- and CRC-checked. */
export function unzip(buf) {
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === END) { end = i; break; }
  if (end < 0) throw new Error('not a zip file (no end-of-central-directory record)');
  const count = buf.readUInt16LE(end + 10);
  let off = buf.readUInt32LE(end + 16);
  const entries = [];
  for (let k = 0; k < count; k++) {
    if (buf.readUInt32LE(off) !== CENTRAL) throw new Error('corrupt zip (central directory)');
    const method = buf.readUInt16LE(off + 10), crc = buf.readUInt32LE(off + 16);
    const csize = buf.readUInt32LE(off + 20), usize = buf.readUInt32LE(off + 24);
    const nlen = buf.readUInt16LE(off + 28), xlen = buf.readUInt16LE(off + 30), clen = buf.readUInt16LE(off + 32);
    const local = buf.readUInt32LE(off + 42);
    const name = buf.toString('utf8', off + 46, off + 46 + nlen);
    off += 46 + nlen + xlen + clen;
    if (name.endsWith('/')) continue;
    if (buf.readUInt32LE(local) !== LOCAL) throw new Error(`corrupt zip (local header of ${name})`);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const body = buf.subarray(start, start + csize);
    let data;
    if (method === 0) data = body;
    else if (method === 8) data = zlib.inflateRawSync(body);
    else throw new Error(`${name}: compression method ${method} is not supported`);
    if (data.length !== usize || zlib.crc32(data) !== crc) throw new Error(`${name}: corrupt entry (size or CRC)`);
    entries.push({name, data});
  }
  return entries;
}

/** A deterministic zip of [{name, data, mode?}]: names sorted, fixed timestamps, no extra fields; mode (a Unix file
 *  mode such as 0o755) goes into the external attributes so a shell script unpacks executable. */
export function zipBuffer(entries) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const {name, data, mode = 0o644} of [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const nameBytes = Buffer.from(name, 'utf8');
    const store = STORED.test(name);
    const body = store ? data : zlib.deflateRawSync(data, {level: 9});
    const crc = zlib.crc32(data);
    const header = central => {
      const b = Buffer.alloc(central ? 46 : 30);
      let o = 0;
      b.writeUInt32LE(central ? CENTRAL : LOCAL, o); o += 4;
      if (central) { b.writeUInt16LE((3 << 8) | 20, o); o += 2; }   // version made by: Unix, so the mode below counts
      b.writeUInt16LE(20, o); o += 2;                        // version needed
      b.writeUInt16LE(0x0800, o); o += 2;                    // UTF-8 names
      b.writeUInt16LE(store ? 0 : 8, o); o += 2;
      b.writeUInt16LE(0, o); o += 2;                         // time
      b.writeUInt16LE(DOS_DATE, o); o += 2;
      b.writeUInt32LE(crc, o); o += 4;
      b.writeUInt32LE(body.length, o); o += 4;
      b.writeUInt32LE(data.length, o); o += 4;
      b.writeUInt16LE(nameBytes.length, o); o += 2;
      b.writeUInt16LE(0, o); o += 2;                         // extra length
      if (central) {
        b.writeUInt16LE(0, o); o += 2;                       // comment length
        b.writeUInt16LE(0, o); o += 2;                       // disk
        b.writeUInt16LE(0, o); o += 2;                       // internal attributes
        b.writeUInt32LE(((mode & 0o7777) | 0o100000) >>> 0 << 16 >>> 0, o); o += 4;   // external attributes: the Unix mode
        b.writeUInt32LE(offset, o); o += 4;
      }
      return b;
    };
    const local = Buffer.concat([header(false), nameBytes, body]);
    locals.push(local);
    centrals.push(Buffer.concat([header(true), nameBytes]));
    offset += local.length;
  }
  const central = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(END, 0);
  end.writeUInt16LE(centrals.length, 8);
  end.writeUInt16LE(centrals.length, 10);
  end.writeUInt32LE(central.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, central, end]);
}
