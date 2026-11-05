---
name: xios3-app-design
description: "Design a XIOS/3 application for CloudBackend PaaS so it looks and works like a modern product: a brief and mood board from one sentence, a custom token theme covering every runtime component with a responsive stylesheet after Apple's design principles on a Tailwind-like scale (no component or dialog keeps its default look), Lucide icons, a layout kit (cards, list and detail, phone and desktop views), two small components, a login screen with sign in, sign up and forgot password that stays signed in across reloads, and the data logic behind the screens. Use it whenever someone wants a XIOS/3 or CloudBackend app to look good or modern, asks for a theme, colours, fonts, icons, a brand, a mood board, a responsive or mobile layout, custom components, empty states or status messages, or a first version of the UI; when components look default or users are signed out on reload; at cloudbackend-saas-launch steps 2 and 3; and for any XIOS/3 view that names colours in its markup."
---

# XIOS/3 application design

One sentence about the app is enough to decide its look: who uses it and for what picks a **direction**
(six come with this skill), the direction brings a palette, type and shape, and the runtime's **token
theme** turns those few values into every hover, border and selection. From there the first version is
generated, not drawn: a list with search and an empty state, a detail with the fields to edit, New, Save
and Delete, a status line, and a phone layout. The user sees a mood board before any code, and the code
they get has no colour in it.

Everything here was run on the hosted runtime (2026.6.0) on 2026-10-09, from a webshare, in Chrome at
1280 and 390 px; the dated notes say what was measured. On 2026-11-04 three constructs changed so the package
validates against the CloudBackend extension's schemas (the title inside `<description>`, the brand label
directly in the toolbar rather than in its group, the status component's tag `statusline`); two item attributes the
schemas still refuse (`selected`, `detail`) are with XIOS/3 to settle (`textstyle` and `detailstyle` left the kit on
2026-11-05, when the theme took over the list rows' type). The theme mechanism itself is the manual's
(`references/look-and-feel.md`: the design-tokens tutorial, Theme, Style, Icon protocol). On 2026-11-04 the kit
moved to Lucide icons and its app was re-run on a Development deployment at 1280 and 375 px
(`references/icons.md`, "Measured"). On 2026-11-05 the theme grew to cover every runtime component through `theme.css`,
measured with a gallery of every common component at 375 and 1280 px in a light and a dark direction
(`references/theme.md`, "Measured").

## The first version, in four moves

1. **Brief.** `python3 scripts/designkit.py brief --app "Planboard" --idea "a project board for small
   agencies, where each agency invites its staff" --item project` writes `design/design-brief.md`,
   `design/theme.xml`, `design/moodboard.html` and `design/design.json`. It picks the direction from the
   idea (`--direction` overrides; `--primary #hex` recolours one seed and checks the contrast). Fill in
   the two lines the script leaves open in the brief: the audience, and the one job of a visit.
2. **Show, ask once.** Open the mood board (or describe it: direction, three tone words, the primary colour,
   the type) and ask one question: "This look, or another direction?" Offer the two nearest directions.
   That is the only design question a first version needs; everything else has a default the brief states.
3. **Generate.** `python3 scripts/designkit.py app --design design/design.json --items
   "home://Planboard/Projects" --out app` writes the manifest with the theme, the desktop and phone views,
   the process, the detail stylesheet, the kit's two components and sample data. Add `--sample
   home://Applications/planboard/data/items.xml` to run on the sample records before the app's data container exists (it still needs a signed-in tenant session:
   `home://` is the signed-in identity's drive).
   Nothing in the output is a placeholder; `references/layouts.md` says what each file is for.
4. **Upload and open.** The files go to `home://Applications/<app>/`, each sub-folder (`views/`, `processes/`,
   `xsl/`, `styles/`, `ui/DesignKit/`, `data/`) as a container of its own: create the folders first, then upload
   each folder's files into it (xios3-app-basics `references/deployment-pipeline.md`, "Folders first", has the CLI
   commands and the console route). The app opens from Projects. First run creates the
   container if it is missing, so a new identity lands on the empty state, not on an error.

