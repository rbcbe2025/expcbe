#!/usr/bin/env node
// cloudbackend-build - the CloudBackend PaaS build tools for a XIOS/3 package, as two MCP tools over stdio:
//   lint_project       the tenant grammar (rules G01-G20) applied to a package, before an upload
//   benchmark_project  the measured block of a benchmark report (files, lines, bytes, views, processes, ...)
// The package is a local folder (`dir`, read by ../shared/package-folder.mjs as the tenant server reads it for an
// upload) or the files themselves in the request (`files`, for clients without a file system).
//
// This is a port of the Python reference implementation, the cbemcp-build package in the deploy server's codebase
// (its lint.py and benchmark.py; that package stays the server-side implementation behind the deploy connector).
// golden/ is that package's golden lint fixture, vendored by scripts/sync-servers.mjs: test.mjs holds this port to
// the reference's findings and to its rule table (ids, profiles, severities).
// The rules are data: the server reads the plugin's own copy of the workflow skill's reference, GRAMMAR_PATH below
// (resolved relative to this file, and named nowhere else), so the rule table has
// ONE source inside the plugin. It accepts both shapes of that file: the one with {placeholder} messages and the
// allowed_xpath_functions / limits sections, and the shorter one whose messages are plain sentences (then the
// finding texts come from the templates below, which mirror the reference, and the function list and limits are
// the defaults below, copied from the reference on 2026-11-04). Rule G00 is the XSD validation that happens at
// upload: upload_project on the deploy connector validates against the published schemas, so here G00 only
// reports XML that is not well-formed, and the result says where the schema check happens.
//
// Zero dependencies: the XML is read by the small tolerant tokenizer below (elements, attributes, text, the five
// XML entities and character references; comments, CDATA, processing instructions and a DOCTYPE are skipped), with
// the line of every start tag kept for the findings. Nothing is written anywhere and nothing needs a tenant.
// MCP over stdio, newline-delimited JSON-RPC; results are capped at 60,000 characters. ASCII only.

import { existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ToolError, isText, packageAt, textFiles } from '../shared/package-folder.mjs';

export { ToolError };

const VERSION = '2026.11.7';
const SERVER_NAME = 'cloudbackend-build';
const HERE = dirname(fileURLToPath(import.meta.url));
// Where the skills sync puts the grammar: in cloudbackend-saas-launch since the 2026-11-07 skill merge, in
// xios3-app-workflow before it. The first that exists (the new one when neither does, so an error names it). Drop the
// old entry once every synced plugin has the merged skills.
const GRAMMAR_CANDIDATES = ['cloudbackend-saas-launch', 'xios3-app-workflow'].map((skill) => join(HERE, '..', '..', 'skills', skill, 'references', 'tenant-grammar.json'));
export const GRAMMAR_PATH = GRAMMAR_CANDIDATES.find((p) => existsSync(p)) || GRAMMAR_CANDIDATES[0];

export const MANIFEST = 'index.xml';
const XML_EXTENSIONS = ['.xml', '.xsl', '.xslt', '.xsd', '.svg'];
const STYLE_EXTENSIONS = ['.css'];
const SCRIPT_EXTENSIONS = ['.js', '.mjs'];
const FONT_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
const PLATFORM_HOSTS = ['.cloudbackend.com', '.cloudbackend.cloud'];
// Internal schemes a link may use without pointing at a package file.
const EXTERNAL_SCHEMES = ['http:', 'https:', 'xios:', 'home:', 'tenant:', 'icon:', 'data:', 'mailto:', 'tel:', 'javascript:', 'blob:', 'about:', 'host:'];
const LOGIN_PROCESS_HREF = 'xios://apps/login.xml';
export const PROFILES = ['build', 'ship'];
const SEVERITIES = ['error', 'warning', 'info'];

const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XSL_NS = 'http://www.w3.org/1999/XSL/Transform';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XLINK_HREF = `{${XLINK_NS}}href`;
const XLINK_ACTUATE = `{${XLINK_NS}}actuate`;

// ---- the grammar ---------------------------------------------------------------------------------------------------

// The finding texts of the reference implementation, used when the loaded rule's message carries no placeholder.
const DEFAULT_TEMPLATES = {
  G00: '{file}: {reason}',
  G01: '{detail}',
  G02: '{detail}',
  G03: '{file} line {line}: {function}() is not an allowed function',
  G04: '{file} line {line}: <operation name="call"> uses step= instead of value=',
  G05: '{file} line {line}: <{tag}> is not a XIOS/3 component',
  G06: '{file} line {line}: the process loads a script but has no <step id="start">',
  G07: '{file} line {line}: {attr}="{href}" {detail}',
  G08: '{file} line {line}: {detail}',
  G09: '{file} line {line}: non-ASCII character',
  G10: '{detail}',
  G11: '{file} line {line}: {detail}',
  G12: '{file} line {line}: a string shaped like {kind}',
  G13: '{file} line {line}: a database write to {href} with no guard, in a package shared with the tenant',
  G14: '{file} line {line}: {detail}',
  G15: '{file}: a font file of {size} bytes',
  G16: '{detail}',
  G17: '{file} line {line}: <proxy> under a channel operation: expected, deploy with Deploy Anyway',
  G18: '{detail}',
  G19: '{file} line {line}: {detail}',
  G20: '{file} line {line}: {detail}',
};
// The documented XIOS/3 functions, the XPath 1.0 core library and datadoc, as the reference lists them while the
// tenant's own list is still to be measured.
const DEFAULT_FUNCTIONS = [
  'absolute-path', 'apply-locale', 'capitalize', 'changedate', 'changes', 'channelname', 'combine-path', 'concat',
  'contains', 'count', 'count-selection', 'datatype', 'document', 'downcase', 'emitter', 'escape-string', 'file-exists',
  'filename', 'folder-exists', 'folderid', 'foldername', 'folderpath', 'format-bytes', 'format-date', 'get-label',
  'index-of', 'is-alias', 'is-color', 'is-open', 'is-running', 'is-text-type', 'join', 'local-name', 'localizedate',
  'match', 'parent', 'parsedate', 'position', 'random', 'read', 'replace', 'screen', 'selected-text', 'selection',
  'substring', 'substring-after', 'substring-before', 'text-selection', 'translate', 'trim', 'upcase', 'xml',
  'xpath-escape', 'boolean', 'ceiling', 'false', 'floor', 'id', 'lang', 'last', 'name', 'namespace-uri',
  'normalize-space', 'not', 'number', 'round', 'starts-with', 'string', 'string-length', 'sum', 'true', 'datadoc',
];
const DEFAULT_LIMITS = { max_files: 500, max_file_bytes: 2097152, max_total_bytes: 8388608, font_file_warning_bytes: 204800 };
// Every element name view.xsd declares (the CloudBackend extension's schema set, as vendored by the reference on
// 2026-09-07; extracted 2026-11-04). The reference reads the schema at run time; the plugin carries no schemas.
const NATIVE_COMPONENT_NAMES = new Set([
  'accordion', 'action', 'alias', 'app', 'appdesigner', 'area', 'audiocontroller', 'banner', 'boxlist', 'breadcrumbs',
  'browser', 'bush', 'button', 'buttonbox', 'calendar', 'canvas', 'carousel', 'chart', 'chatrender', 'checkbox', 'circle',
  'city', 'clock', 'codeeditor', 'collapse', 'color', 'colorgradient', 'colorpicker', 'colorswatches', 'column', 'columns',
  'combobox', 'command', 'component', 'container', 'dataitem', 'date', 'desktop', 'disabled', 'divider', 'dummy', 'editor',
  'error', 'expander', 'expanderitem', 'expandermenu', 'ext', 'filelist', 'filepicker', 'form', 'gradient', 'grid', 'group',
  'header', 'hover', 'html', 'icongrid', 'iconlist', 'identity', 'image', 'index', 'info', 'input', 'item', 'label',
  'launchpad', 'layout', 'list', 'listview', 'look', 'macro', 'macros', 'map', 'marker', 'markerOptions', 'media', 'menu',
  'menubar', 'movie', 'music', 'panel', 'path', 'photo', 'pipeline', 'placeholder', 'plate', 'player', 'plotly', 'progress',
  'progressbar', 'qr', 'radio', 'rating', 'react', 'render', 'richtext', 'row', 'rule', 'script', 'selected', 'shape',
  'shell', 'slider', 'spinner', 'status', 'stroke', 'style', 'tabstrip', 'textarea', 'texteditor', 'themes', 'tinymce',
  'toggle', 'toolbar', 'tree', 'upload', 'veditor', 'video', 'view', 'widgetpane', 'wifi', 'xmleditor', 'xycontrol',
  'xylist', 'xymenu',
]);
const SCHEMA_NOTE = 'Schema validation (G00) happens at upload: upload_project on the deploy connector validates the manifest and every XML file it links against the published schemas. Here G00 reports only XML that is not well-formed.';

