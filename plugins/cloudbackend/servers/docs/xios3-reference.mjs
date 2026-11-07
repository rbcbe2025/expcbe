// xios3-reference.mjs - the XIOS/3 reference lookups over the rendered reference texts, pure.
//
// Our own code (2026-11-04). It takes the texts the xios corpus build writes under xios/_dist/ - one
// file per reference kind, sectioned by Markdown headings - and the icon name list, and answers by name
// the way a developer asks: "Grid", "callService", "substring-after", "RichText getText", "Select",
// "enable", "data binding", "arrow". Nothing here is imported or copied from the XIOS/3 company's own
// server; the file layout is the corpus build's, the sectioning and ranking are ours.
//
// This module reads no file: buildXios3Reference(texts) takes the texts, keyed as XIOS3_FILES is, so the
// same code serves the hosted documentation server (which reads the hub), the cloudbackend-docs desktop
// extension and the CloudBackend plugin's local docs server (which fetch content/xios3-reference.xml from
// the developer portal). ASCII only: the share labels .mjs files ISO-8859-1.
//
// What is read, and how each file is sectioned (checked against the 2026-10-11 build):
//   ref-components.md   # title, then one "## <Component>" per entry, with "### Details/Attributes/..." inside
//   ref-operations.md   # title, "## <operation>" per entry
//   ref-functions.md    # title, "## <function>" per entry
//   ref-methods.md      # title, "## <group>" (General, Calendar and Clock, RichText, View, WidgetPane,
//                       Runtime methods without a reference entry), "### <method>" per entry
//   ref-events.md       # title, "## <Event>" per entry
//   ref-actions.md      "# Actions" then "## <action>" per entry, "# Action URLs" then "## <actionURL>"
//   concepts.md         # title, "## <group>" per subject, "### <question>" per answer
//   view/icons-all.txt  one icon name per line; view/icons.md lists the names per category

/** The corpus files the lookups read, hub-relative: what a loader reads, what the portal publishes as one document. */
export const XIOS3_FILES = {
  component: 'xios/_dist/ref-components.md',
  operation: 'xios/_dist/ref-operations.md',
  function: 'xios/_dist/ref-functions.md',
  method: 'xios/_dist/ref-methods.md',
  event: 'xios/_dist/ref-events.md',
  action: 'xios/_dist/ref-actions.md',
  concepts: 'xios/_dist/concepts.md',
  icons: 'xios/_dist/view/icons-all.txt',
  iconCategories: 'xios/_dist/view/icons.md',
};

// ============================================================
// The sectioner
// ============================================================

/**
 * Split Markdown into the sections headed at `level` (2 for "## "). Each section is
 * `{ title, level, group, line, body }`: `group` is the title of the nearest heading above it of a higher
 * level (the "# Action URLs" over an action URL, the "## RichText" over a RichText method), `line` is
 * 1-based, `body` is the heading line and everything to the next heading of the same or a higher level \u2014
 * deeper headings stay inside. Fenced code is opaque: a "#" line inside ``` or ~~~ is content. A trailing
 * "---" rule, the separator the reference files put between entries, is dropped from the body.
 */
