# XIOS/3 — UI development (views)

Views, panel layouts, components, attributes, events, actions, methods, rules and look and feel.

23 topics from the published XIOS/3 documentation, generated on 2026-11-06. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [UI Development](#ui-development)
- [Locale](#locale)
- [Look and Feel](#look-and-feel)
- [Icon Protocol](#icon-protocol)
- [Style](#style)
- [Theme](#theme)
- [Using Components](#using-components)
- [Actions](#actions)
- [Attributes](#attributes)
- [Attribute Values](#attribute-values)
- [Common Attributes](#common-attributes)
- [Events](#events)
- [Methods](#methods)
- [Rules](#rules)
- [Types](#types)
- [Views](#views)
- [Menubars](#menubars)
- [Panel Layouts](#panel-layouts)
- [Columns Layout](#columns-layout)
- [Mixed Layout](#mixed-layout)
- [Rows Layout](#rows-layout)
- [Toolbars](#toolbars)
- [Viewports](#viewports)

## UI Development

In this section we will cover how to build application UIs, called [views](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views), address fundamental UI [layout concepts](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts) and how visual components are put together and [styled](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events) in XIOS/3. Below the shortcut boxes there is also a high-level overview of the architecture.

- **[Views Intro](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views)** — Introduction to XIOS/3 views. *(Shortcut)*

- **[Components Intro](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components)** — Introduction to using XIOS/3 components. *(Shortcut)*

- **[Design Intro](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel)** — Introduction to customizing look and feel of XIOS/3 components. *(Shortcut)*

### Overview

UI markup is the visual part of XIOS/3 Application Development. When considering the [MVC design pattern](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/the-mvc-design), UI markup equals the view. The image below illustrates the relation between the User Interface of an application and how user interactions (called [events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events)) goes into the [process (logic)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development) part of XIOS/3, activating [triggers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/triggers), which in turn activates one or several [step(s)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/steps) that calls and executes [operations](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/operation).


Not only user interactions affect the UI in XIOS/3. Things happening on the server backend may also affect the UI, as well as changes to the UI automatically affecting the server backend.


### What this section covers

This part of the documentation will cover all parts of UI Development. The [component attributes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes) section will explain everything you need to know about attributes and how they affect components. Here we also cover the concept of required and optional attributes as well as what type of [attribute values](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes/attribute-values) are possible to set.

UI markup also gives the developer a possibility to change components states by using [component actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/actions). Which are executed inside the [application logic (Process XML)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes). There is also the possibility to [apply methods](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/methods) on components and that is also covered in this section. By using methods and actions you can change how the end user interacts with the GUI environment.

As the main part of UI markup the components are the center of attention in this section. The section page [Component Types](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/types) explains the types of components that exist.

We will also cover [Rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) and explain how these can be used to dynamically alter components depending on what data is bound to the component.

This part of the documentation is often updated so remember to come back to see available attributes, events, methods and actions. This is always kept up to date.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development>*

---

## Locale

The **Locale** feature in XIOS/3 enables translations by resolving string keys from translation files from one or more translation directories located elsewhere in the database. You can define general directories in the <settings> top element of the application manifest using the **<locale>** element, and optionally add to or override them in a view using the **localedirs** attribute on **<view>** element.

Each translation directory contains XML files named by the locale it contains, e.g. en_US.xml. Each file contain a **<keys>** root element and each translation in **<key id="...">Value</key>** entries. All attributes in the view XML that are prefixed with the localization namespace prefix will create an unprefixed attribute using the translation of the attribute value. For example an element with the attribute **l:text="KEY_ID"** will generate an attribute **text="translation"** if the KEY_ID is found. If the element already have a text attribute it will be overwritten. If no translation is found the text attribute, if defined, will be kept.

### Resolution order

When resolving a translation key XIOS/3 searches the language files in this order:

- With the highest priority comes the directories declared in the view's **localedirs**
- If the key isn't found it looks though the directories declared in **<settings><locale>**
- If still no translation is found it will search the system translations.
- Finally if no keys are found it uses the component's fallback attribute, if defined.

In the application manifest multiple **<locale>** elements are allowed, and in the view's **localedirs** attribute multiple directories can be given separated by commas. These are locale directories are given in reverse order of priority, i.e. the last defined has highest priority. Relative paths are resolved against the file they are defined in, e.g. "locale" is a subdirectory "locale" to where the current file is.

### Namespaces

XIOS/3 has defined a namespace which by convention uses the prefix "l" (lower case L) to be used for translations.

**xmlns:l="https://xios3.com/lang"**

The namespace makes it possible for XIOS/3 to clearly distinguish translation attributes from other attributes that may exist on the same component.

### Translation file format

A translation file is an XML document inside a locale directory:

**keys.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<keys revised="2025-08-18" translator="XIOS/3">
  <key id="TOK_1">Token one</key>
  <key id="TOK_2">Token two</key>
</keys>
```

### Example 1: Translating a single view.

Global directories are declared in **<settings>** using **<locale>**. We assume that this language file lies in a folder named **locale_one** just underneath this application,.

**keys.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
  <keys revised="2025-08-18" translator="XIOS/3">
    <key id="TOK_1">Token one</key>
  </keys>
```

The view below uses the **l:default** attribute to specify which key to use for translation. If the key is not found, it will use the **default** attribute as a fallback.

**Application with a translating of a single view**

```xml
<application name="Application Locale" instances="0">
  <view name="view1" title="Locale Example" height="150" width="450" xmlns:l="https://xios3.com/lang" localedirs="locale_one">
    <panel type="rows" padding="10" gap="5">
      <label l:default="TOK_1"/>
      <label l:default="MISSING" text="Fallback text"/>
    </panel>
  </view>
</application>
```

Resolution:

- **TOK_1** is found in locale_one.
- **MISSING** is not found and falls back to default.

### Example 2: Overriding a general view.localedirs

A view can add to or override directories using **localedirs**. Local locales are always checked before global. We assume these two language directories exist:

**general_langfiles**

```xml
<?xml version="1.0" encoding="utf-8"?>
  <keys revised="2025-08-18" translator="XIOS/3">
    <key id="TOK_1">Token one from general file</key>
    <key id="TOK_2">Token two from general file</key>
  </keys>
```

**view_langfiles**

```xml
<?xml version="1.0" encoding="utf-8"?>
    <keys revised="2025-08-18" translator="XIOS/3">
    <key id="TOK_1">Token one from view file</key>
  </keys>
```

**General + view-specific locales**

```xml
<application name="Application Locale" instances="0">
  <settings>
    <locale>general_langfiles</locale>
  </settings>

  <view name="view2" title="Locale Override Example" height="150" width="450"
        xmlns:l="https://xios3.com/lang"
        localedirs="view_langfiles">
    <panel type="rows" padding="10" gap="5">
      <label l:default="TOK_1"/>
      <label l:default="TOK_2"/>
      <label l:default="TOK_3" text="Three"/>
    </panel>
  </view>
</application>
```

Resolution:

- **TOK_1** from the general_langfiles file.
- **TOK_2** from the view_langfiles locale_two, overriding the general_langfiles.
- **TOK_3** not found in any listed directory, defaults to="Three".

### Summary.

The locale feature in XIOS/3 allows you to easily translate components by using translation keys. You can define global directories in the settings and local directories in a view, and the system will resolve the keys in the order specified. This makes it easy to manage translations across different views and applications.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/locale>*

---

## Look and Feel

In UI markup you as a developer are able to make use of CSS (Cascading Style Sheets) to override the current style that apply to components using the style attribute which is available on all components. CSS is written by using the notation key:value; repeatedly.

In XSLT driven components, such as the [ListView](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/listview) or [Render](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/render) you are able to use CSS classes. These can be created inside an external CSS file which is included in your applications view file, using the style element. There is also support for inline CSS which means that you can write your CSS directly in the view file. If you have a small application or a widget with some CSS it is recommended that you use inline CSS since it reduces the number of requests made to the server, making your application load faster. Have this in mind when creating widgets since they often are loaded on system boot up.

If an href attribute is not supplied the inline CSS will be used. If, however, an href attribute is supplied there, inline CSS will be ignored and the external CSS will be used instead.

For those that are not familiar with CSS classes they are applied on HTML elements (in XSLT files) using a class attribute.

You can also adapt the style and layout to different screen sizes by defining separate [view files](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) for each device (e.g. phone, tablet, etc.). This allows for custom UIs for different devices, screen sizes and orientation.

### Attributes

**Optional attributes**

| Attribute | Type | Values | Description |
|---|---|---|---|
| `href` | string | URL | The path to the external CSS file to use. |

### Example 1: External CSS

**This view file is importing the CSS file making it available to the render component where the classes are used**

```xml
<view name="view1" title="Hello World" version="1.0" height="400" width="400" icon="icon://earth">
  <style href="home://Documents/helloWorld.css"/>

  <panel height="auto" width="auto">
    <render height="auto" width="auto" href="home://Documents/render.xsl"/>
  </panel>
</view>/>
```

**This is the CSS file that we will import**

```css
.bold {
  font-weight: bold;
}
.headlineBlue {
  font-weight: bold;
  font-size: 16px;
  color: blue;
}
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel>*

---

## Icon Protocol

All the components in XIOS supports the icon protocol in image source attributes or attributes specifically for icons. The icon protocol solves a number of problems when you are building applications with different themes and replaceable or changing components.

The first benefit of the icon protocol is that it abstracts the real location of icons, making it possible to put them on different servers, inline, or dynamically generated. Secondly it allows the component to select the appropriate size of the icon if there are multiple versions of it. This is often the case for bitmap image formats to keep them crisp and detailed at both small and large sizes. Having the component request the appropriate size allows for replacing of the component, changes in the component, or having different rendering modes, all without modifying the icon URL given to the component.

Third the icon protocol allows for selection different colors of the same icon. For SVG icons it allows for dynamic recoloration of the icons. Besides explicit color changes it also enables components to automatically pick light or dark icons depending on the background color. That is not only handy when building a UI in a specific theme, but saves a lot of labor when working with multiple themes. Different themes can thus have the same icon set with different color schemes, as well as having multiple different icon sets all working with the same UI definition.

An icon URL is constructed by the protocol prefix `icon://` followed by optional sub paths, and the actual icon name. The theme specific icon set is in the root of the icon protocol, e.g. `icon://book` for a book icon in the current theme. Optionally additional arguments to the icon manager can be given in URL parameters following a question mark, e.g. `icon://book?color=red` for a red book, using the current theme to select from what icon set to get the icon and recoloring it using the theme palette. The two abstract colors `lightIcon` and `darkIcon` are used when a component wants to adapt the icon to contrast against the background. If they are defined in the theme palette the icon will be recolored accordingly.

### URL Parameters

| Name | Type | Description | Default Value |
|---|---|---|---|
| theme | string | The theme from which to pick the icon set to use e.g., aqua, classic, fabric, glass, graphite, liquid, marble, sparse. | The currently selected theme for the parent level. |
| size | integer | The size of the icon (equal height and width), in pixels. | The currently requested icon size, or 32 if none. |
| color | string | The color to use for the icon, if possible. Either a color name as defined in the theme palette or a `#RRGGBB` value. | The theme icon color, or the icon set default color. |
| shadow | boolean | Adds a drop shadow to the icon if `true`. | false |

### Overlay Parameters

| Name | Type | Description | Default Value |
|---|---|---|---|
| overlay | string | The name of the icon to place on top of the main icon. |  |
| opos | string | Where on the main icon the overlay should be positioned as orientation e.g., n, ne, e, w, s, sw, se, c, center. | nw |
| ocolor | string | The color to use for the overlay, if possible. Either a color name as defined in the theme palette or a `#RRGGBB` value. | black |
| osize | rational number | Size factor for the overlay. | Defaults to 0.5 meaning half the size (quarter of the area). |

`icon://client_network?theme=marble&size=32&overlay=sign_forbidden&opos=c&osize=0.9&ocolor=red`

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/icon-protocol>*

---

## Style

The `style` defines specific CSS to control how to render the UI in the browser.

Between `style` start and end tag there can be CSS definitions that will be used exactly as is, when rendered as `html` for the browser.

This will apply to the whole view. Compare this with a single tag that can have their own attribute `style=""`, see respective tag.

See more information on CSS syntax in the [W3schools HTML tutorial](https://www.w3schools.com/tags/tag_style.asp).

### Attributes

**Optional attributes**

| Attribute | Type | Values | Default | Description |
|---|---|---|---|---|
| `href` | string | URL |  | The path to a shared stylesheet CSS file to use for a standardized look and feel. |
| `inherit` | boolean | true, false | true | Can be inherited and copied as a base in order to create a separate theme. |

### Example 1: Inline CSS

**Using inline CSS**

```xml
<view name="view1" title="Hello World" version="1.0" height="400" width="400" icon="icon://earth2">
  <style href="/assets/main.css"/>
  <style>
    .bold {
      font-weight: bold;
    }

    .headlineBlue {
      font-weight: bold;
      font-size: 32px;
      color: blue;
    }
  </style>

</view>/>
```

#### Example 2: Inline CSS - Buttons

**Concept** *(runnable)*

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

### Example 3: Inline CSS - Kanban with rounded borders and hover effect

**Using inline CSS**

```xml
  <view name="Kanban" title="Kanban - Visualize Data" width="600" height="400" icon="icon://clipboard_checks" winstate="false">
  <style>
    #boards.xios-iconlist .layout_submenu .text {font-family: helvetica; font-weight:700; color: yellow;}
    #boards.xios-iconlist .marble .listselected .text {color: #000;}

    #lists.xios-iconlist .layout_sectionlist .text {margin-top: 4px; font-weight: normal;}
    #lists.xios-iconlist .listnorm     {height:95%; margin:0 3px; border: 3px solid  #9FC9EB; border-radius: 10px; background-color: white;}
    #lists.xios-iconlist .listbox      {height:95%; margin:0 3px; border: 3px groove #9FC9EB; border-radius: 10px; background-color: white;}
    #lists.xios-iconlist .listselected {height:95%; margin:0 3px; border: 3px solid  #9FC9EB; border-radius: 10px;}

    #cards.xios-iconlist {background-color: white;}
    #cards.xios-iconlist .layout_submenu .text {margin-top: 4px; font-weight: normal;}
    #cards.xios-iconlist .listnorm     {margin:3px; border: 3px solid  grey;  border-radius: 10px; background-color: white;}
    #cards.xios-iconlist .listbox      {margin:3px; border: 3px groove grey;  border-radius: 10px; background-color: white;}
    #cards.xios-iconlist .listselected {margin:3px; border: 3px double black; border-radius: 10px;}
  </style>

  <toolbar name="kanbanBar">
    <group name="leftBar">
      <buttonbox name="addBoard" text="Add Board" icon="icon://plus"/>
      <buttonbox name="addList" text="Add List" icon="icon://plus"/>
    </group>
    <group name="cardBar">
      <input name="addCard" placeholder="New Card" icon="icon://plus"/>
    </group>
    <group name="rightBar" align="right">
      <buttonbox name="deleteCard" text="Delete" icon="icon://delete"/>
    </group>
  </toolbar>

  <panel name="MainPanel" type="columns">
    <iconlist name="boards" draggable="true" layout="submenu" scroll="false" width="150" height="100%" style="background-color: #555;">
      <rule match="/db:result/db:container">
        <item text="{@name}" icon="icon://folders2"/>
      </rule>
    </iconlist>

    <!-- LISTS -->
    <panel type="rows" width="100%">
      <iconlist name="lists" draggable="true" width="100%" height="70" layout="sectionlist" scroll="true" deselect="false" iconsize="32">
        <rule match="/db:result/db:container">
          <item text="{@name}" icon="icon://clipboard_checks"/>
        </rule>
      </iconlist>

      <!-- CARDS -->
      <panel name="todoPanel" type="flow" height="100%" width="100%">
        <iconlist name="cards" draggable="true" width="100%" height="100%" layout="submenu" scroll="true" deselect="false" iconsize="32">
          <rule match="db:object">
            <item text="{substring-before(@name, '.')}" icon="icon://checkbox_unchecked"/>
          </rule>
        </iconlist>
      </panel>
    </panel>

  </panel>
</view>  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/style>*

---

## Theme

The theme is the preferred place for styling in XIOS/3. An app's own markup should stay free of one-off `style`, `bold` or `color` attributes scattered across components - those are per-element escape hatches, not a design system. There are two mechanisms a theme can use to control appearance: picking a `look` per component, and driving shared **design tokens** that a component's own CSS reads directly. Tokens are the direction the platform is moving in - a component written or rewritten to read tokens needs no per-theme CSS authored for it at all, whereas a look is a discrete, hand-authored stylesheet someone has to write (and keep in sync) for every component it names. See `Design tokens` below for the distinction in practice.

> **Note:** Applications default to the `marble` theme (a classic, look-based theme) if no theme is selected. `aurora` is the reference token theme - it shows the modern, token-driven direction described below, but it isn't itself the platform default.


> **Note:** When referenced in code, these names are written in lowercase.

### The basic mechanic

A theme document sets a per-component default `look` (and, optionally, extra CSS) under `components`, and a shared color palette under `colors`. Any classic theme can `inherit` from another to layer changes on top rather than starting from nothing.

**A classic, look-based theme**

```xml
<?xml version="1.0" encoding="utf-8"?>

<theme name="xios" dialogShadow="dialog_marble_shadow" icon="green-collection">
  <inherit href="/xios/gui/themes/marble.xml"/>

  <components>
    <view look="marble">
      <style href="service/css/xdashboard.css"/>
      <style inherit="false">
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
*::-webkit-scrollbar-thumb {
  border: 1px solid #D6D6D6;
  border-radius: 10px;
  background: #eee;
}
      </style>
    </view>
    <button look="fabric"/>
  </components>

  <colors>
    <color name="green">#53a616</color>
    <color name="blue">#0299e3</color>
    <color name="yellow">#ffb100</color>
    <color name="red">#d74214</color>
    <color name="grey">#546e7a</color>
    <color name="orange">#f47c00</color>
  </colors>
</theme>
```

### Design tokens

Modern themes go a level deeper than picking a per-component look: they drive a shared set of CSS custom properties - **design tokens**, all under the `--xios-*` namespace - that a token-aware component reads for its own sizing, spacing and color instead of baking those values into its CSS. One theme's tokens can make every token-aware component denser, rounder, or on-brand at once, without touching a single component's own stylesheet.

There are two kinds of token: **structural** tokens (type size/weight/line-height/letter-spacing, the spacing scale, corner radius, border width) and **color role** tokens (primary, surface, on-surface, and friends - named after Material Design 3's role system). Color role tokens are readable from any look, token or classic. Structural tokens reach a component either through that component's own `-token` look variant, or - for a component with only one stylesheet to begin with - unconditionally, with no look involved at all. Which of those applies depends on how the component itself is built; see `Look is the legacy path` below.

#### Opting a theme in

Set `tokens="true"` on the `theme` element, add a `tokens` block (the child element's own tag name **is** the token name - `radius-md` sets `--xios-radius-md`), and - for a component that still needs it - set `look="token"` so it reads them. A theme that never sets `tokens` explicitly but still has a `tokens` block or a `look="token"` component is treated as opted in implicitly - but authoring it explicitly is required to pass the project's own token-contract check.

#### Look is the legacy path

`look` and tokens are not two equally-weighted options. A look is a hand-authored, per-component CSS block someone has to write against that component's own class names and box model, and keep in step with every other look the same component already has - real, ongoing work that needs the component's CSS source in hand. It exists because components built before tokens ([`Button`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button), [`Grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid), [`Panel`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel), [`TabStrip`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip), [`ComboBox`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/combobox), and most of the rest of the classic set) each already ship several such CSS blocks - marble, fabric, aqua and so on - one per look name. Making one of those token-aware means adding a further `-token` block that mirrors the existing ones structurally but reads `var(--xios-*, <legacy literal>)` in place of hardcoded values, so `look="token"` has something to select.

A component written (or rewritten) since tokens landed skips that whole mechanism: it has exactly one stylesheet, full stop, and that stylesheet reads the token contract unconditionally from its base selector down, with a literal fallback standing in for pre-token themes. [`List`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list) is the reference example - every rule in its CSS is `var(--xios-color-surface, #fff)`-shaped from the outermost selector on down, there is no marble/fabric/aqua variant to keep in sync, and `List`'s own `look` attribute is documented as present only for markup compatibility - **"not read by list itself."** No theme has to opt this component in with `look="token"`; there is nothing to opt into. This is the target architecture, not a variant of it: `look`-gated token variants are the bridge for existing components, and plain always-on tokens are where a component ends up once it no longer needs that bridge.

Color roles work differently: they're authored as ordinary named colors under `colors`, the same section every classic theme already has. The catch is that a fixed set of role names is **reserved** - a theme that hasn't opted in with `tokens="true"` is not allowed to define any of them, and gets a build-time error if it tries. The reserved roles are:

`primary`, `on-primary`, `primary-hover`, `primary-active`, `secondary`, `on-secondary`, `secondary-hover`, `tertiary`, `on-tertiary`, `tertiary-hover`, `on-error`, `error-hover`, `background`, `surface`, `on-surface`, `surface-raised`, `surface-variant`, `on-surface-variant`, `selected`, `on-selected`, `outline`, `outline-variant`, `focus-ring`.

You only need to author the seed colors your theme actually cares about (typically `primary`/`secondary`/`tertiary` plus their `on-*` text-contrast pairs, and `background`/`surface`/`on-surface`/`error`/`on-error`). Everything else - hover tints, neutrals like `surface-variant` and `outline`, the `selected` tint - is **derived** from those seeds automatically and should never be set by hand.

#### The frozen-fallback contract

A token-aware component reads a token as `var(--xios-radius-md, 4px)` - the token if a theme supplies one, else a literal fallback. Those fallbacks are chosen to exactly match how the component already looked before tokens existed, so every classic (non-token) theme keeps rendering pixel-for-pixel unchanged. Editing a fallback value is therefore not a small tweak - it silently reskins every shipped classic theme at once. A dedicated check (`npm run check:token-fallbacks`) diffs every such fallback against a recorded baseline and fails if one changes without being deliberately re-approved.

#### Token reference

The full set of structural tokens a theme may set, with their neutral (un-themed) defaults:

| Attribute | Type | Values | Description |
|---|---|---|---|
| `--xios-text-xs / sm / md / lg / xl` | length | 10px / 11px / 12px / 13px / 16px | Type size scale. |
| `--xios-weight-normal / medium / bold` | number | 400 / 500 / 700 | Font weight scale. |
| `--xios-leading-tight / normal / body` | number | 1.1 / 1.3 / 1.6 | Line-height scale - tight for headings, body for long-form text. |
| `--xios-tracking-normal / label` | length | 0 / 0.12em | Letter-spacing scale - label is the wide tracking used by all-caps labels. |
| `--xios-space-1 ... 6` | length | 2px / 4px / 6px / 8px / 12px / 16px | The spacing scale, from tightest to loosest. |
| `--xios-radius-sm / md / lg` | length | 3px / 4px / 8px | Corner radius scale. |
| `--xios-border-width` | length | 1px | Default border width. |

A further set of names is reserved and contract-legal but has no default at all - a component falls back to its own literal until a theme deliberately drives one: `font-sans`, `font-mono`, `control-height`, `control-pad-x`, `control-gap`, `font-numeric`, `font-ligatures`, `font-features`, `font-optical`, `font-variation`, `type-title-case`, `type-label-case`, `type-label-variant`, `type-personality`, `heading-wrap`, `body-wrap`, `text-box`, `hyphens`.

The color role tokens, with their neutral defaults:

| Attribute | Type | Values | Description |
|---|---|---|---|
| `--xios-color-primary / on-primary` | color | #0078d7 / #ffffff | The brand accent, and text/icon color on top of it. |
| `--xios-color-secondary / on-secondary` | color | #5fc259 / #ffffff | A secondary accent. |
| `--xios-color-tertiary / on-tertiary` | color | #f08c00 / #ffffff | A third accent. |
| `--xios-color-background` | color | #f0f0f0 | The page/window background, applied to html and body directly. |
| `--xios-color-surface / on-surface` | color | #ffffff / #000000 | The default surface color for panels and controls, and text/icon color on top of it. |
| `--xios-color-error / on-error` | color | #cc0000 / #ffffff | The validation/danger accent. |

Derived (never hand-set): `primary-hover`, `secondary-hover`, `tertiary-hover`, `error-hover` (each seed lightened for hover states), `surface-variant`, `on-surface-variant`, `outline`, `outline-variant` (neutrals tinted between surface and on-surface), and `selected`/`on-selected` (a light tint of primary over the surface, for selection highlights).

A handful of ready-made utility classes build on these tokens, for use directly in markup instead of one-off style/bold/color attributes: `xios-color-secondary`/`xios-color-tertiary`/`xios-color-danger`/`xios-color-neutral` rebind the accent tokens for one element (so a token-look component paints its whole base/hover/text with a different role, no per-component CSS needed); `xios-type-display`/`heading`/`subheading`/`body`/`caption`/`label`/`strong` apply a matched font-size/weight/line-height/color combination to text; and `xios-card` composes surface, border, shadow and radius into one raised-panel look.

### A complete token theme

Aurora is the project's reference token theme - every component set to `look="token"`, a handful of type and space tokens tuned to its own font, and only the color seeds authored (everything else derives):

**gui/themes/aurora.xml**

```xml
<theme name="aurora" dialogShadow="false" icon="x-collection" tokens="true">

  <fonts>
    <font-face name="Inter"
               href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700" type="css"/>
    <font name="inter" face="Inter"/>
  </fonts>

  <!-- the element name IS the token name -->
  <tokens>
    <font-sans>'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif</font-sans>
    <text-xs>11px</text-xs>
    <text-sm>12px</text-sm>
    <text-md>13px</text-md>
    <text-lg>14px</text-lg>
    <text-xl>18px</text-xl>
    <weight-normal>400</weight-normal>
    <weight-medium>500</weight-medium>
    <weight-bold>600</weight-bold>
    <leading-normal>1.4</leading-normal>
    <control-height>30px</control-height>
    <radius-sm>8px</radius-sm>
    <radius-md>12px</radius-md>
    <radius-lg>18px</radius-lg>
  </tokens>

  <components>
    <view look="token"/>
    <button look="token"/>
    <grid look="token"/>
    <panel look="token"/>
    <tabstrip look="token"/>
    <!-- ...one look="token" line per component the theme opts in -->
  </components>

  <colors>
    <!-- AUTHORED SEEDS only: hover / surface-variant / outline / selected derive in the tier -->
    <color name="primary">#4f46e5</color>
    <color name="on-primary">#ffffff</color>
    <color name="secondary">#0d9488</color>
    <color name="on-secondary">#ffffff</color>
    <color name="tertiary">#f59e0b</color>
    <color name="on-tertiary">#ffffff</color>
    <color name="background">#f4f6fb</color>
    <color name="surface">#ffffff</color>
    <color name="on-surface">#1e293b</color>
    <color name="error">#dc2626</color>
    <color name="on-error">#ffffff</color>
  </colors>

</theme>
```

### A minimal token override

A theme only needs to author the tokens and colors it actually wants to change - everything else falls through to the tier's own neutral defaults:

**A theme that only tweaks radius and the brand color**

```xml
<theme name="rounded-brand" tokens="true">

  <tokens>
    <radius-md>12px</radius-md>
    <radius-lg>18px</radius-lg>
  </tokens>

  <components>
    <button look="token"/>
    <panel look="token"/>
  </components>

  <colors>
    <color name="primary">#7c3aed</color>
    <color name="on-primary">#ffffff</color>
  </colors>

</theme>
```

### Personalities

Theme Studio (the app for building token themes visually) ships a small library of named **personalities** - curated bundles of type tokens (weight, tracking, case, line-height, and a few OpenType features) you can apply as one flat merge into a theme's own `tokens` block. A personality is an authoring convenience, not a separate runtime concept - the theme engine itself has no notion of "personality," it only ever reads whatever ended up in `tokens`, however it got there.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel/theme>*

---

## Using Components

This section covers everything related to components. First the [types of components](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/types) that are available, followed by a section explaining how [attributes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes) are used and what values they can have. We then move on to list all available [events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events), [actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/actions) and [methods](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/methods) that can be used on components or that emitted by components.

Here we also have a section entitled ["Look and Feel"](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel) which covers the usage of CSS within XSLT files. We do not cover what CSS is or how that language is used, but instead how to use it when developing XIOS/3 applications. The definition of [rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules) and which components that can utilize them is also covered here.

A complete component reference is also featured which in great detail lists all attributes, available methods and events and much more.

#### Available Components

- **[Accordion](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/accordion)** — A list of expandable headers.


- **[Breadcrumbs](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/breadcrumbs)** — Contextual navigation showing user position in a hierarchy.


- **[Bush](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/bush)** — A tree component with expandable branches.


- **[Button](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button)** — Button used to initiate actions.


- **[ButtonBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/buttonbox)** — A button looking box with text and/or icon.


- **[Calendar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/calendar)** — Calendar component for week or month navigation.


- **[CheckBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/checkbox)** — Used for selection of singular or multiple options.


- **[Clock](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/clock)** — Component showing analog or digital clock.


- **[CodeEditor](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/codeeditor)** — Code editor component.


- **[Color](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/color)** — A color picker component.


- **[ComboBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/combobox)** — A dropdown menu for selection of items.


- **[Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/container)** — A layout component that dynamically creates repeatable content.


- **[Date](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/date)** — Date picker component.


- **[Form](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/form)** — Component used for creating forms.


- **[Grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)** — Component used for presenting data in cell format.


- **[Group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/group)** — Used for grouping several components and let them share behavior.


- **[IconList](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/iconlist)** — Component used for visualizing lists with icons and text labels describing the icon.


- **[Image](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/image)** — Component used to visualize images or icons.


- **[Input](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/input)** — A single line input field.


- **[Label](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/label)** — Component defining a text label.


- **[List](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/list)** — List component displaying item entries populated by data.


- **[Map](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/map)** — An interactive map component.


- **[Menu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menu)** — Used to define a menu with items.


- **[MenuBar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menubar)** — Defines a menubar filled with menu component elements.


- **[Panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel)** — Layout element used as fundamental building block containing other components.


- **[Radio](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/radio)** — A clickable circle with optional text used for selections.


- **[RichText](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/richtext)** — Component used for text input and formatting.


- **[Slider](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/slider)** — Component for choosing a limited amount of values by dragging a slider across a bar.


- **[TabStrip](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tabstrip)** — Component for handling and showing content in separate tabs.


- **[TextArea](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/textarea)** — Component used for displaying and editing text over several lines.


- **[ToolBar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar)** — A container component for aligning content to the border of application windows.


- **[Tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree)** — Component used to display data in a classic tree structure.




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components>*

---

## Actions

A component state can be changed through something called an action. A component action is executed from any process markup logic by calling to the operation named [action](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/action).

This section will present the concept of actions in brief to give the reader an understanding of what the actions should be used for. For a more detailed explanation of how to use and execute actions, please read the document Process Development and the Process Development manual.

Some actions are similar to Methods. When that is the case understand that Actions are handled faster than Methods by XIOS/3 so if you can replace Methods by Actions you should.

A full list of available Actions can be found in the Reference Section, under Actions.

### Action types

The action types that follow are behaviors that change a state and sometimes the look and feel of a component. They play a key role in how the components behave and interact with the end-user.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/actions>*

---

## Attributes

All components contain a number of attributes controlling how the component should be initiated, interact and be visualized. How an attribute will affect the component will depend on what value it is set to. An attribute value could be of any of the types defined in section Attribute values.

A component must contain all the required attributes> and may contain any or all of the optional attributes. To be able to control and customize specific behavior for components, a component can have its own specific attributes.

The component-specific attributes are described in section Component Reference, where all the components are explained in detail.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes>*

---

## Attribute Values

### string

A string value is text that must start with a letter [A - Z | a - z] and may be followed by any number of letters, digits [0 - 9], hyphens [-], underscores [_], periods [.] and colons [:].

#### Example

`Boston`, `Figure9`, `bookCase_19`

### boolean

A boolean value represents the value true or false. If any other value is specified the value will be interpreted as a false value. If an attribute of boolean type is expected but not present, it will be interpreted as a false attribute value.

#### Example

`true`, `false`

### numerical

A numerical value is a digital number representing a negative - [0 - n] or positive [0 - n] integer value. The numerical value can be used to specify a width, height, length, iteration, interval or any other instance where numbers are needed.

#### Example

`520`, `-95`, `233`

### measure values

If the numerical value is a measure of the component the pixels (px) or percentage (%) units are used. If a measure is specified without a unit identifier the value will be interpreted as a pixel value. The percentage value is interpreted as the percentage of the maximum value the component can fill up, which depends on where and how it is contained.

#### Example

`125`, `50%`, `400`

### enumeration

An enumeration value is a set of predefined string values. They are often used when defining modes or types of which there is a limited number.

#### Example

`Christmas`, `Easter`, `midsummer`

### color

A color value is a six-digit hexadecimal RGB [0 - 9 | a - f | A - F] value defining the red, green and blue color. Each color needs two digits ranging from 00 to FF defining the strength of the color. The color value can contain the optional number [#] prefix.

#### Example

`#f00`, `#0f0`, `#00f`, `#ccc`

### reference

A reference value is an absolute or relative document path referencing to a document.

#### Example

`http://www.xios3.com/file.xml`, `home://Document/file.xml`, `images/icons/home.png`

### css

A CSS value defines CSS (Cascading Style Sheet) properties. The syntax of the CSS is a repeated sequence of property name, colon [:], property value and an ending semicolon [;].

#### Example

`font-family:arial, verdana; font-size:11px; font-weight:bold;`

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes/attribute-values>*

---

## Common Attributes

The common attributes are component attributes that are managed by XIOS/3 directly and not the component code itself, and thus are available on all components.

### name

The most important common attribute is the name attribute, which is required on every component you want to interact with from the [process markup language](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development). It is required when you [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) data to the component, when you perform [actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/actions) and [methods](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/methods) on it. You also need it to subscribe to [events](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events) from the component.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string |  | The name of the component. It should be unique to the view. |

### width

The width attribute will set the component width in pixels or percentage value.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | measure values | integer (px), percent (%) | The width of the component |

### height

The height attribute will set the component height in pixels or percentage value.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `height` | measure values | integer (px), percent (%) | The height of the component |

### title

The title attribute shows the specified text as a tool tip when the component is hovered.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `title` | string | Any string value | Tool-tip text. |

### label

The label attribute shows the specified text as a label above the component.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `label` | string | Any string value | The label text |

### label-style

Sets the CSS style of the label.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `label-style` | string | CSS Syntax | Overrides the default label style |

### padding

The padding attribute defines the space between the component border and the component content.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `padding` | numerical | [0...n] | 0 |

### class

The class attribute allows you to extend the component's default styling by adding your own CSS classes. Any user-supplied classes are merged with the component's built-in classes.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `class` | string | CSS class name | Adds custom CSS classes alongside the component's default classes |

### tabindex

The tabindex attribute defines in which order the tab button should focus on the components.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `tabindex` | numerical | [1...n] | 0 |

### style

The style attribute overrides CSS style information on the encompassing/major element of the component.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `style` | css | CSS Syntax | Overrides the appearance of the component using CSS |

### draggable

Declare this component as draggable. A draggable component can be dragged to a different component for drag and drop. A parent component will handle drag events for its children if they are not declared as draggable. The recipient component of the drop will get the current value of the component.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `draggable` | boolean | true, false | false |

### dragcomponent

Point out a component that should act as the dragged component if this component, or a child with no drag information, is targeted in a drag and drop event.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `dragcomponent` | string | component name | What component to use as drag component. |

### windowdrag

Indicate that dragging the component may be used to drag the window of the view around.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `windowdrag` | boolean | true, false | Can component be used to drag the window. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/attributes/common-attributes>*

---

## Events

A component end user interaction triggers something called an [event](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/event-model). A component event is a signal thrown to the application process markup trigger. The trigger will perform execution of the application logic for that specific signal, when the event occurs and the signal is thrown.

This section will present events in brief to give the reader an understanding of what the events should be used for. For a more detailed explanation of how to use events please read the documents Process Development and Process Development manual.

A full list of available Events can be found in the Reference Section, under Events.

### Event types

The event types that follow below are event listeners waiting for end-user interactions in the GUI to be performed, throwing events. They play a key role in how the components react and interact with the other components of an application.

#### Most common Events

The following Events are the most common in XIOS/3 development:

- [ContextMenu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/contextmenu)
- [DoubleClick](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/doubleclick)
- [Drop](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/drop)
- [Enter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/enter)
- [Loaded](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/loaded)
- [Release](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/release)
- [Select](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/select)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/events>*

---

## Methods

This is a reference section about all available component methods that can be used in [process markup language](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development).

Please note that in XIOS/3 we advise you to only use Methods as a last resort, as many things are better handled by [Actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/actions).

There are two ways of using methods, the [callMethod](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callmethod) operation or by appending .methodName() on an [Expression](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions).

Methods can be used to send information or to receive/extract information.

A full list of available Methods can be found in the Reference Section, under Methods.

### Using methods

As mentioned above, there are two ways of using methods. Some methods are available via the callMethod operation, some are available using the .methodName() and some available via both.

#### Using callMethod

The [callMethod operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callmethod) allows you to send parameters to a component.

To see an example of such an operation, [click here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callmethod).

#### Appending .methodName()

When using [Expressions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/using-expressions) you can also use methods.

This method, executed on a [listview](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/listview) component called `lvPlaylist` might look like this `#view#lvPlaylist.getParam('item')`.

### Method types

Methods can be used to either sending information to a component or extracting information that the component might have.

In this reference section all available methods are listed, as well as on information on which components they apply.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/methods>*

---

## Rules

The rule element is used to define how a data driven component should interpret the bound data. Every component uses their own rules but have rule element and match attribute in common with each other. The matching is done by using [XPath](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/xml/overview-xpath) to match bound data

**Note:** The match attribute requires XPath expressions, not to be confused with the similar XIOS/3 expressions, which cannot be used here. XPath is a limited sub-set of XIOS/3 expressions.

Note that some components actually require rule elements in order to display the data, such as the [Tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree) component.

Since rules are handled by the components themselves the data is left unaltered thus several component can show the same data is several different ways and changes in one are propagated to all the components and displayed accordingly.

> **Note:** If you are trying to match elements or attributes which use namespaces you might need to declare that namespace on the element. If you don't, the rule matching might fail and no error messages might be displayed.

#### Applies To:

[Clock](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/clock), [ComboBox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/combobox), [Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/container), [DataItem](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/dataitem), [Form](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/form), [Grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid), [Tree](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/tree)

### Example:

**Rule in Combobox component** *(tested)*

```xml
<combobox name="CB" width="150" height="20" editable="false">
  <plate name="CBplate" height="30">
    <rule match="component">
      <item>{@name}</item>
    </rule>
  </plate>
</combobox>
```

**Data XML for ComboBox Example**

```xml
<components>
  <component name="Accordion" tag="Component" group="UI XML">
    <documentation>
      <description>Accordion description.</description>
    </documentation>
  </component>
  <component name="Browser" tag="Component" group="UI XML">
    <documentation>
      <description>Browser description.</description>
    </documentation>
  </component>
  <component name="Button" tag="Component" group="UI XML">
    <documentation>
      <description>Button description.</description>
    </documentation>
  </component>
</components>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules>*

---

## Types

The UI markup language is based on components that are written as XML elements, with attributes and child elements to control them. There are two basic element types which the UI markup consists of; the High Level Element and the Child Element.

High Level Elements do not require any special type of parent component except for the mandatory [Panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) component. The reason for this is that the XIOS/3 rendering engine requires a Panel to be the only direct child element of the root element [view](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view). Child Element components are components that require a specific parent component other than the Panel element, an example of child element component is the [DataItem](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/dataitem) which requires [Menu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menu) as a parent element.

There are also several component types. These categorize the main purpose of the component and/or functionality. Some components are categorized as two or more of the types.

#### Application Components

Components that are extremely self-sufficient and are actually applications in themselves, but can be integrated in to your applications.

#### Atomic Components

Components that offer easy interaction to end users. These components normally don't need bound data to work. Because of this they have limitations in what can be achieved by using them.

#### Data Driven Components

Components that need XML data to be [bound](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) to them to be able to function. Data driven components are the strength of XIOS/3, since you can bind components to data or each other (and if data is available share it). The data itself can come from either XIOS/3 or any web service on the web that generates XML.

#### Menu Components

Components that are used to construct a variety of different types of menus. There are several options including context menus (created when an end user right-clicks on a component) and of course traditional toolbar menus.

#### XSLT Driven Components

Components that need XSLT files in order to function. These components also require data to be bound to them in order to render the XML data in a desired way. XSLT-driven components offer much flexibility when designing applications, since they allow for a total customization of the data displayed as well as how it will be displayed.

#### Wrapper Components (Container Components)

Components that contain other components, either for layout purposes or for markup purpose to allow the system to handle child element component is a certain way using [Rules](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/rules), for instance.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/types>*

---

## Views

The `view` element is the root element for all view documents (UI markup files) that represents the **V** in the `MVC (Model View Controller)` design pattern. When referring to a view we often think about the main application UI, but in XIOS/3 it may also be dialogs or widgets. With a few exceptions, every `view` needs to have its visual components within a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel) element.

The `view` element may also contain menus, such as [toolbars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/toolbars), [menubars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/menubars), and context (right-click) menus outside the first `panel` element, alongside [styling](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/look-and-feel) of components which can be done using a `style` element.

> **Note:** Views can not be nested, but it is possible to have multiple views next to or on top of each other.

> **Note:** All visual components in XIOS/3, except [menus](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menu), [menubars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menubar), and [toolbars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar) have to be within a [panel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel).

- **[Layout Panels](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts)** — Introduction to application layout using panels. *(Shortcut)*

- **[Menubars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/menubars)** — Introduction to menubars. *(Shortcut)*

- **[Toolbars](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/toolbars)** — Introduction to toolbars. *(Shortcut)*

### Syntax and Examples

**Basic view document** *(tested, runnable)*

```xml
<view name="basicView" title="Basic" icon="icon://flower">
  <panel bgcolor="grey" padding="10">
    <label text="Basic View" size="16"/>
  </panel>
</view>
```

**Menubar Example** *(tested, runnable)*

```xml
<view height="180" width="400" icon="icon://flower" name="menubarView" title="Menubar Example">
  <menu name="submenuName" caption="true" text="Select Filetype">
    <item name="sPDF" text="PDF" checkable="true" checked="false"/>
    <item name="sXML" text="XML" checkable="true" checked="true"/>
    <item name="sDoc" text=".doc" checkable="true" checked="false"/>
  </menu>
  <menubar name="menuBar" draggable="true" position="top">
    <menu name="mFile" caption="false" text="File">
      <item name="mOpenDoc" text="Open" icon="icon://document_into" hotkeytext="Ctrl + O"/>
      <item name="mNew" text="New" icon="icon://document_new" hotkeytext="Ctrl + N"/>
      <item name="mSaveDoc" text="Save" icon="icon://floppy_disk" hotkeytext="Ctrl + S"/>
      <item name="mFiletype" text="Filetype" icon="icon://document_gear" submenu="submenuName"/>
    </menu>
  </menubar>
  <panel bgcolor="grey" padding="10">
    <label text="Menubar Example" size="16"/>
  </panel>
</view>
```

**Toolbar Example** *(tested, runnable)*

```xml
<view height="180" width="500" icon="icon://flower" name="toolbarView" title="Toolbar Example">
  <toolbar name="toolbarName" position="top">
    <group name="leftBar">
      <buttonbox name="addBoard" text="Add Board" icon="icon://plus"/>
      <buttonbox name="addList" text="Add List" icon="icon://plus"/>
    </group>
    <group name="addBar">
      <input name="addCard" placeholder="New Card" icon="icon://plus"/>
    </group>
    <group name="rightBar" align="right">
      <buttonbox name="deleteCard" text="Delete" icon="icon://delete?color=red"/>
    </group>
  </toolbar>
  <panel bgcolor="grey" padding="10">
    <label text="Toolbar Example" size="16"/>
  </panel>
</view>
```

**Process code example for opening an additional view.** *(tested, not runnable)*

```xml
<operation name="open" value="../views/popup2.xml"/>
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views>*

---

## Menubars

The [menubar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menubar) is a menu component that can be placed outside the wrapping panel.

#### Usage

Menubars can be placed at the top, bottom, right or left of the main content. Unlike the [toolbar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar), this component is only text based and can only contain [menu](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menu) components.


### Syntax and Examples

The following example shows the basics of a menubar, including a submenu.

**Menubar Example** *(tested, runnable)*

```xml
<view name="menuBarView" title="MenuBar" icon="icon://flower">
  <menu name="submenuName" caption="true" text="Select Filetype">
    <item name="sPDF" text="PDF" checkable="true" checked="false"/>
    <item name="sXML" text="XML" checkable="true" checked="true"/>
    <item name="sDoc" text=".doc" checkable="true" checked="false"/>
  </menu>
  <menubar name="menuBar" draggable="true" position="top">
    <menu name="mFile" caption="false" text="File">
      <item name="mOpenDoc" text="Open" icon="icon://document_into" hotkeytext="Ctrl + O"/>
      <item name="mNew" text="New" icon="icon://document_new" hotkeytext="Ctrl + N"/>
      <item name="mSaveDoc" text="Save" icon="icon://floppy_disk" hotkeytext="Ctrl + S"/>
      <item name="mFiletype" text="Filetype" icon="icon://document_gear" submenu="submenuName"/>
    </menu>
  </menubar>
  <panel bgcolor="grey" padding="10">
    <label text="MenuBar Example" size="16"/>
  </panel>
</view>
```

The following example shows a more advanced example of a menubar, similar to what is used in the [CodePad](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/xmlpad) editor.

**Menubar Example (Advanced)** *(tested, runnable)*

```xml
<view name="menuBarViewAdvanced" title="MenuBar" icon="icon://flower">
  <menu name="submenuName" caption="true" text="Select Filetype">
    <item name="sPDF" text="PDF" checkable="true" checked="false"/>
    <item name="sXML" text="XML" checkable="true" checked="true"/>
    <item name="sDoc" text=".doc" checkable="true" checked="false"/>
  </menu>
  <menubar draggable="false" name="menuBar">
    <menu name="fileMenu" text="File">
      <item name="mNewDoc" text="New" icon="icon://document_new" title="Create New Document" hotkeytext="Ctrl+N"/>
      <item name="mOpenDoc" text="Open..." title="Open Document" hotkeytext="Ctrl+O"/>
      <item name="mSaveDoc" text="Save" icon="icon://floppy_disk" title="Save Current Document" hotkeytext="Ctrl+S"/>
      <item name="mSaveAsDoc" text="Save As..." title="Save Current Document As..."/>
      <item name="mSaveAll" text="Save All" title="Save All Current Documents"/>
      <item name="mRename" text="Rename..." title="Rename Current Document"/>
      <item name="mPrint" text="Print..." icon="icon://printer" title="Print document" hotkeytext="Ctrl+P"/>
      <divider/>
      <item name="mClose" text="Close" title="Close application" hotkeytext="Ctrl+Shift+Q"/>
    </menu>
    <menu name="editMenu" text="Edit">
      <item name="mUndo" text="Undo" icon="icon://undo" title="Undo Last Operation" enabled="false" hotkeytext="Ctrl+Z"/>
      <item name="mRedo" text="Redo" icon="icon://redo" title="Redo Last Operation" enabled="false" hotkeytext="Ctrl+Y"/>
      <divider/>
      <item name="mCopy" text="Copy" icon="icon://copy" hotkeytext="Ctrl+C"/>
      <item name="mCut" text="Cut" icon="icon://cut" hotkeytext="Ctrl+X"/>
      <item name="mPaste" text="Paste" icon="icon://clipboard_paste" hotkeytext="Ctrl+V"/>
      <item name="mSelectAll" text="Select All" hotkeytext="Ctrl+A"/>
      <divider/>
      <item name="mFileFormat" text="File format" submenu="submenuName"/>
    </menu>
    <menu name="searchMenu" text="Search">
      <item name="mFind" text="Find..." icon="icon://find_text" title="Find Text in Current Document" hotkeytext="Ctrl+F"/>
      <item name="mReplace" text="Replace..." icon="icon://find_replace" title="Find &amp; Replace Text in Current Document" hotkeytext="Ctrl+H"/>
      <divider/>
      <item name="mGoto" text="Goto Line..." title="Go to Line in Current Document" hotkeytext="Ctrl+G"/>
    </menu>
    <menu name="helpMenu" text="Help">
      <item name="mHelp" text="Help Center" title="Open Help Center" icon="icon://question"/>
    </menu>
  </menubar>
  <panel bgcolor="grey" padding="10">
    <label text="MenuBar Example Advanced" size="16"/>
  </panel>
</view>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/menubars>*

---

## Panel Layouts

Layout is one of the most important areas of XIOS/3 Application Development. It consists of three main parts; Usability, Optimization and Application Layout. Here we will cover the latter two.

### Application Layout

Every UI markup file has a root element called [view](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) in which all the UI markup is stored. Inside this view element all immediately visible component code must be wrapped in a [Panel component](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/panel), or a component serving the same role. Exceptions are the non-freely positioned [MenuBar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/menubar) and [ToolBar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar) with their respective children, and elements not directly locked to the application window, like context menus.

The main purpose of the Panel component is to act as a container of other components. This means that it is used to form complex layouts. Panels can be placed inside each other to form desired layouts.

**Basic Layouts**

You can find a selection of basic layout examples in the [columns](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/columns-layout), [mixed](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/mixed-layout), and [rows](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/rows-layout) sections below.

**Basic Component Layouts**

Almost all components that can be placed inside a panel (see Parent Element for each component) will behave like a panel. Meaning that they can be aligned, placed in rows and placed in columns.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts>*

---

## Columns Layout

Using the columns layout type all the components will be placed next to each other in individual columns.

### Columns 1


**Columns 1 Example** *(runnable)*

```xml
<application name="simpleColumnLayout1">
  <view name="simpleColumnView1" title="Columns 1" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5" bgcolor="lightgray">
      <panel width="100" height="100" look="white"/>
      <panel width="100" height="100" look="white"/>
    </panel>
  </view>
</application>
```

### Columns 2


**Columns 2 Example** *(runnable)*

```xml
<application name="simpleColumnLayout2">
  <view name="simpleColumnView2" title="Columns 2" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5" bgcolor="lightgray">
      <panel width="100" height="100" look="white"/>
      <panel width="auto" height="100" look="white"/>
    </panel>
  </view>
</application>
```

### Columns 3


**Columns 3 Example** *(runnable)*

```xml
<application name="simpleColumnLayout3">
  <view name="simpleColumnView3" title="Columns 3" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5">
      <panel width="100" height="100" look="white"/>
      <panel width="auto" height="100" look="white"/>
      <panel width="auto" height="100" look="white"/>
    </panel>
  </view>
</application>
```

### Columns 4


**Columns 4 Example** *(runnable)*

```xml
<application name="simpleColumnLayout4">
  <view name="simpleColumnView4" title="Columns 4" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5">
      <panel width="auto" height="100%" look="white"/>
      <panel width="100" height="100" look="white"/>
      <panel width="auto" height="auto" look="white"/>
    </panel>
  </view>
</application>
```

### Columns 5


**Columns 4 Example** *(runnable)*

```xml
<application name="simpleColumnLayout5">
  <view name="simpleColumnView5" title="Columns 5" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5">
      <panel width="auto" height="100%" look="white"/>
      <panel width="100" height="100" look="white"/>
      <panel width="auto" height="fill" look="white"/>
    </panel>
  </view>
</application>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/columns-layout>*

---

## Mixed Layout

Examples of layouts mixing rows and columns panel types.

### Mixed 1


**Mixed 1 Example** *(runnable)*

```xml
<application name="simpleMixedLayout1">
  <view name="simpleMixedView1" title="Mixed 1" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5">
      <panel type="rows" width="100" height="100%" gap="5">
        <panel width="100" height="100" look="white"/>
        <panel width="auto" height="100" look="white"/>
        <panel width="auto" height="100" look="white"/>
      </panel>
      <panel type="columns" width="auto" height="fill">
        <panel width="auto" height="fill" look="white"/>
      </panel>
    </panel>
  </view>
</application>
```

### Mixed 2


**Mixed 2 Example** *(runnable)*

```xml
<application name="simpleMixedLayout2">
  <view name="simpleMixedView2" title="Mixed 2" width="410" height="460">
    <panel type="columns" width="400" height="400" padding="5" gap="5">
      <panel type="rows" width="100" height="100%" gap="5">
        <panel width="100" height="100" look="white"/>
        <panel width="100" height="100" look="white"/>
        <panel width="100" height="fill" look="white"/>
      </panel>
      <panel type="rows" width="auto" height="100%" gap="5">
        <panel width="100%" height="150" look="white"/>
        <panel width="100%" height="fill" align="right" valign="bottom" gap="5">
          <panel width="100" height="200" look="white"/>
          <panel width="100" height="200" look="white"/>
        </panel>
      </panel>
    </panel>
  </view>
</application>
```

### Mixed 3


**Mixed 3 Example** *(runnable)*

```xml
<application name="simpleMixedLayout3">
  <view name="simpleMixedView3" title="Mixed 3" width="430" height="460">
    <panel type="columns" width="425" height="400" padding="5" gap="5">
      <panel type="rows" width="300" height="400" gap="5">
        <panel type="columns" width="auto" height="auto" gap="5">
          <panel type="rows" width="200" height="auto" gap="5">
            <panel width="200" height="100" look="white"/>

            <panel type="rows" width="fill" height="100" align="right">
              <panel width="100" height="100" look="white"/>
            </panel>
          </panel>

          <panel width="100" height="205" look="white"/>
        </panel>

        <panel width="305" height="100" look="white"/>
      </panel>

      <panel type="rows" width="auto" height="300" gap="5" padding="0 0 0 5px">
        <panel width="100" height="100" look="white"/>
        <panel width="100" height="205" look="white"/>
      </panel>
    </panel>
  </view>
</application>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/mixed-layout>*

---

## Rows Layout

Using the rows layout type all the components will be placed on individual rows below each other.

### Rows 1


**Rows 1 Example** *(runnable)*

```xml
<application name="simpleRowLayout1">
  <view name="simpleRowView1" title="Rows 1" width="410" height="460">
    <panel type="rows" width="400" height="400" padding="5" gap="5">
      <panel width="100" height="100" look="white"/>
      <panel width="100" height="100" look="white"/>
    </panel>
  </view>
</application>
```

### Rows 2


**Rows 2 Example** *(runnable)*

```xml
<application name="simpleRowLayout2">
  <view name="simpleRowView2" title="Rows 2" width="410" height="460">
    <panel type="rows" width="400" height="400" padding="5" gap="5">
      <panel width="100" height="100" look="white"/>
      <panel width="100" height="fill" look="white"/>
    </panel>
  </view>
</application>
```

### Rows 3


**Rows 3 Example** *(runnable)*

```xml
<application name="simpleRowLayout3">
  <view name="simpleRowView3" title="Rows 3" width="410" height="460">
    <panel type="rows" width="400" height="400" padding="5" gap="5">
      <panel width="100" height="100" look="white"/>
      <panel width="fill" height="fill" look="white"/>
      <panel width="100" height="fill" look="white"/>
    </panel>
  </view>
</application>
```

### Rows 4


**Rows 4 Example** *(runnable)*

```xml
<application name="simpleRowLayout4">
  <view name="simpleRowView4" title="Rows 4" width="410" height="460">
    <panel type="rows" width="400" height="400" padding="5" gap="5">
      <panel width="100" height="100" look="white"/>
      <panel width="200" height="100" look="white"/>
      <panel width="100" height="fill" look="white"/>
    </panel>
  </view>
</application>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/panel-layouts/rows-layout>*

---

## Toolbars

The [toolbar](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/toolbar) is a menu component that can be placed outside the wrapping panel.

#### Usage

Toolbars can be placed at the top, bottom, right or left of the main content. It can also be floatable. This menu type can use graphics and contain other components such as [combobox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/combobox), as [buttonbox](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/buttonbox), and [input](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/input).


### Syntax and Examples

This example work on the fly and does not need to be bound to data to work.

**UI XML for the MenuBar component, with Menu and Item components** *(tested, runnable)*

```xml
<view height="180" width="500" icon="icon://pieces" name="Component Example" title="Component Example" winstate="false">
  <toolbar name="toolbarName" position="top">
    <group name="leftBar">
      <buttonbox name="addBoard" text="Add Board" icon="icon://plus"/>
      <buttonbox name="addList" text="Add List" icon="icon://plus"/>
    </group>
    <group name="addBar">
      <input name="addCard" placeholder="New Card" icon="icon://plus"/>
    </group>
    <group name="rightBar" align="right">
      <buttonbox name="deleteCard" text="Delete" icon="icon://delete?color=red"/>
    </group>
  </toolbar>
</view>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/toolbars>*

---

## Viewports

Sometimes you want to make your application responsive to different screen sizes and for example using a simplified layout on phones and a more complex one on desktops. In XIOS/3 you can achieve this by using the `screen` attribute on the `<view>` element to control when a view is displayed based on the viewport width. Three predefined keys are available: `phone`, `tablet`, and `desktop`.

### Built-in screen sizes

Views can be conditionally displayed depending on the viewport width by setting the `screen` attribute to one of the following predefined keys:

| Key | Range (pixels) | Description |
|---|---|---|
| phone | max-width: 600px | Small screens |
| tablet | 601px to 1024px | Medium screens |
| desktop | min-width: 1025px | Large screens |

When used, the view will only be shown if the current screen width matches the range defined by the specified key.

These predefined keys provide a simple way to ensure your application layout adapts correctly to different device types, without having to manually specify screen conditions.

If more fine-grained control is needed, the `screen` attribute also accepts raw CSS media queries, giving full access to any valid screen-based condition.

### Examples

**Phone Example** *(tested)*

```xml
<view name="helloView" title="Hello World" icon="icon://earth_location" screen="phone" />
```

**Tablet Example** *(tested)*

```xml
<view name="helloView" title="Hello World" icon="icon://earth_location" screen="tablet" />
```

**Desktop Example** *(tested)*

```xml
<view name="helloView" title="Hello World" icon="icon://earth_location" screen="desktop" />
```

### Custom media queries

Instead of using a predefined key, you may specify a valid CSS media query string directly in the `screen` attribute. This allows for more precise control over when a view is shown. The media query string must be quoted using either **"** or **'** characters and also be incased in parentheses.

By customizing the queries you get the ability to tailor the interface even further, targeting specific widths, orientations, or pixel densities that aren't covered by the default breakpoints. This is particularly useful for applications that need to adapt to a wide variety of devices and screen configurations.

**Landscape Example** *(tested)*

```xml
<view name="landscapeView" title="Landscape only" screen="(orientation: landscape)" />
```

**Compact Phone Example** *(tested)*

```xml
<view name="compactPhone" title="Compact" screen="(max-width: 360px)" />
```

Custom queries are evaluated as-is and the result is dynamic. If the screen size or orientation changes, the visibility of the view may change accordingly.

### Best practices

- Use predefined screen keys (`phone`, `tablet`, `desktop`) when possible to maintain consistency.
- Use custom media queries for advanced scenarios only, and clearly document their purpose.
- Avoid overlapping view conditions that may result in multiple views being shown simultaneously.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/views/viewports>*

---
