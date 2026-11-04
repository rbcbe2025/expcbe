#!/usr/bin/env node
// pack.mjs — the plugin as one deterministic zip, dist/cloudbackend-<version>.zip: the file the hosted marketplace's
// archive source points at. The plugin's files sit at the zip root (.claude-plugin/plugin.json, skills/, …); the
// same tree always gives the same bytes. Records the zip's sha256 and size in dist/index.json and in the hosted
// marketplace entry (an archive source may pin its sha256; a changed zip under the same version then fails to
// install, which is the point: a new build is a new version).
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {PLUGIN_DIR, PLUGIN_NAME, DIST, currentVersion, listFiles, zipBuffer, sha256, writeText, readJson, writeJson, zipName, fail} from './lib.mjs';

const version = currentVersion();
if (existsSync(path.join(PLUGIN_DIR, 'bin'))) fail('plugins/cloudbackend/bin/ exists: a top-level bin/ blocks the claude.ai sync');
const files = listFiles(PLUGIN_DIR, {skip: rel => rel === 'evals/results' || rel === 'node_modules'});
if (!files.includes('.claude-plugin/plugin.json')) fail('no .claude-plugin/plugin.json in the plugin');
const zip = zipBuffer(files.map(name => ({name, data: readFileSync(path.join(PLUGIN_DIR, name))})));
const digest = sha256(zip);
writeText(path.join(DIST, zipName(version)), zip);

const indexFile = path.join(DIST, 'index.json'), marketplaceFile = path.join(DIST, 'marketplace.json');
if (existsSync(indexFile)) writeJson(indexFile, {...readJson(indexFile), zip_sha256: digest, zip_bytes: zip.length});
if (existsSync(marketplaceFile)) {
  const m = readJson(marketplaceFile);
  m.plugins = m.plugins.map(p => p.name === PLUGIN_NAME && p.source && p.source.source === 'archive' ? {...p, source: {...p.source, sha256: digest}} : p);
  writeJson(marketplaceFile, m);
}
console.log(`dist/${zipName(version)}: ${files.length} files, ${zip.length.toLocaleString('en')} bytes, sha256 ${digest}`);
