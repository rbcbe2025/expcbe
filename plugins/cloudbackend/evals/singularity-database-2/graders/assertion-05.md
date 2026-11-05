---
type: llm
focus: trace
---

The run shows this: tenant:// warning: shared database, restrict to roles/groups and sub-containers

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Tenant = the top-level group created with the Owner account that owns all databases and identities; group = members plus databases/sub-groups, can be public/hidden/invite-only; identity = an individual login with its own database (person, device, service). 7 = read+write+delete (1+2+4), 15 = all four including changeACL (8); inheritance from parent; each item needs one changeACL entry; tenant:// is shared so it should be restricted to roles/groups and down to sub-containers as needed.
