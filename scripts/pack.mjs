#!/usr/bin/env node
// pack.mjs — the plugin as one deterministic zip, dist/cloudbackend-<version>.zip: the file the portal's marketplace
// archive source points at and `claude --plugin-url` fetches. The plugin's files sit at the zip root (.claude-plugin/
// plugin.json, skills/, servers/, hooks/, …) with their Unix modes (the hook script stays executable); the same tree
// always gives the same bytes. Build caches, virtual environments and eval results never go in. Records the zip's
// sha256 and size in dist/index.json and in the marketplace entry (an archive source may pin its sha256; a changed
// zip under the same version then fails to install, which is the point: a new build is a new version).
// Refuses a plugin without its documentation server or its hook; says so when the build server is not synced yet
// (the zip then carries no build server, and the hook tells the user at session start).
import {existsSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {PLUGIN_DIR, PLUGIN_NAME, DIST, SERVERS, currentVersion, listFiles, zipBuffer, sha256, writeText, readJson, writeJson, zipName, fail} from './lib.mjs';

const version = currentVersion();
if (existsSync(path.join(PLUGIN_DIR, 'bin'))) fail('plugins/cloudbackend/bin/ exists: a top-level bin/ blocks the claude.ai sync');
const files = listFiles(PLUGIN_DIR, {skip: rel => rel === 'evals/results' || rel === 'node_modules' || rel === '.data'});
for (const must of ['.claude-plugin/plugin.json', '.mcp.json', 'hooks/hooks.json', 'scripts/ensure-build-venv.sh', SERVERS.find(s => s.key === 'build').launcher, SERVERS.find(s => s.key === 'docs').entry]) {
  if (!files.includes(must)) fail(`${must} is missing from the plugin: nothing to pack (servers come from scripts/sync-servers.mjs)`);
}
const buildSrc = SERVERS.find(s => s.key === 'build').src;
const hasBuild = files.includes('servers/build/requirements.txt') && files.some(f => f.startsWith(`${buildSrc}/`));
const zip = zipBuffer(files.map(name => ({name, data: readFileSync(path.join(PLUGIN_DIR, name)), mode: statSync(path.join(PLUGIN_DIR, name)).mode})));
const digest = sha256(zip);
writeText(path.join(DIST, zipName(version)), zip);

const indexFile = path.join(DIST, 'index.json'), marketplaceFile = path.join(DIST, 'marketplace.json');
if (existsSync(indexFile)) writeJson(indexFile, {...readJson(indexFile), zip_sha256: digest, zip_bytes: zip.length});
if (existsSync(marketplaceFile)) {
  const m = readJson(marketplaceFile);
  m.plugins = m.plugins.map(p => p.name === PLUGIN_NAME && p.source && p.source.source === 'archive' ? {...p, source: {...p.source, sha256: digest}} : p);
  writeJson(marketplaceFile, m);
}
const counts = {skills: files.filter(f => f.startsWith('skills/')).length, servers: files.filter(f => f.startsWith('servers/')).length, hooks: files.filter(f => f.startsWith('hooks/')).length, agents: files.filter(f => f.startsWith('agents/') && f.endsWith('.md')).length, evals: files.filter(f => f.startsWith('evals/') && f.endsWith('prompt.md')).length};
console.log(`dist/${zipName(version)}: ${files.length} files (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}), ${zip.length.toLocaleString('en')} bytes, sha256 ${digest}`);
if (!hasBuild) console.log(`  note: servers/build/ is not synced (no ${buildSrc}/ or requirements.txt): this zip carries no build server; run scripts/sync-servers.mjs before a release`);
