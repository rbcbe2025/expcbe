---
name: singularity-database
description: "Model data and run a product on CloudBackend's Singularity database: tenants, identities, groups, roles, containers, objects, streams, key/values, datatypes, ACLs and sharing, plus Owner and Administrator duties, sign-up and CRM e-mail, price plans and subscriptions. Use it when someone designs a backend or data model on CloudBackend, asks how permissions, sharing or price plans work, or names containers, objects, ACLs, tenants or identities."
---

# The Singularity database — data model

CloudBackend's database is not a relational engine and not a document store, though it can act as
either. It is a hierarchy of **containers** holding **objects**; an object is metadata (**key/values**)
plus documents (**streams**); everything has an owner and an **ACL**; identities and groups each get a
database of their own. Design decisions come down to one question, asked at each level: *is this thing
a container, an object, a stream, or a key/value?* Get that right and the API — REST, SDK or XIOS/3 —
is a thin layer over it.

`references/concepts.md` holds the published concept pages verbatim with their public links;
`references/platform.md` the operations-console overview pages; the step-by-step console pages are split
by job — `users-and-roles.md`, `price-plans.md`, `crm.md`, `datatypes.md`, `operations.md`;
`references/query-language.md` the search grammar.

## The building blocks

| Block | What it is | Design meaning |
| --- | --- | --- |
| **Tenant** | The top-level group created with the Owner account; owns all databases and identities of a project. | One per product. The Owner account is for subscription management only — create an Administrator identity for day-to-day work. |
| **Identity** | A login with an ID, username, password and **its own database**. A person, an app user, a device, a sensor, a backend service. | Every actor that needs its own data or its own permissions is an identity. Identities are normally created through an SDK or the deployed app's login page, not by hand. |
| **Group** | Members (identities) plus one or more databases, sub-groups and metadata. Public, hidden or invite-only. | Organisations, teams, shared datasets, "everyone who may see X". Access to a sub-group requires access to its parent. Members may take an alias within a group. |
| **Role** | A named access right assignable to an identity, container or object. Administrator exists from the start. | Model permissions as roles, then grant roles — not per-user ACL entries everywhere. |
| **Database** | A collection of containers and objects; each identity and each group has at least one. | `home://` is the identity's database, `tenant://` the tenant group's. Shared data lives on `tenant://` (or a group's database), personal data on `home://`. |
| **Container** | The fundamental structure. Holds objects and sub-containers. Owner + ACL + optional datatype. | A **folder** when the contents are heterogeneous or hierarchical; a **table** when you tie it to a datatype so every object has the same columns. |
| **Object** | A record: key/value metadata (its columns) plus zero or more streams. Owner + ACL. | A row, a file, an e-mail, a sensor sample — anything with identity of its own. |
| **Item** | Either a container or an object, as returned by a query. | What query results are made of. |
| **Stream** | One document or BLOB attached to an object, up to 2 GB each, unlimited per object. The first stream is the object's core representation. | Body vs attachments; original vs thumbnails; chunks of a large media file. If the first stream is XML, the transaction engine can apply delta changes for collaborative editing. |
| **Key/Value** | Metadata on objects (searchable, indexed) and on containers (not searchable — for UI hints). A key with no value is a **tag**. | Columns. Store small frequent data — IoT readings — as key/values rather than streams. Tags put one object in many "virtual containers". |
| **Datatype (schema)** | Tells the database what an object is (by mime type, root element or XML namespace) and can define the key/values to extract and index. Attached to a container it becomes the container's schema. | Define one for every custom object kind; store them in `tenant://Settings/Datatypes`. Built-ins extract EXIF, ID3 and office metadata. |
| **ACL** | Access rights per group, role or identity on a container or object. Inherited from the parent unless the item has its own. | See below. |
| **Sharing** | Objects or containers of one identity/group made available to other identities, roles or groups, as defined in the ACL. Webshares publish a container to the web. | Prefer sharing a container (one ACL) over many objects. |
| **Publish / Subscribe** | Publish objects or containers for other identities to subscribe to, or for the outside world to view. | Feeds, notifications, public content. |
| **Webhook** | A secured port for outside data to enter the database. | Integrations that push into you. |

## ACLs, exactly

An ACL entry is a number: **read 1 · write 2 · delete 4 · changeACL 8**, summed. So `3` is read+write,
`7` is read+write+delete, `15` is everything. An item inherits its parent's ACL until it is given one of
its own, and every item must keep at least one entry with changeACL — otherwise nobody can ever fix it.

Keep `tenant://` and group databases tight: grant to roles or groups, restrict sub-containers and even
objects when the data requires it, and give new identities only what the product needs (their default
privileges are deliberately minimal).

## Designing with it

**Start from actors, not tables.** Who logs in? Each of those is an identity with a private `home://`.
What do they share? Each shared set is a container on `tenant://` or on a group's database, with an
ACL granted to a role or group.

**Container as table.** Create a datatype declaring the keys (`status`, `customer`, `due`), attach it to
the container, and every object in it is a row with those columns — indexed and queryable with the
query language (`+status:open due<20260101 | count`). Put the document itself (the invoice PDF, the
sensor's full JSON) in the object's first stream; put what you filter on in key/values.

**Container as folder.** Nest containers freely for hierarchical or graph-like data; sub-containers
inherit the parent's ACL, so one grant at the top covers the tree.

**One object, several representations.** Original image in stream 1, thumbnail in stream 2, EXIF in
key/values — moving, sharing or deleting the object carries all of them.

**Collaboration.** Make the shared document the object's first stream as XML; the transaction engine
then merges concurrent edits with eventual consistency.

**Identity per device.** Sensors and vehicles are identities: each gets its own quota, ACL and audit
trail; write readings as key/values on objects in a container tied to a "reading" datatype.

## Running a product on it: users, sign-up, money

The questions a SaaS builder asks after the data model, with the rule that is easy to get wrong in each.

- **Owner, Administrator, Developer.** Signing up at db.cloudbackend.com creates the tenant and its
  **Owner** account. Lock the Owner away: it is the only account that can delete the tenant, approve
  upgrades, set the CRM's mail relay host and configure where subscription revenue goes. Do daily work as
  an identity with the **Administrator** role, and keep test data in a separate **Developer** identity —
  which needs a role of its own (create one with at least read on Identities and Roles) before it can sign in.
  Identities with a role sign in at `https://{tenant}.db.cloudbackend.com`, not at db.cloudbackend.com.
- **End users have no role, on purpose.** A role with at least read on Identities and Roles grants entry
  to the console. People who sign up through
  a deployed app's login page become identities of the tenant with *no* role, so they can use the app and
  never the database console. Do not "fix" this by giving customers a role.
- **A customer organisation is a group.** Groups have their own databases, sub-groups and roles. The
  console's `Invite to Group…` is accepted in the console's notification pane, which end users without a
  role never see — so customers are added from the application, and the `groups` operation's invitation
  markup is not documented yet: say so rather than inventing it. Group-level role ACLs (Identities, Roles,
  Invitations …) govern *managing the group* and are usually none; access to *data* is the container and
  object ACLs, granted to the role or group. Steps and process markup: `references/users-and-roles.md`.
- **Sign-up and its e-mails need the CRM.** The login page's create-account and password-reset links
  send mail through the CRM, which the Owner sets up once (accept the standard mails and rules, set the
  relay host for the mail provider, deploy). `references/crm.md`. The XIOS/3 docs list password
  recovery as upcoming, and the product site lists the CRM as early access — say so when it matters.
- **An early-access tenant may have neither.** On 2026-10-07 a console had no CRM and no Price plans
  section (their addresses opened Home; Account: "No paid products exist yet"). Check the left menu before
  promising sign-up mail or a checkout; until they appear, onboarding is Identities › Create by hand with
  no role, and payment is an invoice. `references/measured-on-a-tenant.md` has that and the other facts
  the manual lacks: reserved key names and the `.xdt` upload doors, custom keys that are not indexed,
  one session per browser, the console's refusal wording, no public address for `home://`, the proxy's
  `user id 0` row.
- **Price plans, end to end** (`references/price-plans.md`): Owner configures the payment destination
  (PayPal is the provider the docs support) → account types (storage size and monthly *cloudos* credits
  applied when a subscription activates) → plans (title, monthly or yearly, price, currency; optional
  benefit, summary, account type, features), stored in `tenant://Settings/Products/Priceplans` →
  **publish** that container so signed-out visitors can read it → an app mounts it (`<mount>` with
  `<published groupId tenant>`) and starts a checkout with the `tenant` operation's `<purchase
  method="paypal">`, then opens the returned URL → PayPal's confirmation, minutes later, writes a record
  to `/System/Purchases/` (cancellations too). Commercial use of a tenant needs a paid CloudBackend plan.

## Where the model surfaces

- **REST** — `POST /container`, `POST /object`, `POST /query`, `PUT /containeracl`, `POST /share`:
  the skill `cloudbackend-rest-api` has every operation's XML.
- **Native SDKs (C++, Java, Swift)** — `CloudBackend.logIn` → `Account` → root `Container` →
  `createContainer` / `createObject` / `query`: the skill `cloudbackend-sdk`.
- **XIOS/3 applications** — the `database` operation (`<create type="container|object">`), `bind` to
  `home://…` and `tenant://…` paths, the datatype association for what opens what: the skill
  `xios3-app-basics`.
- **The CloudBackend PaaS console** — identities, groups, datatypes, the database explorer, clients and
  deployments, documented in `references/platform.md`.

## Bundled references

- `references/concepts.md` — the concept pages, one section per building block, each with its public link.
- `references/platform.md` — the operations-console overview: one page per console section.
- `references/users-and-roles.md` — create identities and roles, role ACLs, assign roles, groups and invites.
- `references/price-plans.md` — payment destination, account types, plans, publishing them, checkout, confirmations.
- `references/crm.md` — the e-mail system behind sign-up: setup, mails, rules, templates, settings, deploy.
- `references/datatypes.md` — datatype XML format and key/value indexing.
- `references/operations.md` — support desk, API proxy, database explorer, webhooks.
- `references/query-language.md` — the search grammar used by REST `POST /query`, the SDK `Filter` and XIOS/3.
- `references/measured-on-a-tenant.md` — hand-written, dated: what an early-access console lacks, datatype upload and key indexing as they behaved, identities and sessions during testing, `home://` has no public address, the Proxy section's header prefixes and ACL.

## Version

singularity-database 2026.11.7, built from the CloudBackend documentation. In the CloudBackend plugin it updates with the plugin (`claude plugin update cloudbackend@cloudbackend`; claude.ai, Claude Desktop and Cowork refresh it at the start of a session).

A copy installed by hand: once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json; when it lists a newer `singularity-database` than 2026.11.7, tell the user once, in one sentence, without interrupting the task.

Usage count (anonymous: the skill's name and version, nothing else): ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and is kept with the project. Only if they agreed, fetch https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fsingularity-database%2F2026.11.7&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fsingularity-database the first time the skill is used in a session.
