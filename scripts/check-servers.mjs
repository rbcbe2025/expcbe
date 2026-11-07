#!/usr/bin/env node
// check-servers.mjs [--deep] — do the plugin's servers answer, with the tools the plugin promises?
//   · cloudbackend-docs: `node plugins/cloudbackend/servers/docs/index.mjs` over stdio (initialize, tools/list); the
//     tool count against lib.mjs's table, every tool titled and annotated. --deep also calls xios3_lookup(component, "grid"),
//     which reads the developer portal, so the answer proves the portal address baked into the server.
//   · cloudbackend-build: `node plugins/cloudbackend/servers/build/index.mjs` over stdio, the tool count against the
//     table; --deep also runs lint_project on a seeded trap package and expects the grammar's findings.
//   · cloudbackend-deploy: GET <host>/health, or the OAuth resource metadata of a tenant path on older builds
//     (CloudBackend's live server; a soft finding when unreachable, it is theirs).
// A local server present but not answering is a hard finding (exit 1).
import {spawn} from 'node:child_process';
import {existsSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {PLUGIN_DIR, HOST, SERVERS} from './lib.mjs';

const args = process.argv.slice(2);
const deep = args.includes('--deep');
const TIMEOUT = 60_000;

/** One stdio MCP session: newline-delimited JSON-RPC; resolves with the answers to each request in turn. */
async function stdio(command, argv, env, requests) {
  const child = spawn(command, argv, {env: {...process.env, ...env}, stdio: ['pipe', 'pipe', 'pipe']});
  const stderr = [];
  child.stderr.on('data', d => stderr.push(d.toString()));
  const answers = new Map();
  let buffer = '';
  const waiters = new Map();
  child.stdout.on('data', chunk => {
    buffer += chunk.toString();
    let nl;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim(); buffer = buffer.slice(nl + 1);
      if (!line) continue;
      let m; try { m = JSON.parse(line); } catch { continue; }
      if (m.id !== undefined && waiters.has(m.id)) { waiters.get(m.id)(m); waiters.delete(m.id); } else if (m.id !== undefined) answers.set(m.id, m);
    }
  });
  const exited = new Promise(r => child.on('exit', code => r(code)));
  const send = o => child.stdin.write(JSON.stringify(o) + '\n');
  const ask = (id, method, params) => new Promise((resolve, reject) => {
    if (answers.has(id)) return resolve(answers.get(id));
    const t = setTimeout(() => reject(new Error(`${method}: no answer in ${TIMEOUT / 1000} s${stderr.length ? ` (stderr: ${stderr.join('').trim().slice(0, 300)})` : ''}`)), TIMEOUT);
    waiters.set(id, m => { clearTimeout(t); m.error ? reject(new Error(`${method}: ${m.error.message || JSON.stringify(m.error)}`)) : resolve(m); });
    send({jsonrpc: '2.0', id, method, params});
  });
  const results = [];
  try {
    const init = await ask(1, 'initialize', {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'check-servers', version: '0'}});
    send({jsonrpc: '2.0', method: 'notifications/initialized'});
    results.push(init.result);
    let id = 2;
    for (const [method, params] of requests) results.push((await ask(id++, method, params)).result);
  } finally {
    child.stdin.end(); child.kill();
    await Promise.race([exited, new Promise(r => setTimeout(r, 2000))]);
  }
  return results;
}

const tooling = (name, info, tools, expected) => {
  const annotated = tools.filter(t => t.annotations && t.annotations.readOnlyHint !== undefined).length;
  const titled = tools.filter(t => t.title).length;
  const who = info && info.serverInfo ? `${info.serverInfo.name} ${info.serverInfo.version || ''}`.trim() : 'server unnamed';
  const lines = [`✓ ${name}: ${tools.length} tools (${who}); ${titled} titled, ${annotated} annotated`];
  for (const t of tools) lines.push(`    ${t.name}${t.title ? ` — ${t.title}` : ''}`);
  if (tools.length !== expected) { lines[0] = lines[0].replace('✓', '✗') + `; the plugin promises ${expected}`; return {lines, ok: false}; }
  return {lines, ok: true};
};

let hard = 0, soft = 0;
const docs = SERVERS.find(s => s.key === 'docs'), build = SERVERS.find(s => s.key === 'build'), deploy = SERVERS.find(s => s.key === 'deploy');

// ---- docs ----------------------------------------------------------------------------------------------------------
const docsEntry = path.join(PLUGIN_DIR, docs.entry);
if (!existsSync(docsEntry)) { hard++; console.log(`✗ ${docs.name}: ${docs.entry} is not synced (node scripts/sync-servers.mjs)`); }
else {
  try {
    const calls = [['tools/list', {}]];
    if (deep) calls.push(['tools/call', {name: 'xios3_lookup', arguments: {kind: 'component', names: 'grid'}}]);
    const [info, list, call] = await stdio('node', [docsEntry], {}, calls);
    const r = tooling(docs.name, info, list.tools || [], docs.tools);
    console.log(r.lines.join('\n')); if (!r.ok) hard++;
    if (deep) {
      const text = (call.content || []).map(c => c.text || '').join('\n');
      if (call.isError || text.length < 200) { hard++; console.log(`✗ ${docs.name}: xios3_lookup(component, "grid") answered ${call.isError ? 'an error' : `${text.length} chars`}: ${text.slice(0, 200)}`); }
      else console.log(`✓ ${docs.name}: xios3_lookup(component, "grid") answered ${text.length} chars from the portal (${text.split('\n')[0].slice(0, 80)})`);
    }
  } catch (e) { hard++; console.log(`✗ ${docs.name}: ${e.message}`); }
}

