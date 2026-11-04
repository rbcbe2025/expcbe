---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: One short opening round at most (the CRM / Price plans look), then a plan card: customers are organisations (a group each), one kind of record (project) with three fields, screens list/detail/new with the design kit's direction, identities acmeadmin and acmedev, deployment name planboard, sign-up and payment branches per the pre-flight, prices/domain/logo deferred to their steps; says the first version is deliberately small; does not ask about prices, domains, e-mail providers or a logo now; hands the look to xios3-app-design.

Assertions:
- Proposes a plan with stated defaults (customers, the record and its fields, the screens, the identities, the deployment name) instead of a list of questions
- Asks at most one round of three or fewer questions
- Does not ask about prices, a domain, an e-mail provider or a logo at this point
- Hands the look and the first version to xios3-app-design (a brief, a mood board, a token theme)
- Does not ask for a password
