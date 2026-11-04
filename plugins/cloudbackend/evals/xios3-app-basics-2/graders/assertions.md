---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: A bind operation with <component view= name= select=> pointing the grid at the tenant:// path, a trigger on the grid's Select event, and a step that reads the selection (alias/expression {#view/grid} or selection-based binding / setSelection) to bind or set the labels; explains {$alias}, {#view/component}, {channel://doc#xpath}; refers to the events/methods reference rather than inventing events.

Assertions:
- bind operation with <component view= name= select=> pointing the grid at the tenant:// path
- A trigger on the grid's Select event
- Uses the manual's #view#component expression form (not a slash) and explains {$alias} / {…} expressions
- Labels are set/bound from the selection in a step