export function loadGrammar(path = GRAMMAR_PATH) {
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const rules = new Map();
  for (const r of data.rules || []) {
    if (!PROFILES.includes(r.profile) || !SEVERITIES.includes(r.severity)) throw new Error(`grammar rule ${r.id}: bad profile or severity`);
    const hasPlaceholders = /\{[a-z_]+\}/.test(r.message || '');
    rules.set(r.id, {
      id: r.id, title: r.title || '', profile: r.profile, severity: r.severity,
      message: hasPlaceholders ? r.message : (DEFAULT_TEMPLATES[r.id] || '{detail}'),
      rule_message: hasPlaceholders ? '' : (r.message || ''),
      fix: r.fix || '', notes: r.notes || '',
    });
  }
  if (!rules.size) throw new Error(`${path}: no rules`);
  const functions = data.allowed_xpath_functions || (rules.get('G03') && (data.rules.find((r) => r.id === 'G03') || {}).allowed_xpath_functions) || {};
  return {
    version: data.grammar_version || '?',
    rules,
    allowedFunctions: new Set(Array.isArray(functions.functions) && functions.functions.length ? functions.functions : DEFAULT_FUNCTIONS),
    functionsStatus: functions.status || 'to be measured on a tenant',
    limits: { ...DEFAULT_LIMITS, ...(data.limits || {}) },
  };
}
let grammarCache = null;
const grammar = () => (grammarCache ||= loadGrammar());

// ---- XML: a tolerant tokenizer that keeps line numbers -----------------------------------------------------------------
// Elements are {tag, attrib, text, children, line}: tag and prefixed attribute names are '{uri}local' as
// ElementTree spells them, unprefixed attributes are plain names, text is the text before the first child.

export class XmlSyntaxError extends Error {
  constructor(message, line) { super(message); this.line = line; }
}
const NAME = /^[A-Za-z_:][\w.\-:]*/;
const unescapeXml = (s) => s.replace(/&(#x[0-9a-fA-F]+|#\d+|lt|gt|amp|quot|apos);/g, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }[e];
});
export const localName = (tag) => (tag.startsWith('{') ? tag.slice(tag.lastIndexOf('}') + 1) : tag);
export function* iter(elem) { yield elem; for (const c of elem.children) yield* iter(c); }
const children = (elem, name) => elem.children.filter((c) => localName(c.tag) === name);
const find = (elem, path) => path.split('/').reduce((cur, name) => (cur ? children(cur, name)[0] : undefined), elem);
const findtext = (elem, path) => { const e = find(elem, path); return e ? e.text : ''; };

