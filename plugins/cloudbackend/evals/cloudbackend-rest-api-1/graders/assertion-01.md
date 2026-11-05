---
type: llm
focus: trace
---

The run shows this: Logs in with POST /login using HTTP Basic credentials

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: A runnable script: POST /login with HTTP Basic + Tenant header + <login /> body, parses <session> and <home> from <loginResponse>, sends Authorization: WRAP access_token=<session> on later calls, POST /container with <newContainer><container id/><childContainer>invoices</childContainer></newContainer>, POST /object with <createObject> carrying an atom:entry, parses XML responses with ElementTree, keeps ids as strings.
