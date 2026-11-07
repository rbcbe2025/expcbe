#!/usr/bin/env node
// eval-report.mjs <result.json>... [--record <stage.json>] — reads `claude plugin eval --json` results and prints, per
// case: the score with the plugin, the score without it (from the same run, or the stored baseline when the run had no
// without arm), the delta, the cost of a run with the plugin and its turns; then the totals.
// With --record (scripts/run-evals.mjs passes it, with the hashes eval-plan computed when the run was staged) it also
// appends one row per case and arm to evals/results/index.json, which eval-plan reads to skip what has already run, and
// stores each fresh without-plugin score in evals/baselines/without-<model>.json, which later runs reuse, and appends the
// per-assertion verdicts to evals/results/gradings.json (the hub's insights report reads it).
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readJson, writeJson, fail} from './lib.mjs';
import {existsSync, readFileSync} from 'node:fs';
import {CASES_DIR, INDEX_FILE, RESULTS_DIR, readIndex, readBaseline, baselineFile} from './eval-plan.mjs';

// Per-assertion verdicts, one entry per case, arm and run, for the hub's insights report (its signal 3 reads this file
// in place of the skill-creator workspaces it read before 2026-11-07): {runs: [{skill, iteration, label, case, eval_id,
// config: with_skill|without_skill, date, expectations: [[assertion text, passed]]}]}. `iteration` counts recorded
// results, so the newest entry for a skill is its latest run.
export const GRADINGS_FILE = path.join(RESULTS_DIR, 'gradings.json');
const assertionText = g => ((g.graderMarkdown || '').match(/The run shows this: ([^\n]+)/) || [])[1];
// A regex grader's body is its pattern; its assertion sits in a comment in the frontmatter, which the result does
// not carry: read it from the case's grader file.
function graderFileText(caseName, graderName) {
  const file = path.join(CASES_DIR, caseName, 'graders', `${graderName}.md`);
  return existsSync(file) ? ((readFileSync(file, 'utf8').match(/^# The run shows this: ([^\n]+)/m) || [])[1]) : undefined;
}

const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const sum = xs => xs.reduce((a, b) => a + (b || 0), 0);
const f2 = x => x === null || x === undefined ? '  —  ' : x.toFixed(2);

/** A run's score over its scored graders, leaving out the with-only indicators: the same number the CLI reports under
 *  with-without, and comparable when a run had no without arm (under --ablation none a with-only grader would count).
 *  The `-lm` shadows run-evals.mjs --shadow-focus adds are left out too: they are measurements of the judge, not of the run. */
export function runScore(run) {
  const graders = (run.graders || []).filter(g => g.scored !== false && !g.withOnly && g.name !== 'uses-skill' && !g.name.endsWith('-lm'));
  const weight = sum(graders.map(g => g.weight ?? 1));
  return weight ? sum(graders.map(g => (g.passed ? 1 : 0) * (g.weight ?? 1))) / weight : (run.score ?? 0);
}

/** One summary per case: {case, with:{score,cost,turns,runs}|null, without:{...}|null}. */
export function summarize(result) {
  return result.cases.map(c => {
    const arm = runs => runs && runs.length ? {score: mean(runs.map(runScore)), cost: sum(runs.map(r => r.costUsd)) / runs.length,
      turns: mean(runs.map(r => r.turns || 0)), runs: runs.length} : null;
    return {case: c.name, with: arm(c.arms.with), without: arm(c.arms.without)};
  });
}

export function record(resultFile, stage) {
  const result = readJson(resultFile);
  const model = result.suite.modelOverride || stage.model;
  const label = stage.label || path.basename(resultFile, '.json');
  const index = readIndex(), baseline = readBaseline(model);
  const date = (result.startedAt || new Date().toISOString()).slice(0, 10);
  for (const s of summarize(result)) {
    const h = stage.hashes[s.case];
    if (!h) { console.error(`  ${s.case}: not in the staged plan; not recorded`); continue; }
    for (const [arm, a] of [['with', s.with], ['without', s.without]]) {
      if (!a) continue;
      index.rows.push({label, date, model, judge: result.suite.judgeModel, cli: result.claudeVersion, case: s.case, skill: h.skill, arm,
        runs: a.runs, score: +a.score.toFixed(4), costUsd: +a.cost.toFixed(4), turns: +a.turns.toFixed(1),
        skill_hash: h.skill_hash, plugin_hash: h.plugin_hash, case_hash: h.case_hash});
    }
    if (s.without) baseline.cases[s.case] = {case_hash: h.case_hash, score: +s.without.score.toFixed(4), runs: s.without.runs,
      costUsd: +s.without.cost.toFixed(4), cli: result.claudeVersion, date, label};
  }
  writeJson(INDEX_FILE, index);
  const gradings = existsSync(GRADINGS_FILE) ? readJson(GRADINGS_FILE) : {runs: []};
  const iteration = `iteration-${1 + Math.max(0, ...gradings.runs.map(r => +r.iteration.split('-')[1] || 0))}`;
  for (const c of result.cases) {
    const h = stage.hashes[c.name];
    if (!h) continue;
    const texts = Object.fromEntries((c.graders || []).map(g => [g.name, assertionText(g) || graderFileText(c.name, g.name)]));
    for (const [arm, config] of [['with', 'with_skill'], ['without', 'without_skill']]) for (const run of c.arms[arm] || []) {
      const expectations = (run.graders || []).filter(g => /^assertion-\d+[a-z]?$/.test(g.name) && texts[g.name]).map(g => [texts[g.name], !!g.passed]);
      if (expectations.length) gradings.runs.push({skill: h.skill, iteration, label, case: c.name, eval_id: +c.name.split('-').pop(), config, date, expectations});
    }
  }
  writeJson(GRADINGS_FILE, gradings);
  baseline.model = model; baseline.updated = date;
  writeJson(baselineFile(model), baseline);
  return result;
}

export function print(results) {
  const rows = [];
  for (const result of results) {
    const model = result.suite.modelOverride;
    const stored = readBaseline(model).cases;
    for (const s of summarize(result)) {
      const without = s.without ? s.without.score : stored[s.case] ? stored[s.case].score : null;
      rows.push({...s, model, withoutScore: without, source: s.without ? 'run' : stored[s.case] ? 'stored' : 'none'});
    }
  }
  console.log('case                              with  without     delta  $/run  turns');
  for (const r of rows) {
    const d = r.with && r.withoutScore !== null ? r.with.score - r.withoutScore : null;
    console.log(`${r.case.padEnd(32)} ${f2(r.with && r.with.score)}  ${f2(r.withoutScore)} ${r.source.padEnd(6)} ${d === null ? '  —  ' : (d >= 0 ? '+' : '') + d.toFixed(2)}  ${r.with ? r.with.cost.toFixed(3) : '  —  '}  ${r.with ? r.with.turns.toFixed(1) : '—'}`);
  }
  const w = rows.filter(r => r.with), wo = rows.filter(r => r.withoutScore !== null && r.with);
  const cost = sum(results.map(r => r.costUsd));
  console.log(`\n${rows.length} case(s): with ${f2(mean(w.map(r => r.with.score)))}, without ${f2(mean(wo.map(r => r.withoutScore)))}, ` +
    `delta ${wo.length ? '+' + (mean(wo.map(r => r.with.score)) - mean(wo.map(r => r.withoutScore))).toFixed(2) : '—'}; spent $${cost.toFixed(2)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), files = [];
  let stage = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--record') stage = readJson(args[++i]);
    else if (args[i].startsWith('-')) fail(`unknown option: ${args[i]}`);
    else files.push(args[i]);
  }
  if (!files.length) fail('usage: eval-report.mjs <result.json>... [--record <stage.json>]');
  const results = files.map(f => stage ? record(f, stage) : readJson(f));
  print(results);
}
