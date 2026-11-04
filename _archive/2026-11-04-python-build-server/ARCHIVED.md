# Archived 2026-11-04: the Python build server route

Until the evening of 2026-11-04 the plugin's build server was the Python package `cbemcp-build` (the deploy server's
codebase), vendored here under `servers/build/` with a `SessionStart` hook (`hooks/hooks.json` ->
`scripts/ensure-build-venv.sh`) that made a Python 3.12 environment in `${CLAUDE_PLUGIN_DATA}` once, and a launcher
(`scripts/run-build-server.sh`) because Claude Code expands `${CLAUDE_PLUGIN_DATA}` in a server's args and env but
not in its command. It worked (commit cd0afad: three tools connected in a Claude Code session on big), and it needed
Python 3.12 or uv on every machine.

Robin's decision the same evening: the plugin must start on every machine with nothing installed beyond Claude Code.
The build server is now `servers/build/index.mjs`, a zero-dependency Node port of the reference's `lint.py` and
`benchmark.py` (two tools: `lint_project`, `benchmark_project`; no `scaffold_project`, the design skill covers
scaffolding and the Python generator stays server-side). The Python package stays the server-side implementation
behind the deploy connector, in its own repository; `scripts/sync-servers.mjs` syncs the documentation server only.

What is here: the vendored copy as it was synced (commit 981dfa9 of its repository), the hook, the venv script and the
launcher. `scripts/check-hosted.mjs` of the morning is in `_archive/2026-11-04-hosted-connectors/`.
