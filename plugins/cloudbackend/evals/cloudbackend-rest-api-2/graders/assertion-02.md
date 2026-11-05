---
type: llm
focus: trace
---

The run shows this: Required prefix + wildcard for the title: +report*

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Two curl calls to POST https://api.cloudbackend.com/v1/query with Authorization: WRAP access_token=$TOKEN and an XML <queryContainer> body containing <container id=.../> and <query>+report* -draft</query> with <order>updated</order>, plus a second body using the '| count' pipeline operator; explains the +/-/* grammar briefly.
