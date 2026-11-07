#!/usr/bin/env node
// run-evals.mjs <label> [options] — runs the eval cases eval-plan.mjs selects, on a machine whose Claude Code runs
// `plugin eval` (2.1.269 or later; big: `ssh big <this repo>/scripts/run-evals.sh ...`), and records the results.
//   --model M --judge M        the models (defaults: claude-opus-5-5 and claude-haiku-5-5; or EVAL_MODEL / EVAL_JUDGE_MODEL)
//   --all --saturated --refresh-baseline --case NAME   the selection, as eval-plan.mjs reads them
//   --with-only                every selected case runs with the plugin only (the release's second-model pass)
//   --runs N (default 1)  -j N (default 4)  --max-cost-usd X (one ceiling across both passes)  --keep-stage  --dry-run
//   --shadow-focus             beside each judge grader over the trace, a with-only twin judging the final message only
//                              (`assertion-NN-lm`), in the temporary copy: what focus-backtest.mjs compares to find the
//                              graders that can judge the cheaper target without changing a verdict
//   --timeout-seconds N        each case's time limit in the temporary copy (the cases default to 300 s; a Fable 5.1 run
//                              of a long case needed more on 2026-11-07); the cases in the repository are unchanged
// Two passes at most: the cases that need a fresh without-plugin baseline run with and without the plugin; the rest run
// with it only, and their delta is read against the stored baseline. Each pass copies the plugin and its cases into a
// temporary folder (the cases live in evals/cases/, outside the plugin, so an install never carries them) and runs
//   claude plugin eval <stage>/cloudbackend --eval-dir evals ...
// with the suite's standing flags:
//   - the tenant and deploy servers answer from their stand-ins in evals/mocks/ (a sign-in, an account change, a deploy
//     never reach CloudBackend);
//   - the docs and build servers are the plugin's real ones (--allow-real-servers starts servers without a stand-in, as
//     you, outside the sandbox; both are this repository's own read-only code), their tools granted by name;
//   - Write, Edit and Bash are granted, so a case can show the files and commands its skill asks for;
//   - --scaffold: a case with a fixture gets those files in its working directory first (this repository's own `cp` lines);
//   - --threshold 0: the scores are information; the gate is reading them against the baseline.
// Writes evals/results/<label>-<pass>.{json,log,html,stage.json}; the bulky aggregate copies stay in the temporary folder.
// Then eval-report.mjs records each pass (evals/results/index.json, evals/baselines/without-<model>.json) and prints them.
import {spawnSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, mkdtempSync, openSync, closeSync, appendFileSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {PLUGIN_DIR, PLUGIN_NAME, readJson, writeJson, fail} from './lib.mjs';
import {CASES_DIR, MOCKS_DIR, RESULTS_DIR, DEFAULT_MODEL, DEFAULT_JUDGE, plan} from './eval-plan.mjs';
import {record, print} from './eval-report.mjs';

const args = process.argv.slice(2);
const label = args.shift();
if (!label || label.startsWith('-')) fail('usage: run-evals.mjs <label> [options] (see the header)');
const opt = {model: process.env.EVAL_MODEL || DEFAULT_MODEL, judge: process.env.EVAL_JUDGE_MODEL || DEFAULT_JUDGE, only: [], runs: '1', jobs: '4'};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--model') opt.model = args[++i];
  else if (a === '--judge') opt.judge = args[++i];
  else if (a === '--all') opt.all = true;
  else if (a === '--saturated') opt.saturated = true;
  else if (a === '--refresh-baseline') opt.refreshBaseline = true;
  else if (a === '--case') opt.only.push(args[++i]);
  else if (a === '--with-only') opt.withOnly = true;
  else if (a === '--runs') opt.runs = args[++i];
  else if (a === '-j') opt.jobs = args[++i];
  else if (a === '--max-cost-usd') opt.budget = Number(args[++i]);
  else if (a === '--keep-stage') opt.keep = true;
  else if (a === '--dry-run') opt.dry = true;
  else if (a === '--shadow-focus') opt.shadow = true;
  else if (a === '--timeout-seconds') opt.timeout = Number(args[++i]);
  else fail(`unknown option: ${a}`);
}

const p = plan(opt);
if (opt.withOnly) { p.with = [...p.both, ...p.with]; p.both = []; }
console.log(`${label}: model ${opt.model}, judge ${opt.judge}; ${p.both.length} case(s) with and without the plugin, ${p.with.length} with it only, ${p.skip.length} skipped`);
if (!p.both.length && !p.with.length) { console.log('nothing to run'); process.exit(0); }
mkdirSync(RESULTS_DIR, {recursive: true});

