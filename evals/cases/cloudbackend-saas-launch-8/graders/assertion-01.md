---
type: llm
focus: last_message
---

The run shows this: Calls or describes lint_project before upload_project

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Runs lint_project (profile build) before any upload; names the four findings with their fixes: view.xml must be renamed (G02), <select>/<option> are flattened by the tenant and must become a component or listview XSL (G05), call uses value= (G04), version belongs on <about> (G01); notes the hex colour as a ship-profile finding (G10); uploads only after the errors are fixed; does not deploy with errors; a <proxy> under channel, if present, is reported as expected.
