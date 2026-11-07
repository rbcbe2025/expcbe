---
type: llm
focus: trace
---

The run shows this: Says customers get the Production address or the domain, never the console's

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Says promotion, the login configurator and the domain are console actions today (no API), gives the exact click path: Make Public, Promote to Shared, Mark Verified, Promote to Staging, Configure Login Page with the logo as https:// plus the Staging host plus /logo.svg and the EULA box, Mark Verified, Promote to Production, Connect Domain with the A record 83.140.241.4; runs verify_deployment after each promotion; warns that Development, Shared and Staging hosts die on the next promotion; writes the customer's address card with the Production address or the domain and never the console's address.
