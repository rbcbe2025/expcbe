# The build phases, W0 to W9

The detail behind the phase table in SKILL.md: what each phase does, the one question it may ask, its gate and
its evidence line. Step 2 of the launch path and the Development half of step 7 run as these phases. Every phase
ends the same way, also when the user asked for that one step alone: its evidence line goes into `## Build` of
`cloudbackend-launch.md` (created first when missing) and is quoted in the reply.

## W0 Open

Read `cloudbackend-launch.md`. Run the opening round and the plan card (SKILL.md "Asking"). Write `## App` and
`## Build`. Run the pre-flight if the file has no `branches:` line yet.

Pick the route files take to the tenant, the first that answers, and write it on the `files reach the tenant
via:` line:

1. **The tenant server** (`cloudbackend-tenant`, part of the plugin, on the user's computer; Claude Code and
   Cowork). `tenant_status`; when nobody is signed in, the user signs in on its page and the password goes from
   that page to CloudBackend:
   - In the Claude desktop app, whose built-in browser is among your tools: `tenant_signin` with the account name
     and `open_browser: false`, open `signin_page` in the built-in browser, and tell the user in one line to sign
     in in that tab. Leave the tab to them: do not read, screenshot or click in it until `tenant_status` says they
     are signed in, then close it.
   - Elsewhere: `tenant_signin` with the account name opens the page in the default browser; give its address in
     one line too.
   Then `tenant_status` with `wait_seconds` waits for them. If the page cannot be reached, Claude runs on another
   computer than the user's browser (over SSH, in a cloud session) and `127.0.0.1` points at the wrong one: take
   the console route.
2. **CloudBackend's deploy connector**, when the user added it (`https://mcp.cloudbackend.com/mcp/<tenant>`,
   `deploy-connector.md`): it answers only for an account with its own sign-in realm. `tenant_status`'s `deploy_connector` line says whether
   the account has one; when it has not and the user is the owner, offer `enable_deploy_connector` once, as a
   question, because it changes the account.
3. **The console, with the user's help.** The user opens `https://<tenant>.db.cloudbackend.com/` and signs in
   themselves. A browser tool then performs the clicks, each change with its own yes; without one, give the click
   path in words and wait for "done" after each step.

Say in one line which route was taken and why the ones before it were not.
Gate: the plan card was sent; silence is a go. Evidence: `W0 open — plan card <UTC>; client <name>; route tenant server|deploy connector|console; browser yes|no`.

## W1 Spec

Write `docs/spec.md` from the template in `project-layout.md`: v1 features against v2, the screens, every
component by name, the records with fields and scope, roles and the ACL plan, channels (integrations, AI calls),
analytics, the SEO and GEO stance, the security and legal baseline, the documentation plan, the UI probe list and
the pricing line. Every channel row carries its cost line: provider, model or plan, the spend limit, who may call
it, and what one call costs at the expected size (`ai-and-integrations-via-proxy.md`); with no model chosen yet,
an estimate from the provider's published price for the default model, marked *estimate*. A channel added after
W1, an AI call above all, is a spec change: its row with the cost line goes into `docs/spec.md` before it is
wired. One question, skipped when the plan card settled it: "v1 is these N features; the rest is v2 — yes?"
Gate: `docs/spec.md` exists and the user said yes. Evidence: `W1 spec — docs/spec.md: N features, N screens, N kinds · user yes <UTC>`.

## W2 Design

xios3-app-basics, "The first version": the brief, the mood board, the token theme, the layouts for desktop and the
390 px phone. Its one question is the direction ("this look, or another?"). With a shell and Python,
`scripts/designkit.py` writes the files; without them, the skill says what to do by hand from its example files.
That first version is what W4 builds on.
Gate: the design hand-over checklist. Evidence: `W2 design — direction <name>; design/ N files · user yes <UTC>`.

## W3 Data

