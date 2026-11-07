# The golden lint fixture

One XIOS/3 package (`package/`) with a trap for every rule of the tenant grammar it can carry, and
`expected.json`: the findings `cbemcp_build.lint` gives it in each case, plus the rule table (id,
profile, severity) of `cbemcp_build/tenant-grammar.json`.

Two implementations of `lint_project` read this folder: this package (`tests/test_golden.py`) and
the CloudBackend plugin's Node build server, which vendors the folder (its `scripts/sync-servers.mjs`)
and runs the same cases in its `servers/build/test.mjs`, both through `files` and through `dir`. Each
side also checks its own grammar file against the rule table, so the two grammar files cannot drift
apart on a rule's id, profile or severity without one suite failing.

What is compared, per case and per bucket (errors, warnings, info), in order: `rule`, `file`, `line`
and `message`. Left out:

- **G00**, which here is the XSD validation and in the plugin only a well-formedness check.
- **The fix texts**, which each engine reads from its own copy of the grammar.

| Case | Profile | Rules |
| --- | --- | --- |
| build | build | the profile's |
| ship | ship | the profile's |
| two rules | build | G05, G19 |

The package sets off every rule except G00, G15 (a font file over 200 KB) and G16 (the upload
limits): those two would make the fixture larger than the rules it tests, and each engine's own
suite covers them. Every file is text and ASCII except the one character G09 is there for.

When the grammar or the engine changes on purpose:

```sh
CBEMCP_BUILD_UPDATE_GOLDEN=1 PYTHONPATH=. .venv/bin/python -m unittest tests.test_golden
```

Review the diff of `expected.json`, commit it, then resync the plugin's copy
(`node scripts/sync-servers.mjs` in the plugin's repository) and run its build server's tests.
