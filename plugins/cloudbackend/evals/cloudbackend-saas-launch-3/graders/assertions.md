---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Checklist: Administrator identity, Developer identity with a role created first (read on Identities and Roles), sign-in addresses db.cloudbackend.com for the Owner and acme.db.cloudbackend.com for identities, Owner kept for owner-only tasks; writes cloudbackend-launch.md; no password requests.

Assertions:
- Administrator identity
- Developer identity
- Owner kept for owner-only tasks
- Identity sign-in address
- Writes cloudbackend-launch.md
- Does not ask for a password
