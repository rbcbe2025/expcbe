---
type: llm
focus: trace
---

The run shows this: Keeps <logo>logo.svg</logo> in the manifest (a file next to index.xml resolves against the app) and says the configurator needs a full https:// URL

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Keeps <logo>logo.svg</logo>: since 2026-11-05 a logo next to index.xml resolves against the app, so a missing logo points elsewhere (the file not uploaded, another deployment, a cached page: check the file's own address and a fresh private window); says the manifest login renders but counts as Configured only after the Staging card's Configure Login Page… saves, and that there only a full https:// URL works, with the Staging host (kept by Production) or the user's domain because every host before Staging is replaced on promotion; warns off data: URLs and the configurator's folder pick.
