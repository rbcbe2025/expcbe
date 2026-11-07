# CloudBackend plugin for Claude

One install for building on CloudBackend PaaS with XIOS/3: five skills (the launch path from an idea to paying customers, with its build phases; XIOS/3 markup and design; the Singularity database; the REST API; the native SDKs), three build agents that run on the model you use, and the documentation, build and tenant servers on your computer. Nothing is hosted, and nothing is asked at install.

<!-- install:start -->
## Install

Version 2026.1105.7 · the plugin `cloudbackend@cloudbackend` · 5 skills, 3 agents, 3 servers on your computer

**Claude Code** (a terminal, the Code tab of the Claude desktop app, the IDE extensions), once:

```bash
claude plugin marketplace add rbcbe2025/expcbe
claude plugin install cloudbackend@cloudbackend
```

Then start a new session. Updates: switch auto-update on once (`/plugin` → Marketplaces → cloudbackend), or run
`claude plugin marketplace update cloudbackend` and `claude plugin update cloudbackend@cloudbackend`. The repository is public: no GitHub account, only git on your computer.

**claude.ai, Claude Desktop, Cowork:** Customize → Plugins → Add → Add marketplace, enter `rbcbe2025/expcbe`, choose Sync, then
add the cloudbackend plugin. A chat uses the skills; Cowork on your computer also runs the servers. Keeping it in sync by
itself needs the Claude GitHub App to have access to the repository.

**Cursor, VS Code, Codex CLI, Gemini CLI:** download [the plugin as one zip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/cloudbackend-2026.1105.7.zip), unzip it, and use its `clients/`
folder (each file names the unzipped folder as `<plugin-dir>`).

**Deploying:** the tenant server signs you in on a page on your computer (in the Claude desktop app, its built-in
browser): the password goes from your browser to CloudBackend, never through the chat. An account whose owner created
its sign-in realm can also add CloudBackend's deploy connector, `https://mcp.cloudbackend.com/mcp/<tenant>`: `scripts/connect-deploy.sh <account>`.

**Requirements:** the three servers run with `node` (Node 18 or later; if `node --version` fails in a terminal, install
Node first). Nothing else is installed.

<details><summary>Other ways in</summary>

- The same marketplace from the developer portal, without GitHub: `claude plugin marketplace add https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/marketplace.json`, then `claude plugin install cloudbackend@cloudbackend`.
- One session, nothing installed: `claude --plugin-url https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/cloudbackend-2026.1105.7.zip`.
- A single skill: the developer portal's Tools page has each skill's file; do not add one by hand next to the plugin, or
  both copies load.

</details>
<!-- install:end -->

## What is inside

<!-- skills:start -->
5 skills, built from the documentation on 2026-11-07 (`SKILLS.json` has the hashes):

