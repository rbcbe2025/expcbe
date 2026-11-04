# CloudBackend plugin for Claude

One install for building on CloudBackend PaaS with XIOS/3: the published skills (the Singularity database, the REST API, the native SDKs, XIOS/3 applications and their design, the SaaS launch path) and two hosted connectors, documentation lookups and the build tools. The connectors are read-only and need no sign-in, and they answer from the current documentation. The skills carry the method; a plugin update brings a newer set.

<!-- install:start -->
## Install

Version 2026.1104.0 · marketplace `https://mcp.cloudbackend.com/plugin/marketplace.json`

**Claude Code**

```bash
claude plugin marketplace add https://mcp.cloudbackend.com/plugin/marketplace.json
claude plugin install cloudbackend@cloudbackend
```

Later versions: `claude plugin update cloudbackend@cloudbackend` (a marketplace added by URL does not update by itself). For one session
without installing, download the zip from the marketplace and run `claude --plugin-dir cloudbackend-2026.1104.0.zip`.

**claude.ai, Claude Desktop, Cowork:** add each connector as a custom connector by URL (Settings → Connectors; no sign-in):
`https://mcp.cloudbackend.com/docs` (cloudbackend-docs) and `https://mcp.cloudbackend.com/build` (cloudbackend-build). The skills are uploaded from the developer portal's Tools page
until the plugin is listed there.

**Cursor:** one click per connector, [cloudbackend-docs](cursor://anysphere.cursor-deeplink/mcp/install?name=cloudbackend-docs&config=eyJ1cmwiOiJodHRwczovL21jcC5jbG91ZGJhY2tlbmQuY29tL2RvY3MifQ==) and [cloudbackend-build](cursor://anysphere.cursor-deeplink/mcp/install?name=cloudbackend-build&config=eyJ1cmwiOiJodHRwczovL21jcC5jbG91ZGJhY2tlbmQuY29tL2J1aWxkIn0=), or
`clients/cursor/mcp.json` as `.cursor/mcp.json`.

**VS Code:** `code --add-mcp '{"name":"cloudbackend-docs","type":"http","url":"https://mcp.cloudbackend.com/docs"}'` (and the same for cloudbackend-build), or
`clients/vscode/mcp.json` as `.vscode/mcp.json`.

**Codex CLI:** append `clients/codex/config.toml` to `~/.codex/config.toml`. **Gemini CLI:** merge
`clients/gemini/settings.json` into `~/.gemini/settings.json`.

**Deploying** needs the per-tenant connector, `https://mcp.cloudbackend.com/mcp/<tenant>`: `scripts/connect-deploy.sh <tenant>`.
<!-- install:end -->

## What is inside

<!-- skills:start -->
7 skills, built from the documentation on 2026-11-04 (`SKILLS.json` has the hashes):

| Skill | Version | Use it when |
| --- | --- | --- |
| `cloudbackend-rest-api` | 2026.10.27.4 | Call the CloudBackend Singularity database over its REST API (api.cloudbackend.com/v1) — log in and get a session token, create and query containers, create/save/list objects and their streams, set ACLs, share, manage drives, groups and identities — with the exact XML request and response bodies for all 513 operations bundled. |
| `cloudbackend-saas-launch` | 2026.11.4 | Guide a developer from an empty CloudBackend PaaS tenant to the first paying customer of a SaaS web app: tenant and identities, data model, XIOS/3 app, branded login screen, sign-up and CRM e-mail, teams and roles, price plans with PayPal checkout, deployment to a custom domain. Asks only what each step needs, keeps a launch-context file, and hands each step to the skill that owns it (singularity-database, xios3-app-basics, cloudbackend-rest-api). |
| `cloudbackend-sdk` | 2026.10.10 | Use the native CloudBackend SDKs for C++, Java and Swift (the 'SDK Mobile, IoT & Cloud', package `cbe`) to log in to the Singularity database and work with Account, Container, Object, Item, Stream, Filter and QueryResult — including the asynchronous delegate pattern (LogInDelegate, QueryDelegate), createContainer/createObject with key/values, querying, sharing and terminate(). |
| `singularity-database` | 2026.10.15 | Model data for CloudBackend's Singularity database, the object-oriented database behind CloudBackend PaaS. Covers its building blocks (tenant, identity, group, role, database, container, object, item, stream, key/value, datatype, ACL, sharing, publish/subscribe, webhook) and how to design with them: containers as folders or tables, datatypes as schemas, key/values as columns, ACL bits and inheritance, per-identity databases, tenant:// and home:// drives. |
| `xios3-app-basics` | 2026.11.4 | Build web applications with XIOS/3 — the declarative XML application platform where a view (UI markup), a process (triggers → steps → operations) and data documents make an application, and the Data Virtualization Layer binds components straight to XML in the CloudBackend Singularity database (home://, tenant://). |
| `xios3-app-design` | 2026.10.10.5 | Design a XIOS/3 application for CloudBackend PaaS so it looks and works like a product: a design brief and mood board from one sentence about the app, a token theme (palette seeds, type and shape knobs) the runtime derives every hover and border from, a layout kit (cards, list and detail, phone and desktop views, a navigation rail or menu), two small components (a status line, a screen watcher), and the data logic that goes with the screens (a list bound to a container, the detail to the selected object, the process writing). |
| `xios3-app-workflow` | 2026.11.4 | Run the build-and-deploy workflow for a XIOS/3 application on CloudBackend PaaS, from an idea to a verified deployment and a benchmark report: an opening round and a plan card of defaults, a solution spec, the design hand-off, the data model, a scaffolded package built with sub-agents, a tenant-grammar lint before every upload, a Development deployment verified by content, UI probes in the browser, hardening (security, the login gate, SEO and GEO, analytics, clean-up), documentation and a manual, the console hand-off for Staging, Production and a domain, and a benchmark block that says what was measured. Shares cloudbackend-launch.md with cloudbackend-saas-launch. |
<!-- skills:end -->

`.mcp.json` declares the two connectors:

| Connector | URL | Gives |
| --- | --- | --- |
| `cloudbackend-docs` | `https://mcp.cloudbackend.com/docs` | Documentation lookups: topics, REST operation cards with XML bodies, SDK method cards, XIOS/3 reference entries. |
| `cloudbackend-build` | `https://mcp.cloudbackend.com/build` | Build tools for a XIOS/3 project: lint, scaffold, benchmark. No tenant needed. |

`agents/` is reserved for the XIOS/3 workflow agents (Claude Code only) and `evals/` for the cases `claude plugin eval` grades; both arrive with the workflow skill.

## Deploying: the per-tenant connector

Deployment goes through a connector that signs you in at your own tenant, so it is per tenant and not part of `.mcp.json`:

```bash
scripts/connect-deploy.sh <tenant>
```

adds `cloudbackend-deploy` at `https://mcp.cloudbackend.com/mcp/<tenant>` to Claude Code (user scope) and prints the URL to add by hand in claude.ai (custom connector), Cursor and VS Code. The tenant name is lowercase letters and digits.

## Updates

A marketplace added by URL does not update by itself in Claude Code: run `claude plugin update cloudbackend@cloudbackend`. The connectors need nothing; they are hosted. `SKILLS.json` records, per skill, the version, the content hash and the sha256 of the package it was unpacked from. The skills are generated from the published documentation and never edited here.

## Licence

Scripts and configuration are under Apache-2.0 (`LICENSE`). The skill content is © CloudBackend; redistribution with the plugin is permitted. This arrangement is provisional: the final licence is CloudBackend's decision, Robin Belanger's call, before the plugin is listed anywhere.