const passes = [['both', 'with-without', p.both], ['with', 'none', p.with]].filter(([, , cases]) => cases.length);
const results = [];
let spent = 0, code = 0;
for (const [pass, ablation, cases] of passes) {
  const name = `${label}-${pass}`, out = path.join(RESULTS_DIR, name);
  const stage = mkdtempSync(path.join(tmpdir(), 'cbe-evals-'));
  const plugin = path.join(stage, PLUGIN_NAME), evals = path.join(plugin, 'evals');
  const claudeArgs = ['plugin', 'eval', plugin, '--eval-dir', 'evals', '--trust-plugin', '--scaffold',
    '--model', opt.model, '--judge-model', opt.judge, '--ablation', ablation, '--runs', opt.runs, '-j', opt.jobs,
    '--allow-real-servers', '--allow-tools', 'Write', 'Edit', 'Bash',
    'mcp__plugin_cloudbackend_cloudbackend-docs__*', 'mcp__plugin_cloudbackend_cloudbackend-build__*',
    '--no-publish', '--threshold', '0', '--json', `${out}.json`, '--report', `${out}.html`, '--output-dir', path.join(stage, 'out')];
  if (opt.budget) {
    const left = opt.budget - spent;
    if (left <= 0) { console.log(`${name}: the ceiling of $${opt.budget} is spent; not run`); break; }
    claudeArgs.push('--max-cost-usd', left.toFixed(2));
  }
  console.log(`\n[${name}] ${cases.length} case(s), ablation ${ablation}: ${cases.join(' ')}`);
  if (opt.dry) { console.log(`  $ claude ${claudeArgs.map(a => /[\s*]/.test(a) ? `'${a}'` : a).join(' ')}`); rmSync(stage, {recursive: true, force: true}); continue; }
  cpSync(PLUGIN_DIR, plugin, {recursive: true, filter: src => !/[/\\](node_modules|\.data)$/.test(src)});
  for (const c of cases) cpSync(path.join(CASES_DIR, c), path.join(evals, c), {recursive: true});
  if (existsSync(path.join(CASES_DIR, '_fixtures'))) cpSync(path.join(CASES_DIR, '_fixtures'), path.join(evals, '_fixtures'), {recursive: true});
  cpSync(MOCKS_DIR, path.join(evals, 'mocks'), {recursive: true});
  if (opt.timeout) for (const c of cases) {
    const file = path.join(evals, c, 'prompt.md'), text = readFileSync(file, 'utf8');
    writeFileSync(file, /^timeout_seconds:/m.test(text) ? text.replace(/^timeout_seconds:.*$/m, `timeout_seconds: ${opt.timeout}`) : text.replace(/^---\n/, `---\ntimeout_seconds: ${opt.timeout}\n`));
  }
  if (opt.shadow) for (const c of cases) {
    const dir = path.join(evals, c, 'graders');
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      const text = readFileSync(path.join(dir, f), 'utf8');
      if (/^---\ntype: llm\nfocus: trace\n/.test(text)) writeFileSync(path.join(dir, f.replace(/\.md$/, '-lm.md')), text.replace('focus: trace\n', 'focus: last_message\narm: with-only\n'));
    }
  }
  const stageInfo = {label: name, model: opt.model, judge: opt.judge, ablation, hashes: Object.fromEntries(cases.map(c => [c, p.hashes[c]]))};
  writeJson(`${out}.stage.json`, stageInfo);
  const log = openSync(`${out}.log`, 'w');
  const run = spawnSync('claude', claudeArgs, {stdio: ['ignore', log, log]});
  closeSync(log);
  const exit = run.status ?? 1;
  appendFileSync(`${out}.log`, `exit ${exit}\n`);
  code = Math.max(code, exit);
  if (existsSync(`${out}.json`)) {
    const result = record(`${out}.json`, stageInfo);
    spent += result.costUsd || 0;
    results.push(result);
  } else console.error(`${name}: no result written (exit ${exit}); see ${path.relative(process.cwd(), out)}.log`);
  if (opt.keep) console.log(`  stage kept: ${stage}`); else rmSync(stage, {recursive: true, force: true});
}
if (results.length) { console.log(''); print(results); }
process.exit(code);
