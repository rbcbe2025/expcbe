---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Explains that a bare or relative logo value is resolved against the login application's own folder and that only a full https:// URL renders; that every host before Staging is replaced on promotion so the durable value is the Staging host (kept by Production) or the user's domain, set in the Staging card's Configure Login Page…; that the manifest login renders but counts as Configured only after the configurator saves; warns off data: URLs and the folder pick.

Assertions:
- Says the logo must be a full https:// URL, not a bare or relative name
- Says to set the final value in the Staging card's configurator, with the Staging host or the custom domain
- Says the manifest login works but Login: Configured comes only from the configurator
- Does not suggest a data: URL or the configurator's folder pick as the fix
