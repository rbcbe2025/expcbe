# Datatypes in depth

Defining datatypes (schemas): the XML format, key/value extraction and indexing, and how a datatype attached to a container turns it into a table.

17 topics from the published CloudBackend documentation, generated on 2026-10-15. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [XML format](#xml-format)
- [Understanding the XML format of a datatype](#understanding-the-xml-format-of-a-datatype)
- [Minimal structure of the datatype document](#minimal-structure-of-the-datatype-document)
- [Element: type](#element-type)
- [Element: action](#element-action)
- [Element: description](#element-description)
- [Element: edit](#element-edit)
- [Element: ext](#element-ext)
- [Element: icon](#element-icon)
- [Element: index](#element-index)
- [Element: list](#element-list)
- [Element: listviews](#element-listviews)
- [Element: mime](#element-mime)
- [Element: open](#element-open)
- [Element: preview](#element-preview)
- [Element: search](#element-search)
- [Element: template](#element-template)

## XML format

This topic is split into 16 parts, listed in reading order.

1. [Understanding the XML format of a datatype](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/01-understanding-the-xml-format-of-a-datatype) · ~520 tokens
2. [Minimal structure of the datatype document](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/02-minimal-structure-of-the-datatype-document) · ~413 tokens
3. [Element: type](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/03-element-type) · ~570 tokens
4. [Element: action](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/04-element-action) · ~340 tokens
5. [Element: description](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/05-element-description) · ~55 tokens
6. [Element: edit](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/06-element-edit) · ~272 tokens
7. [Element: ext](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/07-element-ext) · ~73 tokens
8. [Element: icon](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/08-element-icon) · ~91 tokens
9. [Element: index](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/09-element-index) · ~585 tokens
10. [Element: list](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/10-element-list) · ~869 tokens
11. [Element: listviews](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/11-element-listviews) · ~163 tokens
12. [Element: mime](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/12-element-mime) · ~71 tokens
13. [Element: open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/13-element-open) · ~317 tokens
14. [Element: preview](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/14-element-preview) · ~87 tokens
15. [Element: search](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/15-element-search) · ~121 tokens
16. [Element: template](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/16-element-template) · ~165 tokens

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format>*

---

## Understanding the XML format of a datatype

Datatypes are stored in a XML document format, where every datatype is represented by one XML document. The `Datatypes` section of the database provides a graphical UI to edit these files, but they may also be edited directly in XML. If a datatype is selected by right click, edit is available in the menu, which will open the `CodePad` application to edit it. Please note that datatypes always shall have the file extension `.xdt`.

> **Note:** Always make sure the XML document is well-formed and valid before saving a datatype, otherwise the datatype will be broken and not active. CodePad indicates at the bottom status bar if the document is valid or not.

Matching and **meta-data extraction** related to datatypes are performed both on the SDK and in the cloud for the database, however, the cloud will only process datatypes stored under the `tenant` database and this location: `tenant://Settings/Datatypes`. In addition to this, the SDK may process datatypes installed with applications for a specific identity, but they only then do meta-data extraction on the client-side.

**Example datatype definition for custom XML document object**

```xml
<?xml version="1.0" encoding="utf-8"?>

<type name="Scorecard" mime="text/xml" element="scorecard" xmlns="https://cloudbackend.com/datatype.xsd">
  <description>Balanced Scorecard</description>
  <open id="mediate.bsc" icon="icon://gauge" name="Balanced Scorecard">tenant://Applications/bscapp.xml</open>
  <edit id="xios3.codepad" icon="icon://xml_editor" name="CodePad">xios/apps/codepad/codepad.xml</edit>
  <preview>tenant://Previews/bsc.xsl</preview>
  <icon>icon://gauge</icon>
  <listviews/>
  <search>@name</search>
</type>
```

Editing datatypes in XML is only recommended for advanced users and people familiar with XML. A comprehensive manual for XML is available within the database documentation by clicking the box below.

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink that are used by CloudBackend. *(XML)*

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/01-understanding-the-xml-format-of-a-datatype>*

---

## Minimal structure of the datatype document

All datatypes have a `type` element as its root element. They are also required to declare the `https://cloudbackend.com/datatype.xsd` namespace as an implicit namespace. An implicit namespace, is a namespace without a prefix like for instance `xsl:` defined. This means that all the elements and attributes of the datatype document belong to this namespace, even though they look like elements without a namespace.

> **Note:** It is possible to declare the namespace as explicit with a prefix, but it is not recommended as it makes it harder to read the datatype document.

The following is the minimum required declaration of a datatype. It is however recommended to add as much detail to the datatype as possible for clarity and making sure the datatype is not conflicting with another datatype definition (improving its matching).

**Minimum datatype declaration**

```xml
<?xml version="1.0" encoding="utf-8"?>

<type xmlns="https://cloudbackend.com/datatype.xsd" name="XML Document" mime="text/xml"/>
```

The above datatype has a few problems, it will conflict with other datatypes that are of the mime-type of `text/xml`, it does not provide a description, icon, or tell the database how to open or edit the object. For example, it would conflict with the `scorecard` datatype shown in the above example, however since the `scorecard` datatype have more details defined, any object that is a XML document and has the root element of `scorecard`, will instead match that datatype.

> **Tip:** The more specific the datatype describes the object it is supposed to match, the better the database will be to match the right object with the datatype.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/02-minimal-structure-of-the-datatype-document>*

---

## Element: type

All datatypes have a `type` element as its root element. They are also required to declare the `https://cloudbackend.com/datatype.xsd` namespace as an implicit namespace. An implicit namespace, is a namespace without a prefix like for instance `xsl:` defined. This means that all the elements and attributes of the datatype document belong to this namespace, even though they look like elements without a namespace.

#### Element Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | unique name | The name of the datatype |
| `alias` | string | unique secondary name | A secondary name of the datatype |
| `mime` | mime type | URI | The main mime type of objects matching the datatype, secondary mime types may be defined using the `mime` child element. |
| `element` | string | the root element of an object | Match datatype based on the root element of an object. This feature only applies to objects that are XML documents. |
| `namespace` | string | the defined namespace of an object | Match datatype based on the set namespace of the root element of an object. Using the namespace of the root element is considerably improving the matching capability compared to only matching using the root element name. This feature only applies to objects that are XML documents. |
| `xmlns` | namespace | declaration of the datatype document namespace | This attribute is used to declare the mandatory namespace of the datatype XML document and has nothing to do with the matching of objects that the datatype should apply to. It always need to be set to the following value: `https://cloudbackend.com/datatype.xsd`, if set to any other value, the datatype is invalid and will be ignored by the database. |

#### Child Elements

The following list of elements are allowed to be **child** elements of the `type` element. If `(*)` is displayed after the element name, it means that the element may occur an unlimited number of times as a child element to the `type` element. Id `(/)` is displayed after, it means that the element may be empty.

- action (*)
- description
- edit
- ext (*)
- icon
- index (/)
- list (/)
- listviews (/)
- mime (*)
- open
- preview
- search

Each of these available elements will be described in the following sections.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/03-element-type>*

---

## Element: action

The [`action`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/action) element may be used an unlimited number of times as a child element. It defines actions available in the right click context menu of `Database Explorer` to work with an object that match the datatype.

#### Element Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `text` | string | name of the action in context menus | Required, as this defines the menu item name to be selected to invoke the action. |
| `icon` | URL | icon path URL (optional) | Specify an icon with its specific path or using the `icon://` protocol. |
| `mode` | string | parameter passed through an alias to application (optional) | Sets an incoming `alias` in the called application with the value set in the `mode` attribute, if set to for instance a value `reply`, accessing the alias `$mode` would return "reply". |

#### Child Elements

None.

**Example**

```xml
<action text="Compose Mail" icon="icon://mail_write" mode="new">apps/productivity/mail/compose.xml</action>
<action text="Reply" icon="icon://mail_reply" mode="reply">apps/productivity/mail/compose.xml</action>
<action text="Reply All" icon="icon://mail_replay_all" mode="replyAll">apps/productivity/mail/compose.xml</action>
<action text="Forward" icon="icon://mail_forward" mode="forward">apps/productivity/mail/compose.xml</action>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/04-element-action>*

---

## Element: description

Describe as short as possible the purpose of the datatype and the type of objects it is defined for.

#### Element Attributes

None.

#### Child Elements

None.

**Example**

```xml
<description>Contact Card</description>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/05-element-description>*

---

## Element: edit

Defines the default **edit** action when selecting edit in the right click context menu of an selected object in `Database Explorer`. This should link to a custom application created for working with objects that match the datatype. If no custom application is available, the edit action may instead by pointing to the `CodePad` as shown in the example below.

#### Element Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | name | Name of application used for editing. |
| `icon` | URL | icon path URL (optional) | Specify an icon with its specific path or using the `icon://` protocol. |
| `id` | string | marketplace ID of application (optional) | Specify the ID of a published application on the marketplace. If you do not have a marketplace published application, omit using this attribute. |

#### Child Elements

None, but the content of the element is the path to the application to invoke for the `edit` action.

**Example**

```xml
<edit id="xios3.codepad" icon="icon://xml_editor" name="CodePad">xios/apps/codepad/codepad.xml</edit>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/06-element-edit>*

---

## Element: ext

The `ext` element may be used an unlimited number of times as a child element. It defines the possible object file extensions matching that should render a match with the datatype.

#### Element Attributes

None.

#### Child Elements

None.

**Example**

```xml
<ext>xsl</ext>
<ext>xslt</ext>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/07-element-ext>*

---

## Element: icon

Specifies the datatype icon with its specific path or using the `icon://` protocol. It is always recommended to define an icon for any datatype created as it will help `Database Explorer` to adequately visualize objects of that are of the datatype.

#### Element Attributes

None.

#### Child Elements

None.

**Example**

```xml
<icon>icon://document_xsl</icon>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/08-element-icon>*

---

## Element: index

Container element to hold additional child elements defining how **meta-data extraction** should be applied to objects that are XML documents. This means that the `index` element and its possible child elements, only may be used on XML documents.

#### Element Attributes

None.

#### Child Elements

The `index` elements have `key` elements as children. Each `key` element defines a `key/value` to automatically extract from the source object that matches the datatype whenever the object is saved or updated.

The `key` element has one mandatory attributes; `name`, and then either `xpath` or `value` is required. Name defines a name of the key without any spaces or special characters in the name (use same naming convention that applies to element names in the XML standard). The xpath defines the xpath used to go into the source object and locate the `value` to be stored under the key. The value attribute is a static value that always become assigned to the key in the meta data for objects of the datatype.

There also is an optional attribute `index`, that default is set to **true** if not declared. This means that all keys are **indexed** by default. If you do not want to index a key and save space in the database, then set the attribute to false, i.e. `index="false"`.

There is also the possibility to use XML elements as child nodes to the `key` element, this should however be avoided as much as possible. It is good practice to keep the value of the key/value to be only a text string.

> **Note:** Use key/values for quick lookup of things in objects without the need to having to open the object to retrieve the data, but rather have access to the key/value directly in search query results or when listing the contents of a container. Please note that key/values take up space in the database, so do not use more keys than absolutely necessary and turn index off if not needed. If all information in an object are extracted as keys, something is wrong with the database design.

**Example**

```xml
<index>
  <key name="desc" xpath="/priceplan/@summary" />
  <key name="amount" xpath="/priceplan/@amount" />
  <key name="included" index="false" xpath="/priceplan/included/@list" />
  <key name="pricemonthly" xpath="/priceplan/price/@monthly" />
  <key name="priceannual" xpath="/priceplan/price/@annual" />
</index>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/09-element-index>*

---

## Element: list

The [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/list) element defines how objects belonging to the datatype should be rendered in `Database Explorer` when its view is set to **custom**. This makes it possible to have the database display for instance invoice objects in a container in a way that makes the database look more like an invoicing software than a database.

Do not use [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/list) element in combination with the [`listview`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/listview) element, as only one way to render listings may be used for the datatype.

#### Element Attributes

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `folders` | boolean | true, false | true | Display sub-container (folders) in the container listing. |
| `height` | string | auto, default, [height in pixels] |  | Specifies the height of each object in the listing. |
| `button` | string |  |  | Specifies the name of custom button displayed in listing. |
| `sort` | string | ascending, descending | ascending | How should objects of the datatype be sorted, ascending or descending, based on the defined sort key. |
| `match` | xpath | xpath expression to match object key/value with |  | For each object in the result for the container, the `match` expression will be tested and if true, the object will be displayed in the listing. |
| `camera` | boolean | true, false | true | Allow camera upload to the container or not. |
| `alphabet` | boolean | true, false | false | Show alphabet in list for faster selection. |

#### Child Elements

The [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/list) element is complex and allow several types of child element, of which some in turn have the ability to have child elements. The three examples below illustrates how it can be used.

The header child elements `h1`, `h2`, `h3`, and `h4` control text display items for different layouts rendering a list of objects of the given datatype. One UI component particularly makes use of this feature, please see `filelist` for more information. Please note that all available layouts for the `filelist` component will not make use of all headers, some may only use h1 and h2, while others use h1, h2, and h3. The use of h4 is uncommon.

**Example 1**

```xml
<list folders="false" height="auto" button="detail" sort="ascending" match="@name" camera="false">
  <new clickLabel="Add new task" xpathFile="/vtodo/summary" filename="auto"/>
  <checkbox xpath="completed" checked="TIMESTAMP" not="" xpathFile="/vtodo/completed"/>
  <h1 xpath="summary"/>
</list>
```

**Example 2**

```xml
<list folders="false" height="auto" button="indicator" alphabet="true" sort="ascending" match="firstname | nickname" camera="false">
  <search clickLabel="Search Contacts">
    <criteria name="Name" xpath="firstname | lastname"/>
    <criteria name="Email" xpath="homemail | businessmail"/>
    <criteria name="City" xpath="homecity"/>
  </search>
  <image xpath="photo" height="48" width="48"/>
  <h1 xpath="concat(firstname, ' ', lastname)" pattern="%1 %2">
    <xpath>firstname</xpath>
    <xpath>lastname</xpath>
  </h1>
  <h2 xpath="homemail | businessmail"/>
</list>
```

**Example 3**

```xml
<list folders="false" height="default" button="indicator" sort="descending" match="@published" camera="false">
  <flag xpath="read" checked="read" not="read"/>
  <h1 xpath="author"/>
  <h2 xpath="s1"/>
  <h3 xpath="@published" type="datetime"/>
</list>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/10-element-list>*

---

## Element: listviews

Path to custom listview XSL documents used to render a container with objects only belonging to this datatype and with its schema set to this datatype. Do not use `listviews` in combination with the [`list`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/list) element, as only one way to render listings may be used for the datatype.

#### Element Attributes

None.

#### Child Elements

The `listviews` element is a container element holding [`listview`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/listview) child elements that have a text value pointing to the XSL.

**Example**

```xml
<listviews>
  <listview>tenant://Listviews/myListview.xsl</listview>
</listviews>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/11-element-listviews>*

---

## Element: mime

The `mime` element may be used an unlimited number of times as a child element. It defines secondary mime types that in **addition** to the primary mime type matches the datatype.

#### Element Attributes

None.

#### Child Elements

None.

**Example**

```xml
<mime>image/x-png</mime>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/12-element-mime>*

---

## Element: open

Defines the default **open** action when selecting open in the right click context menu of an selected object or double clicking on the object in `Database Explorer`. This should link to a custom application created for working with objects that match the datatype. If no custom application is available, the open action may instead by pointing to the `CodePad`.

#### Element Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | name | Name of application used for editing. |
| `supersearch` | string | short name | Name of application as search term to be used in the `supersearch` application extension (optional) and only available when `supersearch` is available. |
| `icon` | URL | icon path URL (optional) | Specify an icon with its specific path or using the `icon://` protocol. |
| `id` | string | marketplace ID of application (optional) | Specify the ID of a published application on the marketplace. If you do not have a marketplace published application, omit using this attribute. |

#### Child Elements

None, but the content of the element is the path to the application to invoke for the `edit` action.

**Example**

```xml
<open icon="icon://document_zoom_in" name="Notepad">xios/apps/system/viewer.xml</open>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/13-element-open>*

---

## Element: preview

Enables the definition of a XSL that should be used to render the datatype if the system is asked to preview an object belonging to the datatype. This feature is only available for objects that are XML documents.

#### Element Attributes

None.

#### Child Elements

None.

**Example**

```xml
<preview>xios/apps/system/layout/treeview.xsl</preview>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/14-element-preview>*

---

## Element: search

Defines either the default `@name` attribute that refers to the name of an object, or the name of a specified key/value in the datatype. If something else than `@name` is used, the corresponding `key` with the name must exist.

#### Element Attributes

None.

#### Child Elements

None.

**Example 1**

```xml
<search>@name</search>
```

This example requires the following key to be defined, `<key name="author" xpath="/doc/@author"/>`.

**Example 2**

```xml
<search>author</search>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/15-element-search>*

---

## Element: template

Allows for objects to be created with default values. The `template` can take an optional `href` attribute, allowing for the template to be specified in a separate file. Binary datatypes are only supported through using the `href` attributes. Supports inline specifications for text and xml types.

XML datatypes will resolve expressions, allowing for data to be populated from existing documents.

**Example 1**

```xml
<template>
  <me id="{#Profile#/profile/userid}">{#Profile#/profile/username}</me>
</template>
```

**Example 2**

```xml
<template href="tenant://Settings/templates/product_template.xml"/>
```

#### Next

- [Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes/xml-format/16-element-template>*

---
