---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Recognises the pre-flight: no CRM and no Price plans section means step 4 takes the manual-onboarding branch (Identities › Create with no role, send only the Production address, test in a private window, a runbook and a customer register) and step 6 the invoice branch; records both as deferred with the platform reason; warns that without a tool every file goes up through the console's Upload Files dialog and plans for fewer, versioned files; asks for nothing the step does not need; never asks for a password.

Assertions:
- Says CRM and Price plans are absent on this tenant and names the manual-onboarding and invoice substitutes
- Records steps 4 and 6 as deferred with the platform reason, not as done
- Says customers get the Production address only, never the console address
- Says test identities are the user's to create and to sign in with, in a private window
- Mentions the cost of having no upload tool (console dialog) and plans fewer or versioned files
- Does not ask for a password
