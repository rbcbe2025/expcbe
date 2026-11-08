---
name: cloudbackend-saas-launch
description: "Take a web app on CloudBackend PaaS from an idea or an empty tenant to a verified deployment and paying customers: plan, spec, design, data model, a XIOS/3 build linted before every upload, a deployment verified by content, hardening, login and sign-up, teams, price plans, promotion to a domain, and a benchmark. Use it when someone wants to start, build, deploy, ship or launch on CloudBackend, asks what comes next, or asks whether their app is live or secure."
---

# CloudBackend launch: from an idea to the first paying customer

This skill runs the order of work and keeps the evidence; the knowledge lives in the owner skills and the
references named at each step: open them, never restate them.

Five words carry every claim: **measured** (this app, this run, dated, the tool named), **reference** (another
app, cited), **planned** (not built), **console** (a click path in the CloudBackend PaaS console; no API today)
and **not on this client** (the tool a step needs is not connected here).

## The path

`references/launch-path.md` has every step's actions, its check and what is not settled. Read the Pre-flight
section and the current step's, not the whole file.

| Step | Owner | Open |
| --- | --- | --- |
| Tenant, identities | singularity-database | `users-and-roles.md` |
| Pre-flight | this skill | launch-path "Pre-flight": is there **CRM** and **Price plans** in the console's left menu? |
| 1 Data model | singularity-database | `datatypes.md`, `measured-on-a-tenant.md` |
| 2 Application, and the Development half of 7 | this skill: W0–W9 below | `references/build-phases.md`; xios3-app-basics (markup, design kit) |
| 3 Login screen | xios3-app-basics | `references/login.md`; `references/deployment-pipeline.md` for the logo rule |
| 4 Sign-up and e-mail | singularity-database | `crm.md`; no CRM: launch-path step 4b |
| 5 Teams and roles | singularity-database | `users-and-roles.md` |
| 6 Price plans, PayPal checkout | singularity-database | `price-plans.md` (console, `purchase` markup); none: step 6b |
| 7 Deploy | this skill, W8 | xios3-app-basics `references/deployment-pipeline.md` |
| 8 After launch | this skill | `references/returning-tasks.md` |
| Integrations, scripts | cloudbackend-rest-api | code outside XIOS/3 |

A missing companion is on the portal's Tools page (https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud); of two installed copies, read the newer.

- **No tenant yet:** db.cloudbackend.com. The form asks for an e-mail, a password of at least 16 characters, the
  tenant name (lowercase letters and digits; it is part of every address and cannot change, so help choose it)
  and a referral code from early access (early.cloudbackend.cloud). Then the identities `<tenant>admin` and
  `<tenant>dev`; the Owner stays for owner-only tasks; the Developer needs a role (at least read on Identities and
  Roles) before it can sign in at `https://<tenant>.db.cloudbackend.com/`.

## The context file

One file, `cloudbackend-launch.md` at the project root (in the conversation when there is no file system). Read
it first in every session; create it after the opening round, or before the first evidence line of a session
that starts mid-way (mark earlier phases *not recorded*). Never a second file.

```markdown
# CloudBackend launch context
- tenant: acme · identities: acmeadmin, acmedev · deployment name: tasktrack · client: Claude Code, browser yes
- app, what it does, customers are · branches: accounts CRM|by hand, payment plans|invoice · files reach the tenant via:
## App (v1/v2, record, screens, look, login, channels, seo/geo)   ## Progress   ## Build   ## Benchmark   ## Decisions
```

Evidence lines: `W<n> <name> — <tool or check> <result> · <who confirmed> <UTC>`, written into `## Build` when
the check passes and quoted in the reply. A step is ticked only when its check passed and its line is in the file;
one this client or tenant cannot run is ticked *deferred* with the reason, never done.

## Asking: one round, then defaults

**The opening round**: at most three questions, each with a suggested answer, none the prompt already answered:
the tenant's name (or "none yet"); the app in one sentence, for whom; and the pre-flight: CRM and Price plans in the
console menu, the VS Code / Cursor extension (without it every file goes up through the console's Upload Files
dialog, which replaces by name: plan fewer files and versioned module names), what is connected here. Say what each
absence costs in one line; do not stop for it.

**The plan card goes in the same reply, never after the answers** (waiting costs the user a round trip): a line per
decision with its reason, ending "reply to change any of these; otherwise I go on":

- the kind of app and its customers (individuals on `home://`, or organisations in groups)
- the one kind of record v1 keeps, three fields, and the screens (list, detail, New)
- the look: the direction the design kit picks from the idea (xios3-app-basics)
- login: always sign in, sign up and forgot password, and a kept session (a team tool and a tenant with no CRM
  keep all three); payment: the pre-flight's branch
