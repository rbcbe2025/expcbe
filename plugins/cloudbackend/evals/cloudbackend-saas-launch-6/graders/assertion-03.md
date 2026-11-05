---
type: llm
focus: trace
---

The run shows this: Describes handing the value over through a named component and a process step

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Says a document loaded and changed in JavaScript is a copy that is never stored; the write path is the process's change operation with a store select type=replaceText followed by save (or database create with content for a new object); hand the value from JavaScript to the process through a named transparent input and run the step with call; prove the write by reading the stored document back with the CLI's cat rather than from the screen.
