# The deployment pipeline as measured — what each click does to the address

Hand-written, measured 2026-11-27 in the CloudBackend PaaS console on a throwaway project with a Hello World app,
through two releases, with the console's own board code read alongside (its card-action list and its move
planner). It replaces the 2026-10-07 measurement of the earlier board (Development, Make Public, Shared, Staging,
Production), whose click paths no longer exist. The manual's *Managing Deployments* page (`deployment.md`) still
describes the earlier board; where the two differ, the console wins.

## The board

A project's **Deployments** tab has five lanes, each with the console's own line under it:

| Lane | The console's line | Holds | Address |
| --- | --- | --- | --- |
| **My Code** | Your code, only you see it | your copy of Project, in `home://Applications/<project>` | none |
| **Private Preview** | Only you can sign in | a running copy of My Code | `https://{tenant}-{username}-{32 hex}.cloudbackend.cloud` |
| **Project** | The project's main version | the Development code, numbered 1.1, 1.2, …; its frozen versions below it | none |
| **Test** | Frozen versions being tested | up to three frozen versions | `https://{tenant}-{project id}-{32 hex}.cloudbackend.cloud`, a new one per version |
| **Live** | Tested versions your users see | up to two | the address the version had in Test |

A card's right-click menu and its **Properties** buttons are the same list (the console builds both from one
`cardActions.xml`):

| Card | Actions |
| --- | --- |
| My Code | View · Private Preview (while it has none) · Replace Project · Show Files · Delete Code |
| Private Preview | View · Copy Link · Stop Preview |
| Project | View · Copy to My Code · Test as 1.2 · Make Live as 1.2 · New Major Version (2.0) · Show Files |
| Frozen code, under Project | View · Copy to My Code · Show Files · Delete Frozen Code |
| Test | View · Copy Link · Make Live · Mark as Verified, Mark as Broken, Mark as Unchecked (the two it is not) · Connect Domain or Disconnect Domain · Show Files · Remove from Test (no domain) |
| Live | View · Copy Link · Show Files · Connect Domain (no Live card has one), Disconnect Domain, or Move Domain Here (another Live card has it) · Remove from Live (no domain) |

All of these were seen on screen except the Frozen code card's and the domain variants, which come from the board's
code. A user without write on the pipeline sees no action that changes it. **No card has a login action, and there
is no Deploy Anyway**: the board does not verify a package, so Development's **Validate** and `lint_project` are the
checks before Test.

## The timeline

| Click | Dialog | What happens | Address afterwards |
| --- | --- | --- | --- |
| New app in Development | — | A card under Project, 1.1. **View** runs the code in a new browser tab ("Run this app?" the first time); nothing is published | none |
| Project › **Copy to My Code** | none | A card under My Code (it showed version 1.0); the copy is in `home://Applications/<project>` | none |
| My Code › **Private Preview** | none | A card under Private Preview, status unchecked, "Anyone with the link can open it. Only you can sign in." At most two per person per project; a third asks to stop one | `https://{tenant}-{username}-{32 hex}.cloudbackend.cloud` |
| Project › **Test as 1.1** | none | "Building the version…" for about ten seconds. Project becomes 1.2; a **1.1 Frozen** card appears under Project (`p{project id}://Deployments/Code/1-1_{yyyyMMddHHmmss}`); Test gets 1.1, status **Unchecked** | a new `https://{tenant}-{project id}-{32 hex}.cloudbackend.cloud` |
| Test › **Mark as Verified** | none | The badge says **verified** | unchanged |
| Test › **Make Live** | **Go live?** "Make version 1.1 of … live? Everyone using the live site and its domains gets it right away." It adds "It is not marked as tested." for an unverified version. **Yes, make it live** | The card moves from Test to Live | **unchanged**: Live serves the Test address |
| Project › **Test as 1.2**, code unchanged | **Move Failed**: "Project has not changed since version 1.1, which is already in Test or Live. Use that card instead." | Nothing is published | — |
| Change a file, then **Test as 1.2** › **Make Live** | as above | Live holds 1.2 and 1.1, each serving its own code | 1.2 gets **its own new address**; 1.1 keeps its own |
| Test or Live › **Connect Domain** | **Connect new domain**: "Please enter the name of your domain (eg. example.com)", **Create**. Then "Point your domain here first": an `A` record `83.140.241.4` and no other A or AAAA records; then the certificate | Not completed on the measured run (no domain) | your domain |
| Live › **Remove from Live** | "Remove version 1.1 from Live? It is unpublished and its link stops working. Its frozen code stays under Project." **OK** | The card leaves Live | **404** within seconds |
| Private Preview › **Stop Preview** | "Stop the Private Preview? Its link stops working. Your copy in My Code stays." **OK** | The card leaves Private Preview | 404 |

