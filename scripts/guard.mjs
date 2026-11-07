#!/usr/bin/env node
// guard.mjs — nothing in this repository may carry what the documentation hub's publication guard forbids: workspace
// paths, test-tenant hosts, and (in our own wording) the terms the vocabulary replaces or XIOS/3 misspelled. It runs
// the hub's own guard module (public/scripts/extension/guard.mjs, which reads _tools/publication-guard.json and every
// corpus.json for the test hosts) over every text file here, dist/ included when present.
// The developer portal's host is a test tenant until the portal moves to a public domain. The hub allows it in skill
// material (publication-guard.json skills_allow_hosts); here it is allowed where the plugin is served from the portal
// or reads it: the skills, the vendored documentation server (built and guarded in the hub, it reads the portal),
// dist/ (the marketplace and index the portal serves), the plugin README, this repository's README and RELEASES.md.
// Everywhere else it is a leak. Vendored material (skills/, servers/, _archive/, the generated eval cases, which quote
// the skills' own evals verbatim) is not our wording, so the naming check skips it; a term to fix there is fixed at its
// source. The leak checks (paths, hosts) run everywhere.
// Also refuses what breaks an install or a publication: a top-level bin/ (blocks the claude.ai sync), node_modules/,
// bytecode caches or a virtual environment inside the plugin, and any mention of the deploy host beyond its per-tenant
// form (the documentation and build servers run inside the plugin; nothing may point at a hosted /docs, /build or
// /plugin there). 0 problems or exit 1.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT, PLUGIN_DIR, HUB, HOST, CACHE, listFiles, readJson, fail} from './lib.mjs';

const guardModule = path.join(HUB, 'public', 'scripts', 'extension', 'guard.mjs');
if (!existsSync(guardModule)) fail(`the hub's guard module is not at ${guardModule} (set CBE_DOCS_HUB)`);
const {loadPublicationGuard, findLeaks, namingProblems} = await import(pathToFileURL(guardModule).href);
const guard = loadPublicationGuard(HUB);
const replace = readJson(path.join(HUB, '_vocabulary', 'terms.json')).replace || {};

const TEXT = /\.(md|txt|json|mjs|js|cjs|ts|sh|toml|xml|xsl|xsd|css|html|svg|py|ya?ml|csv|tsv|cfg|ini|in|jsonl)$/i;
const plugin = rel => path.relative(ROOT, path.join(PLUGIN_DIR, rel));
const skip = rel => rel === '.git' || rel === 'node_modules' || rel === 'evals/results' || rel.endsWith('/node_modules') || rel.endsWith('/evals/results') || rel === plugin('.data');   // .data: an environment made by hand for another client, ignored by git and never packed
const skillsPrefix = plugin('skills') + '/';
const serversPrefix = plugin('servers') + '/';
const docsServerPrefix = plugin('servers/docs') + '/';
const evalsPrefix = 'evals/cases/';
const vendored = rel => rel.startsWith(skillsPrefix) || rel.startsWith(serversPrefix) || rel.startsWith('_archive/') || rel.startsWith(evalsPrefix);   // the eval cases (evals/cases/, outside the plugin) carry the skills' own evals verbatim; _archive/ holds superseded copies
const portalAllowed = rel => rel.startsWith(skillsPrefix) || rel.startsWith(docsServerPrefix) || rel.startsWith('dist/')
  || rel === plugin('README.md') || rel === 'README.md' || rel === 'RELEASES.md';
const hostEscape = HOST.replace(/^https?:\/\//, '').replace(/\./g, '\\.');
const HOSTED = new RegExp(`${hostEscape}/(?!mcp/)[a-z]`, 'i');                 // the deploy host used for anything but /mcp/<tenant>
const problems = [];
let checked = 0;
for (const rel of listFiles(ROOT, {skip})) {
  const buf = readFileSync(path.join(ROOT, rel));
  const extensionless = !path.basename(rel).includes('.');
  if (!TEXT.test(rel) && !(extensionless && !buf.includes(0))) continue;
  checked++;
  const text = buf.toString('utf8');
  for (const leak of findLeaks(text, guard)) {
    if (leak.kind === 'test host' && portalAllowed(rel) && (guard.skillsAllowHosts || []).includes(String(leak.match).toLowerCase())) continue;
    problems.push(`${rel}: ${leak.kind} ${leak.match}`);
  }
  if (!vendored(rel)) for (const p of namingProblems(text, replace)) problems.push(`${rel}: ${p}`);   // our wording; vendored material is guarded at its build
  if (!rel.startsWith(skillsPrefix) && HOSTED.test(text)) problems.push(`${rel}: names ${HOST} beyond its per-tenant /mcp/ form (${HOSTED.exec(text)[0]}…): the documentation and build servers run inside the plugin`);
}
if (existsSync(path.join(PLUGIN_DIR, 'bin'))) problems.push('plugins/cloudbackend/bin/: a top-level bin/ blocks the claude.ai sync');
if (existsSync(path.join(PLUGIN_DIR, 'node_modules'))) problems.push('plugins/cloudbackend/node_modules/: dependencies are never shipped');
// Caches and environments are skipped by listFiles, so look for them on purpose: none may sit inside the plugin.
const findCaches = (dir, rel = '') => readdirSync(dir).flatMap(name => {
  const child = rel ? `${rel}/${name}` : name;
  if (child === '.data') return [];                        // the by-hand environment (clients/README.md): ignored by git, never packed
  if (CACHE(name)) return [child];
  return statSync(path.join(dir, name)).isDirectory() ? findCaches(path.join(dir, name), child) : [];
});
for (const c of findCaches(PLUGIN_DIR)) problems.push(`plugins/cloudbackend/${c}: a build cache or an installed environment inside the plugin`);
// The plugin's .mcp.json: a remote entry may only be CloudBackend's per-tenant deploy server.
const mcp = path.join(PLUGIN_DIR, '.mcp.json');
if (existsSync(mcp)) for (const [name, s] of Object.entries(readJson(mcp).mcpServers || {})) {
  if (s.url && !s.url.startsWith(`${HOST}/mcp/`)) problems.push(`.mcp.json ${name}: remote url ${s.url} is not the per-tenant deploy form`);
  if (s.command && /^https?:/.test(s.command)) problems.push(`.mcp.json ${name}: a command that is a URL`);
}

if (problems.length) fail(`${problems.length} problem(s) in ${checked} text files:\n  ${problems.join('\n  ')}`);
console.log(`0 problems in ${checked} text files (the hub's guard: ${guard.literals.length} literals, ${guard.patterns.length} patterns, ${guard.testHosts.size} test hosts, ${Object.keys(replace).length} replaced terms)`);
