---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Customers get no console role; each organisation is a group; role creation and addRole markup via the groups operation; container ACLs per role (Member 3, Client 1); notes that console invitations are accepted in a pane customers cannot reach.

Assertions:
- Customers get no console role
- Group per organisation
- groups operation with create type=role and addRole
- Container ACL numbers per role
- Notes the invitation limitation
