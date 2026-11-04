---
name: xios3-app-workflow
description: "Run the build-and-deploy workflow for a XIOS/3 application on CloudBackend PaaS, from an idea to a verified deployment and a benchmark report: an opening round and a plan card of defaults, a solution spec, the design hand-off, the data model, a scaffolded package built with sub-agents, a tenant-grammar lint before every upload, a Development deployment verified by content, UI probes in the browser, hardening (security, the login gate, SEO and GEO, analytics, clean-up), documentation and a manual, the console hand-off for Staging, Production and a domain, and a benchmark block that says what was measured. Shares cloudbackend-launch.md with cloudbackend-saas-launch. Use it whenever someone wants to build, ship, test, harden, document or benchmark a XIOS/3 app, asks how to go from an idea to a live URL, mentions the deploy connector, upload_project, deploy, lint, Lighthouse, llms.txt, sub-agents or a React comparison, or when cloudbackend-saas-launch reaches step 2 or the Development deployment of step 7."
---

# XIOS/3 application workflow

This skill runs the loop from an idea to a deployed, verified, documented and measured XIOS/3 application
on CloudBackend PaaS. The knowledge lives in the owner skills; this skill decides what comes next, keeps
the evidence, and asks as little as it can. It is the build-and-ship half of the launch path that
`cloudbackend-saas-launch` compresses into "2 Application" and the Development deployment of "7 Deploy":
it never redoes a launch step, it calls it. Do not restate what an owner skill says — open it.

Five words carry every claim this workflow makes, and every output uses them: **measured** (this app,
this run, dated, the tool named), **reference** (another app, cited), **planned** (not built), **console**
(exists only as a click path in the CloudBackend PaaS console; no API today) and **not on this client**
(the tool the phase needs is not connected here).

## Companion skills

| Phase | Owner skill | Open in it |
| --- | --- | --- |
| W0 Open | cloudbackend-saas-launch | SKILL.md "Asking the user"; `references/launch-path.md` "Pre-flight" |
| W1 Spec | this skill | `references/project-layout.md` (the spec template), `references/security-legal-checklist.md` (baseline rows), `references/ai-and-integrations-via-proxy.md`, `references/seo-geo-on-a-webshare.md` |
| W2 Design | xios3-app-design | SKILL.md "The first version, in four moves"; `references/layouts.md`, `references/data-logic.md` |
| W3 Data | cloudbackend-saas-launch → singularity-database | `references/launch-path.md` step 1; singularity-database `references/datatypes.md`, `references/measured-on-a-tenant.md` |
| W4 Build | xios3-app-basics | `references/views.md`, `references/processes.md`, `references/recipes.md`, `references/javascript-as-steps.md`; this skill's `references/tenant-grammar.md` and `references/deploy-rules.md` |
| W5 Verify | this skill | `references/verification-checklist.md`; xios3-app-basics "Pitfalls" for the repair order |
| W6 Harden | this skill | `references/security-legal-checklist.md`, `references/seo-geo-on-a-webshare.md`, `references/ai-and-integrations-via-proxy.md`; xios3-app-basics "Pitfalls measured on the hosted runtime" |
| W7 Document | this skill | `references/project-layout.md` (the document templates) |
| W8 Ship | xios3-app-basics, cloudbackend-saas-launch | `references/deployment-pipeline.md` (the click path and the logo rule); `references/launch-path.md` step 7 and its check |
| W9 Report | this skill | `references/benchmark-method.md`, `references/benchmark-baseline.md` |
| Login, sign-up, teams, price plans, after launch | cloudbackend-saas-launch | steps 3, 4, 5, 6 and 8 of `references/launch-path.md`, run there, not here |

If a companion is not installed, say which one and that it comes from the CloudBackend developer portal's
Tools page (https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud); continue from the bundled references in the meantime. When the same skill is
installed more than once, compare the version in each copy's "Version and updates" section and read the
newest.

## The context file

One file for the build and the launch: `cloudbackend-launch.md` at the root of the user's project, or in
the conversation when there is no file system. Read the whole file first in every session; create it after
the opening round. `cloudbackend-saas-launch` owns the header bullets and `## Progress`; this skill owns
`## App`, `## Build` and `## Benchmark`; both append to `## Decisions`, every line stamped with the time and
its zone, UTC by preference. Never keep a second file: two journals drift, and the launch skill reads this
one to decide which step is next.

