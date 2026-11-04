# Layouts: the example's files, the four patterns, the phone rules

Hand-written, measured on the hosted runtime 2026.6.0 on 2026-10-09 (Chrome, 1280 and 390 px, served from a
webshare on sample data). `designkit.py app` writes these files with the placeholders filled in.

## The example, file by file

| File | What it is | Placeholders it takes |
| --- | --- | --- |
| `index.xml` | the manifest: `<theme>` above the views, the two components, two `<view name="App">` with `screen=`, the process | `APP_NAME` (lowercase slug), `APP_TITLE`, `THEME` |
| `views/app.xml` | tablet and desktop: toolbar, then one root panel; navigation rail (200 px), list card (340 px), detail card (`fill`) | `APP_TITLE`, `BRAND`, `ITEM`, `ITEMS`, `ITEMS_TITLE`, `VOICE_EMPTY` |
| `views/app-phone.xml` | up to 600 px: the same names, stacked; navigation hidden until Menu; detail hidden until a pick, with Back | the same |
| `processes/app.xml` | the logic for both views: bind, pick, New, Save, Delete, the screen, the status lines | `ITEMS_URL`, `ITEMS_PARENT`, `ITEMS_NAME`, `SAMPLE`, `SAMPLE_URL`, `SAMPLE_BASE`, `ITEM`, `ITEMS_TITLE`, the four `VOICE_*` |
| `xsl/detail.xsl` | the render over one record: eyebrow (status), title, notes, created | `ITEM` |
| `styles/app.css` | the app's own rules beyond the theme (the brand label); reads `--xios-*`, names no colour | none |
| `ui/DesignKit/` | `CA_Status.js` + `status.xsl`, `CA_Screen.js` + `screen.xsl`, `designkit.css` | none |
| `data/` | a sample listing (`items.xml`, the `db:result` shape) and four records, for sample mode | `SAMPLE_URL`, `SAMPLE_BASE`, `ITEM` |

Every component is named, and the names are the same in both views; the process never knows which file is
on screen.

## The desktop view, read top to bottom

```xml
<toolbar name="top">                                  <!-- may sit before the root panel -->
  <group name="topLeft"><buttonbox name="menu" text="Menu" hide="true"/><label name="brand" text="Planboard" class="dk-brand"/></group>
  <group name="topRight" align="right"><buttonbox name="newItem" text="New project" icon="icon://plus?color=primary"/></group>
</toolbar>
<panel name="root" type="rows" width="100%" height="100%">        <!-- the one top-level panel -->
  <panel name="body" type="columns" width="100%" height="fill" padding="12" gap="12">
    <panel name="nav" class="xios-card" type="rows" width="200" height="100%" padding="12" gap="8"> … iconlist with static items … </panel>
    <panel name="listCard" class="xios-card" type="rows" width="340" height="100%" padding="12" gap="8">
      <label class="xios-type-label" text="Projects"/>
      <input name="search" width="100%" placeholder="Search projects"/>
      <iconlist name="items" layout="vertical" itemheight="52" scroll="true" width="100%" height="fill">
        <placeholder><label class="xios-type-caption" text="No projects yet. Choose New project to add the first one."/></placeholder>
        <rule match="db:object"><item text="{substring-before(@name, '.xml')}" detail="{substring(@updated, 'startPos:0', 'endPos:10')}" icon="icon://clipboard_checks?color=primary"/></rule>
      </iconlist>
    </panel>
    <panel name="detailCard" class="xios-card" type="rows" width="fill" height="100%" padding="16" gap="12" scroll="true">
      <panel name="detailEmpty" …><label class="xios-type-caption" text="Pick a project to see it here."/></panel>
      <panel name="detailBody" … hide="true">
        <render name="detail" href="../xsl/detail.xsl" width="100%" height="auto"/>
        <input name="titleInput" …/> <input name="stateInput" …/> <textarea name="notesInput" …/>
        <button name="save" text="Save" default="true"/> <button name="remove" text="Delete" icon="icon://delete?color=error"/>
      </panel>
    </panel>
  </panel>
  <status name="status"/>
  <screen name="screen"/>
</panel>
```

What the theme does with it, measured: `xios-card` gave each panel the surface colour, the `radius-lg`
corners and the elevation; `xios-type-label` the small uppercase caption; the list's selected row the
primary tint; the buttons the token look (`default="true"` draws the primary ring); icons took the palette
role named in `?color=`.

## The phone view

Same names, `type="rows"` everywhere, `width="100%"`:

- `nav` starts `hide="true"`; the process shows it when Menu is pressed and hides it again on a pick.
- `listCard` has `height="fill"`; `detailCard` starts `hide="true"` and its first child is
  `<buttonbox name="back" text="Back to projects"/>`. Picking a row hides the list and shows the detail;
  Back reverses it. The desktop file has the same `back` button with `hide="true"`, so the process's
  `backToList` step is harmless there.
- The two inputs stack instead of sharing a row; the textarea is shorter.
- Nothing scrolled sideways at 390 px; the status bar spans the width (`designkit.css`,
  `body[data-screen="phone"]`).

Keep one process. When a step must behave differently on a phone, read `{$screen}` (set from
`{#App#screen.getValue()}` at start and from the `Screen` event) and branch with `decision`.

## The four patterns

| Pattern | Components | Notes |
| --- | --- | --- |
| **List + detail** | `iconlist` + `render` + inputs | the example; the detail is the object's own document |
| **Board** | one `iconlist` per column in a `columns` panel, `draggable="true"` | the manual's Kanban v4 is the worked example (`references/look-and-feel.md`): the columns are declared, not generated, so bind the first N and say when there are more; `Drop` moves the object with `database` `move` |
| **Form** | the detail card's edit block, alone | one record, one Save; `default="true"` on Save so Enter submits |
| **Reading** | a `render` in a `panel` with `scroll="true"` | the text in `dk-body` (65 characters, `white-space: pre-line`); the `paper` direction; a `toolbar` with Edit |

A second kind of record is a second container, a second entry in the navigation, and a second pair of
list/detail cards shown and hidden by the navigation's `Select`; the process binds the pair that is on
screen. Do not generate components from data: a process can bind, show and hide what the view declares, and
nothing else.

## Icons

The icon manager recolours from the palette: `icon://plus?color=primary`, `?color=error`, `?color=grey`,
`?color=darkIcon`. Names seen rendering on 2026.6.0: `plus`, `delete`, `folders2`, `clipboard_checks`,
`note`, `earth`, `rocket`, `checkbox_unchecked`. For the Menu button a text label is safer than an icon
name you have not seen render.
