---
name: xios3-app-basics
description: "Build web applications with XIOS/3 — the declarative XML application platform where a view (UI markup), a process (triggers → steps → operations) and data documents make an application, and the Data Virtualization Layer binds components straight to XML in the CloudBackend Singularity database (home://, tenant://). Use this whenever a developer asks to create, extend, debug or deploy a XIOS/3 application, writes application, view, process, trigger, step or operation markup, wants to bind a grid/list/tree to database objects, react to a component event, create containers or objects from process logic, package an app (inline or advanced), add a login screen, let users sign up, sell subscriptions with price plans and a PayPal checkout, or deploy to CloudBackend PaaS — even if they only say 'XIOS', 'XML app', 'the CloudBackend web UI' or 'docs.xios3.com'."
---

# XIOS/3 application basics

XIOS/3 applications are XML. There is no build step and no JavaScript required for most apps: you
describe the **view** (what is on screen), the **process** (what happens when), and point both at
**data** — XML documents in the CloudBackend Singularity database or anywhere the Data Virtualization
Layer can mount. The runtime keeps view and data in sync in both directions.

This skill gives the shape of an application and the rules that are easy to get wrong. The bundled
references are the published manual, section by section, with a public link on every topic; the
component and operation reference index names every element with its one-line purpose. When a detail
matters — an attribute name, an operation's children — open the reference, do not guess: the runtime
is forgiving about unknown markup and will silently ignore an invented attribute.

## The three documents

**Application manifest** — the executable. Names the app, its icon, how many instances may run, and
which views, processes and data it uses. Small apps inline everything in this one document (*inline
packaging*); larger apps reference separate documents with `xlink:href` (*advanced packaging*).

```xml
<?xml version="1.0"?>
<application name="notes" icon="icon://note" instances="1">
  <settings/>
  <about/>
  <resources/>
  <process name="notesProcess" version="1"> … </process>
  <view name="notesView" version="1" title="Notes" icon="icon://note"> … </view>
</application>
```

**View** — the UI. A `<view>` root (unique `name`, a `version`), exactly one top-level `<panel>`, and
components inside panels (only `menubar` and `toolbar` may sit outside a panel). Panels lay out as
`type="rows"` or `type="columns"`; sizes are `width`/`height` in pixels, percentages or `fill`.

```xml
<view name="notesView" version="1" title="Notes" icon="icon://note">
  <panel name="root" type="rows" width="100%" height="100%">
    <panel name="entry" type="columns" width="100%" height="40">
      <input name="noteText" width="fill"/>
      <button name="save" text="Save"/>
    </panel>
    <grid name="notes" width="100%" height="fill"/>
  </panel>
</view>
```

For a listing of a container's objects reach for `grid` or `iconlist` — those are the components the
manual binds to `home://…` containers throughout; `list` is documented for static and small bound
lists, not container listings.

**Process** — the logic. `<trigger>`s at the top listen for an `event` on a `component` of a `view`
and run a `step`; steps hold `<operation>`s, executed in order. Operations are the verbs: `bind`,
`change`, `database`, `action`, `decision`, `call`, `open`, `confirm`, `callService`, … (all 28 in
`references/reference-index.md`).

```xml
<process name="notesProcess" version="1">
  <trigger view="notesView" component="save"  event="Select" step="saveNote"/>
  <trigger view="notesView" component="notes" event="Select" step="showNote"/>
  <trigger view="notesView" event="Loaded" step="showNotes"/>

  <step id="saveNote">
    <alias name="text" value="{#notesView#noteText}"/>
    <operation name="database" value="home://Notes">
      <create type="object" name="{$text}.xml" rename="true">
        <content type="text/xml"><note><text>{$text}</text></note></content>
      </create>
    </operation>
    <operation name="action" value="#notesView">
      <component name="noteText" action="clear"/>
    </operation>
  </step>

  <step id="showNotes">
    <operation name="bind" value="home://Notes">
      <component view="notesView" name="notes"/>
    </operation>
  </step>

  <step id="showNote">
    <!-- the grid's selection is readable here as {#notesView#notes…} -->
  </step>
</process>
```