export function splitSections(markdown, level = 2) {
  const lines = String(markdown || '').split('\n');
  const sections = [];
  const above = [];          // above[lvl] = the current heading title at that level
  let fence = null;
  let current = null;
  const close = () => {
    if (!current) return;
    current.body = trimSection(current.lines.join('\n'));
    delete current.lines;
    sections.push(current);
    current = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fence) {
      if (line.startsWith(fence)) fence = null;
      if (current) current.lines.push(line);
      continue;
    }
    const opening = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (opening) {
      fence = opening[1];
      if (current) current.lines.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/);
    if (heading && heading[1].length <= level) {
      const lvl = heading[1].length;
      const title = heading[2].trim();
      close();
      above[lvl] = title;
      above.length = lvl + 1;           // a heading resets everything nested under it
      if (lvl === level) {
        let group = null;
        for (let g = lvl - 1; g >= 1; g--) if (above[g]) { group = above[g]; break; }
        current = { title, level: lvl, group, line: i + 1, lines: [line] };
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  close();
  return sections;
}

function trimSection(text) {
  return text.replace(/\s+$/, '').replace(/\n+-{3,}\s*$/, '').replace(/\s+$/, '');
}

/** The first line of prose under a section's heading, link targets and emphasis stripped, cut at a word. */
export function sectionSummary(section, maxChars = 140) {
  const lines = section.body.split('\n').slice(1);
  let fence = false;
  for (const raw of lines) {
    if (/^\s{0,3}(```|~~~)/.test(raw)) { fence = !fence; continue; }
    if (fence) continue;
    const line = raw.trim();
    if (!line || /^#/.test(line) || /^!\[/.test(line) || /^\|/.test(line) || /^[-*_]{3,}$/.test(line)) continue;
    const text = line.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
    if (!text || /^(syntax|usage|example)s?:?$/i.test(text)) continue;
    if (text.length <= maxChars) return text;
    const cut = text.slice(0, maxChars);
    const space = cut.lastIndexOf(' ');
    return `${space > maxChars * 0.6 ? cut.slice(0, space) : cut} \u2026`;
  }
  return '';
}

// ============================================================
// Name index over sections
// ============================================================

const normalize = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * A name \u2192 sections lookup, the shape the REST and SDK lookups have so a caller sees one behaviour: an
 * exact name renders the entry; a name only part of one entry's name renders that entry; a name several
 * entries answer to lists them; a name nothing answers to says so and reports the miss.
 *   keys(section)     every name the section answers to (lower-cased here)
 *   describe(section) the candidate line
 *   groups            when set, a group's name alone lists that group's entries (the methods reference)
 */
function buildSectionLookup(sections, { kind, label, noun, plural, keys, describe, onMiss = () => {}, groups = false }) {
  const index = new Map();
  const titles = new Map();
  const add = (map, k, s) => { if (!map.has(k)) map.set(k, []); map.get(k).push(s); };
  for (const s of sections) {
    const own = new Set(keys(s).map(normalize).filter(Boolean));
    for (const k of own) add(index, k, s);
    add(titles, normalize(s.title), s);
  }
  const byGroup = new Map();
  if (groups) for (const s of sections) add(byGroup, normalize(s.group || ''), s);

  function candidates(hits, name) {
    if (hits.length > 12) {
      return `${hits.length} ${plural} match "${name}". Be more specific \u2014 for example:\n` + hits.slice(0, 12).map(describe).join('\n') + '\n\u2026';
    }
    return `Multiple ${plural} match "${name}":\n` + hits.map(describe).join('\n') + '\n\nRepeat the call with one of the exact names above.';
  }

  function lookup(name) {
    const k = normalize(name);
    if (!k) return `Provide a ${noun} name.`;
    let hits = index.get(k) || [];
    // A group's name lists the group \u2014 ahead of an entry that happens to carry the same name (the runtime
    // declares a "view" method; "View" asks for the View group), which is appended so nothing is hidden.
    if (groups && byGroup.has(k)) {
      const list = byGroup.get(k);
      let out = `**${list[0].group}** \u00b7 ${list.length} ${plural}\n` + list.map(describe).join('\n');
      const same = hits.filter(s => normalize(s.title) === k);
      if (same.length === 1) out += `\n\n---\n\nThere is also an entry named "${same[0].title}":\n\n${same[0].body}`;
      return out;
    }
    if (!hits.length) {
      // A name that is part of one title, or failing that of one key, is that entry \u2014 the way a developer
      // types "listview" for ListView or "substring" for the three substring functions (listed).
      const partial = (map) => {
        const found = new Set();
        for (const [key, list] of map) if (key.includes(k)) for (const s of list) found.add(s);
        return [...found];
      };
      hits = partial(titles);
      if (!hits.length) hits = partial(index);
    }
    if (hits.length === 1) return hits[0].body;
    if (hits.length > 1) {
      const distinct = new Set(hits.map(s => `${s.group}\u0000${s.title}`));
      if (distinct.size === 1) return hits[0].body;
      return candidates(hits, name);
    }
    onMiss(kind, name);
    return `${label} "${name}" not found. xios3_list("${plural}") names every ${noun}.`;
  }

  return { sections, lookup, byGroup, size: sections.length };
}

// Every spelling a heading answers to: "Menu Item" is also "menuitem" and "menu-item".
const nameForms = title => [title, title.replace(/\s+/g, ''), title.replace(/\s+/g, '-')];

// ============================================================
// The reference
// ============================================================

// Words a question is asked with, not about: dropped before the concept entries are scored.
const CONCEPT_STOPWORDS = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'can', 'do', 'does', 'for', 'from', 'how', 'i', 'in',
  'into', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'the', 'to', 'use', 'using', 'what', 'when', 'where', 'which', 'with', 'xios', 'xios/3']);

/**
 * Build the XIOS/3 reference from its texts, keyed as XIOS3_FILES is (component, operation, function,
 * method, event, action, concepts, icons, iconCategories). A missing or empty text leaves its lookup
 * answering "not available" rather than failing the server; `missing` names those keys.
 */
export function buildXios3Reference(texts, { onMiss = () => {} } = {}) {
  const missing = [];
  const read = (key) => {
    const text = String((texts || {})[key] || '');
    if (!text) missing.push(key);
    return text;
  };
  const summaryLine = s => `- ${s.title} \u2014 ${sectionSummary(s)}`;
  const groupedLine = s => `- ${s.group ? `${s.group} \u203a ` : ''}${s.title} \u2014 ${sectionSummary(s)}`;

  const components = buildSectionLookup(splitSections(read('component'), 2), {
    kind: 'xios3-component', label: 'XIOS/3 component', noun: 'component', plural: 'components', onMiss,
    keys: s => nameForms(s.title), describe: summaryLine,
  });
  const operations = buildSectionLookup(splitSections(read('operation'), 2), {
    kind: 'xios3-operation', label: 'XIOS/3 operation', noun: 'operation', plural: 'operations', onMiss,
    keys: s => nameForms(s.title), describe: summaryLine,
  });
  const functions = buildSectionLookup(splitSections(read('function'), 2), {
    kind: 'xios3-function', label: 'XIOS/3 function', noun: 'function', plural: 'functions', onMiss,
    keys: s => [s.title, `${s.title}()`], describe: summaryLine,
  });
  const methods = buildSectionLookup(splitSections(read('method'), 3), {
    kind: 'xios3-method', label: 'XIOS/3 method', noun: 'method', plural: 'methods', onMiss, groups: true,
    keys: s => [s.title, `${s.title}()`, ...(s.group ? [`${s.group} ${s.title}`, `${s.group}.${s.title}`, `${s.title} ${s.group}`] : [])],
    describe: groupedLine,
  });
  const events = buildSectionLookup(splitSections(read('event'), 2), {
    kind: 'xios3-event', label: 'XIOS/3 event', noun: 'event', plural: 'events', onMiss,
    keys: s => nameForms(s.title), describe: summaryLine,
  });
  const actions = buildSectionLookup(splitSections(read('action'), 2), {
    kind: 'xios3-action', label: 'XIOS/3 action', noun: 'action', plural: 'actions', onMiss, groups: true,
    keys: s => nameForms(s.title), describe: groupedLine,
  });

  const conceptsText = read('concepts');
  const conceptGroups = splitSections(conceptsText, 2);
  const conceptEntries = splitSections(conceptsText, 3);

  const iconNames = read('icons').split('\n').map(l => l.trim()).filter(Boolean);
  const iconCategories = splitSections(read('iconCategories'), 2).map(s => ({
    name: s.title,
    icons: s.body.split('\n').slice(1).join(' ').split(/[,\s]+/).map(n => n.trim()).filter(Boolean),
  }));

  const kinds = {
    components, operations, functions, methods, events, actions,
  };
  const counts = () => ({
    components: components.size, operations: operations.size, functions: functions.size, methods: methods.size,
    events: events.size, actions: actions.size, conceptGroups: conceptGroups.length, concepts: conceptEntries.length,
    icons: iconNames.length,
  });

  const unavailable = (key) => `The XIOS/3 reference part "${key}" (${XIOS3_FILES[key]}) is not available here: it was not built, or not published by the portal this server reads.`;

  // ---- concepts
  const conceptsToc = () => {
    const lines = [`XIOS/3 concepts \u2014 ${conceptGroups.length} groups, ${conceptEntries.length} questions. xios3_lookup kind concept, names "<group>" returns one group in full; words return the questions that mention them.`, ''];
    for (const g of conceptGroups) {
      const qs = conceptEntries.filter(e => e.group === g.title);
      lines.push(`**${g.title}** \u00b7 ${qs.length}`);
      for (const q of qs) lines.push(`- ${q.title}`);
      lines.push('');
    }
    return lines.join('\n').trimEnd();
  };
  function conceptsLookup(topic) {
    if (!conceptsText) return unavailable('concepts');
    const q = normalize(topic);
    if (!q) return conceptsToc();
    const groupHits = conceptGroups.filter(g => normalize(g.title) === q);
    const partialGroups = groupHits.length ? groupHits : conceptGroups.filter(g => normalize(g.title).includes(q));
    if (partialGroups.length === 1) return partialGroups[0].body;
    const words = q.split(/[^a-z0-9$!{}-]+/).filter(w => w.length > 1 && !CONCEPT_STOPWORDS.has(w));
    const scored = conceptEntries.map(e => {
      const title = normalize(e.title);
      const body = normalize(e.body.split('\n').slice(1).join('\n'));
      let score = 0;
      if (title.includes(q)) score += 10;
      for (const w of words) {
        if (title.includes(w)) score += 4;
        if (body.includes(w)) score += 1;
      }
      return { e, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.e.line - b.e.line);
    if (!scored.length) {
      onMiss('xios3-concept', topic);
      return `No XIOS/3 concept matched "${topic}". Groups: ${conceptGroups.map(g => g.title).join(', ')}. xios3_lookup kind concept with no names lists every question.`;
    }
    const top = scored.slice(0, 5);
    const out = [`${scored.length} concept ${scored.length === 1 ? 'entry matches' : 'entries match'} "${topic}"${scored.length > 5 ? ' (top 5)' : ''}.`, ''];
    for (const { e } of top) out.push(`**${e.group}**`, e.body, '');
    return out.join('\n').trimEnd();
  }

  // ---- xios3_list
  const KIND_ALIASES = {
    component: 'components', components: 'components', operation: 'operations', operations: 'operations',
    function: 'functions', functions: 'functions', method: 'methods', methods: 'methods',
    event: 'events', events: 'events', action: 'actions', actions: 'actions', actionurl: 'actions', actionurls: 'actions',
    concept: 'concepts', concepts: 'concepts', icon: 'icons', icons: 'icons',
  };
  function listText(kind) {
    const k = normalize(kind).replace(/[\s_-]+/g, '');
    if (!k) {
      const c = counts();
      return [`The XIOS/3 reference on this server: ${c.components} components, ${c.operations} operations, ${c.functions} functions, ${c.methods} methods in ${methods.byGroup.size} groups, ${c.events} events, ${c.actions} actions and action URLs, ${c.concepts} concept questions in ${c.conceptGroups} groups, ${c.icons} icons.`,
        'xios3_list("<kind>") names them: components, operations, functions, methods, events, actions, concepts, icons.'].join('\n');
    }
    const which = KIND_ALIASES[k];
    if (!which) return `No reference kind "${kind}". Kinds: components, operations, functions, methods, events, actions, concepts, icons.`;
    if (which === 'concepts') return conceptsToc();
    if (which === 'icons') return iconsText('');
    const ref = kinds[which];
    if (!ref.size) return unavailable(which.replace(/s$/, ''));
    const tool = `xios3_lookup kind ${which.replace(/s$/, '')}, names`;
    if (ref.byGroup.size) {
      const lines = [`${ref.size} XIOS/3 ${which} in ${ref.byGroup.size} groups. ${tool} "<name>" returns one entry; ${tool} "<group>" lists a group.`, ''];
      for (const list of ref.byGroup.values()) lines.push(`**${list[0].group}** \u00b7 ${list.length}`, list.map(s => s.title).join(', '), '');
      return lines.join('\n').trimEnd();
    }
    return `${ref.size} XIOS/3 ${which}. ${tool} "<name>" returns one entry.\n\n${ref.sections.map(s => s.title).join(', ')}`;
  }

  // ---- icons
  const USAGE = 'An icon is used as icon://<name>, or icon://<name>?color=<hex> for a coloured one.';
  const ICON_SHOW = 150;
  function iconsText(query) {
    if (!iconNames.length) return unavailable('icons');
    const q = normalize(query);
    if (!q) {
      const lines = [`${iconNames.length} XIOS/3 icons. ${USAGE}`, 'xios3_lookup kind icon, names "<word>" finds the names containing it; a category name lists the category.', ''];
      for (const c of iconCategories) lines.push(`- ${c.name} \u00b7 ${c.icons.length}`);
      return lines.join('\n');
    }
    const category = iconCategories.find(c => normalize(c.name) === q);
    if (category) return `**${category.name}** \u00b7 ${category.icons.length} icons. ${USAGE}\n\n${category.icons.join(', ')}`;
    const words = q.split(/[^a-z0-9]+/).filter(Boolean);
    if (!words.length) return `Provide an icon name, a word in one, or a category.`;
    const rank = (name) => {
      if (name === q || name === words.join('_')) return 0;
      if (words.every(w => name === w || name.startsWith(`${w}_`))) return 1;
      if (words.every(w => name.split('_').includes(w))) return 2;
      return 3;
    };
    const hits = iconNames.filter(n => words.every(w => n.includes(w)))
      .map(n => ({ n, r: rank(n) })).sort((a, b) => a.r - b.r || a.n.localeCompare(b.n)).map(x => x.n);
    if (!hits.length) {
      onMiss('xios3-icon', query);
      return `No XIOS/3 icon name contains "${query}". Try a shorter word; xios3_lookup kind icon with no names lists the categories.`;
    }
    const shown = hits.slice(0, ICON_SHOW);
    return `${hits.length} of ${iconNames.length} icons match "${query}"${hits.length > ICON_SHOW ? ` (first ${ICON_SHOW})` : ''}. ${USAGE}\n\n${shown.join(', ')}`;
  }

  // ---- the kind lookups, guarded for a missing file
  const guarded = (ref, key) => (name) => (ref.size ? ref.lookup(name) : unavailable(key));

  return {
    missing,
    counts,
    components, operations, functions, methods, events, actions,
    conceptGroups, conceptEntries, iconNames, iconCategories,
    componentText: guarded(components, 'component'),
    operationText: guarded(operations, 'operation'),
    functionText: guarded(functions, 'function'),
    methodText: guarded(methods, 'method'),
    eventText: guarded(events, 'event'),
    actionText: guarded(actions, 'action'),
    conceptsText: conceptsLookup,
    listText,
    iconsText,
  };
}
