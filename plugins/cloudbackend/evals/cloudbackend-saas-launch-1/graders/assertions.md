---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Sends the user to db.cloudbackend.com to create the tenant and describes the form (e-mail, 16+ character password, a tenant name that cannot be changed, the early-access referral code); Administrator identity, and a Developer identity with a role created for it; the order data model → app → login → sign-up/CRM → groups and roles → price plans with PayPal → deploy; customers get no console role; never asks for a password; offers to keep cloudbackend-launch.md.

Assertions:
- Points to db.cloudbackend.com and explains the sign-up form fields
- Administrator and Developer identities, with a role for the Developer
- Covers login, roles, price plans and deployment in order
- Mentions the PayPal checkout
- Customers get no console role
- Does not ask for a password
