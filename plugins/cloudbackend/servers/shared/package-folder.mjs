// A local XIOS/3 package folder, read the same way by every server in the plugin: the tenant server uploads it and
// lints it first, the build server lints or measures it in place. The files are walked in a sorted order, dot-files
// and node_modules are left out, file names must be ASCII, and the folder must hold index.xml. Text files (by
// extension) are what the lint reads; the rest are binary as far as the build tools are concerned.
// ToolError is the plugin's one tool error: a message meant for the caller, sent back as the tool's result.
// Node's built-ins only.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class ToolError extends Error {}

export const MAX_FILES = 1000;
export const TEXT_EXT = new Set(['.xml', '.xsl', '.xslt', '.xsd', '.svg', '.css', '.js', '.mjs', '.json', '.html', '.htm', '.txt', '.md', '.csv']);
const SKIP = new Set(['node_modules', 'Thumbs.db']);

export const extOf = (name) => (String(name).match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
export const isText = (rel) => TEXT_EXT.has(extOf(rel));

/** Every file under root as {rel, abs, size}, sorted per folder; arg names the tool argument in the messages. */
export function walk(root, arg = 'path') {
  const out = [];
  const visit = (dir, rel) => {
    for (const name of readdirSync(dir).sort()) {
      if (name.startsWith('.') || SKIP.has(name)) continue;
      const abs = join(dir, name), r = rel ? `${rel}/${name}` : name, st = statSync(abs);
      if (st.isDirectory()) visit(abs, r);
      else if (st.isFile()) out.push({ rel: r, abs, size: st.size });
      if (out.length > MAX_FILES) throw new ToolError(`more than ${MAX_FILES} files under ${root}: ${arg} should be the package folder (app/ in the workflow layout).`);
    }
  };
  visit(root, '');
  return out;
}

/** The package folder at path: {root, files}. Refuses a path that is not a folder, a folder without index.xml and
 *  file names that are not ASCII. */
export function packageAt(path, arg = 'path') {
  if (!path) throw new ToolError(`${arg} is the local package folder, the one holding index.xml (app/ in the workflow layout).`);
  const root = resolve(String(path));
  if (!existsSync(join(root, 'index.xml'))) {
    let folder = false;
    try { folder = statSync(root).isDirectory(); } catch { /* not there at all */ }
    if (!folder) throw new ToolError(`${root} is not a folder: ${arg} should be the package folder (app/ in the workflow layout).`);
    throw new ToolError(`${root} holds no index.xml: ${arg} should be the package folder (app/ in the workflow layout).`);
  }
  const files = walk(root, arg);
  const odd = files.filter((f) => !/^[\x20-\x7e]+$/.test(f.rel)).map((f) => f.rel);
  if (odd.length) throw new ToolError(`file names must be ASCII; rename: ${odd.slice(0, 10).join(', ')}`);
  return { root, files };
}

/** The text files of a walked package as {path, content}, read as UTF-8: the shape lint and benchmark take. */
export const textFiles = (files) => files.filter((f) => isText(f.rel)).map((f) => ({ path: f.rel, content: readFileSync(f.abs, 'utf8') }));
