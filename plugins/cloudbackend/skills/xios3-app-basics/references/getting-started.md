# XIOS/3 — getting started, application structure, packaging

Introduction, quick start, the structure of an application (manifest, view, process, data), development tools and packaging, from the published XIOS/3 manual.

33 topics from the published XIOS/3 documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Application Development](#application-development)
- [Development Tools](#development-tools)
- [Application Wizard](#application-wizard)
- [CLI](#cli)
- [Debugger](#debugger)
- [Git](#git)
- [Icon Browser](#icon-browser)
- [Project Wizard](#project-wizard)
- [System Manager](#system-manager)
- [Using Visual Studio Code](#using-visual-studio-code)
- [IntelliSense Code Completion](#intellisense-code-completion)
- [WebDAV](#webdav)
- [CodePad](#xmlpad)
- [Icons and Images](#icons-and-images)
- [Intelligent Data Bindings](#intelligent-data-bindings)
- [Structure](#structure)
- [Application Package (Manifest)](#application-package-manifest)
- [Data (Model)](#data-model)
- [Process (Control)](#process-control)
- [UI (View)](#ui-view)
- [The MVC Design](#the-mvc-design)
- [Validating Code](#validating-code)
- [Application Packaging](#application-packaging)
- [Advanced Package](#advanced-package)
- [Inline Package](#inline-package)
- [Overall Structure](#overall-structure)
- [Widget](#widget)
- [Introduction to XIOS/3](#introduction-to-xios-3)
- [Quick Start](#quick-start)
- [The CloudBackend PaaS](#the-dashboard)
- [What is XIOS/3?](#what-is-xios-3)
- [Local Development](#local-development)
- [XIOS/3 on Local Machine](#xios-3-on-local-machine)

## Application Development

In this section, we will cover everything about XIOS/3 Application Development and it is divided into sections of relevance. The very foundation of Application Development in XIOS/3 is the fact that the applications are XML based and that they use the MVC design pattern, which means that an application consists of three parts:

- Model - The [Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/data-model) layer, written in XML (similar to JSON)
- View - The User Interface layer, written in [XIOS/3 View Markup](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/ui-view)
- Controller - The Application Logic layer, written in [XIOS/3 Process Markup](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/process-control)

By being able to keep these three layers completely separate, the XIOS/3 MVC design pattern makes development more efficient while simplifying parallel development, enabling developer teams to work separately on the different layers of an application. Further, modularization is possible by using the W3C XLink standard to split application packages into several documents and it can also be used to separate a view into several sections with lazy loading. This makes applications load faster and reduces the number of conflicts when developers collaborate on an application.

### What this section covers

This section covers the foundations of XIOS/3 Application Development by first introducing [the MVC design model](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/the-mvc-design), and giving an overview to the [structure](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure) of a XIOS/3 application.

For the sake of building applications the next section gives an introduction to the various [Development Tools](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools) available within and outside of the CloudBackend PaaS, such as the built-in [code editor](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad) and [debugger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/debugger). There are also sections about how to use [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code) and [WebDav](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav).

This section after that gives an introduction to the virtual database, the [Data Virtualization Layer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer) and how it is used with the [CloudBackend Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database).

Finally, there are sections about using the built-in [icon manager](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/icons-and-images) and how to [validate code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/validating-code).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development>*

---

## Development Tools

This section of the documentation contains information about the various XIOS/3 developer tools. Currently the section is very brief but will in time be expanded to contain external tools, third party extensions and user developed applications.

### Current Developer Support Tools

The following developer tools can be used for e.g. setting up templated [Application Manifests](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/application-package-manifest), editing application code, debug apps in the CloudBackend PaaS. There are also ways to build XIOS/3 applications locally, which is presented in a separate [segment](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development), even though some of these tools are presented here as well.

- [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard) - Used to quickly create apps from templates or basic Application Manifests
- [Icon Browser](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/icon-browser) - Find and search all available icons in the included icon library
- [XML Editor](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad) - Used to edit application code within the CloudBackend PaaS
- [Debugger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/debugger) - Used to debug running apps in the CloudBackend PaaS
- [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code) - Explanation for how to use VS Code and add relevant extensions
- [WebDav](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav) - Used to keep local objects in sync with the CloudBackend database.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools>*

---

## Application Wizard

The Application Wizard is a quick way to get started with your application development. The Wizard helps you initialize a new application structure within a project folder—a requirement if you intend to deploy the application as SaaS or make it available to external users.

More information about the parts of a XIOS/3 application can be found in the [Application Structure](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure) section.

You can start the Application Wizard through [this link](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development), or by clicking `Create` in the Projects tab of the CloudBackend PaaS.

To create a new application, configure the following settings:

- **Name the Application:** Provide a unique `Application Name` for display and a `View Name` for the internal IDs.
- **Select a Project:** Every application must be associated with a project folder. You can choose to create a `New Project` (which will use the Application Name for the folder) or `Add to existing project` by selecting one from the dropdown menu. This is only visible when standing in the "Project" layer in the bush component of the project section.
- **Select Application Type:** Choose `Separate Application Files (Default)` for standard development or `Inline Application Manifest` for small, single-file applications.
- **Select an initial template:** Choose between an `Empty Application`, a `Hello world` example, or a `List Project Application` utility.

> **Note:** **Important:** While the Wizard allows for "Inline" applications, the project folder container is still required for the application to be deployed and shared externally.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard>*

---

## CLI

The Command Line Interface (CLI) application is a simple command line interface that allows users to interact with the CloudBackend database. The CLI can be started anywhere in the CloudBackend database using CTRL+ALT+T on Windows and CTRL+OPT+T on Mac, or by navigating to the CLI tab.

Working with the CLI will feel natural to anyone who has ever used a command line interface before, where you type various commands, optional flags and arguments, and press Enter to have them executed. Control-C aborts the currently running command. You can use left and right arrows, Home and End, Delete and Backspace to edit the current line, and use up and down arrows to navigate the history of commands.


#### Using the CLI

There are various commands you can use in the CLI. As shown in the screenshot above, by running the command `help` you will see a quick overview of available commands, where you can use `help -a` to list all available commands or `help [command name]` to get help about a specific command. Running the command `hlp` will open the entire help documentation for the CLI as a separate application.

The CLI can also visualize similar information as the [System Manager](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/system-manager) by e.g. running the commands:

- `apps` - Shows all running application packages
- `views` - Shows all running views
- `ps` - Shows all running processes
- `cache` - Visualizes all document data models
- `bindings view` - Shows bindings for the specified <view>

#### Using the CLI to Inspect Applications

The CLI can also be used to inspect applications, e.g. the selection of specific components, using the command `cat`.
Here are some examples used in the [Kanban Tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/kanban-tutorial):

- `cat tenant://Kanban` - Returns the db:container for the *Kanban* Container in the *tenant* database
- `cat #view#component` - Used for inspecting the state of any component, in any view, e.g. `cat #Kanban#boards` to show the state if the *boards* component in the view *Kanban*

The screenshot below shows the highlighted results when running the commands `cat tenant://`, `cat #Kanban#boards`, `cat #Kanban#lists`, and `cat #Kanban#cards`, in the open Kanban application where you can see the current selection of each component.


> **Note:** Running the command `cat #Kanban` will return the XML for the *Kanban* view code.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/cli>*

---

## Debugger

The XIOS/3 Debugger is a useful tool to get better insights into the application you are building. It is started by right-clicking the Title-bar in a running application and choosing *Debug*, or with an application running use Ctrl+Alt+D on Windows and Ctrl+Option+D on Mac. The Debugger can also be started through the System Manager application.

The Debugger is used to debug the process code, showing the Trace, i.e. the various [Steps](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) triggered by user interactions, to the left.
If a Step is selected in the Trace list it will show the Incoming Event Trigger (!) for that step to the top right, with the following Executing Process Step below.

A lot of useful information can be found in the Incoming Event Trigger (!), especially in the four parameters in the grey box. These are:

- **Object**: The URL pointing to the XML document of the Incoming Event Trigger
- **Base**: Points out the beginning of our XML document, i.e. ignores any parent elements and sets this element as our base starting point, the Base XPath
- **Selection**: The Selection is based on what has visually been selected (in components that support it) giving an XPath pointing out this 0..n selection, relative to the Base path
- **Value**: If there is any content in Value, the Event has been serialized into text, which makes the above three dimensional variable (Object, Base, and Selection) ignored

The Debugger also has a tab for the active [Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) in your current application, with an Evaluation of the currently selected Alias to Data Model below.


### Functionality of the Debugger

**Trace**
The Trace tab is where you see a list of all Steps that have been executed because of user interaction in the debugged application.

**Breakpoints**
Are used to set breakpoints in certain Steps when Debugging the application.


**Info**
Gives you some information about the Debugger.

**Code**
Shows the Incoming Event Trigger (!) with its corresponding Object, Base, Selection and Value, where the Value is the Serialization of the Event Trigger, `{!}`.

**Aliases**
The Aliases tab shows a list of current [Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) in the running application, with its corresponding Value, XPath and Datadoc. If an alias that can be evaluated is selected in the list it will show its XML in the segment below.


### Common Mistakes When Developing

**Issue 1: The XML formatting**
One of the most common issues is the correctness of your XML. Since XML must be well-formed, all XML-based documents, including process-XML, UI-XML and all XSLT documents must have one and only one root-element, all XML-elements must be properly enclosed and no elements can overlap each other. Furthermore all attributes must be space separated.

**Issue 2: XSLT not matching the correct node**
Another common issue is when you are using the listview or render components where you use XSLT documents to render the page from the bound data. Then you match the nodes with different templates, if the data (object and/or XML document) gets changed or small changes are made in the template other templates might not longer be matching their correct nodes and changes must be made.

**Issue 3: Binding data to a component that is not valid**
Before you bind data to a component it must be rendered by the system. For example you cannot bind data to a component that is hidden or inside a non-opened UI-XML, either not opened by the process document or not yet xlinked into the view.

Do not bind data until the view has triggered the event [Loaded](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/loaded)

**Trigger listening to Loaded Event**

```xml
<trigger view="MyApp" event="Loaded" step="init"/>
```

**Issue 4: The XPath**
It is easy to lose yourself when traversing up and down in an XML-document using XPath lot of debug-traces and take one step at a time is the only way to do it when it gets complex.

**Issue 5: The namespaces**
Remember to use correct namespaces when working with XML. When for example trying to link in more views using XLink remember that you must declare the XLink namespace to be able to use it.

There is however also an issue with namespaces that you might encounter that might appear and it has to do with lack of good support by the browser.

When trying to reach the path below you might encounter an undeclared namespace issue even though you have declared the namespace in your root-element.

`db:object[@name = 'hello.xml']`

**Issue:** PO: Reference to undeclared namespace `db`

The solution is to make the browser ignore the namespace by using the following XPath instead.

`*[local-name() = 'object' and @name = 'hello.xml']`

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/debugger>*

---

## Git

When collaboratively building applications in a team we recommend using Git as a distributed version control system to track and control source code.

If you have a Git environment already set up you can use it to check out code to your local machine, preferably through [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code), and synchronize the source code of your application(s) with you `home` database in CloudBackend. This allows you to edit code in VS Code, synchronize it with the cloud, and test your applications live through CloudBackend. Any changes you make locally or in the cloud is then committed and pushed into the Git repository.

> **Tip:** Do not sync the git repository to the `tenant` database, use the private `home` database of a developer as a staging area before bringing it into the shared `tenant` database. From there it is then deployed.

The idea is to use Git versioning on the local machine and then test the code through CloudBackend using the `home` database. Whenever a version is ready for deployment, it is first synced to the developers `home` database and from there it is deployed using the `tenant` database. This way of working allows each developer to have their own version of the application in their own account to develop on and test it live through the service similar to how Git is used with its local copy of the source code.

This allows you to use Git to keep version control of code throughout a team of developers and use the latest version e.g. for [deployment](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) after it has been verified and tested through one or several developers personal accounts.

> **Note:** It is possible to deploy directly from the `home` database, the application is then first automatically copied to the `tenant` database before it is deployed and externally made available.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/git>*

---

## Icon Browser

The Icon Browser allows you to browse and search for all icons available in the icon library. Icons are shown under different categories. If you need to see all icons, choose `all` in the combobox.

- Applications
- Business
- CloudTop (special icons developed for the CloudTop web operating system)
- Custom (special icons developed for CloudMe and CloudTop)
- Flags
- Development
- Network
- Objects
- Other

You can start the Icon Browser through [this link](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development), or by clicking `Icons...` in the Projects tab in the CloudBackend PaaS.

Several icon libraries with different sets of icons, but mapped to the same icon names are available and mapped to the built-in themes, which means that depending on theme you may get `SVG` vector icons or `PNG` pixelated bitmap icons. The use of the icon protocol syntax ensures that your application receives the right icon, regardless of which theme the application runs within.

> **Note:** Icons are accessed through the `icon://` protocol, if you select an icon the Icon Browser will provide you with the correct path similar to: `icon://icon-name`.

The icon libraries are created by `https://iconexperience.com`, Copyright by INCORS GmbH (www.incors.com). If you publish applications with these icons to your own web domain, intranet or installed application, you need to buy a license to use these icons. Use through the CloudBackend service is covered by a license.

### Reference manual on icons

Icons Reference

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/icon-browser>*

---

## Project Wizard

The Project Wizard is used to create the necessary organizational structure for your applications. As applications must reside within a project folder to be deployed as SaaS, using the Project Wizard is typically the first step in the development lifecycle.

To create a new project folder, configure the following settings:

- **Name the project:** Enter a unique `Project Name`. This name will be used for the folder directory in the database.
- **Select a Project Structure:** Choose `Project Folder and Sub-Folders` to create a standardized directory for assets, or `Only Project Folder` for a simplified, single-level container.
- **Select a Project Location:** Choose `Home` for personal development projects or `Tenant` for projects intended for staging or production environments. This is only visible when standing in the "Projects" level in the bush component. The location will be automatically selected when standing in "Home" or "Tenant".


> **Note:** **Recommendation:** Use `Home` projects for initial drafting and testing. Once an application is ready for wider use or SaaS deployment, a `Tenant` project is preferred.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/project-wizard>*

---

## System Manager

The built-in System Manager application allows you to inspect running applications in the CloudBackend PaaS. To start the System Manager run the command `system` in the CLI, or click [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development).


#### The Application

The System Manager consists of tabs to inspect the following things:

- **Applications** - Shows information about currently running applications, including how many instances under #. 0 instances means that the application is closed but not *killed*
- **Views** - Shows currently open application [views](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view). The number after the colon in Alias, e.g. :2, denotes which view if several views of the same application is open
- **Processes** - Allows you to see which processes are running for opened applications. This tab also allows you to Restart, Kill or run the [Debugger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/debugger) on the selected process
- **Documents** - Displays the (temporary) documents used by opened applications
- **WebShare** - Lists any WebShares created by the user
- **Share** - Similar to a WebShare but only used internally between users of a CloudBackend database
- **Transactions** - Displays a list of all transactions (changes) made in opened documents
- **databases** - Shows any mounted databases such as databases, groups or (hard) databases. *home* and *tenant* are standard
- **Channels** - Lists open channels. *cbe* is standard

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/system-manager>*

---

## Using Visual Studio Code

To facilitate local development using Microsoft Visual Studio Code™ we provide you with a `CloudBackend for VS Code extension`, for syncing files to CloudBackend and enabling live editing of apps, as well as [IntelliSense](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code/intellisense-code-completion) for code completion.

### Extension CloudBackend for Visual Studio Code

By installing the CloudBackend Extension from the VS Code marketplace you will be able to keep local files in sync with the CloudBackend Database, and be able to live edit applications from VS Code with the result immediately shown in the browser.


To add this extension, open the marketplace for extensions in VS Code (Ctrl+Shift+X) and search for `cloudbackend`. Locate and install the extension called `CloudBackend`.

> **Note:** To use this extension you first of all need a CloudBackend account, and an open workspace folder in VS Code where you will store your application locally.

### Quick Guide

Once you have installed the CloudBackend Extension the most important aspects are:

- You need to have an open workspace folder in VS Code, and be logged into your CloudBackend account. (If you are a regular user; Please specify under what tenant you wish to login.)
- Files under your `home://Applications` and `tenant://Applications` will appear in the Extension view. Any new files in the cloud will appear when clicking Refresh.
- Sync All will sync all local files in your workspace folder to the cloud. Any existing files will be **overwritten**. Any new files will be added to `home://Applications` and visible in the web UI.
- Clicking twice on any file in the Extension view will 1) download it to your open workspace folder and 2) open it for editing in VS Code. Any changes will be done on the local file.
- All available features can be accessed through the Command Palette (Ctrl+Shift+P) by typing *cloudbackend*. For example syncing or diffing the currently open file to what is in the cloud.

### Starting the CloudBackend Extension

Once your CloudBackend Extension is installed, it will appear in the activity bar and you will have access to an introduction guide inside VS Code as well, as seen in the image below. To continue it is now important that you have an open workspace in VS Code, preferably a local folder on your computer where you want to store your XIOS/3 applications. This folder may of course be part of a larger folder hierarchy for various XIOS/3 projects.

Once you have an open workspace, just click the CloudBackend Extension in the activity bar, giving you access to the login panel as seen in the image. Now login to CloudBackend using your credentials.

- If you are a regular user; Please specify under what tenant you wish to login, as your account can be associated with multiple tenants.
- If you wish to login as a tenant, you may leave the tenant field empty.

You should now be logged in to your account seeing the content of the Application containers of your `home://` and `tenant://` databases in the Applications View.

**Applications View:**
When logged in you will be able to see and work with all the content of your `home://Applications` container, and also see the content of your tenant's Applications container. If you click on one of the files it will be downloaded and saved to your current working directory, i.e. your workspace folder. If you click on the same file again it will "sync" the cloud version to your current working directory. **This action is undoable.**

- `home://Applications` shows your personal applications. This is also where you develop new applications before deploying them to your tenant i.e. your `tenant://Applications`.
- `tenant://Applications` shows the applications that have been published under your tenant.

**Refresh:**
You can notice that both containers have a Refresh symbol, used to pull any changes from CloudBackend into VS Code, e.g. if an application has been added to the container.
**Sync All:**
The `home://Applications` container also has a *Sync all* button which will sync all local versions of your files to your `home://Applications` container.

*Explanation: The cloud has files A, B and C, while you have A and C locally in your current working directory. The *Sync all* operation would result in A and C to be updated in the cloud with your local versions, i.e. **replaced**.*

> **Warning:** Sync actions are undoable, any changes done in the cloud will be lost if new versions are pushed from VS Code.


### Using the CloudBackend Extension

The CloudBackend Extension has more features than the ones available directly in the activity bar. These are accessed by opening the Command Palette (Ctrl+Shift+P) and typing *cloudbackend*. These features are explained further below.


**Sync current file:**
This will sync the currently open file with your `home://Applications` container. If the file is newly created locally this action will also upload the file to the cloud.

**Sync all:**
This will sync all local versions of your files to your `home://Applications` container.

> **Warning:** Sync actions are undoable, any changes done in the cloud will be lost if new versions are pushed from VS Code.

**Clear cache:**
Removes all cached data, except login details. (Login details are cleared once you log out.)

**Refresh:**
This will update the file list for both `home://Applications` and `tenant://Applications` containers, showing if any files have been added in the cloud.

**Toggle automatic synchronization:**
This will enable the file you are working in to be synced automatically each time it is saved, making it good for real-time editing of applications that you have running in the browser. This feature is toggleable in the settings, and can also be combined with auto-save.

> **Tip:** If you have auto-save enabled in VS Code, and the CloudBackend auto-sync toggled, you will have real-time editing of your applications running in the browser.

**Logout:**
This will log you out of the current account, enabling you to e.g. login again on another tenant. Just don't forget to save and sync your progress before logging out.

**Diff with cloud:**
Opens a new document (untitled) that will show the difference between the file in CloudBackend (shown to the left) and the local version (shown to the right).

### Proposed Workflow

There are three main stages of a xios application.

- `home://Applications` - each developer's working copy.
- `tenant://Applications` - combined application that is supposed to be tested.
- Deployed application - end-user final application.

With these steps in mind, to start working on an application see the `tenant://Applications` version to be the equivalent of the main or master branch in Git.

1. "Pull" that working copy into your `home://Applications` by selecting it in the extension to start developing your feature.
2. "Push" your changes by either "Sync current file" or "Sync all" to your `home://Applications`.
3. The developer performs code feature tests before proceeding.
4. Replace the copy in `tenant://Applications` with your working copy to be tested. (You should have a protocol for this.)
5. The testers performs a complete system test before proceeding.
6. Deploy the application.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code>*

---

## IntelliSense Code Completion

By installing and configuring an XML plugin from the Visual Studio marketplace you can enable `IntelliSense`, which provides code completion, tooltips and XML validation of XIOS/3 applications developed in VS Code.

To add this feature, open the marketplace for extensions in VS Code (Ctrl+Shift+X) and search for `xml redhat`. Locate and install the extension called '`XML`', provided by `Red Hat`.

Next, create a new file called 'catalog.xml' and add the following text:

```xml
<catalog xmlns="urn:oasis:names:tc:entity:xmlns:xml:catalog">
  <uri name="http://xios3.com/app/1.0" uri="relative/path/to/application.xsd"/>
  <uri name="https://cloudbackend.com/datatype.xsd" uri="relative/path/to/datatype.xsd"/>
</catalog>
```

Save the file in any location.

Next, take note of the file path to the file `application.xsd` which is inside `xios/config/schemas` in your `xios` project folder.
In the file 'catalog.xml' you just created, edit the two `uri` *attributes* so that the paths point to `application.xsd` and `datatype.xsd`, **relative to the position of your 'catalog.xml'**.

E.g: if you saved your 'catalog.xml' in:
`/home/user/projects`
and your 'application.xsd' is in:
`/home/user/projects/xios-dev/xios/config/schemas`
then your relative `uri` path should be:
`xios-dev/xios/config/schemas/application.xsd`

Next, in VS Code, open the command palette (either by pressing 'F1' or 'Ctrl+Shift+P').
Type "open settings".
You are presented with a few options, choose `'Preferences: Open User Settings (JSON)'`.
If the opened settings file is empty, add '{}' to the file.
Inside the brackets '{}', add a new entry at the end:

```javascript
"xml.catalogs": ["/absolute/path/to/catalog.xml"],
```

Edit the entry by providing the **absolute** path to your 'catalog.xml' that you created earlier.

At this point, if everything works correctly, by simply adding `xmlns="http://xios3.com/app/1.0"` to the `application` element node in your XIOS/3-applications, IntelliSense should be enabled. E.g:

```xml
<application name="My app" xmlns="http://xios3.com/app/1.0"/>
```

If IntelliSense isn't working, double check all the paths are correct in the files you edited, including the entry that you added to your `settings.xml`
You can also look at `https://github.com/redhat-developer/vscode-xml/wiki/XMLValidation#xml-catalog-with-xsd` for additional details.

Please note that adding the above xmlns entry will also work on `process` and [`view`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) elements when they reside in separate files.

If you want to add IntelliSense to a single application file, without doing the above setup, you can also do:

```xml
<application
      xmlns="http://xios3.com/app/1.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://xios3.com/app/1.0 xios/config/schemas/application.xsd"/>
```

> **Note:** adjust the `xios/config/schemas/application.xsd` path (the `xsi:schemaLocation` attribute) to correctly point to 'application.xsd', relative to where your application is located.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code/intellisense-code-completion>*

---

## WebDAV

You can use WebDAV on Mac, Windows, and Linux to edit XIOS/3 files locally and keep them in sync with the CloudBackend PaaS. This means you can use and access files as if they were on your local hard database, edit documents using your choice of editor, and manage files and folders using your standard file explorer.

Many 3rd party applications and apps on mobile devices also support WebDAV. This means that you can access your files from within any app compatible with WebDAV. The Apple productivity suite for iPad; Pages, Numbers and Keynote all support WebDAV, enabling you to open, edit and save documents directly from within the apps to XIOS/3.

In the screenshot below you can see how the file *webDAV.xml* is open both in [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code) and in the CloudBackend PaaS's XML Editor. Any changes made in Visual Studio Code will sync with what is running in the CloudBackend PaaS.


### Set-up WebDAV

Regardless of the client the end point is **https://webdav.xios3.com/username** where username is the name you use to access the XIOS/3 dashboard in all lowercase.

> **Note:** If you are using CloudBackend as your backend the URL will be https://webdav.cloudbackend.com/username instead of "xios3", using your CloudBackend credentials for login.

#### WebDAV for Windows

Windows has built-in support for WebDAV.

1. Open "This PC" from the desktop icon, through search, or from the start menu
2. Select the "Computer" ribbon
3. Click on "Map network database" in the tool bar
4. Enter https://webdav.xios3.com/username as "Folder"
5. Click "Finish"
6. Enter your XIOS/3 username and password

#### WebDAV for MacOS

MacOS has built-in support for WebDAV.

1. Open your Mac Finder. From the "Go" menu select "Connect to Server..."
2. In the "Server Address " field, enter: "https://webdav.xios3.com/username"
3. Type in your XIOS/3 username (in lowercase) and password. Be sure "Registered User" is selected and click "Connect"
4. Open "System Preferences" in the Apple menu and then select "Accounts" or "Users and Groups"
5. Click at the "Login Items" tab, click on + located under "Login Options", find and select the mounted volume from the previous steps above and click "Add"
6. The volume will now be added to the "Startup Items" queue and mounted every time computer is started

#### WebDAV for Linux

Linux has built-in support for WebDAV.

1. First open your File Explorer (Nautilus or Konqueror)
2. Open "File" in the menu bar and select "Connect to Server..."
3. In the dialog that appears select "WebDAV (HTTP)" as Service type
4. Set Server as "webdav.xios3.com"
5. Set Folder to "username" (in lowercase) and click "Connect"
6. Type in your XIOS/3 username (in lowercase) and password in the authentication dialog that appears and click "Connect"

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav>*

---

## CodePad

To aid developers in their development of applications XIOS/3 has developed an XML editor, called CodePad, offering basic XML editing. The application will check if the document is well formed, display line numbers as well as search and replace functionality.

You can read more about the CodePad in its [application documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xmlpad).

- **[Start CodePad](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development)** — Launch the XIOS/3 CodePad *(XML Editor)*

#### The CodePad UI


> **Note:** A useful feature of the CodePad is the `icon://code` "pretty print" function, available to the right in the tool bar, for automatic indentation of your code.

> **Warning:** If editing an xml file, check the light at the bottom where green indicates `Valid` xml. If it is red that indicates `Invalid` xml code, and you should not save it until the xml has been corrected.

CodePad main window consists of the following major areas:

- **Top Menu bar** - Menus for File, Edit, Search and Help
- **Tool bar** - Contains tool bar buttons for:
  - New file - Creating new XML document
  - Open file - Open a document from the file browser
  - Save file - Save current file
  - Copy - Copy selected text
  - Cut - Cut selected text
  - Paste - Paste currently copied / cut text
  - Undo - Undo latest entries
  - Redo - Redo latest undo
  - Search text - Opens dialog for searching text
  - Find and replace - Opens dialog for finding and replacing text
  - Pretty print - Automatically indents code
- **CodePad** - The area for typing code
- **Mode Status** - Shows that we are editing XML
- **XML Well-Formedness Indicator** - Shows whether XML is well-formed (valid) or not
- **Row and Column Position Indicators** - Shows the position of the current line

#### Font Properties

The Font Properties window, found under Edit -> Font Properties allows you to setup the way texts are being displayed in the text area.


The window consists of the following:

- **Font Type** - Contains all available font faces
- **Font Style** - Consists of bold, italic and underline styles
- **Font Size** - Font size ranging from 8pt to 148pt
- **Preview** - Displays a sample text for the selected properties
- **Button Area** - Consist of OK and Close buttons

#### Find and Replace

The Find and Replace window allows you to find and/or replace text within the opened document. It consist of two tabs namely the find and the replace tabs. Below are image displays of each tab.



The window consists of the following:

- **Search Field** - Text area for the keyword to search
- **Replace Field** - Text area for the text replacement
- **Refine Search** - Additional option for searching
- **Button Area** - Consist of the Find Next, Replace and Replace All buttons

This application uses the [CodeEditor](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/codeeditor) component which allows anyone to make their own XML editor.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad>*

---

## Icons and Images

When developing applications, you will most likely make use of images or icons for your applications. For this you can use either the icons provided by XIOS/3 or use your own icons.

#### Icon Protocol

**Icon protocol icons (managed by theme engine)**

```xml
<image src="icon://rocket" width="32" height="32"/>
```

The idea of the icon protocol is to be able to switch icons for the application automatically if the current theme is changed. The icon protocol and the icon manager will pick the icon corresponding to the requested icon in accordance with the chosen theme.

Type the following command in the CLI to view a list of all available icons.

**List all available icon protocol icons**

```console
cat xios/icons/ie-i.xml
```

#### Icon Files

**Base server icon path**

```xml
<image src="xios/icons/applications/16x16/about.png" width="16" height="16"/>
```

If no protocol is given, the icons will be loaded from the base server (where the top HTML page is hosted, i.e. `host://`). In all other cases the icon will be loaded through the Data Virtualization Layer. They may even be stored in the CloudBackend Database.

**XIOS/3 virtual data layer icon path**

```xml
<image src="home://Documents/image.png" width="16" height="16"/>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/icons-and-images>*

---

## Intelligent Data Bindings

In XIOS/3 data bindings are done using declarative language, which removes a majority of conventional application code and the need to write code for updating the data model and underlying data layers when an end-user inputs data or data change on the server-side.

XIOS/3 also has intelligent user interface components that autonomously updates and reflects data model changes, while a client side transaction manager handles all data updates and makes sure changes in the data model are always updated in the user interface and that user interaction with the view automatically updates the data model.


1. All incoming data is transformed into generic and standardized XML
2. XIOS/3 Rules Engine normalizes data for generic components and instructs what to do with the data
3. Building blocks are declaratively bound to data and rules by the developer to set up the User Interface
4. XIOS/3 automatically takes care of visualization, keeping both the User Interface and its data source updated

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/intelligent-data-bindings>*

---

## Structure

This section explains what a XIOS/3 application consists of and briefly explains XML syntax. The latter is very important since XIOS/3 applications are built using XML and we have therefore compiled a short list of restrictions and a basic syntax of XML.

In order to develop XIOS/3 applications you also need to understand the application MVC design model, be familiar with the application package structure. The structure of an application will be explained in the section Creating and packaging applications.

An application consists of at least one application view, but can have any amount of views. A view is a window or popup part of an application.

This section will conclude with a simple example application consisting of one view managing a list of books.

The three elements of the MVC design are always divided into different documents, separating the model, view and control from each other. Next, we will explain how to define and work with the model to build XIOS/3 application views and make the application come alive.


### XML Syntax and Restrictions

The XML syntax is very easy and logical. These XML restrictions apply to all XML languages, such as XML, XSLT, XHTML, UI markup and process markup. The following rules and restrictions apply to all XML languages.

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink. *(XML Reference Manual)*

#### Summary

- Every XML document must have an XML processing instruction.
- Every XML document must have a root element.
- An element name must never start with the word XML.
- XML is case sensitive, there is a difference between <a> and <A>.
- Only empty elements should be self-closing.
- All attributes should be placed inside double (") or single quotes ('). They can however not be used at the same time.
- Elements may not overlap each other.

The last, rule which states that elements must not overlap each other, means that; if B is the child element of A then B must be closed before A and never after, otherwise they would overlap each other.

**Basic XML Syntax**

```xml
<?xml version="1.0"?>

<element attribute="A" attribute2="100">
  <childElement value="1"/>
  <childElement value="2"/>
  <childElement>No Value</childElement>
</element>
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure>*

---

## Application Package (Manifest)

The Application Manifest is the equivalent to the executable program. It defines which [views](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/ui-view), [processes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/process-control), and sometimes also [data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/data-model) that should be used by the application.

The manifest also defines the [icons](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/icons-and-images) for the application, its name, how many instances of the application that may be started and the about information.

- **[Application Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging)** — More information about application packaging in XIOS/3. *(Shortcut)*


**Application XML basic structure**

```xml
<?xml version="1.0"?>

<application name="MyApp" icon="icon://shield" instances="0">
  <settings/>
  <about/>
  <resources/>
  <process/>
  <view/>
</application>
```

Please see the section about [Application Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging) for more information.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/application-package-manifest>*

---

## Data (Model)

The data XML has no restrictions on element structure except that it must be well-formed XML. The data XML can be structured in several documents; these can be static - or dynamically generated files requested from the server via the client-side web browser.

- **[CloudBackend Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database)** — Shortcut to more info about the CloudBackend Database. *(Database)*

- **[Data Virtualization](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer)** — Shortcut to more info about data virtualization in XIOS/3. *(Data Virtualization)*

- **[XML Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xml-development)** — Shortcut to XML reference documentation. *(XML Reference)*

**Data XML basic structure**

```xml
<?xml version="1.0"?>

<documentRootName>
  <!-- Put XML document elements here -->
</documentRootName>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/data-model>*

---

## Process (Control)

The [process markup](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development) describes the application logic execution steps and the [panel element](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) operations performing the actual programming actions for each step. The operations let you control the application; you could compare operations to functions in traditional programming languages.

This section will only cover the process markup language in brief. A more detailed explanation of element restrictions, required and optional attributes and any other related application logic programming can be found in the section on Process Development and in the Process Operations Reference Manual.

- **[Process Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development)** — More information about process development in XIOS/3. *(Shortcut)*

**Basic XIOS/3 process structure in a process markup document**

```xml
<?xml version="1.0"?>

<process name="[name]" version="[version]">
  <!-- Put your triggers here -->
  <trigger view="[name]" component="[name]" event="[type]" step="[unique identifier]"/>

  <!-- Put your steps here -->
  <step id="[unique identifier]" name="[name]">
    <!-- Put your operation code here -->
  </step>
</process>
```

#### Process root element

The process markup must have a process root element. The element must specify the name and version attributes. The name attribute must be a unique name identifier and the version attribute specify the version of the process language to use.

#### Trigger element

At the top of the process markup, you will find trigger elements. A [trigger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers) is an event caused by user interface components invoked when the end-user interacts with the application, for example using the keyboard or mouse. A trigger can also be invoked by actions performed by the XIOS/3 system. Triggers initiate at a specific step and start executing operation.

The trigger elements have to specify:

- view attribute, referring to the application view to which the trigger is mapped
- component attribute, referring to the GUI component to which it is mapped
- event attribute: the component or system event type to get triggered
- step attribute: the step to handle the event triggered

#### Step element

Step elements follow the trigger elements. They provide instructions on what should occur when the [trigger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers) has been invoked. The step element may contain any amount of alias elements or operation elements. A step can continue executing operations in another step by specifying a goto attribute with the number of the next step as value. Movement to another step will take place when all operations in the first step have been executed.

The step elements have to specify:

- id attribute holding the identifier of the step
- name attribute specifying a unique name of a step

#### Alias element

An [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) is a variable (global or local) in the process markup document and will exist as long as the process is running. The alias can hold text, numbers or a document reference. Using aliases for document references makes reuse of references efficient, because there is no need to type the entire path every time a document must be accessed. If you want to use a reference to an alias, put a $ sign before the alias name.

#### Operation element

The operations are the actual programming logic and make the GUI come alive through end-user interactions. The process markup operations may remind you of method calls invoked on the components, symbolizing classes or objects in other programming languages.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/process-control>*

---

## UI (View)

The [UI markup](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development) describes an application view structure containing layout elements and graphical components. All of these are elements in the UI markup, with names corresponding to the names of the respective application view or components.

This section will only cover the UI markup language in brief. A more detailed explanation of element restrictions, required and optional attributes and other related application configuration can be found in the section on UI Development and in the Component Reference section.

- **[UI Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development)** — More information about UI development in XIOS/3. *(Shortcut)*

**Basic XIOS/3 application view structure in a UI markup document**

```xml
<?xml version="1.0"?>

<view name="[name]" version="[version]" icon="[path]">
  <panel name="[name]" width="auto">
    <!-- Put application view panels and components here -->
  </panel>
</view>
```

#### View element

The application view UI markup must have a [View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) root element. The element must specify the name and version attributes. The name attribute must be a unique name identifier and the version attribute must specify the version of the UI components to be used.

#### Panel elements

To describe the application view layout, a single top-level [panel element](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) must be placed inside the view element. The container panel can contain any amount or structure of panel layout elements or component elements.

> **Note:** All UI components except [menubar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menubar) and [toolbar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar) are required to be within a [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element.

#### Component elements

The component elements are the actual visual building blocks placed inside the view layout panels. They visualize the common components of almost any modern application, GUI library or internet related system. For example [list](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list), [tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree), [menu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menu) and [toolbar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar) components are widely used in XIOS/3 applications.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/ui-view>*

---

## The MVC Design

XIOS/3 is designed according to the Model, [View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view), Controller (MVC) design pattern. The user interface, the data and the logic of a component are defined in separate documents, all using XML. With the CloudBackend database, they can all be stored as separate objects.

The idea behind the MVC design is to separate data (the model) from the user interface (the view). An intermediate layer (the controller), is responsible for the logic and links together the data and the user interface. This design simplifies updating of the system. It also enables the use of, for example, one component's logic in another component or having multiple views of the same application.


#### The model

The model is described in standard XML and is the data that gives the graphical component information. This information is presented to the end-user as text, numbers, pictures or other informative data.

#### The view

The [view](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) is described in XIOS/3 UI markup and presents the interface, creating an application view containing graphical components. Each component is described in XML as an element, similar to the way an HTML tag describes a graphical widget for a website.

#### The controller

The controller is described in XIOS/3 process markup and is an abstract way of programming. It is the application logic - an intermediate layer connecting the model and the view.

The process markup consists of a number of steps, and typically execution starts on step 1. A step consists of operations changing application states, application user interactions or storing data to the server. Most steps are invoked by something called a trigger.

A trigger is an [event](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model) caused by user interface components invoked when the end-user interacts with the application, for example using the keyboard or mouse. The XIOS/3 system sometimes invokes [system events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events) that can be connected to a trigger as event types.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/the-mvc-design>*

---

## Validating Code

You validate your UI markup and process markup code by using the XIOS/3 XML Schema documents.

In Notepad++ you can simply add the following two attributes and use the XML Tools plugin to validate your code externally.

**UI markup validation**

```xpath
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://dev.xios3.com/schemas/view.xsd"
```

**Process markup validation**

```xpath
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://dev.xios3.com/schemas/process.xsd"
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/validating-code>*

---

## Application Packaging

Application Packages are XML documents that are used to create a virtual package, in the form of a [Application Manifest](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/application-package-manifest) document, for all documents and objects used in your application. This document will allow you to run multiple instances of your application and enjoy the advantages of application isolation.

The application document also allows for limiting the number of active application instances by a single end user.

For small applications, with little code or very few documents, and development in the CloudBackend PaaS use [Inline Application Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/inline-package). When dealing with larger applications, or development in teams, use [Advanced Application Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/advanced-package). Both of these utilize application package documents. However, with Inline Application Packages all the code is written directly in one single document. When dealing with Advanced Application Packages you have an application document which only makes references to external view and process documents.


### Storage

Applications are primarily stored in `tenant://Applications` if you want to share your application with other users. If you have created an application for yourself, you can store it under `home://`.

If you are building apps in the CloudBackend database and put them under `tenant://Applications` we recommend [Inline Application Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/inline-package), however you may choose to divide your application into separate documents using the following database structure as sub-containers to `tenant://Applications`:

- views
- processes
- data
- layout
- images

The root container should contain the application document. In the views and processes containers all UI XML and Process XML documents should be placed. The data container contains static data that the end-user can't alter. The layout container is a multi-purpose container containing CSS files and XSLT documents used in XSLT database Components. Finally the images container contains all images of any sort. Again, this structure is for increased readability of your application. Also remember to declare which objects must be downloaded when the application goes into offline-mode.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging>*

---

## Advanced Package

This is what an Advanced Application Package document might look like. It is used to link external documents into the `application manifest` using xlink and is preferred for larger teams and application projects where you would want to keep documents separate and/or use multiple view documents for the same application.

For faster applications and development in the CloudBackend PaaS, we recommend using [Inline Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/inline-package).

**Application Package for HelloWorld**

```xml
<?xml version="1.0"?>

<application name="HelloWorld" icon="icon://earth" xmlns:xlink="http://www.w3.org/1999/xlink">
  <share>false</share>

  <settings>
    <path>home://</path>
  </settings>

  <about loader="false" version="1.0" revised="2019-04-10" created="2019-02-05" author="XIOS/3" publisher="XIOS/3">
    <description>This is a test application</description>
    <license xlink:actuate="onRequest" xlink:href="https://xios3.com/license/lgpl_2.1.xml">GNU LGPL 2.1</license>
    <installed>2020-03-10</installed>
  </about>

  <resources>
    <item xlink:actuate="onRequest" xlink:href="home://Documents/countries.xml"/>
  </resources>

  <view name="HelloWorldProcess" xlink:actuate="onLoad" xlink:href="home://Application/HelloWorld/views/mainUI.xml"/>

  <process step="start" xlink:actuate="onLoad" xlink:href="home://Application/HelloWorld/processes/mainProcess.xml"/>

</application>
```

#### Line 04

Here we define if the application should support Gesture Based Collaboration (GBC) or Application Sharing as it is publicly known.

#### Line 06-08

Here the `settings` element is declared as well as the `path` child element. As this is a regular application we will set the path to home:// indicating that the application should be run on your local file system.

#### Line 10-14

The `about` element contains all required attributes. The `loader` is set to false, since our application loads quickly and no loaded is needed.

We will also set the `author`, `copyright` and `publisher` attributes to XIOS/3.

The `description` child element contains a short description about the application.

We will also set the `license` element to the Xfree license. Finally the `installed` element will just contain a date.

#### Line 16-18

In the `resources` element we define the files/objects we would need to download if the application goes offline.

We define one `item` child element to initiate `onRequest`. This document is an XML data document containing information about countries.

#### Line 20-22

The final two child elements will link to our only `view` document and our only `process` document.

We will set the `process` to `onLoad` to ensure that it starts when the application starts. We will also set the `step` attribute to "start" which is our first step that will open the `view` document.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/advanced-package>*

---

## Inline Package

This is an example of an inline application package. Here we define inline UI XML ([View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view)) and Process XML, as well as inline CSS and XSLT. Inline packaging has very positive results as fewer requests are made to the server and the application (or widget) will load faster.

You may also use [Advanced Packaging](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/advanced-package), which divides the functionality into different documents; which is more suitable for larger projects and developers working in teams with versioning systems like GIT or Subversion.

**Process code for inline application package. Here we have placed UI XML, Process XML, XSLT and CSS into one single document.**

```xml
<?xml version="1.0"?>

<application name="packagetest" icon="icon://earth" xmlns:xlink="http://www.w3.org/1999/xlink">
  <settings>
    <path>home://Applications/</path>
    <home>home://Documents/</home>
  </settings>

  <about loader="false" version="1.1" revised="2025-08-06" created="2019-02-05" author="XIOS/3" publisher="XIOS/3">
    <description>This is the application description of Hello World.</description>
    <license xlink:actuate="onRequest" xlink:href="https://xios3.com/license/xios_1.xml">XIOS.1</license>
    <installed>2013-03-10</installed>
  </about>

  <resources>
    <item name="customXSL.xsl">
     <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
       <xsl:template match="//book">
         <div class="boldHeading">Title: "<xsl:value-of select="@title"/>"</div>
       </xsl:template>
     </xsl:stylesheet>
    </item>
    <item name="myDataDoc">
      <books>
        <book name="1985" author="George Orwell"/>
      </books>
    </item>
  </resources>

  <view xlink:actuate="onLoad" name="packagetest" title="Inline Application Package" author="XIOS/3" version="1.0" height="400" width="400"
        resize="true" icon="icon://earth">
    <style>
    .boldHeading{
      font-weight:bold;
      font-family:arial, verdana;
      font-size:16px;
    }
    </style>
    <panel name="panelContainer" height="100%" width="100%" type="rows" padding="5">
      <panel name="mainPanel" type="columns" width="100%" height="100%" padding="5">
        <render name="renderContent" href="#customXSL.xsl" height="100%" width="100%" scroll="false"/>
      </panel>
    </panel>
  </view>

  <process xlink:actuate="onLoad" name="packagetest">
    <step id="start" name="Initiate Application">
      <operation name="bind" value="#myDataDoc">
        <component view="packagetest" name="renderContent" select="/lists/list[1]"/>
      </operation>
    </step>
  </process>

</application>
```

#### Line 01-07

In the first few lines we first have the XML processing instruction on line 1. Then the `application` root element on line 3. Note that the `xlink` namespace is declared here. The reason for this is because xlink is used when dealing with view and process documents.

The `settings` element contains two child elements: `path` and `home`.

#### Line 09-13

In the `about` element we write information regarding the application. The information that is stored within the elements of this section is not mandatory to make the application work, however it is good practice to do so.

#### Line 15-28

The application package document allows you to write inline data and XSLT by declaring them as resources. These can then be used by different UI XML documents, which are defined in the Application Package. The inline documents are the same as external documents, however they offer a great advantage when working with [Widgets](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget). Declaring XSLT and data documents inline will reduce the load time of your application, allowing it to start faster. Note that there are no xlink declarations on the `item` elements on the inline resources.

Our XSLT is very basic. First the root element, `xsl:stylesheet` and the `xsl` namespace declaration. On line 18, we then proceed to match any book element in the data that we bind, and to print the value in the name attribute of that element. Note that we are using the class attribute on the HTML div element when we are outputting the book element's title attribute. This is made possible by the inline CSS declared in the view document below.

#### Line 30-44

In this part of the application package we describe our `view` document. We start off with the `view` root element and the `xlink:actuate` which in our case must be set to `onLoad` given that it is our only view document and that we will not open it directly from the process code. The `view` element has some attributes that control the visual appearance of the view document, such as height, width and the icon.

Next is the inline CSS which we describe in the `style` element. Here we only define one class, "boldHeading" which will be bold, in Arial font and will be 16px in height. After the `style` element, we describe our regular UI XML with panels and our XSLT database component, `render`. When we refer to the XSL document in the href attribute of the component we refer to #customXSL.xsl, which was the name that we defined for the inline XSL in the resources section of the application package.

#### Line 46-52

Here we define our process XML document, which consists of a `process` element with a `xlink:actuate` attribute for which the value should be set to `onLoad`. We will only use one step node-set where we will bind the data to the `render` component. The process name in line 46 should be the same as the application name in line 1. Note that the id attribute of the `step` element is set to `start`, because the application will always start by opening step with id `start` (unless otherwise defined) and not the first step by order.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/inline-package>*

---

## Overall Structure

When building apps in the CloudBackend database we recommend writing the view and process code directly [inline](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/inline-package) inside the application document. This way of developing also has great advantages when writing small apps or widgets and will reduce the number of server requests and thus make your application load faster.

There are some fundamental elements required in a Application Manifest, shown in the *Minimal Application Template* code below along with a screenshot of how it appears in the CloudBackend PaaS.

The *Minimal Application Template* can easily be created in the [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard).


**The Application Manifest**

```xml
<application xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:l="https://xios3.com/lang" name="Application Name" icon="icon://rocket" instances="0">
  <share>false</share>

  <!-- home: where app default open/save, path: app installation path -->
  <settings>
    <home>home://Documents</home>
    <path>tenant://Applications</path>
  </settings>

  <!-- Required -->
  <about loader="false" version="1.0" revised="2023-01-01" created="2023-01-01" author="John Doe" publisher="Acme Inc.">
    <description>Minimal Template</description>
  </about>

  <!-- Not required -->
  <resources>
    <item name="MyInlineDataModel"/>
  </resources>

  <!-- The user interface(s) of the app, several views may be used -->
  <view name="minTemp" title="Minimal Template" icon="icon://rocket">
    <panel name="MainPanel" type="rows">
    </panel>
  </view>

  <!-- Program logic of the app, managing server and user interaction -->
  <process name="Minimal Template - Process">
    <!-- Until app signals it is loaded, bindings cannot be done -->
    <trigger view="minTemp" event="Loaded" step="init"/>
    <step id="init">
    </step>
  </process>
</application>
```

### Explaining Xlink

In the application package concept xlink is frequently used. Xlink is a [W3C](http://www.w3.org) standard that allows you create and describe links to other XML documents. This is very important as it makes it possible to load objects when they are needed, making your applications faster.

Every xlink document has two attributes; xlink:actuate and xlink:href. They all use the xlink-namespace, which has the following URI http://www.w3.org/1999/xlink. The xlink:type attribute can be set as either simple or extended. There is a third xlink attribute, xlink:type, but it defaults to "simple", which is the only one supported by XIOS/3, so it can safely be omitted.

The xlink:actuate attribute is also of the type enumeration and can be set to either onRequest or onLoad. Controls when the link will be executed. xlink:actuate="onLoad" means that the link/object will load when the application package is loaded while xlink:actuate="onRequest" means that it is loaded when the object is requested within the application.

> **Note:** The onLoad option does not trigger the Opened events for views.

The final attribute xlink:href is the URL of the object that you want to load.

### Element: application

The application element is the root element of application package manifest.

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | unique name | The name of the application. |

**Optional attributes**

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `background` | boolean | false, true | false | Allows the process to run even when all views are closed. |
| `icon` | string | URL |  | The icon of the application |
| `instances` | integer | 0, [1...n] | 0 | The number of instances that should be allowed |

### Element: share

Elemment detrmines if the application can be shared across users, which means that the Share Window feature (GBC - Gesture Based Collaboration) can be used for the application.

Since Window Sharing is enabled by default, you don't need to define it. However, in order to disable the feature you need to set the text() node value to "false". This might be needed in some applications that are intended for a single user, deals with sensitive information or where the results depends on which user is viewing the application (ie #Friends data document will differ from user to user).

**Disabling window sharing**

```
<application...>
  <share>false</share>
...
```

### Element: settings

Here we define the application settings.

**Child elements to settings**

```xml
<settings>
  <home>home://Documents</home>
  <path>tenant://Applications</path>
  <locale>tenant://Applications/Locale</locale>
  <open-area>right</open-area>
</settings>
```

**Child elements**

#### Child Element: path

Contains information about from which database the application will be executed. Usually this is `tenant://Applications`, however when using groups the path might be the groups virtual database. If additional resources are required by the application, they will be loaded relative to this path.

#### Child Element: home

Can contain the URL to the XIOS/3 container where the data objects of the application are stored. The value of this element is available as the system alias $home when defined. The result will be an [objects listing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects) of the container contents.

"Open" and "Save As..." dialogs will start from this container, if nothing else is specified. The recommended locale location is `tenant://Application/Locale`

#### Child Element: locale

The location of the container which contains the localization XML documents, allowing the application to be translated to another language. Multiple local elements may exist if you have multiple locale XML documents.

#### Child Element: open-area

If defined this element informs the window manager which area of the screen to open new windows in. Possible values are top, bottom, left, and right.

### Element: about

Here we define information about the application that will be displayed inside the control panel.

**Attributes to about**

```xml
<about loader="false" version="1.0" revised="2023-01-01" created="2023-01-01" author="John Doe" publisher="Acme Inc.">
  <description>Minimal Application</description>
</about>
```

**Optional attributes**

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `loader` | boolean | false, true | false | Decides if a loader should be shown while the application is loading |
| `version` | numerical | 1.0 |  | The version of the about element. |
| `revised` | date | YYYY-MM-DD |  | The date when the application was last revised |
| `created` | date | YYYY-MM-DD |  | The date when the application was created |
| `author` | string |  |  | The author of the application |
| `copyright` | string | Any string value |  | The copyright holder of the application |
| `publisher` | string | Any string value |  | The publisher of the application |
| `logo` | string | URL |  | The logo of the publishing company for light background. |
| `logo-dark` | string | URL |  | The logo of the publishing company for dark background. |

#### Child Element: description

Contains descriptive information about the application.

#### Child Element: license

Contains the license under which the application is released.

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `xlink:actuate` | enumeration | onRequest, onLoad | Controls when the link will be executed |
| `xlink:href` | string | URL | The URL of the license |

#### Child Element: installed

Will contain a date when the application was installed.

### Element: resources

In this element we need to define all resources that are needed to make the application run offline. Links to images and XSL documents supplied in the UI XML documents will be downloaded automatically. The XSL document is available as "#nameDefined" and is to be defined in the href attribute of the component that uses XSLT to render XML.

**Resources element**

```xml
<resources>
  <!-- Create static data models or references to external resources required by the app -->
  <item name="MyInlineDataModel"/>
</resources>
```

#### Child Element: item

This element can be used to declare inline XSL document which is made possible by defining a name attribute and then the XSLT as child elements of the item element. If no name attribute is supplied, then the xlink attributes are needed and are used to define the information needed to download the resource for offline use.

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Any string value | The name of the item |
| `xlink:actuate` | enumeration | onRequest, onLoad | Controls when the link will be executed |
| `xlink:href` | string | URL | The URL of the license |

### Element: view

Every view document should be defined as a child element of the application root element.

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `xlink:actuate` | enumeration | onRequest, onLoad | Controls when the link will be executed. |
| `xlink:href` | URL |  | The URL of the license. |

### Element: process

Like view documents, every process document should be defined as a child element of the application root element.

Note that when declaring the main process document the xlink:actuate should be set as onLoad so that the document will be opened when the application is launched.

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `step` | string |  | The step that should be initiated. |
| `xlink:actuate` | enumeration | onRequest, onLoad | Controls when the link will be executed. |
| `xlink:href` | URL |  | The URL of the license. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/overall-structure>*

---

## Widget

A **widget** is an application whose view is drawn without a window frame. Like any application it has a default menu, which can be adjusted. A widget can run **detached** from any anchor point, or be attached to a [WidgetPane](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/widgetpane). Once open, a widget stays open until it is closed.

A widget can have more than one view. The most common case is a **sized** widget, which offers the same widget at different sizes, one view per size. All of a widget's views share a single process, so its context is kept as the size changes. The size is chosen from the widget menu. See [Kinds of Widgets](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/kinds-of-widgets).

> **Note:** **Rule:** Every widget [`view`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) must set `mode="widget"`. A widget node requires `id`, `name`, and a `source`; everything else on the node is optional.

#### Widget data and lifecycle

Every open widget is backed by an **XML node** that stores its position together with its settings. The running widget reads that data at `$widget#data`, and further setting nodes can be added under `$widget` as needed — a skin, for example, is stored there. See [The Widget Node](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/the-widget-node).

Because each open widget owns its own node, several widgets of the same application can be open at once, each keeping its own data. Free widgets are stored in `#SystemConfig`; widgets attached to a pane are stored in that pane's settings document.

### Widget Alias

Each widget holds an `$widget` alias, holding widget data descibed above. The alias is only reachable after `Event="Opened"` has been triggered. If used before, e.g. on `Event="Loaded"`, the `$widget` is **not** registered and can not be used. Data can be read from the alias and can be written to it.

**Manifest: one view file for all sizes** *(fragment)*

```xml
<process xlink:actuate="onLoad" name="Calculator Widget">
 <trigger view="CalcW" event="Loaded" step="bindData"/> //Incorrect
 <trigger view="CalcW" event="Opened" step="bindData"/> //Correct
```

### When a widget opens

- A **free** widget opens as soon as the app or site starts, at the position and with the settings its node holds.
- A widget **attached to a WidgetPane** opens when the pane opens, and is shown and hidden together with the pane. See WidgetPane.

### When a widget closes

When a widget is closed its node is removed, and its stored position and settings are cleared with it.

#### Advanced package Widget

If the widget application has multiple files, `mode="widget"` are required in the application manifest where the view is linked. This is required for `formfactor` attributes in [sized widgets](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/kinds-of-widgets/sized-widgets) as well.

**Manifest: one view file for all sizes** *(fragment)*

```xml
<application name="Multi" instances="0" xmlns:xlink="http://www.w3.org/1999/xlink">
  <process name="Multi" xlink:actuate="onLoad" xlink:href="processes/multi.xml"/>

  <view name="Multi" mode="widget" formdefault="true" formfactor="Small" xlink:href="views/multi.xml"/>
  <view name="Multi" mode="widget" formfactor="Medium" xlink:href="views/multi.xml"/>
  <view name="Multi" mode="widget" formfactor="Large" xlink:href="views/multi.xml"/>
</application>
```

- [The Widget Node](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/the-widget-node)
- [Opening Widgets](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/opening-widgets)
- [Kinds of Widgets](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/kinds-of-widgets)
- [The Widget Menu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget/the-widget-menu)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/widget>*

---

## Introduction to XIOS/3

This section is dedicated to give you an [overview of the XIOS/3 Platform](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/what-is-xios-3%3F), starting with a high-level explanation of what XIOS/3 is and how to use it.


For trying XIOS/3 the fastest way to get started is by going through our [Quick Start](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/quick-start) section. This approach will introduce you to our [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard) and built-in XML Editor [CodePad](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad), allowing you to create new or modify existing applications directly in the web UI.

You may also utilize our [Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code) extension to facilitate development, as well as use [WebDAV](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav) to sync your application documents directly into the CloudBackend Database.

- **[Try it!](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/quick-start)** — Get started with developing, right in the CloudBackend PaaS. Learning by doing. *(Start developing now)*

- **[What is XIOS/3?](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/what-is-xios-3%3F)** — An introduction and overview of XIOS/3. If you want to know more about the Platform. *(Introduction to XIOS/3)*

#### Advanced Alternative

The other alternative, for more experienced XIOS/3 users and larger projects, is to develop locally on your computer, in your favorite development environment. This is explained in the [Local Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development) section.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3>*

---

## Quick Start

This section will describe how to quickly get started with XIOS/3 in the [CloudBackend PaaS](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard) and build your first application. Explained below is everything you need to know about how your application documents are structured in the [CloudBackend PaaS](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard), how to create new, edit, and run applications within the CloudBackend PaaS, as well as how to upload and download application documents.

### Getting Started

To quickly get started developing in the CloudBackend database, the easiest way is to go through our [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard). If you are just getting to know XIOS/3 we recommend having a look at our [tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/tutorials). They will give you a great start to building your first XIOS/3 applications.

To get the most out of building apps directly in the CloudBackend PaaS, you will need a place to store your apps and data outside of your home database. So, if you have not done it already, we recommend you to set up a connection to our partner service CloudBackend, The Singularity Database in the cloud with a no-code backend fully integrated with XIOS/3.

The efficiency in XIOS/3 development comes from using standardized and declarative Markup to describe and work with [User Interfaces](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/ui-view), [Application Logic](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/process-control), and [Data Models](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/data-model). These are based on XML so we strongly recommend that you have some basic XML knowledge or the [XML Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xml-development) close at hand.

- **[Launch Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3)** — Quickly get started with development in the CloudBackend PaaS. *(Get Started)*

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xml-development)** — The reference section goes into depth of all aspects of XML, XPath, XLink, and XSLT, languages used throughout XIOS/3. *(XML)*

### Building Applications in the CloudBackend PaaS

Most of your interaction with applications in the CloudBackend database will be through the Application tab.

In the Projects tab you will have an overview of your application documents, that you can run by just double-clicking. You also have the options to Create (new) and Edit (existing) applications, as well as Upload application documents from your local device or Download the selected object from this Application tab.

#### Run Application

You can run applications directly in the CloudBackend database by double-clicking an application document located in the Projects tab. This will start the application in a separate window that you can move around, maximize to full screen, minimize, and close.

#### New Application

By clicking the Create icon in the top menu you will launch the [Application Wizard](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/application-wizard). The Wizard will allow you to quickly setup the relevant application documents and name your application.

#### Edit Application

By clicking Edit when you have selected an application document the built-in [XML Editor](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad) will start, allowing you to view and edit the document.

If you have not selected any application document the CodePad will still launch, with an empty untitled document. Writing your XIOS/3 XML and saving the document in the Applications container under your Tenant will make it available in the Projects tab.

#### Upload and Download Existing Applications

Clicking the Upload button in the menu will allow you to select an (XML) document on your local device and upload it into the Applications container under your Tenant, making it accessible in the Projects tab.

By having an application document selected and clicking Download you will download the object, making it accessible on your local device, e.g. to be edited in your local development environment.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/quick-start>*

---

## The CloudBackend PaaS

This section will introduce you to the CloudBackend database and its tabs seen in the left main menu.

To make it easier to find what you are looking for we have separated the CloudBackend database into the following sections, and by clicking the links you can read more about them.

- [Home](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/home)
- [Account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/account)
- [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/identities)
- [Applications](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/applications)
- [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/datatypes)
- [Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/documentation)
- [Proxy](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/proxy)
- [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/database-explorer)
- [CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard/cli)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/the-dashboard>*

---

## What is XIOS/3?

XIOS/3 is the world's most advanced environment for developing and running web applications. It allows you to use XML as the template language or use HTML, CSS, and JavaScript to build visually rich applications in a higher abstraction level, with great capabilities of interacting with any server back-end resource or code. One way of describing XIOS/3 is as an Edge Application Server, an Application Server on the client side used as a user interface front-end for a Service Oriented Architecture (SOA) or Microservices Architecture.

Having an Edge Application Server at your disposal means that most of your application logic can be performed directly on the client, with a minimum amount of server requests as an end result. The applications are executing within the web browser of the client, making XIOS/3 an ideal partner with any server technology. Utilizing resources on the client, with reduced server dependency, drastically reduces the perceived latency in web applications with a better user experience as a result.

XIOS/3 is designed to be what HTML would have been, if HTML had been designed for developing and running applications instead of text-based content. Using HTML with a JavaScript framework on top only gets you a bit on the way to creating rich applications, but if you want to develop applications with usability close to installed software, XIOS/3 is the most efficient way.

#### A Complete Client Side Solution

The XIOS/3 technology is entirely located on the client side. It handles everything from the user interface and logic to communication and underlying backend systems. It’s an application environment that provides a complete solution from UI components, through event routing, data flow management and transaction engine, to service abstractions and protocol management. XIOS/3 is self contained with no server components and also makes it possible to integrate to existing systems without requiring any changes to them.


#### Edge Cloud Computing

With XIOS/3 the application execution shifts from the server to the client, without any installation or plug-ins required in the browser or by the end-user. All logic runs on the user device for faster apps with less latency as well as better scalability. It is Edge Cloud Computing for SaaS.

This will reduce servers to become a data storage and delivery point for XIOS/3 applications, meaning reduced cost for hosting and servers as well as minimal bandwidth consumption.

In essence, using XIOS/3 will result in solutions being built on a platform with tons of ready-made functionality, and features. Resulting in less coding, no more reinventing the wheel and in the end better applications that are cheaper to deploy, scale and maintain.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/what-is-xios-3%3F>*

---

## Local Development

This segment will introduce you to how to develop XIOS/3 applications locally on your machine with a downloaded version of XIOS/3, found [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development/xios-3-on-local-machine). If you are looking for how to use [Visual Studio Code Extension](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code), with [IntelliSense Code Completion](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code/intellisense-code-completion), or [WebDAV](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav) you will find information about that through their respective links.

- **[Install XIOS/3 Locally](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development/xios-3-on-local-machine)** — Information about how to use XIOS/3 if you have a downloaded local version of the Platform. *(Local Machine)*

- **[Visual Studio Code Extension](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code)** — Install and use our Visual Studio Code Extension to facilitate local development, including live updating of apps running in the browser. *(Using VS Code)*

- **[WebDAV Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/webdav)** — Use WebDAV in your local development. *(WebDAV)*



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development>*

---

## XIOS/3 on Local Machine

> **Note:** This segment requires that you have a local version of XIOS/3.
> If you do not have a local version, we recommend you to use XIOS/3 through the CloudBackend PaaS, described in our [Quick Start](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/introduction-to-xios-3/quick-start) section.

In this section we will have a quick look at the XIOS/3 runtime and show how you can start it on your own computer. It is helpful if you already know how to start a webserver on your computer.

To develop locally you need to have a copy of the XIOS/3 distribution, typically named "xios.zip". Find a good place for it on your computer, e.g. the Documents folder on Microsoft Windows, and uncompress the xios.zip file there. You should end up with a new folder named "xios". Inside of it you will find a Readme.txt file a few HTML files and another folder named "xios". This folder, with the HTML files, will be referred to as the XIOS/3 root folder from now on.

You will now need to start a web server with the XIOS/3 root folder as the web servers root folder. For this tutorial we recommend you use the Python built in web server, but any web server would work. If you are running Apple MacOS you should already have Python installed on the computer. If you are running Microsoft Windows, download and install latest Python from Microsoft Store or from https://python.org. Once you have Python installed, open a terminal shell e.g. by typing cmd and enter in the search feature, go to the XIOS/3 root folder and start the web server with the command:

- `python -m SimpleHTTPServer` - if you have Python 2 installed,

or

- `python -m http.server` - if you have Python 3 installed.

This command will open a web server on the local host on port 8000.

You can now open your Chrome web browser and go to the web site http://localhost:8000/ to see either a list of the files in the XIOS/3 root folder, or a command line interface, depending on what web server you are running. If you see a database result, click the index.html entry to get to the command line interface.

What you are seeing is a XIOS/3 application running inside of the XIOS/3 runtime running inside of your Chrome browser. Both the entry page, the XIOS/3 runtime and the application are served from the web server running on your computer.

Note that as long as the web server is running, the contents of the XIOS/3 root folder is available to anyone who attempts to access port 8000 on your computer. You can close the server by pressing Ctrl+C in the shell window running your Python web server.

### The Cloud Shell

In this section we will have a closer look at the XIOS/3 shell application and its commands.

The XIOS/3 shell works just like most command line shells do. You can type "help" to see the readily available commands, grouped in four different categories. File, Shell, System and User commands. Currently none of the file or user commands are available, as there is no file system mounted and no user account service connected. We can see the lack of filesystem by running the command "databases".

However, we can run "channels" to see that we have one defined communication channel "https" available. Running "apps" we can see we have one application "Shell" running, the application we are currently interacting with. Run "views" to see that we have one view displayed, the one associated with the Shell application, using the identifier "Shell:1". This is the name of the view, "Shell", followed by the instance number. Finally we can type "ps" to show that there are two processes running, one for the Shell application and one "startup.xml". This startup process was the one that set up the https channel and launched the Shell application.

In addition to the commands, it is also possible to set up macros. Some are already defined and can be listed with the command "macros". As you can see, several of them simply loads another application with the "load" command. Let's try some of them. Start with the "dev" macro, it opens a simple document viewer that displays reference documentation for XIOS/3 itself. You can look up the documentation for the Shell component itself by expanding your way down References, Components and Shell in the tree component to the left of the Help window.


Another interesting macro to try is "system". This starts another application that show the same information we have already seen with the apps, views, ps, etc. commands.


We can start another instance of the shell application using the load command, followed by the application path shown by the apps command, i.e., "load xios/apps/shell/shell.xml". This will open another instance of the shell application, but this time in a window. You can make the new window stand out a bit more by changing its background using the bgcolor command, e.g., "bgcolor #046".


Note that we still only have one application loaded, as shown by "apps". We still have the same number of processes running, as shown by "ps". We do, however, have another view instance, Shell:2, running. The events that are triggered will however go into the same process code for both views.

The cloud shell itself has a bit more verbose documentation available in the help application as well. One way to access it is to simply right click anywhere in the shell and get a context menu with the "Help center..." option.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/local-development/xios-3-on-local-machine>*

---
