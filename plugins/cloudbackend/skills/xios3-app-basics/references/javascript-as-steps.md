# JavaScript as steps — the contract measured on the hosted runtime

Hand-written, 2026-10-07, from an application loaded from the CloudBackend PaaS console (Projects) and then
deployed through the Deploy Wizard; nothing here is from the manual. The manual's *Process as JavaScript*
page (`processes.md`) describes the design; this page is the subset that ran, the calls that did not, and the
one rule that saved the most time: **the JavaScript computes, the process writes.**

## The shape that runs

A process-level module, loaded with `script`, whose exports are run as steps with `call`:

```xml
<application name="notes" instances="1" xmlns:xlink="http://www.w3.org/1999/xlink">
  <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>
  <login>…</login>

  <process name="notesProcess" xlink:actuate="onRequest">      <!-- no version= : the Deploy Wizard rejects it -->
    <script href="notes.v1.js"/>

    <trigger view="Notes" component="Notes" event="Loaded" step="viewLoaded"/>
    <trigger view="Notes" component="items" event="Select" step="itemSelected"/>
    <trigger view="Notes" component="uploader" event="FileUploadComplete" step="uploadComplete"/>

    <step id="viewLoaded"><operation name="call" value="init"/></step>
    <step id="itemSelected"><operation name="call" value="onItemSelect"/></step>

    <step id="uploadComplete" error="pipelineFailed">
      <operation name="call" value="onUploadComplete"/>              <!-- JavaScript fills newName, newTitle … -->
      <alias name="newName"  value="{#Notes#newName}"/>
      <alias name="newTitle" value="{#Notes#newTitle}"/>
      <operation name="database" value="home://Notes/Items">
        <create type="object" name="{$newName}" rename="true">
          <content type="text/xml"><note status="new"><title>{$newTitle}</title><text/></note></content>
        </create>
      </operation>
      <operation name="call" value="onItemCreated"/>
    </step>

    <step id="storeText" error="pipelineFailed">
      <alias name="href" value="{#Notes#selectedHref}"/>
      <alias name="text" value="{#Notes#newText}"/>
      <operation name="change" value="{$href}">
        <store select="/note/text" type="replaceText">{$text}</store>
      </operation>
      <operation name="change" value="{$href}">
        <store select="/note/@status" type="replaceText">done</store>
      </operation>
      <operation name="save" value="{$href}"/>
      <operation name="call" value="onTextStored"/>
    </step>

    <step id="pipelineFailed">
      <operation name="debug" value="pipeline failed on {#Notes#selectedHref}"/>
      <operation name="call" value="onPipelineFailed"/>
    </step>
  </process>

  <view name="Notes" … xlink:actuate="onRequest">
    …
    <!-- plumbing the user never sees: the handoff from JavaScript to the process -->
    <upload name="uploader" hide="true"/>
    <input name="selectedHref" width="1" height="1" style="opacity:0"/>
    <input name="newName"      width="1" height="1" style="opacity:0"/>
    <input name="newTitle"     width="1" height="1" style="opacity:0"/>
    <textarea name="newText"   width="1" height="1" style="opacity:0"/>
  </view>
</application>
```

```js
// notes.v1.js — every export is a step the process can call
let sys, view, items;

export async function init() {
  sys = globalThis.sys;                                          // the system object the runtime exposes
  view = sys.viwMng.views.find(v => v.name === "Notes");         // getView(name) returned null here; scan
  items = view.getComponent("items");
  await items.bindData("home://Notes/Items/", "/db:result");     // a deferred; await it
}

export function onItemSelect() {
  const href = items.getSelectionNode("@xlink:href");            // the selected row's object
  setValue(view.getComponent("selectedHref"), href);
}

export async function onUploadComplete() {
  setValue(view.getComponent("newName"),  "n" + Date.now());     // unique: an upload onto an existing name never completes
  setValue(view.getComponent("newTitle"), "Note " + new Date().toISOString().slice(0, 16));
}

export async function onItemCreated() {
  try {
    const text = await compute();                                // whatever the app is for
    setValue(view.getComponent("newText"), text);                // textarea: an <input> drops line breaks
    // the PROCESS stores it: have the step that follows run storeText, or call it from a step
  } catch (e) {
    console.error("compute", e);                                 // a throw here stops the calling step for good
    setValue(view.getComponent("newText"), "");
  }
}

function setValue(c, v) { c.setValue(v == null ? "" : String(v)); }
function getValue(c)    { return c.getValue() || ""; }
```

What each piece does, as measured:

