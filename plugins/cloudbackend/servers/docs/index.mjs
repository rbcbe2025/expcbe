#!/usr/bin/env node
// cloudbackend-docs - the CloudBackend and XIOS/3 documentation as thirteen MCP tools, for Claude Desktop, the
// CloudBackend plugin for Claude Code and Cowork, and any local MCP client.
//
// A CloudBackend tenant cannot run a server (webshares serve files only), so this runs on the reader's computer and
// reads the documentation the developer portal publishes as static files: content/catalog.xml (every topic's title,
// keywords, summary and route), content/search-<corpus>.xml (the full text, for search), one article file per
// topic (its source Markdown in <raw>), and content/xios3-reference.xml (the XIOS/3 reference texts the xios3_*
// lookups section by heading). Nothing is sent anywhere but GET requests to the portal.
//
// The tools match the hosted cloudbackend-docs server's, names, descriptions and annotations alike: the four
// CloudBackend lookups and the nine xios3_* lookups. Built by public/scripts/build-mcpb.mjs, which writes PORTAL below
// and copies search-core.js (the portal's own ranking) and xios3-reference.mjs (the lookups) beside this file. MCP over
// stdio, newline-delimited JSON-RPC; no dependencies. ASCII only: a webshare labels .mjs files ISO-8859-1.

import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline';
import { rankTopics, searchWords } from './search-core.mjs';
import { buildXios3Reference } from './xios3-reference.mjs';

const PORTAL = (process.env.CBE_DOCS_PORTAL || 'https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud').replace(/\/$/, '');
const VERSION = '2026.11.5';
const PREFIX = { xios: 'xios3', cloudbackend: 'cloudbackend' };

// ---- the published data, fetched once per session --------------------------------------------------------------

