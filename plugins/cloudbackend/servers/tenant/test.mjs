// The tenant server against a fake CloudBackend on 127.0.0.1: the sign-in page and its guards, the session file,
// upload (lint first), deploy (boot page, datatypes, webshare, pipeline record), verify by bytes, the realm, a 401,
// sign-out and the stdio surface. No network, no credentials: `node --test servers/tenant/test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKEN = 'a1b2c3d4e5f6a7b8c9d0';
let nextId = 1000;
const folders = new Map();
const mk = (name, parent) => { const id = String(nextId++); folders.set(id, { id, name, parent, children: new Map(), docs: new Map() }); if (parent) folders.get(parent).children.set(name, id); return id; };
const HOME = mk('home'), TROOT = mk('tenantroot'), SETTINGS = mk('Settings', TROOT), PIPES = mk('Pipelines', SETTINGS);
mk('Applications', TROOT);
const shares = [];
const state = { realm: false, keycloakCalls: 0, sessionsEnded: 0, sessionOk: true };
const LOGIN_XML = `<loginResponse><userid>4242</userid><username>sara</username><firstname>Sara</firstname><lastname>Tester</lastname><home>${HOME}</home>`
  + `<session>${TOKEN}</session><group id="1" name="cbe"><group id="777" folderId="${TROOT}" name="acme" alias="Acme" owner="true" tenantgroup="true">`
  + '<group id="8" role="Owner"/><group id="9" role="Administrator"/></group><group id="778" folderId="5" name="cloudbackend" alias="x" tenantgroup="true"/></group></loginResponse>';
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let BASE;
const fake = http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks), u = new URL(req.url, 'http://x'), p = decodeURIComponent(u.pathname);
  const send = (code, text = '', type = 'application/xml') => { res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': req.headers.origin || '*' }); res.end(text); };
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': req.headers.origin || '*', 'Access-Control-Allow-Headers': 'Authorization,Content-Type,tenant', 'Access-Control-Allow-Methods': 'GET, POST' }); return res.end(); }
  if (p.startsWith('/auth/')) return send(state.realm && p === '/auth/realms/acme/.well-known/openid-configuration' ? 200 : 404, '{}', 'application/json');
  if (p.startsWith('/share/')) {
    const [, , host, ...rest] = p.split('/');
    const sh = shares.find((x) => host === `acme-sara-${x.name}`);
    if (!sh) return send(404, 'no such share', 'text/plain');
    let f = folders.get(sh.folderId);
    const parts = rest.filter(Boolean);
    for (const seg of parts.slice(0, -1)) { const id = f && f.children.get(seg); f = id ? folders.get(id) : undefined; }
    const doc = f && parts.length ? f.docs.get(parts[parts.length - 1]) : undefined;
    const fallback = folders.get(sh.folderId).docs.get('index.html');
    const out = doc || fallback;
    return out ? send(200, out.bytes, out.type) : send(404, '', 'text/plain');
  }
  if (req.method === 'POST' && p === '/v1/login/') {
    return req.headers.authorization === `Basic ${Buffer.from('sara:secret').toString('base64')}` ? send(200, LOGIN_XML) : send(401, 'Invalid username or password', 'text/plain');
  }
  if (req.headers.authorization !== `WRAP access_token=${TOKEN}` || !state.sessionOk) return send(401, 'Unauthorized', 'text/plain');
  let m;
  if (p === '/v1/sessions') { if (req.method === 'POST') state.sessionsEnded++; return send(200, req.method === 'POST' ? 'success' : '<sessions><totalResults>1</totalResults></sessions>'); }
  if (req.method === 'GET' && (m = p.match(/^\/v1\/folderpath\/(\d+)\/(.+)$/))) {
    const id = folders.get(m[1])?.children.get(m[2]);
    return id ? send(200, `<fs:folders xmlns:fs="http://xcerion.com/folders.xsd"><fs:folder id="${id}" name="${esc(m[2])}"/></fs:folders>`) : send(404, 'Not found', 'text/plain');
  }
  if (req.method === 'POST' && (m = p.match(/^\/v1\/container\/(\d+)$/))) {
    const name = (body.toString().match(/<childFolder>([^<]*)<\/childFolder>/) || [])[1];
    return send(200, `<newFolderResponse><newFolderId>${mk(name, m[1])}</newFolderId></newFolderResponse>`);
  }
  if (req.method === 'POST' && (m = p.match(/^\/v1\/documents\/(\d+)\/$/))) {
    folders.get(m[1]).docs.set(req.headers['x-file-name'], { bytes: body, type: req.headers['x-content-type'] });
    return send(200, '<ok/>');
  }
  if (req.method === 'GET' && (m = p.match(/^\/v1\/documents\/(\d+)\/$/))) {
    const f = folders.get(m[1]);
    const entries = [...f.docs.keys()].map((n) => `<atom:entry><atom:title>${esc(n)}</atom:title><atom:link href="${BASE}/v1/doc/${f.id}/${encodeURIComponent(n)}"/></atom:entry>`);
    return send(200, `<atom:feed><os:totalResults>${entries.length}</os:totalResults>${entries.join('')}</atom:feed>`);
  }
  if (req.method === 'GET' && (m = p.match(/^\/v1\/doc\/(\d+)\/(.+)$/))) { const d = folders.get(m[1])?.docs.get(m[2]); return d ? send(200, d.bytes, d.type) : send(404); }
  if (req.method === 'GET' && (m = p.match(/^\/v1\/containers\/(\d+)$/))) {
    const f = folders.get(m[1]);
    return send(200, `<fs:container id="${f.id}" name="${esc(f.name)}">${[...f.children].map(([n, id]) => `<fs:container id="${id}" name="${esc(n)}"/>`).join('')}</fs:container>`);
  }
  if (p === '/v1/users/4242/webshares/' && req.method === 'GET') {
    return send(200, `<webshares><os:totalResults>${shares.length}</os:totalResults>${shares.map((s) => `<webshare id="${s.id}" name="${esc(s.name)}" description="${esc(s.description)}" visibility="private"/>`).join('')}</webshares>`);
  }
  if (p === '/v1/users/4242/webshares/' && req.method === 'POST') {
    const x = body.toString();
    const sh = { id: String(nextId++), name: x.match(/<webshare name='([^']*)'/)[1], description: x.match(/description='([^']*)'/)[1].replace(/&apos;/g, "'").replace(/&amp;/g, '&'), folderId: x.match(/<folder [^>]*id='(\d+)'/)[1] };
    shares.push(sh);
    return send(200, `<webshare id="${sh.id}"><folder id="${sh.folderId}"/></webshare>`);
  }
  if (p === '/v1/keycloak' && req.method === 'POST') { state.keycloakCalls++; state.realm = true; return send(200, ''); }
  return send(404, `fake: no route ${req.method} ${p}`, 'text/plain');
});
await new Promise((r) => fake.listen(0, '127.0.0.1', r));
BASE = `http://127.0.0.1:${fake.address().port}`;
const SESSIONS = mkdtempSync(join(tmpdir(), 'cbe-tenant-sessions-'));
Object.assign(process.env, { CBE_API: `${BASE}/v1`, CBE_AUTH: `${BASE}/auth`, CBE_SHARE_URL: `${BASE}/share/{host}`, CBE_SESSION_DIR: SESSIONS });
const T = await import('./index.mjs');
const run = (name, args = {}) => T.TOOLS[name].run(args);

