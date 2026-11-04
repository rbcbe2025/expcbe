---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Runs lint_project (profile build) before any upload; names the four findings with their fixes: view.xml must be renamed (G02), <select>/<option> are flattened by the tenant and must become a component or listview XSL (G05), call uses value= (G04), version belongs on <about> (G01); notes the hex colour as a ship-profile finding (G10); uploads only after the errors are fixed; does not deploy with errors; a <proxy> under channel, if present, is reported as expected.

Assertions:
- Calls or describes lint_project before upload_project
- Names view.xml as a forbidden view file name
- Says <select> and <option> are flattened by the tenant and proposes a component or listview XSL
- Says call uses value= not step=
- Says version belongs on <about>, not on <process>
- Does not upload or deploy while lint errors remain
- Mentions the hex colour as a ship-profile rule (G10)
