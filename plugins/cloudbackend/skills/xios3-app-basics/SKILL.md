---
name: xios3-app-basics
description: "Write and design XIOS/3 applications: the manifest, views, processes and data bindings (home://, tenant://), events and operations, packaging, and the design kit: a token theme covering every component, Lucide icons, phone and desktop layouts, a login with sign in, sign up and a kept session, and the runtime's measured pitfalls. Use it for any XIOS/3 markup, an app's look, theme, icons or layout, a login screen, or a bug in a XIOS/3 view or process."
---

# XIOS/3 applications: the markup and the look

XIOS/3 applications are XML with no build step: a **view** (what is on screen), a **process** (what happens
when) and **data**, XML documents in the CloudBackend Singularity database that the runtime keeps in sync with
the view both ways. The bundled references are the published manual with a public link on every topic, plus
pages measured on the hosted runtime (dated). When a detail matters (an attribute, an operation's children),
open the reference or look the name up (`xios3_lookup`, kind `component` or `operation`): the runtime ignores an
invented attribute.

## The three documents

**Manifest** (`index.xml`): names the app and lists its views, processes and data. Small apps inline everything
(*inline packaging*); larger apps reference separate documents with `xlink:href` (*advanced packaging*:
`views/`, `processes/`, `data/`, `styles/`, `images/`).

```xml
<application name="notes" icon="icon://note" instances="1">
  <settings/><about version="1"/><resources/>
  <process name="notesProcess"> … </process>
  <view name="notesView" version="1" title="Notes"> … </view>
</application>
```

**View**: one top-level `<panel>`, components inside panels (only `menubar` and `toolbar` may sit outside),
`type="rows"` or `"columns"`, sizes in px, % or `fill`. Name every component: triggers and expressions address
components by name. A container listing is a `grid` or an `iconlist`.

```xml
<view name="notesView" version="1" title="Notes">
  <panel name="root" type="rows" width="100%" height="100%">
    <panel name="entry" type="columns" height="40"><input name="noteText" width="fill"/><button name="save" text="Save"/></panel>
    <grid name="notes" width="100%" height="fill"/>
  </panel>
</view>
```

**Process**: `<trigger>`s listen for an `event` on a `component` of a `view` and run a `step`; steps hold
`<operation>`s run in order (`bind`, `change`, `database`, `action`, `decision`, `call`, `open`, `confirm`,
`callService`, … all 28 in `references/reference-index.md`).

```xml
<process name="notesProcess">
  <trigger view="notesView" component="save" event="Select" step="saveNote"/>
  <trigger view="notesView" event="Loaded" step="showNotes"/>
  <step id="saveNote">
    <alias name="text" value="{#notesView#noteText}"/>
    <operation name="database" value="home://Notes">
      <create type="object" name="{$text}.xml" rename="true"><content type="text/xml"><note><text>{$text}</text></note></content></create>
    </operation>
    <operation name="action" value="#notesView"><component name="noteText" action="clear"/></operation>
  </step>
  <step id="showNotes">
    <operation name="bind" value="home://Notes"><component view="notesView" name="notes" select="/db:result"/></operation>
  </step>
</process>
```

`{…}` is an expression: `{$alias}`; `{#view#component}` (a `#` between view and component, never a slash);
`{#view#comp#@attr}`; `{#view#comp.getValue()}`; a channel path with `#xpath`. A row picked in a bound listing
is `{#view#list#@xlink:href}`; bind labels or a detail render to that document in the `Select` step.
`references/processes.md` (Using Expressions) has the grammar.

## Data: the Virtualization Layer

Every document is on a **channel**: `home://` (the identity's own database), `tenant://` (the tenant's shared
one), and mounted ones for any REST API (`channel`). **Show** with `bind` (edits in a bound component go back to
the database); **create** with `database` (`<create type="container|object">`); **edit** with `change` (a
`<store>` that replaces or appends) then `save`; **search** with the query language (singularity-database
`query-language.md`). Object names may not contain `? / \ ( ) # * : [ ] | % & < " ' ! { }`: derive them from a
counter or a timestamp, not from free text as the sketch above does for brevity. Shared app data on `tenant://Applications/<app>/`, per-user data on
`home://`. The database model (identities, groups, ACLs, datatypes) is singularity-database's.

## Events, actions, methods, rules

A trigger's `event` must be one the component emits (`Select`, `Change`, `Loaded`, `Drop`, `Key`, …; each
component's reference page lists them). **Actions** change state (`show`, `hide`, `enable`, `clear`, `select`);
**methods** go through `callMethod` with `<param>`s; **rules** restyle a component from its bound data;
`decision` switches, `foreach` loops, `call` runs a step, `confirm` shows a dialog.

## The first version: the design kit

One sentence about the app picks a **direction** (six in `assets/directions.json`); the direction brings
palette, type and shape, and the token theme turns those into every hover and border. The first version is
generated, not drawn:

1. **Brief.** `python3 scripts/designkit.py brief --app "Planboard" --idea "…" --item project` writes
   `design/design-brief.md`, `theme.xml`, `moodboard.html` and `design.json` (`--direction`, `--primary #hex`).
2. **Show, ask once**: "this look, or another direction?" (offer the two nearest). The only design question.
3. **Generate.** `python3 scripts/designkit.py app --design design/design.json --items "home://Planboard/Projects"
   --out app [--login]`: manifest with the theme, desktop and phone views, process, detail stylesheet, the two
   components, sample data (`--sample` runs before the container exists). `references/layouts.md` explains each file.
4. **Upload**: each sub-folder is a container of its own: create the folders, then upload each folder's files
   (`references/deployment-pipeline.md`, "Folders first").

Without a shell: move 1 by hand from `references/design-brief.md` (section 4) and `assets/directions.json`, the
mood board described in five lines, move 3 by filling in `assets/example/` (placeholders per file in `layouts.md`).

## The theme

Every app gets a custom theme covering every component; no component keeps its default look. Two parts, both
written by `designkit.py`: `<theme name="…" tokens="true" icon="lucide">` in the manifest, and the kit's
`ui/DesignKit/theme.css`, loaded by the view component into every view, because some components (panel, label,
toggle, slider, accordion, date, menus, dialogs) keep a legacy look under tokens alone. `references/theme.md` has
the coverage, the `--xc-*` hooks, the responsive rules (44 px targets, breakpoints at 640 and 1024 px) and dialogs.

- **Seeds** in `<colors>`: `primary`, `secondary`, `tertiary` with their `on-` colours, `background`, `surface`,
  `on-surface`, `error`, `on-error`, `lightIcon`, `darkIcon`, `grey`; every `on-` pair at 4.5:1 or better.
- **Knobs** in `<tokens>`: `font-sans` (a brand face first, then a system stack), `font-display`, `text-*`,
  `weight-*`, `space-1`…`space-6`, `control-height`, `radius-*`. **Derived** values you never write.
- `<components>`: every component `look="token"` (all 32 in `directions.json`), `<view look="token"><style
  href="ui/DesignKit/theme.css"/></view>`, a `<spinner>` with an SVG.
- No hex in a view or stylesheet: panels `class="xios-card"`, labels `xios-type-label` / `xios-type-caption`,
  button rows `class="dk-wrap"`; render type `dk-h1`, `dk-body`, `dk-muted`, `dk-pill`.
- **Icons** (`references/icons.md`): Lucide names (`plus`, `trash-2`, `users`, `settings`), written
  `icon://<name>?look=lucide&color=<colour>`: the `on-` colour on a filled button (`on-primary`; Delete
  `on-error`), `primary` on a toolbar or card, and inside an `iconlist` the seed written out without `#`
  (`color=4338ca`). An IconExperience name draws nothing under the Lucide theme.
- Rebrand: change `primary` (and `darkIcon`) and run `app` again; a dark look is the `night` direction.

## Layouts and the two components

The manifest declares the view twice with one name and a `screen=` query (`phone` up to 600 px, `(min-width:
601px)` the rest); the phone file stacks: the list first, the detail on a pick with a Back button, the
navigation behind a Menu button. `<statusline name="status"/>` tells the user every write's outcome (`callMethod`
`notify` on `#App#status`, text and kind `info|ok|error|busy`); `<screen name="screen"/>` reports the screen size.
`references/layouts.md` has the patterns (list + detail, board, form, reading) and both components.

