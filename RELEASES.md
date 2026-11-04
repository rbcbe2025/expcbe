# Releases

One row per release, appended by `scripts/release.sh` (stage i). The version is
`plugins/cloudbackend/.claude-plugin/plugin.json`; the tag is `v<version>`; the marketplace, the update index and the
zip are copied into the hub's `public/public/plugin/`, which the developer portal serves at
`https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/plugin/` (older zips stay there), and `main` with its
tags is pushed to the `mirror` remote, the private GitHub repository `rbcbe2025/expcbe` the testers' marketplace reads.

2026-11-04: repository created (plan milestone M1) with the published skills synced, then the five agents. Phase 2 the
same evening: the documentation and build servers moved inside the plugin (the build server rewritten as a
zero-dependency Node server, so nothing is installed beyond Claude Code), the deploy connector became per tenant from
`plugin.json`'s `userConfig`, the eval cases were generated. No release yet: the first one waits for the mirror push
from big once Robin has granted big's GitHub login access to the repository.

| Version | Date | Skills (hub index) | Servers (docs source commit; build in the plugin) | Notes |
| --- | --- | --- | --- | --- |
| 2026.1104.1 | 2026-11-04 | 2026-11-04 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped; portal and launch page deployed, servers checked live |
