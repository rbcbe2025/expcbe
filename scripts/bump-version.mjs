#!/usr/bin/env node
// bump-version.mjs [--check] — the plugin's version, YYYY.MDD.N, moved only when plugins/ differs from the last release.
// A release is the git tag v<version>. The rules:
//   · the current version has no tag: it is unreleased. It keeps its number if it is today's and is re-dated to
//     today's .0 otherwise (an unreleased number is not counted against)
//   · tagged, and plugins/ is byte for byte what the tag holds (tracked and untracked): nothing to do
//   · tagged and plugins/ changed: today's base with the next free N (…1104.0 → …1104.1 the same day)
// Writes plugins/cloudbackend/.claude-plugin/plugin.json and the marketplace entry, which must agree with it.
// --check only reports, exit 1 if a bump is due.
import {execFileSync} from 'node:child_process';
import {ROOT, PLUGIN_NAME, MANIFEST, MARKETPLACE, readJson, writeJson, parseVersion, todayBase, compareVersions, fail} from './lib.mjs';

const check = process.argv.includes('--check');
const git = (...args) => execFileSync('git', args, {cwd: ROOT, encoding: 'utf8'}).trim();
const manifest = readJson(MANIFEST);
const marketplace = readJson(MARKETPLACE);
const entry = marketplace.plugins.find(p => p.name === PLUGIN_NAME);
if (!entry) fail(`no "${PLUGIN_NAME}" entry in the marketplace`);
const current = manifest.version;
if (!parseVersion(current)) fail(`plugin.json version "${current}" is not YYYY.MDD.N`);

const tags = git('tag', '--list', 'v*').split('\n').map(t => t.slice(1)).filter(v => parseVersion(v)).sort(compareVersions);
const today = todayBase();
let next = current, why;
if (!tags.includes(current)) {
  if (parseVersion(current).base === today) why = `${current} is unreleased and dated today: stays`;
  else { next = `${today}.0`; why = `${current} is unreleased and dated ${parseVersion(current).base}: re-dated to ${next}`; }
} else {
  let changed = false;
  try { execFileSync('git', ['diff', '--quiet', `v${current}`, '--', 'plugins'], {cwd: ROOT}); } catch { changed = true; }
  if (git('ls-files', '--others', '--exclude-standard', '--', 'plugins')) changed = true;
  if (!changed) why = `plugins/ is what v${current} holds: stays`;
  else {
    const n = tags.filter(v => parseVersion(v).base === today).reduce((m, v) => Math.max(m, parseVersion(v).n + 1), 0);
    next = `${today}.${n}`;
    why = `plugins/ changed since v${current}: ${next}`;
  }
}
const last = tags.at(-1);
if (last && compareVersions(next, last) < 0) fail(`${next} would sort below the last tag v${last}; sort the tags out by hand`);

const marketplaceStale = entry.version !== next || (marketplace.metadata && marketplace.metadata.version !== next);
if (check) {
  console.log(`version ${current}: ${why}${marketplaceStale ? ' (marketplace entry out of step)' : ''}`);
  process.exit(next !== current || marketplaceStale ? 1 : 0);
}
if (next === current && !marketplaceStale) { console.log(`version ${current}: ${why}`); process.exit(0); }
manifest.version = next;
entry.version = next;
if (marketplace.metadata) marketplace.metadata.version = next;
writeJson(MANIFEST, manifest);
writeJson(MARKETPLACE, marketplace);
console.log(`version ${current} → ${next}: ${why}; plugin.json and the marketplace entry written`);