export function parseXml(text) {
  let i = 0, line = 1;
  const n = text.length, stack = [], roots = [], nsStack = [{ xml: XML_NS }];
  const fail = (message, at) => { throw new XmlSyntaxError(message, at || line); };
  const advance = (to) => { for (; i < to; i++) if (text.charCodeAt(i) === 10) line++; };
  const appendText = (elem, chunk) => { if (elem.children.length) elem.children[elem.children.length - 1].tail = (elem.children[elem.children.length - 1].tail || '') + chunk; else elem.text += chunk; };
  const isSpace = (ch) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
  while (i < n) {
    if (text[i] !== '<') {
      const j = text.indexOf('<', i), end = j < 0 ? n : j, chunk = text.slice(i, end);
      if (stack.length) appendText(stack[stack.length - 1], unescapeXml(chunk));
      else if (chunk.trim()) fail(roots.length ? 'junk after document element' : 'syntax error: text outside the root element');
      advance(end); continue;
    }
    if (text.startsWith('<!--', i)) { const j = text.indexOf('-->', i + 4); if (j < 0) fail('unclosed comment'); advance(j + 3); continue; }
    if (text.startsWith('<![CDATA[', i)) { const j = text.indexOf(']]>', i + 9); if (j < 0) fail('unclosed CDATA section'); if (stack.length) appendText(stack[stack.length - 1], text.slice(i + 9, j)); advance(j + 3); continue; }
    if (text.startsWith('<?', i)) { const j = text.indexOf('?>', i + 2); if (j < 0) fail('unclosed processing instruction'); advance(j + 2); continue; }
    if (text.startsWith('<!', i)) {
      let depth = 0, j = i + 2;
      for (; j < n; j++) { const ch = text[j]; if (ch === '[') depth++; else if (ch === ']') depth--; else if (ch === '>' && depth <= 0) break; }
      if (j >= n) fail('unclosed declaration');
      advance(j + 1); continue;
    }
    if (text.startsWith('</', i)) {
      const j = text.indexOf('>', i); if (j < 0) fail('unclosed end tag');
      const name = text.slice(i + 2, j).trim();
      if (!stack.length) fail(`end tag </${name}> without a start tag`);
      const top = stack.pop(); nsStack.pop();
      if (top.qname !== name) fail(`mismatched tag: expected </${top.qname}>, found </${name}>`);
      advance(j + 1); continue;
    }
    const startLine = line;
    let j = i + 1;
    const m = NAME.exec(text.slice(j, j + 512)); if (!m) fail('not well-formed (invalid token)');
    const qname = m[0]; j += qname.length;
    const attrs = []; let selfClose = false;
    for (;;) {
      while (j < n && isSpace(text[j])) j++;
      if (j >= n) fail(`unclosed start tag <${qname}>`, startLine);
      if (text[j] === '>') { j++; break; }
      if (text[j] === '/' && text[j + 1] === '>') { j += 2; selfClose = true; break; }
      const am = NAME.exec(text.slice(j, j + 512)); if (!am) fail(`not well-formed (invalid token) in <${qname}>`, startLine);
      let k = j + am[0].length;
      while (k < n && isSpace(text[k])) k++;
      if (text[k] !== '=') fail(`attribute ${am[0]} of <${qname}> has no value`, startLine);
      k++; while (k < n && isSpace(text[k])) k++;
      const q = text[k]; if (q !== '"' && q !== "'") fail(`attribute ${am[0]} of <${qname}> is not quoted`, startLine);
      const e = text.indexOf(q, k + 1); if (e < 0) fail(`unclosed attribute value in <${qname}>`, startLine);
      const raw = text.slice(k + 1, e); if (raw.includes('<')) fail(`< in the value of ${am[0]}`, startLine);
      attrs.push([am[0], unescapeXml(raw)]); j = e + 1;
    }
    const ns = Object.create(nsStack[nsStack.length - 1]);
    for (const [k, v] of attrs) { if (k === 'xmlns') ns[''] = v; else if (k.startsWith('xmlns:')) ns[k.slice(6)] = v; }
    const qualify = (name, isAttr) => {
      const c = name.indexOf(':');
      if (c < 0) return isAttr || !ns[''] ? name : `{${ns['']}}${name}`;
      const uri = ns[name.slice(0, c)];
      if (uri === undefined) fail(`unbound prefix ${name.slice(0, c)}`, startLine);
      return `{${uri}}${name.slice(c + 1)}`;
    };
    const elem = { tag: qualify(qname, false), qname, attrib: {}, text: '', tail: '', children: [], line: startLine };
    for (const [k, v] of attrs) {
      if (k === 'xmlns' || k.startsWith('xmlns:')) continue;
      const key = qualify(k, true);
      if (key in elem.attrib) fail(`duplicate attribute ${k}`, startLine);
      elem.attrib[key] = v;
    }
    if (stack.length) stack[stack.length - 1].children.push(elem);
    else { if (roots.length) fail('junk after document element', startLine); roots.push(elem); }
    advance(j);
    if (!selfClose) { stack.push(elem); nsStack.push(ns); }
  }
  if (stack.length) fail(`no element found: <${stack[stack.length - 1].qname}> is not closed`);
  if (!roots.length) fail('no root element', 1);
  return roots[0];
}

// ---- the package ---------------------------------------------------------------------------------------------------

/** The parts of a path inside a package: no '..', no control characters, no empty name (a security control in the
 *  reference, where it stops an uploaded path from escaping its project container; kept identical here). */
export function checkRelativePath(path) {
  const parts = [];
  for (let part of String(path).replace(/\\/g, '/').split('/')) {
    part = part.trim();
    if (part === '' || part === '.') continue;
    if (part === '..') throw new ToolError(`Invalid path '${path}': it must not contain '..'`);
    if (/[\x00-\x1f]/.test(part)) throw new ToolError(`Invalid path '${path}': it must not contain control characters`);
    parts.push(part);
  }
  if (!parts.length) throw new ToolError(`Invalid path '${path}': missing a file name`);
  return parts;
}
const posix = {
  dirname: (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : ''),
  basename: (p) => p.slice(p.lastIndexOf('/') + 1),
  normpath: (p) => {
    const out = [];
    for (const seg of p.split('/')) {
      if (seg === '' || seg === '.') continue;
      if (seg === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else out.push('..'); }
      else out.push(seg);
    }
    return (p.startsWith('/') ? '/' : '') + (out.join('/') || (p.startsWith('/') ? '' : '.'));
  },
};
const byteLength = (s) => Buffer.byteLength(s, 'utf8');
const lineOf = (text, index) => { let l = 1; for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) l++; return l; };
const endsWithAny = (s, exts) => exts.some((e) => s.toLowerCase().endsWith(e));

export function componentNames(view) {
  const names = new Set();
  for (const e of iter(view)) if (e.attrib.name) names.add(e.attrib.name);
  return names;
}

export class Package {
  constructor(files) {
    this.files = {}; this.order = []; this.xml = {}; this.parseErrors = {};
    for (const { path, content } of files) {
      const norm = checkRelativePath(path).join('/');
      if (norm in this.files) throw new ToolError(`Duplicate path '${path}' in files`);
      this.files[norm] = String(content ?? ''); this.order.push(norm);
    }
    for (const path of this.order) {
      if (!endsWithAny(path, XML_EXTENSIONS)) continue;
      try { this.xml[path] = { path, text: this.files[path], root: parseXml(this.files[path]) }; }
      catch (e) { if (e instanceof XmlSyntaxError) this.parseErrors[path] = [e.message, e.line]; else throw e; }
    }
    this.manifest = this.xml[MANIFEST] || null;
    if (this.manifest && localName(this.manifest.root.tag) !== 'application') this.manifest = null;
    this.manifestViews = []; this.manifestProcesses = [];
    this.viewFiles = {}; this.processFiles = {};
    this.viewNames = new Set(); this.viewComponents = new Map();
    this.tenantTarget = false;
    this.index();
  }
  index() {
    for (const [path, xf] of Object.entries(this.xml)) {
      const tag = localName(xf.root.tag);
      if (tag === 'view' && path !== MANIFEST) this.viewFiles[path] = xf;
      else if (tag === 'process' && path !== MANIFEST) this.processFiles[path] = xf;
    }
    if (!this.manifest) return;
    const root = this.manifest.root;
    for (const child of root.children) {
      const tag = localName(child.tag);
      if (tag === 'view') this.manifestViews.push(child);
      else if (tag === 'process') this.manifestProcesses.push(child);
    }
    const settingsPath = findtext(root, 'settings/path') || '';
    const share = (findtext(root, 'share') || '').trim().toLowerCase();
    this.tenantTarget = settingsPath.trim().startsWith('tenant://') || share === 'true';
    const namesOf = (name) => { if (!this.viewComponents.has(name)) this.viewComponents.set(name, new Set()); return this.viewComponents.get(name); };
    for (const view of this.manifestViews) {
      const name = view.attrib.name || '';
      if (name) this.viewNames.add(name);
      const names = namesOf(name);
      const target = this.resolve(MANIFEST, view.attrib[XLINK_HREF] || '');
      if (target && this.xml[target]) for (const c of componentNames(this.xml[target].root)) names.add(c);
      if (view.children.length) for (const c of componentNames(view)) names.add(c);
    }
    // a view file nobody declared still names a view
    for (const xf of Object.values(this.viewFiles)) {
      const name = xf.root.attrib.name || '';
      if (name && !this.viewNames.has(name)) { this.viewNames.add(name); for (const c of componentNames(xf.root)) namesOf(name).add(c); }
    }
  }
  /** The package path an href in fromPath points at; '' for an external or dynamic reference; null when it escapes. */
  resolve(fromPath, href) {
    href = (href || '').trim();
    if (href === '' || href.includes('{') || href.startsWith('#')) return '';
    const lower = href.toLowerCase();
    if (EXTERNAL_SCHEMES.some((s) => lower.startsWith(s)) || href.startsWith('//')) return '';
    const scheme = /^[A-Za-z][A-Za-z0-9+.-]*:/.exec(href);
    if (scheme) return '';
    let path = href.split('#')[0].split('?')[0];
    if (path.startsWith('/')) return null;
    if (path === '') return '';
    const joined = posix.normpath((posix.dirname(fromPath) ? posix.dirname(fromPath) + '/' : '') + path);
    if (joined.startsWith('../') || joined === '..' || joined.startsWith('/')) return null;
    return joined;
  }
  /** Every process: the root of each process file, and each inline process in the manifest. */
  processDocs() {
    const docs = Object.values(this.processFiles).map((xf) => [xf, xf.root]);
    if (this.manifest) for (const p of this.manifestProcesses) if (p.children.length) docs.push([this.manifest, p]);
    return docs;
  }
  viewDocs() {
    const docs = Object.values(this.viewFiles).map((xf) => [xf, xf.root]);
    if (this.manifest) for (const v of this.manifestViews) if (v.children.length) docs.push([this.manifest, v]);
    return docs;
  }
  extension(path) { const base = posix.basename(path); return base.includes('.') ? base.slice(base.lastIndexOf('.') + 1).toLowerCase() : ''; }
}

