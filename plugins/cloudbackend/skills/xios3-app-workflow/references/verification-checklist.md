# Verification — by content, by probe, by read-back

Hand-written, 2026-11-04. Three rules make a verification worth writing down: the deployment is proved by
content, not status; the UI is proved by probes that assert after every action; a write is proved by
reading the stored document back. The repair loop and the Lighthouse method follow.

## 1. The deployment, by content

Run `verify_deployment` after every `deploy` and after every promotion the user makes in the console:

| Field | Means | Pass |
| --- | --- | --- |
| `reachable`, `boots_runtime`, `runtime_version` | the address answers and the boot page loads the runtime | true, true, the pinned version |
| `index_xml_match` | the served manifest equals the stored one by checksum | **true — the only proof of "live"** |
| `mismatches[]` | files whose served checksum differs; `served_is_fallback_page` when the boot page came back instead | empty, or every entry explained (a file still landing: wait and rerun) |
| `login_gate.verdict` | the pipeline's login configuration and the manifest's stamp agree with the spec | `gated` when the spec says login, `open` when it does not, never `mixed` |
| `llms_txt` | `real`, `fallback` (the boot page) or `missing` | `real` when the plan card says a public surface |
| `slug_bound_to` | the drive the share refreshes from | the drive you upload to |

Without the connector: open the address in a fresh browser context, view the source of `/index.xml`,
and compare its first lines with the stored file; open a path that does not exist and note that it
answers with the boot page (so a 200 proves nothing); open the login screen and sign in as a role-less
test identity in a private window (the user's action).

## 2. The UI, by probes

`tests/ui-probes.md` lists the probes as action → expected state, one row per step of each screen's main
task, desktop first and then the phone width (390 px). Three rules, each learned from a test that passed
for the wrong reason:

1. **A fresh browser context.** A reused tab keeps old code and old storage; a stale service worker or a
   cached view tests the previous build. Never clear storage on a tab the user is signed in to; open a new
   context instead.
2. **Trusted clicks.** A synthetic `element.click()` does not fire the runtime's selection contract, so a
   component that works reports "does nothing". Click by coordinate through the browser tool; a drag is
   held about 250 ms before it moves.
3. **One assertion after each action.** An end-state check at the end of a sequence hides the step that
   failed, and a probe that only checks presence passes on the wrong kind of app. After every action,
   read the page (`read_page`, `find`) for the expected state, then the console for errors and the
   network tab for the CloudBackend calls the action made.

The phone pass: at 390 px nothing scrolls sideways, the list-then-detail navigation works, Back returns,
every control is reachable, and the words for every state are visible. Screenshot and operate the app
before reporting; a green probe list on a blank page is a probe list that asserted nothing.

On a client without a browser tool, hand the same table to the user with the exact URLs and the expected
state per row, and record their pass/fail per probe as *user-run*.

## 3. Writes, by read-back

A document changed in JavaScript is a copy; the process writes. For every probe that writes, read the
stored document back (`read_project_file`, or the CLI's `cat`, or the Database Explorer) and compare the
value; put the read-back in `evidence/`. xios3-app-basics "Pitfalls measured on a console-loaded
application" has the five write traps.

## 4. The repair loop

When a probe fails, in this order, because each step is cheaper than the next and explains most failures:

1. The browser console: an error names the file; a blank page with a clean console means the XML did not
   parse (open the file's URL and read it).
2. The trigger's `view`, `component` and `event` spelling against the reference (`xios3_event`,
   `xios3_component` in the docs connector); an event that does not exist fires nothing and logs nothing.
3. The expression paths (`{#view/component}`, `{$alias}`, `channel://doc#xpath`); a failed alias lookup is
   swallowed by the `call` operation, so a missing alias shows as "nothing happened".
4. Whether the component sits inside a panel, and whether a bind was issued while its panel was hidden
   (it never attaches; bind after the panel shows).
5. The network tab: a CloudBackend call that answered 4xx. The Chrome extension's DevTools panel matches
   each call to its REST card with credentials masked; the card says what the status means.
6. Async failures are quiet: a step that calls a module before its start step ran, or a promise that
   rejected, writes nothing to the console. Check for the start step (G06) and version the module's file
   name after a change (the runtime caches modules).

Fix the file, `lint_project`, upload, `verify_deployment`, and rerun the probe from a fresh context.

## 5. Lighthouse

Mobile, one route at a time, a fresh profile with no extensions, simulated slow 4G, Lighthouse CLI where a
shell with Chrome exists (`npx lighthouse <url> --preset=... --output=json`), otherwise the user runs the
DevTools panel and pastes the scores, marked *user-run*. Record route, preset, profile and date with the
scores. Two caveats apply to every XIOS/3 app served from a webshare (measured on the developer portal,
2026-09-27):

- **The Performance score flatters the app.** The runtime renders inside a frame, so Lighthouse's LCP
  measures the boot page; the honest visual number is Speed Index.
- **SEO 63 on a path beginning with `xios`** is the host's `robots.txt`, not the app (G18).

What moved the portal from 80 to 93: no icon font (3.7 MB for forty icons became 17 KB of SVG), the boot
script deferred with preloads for the runtime and the stylesheet, a minimum height on the page so the
footer does not shift, and a title on the runtime's frame. The same four fixes apply to any app here.
