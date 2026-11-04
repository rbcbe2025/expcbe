# Look and feel, from the XIOS/3 manual

The theme mechanism this skill builds on, as the published manual documents it: Theme (classic look-based themes, design tokens and their reserved colour roles, the frozen-fallback contract, Aurora as the reference token theme, a minimal token override, personalities), Style and classes, and the icon protocol with its palette-role colours. The design-tokens chapter of the Kanban tutorial that this file used to carry was folded into the Theme topic by the manual's 2026-09-30 edition.

3 topics from the published XIOS/3 documentation, generated on 2026-10-10. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Icon Protocol](#icon-protocol)
- [Style](#style)
- [Theme](#theme)

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
