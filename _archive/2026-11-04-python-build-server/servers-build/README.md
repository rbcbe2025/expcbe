# cbemcp-build — the CloudBackend PaaS build tools

The three MCP tools that work on a XIOS/3 package **before it reaches a tenant** — no tenant, no
credentials, nothing written anywhere — as a pure Python package. `cbemcp`, the deploy server next
door, imports it for its hosted `/build` endpoint and for the tenant-side `lint_project`;
`python -m cbemcp_build` serves the same server over **stdio** for a client on the developer's own
machine, which is how the CloudBackend plugin for Claude Code runs it. Nothing here imports
`cbemcp`, nothing here talks to a network, and the dependencies are `mcp`, `xmlschema` and
`pydantic` only (no baxide, no requests, no JWT, no Keycloak).

| tool | input → output |
|---|---|
| `lint_project` | `files[{path, content}]`, `profile` `build` or `ship`, optional `rules[ids]` → `{ok, errors[{rule, file, line, message, fix}], warnings, info, stats{files, bytes, by_type}, grammar_version}` — the tenant grammar: G00 is the XSD validation the deploy server runs, G01–G20 the rules the schemas cannot express |
| `scaffold_project` | `spec{app, title, idea, item{kind, fields[{name, type, values}]}, data{scope, path, sample}, screens[], theme{direction, primary, seeds}, login, locale, channels[{name, proxy}]}` → `{files[{path, content}], notes[], design}` — the design kit's first version of an application, with the spec's extras applied |
| `benchmark_project` | `files[]`, `client_fields{client, tokens_in, tokens_out, cost_usd, active_minutes, lighthouse, timings}` → `{measured{…, build_step: "none"}, block_markdown, block_json, sources{field: measured / client-supplied / not-available}}` — the measured block of a benchmark report |

All three are read-only and deterministic, and carry a title and MCP annotations
(`readOnlyHint`, `idempotentHint`). The hosted endpoint and the stdio server register them
through the one `make_server()`, so their names, titles, annotations and descriptions cannot drift.

## Running it over stdio

```bash
python -m cbemcp_build            # standard output carries the MCP protocol and nothing else
```

Logs go to stderr, at `WARNING` unless `CBEMCP_BUILD_LOG_LEVEL` says otherwise (`INFO`, `DEBUG`).
The SDK's stdio transport takes over file descriptor 1 while it serves, so even a stray `print`
in a tool lands on stderr instead of the wire.

- From this checkout: `uv run python -m cbemcp_build` (uv builds `.venv` from `pyproject.toml`;
  Python 3.12 or newer).
- From a venv built with `requirements.txt` (pinned to what `cbemcp`'s `uv.lock` resolves):
  `python3 -m venv venv && venv/bin/pip install -r requirements.txt`, then
  `PYTHONPATH=/path/to/cbemcp-build venv/bin/python -m cbemcp_build`.
- Claude Code, without the plugin:
  `claude mcp add cloudbackend-build -- uv run --project /path/to/cbemcp-build python -m cbemcp_build`.

`cbemcp_build.make_server()` is the `MCPServer`; a host that wants the tools on another transport
calls it and runs the result.

## Layout

```
cbemcp_build/
  __main__.py          python -m cbemcp_build: the stdio entry point
  server.py            make_server(): the three tools registered on one MCPServer
  lint.py              the engine for G00–G20; tenant-grammar.json holds the rules (the one source
                       the workflow skill's prose is written from)
  scaffold.py          the design kit's generator as a pure function; designkit/ is the kit, vendored
  benchmark.py         the measured block of a benchmark report
  package.py           the package shape every tool works on, LintFile, and check_relative_path
                       (the path rule, a security control cbemcp's upload imports from here)
  schema.py            the application schema, the per-app custom-component schema, the xlink canary;
                       xsd/ holds the XIOS/3 schemas, vendored (xsd/README.md)
  xmltree.py           XML parsing that keeps line numbers
tests/                 stdlib unittest; test_server.py drives python -m cbemcp_build over a pipe
requirements.txt       the pinned dependencies, for a venv that runs the package from PYTHONPATH
check.sh               the two vendoring checks, then the tests
```

## Vendored inputs

Two things here are copies of their upstream, refreshed by a script and checked by `check.sh`;
never hand-edit the copy:

- **`cbemcp_build/xsd/`** ← the CloudBackend extension's `schemas/` (its checkout on the workspace
  reference shelf, or `CBE_EXT_SCHEMAS`): `./sync-xsd.sh`, or
  `./sync-xsd.sh --check`. The sync ends with the xlink canary (`xml_schema_check`).
- **`cbemcp_build/designkit/`** ← the documentation hub's `xios3-app-design` skill (`scripts/designkit.py`
  with a `VENDORED_FROM` marker, plus `assets/`; or `CBE_DESIGNKIT_SRC`): `./sync-designkit.sh`,
  or `./sync-designkit.sh --check`. `tests/test_scaffold.py` compares both generators' output on
  the example spec whenever the upstream checkout is present, and pins what the vendored schemas
  still reject in the kit's example (four item attributes, with XIOS/3 to settle).

## In the CloudBackend plugin

The Claude Code plugin (`cloudbackend/claude-plugin`) **vendors this package**: `cbemcp_build/`
into `plugins/cloudbackend/servers/build/src/cbemcp_build/` and `requirements.txt` into
`servers/build/requirements.txt`, copied by its `scripts/sync-servers.mjs` with a `VENDORED_FROM`
marker and a `--check`. The plugin's `SessionStart` hook creates a venv from those requirements
once, and `.mcp.json` runs `python -m cbemcp_build` with `PYTHONPATH` on `servers/build/src`.
Edit here, resync there; a change in the vendored copy is lost on the next sync. Every file the
plugin copies passes its publication guard, so nothing in `cbemcp_build/` or this README may name
a workspace path (a home directory, the hub, the sibling repositories); say what a thing is instead.

## Tests

```bash
./check.sh                                   # sync-xsd --check, sync-designkit --check, the suite
uv run python -m unittest discover -s tests -t .
```

Without `uv`, `check.sh` uses `.venv/bin/python` here, else the deploy server's venv next door
(`../cbemcp/.venv`, which carries the same three dependencies). `tests/test_lint.py` holds the
seeded project with the four traps (`views/view.xml`, a `<select>`, `call step=`, `version` on
`<process>`) that must yield exactly those grammar errors; `tests/test_server.py` pipes
`initialize`, `tools/list` and that `lint_project` call through `python -m cbemcp_build` and
checks that the four errors come back and that nothing but JSON-RPC reached stdout.
`cbemcp`'s own `check.sh` runs this one first.
