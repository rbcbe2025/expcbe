# Deploy rules — what the tools do, and the rules underneath

Hand-written, 2026-11-04. The routes files take to the tenant, and the order to try them, are in `build-phases.md`
(W0); this page is what the tenant server's tools do and return, the facts a tool cannot hide (a 409, a stuck share,
a page that is not the page), and the REST rules for pushing files by hand. An account that added CloudBackend's
deploy connector: `deploy-connector.md`. The console's own wizard and stages are in xios3-app-basics
`references/deployment.md` and `references/deployment-pipeline.md`.

## The tenant server (`cloudbackend-tenant`, inside the plugin)

| Tool | What it does | What to read in the result |
| --- | --- | --- |
| `tenant_signin` | Opens a sign-in page on `127.0.0.1` for 15 minutes in the default browser; the user signs in there (and enters the e-mailed code when the account uses one). With `open_browser: false` it only starts the page, for a client that opens it itself, as the Claude desktop app does in its built-in browser | `signin_page`: open it in the built-in browser or give it to the user; leave the tab to them; never ask for the password |
| `tenant_status` | Signed in or not, identity and role, whether CloudBackend still accepts the session, whether the realm exists; `wait_seconds` waits for an open page | `signed_in`, `role`, `deploy_connector` |
| `list_projects` | The folders under `home://Applications/` and `tenant://Applications/`, and the identity's webshares with what each serves and its stage | which address already serves what |
| `upload_project` | Copies the local package folder (`path`, the one holding `index.xml`) to `home://Applications/<project_name>/`; lints it with profile `build` first and uploads nothing while an error stands; binaries included; dot-files and `node_modules` left out. **Replaces by path; deletes nothing.** | `uploaded`, `lint`, `on_the_tenant_not_in_the_folder` |
| `deploy` | Writes the boot page `index.html` and `.types.xml` into the project, creates the webshare or reuses the one that already serves this project, writes the console's pipeline record when there is none (an existing record is left alone), returns `https://<tenant>-<identity>-<name>.cloudbackend.cloud`. Development only; refuses an address that serves another project | `url`, `share` (created or reused), `pipeline` |
| `verify_deployment` | Fetches the served files anonymously and compares their bytes with the local folder (`path`) or the stored copy; names the boot page when it answered instead; reads the login gate from the pipeline record and the served manifest, as the deploy connector does | `verdict`, `index_xml_match`, `mismatches` with `served_is_fallback_page`, `share.bound`, `login_gate.verdict`, `slug_bound_to` |
| `enable_deploy_connector` | Creates the account's sign-in realm (owner or administrator only) | `realm`: created or already exists |
| `tenant_signout` | Ends the session at CloudBackend and deletes it from the computer | `signed_out` |

The session lives in a file only the user can read and is never in a tool result; a 401 deletes it, and
`tenant_signin` starts a new one.

The sign-in page and where it opens (the desktop app's built-in browser, a terminal's default browser, never over
SSH): `build-phases.md`, W0. Promotion beyond Development is a console step on every route.

## Facts a tool cannot hide

- **A 409 on a seed is correct.** The deployer keeps documents that already exist under `data/`, so a
  redeploy answers 409 for each seed and that is the kept data, not a failure. Never delete `data/` to
  "fix" it: the documents in it are the users' records once the app has run.
- **Every path answers 200.** A webshare answers any unknown path with the boot page (`index.html`),
  status 200. So a 200 proves nothing; `verify_deployment` compares the served `index.xml` with the stored
  one, and reports `served_is_fallback_page` when a path came back as the boot page.
- **The publish-then-load race.** A page loaded while an upload is still landing can receive the boot
  page in place of a view, and the runtime caches it as the view. Load nothing until `verify_deployment`
  reports a match; if it happened, a fresh browser context clears it.
- **A share is bound to the drive it was created from.** A share created from a `home` project never
  refreshes from a `tenant` upload; the address keeps serving the old files. `slug_bound_to` says which.
  A share that sticks on a stale copy, or a slug that is taken, is not repaired by re-deploying: the name
  is taken for good, so deploy under a new name (`<name>v2`) and point the domain at it.
- **The pipeline record.** The console keeps one record per project under the tenant's Settings, in a
  folder per project. A record written elsewhere is not shown on the Deployments page even though the
  share works; `list_deployments` reads what the console shows.
- **A deployed container is public.** Everything in it is readable at the address before the login
  screen; `references/project-layout.md` says what may be there.
- **The gate can drop.** The login gate is the pipeline record's login configuration plus a stamp in the
  served manifest. A redeploy, or a promotion done by a script, can serve the app without it for minutes;
  on one measured redeploy a gated app served open for about two minutes before the gate was restored.
  Verify after every change that touches the deployment, not once.

## The console route and the REST rules

On the console route files reach the tenant through the console's Upload Files dialog (CLI `upload`, after `cd` into the
app's container; it replaces by file name), the VS Code / Cursor extension, or your own REST calls with
the cloudbackend-rest-api skill. For sub-folders, "Folders first" in `references/deployment-pipeline.md`:
create the containers before their files, each folder into its own container.

Rules that cost a push cycle each when learned the hard way (REST):

- Create a container, then resolve it by name before creating again: container creation is not
  idempotent, and a second create makes a duplicate folder with the same name.
- A document upload is a binary body with the file name in the `X-File-Name` header (a name, never a
  path) and the type in `X-Content-Type`; the host serves the type it stored, `text/plain` by default.
  If an upload answers 415, retry it as `application/octet-stream`.
- Read a document back after writing it, by name and version, before believing the write.
- Listings are paged at 100: a folder with more files than that needs the next page, or a tool reports
  "missing" files that are there.
- Deleting a folder needs both its ids (the container's and the parent's); a share is deleted by its own
  id. Back up before either.
- A webshare body names the folder it shares; the folder element needs a `name` attribute. The share's
  visibility (`private`) is not authentication: the only gate on a share itself is its password, which a
  person must type in a derived form the browser's own prompt does not produce.
- Nothing in the deploy path deletes from a container, so a file removed locally stays served until it
  is deleted by hand. Filter editor and system files (`.DS_Store`, `_*`) before they ship.

The cards: `cloudbackend_rest` with the tag `containers`, `documents` or `sharing` on the docs server, or the
same cards bundled in cloudbackend-rest-api `references/rest/`.
