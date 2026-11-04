---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Says a themed login page is not access control and private visibility is not authentication; the gate is the pipeline's login configuration plus the stamp in the served manifest, which a redeploy can drop; runs verify_deployment and reads login_gate.verdict; asks the user to confirm with a role-less identity in a private window.

Assertions:
- Says the themed login page is not access control
- Says private visibility is not authentication
- Names the pipeline login configuration and the manifest stamp as the real gate
- Runs verify_deployment after the redeploy and reads login_gate
- Suggests a role-less test identity in a private window