// ---- findings -------------------------------------------------------------------------------------------------------

const safeFormat = (template, ctx) => template.replace(/\{([a-z_]+)\}/g, (m, k) => (k in ctx ? String(ctx[k]) : m));
const repr = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

class Report {
  constructor(g, active) { this.grammar = g; this.active = active; this.findings = { error: [], warning: [], info: [] }; }
  add(ruleId, { file = '', line = 0, severity = null, ...ctx } = {}) {
    if (!this.active.has(ruleId)) return;
    const rule = this.grammar.rules.get(ruleId);
    ctx.file ??= file || '(package)'; ctx.line ??= line;
    const finding = { rule: ruleId, file, line, message: safeFormat(rule.message, ctx), fix: safeFormat(rule.fix, ctx) };
    const bucket = this.findings[severity || rule.severity];
    const key = JSON.stringify(finding);
    if (!bucket.some((f) => JSON.stringify(f) === key)) bucket.push(finding);
  }
}

// ---- the rules ------------------------------------------------------------------------------------------------------

const NCNAME = /^[A-Za-z_][A-Za-z0-9._-]*$/;
const FUNCTION_CALL = /(?<![\w.#$\-:])([A-Za-z_][\w\-]*)\s*\(/g;
const QUOTED = /'[^']*'|"[^"]*"/g;
// not a character reference (&#215;) and not a {#view#component} token
const HEX_COLOUR = /(?<![&\w{#])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?!#)/;
const CSS_VAR = /var\([^)]*\)/g;
const VIEW_COMPONENT_REF = /(?<![\w$])#([A-Za-z_][\w\-]*)#([A-Za-z_][\w\-]*)/g;
const FETCH_EXTERNAL = /\bfetch\s*\(\s*["'`](https?:)?\/\/([^/"'`]+)/g;
const XHR_OPEN = /\.open\s*\(\s*["'`][A-Za-z]+["'`]\s*,\s*["'`](https?:)?\/\/([^/"'`]+)/g;
const XHR_NEW = /\bnew\s+XMLHttpRequest\b/;
const DEPLOYMENT_NAME = /^[a-z0-9]+$/;
// Secret shapes. The value is never written into a finding, only the kind.
const SECRET_SHAPES = [
  ['a private key block', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/],
  ['a JSON Web Token', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/],
  ['an OpenAI-style secret key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['an AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['a GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}/],
  ['a Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['a Google API key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['a bearer token in a header', /\bbearer\s+[A-Za-z0-9_\-.=]{24,}/i],
  ['a credential assignment', /\b(?:api[_-]?key|secret[_-]?key|access[_-]?token|client[_-]?secret|password)\b\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];

/** The {...} expressions in an attribute value or text, braces balanced. */
function expressions(value) {
  const out = []; let depth = 0, start = -1;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '{') { if (depth === 0) start = i + 1; depth++; }
    else if (ch === '}' && depth > 0) { depth--; if (depth === 0) out.push(value.slice(start, i)); }
  }
  return out;
}
const isPlatformHost = (host) => { host = host.toLowerCase().split(':')[0]; return PLATFORM_HOSTS.some((h) => host === h.slice(1) || host.endsWith(h)); };
const attrLocal = (key) => localName(key);

const RULES = {
  G00(pkg, report) {
    for (const [path, [message, line]] of Object.entries(pkg.parseErrors)) report.add('G00', { file: path, line, reason: `not well-formed XML: ${message}` });
  },
  G01(pkg, report) {
    if (!(MANIFEST in pkg.files)) { report.add('G01', { file: MANIFEST, detail: 'there is no index.xml at the package root' }); return; }
    if (MANIFEST in pkg.parseErrors) return;
    const xf = pkg.xml[MANIFEST];
    if (!xf || localName(xf.root.tag) !== 'application') {
      report.add('G01', { file: MANIFEST, line: 1, detail: `the root element is <${xf ? localName(xf.root.tag) : '?'}>, not <application>` }); return;
    }
    const about = find(xf.root, 'about');
    if (!about) report.add('G01', { file: MANIFEST, line: 1, detail: 'the manifest has no <about> element' });
    else if (!about.attrib.version) report.add('G01', { file: MANIFEST, line: about.line, detail: '<about> has no version attribute' });
    for (const proc of pkg.manifestProcesses) if ('version' in proc.attrib) report.add('G01', { file: MANIFEST, line: proc.line, detail: '<process> carries a version attribute' });
    for (const [path, pxf] of Object.entries(pkg.processFiles)) if ('version' in pxf.root.attrib) report.add('G01', { file: path, line: pxf.root.line, detail: '<process> carries a version attribute' });
  },
  G02(pkg, report) {
    for (const path of pkg.order) if (posix.basename(path).toLowerCase() === 'view.xml') report.add('G02', { file: path, line: 1, detail: 'a view file named view.xml' });
    const seen = new Map();
    for (const view of pkg.manifestViews) {
      const name = view.attrib.name || '';
      if (name) { if (!seen.has(name)) seen.set(name, []); seen.get(name).push([view.line, view.attrib.screen || '']); }
    }
    for (const [name, decls] of seen) {
      if (decls.length < 2) continue;
      const screens = decls.map((d) => d[1]);
      if (screens.includes('') || new Set(screens).size !== screens.length) {
        report.add('G02', { file: MANIFEST, line: decls[1][0], detail: `view name ${repr(name)} is declared ${decls.length} times without a distinct screen= on each` });
      }
    }
  },
  G03(pkg, report) {
    const allowed = report.grammar.allowedFunctions;
    for (const [xf, root] of [...pkg.viewDocs(), ...pkg.processDocs()]) {
      for (const elem of iter(root)) {
        if (localName(elem.tag) === 'script') continue;
        const sources = [];
        for (const [attr, value] of Object.entries(elem.attrib)) {
          if (['select', 'test', 'match'].includes(attrLocal(attr))) sources.push(value);
          sources.push(...expressions(value));
        }
        if (elem.text) sources.push(...expressions(elem.text));
        for (const source of sources) {
          const stripped = source.replace(QUOTED, "''");
          for (const m of stripped.matchAll(FUNCTION_CALL)) if (!allowed.has(m[1])) report.add('G03', { file: xf.path, line: elem.line, function: m[1] });
        }
      }
    }
  },
  G04(pkg, report) {
    for (const [xf, root] of pkg.processDocs()) for (const elem of iter(root)) {
      if (localName(elem.tag) === 'operation' && elem.attrib.name === 'call' && 'step' in elem.attrib) report.add('G04', { file: xf.path, line: elem.line });
    }
  },
  G05(pkg, report) {
    for (const [xf, root] of pkg.viewDocs()) for (const elem of iter(root)) {
      const tag = localName(elem.tag);
      if (['select', 'option', 'a'].includes(tag) && !elem.tag.startsWith('{')) report.add('G05', { file: xf.path, line: elem.line, tag });
    }
  },
  G06(pkg, report) {
    for (const [xf, root] of pkg.processDocs()) {
      const scripts = root.children.filter((s) => localName(s.tag) === 'script' && s.attrib.href);
      if (!scripts.length) continue;
      if (!root.children.some((s) => localName(s.tag) === 'step' && s.attrib.id === 'start')) report.add('G06', { file: xf.path, line: scripts[0].line });
    }
  },
  G07(pkg, report) {
    for (const [path, xf] of Object.entries(pkg.xml)) for (const elem of iter(xf.root)) {
      for (const attr of ['href', XLINK_HREF]) {
        const href = elem.attrib[attr];
        if (href === undefined) continue;
        if (elem.tag.startsWith(`{${XSL_NS}`) && !['import', 'include'].includes(localName(elem.tag))) continue;
        const target = pkg.resolve(path, href);
        const attrName = attr === XLINK_HREF ? 'xlink:href' : 'href';
        if (target === null) report.add('G07', { file: path, line: elem.line, attr: attrName, href, detail: 'escapes the package root' });
        else if (target && !(target in pkg.files)) report.add('G07', { file: path, line: elem.line, attr: attrName, href, detail: 'does not resolve to a file in the package' });
      }
    }
  },
  G08(pkg, report) {
    if (!pkg.manifest) return;
    const components = find(pkg.manifest.root, 'components');
    for (const comp of components ? children(components, 'component') : []) {
      const tag = (comp.attrib.tag || comp.attrib.name || '').trim();
      if (tag === '') continue;
      if (!NCNAME.test(tag)) report.add('G08', { file: MANIFEST, line: comp.line, detail: `component tag ${repr(tag)} is not an XML name` });
      else if (NATIVE_COMPONENT_NAMES.has(tag)) report.add('G08', { file: MANIFEST, line: comp.line, severity: 'warning', detail: `component tag ${repr(tag)} shadows a native component of the same name` });
    }
  },
  G09(pkg, report) {
    for (const path of pkg.order) {
      const text = pkg.files[path];
      for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) > 0x7f) { report.add('G09', { file: path, line: lineOf(text, i) }); break; }
    }
  },
  G10(pkg, report) {
    for (const path of pkg.order) {
      const isView = path in pkg.viewFiles;
      const isStyle = endsWithAny(path, STYLE_EXTENSIONS) || endsWithAny(path, ['.xsl', '.xslt']);
      if (!isView && !isStyle) continue;
      const stripped = pkg.files[path].replace(CSS_VAR, 'var()');
      const m = HEX_COLOUR.exec(stripped);
      if (m) report.add('G10', { file: path, line: lineOf(stripped, m.index), detail: `${path}: a hex colour outside the token theme` });
    }
    if (!pkg.manifest) return;
    for (const view of pkg.manifestViews) {
      if (!view.children.length) continue;
      let found = false;
      for (const elem of iter(view)) {
        if (found) break;
        for (const value of Object.values(elem.attrib)) if (HEX_COLOUR.test(value.replace(CSS_VAR, 'var()'))) { report.add('G10', { file: MANIFEST, line: elem.line, detail: 'a hex colour in an inline view, outside the token theme' }); found = true; break; }
      }
    }
    const themes = pkg.manifest.root.children.filter((t) => localName(t.tag) === 'theme');
    const tokenThemes = themes.filter((t) => (t.attrib.tokens || '').toLowerCase() === 'true');
    if (tokenThemes.length === 0) report.add('G10', { file: MANIFEST, line: 1, detail: 'no <theme tokens="true"> token block in the manifest' });
    else if (tokenThemes.length > 1) report.add('G10', { file: MANIFEST, line: tokenThemes[1].line, detail: `${tokenThemes.length} token themes; exactly one is scoped to the app` });
    else {
      const theme = tokenThemes[0], tokens = find(theme, 'tokens');
      if (!tokens || !tokens.children.length) report.add('G10', { file: MANIFEST, line: theme.line, detail: 'the token theme has no <tokens> knobs' });
      else {
        const names = new Set(tokens.children.map((t) => localName(t.tag)));
        if (!names.has('font-sans') && !names.has('font-family')) report.add('G10', { file: MANIFEST, line: tokens.line, detail: 'the token theme does not declare a font family (font-sans)' });
        for (const t of tokens.children) if ((t.text || '').includes('var(')) { report.add('G10', { file: MANIFEST, line: t.line, detail: `token ${localName(t.tag)} is not a literal value` }); break; }
      }
    }
  },
  G11(pkg, report) {
    for (const path of pkg.order) {
      if (!endsWithAny(path, SCRIPT_EXTENSIONS)) continue;
      const text = pkg.files[path];
      for (const m of text.matchAll(FETCH_EXTERNAL)) if (!isPlatformHost(m[2])) report.add('G11', { file: path, line: lineOf(text, m.index), detail: `fetch() to ${m[2]}` });
      if (XHR_NEW.test(text)) for (const m of text.matchAll(XHR_OPEN)) if (!isPlatformHost(m[2])) report.add('G11', { file: path, line: lineOf(text, m.index), detail: `XMLHttpRequest to ${m[2]}` });
    }
  },
  G12(pkg, report) {
    for (const path of pkg.order) {
      const text = pkg.files[path];
      for (const [kind, pattern] of SECRET_SHAPES) { const m = pattern.exec(text); if (m) report.add('G12', { file: path, line: lineOf(text, m.index), kind }); }
    }
  },
  G13(pkg, report) {
    if (!pkg.tenantTarget) return;
    for (const [xf, root] of pkg.processDocs()) {
      const guarded = new Set();
      for (const elem of iter(root)) if (['when', 'otherwise'].includes(localName(elem.tag))) for (const inner of iter(elem)) guarded.add(inner);
      for (const elem of iter(root)) {
        if (localName(elem.tag) !== 'operation' || !['database', 'change', 'save'].includes(elem.attrib.name)) continue;
        const value = elem.attrib.value || '';
        if (!value.startsWith('home://')) continue;
        const writes = elem.attrib.name !== 'database' || elem.children.some((c) => ['create', 'delete', 'copy', 'move', 'rename'].includes(localName(c.tag)));
        if (writes && !guarded.has(elem)) report.add('G13', { file: xf.path, line: elem.line, href: value });
      }
    }
  },
  G14(pkg, report) {
    for (const [path, xf] of Object.entries(pkg.xml)) {
      if (!endsWithAny(path, ['.xsl', '.xslt'])) continue;
      for (const elem of iter(xf.root)) {
        if (elem.tag === `{${XSL_NS}}apply-templates`) {
          if ('select' in elem.attrib) report.add('G14', { file: path, line: elem.line, detail: 'xsl:apply-templates over a node set' });
          else report.add('G14', { file: path, line: elem.line, severity: 'warning', detail: 'xsl:apply-templates' });
        } else if (localName(elem.tag) === 'br' && !elem.tag.startsWith(`{${XSL_NS}`)) report.add('G14', { file: path, line: elem.line, detail: 'a <br/>, which renders as two line breaks' });
      }
    }
  },
  G15(pkg, report) {
    const limit = report.grammar.limits.font_file_warning_bytes;
    for (const path of pkg.order) if (endsWithAny(path, FONT_EXTENSIONS)) { const size = byteLength(pkg.files[path]); if (size > limit) report.add('G15', { file: path, size }); }
  },
  G16(pkg, report) {
    const limits = report.grammar.limits;
    if (pkg.order.length > limits.max_files) report.add('G16', { detail: `${pkg.order.length} files, the limit is ${limits.max_files}` });
    let total = 0;
    for (const path of pkg.order) {
      const text = pkg.files[path], size = byteLength(text);
      total += size;
      if (size > limits.max_file_bytes) report.add('G16', { file: path, detail: `${path} is ${size} bytes, the limit is ${limits.max_file_bytes} per file` });
      const head = text.slice(0, 4096);
      let control = 0;
      for (let i = 0; i < head.length; i++) { const c = head.charCodeAt(i); if (c < 0x20 && c !== 9 && c !== 10 && c !== 13) control++; }
      if (head.includes('\0') || (head.length && control / head.length > 0.05)) report.add('G16', { file: path, detail: `${path} is not a text file` });
    }
    if (total > limits.max_total_bytes) report.add('G16', { detail: `${total} bytes in all, the limit is ${limits.max_total_bytes}` });
  },
  G17(pkg, report) {
    for (const [xf, root] of pkg.processDocs()) for (const elem of iter(root)) {
      if (localName(elem.tag) === 'operation' && elem.attrib.name === 'channel' && elem.children.some((c) => localName(c.tag) === 'proxy')) report.add('G17', { file: xf.path, line: elem.line });
    }
  },
  G18(pkg, report) {
    if (pkg.manifest) {
      const name = pkg.manifest.root.attrib.name || '';
      if (name && !DEPLOYMENT_NAME.test(name)) report.add('G18', { file: MANIFEST, line: 1, detail: `the application name ${repr(name)} is not [a-z0-9]+, so it cannot be the deployment name as it is` });
      else if (name.startsWith('xios')) report.add('G18', { file: MANIFEST, line: 1, detail: `the application name ${repr(name)} begins with xios` });
    }
    for (const path of pkg.order) {
      const top = path.split('/')[0];
      if (path.includes('/') && top.toLowerCase().startsWith('xios')) { report.add('G18', { file: path, detail: `the folder ${repr(top)} begins with xios, which the host's robots.txt disallows` }); break; }
    }
  },
  G19(pkg, report) {
    if (!pkg.viewNames.size) return;
    const has = (view, comp) => (pkg.viewComponents.get(view) || new Set()).has(comp);
    for (const [xf, root] of pkg.processDocs()) for (const elem of iter(root)) {
      const tag = localName(elem.tag);
      if (tag === 'trigger' && 'view' in elem.attrib) {
        const view = elem.attrib.view, comp = elem.attrib.component || '';
        if (!view.includes('{') && !comp.includes('{')) {
          if (!pkg.viewNames.has(view)) report.add('G19', { file: xf.path, line: elem.line, detail: `trigger names view ${repr(view)}, which no view declares` });
          else if (comp && !has(view, comp)) report.add('G19', { file: xf.path, line: elem.line, detail: `trigger names component ${repr(comp)}, which view ${repr(view)} does not have` });
        }
      }
      if (tag === 'component' && 'view' in elem.attrib && 'name' in elem.attrib) {
        const view = elem.attrib.view, comp = elem.attrib.name;
        if (!view.includes('{') && !comp.includes('{')) {
          if (!pkg.viewNames.has(view)) report.add('G19', { file: xf.path, line: elem.line, detail: `<component view=${repr(view)}> names a view no view declares` });
          else if (!has(view, comp)) report.add('G19', { file: xf.path, line: elem.line, detail: `component ${repr(comp)} is not in view ${repr(view)}` });
        }
      }
      if (tag === 'operation' && elem.attrib.name === 'action' && (elem.attrib.value || '').startsWith('#')) {
        const view = elem.attrib.value.slice(1).split('#')[0];
        if (!view.includes('{') && pkg.viewNames.has(view)) {
          for (const child of elem.children) if (localName(child.tag) === 'component') {
            const comp = child.attrib.name || '';
            if (comp && !comp.includes('{') && !has(view, comp)) report.add('G19', { file: xf.path, line: child.line, detail: `component ${repr(comp)} is not in view ${repr(view)}` });
          }
        } else if (!view.includes('{') && view) report.add('G19', { file: xf.path, line: elem.line, detail: `action on view ${repr(view)}, which no view declares` });
      }
      const sources = [...Object.values(elem.attrib), ...(elem.text ? [elem.text] : [])];
      for (const source of sources) for (const m of source.matchAll(VIEW_COMPONENT_REF)) {
        const [, view, comp] = m;
        if (!pkg.viewNames.has(view)) report.add('G19', { file: xf.path, line: elem.line, detail: `#${view}#${comp} names view ${repr(view)}, which no view declares` });
        else if (!has(view, comp)) report.add('G19', { file: xf.path, line: elem.line, detail: `#${view}#${comp}: component ${repr(comp)} is not in view ${repr(view)}` });
      }
    }
  },
  G20(pkg, report) {
    if (!pkg.manifest) return;
    const login = find(pkg.manifest.root, 'login');
    if (!login) return;
    const loginProcs = pkg.manifestProcesses.filter((p) => (p.attrib[XLINK_HREF] || '').trim() === LOGIN_PROCESS_HREF);
    const others = pkg.manifestProcesses.filter((p) => !loginProcs.includes(p));
    if (!loginProcs.length) report.add('G20', { file: MANIFEST, line: login.line, detail: '<login> is declared but no <process xlink:href="xios://apps/login.xml"/> loads the login application' });
    else {
      const first = loginProcs[0];
      if ((first.attrib[XLINK_ACTUATE] || '') !== 'onLoad') report.add('G20', { file: MANIFEST, line: first.line, detail: 'the login process must have xlink:actuate="onLoad"' });
      if (others.length && others[0].line < first.line) report.add('G20', { file: MANIFEST, line: others[0].line, detail: 'the main process precedes the login process' });
    }
    for (const proc of others) if ((proc.attrib[XLINK_ACTUATE] || '') !== 'onRequest') report.add('G20', { file: MANIFEST, line: proc.line, detail: 'the app\'s own <process> must have xlink:actuate="onRequest"' });
    for (const view of pkg.manifestViews) if ((view.attrib[XLINK_ACTUATE] || '') !== 'onRequest') report.add('G20', { file: MANIFEST, line: view.line, detail: 'the app\'s own <view> must have xlink:actuate="onRequest"' });
  },
};

// ---- lint -----------------------------------------------------------------------------------------------------------

function statsFor(pkg) {
  const byType = {}; let total = 0;
  for (const path of pkg.order) {
    const size = byteLength(pkg.files[path]); total += size;
    const ext = pkg.extension(path) || '(none)';
    byType[ext] ??= { files: 0, bytes: 0 }; byType[ext].files++; byType[ext].bytes += size;
  }
  return { files: pkg.order.length, bytes: total, by_type: Object.fromEntries(Object.entries(byType).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) };
}
const normalizeFiles = (files) => {
  if (!Array.isArray(files)) throw new ToolError('files must be a list of {path, content}');
  return files.map((f) => ({ path: String(f && f.path || ''), content: f && f.content !== undefined ? String(f.content) : '' }));
};

/** The lint result for files ({path, content} pairs); deploymentName is checked by G18 when given. */
export function lint(files, profile = 'build', rules = null, { tenantTarget = null, deploymentName = null } = {}) {
  const g = grammar();
  if (!PROFILES.includes(profile)) throw new ToolError(`profile must be one of ${PROFILES.join(', ')}`);
  files = normalizeFiles(files);
  if (!files.length) throw new ToolError('Missing files, there is nothing to lint');
  let active;
  if (rules && rules.length) {
    const unknown = rules.filter((r) => !g.rules.has(r));
    if (unknown.length) throw new ToolError(`Unknown rule id(s): ${unknown.join(', ')}. Known: ${[...g.rules.keys()].join(', ')}`);
    active = new Set(rules);
  } else active = new Set([...g.rules.values()].filter((r) => r.profile === 'build' || profile === 'ship').map((r) => r.id));
  const pkg = new Package(files);
  if (tenantTarget !== null) pkg.tenantTarget = tenantTarget;
  const report = new Report(g, new Set([...active, ...(active.has('G00') ? ['G17'] : [])]));
  for (const id of [...active].sort()) if (RULES[id]) RULES[id](pkg, report);
  if (deploymentName && active.has('G18')) {
    if (!DEPLOYMENT_NAME.test(deploymentName)) report.add('G18', { detail: `deployment name ${repr(deploymentName)} is not [a-z0-9]+` });
    else if (deploymentName.startsWith('xios')) report.add('G18', { detail: `deployment name ${repr(deploymentName)} begins with xios` });
  }
  const order = (a, b) => (a.rule < b.rule ? -1 : a.rule > b.rule ? 1 : a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line);
  for (const bucket of Object.values(report.findings)) bucket.sort(order);
  return {
    ok: report.findings.error.length === 0,
    profile,
    grammar_version: g.version,
    rules_run: [...active].sort(),
    errors: report.findings.error,
    warnings: report.findings.warning,
    info: report.findings.info,
    stats: statsFor(pkg),
    xpath_functions_status: g.functionsStatus,
    schema_validation: SCHEMA_NOTE,
  };
}

// ---- benchmark ------------------------------------------------------------------------------------------------------

const CLIENT_FIELDS = ['tokens_in', 'tokens_out', 'cost_usd', 'active_minutes', 'lighthouse', 'timings'];

export function measure(files) {
  const pkg = new Package(normalizeFiles(files));
  let lines = 0;
  const bytesByType = {};
  for (const path of pkg.order) {
    const text = pkg.files[path];
    lines += (text.match(/\n/g) || []).length + (text && !text.endsWith('\n') ? 1 : 0);
    const ext = pkg.extension(path) || '(none)';
    bytesByType[ext] = (bytesByType[ext] || 0) + byteLength(text);
  }
  const views = pkg.manifest ? pkg.manifestViews.length : Object.keys(pkg.viewFiles).length;
  let steps = 0, operations = 0, triggers = 0, components = 0;
  for (const [, root] of pkg.processDocs()) for (const elem of iter(root)) {
    const tag = localName(elem.tag);
    if (tag === 'step') steps++; else if (tag === 'operation') operations++; else if (tag === 'trigger') triggers++;
  }
  for (const [, root] of pkg.viewDocs()) for (const elem of iter(root)) if (elem !== root && elem.attrib.name) components++;
  const comps = pkg.manifest ? find(pkg.manifest.root, 'components') : null;
  return {
    files: pkg.order.length,
    lines,
    bytes: Object.values(bytesByType).reduce((a, b) => a + b, 0),
    bytes_by_type: Object.fromEntries(Object.entries(bytesByType).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))),
    views,
    view_files: Object.keys(pkg.viewFiles).length,
    processes: pkg.processDocs().length,
    steps, operations, triggers, components,
    custom_components: comps ? children(comps, 'component').length : 0,
    has_manifest: pkg.manifest !== null && MANIFEST in pkg.files,
    build_step: 'none',
  };
}

export function benchmark(files, clientFields) {
  if (!Array.isArray(files) || !files.length) throw new ToolError('Missing files, there is nothing to measure');
  const measured = measure(files);
  const client = clientFields && typeof clientFields === 'object' ? clientFields : {};
  const sources = Object.fromEntries(Object.keys(measured).map((k) => [k, 'measured']));
  const supplied = {};
  for (const key of CLIENT_FIELDS) {
    const value = client[key];
    if (value === undefined || value === null) sources[key] = 'not-available';
    else { sources[key] = 'client-supplied'; supplied[key] = value; }
  }
  const rows = [
    ['Files', String(measured.files), 'measured'],
    ['Lines', String(measured.lines), 'measured'],
    ['Bytes', String(measured.bytes), 'measured'],
    ['Bytes by type', Object.entries(measured.bytes_by_type).map(([k, v]) => `${k} ${v}`).join(', ') || '-', 'measured'],
    ['Views (declared)', String(measured.views), 'measured'],
    ['Processes', String(measured.processes), 'measured'],
    ['Steps', String(measured.steps), 'measured'],
    ['Operations', String(measured.operations), 'measured'],
    ['Triggers', String(measured.triggers), 'measured'],
    ['Named components', String(measured.components), 'measured'],
    ['Custom components', String(measured.custom_components), 'measured'],
    ['Build step', 'none (XML and JavaScript are served as written)', 'measured'],
  ];
  const labels = { tokens_in: 'Tokens in', tokens_out: 'Tokens out', cost_usd: 'Cost (USD)', active_minutes: 'Active minutes to the first Development URL', lighthouse: 'Lighthouse', timings: 'Load timings' };
  for (const key of CLIENT_FIELDS) {
    const value = supplied[key];
    if (value === undefined) rows.push([labels[key], 'not available on this client', 'not-available']);
    else if (value && typeof value === 'object' && !Array.isArray(value)) rows.push([labels[key], Object.entries(value).map(([k, v]) => `${k} ${v}`).join('; '), 'client-supplied']);
    else rows.push([labels[key], String(value), 'client-supplied']);
  }
  const clientName = client.client || 'not stated';
  const markdown = ['## Benchmark (measured)', '', `Client: ${clientName}. Every row names its source; nothing below is an estimate.`, '',
    '| Measure | Value | Source |', '| --- | --- | --- |', ...rows.map(([l, v, s]) => `| ${l} | ${v} | ${s} |`)];
  return {
    measured,
    block_markdown: markdown.join('\n') + '\n',
    block_json: { measured, client: { client: clientName, ...supplied }, sources },
    sources,
  };
}

// ---- the tools --------------------------------------------------------------------------------------------------------

const MAX_RESULT_CHARS = 60000;
function capText(text, max) {
  const s = String(text ?? '');
  if (s.length <= max) return s;
  const note = `\n\ntruncated at ${max} chars; lint fewer files at a time`;
  let cut = s.slice(0, max - note.length);
  const nl = cut.lastIndexOf('\n');
  if (nl > cut.length - 200) cut = cut.slice(0, nl);
  return `${cut.trimEnd()}${note}`;
}
/** The package a tool call names: the text files of the folder `dir` (with the binary files it did not read), or
 *  `files` as given. Exactly one of the two. */
export function packageInput({ dir, files } = {}) {
  const hasFiles = Array.isArray(files) ? files.length > 0 : files !== undefined && files !== null;
  if (dir && hasFiles) throw new ToolError('Pass dir or files, not both.');
  if (!dir) {
    if (!hasFiles) throw new ToolError('Missing the package: dir (a local package folder) or files ({path, content} each).');
    return { files };
  }
  if (typeof dir !== 'string' || !isAbsolute(dir)) throw new ToolError('dir is the absolute path of a local package folder, the one holding index.xml.');
  const { root, files: found } = packageAt(dir, 'dir');
  const notRead = found.filter((f) => !isText(f.rel)).map((f) => f.rel);
  return { files: textFiles(found), from: { dir: root, ...(notRead.length ? { binary_not_read: notRead } : {}) } };
}

const ANNOTATIONS = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const PACKAGE_PROPERTIES = {
  dir: { type: 'string', description: 'Absolute path of a local package folder (the one holding index.xml); its text files are read.' },
  files: {
    type: 'array', description: 'The package as {path, content}, paths relative to its root. Instead of dir, where there is no file system.',
    items: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] },
  },
};
export const TOOLS = {
  lint_project: {
    title: 'Lint a project against the tenant grammar',
    description: 'The tenant grammar on a XIOS/3 package, given as a folder (dir) or as files: G01-G20, the rules the schemas cannot express, plus G00 for XML that is not well-formed (schema validation happens at upload). Each finding has the rule, file, line, message and fix. Returns ok, errors, warnings and info, the size by file type, and the grammar version. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        ...PACKAGE_PROPERTIES,
        profile: { type: 'string', enum: PROFILES, default: 'build', description: 'build: before an upload; ship: build plus the webshare rules.' },
        rules: { type: 'array', items: { type: 'string' }, description: 'Rule ids to run instead of the profile.' },
      },
    },
    run: ({ dir, files, profile = 'build', rules = null }) => {
      const input = packageInput({ dir, files });
      return { ...input.from, ...lint(input.files, profile, rules) };
    },
  },
  benchmark_project: {
    title: 'Benchmark a project',
    description: 'The measured block of a benchmark report for a XIOS/3 package, given as a folder (dir) or as files: files, lines, bytes by type, views, processes, steps, operations, triggers, components, build step. Figures the client measured itself are labelled client-supplied, missing ones not-available. Returns the block as markdown and as JSON, a Source on every row. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        ...PACKAGE_PROPERTIES,
        client_fields: {
          type: 'object',
          description: 'What the client measured itself; every field optional.',
          properties: {
            client: { type: 'string', description: 'The client used, e.g. Claude Code.' },
            tokens_in: { type: 'integer' },
            tokens_out: { type: 'integer' },
            cost_usd: { type: 'number' },
            active_minutes: { type: 'number', description: 'From the first prompt to the first Development URL.' },
            lighthouse: { type: 'object', description: 'Scores with route, preset, profile and date.' },
            timings: { type: 'object', description: 'E.g. cold and warm medians of three.' },
          },
        },
      },
    },
    run: ({ dir, files, client_fields = null }) => {
      const input = packageInput({ dir, files });
      return { ...input.from, ...benchmark(input.files, client_fields) };
    },
  },
};

