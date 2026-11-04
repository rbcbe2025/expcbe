---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Calls benchmark_project; every row has a Source value (measured, client-supplied, not-available); the tokens and cost row says not available on this client; the React comparison is the cited reference table from the portal rebuild, kept apart from the measured block; no 'times faster than React' claim; the Lighthouse row, if present, carries the LCP and robots caveats; the React twin is listed as planned (opt-in).

Assertions:
- Every benchmark row has a Source value
- Says token and cost figures are not available on this client
- Cites the portal rebuilt from React as a reference measurement, separate from the measured block
- Does not write a multiplier such as 'times faster' or 'times smaller' against React
- Lists the React twin as planned or opt-in, not built
- States that there is no build step as a property, not a speed claim
