# `xsd/` — XIOS/3 schemas (vendored)

**Upstream: [`cbe-vscode-extension/schemas/`](../../../../../_reference/cbe-vscode-extension/schemas/) — on the workspace reference shelf since 2026-09-07, as the extension is not authored in this group. Do not hand-edit these files here.** Refresh with `../../sync-xsd.sh` (set `CBE_EXT_SCHEMAS` if the checkout lives elsewhere).
Fix the schema in the extension, then re-run [`sync-xsd.sh`](../../sync-xsd.sh).

Last synced **2026-08-22**, from the extension at `cfb2142`.

| file | why it is here |
|---|---|
| `application.xsd` | the schema `schema.py` builds `application_schema` from — what `cbemcp`'s `deploy.py` validates a project manifest against and what `lint.py` applies as G00; `xs:include`s view + process |
| `view.xsd`, `process.xsd`, `lang.xsd` | included/imported by `application.xsd` |
| `xlink.xsd`, `xml.xsd` | W3C schemas, pinned locally via `XSD_LOCATIONS` in `schema.py` so validation never reaches the network |
| `datatype.xsd`, `help.xsd` | not referenced by `application.xsd` today; carried so the set stays whole and a future tool (datatype validation, help documents) does not have to go re-fetch them |

## Why these replaced the previous copies

The set that lived here until 2026-08-22 was an older, separately-patched lineage. Measured
against the extension's set on 2026-08-22:

- Over **526 real `index.xml` manifests** in the sample-application corpus and the operations
  repository, the extension's
  set accepted **every manifest the old set accepted, plus 3 more**. There was no manifest that
  the old set accepted and the new one rejects.
- Against the extension's own captured production fixtures
  (`cbe-vscode-extension/src/test/fixtures/manifests/`), the old set **rejected 6 of 7** —
  including `production-application-batch2.xml` and `resource-item-attributes.xml`. The
  extension's set accepts all of them. Those rejections were reaching users as
  `upload_project` / `deploy` refusing valid applications.

The two lineages had diverged in how they let manifests carry `xlink` attributes. The old
copies added an `xs:import` of the xlink namespace to `process.xsd` and `view.xsd` plus
explicit `xs:attribute ref="xlink:href"` declarations on a handful of types. The extension's
copies use `xs:anyAttribute namespace="… http://www.w3.org/1999/xlink" processContents="lax"`
on the component types, which also covers the `l:` localisation twins — broader, and the
reason the false rejections disappear.

(The ~400 manifests that neither set accepts are **in-VM CloudTop runtime blocks** —
`<application name version instances>` with inline `<view>`/`<style>` — which are a
different document shape and are not supposed to validate against the catalog manifest
schema. See the "Two different `<application>` shapes" table in
the `xios3-app` skill's `references/cloudbackend-deploy.md`.)

The pre-sync copies are kept at
[`_archive/xsd-pre-extension-sync-2026-08-22/`](../../../_archive/xsd-pre-extension-sync-2026-08-22/).

## Canary

`schema.py`'s `xml_schema_check()` runs at the end of `sync-xsd.sh`, in the tests, and at `cbemcp`'s
server start, and validates a manifest that uses `xlink:href` on both `<view>` and `<process>`. It exists so that a schema sync which drops
xlink support fails the server immediately instead of failing every user's deploy. Keep it.