**Without a shell** (Claude Desktop, claude.ai): do move 1 by hand from `references/design-brief.md` (section 4)
and `assets/directions.json`, describe the mood board in five lines instead of opening it, and do move 3 by
writing out `assets/example/` with the placeholders filled in (`references/layouts.md` lists them per file). The
user adds the files through the console's Projects section (or the VS Code / Cursor extension). The result is the same.

Then iterate with the user on the running app: a field, a screen, a second kind of record. The skill
`xios3-app-basics` has the component reference; this skill keeps the look consistent while you add.

## The theme: seeds, knobs, derived, and every component

Always give the app a custom theme that covers every component; never leave a runtime component on its default look.
It has two parts, both written by `designkit.py`: the token theme in the manifest, and the kit's stylesheet
`ui/DesignKit/theme.css`, which the theme's view component loads into every view. Only some runtime components follow a
token theme on their own (panel, label, toggle, slider, accordion, date, menus and dialogs, among others, keep a legacy
look), so the stylesheet styles all of them from the theme's values: Apple's principles (the system type, quiet surfaces,
one accent, soft depth, a translucent top bar, 44 px touch targets) on a Tailwind-like scale (a 4 px grid, breakpoints at
640 and 1024 px), responsive, with reduced motion respected. `references/theme.md` has the coverage measured, the
runtime's `--xc-*` hooks the stylesheet sets, the responsive rules and how to extend it.

A token theme is a `<theme name="…" tokens="true">` in the manifest, above the view:

- **Seeds** in `<colors>`: `primary`, `secondary`, `tertiary`, each with its `on-` text colour;
  `background`, `surface`, `on-surface`; `error`, `on-error`; and `lightIcon`, `darkIcon`, `grey` for the
  icon manager. The script checks every `on-` pair at 4.5:1 or better.
- **Icons** in `icon="lucide"` on the `<theme>`: it selects the Lucide collection the runtime ships, outline icons
  under a licence an app may publish on its own domain (`references/icons.md`).
- **Knobs** in `<tokens>`: `font-sans`, `font-display`, `font-mono`, `text-xs|sm|md|lg|xl`, `weight-normal|medium|bold`,
  `leading-tight|normal|body`, `tracking-label`, `space-1` to `space-6` (the 4 px grid), `control-height` (the density
  dial: 36 to 44 px), `control-pad-x`, `control-gap`, `radius-sm|md|lg`. The element name is the token
  name: `radius-md` becomes `--xios-radius-md`, readable from any CSS of your own.
- **Derived**: hovers, borders, the selection tint, muted text. You never write them. A hex in a view is
  the one value that stops following the theme, so there are none: the one exception is the list icons' colour,
  written without `#` (below).
- `<components>` lists every component with `look="token"` (all 32 in `assets/directions.json`, not only the ones
  used: a dialog brings its own buttons), the view component as
  `<view look="token"><style href="ui/DesignKit/theme.css"/></view>`, and `<spinner>` carries an SVG, or every list load
  costs a 404. `designkit.py check` fails on a missing component or a missing stylesheet.

