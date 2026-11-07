# Security and legal checklist — rows with a check each

Hand-written, 2026-11-04. This is a checklist for the W1 baseline and the W6 pass, not legal advice: it
names the things a small web application on CloudBackend PaaS has to have in order, how each is checked,
and what the platform does and does not do for it. The texts (terms, privacy notice) are the user's to
have reviewed; the workflow drafts placeholders and says so.

## Baseline at W1 (decided in the spec)

| Row | Decision in the spec | Why |
| --- | --- | --- |
| Data scope | per user on `home://`, or per organisation in a group | ACLs follow the scope; it cannot be changed cheaply later |
| Login | yes or no | a public app has a public surface; a gated one has none |
| Channels | each external service named with its proxy and its key's owner | every channel is spend and data leaving the tenant |
| Analytics | none, or one endpoint | consent and the privacy text depend on it |
| Texts | EULA (the login configurator shows it), privacy notice, copyright line | the configurator has an EULA box; the texts need a home in the app |
| Deletion | how a user's data and identity are removed | the CRM's standard mail where it exists; otherwise a documented manual runbook |
| Data location | where the tenant's data is stored, as the platform documents it | the privacy notice states it |

## Checks at W6

| Row | Check | Catches |
| --- | --- | --- |
| No secrets in the package | `lint_project` G12; read `app/` once more for hosts, names and prices that are not public | a deployed container is readable at the address before the login screen |
| Proxies pinned | each proxy channel pins the domain, the path and the headers so the application cannot redirect it; the key is the channel's own with a monthly limit at the provider; the proxy's ACL admits the roles the spec names | an AI proxy whose body the app may replace, behind an ACL that admits everyone, on the tenant's main key with no limit, lets any admitted identity run any model at any length (cloudbackend-saas-launch, "The mistakes this path exists to prevent") |
| Who the proxy admits | read the proxy's ACL rows; the manual does not say whether a `user id 0` row admits any signed-in identity or anyone at all | spend exposed to the public |
| ACLs to roles and groups | the Database Explorer shows every grant on the app's containers to a role or a group, never to an individual; test with a role-less identity in a private window (the user's action) | a customer with a console role; a grant that outlives a person |
| Login gate | `verify_deployment.login_gate.verdict` equals the spec (`gated` at Production; `manifest-only` until the Staging configurator saves); private visibility is not authentication, the themed login page is not access control | an app served open after a redeploy |
| Customer addresses | the customer gets the Production address or the domain, never the console's, never a Development, Shared or Staging host | a refusal that reads as "your product is broken" |
| Texts in place | the EULA box checked in the configurator and visible on the Production login screen; the privacy notice reachable from the app; the copyright line in `<about>` and the manual | the configurator's EULA box read as unchecked after Save on 2026-10-07; check the screen, not the form |
| Deletion path | the runbook exists (CRM mail, or Identities › Delete by the Administrator plus the data containers) and the manual names it | a request nobody can fulfil |
| Analytics consent | no analytics without a consent state the app keeps; the privacy notice names the endpoint | silent tracking |
| Sessions | every test as a customer in a private window; one session covers every CloudBackend host | the console signed out by a test (measured 2026-10-07) |
| Write confirmation | a browser tool that drives the console asks for a yes per action that changes the tenant | an upload that replaced a file nobody meant to replace |

## What the platform does for you, and what it does not

- Does: TLS on every address, a Let's Encrypt certificate for a connected domain, the login screen,
  identities and roles, container and object ACLs, proxies that keep keys out of the browser.
- Does not: a password-recovery flow on every tenant (documented as upcoming; it depends on the CRM), a
  subscription-status check, a captcha source for in-app sign-up without the CRM, a test mode for payments.
  `references/launch-path.md` "What is not settled yet" has the list with sources; say so at the row,
  with the source, instead of promising.
