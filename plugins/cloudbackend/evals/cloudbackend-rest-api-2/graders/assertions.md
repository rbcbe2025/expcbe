---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Two curl calls to POST https://api.cloudbackend.com/v1/query with Authorization: WRAP access_token=$TOKEN and an XML <queryContainer> body containing <container id=.../> and <query>+report* -draft</query> with <order>updated</order>, plus a second body using the '| count' pipeline operator; explains the +/-/* grammar briefly.

Assertions:
- Uses POST /query (or /querycontainer) with a <queryContainer> body
- Required prefix + wildcard for the title: +report*
- Exclusion for draft with the - prefix
- Sorts by updated via <order>updated</order>
- Count via the '| count' pipeline operator
- Sends Authorization: WRAP access_token=$TOKEN