```markdown
# CloudBackend launch context
- tenant: acme
- developer identity: emmadev
- app: tasktrack (home://Applications/tasktrack/index.xml)
- what it does: a task tracker for freelancers; one person, their own tasks, due dates, a done list
- customers are: individuals
- deployment name: tasktrack
- branches: sign-up: manual | payment: invoice   (pre-flight: no CRM, no Price plans)
- files reach the tenant via: upload_project (deploy connector)
- client: Claude Code; browser tool: yes; sub-agents: yes

## App
- v1: list, detail, New/Save/Delete, Done toggle; v2: reminders, tags, sharing a list
- record: task — title (text), due (date), status (open|done); scope home://TaskTrack/Tasks
- screens: list + detail (desktop); list, then detail with Back (phone); direction: studio
- login: yes (manifest login; configurator at W8); sign-up: manual (branch)
- channels: none in v1 (an AI summary is v2, through a proxy, with its cost model written then)
- seo/geo: behind login, so no public surface; llms.txt and the about title only; analytics: none
- runtime: pinned (the console's default); deployment prefix "tasktrack" ok (not xios*)
- benchmark: measured + reference; react twin: off

## Progress
- [x] Tenant  - [x] 1 Data model  - [~] 2 Application (→ Build)  - [ ] 3 Login  - [deferred: CRM] 4 Sign-up
- [ ] 5 Teams and roles  - [deferred: Price plans] 6 Price plans  - [ ] 7 Deploy

## Build
- [x] W0 open — plan card 2026-11-04 09:02 UTC; client Claude Code; deploy connector yes; browser yes
- [x] W1 spec — docs/spec.md: 4 features, 3 screens, 1 kind (task, 3 fields) · user yes 09:14 UTC
- [x] W4 build — lint build 0E/2W (G10 font-family added; G15 n/a); upload 14 files ok; deploy dev https://acme-emmadev-tasktrack.cloudbackend.cloud 10:12 UTC
- [ ] W8 ship — unverified: Shared, Staging and Production are the user's clicks; verify after each

## Benchmark
(the block `references/benchmark-method.md` describes; one Source value per row)

## Decisions
- 2026-11-04 09:50 UTC datatype key named due_on because date is reserved (singularity-database, measured-on-a-tenant)
```

Evidence lines have one shape: `W<n> <name> — <tool or check> <result> · <who confirmed> <UTC>`. A phase is
ticked only when its check passed **and** its line is in the file; until then say it is unverified. A
phase that cannot run on this client or this tenant is ticked *deferred* with the reason, never as done.

## Asking the user: one round, then defaults

The opening round is at most three questions, each with a suggested answer, and none the prompt or the
context file already answered:

1. The app in one sentence, and for whom (if the prompt did not say).
2. The tenant's name, or "none yet" (then `cloudbackend-saas-launch` takes over until the tenant exists).
3. What is connected here: the deploy connector (`cloudbackend-deploy`), the docs and build connectors, a
   browser tool, sub-agents. Say what each absence costs in one line; do not stop for it.

**The plan card goes in the same reply**, eight lines the user reads in a minute, each a decision and its
reason, ending with "reply to change any of these; otherwise I go on":

- the kind of app and who its customers are (individuals on `home://` or organisations in groups)
- the one kind of record v1 keeps, its three fields, and the screens (list, detail, New)
- the look: the direction xios3-app-design picks from the idea
- login and sign-up: login yes/no; the pre-flight's branch for sign-up (CRM or manual)
- channels: none, unless the idea needs an integration or an AI call; then which, through a proxy
- SEO and GEO stance and analytics: public surface or behind login; `llms.txt`; analytics none or an endpoint
- deployment name (lowercase letters and digits, not beginning with `xios`), runtime pinned, Development first
- benchmark: measured on this app plus the reference baseline; React twin off

After that, at most one question per phase, and only where a default would be wrong or cannot be undone.
The questions a phase may ask are listed with the phase. Everything else takes the plan card's default,
said in one line so the user can correct it.

## The phases

Keep the order unless the user has a reason: the spec shapes the design, the data shapes the views, a
lint precedes every upload, a deployment is verified by content before anyone tests it, and the console
hand-off comes after hardening. Deploy a throwaway early, at W4, as soon as the first list binds: the
wizard's verifier, the address rules and the login gate only show from a deployment.