| Piece | Measured behaviour |
| --- | --- |
| `<script href="…"/>` under `<process>` | Loads the module when the process starts. The `<script class>` shape on `<application>` from the authoring guide did not run for a console-loaded app. |
| `<operation name="call" value="x"/>` | Runs the export named `x` and **waits for the promise it returns** before the next operation. The same `call` also runs a step with id `x`, so keep function names and step ids distinct. |
| An export's arguments | `(event, context)`; neither was needed when the view is found through `sys.viwMng`. |
| `component.setValue` / `getValue` | The handoff in both directions. A component with `hide="true"` throws on `setValue`: hide the plumbing with size and opacity instead. |
| `{#View#component}` in an alias or `decision` | Reads the component's current value in the process, so a step can branch on what the JavaScript left there. |
| `items.bindData(url, "/db:result")` | Rebinds a grid or list to a container listing. On the hosted runtime a held selection **re-fires `Select` on rebind**; call `items.resetSelection()` first, then rebind, then reselect what you meant to show. |
| `items.getSelectionNode("@xlink:href")` | The selected object's address, the value every later `change`/`save` needs. |
| `new SYS_URL(href, null, sys).load()` | **Reads only.** The document it returns is a copy: `replaceText` on it changes nothing that is stored. `selectSingleNode(xpath)` on it is fine for reading. |
| `sys.baxide.httpRequest(url, { responseType: "arraybuffer" })` | An authenticated download, for example an uploaded recording: `sys.baxide.href + "documents/" + containerId + "/" + objectId + "/1"` is the first stream. |
| `<upload name="…" hide="true"/>` | `uploader.setDestination(containerHref)`, then `uploader.uploadStart(uniqueName, accept)` opens the file picker; `FileUploadStarted` and `FileUploadComplete` are its events. |
| `<operation name="debug" value="…"/>` | Prints to the browser console; the cheapest trace there is. |
| `error="stepId"` on a step | Runs that step when one of the step's operations fails (a `change` on a missing document, a refused `callService`). A JavaScript step that *throws* is different: the error is logged and the calling step never continues, so catch inside the export. |

## Writes: the process, never the script

The only writes that persisted were the process's: `database` with `create … <content>` for a new object
(aliases interpolate inside the content), and `change` with `<store select="…" type="replaceText">` followed
by `save` for an existing one. Everything the JavaScript knows reaches those operations through the
plumbing components. Prove a write by reading the stored document back (the CLI's `cat <object>`), not from
what the screen shows: the screen shows the copy.

Mint object names in the JavaScript (`"n" + Date.now()`, or a counter read from the listing), never from
the user's text; and `rename="true"` on `create` keeps a collision from failing the step.

## Calling an API through the proxy, with a JSON body

```xml
<step id="summarise" error="pipelineFailed">
  <operation name="call" value="ensureTextJson"/>                <!-- fills textJson, see below -->
  <alias name="text" value="{#Notes#textJson}"/>
  <operation name="callService" value="llm://v1/messages" responseAlias="reply">
    <body type="json" eval="pct">{"model":"…","max_tokens":1000,"messages":[{"role":"user","content":"(%$text%)"}]}</body>
  </operation>
  <alias name="summary" value="$reply#/json/content/text"/>
  …
</step>
```

With `eval="pct"` the alias is substituted **verbatim** into the body. A line break or a quote in the text
is then a JSON syntax error at the provider ("Bad control character", "Bad escaped character"), and the
manual's `escape-string()` does not help: it writes `\'`, which JSON rejects. Keep a JSON-escaped copy of the
text in a hidden `textarea` (`JSON.stringify(text).slice(1, -1)` in the JavaScript) and embed that one.

The proxy channel itself is declared in the manifest as the manual shows; the Deploy Wizard's verifier
flags `<proxy>` under `channel` and the deployment goes through with Deploy Anyway (`deployment-pipeline.md`).

## Development loop

- The runtime **caches a module** once loaded, and closing the application does not unload its process.
  Version the file name (`notes.v2.js`, and the `href` with it) and reload the console page between runs.
- `uploadStart` onto an existing object name never completes (overwrite is off); mint a new name per upload.
- A progress callback from a browser-side model fires per chunk; throttle to changed messages, or the
  status line floods.
- When something does nothing: the trigger's `view`/`component`/`event` spelling first, then whether the
  function name collides with a step id, then the browser console for the `debug` lines.

## Not functions on the hosted runtime (from the authoring guide)

- `sys.drvMng.createDocument` — create objects with the `database` operation instead.
- `xml.tmpDoc.createNode` — build XML as text inside `<content>`; the process parses it.
- `sys.viwMng.getView(name)` returned `null` for the application's own view; scan `sys.viwMng.views`.
- `getElementsByTagName("db:streams")` on a `db:result` object node returns nothing (local-name matching
  too), so a stream's MIME type is not reachable from the listing; keep it in the object's own document.