| Skill | Version | Use it when |
| --- | --- | --- |
| `cloudbackend-rest-api` | 2026.11.7 | Call the CloudBackend REST API (api.cloudbackend.com/v1) from any language: log in for a session token, create and query containers, create and save objects and streams, set ACLs, share, manage groups and identities, with the exact XML bodies of all 513 operations. |
| `cloudbackend-saas-launch` | 2026.11.7.7 | Take a web app on CloudBackend PaaS from an idea or an empty tenant to a verified deployment and paying customers: plan, spec, design, data model, a XIOS/3 build linted before every upload, a deployment verified by content, hardening, login and sign-up, teams, price plans, promotion to a domain, and a benchmark. |
| `cloudbackend-sdk` | 2026.11.7 | Use the native CloudBackend SDKs for C++, Java and Swift (package cbe): log in with a LogInDelegate, wait for callbacks, work with Account, Container, Object, Item, Stream, Filter and QueryResult, create containers and objects with key/values, query, share and terminate(). |
| `singularity-database` | 2026.11.7.2 | Model data and run a product on CloudBackend's Singularity database: tenants, identities, groups, roles, containers, objects, streams, key/values, datatypes, ACLs and sharing, plus Owner and Administrator duties, sign-up and CRM e-mail, price plans, subscriptions and the PayPal checkout. |
| `xios3-app-basics` | 2026.11.7.4 | Write and design XIOS/3 applications: the manifest, views, processes and data bindings (home://, tenant://), events and operations, packaging, and the design kit: a token theme covering every component, Lucide icons, phone and desktop layouts, a login with sign in, sign up and a kept session, and the runtime's measured pitfalls. |
<!-- skills:end -->

`.mcp.json` declares the three servers; CloudBackend's deploy connector is added by hand:

<!-- servers:start -->
| Server | Runs | Gives |
| --- | --- | --- |
| `cloudbackend-docs` | inside the plugin (Node 18 or later; `servers/docs/`) | documentation lookups, read-only: topics, REST operation cards with XML bodies (or the API by tag), SDK method cards, and the XIOS/3 reference by kind and name (components, operations, functions, methods, events, actions, concepts, icons) with a list of names per kind; reads the developer portal, needs no sign-in |
| `cloudbackend-build` | inside the plugin (Node 18 or later; `servers/build/`, authored in the plugin repository, tested by `servers/build/test.mjs`) | build tools for a XIOS/3 package, no tenant needed: lint_project (the tenant grammar G01-G20 before an upload; schema validation happens at upload) and benchmark_project (the measured block of a benchmark report) |
| `cloudbackend-tenant` | inside the plugin (Node 18 or later; `servers/tenant/`, authored in the plugin repository, tested by `servers/tenant/test.mjs`) | your CloudBackend account, signed in on a page on your computer (the password goes from your browser to CloudBackend, never through the chat): upload_project (a local package folder, linted first), deploy (a Development deployment: private in the console, yet anyone with its address can open it unless the app has a login), verify_deployment (served bytes, not a 200), list_projects, and enable_deploy_connector (the owner creates the account's sign-in realm the deploy connector needs) |
| `cloudbackend-deploy` | CloudBackend's server, `https://mcp.cloudbackend.com/mcp/<tenant>`, added by hand | optional, added by hand: CloudBackend's per-tenant deploy server (list_projects, upload_project, deploy, verify_deployment and the rest), for an account whose owner created its sign-in realm (enable_deploy_connector on cloudbackend-tenant); not in the plugin's .mcp.json, because without the realm it can only fail to connect |
<!-- servers:end -->

`servers/docs/` is a copy of the documentation hub's Claude Desktop extension server, made by the repository's `scripts/sync-servers.mjs` (it carries a `VENDORED_FROM` note and a `MANIFEST.sha256`) and never edited here. `servers/build/index.mjs` is written in the plugin repository: a port of the deploy server's build tools that reads the tenant grammar from `skills/xios3-app-workflow/references/tenant-grammar.json`, so the rules the skill documents and the rules the tool applies are one file; `servers/build/test.mjs` tests it. Both servers are plain Node files: nothing is installed on your computer.

`agents/` holds the three XIOS/3 build agents cloudbackend-saas-launch delegates to on Claude Code (a view author and a process author at the build phase, a UI tester at the verify phase); they run on the model you run (`model: inherit`), and on clients without sub-agents the skill does the same work in order.

## Deploying: the per-tenant connector

Deployment goes through a connector that signs you in at your own tenant, so it is per tenant. Claude Code asks for the tenant once, when the plugin is installed, and fills `.mcp.json`'s `cloudbackend-deploy` with it. Clients that do not ask (claude.ai, Claude Desktop, Cowork, Cursor, VS Code) add it by hand:

```bash
scripts/connect-deploy.sh <tenant>
```

adds `cloudbackend-deploy` at `https://mcp.cloudbackend.com/mcp/<tenant>` to Claude Code (user scope) and prints the URL to add as a custom connector elsewhere. The tenant name is lowercase letters and digits, the name in your console address.

## Updates

A marketplace you added yourself does not update by itself in Claude Code: `claude plugin marketplace update cloudbackend`, then `claude plugin update cloudbackend@cloudbackend`. The servers travel with the plugin, so an update brings them too. `SKILLS.json` records, per skill, the version, the content hash and the sha256 of the package it was unpacked from. The skills are generated from the published documentation and never edited here.

## Licence

Scripts and configuration are under Apache-2.0 (`LICENSE`). The skill content is © CloudBackend; redistribution with the plugin is permitted. This arrangement is provisional: the final licence is CloudBackend's decision, Robin Belanger's call, before the plugin is listed anywhere.
