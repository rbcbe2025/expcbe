#!/usr/bin/env node
// check-hosted.mjs [--pull] — are the hosted connectors up, and do they serve the corpus the skills were built from?
//   · tools/list over Streamable HTTP on each connector in the plugin's .mcp.json (initialize first; the session
//     header is carried if the server issues one; JSON or SSE answers both read)
//   · GET <docs>/health: corpora.<name>.generated against the hub's <corpus>/toc.json generated date
// A connector unreachable or tools/list failing is a hard finding (exit 1). A hosted corpus date that differs from
// the local build is a soft finding (printed, exit 0): release the hosted docs. --pull is a stub: it will merge the
// hosted miss log and usage counters into the hub's reports before its weekly QA, once the host exposes them.
import {existsSync} from 'node:fs';
import path from 'node:path';
import {PLUGIN_DIR, HUB, readJson} from './lib.mjs';

const pull = process.argv.includes('--pull');
const TIMEOUT = 20_000;
const servers = readJson(path.join(PLUGIN_DIR, '.mcp.json')).mcpServers;

async function rpc(url, method, params, session) {
  const headers = {'content-type': 'application/json', accept: 'application/json, text/event-stream'};
  if (session) headers['mcp-session-id'] = session;
  const res = await fetch(url, {method: 'POST', headers, body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params}), signal: AbortSignal.timeout(TIMEOUT)});
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 160).replace(/\s+/g, ' ')}`);
  let message;
  if ((res.headers.get('content-type') || '').includes('text/event-stream')) {
    const data = text.split('\n').filter(l => l.startsWith('data:')).map(l => JSON.parse(l.slice(5).trim()));
    message = data.find(m => m.id === 1) ?? data.at(-1);
  } else message = JSON.parse(text);
  if (!message) throw new Error(`${method}: empty answer`);
  if (message.error) throw new Error(`${method}: ${message.error.message || JSON.stringify(message.error)}`);
  return {result: message.result, session: res.headers.get('mcp-session-id') || session};
}

let hard = 0, soft = 0;
for (const [name, {url}] of Object.entries(servers)) {
  try {
    const init = await rpc(url, 'initialize', {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'check-hosted', version: '0'}});
    const {result} = await rpc(url, 'tools/list', {}, init.session);
    const tools = result.tools || [];
    const annotated = tools.filter(t => t.annotations && t.annotations.readOnlyHint !== undefined).length;
    const info = init.result && init.result.serverInfo ? `${init.result.serverInfo.name} ${init.result.serverInfo.version || ''}`.trim() : 'server unnamed';
    console.log(`✓ ${name} ${url}: ${tools.length} tools, ${annotated} with readOnlyHint (${info})`);
    for (const t of tools) console.log(`    ${t.name}${t.title ? ` — ${t.title}` : ''}`);
  } catch (e) { hard++; console.log(`✗ ${name} ${url}: ${e.message}`); }
}
const docs = Object.values(servers).find(s => s.url.endsWith('/docs'));
if (docs) {
  try {
    const res = await fetch(`${docs.url}/health`, {signal: AbortSignal.timeout(TIMEOUT)});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const health = await res.json();
    for (const corpus of ['cloudbackend', 'xios']) {
      const toc = path.join(HUB, corpus, 'toc.json');
      const local = existsSync(toc) ? readJson(toc).generated : null;
      const hosted = health.corpora && health.corpora[corpus] ? health.corpora[corpus].generated : null;
      if (!hosted) { soft++; console.log(`· ${corpus}: /health reports no corpus date (local toc.json ${local})`); }
      else if (hosted === local) console.log(`✓ ${corpus}: hosted corpus ${hosted} = local toc.json`);
      else { soft++; console.log(`· ${corpus}: hosted corpus ${hosted}, local toc.json ${local}: release the hosted docs`); }
    }
  } catch (e) { hard++; console.log(`✗ ${docs.url}/health: ${e.message}`); }
}
if (pull) console.log('· --pull: not implemented yet (it will merge the hosted miss log and usage counters into the hub\'s reports)');
console.log(`${hard} hard, ${soft} soft finding(s)`);
process.exit(hard ? 1 : 0);