`{…}` is an **expression**: `{$alias}` reads an alias; `{#viewName#componentName}` reads a component's
value — note the `#` between view and component, not a slash — and `{#view#comp#@attr}` reads one of its
attributes, `{#view#comp.getValue()}` calls a method; a channel path with `#xpath` reads a node in a
document. Aliases are the variables of a step; `references/processes.md` (Using Expressions) has the
full grammar.

## Data: the Virtualization Layer

Everything is a document on a **channel**: `home://` is the identity's own database, `tenant://` the
tenant's shared database, and further channels can be mounted for any REST or web-service API (the
`channel` operation). Paths are `channel://Container/Sub/document.xml`, and `#xpath` selects inside.

- **Show data**: `bind` a component to a path — `<operation name="bind" value="home://Notes"><component
  view="notesView" name="notes" select="…"/></operation>`. Changes in the database appear in the component;
  edits in a bound component go back to the database.
- **Create**: the `database` operation with `<create type="container" name="…"/>` or
  `<create type="object" name="…"><content type="text/xml">…</content></create>`. Object names may not
  contain `? / \ ( ) # * : [ ] | % & < " ' ! { }` — so never build a name straight from free text the
  way the sketch above does for brevity; derive it from something safe (a counter, a timestamp alias)
  and keep the text in the content.
- **Edit XML**: `change` with a `<store>` describing the new node set (replace/append); it is the key
  operation for working with the Data Virtualization Layer.
- **Search**: the query language (`+term -other field<10 | count`) — `references/data.md`.
- **Datatypes** decide which application opens which object; the `open`, `edit` and `preview` actions
  follow from the datatype association.

Store shared, static application data on `tenant://Applications/<app>/…`; per-user data on `home://`.
Identities, groups, containers, objects, streams, key/values and ACLs are the Singularity database's
model — the skill `singularity-database` explains them; the REST view of the same is `cloudbackend-rest-api`.

## Events, actions, methods, rules

- **Events** are what components emit (`Select`, `Change`, `Loaded`, `Drop`, `Key`, …); the trigger's
  `event` must be one the component actually has. `references/reference-index.md` lists every event, and each
  component's reference page (linked from the index) says which ones it emits; open it when unsure.
- **Actions** change a component's state from a step: `<operation name="action" value="#view">
  <component name="x" action="show|hide|enable|disable|clear|select|…"/></operation>`.
- **Methods** are called with `callMethod` and can take parameters (`setValue`, `getValue`, `search`, …).
- **Rules** alter a component depending on the data bound to it — conditional styling and structure
  without process code.
- **Decision** is the switch statement; `foreach` the loop; `call` runs another step; `confirm` shows a dialog.

## Packaging, storage, deployment

- Inline packaging for small apps built in the CloudBackend PaaS console; advanced packaging (manifest +
  `views/`, `processes/`, `data/`, `layout/`, `images/` sub-containers) for larger apps and teams.
- Every application lives in **its own container** (the wizards call it the project folder) — even an
  inline single-document app: `home://Applications/<app>/index.xml` or `tenant://Applications/<app>/…`.
  Apps to share go under `tenant://Applications`; personal ones under `home://`.
- **Deploy** from the Projects tab: select the package → *Deploy*. The deployment name becomes the host
  name of the access URL (lowercase letters and digits only); the manifest in the container must be named
  `index.xml`. Which XIOS/3 release a deployment runs is documented two ways: the deployment guide says
  always the latest, the console's Deployments page says locked to a release by default with latest as an
  option. Say so if it matters. A project on `home` becomes a private
  *Development* deployment, one on `tenant` a public *Shared* deployment; *Staging* and *Production*
  snapshots are promoted from there and get containers of their own under `tenant://Deployments`.