Step 1 of `launch-path.md`, run with singularity-database: the datatype, the containers, ACLs granted to roles
and groups, the seed documents under `data/`, and a control query when the app filters. Owner-only actions are the
user's; give exact console paths. No question: home against tenant scope was a plan-card line.
Gate: the step-1 check. Evidence: `W3 data — <datatype> in tenant://Settings/Datatypes; ACL <summary>; control query <result|n/a> · user confirmed <UTC>`.

## W4 Build

1. The design kit's first version from W2, laid out as the advanced package of `project-layout.md`.
2. The views and processes against that scaffold: with sub-agents, `xios3-view-author` and `xios3-process-author`
   in parallel on separate files; without them, in the order data → view → process.
3. `lint_project` with profile `build` before **every** upload; on the plugin's build server it takes the package
   folder. Zero errors is the gate; warnings are recorded with their rule ids; `tenant-grammar.md` has each rule's
   reason and fix, and a finding is reported with all three.
4. The throwaway deploy, as soon as the first list binds, on W0's route: `upload_project`, then `deploy` from
   `home` (a private Development deployment). The tenant server takes the local `app/` folder as `path`, lints it
   first and uploads nothing while an error stands; the deploy connector takes the files with `validate` on; on
   the console route the user uploads with the Upload Files dialog and runs the Deploy Wizard. `deploy-rules.md`
   says what each call returns, what a 409 on a seed means (kept, correct) and the REST rules.
One question, only when the spec lists a channel the plan card left open: "the provider for <channel>?"
Gate: lint 0 errors, upload done, deploy returned a URL. Evidence: `W4 build — lint build 0E/nW (<ids>); upload N files ok; deploy dev <url> <UTC>`.

## W5 Verify

1. `verify_deployment` on W0's route: the served files compared by checksum with the local `app/` folder (tenant
   server, `path`) or the stored ones (deploy connector); `login_gate` from the pipeline record's login
   configuration and the served manifest's login stamp, with a verdict of `gated`, `manifest-only`,
   `console-only` or `open`; `llms.txt` served or the fallback page. On the console route, fetch the address and
   compare `index.xml` from a shell, or the user's browser check. "Live" comes from `index_xml_match`, never a 200.
2. The UI probes in `tests/ui-probes.md`, in the session's browser tool when there is one (with sub-agents,
   `xios3-ui-tester`): a fresh browser context, trusted clicks, one assertion after **each** action, the 390 px
   pass, the console and the network read after each probe (`verification-checklist.md` has the format and the
   repair loop). Without a browser tool, hand the probes over in the same reply, not as an offer: the table with
   exact URLs and the expected state per row, a fresh private window, and a request for pass or fail per probe;
   record the answers as *user-run*.
