# From tenant to first customer — the launch path

The hand-written end-to-end guide from the CloudBackend documentation hub: the order of work for a first paid web application on CloudBackend PaaS, with a check for each step and the items the product has not settled yet. Its links point at the published manual.

1 topics from the published CloudBackend documentation, generated on 2026-11-05. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [From tenant to first customer: building a SaaS on CloudBackend PaaS](#from-tenant-to-first-customer-building-a-saas-on-cloudbackend-paas)

## From tenant to first customer: building a SaaS on CloudBackend PaaS

The end-to-end path for a developer building their first paid web application on CloudBackend PaaS: create the tenant, model the data, build a XIOS/3 application, give it a branded login screen, let users sign up, organise them into teams and roles, sell subscriptions through price plans, and deploy to a custom domain. Each step says what to do, the rule that is easiest to get wrong, how to check that it worked, and which published page has the detail. The published manual covers every step, but spread over the Singularity database manual, the console pages and the XIOS/3 deployment guide; this page puts them in order.

Written 2026-10-06 against the documentation in this corpus and the live sign-up form at db.cloudbackend.com. Where a feature is announced but not released, it says so. Revised 2026-10-07 after the first launch that followed it end to end, on an early-access tenant: the pre-flight, the branches for a tenant that has no CRM or Price plans section, the rules marked *measured* and the deployment timeline in step 7 come from that run, not from the manual.

### Before you start: the tenant

A tenant is the top-level group that owns every database, identity and deployment of one product. You create it once, with its **Owner** account, at [db.cloudbackend.com](https://db.cloudbackend.com/). The form asks for:

| Field | What to know |
| --- | --- |
| E-mail address | The Owner's e-mail. |
| Password | At least 16 characters. |
| Tenant/Organisation name | Lowercase letters a-z and digits 0-9 only ([GET /organizations/check](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/rest/tenant/getv1organizationscheck) tells you whether a name is free). It becomes part of every address the tenant has and cannot be changed later, so choose the product or company name you will still use in a year. |
| Referral code | The invite code you receive from early access ([early.cloudbackend.cloud](https://early.cloudbackend.cloud/)). |

Then, following [Onboarding](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started/onboarding) and [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities):

1. Sign in as the Owner and create an identity with the **Administrator** role. Do day-to-day administration as that identity and keep the Owner locked away: it is the only account that can delete the tenant, approve upgrades, set the CRM's mail relay host and configure where subscription revenue goes.
2. Create a **Developer** identity for building and testing, so test data lands in its database and not in the administrator's. Only Owner and Administrator exist as roles from the start, and an identity without a role cannot sign in to the console, so first create a role such as *Developer* (Identities › Manage Roles › Create…), give it at least read on Identities and Roles ([Role ACLs](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/role-acls)), and assign it to the identity.
3. Identities with a role sign in at `https://{tenant}.db.cloudbackend.com`; the Owner signs in at db.cloudbackend.com.

The tenant name also appears in every deployment address: `https://{tenant}-{username}-{deployment}.cloudbackend.cloud` for a private development deployment and `https://{tenant}-{groupId}-{deployment}.cloudbackend.cloud` for shared ones ([Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments)).

**Check it worked:** the Account section shows the tenant and your roles; the Identities section lists the Administrator and Developer identities, and the Developer identity can sign in at `https://{tenant}.db.cloudbackend.com`.

### Pre-flight: five minutes that decide the plan

Do this before step 1, signed in to the console. Each answer changes a later step, and finding out at that step costs a day.

| Look at | If | Then |
| --- | --- | --- |
| The console's left menu | **CRM** and **Price plans** are missing (an early-access tenant, measured 2026-10-07: their addresses open the Home page, and Account says "Early access preview. No paid products exist yet") | Step 4 takes the *CRM absent* branch (manual onboarding) and step 6 the *Price plans absent* branch (invoice). Record both in the launch context as deferred, with that reason, and do not add `create` or `reset` links to the login screen yet. |
| Your tools | The VS Code / Cursor extension is connected | Text files reach the tenant in one command. Otherwise every file goes up through the console's Upload Files dialog, so budget for it and keep the number of files small. |
| The browser you use for the console | It is the only profile you have | Every test as a customer needs a **private window**: one session covers every CloudBackend host, and signing in as a test identity in a normal tab replaces the console's session (measured). |
| Proxy, Datatypes, Identities | They are present | Everything in steps 1, 2 and 5 is available. |

**Check it worked:** the launch context says which branches apply and how files will reach the tenant.

### 1. Model the data

Decide, for every piece of data, whether it is a container, an object, a stream or a key/value before you design a screen. Start from the actors: everyone who signs in is an [identity](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/identity) with a private `home://` database. Shared data goes in a container on `tenant://` or on a [group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/group)'s database, and access is granted to a [role](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/role) or group, never to individual users.

- Create one [datatype](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) per kind of object and store it in `tenant://Settings/Datatypes`. Attached to a container it makes the container a table: the fields you filter on become indexed key/values, and the document itself goes in the object's first stream.
- The datatype file needs the `.xdt` extension, and only the Owner or an Administrator can write to `tenant://Settings/Datatypes`. Two doors put it there (measured 2026-10-07): the **Datatypes** section's toolbar **Upload**, or the CLI (`cd Settings/Datatypes`, then `upload`). The Database Explorer path the manual describes was not found.
- **Key names:** `title`, `author`, `date`, `id`, `name`, `summary` and the other reserved names ([Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) lists them) silently do nothing as index keys. Give the key a name outside that list; the element inside the document can keep its natural name.
- What the datatype buys today is display: the keys appear as columns in the Database Explorer and in bound components. Filtering on a custom key is not a given: on the tenant measured, custom keys showed *Indexed: NO* after upload, cloud-side extraction did not run until the CLI's `extract <object>` was called, and a `query -w` filter on such a key was not applied. Design the first version so it reads whole objects and filters in the application, and treat indexed filtering as something to prove (table below).
- An [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/acl) entry is a sum: read 1, write 2, delete 4, change ACL 8. Items inherit their parent's ACL. Keep at least one entry with change ACL on every item, or nobody can fix it later.

**Check it worked:** each datatype is in `tenant://Settings/Datatypes` and listed in the Datatypes section, and each shared container's ACL lists roles or groups rather than individual users. If the application filters on a custom key, run a control query: one that should match and one that should not; if both return the same rows, the key is not indexed. The manual says a datatype can be locked to a container as its schema, but not where to do it; ask before you rely on it.

### 2. Build the application

A XIOS/3 application is a manifest, one or more views and one or more processes. Small applications inline everything in one document ([Inline Package](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-packaging/inline-package)); larger ones use an [Advanced Package](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-packaging/advanced-package). Build it with the [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-development/development-tools/application-wizard), [CodePad](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-development/development-tools/xmlpad) or [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-development/development-tools/using-visual-studio-code).

- **The look is decided before the markup, and the first version is generated.** The `xios3-app-design` skill turns the one-sentence idea into a design brief, a mood board and a *token theme*: the runtime's own mechanism (a `theme` element with `tokens="true"`, seed colours and type/shape knobs it derives every hover, border and selection from), so no view names a colour. Its generator then writes the first version: a list with search and an empty state, a detail with the fields to edit, New / Save / Delete, a status line and a phone layout, with the data logic in the process. Show the mood board, ask once ("this direction, or another?"), generate, upload, and iterate on the running app. A first version with sensible defaults in an hour beats the right answers to twenty questions.
- Every application lives in its own container, for example `home://Applications/planboard/`, and the manifest must be named `index.xml` to be deployable.
- Name every component: triggers and expressions find components by name.
- `bind` a grid or icon list to a container. Changes in the database appear in the component, and edits in the component go back to the database. There is no fetch or sync code to write.
- Object names cannot contain `? / \ ( ) # * : [ ] | % & < " ' ! { }`. Name objects from a timestamp or counter and keep the user's text in the content.
- **When the application needs JavaScript** (a browser-side model, a computation, a download): the JavaScript computes, the process writes. A document loaded from JavaScript and changed there is a copy that is never stored (measured 2026-10-07); the write path is the process's `database` operation (`create` with `content`) and `change` (`store … type="replaceText"`) followed by `save`. Hand values from JavaScript to the process through named, transparent inputs (`textarea` for anything with line breaks), and call JavaScript from steps with `<operation name="call" value="functionName"/>`, which waits for the function's promise. The copy-ready contract, with the list of authoring-guide calls that are not functions on the hosted runtime, is the xios3-app-basics skill's *JavaScript as steps* reference.
- **When the application calls an AI or another paid API**, it goes through the [Proxy](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy) section, so the key never enters the application. Three things to know before step 7: the proxy's ACL decides which of your users may call it; every call is billed to you, while the platform gives the application no way to check a user's subscription (step 6); and a request body the application may replace (`http-data` with `allow-override="true"`, which the [proxy format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format) requires for dynamic data) lets every admitted identity send any body, any model and any `max_tokens` on your key. Pin what can be pinned (`allow-override="false"` on the domain, the path and the headers), put a monthly spend limit on the key at the provider and give the proxy a key of its own, and state the per-call cost model in the launch context here, not at step 6. When the request body is JSON built with `eval="pct"`, an alias is substituted verbatim, so keep a JSON-escaped copy of any free text (the string `JSON.stringify(text)` produces, without its quotes) and embed that; `escape-string()` writes `\'`, which JSON rejects.
- **Development loop:** the runtime caches a module once loaded, and closing the application does not unload its process. Give JavaScript modules a versioned file name (`app.v3.js`) and reload the console page between runs. Uploads onto an existing object name do not complete by default; mint unique names.

**Check it worked:** the application opens from the Projects section and the bound list shows the container's objects; creating an object in the Database Explorer makes it appear in the list; on a phone-sized window the list comes first and the detail opens on a pick; no view or stylesheet of the app contains a hex colour. For a write the application makes, read the stored document back (CLI `cat`) instead of trusting what the screen shows.

### 3. Add the login screen

XIOS/3 ships a login application with the shape of the CloudBackend PaaS sign-in: the logo above a white card, the fields, one full-width button, and its own sign-up and password-reset pages in the same design. You configure it with one `<login>` element or with the Login Configurator ([Login Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/login-application)).

**Every login screen offers all three ways in: sign in, sign up and forgot password.** The sign-up and forgot-password links show only when `create` and `reset` are set, so always set both.

In the manifest:

1. Declare `xmlns:xlink="http://www.w3.org/1999/xlink"` on `<application>`.
2. Set `xlink:actuate="onRequest"` on your own process and views, and declare the desktop view first: after sign-in the login application opens the first view declared on every screen (measured 2026-11-05), so that view must also work on a phone. The xios3-app-design kit's desktop view does.
3. Add `<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>` before your main process.
4. Add a `<login>` element. The manual documents `background` (an image, a colour, or two colours separated by a comma for a bottom-up gradient; `dark="true|false"` tells the screen which text colour to use), `logo`, `title`, `description`, `copyright`, `create` and `reset` (each shows its link, with the element's text as the label) and `client`. The login application also reads `button` (the sign-in button's text), `buttonColor`, `linkColor` and `createPrompt` (the line before the sign-up link), and the element's `session` attribute: with `session="true"` the runtime keeps the user signed in across reloads (the session stays in the browser for seven days of use), without it every reload signs the user out. An app with a kept session needs a Sign out, a step with `<operation name="system"><logout/></operation>`.

```xml
<login session="true">
  <background dark="true">login-bg.svg</background>
  <logo>logo.svg</logo>
  <title>Log in</title>
  <description>Welcome back. Log in to Planboard.</description>
  <button>Log in</button>
  <buttonColor>#4338ca</buttonColor>
  <linkColor>#4338ca</linkColor>
  <reset>Forgot your password?</reset>
  <createPrompt>Don't have an account?</createPrompt>
  <create>Create an account</create>
  <copyright>Copyright © 2026 Planboard AB</copyright>
</login>
```

The xios3-app-design skill writes this element from the app's design, with a dark grid page like the CloudBackend PaaS sign-in (`login-bg.svg`) and a text-mark logo (`designkit.py app --login`), and checks it (`designkit.py login`).

Without editing the manifest, open **Configure Login Page…** on a Staging card in the Deployments section. The configuration is kept per client and written into the Production copy when the card is promoted ([Managing Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/managing-deployments)). Tick **Show EULA on user creation** there, and fill in both the create and the reset texts.

Measured 2026-10-07:

- The manifest's `<login>` renders a working screen on every deployment, but the console counts a login screen as **Configured** only after the Staging card's configurator has saved. Do both: the manifest for development, the configurator at step 7.
- In the configurator, only a full `https://` URL to the logo works: its own folder pick writes a path (`external/logo.svg`) that resolves to nothing, and a `data:` URL breaks its form. Every host before Staging is replaced on promotion (step 7), so the durable values are the Staging card's host, which Production keeps, or your own domain.

Measured 2026-11-05 on a Development deployment:

- In the manifest, a `logo` and a `background` that name a file next to `index.xml` render: the login application now resolves them against the app. (On 2026-10-07 a bare name was looked up in the login application's own folder.)
- **Create an account** opens the sign-up page (names, e-mail, username, a password of at least 16 characters, repeated), and **Forgot your password?** opens the reset page; `button`, `buttonColor`, `linkColor` and `createPrompt` take effect.
- The card is 470 px wide, so on a phone narrower than that it runs off the screen. The boot page that the CloudBackend plugin's tenant server and the deploy connector write fits it to the screen on all three pages (measured at 375 px); a deployment made with the console's Deploy Wizard keeps the overflow. The responsive card itself is the login application's to fix; it has been reported.
- Without a published `Tenant` container, the login's lookup of the tenant's licence text answers 404 in the browser console; the screen works.
- On a tenant without the CRM, the sign-up and reset flows may not finish (seen on 2026-10-07 with the earlier login application, not measured again). Keep both links, set up the CRM before Production (step 4), and until then create customer accounts yourself (4b).
- Collect the brand assets now: the logo file (SVG, uploaded next to `index.xml`), the title, the description and the copyright holder.

**Check it worked:** the deployment's login shows the three ways in (Log in, Forgot your password?, Create an account) and each opens its page; the configurator's Preview shows your logo and colours, and the deployment's properties panel says a login screen is configured.

### 4. Let users sign up

The `create` link opens the Create User application: the user picks a username, password and e-mail, the service checks that both are unused, creates the identity and sends a verification e-mail ([Creating and Managing Users](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/creating-and-managing-users)). Those e-mails go through the CRM, which must be set up first ([CRM getting started](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/getting-started)):

1. Sign in as the **Owner** and open the CRM section. Accept the standard e-mails and rules it offers; they include the mail that lets users delete their own account.
2. Set CloudBackend as the relay host for your e-mail provider (the manual's example is SendGrid), adjust the texts and settings, then deploy the e-mails ([Deploy Emails](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/deploy-emails)).
3. Add rules as you need them: a welcome mail on sign-up, a reminder for inactive users.

People who sign up belong to your tenant and are your legal responsibility; the manual recommends an end-user licence agreement ([Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments)).

**Check it worked:** create an account through the deployed login screen with a test address; the verification mail arrives, and the new identity appears in the Identities section with no role.

#### 4b. When the tenant has no CRM: manual onboarding

Until the CRM exists in your console, sign-up, verification mail and password recovery are not available, and the in-application `createUser` needs a captcha token the manual does not document. Onboard each customer by hand and write the steps down as a runbook in the project, so the second customer costs five minutes:

1. **Identities › Create**: username (lowercase letters and digits are safe), the customer's e-mail, a first password. Assign **no role**.
2. Send the customer the **Production address** from step 7 and nothing else. The console address must never reach a customer: a role-less identity that opens it is refused with "Unfortunately your role does not have permission to use this tool", and a customer who reads that assumes your product is broken.
3. Ask them to change the password at first sign-in. Until the CRM exists, a forgotten password is reset by an Administrator in Identities.
4. Keep a customer register in the project (identity, e-mail, plan, start date, invoice reference) and a log of every time you look at a customer's data with their consent. Add offboarding: remove the identity, which removes their `home://` data.

Record the step as **deferred: CRM** in the launch context; the check table accepts this substitute.

**Check it worked:** a test identity created this way, in a private window, signs in at the deployment address, sees an empty application with its own data, and is refused at the console address.

### 5. Users, teams and roles

- **Customers get no role.** A role grants entry to the CloudBackend PaaS console. Identities created through a deployed application's login page have none, which is what you want: they use your application, not the database. Your own staff get identities with roles such as Developer, Tester or Support ([Create Role](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/create-role), [Manage Roles](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/manage-roles)).
- **A customer organisation is a group** with its own database and roles ([Create Group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/manage-groups/create)). The console's **Invite to Group…** sends an invitation that the invitee accepts from the console's notification pane ([Group Invites](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/manage-groups/invite)), which customers without a role never see. For customers, add members from your application instead; the manual names the `groups` operation's invitation instructions but does not document them yet (see the table below).
- **Two kinds of permission.** A role's group-level ACLs (Identities, Roles, Invitations, Subgroups and so on) decide who may *manage the group*, and for most roles they should be none ([Role ACLs](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/role-acls)). Access to *data* is the ACL on containers and objects, set in the Database Explorer and granted to the role or group.
- **Finer access inside a customer.** Roles belong to a group, so a Client role on an agency's group covers everything that role is granted in that group. When each client may see only their own projects, grant the ACL per project container, or give each client a sub-group of the agency's group.
- An application can manage users itself: the `tenant` operation's `createUser` and `deleteUser`, and the `groups` operation's `create type="role"`, `acl` and `addRole` ([Create Identity](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/create-identity) shows the markup).

**Check it worked:** for a team product, a test user invited to a customer group sees that group's data in your application and nothing from other groups. For a product sold to individuals, a role-less identity opens the application with its own empty data and is refused at the console. Run either check as the user, in a private window, never from the browser profile the console is signed in to.

### 6. Price plans and payments

([Managing priceplans](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans), [Priceplans in your application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans-in-your-application))

1. As the Owner, open Price plans and choose **Configure Payment**. PayPal is the provider the manual supports.
2. **Manage Account Types**: an account type sets the storage size and the monthly *cloudos* credits a subscriber gets when the subscription activates.
3. **Add Plan**: title, monthly or yearly interval, price and currency are required; main benefit, summary, account type and included features are optional. Plans are stored in `tenant://Settings/Products/Priceplans`.
4. **Publish** that container (CLI `publish`, or right-click in the Database Explorer) so visitors who are not signed in can read the plans.
5. In the application, mount the published container and start a checkout:

```xml
<operation name="database">
  <mount name="priceplans">
    <published name="priceplans" groupId="{$groupId}" tenant="{$tenant}"/>
  </mount>
</operation>

<step id="buyPlan">
  <alias name="priceplan" value="!"/>
  <alias name="productId" value="$priceplan#productId"/>
  <operation name="tenant">
    <purchase method="paypal" user-id="{$userId}" responseAlias="auth">
      <products><product id="{$productId}" amount="1"/></products>
      <billing><email>{$email}</email><country>SE</country></billing>
    </purchase>
  </operation>
  <alias name="url" value="$auth#/auth/@url"/>
  <operation name="open" value="{$url}"><browser name="Purchase"/></operation>
</step>
```

A subscription is a single product with amount 1. The `groupId` comes from the CLI command `groups`, and a plan's `productId` from its metadata (CLI `meta Settings/Products/Priceplans/<plan>.cbc`).

6. When PayPal confirms the payment, which can take a few minutes, a record appears in `/System/Purchases/`; a cancellation adds another record there.

The tenant itself also needs a paid CloudBackend PaaS plan before it is used commercially; the plans are priced by the number of identities and groups ([cloudbackend.com/pricing](https://cloudbackend.com/pricing.html)).

**Check it worked:** buy the cheapest plan as a test user; the record appears in `/System/Purchases/`. The manual does not say whether a PayPal sandbox account can be configured, so a first test may be a real payment.

#### 6b. When the tenant has no Price plans section: invoice

Sell the first subscriptions outside the platform: a price and interval agreed in writing, an invoice from your company, and the customer register from step 4b as the record of who has paid. The application must not try to check a subscription, because nothing in the platform answers that question yet, and the proxy's ACL (step 2) admits every identity you let in, so the register is also what you compare the proxy's usage against. Record the step as **deferred: Price plans**; return to steps 6.1–6.6 when the section appears.

**Check it worked:** the register names every live customer with a price and an invoice reference, and the launch context says the step is deferred and why.

### 7. Deploy and go live

([Application Deployment](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment), [Managing Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/managing-deployments), [tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/tutorials/application-deployment))

1. In Projects, select the application and choose **Deploy**. The deployment name may contain lowercase letters and digits only, because it becomes part of the host name.
2. From the `home` drive you get a private **Development** deployment served live from your source. Make it public and promote it to **Shared** to work on it with your team.
3. Test it, choose **Mark Verified**, and promote it to **Staging**, a snapshot that later edits do not change. Configure the login page here.
4. Verify again and promote to **Production**. **Connect Domain** requests a Let's Encrypt certificate; point the domain's `A` record at `83.140.241.4`.

Everything in a deployed container is publicly readable. Keep secrets out of it.

The same pipeline as it was measured on 2026-10-07, with what each click does to the address:

| Click | What happens | Address afterwards |
| --- | --- | --- |
| Projects › **Deploy** | The wizard verifies the package. Expect two complaints it is right to ignore with **Deploy Anyway**: `'process' does not allow attribute 'version'` (so leave `version` off `<process>`) and `'proxy' is not a valid child of 'operation'` for the documented proxy channel. It adds `index.html`, a `.types.xml` and an `external/` folder to the deployed copy. The card is **Private**. | `https://{tenant}-{username}-{deployment}.cloudbackend.cloud` |
| Right-click the card › **Make Public** | Do this before any test as a customer. On the measured run the first sign-in by another identity at the Development address was refused with the role-permission wording and passed after Make Public, but a browser-session collision (below) was happening at the same time, so which of the two caused the refusal is not settled. | unchanged |
| **Promote to Shared** | The card **moves**: the Development column empties and the Development host answers 404 within seconds. | `https://{tenant}-{groupId}-{deployment}.cloudbackend.cloud` |
| **Mark Verified**, **Promote to Staging** | Moves again; the Shared host dies. The snapshot's host carries the promotion time. | `https://{tenant}-{groupId}-{deployment}_{timestamp}.cloudbackend.cloud` |
| Staging card › **Configure Login Page…** | Set the logo to `https://` + the Staging host + `/logo.svg` (step 3), check the texts and the EULA box, save. The properties panel now says Login: Configured. | unchanged |
| **Mark Verified**, **Promote to Production** | Moves; **the host stays the same**. This is the first address that survives, so it is the one customers get. | unchanged |
| **Connect Domain** | Your own address, independent of releases. | your domain |

Nothing before Staging is an address to give anyone, and a later release promotes a new timestamped snapshot, so connect a domain before customers bookmark the host, or plan to tell them the new address with each release. Write the customer a one-line address card: the Production address (or your domain), the username, and not the console.

**Check it worked:** the access URL in the properties panel opens the login screen with your logo; a role-less test identity, in a private window, signs in there and reaches the application; after the DNS change, your own domain does too, over HTTPS.

### 8. After launch

- The [Statistics](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/statistics) section shows connecting identities and usage; it has a switch for simulated demo data, so check that it is off before you read your own numbers.
- The [Support](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support) desk needs at least one category (Section) before users can file tickets.
- Users can delete their own account through the CRM's standard mail, set up in step 4.

### What is not settled yet

| Item | What the documentation says | Source |
| --- | --- | --- |
| Password recovery | "An upcoming feature, that is not released yet." It also depends on the CRM. Add the `reset` link now; it works when the feature ships. | [Creating and Managing Users](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/creating-and-managing-users) |
| The CRM | The CRM pages describe it in full, while the login guide says "The CRM module has not been released yet", and the product site lists CRM and e-mail as early access. Confirm its status before launch depends on it. | [Login Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/login-application), [CRM](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/getting-started) |
| Payment providers | The manual names PayPal as the only provider. The REST specification also has Stripe credential endpoints. | [Managing priceplans](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans), [Tenant REST operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/rest/tenant) |
| Checking a subscription | The manual shows how to start a checkout and where the purchase record lands, but not how an application checks that a user's subscription is active, or whether one purchase can cover a whole group. | [Priceplans in your application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans-in-your-application) |
| Inviting customers to a group | Invitations are accepted in the console's notification pane, which end users without a role cannot reach. The in-application invitation markup is named in the reference but not documented. | [Group Invites](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/manage-groups/invite) |
| Roles inside customer groups | Identities with a role may sign in to the console. The manual does not say whether a role in a customer group (rather than the tenant) does the same. Check before giving customers group roles. | [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities) |
| Testing payments | No test or sandbox mode is documented for Configure Payment. | [Managing priceplans](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans) |
| Upgrading the tenant | The Account page says subscriptions cannot be purchased during early access; cloudbackend.com lists paid plans. | [Account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/account) |
| CRM and Price plans on early-access tenants | Neither section existed in the console of an early-access tenant on 2026-10-07; both are documented in full. Steps 4b and 6b are the substitutes until they appear. | [CRM](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm), [Price plans](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans) |
| Filtering on custom datatype keys | Custom keys showed *Indexed: NO* after upload and a filter on them was not applied, while extraction ran only from the CLI. The manual names a schema lock without saying where it is. Prove indexing with a control query before an application relies on it. | [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) |
| Who the proxy's `user id: 0` row admits | A proxy ACL row for user id 0 with Read is what let role-less identities call the proxy. Whether that means any signed-in identity or anyone at all, and so what the AI spend is exposed to, is not documented. | [Proxy](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy) |
| The Production address across releases | Staging → Production kept the host on the first release. Whether a second release replaces the Production address or keeps it was not measured. Connect a domain first. | [Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments) |
| In-application sign-up without the CRM | `createUser` needs a captcha `token`; its source is not documented, so the console's Identities › Create is the only onboarding door on a tenant without the CRM. | [Create Identity](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/create-identity) |
| The EULA box in the configurator | Read as unchecked after Save on 2026-10-07; whether it stuck is unknown. Check the Production login screen. | [Managing Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment/managing-deployments) |

### Checking the whole path

| Step | Done when |
| --- | --- |
| Tenant | Administrator and Developer identities exist; the Owner is only used for owner-only tasks. |
| Pre-flight | The launch context says whether CRM and Price plans exist, how files reach the tenant, and that customer tests run in a private window. |
| Data model | Every shared container has a datatype and an ACL granted to roles or groups; any key the application filters on passed the control query. |
| Application | `index.xml` opens from Projects and the bound list follows changes in the database; the design brief and mood board are in the project and the user said yes to the direction; every write the application makes is read back from the stored document. |
| Login screen | The configurator's Preview shows your brand; the properties panel says a login is configured. |
| Sign-up | A test sign-up receives the verification mail and becomes an identity with no role, **or** (CRM absent) a hand-created role-less identity signs in at the deployment and is refused at the console, and the runbook and register exist. |
| Teams and roles | A test user in one customer group cannot see another group's data, or, for individual customers, a role-less identity sees only its own data. Tested in a private window. |
| Price plans | A test purchase writes a record to `/System/Purchases/`, **or** (Price plans absent) the first customer has a written price and an invoice reference in the register. |
| Deploy | Production answers on your domain over HTTPS and shows the login screen with your logo; a test identity signs in there; no pre-Production address was given to anyone. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/authored/saas-launch-path>*

---
