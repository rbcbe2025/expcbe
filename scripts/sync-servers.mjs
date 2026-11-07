#!/usr/bin/env node
// sync-servers.mjs [--check] — the only way the documentation server, and the build server's golden lint fixture,
// enter this plugin.
//   docs          the hub's staged Claude Desktop extension server (public/dist/mcpb/cloudbackend-docs/server/: index.mjs
//                 with the portal address filled in, search-core.mjs, xios3-reference.mjs; built there by
//                 scripts/build-mcpb.mjs and guarded there) -> plugins/cloudbackend/servers/docs/
//   build/golden  cbemcp-build's golden lint fixture (lib.mjs GOLDEN_SRC: a package, and the findings and rule table the
//                 Python reference gives it) -> plugins/cloudbackend/servers/build/golden/, read by servers/build/test.mjs
// The build server itself (servers/build/) is authored in this repository and is not synced. Each destination gets a
// VENDORED_FROM marker (what, which commit, when) and MANIFEST.sha256 (one line per file). Copies nothing from
// node_modules, .venv or __pycache__, and refuses the whole sync when a copied text file carries what the hub's
// publication guard forbids (a workspace path, a test-tenant host other than the portal's): the plugin is published.
// A source that is not there yet is reported with the path expected, exit 1. --check writes nothing and exits 1 on
// any difference between the source and what is on disk.
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, rmSync, statSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {PLUGIN_DIR, HUB, DOCS_SERVER_SRC, GOLDEN_SRC, SERVERS, listFiles, sha256, writeText, isoDate, fail} from './lib.mjs';

// The hub's publication guard decides what a copied file may not say: its internal path literals and patterns (a
// home directory, a mounted volume, the workspace's project names) and the test-tenant hosts. The documentation
// server may name the developer portal (it reads it); nothing else may name any of them.
const guardModule = path.join(HUB, 'public', 'scripts', 'extension', 'guard.mjs');
if (!existsSync(guardModule)) fail(`the hub's guard module is not at ${guardModule} (set CBE_DOCS_HUB)`);
const {loadPublicationGuard, findLeaks} = await import(pathToFileURL(guardModule).href);
const guard = loadPublicationGuard(HUB);

const check = process.argv.includes('--check');
const TEXT = /\.(md|txt|json|mjs|js|cjs|py|sh|toml|xml|xsl|xsd|css|html|svg|ya?ml|csv|cfg|ini|in)$/i;
const SKIP = rel => /(^|\/)(node_modules|\.venv|venv|__pycache__|\.git|\.pytest_cache|\.mypy_cache|\.ruff_cache|tests?)(\/|$)/.test(rel) || /\.pyc$/.test(rel) || /\.egg-info(\/|$)/.test(rel);

const gitInfo = dir => {
  try {
    const top = execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
    const sha = execFileSync('git', ['-C', dir, 'rev-parse', '--short=12', 'HEAD'], {encoding: 'utf8'}).trim();
    const dirty = execFileSync('git', ['-C', top, 'status', '--porcelain', '--', path.relative(top, dir) || '.'], {encoding: 'utf8'}).trim() ? ' (with uncommitted changes)' : '';
    return `${path.basename(top)} commit ${sha}${dirty}`;
  } catch { return 'no git information'; }
};

/** Plan one server: [{rel, data, mode}] from its source, or a list of problems. */
function planDocs() {
  const src = DOCS_SERVER_SRC;
  if (!existsSync(path.join(src, 'index.mjs'))) return {problems: [`the staged documentation server is not at ${src}/index.mjs: run \`node scripts/build-mcpb.mjs\` in the hub's public/ first`]};
  const files = listFiles(src, {skip: SKIP});
  const index = readFileSync(path.join(src, 'index.mjs'), 'utf8');
  const problems = [];
  for (const m of index.matchAll(/from\s+'\.\/([^']+)'/g)) if (!files.includes(m[1])) problems.push(`index.mjs imports ./${m[1]}, which is not staged next to it: the stage is incomplete`);
  const tools = new Set([...index.matchAll(/\b(cloudbackend_[a-z_]+|xios3_[a-z_]+)\b/g)].map(m => m[1]));
  const expected = SERVERS.find(s => s.key === 'docs').tools;
  if (tools.size < expected) problems.push(`index.mjs names ${tools.size} tools, the plugin expects ${expected}: the stage predates the XIOS/3 lookups`);
  if (problems.length) return {problems};
  const entries = files.map(rel => ({rel, data: readFileSync(path.join(src, rel)), mode: statSync(path.join(src, rel)).mode}));
  const marker = ['VENDORED_FROM: the documentation hub\'s staged Claude Desktop extension server (public/dist/mcpb/cloudbackend-docs/server/),',
    'built there by scripts/build-mcpb.mjs with the developer portal\'s address filled in and checked with its publication guard.',
    `Source: ${gitInfo(src)}. Synced ${isoDate()} by scripts/sync-servers.mjs; never edited here.`,
    `Tools: ${[...tools].sort().join(', ')}.`, ''].join('\n');
  return {entries, marker, summary: `${files.length} files, ${tools.size} tools`};
}

