---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: One <application> document with a <view> (root panel, input, button, list — all named, components inside panels) and a <process> with <trigger view= component= event="Select" step=> elements, a step using the database operation <create type="object"> under home://Notes, an action operation clearing the input, and a bind of the list to home://Notes; says to store it in tenant://Applications (or home://) via the console/XMLPad or upload. No invented attributes like dock=.

Assertions:
- One <application> document containing a <view> and a <process>
- Components sit inside a top-level <panel>; input, button and a list/grid are named
- Trigger uses view/component/event="Select"/step attributes
- Creates the object with the database operation: <create type="object"> under home://Notes
- Clears the input with an action operation
- Binds the listing component to home://Notes
- Says where to store it: tenant://Applications (or home://) so it appears in Projects
- No invented layout attribute dock=
