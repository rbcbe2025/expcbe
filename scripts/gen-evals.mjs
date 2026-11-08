#!/usr/bin/env node
// gen-evals.mjs [--check] — the eval cases `claude plugin eval` grades, one per entry of each skill's own evals:
//   evals/cases/<skill>-<id>/prompt.md        the prompt, verbatim, with the case's frontmatter
//   evals/cases/<skill>-<id>/graders/assertion-NN.md   one `llm` grader per assertion, so a run scores
//                                                            the fraction of assertions it meets and the report names the missing ones
//   evals/cases/<skill>-<id>/graders/uses-skill.md   a `tool_used` grader for Skill, with-only, when the prompt names the skill
//   evals/cases/<skill>-<id>/graders/baseline.md     on BASELINE_CASES, when evals/baselines/<case>.jsonl exists here
//   evals/cases/<case>/case.yaml, scaffold.sh  on the cases in FIXTURES: the scaffold copies the files the prompt
//                                                            takes for granted, evals/cases/_fixtures/<fixture>/ (one copy
//                                                            of evals/fixtures/ here), into the run's working directory before the agent
//                                                            starts (needs --scaffold, as scripts/run-evals.mjs passes)
//   evals/cases/<case>/mocks/cloudbackend-tenant/_server.md   on SIGNED_OUT_CASES: the tenant stand-in, starting signed out
// The cases live outside the plugin, so an install never carries them: scripts/run-evals.mjs copies the plugin and the
// cases it runs into one temporary folder (evals/ below the plugin, where `claude plugin eval` looks).
// The source is the hub's _skills/<skill>/evals/evals.json for each skill in SKILLS.json: the skills' own test material,
// which the hub does not build into the .skill packages, so it is the one read of the hub's _skills/ this repository
// makes (CLAUDE.md). evals/cases/ is generated and kept equal to it.
// evals/mocks/ is hand-written (the stand-ins for the servers a run must not reach), except each stdio stand-in's _tools.json,
// which this script refreshes from the real server's tools/list so the stand-in shows the real descriptions and schemas.
// --check writes nothing and exits 1 on any difference.
import {existsSync, mkdtempSync, readFileSync, readdirSync, rmSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {ROOT, PLUGIN_DIR, HUB, listFiles, readJson, writeText, fail} from './lib.mjs';

const check = process.argv.includes('--check');
const EVALS_DIR = path.join(ROOT, 'evals', 'cases');
const MOCKS_DIR = path.join(ROOT, 'evals', 'mocks');
const BASELINES = path.join(ROOT, 'evals', 'baselines');
const BASELINE_CASES = ['cloudbackend-saas-launch-8', 'cloudbackend-rest-api-1'];
const KEEP = new Set();
// The tools every case may use. Read-only tools are the case's own grant; Write, Edit and Bash are granted by the
// operator (`--allow-tools Write Edit Bash`, as release.sh passes it), because a case cannot widen them on its own. Both
// arms get the same tools, so the with/without delta measures the plugin, not the toolbox.
const CASE_TOOLS = ['Read', 'Glob', 'Grep', 'Skill', 'Write', 'Edit', 'Bash'];
// Stand-ins whose tool list is the real stdio server's: mocks/<server>/_tools.json ← servers/<dir>/index.mjs tools/list.
const STDIO_MOCKS = [{server: 'cloudbackend-tenant', dir: 'tenant'}];
// Files a case's prompt takes for granted, from evals/fixtures/<fixture>/ here, copied to <into> in the run's directory.
// A case's list is copied in order. The cases past the first deploy (11 to 15) get the app and the project's documents
// (the context file with W4 done, the spec, the probe list); the cases at or before the first deploy (9: uploaded, not
// yet deployed; 17: the app is ready) get the app alone, as their prompts say.
const APP = {fixture: 'tasktrack', into: 'app'}, PROJECT = {fixture: 'tasktrack-project', into: '.'};
const FIXTURES = {
  'cloudbackend-saas-launch-8': [{fixture: 'broken-package', into: '.'}],
  ...Object.fromEntries([11, 12, 13, 14, 15].map(n => [`cloudbackend-saas-launch-${n}`, [APP, PROJECT]])),
  ...Object.fromEntries([9, 17].map(n => [`cloudbackend-saas-launch-${n}`, [APP]])),
  'xios3-app-basics-10': [{fixture: 'dated-gallery', into: '.'}],
  'xios3-app-basics-11': [{fixture: 'planboard-login', into: '.'}],
};
const FIXTURE_DIR = path.join(ROOT, 'evals', 'fixtures');
// Deterministic graders for the assertions about tool calls (evals/checks.json here; its "about" says why).
const CHECKS = readJson(path.join(ROOT, 'evals', 'checks.json'));
// How an assertion is graded other than by the judge over the trace, keyed by its text (evals/graders.json; its "about"
// says why): drop, a free regex, a free file_exists, or the judge pointed at another target.
const GRADERS = readJson(path.join(ROOT, 'evals', 'graders.json'));
const byText = table => new Map(Object.entries(table || {}).map(([k, v]) => [k.trim().replace(/\s+/g, ' '), v]));
const DROP = byText(GRADERS.drop), REGEX = byText(GRADERS.regex), FILE_EXISTS = byText(GRADERS.file_exists), FOCUS = byText(GRADERS.focus);
const focusYaml = f => typeof f === 'string' ? `focus: ${f}` : `focus:\n  source: ${f.source}\n  path: ${yamlStr(f.path)}`;
// Saturated cases (evals/tiers.json) carry the tag `saturated` too, so a by-hand run can pick them with --tag.
const SATURATED = new Set(readJson(path.join(ROOT, 'evals', 'tiers.json')).saturated || []);
const toolName = ref => {
  const m = /^([a-z]+):([a-z_]+)$/.exec(ref);
  if (!m) fail(`evals/checks.json: tool "${ref}" is not server:tool`);
  return `mcp__plugin_cloudbackend_cloudbackend-${m[1]}__${m[2]}`;
};
const yamlStr = v => `'${String(v).replace(/'/g, "''")}'`;
function checkGrader(spec, weight, assertion) {
  const head = [`type: ${spec.type}`];
  if (spec.type === 'tool_used') {
    head.push(`tool: ${toolName(spec.tool)}`);
    if (spec.input_match) head.push(`input_match: ${yamlStr(spec.input_match)}`);
    if (spec.min !== undefined) head.push(`min: ${spec.min}`);
    if (spec.max !== undefined) head.push(`max: ${spec.max}`);
    if (spec.max === 0) head.push('arm: both');
  } else if (spec.type === 'tool_order') {
    head.push('before:', `  tool: ${toolName(spec.before)}`, 'after:', `  tool: ${toolName(spec.after)}`);
  } else fail(`evals/checks.json: grader type ${spec.type} is not tool_used or tool_order`);
  if (weight !== 1) head.push(`weight: ${weight}`);
  return `---\n${head.join('\n')}\n---\n\nThe run shows this: ${assertion.trim()}\n`;
}
// The tenant stand-in starts signed in (the cases that deploy take an earlier sign-in for granted); these cases test the
// sign-in itself, so their copy of the stand-in starts signed out.
const SIGNED_OUT_CASES = ['cloudbackend-saas-launch-17'];
const SIGNED_IN_START = /^- Session at the start: [^\n]*(?:\n  [^\n]*)*/m;
const SIGNED_OUT_START = '- Session at the start: nobody is signed in on this computer. The user signs in on the page tenant_signin\n  returns, as tenant_status describes.';
const provenance = readJson(path.join(PLUGIN_DIR, 'SKILLS.json'));

const yamlList = items => `[${items.join(', ')}]`;
const expected = new Map();                                  // rel path under evals/ → text
const notes = [];
let cases = 0, skillGraders = 0, baselines = 0, assertionGraders = 0, deterministic = 0, free = 0, dropped = 0, refocused = 0;
const skipped = [];
const assertionTexts = new Set();                            // every assertion's text, as graders.json keys it
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
    assertionGraders += e.assertions.length;
    expected.set(`${id}/prompt.md`, `---
name: ${id}
tags: ${yamlList(SATURATED.has(id) ? [skill, 'saturated'] : [skill])}
max_turns: 25
allowed_tools: ${yamlList(CASE_TOOLS)}
---

${e.prompt.trim()}
`);
    const checks = CHECKS[id] || {};
    for (const n of Object.keys(checks)) if (!e.assertions[Number(n) - 1]) fail(`evals/checks.json: ${id} has no assertion ${n}`);
    e.assertions.forEach((a, i) => {
      const nn = String(i + 1).padStart(2, '0'), check = checks[String(i + 1)];
      assertionTexts.add(a.trim().replace(/\s+/g, ' '));
      if (check && check.skip) { skipped.push(`${id} assertion ${i + 1}: ${check.skip}`); return; }
      if (check) {
        const list = Array.isArray(check) ? check : [check];
        list.forEach((spec, j) => expected.set(`${id}/graders/assertion-${nn}${list.length > 1 ? String.fromCharCode(97 + j) : ''}.md`, checkGrader(spec, Math.round(1000 / list.length) / 1000, a)));
        deterministic += list.length;
        return;
      }
      const key = a.trim().replace(/\s+/g, ' ');
      if (DROP.has(key)) { dropped++; skipped.push(`${id} assertion ${i + 1}: ${DROP.get(key)}`); return; }
      const rx = REGEX.get(key);
      if (rx) {
        const head = ['type: regex', `target: ${rx.target || 'last_message'}`, `match: ${rx.match || 'contains'}`];
        if (rx.flags) head.push(`flags: ${rx.flags}`);
        head.push(`pattern: ${yamlStr(rx.pattern)}`);
        expected.set(`${id}/graders/assertion-${nn}.md`, `---\n${head.join('\n')}\n# The run shows this: ${key}\n# ${rx.source === 'backtest' ? `gave the judge's verdict on all ${rx.backtest.runs} recorded runs (scripts/regex-backtest.mjs)` : rx.why}\n---\n${rx.pattern}\n`);
        free++;
        return;
      }
      if (FILE_EXISTS.has(key)) {
        expected.set(`${id}/graders/assertion-${nn}.md`, `---\ntype: file_exists\npath: ${yamlStr(FILE_EXISTS.get(key))}\n---\n\nThe run shows this: ${a.trim()}\n`);
        free++;
        return;
      }
      if (FOCUS.has(key)) refocused++;
      expected.set(`${id}/graders/assertion-${nn}.md`, `---
type: llm
${focusYaml(FOCUS.get(key) || 'trace')}
---

The run shows this: ${a.trim()}

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: ${e.expected_output ? e.expected_output.trim() : '(as the point says)'}
`);
    });
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
    if (FIXTURES[id]) {
      const copies = [];
      for (const {fixture, into} of FIXTURES[id]) {
        const from = path.join(FIXTURE_DIR, fixture);
        if (!existsSync(from)) fail(`${id}: fixture evals/fixtures/${fixture}/ is missing`);
        for (const rel of listFiles(from)) expected.set(`_fixtures/${fixture}/${rel}`, readFileSync(path.join(from, rel), 'utf8'));
        copies.push(`mkdir -p ${into}\ncp -R "$(dirname "$0")/../_fixtures/${fixture}/." ${into === '.' ? '.' : `${into}/`}`);
      }
      const names = FIXTURES[id].map(({fixture, into}) => into === '.' ? fixture : `${fixture} (as ${into}/)`).join(' and ');
      expected.set(`${id}/case.yaml`, `schema_version: "1.1"\nname: ${id}\ncontext:\n  scaffold_script: scaffold.sh\n`);
      expected.set(`${id}/scaffold.sh`, `#!/bin/bash
# Generated by scripts/gen-evals.mjs: copies ${names} (evals/fixtures/ in the plugin repository, here ../_fixtures/)
# into the run's working directory before the agent starts.
set -euo pipefail
${copies.join('\n')}
`);
    }
    if (SIGNED_OUT_CASES.includes(id)) {
      const suiteMock = readFileSync(path.join(MOCKS_DIR, 'cloudbackend-tenant', '_server.md'), 'utf8');
      if (!SIGNED_IN_START.test(suiteMock)) fail('mocks/cloudbackend-tenant/_server.md has no "- Session at the start:" line to replace for the signed-out cases');
      expected.set(`${id}/mocks/cloudbackend-tenant/_server.md`, suiteMock.replace(SIGNED_IN_START, SIGNED_OUT_START));
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
for (const c of [...Object.keys(FIXTURES), ...SIGNED_OUT_CASES, ...Object.keys(CHECKS).filter(k => k !== 'about'), ...SATURATED]) if (!expected.has(`${c}/prompt.md`)) fail(`case ${c} in FIXTURES, SIGNED_OUT_CASES, checks.json or tiers.json does not exist in the skills' evals`);
// A graders.json key that matches no assertion is a grader lost without a word: an assertion reworded in the hub falls
// back to the judge over the trace (2026-11-08: saas-2's branches assertion lost its {source: file} focus that way).
const orphans = Object.entries({drop: DROP, regex: REGEX, file_exists: FILE_EXISTS, focus: FOCUS})
  .flatMap(([table, keys]) => [...keys.keys()].filter(k => !assertionTexts.has(k)).map(k => `${table}: ${k}`));
if (orphans.length) fail(`evals/graders.json has ${orphans.length} key(s) that match no assertion in the skills' evals.json (reworded or removed there: rekey or remove each):\n  ${orphans.join('\n  ')}`);

// The stdio stand-ins' tool lists, from the real servers (no sign-in needed for tools/list).
async function toolsList(entry) {
  const sessions = mkdtempSync(path.join(tmpdir(), 'gen-evals-'));
  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [entry], {stdio: ['pipe', 'pipe', 'ignore'], env: {...process.env, CBE_SESSION_DIR: sessions}});
      const timer = setTimeout(() => { child.kill(); reject(new Error(`${entry}: no tools/list answer in 20 s`)); }, 20000);
      let buf = '';
      const send = m => child.stdin.write(JSON.stringify(m) + '\n');
      child.on('error', reject);
      child.stdout.on('data', d => {
        buf += d;
        for (let i; (i = buf.indexOf('\n')) >= 0;) {
          const line = buf.slice(0, i); buf = buf.slice(i + 1);
          if (!line.trim()) continue;
          const m = JSON.parse(line);
          if (m.id === 1) { send({jsonrpc: '2.0', method: 'notifications/initialized'}); send({jsonrpc: '2.0', id: 2, method: 'tools/list'}); }
          if (m.id === 2) { clearTimeout(timer); child.kill(); resolve(m.result); }
        }
      });
      send({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'gen-evals', version: '1'}}});
    });
  } finally { rmSync(sessions, {recursive: true, force: true}); }
}
const mockDiffs = [];
for (const {server, dir} of STDIO_MOCKS) {
  const mockDir = path.join(MOCKS_DIR, server);
  if (!existsSync(path.join(mockDir, '_server.md'))) fail(`mocks/${server}/_server.md is missing: the stand-in is hand-written`);
  const listed = await toolsList(path.join(PLUGIN_DIR, 'servers', dir, 'index.mjs'));
  const names = listed.tools.map(t => t.name).sort();
  const declared = ((readFileSync(path.join(mockDir, '_server.md'), 'utf8').match(/^tools:\s*\[([^\]]*)\]/m) || [])[1] || '').split(',').map(t => t.trim()).filter(Boolean).sort();
  if (names.join() !== declared.join()) fail(`mocks/${server}/_server.md tools: [${declared.join(', ')}] differ from the real server's [${names.join(', ')}]: update the stand-in`);
  const text = JSON.stringify(listed, null, 2) + '\n';
  const file = path.join(mockDir, '_tools.json');
  if (!existsSync(file) || readFileSync(file, 'utf8') !== text) {
    mockDiffs.push(`differs: mocks/${server}/_tools.json`);
    if (!check) writeText(file, text);
  }
}

