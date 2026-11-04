// Tests for the build server: node --test servers/build/test.mjs (zero dependencies, no network).
// The seeded project carries the traps the workflow exists to catch before an upload: a view file named view.xml,
// a <select> in a view, a call operation with step=, version on <process>, and a hex colour in a stylesheet. The
// expectations mirror the Python reference implementation's tests, rule by rule; the last group drives the server
// over stdio as Claude Code does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GRAMMAR_PATH, Package, ToolError, TOOLS, XmlSyntaxError, benchmark, checkRelativePath, lint, loadGrammar, measure, parseXml } from './index.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const MANIFEST = `<?xml version="1.0" encoding="UTF-8"?>
<application xmlns:xlink="http://www.w3.org/1999/xlink" name="notes" icon="icon://note" instances="1">
  <settings/>
  <about version="1.0"><description>Notes</description></about>
  <theme name="notes" tokens="true">
    <tokens>
      <font-sans>system-ui, sans-serif</font-sans>
      <text-md>14px</text-md>
    </tokens>
    <colors>
      <color name="primary">#1e3a8a</color>
      <color name="on-primary">#ffffff</color>
    </colors>
  </theme>
  <view name="Notes" xlink:actuate="onLoad" xlink:href="views/notes.xml"/>
  <process xlink:actuate="onLoad" xlink:href="processes/notes.xml"/>
</application>
`;
const VIEW = `<?xml version="1.0" encoding="UTF-8"?>
<view xmlns:xlink="http://www.w3.org/1999/xlink" name="Notes" mode="main" title="Notes">
  <panel name="root" type="rows" width="100%" height="100%">
    <input name="search" width="100%" placeholder="Search"/>
    <iconlist name="items" layout="vertical" width="100%" height="fill">
      <rule match="db:object">
        <item text="{substring-before(@name, '.xml')}"/>
      </rule>
    </iconlist>
    <button name="save" text="Save"/>
  </panel>
</view>
`;
const PROCESS = `<?xml version="1.0" encoding="UTF-8"?>
<process xmlns:xlink="http://www.w3.org/1999/xlink" name="notesProcess">
  <trigger view="Notes" event="Loaded" step="init"/>
  <trigger view="Notes" component="save" event="Select" step="saveNote"/>
  <step id="init">
    <alias name="itemsUrl" value="home://Notes/Items" model="value"/>
    <operation name="bind" value="{$itemsUrl}">
      <component view="Notes" name="items" select="/db:result"/>
    </operation>
  </step>
  <step id="saveNote">
    <alias name="stamp" value="{format-date('now', 'yyyy-MM-dd')}" model="value"/>
    <operation name="call" value="init"/>
  </step>
