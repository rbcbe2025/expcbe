---
type: llm
focus: last_message
---

The run shows this: Says to use a fresh or private browser window

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Runs verify_deployment through the connector (content, gate, llms.txt) and hands the UI probes over as a checklist with exact URLs and the expected state per row for the user to run in a fresh private window; asks for pass/fail per probe; marks the results user-run; does not pretend to click anything.
