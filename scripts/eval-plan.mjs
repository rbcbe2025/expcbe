#!/usr/bin/env node
// eval-plan.mjs — which eval cases a run needs, and with which arms. Free: it reads files, it calls no model.
//   node scripts/eval-plan.mjs [--model M] [--all] [--saturated] [--refresh-baseline] [--case <name>]... [--json <file>]
// A case needs a run when evals/results/index.json has no with-plugin row for it, on this model, with the same hashes:
//   skill   the case's skill: its content_hash in plugins/cloudbackend/SKILLS.json
//   plugin  what a run's tools are: the plugin's servers/, agents/, hooks/ and .mcp.json, and the suite's stand-ins
//           (evals/mocks/). Saturated cases ignore it: they test a skill's text, so they run when that text changes.
//   case    the case's own files and the fixtures its scaffold copies
// The without-plugin arm is a stored baseline, evals/baselines/without-<model>.json: a case gets a fresh one when its case
// hash differs from the stored one, when none is stored for the model, or with --refresh-baseline. Saturated cases
// (evals/tiers.json) never get one routinely: without the plugin they score near 0 every time, so their stored baseline
// stands until --refresh-baseline. --all selects every case (the monthly run); --saturated adds the saturated cases to a
// routine selection; --case limits the selection to the named cases (repeatable).
// Output (stdout, or --json <file>): {model, both:[case], with:[case], skip:[{case, reason}], hashes:{case:{...}}}.
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT, PLUGIN_DIR, listFiles, readJson, sha256, writeJson, fail} from './lib.mjs';

export const CASES_DIR = path.join(ROOT, 'evals', 'cases');
export const MOCKS_DIR = path.join(ROOT, 'evals', 'mocks');
export const RESULTS_DIR = path.join(ROOT, 'evals', 'results');
export const INDEX_FILE = path.join(RESULTS_DIR, 'index.json');
export const DEFAULT_MODEL = 'claude-opus-5-5';
export const DEFAULT_JUDGE = 'claude-haiku-5-5';
export const baselineFile = model => path.join(ROOT, 'evals', 'baselines', `without-${model}.json`);
const TIERS = path.join(ROOT, 'evals', 'tiers.json');
const PLUGIN_PARTS = ['servers', 'agents', 'hooks', '.mcp.json'];

const short = h => h.slice(0, 16);
function hashFiles(entries) {                                 // [[label, absolute path]] → one hash over names and bytes
  const parts = entries.sort(([a], [b]) => a.localeCompare(b)).map(([label, file]) => `${label}\0${sha256(readFileSync(file))}`);
  return short(sha256(parts.join('\n')));
}
const filesUnder = (dir, prefix) => existsSync(dir) ? listFiles(dir).map(rel => [`${prefix}/${rel}`, path.join(dir, rel)]) : [];

export const caseNames = () => existsSync(CASES_DIR) ? listFiles(CASES_DIR).filter(r => r.endsWith('/prompt.md') && !r.startsWith('_')).map(r => r.split('/')[0]).sort() : [];
export const saturatedCases = () => new Set(existsSync(TIERS) ? readJson(TIERS).saturated || [] : []);

/** The skill a case belongs to: the first tag of its prompt.md. */
export function caseSkill(name) {
  const text = readFileSync(path.join(CASES_DIR, name, 'prompt.md'), 'utf8');
  const m = /^tags:\s*\[([^\]]*)\]/m.exec(text);
  const tag = m && m[1].split(',')[0].trim();
  if (!tag) fail(`evals/cases/${name}/prompt.md: no tags line naming its skill`);
  return tag;
}
export function caseHash(name) {
  const dir = path.join(CASES_DIR, name);
  const entries = filesUnder(dir, name);
  const scaffold = path.join(dir, 'scaffold.sh');
  if (existsSync(scaffold)) for (const [, fixture] of readFileSync(scaffold, 'utf8').matchAll(/_fixtures\/([\w.-]+)\//g))
    entries.push(...filesUnder(path.join(CASES_DIR, '_fixtures', fixture), `_fixtures/${fixture}`));
  return hashFiles(entries);
}
export function pluginHash() {
  const entries = PLUGIN_PARTS.flatMap(part => {
    const p = path.join(PLUGIN_DIR, part);
    if (!existsSync(p)) return [];
    return part.includes('.') ? [[part, p]] : filesUnder(p, part);
  });
  return hashFiles([...entries, ...filesUnder(MOCKS_DIR, 'mocks')]);
}
export function skillHashes() {
  return Object.fromEntries(readJson(path.join(PLUGIN_DIR, 'SKILLS.json')).skills.map(s => [s.name, s.content_hash]));
}
export const readIndex = () => existsSync(INDEX_FILE) ? readJson(INDEX_FILE) : {rows: []};
export const readBaseline = model => existsSync(baselineFile(model)) ? readJson(baselineFile(model)) : {model, cases: {}};

export function plan({model = DEFAULT_MODEL, all = false, saturated = false, refreshBaseline = false, only = []} = {}) {
  const skills = skillHashes(), plugin = pluginHash(), sat = saturatedCases();
  const index = readIndex().rows.filter(r => r.model === model && r.arm === 'with');
  const baseline = readBaseline(model).cases;
  const out = {model, both: [], with: [], skip: [], hashes: {}};
  for (const name of caseNames()) {
    if (only.length && !only.includes(name)) continue;
    const skill = caseSkill(name);
    if (!(skill in skills)) { out.skip.push({case: name, reason: `skill ${skill} is not in SKILLS.json`}); continue; }
    const h = {skill, skill_hash: skills[skill], plugin_hash: plugin, case_hash: caseHash(name), saturated: sat.has(name)};
    out.hashes[name] = h;
    const done = index.some(r => r.case === name && r.skill_hash === h.skill_hash && r.case_hash === h.case_hash && (h.saturated || r.plugin_hash === h.plugin_hash));
    if (!all && !only.length && done) { out.skip.push({case: name, reason: 'already run on these hashes'}); continue; }
    if (!all && !only.length && h.saturated && !saturated && index.some(r => r.case === name && r.skill_hash === h.skill_hash)) {
      out.skip.push({case: name, reason: 'saturated; its skill is unchanged'}); continue;
    }
    const stored = baseline[name];
    const fresh = refreshBaseline || (!h.saturated && (!stored || stored.case_hash !== h.case_hash));
    (fresh ? out.both : out.with).push(name);
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = {only: []};
  let json = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--model') opt.model = args[++i];
    else if (a === '--all') opt.all = true;
    else if (a === '--saturated') opt.saturated = true;
    else if (a === '--refresh-baseline') opt.refreshBaseline = true;
    else if (a === '--case') opt.only.push(args[++i]);
    else if (a === '--json') json = args[++i];
    else if (a === '-h' || a === '--help') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 15).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(0); }
    else fail(`unknown option: ${a}`);
  }
  const p = plan(opt);
  if (json) writeJson(json, p);
  else {
    console.log(`model ${p.model}: ${p.both.length} case(s) with and without the plugin, ${p.with.length} with it only, ${p.skip.length} skipped`);
    if (p.both.length) console.log(`  both: ${p.both.join(' ')}`);
    if (p.with.length) console.log(`  with: ${p.with.join(' ')}`);
    const reasons = {};
    for (const s of p.skip) (reasons[s.reason] ||= []).push(s.case);
    for (const [r, cs] of Object.entries(reasons)) console.log(`  skipped (${r}): ${cs.length}`);
  }
}