### W0 Open

Read `cloudbackend-launch.md`. Run the opening round and the plan card. Write `## App` and `## Build`. If
the deploy connector is connected, call `list_projects` once: it proves the connector and the tenant in
one call, and its failure turns "files reach the tenant via" into the console (see `references/deploy-rules.md`,
"Without the connector"). Open `cloudbackend-saas-launch` for the pre-flight if the context file has no
`branches:` line yet.
Gate: the plan card was sent; silence is a go. Evidence: `W0 open — plan card <UTC>; client <name>; deploy connector yes|no; browser yes|no`.

### W1 Spec

Write `docs/spec.md` from the template in `references/project-layout.md`: v1 features against v2, the
screens, every component by name, the kinds of record with fields and scope, roles and the ACL plan,
channels (integrations, AI calls), analytics, the SEO and GEO stance, the security and legal baseline,
the documentation plan, the UI probe list, and the pricing line. The spec is short: a page the user reads
before saying yes. One question, skipped when the plan card settled it: "v1 is these N features; the rest
is v2 — yes?"
Gate: `docs/spec.md` exists and the user said yes. Evidence: `W1 spec — docs/spec.md: N features, N screens, N kinds · user yes <UTC>`.

### W2 Design

Hand the spec to `xios3-app-design` and run its four moves: the brief, the mood board, the token theme,
the layouts for desktop and the 390 px phone. Its one question is the direction ("this look, or another?").
With a shell, `scripts/designkit.py` does the work; without one, the design skill says what to do by hand,
and the build connector's `scaffold_project` produces the same first version from the spec at W4.
Gate: the design skill's hand-over checklist. Evidence: `W2 design — direction <name>; design/ N files · user yes <UTC>`.

### W3 Data

Run step 1 of `references/launch-path.md` exactly as `cloudbackend-saas-launch` runs it: the datatype,
the containers, ACLs granted to roles and groups, the seed documents under `data/`, and a control query
when the app filters. The owner-only actions are the user's; give exact console paths. No question: home
against tenant scope was a plan-card line.
Gate: the launch path's step-1 check. Evidence: `W3 data — <datatype> in tenant://Settings/Datatypes; ACL <summary>; control query <result|n/a> · user confirmed <UTC>`.

### W4 Build

1. `scaffold_project` (build connector) from the spec, or the design kit's `app` output: the advanced
   package of `references/project-layout.md`.
2. Author the views and the processes against that scaffold. With sub-agents, the view author and the
   process author run in parallel on separate files, then the grammar reviewer reads the whole package;
   without them, write in the order data → view → process and run the reviewer's checklist yourself
   ("Running without sub-agents", below).
3. `lint_project` with profile `build` before **every** upload. Zero errors is the gate; warnings are
   recorded with their rule ids. `references/tenant-grammar.md` says what each rule means and the fix.
4. The throwaway deploy, as soon as the first list binds: `upload_project` with `validate` on, then
   `deploy` from `home` (a private Development deployment). `references/deploy-rules.md` says what the
   two calls do, what a 409 on a seed means (kept, correct), and the rules for pushing files without the
   connector.
One question, only when the spec lists a channel the plan card left open: "the provider for <channel>?"
Gate: lint 0 errors, upload validated, deploy returned a URL. Evidence: `W4 build — lint build 0E/nW (<ids>); upload N files ok; deploy dev <url> <UTC>`.

### W5 Verify

1. `verify_deployment` (deploy connector): the served files against the stored ones by checksum, the
   login gate as the pipeline document and the manifest state it, `llms.txt` real or the fallback page.
   "Live" is claimed from `index_xml_match` being true, never from a 200: a webshare answers 200 with the
   boot page for every unknown path.