const fromXml = (text) => {       // json-xml.js: JSON carried in one <json> element, escaped for XML
  const a = text.indexOf('<json>'), b = text.lastIndexOf('</json>');
  if (a < 0 || b < a) throw new Error('the portal did not answer with its data (is the address right?)');
  return JSON.parse(text.slice(a + 6, b).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
};
const get = async (path) => {
  const res = await fetch(PORTAL + path, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${PORTAL}${path}: HTTP ${res.status}`);
  // Decoded here, not by the header: the share labels text files ISO-8859-1, and every data file is ASCII anyway.
  return new TextDecoder('utf-8').decode(await res.arrayBuffer());
};
let catalog = null, fulltext = null, reference = null;
const topics = async () => (catalog ||= get('/content/catalog.xml').then(fromXml).then((c) => c.topics));
const texts = async () => (fulltext ||= Promise.all(['cloudbackend', 'xios'].map((c) => get(`/content/search-${c}.xml`).then(fromXml)))
  .then((parts) => new Map(parts.flat().map((r) => [r.route, r.text]))));
const xios3 = async () => (reference ||= get('/content/xios3-reference.xml').then(fromXml).then((d) => buildXios3Reference(d.files || {})));

const unescapeXml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
/** A topic's source Markdown: the article file the portal reads, named by the topic's route (emit-xml.mjs articleId). */
async function article(t) {
  const id = createHash('sha256').update(t.route).digest('hex').slice(0, 12);
  const xml = await get(`/content/${PREFIX[t.corpus]}/a/${t.path.split('/')[0]}/${id}.xml`);
  const m = xml.match(/<raw>([\s\S]*?)<\/raw>/);
  if (!m) throw new Error(`no article for ${t.route}`);
  return unescapeXml(m[1]).trim();
}
const link = (t) => PORTAL + t.route;

// ---- result caps, the hosted server's ---------------------------------------------------------------------------
// A tool result is at most MAX_RESULT_CHARS (60,000 fits Claude Code's default tool-result budget) and each card in a
// multi-name call at most MAX_CARD_CHARS. A cut result ends with one line saying so.
const MAX_RESULT_CHARS = 60000;
const MAX_CARD_CHARS = 24000;
function capText(text, max) {
  const s = String(text ?? '');
  if (s.length <= max) return s;
  const note = `\n\ntruncated at ${max} chars; ask for fewer names`;
  let cut = s.slice(0, max - note.length);
  const nl = cut.lastIndexOf('\n');
  if (nl > cut.length - 200) cut = cut.slice(0, nl);
  return `${cut.trimEnd()}${note}`;
}

// ---- the four CloudBackend tools --------------------------------------------------------------------------------

async function docs({ query }) {
  if (!searchWords(query || '').length) return 'Give a query, e.g. "resize a drive" or "share a container with a group".';
  const all = await topics();
  const found = rankTopics(all, query, { fulltext: await texts().catch(() => null), limit: 12 })
    .sort((a, b) => (a.corpus === b.corpus ? 0 : a.corpus === 'cloudbackend' ? -1 : 1) || b.score - a.score);
  if (!found.length) return `Nothing matches "${query}". Try fewer or different words, or browse ${PORTAL}/cloudbackend/docs.`;
  return [`${found.length} topics for "${query}" (CloudBackend first, then XIOS/3):`, '',
    ...found.map((t) => `- ${t.title} [${t.type}${t.corpus === 'xios' ? ', XIOS/3' : ''}]: ${t.summary}\n  ${link(t)}`
      + (t.type === 'rest-operation' ? `\n  Full card: cloudbackend_rest("${t.title}")` : '')),
  ].join('\n');
}

const restOps = async () => (await topics()).filter((t) => t.corpus === 'cloudbackend' && t.type === 'rest-operation');
const tagOf = (t) => t.path.split('/')[1];
// Placeholders match whatever they are called ("/users/{uid}" or "/users/:uid" for "/users/{user_id}") and the
// API's /v1 prefix is ignored, and so is the optional digit of /ws[0_9]/... (found as /ws/...; /ws2/... is an operation
// of its own), as in the cloudbackend-docs server. tests/mcpb.test.mjs checks that no two operations collide this way.
const restName = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  .replace(/\{[^}]*\}/g, '{}').replace(/\/:[\w-]+/g, '/{}').replace(/(^|\s)\/v1(?=\/)/, '$1')
  .replace(/\[0_9\]/g, '');
async function rest({ names }) {
  const ops = await restOps(), out = [];
  for (const raw of String(names || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const q = restName(raw);
    let hit = ops.filter((t) => restName(t.title) === q || t.path.split('/').pop().replace(/\.md$/, '') === q);
    if (!hit.length && q.startsWith('/')) hit = ops.filter((t) => restName(t.title.slice(t.title.indexOf(' ') + 1)) === q);
    if (!hit.length) hit = ops.filter((t) => t.keywords.some((k) => k.toLowerCase() === q.replace(/[^a-z0-9]/g, '')));
    if (!hit.length) { out.push(`No REST operation "${raw}". Try "METHOD /path" (e.g. "PATCH /drive"), an operationId, or cloudbackend_rest with a tag (no names) to list them.`); continue; }
    if (hit.length > 1 && q.startsWith('/')) { out.push(`${raw}: ${hit.map((t) => `${t.title} (${t.summary})`).join('; ')}`); continue; }
    for (const t of hit.slice(0, 3)) out.push(capText(`${await article(t)}\n\nOn the portal: ${link(t)}`, MAX_CARD_CHARS));
  }
  return out.join('\n\n---\n\n') || 'Give one or more names, e.g. "PATCH /drive" or "POST /login, GET /container".';
}

async function restList({ tag }) {
  const ops = await restOps(), tags = new Map();
  for (const t of ops) tags.set(tagOf(t), [...(tags.get(tagOf(t)) || []), t]);
  if (!tag) return [`${ops.length} REST operations in ${tags.size} tags. cloudbackend_rest with a tag lists one tag; with names ("<METHOD /path>") it returns cards.`, '',
    ...[...tags].sort().map(([k, v]) => `- ${k} (${v.length})`)].join('\n');
  const key = String(tag).toLowerCase().replace(/[^a-z0-9-]/g, '');
  const list = tags.get(key) || tags.get(key.replace(/s$/, '')) || tags.get(key + 's');
  if (!list) return `No tag "${tag}". Tags: ${[...tags.keys()].sort().join(', ')}.`;
  return [`${list.length} operations under ${tag}:`, '', ...list.map((t) => `- ${t.title}: ${t.summary}`)].join('\n');
}

async function sdk({ names }) {
  const all = await topics(), entries = all.filter((t) => t.corpus === 'cloudbackend' && t.path.startsWith('sdk/') && t.type !== 'section');
  const classOf = (t) => all.find((s) => s.corpus === 'cloudbackend' && s.path === `sdk/${t.path.split('/')[1]}/INDEX.md`)?.title || t.path.split('/')[1];
  const out = [];
  for (const raw of String(names || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = raw.split(/[\s.:#]+/).filter(Boolean);
    const method = (b || a).toLowerCase(), cls = b ? a.toLowerCase() : null;
    const hit = entries.filter((t) => t.title.toLowerCase() === method && (!cls || classOf(t).toLowerCase() === cls || t.path.split('/')[1] === cls));
    if (!hit.length) { out.push(`No SDK entry "${raw}". Try "createContainer" or "Container createContainer", or cloudbackend_docs("${raw}").`); continue; }
    if (hit.length > 1) { out.push(`"${raw}" is in ${hit.length} classes: ${hit.map((t) => `${classOf(t)} ${t.title}`).join(', ')}. Name the class too.`); continue; }
    out.push(capText(`${await article(hit[0])}\n\nOn the portal: ${link(hit[0])}`, MAX_CARD_CHARS));
  }
  return out.join('\n\n---\n\n') || 'Give one or more names, e.g. "createContainer" or "Container.createContainer, Object.save".';
}

// ---- the XIOS/3 reference: one lookup by kind and name, one list ----------------------------------------------------------------------------
// The lookups are xios3-reference.mjs (the hub's module); this adds the portal page of an entry when the catalog
// has a topic of that name under the kind's reference folder, and the caps.

const REFERENCE_DIRS = { component: ['components'], operation: ['operations'], function: ['functions'], method: ['methods'], event: ['events'], action: ['actions', 'action-urls'] };
const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
async function withPortalPage(kind, text) {
  const m = String(text).match(/^#{2,3} (.+)$/m);
  if (!m) return text;
  const title = norm(m[1]);
  const hit = (await topics()).filter((t) => t.corpus === 'xios' && REFERENCE_DIRS[kind].some((d) => t.path.startsWith(`reference/${d}/`)) && norm(t.title) === title);
  return hit.length === 1 ? `${text}\n\nOn the portal: ${link(hit[0])}` : text;
}
/** A by-name lookup over comma-separated names, each answered as a capped card with its portal page. */
const byName = (kind, fn) => async ({ names }) => {
  const ref = await xios3();
  const list = String(names || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!list.length) return ref[fn]('');
  const out = [];
  for (const n of list) out.push(await withPortalPage(kind, capText(ref[fn](n), MAX_CARD_CHARS)));
  return out.join('\n\n---\n\n');
};

const LOOKUPS = {
  component: byName('component', 'componentText'), operation: byName('operation', 'operationText'), function: byName('function', 'functionText'),
  method: byName('method', 'methodText'), event: byName('event', 'eventText'), action: byName('action', 'actionText'),
  concept: async ({ names }) => (await xios3()).conceptsText(names || ''), icon: async ({ names }) => (await xios3()).iconsText(names || ''),
};
async function lookup({ kind, names }) {
  const run = LOOKUPS[String(kind || '').toLowerCase().trim().replace(/s$/, '')];
  return run ? run({ names }) : `kind must be one of: ${Object.keys(LOOKUPS).join(', ')}.`;
}

const ANNOTATIONS = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const str = (description) => ({ type: 'string', description });
const TOOLS = {
  cloudbackend_docs: { title: 'Search the CloudBackend documentation', run: docs,
    description: 'Topic search across the CloudBackend developer documentation - the Singularity database, the REST API, the C++/Java/Swift SDKs, the CLI, CloudBackend PaaS operations - and the XIOS/3 manual it links to. Returns the best-matching topics, each with its type, a one-line summary and a link to its page on the developer portal; a REST operation also names the cloudbackend_rest call that returns its card.',
    inputSchema: { type: 'object', properties: { query: str('Search words, e.g. "resize a drive", "create an object in a container", "share a container with a group", "login and session token"') }, required: ['query'] } },
  cloudbackend_rest: { title: 'REST API operation cards and tags', run: async ({ names, tag }) => (String(names || '').trim() ? rest({ names }) : restList({ tag })),
    description: 'The CloudBackend REST API. With names: the full card of each operation (parameters, XML request and response bodies, status codes, a curl example); a name is "METHOD /path" ("PATCH /drive"), an operationId ("patchv1drive"), an XML operation name ("renameDrive") or a bare path ("/drive", which lists its methods); several names are comma-separated; a card is at most 24,000 characters and a call at most 60,000. Without names: with a tag ("drive", "container", "sharing"), every operation under it; with neither, every tag and its count.',
    inputSchema: { type: 'object', properties: { names: str('e.g. "PATCH /drive", "POST /login, GET /container", "patchv1drive"'), tag: str('A tag, when listing instead of reading cards') } } },
  cloudbackend_sdk: { title: 'Native SDK entry', run: sdk,
    description: 'The card of a native CloudBackend SDK (C++/Java/Swift) method by name: "createContainer", "Container createContainer". An ambiguous name lists the candidates with their class; several names are comma-separated.',
    inputSchema: { type: 'object', properties: { names: str('e.g. "createContainer", "Container.createContainer, Object.save"') }, required: ['names'] } },
  xios3_lookup: { title: 'XIOS/3 reference entry', run: lookup,
    description: 'The XIOS/3 reference by kind and name, with each entry\'s page on the developer portal. kind component ("Grid", "ListView"): what it is for, parents and children, attributes, events, methods, examples; operation ("bind", "callService"): attributes, children, syntax; function ("format-date"); method (called through callMethod: "getValue", or "RichText getSelectedText", or a group such as "View"); event ("Select"); action ("enable", or an action URL); concept (a group such as "Expressions", or words: the concept sheet\'s questions and answers); icon (a word or a category: icon names for icon://name). Several names are comma-separated; an ambiguous name lists the candidates.',
    inputSchema: { type: 'object', properties: { kind: str('component, operation, function, method, event, action, concept or icon'), names: str('One or more names, comma-separated; for concept or icon, words (empty: the list of groups or categories)') }, required: ['kind'] } },
  xios3_list: { title: 'XIOS/3 reference names', run: async ({ kind }) => (await xios3()).listText(kind || ''),
    description: 'The names the XIOS/3 reference covers: without a kind, how many of each (components, operations, functions, methods, events, actions, concepts, icons); with a kind, every name of that kind, grouped where the reference groups them.',
    inputSchema: { type: 'object', properties: { kind: str('"components", "operations", "functions", "methods", "events", "actions", "concepts" or "icons"; empty for the counts') } } },
};

// ---- MCP over stdio ----------------------------------------------------------------------------------------------

const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
async function handle(req) {
  const { id, method, params = {} } = req;
  if (id === undefined) return;                                   // a notification: nothing to answer
  try {
    if (method === 'initialize') return send({ id, result: { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} },
      serverInfo: { name: 'cloudbackend-docs', version: VERSION },
      instructions: `The CloudBackend and XIOS/3 developer documentation, read from the developer portal (${PORTAL}). Start with cloudbackend_docs; use cloudbackend_rest for an endpoint, cloudbackend_sdk for a native SDK method, xios3_lookup for a XIOS/3 component, operation, function, method, event, action, concept or icon by name, and xios3_list for the names of a kind. Link the reader to the portal page each answer names.` } });
    if (method === 'ping') return send({ id, result: {} });
    if (method === 'tools/list') return send({ id, result: { tools: Object.entries(TOOLS).map(([name, t]) => ({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: ANNOTATIONS })) } });
    if (method === 'tools/call') {
      const tool = TOOLS[params.name];
      if (!tool) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      try { return send({ id, result: { content: [{ type: 'text', text: capText(await tool.run(params.arguments || {}), MAX_RESULT_CHARS) }] } }); }
      catch (e) { return send({ id, result: { isError: true, content: [{ type: 'text', text: `The documentation could not be read: ${e.message}` }] } }); }
    }
    send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  } catch (e) { send({ id, error: { code: -32603, message: e.message } }); }
}
createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let req; try { req = JSON.parse(line); } catch { return send({ id: null, error: { code: -32700, message: 'Parse error' } }); }
  handle(req);
});
