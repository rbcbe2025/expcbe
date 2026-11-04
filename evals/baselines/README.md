# Reference transcripts for the `baseline` graders

`scripts/gen-evals.mjs` gives two cases a `baseline` grader, which passes a run that satisfies the case's expected
output at least as well as a reference transcript. The reference is `<case>.jsonl` here (the transcript of a run
judged good by hand, in the `.jsonl` form `claude plugin eval --json` records per run); the generator copies it
into the case as `baseline.jsonl` and writes `graders/baseline.md`. Until a case's transcript exists here, that
case has no baseline grader and the generator says so. The two cases: `xios3-app-workflow-2` (the lint traps) and
`cloudbackend-rest-api-1` (the REST script), the two where the plugin changes the answer most.
