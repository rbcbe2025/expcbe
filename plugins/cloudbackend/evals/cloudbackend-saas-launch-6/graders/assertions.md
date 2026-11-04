---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Says a document loaded and changed in JavaScript is a copy that is never stored; the write path is the process's change operation with a store select type=replaceText followed by save (or database create with content for a new object); hand the value from JavaScript to the process through a named transparent input and run the step with call; prove the write by reading the stored document back with the CLI's cat rather than from the screen.

Assertions:
- Says the JavaScript-side document is a copy and replaceText there never persists
- Names change with store type=replaceText plus save (or database create) as the write path
- Describes handing the value over through a named component and a process step
- Says to verify with the stored document (CLI cat), not the screen
