# The benchmark — method, fields, wording

Hand-written, 2026-11-04. The benchmark block says what this application cost and how it performs, with
a Source on every row, so a reader can tell a measurement from a citation. It has two parts that stay
apart: the **measured block**, produced by `benchmark_project` and the client, and the **reference
table**, bundled in `benchmark-baseline.md` and cited beside it. The two are never merged into one
"XIOS/3 is N times faster" line.

## Fields and how each is obtained

| Field | Source value | Claude Code | Claude Desktop, claude.ai, other agents |
| --- | --- | --- | --- |
| files, lines, bytes by type; views, processes, steps, operations, triggers, components, custom components | measured | `benchmark_project` over `app/` | the same tool through the build connector |
| build step | measured ("none") | by construction: the files are served as uploaded; the W4 evidence line shows upload → deploy → live with no compile | the same |
| active time to the first Development URL | measured | the context file's timestamps, W0 to W4 | the same |
| tokens in and out, cost | measured or not available | `/cost` (or the usage line of a non-interactive run), pasted into `client_fields` | "not available on this client" |
| Lighthouse (mobile, fresh profile, one route, dated) | measured, or user-run | Lighthouse CLI from a shell with Chrome | the user's DevTools panel, pasted, marked *user-run* |
| cold and warm load (median of 3) | measured or not run | the browser tool; cold = cache cleared | the user's reading, or "not run" |
| comparison with another framework | measured only with a twin | a twin built from the same spec, uploaded the same way, measured the same way | the same |

`benchmark_project` fills the Source column itself: `measured` for what it counted, `client-supplied`
for what the client passed in, `not-available` for what nobody could supply. The block it returns
(`block_markdown`) goes into `## Benchmark` and `docs/benchmark.md` as is; the reference table is added
below it with its citation line.

## Wording rules

- "measured on this app" (date, tool, route for Lighthouse) · "reference: the developer portal's rebuild
  from React, 2026-09-27" · "planned" · "not available on this client". No other verbs of comparison.
- No multiplier against another framework ("3 times smaller", "faster than React") unless a twin was
  measured on the same spec, the same host kind and the same Lighthouse settings. Then the row reads
  "measured: twin" and shows both numbers.
- "No build step" is a property, not a speed claim: the files are served as uploaded.
- Lighthouse always carries route, preset, profile and date, and the two caveats (the frame flatters
  LCP; SEO 63 on a prefix beginning with `xios` is the host's robots rule).
- Token cost is never estimated. A session that cannot read it writes "not available on this client".
- Lines of code count what a reader would maintain: XML, XSL, CSS and JavaScript in `app/`, not seeds or
  generated files; the tool lists what it counted.

## The opt-in twin

The one question at W9: "build the React twin for a like-for-like row? About twice the tokens and an
hour; default no." On a yes: a sub-agent (or the author, inline) builds the same `docs/spec.md` as a
small Vite + React application against the REST API with the cloudbackend-rest-api skill, its text-only
build output is uploaded through `upload_project` as a second project and deployed under its own name,
`benchmark_project` runs over both, the user runs Lighthouse on both with the same settings, and the
block gains a twin column. The twin is measured, so its rows may compare. Until then the comparison rows
say *planned*.

## The block, as an example

| Field | Value | Source |
| --- | --- | --- |
| files / lines / bytes | 14 / 612 / 31.9 KB (xml 23.4, xsl 4.1, css 2.2, js 2.2) | measured — benchmark_project 2026-11-04 |
| build step | none: files served as uploaded | measured — W4 evidence |
| active time to first Development URL | 70 min (W0 09:02 → W4 10:12 UTC) | measured — context timestamps |
| tokens / cost | 184k in / 31k out / 1.92 USD | measured — Claude Code /cost |
| Lighthouse mobile, Development, / | Perf 91 · A11y 100 · BP 100 · SEO 63 (host robots) · Speed Index 3.4 s | measured — user-run, fresh profile, 2026-11-04 |
| cold / warm load, / | 0.79 s / 0.61 s (median of 3) | measured — browser tool |
| React comparison | see the reference table | reference — benchmark-baseline.md |
| React twin of this app | not built | planned (opt-in) |
