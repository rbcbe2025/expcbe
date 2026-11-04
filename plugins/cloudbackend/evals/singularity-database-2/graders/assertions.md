---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Tenant = the top-level group created with the Owner account that owns all databases and identities; group = members plus databases/sub-groups, can be public/hidden/invite-only; identity = an individual login with its own database (person, device, service). 7 = read+write+delete (1+2+4), 15 = all four including changeACL (8); inheritance from parent; each item needs one changeACL entry; tenant:// is shared so it should be restricted to roles/groups and down to sub-containers as needed.

Assertions:
- Tenant = top-level group created with the Owner account, owns databases and identities
- Identity has its own database
- 7 = read+write+delete and 15 = all four including changeACL
- ACL inheritance from the parent item
- tenant:// warning: shared database, restrict to roles/groups and sub-containers
