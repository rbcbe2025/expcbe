#!/usr/bin/env node
// guard.mjs — nothing in this repository may carry what the documentation hub's publication guard forbids: workspace
// paths, test-tenant hosts, and (in our own wording) the terms the vocabulary replaces or XIOS/3 misspelled. It runs
// the hub's own guard module (public/scripts/extension/guard.mjs, which reads _tools/publication-guard.json and every
// corpus.json for the test hosts) over every text file here, dist/ included when present. The developer portal's
// host, a test tenant until the portal moves to a public domain, is allowed under the plugin's skills/ only: that
// is where the hub allows it too. Also refuses what breaks an install: a top-level bin/ (blocks the claude.ai sync)
// or node_modules/ in the plugin. 0 problems or exit 1.
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT, PLUGIN_DIR, HUB, listFiles, readJson, fail} from './lib.mjs';

const guardModule = path.join(HUB, 'public', 'scripts', 'extension', 'guard.mjs');
if (!existsSync(guardModule)) fail(`the hub's guard module is not at ${guardModule} (set CBE_DOCS_HUB)`);
const {loadPublicationGuard, findLeaks, namingProblems} = await import(pathToFileURL(guardModule).href);
const guard = loadPublicationGuard(HUB);
const replace = readJson(path.join(HUB, '_vocabulary', 'terms.json')).replace || {};

const TEXT = /\.(md|txt|json|mjs|js|cjs|ts|sh|toml|xml|xsl|xsd|css|html|svg|py|ya?ml|csv|tsv)$/i;
const skip = rel => rel === '.git' || rel === 'node_modules' || rel === 'evals/results' || rel.endsWith('/node_modules');
const skillsPrefix = path.relative(ROOT, path.join(PLUGIN_DIR, 'skills')) + '/';
const problems = [];
let checked = 0;
for (const rel of listFiles(ROOT, {skip})) {
  const buf = readFileSync(path.join(ROOT, rel));
  const extensionless = !path.basename(rel).includes('.');
  if (!TEXT.test(rel) && !(extensionless && !buf.includes(0))) continue;
  checked++;
  const text = buf.toString('utf8');
  const inSkills = rel.startsWith(skillsPrefix);
  for (const leak of findLeaks(text, guard)) {
    if (inSkills && leak.kind === 'test host' && (guard.skillsAllowHosts || []).includes(String(leak.match).toLowerCase())) continue;
    problems.push(`${rel}: ${leak.kind} ${leak.match}`);
  }
  if (!inSkills) for (const p of namingProblems(text, replace)) problems.push(`${rel}: ${p}`);   // our wording; the skills are published documentation, guarded at their build
}
if (existsSync(path.join(PLUGIN_DIR, 'bin'))) problems.push('plugins/cloudbackend/bin/: a top-level bin/ blocks the claude.ai sync');
if (existsSync(path.join(PLUGIN_DIR, 'node_modules'))) problems.push('plugins/cloudbackend/node_modules/: dependencies are never shipped');

if (problems.length) fail(`${problems.length} problem(s) in ${checked} text files:\n  ${problems.join('\n  ')}`);
console.log(`0 problems in ${checked} text files (the hub's guard: ${guard.literals.length} literals, ${guard.patterns.length} patterns, ${guard.testHosts.size} test hosts, ${Object.keys(replace).length} replaced terms)`);
