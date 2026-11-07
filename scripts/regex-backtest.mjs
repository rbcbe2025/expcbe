#!/usr/bin/env node
// regex-backtest.mjs [--write] — which judge graders a free regex grader can replace, proved on recorded runs.
// Source of the patterns: the hub's skill-creator workspaces (_skills/_archive/workspaces-<date>/<skill>-workspace/
// iteration-N/eval-*/assertions.json,
// the latest iteration per assertion text), whose regex specs ({all, any, none}, case-insensitive, multiline) were written
// for the same assertion wording as the skills' evals.json. Each spec becomes one JavaScript pattern (the eval runner's own
// engine), anchored at the start of the text so a forbidden phrase anywhere fails it:
//   (?<![\s\S])(?=[\s\S]*?(?:all1))(?=[\s\S]*?(?:all2))(?=[\s\S]*?(?:any1|any2))(?![\s\S]*?(?:none1|none2))
// and is run over each recorded run's final message (the grader target `last_message`; the trace is no target for a
// pattern, because it carries the skill text the run read). A pattern replaces its judge grader only when it gave the
// judge's verdict on every recorded run of that assertion, with and without the plugin, over at least MIN_RUNS runs,
// and those runs held both verdicts (a pattern only ever seen failing, or only passing, proves little).
// --write records the adopted ones in evals/graders.json `regex` (keyed by assertion text, `source: backtest`), which
// gen-evals.mjs reads; the hand-written entries there are kept.
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {ROOT, HUB, readJson, writeJson} from './lib.mjs';
import {RESULTS_DIR} from './eval-plan.mjs';

const MIN_RUNS = 6;
const SKILLS = path.join(HUB, '_skills');
const norm = t => t.trim().replace(/\s+/g, ' ');

// 1. The workspace specs by assertion text (a later iteration overrides an earlier one). The workspaces were archived
// on 2026-11-07 (_skills/_archive/workspaces-<date>/); a workspace still under _skills/ is read too.
const specs = new Map();
const ARCHIVE = path.join(SKILLS, '_archive');
const workspaces = [
  ...readdirSync(SKILLS).filter(d => d.endsWith('-workspace')).map(d => path.join(SKILLS, d)),
  ...(existsSync(ARCHIVE) ? readdirSync(ARCHIVE).filter(d => d.startsWith('workspaces-')).sort().flatMap(a =>
    readdirSync(path.join(ARCHIVE, a)).filter(d => d.endsWith('-workspace')).map(d => path.join(ARCHIVE, a, d))) : []),
];
for (const ws of workspaces) {
  const iters = readdirSync(ws).filter(d => /^iteration-\d+$/.test(d)).sort((a, b) => +a.split('-')[1] - +b.split('-')[1]);
  for (const it of iters) for (const ev of readdirSync(path.join(ws, it)).filter(d => d.startsWith('eval-'))) {
    const file = path.join(ws, it, ev, 'assertions.json');
    if (!existsSync(file)) continue;
    for (const a of readJson(file)) if (a.text && (a.all || a.any || a.none)) specs.set(norm(a.text), a);
  }
}
// 2. The plugin's assertions: case → [text], from the skills' evals.json (what gen-evals.mjs turns into graders).
const assertions = {};
for (const skill of readdirSync(SKILLS).filter(d => existsSync(path.join(SKILLS, d, 'evals', 'evals.json')))) {
  for (const e of readJson(path.join(SKILLS, skill, 'evals', 'evals.json')).evals || []) assertions[`${skill}-${e.id}`] = e.assertions.map(norm);
}
function compose(spec) {
  const group = list => list.map(p => `(?:${p})`).join('|');
  let pat = '(?<![\\s\\S])';
  for (const p of spec.all || []) pat += `(?=[\\s\\S]*?(?:${p}))`;
  if (spec.any && spec.any.length) pat += `(?=[\\s\\S]*?(?:${group(spec.any)}))`;
  if (spec.none && spec.none.length) pat += `(?![\\s\\S]*?(?:${group(spec.none)}))`;
  return pat;
}
// 3. Every recorded verdict of a judge grader, with the run's final message.
const finalMessage = evidence => {
  const lines = String(evidence || '').split('\n').filter(l => l.startsWith('{'));
  for (let i = lines.length - 1; i >= 0; i--) { try { const m = JSON.parse(lines[i]); if (m.type === 'result' && typeof m.result === 'string') return m.result; } catch {} }
  return null;
};
const verdicts = {};                                          // `${case}#${n}` → [{passed, text}]
for (const f of readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json' && !f.endsWith('.stage.json'))) {
  let d; try { d = readJson(path.join(RESULTS_DIR, f)); } catch { continue; }
  for (const c of d.cases || []) for (const arm of ['with', 'without']) for (const run of c.arms[arm] || []) for (const g of run.graders || []) {
    const m = /^assertion-(\d+)$/.exec(g.name);
    if (!m || !g.judgeVotes) continue;                        // judge graders only
    const text = finalMessage(g.evidence);
    if (text === null) continue;
    (verdicts[`${c.name}#${+m[1]}`] ||= []).push({passed: g.passed, text, arm});
  }
}
// 4. Backtest.
const adopted = {}, report = {adopted: 0, disagree: 0, onesided: 0, few: 0, invalid: 0, nospec: 0};
for (const [id, texts] of Object.entries(assertions)) texts.forEach((text, i) => {
  const spec = specs.get(text);
  if (!spec) { report.nospec++; return; }
  let re;
  try { re = new RegExp(compose(spec), 'im'); } catch { report.invalid++; console.log(`  invalid in JavaScript: ${id} #${i + 1}`); return; }
  const runs = verdicts[`${id}#${i + 1}`] || [];
  if (runs.length < MIN_RUNS) { report.few++; return; }
  const misses = runs.filter(r => re.test(r.text) !== r.passed);
  if (misses.length) { report.disagree++; console.log(`  disagrees ${misses.length}/${runs.length}: ${id} #${i + 1} ${text.slice(0, 70)}`); return; }
  const passes = runs.filter(r => r.passed).length;
  const absence = !(spec.all || []).length && !(spec.any || []).length;     // a "does not" spec: nothing to find, only to avoid
  if (!passes || (passes === runs.length && !absence)) { report.onesided++; return; }   // never seen both verdicts: agreement proves little
  report.adopted++;
  adopted[text] = {source: 'backtest', pattern: compose(spec), flags: 'im', target: 'last_message', match: 'contains', backtest: {runs: runs.length, pass: passes, case: id, n: i + 1}};
});
console.log(`\n${report.adopted} adopted; ${report.disagree} disagree with the judge; ${report.onesided} agree but were never seen both passing and failing; ${report.few} with fewer than ${MIN_RUNS} recorded runs; ${report.invalid} invalid; ${report.nospec} without a workspace spec`);
if (process.argv.includes('--write')) {
  const file = path.join(ROOT, 'evals', 'graders.json');
  const current = existsSync(file) ? readJson(file) : {};
  const regex = Object.fromEntries(Object.entries(current.regex || {}).filter(([, v]) => v.source !== 'backtest'));
  writeJson(file, {...current, regex: {...adopted, ...regex}});   // a hand-written entry wins over a backtested one
  console.log(`wrote ${Object.keys(adopted).length} backtested patterns into evals/graders.json (hand-written entries kept)`);
}