- Everything inside a deployed container is publicly readable — keep secrets out of it.
- **Login screen**: configure it from the Deployments tab's *Configure Login Page…* (available in
  Staging, carried to Production), or declare it in the manifest: the `xlink` namespace, `xlink:actuate
  ="onRequest"` on your `process` and `view`, a `<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>`
  before your main process, and a `<login>` element for settings (`create` and `reset` children enable
  sign-up and password reset once the CRM module is set up). `references/deployment.md` has the steps.
- **Selling subscriptions**: price plans live in `tenant://Settings/Products/Priceplans`; publish that
  container so signed-out visitors can read it, mount it in the app (`<operation name="database"><mount
  name="priceplans"><published name="priceplans" groupId="…" tenant="…"/></mount></operation>`, then
  `priceplans://`), and start a checkout with `<operation name="tenant"><purchase method="paypal"
  user-id="…" responseAlias="auth">` holding `<products><product id="{productId}" amount="1"/></products>`
  and a `<billing>` with at least `<email>`; open `$auth#/auth/@url` with the `open` operation. The
  `tenant` operation's reference card lists only `createUser` and `deleteUser`, so take `purchase` from
  `references/selling.md`, not from the card. A subscription is one product with amount 1.
- XIOS/3 also runs on any web server: `references/deployment.md` → "Deploying on any WebServer".
- **What each promotion does to the address** (measured 2026-10-07, not in the manual): Development,
  Shared and Staging each die on the next promotion, Production keeps the Staging host, a new card is
  Private, the wizard rejects `version` on `<process>`, and the login logo renders only from a full
  `https://` URL. `references/deployment-pipeline.md` has the table; read it before the first deploy.

## Working method

1. Sketch the data first (which containers, which object shape), then the view, then the process.
2. Name every component; triggers and expressions address components by name.
3. Build in the CloudBackend PaaS console (Application Wizard, CodePad) or locally, upload to
   `tenant://Applications`, run by double-click.
4. When something does nothing: check the trigger's `view`/`component`/`event` spelling against the
   reference, then the expression paths, then whether the component is inside a panel.
5. Copy patterns from `references/recipes.md` (31 published code concepts: create objects, bind a grid,
   drag and drop, dialogs, localization, URL parameters, tree visualisations) before writing new ones.
6. When the app needs JavaScript (a browser-side model, a computation, an API call through the proxy),
   start from `references/javascript-as-steps.md`: the JavaScript computes, the process writes.
7. For the whole loop from an idea to a verified deployment and a benchmark (the spec, a lint before every
   upload, a deployment verified by content, UI probes, hardening, the documents), hand over to the
   `xios3-app-workflow` skill; it opens this one for the markup.

## Pitfalls measured on a console-loaded application (2026-10-07)

Found while taking an application from the CloudBackend PaaS console's Projects section to Production.
The copy-ready contract and the full list are `references/javascript-as-steps.md`; the five that cost the
most:

- **A document changed from JavaScript is never stored.** `new SYS_URL(href).load()` returns a copy;
  `replaceText` on it changes the screen and nothing else. The process writes: `database` with `create …
  <content>`, and `change` (`<store select type="replaceText">`) followed by `save`. Hand values over
  through transparent, named inputs (`textarea` for text with line breaks; `hide="true"` makes `setValue`
  throw) and read the stored document back before believing a write.
- **`call` waits for the promise** an exported function returns, and the same `call` runs a step with that
  id, so function names and step ids must differ. The `<script class>` application shape from the authoring
  guide did not run; `<script href>` under `<process>` did.
- **`eval="pct"` substitutes verbatim.** Free text with a line break or a quote breaks a JSON body at the
  provider, and `escape-string()` writes `\'`, which JSON rejects. Embed a JSON-escaped copy kept in a hidden
  `textarea`.
- **The runtime caches a module** and closing the app does not unload its process. Version the module's
  file name and reload the console page between runs.
- **A rebind re-fires `Select`** on the hosted listview when a selection is held, and an upload onto an
  existing object name never completes. `resetSelection()` before `bindData`; mint unique names.

## Pitfalls measured on the hosted runtime (2026.6.0)

