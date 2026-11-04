# CloudBackend plugin for Claude

One install for building on CloudBackend PaaS with XIOS/3: the published skills (the Singularity database, the REST API, the native SDKs, XIOS/3 applications and their design, the SaaS launch path, the build-and-deploy workflow), five workflow agents, and three servers. Documentation lookups and the build tools run inside the plugin, on your computer, with no sign-in (the documentation server reads the developer portal); deployment goes through CloudBackend's live server at your own tenant. The skills carry the method; a plugin update brings a newer set.

<!-- install:start -->
## Install

Version 2026.1104.0 · the plugin `cloudbackend@cloudbackend`

**Claude Code, from GitHub** (the testers' path; the repository is private, so Claude Code needs a GitHub credential it
can use without prompting: an SSH key loaded in `ssh-agent`, or `gh auth login` + `gh auth setup-git` with
`CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` set in your shell):

```bash
claude plugin marketplace add rbcbe2025/expcbe
claude plugin install cloudbackend@cloudbackend
```

The install asks once for your CloudBackend tenant (lowercase letters and digits, the name in your console address);
that fills the deploy connector, `cloudbackend-deploy` at `https://mcp.cloudbackend.com/mcp/<tenant>`, which signs you in at your tenant on
first use. `main` is what testers get; work happens on `dev`.

**Claude Code, without GitHub access:** the same marketplace, served by the developer portal:

```bash
claude plugin marketplace add https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/marketplace.json
claude plugin install cloudbackend@cloudbackend
```

**One session, nothing installed:** `claude --plugin-url https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/cloudbackend-2026.1104.0.zip`

**Updates:** `claude plugin marketplace update cloudbackend`, then `claude plugin update cloudbackend@cloudbackend` (a marketplace you added yourself does not update by itself;
`/plugin` → Marketplaces can switch auto-update on).

**The build server needs Python 3.12 or `uv`.** A session-start hook creates its environment once; the first session may
show `cloudbackend-build` as disconnected until the hook finishes (one line on the terminal says what it did). Without
Python 3.12 or `uv` the hook says so, and the workflow skill runs those steps as checklists.

**claude.ai, Claude Desktop, Cowork:** the skills are uploaded from the developer portal's Tools page, the documentation
server is the Claude Desktop extension offered there, and the deploy connector is added by hand as a custom connector
(`scripts/connect-deploy.sh <tenant> --print` prints the URL; Cowork reads `.mcp.json` but cannot fill the tenant).

