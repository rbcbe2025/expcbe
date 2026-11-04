---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: A runnable script: POST /login with HTTP Basic + Tenant header + <login /> body, parses <session> and <home> from <loginResponse>, sends Authorization: WRAP access_token=<session> on later calls, POST /container with <newContainer><container id/><childContainer>invoices</childContainer></newContainer>, POST /object with <createObject> carrying an atom:entry, parses XML responses with ElementTree, keeps ids as strings.

Assertions:
- Logs in with POST /login using HTTP Basic credentials
- Sends a Tenant header for the tenant
- Extracts the session token and sends 'Authorization: WRAP access_token=' on later calls
- Reads the <home> container id from the login response
- Creates the container with the <newContainer> body naming <childContainer>invoices
- Creates the object with a <createObject> body containing an Atom entry
- Parses responses as XML (ElementTree) rather than string-matching
- Does not use the requests library