Found while building and publishing a large XIOS/3 application that boots the hosted runtime from
a `boot.js` page and is served from a CloudBackend webshare. Some of them never show on your own
machine (the start-step race, the host's headers and fallbacks); the rest show anywhere but are
easy to miss.

- **Declare the runtime's frame in your boot page.** If the page has no `<iframe id="win">`,
  `boot.js` 2026.6.0 creates one whose document arrives asynchronously. As soon as `system.js`
  has loaded, it adjusts that document. If that comes first, start-up fails with "Cannot read
  properties of null (reading 'style')", and the page stays on its loading screen. In testing it
  failed in most cold loads, and preloading `system.js` makes it likelier. Declare
  `<iframe id="win" name="win" title="..."></iframe>` with no `src` after your loading message, and
  follow it with `<script>boot.win = document.getElementById("win").contentWindow;</script>`. Size it
  in CSS (absolute, full size, no border), and keep anything the reader must click, such as a
  "Try again" link, above it with `z-index`.
- **A `<process>` with `<script href>` children needs an XML `<step id="start">`.** In 2026.6.0 each
  export of such a script can be run as a step with `call`. Without a start step the runtime starts
  importing the script when the process starts, and a `call` to one of its functions made before the
  import has finished is skipped. Nothing is logged; the first sign is whatever the function should
  have produced going missing, for example a later "Alias is not defined" warning. Add
  `<step id="start"><alias name="myProcess" value="started"/></step>`. If you use a `step=` attribute
  on `<process>` instead, do not also run that step from a `Loaded` trigger, or it runs twice.
- **Failures can be quiet.** A failed asynchronous operation does not stop the step, and the step's
  `error=` handler does not run for it — check the result (an alias or a document the step should have
  produced). A JavaScript step that throws is different: the error is logged, but the calling step never
  continues, so catch errors inside your JavaScript steps.
- **Render stylesheets:** use `xsl:for-each` with `xsl:call-template` for lists — `xsl:apply-templates`
  over many nodes is far slower in the runtime's XSLT engine — and emit no `<br/>`, which becomes two
  line breaks.
- **Links inside a `render` are handled by the render, not the browser.** In 2026.6.0 a click on an
  element with an `href` and no `target` is cancelled and does not bubble on. If the render has a
  `Select` trigger, the `href` goes to it; otherwise an `http(s)`, relative or `#section` link does
  nothing. A link with a `target` is followed, but its target is rewritten to `_blank`. The `download`
  attribute is ignored, so a download link does nothing (only an `href` containing `?dl=` is let
  through), and Ctrl/Cmd-clicks are cancelled too. Give outside links `target="_blank"`. For in-page
  anchors, downloads and modifier-clicks, add a `click` listener in the capture phase on the render's
  document, which runs before the render sees the click: scroll to the anchor yourself, and start a
  download from an `<a download>` you create but never insert (`a.click()`). Test it by clicking the
  link and checking that a download begins, not that the link exists.
- **Publishing to a webshare:** the host labels a text file's charset from its content (ASCII files as
  ISO-8859-1, UTF-8 files as UTF-8), and other encodings of XML, XSL, CSS and JavaScript were not
  verified there, so keep those files ASCII (character references in XML and HTML, `\u` escapes in
  JavaScript); an `index.html` can start with a UTF-8 byte-order mark. An unknown path answers `200` with
  your `index.html`, so check a loaded document's content, not its status, and publish a real
  `/llms.txt`. A folder path (`/<folder>/`) answers a listing of its files, so publish nothing you would
  not list. The top-level `/xios/` path belongs to the host, which serves its own XIOS/3 runtime there;
  do not put your own files under it. The host's `robots.txt` (`Disallow: /xios`) matches every path
  that begins with those letters, so pages under `/xios3/` or `/xios-docs/` are not indexed by search
  engines. Choose a URL prefix that does not start with `xios`.
