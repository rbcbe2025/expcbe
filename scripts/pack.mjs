#!/usr/bin/env node
// pack.mjs — the plugin as one deterministic zip, dist/cloudbackend-<version>.zip: the file the portal's marketplace
// archive source points at and `claude --plugin-url` fetches. The plugin's files sit at the zip root (.claude-plugin/
// plugin.json, skills/, servers/, …) with their Unix modes (connect-deploy.sh stays executable); the same tree always
// gives the same bytes. Build caches and eval results never go in. Records the zip's
// sha256 and size in dist/index.json and in the marketplace entry (an archive source may pin its sha256; a changed
// zip under the same version then fails to install, which is the point: a new build is a new version).
// Refuses a plugin without its two servers.
import {existsSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {ROOT, PLUGIN_DIR, PLUGIN_NAME, DIST, SERVERS, currentVersion, listFiles, zipBuffer, sha256, writeText, readJson, writeJson, zipName, fail} from './lib.mjs';

const version = currentVersion();
if (existsSync(path.join(PLUGIN_DIR, 'bin'))) fail('plugins/cloudbackend/bin/ exists: a top-level bin/ blocks the claude.ai sync');
const files = listFiles(PLUGIN_DIR, {skip: rel => rel === 'node_modules' || rel === '.data'});
if (files.some(f => f.startsWith('evals/'))) fail('plugins/cloudbackend/evals/ exists: the eval cases live in evals/cases/ at the repository root, so an install never carries them');
for (const must of ['.claude-plugin/plugin.json', '.mcp.json', SERVERS.find(s => s.key === 'docs').entry, SERVERS.find(s => s.key === 'build').entry]) {
  if (!files.includes(must)) fail(`${must} is missing from the plugin: nothing to pack (the documentation server comes from scripts/sync-servers.mjs)`);
}
// The client configs (generated at the repository root by gen-clients.mjs) ride in the zip as clients/: the zip is how
// Cursor, VS Code, Codex and Gemini users get the servers, and the configs name the unzipped folder.
const CLIENTS = path.join(ROOT, 'clients');
const clientFiles = existsSync(CLIENTS) ? listFiles(CLIENTS) : [];
const zip = zipBuffer([
  ...files.map(name => ({name, data: readFileSync(path.join(PLUGIN_DIR, name)), mode: statSync(path.join(PLUGIN_DIR, name)).mode})),
  ...clientFiles.map(rel => ({name: `clients/${rel}`, data: readFileSync(path.join(CLIENTS, rel)), mode: statSync(path.join(CLIENTS, rel)).mode})),
]);
const digest = sha256(zip);
writeText(path.join(DIST, zipName(version)), zip);

const indexFile = path.join(DIST, 'index.json'), marketplaceFile = path.join(DIST, 'marketplace.json');
if (existsSync(indexFile)) writeJson(indexFile, {...readJson(indexFile), zip_sha256: digest, zip_bytes: zip.length});
if (existsSync(marketplaceFile)) {
  const m = readJson(marketplaceFile);
  m.plugins = m.plugins.map(p => p.name === PLUGIN_NAME && p.source && p.source.source === 'archive' ? {...p, source: {...p.source, sha256: digest}} : p);
  writeJson(marketplaceFile, m);
}
const counts = {skills: files.filter(f => f.startsWith('skills/')).length, servers: files.filter(f => f.startsWith('servers/')).length, agents: files.filter(f => f.startsWith('agents/') && f.endsWith('.md')).length};
console.log(`dist/${zipName(version)}: ${files.length + clientFiles.length} files (clients ${clientFiles.length}, ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}), ${zip.length.toLocaleString('en')} bytes, sha256 ${digest}`);
