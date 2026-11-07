#!/usr/bin/env node
// context-budget.mjs [--skills <dir>] [--json] — what the plugin puts into a session, against its budget. Free: it reads
// files. Exit 1 when a limit is crossed, so release.sh (stage e) stops before a skill grows back.
//   always loaded  every skill's description and every agent's description: read at the start of every session
//   per skill      SKILL.md, read whenever the skill fires (the built file, version section included)
//   a build run    what the main thread reads in a typical build-and-deploy run (the list below): both SKILL.md bodies,
//                  the references each phase opens, the launch path's Pre-flight, step 1 and step 7 sections only
// Tokens are estimated as bytes / 4. The skills are the plugin's synced copies (plugins/cloudbackend/skills/), or the
// hub's built ones with --skills <the hub>/public/public/skills before a sync.
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {PLUGIN_DIR, fail} from './lib.mjs';

// buildRunTokens: the plan of 2026-11-07 aimed at 22,000 (from ~57,000); the merge and the reference splits reached
// ~27,900, the rest being per-phase material a full run reads. The limit holds what was reached; lower it as it drops.
const LIMITS = {alwaysTokens: 800, skillBytes: 16384, descriptionChars: 500, buildRunTokens: 28000};
const RUN = [   // [skill, file, section heading or null]: a typical build-and-deploy run, phase by phase
  ['cloudbackend-saas-launch', 'SKILL.md'], ['xios3-app-basics', 'SKILL.md'],
  ['cloudbackend-saas-launch', 'references/build-phases.md'],
  ['cloudbackend-saas-launch', 'references/launch-path.md', /^#+ Pre-flight/i],
  ['cloudbackend-saas-launch', 'references/launch-path.md', /^#+ 1\. /],
  ['cloudbackend-saas-launch', 'references/project-layout.md'],
  ['xios3-app-basics', 'references/layouts.md'],   // design-brief.md is read only without a shell (the kit's script writes the brief)
  ['xios3-app-basics', 'references/login.md'],
  ['cloudbackend-saas-launch', 'references/tenant-grammar.md'], ['cloudbackend-saas-launch', 'references/deploy-rules.md'],
  ['cloudbackend-saas-launch', 'references/verification-checklist.md'],
  ['cloudbackend-saas-launch', 'references/security-legal-checklist.md'],
  ['xios3-app-basics', 'references/deployment-pipeline.md'],
  ['cloudbackend-saas-launch', 'references/launch-path.md', /^#+ 7\. /],
  ['cloudbackend-saas-launch', 'references/benchmark-method.md'],
];
const args = process.argv.slice(2);
const at = args.indexOf('--skills');
const SKILLS = at >= 0 ? path.resolve(args[at + 1]) : path.join(PLUGIN_DIR, 'skills');
if (!existsSync(SKILLS)) fail(`no skills at ${SKILLS}`);
const tok = bytes => Math.round(bytes / 4);
const frontmatter = text => Object.fromEntries((/^---\n([\s\S]*?)\n---/.exec(text) || [, ''])[1].split('\n')
  .map(l => /^(\w[\w-]*):\s*(.*)$/.exec(l)).filter(Boolean).map(([, k, v]) => [k, v.replace(/^"(.*)"$/, '$1')]));
function section(text, heading) {
  const lines = text.split('\n'), out = [];
  let level = 0;
  for (const line of lines) {
    const m = /^(#+) /.exec(line);
    if (level) { if (m && m[1].length <= level) break; out.push(line); }
    else if (m && heading.test(line)) { level = m[1].length; out.push(line); }
  }
  return out.join('\n');
}
const problems = [], report = {skills: {}, agents: {}, run: []};
let always = 0;
for (const name of readdirSync(SKILLS).filter(n => existsSync(path.join(SKILLS, n, 'SKILL.md'))).sort()) {
  const text = readFileSync(path.join(SKILLS, name, 'SKILL.md'), 'utf8'), fm = frontmatter(text), bytes = Buffer.byteLength(text);
  report.skills[name] = {skill_md_bytes: bytes, description_chars: (fm.description || '').length};
  always += (fm.description || '').length;
  if (bytes > LIMITS.skillBytes) problems.push(`${name}/SKILL.md is ${bytes} bytes (limit ${LIMITS.skillBytes})`);
  if ((fm.description || '').length > LIMITS.descriptionChars) problems.push(`${name}: description ${fm.description.length} characters (limit ${LIMITS.descriptionChars})`);
}
const agents = path.join(PLUGIN_DIR, 'agents');
for (const f of existsSync(agents) ? readdirSync(agents).filter(f => f.endsWith('.md')).sort() : []) {
  const fm = frontmatter(readFileSync(path.join(agents, f), 'utf8'));
  report.agents[f] = (fm.description || '').length;
  always += (fm.description || '').length;
}
report.always_tokens = tok(always);
if (report.always_tokens > LIMITS.alwaysTokens) problems.push(`always loaded: ~${report.always_tokens} tokens (limit ${LIMITS.alwaysTokens})`);
let run = 0;
for (const [skill, file, heading] of RUN) {
  const p = path.join(SKILLS, skill, file);
  if (!existsSync(p)) { problems.push(`a build run opens ${skill}/${file}, which is missing`); continue; }
  const text = readFileSync(p, 'utf8'), part = heading ? section(text, heading) : text;
  if (heading && !part) problems.push(`${skill}/${file}: no section matching ${heading}`);
  const bytes = Buffer.byteLength(part);
  run += bytes;
  report.run.push({file: `${skill}/${file}${heading ? ` ${heading}` : ''}`, bytes});
}
report.build_run_tokens = tok(run);
if (report.build_run_tokens > LIMITS.buildRunTokens) problems.push(`a build run's main thread: ~${report.build_run_tokens} tokens (limit ${LIMITS.buildRunTokens})`);
if (args.includes('--json')) console.log(JSON.stringify({limits: LIMITS, ...report, problems}, null, 2));
else {
  for (const [n, s] of Object.entries(report.skills)) console.log(`  ${n.padEnd(26)} SKILL.md ${String(s.skill_md_bytes).padStart(6)} B, description ${s.description_chars} chars`);
  console.log(`  always loaded: ~${report.always_tokens} tokens (${Object.keys(report.skills).length} skills, ${Object.keys(report.agents).length} agents)`);
  console.log(`  a build run's main thread: ~${report.build_run_tokens} tokens over ${report.run.length} reads`);
  console.log(problems.length ? `${problems.length} over budget:\n  ${problems.join('\n  ')}` : 'within budget');
}
process.exit(problems.length ? 1 : 0);
