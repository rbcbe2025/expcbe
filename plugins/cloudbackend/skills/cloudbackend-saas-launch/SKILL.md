---
name: cloudbackend-saas-launch
description: "Guide a developer from an empty CloudBackend PaaS tenant to the first paying customer of a SaaS web app: tenant and identities, data model, XIOS/3 app, branded login screen, sign-up and CRM e-mail, teams and roles, price plans with PayPal checkout, deployment to a custom domain. Asks only what each step needs, keeps a launch-context file, and hands each step to the skill that owns it (singularity-database, xios3-app-basics, cloudbackend-rest-api). Use it whenever someone wants to get started with CloudBackend or CloudBackend PaaS, build a SaaS or paid web app on it, asks where to start or what comes next, has no tenant yet or wants to go live, or follows the First Tenant to First Customer launch path. Also use it for a returning builder's routine changes (a field, a screen, access, prices, a release or rollback, a domain) and whenever the CloudBackend docs MCP tools are connected, even if they never say 'launch'."
---

# CloudBackend SaaS launch path

This skill runs the order of work; the other skills hold the knowledge. It decides which step the user is
on, asks only for what that step needs, hands the step to the skill that owns it, and has the user confirm
the step's check before moving on. Do not restate what the owning skill says — open it.

`references/launch-path.md` is the whole path in one document: every step's actions, the rule that is
easiest to get wrong, a "check it worked" for each step, and the items the product has not settled yet.
Read it once at the start of a session.

## Companion skills

| Step | Owner skill | Open in it |
| --- | --- | --- |
| Tenant, identities | singularity-database | SKILL.md "Running a product on it"; `users-and-roles.md` |
| Pre-flight | this skill | `references/launch-path.md` "Pre-flight"; singularity-database `measured-on-a-tenant.md` for what an early-access console lacks |
| 1 Data model | singularity-database | SKILL.md; `concepts.md`, `datatypes.md`, `measured-on-a-tenant.md` (reserved key names, `.xdt`, the upload doors, indexing) |
| 2 Application: the look and the first version | xios3-app-design | SKILL.md: `scripts/designkit.py brief` (the brief, the mood board, the token theme), one yes, then `designkit.py app` (the files); `layouts.md`, `data-logic.md` |
| 2 Application: anything beyond the first version | xios3-app-basics | SKILL.md; `views.md`, `processes.md`, `recipes.md`; `javascript-as-steps.md` as soon as the app needs JavaScript or calls an API through the proxy |
| 2 Application and the Development deployment, end to end | xios3-app-workflow | SKILL.md: phases W0–W9 — the spec, the design hand-off, the scaffolded package, a lint before every upload, a Development deployment verified by content, the UI probes, hardening, the documents and the benchmark. It keeps this file's `## App`, `## Build` and `## Benchmark` sections and hands steps 3–6 and 8 back here |
| 3 Login screen | xios3-app-basics | `deployment.md` (Login Application); `deployment-pipeline.md` for the logo rule; the brand (name, colours, a text mark) is already in the design brief from step 2 |
| 4 Sign-up and e-mail | singularity-database | `crm.md`; xios3-app-basics `deployment.md` (Creating and Managing Users). CRM absent: `references/launch-path.md` step 4b |
| 5 Teams and roles | singularity-database | `users-and-roles.md` |
| 6 Price plans | xios3-app-basics `selling.md` for the markup; singularity-database `price-plans.md` for the console. Price plans absent: `references/launch-path.md` step 6b |
| 7 Deploy | xios3-app-basics | `deployment.md` (Managing Deployments); `deployment-pipeline.md` for what each promotion does to the address |
| Integrations, scripts | cloudbackend-rest-api | only when the user writes code outside XIOS/3 |

If a companion is not installed, say which one and that it comes from the CloudBackend developer
portal's Tools page; continue from `references/launch-path.md` in the meantime. When the same skill is
installed more than once (a plugin copy, a download from the portal, a local build), compare the version
in each copy's "Version and updates" section and read the newest; an older copy may lack whole
references.

