#!/usr/bin/env node
// sync-servers.mjs [--check] [--only docs|build] — the only way a server enters this plugin.
//   docs   the documentation server: the hub's staged Claude Desktop extension server (public/dist/mcpb/cloudbackend-docs/
//          server/: index.mjs with the portal address filled in, search-core.mjs, xios3-reference.mjs; built there by
//          scripts/build-mcpb.mjs and guarded there) → plugins/cloudbackend/servers/docs/
//   build  the build server: the cbemcp-build package next to this repo (or CBE_BUILD_SRC): its package (src/cbemcp_build
//          or cbemcp_build at the top), requirements.txt, and the tenant grammar, the XSDs and the design kit it carries
//          → plugins/cloudbackend/servers/build/ (the package under src/, so .mcp.json's PYTHONPATH finds it)
// Each destination gets a VENDORED_FROM marker (what, which commit, when) and MANIFEST.sha256 (one line per file).
// Copies nothing from node_modules, .venv or __pycache__ (caches and installed environments are not source), and
// refuses the whole sync when a copied text file carries what the hub's publication guard forbids (a workspace path,
// a test-tenant host): the plugin is published, so a provenance note upstream must do without them.
// A source that is not there yet is reported with the path expected, exit 1. --check writes nothing and exits 1 on
// any difference between the sources and what is on disk.
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, rmSync, statSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {PLUGIN_DIR, HUB, DOCS_SERVER_SRC, BUILD_SERVER_SRC, SERVERS, listFiles, readJson, sha256, writeText, isoDate, fail} from './lib.mjs';

// The hub's publication guard decides what a copied file may not say: its internal path literals and patterns (a
// home directory, a mounted volume, the workspace's project names) and the test-tenant hosts. The documentation
// server may name the developer portal (it reads it); nothing else may name any of them.
const guardModule = path.join(HUB, 'public', 'scripts', 'extension', 'guard.mjs');
if (!existsSync(guardModule)) fail(`the hub's guard module is not at ${guardModule} (set CBE_DOCS_HUB)`);
const {loadPublicationGuard, findLeaks} = await import(pathToFileURL(guardModule).href);
const guard = loadPublicationGuard(HUB);

const args = process.argv.slice(2);
const check = args.includes('--check');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
if (only && !['docs', 'build'].includes(only)) fail('--only takes docs or build');
const TEXT = /\.(md|txt|json|mjs|js|cjs|py|sh|toml|xml|xsl|xsd|css|html|svg|ya?ml|csv|cfg|ini|in)$/i;
const SKIP = rel => /(^|\/)(node_modules|\.venv|venv|__pycache__|\.git|\.pytest_cache|\.mypy_cache|\.ruff_cache|tests?)(\/|$)/.test(rel) || /\.pyc$/.test(rel) || /\.egg-info(\/|$)/.test(rel);

const gitInfo = dir => {
  try {
    const top = execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
    const sha = execFileSync('git', ['-C', dir, 'rev-parse', '--short=12', 'HEAD'], {encoding: 'utf8'}).trim();
    const dirty = execFileSync('git', ['-C', dir, 'status', '--porcelain', '--', path.relative(top, dir) || '.'], {encoding: 'utf8'}).trim() ? ' (with uncommitted changes)' : '';
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

function planBuild() {
  const src = BUILD_SERVER_SRC;
  const problems = [];
  if (!existsSync(src)) return {problems: [`the build server's package is not at ${src} (set CBE_BUILD_SRC): the cbemcp-build extraction has not landed yet`]};
  const pkgIn = ['src/cbemcp_build', 'cbemcp_build'].find(p => existsSync(path.join(src, p, '__init__.py')));
  if (!pkgIn) problems.push(`${src}: no cbemcp_build package (src/cbemcp_build/__init__.py or cbemcp_build/__init__.py)`);
  else if (!existsSync(path.join(src, pkgIn, '__main__.py'))) problems.push(`${src}/${pkgIn}: no __main__.py, so \`python -m cbemcp_build\` cannot serve stdio`);
  const req = ['requirements.txt'].find(p => existsSync(path.join(src, p)));
  if (!req) problems.push(`${src}: no requirements.txt (the hook installs it into the plugin's data directory)`);
  if (problems.length) return {problems};
  const entries = [];
  const add = (fromRel, toRel) => {
    const from = path.join(src, fromRel);
    if (statSync(from).isDirectory()) for (const rel of listFiles(from, {skip: SKIP})) entries.push({rel: `${toRel}/${rel}`, data: readFileSync(path.join(from, rel)), mode: statSync(path.join(from, rel)).mode});
    else entries.push({rel: toRel, data: readFileSync(from), mode: statSync(from).mode});
  };
  add(pkgIn, 'src/cbemcp_build');
  add(req, 'requirements.txt');
  for (const extra of ['README.md', 'LICENSE', 'pyproject.toml']) if (existsSync(path.join(src, extra))) add(extra, extra);
  // What the package must carry: the tenant grammar, the schemas and the design kit. Inside the package they travel
  // with it; at the top of cbemcp-build they are copied beside src/.
  const carried = {'tenant-grammar.json': /(^|\/)tenant-grammar\.json$/, 'XSDs': /\.xsd$/, 'design kit': /(^|\/)designkit\//};
  for (const [what, re] of Object.entries(carried)) {
    if (entries.some(e => re.test(e.rel))) continue;
    const top = listFiles(src, {skip: SKIP}).filter(rel => re.test(rel) && !rel.startsWith('src/'));
    if (top.length) for (const rel of top) add(rel, rel);
    else problems.push(`${src}: the ${what} is neither in the package nor at the top; the build tools need it`);
  }
  if (problems.length) return {problems};
  const marker = ['VENDORED_FROM: the cbemcp-build package, extracted from the deploy server\'s codebase (mcp-cloudbackend/cbemcp-build),',
    'the lint, scaffold and benchmark tools with the tenant grammar, the schemas and the design kit they read.',
    `Source: ${gitInfo(src)}. Synced ${isoDate()} by scripts/sync-servers.mjs; never edited here.`,
    'Served by `python -m cbemcp_build` over stdio from src/ (PYTHONPATH in the plugin\'s .mcp.json); its dependencies',
    'are installed by hooks/hooks.json (scripts/ensure-build-venv.sh) from requirements.txt.', ''].join('\n');
  return {entries, marker, summary: `${entries.length} files from ${pkgIn}`};
}

const plans = {docs: planDocs, build: planBuild};
let failed = 0, changed = 0;
for (const key of Object.keys(plans).filter(k => !only || k === only)) {
  const dest = path.join(PLUGIN_DIR, 'servers', key);
  const plan = plans[key]();
  if (plan.problems) { failed++; console.log(`✗ ${key}: ${plan.problems.join('\n    ')}`); continue; }
  const leaks = [];
  for (const e of plan.entries) {
    if (!TEXT.test(e.rel)) continue;
    for (const l of findLeaks(e.data.toString('utf8'), guard)) {
      if (key === 'docs' && l.kind === 'test host' && (guard.skillsAllowHosts || []).includes(String(l.match).toLowerCase())) continue;
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