## The login screen

Every app with a login offers **sign in, sign up and forgot password** in the CloudBackend PaaS sign-in's look
(`references/login.md`; `designkit.py app --login` writes it, `designkit.py login app` checks it):

- `<login session="true">`: the runtime keeps the session in the browser for seven days of use; without it every
  reload signs the user out. The app then shows a **Sign out**: `<operation name="system"><logout silent="true"/>
  </operation>`.
- Always set `create` and `reset` (their links show only when set; a team tool or a tenant without the CRM
  too), `createPrompt`, `title`, `description`,
  `button`, and the primary colour in `buttonColor` and `linkColor`.
- Wiring: views and the app's process `xlink:actuate="onRequest"`, the login process
  (`xlink:href="xios://apps/login.xml"`, `onLoad`) declared first, the desktop view declared first (after sign-in
  the first declared view opens on every screen, so it adapts to a narrow one).
- The app's own files hold no password or token. On a deployment, the Staging card's Configure Login Page needs
  the logo as a full `https://` address (`references/deployment-pipeline.md`).

## Packaging and deployment

Every app lives in its own container: `home://Applications/<app>/index.xml` (personal) or
`tenant://Applications/<app>/` (shared). **Deploy** from the console's Projects tab (the package → *Deploy*, the
Deploy Wizard), or with the CloudBackend plugin's `upload_project` and `deploy`. The deployment name is the
access URL's host name: lowercase letters and digits; the manifest must be named `index.xml`. A `home` project
becomes a private *Development* deployment, a `tenant` one a public *Shared* one; *Staging* and *Production* are
promoted from there. Everything in a deployed container is publicly readable: no secrets in it. What each
promotion does to the address, the logo rule and the login configurator: `references/deployment-pipeline.md`;
read it before the first deploy. Selling subscriptions (price plans, the PayPal `purchase`): singularity-database
`price-plans.md`. Any web server: `references/deployment.md`.