// ---- MCP over stdio ----------------------------------------------------------------------------------------------

const INSTRUCTIONS = 'Read-only build tools for a XIOS/3 package before it reaches a tenant, given as a local folder or as files: lint_project checks the tenant grammar (profile build before an upload, ship before a promotion), benchmark_project measures the package. No tenant, no credentials, nothing written.';
const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
async function handle(req) {
  const { id, method, params = {} } = req;
  if (id === undefined) return;                                   // a notification: nothing to answer
  try {
    if (method === 'initialize') return send({ id, result: { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} },
      serverInfo: { name: SERVER_NAME, title: 'CloudBackend PaaS build tools', version: VERSION }, instructions: INSTRUCTIONS } });
    if (method === 'ping') return send({ id, result: {} });
    if (method === 'tools/list') return send({ id, result: { tools: Object.entries(TOOLS).map(([name, t]) => ({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: ANNOTATIONS })) } });
    if (method === 'tools/call') {
      const tool = TOOLS[params.name];
      if (!tool) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      try {
        const result = await tool.run(params.arguments || {});
        return send({ id, result: { content: [{ type: 'text', text: capText(JSON.stringify(result, null, 2), MAX_RESULT_CHARS) }] } });
      } catch (e) {
        const text = e instanceof ToolError ? e.message : `${params.name} failed: ${e.message}`;
        return send({ id, result: { isError: true, content: [{ type: 'text', text }] } });
      }
    }
    send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  } catch (e) { send({ id, error: { code: -32603, message: e.message } }); }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createInterface({ input: process.stdin }).on('line', (line) => {
    if (!line.trim()) return;
    let req; try { req = JSON.parse(line); } catch { return send({ id: null, error: { code: -32700, message: 'Parse error' } }); }
    handle(req);
  });
}