// ---- build ---------------------------------------------------------------------------------------------------------
const buildEntry = path.join(PLUGIN_DIR, build.entry);
if (!existsSync(buildEntry)) { hard++; console.log(`\u2717 ${build.name}: ${build.entry} is missing`); }
else {
  try {
    const calls = [['tools/list', {}]];
    if (deep) calls.push(['tools/call', {name: 'lint_project', arguments: {profile: 'build', files: [{path: 'index.xml', content: '<application name="probe"><about version="1.0"/><process version="1"/></application>'}, {path: 'views/view.xml', content: '<view name="V"><select name="s"><option>a</option></select></view>'}]}}]);
    const [info, list, call] = await stdio('node', [buildEntry], {}, calls);
    const r = tooling(build.name, info, list.tools || [], build.tools);
    console.log(r.lines.join('\n')); if (!r.ok) hard++;
    if (deep) {
      const result = JSON.parse((call.content || [])[0].text);
      const rules = [...new Set(result.errors.map(e => e.rule))].sort().join(', ');
      if (call.isError || result.ok !== false) { hard++; console.log(`\u2717 ${build.name}: lint_project on the seeded traps answered ${call.isError ? 'an error' : 'ok'}`); }
      else console.log(`\u2713 ${build.name}: lint_project on the seeded traps finds ${rules} (grammar ${result.grammar_version})`);
    }
  } catch (e) { hard++; console.log(`\u2717 ${build.name}: ${e.message}`); }
}

// ---- tenant --------------------------------------------------------------------------------------------------------
// With an empty session folder, so nothing reaches an account: the tools are listed, status says not signed in, and
// (--deep) the sign-in page is served on 127.0.0.1 with its content security policy.
const tenant = SERVERS.find(s => s.key === 'tenant');
const tenantEntry = path.join(PLUGIN_DIR, tenant.entry);
if (!existsSync(tenantEntry)) { hard++; console.log(`\u2717 ${tenant.name}: ${tenant.entry} is missing`); }
else {
  try {
    const sessions = mkdtempSync(path.join(tmpdir(), 'cbe-check-sessions-'));
    const [info, list, status] = await stdio('node', [tenantEntry], {CBE_SESSION_DIR: sessions}, [['tools/list', {}], ['tools/call', {name: 'tenant_status', arguments: {}}]]);
    const r = tooling(tenant.name, info, list.tools || [], tenant.tools);
    console.log(r.lines.join('\n')); if (!r.ok) hard++;
    const st = JSON.parse((status.content || [])[0].text);
    if (st.signed_in !== false) { hard++; console.log(`\u2717 ${tenant.name}: tenant_status with no session answered ${JSON.stringify(st).slice(0, 120)}`); }
    else console.log(`\u2713 ${tenant.name}: tenant_status with no session says not signed in`);
    if (deep) {
      process.env.CBE_SESSION_DIR = sessions;
      const T = await import(pathToFileURL(tenantEntry).href);
      const s = await T.TOOLS.tenant_signin.run({tenant: 'probe', open_browser: false});
      const page = await fetch(s.signin_page);
      const html = await page.text(), csp = page.headers.get('content-security-policy') || '';
      if (page.status !== 200 || !/type="password"/.test(html) || !/script-src 'nonce-/.test(csp)) { hard++; console.log(`\u2717 ${tenant.name}: the sign-in page answered ${page.status}`); }
      else console.log(`\u2713 ${tenant.name}: the sign-in page is served on 127.0.0.1 with its policy (${new URL(s.signin_page).origin})`);
    }
  } catch (e) { hard++; console.log(`\u2717 ${tenant.name}: ${e.message}`); }
}

// ---- deploy --------------------------------------------------------------------------------------------------------
// CloudBackend's server answers /health on its newer builds; older ones answer the OAuth resource metadata of any
// tenant path with 200, which proves the host is up and signing in per tenant.
try {
  let res = await fetch(`${HOST}/health`, {signal: AbortSignal.timeout(20_000)});
  let via = '/health';
  if (res.status === 404) { via = '/.well-known/oauth-protected-resource/mcp/<tenant>'; res = await fetch(`${HOST}/.well-known/oauth-protected-resource/mcp/probe`, {signal: AbortSignal.timeout(20_000)}); }
  const body = (await res.text()).slice(0, 100).replace(/\s+/g, ' ');
  if (res.ok) console.log(`✓ ${deploy.name}: up, ${via} answers ${res.status} (per tenant: ${deploy.url_form})`);
  else { soft++; console.log(`· ${deploy.name}: ${via} HTTP ${res.status} ${body}`); }
} catch (e) { soft++; console.log(`· ${deploy.name}: ${HOST} unreachable (${e.message}); it is CloudBackend's server, not the plugin's`); }

console.log(`${hard} hard, ${soft} soft finding(s)`);
process.exit(hard ? 1 : 0);
