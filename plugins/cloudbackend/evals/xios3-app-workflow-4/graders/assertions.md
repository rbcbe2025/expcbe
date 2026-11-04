---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Says promotion, the login configurator and the domain are console actions today (no API), gives the exact click path: Make Public, Promote to Shared, Mark Verified, Promote to Staging, Configure Login Page with the logo as https:// plus the Staging host plus /logo.svg and the EULA box, Mark Verified, Promote to Production, Connect Domain with the A record 83.140.241.4; runs verify_deployment after each promotion; warns that Development, Shared and Staging hosts die on the next promotion; writes the customer's address card with the Production address or the domain and never the console's address.

Assertions:
- Says promotion and the domain are done in the console, not by a tool
- Gives the click path including Mark Verified, Promote to Staging, Configure Login Page and Promote to Production
- Names the A record 83.140.241.4 for Connect Domain
- Says to run verify_deployment after each promotion
- Says the logo must be a full https URL on the Staging host
- Does not invent a promote or connect_domain tool
- Says customers get the Production address or the domain, never the console's