const PKG = mkdtempSync(join(tmpdir(), 'cbe-tenant-pkg-'));
const put = (rel, text) => { mkdirSync(dirname(join(PKG, rel)), { recursive: true }); writeFileSync(join(PKG, rel), text); };
put('index.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<application xmlns:xlink="http://www.w3.org/1999/xlink" name="probe" icon="icon://check" instances="1">\n  <settings/>\n  <about version="1.0"><description>Plugin probe</description></about>\n  <view name="Main" xlink:actuate="onLoad" xlink:href="views/main.xml"/>\n  <process name="probe">\n    <trigger view="Main" event="Loaded" step="shown"/>\n    <step id="shown"/>\n  </process>\n</application>\n');
put('views/main.xml', '<view name="Main" version="1" title="Plugin probe">\n  <panel name="root" type="rows" width="100%" height="100%">\n    <label name="hello" text="Deployed by the CloudBackend plugin."/>\n  </panel>\n</view>\n');
writeFileSync(join(PKG, 'logo.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3, 255]));
put('.notes', 'never uploaded');
const project = () => folders.get(folders.get(folders.get(HOME).children.get('Applications')).children.get('probe'));

test('not signed in: status says so, and the account tools refuse with the way in', async () => {
  assert.equal((await run('tenant_status')).signed_in, false);
  await assert.rejects(run('list_projects'), /tenant_signin/);
});

test('the sign-in page: guards, the browser-side login, the stored session', async () => {
  const r = await run('tenant_signin', { tenant: 'acme', open_browser: false });
  assert.match(r.signin_page, /^http:\/\/127\.0\.0\.1:\d+\/signin\?state=[0-9a-f]{32}$/);
  assert.match(r.for_the_user, /never paste your password/i);
  assert.match(r.browser, /built-in browser/, 'open_browser false points at the built-in browser');
  assert.match(r.the_tab, /do not read, screenshot or click/);
  const page = await fetch(r.signin_page);
  assert.equal(page.status, 200);
  const csp = page.headers.get('content-security-policy');
  assert.match(csp, /script-src 'nonce-/); assert.match(csp, new RegExp(`connect-src 'self' ${BASE.replace(/\./g, '\\.')}`)); assert.match(csp, /frame-ancestors 'none'/);
  const html = await page.text();
  assert.match(html, /Sign in to CloudBackend/); assert.match(html, /T = "acme"/); assert.match(html, /type="password"/);
  assert.equal((html.match(/[^\x09\x0a\x0d\x20-\x7e]/g) || []).length, 0, 'the page is ASCII');
  const { port } = new URL(r.signin_page), state = new URL(r.signin_page).searchParams.get('state');
  const wrongHost = await new Promise((ok) => http.get({ host: '127.0.0.1', port, path: `/signin?state=${state}`, headers: { Host: `localhost:${port}` } }, (x) => { x.resume(); ok(x.statusCode); }));
  assert.equal(wrongHost, 421, 'another Host name is refused (DNS rebinding)');
  const origin = `http://127.0.0.1:${port}`;
  const login = await fetch(`${BASE}/v1/login/?tenant=acme`, { method: 'POST', headers: { Authorization: `Basic ${Buffer.from('sara:secret').toString('base64')}`, 'Content-Type': 'text/xml' }, body: '<login/>' });
  const xml = await login.text();
  const post = (headers, obj) => fetch(`${origin}/session`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(obj) });
  assert.equal((await post({}, { state, xml })).status, 403, 'no Origin: refused');
  assert.equal((await post({ Origin: 'https://evil.example' }, { state, xml })).status, 403, 'another Origin: refused');
  assert.equal((await post({ Origin: origin }, { state: 'f'.repeat(32), xml })).status, 403, 'unknown state: refused');
  const ok = await post({ Origin: origin }, { state, xml });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).name, 'Sara Tester');
  const file = join(SESSIONS, 'acme.json');
  assert.equal(statSync(file).mode & 0o777, 0o600, 'the session file is the user\'s alone');
  assert.equal(statSync(SESSIONS).mode & 0o077, 0, 'and so is its folder');
  assert.equal((await fetch(r.signin_page)).status, 410, 'the link is spent');
  const st = await run('tenant_status', { tenant: 'acme' });
  assert.equal(st.signed_in, true); assert.equal(st.role, 'owner'); assert.equal(st.session, 'confirmed by CloudBackend');
  assert.match(st.deploy_connector, /no sign-in realm/);
  assert.ok(!JSON.stringify(st).includes(TOKEN), 'the session token never appears in a result');
});

