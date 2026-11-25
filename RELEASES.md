# Releases

One row per release, appended by `scripts/release.sh` (stage i). The version is
`plugins/cloudbackend/.claude-plugin/plugin.json`; the tag is `v<version>`; the marketplace, the update index and the
zip are copied into the hub's `public/public/plugin/`, which the developer portal serves at
`https://robinsbackend-robinsbackend-portal.cloudbackend.cloud/plugin/` (older zips stay there; the portal's share
before 2026-11-25, portalx, was lost on CloudBackend's side, so its marketplace address no longer answers), and `main` with its
tags is pushed to the `mirror` remote, the GitHub repository `rbcbe2025/expcbe` the marketplace reads (public since the
evening of 2026-11-04).

2026-11-04: repository created (plan milestone M1) with the published skills synced, then the five agents. Phase 2 the
same evening: the documentation and build servers moved inside the plugin (the build server rewritten as a
zero-dependency Node server, so nothing is installed beyond Claude Code), the deploy connector became per tenant from
`plugin.json`'s `userConfig`, the eval cases were generated. The first release, 2026.1104.1, was pushed from Robin's Mac
the same night (big's GitHub login has no push access); the repository went public right after it.

| Version | Date | Skills (hub index) | Servers (docs source commit; build in the plugin) | Notes |
| --- | --- | --- | --- | --- |
| 2026.1104.1 | 2026-11-04 | 2026-11-04 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped; portal and launch page deployed, servers checked live |
| 2026.1104.2 | 2026-11-04 | 2026-11-04 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1104.3 | 2026-11-04 | 2026-11-04 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.0 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.1 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.2 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.3 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.4 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.5 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.6 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1105.7 | 2026-11-05 | 2026-11-05 | docs: estate-docs commit 7e8271c3be1a · build: in the plugin | evals skipped |
| 2026.1107.0 | 2026-11-07 | 2026-11-07 | docs: estate-docs commit e69ae816481c · build: in the plugin | evals: evals/results/2026.1107.0-* (Opus 0.93 with, 0.20 without; Fable 0.90 on the 28 cases judged in full) |
| 2026.1108.0 | 2026-11-08 | 2026-11-08 | docs: estate-docs commit e69ae816481c · build: in the plugin | evals: evals/results/2026.1108.0-*, regrade-2026-11-08-*, regrade2-2026-11-08-* (Opus 0.90 with, 0.19 without; after the grader fixes saas-launch 0.93, basics 0.95; Fable 0.84 on 29 cases, all judged; $62.96) |
| 2026.1117.0 | 2026-11-17 | 2026-11-12 | docs: estate-docs commit e69ae816481c · build: in the plugin | evals: evals/results/rel1112-* (Opus 0.91 with, 0.20 without, 27 cases; Fable 0.87 on 27 cases, all judged; $60.76), run before the build server's lint fixes 33adc46 and b6aea8a, which carry their own tests |
| 2026.1120.0 | 2026-11-20 | 2026-11-20 | docs: estate-docs commit e69ae816481c · build: in the plugin | evals: evals/results/rel1120-* and rel1120b-* (Opus 0.88 with, 0.20 without, 31 cases; the 8 lower cases rerun once, 6 back to 1.00; Fable 0.87 on 31 cases, all judged; $66.97) |
| 2026.1122.0 | 2026-11-22 | 2026-11-22 | docs: estate-docs commit e69ae816481c · build: in the plugin | evals: evals/results/rel1122-* (the REST skill's 3 cases, with the plugin only: Opus 1.00, Fable 1.00; $3.35) |
| 2026.1125.0 | 2026-11-25 | 2026-11-25 | docs: estate-docs commit 7c58f2b6370f · build: in the plugin | evals skipped |
