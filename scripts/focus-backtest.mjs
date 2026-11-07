#!/usr/bin/env node
// focus-backtest.mjs [--write] — which judge graders can read the final message instead of the trace without changing
// a verdict. The evidence is the `-lm` shadows run-evals.mjs --shadow-focus adds: beside each judge over the trace, a
// with-only twin judging the final message only. A grader moves to `focus: last_message` (evals/graders.json `focus`,
// keyed by its assertion text) when its shadow gave the same verdict on every recorded run (at least MIN_RUNS) and at
// least one of those verdicts was a pass: two fails show nothing about whether the final message carries the point.
// The trace shows a judge the first and last 12 messages; the final message alone is a fraction of that, so each moved
// grader costs a fraction of its judge calls.
import {readdirSync} from 'node:fs';
import path from 'node:path';
import {ROOT, readJson, writeJson} from './lib.mjs';
import {RESULTS_DIR} from './eval-plan.mjs';

const MIN_RUNS = Number(process.env.FOCUS_MIN_RUNS || 1);
const text = g => ((g.graderMarkdown || '').match(/The run shows this: ([^\n]+)/) || [])[1];
const pairs = {};                                              // assertion text → [{trace, last}]
for (const f of readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json') && !['index.json', 'gradings.json'].includes(f) && !f.endsWith('.stage.json'))) {
  let d; try { d = readJson(path.join(RESULTS_DIR, f)); } catch { continue; }
  for (const c of d.cases || []) {
    const md = Object.fromEntries((c.graders || []).map(g => [g.name, text(g)]));
    for (const run of c.arms.with || []) {
      const by = Object.fromEntries((run.graders || []).map(g => [g.name, g]));
      for (const [name, g] of Object.entries(by)) {
        if (!name.endsWith('-lm')) continue;
        const twin = by[name.slice(0, -3)];
        const t = md[name.slice(0, -3)];
        if (twin && t) (pairs[t] ||= []).push({trace: !!twin.passed, last: !!g.passed, case: c.name});
      }
    }
  }
}
const move = {}, report = {same: 0, differ: 0, few: 0, unproven: 0};
for (const [t, runs] of Object.entries(pairs)) {
  if (runs.length < MIN_RUNS) { report.few++; continue; }
  const differ = runs.filter(r => r.trace !== r.last);
  if (differ.length) { report.differ++; console.log(`  differs ${differ.length}/${runs.length} (${runs[0].case}): ${t.slice(0, 80)}`); continue; }
  if (!runs.some(r => r.trace && r.last)) { report.unproven++; continue; }
  report.same++; move[t] = 'last_message';
}
console.log(`\n${report.same} judge(s) gave the same verdict on the final message; ${report.differ} differ; ${report.unproven} agree on fails only; ${report.few} with fewer than ${MIN_RUNS} runs`);
if (process.argv.includes('--write')) {
  const file = path.join(ROOT, 'evals', 'graders.json'), g = readJson(file);
  g.focus = {...move, ...(g.focus || {})};                     // a hand-set focus wins
  writeJson(file, g);
  console.log(`wrote ${Object.keys(move).length} into evals/graders.json focus`);
}