const diffs = [];
const present = existsSync(EVALS_DIR) ? listFiles(EVALS_DIR, {skip: rel => KEEP.has(rel.split('/')[0])}) : [];
for (const rel of present) if (!expected.has(rel)) diffs.push(`extra: ${rel}`);
for (const [rel, text] of expected) {
  const file = path.join(EVALS_DIR, rel);
  if (!existsSync(file)) diffs.push(`missing: ${rel}`);
  else if (readFileSync(file, 'utf8') !== text) diffs.push(`differs: ${rel}`);
}
const summary = `${cases} cases from ${provenance.skills.length} skills, ${assertionGraders} assertions (${skipped.length} skipped, ${dropped} of them dropped), ${deterministic} tool-call graders, ${free} free regex or file graders, ${refocused} judges on another target (${skillGraders} cases with a Skill grader, ${baselines} with a baseline grader)`;
for (const n of notes) console.log(`  · ${n}`);
for (const n of skipped) console.log(`  · skipped: ${n}`);
if (check) {
  diffs.push(...mockDiffs);
  if (diffs.length) fail(`evals drift from the skills' evals.json (${diffs.length}):\n  ${diffs.join('\n  ')}\nrun: node scripts/gen-evals.mjs`);
  console.log(`evals in step: ${summary}`);
  process.exit(0);
}
if (mockDiffs.length) console.log(`  refreshed: ${mockDiffs.map(d => d.replace('differs: ', '')).join(', ')}`);
if (!diffs.length) { console.log(`evals already in step: ${summary}`); process.exit(0); }
// Only what differs is written or removed (the checkout may sit on a network share, where rewriting ~450 files is slow);
// a case folder left empty by a removal goes too.
for (const d of diffs) {
  const [kind, rel] = d.split(': ');
  if (kind === 'extra') rmSync(path.join(EVALS_DIR, rel), {force: true});
  else writeText(path.join(EVALS_DIR, rel), expected.get(rel));
}
const pruneEmpty = dir => {
  for (const name of readdirSync(dir, {withFileTypes: true})) if (name.isDirectory()) pruneEmpty(path.join(dir, name.name));
  if (dir !== EVALS_DIR && !readdirSync(dir).length) rmSync(dir, {recursive: true, force: true});
};
for (const name of readdirSync(EVALS_DIR, {withFileTypes: true})) if (name.isDirectory() && !KEEP.has(name.name)) pruneEmpty(path.join(EVALS_DIR, name.name));
console.log(`wrote ${summary}; ${diffs.length} change(s)`);
