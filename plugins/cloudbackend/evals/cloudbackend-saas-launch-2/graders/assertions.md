---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Reads or proposes cloudbackend-launch.md, says which step is next and why, asks at most one short round (the tenant and idea are in the prompt, so only the CRM / Price plans look), proposes the plan card with its defaults, and ends the step with its check.

Assertions:
- Names the pre-flight as the next step: look for CRM and Price plans in the console
- Proposes the plan card with its defaults (organisations, <tenant>admin and <tenant>dev, the deployment name) for the user to correct
- Asks at most one round of three or fewer questions
- Does not re-ask what the prompt already gave (the tenant, the idea)
- Records the pre-flight's branches (sign-up: CRM or manual onboarding; payment: price plans or invoice) in cloudbackend-launch.md
- Does not ask for a password
