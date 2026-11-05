#!/usr/bin/env node
// gen-evals.mjs [--check] — the eval cases `claude plugin eval` grades, one per entry of each skill's own evals:
//   plugins/cloudbackend/evals/<skill>-<id>/prompt.md        the prompt, verbatim, with the case's frontmatter
//   plugins/cloudbackend/evals/<skill>-<id>/graders/assertions.md   an `llm` grader over the run's trace listing the assertions
//   plugins/cloudbackend/evals/<skill>-<id>/graders/uses-skill.md   a `tool_used` grader for Skill, with-only, when the prompt names the skill
//   plugins/cloudbackend/evals/<skill>-<id>/graders/baseline.md     on BASELINE_CASES, when evals/baselines/<case>.jsonl exists here
// The source is the hub's _skills/<skill>/evals/evals.json for each skill in SKILLS.json: the skills' own test material,
// which the hub does not build into the .skill packages, so it is the one read of the hub's _skills/ this repository
// makes (CLAUDE.md). The eval tree is generated wholesale: everything but README.md, results/ and mocks/ is replaced.
// --check writes nothing and exits 1 on any difference.
import {existsSync, readFileSync, readdirSync, rmSync, statSync} from 'node:fs';
import path from 'node:path';
import {ROOT, PLUGIN_DIR, HUB, listFiles, readJson, writeText, fail} from './lib.mjs';

const check = process.argv.includes('--check');
const EVALS_DIR = path.join(PLUGIN_DIR, 'evals');
const BASELINES = path.join(ROOT, 'evals', 'baselines');
const BASELINE_CASES = ['xios3-app-workflow-2', 'cloudbackend-rest-api-1'];
const KEEP = new Set(['README.md', 'results', 'mocks']);
const provenance = readJson(path.join(PLUGIN_DIR, 'SKILLS.json'));

const yamlList = items => `[${items.join(', ')}]`;
const expected = new Map();                                  // rel path under evals/ → text
const notes = [];
let cases = 0, skillGraders = 0, baselines = 0;
for (const {name: skill} of provenance.skills) {
  const file = path.join(HUB, '_skills', skill, 'evals', 'evals.json');
  if (!existsSync(file)) { notes.push(`${skill}: no evals.json in the hub (${path.relative(HUB, file)}); no cases`); continue; }
  const spec = readJson(file);
  if (spec.skill_name && spec.skill_name !== skill) fail(`${file}: skill_name is ${spec.skill_name}, expected ${skill}`);
  for (const e of spec.evals || []) {
    const id = `${skill}-${e.id}`;
    if (!/^[a-z0-9-]+$/.test(id)) fail(`${file}: case id ${id} is not [a-z0-9-]`);
    if (!e.prompt || !Array.isArray(e.assertions) || !e.assertions.length) fail(`${file}: eval ${e.id} has no prompt or no assertions`);
    if (e.files && e.files.length) notes.push(`${id}: ${e.files.length} input file(s) in evals.json are not carried (no case.yaml context yet)`);
    cases++;
    expected.set(`${id}/prompt.md`, `---
name: ${id}
tags: ${yamlList([skill])}
max_turns: 25
allowed_tools: ${yamlList(['Read', 'Glob', 'Grep', 'Skill'])}
---

${e.prompt.trim()}
`);
    expected.set(`${id}/graders/assertions.md`, `---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: ${e.expected_output ? e.expected_output.trim() : '(as the assertions say)'}

Assertions:
${e.assertions.map(a => `- ${a.trim()}`).join('\n')}
`);
    if (e.prompt.includes(skill)) {
      skillGraders++;
      expected.set(`${id}/graders/uses-skill.md`, `---
type: tool_used
tool: Skill
input_match: '"skill"\\s*:\\s*"(?:[\\w-]+:)?${skill}"'
arm: with-only
---

The prompt names the skill, so the run with the plugin must load it (an indicator, not part of the score).
`);
    }
    if (BASELINE_CASES.includes(id)) {
      const transcript = path.join(BASELINES, `${id}.jsonl`);
      if (!existsSync(transcript)) { notes.push(`${id}: no reference transcript at evals/baselines/${id}.jsonl, so no baseline grader yet`); continue; }
      baselines++;
      expected.set(`${id}/baseline.jsonl`, readFileSync(transcript, 'utf8'));
      expected.set(`${id}/graders/baseline.md`, `---
type: baseline
baseline_file: baseline.jsonl
---

The run satisfies the expected output at least as well as the reference transcript: ${e.expected_output ? e.expected_output.trim() : e.assertions.join('; ')}
`);
    }
  }
}
for (const c of BASELINE_CASES) if (!expected.has(`${c}/prompt.md`)) fail(`baseline case ${c} does not exist in the skills' evals`);

const diffs = [];
const present = existsSync(EVALS_DIR) ? listFiles(EVALS_DIR, {skip: rel => KEEP.has(rel.split('/')[0])}) : [];
for (const rel of present) if (!expected.has(rel)) diffs.push(`extra: ${rel}`);
for (const [rel, text] of expected) {
  const file = path.join(EVALS_DIR, rel);
  if (!existsSync(file)) diffs.push(`missing: ${rel}`);
  else if (readFileSync(file, 'utf8') !== text) diffs.push(`differs: ${rel}`);
}
const summary = `${cases} cases from ${provenance.skills.length} skills (${skillGraders} with a Skill grader, ${baselines} with a baseline grader)`;
for (const n of notes) console.log(`  · ${n}`);
if (check) {
  if (diffs.length) fail(`evals drift from the skills' evals.json (${diffs.length}):\n  ${diffs.join('\n  ')}\nrun: node scripts/gen-evals.mjs`);
  console.log(`evals in step: ${summary}`);
  process.exit(0);
}
if (!diffs.length) { console.log(`evals already in step: ${summary}`); process.exit(0); }
if (existsSync(EVALS_DIR)) for (const name of readdirSync(EVALS_DIR)) if (!KEEP.has(name) && !/^\./.test(name)) rmSync(path.join(EVALS_DIR, name), {recursive: true, force: true});
for (const [rel, text] of expected) writeText(path.join(EVALS_DIR, rel), text);
console.log(`wrote ${summary}; ${diffs.length} change(s)`);
