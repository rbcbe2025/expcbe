---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Runs verify_deployment through the connector (content, gate, llms.txt) and hands the UI probes over as a checklist with exact URLs and the expected state per row for the user to run in a fresh private window; asks for pass/fail per probe; marks the results user-run; does not pretend to click anything.

Assertions:
- Runs or describes verify_deployment by content through the connector
- Hands over a probe checklist with URLs and expected states
- Asks the user to report pass or fail per probe
- Says to use a fresh or private browser window
- Does not claim to have clicked or seen the app itself
- Marks the results as user-run
