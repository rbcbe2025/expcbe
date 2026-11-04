The XIOS/3 workflow agents (Claude Code only; the xios3-app-workflow skill runs the same five bodies as inline
checklists on clients without sub-agents). Each file is an agent: frontmatter with name, description and model,
then its instructions. No tools line: the body names the connector tools to use.

  xios3-view-author         views only, from docs/spec.md and the token theme (W4)
  xios3-process-author      processes and their script modules, writes through operations only (W4)
  xios3-grammar-reviewer    read-only: lint_project, then what a tool cannot judge; a findings table (W4, W6)
  xios3-ui-tester           drives the deployed app through tests/ui-probes.md in the browser (W5)
  xios3-benchmark-reporter  benchmark_project plus the reference table, a Source on every row (W9)
