#!/usr/bin/env node
// live-tenant-check.mjs: the tenant server against a real account, end to end, the way a session uses it, minus the
// browser. Run on big (the machine that holds the developer portal's deploy credentials):
//
//   node scripts/live-tenant-check.mjs [--project pluginprobe] [--keep-session]
//
// The one thing a user does in the browser, the login, is done here once with ~/.xiosdeploy-creds (USER/PASS/TENANT,
// or XIOSDEPLOY_CREDS_FILE): the password goes to POST /login and nowhere else, and only the session it returns is
// stored, in a temporary folder only this user can read. Then, over stdio like Claude Code: tenant_status,
// list_projects, upload_project (a small probe package), deploy, verify_deployment, tenant_signout. It deploys the probe
// to home://Applications/<project> as a private Development deployment; it never deletes anything. Not shipped.
import {spawn} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {homedir, tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {PLUGIN_DIR} from './lib.mjs';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const project = opt('project', 'pluginprobe');
const credsPath = process.env.XIOSDEPLOY_CREDS_FILE || path.join(homedir(), '.xiosdeploy-creds');
const creds = Object.fromEntries(readFileSync(credsPath, 'utf8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
if (!creds.USER || !creds.PASS || !creds.TENANT) { console.error(`${credsPath}: USER, PASS and TENANT are needed`); process.exit(2); }
const tenant = creds.TENANT.toLowerCase();

const sessions = mkdtempSync(path.join(tmpdir(), 'cbe-live-sessions-'));
process.env.CBE_SESSION_DIR = sessions;
const entry = path.join(PLUGIN_DIR, 'servers', 'tenant', 'index.mjs');
const T = await import(pathToFileURL(entry).href);
const login = await fetch(`${T.API}/login/?tenant=${encodeURIComponent(tenant)}`, {method: 'POST',
  headers: {Authorization: 'Basic ' + Buffer.from(`${creds.USER}:${creds.PASS}`).toString('base64'), 'Content-Type': 'text/xml', tenant},
  body: '<login><client>cloudbackend-plugin-check</client></login>'});
const xml = await login.text();
if (!login.ok) { console.error(`login: HTTP ${login.status} ${xml.slice(0, 120)}`); process.exit(1); }
const {record, token} = T.parseLogin(xml, tenant);
T.storeSession(record, token);
console.log(`signed in once (as the browser page would): ${record.username} on ${record.tenant}, ${record.owner ? 'owner' : record.roles.join(', ')}`);

const pkg = mkdtempSync(path.join(tmpdir(), 'cbe-live-pkg-'));
mkdirSync(path.join(pkg, 'views'));
writeFileSync(path.join(pkg, 'index.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<application xmlns:xlink="http://www.w3.org/1999/xlink" name="${project}" icon="icon://check" instances="1">
  <settings/>
  <about version="1.0"><description>Plugin probe</description></about>
  <view name="Main" xlink:actuate="onLoad" xlink:href="views/main.xml"/>
  <process name="probe">
    <trigger view="Main" event="Loaded" step="shown"/>
    <step id="shown"/>
  </process>
</application>
`);
writeFileSync(path.join(pkg, 'views', 'main.xml'), `<view name="Main" version="1" title="Plugin probe">
  <panel name="root" type="rows" width="100%" height="100%">
    <label name="hello" text="Deployed by the CloudBackend plugin's tenant server on ${new Date().toISOString().slice(0, 10)}."/>
  </panel>
</view>
`);

const child = spawn(process.execPath, [entry], {env: {...process.env, CBE_SESSION_DIR: sessions}, stdio: ['pipe', 'pipe', 'inherit']});
let buf = '', id = 0;
const waiting = new Map();
child.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1); waiting.get(m.id)?.(m); } });
const rpc = (method, params) => new Promise(r => { const n = ++id; waiting.set(n, r); child.stdin.write(JSON.stringify({jsonrpc: '2.0', id: n, method, params}) + '\n'); });
const tool = async (name, a) => {
  const m = await rpc('tools/call', {name, arguments: a});
  const text = m.result.content[0].text;
  if (text.includes(token)) { console.error(`${name}: the session token appeared in a result`); process.exit(1); }
  return {error: !!m.result.isError, text, json: m.result.isError ? null : JSON.parse(text)};
};
await rpc('initialize', {});
let failed = 0;
const step = async (label, name, a, check) => {
  const r = await tool(name, a);
  const ok = !r.error && check(r.json);
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  console.log(r.text.split('\n').map(l => `    ${l}`).join('\n'));
  return r.json;
};
await step('tenant_status: signed in, session confirmed', 'tenant_status', {}, j => j.signed_in && j.session === 'confirmed by CloudBackend');
await step('list_projects', 'list_projects', {}, j => Array.isArray(j.projects['home://Applications']));
await step(`upload_project: the probe package to home://Applications/${project}`, 'upload_project', {path: pkg, project_name: project}, j => j.uploaded === 2);
const d = await step('deploy: Development', 'deploy', {project_name: project}, j => /^https:\/\//.test(j.url));
await step('verify_deployment: served bytes equal the package', 'verify_deployment', {project_name: project, path: pkg}, j => j.verdict.startsWith('live'));
if (!args.includes('--keep-session')) await step('tenant_signout', 'tenant_signout', {}, j => j.signed_out);
child.kill();
rmSync(pkg, {recursive: true, force: true});
if (!args.includes('--keep-session')) rmSync(sessions, {recursive: true, force: true});
console.log(`${failed ? `${failed} step(s) failed` : 'all steps passed'}${d?.url ? `; the probe: ${d.url}` : ''}`);
process.exit(failed ? 1 : 0);