From the board's code, not provoked on the measured run: **Make Live as** on the Project card skips Test, and
**Go live?** says "It skips Test."; a fourth Test or a third Live version asks "Test Is Full" or "Live Is Full" and
takes the oldest off ("its link stops working; its files are kept"); a card moved in the last 15 minutes is refused
("Promotion in Progress"); a Test version whose files changed after it went to Test is not made live.

So:

- **Every release has a new address**, and a Live address dies when its version leaves Live. Nothing on the board is
  an address to give customers; **the domain is**. Connect it before anyone bookmarks a host, and move it to the
  new version with **Move Domain Here**.
- Undo a bad release while the previous version is still in Live: **Move Domain Here** on its card. The card's
  **Versions** list (with **Restore This Version**) shows the versions a domain replaced. Neither was measured.
- The card's history still writes "promoted to Staging as 1.1" and "promoted to Production": the pipeline record
  keeps the earlier lane names (`development` is Private Preview, `shared` Project, `staging` Test, `production`
  Live), and so does anything that reads the record.

## What a version serves

Measured on the Test address:

- The root runs the project's **website** when it has one, else the app. The app is at `/app/<app>/index.xml`,
  started by `/app/index.html`. The freeze writes the version number into the app's `<about version>`.
- A folder path ending in `/` answers an Atom listing of its files, so everything in a version can be listed as well
  as read. No secrets in Development.
- Any unknown path answers 200 with the boot page: a status code proves nothing.

## The badge is not the address

- The badge on Private Preview, Test and Live cards is the **test status** (unchecked, verified, broken). It never
  says Live; the lane does. Nothing on the board fetches the address.
- Measured 2026-11-27: a Private Preview card on the tenant-wide board carried an address that answered **404**.
  Home's **Live projects** counts every pipeline with a card in Live, also without fetching anything.
- After every move, run `verify_deployment` or open the address yourself.

## The login screen

- **Development › Add login screen...** (**Edit login screen...** once there is one) opens **Configure Login**.
  Save writes the `<login>` block and the login process into the app's own `index.xml`; nothing is stored on a card
  or in the pipeline record. The login travels with the code into every frozen version, and the Live card's
  **Login:** row reads it (Configured or Not Configured). `login.md` says what goes in.
- Set the login before **Test as**: a frozen version keeps the login it was frozen with.
- `verify_deployment`'s `login_gate` still looks for the configuration the earlier board stored in the pipeline
  record, so an app with a login reports `manifest-only` there. That is the gated state on this board; `open` is
  the failure.
- `create` and `reset` show their links only when set: set both, always (`login.md`, "The three rules"). On a
  tenant without the CRM their flows send no e-mail yet, so set up the CRM before Live (launch path, step 4) rather
  than leaving the links out.

## Apps outside a project

An app deployed by the plugin's tenant server, or any app without a project, has its pipeline in the tenant-wide
**Deployments** section. Its deploy shows as a **Private Preview** card at
`https://{tenant}-{username}-{name}.cloudbackend.cloud`; its Test and Live versions are addressed
`https://{tenant}-{tenant id}-{32 hex}.cloudbackend.cloud`. **View** on such a card says to open the Test or Live
address instead. Moving one of these cards was not measured.

## Sessions and identities during testing

- One session covers every `*.cloudbackend.com` and `*.cloudbackend.cloud` host in a browser profile. Signing in as
  a test identity in a normal tab replaced the console's session twice (2026-10-07). Test identities belong in a
  **private window**.
- A role-less identity that opens the console's address is refused with "Unfortunately your role does not have
  permission to use this tool". Customers get the domain, never the console's address.
- A Private Preview lets only you sign in. To let a test identity sign in, put the version in Test (the console's
  own advice when you copy a preview's link).

## Pushing files without a tool

Without the tenant server or the VS Code / Cursor extension, files go up through the CLI or the console's
Upload Files dialog, one container per folder: `console-upload.md`.