## Working method

1. Data first (containers, object shape), then the view, then the process.
2. When something does nothing: the trigger's `view`/`component`/`event` spelling, then the expression paths,
   then whether the component is inside a panel.
3. Copy from `references/recipes.md` (31 published code concepts) before writing new patterns.
4. JavaScript computes, the process writes: start from `references/javascript-as-steps.md`.
5. For the whole loop from an idea to a verified deployment, `cloudbackend-saas-launch` runs the phases and opens
   this skill for the markup and the look.

## Pitfalls, each with its page

- A document changed from JavaScript is a copy and is never stored: hand the value to a step through a named
  component (a transparent `textarea`), the process writes (`database`, `change` + `save`), read it back; `call` waits for an exported function's promise; free text into
  a JSON body needs a JSON-escaped copy (`javascript-as-steps.md`).
- `<script href>` under `<process>` needs an XML `<step id="start">`; declare `<iframe id="win">` in a boot page;
  failures can be quiet; `xsl:for-each` with `call-template`, never `apply-templates` over many nodes; links
  inside a `render`; ASCII files on a webshare; an unknown path answers 200 with `index.html`; no URL prefix
  beginning `xios`; preloads in the boot page; test with latency and with a held drag
  (`references/hosted-runtime-pitfalls.md`).
- `version` belongs on `<about>`, never on `<process>` (the Deploy Wizard rejects it); no view file named
  `view.xml`; `call value=` not `step=`.

## Before you hand it over

- `designkit.py check design/theme.xml` (contrast, `tokens="true"`, the spinner, every component `look="token"`,
  `theme.css` loaded); with a login, `designkit.py login app`; `designkit.py icons app`.
- No hex in any view or stylesheet (`grep -n '#[0-9a-fA-F]\{3,6\}' app/views app/styles`).
- Words for every state: first run, empty list, after a save, after a failure.
- At 390 px nothing scrolls sideways, Back returns to the list, a dialog opens inside the screen.

## Bundled references

Generated from the manual: `getting-started.md`, `views.md` (views, layouts, components, look and feel),
`processes.md`, `data.md`, `deployment.md`, `recipes.md`, `reference-index.md` (every component, operation,
event, function, action and method with its page). Hand-written and dated: `javascript-as-steps.md`,
`deployment-pipeline.md`, `hosted-runtime-pitfalls.md`, `design-brief.md`, `layouts.md`, `data-logic.md`,
`login.md` (and `login-measured.md`), `theme.md`, `icons.md`. The kit: `assets/directions.json`, `assets/example/`, `assets/ui/DesignKit/`,
`assets/lucide-names.txt`, `scripts/designkit.py` (`brief`, `app`, `check`, `login`, `icons`, `moodboard`;
standard library, no network).

## Version

xios3-app-basics 2026.11.8.2, built from the CloudBackend documentation. In the CloudBackend plugin it updates with the plugin (`claude plugin update cloudbackend@cloudbackend`; claude.ai, Claude Desktop and Cowork refresh it at the start of a session).

A copy installed by hand: once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json; when it lists a newer `xios3-app-basics` than 2026.11.8.2, tell the user once, in one sentence, without interrupting the task.

Usage count (anonymous: the skill's name and version, nothing else): ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and is kept with the project. Only if they agreed, fetch https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fxios3-app-basics%2F2026.11.8.2&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fxios3-app-basics the first time the skill is used in a session.
