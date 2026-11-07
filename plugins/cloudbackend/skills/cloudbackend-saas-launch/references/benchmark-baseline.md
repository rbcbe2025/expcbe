# The reference baseline — the developer portal rebuilt from React

Hand-written, 2026-11-04, from the measurements published with the CloudBackend developer portal's own
rebuild: the same 3,069 documentation topics served first by a React/Vite reader and then by a XIOS/3
application on a CloudBackend webshare, measured side by side in September 2026. Every row below is a
**reference** measurement of that portal, cited as such; none of it is a measurement of your app, and
no multiplier from here may be written about your app (benchmark-method.md, "Wording rules").

Citation line to copy under the table: *reference — the CloudBackend developer portal rebuilt from
React, Lighthouse 13.4.1 mobile with a fresh headless Chrome 153 profile, 2026-09-27 and 28; load timings
from a page-side probe, median of 3, same machine.*

## Lighthouse, mobile, one route at a time (2026-09-27)

| Route | Perf | A11y | Best practices | SEO | Agentic | Speed Index | TBT | TTI | Weight |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| XIOS/3, CloudBackend home | 93 | 100 | 100 | 100 | 100 | 4.1 s | 250 ms | 8.9 s | 1,455 KiB |
| XIOS/3, XIOS/3 home | 94 | 100 | 100 | 63 | 100 | 4.1 s | 220 ms | 9.2 s | 1,470 KiB |
| XIOS/3, a component article | 92 | 100 | 100 | 63 | 100 | 4.2 s | 290 ms | 9.8 s | 1,534 KiB |
| React, CloudBackend home | 70 | 100 | 100 | 100 | 67 | 2.8 s | 40 ms | 31.3 s | 6,116 KiB |
| React, a component article | 70 | 98 | 100 | 63 | 65 | 2.7 s | 5 ms | 42.3 s | 8,291 KiB |

With the boot page's preloads (2026-09-28) the XIOS/3 routes moved to Perf 93–98 and Speed Index
3.2–3.6 s; React stayed at 70 and 2.8 s.

**The two caveats, verbatim from the measurement:** the Performance score flatters the XIOS/3 app,
because Lighthouse's LCP counts only the top document and the app renders inside a frame, so the honest
visual number is Speed Index (XIOS/3 3.9–4.7 s before preloads against React's 2.7 s, while React's
content paints late, LCP 31–42 s, behind 6–8 MB of uncompressed JSON); and SEO 63 on every XIOS/3 route
is the host's `robots.txt` rule for paths beginning with `xios`, which applies to the React share too.

## Load time and bytes (2026-09-27 and 28)

| Median of all routes | XIOS/3 before preloads | XIOS/3 with preloads | React |
| --- | ---: | ---: | ---: |
| Cold load (cache cleared) | 814 ms | 466 ms | 433 ms |
| Warm load | 694 ms | 293 ms | 198 ms |

Bytes moved on a cold load: the XIOS/3 portal about 1.5 MB (the runtime 1.23 MB compressed by its host,
the share's own files 239 KB); the React portal 6.1 MB, mostly JSON the share sent uncompressed. A warm
XIOS/3 load moves 23 KB.

## With and without the skills

In the skills' own evaluation runs (iteration 1, the xios3-app-basics prompts), the assistant passed
every assertion with the skill installed and about a third of them without it, at the cost of about 140
seconds more per task and about 136,000 more tokens read. Cited as *reference — skill evaluation,
iteration 1*; it says what the references cost and buy, not what an app costs.

## Not a number

A dataset of a prototype migrated from a no-code builder to XIOS/3 exists in CloudBackend's materials
with lines-of-code and load-time figures; it is labelled *illustrative sample, not customer results* and
is never cited as a measurement.
