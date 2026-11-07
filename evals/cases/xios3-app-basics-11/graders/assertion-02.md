---
type: llm
focus: last_message
---

The run shows this: Explains that the runtime then keeps the session in the browser and resumes it on reload

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Sets session="true" on the manifest's <login> element: the runtime then keeps the session in the browser (localStorage, seven days of use, the expiry moved forward on each request) and resumes it on the next load; adds a visible Sign out that runs the runtime's logout (operation system with logout), which clears the stored session; designkit.py app --login writes both and designkit.py login checks them; never stores a password or token in the app itself.
