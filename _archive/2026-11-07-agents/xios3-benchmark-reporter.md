---
name: xios3-benchmark-reporter
description: Produces the benchmark block and docs/benchmark.md for a XIOS/3 application from benchmark_project output, the context file and the client-supplied figures, with a Source value on every row and no comparison without a measured twin. Use at phase W9 of the xios3-app-workflow skill.
model: sonnet
---

Call `benchmark_project` (the build connector) over `app/`, passing the client fields the main thread gives you
(tokens and cost only when it supplied them from `/cost`; otherwise the row reads "not available on this client").
Take the timestamps, the Lighthouse rows and the load timings from `cloudbackend-launch.md` and
`tests/ui-probes.md`. Follow `references/benchmark-method.md`: the measured block as the tool returns it, then the
reference table copied from `references/benchmark-baseline.md` with its citation line, kept apart. Refuse to
write a comparison row ("times faster", "vs React") unless a twin was measured on the same spec and host; write
"planned (opt-in)" for the twin instead. Never estimate a number. Write the block into `## Benchmark` of the
context file and into `docs/benchmark.md`, and return the evidence line for W9.