test('the login answer: the tenant group named after the account, its roles; another account is refused', () => {
  const { record } = T.parseLogin(LOGIN_XML, 'acme');
  assert.equal(record.tenantGroupId, '777'); assert.equal(record.tenantFolderId, TROOT); assert.deepEqual(record.roles, ['Owner', 'Administrator']);
  assert.throws(() => T.parseLogin(LOGIN_XML, 'other'), /not to the account other/);
  assert.throws(() => T.parseLogin('<loginResponse/>', 'acme'), /no session/);
});

test('upload refuses a package with lint errors and writes nothing', async () => {
  const bad = mkdtempSync(join(tmpdir(), 'cbe-tenant-bad-'));
  writeFileSync(join(bad, 'index.xml'), readFileSync(join(PKG, 'index.xml')));
  mkdirSync(join(bad, 'views'));
  writeFileSync(join(bad, 'views', 'view.xml'), '<view name="view" version="1"><panel name="p" type="rows"><select name="s"/></panel></view>');
  await assert.rejects(run('upload_project', { path: bad, project_name: 'probe' }), /Nothing was uploaded[\s\S]*G02[\s\S]*G05/);
  assert.equal(folders.get(HOME).children.size, 0, 'not even Applications/ was created');
  await assert.rejects(run('upload_project', { path: HERE, project_name: 'probe' }), /holds no index.xml/);
});