/** The build server's golden lint fixture, as cbemcp-build's tests write it: package/, expected.json, README.md. */
function planGolden() {
  const src = GOLDEN_SRC;
  if (!existsSync(path.join(src, 'expected.json'))) return {problems: [`cbemcp-build's golden lint fixture is not at ${src}/expected.json (set CBEMCP_BUILD to the cbemcp-build folder)`]};
  const files = listFiles(src, {skip: SKIP});
  if (!files.some(rel => rel === 'package/index.xml')) return {problems: [`${src} has no package/index.xml: not the golden fixture`]};
  const cases = JSON.parse(readFileSync(path.join(src, 'expected.json'), 'utf8')).cases.map(c => c.name);
  const entries = files.map(rel => ({rel, data: readFileSync(path.join(src, rel)), mode: statSync(path.join(src, rel)).mode}));
  const marker = ['VENDORED_FROM: cbemcp-build\'s golden lint fixture (tests/golden/ in the deploy server\'s codebase, the Python',
    'reference implementation of lint_project): a package with a trap for most rules, the findings the reference gives it per case,',
    'and the rule table of its tenant-grammar.json. Read by test.mjs next to this folder.',
    `Source: ${gitInfo(src)}. Synced ${isoDate()} by scripts/sync-servers.mjs; never edited here.`,
    `Cases: ${cases.join(', ')}.`, ''].join('\n');
  return {entries, marker, summary: `${files.length} files, ${cases.length} cases`};
}

const plans = {docs: planDocs, 'build/golden': planGolden};
let failed = 0, changed = 0;
for (const key of Object.keys(plans)) {
  const dest = path.join(PLUGIN_DIR, 'servers', key);
  const plan = plans[key]();
  if (plan.problems) { failed++; console.log(`✗ ${key}: ${plan.problems.join('\n    ')}`); continue; }
  const leaks = [];
  for (const e of plan.entries) {
    if (!TEXT.test(e.rel)) continue;
    for (const l of findLeaks(e.data.toString('utf8'), guard)) {
      if (l.kind === 'test host' && (guard.skillsAllowHosts || []).includes(String(l.match).toLowerCase())) continue;   // the docs server reads the portal
      leaks.push(`${e.rel}: ${l.kind} ${l.match}`);
    }
  }
  if (leaks.length) { failed++; console.log(`✗ ${key}: refused, the publication guard finds ${leaks.length} leak(s); fix the wording at the source:\n    ${leaks.join('\n    ')}`); continue; }
  const caches = plan.entries.filter(e => /(^|\/)__pycache__(\/|$)|\.pyc$/.test(e.rel)).map(e => e.rel);
  if (caches.length) { failed++; console.log(`✗ ${key}: refused, bytecode caches in ${caches.join(', ')}`); continue; }
  // The expected tree: the files, the marker (its "Synced" date is kept when the files are unchanged), the manifest.
  const manifest = plan.entries.map(e => `${sha256(e.data)}  ${e.rel}`).sort((a, b) => a.slice(66) < b.slice(66) ? -1 : 1).join('\n') + '\n';
  const expected = new Map(plan.entries.map(e => [e.rel, e]));
  expected.set('MANIFEST.sha256', {rel: 'MANIFEST.sha256', data: Buffer.from(manifest), mode: 0o644});
  const markerFile = path.join(dest, 'VENDORED_FROM');
  const diffs = [];
  for (const rel of existsSync(dest) ? listFiles(dest) : []) if (!expected.has(rel) && rel !== 'VENDORED_FROM') diffs.push(`extra: ${rel}`);
  for (const [rel, e] of expected) {
    const file = path.join(dest, rel);
    if (!existsSync(file)) diffs.push(`missing: ${rel}`);
    else if (!readFileSync(file).equals(e.data)) diffs.push(`differs: ${rel}`);
  }
  if (!existsSync(markerFile)) diffs.push('missing: VENDORED_FROM');
  else {
    const old = readFileSync(markerFile, 'utf8');
    const sameButDate = old.replace(/Synced \d{4}-\d{2}-\d{2}/, 'Synced DATE').replace(/commit [0-9a-f]+( \(with uncommitted changes\))?/, 'commit SHA');
    const now = plan.marker.replace(/Synced \d{4}-\d{2}-\d{2}/, 'Synced DATE').replace(/commit [0-9a-f]+( \(with uncommitted changes\))?/, 'commit SHA');
    if (sameButDate !== now) diffs.push('differs: VENDORED_FROM');
  }
  if (!diffs.length) { console.log(`✓ ${key}: in step with its source (${plan.summary})`); continue; }
  changed++;
  if (check) { console.log(`✗ ${key}: drifts from its source (${diffs.length}):\n    ${diffs.join('\n    ')}`); continue; }
  rmSync(dest, {recursive: true, force: true});                // vendored: replaced wholesale, which also prunes
  for (const [rel, e] of expected) writeText(path.join(dest, rel), e.data);
  writeText(markerFile, plan.marker);
  console.log(`✓ ${key}: synced ${plan.summary}; ${diffs.length} change(s)\n    ${diffs.slice(0, 12).join('\n    ')}${diffs.length > 12 ? `\n    … ${diffs.length - 12} more` : ''}`);
}
if (check && changed) fail('run: node scripts/sync-servers.mjs');
if (failed) process.exit(1);