</process>
`;
const CSS = `.notes { padding: 8px; color: var(--xios-color-on-surface); }\n`;

const f = (path, content) => ({ path, content });
const good = () => [f('index.xml', MANIFEST), f('views/notes.xml', VIEW), f('processes/notes.xml', PROCESS), f('layout/app.css', CSS)];
/** The seeded traps: view.xml, a <select>, call step=, version on <process>, a hex colour in the stylesheet. */
const trap = () => [
  f('index.xml', MANIFEST.replace('xlink:href="views/notes.xml"', 'xlink:href="views/view.xml"').replace('xlink:href="processes/notes.xml"', 'xlink:href="processes/process.xml"')),
  f('views/view.xml', VIEW.replace('<button name="save" text="Save"/>', '<button name="save" text="Save"/>\n    <select name="kind"><option>a</option></select>')),
  f('processes/process.xml', PROCESS.replace('<process xmlns:xlink', '<process version="1" xmlns:xlink').replace('<operation name="call" value="init"/>', '<operation name="call" step="init"/>')),
  f('layout/app.css', '.notes { color: #336699; }\n'),
];
const rulesOf = (findings) => new Set(findings.map((x) => x.rule));
const withView = (view) => [f('index.xml', MANIFEST), f('views/notes.xml', view), f('processes/notes.xml', PROCESS)];
const withProcess = (process) => [f('index.xml', MANIFEST), f('views/notes.xml', VIEW), f('processes/notes.xml', process)];
const withManifest = (manifest) => [f('index.xml', manifest), f('views/notes.xml', VIEW), f('processes/notes.xml', PROCESS)];

// ---- the grammar file --------------------------------------------------------------------------------------------

test('the grammar is read from the plugin\'s own skill reference and has the twenty-one rules', () => {
  assert.ok(GRAMMAR_PATH.includes(join('skills', 'xios3-app-workflow', 'references', 'tenant-grammar.json')));
  const data = JSON.parse(readFileSync(GRAMMAR_PATH, 'utf8'));
  assert.deepEqual(data.rules.map((r) => r.id), Array.from({ length: 21 }, (_, n) => `G${String(n).padStart(2, '0')}`));
  const g = loadGrammar();
  assert.equal(g.rules.size, 21);
  for (const r of g.rules.values()) for (const k of ['title', 'profile', 'severity', 'message', 'fix']) assert.ok(r[k], `${r.id} lacks ${k}`);
  assert.ok(g.allowedFunctions.has('format-date') && g.allowedFunctions.has('substring-before'));
  assert.equal(typeof g.functionsStatus, 'string');
  assert.equal(g.limits.max_files, 500);
});

test('the server source is ASCII only', () => {
  assert.match(readFileSync(join(HERE, 'index.mjs'), 'utf8'), /^[\x00-\x7f]*$/);
});

// ---- the seeded traps ------------------------------------------------------------------------------------------------

test('the good project is clean in both profiles', () => {
  for (const profile of ['build', 'ship']) {
    const r = lint(good(), profile);
    assert.deepEqual(r.errors, [], profile);
    assert.equal(r.ok, true);
    assert.equal(r.grammar_version, loadGrammar().version);
  }
});

test('the seeded traps yield exactly G01, G02, G04, G05 under build and G10 as well under ship', () => {
  const build = lint(trap(), 'build');
  assert.equal(build.ok, false);
  assert.deepEqual([...rulesOf(build.errors)].sort(), ['G01', 'G02', 'G04', 'G05']);
  const byRule = Object.fromEntries(build.errors.map((e) => [e.rule, e]));
  assert.equal(byRule.G02.file, 'views/view.xml');
  assert.equal(byRule.G04.file, 'processes/process.xml');
  assert.equal(byRule.G05.file, 'views/view.xml');
  assert.match(byRule.G01.message, /version/);
  for (const e of build.errors) { assert.ok(e.fix, e.rule); assert.ok(e.line >= 0); }
  const ship = lint(trap(), 'ship');
  assert.deepEqual([...rulesOf(ship.errors)].sort(), ['G01', 'G02', 'G04', 'G05', 'G10']);
  assert.equal(ship.errors.find((e) => e.rule === 'G10').file, 'layout/app.css');
});

test('each trap alone names its rule with its line', () => {
  const t = Object.fromEntries(trap().map((x) => [x.path, x.content]));
  let r = lint([f('index.xml', MANIFEST.replace('views/notes.xml', 'views/view.xml')), f('views/view.xml', VIEW), f('processes/notes.xml', PROCESS)], 'build', ['G02']);
  assert.deepEqual(r.errors.map((e) => e.rule), ['G02']);
  // the <select> and the <option> inside it are two findings on the same line
  r = lint([f('index.xml', MANIFEST), f('views/notes.xml', t['views/view.xml']), f('processes/notes.xml', PROCESS)], 'build', ['G05']);
  assert.deepEqual(r.errors.map((e) => [e.line, e.message.split(': ')[1].slice(0, 8)]), [[11, '<select>'], [11, '<option>']]);
  r = lint([f('index.xml', MANIFEST), f('views/notes.xml', VIEW), f('processes/notes.xml', t['processes/process.xml'])], 'build', ['G04']);
  assert.deepEqual(r.errors.map((e) => [e.rule, e.line]), [['G04', 13]]);
});

// ---- the rules one by one --------------------------------------------------------------------------------------------

test('G01: a missing manifest and a wrong root', () => {
  assert.deepEqual([...rulesOf(lint([f('views/notes.xml', VIEW)], 'build', ['G01']).errors)], ['G01']);
  assert.match(lint([f('index.xml', "<view name='x'/>")], 'build', ['G01']).errors[0].message, /not <application>/);
});

test('G02: the same view name with distinct screens is allowed', () => {
  const one = '<view name="Notes" xlink:actuate="onLoad" xlink:href="views/notes.xml"/>';
  const screens = MANIFEST.replace(one, '<view name="Notes" screen="phone" xlink:actuate="onLoad" xlink:href="views/notes.xml"/>\n  <view name="Notes" screen="(min-width: 601px)" xlink:actuate="onLoad" xlink:href="views/notes.xml"/>');
  assert.deepEqual(lint(withManifest(screens), 'build', ['G02']).errors, []);
  const twice = MANIFEST.replace(one, `${one}\n  ${one}`);
  assert.deepEqual([...rulesOf(lint(withManifest(twice), 'build', ['G02']).errors)], ['G02']);
});

test('G03: unknown functions are named, methods and quoted text are not', () => {
  const r = lint(withProcess(PROCESS.replace("{format-date('now', 'yyyy-MM-dd')}", "{formatDate('now')} {#Notes#search.getValue()}")), 'build', ['G03']);
  assert.deepEqual(r.errors.map((e) => e.rule), ['G03']);
  assert.match(r.errors[0].message, /formatDate\(\)/);
  assert.equal(r.xpath_functions_status, 'to be measured on a tenant');
  assert.deepEqual(lint(withProcess(PROCESS.replace("{format-date('now', 'yyyy-MM-dd')}", "{translate($x, 'a(b', '')}")), 'build', ['G03']).errors, []);
});

test('G06: a script needs a start step', () => {
  const process = PROCESS.replace('<trigger view="Notes" event="Loaded" step="init"/>', '<script href="notes.v1.js"/>\n  <trigger view="Notes" event="Loaded" step="init"/>');
  const files = [...withProcess(process), f('processes/notes.v1.js', 'export function init() {}\n')];
  assert.deepEqual([...rulesOf(lint(files, 'build', ['G06']).errors)], ['G06']);
  const fixed = process.replace('<step id="init">', '<step id="start"><alias name="p" value="started"/></step>\n  <step id="init">');
  assert.deepEqual(lint([...withProcess(fixed), files[3]], 'build', ['G06']).errors, []);
});

test('G07: links resolve inside the package', () => {
  const view = VIEW.replace('<panel name="root"', '<style href="../styles/app.css"/>\n  <panel name="root"');
  assert.deepEqual([...rulesOf(lint(withView(view), 'build', ['G07']).errors)], ['G07']);
  assert.deepEqual(lint([...withView(view), f('styles/app.css', '.x{}')], 'build', ['G07']).errors, []);
  const escaping = VIEW.replace('<panel name="root"', '<style href="../../outside.css"/>\n  <panel name="root"');
  const [error] = lint([...withView(escaping), f('outside.css', '')], 'build', ['G07']).errors;
  assert.match(error.message, /escapes/);
});

test('G08: custom tags', () => {
  const manifest = MANIFEST.replace('<settings/>', '<settings/>\n  <components><component name="S" tag="status" class="CA_Status" href="ui/s.js"/><component name="T" tag="good-tag" class="CA_T" href="ui/t.js"/></components>');
  const r = lint([...withManifest(manifest), f('ui/s.js', ''), f('ui/t.js', '')], 'build', ['G08']);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings.map((w) => w.rule), ['G08']);
  assert.match(r.warnings[0].message, /shadows/);
});

test('G09: non-ASCII is a ship error only, with its line', () => {
  const view = VIEW.replace('text="Save"', 'text="Spara ändringar"');
  assert.deepEqual(lint(withView(view), 'build').errors, []);
  const [error] = lint(withView(view), 'ship', ['G09']).errors;
  assert.deepEqual([error.file, error.line], ['views/notes.xml', 10]);
});

test('G10: a hex outside the theme, a var() fallback, no theme, no font', () => {
  assert.deepEqual([...rulesOf(lint(withView(VIEW.replace('<button name="save" text="Save"/>', '<button name="save" text="Save" style="color:#ff0000"/>')), 'ship', ['G10']).errors)], ['G10']);
  assert.deepEqual(lint(withView(VIEW.replace('<button name="save" text="Save"/>', '<button name="save" text="Save" style="color:var(--xios-color-primary,#fff)"/>')), 'ship', ['G10']).errors, []);
  assert.match(lint(withManifest(MANIFEST.replace('tokens="true"', '')), 'ship', ['G10']).errors[0].message, /token block/);
  assert.match(lint(withManifest(MANIFEST.replace('<font-sans>system-ui, sans-serif</font-sans>', '')), 'ship', ['G10']).errors[0].message, /font/);
});

test('G11: an external fetch in JavaScript; the platform hosts are fine', () => {
  const [error] = lint([...good(), f('processes/notes.v1.js', 'export async function load() { return fetch("https://api.example.com/v1"); }\n')], 'build', ['G11']).errors;
  assert.match(error.message, /api\.example\.com/);
  assert.deepEqual(lint([...good(), f('processes/notes.v1.js', 'fetch("https://api.cloudbackend.com/v1/login")\n')], 'build', ['G11']).errors, []);
});

test('G12: secrets are reported by kind, never by value', () => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijklmnopqrstuvwxyz0123456789';
  const r = lint([...good(), f('processes/config.js', `const key = "${token}";\n`)], 'build', ['G12']);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0].message, /JSON Web Token/);
  assert.ok(!JSON.stringify(r).includes(token));
});

test('G13: an unguarded home:// write on a tenant package is a warning', () => {
  const write = '<operation name="database" value="home://Notes"><create type="container" name="Items"/></operation>';
  const process = PROCESS.replace('<alias name="itemsUrl" value="home://Notes/Items" model="value"/>', write);
  const tenant = MANIFEST.replace('<settings/>', '<settings><path>tenant://</path></settings>');
  assert.deepEqual(lint([f('index.xml', tenant), f('views/notes.xml', VIEW), f('processes/notes.xml', process)], 'build', ['G13']).warnings.map((w) => w.rule), ['G13']);
  assert.deepEqual(lint(withProcess(process), 'build', ['G13']).warnings, []);
  const guarded = process.replace(write, `<operation name="decision" value="home://Notes/Items"><when exists="false">${write}</when></operation>`);
  assert.deepEqual(lint([f('index.xml', tenant), f('views/notes.xml', VIEW), f('processes/notes.xml', guarded)], 'build', ['G13']).warnings, []);
});

test('G14: render stylesheets', () => {
  const xsl = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/"><div><xsl:apply-templates select="item"/><br/></div></xsl:template></xsl:stylesheet>';
  const r = lint([...good(), f('xsl/detail.xsl', xsl)], 'ship', ['G14']);
  assert.deepEqual(r.errors.map((e) => e.message.split(': ').slice(1).join(': ').slice(0, 20)).sort(), ['a <br/>, which rende', 'xsl:apply-templates ']);
  const ok = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/"><xsl:for-each select="item"><p><xsl:value-of select="."/></p></xsl:for-each></xsl:template></xsl:stylesheet>';
  assert.deepEqual(lint([...good(), f('xsl/detail.xsl', ok)], 'ship', ['G14']).errors, []);
});

test('G15 and G16: sizes and binaries', () => {
  assert.deepEqual(lint([...good(), f('fonts/icons.woff2', 'x'.repeat(300000))], 'build', ['G15']).warnings.map((w) => w.rule), ['G15']);
  const [error] = lint([...good(), f('images/logo.png', '\x89PNG\x00\x00\x01\x02')], 'build', ['G16']).errors;
  assert.match(error.message, /not a text file/);
  const many = [...good(), ...Array.from({ length: 500 }, (_, i) => f(`data/${i}.xml`, '<x/>'))];
  assert.match(lint(many, 'build', ['G16']).errors[0].message, /files, the limit/);
});

test('G17: a proxy channel is information, not an error', () => {
  const process = PROCESS.replace('<alias name="itemsUrl" value="home://Notes/Items" model="value"/>',
    '<operation name="channel" value=""><name>llm</name><proxy>myProxy</proxy><protocol>PROXY</protocol></operation>\n    <alias name="itemsUrl" value="home://Notes/Items" model="value"/>');
  const r = lint(withProcess(process), 'build');
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.info.map((i) => [i.rule, i.file]), [['G17', 'processes/notes.xml']]);
  assert.match(r.info[0].message, /Deploy Anyway/);
});

test('G18: names and prefixes', () => {
  assert.deepEqual(lint(good(), 'ship', ['G18']).errors, []);
  assert.match(lint(withManifest(MANIFEST.replace('name="notes"', 'name="xiosnotes"')), 'ship', ['G18']).errors[0].message, /begins with xios/);
  assert.match(lint(withManifest(MANIFEST.replace('name="notes"', 'name="My Notes"')), 'ship', ['G18']).errors[0].message, /\[a-z0-9\]\+/);
  assert.match(lint(good(), 'ship', ['G18'], { deploymentName: 'Xios-App' }).errors[0].message, /deployment name/);
  assert.match(lint([...good(), f('xios-docs/a.txt', '')], 'ship', ['G18']).errors[0].message, /folder/);
});

test('G19: triggers and references resolve', () => {
  const r = lint(withProcess(PROCESS.replace('component="save"', 'component="svae"').replace('name="items" select', 'name="itmes" select')), 'build', ['G19']);
  assert.equal(r.errors.length, 2);
  assert.ok(r.errors.some((e) => e.message.includes('svae')) && r.errors.some((e) => e.message.includes('itmes')));
  assert.match(lint(withProcess(PROCESS.replace('<trigger view="Notes" event="Loaded"', '<trigger view="Main" event="Loaded"')), 'build', ['G19']).errors[0].message, /no view declares/);
  assert.match(lint(withProcess(PROCESS.replace("{format-date('now', 'yyyy-MM-dd')}", '{#Notes#serach}')), 'build', ['G19']).errors[0].message, /serach/);
});

test('G20: the login order and actuate', () => {
  const login = MANIFEST.replace('<settings/>', '<settings/>\n  <login><title>Notes</title></login>');
  assert.ok(lint(withManifest(login), 'build', ['G20']).errors.some((e) => e.message.includes('no <process')));
  const fixed = login.replace('<view name="Notes" xlink:actuate="onLoad" xlink:href="views/notes.xml"/>\n  <process xlink:actuate="onLoad" xlink:href="processes/notes.xml"/>',
    '<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>\n  <view name="Notes" xlink:actuate="onRequest" xlink:href="views/notes.xml"/>\n  <process xlink:actuate="onRequest" xlink:href="processes/notes.xml"/>');
  assert.deepEqual(lint(withManifest(fixed), 'build', ['G20']).errors, []);
  const wrongOrder = fixed.replace('<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>\n  ', '')
    .replace('<process xlink:actuate="onRequest" xlink:href="processes/notes.xml"/>', '<process xlink:actuate="onRequest" xlink:href="processes/notes.xml"/>\n  <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>');
  assert.ok(lint(withManifest(wrongOrder), 'build', ['G20']).errors.some((e) => e.message.includes('precedes')));
});

// ---- inputs, the parser, the package -----------------------------------------------------------------------------------

test('an unknown rule, profile, empty input and an escaping path are refused', () => {
  assert.throws(() => lint(good(), 'build', ['G99']), ToolError);
  assert.throws(() => lint(good(), 'release'), ToolError);
  assert.throws(() => lint([], 'build'), ToolError);
  assert.throws(() => lint([f('../index.xml', '')], 'build'), ToolError);
});

test('ship runs the build rules too, the schema note is carried, and stats are by type', () => {
  const r = lint(good(), 'ship');
  assert.ok(r.rules_run.includes('G04') && r.rules_run.includes('G09'));
  assert.equal(r.stats.files, 4);
  assert.equal(r.stats.by_type.xml.files, 3);
  assert.match(r.schema_validation, /upload_project/);
});

test('XML that is not well-formed is a G00 error with its line', () => {
  const [error] = lint([f('index.xml', MANIFEST), f('views/notes.xml', "<view name='x'>\n<panel>\n</view>")], 'build', ['G00']).errors;
  assert.equal(error.rule, 'G00');
  assert.equal(error.line, 3);
});

test('the tokenizer: namespaces, entities, comments, CDATA, a doctype, and the error shapes', () => {
  const root = parseXml('<?xml version="1.0"?>\n<!DOCTYPE x [<!ENTITY y "z">]>\n<!-- c -->\n<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="h" t="&lt;&amp;&#65;&#x42;">\n  t1<b n="1"/><![CDATA[<raw>]]></a>');
  assert.equal(root.tag, 'a');
  assert.equal(root.attrib['{http://www.w3.org/1999/xlink}href'], 'h');
  assert.equal(root.attrib.t, '<&AB');
  assert.equal(root.text, '\n  t1');
  assert.equal(root.children[0].line, 5);
  assert.equal(parseXml('<x xmlns="urn:u"><y/></x>').children[0].tag, '{urn:u}y');
  for (const [bad, re] of [['<a><b></a>', /mismatched/], ['<a>', /not closed/], ['<a/><b/>', /junk/], ['<a x="1" x="2"/>', /duplicate/], ['<p:a/>', /unbound/], ['', /no root/]]) {
    assert.throws(() => parseXml(bad), (e) => e instanceof XmlSyntaxError && re.test(e.message), bad);
  }
});

test('paths and references', () => {
  for (const p of ['../index.xml', 'views/../../x.xml', '..', 'a/..', '..\\x.xml', '', '/', './', ' ', 'views/main\nView.xml']) assert.throws(() => checkRelativePath(p), ToolError, p);
  assert.deepEqual(checkRelativePath('./views/./mainView.xml'), ['views', 'mainView.xml']);
  assert.deepEqual(checkRelativePath('views\\mainView.xml'), ['views', 'mainView.xml']);
  const pkg = new Package([f('index.xml', "<application name='x'/>"), f('views/a.xml', "<view name='A'/>")]);
  assert.equal(pkg.resolve('views/a.xml', '../styles/app.css'), 'styles/app.css');
  assert.equal(pkg.resolve('views/a.xml', 'b.xml'), 'views/b.xml');
  assert.equal(pkg.resolve('index.xml', '../outside.xml'), null);
  assert.equal(pkg.resolve('index.xml', '/etc/passwd'), null);
  for (const ext of ['https://example.com/x', 'xios://apps/login.xml', 'icon://note', '{$dynamic}', '#anchor', '']) assert.equal(pkg.resolve('index.xml', ext), '', ext);
  assert.throws(() => new Package([f('index.xml', ''), f('./index.xml', '')]), ToolError);
});

// ---- benchmark -------------------------------------------------------------------------------------------------------

test('benchmark counts the package and labels every row with its source', () => {
  const m = measure(good());
  assert.deepEqual([m.files, m.views, m.view_files, m.processes, m.steps, m.operations, m.triggers, m.components, m.custom_components, m.has_manifest, m.build_step],
    [4, 1, 1, 1, 2, 2, 2, 4, 0, true, 'none']);
  assert.equal(m.lines, [MANIFEST, VIEW, PROCESS, CSS].reduce((n, t) => n + t.split('\n').length - 1, 0));
  assert.deepEqual(Object.keys(m.bytes_by_type), ['css', 'xml']);
  const r = benchmark(good(), { client: 'Claude Code', tokens_in: 1200, lighthouse: { performance: 92, route: '/' } });
  assert.equal(r.sources.tokens_in, 'client-supplied');
  assert.equal(r.sources.cost_usd, 'not-available');
  assert.equal(r.sources.files, 'measured');
  assert.match(r.block_markdown, /\| Tokens in \| 1200 \| client-supplied \|/);
  assert.match(r.block_markdown, /\| Cost \(USD\) \| not available on this client \| not-available \|/);
  assert.match(r.block_markdown, /\| Lighthouse \| performance 92; route \/ \| client-supplied \|/);
  assert.equal(r.block_json.client.client, 'Claude Code');
  assert.throws(() => benchmark([], null), ToolError);
});

// ---- the server over stdio ---------------------------------------------------------------------------------------------

test('the tool table: two tools, titled and annotated', () => {
  assert.deepEqual(Object.keys(TOOLS), ['lint_project', 'benchmark_project']);
  for (const t of Object.values(TOOLS)) { assert.ok(t.title); assert.ok(t.description.length > 80); assert.equal(t.inputSchema.required[0], 'files'); }
});

test('over stdio: initialize, tools/list, lint_project and benchmark_project', async () => {
  const child = spawn(process.execPath, [join(HERE, 'index.mjs')], { stdio: ['pipe', 'pipe', 'pipe'] });
  const answers = new Map();
  let buffer = '';
  const waiting = new Map();
  child.stdout.on('data', (d) => {
    buffer += d.toString();
    let nl;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl); buffer = buffer.slice(nl + 1);
      if (!line.trim()) continue;
      const m = JSON.parse(line);
      answers.set(m.id, m);
      if (waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); }
    }
  });
  const ask = (id, method, params) => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${method}: no answer`)), 10000);
    waiting.set(id, (m) => { clearTimeout(t); resolve(m); });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
  try {
    const init = await ask(1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
    assert.equal(init.result.serverInfo.name, 'cloudbackend-build');
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    const list = await ask(2, 'tools/list', {});
    assert.deepEqual(list.result.tools.map((t) => t.name), ['lint_project', 'benchmark_project']);
    for (const t of list.result.tools) { assert.ok(t.title); assert.equal(t.annotations.readOnlyHint, true); }
    const call = await ask(3, 'tools/call', { name: 'lint_project', arguments: { files: trap(), profile: 'build' } });
    const result = JSON.parse(call.result.content[0].text);
    assert.equal(result.ok, false);
    assert.deepEqual([...new Set(result.errors.map((e) => e.rule))].sort(), ['G01', 'G02', 'G04', 'G05']);
    const bench = await ask(4, 'tools/call', { name: 'benchmark_project', arguments: { files: good(), client_fields: { client: 'test' } } });
    assert.equal(JSON.parse(bench.result.content[0].text).measured.views, 1);
    const bad = await ask(5, 'tools/call', { name: 'lint_project', arguments: { files: [] } });
    assert.equal(bad.result.isError, true);
    const unknown = await ask(6, 'tools/call', { name: 'nope', arguments: {} });
    assert.equal(unknown.error.code, -32602);
    const ping = await ask(7, 'ping', {});
    assert.deepEqual(ping.result, {});
  } finally {
    child.stdin.end(); child.kill();
  }
});