2. The UI probes in `tests/ui-probes.md`, in the browser when one is connected: a fresh browser context,
   trusted clicks, one assertion after **each** action, the 390 px pass, the console and the network read
   after each probe. `references/verification-checklist.md` has the probe format and the repair loop
   (console error → trigger spelling → expressions → the panel; a CloudBackend call matched to its REST card
   in the Chrome extension's DevTools panel).
3. Write-back checks: every document the app writes is read back (`read_project_file`, or the CLI's `cat`)
   before a write is believed.
4. Lighthouse, mobile, one route at a time, a fresh profile: from a shell with Chrome installed, or run by
   the user and pasted in (marked *user-run*), or "not run".
No question, except "paste the Lighthouse numbers" when nothing here can run it.
Gate: `index_xml_match` true; every probe passed with its assertion; 0 console errors on the probed routes;
Lighthouse recorded or "not run". Evidence: `W5 verify — verify_deployment match=true N/N, gate=<verdict>; probes N/N (390 px pass); console 0 errors; Lighthouse <scores or not run> <UTC>`.

### W6 Harden

Walk `references/security-legal-checklist.md` row by row (no secrets in the container, proxies pinned to
a domain, a path and headers with a key of their own and a spend limit, ACLs to roles and groups, the
EULA and privacy texts, an account-deletion path, the data-location statement, analytics consent). Re-verify
the login gate: private visibility is not authentication, and the themed login page is not access
control — the gate is the pipeline's login configuration plus the stamp in the served manifest, and a
redeploy can drop it. Apply `references/seo-geo-on-a-webshare.md` (what a webshare can and cannot do for
crawlers and answer engines) and the analytics section of `references/ai-and-integrations-via-proxy.md` if
an endpoint was named. Then `lint_project` with profile `ship` for the clean-up rules (ASCII files, no hex,
one token block with an explicit font, XSL `for-each` over node sets, no icon font, the prefix rule).
Note the runtime pin in `## App`.
One question, if not on the plan card: "analytics: none, or your endpoint?"
Gate: lint ship 0 errors; the gate verdict matches the spec; the checklist rows are ticked. Evidence: `W6 harden — lint ship 0E/0W; login_gate <verdict>; llms.txt <real|n/a>; analytics <none|endpoint> <UTC>`.

### W7 Document

From the templates in `references/project-layout.md`: `docs/README.md` (run, structure, deploy),
`docs/manual.md` (one section per screen with the words for every state, so its sections equal the probe
list), `docs/api.md` (the app's data surface: containers, datatypes, ACLs, the REST cards that read them,
how a deployed app reaches the API without stored credentials, and the honest line that an MCP server for
the app's data is a separate codebase, *planned*), `docs/agent-notes.md` or a project skill stub for the
next assistant, and `tests/ui-probes.md` with its last-pass date. The context file's `## Decisions` is the
memory; the documents cite it, they do not copy it. The manual and `llms.txt` may ship inside the
container, because a webshare serves everything in it; the spec, the notes, the tests and the evidence
stay outside.
Gate: the three documents exist and the manual's screens equal the probe list. Evidence: `W7 document — README, manual (N screens, N states), api.md (N containers, N cards), probes dated <UTC>`.

### W8 Ship

Promotion, the login configurator and a domain are **console** today: hand them over with the exact click
path from `references/deployment-pipeline.md` (Make Public → Promote to Shared → Mark Verified → Promote
to Staging → Configure Login Page with the logo as `https://` + the Staging host + `/logo.svg` and the EULA
box → Mark Verified → Promote to Production → Connect Domain with the `A` record the launch path names).
After **each** promotion run `verify_deployment` on the new host: the content, and the gate, because a
promotion that drops the login configuration serves the app open. Write the customer's address card: the
Production address or the domain, never the console's. When a browser tool drives the console, each action
that changes the tenant gets its own yes, and Deploy Anyway a fresh one, as `cloudbackend-saas-launch`
says.
One question: "domain: none for now, or yours?"
Gate: the launch path's step-7 check, plus `verify_deployment` on Production with `index_xml_match` true and
the gate as specified. Evidence: `W8 ship — Production <url>; verify match=true gate=<verdict>; domain <none|name> · user confirmed <UTC>`.

### W9 Report

`benchmark_project` (build connector) over the package, with the client fields this client can supply:
tokens and cost from Claude Code's `/cost` (or "not available on this client"), active minutes from the
context file's timestamps, the Lighthouse and timing rows from W5 and W6. The tool returns the block with a
Source value on every row; `references/benchmark-method.md` says how each row is obtained and worded, and
`references/benchmark-baseline.md` is the reference table to cite beside it, never merged into it. Write
the block into `## Benchmark` and `docs/benchmark.md`. Then hand over: steps 4, 5 and 6 of the launch
path if they are pending, and step 8.
One question: "build the React twin for a like-for-like row? About twice the tokens and an hour; default no."
Gate: every row has a Source; no comparison row exists without a twin measured on the same spec. Evidence: `W9 report — benchmark N rows (N measured, N reference, N not on this client); twin: not built <UTC>`.

## Credentials: never

Never ask for, accept or repeat a password, referral code, session token or API key; the user signs in to
the console themselves, and the deploy connector signs them in through its own OAuth page, so this skill
never sees a token. Identities and sign-ins are the user's, in a private window. A browser action that
changes the tenant gets its own yes at the time. The full rule, with the reasons, is in
`cloudbackend-saas-launch` "Credentials: never"; it applies here unchanged. If the user pastes a secret,
tell them to change it, and do not use it.

## Clients and tools

| Client | Has | The workflow here |
| --- | --- | --- |
| Claude Code (terminal or desktop) | the file system, sub-agents, a browser tool, `/cost`, a shell | every phase as written |
| Claude Desktop | the plugin's connectors; no shell, no file system, no browser | the context file and the documents live in the conversation; W5's probes are a checklist the user runs; sub-agents become inline checklists |
| claude.ai | the plugin's connectors | the same as Claude Desktop |
| Cursor, VS Code and other agents | the connectors by URL, the skills as files | every phase; sub-agents and browser tools as the client has them |

The connectors the CloudBackend plugin declares, and what each gives this workflow:

| Connector | Tools | Used at |
| --- | --- | --- |
| `cloudbackend-docs` (https://mcp.cloudbackend.com/docs, no sign-in) | `cloudbackend_docs`, `cloudbackend_rest`, `cloudbackend_rest_list`, `cloudbackend_sdk`; the XIOS/3 lookups `xios3_component`, `xios3_operation`, `xios3_function`, `xios3_method`, `xios3_event`, `xios3_action`, `xios3_concepts`, `xios3_list`, `xios3_icons` | W1, W4, W7: a card by name; when it and a bundled reference disagree, the portal page decides |
| `cloudbackend-build` (https://mcp.cloudbackend.com/build, no sign-in) | `lint_project`, `scaffold_project`, `benchmark_project` | W2, W4, W6, W9 |
| `cloudbackend-deploy` (https://mcp.cloudbackend.com/mcp/<tenant>, the user's own tenant, OAuth sign-in) | `list_projects`, `list_project_files`, `read_project_file`, `list_deployments`, `upload_project`, `deploy`, `lint_project`, `verify_deployment` | W0, W3, W4, W5, W8 |

The deploy connector is per tenant, so the plugin does not add it for you: in Claude Code run the plugin's
`scripts/connect-deploy.sh <tenant>`, or `claude mcp add --transport http cloudbackend-deploy
https://mcp.cloudbackend.com/mcp/<tenant>`; in claude.ai or Claude Desktop add that URL as a custom
connector; the sign-in page is the tenant's own. A tool result is at most about 150,000 characters and a
call at most 240 seconds on claude.ai, so lint and verify sample and page; never send a whole package to a
lookup tool.

Read before you write (what the console's Projects and Deployments sections show, `list_projects`,
`list_deployments`); say what a write will change before it happens (which project, which files, which
stage; an upload replaces by path); verify after (by content, never by status); cite what you used, with
its public link.

## Sub-agents, and running without them

The plugin ships five sub-agent definitions for clients that run them. Each has one job and one boundary:

| Agent | Does | Never |
| --- | --- | --- |
| `xios3-view-author` | views from the spec and the theme, every component named, no hex, no raw HTML | touches a process, uploads |
| `xios3-process-author` | processes and JavaScript-as-steps modules against the view names; writes only through process operations | touches a view, uploads |
| `xios3-grammar-reviewer` | `lint_project`, then what a tool cannot judge (words for every state, a guard's logic, the probe list against the screens); a findings table | edits a file |
| `xios3-ui-tester` | the probes in the browser with the three probe rules; pass/fail with evidence per probe | signs in as an identity, changes the tenant |
| `xios3-benchmark-reporter` | `benchmark_project`, the block, the reference table with its citation | a comparison row without a measured twin, an estimate |

Without sub-agents, run the same five bodies as checklists, in the order view → process → review → test →
report; the deterministic halves (`lint_project`, `verify_deployment`, `benchmark_project`) are the same
hosted tools on every client, so the result is the same.

## Deterministic checks are tools

`lint_project` runs before every upload (profile `build`) and before shipping (profile `ship`);
`verify_deployment` runs after every deploy and every promotion; `benchmark_project` runs once at W9. This
skill never re-implements a rule a tool checks; it explains the finding, fixes the file, and runs the tool
again. When a connector is not here, the same rules are in `references/tenant-grammar.md` and
`references/verification-checklist.md` as a checklist, and the evidence line says *checked by hand*.

## The mistakes this workflow exists to prevent

Each with the rule or tool that catches it:

- Markup that passes locally and fails on the tenant: the tenant's verifier is strict where a local runtime
  is loose (`version` on `<about>` not `<process>`, `call value=` not `step=`, XPath functions outside the
  allowed set) — G01, G03, G04.
- A view file named `view.xml` — G02. The tenant's view dialect flattens `<select>`, `<option>` and `<a>`;
  raw HTML belongs in listview XSL — G05. A process with `<script href>` and no `<step id="start">` — G06.
- An external call with `fetch` instead of a proxy channel and `callService` — G11; a key in the package —
  G12; a public share has no `home://` drive, so an unguarded create there shows a modal error — G13.
- "It is live": every path answers 200 with the boot page, so only `index_xml_match` proves it; a
  publish-then-load race can cache that boot page as a view, so compare checksums before loading.
- "It is private, so it is secure": private visibility is not authentication, the themed login page is
  not access control, and a redeploy or a scripted promotion can drop the gate — `verify_deployment`'s
  `login_gate` after every change.
- A share bound to `home://` never refreshes from a tenant-target upload; a stuck slug is taken for good,
  so a new slug — `verify_deployment`'s `slug_bound_to`, `references/deploy-rules.md`.
- A 409 on a seed treated as a failure and `Data/` deleted: the deployer keeps existing seeds on purpose —
  `references/deploy-rules.md`.
- UI tests that pass for the wrong reason: synthetic clicks, a reused tab, an end-state loop — the three
  probe rules in `references/verification-checklist.md`.
- A theme that drifts: more than one token block, derived values, no `font-family` (the default face is a
  serif) — G10. A 3 MB icon font for forty icons — G15. XSL `apply-templates` over a large node set —
  G14.
- SEO promises a webshare cannot keep (true 404s, prerendering) — `references/seo-geo-on-a-webshare.md`.
- A comparison with React that nobody measured — the wording rules in `references/benchmark-method.md`.

## Bundled references

Hand-written, measured and dated where the manual is silent:

- `references/project-layout.md` — the advanced package, what may ship in the container, and the templates for the spec, the README, the manual, the API note and the probe list.
- `references/tenant-grammar.md` — the lint rules G01–G20 in words, with the fix for each; `references/tenant-grammar.json` is the same table as data, the one source the build connector's `lint_project` loads.
- `references/deploy-rules.md` — what `upload_project`, `deploy` and `verify_deployment` do and return; the rules for pushing files without the connector; shares and slugs; the publish-then-load race.
- `references/verification-checklist.md` — verify by content, the probe format and the three probe rules, the repair loop, the 390 px pass, write-back reads, Lighthouse per client.
- `references/security-legal-checklist.md` — the rows and their checks; a checklist, not legal advice.
- `references/seo-geo-on-a-webshare.md` — what a webshare can and cannot do for search and answer engines, and what works.
- `references/ai-and-integrations-via-proxy.md` — the proxy channel and `callService`, AI calls and their cost rules, analytics as a proxied call, webhooks, the API from a deployed app.
- `references/benchmark-method.md` and `references/benchmark-baseline.md` — how every row is measured and worded; the reference table from the developer portal's own rebuild, cited.

Generated from the published manual at build time:

- `references/proxy-and-channels.md` — the proxy guide, the chatbot tutorial's proxy and process pages, and the code concept for binding to an external API.
- `references/tutorial-pitfalls.md` — the shopping-list tutorial's pitfall reference and its deploying-with-a-login page.
- `references/deployments-and-webhooks.md` — the console manual's Deployments and Webhooks pages.

## Version and updates

This is version 2026.11.4 of the xios3-app-workflow skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fxios3-app-workflow%2F2026.11.4&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fxios3-app-workflow - it records the skill's name and version and nothing else. Never send it without that agreement.