Rules that hold the look together: a row of buttons is a panel with `class="dk-wrap"`, so it wraps on a phone instead
of running off the screen; panels are cards with `class="xios-card"`; labels use
`class="xios-type-label"` (small uppercase) and `xios-type-caption`; icons are Lucide, each written
`icon://<name>?look=lucide&color=<colour>` with the colour by where it sits: the `on-` colour on a filled button
(`on-primary`; Delete is a `class="xios-color-danger"` button with `on-error`), `primary` on a toolbar or a card,
and inside an `iconlist` the primary seed written out (`color=4338ca`), because a list resolves colour names
against the platform's theme. `references/icons.md` has the names by role and the reasons; `designkit.py icons
app` checks them. Type in render stylesheets uses the kit's
classes (`dk-h1`, `dk-eyebrow`, `dk-body`, `dk-muted`, `dk-pill`), which read the theme's variables.
To rebrand, change `primary` (and `darkIcon` with it) and run `app` again, which rewrites the list icons' colour;
a dark look is the `night` direction, not a toggle.

## Layouts: one name, one file per screen size

The manifest declares the view twice with the same name and a `screen=` media query (`phone` is up to
600 px; `(min-width: 601px)` the rest); the runtime renders the one that matches, and the process addresses
`App` either way because every component keeps its name in both files. The phone file stacks: the list
fills the screen, picking a record shows the detail with a Back button, and the navigation is a card the
top bar's Menu button shows. `CA_Screen` tells the process which screen is on (`getValue()` at start, the
`Screen` event on a resize), so the same steps hide the rail on a phone and the Menu button elsewhere.

| Pattern | Use it for | In the kit |
| --- | --- | --- |
| List + detail | one kind of record, read more than written | the example (`assets/example`) |
| Board | records that move between a few states | the manual's Kanban v4 (`references/look-and-feel.md`): one `iconlist` per column, `Drop` moves the object |
| Form | a few fields, one Save | the detail card's edit block on its own |
| Reading | notes, docs: text first | a `render` in a 65-character column (`dk-body`), the `paper` direction |

Panel facts: a view renders only its first top-level panel (the toolbar may sit before it); `type="rows"` and
`type="columns"`; sizes in px, %, `auto` or `fill`; `padding` and `gap` are numbers; a `placeholder` child of
an `iconlist` is the empty state and shows only while the list has no rows.

## The login screen

Every app with a login offers all three ways in: sign in, sign up and forgot password. It uses the runtime's own login
application, which has the CloudBackend PaaS sign-in's shape (the logo above a white card, the fields, one full-width
button, sign-up and reset pages in the same design). `designkit.py app --login` writes the `<login>` element with
`create`, `createPrompt` and `reset` always set, "Log in" and a welcome line, the primary colour on the button and links,
a navy grid page (`login-bg.svg`) and a text-mark logo (`logo.svg`), and wires the manifest: views and process
`onRequest`, the login process first, the desktop view first. `designkit.py login app` checks it.
`<login session="true">` keeps the user signed in across reloads: the runtime then stores the session in the browser for 7
days of use and resumes it, and without the attribute every reload signs the user out. With a kept session the app shows a
Sign out (the example's `signOut` button, which runs the runtime's `system` logout and brings the login screen back);
`designkit.py app --login` writes both and `designkit.py login app` checks them.
`references/login.md` has the element, the settings the manual leaves out (`session`, `button`, `buttonColor`, `linkColor`,
`createPrompt`), what was measured on a deployment (after sign-in the desktop view opens on every screen, so it adapts
to a narrow one), and what is not measured yet: sign-up without the CRM.

## The two components

Declared in the manifest's `<components>` and placed last in the root panel; both are ES modules in
`ui/DesignKit/` with their skins (`screen.xsl`, `status.xsl`) and `designkit.css`.

- **`<statusline name="status"/>`** (`CA_Status`): a bar at the bottom of the window. The tag is `statusline`, not `status`,
  because `status` is a native view element (the schemas refuse it inside a panel; changed 2026-11-04). From a process:
  `callMethod` on `#App#status`, method `notify`, two string params: the text and the kind (`info`, `ok`,
  `error`, `busy`). `info` and `ok` fade after four seconds; `error` and `busy` stay until `clear()` or the
  reader dismisses them (the `Dismiss` event). Every write in the example ends in one line here, in the
  direction's voice (`design.json` → `voice`).
- **`<screen name="screen"/>`** (`CA_Screen`): no visible part. `getValue()` is `phone`, `tablet` or
  `desktop`; the `Screen` event carries the new name as the property `screen` (`{#App#screen%screen}`);
  the body gets `data-screen="…"` for CSS.

Measured 2026-10-09: `callMethod` passes its `param` children to the method in order; the runtime answers
`setProperty("value", …)` by calling the component's `setValue`, so a component must not set that property
from inside `setValue`'s own path (it recursed until the stack overflowed); an external component's module
runs in the window that imports it, where `Component`, `sys` and `CloneObject` are globals; and a dialog
(`confirm`) opens in the top document, not the app's.

