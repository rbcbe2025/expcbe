# The project layout, what ships, and the document templates

Hand-written, 2026-11-04. The manual describes inline and advanced packaging (xios3-app-basics
`references/getting-started.md`); this page fixes one layout for the workflow so every tool, agent and
template agrees on where a file is, and records which files may be inside the deployed container.

## The project on disk

```text
<project>/
├── cloudbackend-launch.md     the shared context file (never deployed)
├── app/                       mirrors home://Applications/<app>/ (or tenant://…); this is what uploads
│   ├── index.xml              the manifest: <application> with <settings>, <about version="…">, <resources>,
│   │                          then <view xlink:href="views/…" xlink:actuate="onRequest"/> and
│   │                          <process xlink:href="processes/…"/>; the login process first when there is one
│   ├── views/<Screen>.xml     one view per screen; the same view name in the desktop and the phone file
│   ├── processes/process.xml  triggers, steps, operations; <script href="scripts/<name>.v1.js"/> for JavaScript
│   ├── scripts/               JavaScript-as-steps modules, file names versioned (v1, v2 …)
│   ├── data/<Kind>.xml        seed documents (kept on redeploy; a 409 means "already there")
│   ├── layout/                CSS and XSL: one scoped token block with literal values and a font-family
│   ├── ui/<Comp>/             a custom component: CA_<Comp>.js, <Comp>.xsl, <Comp>.css
│   ├── images/, locale/       assets; the locale file for texts
│   ├── llms.txt               what the app is, for answer engines (see seo-geo-on-a-webshare.md)
│   └── docs/manual.md         the user manual, public by design
├── design/                    the design kit's brief, theme.xml, moodboard.html, design.json
├── docs/spec.md               the solution spec (W1)
├── docs/README.md             run, structure, deploy (W7)
├── docs/api.md                the app's data surface (W7)
├── docs/agent-notes.md        notes for the next assistant, or a project skill stub (W7)
├── docs/benchmark.md          the benchmark block and the cited reference table (W9)
├── tests/ui-probes.md         the probe list with its last-pass date (W5)
└── evidence/                  screenshots and read-back output per phase
```

**What may be inside `app/`.** A webshare serves every file in the deployed container to anyone who
knows the address, before and after the login screen. So: the manual and `llms.txt` may ship there
(they are public by design); the spec, the notes, the tests, the evidence, the design brief and the
context file stay outside. Nothing that names a person, a key, an internal host or a price that is not
public goes into `app/`. Lint rule G12 refuses key-shaped strings; the security checklist covers the rest.

**Names.** The deployment name is lowercase letters and digits only, because it becomes part of the host
name, and it must not begin with `xios`: the host's `robots.txt` disallows every path beginning with
`xios`, and a deployment prefix inherits that (measured on the developer portal, 2026-09-27). View files
are never named `view.xml` (G02). Component names are the names the spec gives them; triggers and
expressions address components by name (G19).

**The runtime is never shipped.** `deploy` writes an `index.html` that boots the hosted runtime from the
host, and a `.types.xml`. Treat `index.html` as the tool's file: a custom boot page is overwritten on the
next deploy. Titles, descriptions and the texts an answer engine reads go into `<about>`, the view titles
and `llms.txt`.

## Template: `docs/spec.md`

```markdown
# <App> — solution spec (v1)
Updated <date>. One page. The user says yes to this before the design starts.

## What it is, for whom
<one sentence> · customers are: individuals | organisations (one group each)

## v1 features (the rest is v2)
1. … 2. … 3. … 4. …   | v2: …

## Screens and components (names are the names in the markup)
| Screen | Components | Phone layout |
| List | taskGrid, newButton, filterInput | list, then detail with Back |
| Detail | titleInput, dueInput, statusSelect, saveButton, deleteButton | full width |

## Data
| Kind | Fields (name: type) | Scope | Container |
| task | title: text, due_on: date, status: open|done | per user | home://<App>/Tasks |
Datatype: <Kind>.xdt (reserved key names avoided). Control query: <which filter must be proved>.

## Roles and access
<who can read what; ACLs granted to roles and groups, never to individuals>

## Channels (integrations, AI)
| Channel | Provider | Proxy pinned to | Key | Spend limit |
none in v1

## Login, sign-up, analytics, SEO and GEO
login: yes|no · sign-up: CRM | manual · analytics: none | <endpoint> · public surface: yes|no; llms.txt

## Security and legal baseline
no secrets in app/; EULA and privacy text; account deletion path; data location statement

## Documentation plan
README, manual (one section per screen), api.md; agent notes

## UI probes (action → expected state)
1. open / → the list shows N rows and the New button
2. click newButton → the detail opens with empty fields
3. type title, click saveButton → the list shows the new row; read back data/…

## Pricing
free v1 | invoice | price plans at launch step 6
```

## Template: `docs/README.md`

Sections: What it is · Run it (the Development address; a private window for test identities) · Structure
(the tree above, one line per folder) · Deploy (lint, upload, deploy, verify; the console steps for
promotion) · Where the context file is · Version (the `<about version>`).

## Template: `docs/manual.md`

One section per screen, in the order a user meets them. Each section: what the screen is for, every
control by its visible label, the words for every state (empty, loading, saved, error, offline), and
what is written where. The sections equal the probe list in `tests/ui-probes.md`; when they differ one of
the two is wrong.

## Template: `docs/api.md`

```markdown
# <App> — the data surface
The application's API is its data: containers, documents and datatypes in the CloudBackend database,
reachable over the REST API with the user's own session.

| Container | Datatype | Who reads | Who writes | REST cards |
| home://<App>/Tasks | task.xdt | the owner | the owner | the containers, documents and query cards (cloudbackend-rest-api) |

A deployed application reaches the API without stored credentials through the runtime's own request
method (see ai-and-integrations-via-proxy.md, "The API from a deployed app"). External services are
reached through proxy channels, never directly.

An MCP server over this data would be a separate codebase, written with the cloudbackend-rest-api skill
against these cards; it is *planned*, not part of the deployment.
```

## Template: `tests/ui-probes.md`

```markdown
# UI probes — last pass <date> <UTC>, <client/browser>, Development <url>
Rules: a fresh browser context; trusted clicks only; one assertion after each action; desktop then 390 px.

| # | Action | Expected state | Result | Evidence |
| 1 | open / | list with N rows, New visible | pass | evidence/probe-1.png |
```

## Template: `docs/agent-notes.md`

What the next assistant must know in ten lines: the context file's location, the connectors to add, the
one decision that was hard, the probe that failed once and why, what is v2. Or, in Claude Code, a project
skill stub (`.claude/skills/<app>/SKILL.md`) with the same ten lines and a pointer to this workflow.