## The launch context

Keep what you learn in `cloudbackend-launch.md` at the root of the user's project (or in the conversation
when there is no file system). Read it first in every session; create it after the first answers.
`xios3-app-workflow` writes into the same file: it owns `## App`, `## Build` and `## Benchmark`, this skill
owns the bullets and `## Progress`, and both append dated lines to `## Decisions`. Never a second file.

```markdown
# CloudBackend launch context
- tenant: acme                      # "none yet" until the user has created one
- administrator identity: emmaadmin
- developer identity: emmadev
- app: planboard (home://Applications/planboard/index.xml)
- what it does: project board for small agencies; agencies invite staff, clients read their own projects
- customers are: organisations (one group each) | individuals
- price plans: Starter €9/month, Team €290/year
- deployment name: planboard        # lowercase letters and digits only (so are safe usernames:
                                    # a username is part of a development deployment's host name)
- domain: app.planboard.se
- group id: (from the CLI command `groups`, needed for the price-plan mount)

## Progress
- [x] Tenant  - [ ] 1 Data model  - [ ] 2 Application  - [ ] 3 Login  - [ ] 4 Sign-up
- [ ] 5 Teams and roles  - [ ] 6 Price plans  - [ ] 7 Deploy

## Decisions
- 2026-10-06 14:26 UTC one group per agency; staff get a Member role with 3 on the agency's Projects container; how clients see only their own projects is decided in step 5
```

Stamp every dated line with the time and its zone, UTC by preference: the console shows local time, the
tenant's file times are UTC, and a journal that mixes them cannot be reconciled with either afterwards.

## Asking the user: one round, then defaults

The user is learning the platform, and every question costs them more than it costs you. Ask once, at the
start, for what has no default; after that decide, say what you decided in one line, and let the user
correct you. A first version with sensible defaults in an hour beats the right answers to twenty questions.

