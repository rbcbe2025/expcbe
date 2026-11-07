# CloudBackend PaaS — the operations console

What an administrator sees and does in the CloudBackend PaaS console: identities, groups, datatypes, the database explorer, clients, deployments, statistics. Top-level pages only; the step-by-step pages for users and roles, price plans, the CRM, datatypes and operations are in their own reference files.

17 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [CloudBackend Operations Platform](#cloudbackend-operations-platform)
- [Account](#account)
- [CLI](#cli)
- [Clients](#clients)
- [CRM](#crm)
- [Database Explorer](#database-explorer)
- [Datatypes](#datatypes)
- [Deployments](#deployments)
- [Documentation](#documentation)
- [Home](#home)
- [Identities](#identities)
- [Price plans](#price-plans)
- [Projects](#projects)
- [Proxy](#proxy)
- [Statistics](#statistics)
- [Support](#support)
- [Webhooks](#webhooks)

## CloudBackend Operations Platform

Introduction to the left side black menu in the graphical user interface of the CloudBackend Singularity Database.

There are also examples of how to use the UI, and some comparisons on how to do the equivalent via the CLI vs. in a programs process code with links to the corresponding documentation.


- [Home](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/home) - your landing page
- [Account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/account) information

- [Projects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/projects) creation and configuration
- [Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments) management
- [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) classification
- [Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer) Explorer
- [Proxy](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy) configuration
- [Webhooks](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks) definition

- [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities) management
- [Feedback Support](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support) ticketing system
- [Statistics](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/statistics) overview
- [Clients](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/clients) terminals
- [CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/cli) - Command Line Interface

- [Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation) manuals and references

#### More


Please note that additional documentation about the SDKs, CLI and more can be found in the documentation toolbar drop down menu here in the upper right.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview>*

---

## Account

Displays information about the currently logged in identity of the tenant. This includes information like last login, number of logins, the registered name, e-mail, and active tenant for the account.


The Database block shows space used and fullness for each database.

Please note the URL for **WebDAV**, which is a unique link for every account to be used on a local computer to mount the CloudBackend database as a local hard drive. More information is available under the section [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer) in this documentation.

With the account page you can also find the important link to use as a customized login for the tenant identities (located at the bottom of the page). This is a required link to be used by any identity that needs to login to the database.

> **Note:** Identities without any assigned role are not allowed to login to the database, this is because the database assumes them to be end-users of a SaaS application built on top of CloudBackend, which naturally should not have any access to the underlying database.

### User Information

You can view your information by pressing the **My Information** button located in the toolbar.


This will open a new window with a list containing all the information that is stored about you. This includes, but is not limited to, your name, username, ids, e-mail, country, gender, time of creation and billing information.

### Databases and Roles

Through the Account section, you can see all databases that you have access to. This includes mounted databases for any sub-group that you are a member of. Sometimes a database will not show up here, it is most likely because of the group it belongs to have not yet been mounted.

> **Tip:** Select a database to get further information about it to the right, double click on a database to explore it in the Database Explorer section.

The roles displayed underneath the available databases, tells you which role privileges you have been assigned. Roles give most commonly access to containers and objects within a database, but some roles also give administrative control over the tenant or a sub-group. Each group has its own roles, including the tenant. It is much more convenient to use roles to assign `ACLs` for a container or object, than giving a single identity the permissions. Learn more about identities and the creation of roles under the [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities) section.

### Change Password

Click on the change password button to receive a *Password recovery* e-mail, that allows you to change the password of your account.

### Upgrade Account

With this **early access** release of CloudBackend, the ability to purchase different subscriptions is not available. Everyone have a free account with no upgrades available. This will become available during the next couple of months. Check out the *News* section to see when it becomes available. If urgent for your project and you need more space, then please contact CloudBackend through [Support](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support) section.

### CLI Commands

The Account information is available in the internal document `#Profile`. To list do:

**CLI Syntax**

```console
cat #Profile
cat #Profile#/profile/membername
cat #Profile#/profile/firstname
whoami 
```

For more information see:

- [cat](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/object-commands/print-object)
- [Who am I](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/identity-commands/who-am-i)

### Process Development Information

Example using account information.

**Process Syntax**

```xml
<alias name="userName" value="#Profile#/profile/username"/>
<alias name="adminGroupId" value="#Profile#/profile/roles/role[@name='Administrator']/@id"/>
<alias name="developerLogin" value="https://{#Profile#/profile/tenant}.db.cloudbackend.com"/> 
```

For more information see:

- [login](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/login)

#### Next

- [CRM](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/account>*

---

## CLI

Most of the functionality available visually is available as text commands in the Command Line Interface (CLI) of CloudBackend.


Please reference the separate CLI documentation found below.

- **[CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface)** — Test and verification tool to make it easy to see what you have stored in the database. Used for debugging while building apps. *(Web UI)*

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/cli>*

---

## Clients

The clients section allows the naming of projects built on top of the CloudBackend SDK. The naming is used to keep track of which client a user has logged in with. Knowing the clients allows gathering of statistics like how many users have logged in using iPhone vs Android, perceived latency, and geographical location of client usage. Projects that have multiple types of web user interfaces may use a unique name for each, i.e. a desktop or mobile web user interface.

**In order to supply a client name to the SDK, it must first have been defined here.**

It is suggested to use client naming to symbolize broader product categories like iPhone, iPad or Android in order to gather useful statistics and user behavior. It is possible, but not recommended to have one client setup for different models of a phone like iPhone 12 and iPhone 13. Having too much granularity makes it harder to compare the uptake of users relative different client, for instance iPhone vs Android, but it also complicates the use of the CRM.

> **Tip:** Use a short and concise name like `iPhone`, `Android`, or `Web` to name clients. These names will be sent with all login requests to the database.

The defined clients are used by the automated CRM system, which allows you to send out e-mails to users that have logged in using a specified client or have not logged in using it. If a service built on top of CloudBackend has both a web user interface and mobile apps, a rule can be made in the CRM system that keeps track of that a user has not logged in using iPhone or Android, and if so, sends out an automated e-mail suggesting the user to download the app from the app store and try out the mobile app. Similar, if a user signed up using a mobile app, an e-mail can be automatically sent out that tells the user about an available web user interface.

> **Note:** Do not use clients to keep track of marketing campaigns, partners and affiliates, a separate system exists that allow you to also name those, which means that you can both know which partner, affiliate or marketing campaign a user originated from and the clients they have used.

Please note that the automated CRM and affiliate system is not released yet, but is under development.

### CLI Commands

To list do:

**CLI Syntax**

```console
use tenant
cd Settings/Clients
ls
```

It is possible to define a client by manually creating a new client XML document with CodePad in the `tenant://Settings/Clients` container.

### Process Development Information

Example creating client.

**Process Syntax**

```xml
<operation name="database" value="tenant://Settings/Clients/">
  <create type="object" name="{$clientName}.xml">
    <content type="text/xml">
      <client type="Web" name="{$clientName}"></client>
    </content>
  </create>
</operation> 
```

For more information see:

- database create

#### Next

- [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/clients>*

---

## CRM

The [CRM tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity) of the Singularity Database is a customer relationship management application. The built-in CRM is designed to simplify and automate the contact with the users of a service or application built on the database.

The CRM allows a tenant to create different mails, such as welcome mails, reminders, and campaigns, that are tied to various rules coming from user interactions, such as users signing up, being inactive or canceling their account. The sub sections below will address the different parts of the CRM, which are accessed through the tabs *Mail*, *Rules*, *Templates*, and *Settings* at the top.

### Mail Overview

The Mail tab is the landing page in the CRM, it is used to give an overview of all current active e-mails in the top grid, alongside e-mail subject, sender e-mail address and dates when these were created and last updated. In the toolbar at the top right there are options for deploying e-mails with its rules. More about the deployment will be under sub-section Deploy Emails. There are also options for creating new mails, as well as deleting and renaming the selected mail, alongside a button to access this help section. More about creating e-mails will be talked about in the Create Email sub-section.

If a mail is selected the lower part of the CRM tab will look something like the image below, with a mail editor to the left and a preview of that mail to the right. The preview will update with any changes to the mail content or when switching its e-mail render/layout template. The preview can also be hidden.

#### Mail Editor


The Mail Editor is a regular XML editor that allows for inspecting and editing the XML of a mail. The preview is a render component that renders both the e-mail with extra information from the settings tab. the templates that you generate gets both data from the settings and e-mail. The mail data also includes the subject and sender that you can see in the grid above the editor. This data can be used in the template you create for your layout.

> **Note:** All changes to an e-mail has to be done within the `body` element.

> **Note:** All changes that you save through the editors save button will be saving the e-mail document but note it will not push the changes to production only deploy does that.

### Rules Overview


Rules are used for tying together an e-mail with specific user events. The Rules tab of the CRM consists of the main grid, listing the various rules, and to the top right buttons for deployment, creating, deleting and renaming rules, as well as a Help button linking to this section.

When a rule is created, or selected in the grid, the options for editing a rule will appear as in the sub section [Create Rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-rule). From the menus, left to right, a mail is selected for the rule, followed by which user event that should trigger the mail.

### Templates Overview


The Templates tab is used to overview and manage various mail templates, i.e. the way a mail should be styled. This tab consists of a grid showing the available templates and buttons to the top right for creating, uploading, downloading, and deleting templates, as well as a Help button linking to this section.

The template which is selected in the grid will be opened in an below editor view. The templates are written in XSLT but the end user only have to think about the html part of this xslt. For more advanced users more details on completely customizing your e-mail through xsl/xslt will be handled in the section: [Create Template](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-template).

### Settings Overview


The Settings tab is used for managing custom fields of an e-mail, to give it a personal touch. This includes setting the logo at the top of each mail, adjusting footer/disclaimer texts, social media links, and the customizable information box that (if wanted) will appear after the e-mail body defined in the editor and customize your color scheme for Headers, buttons, links and info blocks. It is also possible to change the current render template.

At the bottom right there is a button for saving any changes. This is needed to update the preview in the Mail tab.

#### Next

- [Getting started](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/getting-started)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm>*

---

## Database Explorer

This section allows you to browse the entire database for the `tenant`, but also for the logged in `identity`. The tenant is available under `tenant` and the logged in identity under `home`.

If a tenant has got groups that are `mounted` they are displayed here with their name. Each `group` also has its own private database and can have restriction on which identities that may be a member of the group. If you have created a group and need to access its database, there is a `CLI` available to mount it and it will then show up in the database explorer. When developing code, you use the process operation `mount` to mount it (please see the SDK Web UI documentation for further information).

> **Tip:** You can restrict access to the contents of shared tenant database by setting ACLs on a container or object, or by creating groups that limit access to specified identities, or by using a combination of ACLs and groups.

Right click on `containers` or `objects` for context menus that allow you to query containers, inspect objects, view the schema of a container (desc). When selecting these operations you are taken into the CLI section where the Database Explorer has written the command for you.

Select an object or container and select `Properties` in the toolbar to inspect `key/value` meta-data for an object or container, to see `streams` belonging to objects, and to alter the `Access Control List (ACL)` for objects and containers.

You can upload new objects to a container by clicking Upload or New Object in the toolbar. Upload and download to a container can also be done using WebDAV (see below). New containers can also be created. Please note that a container unlike a table in a traditional database, may have sub-containers. Containers may also have ACLs that restrict access to the container for identities.


> **Tip:** Read more of how you setup the database and design its data model in this documentation under *Get to know*, [Concepts](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts) and [Designing the data model](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/designing-the-data-model).

#### Next

- [published](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer/de-published)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer>*

---

## Datatypes

Datatypes allow you to customize what indexed key data to automatically extract from objects you store in the database. It also defines an objects displayed icon and default actions for the object like; [`open`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/open), `edit`, `preview`, and how the item may be displayed in some user interface components.

Having `indexed key/values` is key to be able to search for information in a container by just querying the container (instead of having to open every object and peak inside). This both affects performance and the convenience of writing code, thus designing the data model to allow efficient generation of automatically extracted key/values is very important.

> **Note:** Information that should be displayed repeatedly in lists should always be indexed. This allows a single query to a container to provide all information required to populate the list.

The datatypes section lets you visually create a new datatype. You can also upload and download custom datatypes affecting stored objects.

> **Note:** Creating a new Datatype requires write access to `tenant://Settings/Datatypes` which the Administrator role has by default.

The datatype relates to how the database should interpret objects that you store in the database (from binary to XML documents). If you right click on a datatype, you may also edit the datatype document directly as XML for additional configuration.

> **Warning:** Try to avoid creating a catch-all datatype for any mime-type, unless you want to override pre-defined datatypes or system datatypes, for example, creating a datatype for "text/xml" without defining any namespace or element will override the built-in system datatype for XML Documents.

> **Tip:** If you have created a new XML language to store XML documents in the database as objects and need information from within the documents to show up in container listings (`db:result`), then use the `index` feature. `Index` allows you to use *XPath* expressions to select information to extract as key/value meta-data from XML documents automatically.

A datatype is also possible to lock to a container and thereby acts as the database schema for a container. A datatype stored here will affect how the database extracts information from objects. Datatypes are automatically loaded for any end-user of the tenant logging in to the database or service built on top of the database.

#### Automatic key/value indexing

One of the key features of datatypes is the automatic indexing of `key/value` data that can be done on objects of the type `XML document`. Extraction from the `XML document` is done using XPath (learn how to use it in the XML Development documentation).

> **Note:** If you change values in the `key/value` returned from a container query, it will not update the information in the underlying XML document (object). Please make any changes within the XML document and save it, the datatype system of the database will then instead update the `key/value`.

> **Note:** If you change the definition of the datatypes `index key` it will not update the metadata information in the cloud database of an already existing object. Please make any changes within the XML document to be reindexed and save it. The datatype system of the database will then update the indexed `key/value`.

> **Note:** Binary formats such as images, movies, mp3 files etc have pre-defined key/values of meta-data that the system will extract if you configure a datatype to correspond to such objects. There are pre-defined datatypes available that you can upload to your tenant.

Any information contained in the XML document, either on attributes or as text nodes between `start` and `end` tags of elements can be indexed and referenced by XPath and stored as the `value` of a `key`.

- author
- category
- content
- contributor
- date
- entry
- feed
- generator
- icon
- id
- link
- logo
- name
- published
- rights
- source
- subtitle
- summary
- title
- updated
- uri
- size

The above is a list of keys that may **not** be used as keys. They are reserved by the system for other purposes. All other names on a key is allowed, as long as the key does not have any spaces in the name. The key names are case sensitive, hence an uppercase variation could be an option. Key names must start with a letter or underscore. Any name that is allowed to be used as the name of an element in XML (tag name), may be used as the name of the key. The `:` character is not allowed in the key name as it is reserved for defining a namespace prefix in XML.

Add the attribute `@index="false"`) to any key that you do not want to be indexed, but still kept as key/value meta-data for the object. Indexed searchable keys take up more space than non-indexed, but choose them if you need to query a container using a key. If you just need information to show in a list, use non-indexed keys.

### CLI Commands

The Datatypes are stored in `tenant://Settings/Datatypes`. To list the tenant groups datatype objects do:

**CLI Syntax**

```console
use tenant
cd Settings
acl Datatypes
cd Datatypes
ls 
```

For more information see:

- [View a Datatype](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/database-commands/view-datatype)
- [List registered datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/database-commands/datatypes)

### Process Development Information

Example for creating a Datatype in the process language.

**Process Syntax**

```xml
<operation name="database" value="tenant://Settings/Datatypes">
  <create type="object" name="Airport.xdt" rename="false">
    <content type="text/xml">
      <type xmlns="https://cloudbackend.com/datatype.xsd" name="Airport" mime="text/xml" element="airport">
        <description>Airport in a location</description>
        <icon>icon://airplane2_landing</icon>
        <index>
          <key name="city" index="true" xpath="/airport/@city"/>
          <key name="country" index="true" xpath="/airport/@country"/>
          <key name="freetext" index="false" xpath="/airport/freetext"/>
        </index>
        <listviews/>
        <open/>
        <search/>
      </type>
    </content>
  </create>
</operation> 
```

For more information see:

- [Function datatype](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/functions/datatype)
- [Tutorial example datatype](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/notice-tutorial)

#### Further reading for developers

There is more information about using datatypes in the below SDK documentation under `CloudBackend Database -> Managing Datatypes`. Here advanced information is available about datatypes that only affect a single user, making it possible to have different datatypes available depending who is logged in. These datatypes will not affect database extraction, for it to happen, the datatype needs to be stored in `tenant://Settings/Datatypes` and thereby available for all users of the tenant.

The entire XML document format for datatypes is further explained here: [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format). Editing the native XML will open up all available features of datatypes.

The XML documentation contains related information for advanced developers.

- **SDK Web UI** — For developing web applications in Javascript and HTML with database connection. See code examples and tutorials. *(Javascript and HTML)*

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink that are used by CloudBackend. *(XML)*

#### Next

- [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes>*

---

## Deployments

You can publish an application to be possible to use from an external domain by choosing to deploy the application. Deployments are done using the `Deploy Wizard`, which is used from the `Projects` section. Any deployed application will show up under the `Deployments` section.

> **Note:** Deployed projects are accessible from anyone on the Internet, please make sure you have a proper login page for users to login to for any deployed application.


> **Tip:** Deploying an app will by default be locked to a specific XIOS software release. Optionally it can use the latest release.

Deployed projects are available externally through the links shown when you click on a deployed application. These links are URLs in the following formats

**Deployed application Home domain**

```console
https://[tenant]-[username]-[deployment_name].cloudbackend.cloud
```

**Deployed application Group domain**

```console
https://[tenant]-[groupId]-[deployment_name].cloudbackend.cloud
```

- **[How Deployment Works](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment)** — More information about how to deploy XIOS/3 applications can be found in the XIOS/3 documentation, here. *(XIOS/3 Documentation)*

- **[Deployment Tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/tutorials/application-deployment)** — A practical tutorial for how to deploy your project can be found here. *(Learn to Deploy)*

#### User sign-up

You can enable the ability for users to sign-up to your published application from the login page. Any created user from your published application will show up as a new identity under the Identities section. If you do not want new users to be able to sign-up, please disable the sign-up capabilities for your application.

Users that have self-onboarded and signed up for your application will belong to your tenant, and legally be the responsibility of you.

> **Note:** It is highly recommended that you create an End-user License Agreement (EULA) that regulates the relationship between your tenant/organization and the end-user.

#### Copyright

Published application must follow copyright laws and not publish any content stored in the database that makes a copyright or trademark infringement to any third party. It is the publisher of the application that is solely responsible for any infringements.

### Tutorials

- **[Deployment Tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/tutorials/application-deployment)** — A practical tutorial for how to deploy your project can be found here. *(Learn to Deploy)*

### CLI Commands

To publish do:

**CLI Syntax**

```console
publish [container path] [name] -p [password] -v [public] -a [read] -d [description] 
```

To unpublish do:

**CLI Syntax**

```console
cat tenant://Groups/.published
unpublish [publication id] -g [group id] 
```

To see your home publications do:

**CLI Syntax**

```console
published
```

To see your tenant publications do:

**CLI Syntax**

```console
published -g/-t
```

For more information see:

- [Publish Container/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/publish-container)
- [Unpublish Container/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/unpublish-container)
- [Published Containers/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/published-container)

### Process Development Information

Example publishing.

**Process Syntax**

```xml
<alias name="published" value="tenant://Groups/.published"/>
<operation name="bind" value="$published">
  <component view="PubView" name="deploy_list" select="/db:result"/>
</operation> 
```

For more information see:

- mount

#### Next

- [Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments>*

---

## Documentation

> **Tip:** Use the Open button to have the documentation in different browser tabs and use one for reading documentation and the other one for working with the database.


A you can search for keywords in the viewed volume.

The documentation section of the CloudBackend contains the following volumes:

- Database
- SDK Mobile, IoT & Cloud
- SDK Web UI (XIOS/3)
- XML Development
- CLI
- Help Authoring
- News archive

> **Note:** The `Search Help` function is performed on the current volume.

You can switch the volume you are viewing at the combobox in the toolbar. There are also some links in the documentation that take you between the documentation volumes.

> **Tip:** To send a link to someone, use the URL Copy button to copy it.

> **Tip:** Use the tabs to have multiple things you are reading open at the same time.

Please note that the XML Development documentation is included as it is useful to have some basic understanding of XML (with XPath etc.) to use the database, the datatype feature, and the supplied SDK Web UI.

### CLI Commands

To open the developer documentation in its own window, type:

**CLI Syntax**

```console
dev 
```

To open the CLI documentation in its own window, type:

**CLI Syntax**

```console
hlp 
```

#### Next

- [AI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation/ai)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation>*

---

## Home

Home is your landing page for CloudBackend, allowing you to select what you want to do next from the box choices in the menu to the left, and find any relevant news as well as recent projects at the bottom.

The CloudBackend Database enables you to quickly launch your next project on a secure and scalable virtual database, the CloudBackend Singularity Database, where multiple identities can communicate and selectively share data in the cloud, while at the same time keep important data private. Our SDKs for Web, Mobile, and IoT then allows for rapid app development with ready-made connections to The Singularity Database.

- **[Start Introduction Guide](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity)** — Have a look at our introduction to setting up your database, query your database, and build applications. *(Get Started)*

- **[Launch Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity)** — Quickly get started with application development right here in the database. *(Get Started)*

#### Next

- [Account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/account)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/home>*

---

## Identities

Using the Identities section, you can manage the identities and roles for the tenant. Functionality include creating and deleting new `identities` and `roles`, and assigning roles to identities. All identities are members of the tenant, but will not automatically be a member of any additional groups (including their databases) that are created. Using ACLs set on the identity or a role the identity have, you control what data each identity have the rights to view, create, or delete.

Following sections will display `identity` and `role` creation and deletion, and further on assigning, removing and handling access management by using roles.

### Super User - Owner

Best Practice: The *Owner* or root account is unique since it is not an `identity` of the tenant. It is the owner of the `tenant` and is only a member of the tenant, not an identity exclusively created under the `tenant` like all other identities. The Owner account is thereby the only account that can **delete** the tenant and further approve upgrades of the tenant to different subscription plans.

> **Note:** This account should therefore be locked away for security reasons, and additional identities should preferable be made for day to day work and development on the database (e-mail for creating tenant owner account may be reused once). Create a super user by first creating a new `identity` and then assign the *Administration* role to that identity.

You can manually use the *Identities* section to create a few test users to try out applications while you build them in the database. If they should login using a deployed project, do not assign them any role, and subsequently, if you want them to try your application from inside the database and the *Projects* section, assign them a role so they can login, for instance "Tester".

> **Note:** Identities with a role assigned to them need to use a different login page than the owner of the tenant, their login page is: `https://{tenant-name}.db.cloudbackend.com`. Make sure to let any identity that you want to be able to login to the database know this link. In the link above, `{tenant-name}` is replaced with your given tenant name, as displayed on the Account section.

### CLI Commands

The Identities are automatically `members` of the group tenant. To list do:

**CLI Syntax**

```console
members tenant
roles 
```

For more information see:

- [Identity Commands](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/identity-commands)

### Process Development Information

Example searching for group members.

**Process Syntax**

```xml
<operation name="tenant">
  <searchUsers groupid="{$groupId}" query="{#IdentitiesView#searchIdentityInput}" count="{$pageCount}" offset="{$pageOffset}" deleted="{$pageDeleted}" responseAlias="groupIdentities"/>
</operation> 
```

#### Next

- [Create Identity](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/create-identity)
- [Create Role](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/create-role)
- [Role ACLs](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/role-acls)
- [Manage Roles](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/manage-roles)
- [Remove Role](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities/remove-role)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities>*

---

## Price plans

The Price Plans section allows the tenant owner to define and manage price plans available to end users. It provides an overview of all existing price plans and makes it easy to create, edit, or remove them as needed. Each price plan represents a subscribable product within the tenant and defines how that product is priced and offered to users. The section also allows the tenant owner to configure where subscription revenue is sent.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans>*

---

## Projects

The database supports the ability to create, upload and run custom applications. Every application must be created within a project folder to be able to deploy them as SaaS and make them available to external users. These projects operate and run as the current logged in user and are able to retrieve and change data in the database.

> **Note:** Custom applications can be used to extend the functionality of the database. Ensure you have first created a project folder using the Project Wizard before attempting to initialize a new application. Or choose "New Project" in the application wizard when standing in the tenant or home folder or the Projects Section.

Applications are developed using the web development SDK for CloudBackend made by XIOS/3. The full development documentation for XIOS/3 is found as a separate manual in the link below. To quickly get started, first create a project and then use the Application Wizard.

- **[Launch Project Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity)** — Get started with application development by making a project folder. *(Get Started)*

- **[Launch Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity)** — Quickly get started with application development inside an existing Project. *(Get Started)*

- **SDK Web UI** — For developing web applications in Javascript and HTML with database connection. See code examples and tutorials. *(Javascript and HTML)*

### CLI Commands

To list do:

**CLI Syntax**

```console
cd Applications
ls
codepad applist.xml
load applist.xml 
```

For more information see:

- [Load Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/development-commands/load-application)

### Process Development Information

Example running an application from a project directory:

**Process Syntax**

```xml
<operation name="open" value="home://Projects/MyProject/applist.xml"/> 
```

For more information see:

- [open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/open)

#### Next

- [Clients](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/clients)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/projects>*

---

## Proxy

A `Proxy Service` defines how to connect to an external API endpoint that requires authentication. The proxy object specifies the target domain, headers, and other settings required to securely make requests. In most cases, the proxy is created automatically through the UI in a simplified form and stored in `tenant://Settings/Proxy`.

#### Minimal proxy definition

When created through the UI, a proxy object may look like this:

**Minimal Proxy XML**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd"
   name="myproxy"
   service="myproxy">
  <http-domain allow-override="false">https://api.themoviedb.org/3/discover/movie</http-domain>
  <http-header allow-override="false" name="Authorization" value="Bearer ${secret}"/>
</proxy>
```

> **Note:** Sensitive values such as API keys are stored in a `keyring`. When referenced in a proxy, they appear as `${secret}` for security and reusability.

#### Using a proxy in process code

To call a proxy from your process, use the `channel` operation. The channel binds to the proxy and executes the request.

**Channel Operation Example**

```xml
<operation name="channel">
  <name>myproxy</name>
  <proxy>myproxy</proxy>
  <title>My Proxy</title>
  <protocol>HTTPS</protocol>
  <adapter path="/" type="CompactJSON"/>
</operation>
```

> **Tip:** Channels let you treat external APIs like native services within CloudBackend processes. The `adapter` defines how to map the response format (e.g. JSON, XML) into usable process data.

The example above shows a minimal proxy and its use with a channel. However, the `proxy` definition also supports many additional elements such as `method`, `http-data`, `http-params`, and advanced header/variable handling. A complete list of all options is described in the [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format).

The XML documentation contains related information for advanced developers.

- **SDK Web UI** — For developing web applications in Javascript and HTML with database connection. See code examples and tutorials. *(Javascript and HTML)*

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink that are used by CloudBackend. *(XML)*

#### Next

- [Proxy Setup (Web UI)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/web-ui)
- [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy>*

---

## Statistics

The statistics section provides and overview of connecting identities and usage patterns of the Singularity Database.

At the top there is a switch for turning on simulated demo data.


#### Next

- [Projects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/projects)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/statistics>*

---

## Support

### Feedback / Support - Tickets

Support tool for your account in order to:

- Create new tickets or feedback
- Edit comments and clarifications
- Delete a ticket

The Support section has different views and functionality depending on the user role. The role is determined at account login.

Buttons without text will show a brief description when hovering above them.

> **Warning:** The support system needs to be configured with at least one category `Section`.

By adding multiple categories it will be easier to sort and divide the tickets between specialized people in the support organization.

> **Tip:** By right clicking on a row, a smaller menu opens.

> **Tip:** To Create Support tickets, the Member requires an Identity Role with at least **Identities** with **read** permission.

#### Next

- [Owner](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/owner)
- [Member](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/member)
- [Administrator](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/administrator)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support>*

---

## Webhooks

### Understanding inbound webhooks

Webhooks will let external services, like computers, apps and IoT appliances, send data directly into CloudBackend to be stored in specific containers.

When triggered, a webhook will store the received POST request in the container and object you specify.

#### Create the webhook definition


- Click create.
- In the popup enter a name of the new definition.
- Click the "Save API secret" to include them in the definition and be able to look up secrets later on.
- If not choosing it to be saved, it becomes your responsibility to store a 45 character long secret somewhere else.

#### Set the properties


- 
- 
- 
- Select the container where incoming data should be stored.
- 
- Define the output object name, file ending, and whether it should be overwritten when the next arrives.
- Select a file ending that represents the data type, e.g., `.xml`, `.json`, `.txt`, `.jpg`, `.png`
- 
- If `Overwrite object?` is not selected, names will get a trailing timestamp to be unique.
- 
- Optionally store incoming HTTP headers in the result.
- 
- Generate API key by clicking API key Add.


#### Make a note of the API key


- The secret will be needed in the next step: `API-KEY-SECRET`
- It must end with the character: =
- If "Save API secret" was selected when creating the webhook, a secret can be Viewed when needed.

#### View the properties


- 
- 
- The webhook URL can be copied from the top of the Properties panel.
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- If "Save API secret" was selected when creating the webhook, a secret can be selected and Viewed with a click.

#### Data model matching a Datatype for automation of meta data extraction

> **Tip:** By formatting the incoming data as an XML object to match a defined `Datatype`, the CloudBackend service will extract the meta data keys.

For more information on this, see the [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) section.

#### Calling a webhook from an external service

Once a webhook is created, external services can be configured to send their outbound webhook events into CloudBackend.

The external service must be set up with:

- Paste in your 45 character secret instead of the: `<API-KEY-SECRET>` in the calling script.
- A `Content-Type` header matching the file ending defined in the webhook’s `object` element
  (e.g., `application/json`, `text/xml`, `text/plain`, `image/jpeg`, `image/png`)
- The payload data, which will be stored in the tenant database according to the webhook definition
- Incoming data will be written into a document defined by the `object` element.
- The webhook URL: `https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/` can be copied from the Properties panel.

#### Code examples in bash

**Example: bash posting a news update - two variants**

*bash1*

```sh
#!/usr/bin/bash
SOURCE=`hostname`
curl --request POST \
     --header 'Authorization: Bearer API-KEY-SECRET' \
     --header 'Content-Type: text/xml' \
     --data "<newsfeed>Solsken i ${SOURCE}</newsfeed>" \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${SOURCE}
```

*bash2*

```sh
#!/usr/bin/bash
SOURCE=`hostname`
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: text/xml' \
     -d "<newsfeed>Molnigt med lätt regn i ${SOURCE}</newsfeed>" \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${SOURCE}
```

#### Upload a binary file

**Example: bash upload an image**

*jpeg*

```sh
#!/usr/bin/bash
PIC=/home/me/Pictures/IMG_19825.jpg
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: image/jpeg' \
     --data-binary @${PIC} \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${PIC}
```

*png*

```sh
#!/usr/bin/bash
PIC=/home/me/Pictures/graph1.png
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: image/png' \
     --data-binary @${PIC} \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${PIC}
```

#### Code example in python

**Example: python posting a news update**

*python*

```python
#!/usr/bin/python3
import requests
import subprocess

rootstart= "<newsfeed>"
rootend  = "</newsfeed>"
output   = subprocess.check_output(["hostname"], text=True).rstrip('\r\n')
message  = "Cloudy at " + output
payload  = rootstart + message + rootend

url     = 'https://api.cloudbackend.com/v1/hook/...'
headers = {"Authorization": "Bearer API-KEY-SECRET",
           "Content-Type": "text/xml"}

def post_news():
    res = requests.post(url, data=payload, headers=headers)
    print(res)

post_news() 
```

> **Warning:** If `url` contains any spelling error, the service will return "Not Found".
> If `API-KEY-SECRET` contains any typing error, the service will return "Forbidden".

The incoming XML payload will be stored in the container and object defined by the webhook’s `container` and `object` elements.

#### Verify that the new feed has arrived, using the cli


> **Tip:** The [Notice Tutorial - e5](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/notice-tutorial/webhook) under exercise 5 provides further practical training on Webhook usage with instant displaying of the incoming data feed.

#### Advanced: Edit right click option

There is a right click menu option to edit the webhook object directly in `CodePad` for more advanced setups, if needed.

The webhook is stored as XML in your tenant database under `tenant://Settings/Webhooks/`.

#### Next

- [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks/xml-format) of the webhook definition object.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks>*

---
