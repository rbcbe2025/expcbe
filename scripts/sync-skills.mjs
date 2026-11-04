#!/usr/bin/env node
// sync-skills.mjs [--check] — the only way a skill enters this plugin.
// Reads the hub's built index (public/public/skills/index.json), checks each .skill zip against the sha256 the index
// records, unpacks it into plugins/cloudbackend/skills/<name>/, removes skills the index no longer lists, and writes
// plugins/cloudbackend/SKILLS.json (provenance: version, content hash and sha256 per skill; `generated` is the
// index's build date, so a resync on another day changes nothing). --check writes nothing and exits 1 on any
// difference between that result and what is on disk. A sha256 that differs from the index exits 1 in both modes:
// the index is stale, and the skills must be rebuilt in the hub first.
import {existsSync, readFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {PLUGIN_DIR, SKILLS_INDEX, readJson, writeText, sha256, unzip, listFiles, fail} from './lib.mjs';

const check = process.argv.includes('--check');
const SKILLS_DIR = path.join(PLUGIN_DIR, 'skills');
const PROVENANCE = path.join(PLUGIN_DIR, 'SKILLS.json');
const NAME = /^[a-z0-9][a-z0-9-]*$/;

if (!existsSync(SKILLS_INDEX)) fail(`no skills index at ${SKILLS_INDEX}: build the skills in the documentation hub first`);
const index = readJson(SKILLS_INDEX);
const expected = new Map();                                  // "<name>/<rel>" → Buffer
const provenance = {generated: index.generated, skills: []};
const problems = [];
for (const entry of index.skills || []) {
  const {name, file} = entry;
  if (!NAME.test(String(name)) || file !== `${name}.skill`) { problems.push(`${name}: unexpected name or file (${file})`); continue; }
  const zipFile = path.join(path.dirname(SKILLS_INDEX), file);
  if (!existsSync(zipFile)) { problems.push(`${name}: ${file} is missing next to the index`); continue; }
  const buf = readFileSync(zipFile);
  const digest = sha256(buf);
  if (digest !== entry.sha256) {
    problems.push(`${name}: ${file} is sha256 ${digest.slice(0, 12)}…, the index says ${String(entry.sha256).slice(0, 12)}…: stale index, rebuild the skills`);
    continue;
  }
  let entries;
  try { entries = unzip(buf); } catch (e) { problems.push(`${name}: ${e.message}`); continue; }
  for (const {name: entryName, data} of entries) {
    const inside = entryName.startsWith(`${name}/`) && !entryName.split('/').some(seg => seg === '..' || seg === '') && !entryName.includes('\\');
    if (!inside) { problems.push(`${name}: zip entry outside the skill folder: ${entryName}`); continue; }
    expected.set(entryName, data);
  }
  if (!expected.has(`${name}/SKILL.md`)) problems.push(`${name}: no SKILL.md in ${file}`);
  provenance.skills.push({name, version: entry.version, content_hash: entry.content_hash, sha256: entry.sha256, files: entries.length});
}
if (!provenance.skills.length) problems.push('the index lists no skills');
if (problems.length) fail(`sync-skills: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);

const provText = JSON.stringify(provenance, null, 2) + '\n';
const diffs = [];
for (const rel of existsSync(SKILLS_DIR) ? listFiles(SKILLS_DIR) : []) if (!expected.has(rel)) diffs.push(`extra: skills/${rel}`);
for (const [rel, data] of expected) {
  const file = path.join(SKILLS_DIR, rel);
  if (!existsSync(file)) diffs.push(`missing: skills/${rel}`);
  else if (!readFileSync(file).equals(data)) diffs.push(`differs: skills/${rel}`);
}
if (!existsSync(PROVENANCE)) diffs.push('missing: SKILLS.json');
else if (readFileSync(PROVENANCE, 'utf8') !== provText) diffs.push('differs: SKILLS.json');

const summary = `${provenance.skills.length} skills, ${expected.size} files, index generated ${index.generated}`;
if (check) {
  if (diffs.length) fail(`skills drift from the index (${diffs.length}):\n  ${diffs.join('\n  ')}\nrun: node scripts/sync-skills.mjs`);
  console.log(`skills in step with the index: ${summary}`);
  process.exit(0);
}
if (!diffs.length) { console.log(`skills already in step with the index: ${summary}`); process.exit(0); }
rmSync(SKILLS_DIR, {recursive: true, force: true});          // generated: replaced wholesale, which also prunes
for (const [rel, data] of expected) writeText(path.join(SKILLS_DIR, rel), data);
writeText(PROVENANCE, provText);
for (const s of provenance.skills) console.log(`  ✓ ${s.name} ${s.version} (${s.files} files, content ${s.content_hash})`);
console.log(`synced ${summary}; ${diffs.length} change(s); SKILLS.json written`);
