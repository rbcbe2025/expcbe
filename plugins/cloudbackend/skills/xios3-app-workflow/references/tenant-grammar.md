# The tenant grammar — what the deploy verifier and the tenant's runtime reject

Hand-written, 2026-11-04. A XIOS/3 application that runs on a local runtime can still fail on the tenant:
the deploy wizard's verifier is strict where a local runtime is forgiving, and the tenant's view dialect
rewrites some markup. These rules were met while taking production applications through the CloudBackend
PaaS console (one package produced over fifty verifier errors after passing every local check); each is
stated with its fix. `tenant-grammar.json` is the same table as data, the one source the build
connector's `lint_project` loads, so a finding from the tool and a row here say the same thing.

Profiles: **build** rules are errors before any upload; **ship** rules are errors before promotion and
warnings before; a **warning** never blocks. Rule G00 is the schema validation `upload_project` already
runs (the manifest and every XML file reachable through `xlink:href`, against the published schemas).

| Id | Profile | Rule | Fix |
| --- | --- | --- | --- |
| G01 | build | The manifest is `index.xml` with root `<application>`; `version` sits on `<about>`, never on `<process>` (the wizard refuses it: `'process' does not allow attribute 'version'`, measured 2026-10-07) | Move `version` to `<about version="…">` |
| G02 | build | No view file is named `view.xml`, and view names are unique across the package | Name views after their screen (`List.xml`, `Detail.xml`) |
| G03 | build | XPath in expressions uses only the functions the tenant's verifier accepts; `number()` was rejected on a tenant | Rewrite with the functions the reference documents (`string()`, `count()`, `concat()` …); the accepted list is published in `tenant-grammar.json` once measured again |
| G04 | build | The `call` operation names its target with `value=`, not `step=` | `<operation name="call" value="…"/>` (a bare `<call axis step>` is valid only inside `navigate`) |
| G05 | build | No `<select>`, `<option>` or `<a>` in a view: the tenant's view dialect flattens them silently. Raw HTML renders only through listview XSL | Use the reference's components (`combobox`, `button`, `link` …), or move the markup into a listview's XSL |
| G06 | build | A `<process>` with `<script href>` has `<step id="start">` | Add the start step; without it a cold `call` into the module can return "not found" and the failure is swallowed (measured on the hosted runtime, 2026-09-26) |
| G07 | build | Every `xlink:href` resolves to a file inside the package; no `..` | Fix the path or add the file |
| G08 | build | Custom component tags declared in `<components>` are NCNames and do not collide with native component names | Prefix them (`<CA_Status>`) |
| G09 | ship | Every served text file (XML, XSL, CSS, JS) is ASCII; non-ASCII characters are written as `&#x…;`, `\XXXX` or `\uXXXX` | Escape; a share may label a file ISO-8859-1 and garble UTF-8 (measured 2026-09-25) |
| G10 | ship | No hex colours in views or styles; exactly one scoped token block with literal values, and an explicit `font-family` (the default face is a serif) | Tokens in `layout/`, as xios3-app-design generates them |
| G11 | build | No `fetch(` or `XMLHttpRequest` to an external host in JavaScript; an external call goes through a proxy channel and `callService` | See ai-and-integrations-via-proxy.md |
| G12 | build | No key- or token-shaped strings anywhere in the package (`sk-…`, `AKIA…`, long base64 runs, `Bearer …`) | Move the value to the proxy's configuration; rotate it if it was committed |
| G13 | warning | A tenant-target package writes to `home://` without a guard: a public share has no `home://` drive, so an unguarded create shows a modal "Unknown drive" | Guard the step on a signed-in user, or write to the tenant container |
| G14 | ship | Render XSL uses `for-each` with `call-template` over node sets, not `apply-templates` with match patterns (560–690 ms against 8–12 ms for a 2,000-node tree, measured 2026-09-25); no `<br/>` | Rewrite the template |
| G15 | warning | A font file over 200 KB | A subset, or the runtime's own icon set |
| G16 | build | At most 500 files, 2 MB each, 8 MB in all, text only (the connector's upload limits) | Split, minify, or upload binaries through the console |
| G17 | info | `<proxy>` under a `channel` operation is reported as *expected: deploy with Deploy Anyway*, never as an error (the documented shape; the wizard complains, measured 2026-10-07) | Nothing; deploy through |
| G18 | ship | The deployment or URL prefix is `[a-z0-9]+` and does not begin with `xios` | Rename |
| G19 | build | Every trigger's `view` and `component`, and every `{#view#component}` reference, resolves to a named component | Name the component, or fix the spelling |
| G20 | build | With a `<login>`: the `xios://apps/login.xml` process is declared `xlink:actuate="onLoad"` before the main process, and the app's own view and process are `onRequest` | Reorder the manifest |

Reading a lint result: `errors` block the upload; `warnings` go into the evidence line with their ids;
`stats` (files, bytes by type) are the first rows of the benchmark. A rule the tool cannot judge (whether
the words for every state are there, whether a guard's logic is right) is the grammar reviewer's, or
yours without sub-agents.

## Measured, and to be measured again

- The verifier's complaints about `version` on `<process>` and `<proxy>` under `channel`: 2026-10-07.
- The start-step race, the ASCII rule, the `for-each` figure, the body-class rule: the hosted runtime
  2026.6.0, 2026-09-25 and 26 (xios3-app-basics, "Pitfalls measured on the hosted runtime").
- `number()` rejected, `<select>`/`<option>`/`<a>` flattened, the `home://` modal on a public share:
  measured on a tenant while deploying production applications; the accepted XPath function list is
  being re-measured and will be published in `tenant-grammar.json` with its date. Until then G03 is a
  warning on functions outside the XPath 1.0 core set and an error only on `number()`.
