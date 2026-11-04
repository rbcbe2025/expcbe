# The deployment pipeline as measured — what each click does to the address

Hand-written, 2026-10-07, from the first release of an application through the CloudBackend PaaS console's
Deploy Wizard and Deployments section. The manual's *Managing Deployments* page (`deployment.md`) names the
stages; this page records what happened to the address, the card and the login screen at each one, because
three of those facts are not in the manual and each cost a push cycle to learn.

## The timeline

| Click | What happens | Address afterwards |
| --- | --- | --- |
| Projects › **Deploy** | The wizard verifies the package. Two complaints are expected and are deployed through with **Deploy Anyway**: `'process' does not allow attribute 'version'` (leave `version` off `<process>`) and `'proxy' is not a valid child of 'operation'` for the documented proxy channel. The wizard adds `index.html`, a `.types.xml` and an `external/` folder to the deployed copy. The new card is **Private**. | `https://{tenant}-{username}-{deployment}.cloudbackend.cloud` |
| Right-click the card › **Make Public** | Do it before any test as a customer. On the measured run the first sign-in by another identity at the Development address was refused with "Unfortunately your role does not have permission to use this tool" and passed after Make Public; a browser-session collision (below) was happening at the same time, so the refusal is not attributed with certainty. | unchanged |
| **Promote to Shared** | The card **moves** out of the Development column, and the Development address answers 404 within seconds. | `https://{tenant}-{groupId}-{deployment}.cloudbackend.cloud` |
| **Mark Verified** › **Promote to Staging** | Moves again; the Shared address dies. The snapshot's host carries the promotion time. | `https://{tenant}-{groupId}-{deployment}_{timestamp}.cloudbackend.cloud` |
| Staging card › **Configure Login Page…** (later **Edit Login Page…**) | The only action that makes the properties panel say **Login: Configured**. Set the logo (below), the texts, the EULA box; Save. | unchanged |
| **Mark Verified** › **Promote to Production** | Moves; **the address stays the same**. The first address that survives. | unchanged |
| **Connect Domain** | Your own address, independent of releases. | your domain |

So: nothing before Staging is an address to give anyone, and the Production address is the Staging host of
the release that made it. A later release promotes a new timestamped snapshot; whether that replaces the
Production address or keeps it was not measured on a second release. Connect a domain before customers
bookmark a host.

## The login screen

- The manifest's `<login>` element renders a working screen on every deployment, but the console counts
  the login screen as configured only after the Staging configurator has saved. Do both.
- **Logo:** the value is resolved against the login application's own folder, not the deployment. Measured
  results for each form:

  | Value | Result |
  | --- | --- |
  | `logo.svg` | looked up in the login application's folder → 404, no logo |
  | `/logo.svg`, `../logo.svg` | empty `src`, no logo |
  | `data:image/svg+xml;…` | breaks the configurator's form |
  | the configurator's folder pick | copies the file to `external/` and writes `external/logo.svg` → unresolvable, no logo |
  | `https://` + a host + `/logo.svg` | renders — and dies with that host on the next promotion unless the host is the Staging one |

  Working value: `https://{the Staging card's host}/logo.svg`, typed into the configurator before promoting
  to Production, or your own domain once connected. Upload the SVG next to `index.xml` so it is served
  from the deployment.
- `create` and `reset` show their links whatever the tenant has; on a tenant without the CRM they lead
  into flows that cannot finish, so add them only when the CRM exists.
- The EULA checkbox read as unchecked after Save on 2026-10-07; check the Production login screen rather
  than the form.

## Sessions and identities during testing

- One session covers every `*.cloudbackend.com` and `*.cloudbackend.cloud` host in a browser profile.
  Signing in as a test identity in a normal tab replaced the console's session twice. Test identities
  belong in a **private window**.
- A role-less identity that opens the console's address is refused with the same wording as above.
  Customers get the Production address or the domain, never the console's.
- A Public Development card admits any identity of the tenant, role or not. Whether a Private one refuses
  other identities by itself, or the first refusal came from the session collision, was not separated;
  Make Public first either way.

## Pushing files without a tool

Without the VS Code / Cursor extension, text files reach the tenant
through the CLI's `upload` (after `cd` into the application's container), which opens the console's Upload
Files dialog; the dialog replaces by file name. Plan a quarter of an hour per push of a few files, keep the
file count small, and version module file names so a changed module is a new upload (and the runtime does
not serve its cached copy).

### Folders first: an app with sub-folders

An upload goes into one container and does not create folders. An app whose files sit in sub-folders (the design
kit writes `views/`, `processes/`, `xsl/`, `styles/`, `ui/DesignKit/` and `data/`) needs those containers before
its files can go in, and each folder's files are uploaded into their own container. The console's **Projects**
tab cannot do this: its Upload puts a single document into the tenant's Applications container. Two ways that
work:

- **The CLI** (the console's CLI section, or the terminal CLI). `mkdir` creates a container and `upload` takes the
  container to upload into, so one session does the whole tree. From the app's container (`cd` to it first):

  ```console
  mkdir views
  mkdir processes
  mkdir xsl
  mkdir styles
  mkdir ui
  mkdir ui/DesignKit
  mkdir data
  upload views
  ```

  Each `upload` opens the Upload Files dialog for that container; pick that folder's files. Repeat `upload` for
  `processes`, `xsl`, `styles`, `ui/DesignKit` and `data`, then `upload` with no path for the files at the app's
  top level (`index.xml`). Create a parent before its child (`ui` before `ui/DesignKit`).
- **The Database Explorer** (console). Open the app's container, create each sub-container there (it can create
  containers, and a container may hold sub-containers), then select each one and use Upload in its toolbar for that
  folder's files.

Check before deploying: `ls` in the app's container lists every folder, and `ls views` (and so on) lists its files.
A file in the wrong container is not an error at upload time, only a blank part of the app at run time.
[Create Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/container-commands/create-container) and
[Upload Objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/object-commands/upload-objects) have the
commands.