**The opening round**, three questions at most, each with a suggested answer, and none that the prompt
already answered (the launch page's prompt carries the first two):

1. The tenant's name, or "none yet".
2. The app's name and what it does, in one sentence, for whom.
3. "Look at the console's left menu: do you see **CRM** and **Price plans**? And do you edit in VS Code or Cursor
   with the CloudBackend extension?" This is the pre-flight; an early-access tenant has neither menu entry, and
   the answer decides steps 4 and 6 before any code is written. The extension you cannot see from here: without
   it every file goes up through the console's Upload Files dialog, so say what that costs and plan for it.

**Then the plan card**, in the same reply as the opening round, not after its answers: six lines the user
reads in a minute, each a decision you made and its reason, ending with "reply to change any of these;
otherwise I go on". Waiting for the answers first costs the user a second round trip before they see a
single default; a line that depends on an answer (sign-up and payment) names both branches until it comes.

- customers are individuals (each with their own data on `home://`) or organisations (a group each): inferred from the idea
- the one kind of record the first version keeps, and its three fields
- the screens: a list, a detail, New (the design kit's first version) and the direction of the look (xios3-app-design picks it from the idea)
- identities `<tenant>admin` and `<tenant>dev`; deployment name: the app's name in lowercase letters and digits
- sign-up and payment: the branch the pre-flight chose (CRM or manual onboarding; price plans or invoice)
- prices, the domain and a logo file: decided at their own steps, not now

**Per step, at most one question**, and only when a default would be wrong or cannot be undone: the tenant
name (it cannot change), a price, a domain, deleting data. Everything else takes the plan card's default. A
logo file is asked for at step 3 only if the user said they have one; a text mark is the default. The
e-mail provider is asked for at step 4, only when the pre-flight found the CRM.

**The first version is small on purpose**: one kind of record, list + detail + New, a login screen with the
app's name, deployed to Development. Everything else is the second version, after the user has used the
first. Say so in the plan card, so a small first version reads as the plan and not as a shortcut.

- **No tenant yet:** send them to db.cloudbackend.com. The form asks for an e-mail address, a password of at
  least 16 characters, the tenant name — lowercase letters a-z and digits 0-9 only; it becomes part of every
  address and cannot be changed later, so help them choose it — and a referral code from early access (early.cloudbackend.cloud). Wait for them
  to finish, then continue with the Administrator and Developer identities. Only Owner and Administrator
  roles exist at first: the Developer identity needs a role created for it (at least read on Identities
  and Roles) before it can sign in to the console.

## Credentials: never

Never ask for, accept or repeat a password, referral code, session token or API key. The user signs in to
the console themselves and clicks the owner-only buttons themselves. The CloudBackend plugin's tenant server
signs the user in on a page on their own computer: the form sends the password from their browser to
CloudBackend, and only the session is kept, never shown to you; give the user that page, never ask for the
password. When code must call the REST API, the user logs in in their own terminal and exposes the token to
the program through an environment variable; the code reads it from there. If the user pastes a secret into the conversation, tell them to
change it and do not use it. Never quote any part of it, not even a prefix to say which one to revoke: "the key
you pasted" is enough, and a prefix is part of the secret.

The same line covers identities: you never create an account or an identity on a hosted service and never
sign in as one, so every check that reads "sign in as a test user" or "create a test identity" is the
user's to run. Say so when the step starts, so they plan for it, and ask them to run those checks in a
**private window**: one session covers every CloudBackend host, and signing in as the test identity in the
console's own browser profile signs the console out (measured 2026-10-07).

When you drive the console yourself through a browser tool, each action that changes the tenant gets its
own yes, at the time: an upload that replaces a file, Deploy, Make Public, each promotion, an ACL or
proxy edit. A yes to "deploy" does not cover **Deploy Anyway** past the verifier's complaints; say what
the complaints are and ask again. Reading (the CLI's `ls`, `cat`, the properties panel) needs no yes.

## Working method

1. Read the launch context, then `references/launch-path.md`; say in one line which step is next and why.
   On a new project the first step after the tenant is the pre-flight; its answers go into the launch
   context as `branches:` (sign-up: CRM | manual; payment: price plans | invoice) and `files reach the
   tenant via:`.
2. Open the owner skill for that step and do the work there: produce the files (manifest, views,
   processes, datatypes) in the user's project, and give console actions as exact paths
   ("Deployments › Staging card › Configure Login Page…"). Mark owner-only actions as such. For step 2
   the first version is generated, not written: xios3-app-design's `designkit.py brief`, the mood board
   shown and one yes asked, `designkit.py app`, then the files go up; what the user asks for after
   using it is built with xios3-app-basics on that base.
3. End each step with its "check it worked" from the launch path. Tick the step in the launch context only
   after the user confirms the check; until then, say it is unverified. A deferred step (4b, 6b) is
   ticked as *deferred*, with the platform reason, never as done.
4. When a step touches something the product has not settled — password recovery, the CRM's release
   status, a payment test mode — say so at that step, with the source, instead of promising behaviour.
5. Keep the order unless the user has a reason: the data model shapes the app, roles shape the ACLs, the
   login screen is configured on a Staging card, and price plans need the published container.
6. Deploy a throwaway early, as soon as the first grid works. The wizard's verifier, what promotion does
   to the address and the login configurator are only visible from a deployment; meeting them first at
   step 7 cost a launch three extra push cycles.
7. Keep evidence per step: a screenshot of the check and, for anything the app writes, the stored document
   read back (CLI `cat`). It is what makes "do not tick until confirmed" workable, and it is what the
   user shows a colleague.

## Tools the user may have connected

Most users run Claude Desktop or claude.ai with these skills added under Settings › Capabilities, and no
terminal: plan for that. Files reach the tenant through the console's Projects section (the user uploads what you
write out), or the VS Code / Cursor extension when the user has it; scripts a skill ships (the design kit's
`designkit.py`) are run by the user only when they have a shell, and every skill says what to do by hand instead.
For documentation, the skills' bundled references come first: they are rendered from the CloudBackend developer
portal, and every topic link in them opens its page there. Check anything that changes (a REST card, a release)
against the portal page, not against a search result or another site.
When the user has no VS Code / Cursor extension, say what that costs before step 2 and plan around it: fewer,
larger files; versioned module names so a changed file is a new upload rather than a replace; and the
console's Upload Files dialog, which replaces by file name. An app with sub-folders needs its containers created
first and each folder uploaded into its own: xios3-app-basics `references/deployment-pipeline.md`, "Folders first".

| Tool | Gives you | Use it for |
| --- | --- | --- |
| The CloudBackend developer portal (https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud) | The documentation these skills are rendered from: every topic, the REST cards, the tutorials, search | The primary source: open the link a reference gives, and send the user there |
| MCP server **cloudbackend-docs**, if connected (it serves the same documentation) | `cloudbackend_docs`, `cloudbackend_rest`, `cloudbackend_rest_list`, `cloudbackend_sdk` | A quick lookup by name; when it and a reference disagree, the portal page decides |
| The CloudBackend plugin's other servers, if connected: **cloudbackend-build** and **cloudbackend-tenant** (part of the plugin, on the user's computer; the tenant server signs the user in on a page it opens, the password going from their browser to CloudBackend) and **cloudbackend-deploy** (CloudBackend's server for the user's own tenant; it signs in only once the account has its own sign-in realm) | `lint_project`, `benchmark_project`; `tenant_signin`, `tenant_status`, `enable_deploy_connector`; `list_projects`, `list_deployments`, `upload_project`, `deploy`, `verify_deployment` | xios3-app-workflow calls them at its phases and picks the route (deploy connector, tenant server, or the console with the user's help); files reach the tenant through `upload_project` and a deployment is verified by content |
| The CloudBackend PaaS console | Everything owner-only, and every click this path names | The user does these; give exact paths |
| Chrome extension **CloudBackend Developer Tools** | The documentation offline, the omnibox keyword `cbe`, a XIOS/3 inspector in DevTools, a Console for the tenant | The user inspecting a running app, or looking something up beside the console |
| The VS Code / Cursor extension and the CLI | Cloud source sync, IntelliSense; 70+ commands (`groups`, `publish`, `meta` …) | Editing projects locally; the CLI commands the steps name |

How to work with them:

- **Read before you write.** Ask the user what the console's Projects and Deployments sections show before advising
  on a project or a deployment, instead of assuming its state.
- **Writes need a yes.** Before the user uploads or deploys, say what will change (which project, which files, which
  stage). An upload replaces by file name, so list the files first.
- **Verify after.** After a deploy, have the user open the access URL or run the step's check; only then tick the step.
- **Cite what you used.** When a fact comes from a lookup, give its public link.

## Returning users: common tasks

The path is for the first launch. Afterwards most requests are one of these; route them to the owner skill and
finish with the same "check it worked" discipline.

| Task | Where to go |
| --- | --- |
| Add a field to a kind of object | singularity-database `datatypes.md`: change the datatype in `tenant://Settings/Datatypes`, and check there how objects that already exist get the new key/value |
| Add a screen or change one | xios3-app-basics `views.md` / `processes.md`, keeping the theme and the kit's patterns (xios3-app-design `layouts.md`); then redeploy Development and promote |
| Change the look (colours, fonts, a brand) | xios3-app-design: change the seeds in `design/design.json`, `designkit.py moodboard`, paste the new theme; never a hex in a view |
| Change who can see what | singularity-database `users-and-roles.md`: the container ACL in the Database Explorer, granted to a role or group; test with a test user |
| Add a customer organisation | a group with its roles; add members from the app (console invitations are not visible to customers) |
| Change prices | singularity-database `price-plans.md`: edit the plan; the container is already published |
| Ship a change | Development → Make Public → Shared → Mark Verified → Staging → Edit Login Page (logo = the Staging host's URL) → Mark Verified → Production; each promotion before Production moves the card and kills the previous address, Production keeps the Staging host (xios3-app-basics `deployment-pipeline.md`) |
| Onboard a customer by hand (no CRM) | `references/launch-path.md` step 4b: Identities › Create with no role, the Production address only, a private-window check, the register |
| Undo a bad release | Deployments › the Production card › Versions › Restore This Version |
| Move to another domain | Connect Domain on the Staging or Production card; A record → `83.140.241.4` |
| See usage and revenue | the Statistics section; purchase records in `/System/Purchases/` |
| Answer users | the Support desk (it needs at least one category) and the CRM's mails |

## The mistakes this path exists to prevent

- Giving customers a console role so they "can log in" — end users sign in through the app's login page
  and have no role by design.
- Granting ACLs to individual users instead of roles or groups.
- Naming objects from user text (forbidden characters) instead of a timestamp or counter.
- A deployment name with capitals, hyphens or underscores — lowercase letters and digits only.
- Secrets inside a deployed container — everything in it is publicly readable.
- Promising sign-up e-mail before the Owner has set up and deployed the CRM.
- Telling customers to accept group invitations in the console's notification pane — they cannot reach
  it. Add them from the application, and say the invitation markup is undocumented.
- Promising that the app can check whether a subscription is active: the manual documents the checkout
  and the record in `/System/Purchases/`, not a status check. Say so and design around it.
- Taking `purchase` from the `tenant` operation's reference card, which lists only createUser and
  deleteUser — the markup is in xios3-app-basics `selling.md`.
- Planning steps 4 and 6 on the manual alone: an early-access console may have no CRM and no Price plans
  section at all. The pre-flight finds out in a minute; the substitutes are steps 4b and 6b.
- Giving anyone an address before Production, or ever the console's address. Development, Shared and
  Staging hosts die on the next promotion; a role-less identity at the console is refused with a message
  that reads as "your product is broken".
- Testing as the customer in the browser the console is signed in to — it signs the console out. Private
  window.
- Writing to the database from JavaScript. A loaded document changed in JavaScript is a copy; the process
  writes (`database create`, `change` + `save`). Read the stored document back before believing a write.
- A relative or `data:` logo in the login screen. Only a full `https://` URL renders, and only the Staging
  host survives into Production.
- `version` on `<process>`, which the Deploy Wizard rejects; and stopping at the wizard's complaint about
  `<proxy>` under `channel`, which is the documented shape and is deployed with Deploy Anyway.
- Measuring a proxy's size limit with a body the provider accepts: a 1 MB probe was accepted, answered
  and billed twice. Probe with a body the provider must reject, or `max_tokens: 1` on the cheapest model.
- An AI proxy whose body the application may replace, behind an ACL that admits every customer, on the
  tenant's main key with no spend limit: every admitted identity can run any model at any length on it.
  Pin domain, path and headers; a key of its own with a monthly limit at the provider; usage read against
  the register (singularity-database `measured-on-a-tenant.md`).

## Bundled reference

- `references/launch-path.md` — From tenant to first customer: every step, its check, and what is not settled.

## Version and updates

This is version 2026.11.5.4 of the cloudbackend-saas-launch skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin (`claude plugin marketplace add rbcbe2025/expcbe`, then `claude plugin install cloudbackend@cloudbackend`)? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

Once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json. When its `skills[].version` for `cloudbackend-saas-launch` is newer than 2026.11.5.4, tell the user once, in one sentence, and give them the download (the `file` listed next to it). Do not interrupt the task for it.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fcloudbackend-saas-launch%2F2026.11.5.4&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fcloudbackend-saas-launch - it records the skill's name and version and nothing else. Never send it without that agreement.
