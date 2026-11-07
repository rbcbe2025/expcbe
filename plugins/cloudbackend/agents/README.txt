The XIOS/3 build agents (Claude Code; on clients without sub-agents cloudbackend-saas-launch does the same work in
order). Each file is an agent: frontmatter with name, description, model (inherit: the model the user runs) and, for
the two authors, the tools they may use; then its instructions.

  xios3-view-author      views only, desktop and phone, from docs/spec.md and the theme (build phase, W4)
  xios3-process-author   processes and their script modules, writes through operations only (W4)
  xios3-ui-tester        drives the deployed app through tests/ui-probes.md in the browser (verify phase, W5)