- channels: none, unless the idea needs an integration or an AI call (then which, through a proxy)
- SEO/GEO and analytics: public surface or behind login; `llms.txt`; analytics none or an endpoint
- identities `<tenant>admin` and `<tenant>dev`; the deployment name (the app's, in lowercase letters and digits, not
  beginning with `xios`); runtime pinned; Development first
- benchmark: measured on this app plus the reference baseline; the React twin off
- prices, the domain and a logo file: decided at their own steps

Then at most one question per step, only where a default would be wrong or cannot be undone (the tenant name, a
price, a domain, deleting data). v1 is small on purpose.

## Short questions get the whole answer

A user asking mid-flow acts on the answer, so it carries the verdict, the reason in these words, and the next
action, even for a one-line question. Where the check is read-only and a route is open, run it.

| The user asks | The answer says, every time |
| --- | --- |
| Is it live? / deploy it and tell me | live only from `verify_deployment`'s `index_xml_match`; **a 200 proves nothing**: every webshare path answers 200 with the boot page; the gate verdict; what was not checked |
| Is it secure now? (the login shows my logo) | the `login_gate` verdict from a fresh `verify_deployment`; **a themed login page is not access control, and private visibility is not authentication**; the gate is the pipeline's login configuration plus the login stamp in the served manifest; the user tests as a **role-less identity in a private window**; re-verify after every redeploy |
| Promote it, connect my domain | console steps, no tool: W8's click path, the logo as a full `https://` address on the Staging host, the `A` record `83.140.241.4`; `verify_deployment` after each promotion; **customers get the Production address or the domain, never the console's** |
| A 409 on a seed: delete `data/`? | no: the seed was kept on purpose and may hold real records; carry on with `verify_deployment` and report it |
| Lighthouse high, app feels slow | the score is flattered (LCP measures the boot page); **Speed Index** is the honest number; record **route, preset, profile and date**; fixes: icon font to SVG (G15), the boot script deferred with preloads, a minimum page height, a frame title; SEO 63 is the host's robots rule for an `xios` prefix (G18) |
| Verify it, no browser here | `verify_deployment` now; the probes handed over in the same reply (URLs, expected state, a fresh private window); the user's pass/fail recorded as **user-run**; W5 stays open |
| Add AI, here is my key | the key is exposed: revoke it, a new one with a spend limit, never quoting any part of it; no call from view JavaScript (G11, G12): a console proxy pinned to domain, path and headers, behind an ACL (every admitted identity's calls bill the tenant, with no subscription check), and a `callService` step; free text **JSON-escaped** in the body; write the cost line into `docs/spec.md` |
| Write the benchmark report | a Source on every row, in the file **and the reply's copy**; tokens and cost "not available on this client" where the client shows none; the portal rebuilt from React cited as reference; the React twin **opt-in, not built**; no multiplier; "no build step" a property, not a speed claim |
| Lint findings | per finding: the rule id, the rule's reason in its own words (G05: the tenant flattens `<select>`), the fix; the ship rules too (G10 hex colours), due before Production; nothing uploaded while an error stands |

## Build phases: step 2 and the Development half of step 7

Keep the order; deploy a throwaway at W4 as soon as the first list binds. `references/build-phases.md` has each
phase's work and question; open it at W0.

| Phase | Does | Gate (evidence line) |
| --- | --- | --- |
| W0 Open | context file, opening round, plan card; the route files take: the tenant server (`tenant_status`; else `tenant_signin`, the user signs in on its page; then `tenant_status` with `wait_seconds`), else the console with the user's help (`references/deploy-rules.md`) | plan card sent: `W0 open — plan card; client; route; browser` |
| W1 Spec | `docs/spec.md` (`references/project-layout.md`): v1 vs v2, screens, records, roles and ACLs, channels each with a cost line, SEO/GEO, probes | user yes |
| W2 Design | xios3-app-basics design kit: brief, mood board, token theme, phone and desktop | the direction confirmed |
| W3 Data | launch-path step 1 (singularity-database) | its check |
| W4 Build | the kit's first version, then views and processes (sub-agents or in order); `lint_project` profile `build` before **every** upload; `upload_project`, `deploy` (Development) | lint 0 errors; `W4 build — lint …; upload N files ok; deploy dev <url> <UTC>` |
| W5 Verify | `verify_deployment`; UI probes (`references/verification-checklist.md`); write-backs read back; Lighthouse or "not run" | `index_xml_match` true; probes pass |
| W6 Harden | `references/security-legal-checklist.md`, the login gate re-verified, `references/seo-geo-on-a-webshare.md`, `lint_project` profile `ship` | lint ship 0 errors |
| W7 Document | README, manual (a section per screen), `docs/api.md`, probes dated | the three exist |
| W8 Ship | the console click path (xios3-app-basics `deployment-pipeline.md`): Make Public → Shared → Mark Verified → Staging → Configure Login Page → Mark Verified → Production → Connect Domain (`A` 83.140.241.4); `verify_deployment` after **each** promotion | Production verified; the customer's address card |
| W9 Report | `benchmark_project` and `references/benchmark-method.md`, `references/benchmark-baseline.md` cited | every row has a Source |

**Sub-agents** (Claude Code): `xios3-view-author` and `xios3-process-author` in parallel on separate files at W4,
`xios3-ui-tester` at W5. Without them, the same work in the order data → view → process → lint → probes.
`lint_project`, `verify_deployment` and `benchmark_project` are tools: never re-implement a rule a tool checks;
explain the finding, fix the file, run it again. Without the build server, `references/tenant-grammar.md` is the
checklist and the evidence line says *checked by hand*.

## Credentials: never

Never ask for, accept or repeat a password, referral code, session token or API key. The user signs in to the
console themselves. The tenant server's sign-in page sends the password from the user's browser to CloudBackend
and keeps only the session: give the user the page, never type into it, never read its session file. When the
page is in a tab you can see (the desktop app's built-in browser), leave it to the user: do not read, screenshot
or click in it until `tenant_status` says they are signed in. If the user pastes a secret, tell them to change
it and do not use it; never quote any part of it, not even a prefix ("the key you pasted" is enough).

Identities are the user's: you never create one or sign in as one, so a "sign in as a test user" check is theirs,
in a **private window** (signing in as the test identity in the console's browser signs the console out). Each
browser action that changes the tenant gets its own yes at the time (an upload that replaces a file, Deploy, Make
Public, each promotion, an ACL or proxy edit), and **Deploy Anyway** a fresh one. `enable_deploy_connector`
changes the account: ask the owner first. Reading needs no yes.

## Working method

1. Read `cloudbackend-launch.md`, say in one line which step is next and why. After the tenant, the first step is the
   pre-flight; its answers go into the file as `branches:` and `files reach the tenant via:`.
2. Open the owner skill for that step and do the work there; give console actions as exact paths, owner-only ones marked.
3. End with the step's check; tick it only when the user confirmed it (a deferred step says why). Steps that need a test
   identity are the user's, in a private window: say so when the step starts, so they plan for it.
4. Keep evidence: for anything the app writes, the stored document read back (`read_project_file` or the CLI's `cat`),
   never the screen.

Clients: Claude Code and Cowork run every step with the plugin's servers (sub-agents in Claude Code; the desktop app's
built-in browser opens the sign-in page); in Claude Desktop chat and claude.ai files go up through the console's
Projects section with the user's help and probes are the user's checklist. An account whose owner created its sign-in
realm may add CloudBackend's deploy connector (`references/deploy-connector.md`).

## Mistakes this path exists to prevent

- A console role for customers so they "can log in": end users sign in through the app's login and have no role.
- ACLs granted to individual users instead of roles or groups; object names built from user text.
- Secrets in a deployed container: everything in it is publicly readable.
- Writing from JavaScript: a loaded document changed there is a copy; hand the value to a process step through a
  named component, let the process write, and read the stored document back.
- Steps 4 and 6 planned on the manual alone: an early-access console may have no CRM and no Price plans.

## Bundled references

- `references/launch-path.md` (generated): the path, one section per step.
- `references/build-phases.md`: W0–W9 in full, the sub-agents and the routes.
- `references/deploy-rules.md`: what each tool does and returns, the REST rules; `deploy-connector.md`: a realm account's connector.
- `references/tenant-grammar.md` (`.json`: the build server's table): lint rules G01–G20 and their fixes.
- `references/project-layout.md`, `references/verification-checklist.md`, `references/security-legal-checklist.md`, `references/seo-geo-on-a-webshare.md`, `references/ai-and-integrations-via-proxy.md`, `references/benchmark-method.md`, `references/benchmark-baseline.md`.
- `references/proxy-and-channels.md` (generated): the manual's proxy pages.
- `references/returning-tasks.md`: a field, a screen, access, prices, a release, a rollback, a domain.

## Version

cloudbackend-saas-launch 2026.11.8.4, built from the CloudBackend documentation. In the CloudBackend plugin it updates with the plugin (`claude plugin update cloudbackend@cloudbackend`; claude.ai, Claude Desktop and Cowork refresh it at the start of a session).

A copy installed by hand: once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json; when it lists a newer `cloudbackend-saas-launch` than 2026.11.8.4, tell the user once, in one sentence, without interrupting the task.

Usage count (anonymous: the skill's name and version, nothing else): ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and is kept with the project. Only if they agreed, fetch https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fcloudbackend-saas-launch%2F2026.11.8.4&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fcloudbackend-saas-launch the first time the skill is used in a session.
