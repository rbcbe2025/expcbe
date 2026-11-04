# Archived 2026-11-04: the hosted-connector check

`check-hosted.mjs` probed two connectors the plugin's `.mcp.json` once pointed at, a documentation server and a build
server hosted under CloudBackend's deploy host. Robin's decision of 2026-11-04 (plan, Phase 2): that host is
CloudBackend's live deploy server and nothing of ours hangs off it. The documentation and build servers now run
inside the plugin (`plugins/cloudbackend/servers/`), and `scripts/check-servers.mjs` checks them over stdio. The
`--pull` stub (merging a hosted miss log into the hub's reports) went with it; a local server has no shared log.
Kept for the Streamable HTTP client it carried (initialize, session header, SSE or JSON answers).
