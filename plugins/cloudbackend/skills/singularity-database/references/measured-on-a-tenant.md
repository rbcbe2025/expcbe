# Measured on a tenant — what the console did on 2026-10-07

Hand-written from the first SaaS launch that went through the console end to end, on an early-access tenant.
Each fact below is either missing from the manual or contradicts it; the manual's pages are in the other
references. Dates are given because the console changes.

## What an early-access console has and lacks

- Present: Projects, Deployments, Datatypes, Database (explorer), Proxy, Webhooks, Identities, Service
  Helpdesk, Statistics, Clients, CLI, Documentation.
- **Absent: CRM and Price plans.** Their addresses open the Home page, and Account says "Early access
  preview. No paid products exist yet." Sign-up mail, password recovery and in-platform payment are
  therefore not available on such a tenant, and `tenant › createUser` from an application needs a captcha
  `token` the manual does not source. Onboarding is Identities › Create by hand, payment is an invoice,
  until the sections appear.

## Datatypes

- The file needs the `.xdt` extension, and `tenant://Settings/Datatypes` accepts writes from the Owner and
  Administrators, not from a Developer identity.
- Two doors put it there: the **Datatypes** section's toolbar **Upload**, or the CLI (`cd
  Settings/Datatypes`, then `upload`). The Database Explorer path the manual describes was not found.
- **Reserved key names** (`title`, `author`, `date`, `id`, `name`, `summary`, … — the Datatypes page lists
  them) silently do nothing as index keys. Name the key outside the list; the element in the document can
  keep its natural name.
- After upload, custom keys showed **Indexed: NO**; cloud-side extraction did not run on upload and did run
  from the CLI's `extract <object>`; a `query -w` filter on a custom key was not applied (a control query
  that should have excluded rows returned them). What the datatype reliably gives today is display: the keys
  as columns in the explorer and in bound components. Prove filtering with a control query before an
  application depends on it. The manual's "lock a datatype to a container as its schema" has no location in
  the console, the CLI or the markup.

## Identities, sessions, the console

- An identity without a role that opens the console's address is refused with "Unfortunately your role
  does not have permission to use this tool". That is by design (end users have no role), but the wording
  reads as a product fault to a customer: never give a customer the console's address.
- The same wording met the first other identity at a **Private** Development deployment's address; it
  passed after Make Public, but a session collision (next point) was under way at the same time, so the
  cause is not settled. Make Public before any second-identity test either way.
- **One session per browser profile** across every `*.cloudbackend.com` and `*.cloudbackend.cloud` host.
  Signing in as a test identity in a normal tab replaced the console's session. Test identities belong in a
  private window.
- A customer's first sign-in at a deployment creates their `home://` containers silently and lands on an
  empty application; the application's empty state should say what to do first.

## `home://` data has no public address

The publication viewer reaches a `home://` file through authenticated endpoints only, and the public
`wsg0…` addresses belong to group webshares. Per-user data therefore has no anonymous URL; anything that
must be reachable without a session (a logo for the login screen, a static page) is served from a
deployment or a group share, not from an identity's drive.

## The Proxy section

- **Create** offers header prefixes Bearer, Digest, Basic, Hawk and AWS only. A provider that wants
  `x-api-key` needs the generated XML edited afterwards (right-click the proxy › Edit opens the code
  editor); the generated XML on 2026-10-07 also carried a stray backtick and a `Bearer ` prefix to remove.
- The ACL row **user id 0 — Read** is what admitted role-less identities to the proxy; no "Public Access"
  entry was needed. Whether user id 0 means any signed-in identity or anyone at all is not documented, and
  it decides what the API spend behind the proxy is exposed to. Pair the proxy with a usage check
  (Statistics, the provider's dashboard) until it is.
- Everything the proxy forwards is billed to the tenant's provider account, and the platform gives an
  application no way to check a user's subscription. State that pair of facts together when the
  application's design is decided.
- **What an overridable body exposes.** The format requires `allow-override="true"` on `http-data` for a
  body the application builds, and the measured proxy had exactly that, with the domain and the headers
  pinned (`allow-override="false"`). So every identity the ACL admits can send any body on the tenant's
  key: any model, any `max_tokens`, any prompt. The format offers nothing that caps a body it lets the
  application replace. Pin the domain, the path and every header; give the proxy a key of its own with a
  monthly spend limit at the provider; and read the provider's usage against the customer register.
- **Probing a proxy's limits costs real money.** A 1 MB body sent to find the size limit was accepted by a
  large-context model, answered, and billed twice. Probe with a body the provider must reject (over its
  context window) or with `max_tokens: 1` against the cheapest model.