- **Announce your app's files from the boot page.** A webshare makes the browser revalidate every file on
  every visit, and the runtime discovers files one after another (the manifest, then the processes, the
  views, the skins, the styles, the modules, the data), so a warm load is a chain of round trips. List
  them in the boot page's `<head>`: `<link rel="preload" href="..." as="fetch" crossorigin>` for what the
  runtime fetches itself (XML, XSL, CSS, data) and `<link rel="modulepreload">` for your components and
  their imports. The runtime reuses these responses, so nothing is fetched twice. In our testing this
  more than halved the time to a warm page.
- **Test with network latency**, not only on your own machine — for example a local server that
  delays each response by 250 ms. Ordering problems between documents and scripts only show up there.
- **Test drag and drop with the button held.** The runtime starts a drag only once the mouse button
  has been down for 250 ms. A browser-automation drag that presses, moves and releases at once never
  starts one, and the test then reports drag and drop as broken. Press, wait longer than that, move in
  steps, then release.
- **Icons:** prefer Lucide, the collection the runtime ships (ISC licence, monochrome, recoloured from the
  theme): `icon="lucide"` on the theme, then `icon://<name>?look=lucide&color=<colour>` on every icon, the
  `on-` colour on a filled button. Lucide names are lower case with hyphens (`plus`, `trash-2`); an
  IconExperience name such as `folders2` draws nothing under the Lucide theme. xios3-app-design
  `references/icons.md` has the names by role and what was measured on a deployment. Do not ship a whole
  icon font for a few dozen icons (one common symbol font is 3.7 MB). The IconExperience collections need a
  licence to publish on your own domain (use through the CloudBackend service is covered, per the docs).
- **Layout stability:** reserve space for anything that renders after the first paint, never paint a
  footer before the content above it, and give icons fixed dimensions.
- **Previewing markup inside your application:** a webshare answers with `X-Frame-Options: DENY`, so
  no page on it can be framed by URL, not even by your own application; it works on your own machine,
  which hides the problem. Frame a `blob:` document instead: it has your page's origin and no framing
  header, and it can boot the runtime with the markup as its inline startup document. Running a
  runtime inside a frame is not a supported mode in 2026.6.0. The runtime treats the outer page as its
  top window, so dropdowns, menus and dialogs open in the outer page, at the outer page's coordinates.
  Opening the same `blob:` page in a new tab needs no workaround, because there the runtime is the top
  window.

## Bundled references (public manual, with links)

- `references/getting-started.md` — introduction, quick start, application development structure, packaging.
- `references/views.md` — UI development: views, panel layouts, components, attributes, events, actions, methods, rules, look and feel.
- `references/processes.md` — process development: process, triggers, steps, operations, aliases, expressions, event model, process as JavaScript.
- `references/data.md` — Data Virtualization Layer, the CloudBackend database from XIOS/3 (objects, containers, groups, datatypes, key/values, searching), query language.
- `references/deployment.md` — deploying, managing deployments, login application, users, any web server, Android.
- `references/selling.md` — price plans, publishing and mounting them, the PayPal checkout from process markup.
- `references/recipes.md` — the code-concepts snippets.
- `references/reference-index.md` — every component, operation, event, function, action and method with a one-line purpose and its public reference page.

Hand-written, measured on the hosted runtime (not from the manual; dated):

- `references/javascript-as-steps.md` — the JavaScript-in-a-process contract that ran: `script` + `call`, the handoff through components, process-only writes, the proxy JSON body, the dev loop, and the authoring-guide calls that are not functions here.
- `references/deployment-pipeline.md` — what each click in the Deployments section does to the address, the card and the login screen; the logo rule; sessions during testing; pushing files without a tool.

## Version and updates

This is version 2026.11.5 of the xios3-app-basics skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin (`claude plugin marketplace add rbcbe2025/expcbe`, then `claude plugin install cloudbackend@cloudbackend`)? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

Once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json. When its `skills[].version` for `xios3-app-basics` is newer than 2026.11.5, tell the user once, in one sentence, and give them the download (the `file` listed next to it). Do not interrupt the task for it.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fxios3-app-basics%2F2026.11.5&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fxios3-app-basics - it records the skill's name and version and nothing else. Never send it without that agreement.