test('upload copies the folder, folders and binaries included, and lists what only the tenant has', async () => {
  const r = await run('upload_project', { path: PKG, project_name: 'probe' });
  assert.equal(r.uploaded, 3); assert.match(r.lint, /0 errors/); assert.deepEqual(r.on_the_tenant_not_in_the_folder, []);
  assert.deepEqual([...project().docs.keys()].sort(), ['index.xml', 'logo.png']);
  assert.ok(!project().docs.has('.notes'), 'dot-files stay home');
  assert.deepEqual(project().docs.get('logo.png').bytes, readFileSync(join(PKG, 'logo.png')));
  assert.equal(project().docs.get('index.xml').type, 'text/xml');
  project().docs.set('old.xml', { bytes: Buffer.from('<old/>'), type: 'text/xml' });
  const again = await run('upload_project', { path: PKG, project_name: 'probe' });
  assert.deepEqual(again.on_the_tenant_not_in_the_folder, ['old.xml']);
  assert.ok(project().docs.has('old.xml'), 'nothing is deleted');
});

test('deploy: boot page, datatypes, webshare, pipeline record; a second deploy reuses and leaves the record', async () => {
  const r = await run('deploy', { project_name: 'probe' });
  assert.equal(r.url, `${BASE}/share/acme-sara-probe`); assert.equal(r.share, 'created');
  const boot = project().docs.get('index.html').bytes.toString();
  assert.match(boot, /tenant:"acme"/); assert.match(boot, /tenantId:"777"/); assert.match(boot, /\/xios\/boot\.js/);
  assert.ok(project().docs.get('.types.xml').bytes.length > 10000);
  assert.match(shares[0].description, /^Stage: Development, Deploy: 4242 \[\[\]\] Plugin probe, Project: probe, ProjectHref: home:\/\/Applications\/probe$/);
  const rec = folders.get(folders.get(PIPES).children.get('probe')).docs.get('probe_pipeline').bytes.toString();
  assert.match(rec, /<development><deploy version="1.0" internal-version="probe" href="[^"]+acme-sara-probe"/); assert.match(r.pipeline, /^wrote /);
  const again = await run('deploy', { project_name: 'probe' });
  assert.equal(again.share, 'reused'); assert.match(again.pipeline, /left as it is/); assert.equal(shares.length, 1);
  shares.push({ id: '1', name: 'taken', description: 'Stage: Development, Deploy: 1 [[]] x, Project: x, ProjectHref: home://Applications/x', folderId: HOME });
  await assert.rejects(run('deploy', { project_name: 'probe', deployment_name: 'taken' }), /already serves home:\/\/Applications\/x/);
  await assert.rejects(run('deploy', { project_name: 'probe', deployment_name: 'probe2' }), /already deployed as probe/);
  await assert.rejects(run('deploy', { project_name: 'probe', deployment_name: 'xiosprobe' }), /G18/);
  await assert.rejects(run('deploy', { project_name: 'nothere' }), /upload_project first/);
});

test('verify compares served bytes, names the boot page when it answers instead, and reads the stored copy without a path', async () => {
  const live = await run('verify_deployment', { project_name: 'probe', path: PKG });
  assert.equal(live.verdict.startsWith('live'), true, JSON.stringify(live.mismatches));
  assert.equal(live.index_xml_match, true); assert.equal(live.boots_runtime, true); assert.equal(live.share.bound, true);
  assert.equal(live.llms_txt, 'not served (the boot page answered)'); assert.equal(live.slug_bound_to, 'home');
  assert.match(live.login_gate.verdict, /^open/); assert.equal(live.login_gate.pipeline_record, 'read'); assert.equal(live.login_gate.manifest_login, false);
  const views = folders.get(project().children.get('views'));
  const kept = views.docs.get('main.xml'); views.docs.delete('main.xml');
  const broken = await run('verify_deployment', { project_name: 'probe', path: PKG });
  assert.match(broken.verdict, /^not live/);
  assert.deepEqual(broken.mismatches.map((m) => [m.path, m.served_is_fallback_page]), [['views/main.xml', true]]);
  views.docs.set('main.xml', kept);
  const stored = await run('verify_deployment', { project_name: 'probe' });
  assert.equal(stored.compared_with, 'the stored copy on the tenant'); assert.equal(stored.index_xml_match, true);
});

