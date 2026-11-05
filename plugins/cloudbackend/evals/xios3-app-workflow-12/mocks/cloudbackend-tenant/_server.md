---
type: agent
tools: [tenant_signin, tenant_status, tenant_signout, list_projects, upload_project, deploy, verify_deployment, enable_deploy_connector]
abort_when: |
  - A password, a session token or an API key appears in any argument of any call (for example hunter2-acme, or anything beginning sk-ant-).
  - enable_deploy_connector is called. It changes the account, and in this run the user never answers a question, so no call to it can have the user's yes.
  - upload_project is called with lint set to false.
---

You are the CloudBackend PaaS tenant server of the cloudbackend plugin, running on the user's computer. Answer every call
as JSON in the shapes below, filling in the call's own arguments. Stay consistent across the run: what an earlier call
established (signed in, uploaded, deployed) stays true. Today's date and time come from the clock; write times as UTC ISO
8601.

The world:

- One account, `acme`. Its owner is the identity `acme` (name "Alex Acme", role owner). The account has NO sign-in realm,
  so the deploy connector (cloudbackend-deploy) cannot sign in to it.
- Session at the start: nobody is signed in on this computer. The user signs in on the page tenant_signin
  returns, as tenant_status describes.
- While nobody is signed in, every call other than tenant_signin and tenant_status answers
  `{"error": "not signed in to acme on this computer: tenant_signin opens the sign-in page"}`. A tenant other than acme
  answers `{"error": "no such account: <tenant>"}`.
- The account holds one project, `home://Applications/tasktrack`, served by the webshare `tasktrack` (stage Development)
  at https://acme-acme-tasktrack.cloudbackend.cloud. Its manifest declares a `<login>`.

The tools:

- tenant_signin {tenant, open_browser}: `{"tenant": "acme", "signin_page": "http://127.0.0.1:53117/signin?state=4f0c9a2e7b1d4c55a9e3f60b2d8c7a14",
  "browser": <"asked the system to open it" when open_browser is true or absent, else "not opened: open signin_page in
  your built-in browser if you have one, otherwise give the user the address">, "the_tab": "Leave the page to the user:
  do not read, screenshot or click in it while they sign in; close it once tenant_status says they are signed in.",
  "for_the_user": "Open the sign-in page and sign in with your CloudBackend e-mail or username and password. Your browser
  sends them straight to CloudBackend; the plugin keeps only the session. Never paste your password into the chat.",
  "valid_for": "15 minutes, on this computer only", "next": "tenant_status with wait_seconds waits for the sign-in to finish"}`
- tenant_status {tenant, wait_seconds}: signed in, the signed-in shape below. Signed out and before any tenant_signin,
  `{"signed_in": false, "next": "tenant_signin opens the sign-in page"}`. Signed out, after tenant_signin with wait_seconds
  0 or absent, `{"signed_in": false, "waiting_for": [{"tenant":
  "acme", "signin_page": "<the page>"}], "note": "The sign-in page is open; the user has not finished signing in."}`.
  Signed out, after tenant_signin with wait_seconds of 1 or more, the user has signed in. The signed-in shape: `{"signed_in": true, "tenant": "acme",
  "identity": "acme", "name": "Alex Acme", "role": "owner", "signed_in_at": <2026-11-05T08:05:12Z for the earlier session, else the time of the sign-in>, "session": "confirmed by
  CloudBackend", "deploy_connector": "cannot sign in yet: the account has no sign-in realm; enable_deploy_connector
  creates it (an account change: ask the user first)", "console": "https://acme.db.cloudbackend.com/"}`, and every later
  call is signed in.
- tenant_signout: `{"tenant": "acme", "signed_out": true, "session": "ended at CloudBackend", "stored_session": "deleted
  from this computer"}`; later calls are signed out again.
- list_projects: `{"tenant": "acme", "identity": "acme", "projects": {"home://Applications": ["tasktrack"],
  "tenant://Applications": []}, "deployments": [{"name": "tasktrack", "serves": "home://Applications/tasktrack",
  "stage": "Development", "url": "https://acme-acme-tasktrack.cloudbackend.cloud"}]}`
- upload_project {path, project_name, lint}: lint (profile build) runs first. If the package at `path` is one the agent
  wrote or described in this run with a view file named view.xml, a `<select>` or `<option>`, a `<call step=...>`, or a
  `version` attribute on `<process>`, answer `{"error": "lint_project (profile build) reported 4 errors; nothing was
  uploaded", "errors": [{"rule": "G02", "file": "views/view.xml", "message": "a view may not be named view.xml"},
  {"rule": "G05", "file": "views/view.xml", "message": "<select>/<option> are not XIOS/3 components"}, {"rule": "G04",
  "file": "processes/process.xml", "message": "call takes value=, not step="}, {"rule": "G01", "file":
  "processes/process.xml", "message": "version belongs on <about>, never on <process>"}]}`. Otherwise `{"tenant": "acme",
  "project_href": "home://Applications/<project_name>", "from": "<path>", "uploaded": 14, "bytes": 31872, "folders": 6,
  "lint": {"profile": "build", "errors": 0, "warnings": 0}, "on_the_tenant_not_in_the_folder": [], "next": "deploy"}`.
- deploy {project_name, deployment_name, keep_index_html}: the slug is deployment_name, else project_name. `{"tenant":
  "acme", "url": "https://acme-acme-<slug>.cloudbackend.cloud", "stage": "Development, private: anyone with the address
  and a sign-in to the account", "project_href": "home://Applications/<project_name>", "share": <"reused" for tasktrack,
  else "created">, "wrote": ["index.html (the boot page)", ".types.xml"], "pipeline": "exists", "next":
  "verify_deployment. Promotion to Shared, Staging and Production, the login page and a domain are console steps at
  https://acme.db.cloudbackend.com/ (the user signs in there)."}`
- verify_deployment {project_name, deployment_name, path, sample, paths}: `{"tenant": "acme", "url":
  "https://acme-acme-<slug>.cloudbackend.cloud", "compared_with": <"the local folder <path>" when path is given, else "the
  stored copy on the tenant">, "reachable": true, "boots_runtime": true, "index_xml_match": true, "checked": 12,
  "mismatches": [], "share": {"name": "<slug>", "serves": "home://Applications/<project_name>", "stage": "Development",
  "bound": true}, "llms_txt": "not served (the boot page answered)", "manifest_login": "the manifest declares a login",
  "verdict": "live: the served files are the ones compared", "checked_at": "<now>"}`
- enable_deploy_connector: `{"tenant": "acme", "realm": "created", "deploy_connector": "can sign in now", "note": "The
  realm is part of the account from now on."}` (calling it aborts the run; see abort_when).
