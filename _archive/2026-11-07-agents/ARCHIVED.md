# The five workflow agents, as they were before 2026-11-07

The plan of 2026-11-07 cut the agents from five to three and moved them to the model the user runs:

- `xios3-grammar-reviewer` went: the review is `lint_project` (which now gives each rule's reason) plus the three
  judgement lines in cloudbackend-saas-launch's build phases. A sub-agent re-read the package and the grammar for it.
- `xios3-benchmark-reporter` went: `benchmark_project` returns the block with its Source column, and the skill copies
  the reference table beside it.
- `xios3-view-author`, `xios3-process-author` and `xios3-ui-tester` stay, rewritten (copies of the old bodies are
  here): `model: inherit` instead of `sonnet`, a tool list on the two authors, the markup looked up by name instead
  of reading views.md and processes.md whole (about 42K tokens a build), and the skill loaded through the Skill tool,
  because a sub-agent cannot resolve a path inside another skill.