**Cursor, VS Code, Codex CLI, Gemini CLI:** unzip the plugin and use `clients/` (each file names `<plugin-dir>`; the
build server's environment is one `sh <plugin-dir>/scripts/ensure-build-venv.sh <plugin-dir>/.data`).
<!-- install:end -->

## What is inside

<!-- skills:start -->
7 skills, built from the documentation on 2026-11-04 (`SKILLS.json` has the hashes):

| Skill | Version | Use it when |
| --- | --- | --- |
| `cloudbackend-rest-api` | 2026.10.27.4 | Call the CloudBackend Singularity database over its REST API (api.cloudbackend.com/v1) — log in and get a session token, create and query containers, create/save/list objects and their streams, set ACLs, share, manage drives, groups and identities — with the exact XML request and response bodies for all 513 operations bundled. |
| `cloudbackend-saas-launch` | 2026.11.4.2 | Guide a developer from an empty CloudBackend PaaS tenant to the first paying customer of a SaaS web app: tenant and identities, data model, XIOS/3 app, branded login screen, sign-up and CRM e-mail, teams and roles, price plans with PayPal checkout, deployment to a custom domain. Asks only what each step needs, keeps a launch-context file, and hands each step to the skill that owns it (singularity-database, xios3-app-basics, cloudbackend-rest-api). |
| `cloudbackend-sdk` | 2026.10.10 | Use the native CloudBackend SDKs for C++, Java and Swift (the 'SDK Mobile, IoT & Cloud', package `cbe`) to log in to the Singularity database and work with Account, Container, Object, Item, Stream, Filter and QueryResult — including the asynchronous delegate pattern (LogInDelegate, QueryDelegate), createContainer/createObject with key/values, querying, sharing and terminate(). |
| `singularity-database` | 2026.10.15 | Model data for CloudBackend's Singularity database, the object-oriented database behind CloudBackend PaaS. Covers its building blocks (tenant, identity, group, role, database, container, object, item, stream, key/value, datatype, ACL, sharing, publish/subscribe, webhook) and how to design with them: containers as folders or tables, datatypes as schemas, key/values as columns, ACL bits and inheritance, per-identity databases, tenant:// and home:// drives. |
| `xios3-app-basics` | 2026.11.4 | Build web applications with XIOS/3 — the declarative XML application platform where a view (UI markup), a process (triggers → steps → operations) and data documents make an application, and the Data Virtualization Layer binds components straight to XML in the CloudBackend Singularity database (home://, tenant://). |
| `xios3-app-design` | 2026.11.4 | Design a XIOS/3 application for CloudBackend PaaS so it looks and works like a product: a design brief and mood board from one sentence about the app, a token theme (palette seeds, type and shape knobs) the runtime derives every hover and border from, a layout kit (cards, list and detail, phone and desktop views, a navigation rail or menu), two small components (a status line, a screen watcher), and the data logic that goes with the screens (a list bound to a container, the detail to the selected object, the process writing). |
| `xios3-app-workflow` | 2026.11.4.2 | Run the build-and-deploy workflow for a XIOS/3 application on CloudBackend PaaS, from an idea to a verified deployment and a benchmark report: an opening round and a plan card of defaults, a solution spec, the design hand-off, the data model, a scaffolded package built with sub-agents, a tenant-grammar lint before every upload, a Development deployment verified by content, UI probes in the browser, hardening (security, the login gate, SEO and GEO, analytics, clean-up), documentation and a manual, the console hand-off for Staging, Production and a domain, and a benchmark block that says what was measured. Shares cloudbackend-launch.md with cloudbackend-saas-launch. |
<!-- skills:end -->

`.mcp.json` declares the three servers:

<!-- servers:start -->
| Server | Runs | Gives |
| --- | --- | --- |
| `cloudbackend-docs` | inside the plugin (Node 22; `servers/docs/`) | documentation lookups, read-only: topics, REST operation cards with XML bodies, SDK method cards, the nine XIOS/3 reference lookups (components, operations, functions, methods, events, actions, concepts, lists, icons); reads the developer portal, needs no sign-in |
| `cloudbackend-build` | inside the plugin (Python >=3.12; `servers/build/` through `scripts/run-build-server.sh`, environment made by `hooks/hooks.json`) | build tools for a XIOS/3 project, no tenant needed: lint_project (the tenant grammar), scaffold_project (the design kit), benchmark_project |
| `cloudbackend-deploy` | CloudBackend's live server, `https://mcp.cloudbackend.com/mcp/<tenant>` | CloudBackend's live per-tenant deploy server (OAuth sign-in at your tenant): list_projects, upload_project, deploy, verify_deployment and the rest |
<!-- servers:end -->

`servers/docs/` and `servers/build/` are copies of their sources, made by the repository's `scripts/sync-servers.mjs` (each carries a `VENDORED_FROM` note and a `MANIFEST.sha256`) and never edited here. `hooks/hooks.json` runs `scripts/ensure-build-venv.sh` when a session starts: it creates the build server's Python environment once, in the plugin's data directory, and is silent afterwards.

`agents/` holds the five XIOS/3 workflow agents the `xios3-app-workflow` skill delegates to on Claude Code (a view author, a process author, a grammar reviewer, a UI tester, a benchmark reporter; `agents/README.txt` lists them). Other clients run the same five as inline checklists. `evals/` holds the cases `claude plugin eval` grades, one per entry of each skill's own evals.

## Deploying: the per-tenant connector

Deployment goes through a connector that signs you in at your own tenant, so it is per tenant. Claude Code asks for the tenant once, when the plugin is installed, and fills `.mcp.json`'s `cloudbackend-deploy` with it. Clients that do not ask (claude.ai, Claude Desktop, Cowork, Cursor, VS Code) add it by hand:

```bash
scripts/connect-deploy.sh <tenant>
```

adds `cloudbackend-deploy` at `https://mcp.cloudbackend.com/mcp/<tenant>` to Claude Code (user scope) and prints the URL to add as a custom connector elsewhere. The tenant name is lowercase letters and digits, the name in your console address.

## Updates

A marketplace you added yourself does not update by itself in Claude Code: `claude plugin marketplace update cloudbackend`, then `claude plugin update cloudbackend@cloudbackend`. The servers travel with the plugin, so an update brings them too; the build server's environment is rebuilt by the hook only when its requirements change. `SKILLS.json` records, per skill, the version, the content hash and the sha256 of the package it was unpacked from. The skills are generated from the published documentation and never edited here.

## Licence

Scripts and configuration are under Apache-2.0 (`LICENSE`). The skill content is © CloudBackend; redistribution with the plugin is permitted. This arrangement is provisional: the final licence is CloudBackend's decision, Robin Belanger's call, before the plugin is listed anywhere.