3. Every document the app writes is read back (`read_project_file`, or the CLI's `cat`) before a write is believed.
4. Lighthouse, mobile, one route at a time, a fresh profile: from a shell with Chrome, or run by the user and
   pasted in (*user-run*), or "not run"; with the route, the preset, the profile and the date.
No question, except "paste the Lighthouse numbers" when nothing here can run it.
Gate: `index_xml_match` true; every probe passed with its assertion; 0 console errors from the app (the runtime's
named boot messages in `verification-checklist.md` are named, not counted); Lighthouse recorded or "not run".
Evidence: `W5 verify — verify_deployment match=true N/N, gate=<verdict>; probes N/N (390 px pass); console 0 app errors; Lighthouse <scores or not run> <UTC>`.

## W6 Harden

Walk `security-legal-checklist.md` row by row (no secrets in the container; proxies pinned to a domain, a path
and headers with a key of their own and a spend limit; ACLs to roles and groups; the EULA and privacy texts; an
account-deletion path; the data-location statement; analytics consent). Re-verify the login gate: private
visibility is not authentication and the themed login page is not access control; the gate is the pipeline's
login configuration plus the stamp in the served manifest, and a redeploy can drop it. Apply
`seo-geo-on-a-webshare.md` and, if an endpoint was named, the analytics section of
`ai-and-integrations-via-proxy.md`. Then `lint_project` with profile `ship` (ASCII files, no hex, one token block
with an explicit font, XSL `for-each`, no icon font, the prefix rule). Note the runtime pin in `## App`.
One question, if not on the plan card: "analytics: none, or your endpoint?"
Gate: lint ship 0 errors; the gate verdict matches the spec; the rows ticked. Evidence: `W6 harden — lint ship 0E/0W; login_gate <verdict>; llms.txt <real|n/a>; analytics <none|endpoint> <UTC>`.

## W7 Document

From the templates in `project-layout.md`: `docs/README.md`, `docs/manual.md` (one section per screen with the
words for every state, so its sections equal the probe list), `docs/api.md` (containers, datatypes, ACLs, the REST
cards that read them, how a deployed app reaches the API without stored credentials, and that an MCP server for
the app's data is a separate codebase, *planned*), `docs/agent-notes.md` for the next assistant, and
`tests/ui-probes.md` with its last-pass date. `## Decisions` is the memory: the documents cite it. The manual and
`llms.txt` may ship in the container (a webshare serves everything in it); the spec, notes, tests and evidence stay
outside.
Gate: the three documents exist and the manual's screens equal the probe list. Evidence: `W7 document — README, manual (N screens, N states), api.md (N containers, N cards), probes dated <UTC>`.

## W8 Ship

Promotion, the login configurator and a domain are **console**: hand them over with the click path from
xios3-app-basics `deployment-pipeline.md`: Make Public → Promote to Shared → Mark Verified → Promote to Staging →
Configure Login Page (the logo as `https://` + the Staging host + `/logo.svg`, the EULA box) → Mark Verified →
Promote to Production → Connect Domain (the domain's `A` record points at `83.140.241.4`; Connect Domain then
requests a Let's Encrypt certificate). After **each** promotion run `verify_deployment` on the new host, for the
content and the gate: a promotion that drops the login configuration serves the app open. Write the customer's
address card: the Production address or the domain, never the console's. The console is the user's; with a
browser tool each change gets its own yes, and Deploy Anyway a fresh one; without one, one step at a time.
One question: "domain: none for now, or yours?"
Gate: the launch path's step-7 check, plus `verify_deployment` on Production with `index_xml_match` true and the
gate as specified. Evidence: `W8 ship — Production <url>; verify match=true gate=<verdict>; domain <none|name> · user confirmed <UTC>`.

## W9 Report

`benchmark_project` over the package (the folder on the plugin's build server), with the client fields this
client can supply: tokens and cost from the client's usage readout (in Claude Code, `/cost`), or "not available
on this client"; active minutes from the context file's timestamps; the Lighthouse and timing rows from W5 and W6.
The tool returns the block with a Source on every row; `benchmark-method.md` says how each row is obtained and
worded; `benchmark-baseline.md` is the reference table cited beside it, never merged into it. Write the block into
`## Benchmark` and `docs/benchmark.md`, and copy it into the reply with its Source column. Then hand over steps 4,
5 and 6 if pending, and step 8.
One question: "build the React twin for a like-for-like row? About twice the tokens and an hour; default no."
Gate: every row has a Source; no comparison row exists without a twin measured on the same spec. Evidence: `W9 report — benchmark N rows (N measured, N reference, N not on this client); twin: not built <UTC>`.

## The sub-agents

| Agent | Does | Never |
| --- | --- | --- |
| `xios3-view-author` | views from the spec and the theme, every component named, no hex, no raw HTML; looks markup up by name | touches a process, uploads |
| `xios3-process-author` | processes and JavaScript-as-steps modules against the view names; writes only through process operations | touches a view, uploads |
| `xios3-ui-tester` | the probes in the browser with the three probe rules; pass/fail with evidence per probe | signs in as an identity, changes the tenant |

The grammar review is `lint_project` plus what a tool cannot judge (words for every state, a guard's logic, the
probe list against the screens); the benchmark is `benchmark_project`'s block plus the cited reference table.
Without sub-agents, do the same work in the order view → process → lint → probes → report.
