# CloudBackend's deploy connector

Hand-written, 2026-11-04. CloudBackend's own MCP server for one account, `https://mcp.cloudbackend.com/mcp/<tenant>`,
added by the user (it is not part of the plugin's default servers). It answers only for an account with its own
sign-in realm; until then the tenant server (`deploy-rules.md`) is the route.

**The sign-in realm.** The deploy connector checks every call against a token from the account's own
sign-in realm (Keycloak, one realm per account). An account created before that realm existed has none, and
then the connector cannot sign in at all: `/mcp` shows it as failed, not as waiting for a sign-in. The owner
or an administrator creates it with one call, `POST /keycloak` (REST card `postv1keycloak`);
`enable_deploy_connector` on the tenant server makes that call after the user's sign-in. It is a change to the
account and stays: ask before calling it. `tenant_status` reports whether the realm exists.

## Its tools

| Tool | What it does | What to read in the result |
| --- | --- | --- |
| `list_projects` | Lists the projects on `home` and `tenant` and marks which have an `index.xml` (deployable) | W0's proof that the connector and the tenant answer |
| `list_project_files`, `read_project_file` | Every file with path and size; one text file | The read-back after a write; what is really stored |
| `list_deployments` | The pipeline records: stage, URL, last history entry | Which stage each card is at before you promise anything |
| `lint_project` | The tenant grammar over the stored project (the build connector lints files you have not uploaded yet) | `errors` block; `warnings` go into the evidence line |
| `upload_project` | Writes the files into `<drive>://Applications/<name>/`, creates the sub-containers, re-lists to check each file landed, then validates against the schemas. Text only; 500 files, 2 MB each, 8 MB in all. **Replaces by path.** | `uploaded`, `validation`; a 409 on a file under `data/` (below) |
| `deploy` | Writes `index.html` and `.types.xml` into the project, creates the webshare, writes the pipeline record, returns the address `https://{tenant}-{user or group}-{name}.cloudbackend.cloud`. From `home`: a private Development deployment; from `tenant`: a public Shared one. | the `url`; then `verify_deployment` |
| `verify_deployment` | Fetches the served files and compares them by checksum with the stored project; reads the pipeline record and the served manifest for the login gate; checks `llms.txt`; says which drive the share is bound to | `index_xml_match`, `mismatches` (with `served_is_fallback_page`), `login_gate.verdict`, `slug_bound_to` |

What the connector does **not** do today, and where it is done instead (all **console**, with the click
path in `references/deployment-pipeline.md`): promotion to Staging and Production (frozen snapshots), the
login configurator, Make Public, Mark Verified, Connect Domain, binary uploads, a diff of local against
stored.

To add it in Claude Code once the realm exists: `claude mcp add --transport http cloudbackend-deploy https://mcp.cloudbackend.com/mcp/<tenant>`; elsewhere, a custom connector with that address.