## The data logic that goes with the screens

- The list is bound to the container's listing: `bind value="home://Planboard/Projects"` with
  `select="/db:result"`, and a `rule match="db:object"` draws each row from `@name` and `@updated`.
- Picking a row gives the process the object's address, `{#App#items#@xlink:href}`; the detail render is
  bound to that document with `select="/"`, each field with `select="/item/title"` and so on. Typing in a
  field changes the render at once: both are bound to one document.
- The process writes, never the view: New is a `confirm` of type `input`, then `database` `create` with the
  content; Save is `change` (`store … type="replaceText"`) per field, then `save`; Delete asks with a
  `confirm` of type `confirm`, then `database` `delete`. Object names come from the title with the
  forbidden characters removed (`translate()`), with `rename="true"` for collisions, so names read in the
  list; the date goes inside the document.
- Sample mode (`--sample`) binds the list to a sample listing and makes New append a row in memory,
  Save change the document on screen, Delete say it needs a tenant. The same process, one alias.
- Per-user data lives on `home://`, shared data on `tenant://`; which one is a step-1 decision in
  `cloudbackend-saas-launch`. `references/data-logic.md` has the markup for each of these.

## Before you hand it over

- `python3 scripts/designkit.py check design/theme.xml`: contrast, `tokens="true"`, the spinner, every component
  `look="token"`, and the view component loading `ui/DesignKit/theme.css` (which must be in the package).
- With a login: `python3 scripts/designkit.py login app`: sign in, sign up and forgot password, the texts, the logo
  and page, the wiring, `session="true"` and a visible Sign out.
- `python3 scripts/designkit.py icons app`: every icon a Lucide name with `look=lucide` and a colour (the `on-`
  colour on a filled button, the seed written out inside a list).
- No hex in any view or stylesheet of the app (`grep -n '#[0-9a-fA-F]\{3,6\}' app/views app/styles`).
- Every state has words: the first run, the empty list, after a save, after a failure (the voice).
- The phone layout at 390 px: nothing scrolls sideways (rows of buttons are `dk-wrap`); Back returns to the list; the top
  bar keeps its buttons; a dialog opens inside the screen.
- The brief and the mood board are in the project (`design/`), and the user said yes to the direction.

## Bundled

- `references/design-brief.md`: the recipe behind `brief`: how a direction is picked, the brief's template, what to change by hand.
- `references/layouts.md`: the example's files one by one, the four patterns, the phone rules.
- `references/data-logic.md`: the bindings and the writes with their markup; sample mode.
- `references/login.md`: the login screen with all three ways in: the element, the settings, the wiring, what was measured.
- `references/theme.md`: the theme that covers every component: why a token theme alone is not enough, the runtime's hooks, the principles, the responsive rules, dialogs and the login screen, what was measured.
- `references/icons.md`: Lucide through the icon protocol: the theme, the look and colour rules, the names by role, what was measured.
- `references/look-and-feel.md` (generated from the manual): the design-tokens tutorial, Theme, Style, Icon protocol.
- `assets/directions.json`: the six directions. `assets/example/`: the first version. `assets/ui/DesignKit/`: the components and `theme.css`. `assets/lucide-names.txt`: the runtime's Lucide names.
- `scripts/designkit.py`: `brief`, `app` (with `--login`), `check`, `login`, `icons`, `moodboard`. Standard library, no network.

## Version and updates

This is version 2026.11.5.9 of the xios3-app-design skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin (`claude plugin marketplace add rbcbe2025/expcbe`, then `claude plugin install cloudbackend@cloudbackend`)? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

Once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json. When its `skills[].version` for `xios3-app-design` is newer than 2026.11.5.9, tell the user once, in one sentence, and give them the download (the `file` listed next to it). Do not interrupt the task for it.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fxios3-app-design%2F2026.11.5.9&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fxios3-app-design - it records the skill's name and version and nothing else. Never send it without that agreement.
