---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Takes the tenant server route: tenant_status, then tenant_signin for acme with open_browser false, opens signin_page in the desktop app's built-in browser and tells the user to sign in in that tab; does not read, screenshot or click in the sign-in tab while the user signs in; waits with tenant_status and wait_seconds, closes the tab once signed in; then upload_project with the local app/ folder (lint first), deploy, verify_deployment by bytes. Never asks for the password.

Assertions:
- Calls tenant_signin with open_browser false
- Opens the sign-in page in the built-in browser and tells the user to sign in there
- Does not read, screenshot or click in the sign-in tab before tenant_status reports the user signed in
- Waits for the sign-in with tenant_status and wait_seconds
- Never asks for or types the password
- Uploads the local app folder, deploys to Development and verifies with verify_deployment
