# XIOS/3 — code concepts (recipes)

Short, complete snippets for common tasks, from the published Code Concepts section.

32 topics from the published XIOS/3 documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Code Concepts](#code-concepts)
- [Add a fake tab to a tabstrip](#add-a-fake-tab-to-a-tabstrip)
- [Ask user for input](#ask-user-for-input)
- [Automatic bindings between data and components](#automatic-bindings-between-data-and-components)
- [Binary decision](#binary-decision)
- [Bind a tabstrip to dynamic data](#bind-a-tabstrip-to-dynamic-data)
- [Bind from user selection](#bind-from-user-selection)
- [Bind UI components to an external API](#bind-ui-components-to-an-external-api)
- [Button and Events](#button-and-events)
- [Check if a container or object exists](#check-if-a-container-or-object-exists)
- [Count objects or elements](#count-objects-or-elements)
- [Create a RAM database](#create-a-ram-database)
- [Create containers in the database](#create-containers-in-the-database)
- [Create objects and XML documents](#create-objects-and-xml-documents)
- [Create temporary objects](#create-temporary-objects)
- [Decorationless window](#decorationless-window)
- [Handle Drag and Drop](#handle-drag-and-drop)
- [Filter container result based on query](#filter-container-result-based-on-query)
- [Live updated synthetic data](#live-updated-synthetic-data)
- [Localization: Language translation](#localization-language-translation)
- [Moving objects between containers](#moving-objects-between-containers)
- [Panel with toolbar and buttonbox](#panel-with-toolbar-and-buttonbox)
- [Select a tab to bind a grid](#select-a-tab-to-bind-a-grid)
- [Set selection on a UI component](#set-selection-on-a-ui-component)
- [Show an alert dialog](#show-an-alert-dialog)
- [Styling components with CSS](#styling-components-with-css)
- [Transform data using XSL](#transform-data-using-xsl)
- [Translate a string to replace characters](#translate-a-string-to-replace-characters)
- [URL Query string](#url-query-string)
- [Using temporary documents](#using-temporary-documents)
- [Visualize the database with a tree](#visualize-the-database-with-a-tree)
- [Visualize XML with a tree](#visualize-xml-with-a-tree)

## Code Concepts

This section will provide you with usable code snippets of various common concepts in XIOS/3. At the end of each demonstrated concept, links are provided to the reference manual, for used technologies of XIOS/3. The purpose with the concept manual is to demonstrate how several UI components and/or process operations are combined to solve a conceptual problem.

Almost all concepts can be executed directly from this documentation by clicking the play button `icon://media_play?theme=glass&shadow=true`, although some examples will require you to be logged in.

#### Necessary Links

The following links contain good information to support you alongside the concepts.

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink that are used. *(XML)*

- **[Using Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)** — Aliases are powerful and flexible equivalents to variables that are more like a struct, class, or JSON. *(Variables)*

- **[Using Xbinds](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/xbinds)** — Standardizing how XML based applications communicate, store, and describe its current state. *(Xbind)*

- **[The App Manifest](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/structure/application-package-manifest)** — The equivalent to the executable program in XIOS/3, defining views, processes, etc. *(Packaging)*

- **[Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code)** — How to use Microsoft VS Code for development in XIOS/3 *(VS Code)*

#### List of Concepts

This list will keep on growing, but you will find additional ideas in the Tutorials and within the reference manual for each UI component and process operation.

- [Add a fake tab to a tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/add-a-fake-tab-to-a-tabstrip): Add a tab that is not represented in the underlying data to tabstrip
- [Ask user for input](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/ask-user-for-input): Show a confirm dialog that asks the user to input data
- [Automatic bindings between data and components](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/automatic-bindings-between-data-and-components): Showing how data is automatically kept in sync when bound to a component.
- [Binary decision](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/binary-decision): Show how to use a binary flag in a decision
- [Bind a tabstrip to dynamic data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-a-tabstrip-to-dynamic-data): Show tabs depending on underlying data model
- [Bind from user selection](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-from-user-selection): Shows how user interactions can create bindings between data and UI components.
- [Bind UI components to an external API](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-ui-components-to-an-external-api): Showing how to bind an external API to a UI component and keep it updated.
- [Button and Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/button-and-events): Handling events with a default button.
- [Check if a container or object exists](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/check-if-a-container-or-object-exists): How to check if a container or object exist in the database.
- [Count objects or elements](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/count-objects-or-elements): How to count objects and / or elements in the database.
- [Create a RAM database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-a-ram-database): How to create and use a RAM database with a published container.
- [Create containers in the database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-containers-in-the-database): How to create containers and sub-containers in the database.
- [Create objects and XML documents](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-objects-and-xml-documents): How to create objects, e.g. XML documents, in the database.
- [Create temporary objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-temporary-objects): How to create temporary objects.
- [Filter container result based on query](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/filter-container-result-based-on-query): Filter contents of a database result to bind reduced set to UI components.
- [Drag and Drop](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/drag-and-drop): How to detect a drop of an item on an area of the UI.
- [Live updated synthetic data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/live-updated-synthetic-data): Make synthetic data update when the underlying data changes
- [Localization: Language translation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/localization-language-translation): Add language localization to your applications.
- [Moving objects between containers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/moving-objects-between-containers): How to move objects (files) between containers (folders).
- [Panel with toolbar and buttonbox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/panel-with-toolbar-and-buttonbox): Example of page head for listing of items.
- [Select a tab to bind a grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/select-a-tab-to-bind-a-grid): Change what is shown in the tab content, depending on the selected tab
- [Set selection on a UI component](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/set-selection-on-a-ui-component): How user interactions can set selections in UI components.
- [Show an alert dialog](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/show-an-alert-dialog): A customizable alert dialog, triggered by user interaction.
- [Styling components with CSS](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/styling-components-with-css): How UI components can be styled using CSS.
- [Translate a string to replace characters](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/translate-a-string-to-replace-characters): Demonstrates string manipulation.
- [URL Query string](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/url-query-string): Passing parameters through the URL to a deployed application.
- [Using temporary documents](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/using-temporary-documents): Demonstrates how to use temporary documents.
- [Visualize the database with a tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-the-database-with-a-tree): How to visualize a database hierarchy using a tree.
- [Visualize XML with a tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-xml-with-a-tree): How to visualize an XML hierarchy as a tree.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts>*

---

## Add a fake tab to a tabstrip

This concept shows how a temporary object may be used to copy in real data from the database and then be altered to create a synthetic data set by adding a fake tab as the first tab. Please note that this example is not listening for changes in the underlying data model, please look at the concept "Live updated synthetic data" for further information.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Fake Tab to TabStrip Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="fakeTab" xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" icon="icon://lightbulb_on">
  <view name="fakeTab" title="Fake tab in TabStrip" icon="icon://lightbulb_on" min-width="400" min-height="200">
    <panel padding="5">
      <tabstrip name="myTab" height="100%" width="100%">
        <panel padding="5">
          <grid name="tabGrid" height="100%" width="100%" selection="row" inset="true">
            <row match="db:object">
              <column name="objects" match="@name" display="." label="Objects" width="100%"/>
            </row>
          </grid>
        </panel>

        <rule match="db:container">
          <item name="{@name}"/>
        </rule>
      </tabstrip>
    </panel>
  </view>

  <process name="fakeTab - Process">
    <trigger view="fakeTab" component="myTab" event="Select" step="bindTab"/>

    <step id="start">
      <alias name="cfgData" model="newsilent">
{xml(tenant://Settings)}
      </alias>
      <!-- Inject tab 'Fake' in front of the others pointing to home:// (a different database) -->
      <operation name="change" value="$cfgData">
        <store select="/db:result" type="prepend">
          <db:container name="Fake" xlink:actuate="onRequest" xlink:href="home://"/>
        </store>
      </operation>
      <operation name="bind" value="$cfgData">
        <component view="fakeTab" name="myTab"/>
      </operation>
    </step>

    <step id="bindTab">
      <alias name="selectedTab" value="!"/>
      <operation name="bind" value="{!#@xlink:href}">
        <component view="fakeTab" name="tabGrid"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 4**
The start of our [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component. This [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) will visualize the content of our `home://Settings` container with a "fake" tab at the beginning that shows the objects in our `home://` database. How this is visualized is defined on **line 13 - 15** in the `rule` for the `tabstrip`. Note that the `tabstrip` needs to have a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element within it, and that any [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) are put after closing the [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel).

**Line 6 - 10**
We put a [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) within our [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip). This [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will show one `row` for each `db:object` (object / file) corresponding to the selected tab, as can be seen in the `bindTab` `step` starting on **line 38**. Each `row` will have one `column` `match`ing the `@name` attribute for that `db:object` and showing it as-is using `display="."`.

**Line 13 - 15**
This [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) element is for the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip), telling it to show one tab for each `db:container` entry to which it is bound on **line 33 - 35**.

**Line 21**
This `trigger` initiates the `bindTab` `step` when a tab in the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component `myTab` is `Select`:ed.

**Line 23 - 26**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. This `step` starts with creating an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) (variable) called `cfgData`, with the content of `home://Settings` as serialized XML. Using `model="newsilent"` for an `alias` will create a temporary document.

**Line 28 - 32**
The change `operation` is then used on `$cfgData` (notice the `$` since we are referring to an `alias`). We set `store` as a child to our `change` `operation`, with the `type="prepend"`. This means we want to add a new node at the start of the existing document, the child of `store`, i.e. `<db:container name="Fake" xlink:actuate="onRequest" xlink:href="home://"/>`.

**Line 33 - 35**
We then proceed to use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, binding our temporary document `$cfgData` to the `myTab` `component`. The `rule` on **line 13 - 15** ensures the right things and their names are displayed correctly.

**Line 38 - 43**
The `bindTab` `step` first creates an `alias` (variable) called `selectedTab` using the incoming event trigger `!`. Next we look at the `@xlink:href` attribute (the path in the database corresponding to the selected tab) of our incoming event trigger `!`, and `bind` that to our `tabGrid` [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid). In other words; by letting the grid know what container we are selecting from the tabstrip, and its path in the database, we can visualize the contents of that container in the grid.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)
- [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)
- [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- change (store)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)
- [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/add-a-fake-tab-to-a-tabstrip>*

---

## Ask user for input

This concept shows how to use a ([confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)) dialog to ask a user to enter something, in this case, their name. The texts in the buttons shown in the confirm dialog can be configured to say anything and the steps trigger additional steps in the application.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Ask User for Input Concept** *(runnable)*

```xml
<application name="confirmDialog" icon="icon://lightbulb_on">
  <process>
    <step id="start">
      <operation name="confirm">
        <type value="input"/>
        <title>Enter your name</title>
        <message>What is your name?</message>
        <modal>true</modal>
        <ok step="showName" text="OK"/>
        <cancel step="cancel" text="Cancel"/>
      </operation>
    </step>

    <step id="showName">
      <operation name="debug" value="Your name is: {!}">alert</operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 3**
Any `step` with `id="start"` runs first, as soon as the process code is loaded.

**Line 4 - 11**
The [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm) `operation` with its `type` element set to `value="input"` opens up a dialog window with an [input](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/input) field and some custom information in the `title` and `message` elements. If the `ok` button is clicked we will proceed to the `showName` `step`, otherwise, the dialog window is closed if the `cancel` button is clicked.

**Line 14 - 16**
The `showName` `step` runs a [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug) `operation` showing the value of the input field (the incoming event trigger `!`) as a string using `{!}`.

> **Note:** This `debug` output appears in the built-in XIOS/3 debug window. If you want to see the browser's debug window, use *alert: plain* instead of *alert*. If you leave the text node empty the message will appear in the console of the browser's developer tools debugger.

### Used Building Blocks

**Process Operations:**

- [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)
- [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/ask-user-for-input>*

---

## Automatic bindings between data and components

This concept shows how a UI component, in this case a [CheckBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/checkbox), can be [bound](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) to a document and thereby automatically react to any changes in that document. Changes in the component also update the bound document.

When you check the boxes notice how the code in the CodePad window changes.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Automatic Binding Concept** *(tested, runnable)*

```xml
<application name="checkboxBind" icon="icon://lightbulb_on">
  <view name="checkboxBind" title="Binding CheckBox to Data" icon="icon://lightbulb_on" min-width="400" min-height="200" alwaysontop="true">
    <panel type="rows" width="100%" height="100%" padding="15">
      <checkbox name="myCheckbox1" post-label="Check Me!"/>
      <checkbox name="myCheckbox2" post-label="Check Me!"/>
    </panel>
  </view>

  <process name="checkboxBind - Process">
    <step id="start">
      <alias name="tmpDoc" model="newsilent">
<state>
  <myBox1 checked="false"/>
  <myBox2 checked="false"/>
</state>
      </alias>

      <operation name="open" value="xios://apps/xmlpad/xmlpad.xml">
        <trigger value="$tmpDoc"/>
      </operation>

      <operation name="bind" value="$tmpDoc">
        <component view="checkboxBind" name="myCheckbox1" select="/state/myBox1/@checked"/>
        <component view="checkboxBind" name="myCheckbox2" select="/state/myBox2/@checked"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 10 - 16**
First we create a temporary document using an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) with the `model` set to `newsilent`. This temporary document consists of a single element, with a `checked` attribute that can be `true` or `false`.
Next we [open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/open) the CodePad with this temporary document.**These steps are only for demonstration; they do not affect the binding itself but show live how it affects the component and document.**

**Line 18 - 25**
This is where we [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) our temporary document `$tmpDoc` to our `myCheckbox` components and use the `select` attribute to bind them to the `checked` attribute of our document.

### Used Building Blocks

**UI Components:**

- [CheckBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/checkbox)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/open)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/automatic-bindings-between-data-and-components>*

---

## Binary decision

This concept shows how to use a binary flag in a decision.

#### Code Snippet

**Set a binary value and then use it in a decision.** *(fragment, not runnable)*

```xml
<alias name="isOpen" value="true()"/>
<alias name="isOpen" value="false()"/>
<operation name="decision">
  <when test="not({$isOpen})" step="openIt"/>
</operation> 
```

#### Code Explanation

**Line 1**
Set `alias` to the binary value true.

**Line 2**
Set `alias` to the binary value false.

**Line 3 - 5**
This conditionally changes the process flow based on a binary value.

### Used Building Blocks

**Process Operations:**

- [Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)
- [decision](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/binary-decision>*

---

## Bind a tabstrip to dynamic data

This concept shows how each sub-container to a container in the database is visualized as a tab in the tabstrip component. The tabstrip can also be used to show one tab per object in a container, or to represent a list of XML elements in a XML document.

> **Note:** Although different tabs are selected, it is the same panel within the tabstrip that represents the selected tab. This is why a grid or iconlist component often is used with the panel to have the currently selected tab affect the data binding of the dynamic component.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Bind TabStrip to Dynamic Data Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="dynamicTabs" icon="icon://lightbulb_on">
  <view name="dynamicTabs" title="TabStrip and dynamic data" icon="icon://lightbulb_on" width="400">
    <panel padding="5">
      <tabstrip name="myTab" height="100%" width="100%">
        <panel padding="5">
          <label text="Shared panel for all tabs"/>
        </panel>

        <rule match="db:container">
          <item name="{@name}"/>
        </rule>
      </tabstrip>
    </panel>
  </view>

  <process name="dynamicTabs - Process">
    <step id="start">
      <operation name="bind" value="tenant://Settings">
        <component view="dynamicTabs" name="myTab"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 4 - 11**
Our [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) contains a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel), and within that a [label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/label).
The [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component is controlled by a [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules), stating that for each `match`:ing `db:container` node in the document bound to it (done on **line 18 - 20**) we create one tab ([`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item)) showing the `@name` attribute from each `db:container` node as the `name` for that tab.

> **Note:** The [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) needs to have a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element within it, and that any [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) are put after closing the [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel).

**Line 17 - 21**
Any `step` with `id="start"` runs first, as soon as the process code is loaded. In this case it runs a [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, binding the content of `tenant://Settings` to our `myTab` `component`. How the data is visualized in the component is then taken care of by the `rule` starting on **line 9**.

### Used Building Blocks

**UI Components:**

- [label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/label)
- [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)
- [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

**Other:**

- [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-a-tabstrip-to-dynamic-data>*

---

## Bind from user selection

This concept shows how a user may choose a container that is then bound to a UI component.

Click the button and enter the name of a container that exists in your cloud database.

Then the objects in this container are listed in the grid.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Bind from User Selection Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="selBind" icon="icon://lightbulb_on">
  <view name="selBind" title="Bind from User Selection" icon="icon://lightbulb_on" width="400" height="250">
    <panel type="rows" width="100%" height="100%" padding="15">
      <grid name="selectedContainer" height="100" width="270" selection="row" inset="true">
        <row match="db:object">
          <column name="nameCol" match="@name" display="." label="Name" width="50%"/>
          <column name="createdCol" match="@published" display="translate(.,'TZ','  ')" label="Created (UTC)"/>
        </row>
      </grid>
      <panel type="columns" padding="5 0 0 0">
        <button name="selectContainer" text="Select Container"/>
        <label name="nameLabel" color="#555" size="16"/>
      </panel>
    </panel>
  </view>

  <process name="selBind - Process">
    <trigger view="selBind" component="selectContainer" event="Select" step="openSelection"/>

    <step id="openSelection">
      <operation name="confirm">
        <type value="input"/>
        <message>Select which container to show in the grid</message>
        <initial>home://</initial>
        <title>Select Container</title>
        <icon>icon://data_table</icon>
        <ok step="bindGrid" text="Bind"/>
        <cancel/>
      </operation>
    </step>

    <step id="bindGrid">
      <alias name="inputName" value="{!}"/>
      <operation name="bind" value="$inputName">
        <component view="selBind" name="selectedContainer"/>
      </operation>
      <operation name="call" value="writeLabel"/>
    </step>

    <step id="writeLabel">
      <operation name="callMethod" value="#selBind#nameLabel">
        <method name="setValue">
          <param type="string">{$inputName}</param>
        </method>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 8**
Each `row` in our [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will `match` one `db:object` in the document we bind it to. Each `row` will have one `column` showing the corresponding `db:object`'s name, using `match="@name"` (which will display that information due to `display="."`), and when each `db:object` was published using `match="@published"`. In this `display` attribute we use `translate()` to replace letter T with space at the end of the date and replace the Z at the end of the time of the `published` string value. Note that such a timestamp is represented in UTC, where Z is short for Zulu time.

**Line 20 - 30**
This `step` triggered by the first `trigger` element opens a [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm) dialog asking the user to enter which container to display in the grid. When the `OK` button is clicked in this dialog we run the step `bindGrid`, otherwise if the user clicks the cancel button we close the dialog. Note that all you need for this is `<cancel/>`.

**Line 32 - 38**
This `step` triggered when the `ok` button is clicked in the dialog window. It first creates an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) with the incoming trigger value (!) serialized as a string in `{!}`. This essentially means that we take the value from the input field in the dialog and use that as a variable in this next step. We name this variable (alias) as `inputName` which we use as the path to bind to our grid in the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, in its `value` attribute. Note that we put a `$` before the alias when we use it in context.

**Line 40 - 46**
This `step` is called from the previous step on **line 38**. The path that is now stored in `inputName` is displayed in the label field to the right of the button.

Click the button again and enter a new path.

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)
- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)
- [label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/label)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [callMethod](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callmethod)
- [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-from-user-selection>*

---

## Bind UI components to an external API

This concept shows how to [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) a component, in this case a [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid), to data in an external API.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Binding to External API Concept** *(tested, runnable)*

```xml
<application name="apiBind" icon="icon://earth_location">
  <view name="apiBind" title="Binding an External API" icon="icon://earth_location" width="400" height="400">
    <panel name="MainPanel">
      <grid name="myGrid" selection="row">
        <row match="/metObsParameter/station[active = 'true']">
          <column match="name" display="." width="150" label="Name"/>
          <column match="longitude" display="." width="50" label="Long"/>
          <column match="latitude" display="." width="50" label="Lat"/>
        </row>
      </grid>
    </panel>
  </view>

  <process name="apiBind - Process">
    <trigger view="apiBind" event="Loaded" step="bindAPI"/>

    <step id="start">
      <operation name="channel">
        <name>https</name>
        <title>HTTPS</title>
        <protocol>HTTPS</protocol>
      </operation>
    </step>

    <step id="bindAPI">
      <operation name="bind" value="https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/11.xml">
        <component name="myGrid" view="apiBind"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 9**
In our [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) we want to produce one row for each element in the bound document that matches every `station` in `metObsParameter` that has `active` = `true`. Then we want each row to show this station's `name`, `longitude`, and `latitude` using the `match` attribute for each. `display="."` means that we will show the value that comes from that node.

**Line 15**
This `trigger` will be initiated once the entire application is loaded, using `event="Loaded"`, triggering the `bindAPI` `step`.

**Line 17 - 23**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. In this `step` we use the [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel) `operation` to set up a HTTPS protocol, stated in the `protocol` element, with `name` https and `title` HTTPS.

**Line 26 - 28**
Here we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation` with the important `value` attribute pointing to our external API. This is the Swedish Weather Service's external API for listing weather stations and their data. The data in this API is bound to the `myGrid` `component`.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-ui-components-to-an-external-api>*

---

## Button and Events

This concept shows how to designate a default button to trigger an event when the enter key on the keyboard is pressed.

Maximum one button per view can be designated as the default for the enter key.

This default is not triggered if you are in a textarea and press enter, but then enter represents a line break in the text.

Feel free to copy the parts you need for your application.

#### Code Snippet

**Trigger select on button when enter key is pressed.** *(runnable, needs a signed-in tenant)*

```xml
<application name="Button" icon="icon://button">
  <view name="ButtonView" title="Press Enter or Click a button" width="400">
    <panel name="mainPanel" type="rows" align="center" gap="20" padding="30">
      <label name="myLabel" label="Event" size="20" text="TBD"/>
      <panel type="columns" gap="5">
        <button name="button1" text="Default" default="true"/>
        <button name="button2" text="Other"/>
        <button name="button3" text="Reset"/>
      </panel>
    </panel>
  </view>

  <process name="Button" description="Button - Process">
    <trigger view="ButtonView" event="Opened" step="wasOpened"/>
    <trigger view="ButtonView" component="button1" event="Select" step="Button1Clicked"/>
    <trigger view="ButtonView" component="button2" event="Select" step="Button2Clicked"/>
    <trigger view="ButtonView" component="button3" event="Select" step="Button3Clicked"/>

    <step id="start" name="code to run when application does start">
    </step>

    <step id="wasOpened" name="code to run when the view has opened">
      <operation name="callMethod" value="#ButtonView#myLabel">
        <method name="setValue">
          <param type="string">Opened</param>
        </method>
      </operation>
    </step>

    <step id="Button1Clicked">
      <operation name="callMethod" value="#ButtonView#myLabel">
        <method name="setValue">
          <param type="string">Select button 1</param>
        </method>
      </operation>
      <operation name="callMethod" value="#ButtonView#button1">
        <method name="setValue">
          <param type="string">Click 1</param>
        </method>
      </operation>
    </step>

    <step id="Button2Clicked">
      <operation name="callMethod" value="#ButtonView#myLabel">
        <method name="setValue">
          <param type="string">Select button 2</param>
        </method>
      </operation>
      <operation name="callMethod" value="#ButtonView#button2">
        <method name="setValue">
          <param type="string">Click 2</param>
        </method>
      </operation>
    </step>

    <step id="Button3Clicked">
      <operation name="callMethod" value="#ButtonView#myLabel">
        <method name="setValue">
          <param type="string">Select button 3</param>
        </method>
      </operation>
      <operation name="callMethod" value="#ButtonView#button1">
        <method name="setValue">
          <param type="string">Button 1</param>
        </method>
      </operation>
      <operation name="callMethod" value="#ButtonView#button2">
        <method name="setValue">
          <param type="string">Button 2</param>
        </method>
      </operation>
    </step>
  </process>
</application> 
```

#### Code Explanation

**Line 6**
The default [`button`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button) to get the `trigger event` if enter is pressed.

**Line 15**
The `trigger` declaration and what step to run then.

**Line 35**
The `step` that will run when the event is triggered.

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)
- [Triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/button-and-events>*

---

## Check if a container or object exists

This concept shows how to check if a container or object exists in the database.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Check if a container or object exists Concept** *(runnable, needs a signed-in tenant)*

```xml
<process name="checkExist - Process">
  <step id="start">
    <operation name="decision" value="home://Concepts/">
      <when exists="true">
        <operation name="debug" value="The Concepts container exists">alert</operation>
      </when>
      <otherwise>
        <operation name="debug" value="The Concepts container does not exist">alert</operation>
      </otherwise>
    </operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 3 - 10**
The [decision](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision) `operation` looks at `value="home://Concepts"` and if it `exists`, it will show a [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug) window stating this. `Otherwise`, it will show a debug window stating that the container does not exist.

### Used Building Blocks

**Process Operations:**

- [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug)
- [decision](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/check-if-a-container-or-object-exists>*

---

## Count objects or elements

This concept shows how to count objects in a database result or elements within a XML document.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Count Objects or Elements Concept** *(runnable, needs a signed-in tenant)*

```xml
<process name="countElements - Process">
  <step id="start">
    <!-- Counting the number of objects in a container and save it as an Alias -->
    <alias name="catDoc" value="home://Applications"/>
    <alias name="countApps" value="count($catDoc#/db:result/db:object)" model="value"/>

    <operation name="debug" value="{$countApps} apps">alert</operation>

    <!-- Counting the number of task elements and keep it as an Alias -->
    <alias name="ticketDoc" value="tenant://Todo/List.xml"/>
    <alias name="countTask" value="count($ticketDoc#/todo/task)" model="value"/>

    <operation name="debug" value="{$countTask} tasks">alert</operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 4 - 7**
First we set two [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases). The first (`catDoc`) is simply the path `home://Applications`. The second `alias` saves the amount of objects in `catDoc` as a fixed variable (alias) using `model="value"`. Counting the objects in `catDoc` (i.e. `home://Applications`) is done using `count()` where we query `$catDoc` looking for each `db:object` in the return `db:result`. Note the `#` after `$catDoc` that initiates the query. The number of objects is then presented using `operation` [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug).

**Line 10 - 13**
This is similar to the previous code but this time we first create an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) with the path to a document within a container, in this case `tenant://Ticket/Shopping Cart/myTicket.xml`. In the second `alias` we count the number of `message` nodes (under `ticket`) and save that as a fixed variable (alias) using `model="value"`. This value is then presented through `operation` [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug). Also here, note the `#` after `$ticketDoc`, which initiates the query.

### Used Building Blocks

**Process Operations:**

- [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/count-objects-or-elements>*

---

## Create a RAM database

This concept shows how to create and use a RAM database and connect it with a published container (publication). The RAM database is mountable by users that are not authenticated (logged in) and may be used to create websites where users do not have an account, but should still be able to use the site, for instance as a webshop, recipe service, blog, news site, or forum.

With the combination of publishing a container and using a RAM database, you can host data from the database that should be publicly available without requiring any authentication.

> **Note:** A RAM database is also useful for storing temporary data.

When everything is set up you can access it through its own protocol, like any database, i.e. `home://` and `tenant://` but with your chosen name, example: `my-mount://`.

#### Code Snippet

**Mount a published database**

```xml
<process name="mountPublication" description="Mounts a published container">
  <step id="start">
    <operation name="database" value="tenant://Cart">
      <publish name="cart" alias="href2Publication">
        <description>Cart objects</description>
      </publish>
    </operation>
    <operation name="database">
      <mount name="my-mount">
        <published href="{$href2Publication}"/>
      </mount>
    </operation>
  </step>
</process>
```

#### Code Explanation

**Line 3-7** Here we publish a container called Cart from the tenant database. The name we choose in the `name` attribute will be part of the published container name (publication).

**Line 8-12** Here we mount the publication by using the database operation mount with child element `published` and its attribute `href`. The structure of the href when trying to mount a publication is as follows:
`https://[name of publish]-[group id]-[name of publish].cloudbackend.cloud`
In this case:
`https://cart-171xxxxxxxx-cart.cloudbackend.cloud`

> **Note:** In the example above, the group id is not real.

Now we are able to use the mounted database like any other database (read-only) in our application. Searching is also supported on RAM databases. Accessing an object in the database looks like this: `my-mount://object.xml`

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-a-ram-database>*

---

## Create containers in the database

This concept shows how to create containers in the database. The database operation can also be used to create new objects. Please note that containers may also be created as sub-containers of an existing container.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Create Container Concept** *(runnable, needs a signed-in tenant)*

```xml
<process name="createContainer - Process">
  <step id="start">
    <operation name="database" value="home://">
      <create type="container" name="newContainer"/>
    </operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 3 - 5**
Here we use the database `operation` in the `home://` database. The specific `database` `operation` is noted as the child element of `operation`, in this case [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create). We want to create a container (folder) so we set the `type` as `container` and give it the `name` `newContainer`. Note that the name of a created object or container can come from user interactions and other parts of the system as well using variables, called [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases).

### Used Building Blocks

**Process Operations:**

- database (create)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-containers-in-the-database>*

---

## Create objects and XML documents

This concept shows how an object may be created within the database using the database operation.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Create Objects Concept** *(runnable, needs a signed-in tenant)*

```xml
<process name="createFile - Process">
  <step id="start">
    <operation name="confirm">
      <type value="input"/>
      <initial>myDoc</initial>
      <message>Please enter a name for the document.</message>
      <modal>true</modal>
      <title>Enter document name</title>
      <ok step="createObject" text="OK"/>
      <cancel step="cancel" text="Cancel"/>
    </operation>
  </step>

  <step id="createObject">
    <alias name="objName" value="!"/>
    <operation name="database" value="home://">
      <create type="object" name="{$objName}.xml" rename="true">
        <content type="text/xml">
<myObj/>
        </content>
      </create>
    </operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 3 - 11**
This `operation` opens up a [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm) dialog asking the user to enter the name of a new object (file). When the `ok` button is clicked in this dialog we run the step `createObject`, otherwise if the user clicks the cancel button we close the dialog. Note that all you need for this is `<cancel step="cancel" text="Cancel"/>`.

**Line 15 - 17**
This `step` is triggered when the `OK` button in the dialog window is clicked. It first creates an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) with the incoming trigger value `!`. This essentially means that we take the value from the input field in the dialog and use that as a variable in this next step. We name this variable (alias) as `objName` and proceed to use the database `operation` in the `home://` database. The specific `database` `operation` is noted as the child element of `operation`, in this case [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create). We want to create an object (file) so we set the `type` as `object` and name it after our alias (variable) `{$objName}.xml`. Note both that we put a `$` before the alias when we use it in context, and that we use {} to serialize it into a string. We also enable that the object can be renamed using `rename="true"`.

**Line 18 - 20**
When we create objects (files) we can specify the content of that object as a child to [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create), in a `content` element, in this case with the `type` set to `text/xml`. The actual content of the object (file) is then specified within the `content` element. In this case our object will only consist of one XML element `<myObj/>`. Note that it does not have any indentation, so that it starts to the left margin in the actual document.

> **Note:** If you run the command `xmlpad home://'theNameofYourFile'.xml` in the [CLI tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts) you will open it in the CodePad.

### Used Building Blocks

**Process Operations:**

- [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)
- database (create)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-objects-and-xml-documents>*

---

## Create temporary objects

This concept shows how temporary objects may be created in the data model that will not be persisted and stored in the database. Think of them as hierarchical variables in XML format.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Temporary Objects Concept** *(runnable)*

```xml
<process name="tempDocCreate - Process">
  <step id="start">
    <alias name="tmpDoc" model="newsilent">
      <list>
        <item name="firstItem">
          <text>Some text</text>
        </item>
        <item name="secondItem">
          <text>Some more text</text>
        </item>
      </list>
    </alias>

    <operation name="debug" value="$tmpDoc">alert</operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 3 - 12**
Here we create a temporary document in an variable ([alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)) by using `model="newsilent"`. Our temporary document has a main [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) element with [`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item) nodes as children, and `text` nodes as children to each `item`.

**Line 14**
Here we use the [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug) `operation` to show the temporary document.

### Used Building Blocks

**Process Operations:**

- [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/create-temporary-objects>*

---

## Decorationless window

This concept shows how to create a window without decoration or titlebar, e.g. for notifications.

#### Code Snippet

**Bind from User Selection Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="Decorationless Concept" icon="icon://lightbulb_on">

  <view name="Decorationless" title="Borderless Window" author="Code Concepts" winstate="false" resize="false"
        look="plain" bgBlur="false" taskbar="false" mode="window" alwaysontop="true"
        draggable="true" width="300" height="100">
    <panel type="flow" width="100%" height="100%" look="transparent">
      <panel type="rows" padding="10" gap="10" mode="aqua" width="fill" height="88" look="graphite" bgcolor="#111">
        <label text="Testing a window without decoration and title"/>
        <button name="closeBtn" text="Close"/>
      </panel>
    </panel>
  </view>

  <process name="Decorationless - Process">
    <trigger view="Decorationless" component="closeBtn" event="Select" step="close"/>

    <step id="close">
      <operation name="close" value="Decorationless">
        <mode>view</mode>
      </operation>
    </step>
  </process>

</application>
```

#### Code Explanation

**Line 3-8**
The most important attribute for creating a window without decoration of titlebar is `look` set to `plain`. Alongside this `bgBlur="false"` creates a transparent border effect along with `mode="aqua"` and `look="graphite"` on **line 8**. `taskbar="false"` makes the window not show up in taskbar menus, while `mode="window"` states that this should not be the main application and `alwaysontop="true"` makes the window stay on top, with the highest Z-index.

The rest of the code is just to visualize a label and a button to make it possible to close the window. It can also be closed using a timer, by running the `close` step through a [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call) operation with a `timer` child element.

### Used Building Blocks

**UI Components:**

- [view](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/decorationless-window>*

---

## Handle Drag and Drop

This concept shows how to detect a Drag and Drop event on to an area of the UI view.

#### Code Snippet

**Trigger on a Drag and Drop event** *(fragment, not runnable)*

```xml
<trigger view="appView" component="itemList" event="Drop" step="droppedItem" />
<trigger view="appView" component="itemList_empty" event="Drop" step="droppedItem" /> 
```

#### Code Explanation

**Line 1**
Step to run when a Drop happened onto a filelist (or similar applicable component).

**Line 2**
Step to run when a Drop happened on a panel that is shown when no items exist.

> **Note:** For a full example, see the Drag and Drop chapter of the [Kanban Tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/kanban-tutorial)

### Used Building Blocks

**Process language:**

- [Triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers)

**Event:**

- [Drop](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/drop)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/drag-and-drop>*

---

## Filter container result based on query

This concept demonstrates the powerful ability to filter a database result by applying a filter query on the container reference expression, in this example: `tenant://Groups[root = 'role']`. The filter query makes the result only contain containers or objects that match the criteria `[root = 'role']` of the query.

The criteria is relative to each `db:container` or `db:object` found in the `db:result`. This means that for each container or object found in the database result, the criteria is tested and if it fails, the container or object is removed from the result. Think of the criteria as being applied to an XPath query similar to the following `/db:result/*[name() = 'db:container' or name() = 'db:object']`.

In many cases this removes the need for synthetic data (as long as you do not need to add new data to the result), as the filter query automatically will make up a synthetic data set with the reduced database result.

> **Note:** Filter queries also reduce the amount of data requested from the database, which increases performance and reduces the amount of used memory.

If any underlying data changes in the container, the filter query result will also be updated and any UI components bound to the data will automatically become updated.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Filter Query Concept** *(runnable, needs a signed-in tenant)*

```xml
<application xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:l="https://xios3.com/lang" xmlns:db="https://cloudbackend.com/db.xsd" name="Filter Roles" icon="icon://photographic_filter" instances="0">
  <view name="filterContainer" title="Filter Container" icon="icon://lightbulb_on">
    <panel type="rows">
      <grid name="rolesGrid" height="100%">
        <row match="db:object">
          <column name="nameCol" match="@name" display="." label="Name" filter="true" width="140"/>
          <column name="idCol" match="@id" display="." label="Role ID" filter="true" width="140"/>
        </row>
      </grid>
    </panel>
  </view>

  <process name="filterContainer - Process" description="Filter Container - Process">
    <trigger view="filterContainer" event="Loaded" step="init"/>
    <step id="init">
      <operation name="bind" value="tenant://Groups[root = 'role']">
        <component view="filterContainer" name="rolesGrid"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 8**
Each `row` in our [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will `match` one `db:object` in the document we bind it to. (Done on **line 16 - 18**) Each `row` will have one `column` showing the corresponding `db:object`'s name, using `match="@name"` (which will display that information due to `display="."`), and another `column` for showing each `db:object`'s corresponding id, using `match="@id"`.

**Line 14**
This `trigger` will be initiated once the entire application is loaded, using `event="Loaded"`, triggering the `init` `step`.

> **Note:** `init` is the name we recommend for a `step` you wish to run as soon as your application is loaded.

**Line 16 - 18**
Here we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, to look at the content of its `value` attribute. In this concept we want the result only to contain containers or objects that match the criteria `[root = 'role']`, hence we apply a filter query on the container reference expression, i.e. `tenant://Groups[root = 'role']`, and then `bind` the result to our `rolesGrid` `component`.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/filter-container-result-based-on-query>*

---

## Live updated synthetic data

This concept shows how a temporary object may be used to copy in real data from the database and then be altered to create a synthetic data set. The synthetic data set is then configured to listen to live data updates from the underlying data in the database. The synthetic data set is then recreated whenever the underlying data is changed.

> **Note:** If the intention is to reduce the data set in the database result, it is much better to use [filter query](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/filter-container-result-based-on-query), which is built in functionality for synthetic data based on queries.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Live Updated Data Concept** *(runnable, needs a signed-in tenant)*

```xml
<application xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" name="syntTab" icon="icon://lightbulb_on">
  <view name="syntTab" title="Updated synthetic data" icon="icon://lightbulb_on" width="400">
    <panel padding="5">
      <tabstrip name="myTab" height="100%" width="100%">
        <panel padding="5">
          <grid name="tabGrid" height="100%" width="100%" selection="row" inset="true">
            <row match="db:object">
              <column name="objects" match="@name" display="." label="Objects" width="100%"/>
            </row>
          </grid>
        </panel>

        <rule match="db:container">
          <item name="{@name}" value="document"/>
        </rule>
      </tabstrip>
    </panel>
  </view>

  <process name="syntTab - Process">
    <trigger view="syntTab" component="myTab" event="Select" step="bindTab"/>

    <step id="start">
      <!-- Listen to if a new container has been added/removed in the Settings container -->
      <operation name="database" value="tenant://Settings">
        <listen event="Append" step="syntheticTabs"/>
        <listen event="Remove" step="syntheticTabs"/>
        <listen event="ReplaceText" step="syntheticTabs"/>
      </operation>
      <operation name="call" value="syntheticTabs"/>
    </step>

    <step id="syntheticTabs">
      <!-- Inject tab 'Fake' in front of the others pointing to home:// (a different database) -->
      <alias name="cfgData" model="newsilent">
        {xml(tenant://Settings)}
      </alias>
      <operation name="change" value="$cfgData">
        <store select="/db:result" type="prepend">
          <db:container name="Fake" xlink:actuate="onRequest" xlink:href="home://"/>
        </store>
      </operation>
      <operation name="bind" value="$cfgData">
        <component view="syntTab" name="myTab"/>
      </operation>
    </step>

    <step id="bindTab">
      <alias name="selectedTab" value="!"/>
      <operation name="bind" value="{!#@xlink:href}">
        <component view="syntTab" name="tabGrid"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 4**
The start of our [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component. This [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) will visualize the content of our `home://Settings` container with a "fake" tab at the beginning showing the objects in our `tenant://Settings` container. How this is visualized is stated on **line 13 - 15** in the `rule` for the `tabstrip`. Note that the `tabstrip` needs to have a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element within it, and that any [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) are put after closing the [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel).

**Line 6 - 10**
We put a [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) within our [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)s [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel). This [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will show one `row` for each `db:object` (object / file) in corresponding to the selected tab, as can be seen in the `bindTab` `step` starting on **line 48**. Each `row` will have one `column` `match`:ing the `@name` attribute for that `db:object` and showing it as it is using `display="."`.

**Line 13 - 15**
This [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) element is for the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip), telling it to show one tab for each `db:container` entry to which it is bound on **line 43 - 45**.

**Line 21**
This `trigger` initiates the `bindTab` `step` when a tab in the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component `myTab` is `Select`:ed.

**Line 23 - 29**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. This `step` first runs the database `operation` defined as `listen` by its child element. The `listen` instruction is used to listen to changes made in a container (folder) or an object (document). The object to listen to is defined in the `value` attribute, in this case the `tenant://Settings` container.
The `event` attribute defines the event identifier to fire when the contents of `tenant://Settings` have changed, in this case `Append`, `Remove`, and `ReplaceText`.

**Line 30**
Finally in this step we use the [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call) `operation` that will `call` on the `step` with `id` `syntheticTabs`.

**Line 35 - 37**
The `syntheticTabs` `step` starts with creating an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) (variable) called `cfgData`, with the content of `home://Settings` as serialized XML. Using `model="newsilent"` for an `alias` will create a temporary document.

**Line 38 - 42**
The change `operation` is then used on `$cfgData` (notice the `$` since we are referring to an `alias`). We set `store` as a child to our `change` `operation`, with the `type="prepend"`, and selecting the from the root in the document using `select="/db:result"`. This means we want to add a new node at the end of the selected document (`db:result`), and what is added is the child of `store`, i.e. `<db:container name="Fake" xlink:actuate="onRequest" xlink:href="home://"/>`.

**Line 43 - 45**
We then proceed to use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, binding our temporary document `$cfgData` to the `myTab` `component`. The `rule` on **line 13 - 15** will then make sure the correct items and their names are visualized properly.

**Line 48 - 53**
The `bindTab` `step` first creates an `alias` (variable) called `selectedTab` using the incoming event trigger `!`. Next we look at the `@xlink:href` attribute (the path in the database corresponding to the selected tab) of our incoming event trigger `!`, and `bind` that to our `tabGrid` [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid). In other words; by letting the grid know what container we are selecting from the tabstrip, and its path in the database, we can visualize the contents of that container in the grid.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)
- [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)
- [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call)
- change (store)
- database (listen)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)
- [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/live-updated-synthetic-data>*

---

## Localization: Language translation

This concept shows you how to add your own locale for translating text strings in a user interface (localization).

#### Create a locale file

1. Create a container to store locale files for each application. Ex. `home://Applications/myapplication/locale` or `tenant://Applications/myapplication/locale`.
2. Create locale XML document(s) for all languages that the application should support, please see the list below for the naming convention.

   **en_US.xml**

   ```xml
   <keys revised="2025-07-08" translator="John Doe">
     <key id="Stream">Stream</key>
     <key id="Favorite">Favorite</key>
     <key id="Rent">Rent</key>
   </keys>
   ```

   **sv_SE.xml**

   ```xml
   <keys revised="2025-07-08" translator="John Doe">
     <key id="Stream">Mediastream</key>
     <key id="Favorite">Favorit</key>
     <key id="Rent">Hyr</key>
   </keys>
   ```

#### Identify currently used locale

```console
cat #Profile#/profile/locale
```

The chosen locale by the user is automatically applied to any opened application or view, but can be found or changed in the above location.

#### Applying localization

Localization is automatically applied by the system as long as; a) a locale file exists in the configured container for the language chosen by the currently logged in user, b) the localization namespace is defined, c) the attributes to be translated are prefixed with `l:`.

It is also possible to do localization of strings within process documents, which is done using the expression language and the functions [get-label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/functions/get-label) and [apply-locale](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/functions/apply-locale). The most common function to use is `get-label` as it is often used within an `alias` or `callMethod` operation.

> **Note:** Always use translation keys in English that is the real name of what you want translated, this enables the system to at least output the word in English if the key is not available in a language translation file or the users specified language is not available.

**Line 1** Add the `l` namespace `xmlns:l="https://xios3.com/lang"`

**Line 3** Specify location of localization files in the application manifest's settings

**Line 8** To enable localization for any attribute in a view, use the `l:` namespace prefix. For example, to localize the value attribute of a label component, replace `value` with `l:value`. The localization system will then look up the corresponding translation key. If a translation is available, it will be used; otherwise, the original key will be displayed as-is. For instance, setting `l:value="Stream"` would output `Mediastream` if the translation is defined in sv_SE.xml.

**Applying locale**

```xml
<application name="localeExample" xmlns:l="https://xios3.com/lang">
  <settings>
    <locale>home://locale</locale>
  </settings>

   <view name="localeView" title="localeExample" icon="icon://rocket">
    <panel name="MainPanel" type="rows" scroll="true">
      <label l:value="Stream"/> <!-- Will output "Mediastream" in Swedish language -->
    </panel>
   </view>
   <process>
    ...
   </process>
</application>
```

### Naming of localization files

When you create a translation file, it is important to use the naming convention of language code, which then is followed by the country code according to this format `{language code}_{country code}.xml`.

The language code follows the [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) standard and the country code follows the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standard. When the system is loading localization files for an application, it will look at the user setting and follow this convention.

- Brazil - pt_BR.xml
- Bulgaria - bg_BG.xml
- China (Simplified) - zh_CN.xml
- Croatia - hr_HR.xml
- Czech Republic - cs_CZ.xml
- Denmark - da_DK.xml
- Estonia - et_EE.xml
- Finland - fi_FI.xml
- France - fr_FR.xml
- Germany - de_DE.xml
- Greece - el_GR.xml
- Hungary - hu_HU.xml
- Indonesia - in_ID.xml
- Italy - it_IT.xml
- Japan - ja_JP.xml
- Korea - kr_KR.xml
- Lithuania - lt_LT.xml
- Nepal - ne_NP.xml
- Netherlands - nl_NL.xml
- Norway - no_NO.xml
- Philippines - tl_PH.xml
- Poland - pl_PL.xml
- Portugal - pt_PT.xml
- Romania - ro_RO.xml
- Russia - ru_RU.xml
- Serbia - sr_RS.xml
- Slovakia - sk_SK.xml
- Slovenia - sl_SI.xml
- Spain (Catalonia) - ca_ES.xml
- Spain - es_ES.xml
- Sweden - sv_SE.xml
- Taiwan (Traditional) - zh_TW.xml
- Thailand - th_TH.xml
- Turkey - tr_TR.xml
- Ukraine - uk_UA.xml
- United Kingdom - en_GB.xml
- United States - en_US.xml
- Vietnam - vi_VN.xml

### Used Building Blocks

**Functions:**

- [get-label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/functions/get-label)
- [apply-locale](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/functions/apply-locale)

**Other:**

- [l namespace](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/l-namespace)
- [settings/locale](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/overall-structure)
- [Functions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/functions)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/localization-language-translation>*

---

## Moving objects between containers

This concept shows how to move an object (row) between containers (tables) in the database.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Move Objects Concept** *(runnable, needs a signed-in tenant)*

```xml
<process name="moveFile - Process">
  <step id="start">
    <operation name="database" value="home://myDoc.xml">
      <move to="home://Applications" silent="false"/>
    </operation>
  </step>
</process>
```

#### Code Explanation

**Line 2**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 3 - 5**
Here we use the database `operation` on an object specified in the `value` attribute, in this case `home://myDoc.xml`. The child element to the `database` `operation` states what we want to do, in this case `move`. We then set where to move it using the `to` attribute, and that we should get a notification once it is done using `silent="false"`.

### Used Building Blocks

**Process Operations:**

- database (move)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/moving-objects-between-containers>*

---

## Panel with toolbar and buttonbox

This concept shows how to build a page head catalog style.

#### Code Snippet

**UI page head over a list of things.** *(runnable)*

```xml
<view name="bar1View" title="bar1" icon="icon://balloons" height="300" width="600">
  <panel type="rows" bgcolor="#fff">
    <panel type="columns" height="40" padding="8" bgcolor="#eee">
      <image src="icon://shopping_cart" width="24" height="24"/>
      <label text="Name it" size="20" padding="10"/>
    </panel>
    <panel type="columns" valign="center" height="38" style="border-bottom: 1px solid lightblue;">
      <label text="Items" size="16" style="padding-left: 8px;"/>
      <panel type="flow" width="fill" height="32" align="right">
        <toolbar name="aBar" width="auto" height="32" draggable="false">
          <buttonbox name="tCategories" text="Categories" icon="icon://view_list" style="border: 0; background-color: #fff;"/>
          <buttonbox name="tAddItem" text="Add item" icon="icon://plus" style="border: 0; background-color: #fff;"/>
        </toolbar>
      </panel>
    </panel>
    <panel>
      <grid name="itemGrid" height="fill">
        <row match="db:object">
          <column name="qtyCol" match="@qty" display="." label="Quantity" width="50"/>
          <column name="priceCol" match="@price" display="." label="Price" width="50"/>
          <column name="pnoCol" match="@pno" display="." label="Partnumber" width="70"/>
          <column name="nameCol" match="@name" display="." label="Name"/>
        </row>
      </grid>
    </panel>
  </panel>
</view>
```

#### Code Explanation

**Line 7**
The horizontal panel.

**Line 8**
The left label.

**Line 9 - 10**
The right part with toolbar set.

**Line 11 - 12**
The buttons making up the toolbar.

### Used Building Blocks

**UI Components:**

- [image](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/image)
- [label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/label)
- [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)
- [toolbar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/panel-with-toolbar-and-buttonbox>*

---

## Select a tab to bind a grid

This concept shows how the currently selected tab from a tabstrip bound to containers binds the grid component to the same container as represented by the currently selected tab.

> **Note:** Although different tabs are selected, it is the same panel and grid within the tabstrip that represents the selected tab. This is why the data binding for the grid is changed whenever a new tab is selected.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Select a tab to bind a grid** *(runnable, needs a signed-in tenant)*

```xml
<application name="dynamicTabs" icon="icon://lightbulb_on">
  <view name="dynamicTabs" title="Dynamic tabs" icon="icon://lightbulb_on" width="400">
    <panel padding="5">
      <tabstrip name="myTab" height="100%" width="100%">
        <panel padding="5">
          <grid name="tabGrid" height="100%" width="100%" selection="row" inset="true">
            <row match="db:object">
              <column name="objects" match="@name" display="." label="Objects" width="100%"/>
            </row>
          </grid>
        </panel>

        <rule match="db:container">
          <item name="{@name}"/>
        </rule>
      </tabstrip>
    </panel>
  </view>

  <process name="dynamicTabs - Process">
    <trigger view="dynamicTabs" component="myTab" event="Select" step="bindTab"/>

    <step id="start">
      <operation name="bind" value="tenant://Settings">
        <component view="dynamicTabs" name="myTab"/>
      </operation>
    </step>

    <step id="bindTab">
      <alias name="selectedTab" value="!"/>
      <operation name="bind" value="{!#@xlink:href}">
        <component view="dynamicTabs" name="tabGrid"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 4**
The start of our [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component. This [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) will visualize the content of our `home://Settings` container with a "fake" tab at the beginning showing the objects in our `tenant://Settings` container. How this is visualized is stated on **line 13 - 15** in the `rule` for the `tabstrip`. Note that the `tabstrip` needs to have a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element within it, and that any [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) are put after closing the [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel).

**Line 6 - 10**
We put a [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) within our [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)s [`panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel). This [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will show one `row` for each `db:object` (object / file) in corresponding to the selected tab, as can be seen in the `bindTab` `step` starting on **line 29**. Each `row` will have one `column` `match`:ing the `@name` attribute for that `db:object` and showing it as it is using `display="."`.

**Line 13 - 15**
This [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) element is for the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip), telling it to show one tab for each `db:container` entry to which it is bound on **line 24 - 26**.

**Line 21**
This `trigger` initiates the `bindTab` `step` when a tab in the [`tabstrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip) component `myTab` is `Select`:ed.

**Line 23 - 27**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. This `step` runs a [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation`, binding the content of `tenant://Settings` to our `myTab` `component`.

**Line 29 - 34**
The `bindTab` `step` first creates an `alias` (variable) called `selectedTab` using the incoming event trigger `!`. Next we look at the `@xlink:href` attribute (the path in the database corresponding to the selected tab) of our incoming event trigger `!`, and `bind` that to our `tabGrid` [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid). In other words; by letting the grid know what container we are selecting from the tabstrip, and its path in the database, we can visualize the content of that container in the grid.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)
- [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)
- [tabstrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

**Other:**

- [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)
- [rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/select-a-tab-to-bind-a-grid>*

---

## Set selection on a UI component

This concept shows how to affect the user interface by making programmatic selections, simulating a user clicking on the user interface.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Set Selection Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="selection" icon="icon://lightbulb_on">
  <view name="selection" title="setSelection in Grid" icon="icon://lightbulb_on" width="400" height="250">
    <panel type="rows" width="100%" height="100%" padding="15">
      <grid name="myFiles" height="100" width="100%" selection="row" selection-mode="single" inset="true">
        <row match="db:object">
          <column name="nameCol" match="@name" display="." label="Name" width="40%"/>
          <column name="createdCol" match="@published" display="translate(@published,'TZ','  ')" label="Created" width="60%"/>
        </row>
      </grid>
      <panel type="columns" style="padding:5px 0 0 0;">
        <button name="selectFirst" text="Select First"/>
      </panel>
    </panel>
  </view>

  <process name="selection - Process">
    <trigger view="selection" component="selectFirst" event="Select" step="selectFirst"/>

    <step id="start">
      <operation name="bind" value="home://Applications">
        <component view="selection" name="myFiles"/>
      </operation>
    </step>

    <step id="selectFirst">
      <operation name="setSelection">
        <component view="selection" name="myFiles">
          <item select="/db:result/*[1]"/>
        </component>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 8**
Each `row` in our [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) will `match` one `db:object` in the document we bind it to. Each `row` will have one `column` showing the corresponding `db:object`'s name, using `match="@name"` (which will display that information due to `display="."`), and and when each `db:object` was published using `match="@publish"`. In this `display` attribute we use `translate()` to put spacing between the date and the time of the `published` value.

**Line 19 - 23**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. This `step` will bind the content of `home://Applications` to the `myFiles` `component`.

**Line 25 - 31**
This `step` is triggered when the `selectFirst` [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button) is selected, running the [setSelection](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/setselection) `operation`. This will look up the `myFiles` component in the `view` `selection` and according to its child element [`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item) `select` the first node (regardless of its name) in our `db:result` using `/*[1]`. This means selecting the first node when querying `home://Applications`.

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)
- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [setSelection](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/setselection)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/set-selection-on-a-ui-component>*

---

## Show an alert dialog

This concept shows how a customizable alert ([confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)) dialog can be triggered from a user interaction, in this case a [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button).

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Alert Dialog Concept** *(runnable)*

```xml
<application name="confirmAlert" icon="icon://lightbulb_on">
  <view name="confirmAlert" title="Confirm Dialog Concept" icon="icon://lightbulb_on" width="400">
    <panel type="columns" width="100%" height="100%" padding="15">
      <button name="alertBtn" text="Alert"/>
    </panel>
  </view>

  <process name="confirmAlert - Process">
    <trigger view="confirmAlert" component="alertBtn" event="Select" step="alertDialog"/>

    <step id="alertDialog">
      <operation name="confirm">
        <type value="message"/>
        <message>This alert has custom title, icon, and modal settings.</message>
        <modal>true</modal>
        <title>Custom Alert Title</title>
        <icon>icon://megaphone</icon>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 9**
When the `alertBtn` `component` is `Select`:ed we run the `step` `alertDialog`.

**Line 12 - 18**
The [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm) `operation` with its `type` element set to `value="message"` allows you to set a custom message in the `message` element. `modal` set as true will put this alert as a modal window, `title` allows you to set a custom title shown at the top of the dialog window, and `icon` allows you to set an icon for the dialog window. (Read more about XIOS/3's built in icons [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/icon-protocol).)

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)

**Process Operations:**

- [confirm](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/confirm)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/show-an-alert-dialog>*

---

## Styling components with CSS

This concept shows how to [style](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/style) the look of a component using CSS.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Styling UI Components with CSS Concept** *(tested, runnable)*

```xml
<view name="styleButton" title="Style Button" icon="icon://lightbulb_on">
  <style>
    #styledButton {
      color: #0f0;
      background-color: #4a7;
      border-radius: 0px;
    }
    #styledButton:hover {
      color: #afa;
      background-color: #285;
      border-radius: 0px;
      text-decoration: underline;
    }
  </style>
  <panel type="columns" width="100%" height="100%" padding="15">
    <button name="styledButton" text="Styled"/>
    <button name="normalButton" text="Normal"/>
  </panel>
</view>
```

#### Code Explanation

**Line 2 - 14**
The [style](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/style) element is always put at the top of (and within) the [`view`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) element. Within `style` you use regular CSS to change the look of a component, by using `#` before the name of the component.

**Line 16 - 17**
Here we insert two [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button) components, one that is styled and one that has default styling according to the theme of the application or view.

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)

**Other:**

- [style](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/style)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/styling-components-with-css>*

---

## Transform data using XSL

This concept shows how to transform data using XSL.

> **Note:** The XSL file can be put anywhere in your project's folder structure, but we recommend putting it in `layout`. For a deployed application the `href` in the [`render`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/render) component would then point to e.g. `host://layout/myXSL.xsl`

> **Note:** For more information about how to use XSLT, please see the [XSLT Manual](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/overview-xslt).

#### Code Snippet

**Transform XML data using XSL** *(tested, runnable)*

```xml
<application name="xslTransform" icon="icon://lightbulb_on">
  <resources>
    <item name="breakfast">
      <breakfast-menu>
        <food>
          <name>Belgian Waffles</name>
          <price>$5.95</price>
          <description>two of our famous Belgian Waffles with plenty of real maple syrup</description>
          <calories>650</calories>
        </food>
        <food>
          <name>Strawberry Belgian Waffles</name>
          <price>$7.95</price>
          <description>light Belgian waffles covered with strawberries and whipped cream</description>
          <calories>900</calories>
        </food>
      </breakfast-menu>
    </item>
  </resources>

  <view name="xslView" title="XSL Transform of Data" icon="icon://lightbulb_on" width="420" height="250">
    <panel type="rows" width="100%" height="100%" padding="15" bgcolor="#fff">
      <render name="render" href="xios://apps/help/layout/menu.xsl"/>
    </panel>
  </view>

  <process>
    <step id="start">
      <operation name="bind" value="#breakfast">
        <component view="xslView" name="render" select="/"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 2 - 19**
This is our inlined XML document, put in an [`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item) in the `resources` element. This is what we bind our [`render`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/render) to on **line 29 - 31**, but could also be a linked in document or an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases).

**Line 23**
The highlight of this concept is linking our XSL document to our [`render`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/render) component in the `href` attribute. For this concept it is a document within the XIOS/3 Help but could be linked from anywhere.

> **Note:** The XSL document is provided below.

#### XSL Document

**XSL document used for this concept** *(not runnable)*

```xml
<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="breakfast-menu">
    <html>
      <body style="font-family:arial; font-size:12pt; background-color:#fff;">
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="food">
    <div style="background-color:#1668A8; color:white; padding:4px;">
      <span style="font-weight:bold; color:white;">
        <xsl:value-of select="name"/>
      </span>
      - <xsl:value-of select="price"/>
    </div>
    <div style="margin-left:20px; margin-bottom:1em; font-size:10pt;">
      <xsl:value-of select="description"/>
      <span style="font-style:italic">
        (<xsl:value-of select="calories"/> calories per serving)
      </span>
    </div>
  </xsl:template>
</xsl:stylesheet>
```

### Used Building Blocks

**Components:**

- [render](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/render)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/transform-data-using-xsl>*

---

## Translate a string to replace characters

This concept shows how to translate T and Z to space characters and show the result in a pop-up.

#### Code Snippet

**Application that will replace T and Z character in the time stamp with space** *(runnable)*

```xml
<application name="Test Translate">
  <process>
    <step id="start">
      <alias name="datetime" value="2024-11-08T11:42:58Z" model="value"/>
      <operation name="debug" value="translate({$datetime},'TZ','  ')">alert: plain</operation>
    </step>
  </process>
</application>  
```

#### Code Explanation

**Line 5**
The translation is displayed in a pop-up.

### Used Building Blocks

**Functions:**

- [translate](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/functions/translate)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/translate-a-string-to-replace-characters>*

---

## URL Query string

This concept shows how to use a parameter that has been passed in the URL.

E.g., https://temp-171868-ban.cloudbackend.cloud/?cty=SE&qty=42

#### Code Snippet

**Catching the URL query string** *(not runnable)*

```xml
<process name="Values" description="Get external parameter values">
  <step id="appOpened">
    <alias name="getCountry" value="{host://.url#/url/param[@key='cty']}" model="value"/>
    <alias name="getQuantity" value="{host://.url#/url/param[@key='qty']}" model="value"/>
  </step>
</process>  
```

#### Code Explanation

**Line 3 - 4**
Select each `key` in the URL query string into an `alias`.

### Used Building Blocks

**Other:**

- [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/url-query-string>*

---

## Using temporary documents

This concept shows how to use temporary in-memory XML document that is not stored in the database, but can be accessed and used like any database object.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Creating Temporary Document Concept** *(tested, runnable)*

```xml
<application name="bindTemp" icon="icon://lightbulb_on">
  <view name="bindTemp" title="Create a Temporary Object" icon="icon://lightbulb_on" width="400" height="250">
    <panel type="rows" width="100%" height="100%" padding="15">
      <grid name="showDoc" height="100" width="250" selection="row" inset="true">
        <row match="item">
          <column name="nameCol" match="@name" display="." label="Name" width="50%"/>
          <column name="contentCol" match="text" label="Content" width="50%"/>
        </row>
      </grid>
      <panel type="columns" style="padding:5px 0 0 0;">
        <button name="createTemp" text="Create tempDoc" width="110"/>
        <button name="bindTemp" text="Bind tempDoc" width="110" hide="true"/>
      </panel>
    </panel>
  </view>

  <process name="bindTemp - Process">
    <trigger view="bindTemp" component="createTemp" event="Select" step="createTemp"/>
    <trigger view="bindTemp" component="bindTemp" event="Select" step="bindTemp"/>

    <step id="createTemp">
      <alias name="tmpDoc" model="newsilent">
<list>
  <item name="firstItem">
    <text>Some text</text>
  </item>
  <item name="secondItem">
    <text>Some more text</text>
  </item>
</list>
      </alias>
      <operation name="action" value="#bindTemp">
        <component name="bindTemp" action="show"/>
      </operation>
    </step>

    <step id="bindTemp">
      <operation name="bind" value="$tmpDoc">
        <component view="bindTemp" name="showDoc" select="/list"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 8**
For each `row` in our [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) we want to `match` (and show) each `item` node from our document, bound on **line 39 - 41**. For each `item` node we want to display its `name`, from each items name attribute, and its text in separate columns.

**Line 22 - 31**
Creating a temporary document in an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) by using `model="newsilent"`. Our temporary document has a main [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) element with [`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item) nodes as children, and `text` nodes as children to each `item`.

**Line 32 - 34**
This [action](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/action) `operation` will make the `bindTemp` [`button`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button) visible.

**Line 38 - 40**
Here we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation` to bind our `$tmpDoc` (from the top [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) node, using `select="/list"`) to the `showDoc` `component`.

### Used Building Blocks

**UI Components:**

- [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)
- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)

**Process Operations:**

- [action](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/action)
- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

**Other:**

- [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/using-temporary-documents>*

---

## Visualize the database with a tree

This concept shows to [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) a [bush (tree)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/bush) component to a container hierarchy. If you are going to visualize XML documents (and not the database hierarchy) we advise you look at the [Visualize XML with a tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-xml-with-a-tree) concept. The bush component use lazy loading to only retrieve data from the database when the node in the tree is visited.

If logged in, you can run the code directly here. Feel free to copy the parts you need for your application.

#### Code Snippet

**Tree Database Visualization Concept** *(runnable, needs a signed-in tenant)*

```xml
<application name="bindBush" xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" icon="icon://lightbulb_on">
  <view name="bindBush" title="Binding to Bush" icon="icon://lightbulb_on">
    <panel type="rows" width="100%" height="100%" padding="5">
      <!-- Bush component is typically used to visualize a container hierarchy, e.g. listing containers. -->
      <bush name="tenantBush" scroll="true" sort="ascending" sortproperty="display" width="100%" height="fill" multiple="false" hover="false">
        <rule match="db:result">
          <item display="Tenant database" icon="service/images/cbe-symbol.png"/>
        </rule>
        <rule match="db:container">
          <item display="{@name}" icon="icon://table?color=2E86C8"/>
        </rule>
      </bush>
    </panel>
  </view>

  <process name="bindBush - Process">
    <step id="start">
      <operation name="bind" value="tenant://">
        <component view="bindBush" name="tenantBush" select="/"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 6 - 8**
This `rule` will look at the result from our binding (done on **line 18 - 20**), displaying every node matching `db:result` and display these with the name `Tenant database`. (Since we are binding to `tenant://` we will only have one node called `db:result`.)

**Line 9 - 11**
This `rule` will look at the result from our binding (done on **line 18 - 20**), displaying every node matching `db:container` under `db:result` and display these with their given name using `{@name}`.

**Line 17 - 21**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. In this `step` we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation` to bind the root of `tenant://` using `select="/"` to the `tenantBush` `component`.

### Used Building Blocks

**UI Components:**

- [bush](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/bush)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

**Other:**

- [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-the-database-with-a-tree>*

---

## Visualize XML with a tree

This concept shows to [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) a [tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree) component to a object hierarchy. If you are going to visualize more of an container hierarchy we advise you look at the [Visualize the database with a tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-the-database-with-a-tree) concept.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Visualize XML in Tree Concept** *(runnable)*

```xml
<application name="bindTree" xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" icon="icon://lightbulb_on">
  <view name="bindTree" title="Binding to Tree" icon="icon://lightbulb_on">
    <panel type="rows" width="100%" height="100%" padding="5">
      <!-- Tree component is typically used to visualize a object hierarchy, e.g. the content of a document or listing emails. -->
      <tree name="myTree" width="100%" height="100%" theme="liquid" tree-expand="true" rename="false" bgcolor="#fff">
        <rule match="list" display="@name" icon="icon://list_style_numbered" open="true"/>
        <rule match="item" display="@name" icon="icon://pencil"/>
        <rule match="item/text" display="."/>
      </tree>
    </panel>
  </view>

  <process name="bindTree - Process">
    <step id="start">
      <alias name="tmpDoc" model="newsilent">
        <list name="My List" stype="color:black">
          <item name="firstItem">
            <text>Some text</text>
          </item>
          <item name="secondItem">
            <text>Some more text</text>
          </item>
        </list>
      </alias>
      <operation name="bind" value="$tmpDoc">
        <component view="bindTree" name="myTree" select="/list"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 6 - 8**
These `rule` elements will look at the result from our binding (done on **line 25 - 27**), creating a node in the tree for each `match`, in this case the `list`, `item`, and `item/text` (text node under each item node), displaying their `name`, the text `Item`, and the text node (using `display="."`) respectively.

**Line 14**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded.

**Line 15 - 24**
Creating a temporary document in an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) by using `model="newsilent"`. Our temporary document has a main [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) element with [`item`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/item) nodes as children, and `text` nodes as children to each `item`.

**Line 25 - 27**
Here we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation` to bind our `$tmpDoc` (from the top [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) node, using `select="/list"`) to the `myTree` `component`.

### Used Building Blocks

**UI Components:**

- [tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)

**Other:**

- [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)
- [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/visualize-xml-with-a-tree>*

---
