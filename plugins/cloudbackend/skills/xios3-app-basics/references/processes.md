# XIOS/3 — process development

The process document: triggers, steps, operations, aliases, expressions, the event model, and writing process code in JavaScript.

30 topics from the published XIOS/3 documentation, generated on 2026-11-08. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Process Development](#process-development)
- [Aliases](#aliases)
- [Alias Types](#alias-types)
- [System Aliases](#system-aliases)
- [Event Model](#event-model)
- [Component Events](#component-events)
- [System Events](#system-events)
- [View Events](#view-events)
- [JavaScript](#javascript)
- [Custom Operations](#custom-operations)
- [Process Code](#process-code)
- [Steps](#steps)
- [Operation](#operation)
- [Process](#process)
- [Steps](#steps)
- [Triggers](#triggers)
- [Using Expressions](#using-expressions)
- [Binding Data Models](#binding-data-models)
- [Calling Methods](#calling-methods)
- [Event Propagation](#event-propagation)
- [Examples](#examples)
- [Fetching Data](#fetching-data)
- [Functions](#functions)
- [Maths](#maths)
- [Processes](#processes)
- [Recursive Expressions](#recursive-expressions)
- [Serializing](#serializing)
- [Triggers (Events)](#triggers-events)
- [Variables](#variables)
- [Xbinds](#xbinds)

## Process Development

In this section we will cover everything about Process Development and is divided in to sections of relevance.

Process markup is the logic part of XIOS/3 Application Development. When considering the [MVC design pattern](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/the-mvc-design), process markup equals to the Control. The image below illustrates the relation between the [User Interface](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development) of an application and how user interactions (called [events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events)) activates [triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers), which in turn activates one or several [step(s)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) that calls and executes [operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation).


Not only user interactions affect the UI in XIOS/3. Things happening on the server backend may also affect the UI, as well as changes to the UI automatically affecting the server backend.


### What this section covers

This part of the documentation covers the cornerstones and the construction of the process markup language. First the root element, [process](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/process), and how to use it. We then explain how [trigger elements](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers) work, what their purpose is and how events are captured.

There is also a section explaining what [Steps](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) are, how to use them and how they should be interpreted. [Operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation) are children of Steps, and the central building block of application logic, making this an important section to understand.

Next is an extensive section about [Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases), which are XIOS/3 equivalents of variables. We explain what they are, how they are used as well as what other purposes they can be used for. The Alias section contains two chapters; [Alias Types](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases/alias-types) and [System Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases/system-aliases).

The Event Model, which is the foundation of end user interactivity with components as well as with the XIOS/3 system. The section provides you with examples of binding components to each other as well as how to work with [triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers) and selections. In this section is also an event section which provides information abou [View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) and System events.

When trying to understand application logic, our section on [Expressions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions) is very important. It contains key information about how components can interact and also includes examples.

- **[Triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers)** — Event listeners used to set up event catchers. Will execute a specified Step and all its Operations when activated. *(Process Logic)*

- **[Steps](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps)** — "Logic clusters" in XIOS/3, containing one or several Operations. Activated through a Trigger. *(Process Logic)*

- **[Operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation)** — Children of Steps, and the central building block of application logic, performing actions on one or several UI components. *(Process Logic)*

- **[Aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases)** — The powerful and flexible equivalent to variables. It's a reference to a value or XML node set, defined using Expressions. *(Process Logic)*

- **[Process As JavaScript](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript)** — Write the process code in JavaScript. *(Process Logic)*



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development>*

---

## Aliases

Aliases are powerful and flexible equivalents to variables that are more like a struct, class, or JSON, i.e. four-dimensional, and are used in the process markup language. It is a reference to a value or an XML node set, defined using [expressions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

#### The dimensions of aliases

All aliases are four-dimensional. Either they are just a single string value, or they consist of the three dimensions of `Object`, `Base` and `Selection`.

- Object (Document)
- Base (XPath)
- Selection
- Value

Any defined `alias` in process markup that has a `value` attribute with an expression pointing to a component in the system will always become three-dimensional. If such an `alias` is put within curly-brackets, e.g. `{$myAlias}`, it always becomes serialized to the Document and the other two dimensions are lost. When binding a component to an `alias`, always make sure not to use curly brackets as the selection of the other component will be lost.

Selections are made of `0 .. n` XPath Expressions pointing to the selected parts of the XML document.

Base allows the `alias` to start not at the root of the XML document data model, but instead at a specific level of the XML document specified by the XPath. This means that the `alias` effectively works as an XML document fragment.

The value dimension of aliases is only used when the `alias` is storing a string or number value (i.e. not a reference).

#### Usage

With aliases you can store strings, integers, paths and XML data. They are global in scope by default, which means that they are available to all steps in the process markup document. There is also support for local scope, which makes the information stored in the alias only available in a single `step`.

Aliases are also used to open documents from the database and can be used to create new XML node sets.

An `alias` is an *Event Object* that is either a document or a string value. If it is a document then if would consists of three parts; `Object`, `Base`, and `Selection`. (see Event Object in [Event Model](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model) section).

#### Alias in process markup

The `alias` element in process markup has three attributes. Here the `name` attribute defines the name of the `alias`, which is used when calling it in the code. An `alias` is available using a dollar sign `$` followed by its name, i.e. the value of the `name` attribute. Keep in mind that aliases can be overwritten by defining them again using another `value`.

When using the `alias` to store information, something must be provided in the `value` attribute, or through the `child elements` of the `alias` in the case that the `model` attribute is set to `define`. Besides supporting integers and strings, `alias` can also support XML data which is provided using [Expressions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

The `model` attribute defines how the system should interpret your `alias`. If it is a value (integer or string) or if it contains XML data. Here you should note that if the alias contains XML data and the `model` is set to `value`, the data will be serialized in to a string and omit all elements, leaving only the text() nodes. As we mentioned earlier, alias can use `global` or `local` scope. This might induce the need to make local scope aliases in to global, which is done by setting `model="global"`.

#### Special use cases for model attribute

There are several `model` options that are not used to store information, but instead to make the system execute an action. Here the `model="new"` is used to create a new XML node set that can be used temporarily until it is saved. Using the `model="open"` will display an "Open file" modal dialogue so that the end user can select an object. Parameters can also be provided when opening objects, which enables the developer to rename the buttons visible to the end user and also what *mime-type* that can be selected. The `model="container"` works like the `model="open"` but will instead allow the end user to select a container. Note that when opening an XML document the entire document will be available, but when opening something else (i.e. an image file) only meta data will be available. When opening a container you will only gain a string (the path) to the container selected in the `container` selector attribute.

Using the `model="define"` you can define the base and selection of the data.

### Attributes

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `name` | string | Any string value |  | The name of the alias |
| `value` | string | string, integer, Expression |  | Decides what the alias will contain |
| `model` | enumeration | data, global, value, newsilent, new, open, container, define, browse, local | data | How the alias should be interpreted by the system |
| `when` | enumeration | undefined, empty |  | Optional. Conditioned on that the alias is: undefined (is not defined) / empty (is not defined or is an empty string). |

### Syntax and Examples

**Syntax for a common alias.**

```xml
<alias name="[string]" value="[string|integer|expression]" model="[enumeration]"/>
```

**This will evaluate the expression but will keep it as XML data.**

```xml
<alias name="myXMLalias" value="{xml(#view1#component1)}"/>
```

**Retrieving the selection XPath from the component.**

```xml
<alias name="selXpath" value="selection(#View#Comp)" model="value"/>
```

**Retrieving the object name from the document bound to the component.**

```xml
<alias name="fileName" value="filename(#View#Comp)" model="value"/>
```

**Retrieving the URL path from the document bound to the component.**

```xml
<alias name="docPath" value="#View#Comp" model="value"/>
```

**Calculations and Mathematics operators.** *(tested, fragment)*

```xml
<alias name="pageOffset" value="0"/>
<alias name="pageCount" value="100"/>
<alias name="quantity" value="3"/>
<alias name="unitPrice" value="4.25"/>
<alias name="sum" value="30"/>
<alias name="counted" value="5"/>
<alias name="power" value="3"/>
<alias name="identitiesStart" value="={$pageOffset} + 1"/>
<alias name="identitiesEnd" value="={$pageOffset} + {$pageCount}"/>
<alias name="counted" value="={$counted} - 1"/>
<alias name="totalPrice" value="={$quantity} * {$unitPrice}"/>
<alias name="exponentiation" value="={$counted} ** {$power}"/>
<alias name="average" value="={{$sum} / {$counted}}"/>
<alias name="modulus" value="={{$sum} % {$counted}}"/> 
```

**Conditionally set the alias if not previously done.** *(tested, fragment)*

```xml
<alias name="num" value="0" when="undefined"/>
<alias name="testDoc" value="home://test.xml" when="empty"/>
```

**Opening an object dialog to select an object and store the selected object in an Alias.** *(tested)*

```xml
<alias name="dataDoc" model="open">
  <dialog title="Open" folder="home://Documents">
    <label name="ok">Open Object</label>
    <label name="cancel">Cancel</label>
    <type mime="text/xml"/>
    <type mime="text/plain"/>
  </dialog>
</alias>
```

**Opening an object dialog to select a container and store the selected container in an Alias.** *(tested)*

```xml
<alias name="dataDoc" model="container">
  <dialog title="Open" folder="home://Documents">
    <label name="ok">Select Container</label>
    <label name="cancel">Cancel</label>
    <label name="createFolder">Create Container</label>
    <type mime="text/xml"/>
  </dialog>
</alias>
```

**Alias using model define to specify by hand all the parts of a 3-dimensional Alias; document, base and selection. Use value attribute to inherit and only modify one of the below.** *(tested)*

```xml
<alias name="tmpSelection" model="define">
  <document>#tmp1</document>
  <base>/components[1]</base>
  <selection>
    <item select="/components[1]/component[2]"/>
    <item select="/components[1]/component[3]"/>
    <item select="/components[1]/component[5]"/>
  </selection>
</alias>
```

**Alias using model define inheriting the value and adding an XPath to the existing selection.** *(tested)*

```xml
<alias name="tmpSelection" value="#view#comp" model="define">
  <selection>
    <item select="{selection(#view#comp)}/ancestor-or-self::*[1]"/>
  </selection>
</alias>
```

**Alias model browse allows you to select any object or container in the database which then becomes available in the defined alias.**

```xml
<alias name="targetFile" model="browse">
  <dialog title="Select Shortcut Target">
    <label name="ok">Select</label>
    <label name="cancel">Cancel</label>
    <type mime="text/xml"/>
  </dialog>
</alias>
```

**Catching the URL query string in e.g., https://temp-171868-ban.cloudbackend.cloud/?cty=SE&qty=42** *(fragment, not runnable)*

```xml
<alias name="getCountry" value="{host://.url#/url/param[@key='cty']}" model="value"/>
<alias name="getQuantity" value="{host://.url#/url/param[@key='qty']}" model="value"/>
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases>*

---

## Alias Types

#### Common Use

The code below will hold XML data that is temporarily stored in the trigger. The reason that you might want to store your trigger-value is because the trigger constantly changes. A global variable will be created and the value will be available in all steps.

**Getting the selection data in the trigger** *(fragment)*

```xml
<alias name="selected" value="!" model="data"/>
<operation name="debug" value="$selected">alert</operation>
```

### Examples

#### data

`data` will set the data document and selection (if any exists) of the reference document. It is the default model used.

**Alias with model set to data**

```xml
<alias name="LvSelection" value="!" model="data"/>
```

#### global

`global` will make the alias available globally. The intended use for this is when dealing with local aliases set by parameters using the call operation.

**Alias with model set to global**

```xml
<alias name="DataDoc" value="!" model="global"/>
```

#### local

`local` is used to create non-transacted temporary documents. This means that the XIOS/3 TransactionManager will not be used.

#### new

`new` is used to create a new temporary data document on the fly by adding the data document as child elements of the alias element. It can be saved.

**Alias with model set to new**

```xml
<alias name="DataDoc" model="new">
  <clients/>
</alias>
```

#### newsilent

`newsilent` is used to create a new temporary data document, without notifying the user about the procedure.

**Alias with model set to newsilent**

```xml
<alias name="SaveData" model="newsilent">
  <mydata/>
</alias>
```

#### value

`value` will convert the reference to a string (omitting the XML).

**Alias with model set to value**

```xml
<alias name="CompanyName" value="{#view1#component1}" model="value"/>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases/alias-types>*

---

## System Aliases

In XIOS/3 there are some aliases that are implicit (predefined) and can be used directly in the Process markup language without the need to define a value to them. Some retrieve information directly from the user computer, such as time and date. These are reserved and cannot be overwritten.

### date

The `$date` alias will return the current date of the user running XIOS/3.

```xml
<operation name="debug" value="$date">alert</operation>
```

Example: 2022-12-13

### time

The `$time` alias will return the local time of the user running XIOS/3.

```xml
<operation name="debug" value="$time">alert</operation>
```

Example: 11:19

### milliseconds

The `$tm` alias will return the number of milliseconds from January 1, 1970 GMT as an integer.

This alias is very useful when you must create a unique name.

To make `$tm` work first place it inside a variable. Then when using the new alias always place it inside curly brackets.

*(fragment)*

```xml
<alias name="ctm" value="$tm"/>
<operation name="debug" value="{$ctm}">alert</operation>
```

Example: 1197541185125

### widget

The `$widget` alias contains the widget settings of the widget using it (only available for process markup that run for a user interface dialog of type widget). The result will be displayed in XML data where the root is db:object. Note that if the widget is not defined in the settings.xml that this system alias will not contain any information.

```xml
<operation name="debug" value="$widget">alert</operation>
```

Example: [XML DATA]

### instance

The `$instance` alias will return the instance of the application package opened.

```xml
<operation name="debug" value="$instance">alert</operation>
```

Example: 2

Note that an application can limit the number of instances that can be active and that a specific application instance can be reached using `#appname_{$instance}`.

### package

The `$package` alias will contain the XML of the application document. Note however that when you are using this alias that you must use relative path and never absolute path.

Using this alias you can open views and process documents by adding an [expression](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions) after the variable.

```xml
<operation name="debug" value="$package">alert</operation>
```

Example: [XML DATA]

### home

The `$home` alias is available when using application packages and when the home element has been defined in the settings element of the [application document](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/overall-structure).

```xml
<operation name="debug" value="$home">alert</operation>
```

Example [XML DATA in the form of a database result of the container]

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases/system-aliases>*

---

## Event Model

The Event Model is central to understanding how XIOS/3 programming works. It is the foundation for end-user interaction with XIOS/3 applications.

Events are emitted when the end-user interacts with XIOS/3 and your application. If data is bound to the object from which the event was emitted it too can be used. The `Event Object` can also be emitted using Expressions. In this case no event type is needed and like with end-user created events then state of the component is provided.

### Event Model Flow Chart


### Event Object

The `Event Object` is emitted every time a component is clicked; the developer requests it from a component or when a user perform a shortcut command.

Every `Event Object` is made up of five parts. One of these is the event `type`, which contains information about what event triggered the Object. The second part is the `Object` (dataDoc) which contains a URL to the XML data document that is bound to the component that made the event. Note that when events are made by components that are not bound to data or to system events, that there is no dataDoc, and that it therefore can't be any `Base` or `Selection` either.

In the XPath we find the `Base` to which the component is bound. The `Selection` part contains an XPath of the selection in the data starting from the `Base`. The fifth part is the `value`. If a `text()` node is selected a text will appear here, if not it will be empty.

| Name | Type | Value | Description |
|---|---|---|---|
| **Type** | enumeration | [Component Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), [System Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events), [View Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events) | The type of event made |
| **Object** (dataDoc) | string | path | A URL to the data model (XML data document) |
| **Base** (XPath) | string | match | The XPath base path of the bound data |
| **Selection** | string | match | The xpath selection in the XML document, starting from the basepath |
| **Value** | string | Any string value | The text node of the selection (if it exists) |

#### Event Types

There are three different types of events; [Component Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), [System Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events) and [View Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events). They differentiate by what created them. In the end they are all made by user interaction, however they are made by different parts of XIOS/3.

Component Events are made from when the user interacts with a component, like a `button`. It will (when selected) create an `Event Object` with the type `Select`.

System Events are made by the XIOS/3 system. These include Login and Authorize events from communication channels.

View Events are specific to views and are basically shortcut events such as `CTRL+S` or `ESCAPE`. These can also be captured by event listeners.

### Event Capturing

See [trigger element section](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model>*

---

## Component Events

### Binding components to other components

When [binding](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) one component to another you create an event object, that doesn't contain any event type. The real advantage of binding data like this is that changes made to the XML document will be updated directly in both components when making a change to the data with either component.

```xml
<?xml version="1.0"?>
<process name="musicplayer" description="musicplayer application" author="XIOS/3">
  <step id="100" name="Bind data to combobox using grid">
    <operation name="bind" value="#musicplayer#gridMusic">
      <component view="musicplayer" name="cb_artists" select="/"/>
    </operation>
  </step>
</process>
```

### Working with the !

In the example below we first bind the `stations.xml` document to a grid component called `gridMusic`. We then set up an event listener that will listen for the `Select` event made in the grid component. This is made when the user selects a value in the grid.

The first step will populate the grid component with radio stations (using the [bind operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)). We bind the data from the root; which is radio.

The second step will be executed by the event listener. When a selection is made in the grid, a single station node will be selected. In step 101 we bind the event object selection to our other two components. The description attribute is bound to the input field and the entire station element is bound to the listview.

**The XML data**

```xml
<?xml version="1.0"?>

<radio>
  <station name="Example 1" url="http://example.com/" description="Example music for all ages."/>
  <station name="Example 2" url="http://example2.com/music/" description="Jazz Music by Example Ltd."/>
</radio>
```

**The Process Markup**

```xml
<?xml version="1.0"?>

<process name="musicplayer" description="musicplayer application" author="XIOS/3">
  <trigger view="musicplayer" component="gridMusic" event="Select" step="101"/>

  <step id="start" name="Bind data to grid component">
    <operation name="bind" value="home://data/stations.xml">
      <component view="musicplayer" name="gridMusic" select="/radio"/>
    </operation>
  </step>

  <step id="101" name="Bind data to input field">
    <operation name="bind" value="!">
      <component view="musicplayer" name="inputEdit" select="/station/@description"/>
      <component viwe="musicplayer" name="listviewPlayer" select="/station"/>
    </operation>
  </step>
</process>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/component-events>*

---

## System Events

System Events are events made by the XIOS/3 system. These can also be captured by the Process markup [event listeners](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model).

These events do not require any component or view attributes when defining them in an event listener. It does, however, need a communicator attribute to define which part of XIOS/3 throws the event.

The standard communicator is CBE (CloudBackend). You can however make you own communicator using the [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel) operation. Groups can also be communicators; when applications are stored in the groups database.

When a new container is created by the database, the system will throw a `NewFolder` event.

| Name | Type | Values | Description |
|---|---|---|---|
| communicator | string | Any string value | Communicator that is throwing the event |
| event | enumeration | Join, Saving, Completed, Login, LoginFailure, Authorized, Error, Close, Timeout, NewFolder, Insert | The event made by the system |
| step | string | identifier | Step to execute |

**Syntax**

```xml
<trigger communicator="[string]" event="[enumeration]" step="[string]"/>
```

**Example**

```xml
<process name="xiosLogin" description="Main process document for Calculator" author="XIOS/3">
    <trigger communicator="xios" event="Login" step="Config"/>

    <step id="Config" name="Initiate Configuration">
      ...
    </step>
</process>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events>*

---

## View Events

There are events that are specific to views and not components. Currently, the majority of events available are shortcut events that allow the application developers to make shortcut commands in their application. There are, however, some commands that are reserved by XIOS/3. A list of these is posted below.

The shortcut events are produced when a user interacts with an application using shortcut keys such as `Ctrl+S` for save and `Ctrl+C` for copy. XIOS/3 allows for capturing these events and then trigger operations.

XIOS/3 can capture a combination of control, shift, alt and meta key. Just combine them as `Ctrl+`, `Shift+`, `Alt+` and `Meta+` prefix to unmodified key label, e.g. `Ctrl+Alt+A`. It is also possible to capture specific character inputs by prefixing the character with `Char`, e.g. `Charx` for an unmodified keypress on "x" or `CharX` for a Shift+X keypress. Non-letter key presses are available under their DOM event specified name, when available. These include `Enter`, `Space`, `Tab`, `Delete`, `End`, `Help`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowDown`, `ArrowUp`, `ArrowLeft`, `ArrowRight`, `Escape`, `ScrollLock`, `Pause`, `AltLeft`, `AltRight`, `ShiftLeft`, `ShiftRight`, `ControlLeft`, `ControlRight`, `MetaLeft`, `MetaRight`, `ContextMenu`, `F1-F24`.

In addition to the keyboard events, there is a number of events that are fired for a view that are not component specific.

| Name | Description |
|---|---|
| Opened | A view has been opened and the components are ready for iteration from users and process code. |
| Closing | The view is about to close down. |
| Close | The view has closed. |
| Focus | The view has gained focus. |
| Blur | The view has lost focus. |
| Maximize | The view size is maximized. |
| Restore | The view size is restored from maximized size. |
| ResizeEnd | The user has stopped resizing the view. |
| Minimize | The view is "minimized", e.g. effectively hidden until restored. |
| RestoreAppWin | The view is restored from minimized state. |

Since these events do not originate from any component, no component attribute should be supplied in the element.

Note that the `Unload` event is triggered when the user is closing the browser.

| Name | Type | Values | Description |
|---|---|---|---|
| view | string | Any string value | The name of the view from which the event will originate |
| event | string | Any event name | The event made by the user or the system |
| step | string | identifier | Step to execute |

**Syntax**

```xml
<trigger view="[string]" event="[enumeration]" step="[string]"/>
```

**Examples**

```xml
<?xml version="1.0"?>

<process name="myprocess" description="some description" author="XIOS/3">
  <trigger view="calculator" event="Alt+A" step="Add"/>
  <trigger view="calculator" event="Ctrl+B" step="Bold"/>
  <trigger view="calculator" event="Opened" step="Config"/>

  <step id="Add" name="Perform addition">
    ...
  </step>

  <step id="Bold" name="Make numbers bold">
    ...
  </step>

  <step id="Config" name="Configure settings">
   ...
  </step>
</process>
```

### Core Events

XIOS/3 captures several events at core level automatically. These are triggered by core interactions and should not be declared manually inside your view documents.

- `Loaded`: Triggered when a document has finished loading.
- `Unloaded`: Triggered when a document is closed or unloaded.
- `Resize`: Triggered when the view size changes.
- `Error`: Triggered when an error occurs in the view.
- `KeyDown`, `KeyUp`, `MouseDown`, etc.: Raw device events.

These events are handled globally and are used primarily in process logic, not in the view markup.

### View Events

View Events are used to catch user-initiated shortcuts or UI interactions originating from the application view.

### Symbolic Event Codes

XIOS/3 supports a set of reserved event codes that symbolically represent the correct key combinations for each platform.

For example, `Open` maps to Ctrl+O on Windows and Meta+O on macOS.

XIOS automatically detects the user’s platform and listens for the correct keybindings without requiring any changes from the developer.

Although it’s possible to specify explicit key combos (e.g. Ctrl+S), the recommended approach is to use symbolic event codes.

| Event Code | Windows / Linux | macOS |
|---|---|---|
| Copy | Ctrl+C | Meta+C |
| Cut | Ctrl+X | Meta+X |
| Paste | Ctrl+V | Meta+V |
| Undo | Ctrl+Z | Meta+Z |
| Redo | Ctrl+Y | Meta+Shift+Z |
| SelectAll | Ctrl+A | Meta+A |
| Find | Ctrl+F | Meta+F |
| Replace | Ctrl+H | (not defined) |
| Open | Ctrl+O | Meta+O |
| New | Ctrl+N | Meta+N |
| Save | Ctrl+Shift+S | Meta+S |
| SaveAs | Ctrl+K S | Meta+Shift+S |
| SaveAll | Ctrl+S | Meta+Option+S |
| Print | Ctrl+P | Meta+P |
| Quit | Ctrl+Shift+Q | Meta+Q |
| Reformat | Ctrl+Shift+I | Meta+Shift+I |
| GoToLine | Ctrl+G | Meta+G |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events>*

---

## JavaScript

There are a couple of ways you can work directly with JavaScript in the XML process code.
You can call JavaScript functions as if they were steps in the XML code, or you can replace the whole process XML code with JavaScript.

Read [JavaScript as Steps](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/js-steps).
Read [JavaScript as process code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/js-process).
Read [Custom operations in JavaScript](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/custom-ops).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript>*

---

## Custom Operations

You can also write the custom operations in JavaScript, in addition to the operations in the XIOS/3 standard library. This allows for the integration of custom-built operations into the standard library.

Below is a simple example of a JavaScript with a customs operations, which is saved in the file `customOps.js`:

**Custom Operations in JavaScript Example**

```javascript
//File 'customOps.js'
let x = 0;

export function incrementX(process, context, op, evt, stack) {
  x++;
}

export function decrementX(process, context, op, evt, stack) {
  x--;
}

export function logger(process, context, op, evt, stack) {
  return new Promise( (done) => {
    setTimeout( () => {
      console.log("Hello, " + evt.value + ", " + x);
      done();
    }, 50);
  });
}
```

**Line 2: Class Definition and Export**
We define an ES6 JavaScript module and in this example declare three different exported functions.

All the custom operations receives the following parameters:
`process`: The application's process object.
`context`: The application's context object.
`op`: The operation xml element.
`evt`: The event object.
`stack`: The stack of operation calls.

In this example the two first operations modify a global state. The third operation demonstrate an asynchronous call that forces the process code to wait for its completion.

Note that you can also define "regular" methods on the class, in addition to the operations that you want to reference from the process code.

### Importing Custom Operations

To make a custom operation available to the application, add an `<operations>` tag inside the `<process>` tag. Inside the `<operations>` tag you then list each operation that you want to import.

**Adding Custom Operations Example**

```xml
<process>
  <operations>
    <operation name="incrementX" href="customOps.js"/>
    <operation name="decrementX" href="customOps.js"/>
    <operation name="logger" href="customOps.js"/>
  </operations>

  <step id="start">
    <operation name="logger" value="World"/>
<!-- rest of the process code -->
```

**Line 2: Operations tag**
We define the `<operations>` tag inside `<process>`.

**Line 5: Operation reference**
We then list each operation we want to import.
The `<operation>` tag has three attributes:
`name`: The name of the JavaScript method that implements the operation.
`href`: The relative path to JavaScript file.
In the above example the JavaScript file would reside in the same directory as the process code.
Note that all custom operations are not required to reside in the same JavaScript file; you can spread them across multiple files and then simply point to each file.

**Line 9: Operation invocation**
The custom operation is called just like any standard library operation.
In this example we pass `World` to the custom operation `logger`, which would then log `Hello, World, 0` to the dev console.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/custom-ops>*

---

## Process Code

You can write the process code in JavaScript, in addition to XML markup.

The `<script>` tag replaces the `<process>` element that would be used if the process code were written in XML. For example: `<process xlink:actuate="onLoad" xlink:href="processes/test.xml" />`

Below is a simple example of process code written in JavaScript:

**JavaScript Process Code Example**

```javascript
export default class Test {

  constructor(context, basePath) {
    this.context = context;
    this.view;
    sys.evtMng.addTrigger("Test", null, "Loaded", this, this.loadView);
    sys.evtMng.addTrigger("Test", "Btn", "Select", this, this.onclick);
  }

  loadView = (evt) => {
    this.view = evt.getView();
  }

  onclick = (evt) => {
    console.log('Clicked button!');
  }
}
```

**Line 1: Class Definition and Export**
We define and export an ES6 JavaScript class. In this example, the class is exported as the default export, but you can also use named exports:
`export class Test { ... }`
Named exports allows for multiple class declarations in a single module/file.

**Line 3: Constructor Parameters**
An application instance receives two parameters:
`context`: The application context.
`basePath`: The base path of the script file. Useful for referencing resources relative to the JavaScript file.

**Line 7: Triggers**
Triggers are events that we want to listen and react to. They correspond to the `<trigger/>` element you would define in process code written in XML.

The parameters for registering a trigger are:
`Test`: Name of view document where the event is originating from.
`Btn`: Name of component that triggers the event.
`Select`: Name of the event to listen for.
`this`: A reference to the class instance.
`this.onclick`: The function to invoke when the event is triggered.

You can read more about triggers [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers).

**Line 14: Functions**
The class functions correspond to [steps](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) in the XML version of process code. Just like steps, they can be invoked either by an event/trigger or from another function.
If the function has been registered as a trigger event handler, an `event` object is passed to the function.

Note that in the example above, the class methods are defined as arrow functions to ensure that the `this` object is correctly bound to the class instance, without the need for manual binding.
If we use regular class functions, we would need to bind them in the constructor like so:
`this.onclick = this.onclick.bind(this)`

NOTE: instead of using an ES6 class, you can also use the equivalent constructor function for writing classes.

### Referencing the JavaScript File

To reference the JavaScript file, add a `<script>` tag in you XML application file (i.e. in the file that contains the `<application>` declaration). For example:
`<script class="Test" href="home://Applications/test/test.js"/>`

**XIOS/3 Application Example**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<application name="Test" icon="icon://rocket" instances="0" theme="cloudbackend" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:l="https://xios3.com/lang">

  <script href="home://Applications/test/test.js"/>

  <view xlink:type="simple" xlink:actuate="onLoad" xlink:href="home://Applications/test/TestView.xml"/>
</application>
```

**Script Tag Attributes**
The script tag has two attributes:
`class`: Specifies the name of the class to instantiate from the module. This attribute is required only when referencing a named export. For default exports it can be omitted.
`href`: Specifies the path to the JavaScript file. It can be either a relative path (a path relative to the XML application file) or an absolute XIOS/3 URI, as shown in the example.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/js-process>*

---

## Steps

It is possible to use `<script/>` elements inside `<process>` elements, and call the methods in the script as if they were steps through `<operation name="call">`.

To call a JavaScript method, create a JavaScript module in a file and export the methods that you want to call from the process code:

**JavaScript Module Example**

```javascript
// File: myModules.js

export function greet(evt, context) {
  console.log("Hello, World!");
}

export function printName(evt, context) {
  // Parameters passed from the XML process code can be accessed via 'context.aliases'.
  // Here we are accessing the 'name' param we passed in from the process code.
  const name = context.aliases.name.value;
  console.log(`Hello ${name}!`);
}

// We can also return a Promise
export function getPromise(evt, context) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      alert("Hello from a Promise");
      resolve();
    }, 1000);
  });
}
```

In the example above we have exported three methods.
Exported methods receive two parameters:
`evt`: a XIOS event object.
`context`: the runtime context for the application execution.

Next, add a script tag to the process element, with an 'href' attribute that points to the script file.
The path to the script should be relative to the location of the process code.
You can import multiple scripts by adding a tag for each script.

You can then call the exported JavaScript methods as if they were steps defined in the XML process code:

**Process code with a script tag**

```xml
<process>
  <script href="myModules.js"/>

  <step id="start">
    <operation name="call" value="greet"/>

    <operation name="call" value="printName">
      <param name="name" value="John"/>
    </operation>

    <operation name="call" value="getPromise"/>
  </step>
</process>
```

**Line 1: Script Import**
Import the script file.
In this example, the script file 'myModules.js' would reside in the same folder as process code.

**Line 5, 7 and 11**
Call the exported methods as you would normally call a step defined in the process XML.

Note that JavaScript methods may also return a Promise.
In these cases, process execution resumes only after the Promise has settled.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript/js-steps>*

---

## Operation

Operations are building blocks of the application logic. They define what will happen when the end user clicks on a specific component (together with the [trigger](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers) element and the [step](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) element). Operations are logical command that will perform actions on one or several [UI components](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components).

- **List of Operations** — A complete list of available process operations is found here. *(Shortcut)*

#### Usage

Operation is a child element of the [step element](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) and will therefore be executed once that step is executed by the system. Hence, all operations must be placed inside a [step element](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps).

In this section we explain the attributes of operations as well as a complete operation reference. The type of operation (name) and on what component or view it should be executed (value) are provided as attributes. For things to make sense we need to separate the meaning of operations and the operation element in this documentation. While there is only one operation element there are several different types of operations (such as [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call), [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) or [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug)). You define the option to use in the name attribute of the operation element.

The value attribute which can be found on most operations will always evaluate the value placed in it, whether it is an alias, an expression or a string.

#### Attributes

There is no specific syntax for operation element because different operations can have different attributes, thus different syntax.

### Attributes

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Any string value | The operation to use |
| `value` | string | string or expression | The data on which the operation should be performed. This value will always be evaluated |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation>*

---

## Process

The process element is the root element for all process documents (process markup objects).

#### Usage

This element has no required attributes, but the name attribute is highly recommended. The name must be unique as it is used as an identifier and two processes with the same name can't be active at the same time. If not set it will default to a generated value. The version attribute defines which *process* markup language version is used and defaults to "1.0". Like with the [View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) there are author and description attributes, in this case used only for internal purposes.

### Attributes

**Optional attributes**

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `author` | string | Any string value |  | Author of the document |
| `description` | string | Any string value |  | Document description |
| `name` | string | Any string value |  | The name of your process document |
| `step` | string | Any string value | start | What step to run immediately after load. Defaults to "start". |
| `version` | enumeration | 1.0 |  | Document version (personal use) |

It's also possible to write the process code in [JavaScript](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/javascript), instead of XML markup.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/process>*

---

## Steps

Steps are an important part of [XIOS/3 Application Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development). They act as logic clusters since they can contain several operations.

> **Note:** There are some simple rules and guidelines when it comes to steps.
> **1)** Each `step` `id` must be unique in a process markup document.
> **2)** If present, a `step` `id` called `"start"` will run as soon as the process code is loaded.
> **3)** Another `step` can be triggered using operations such as [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call) or [decision](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision).
> **4)** Catch errors using the optional attribute to call a conditional `step`. It is convenient to combine this with the success attribute and a step for what should happen next.
> **5)** A `step` is called when a defined event [triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers). It is common to define a trigger for the [Loaded](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/loaded) event, which will run as soon as the application view is loaded and the components in it can be referenced, or the [Opened](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/opened) event, when a view has opened and the UI is ready.
> **6)** Each `step` should focus on a single action or concept to keep instructions clear and easy to follow

### Attributes

#### Required Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `id` | string | Any string value | A step unique identifier |
| `name` | string | Any string value | An optional name which can act as a description for the step |

#### Optional Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `error` | string | Any string value | Id of step to call when error occurs while processing current step |
| `success` | string | Any string value | Id of step to call when current step is completed successfully |

**Step Syntax**

```xml
<step id="identifier" name="string">
  <operation name="enumeration" value="expression|string"/>
</step>
```

**Step example code** *(tested, runnable)*

```xml
<process name="applicationName" description="Logic for applicationName" author="XIOS/3">
  <step id="start" name="Initiate application">
    <alias name="fileName" value="home://Examples/view1.xml" model="global"/>
    <operation name="call" value="config"/>
  </step>

  <step id="config" name="Configure application" error="configError" success="configSuccess">
    <operation name="open" value="{$fileName}"/>
  </step>

  <step id="configError" name="Error - Alert">
    <operation name="debug" value="Failed to open: {$fileName}">alert:plain</operation>
  </step>

  <step id="configSuccess" name="Success - Continue">
    <operation name="debug" value="Config Success"/>
  </step>
</process>
```

#### Line 1

The line contains the process element, which is the root element of every process markup document.

#### Line 2

Our automatic start step element should have the id value start. When opening process documents and not supplying an id to start, it will assume that you want to start with step start or 1. We have named our step appropriately "Initiate application".

#### Line 3

This line contains the declaration of an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) element. In this form it works like a string variable.

#### Line 4

Here is a [call](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/call) operation. This means that it will start another step, in this case a step called `config`.

#### Line 7

This step is only triggered by the call from line 4. If it encounters an error it will call step `configError`, or alternatively if it works fine step `configSuccess` will be called.

#### Line 8

This operation is [open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/open), which will open our view document with the path that is defined in alias fileName in line 3. The curly brackets {} causes its content to first be evaluated. The $-sign indicates that it is a name of an alias.

#### Line 11

This step is only run if an error has occurred in step `config`.

#### Line 12

This line will show an alert (JavaScript style) and include the message in value="" using the [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug) operation.

#### Line 15

This step is only run if step `config` was successful.

#### Line 16

This line will make an output in the browser developer console and include the message in value="" using the [debug](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/debug) operation.
Here it acts as a placeholder and can be replaced with the code for what is to happen next.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps>*

---

## Triggers

Triggers are event listeners used to set up a event catcher; so when interaction is made in the view document (UI markup), for example a [Select](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/select) Event from a [button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button), these listeners will be activated and then execute a specified [Step](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) and all [Operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation) inside that Step. Triggers, Steps, and Operations are child elements of the [Process](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/process) element.

The Trigger is however also a data carrier (or more correctly a data pointer), that might contain information about the selection made in the UI. The Trigger-data is available by using the ! (exclamation mark) character and is XML-formatted.

Events can be made by the user in the form of [component events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), which are made when the user interacts with components. Users can also induce so called [view events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events) by using keyboard shortcuts while having he application selected. There are also [system events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events) which are made by the XIOS/3 system and are not application specific.


### Attributes

**Required attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `event` | string | Predefined event from component | Name of the event to listen for from the lists of [Component Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), [System Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events), [View Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events) |
| `step` | string | Any string value | Step id to execute |

**Optional attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `component` | string | Any string value | Name of component making event |
| `communicator` | string | Any string value | Name of communicator |
| `view` | string | Any string value | Name of view document where the event is originating from |

### Available Events

[Component Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), [System Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/system-events), [View Events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model/view-events)

### Syntax and Examples

**Syntax**

```xml
<trigger view="[string]" component="[string]" event="[string]" step="[string]"/>
```

**Example**

```xml
<?xml version="1.0"?>
<process name="calculator" description="Main process document for calculator">
  <trigger view="calculator" component="btn_Sum" event="Select" step="Summarize"/>
  <trigger view="calculator" component="btn_Add" event="Select" step="Addition"/>
  <trigger view="calculator" event="Ctrl+A" step="Addition"/>

  <step id="Addition" name="Perform addition">
    ...
  </step>
</process>
```

#### Related Topics

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers>*

---

## Using Expressions

This section provides you with an in-depth coverage of the XIOS/3 Expression Language, used primarily to allow for communication between components and data.

In the Definition below, and the following sections, we explain the primary use of the Expression Language and its importance in the Process markup language. We provide you with a series of easy-to-understand examples.

The expression language is built of small text based expressions compatible with XML syntax and may therefore be used in XML attributes and in between elements, as well as used in applications and from within different programming languages.

Using the expression language references to objects, documents or parts of document as well as mathematic operations are possible. The ability to reference object by name is especially useful in a Model View Controller (MVC) context. Thereby the exact location, position or pointer to the object is not needed.

It enables the user of the expression language to access objects without having to care about their type, attributes or actual implementation. Simply knowing the object's name and in which context it appears is sufficient. This feature of the expression language enables an unusual high degree of separation of presentation and logic and ultimately a very loosely coupled system.

All expressions always evaluate into either a reference to an XML data document (URL, Unique Resource Locator) paired with one or multiple xpath expressions (W3C) or to a text string. Expressions denoting documents can be further qualified by using xpath expressions.

As a developer, you are also allowed to use functions in the Expression language. A list of these can be found in the Functions chapter.

### Definition

XIOS/3 uses an expression language to allow for communication between components and data. The language is simple but powerful and is a very important part of application logic.

The syntax of an expression can be divided into two parts. The first part is a reference to XML data and can appear in several different ways. It can be a reference to a specific component, a variable containing data or a context data selection all of which we will explain in greater detail later. The second part of an Expression is an XPath expression which can be used to select data which is available in the first part of the Expression. In order to oversimplify we can say that the first part contains data while the second part, which is optional, is used to filter the data. Take a look at this expression:

- `#appView#appComponent`

The first expression only points to a component named *appComponent* which is located inside a view named *appView*. Here, we establish a fundamental rule: **when referring to a component we must also specify the name of the view hosting that component**. Basically, we need the full address of the component. Knowing this will help you better understand the Process markup language in its entirety.

#### Introductory Example

Assume we have XIOS/3 application, *MyApp*, with a user interface consisting of an input field, *input1*, and a button, *button1*. When a user clicks the button we want to find out what is entered into *input1*. To do so, we need to get a reference to the XML data document and XPath that *input1* is bound to, which would be written as `#MyApp#input1`.

If we need to get the actual (serialized) value, we would write `{#MyApp#input1}`, as this would go to the document, use any associated XPath in the expression and try to convert the resulting XML node into text. The curly brackets will tell the XIOS/3 Expression Engine that we are not interested in getting a reference to the Object but instead the actual Value of that Object.

If the only access we would like to have is to the application object, we could have written: `#MyApp`

#### Using XPath on Expressions

The W3C standard for XPath may be applied to Expressions. For example this Expression, qualified by using XPath,returns content of the *name* attribute as a serialized string:

- `{#MyApp#input1#@name}`

After a reference to either an object, variable or document an XPath expression may be applied to an Expression. The XPath starts after the last "#" character. If the XPath starts with a "/" it will be absolute and start from the root of the XML document which the Expression evaluates to. If it does not start with a "/", it will be applied relative to the current XPath binding of the object that the expression points to. If the Expression points to an XML document, the current XPath binding will be implied to be "/", i.e. the root of the XML document.

Example of an absolute XPath Expression:

- `{system.xml#/system/config}`

#### Another Basic Example

For the example below we use `#DE#folderTree`, which is a tree component in the view *DE*. (This example will reoccur in the following segments as well.)

To the *folderTree* component we bind XML data of a container structure (example 1). If no selection has been made in that component this Expression reference will return the entire XML document, since the selection is by default set to the root of the document. If a selection has been made (example 2); for example the first child element, then it and its children will be available instead. If the selection had been made on the *Pictures* container instead of the database named *home*, it would return the data in example 3.

**Example 1**

```xml
<db:result id="100" path="home://">
  <db:container name="Documents" id="200" path="home:/Documents/">
    <db:container name="Document" id="201" path="home:/Documents/Document/"/>
    <db:container name="Pictures" id="202" path="home:/Documents/Pictures/"/>
  </db:container>
  <db:container name="Applications" id="300" path="home:/Applications/"/>
</db:result>
```

Selection: `/db:result[1]` or `/` (root)

**Example 2**

```xml
<db:result name="Documents" id="200" path="home:/Documents/">
  <db:container name="Document" id="201" path="home:/Documents/Document/"/>
  <db:container name="Pictures" id="202" path="home:/Documents/Pictures/"/>
</db:result>
```

Selection: `/db:result[1]/db:container[1]` (first child of root)

**Example 3**

```xml
<db:container name="Pictures" id="202" path="home:/Documents/Pictures/"/>
```

Selection: `/db:result[1]/db:container[1]/db:container[2]` (second child of the first child of root)

If we instead would have used this Expression;

- `#DE#folderTree#@name`

In this Expression we use both parts; data and XPath. The second part of an Expression always starts with a hash-sign (#). Here, we request the name attribute of the selected element. To continue the examples above it would result in the following:

- Example 1: [none] (no name attribute)
- Example 2: Documents
- Example 3: Pictures

As you can see only a text value would be available compared to XML data when we did not append the XPath expression for selecting the name attribute.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions>*

---

## Binding Data Models

The meaning behind all events and expressions is to transmit data between components and objects and make components updated with data. It is all about controlling the flow of data within applications and since everything within XIOS/3 is XML, the flow can in the bottom line only be one thing - XML. Data models used inside XIOS/3 are thus the reason that the meaning and interpretation of expressions sometimes needs to be slightly different than the default interpretation. They can be said to provide a context for the expressions to work in.

Among the instructions in the process language, only a few support data models. The following examples show where it can be applied.

**Different uses of data model attribute** *(fragment)*

```xml
<operation name="bind" value="#BSC#perfList">
  <component application="BSC" name="meeters" model="clone"/>
</operation>

<operation name="debug" value="{#System#DocGrid#@href}">alert</operation>

<alias name="dataFile" value="data/XcerionBSC.xml" model="value"/>

<operation name="change" value="#BSC#bscTree">
  <store type="replace" model="data">
    <scorecard name="New"/>
  </store>
</operation>
```

The above example shows the four ways where model can be applied. Please note that the debug operation requires the alert to be specified as a child text node. This is because the name and value attributes are the only allowed attributes on operations.

All the models are explained in the following table.

| Model | Explanation |
|---|---|
| Default | If model is not specified, the default model is used. If the expression belongs to an object, the object may have its data document narrowed by an xpath expression, set when the object first got populated with data. Referring to that object will therefore yield the same data as the object can see and not necessarily the complete data document. In addition, if the object employs a selection model, the data will be further narrowed by the selection and only return what is selected. If a node in a tree component is selected, referring to, for instance `#BSC#bscTree`, it will then yield the selected node and not the complete data document in the tree. |
| Data | Use this model if you only are after the expressions XML document and not the objects xpath and selections models. If used together with `#BSC#bscTree`, it will yield the complete XML document from the root. However, the tree may have the document narrowed by an xpath, so it may be a larger document than shown in the tree. |
| Clone | This is the most complex model. The data state of the object pointed to by the incoming expression is cloned into the receiving component. This model may therefore only be used together with the bind operation. The data document, the objects xpath and the objects selection model is cloned into the receiving component. It can for instance be used to keep two tree components show and select the same nodes whenever one of the trees is selected. Cloning does not enforce any binding upon the objects, the cloning is only performed while data is populated. To make the trees reflect each others, additional triggers and steps are required. It is not done automatically through the clone model. |
| Bind | Works as Clone, but automatically keeps the object's selection model the same (not implemented yet). |
| Value | This model may only be used on the alias element and makes is possible to store a string value and use the alias as an variable. |

Working with data models in XIOS/3 is a very powerful tool and can together with expressions handle almost any situation with data interconnectivity between components that can be done with XML. The most important aspect of working with XIOS/3 Expressions is to know what the objects that you refer to in the expressions are populated with and their narrowing of data with the xpath in the select attribute of populate data. The last example show how to dynamically build a reference string to an application object.

**Dynamically figuring out the name of the application to call a method on** *(fragment)*

```xml
<alias name="application" value="{#System#AppGrid#@name}" model="value"/>
<operation name="callMethod" value="#{$application}">
 <method name="update"/>
</operation>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/binding-data-models>*

---

## Calling Methods

The Expression language also supports the usage of methods which can be applied on the data.

- `{#view1#component1.getvalue()}`

Here we apply the getValue method on a component called *component1* which is located in the view1. We also use curly brackets to convert the value in to a string.

Since most objects also has got methods, which often return data that sometimes may be useful to incorporate to the dynamic building of expression or for making actions happen, the following syntax may be employed:

- `#app.maximize()`
- `#app#comp.clear()`
- `#app#{#app#comp.getName()}`

In the above example, a recursive expression is used to dynamically fetch the name of a component and insert it into the main expression with the help of the `getName()` method call.

Method calls may not be combined with xpath expression evaluation.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/calling-methods>*

---

## Event Propagation

Events in XIOS/3 may start by user interaction or be system initiated. However, all events will have an XML document bound to them and a source object that caused them. Mainly in the context of programming processes in XIOS/3, the events will be created by a graphical user interface component, an application or by a channel communicator.

All events in processes stem from triggers, the following table shows how to use triggers to hook up to different objects.

| Event Trigger | Explanation |
|---|---|
| `<trigger application="System" component="ProcGrid" event="Select" step="12"/>` | Adds a trigger to the ProcGrid component in the System application. If an event occurs, process step 12 will have an incoming trigger corresponding to the ProcGrid component and its selection model. |
| `<trigger application="Sale2023" event="Close" step="8"/>` | Here the trigger is connected directly to an application and it listens to the close event. The trigger will be the application and the XML document representing the application. |
| `<trigger communicator="xios" event="Login" step="3"/>` | This trigger listens directly to the communication channel xios. The trigger will consist of the document containing settings for the channel. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/event-propagation>*

---

## Examples

The following table shows the basic syntax that may be used with the XIOS/3 expressions. Expressions yield mostly document hypertext references (href) with a selection model (consisting of one or more XPath expressions) or a string value.

| Expression | Explanation |
|---|---|
| `!` | Retrieves the data from an emitting object. Emitting objects can be components, applications, channels or documents. The result from a trigger is mostly an XML document and a selection model. |
| `#application#component` | Accesses the data document, base xpath expression for the component and its selection model. The default action is that the data selected in the component is returned by the expression. |
| `$name` | Retrieves data from an alias, where name is the name of the alias. Aliases can be either events or strings. If no alias is found, it will fetch the URL parameter. |
| `#xpath` `#/xpath` | Allows the use of xpath inside expressions. If started with a / it performs the xpath expression at from the root element of the XML document. If no starting / is provided, the xpath expression will be performed relative to the current selection on the XML document. |
| `channel://URI` | XIOS/3 communication channels with their URI may be used to access channel resources. |
| URL | Any valid URL can be used as an expression to access documents and resources over the Internet. |

As can be seen in the above table, XIOS/3 Expressions offer great versatility. It combines the best of object model access, XPath evaluation, XLinks and XML Web Service integration in one language. The language is designed to be as similar to XPath as possible. All of the examples below are in the context of the value attribute in an operation.

**Expressions may always be used in the value attribute**

```xml
<operation name="name" value="expression"/>
```

| Expression | Explanation |
|---|---|
| `{#System#ProcGrid#@href}` | The ProcGrid component in the system application is asked for its data document and selection model. Using the first found selection as the context, the xpath expression @href is applied. The above operation yields a string value (the href), which is used as the data document for the operation. |
| `{#System#ProcGrid}#@href` | This is an incorrect expression, but it will work in this context. The ProcGrid will become the current context and then will the xpath expression be applied. It will not work with chained expressions and it is slower than the above example. |
| `{!}` | If the incoming trigger is, for instance, set to `#System#ProcGrid#@href`, the value of the href is resolved and replaced by the expression. Triggers caused by component events are resolved in the same manner, and if the component points to an href, like for instance the icon component, it will have the same effect as the first case. |
| `$session` | Retrieves data from the URL parameters session, entered when XIOS/3 started. |
| `main://catalog` | Request catalog from the main database, which will yield an XML document containing the catalog. |
| `main://invoice/2024-01` | Retrieves the 2024-01 document in the invoice container on the main database. |
| `main://{$container#@id}` | Retrieves the directory as an XML document for the database container pointed to by the `$container` alias. Please note that the `id` attribute is retrieved from the node that the container alias points to. |
| `main://{$container#@id}/{#DE#listView#document}` | As the previous example, an alias is used to point out the container and a second expression is then used to point of the object name to retrieve from the container. The expression `#DE#listView#document` retrieves the current selection in the `listView` component and uses the current selection as a context node to retrieve the child element document, which contains the object name. After all expressions have been resolved, the string will correspond to a URL, which is used by the value attribute of the operation and loaded. |

Events traveling through XIOS/3 may get transformed on their way. It is therefore important to learn which process operations that alter the event as it gets propagated. The operations; `decision`, `firstSibling`, `lastSibling`, `precedingSibling` and `followingSibling` changes the trigger for its called steps to be the expression found in its value. The selection model may also be altered by the operation. If the operation startProcess has a child element called trigger with a value attribute, it may also alter the trigger for the new started process.

### More Example Expressions

| Expression | Explanation |
|---|---|
| `count($foo#/*/*)` | Looks up the value of the foo variable and then index that document with the XPath `/*/*` which lists all elements below the root node. Finally, the count function counts the number of nodes, so the result of this expression is a number. |
| `local-name(#app#comp)` | Looks up the data associated to the component named "comp" in the view named "app". The local-name function then returns the name of the selected element without any namespace prefix. |
| `config/system.xml#/*/@title` | Selects the value from the title attribute of the root node of the config/system.xml document. |
| `$paper#@href` | Takes the XML node stored in the "paper" alias and takes the value of the href attribute from that node. |
| `$date` | The date variable is a predefined variable that always expands into the current date. |
| `$time` | The time variable is a predefined variable that always expands into the current time. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/examples>*

---

## Fetching Data

The simplest form of an expression is the same as an URL:

- `system.xml`
- `http://www.site.com/document.xml`

Expressions can also be used in conjunction with external XML data documents. Since the first part of an Expression is data we can therefore just replace the reference to the component and substitute it with an URL to a XML document like such;

- `http://www.site.com/documents/myfile.xml#/document[1]/chapter[1]/@title`

In this Expression, the data is the XML contained in the document that the URL points to. The hash # character is used to tell where the xpath expression starts and we are extracting the *title* of the first chapter. As you can see the XPath expression starts with a slash, which means that it starts at the root element.

Compared to traditional links on the Internet, the expression allows us to make more precise references to parts of XML resources as opposed to reference a full document like a traditional link on the Internet.

Another example could be `http://www.site.com/book.xml#/book/chapter[2]/paragraph[3]`, pointing to the third *paragraph* child of the second element *chapter* from the root element *book* in the XML document *book.xml*.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/fetching-data>*

---

## Functions

The expression language contains many functions to be used within and applied on expressions. A complete list can be found in the reference manual, functions.

- `count($employeeDB#/employees/employee)` - Counts the number of employees in the XML document referenced by the variable. The count functions counts how many XML nodes the xpath expression results in.
- `local-name($employeeDB#/employees/*)` - Local-name return the element name of the XML node that the expression points to.
- `xml($myDoc)` - Serializes any XML document into a text string containing the XML.

The examples above show the use of three different functions; `count()`, `local-name()`, and `xml()`.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/functions>*

---

## Maths

Expressions may also be used in mathematical contexts if they start with a `=` character:

- `=34 + 12`
- `={$alias} - 23`
- `={#myApp#comp#@value} * {#myApp#comp2#@count} / 2`

Operators available are: *, /, +, -, (, ), **, %

Mathematical Expressions may also as seen in the above example contain recursive calls to other Expressions. The recursively called expressions may in turn use functions, XPath or any other feature of the Expression language.

### Examples

The first example shows how to make calculations on string representation of numbers.

The second example shows rounding of a decimal number, e.g., rounded amount with two decimals.

**Calculations and Maths operators.** *(tested, fragment)*

```xml
<alias name="pageOffset" value="0"/>
<alias name="pageCount" value="100"/>
<alias name="quantity" value="3"/>
<alias name="unitPrice" value="4.25"/>
<alias name="sum" value="30"/>
<alias name="counted" value="5"/>
<alias name="power" value="3"/>
<alias name="identitiesStart" value="={$pageOffset} + 1"/>
<alias name="identitiesEnd" value="={$pageOffset} + {$pageCount}"/>
<alias name="counted" value="={$counted} - 1"/>
<alias name="totalPrice" value="={$quantity} * {$unitPrice}"/>
<alias name="exponentiation" value="={$counted} ** {$power}"/>
<alias name="average" value="={{$sum} / {$counted}}"/>
<alias name="modulus" value="={{$sum} % {$counted}}"/> 
```

**Rounding decimal numbers to two digits.** *(tested, fragment)*

```xml
<alias name="decimals" value="={5555 / 3}"/>
<alias name="rounded2decimals" value="{substring({={{$decimals} + 0.005}}, 'endString:.', 'endOffset:3')}"/> 
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/maths>*

---

## Processes

From the sections above you have learned that XIOS/3 expressions can be used in attributes and in plain text. Some attributes parses its contents by default, like the value attribute used on operations, but most attributes requires expressions to be enclosed within brackets `{ }`. These brackets may also be used within text nodes. Bracket expressions always have precedence.

**Executing expressions within text and attributes using { }**

```xml
<operation name="change" value="!">
  <store select="/calendar" type="append">
    <appointment date="{#Calendar#Date}" time="{$time}">
      {#Calendar#Description}
    </appointment>
  </store>
</operation>
```

The above example shows the trigger expressions, which gets evaluated by default through the value attribute and the use of component expressions to fetch atomic data from components. Brackets expressions cannot be nested inside another bracket expression. However, multiple bracket expressions may appear sequentially within the same attribute value.

XIOS/3 only communicates with two types of data; **Xbind** events and string values. All expressions will always result in one of the two. Xbind events in turn consists of an object, a base, and a selection model.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/processes>*

---

## Recursive Expressions

Expressions may also be recursive, for example `#{InnerExpression}#Comp`, will first evaluate InnerExpression and then the outer expression. Recursion is endless and hence the following expression is also valid:

- `#app{nr{contex.xml#/apps/*[last()]/@id}}#input1`

Recursive expressions work with the braces as with parenthesis in mathematics, the inner braces are evaluated first to become in data to the outer expressions.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/recursive-expressions>*

---

## Serializing

Expressions can be converted in to string by placing them between curly brackets. It is good practice to do so whenever you are expecting a string value to be passed from your Expression. This makes it possible to aggregate several Expressions to form a large string, or combine it with text to do the same.

- Name: `{#DE#folderTree#@name}` ID: `{#DE#folderTree#@id}`

Expression can also be aggregated to form a string when combined with other text and placed inside curly brackets that will convert the value in to a string.

- Example 1: Name: ID: 100.
- Example 2: Name: Documents ID: 200.
- Example 3: Name: Pictures ID: 202.

> **Note** Please find the source data for example 1-3 [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/serializing>*

---

## Triggers (Events)

Triggers are a special type of aliases (variables) set by the system and not possible to change the value of using the `alias` element in the process language. The special character assigned to triggers is made on purpose, similar to how *this* is available inside JavaScript functions, the `!` trigger contains the incoming event and context for the current executing `step` in the process language.

The contents of the trigger is only guaranteed for the *direct* child elements of the `step` process instruction. Process operations located inside other process operations like [`foreach`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/foreach) or [`decision`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision) will have a new event context set in the `!` trigger alias, since we **are** in fact operating in a new context.

If you need to use the trigger further down in the process code or at a hierarchical depth, you can store the trigger in an alias with any name like the following example:

`<alias name="myTrigger" value="!"/>`

This is the syntax on how to use a trigger:

- `!`
- `!#XPath-Expression`

- `!#@name`

With triggers (context data) we use the exclamation mark `!` to obtain the data referenced by the trigger (originating from the emitting event that made the process step called). When no event has called the step or no context exists (like with the `foreach` process operation), the trigger will not contain anything. It is still safe to use, it will however not yield anything.

- Example: Pictures

> **Note** Please find the source data for the example here: [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

### More Trigger Expressions

All the expressions below require that the *process step* they are used within was called by a trigger event, caused by the `<trigger view="" component="" event="" step=""/>`, this will make the `!` trigger associated with an **UI** component object. The possible expressions depend on if the UI component is *bound* to any data using the `bind` process operation and in the case of parameters or methods, which functionality the particular UI component has chosen to make publicly available.

> **Note:** It is recommended to primarily see the trigger as a reference to an object that is an XML document and use it to apply XPath expressions on or bind to other objects. Calling methods on the object or accessing parameters should be avoided as much as possible.

- `!`
- `!.clear()`
- `!.id`
- `!#@href`
- `!#/config/include`

Trigger expressions evaluates like all other expression to either a reference to an event, an object (XML document) and an XPath selection, or to a serialized string. Depending on the type of trigger, different operations on the trigger `!` (contextual) operator may be possible.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/triggers-events>*

---

## Variables

As mentioned earlier in this chapter, the first part of an Expression can be presented in the form of a variable or in the form of a trigger. It might look like this:

- `#view1#component#XPath-Expression`
- `Alias#XPath-Expression`

- `#help#grid#@name`
- `$treeData#@name`

Here we assume that the variable `$treeData` contains the same information as `#DE#folderTree`. Also, note that a hash-sign `#` is used to separate the data from the XPath, just like in the previous examples.

- Example 1: [none] (name attribute does not exist)
- Example 2: Documents

> **Note** Please find the source data for example 1-3 [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/variables>*

---

## Xbinds

A common problem in traditional application development is how to standardize objects input and output data structures. Usually, a programmer will construct a large amount of objects, some with visual representation (UI components), some invisible working on data in the background. These objects often need to interact with each other in order for the application to be useful. However, as most programmers know, object's data structures tend to are seldom compatible with each other.

For example, the underlying data structure of a visual tree is quite different from that of a text input field. In such a case, a programmer must manually describe how each object shall interact with all other objects it needs to interact with. Unfortunately, this job becomes very tedious as the complexity of object communication grows exponentially for every object type added to an application. Furthermore, often times, a developer might want to reuse an object created for a previous application just to discover that this objects data structure and I/O APIs are too different from the current project.

The foundation of Xbinds are the XIOS/3 expressions, which are then bound to UI components, communication channels, and views of the system. Xbinds also flow through the events of the system.

### Xbinds

Xbinds provides a standardized way for XML based applications to communicate, store, and describe its current state. Xbinds enables any object, regardless of whether it is a graphical object or a data object, to communicate with other objects within an application. This is achieved by decoupling an object's internal workings, and if relevant its graphical representation, from its current state. The objects state is instead described with the Xbind. An Xbind consists of three parts:

1. `Object` - A URL (Unique Resource Locator) pointing to an XML document over HTTP or other URL protocols.
2. `Base` - An XPath expression as defined by W3C describing the base path of the Xbind. A base path points out a subset of data, fulfilling the match parameters provided, within an XML document. This subset becomes a virtual root unique to each Xbind and makes other parts of the XML document inaccessible to the user of the Xbind. This is achieved without altering or removing anything from the original XML document.
3. `Selection` - An array of XPath expressions describing a possible selection of elements in the XML document. Selections must always start with the base path (no XML may be selected outside the fragment defined in the base path). Selections are a kind of state information. It is allowed for Xbind to have no selection..

Some example Xbind expression might serve to illustrate the benefits.

The following Xbind expression makes a reference to an XML document, `article.xml`, in its entirety, without making use of the "filter"� mechanisms of XPath. Furthermore, no specific part of `article.xml` is selected. This Xbind could be bound to an object and thereby specifying the object's data and state. For example, if this Xbind expression was bound to a tree component, that tree would display the entire `article.xml` document in a tree with no selections made.

- Object = `article.xml`
- Base = `/`
- Selection = `[XPath, ..., XPath N]`

If a user would then select a specific section within the article, the tree component will update the Xbind expression by specifying what selection has been made. The new Xbind expression might look like this:

- Object = `article.xml`
- Base = `/`
- Selection = `/article/section[2]`

Another example of a Xbind expression is:

- Object = `database.xml`
- Base = `/database/tables/table[1]/row[23]`
- Selection = `/database/tables/table[1]/row[23]/id,`
- `/database/tables/table[1]/row[23]/name,`
- `/database/tables/table[1]/row[23]/type`

This expression refers to `database.xml`, limiting the scope of the Xbind to row 23 (...row[23]), and indicating that `id`, `name` and `type` are selected. Again, this Xbind could be bound to any type of object, for instance a grid component.

#### Usage of Xbind

In general, there are infinite number of applications of Xbinds. The following is a short list:

- **Binding data to an object**
  Xbinds can be used to bind data to objects. Once bound, Xbinds can change the visualization of an XML document by simply applying the same Xbind to different objects. For example, an XML document that represents the container structure of a database could be displayed as a tree when bound to a tree component. At the same time, the same Xbind could be applied to a list display object that would list the containers as a simple list. In this example, the Object will point to the XML document, Base to the part of the XML document describing the container hierarchy and the Selection will contain the XPath expressions to all selected containers.
- **New ways of linking information on the internet, links pointing to both selections and fragments of XML documents**
  Xbinds could also be used to provide intelligent links to XML documents, no matter where they are located. For example, the following Xbind expression points out *article.xml* residing on a web server. It furthermore specifies that only section two of the article should be accessible and that paragraph 3 and 5 (..p[3] and .. p[5]), are selected.
  Object = `http://www.mydomain.com/article.xml`
  Base = `/article/section[2]`
  Selection = `/article/section[2]/p[3], /article/section[2]/p[5]`
- **Could be used for messaging busses, event busses**
  Xbinds could be used as an interface between different parts of an XML based system. For example, a graphical component described in XML can bind to another component by just transferring its Xbind, which in turn will also transfer that components state.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions/xbinds>*

---
