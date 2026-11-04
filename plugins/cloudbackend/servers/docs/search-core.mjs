// search-core.js - the documentation search's pure logic, in one copy for every surface: CA_DocSearch
// (this portal), the React portal (src/search.jsx imports it, src/search-data.js wraps its loader) and
// the Chrome extension's omnibox (which bundles it through src/search-rank.js), so no two of them can
// rank or list differently. No imports, no DOM, no runtime globals, no eval: everything it needs is passed
// in, so Node, the browser, a bundler, the extension's service worker and the XIOS/3 runtime can all load
// it as it is. tests/search-rank.test.mjs tests it directly and through src/search-rank.js;
// tests/search.test.mjs tests the loader through src/search-data.js.
//
//   scoreTopic(topic, words, fulltext)           one topic's score for the query words, or null
//   rankTopics(topics, query, options)           the matching topics, best first
//   startTopics(topics, workspace, paths)        the fixed list shown for an empty query
//   searchable(catalog)                          the topics plus the Agent Skills a query can find
//   searchResults(catalog, options)              one of the two, as the search dialog chooses
//   resultCount(query, n)                        "12 results", "35+ results", "Start exploring"
//   createSearchLoader(fetchJson, options)       full-text shards, loaded lazily per scope, cached per
//                                                URL, and forgotten after a failure so the next load retries
//
// ASCII only: the webshare labels .js ISO-8859-1 and the browser decodes modules with that label.

/** At most this many results are shown; a full page reads "35+ results". */
export const MAX_RESULTS = 35;

/** Shown for an empty query, after the workspace's intro and quick start. A path counts only in a corpus
 *  that has it: both have the Button reference, only CloudBackend the CLI index, so the XIOS/3 start list
 *  has three entries and CloudBackend's four (as the React portal always listed them). */
export const START_PATHS = ['reference/components/button.md', 'cli/command-line-interface/INDEX.md'];

/** Corpus id -> the URL segment its routes live under (src/routes.js; the XIOS/3 corpus id is
 *  "xios", its URL segment "xios3"). Duplicated here to keep this module dependency-free. */
export const urlPrefix = { xios: 'xios3', cloudbackend: 'cloudbackend' };
export const routePrefix = (corpus) => urlPrefix[corpus] || corpus;

/** The query as search words: lower case, split on white space. */
export function searchWords(query) {
  return String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
}
/** The React portal's and the omnibox's name for searchWords. */
export const queryWords = searchWords;

/** Every word must match somewhere; each scores by where it matches first: the whole title 80, part of
 *  the title 30, a keyword 20, the summary 10, the full text 1. Returns the sum, or null when a word
 *  matches nowhere. fulltext is a Map route -> lower-case text, or null while the shards load (then a
 *  word found only in the body does not match). */
export function scoreTopic(topic, words, fulltext = null) {
  const title = topic.title.toLowerCase(), keys = topic.keywords.join(' ').toLowerCase(), summary = topic.summary.toLowerCase();
  let score = 0;
  for (const word of words) {
    if (title === word) score += 80;
    else if (title.includes(word)) score += 30;
    else if (keys.includes(word)) score += 20;
    else if (summary.includes(word)) score += 10;
    else if (fulltext?.get(topic.route)?.includes(word)) score += 1;
    else return null;
  }
  return score;
}

/** The topics that match every word of query, each with its score, sorted by score and then title.
 *  options: {scope: 'all' or a corpus id, fulltext: see scoreTopic, limit: at most this many,
 *  MAX_RESULTS by default}. A query without words matches nothing. topics is not modified. */
export function rankTopics(topics, query, { scope = 'all', fulltext = null, limit = MAX_RESULTS } = {}) {
  const words = searchWords(query);
  if (!words.length) return [];
  return topics
    .filter(t => scope === 'all' || t.corpus === scope)
    .map(t => { const score = scoreTopic(t, words, fulltext); return score === null ? null : { ...t, score }; })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** The empty-query list: the current workspace's topics at these paths, in catalog order. */
export function startTopics(topics, workspace, paths) {
  return topics.filter(t => t.corpus === workspace && paths.includes(t.path));
}

/** The topic of a corpus at a route (trailing slashes ignored), or undefined. */
export function topicAt(topics, corpus, route) {
  const r = String(route || '').replace(/\/+$/, '');
  return topics.find(t => t.corpus === corpus && t.route.replace(/\/+$/, '') === r);
}

/** Everything a query can find: the topics and the Agent Skills (catalog.skills, one entry per skill whose
 *  route is the Tools page at its card - scripts/build-content.mjs). */
export const searchable = (catalog) => (catalog.skills ? catalog.topics.concat(catalog.skills) : catalog.topics);

/** What the dialog lists: the ranked results for a query, the fixed start list without one.
 *  options: {query, scope, workspace, intro, quickstart, fulltext} - intro and quickstart are
 *  corpus paths (workspaces.js intro/quickstart). */
export function searchResults(catalog, { query, scope, workspace, intro, quickstart, fulltext }) {
  if (!catalog) return [];
  if (!searchWords(query).length) return startTopics(catalog.topics, workspace, [intro, quickstart, ...START_PATHS]);
  return rankTopics(searchable(catalog), query, { scope, fulltext });
}

/** The line above the results. A query without words shows the start list, so it reads as one. */
export function resultCount(query, n) {
  if (!searchWords(query).length) return 'Start exploring';
  return `${n}${n === MAX_RESULTS ? '+' : ''} result${n === 1 ? '' : 's'}`;
}

/** The full-text loader (src/search-data.js wraps it with src/routes.js's prefixes). fetchJson(url)
 *  returns the parsed JSON (or throws). load(catalog, scope, workspace) resolves {texts: Map route ->
 *  text, failed: [corpus ids]} and never rejects: a shard that is missing, fails or is malformed is listed
 *  in failed and dropped from the cache, so the next load (a Retry, a scope change, the next open)
 *  requests it again. catalog needs only {stats, searchFiles}. options.routePrefix overrides the
 *  corpus -> URL segment map. */
export function createSearchLoader(fetchJson, options = {}) {
  const prefix = options.routePrefix || routePrefix;
  const cache = new Map();
  return async function load(catalog, scope, workspace) {
    const corpora = scope === 'all' ? Object.keys(catalog.stats) : [workspace];
    const results = await Promise.all(corpora.map(async corpus => {
      const url = catalog.searchFiles?.[corpus];
      if (!url) return { corpus, error: true };
      if (!cache.has(url)) {
        const request = Promise.resolve().then(() => fetchJson(url)).then(rows => {
          const ours = (route) => route.startsWith(`/${prefix(corpus)}/docs/`) || route.startsWith(`/${prefix(corpus)}/tools#skill-`);
          if (!Array.isArray(rows) || rows.some(row => typeof row.route !== 'string' || typeof row.text !== 'string' || !ours(row.route))) throw new Error('Invalid search index');
          return rows;
        }).catch(error => { cache.delete(url); throw error; });
        cache.set(url, request);
      }
      try { return { corpus, rows: await cache.get(url) }; }
      catch { return { corpus, error: true }; }
    }));
    return { texts: new Map(results.flatMap(r => (r.rows || []).map(row => [row.route, row.text]))), failed: results.filter(r => r.error).map(r => r.corpus) };
  };
}
