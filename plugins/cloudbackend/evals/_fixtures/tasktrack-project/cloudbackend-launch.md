# CloudBackend launch context
- tenant: acme
- developer identity: acme
- app: tasktrack (home://Applications/tasktrack/index.xml)
- what it does: a task tracker for one person: their own tasks with a due date and a done list
- customers are: individuals
- deployment name: tasktrack
- branches: sign-up: manual | payment: invoice   (pre-flight: no CRM, no Price plans)
- files reach the tenant via: upload_project (cloudbackend-tenant, signed in on the user's sign-in page)
- client: Claude Code; browser tool: no; sub-agents: yes

## App
- v1: list, detail, New/Save/Delete, status toggle; v2: reminders, AI summaries, sharing a list
- record: task — title (text), status (open|done), notes (text); scope home://tasktrack/Tasks
- screens: list + detail (desktop); list, then detail with Back (phone); direction: studio
- login: yes (manifest login; configurator at W8); sign-up: manual (branch)
- channels: none in v1
- seo/geo: behind login, so no public surface; llms.txt and the about title only; analytics: none
- runtime: pinned (the console's default); deployment prefix "tasktrack" ok (not xios*)
- benchmark: measured + reference; react twin: off

## Progress
- [x] Tenant  - [x] 1 Data model  - [~] 2 Application (→ Build)  - [ ] 3 Login  - [deferred: CRM] 4 Sign-up
- [ ] 5 Teams and roles  - [deferred: Price plans] 6 Price plans  - [ ] 7 Deploy

## Build
- [x] W0 open — plan card 2026-11-05 08:02 UTC; client Claude Code; route tenant server; browser no
- [x] W1 spec — docs/spec.md: 4 features, 2 screens, 1 kind (task, 3 fields) · user yes 2026-11-05 08:10 UTC
- [x] W2 design — direction studio; design/ files · user yes 2026-11-05 08:20 UTC
- [x] W3 data — container home://tasktrack/Tasks, task.xdt, 3 seeds · user confirmed 2026-11-05 08:31 UTC
- [x] W4 build — lint build 0E/0W; upload 14 files ok; deploy dev https://acme-acme-tasktrack.cloudbackend.cloud 2026-11-05 08:40 UTC
- [ ] W5 verify
- [ ] W6 harden
- [ ] W7 document
- [ ] W8 ship — unverified: Shared, Staging and Production are the user's clicks; verify after each

## Benchmark
(not written yet)

## Decisions
- 2026-11-05 08:12 UTC AI summaries are v2: they need a proxy channel and a cost line first
