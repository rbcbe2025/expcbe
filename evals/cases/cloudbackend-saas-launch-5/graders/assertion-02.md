---
type: llm
focus: last_message
---

The run shows this: Says the login lives in the app's own index.xml, set in Development (by hand or with Add login screen...), not on a deployment card

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Keeps <logo>logo.svg</logo>: since 2026-11-05 a logo next to index.xml resolves against the app and follows each version to its new address, so a missing logo points elsewhere (the file not uploaded, another deployment, a cached page: check the file's own address and a fresh private window). On the console's Deployments board (measured 2026-11-27) the login is part of the app's code and no card has a login action: Development › Add login screen... (Edit login screen... once there is one) writes the same <login> element into index.xml, and a frozen version keeps the login it was frozen with. The Live card's Login: row reads that version's index.xml (Show Files shows it), so Not Configured means the version was frozen without the login: set it in Development, then Test as a new version, Mark as Verified and Make Live. A logo typed into the form as an https:// address belongs on the user's own domain, never a Test or Live host, which dies with its version; no data: URL and no folder pick.