test('verify reads the login gate from the pipeline record and the served manifest, as the deploy connector does', async () => {
  const proj = project(), manifest = proj.docs.get('index.xml');
  const pipes = folders.get(folders.get(PIPES).children.get('probe')), record = pipes.docs.get('probe_pipeline');
  const stamp = '<login><create>Create an account</create><reset>Forgot your password?</reset></login><process xlink:href="xios://apps/login.xml" xlink:actuate="onLoad"/>';
  proj.docs.set('index.xml', { ...manifest, bytes: Buffer.from(manifest.bytes.toString().replace('</application>', `${stamp}</application>`)) });
  let r = await run('verify_deployment', { project_name: 'probe' });
  assert.equal(r.index_xml_match, true); assert.match(r.login_gate.verdict, /^manifest-only/);
  assert.equal(r.login_gate.manifest_login_element, true); assert.equal(r.login_gate.manifest_login_process, true); assert.equal(r.login_gate.pipeline_login_config, false);
  pipes.docs.set('probe_pipeline', { ...record, bytes: Buffer.from(record.bytes.toString().replace('<history', '<loginConfig logo="https://x/logo.svg"/><history')) });
  r = await run('verify_deployment', { project_name: 'probe' });
  assert.match(r.login_gate.verdict, /^gated/); assert.equal(r.login_gate.pipeline_login_config_on_this_deployment, true);
  proj.docs.set('index.xml', manifest);
  r = await run('verify_deployment', { project_name: 'probe' });
  assert.match(r.login_gate.verdict, /^console-only/);
  pipes.docs.set('probe_pipeline', record);
});

test('list_projects names the projects on both drives and the deployments with their addresses', async () => {
  const r = await run('list_projects');
  assert.deepEqual(r.projects['home://Applications'], ['probe']); assert.deepEqual(r.projects['tenant://Applications'], []);
  assert.equal(r.deployments.find((d) => d.name === 'probe').url, `${BASE}/share/acme-sara-probe`);
});

test('enable_deploy_connector: owners only, one call, then the realm answers', async () => {
  T.storeSession({ tenant: 'beta', userId: '4242', username: 'sam', name: 'Sam', homeId: HOME, tenantGroupId: '9', tenantFolderId: TROOT, tenantName: 'beta', owner: false, roles: ['Developer'] }, TOKEN);
  await assert.rejects(run('enable_deploy_connector', { tenant: 'beta' }), /not the owner or an administrator/);
  rmSync(join(SESSIONS, 'beta.json'));
  const r = await run('enable_deploy_connector', { tenant: 'acme' });
  assert.equal(r.realm, 'created'); assert.equal(state.keycloakCalls, 1);
  assert.equal((await run('enable_deploy_connector', { tenant: 'acme' })).realm, 'already exists'); assert.equal(state.keycloakCalls, 1);
  assert.match((await run('tenant_status')).deploy_connector, /can sign in/);
});

test('a 401 ends the stored session; sign-out ends it at CloudBackend and deletes it', async () => {
  state.sessionOk = false;
  await assert.rejects(run('list_projects'), /has ended/);
  assert.equal(existsSync(join(SESSIONS, 'acme.json')), false);
  state.sessionOk = true;
  T.storeSession(T.parseLogin(LOGIN_XML, 'acme').record, TOKEN);
  const out = await run('tenant_signout');
  assert.equal(out.session, 'ended at CloudBackend'); assert.equal(state.sessionsEnded, 1);
  assert.equal(existsSync(join(SESSIONS, 'acme.json')), false);
});

test('stdio: eight tools, each titled and annotated, and a refusal comes back as an error result', async () => {
  const child = spawn(process.execPath, [join(HERE, 'index.mjs')], { env: { ...process.env, CBE_SESSION_DIR: mkdtempSync(join(tmpdir(), 'cbe-empty-')) } });
  const lines = [];
  let buf = '';
  child.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { lines.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } });
  for (const [id, method, params] of [[1, 'initialize', {}], [2, 'tools/list', {}], [3, 'tools/call', { name: 'deploy', arguments: { project_name: 'probe' } }]]) child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  while (lines.length < 3) await new Promise((r) => setTimeout(r, 20));
  child.kill();
  const tools = lines.find((l) => l.id === 2).result.tools;
  assert.equal(tools.length, 8);
  for (const t of tools) { assert.ok(t.title, t.name); assert.ok(t.annotations && 'readOnlyHint' in t.annotations, t.name); }
  const refused = lines.find((l) => l.id === 3).result;
  assert.equal(refused.isError, true); assert.match(refused.content[0].text, /Not signed in/);
});

test.after(() => { fake.close(); for (const d of [SESSIONS, PKG]) rmSync(d, { recursive: true, force: true }); });
