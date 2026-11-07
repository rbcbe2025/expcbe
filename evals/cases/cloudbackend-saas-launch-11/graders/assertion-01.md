---
type: llm
focus: trace
---

The run shows this: Every benchmark row has a Source value

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Calls benchmark_project; every row has a Source value (measured, client-supplied, not-available); the tokens and cost row says not available on this client; the React comparison is the cited reference table from the portal rebuild, kept apart from the measured block; no 'times faster than React' claim; the Lighthouse row, if present, carries the LCP and robots caveats; the React twin is listed as planned (opt-in).
