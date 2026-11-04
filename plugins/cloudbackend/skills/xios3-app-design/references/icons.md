# Icons: Lucide, through the icon protocol

XIOS/3 apps from this skill use Lucide icons. The runtime ships the Lucide collection, its licence lets an app
publish on its own domain, and the icon protocol recolours it from the theme. This page says how to select it,
how to name and colour each icon, and what was measured.

## Why Lucide

- **The runtime ships it.** Its `config/system.xml` declares an icon collection named `lucide` (lucide-static
  1.22.0, 1,993 names, monochrome SVG served from `https://icons.xios3.com/lucide/v1/<name>.svg`). Both the
  runtime at runtime.xios3.com (2026.6.0 and 2026.7.0) and the runtime a CloudBackend deployment boots (its
  `/xios` folder) declare it (checked 2026-11-04).
- **The licence.** Lucide is ISC: an app may publish it on its own domain. The IconExperience libraries behind
  the other built-in collections need a licence outside the CloudBackend service, as the manual's Icons
  reference says.
- **One look.** Every Lucide icon is a 24-pixel outline with the same stroke, so a screen built from it stays
  consistent. Recolouring follows the theme's seeds.

## How the manual says to apply icons

The manual's Icon Protocol page: a component names an icon as `icon://<name>`, with optional URL parameters, and
`color=` takes a colour name from the theme's palette or a hex value. The Theme page and the Icons reference: a
theme maps an icon library (the reference token theme Aurora has `icon="x-collection"`). This skill applies the
same mechanism with the Lucide collection, and adds one parameter the runtime reads, for the components that do
not ask the app's theme (below).

## The three rules

1. **The theme selects Lucide.** `<theme name="…" tokens="true" icon="lucide">` in the manifest. `designkit.py`
   writes it. Buttons, button boxes, toolbars and view titles then draw Lucide for a plain `icon://plus`.
2. **Every icon names Lucide and the collection.** Write `icon://<name>?look=lucide&color=<colour>` on every
   icon (inside an XML attribute the `&` is written `&amp;`). A CloudBackend deployment boots with the platform's theme (`cbeapps`, an IconExperience set), and an
   `iconlist` resolves its items through that theme, not the app's. Without `look=lucide` a list item draws an
   IconExperience icon of the same name, or nothing. The runtime reads `look`; the manual does not document it
   yet (reported upstream), so keep rule 1 as well.
3. **Colour by where the icon sits.**
   - On a filled control, the control's `on-` colour: `color=on-primary` on a default button,
     `color=on-error` on a `class="xios-color-danger"` button. `color=primary` on a primary-filled button paints
     the icon in the button's own colour: it vanishes.
   - On a surface (a toolbar, a card, a tab), the role: `color=primary`, or `error` for a destructive action.
   - Inside an `iconlist`, the primary seed written out without `#`: `color=4338ca`. A list resolves colour names
     against the platform's theme, so `primary` there gives the platform's blue. This is the one colour value in a
     view; `designkit.py app` writes it from the seed, and a rebrand rewrites it (run `app` again, or replace it).
   - Always give a colour. With one, the runtime inlines the SVG and recolours it. Without one, it loads Lucide's
     black outline as an image, which ignores the theme and disappears on a dark surface.

## Names by role

Lucide names are lower case with hyphens. These are the defaults; every one is in the runtime's collection.

| Role | Name | Role | Name |
| --- | --- | --- | --- |
| New | `plus` | Back | `arrow-left` |
| Edit | `pencil` | Open, next | `chevron-right` |
| Delete | `trash-2` | Menu | `menu` |
| Save, confirm | `check` | More | `ellipsis` |
| Close, cancel | `x` | Home | `house` |
| Search | `search` | Settings | `settings` |
| Filter | `funnel` | Sort | `arrow-up-down` |
| A record, a task | `clipboard-check` | A document | `file-text` |
| A list of tasks | `list-checks` | A folder | `folder` |
| Inbox | `inbox` | Done | `circle-check` |
| Open, to do | `circle` | Warning | `triangle-alert` |
| Error | `circle-x` | Information | `info` |
| Help | `circle-help` | Notification | `bell` |
| A person | `user` | People, a team | `users` |
| Calendar, a date | `calendar` | Time | `clock` |
| E-mail | `mail` | Phone | `phone` |
| Place | `map-pin` | Tag, label | `tag` |
| Favourite | `star` | Bookmark | `bookmark` |
| Attach | `paperclip` | Link | `link` |
| Upload | `upload` | Download | `download` |
| Copy | `copy` | Share | `share-2` |
| Refresh | `refresh-cw` | Lock, private | `lock` |
| Sign out | `log-out` | Show, hide | `eye`, `eye-off` |
| Chart | `chart-column` | Invoice | `receipt` |
| Payment | `credit-card` | Cart | `shopping-cart` |

Check a name before using one that is not in this table:

- `python3 scripts/designkit.py icons app` checks every `icon://` in the package against the collection
  (`assets/lucide-names.txt`), and the look and colour rules above. It exits 1 on a problem.
- `https://icons.xios3.com/lucide/v1/<name>.svg` answers 200 for a name the runtime serves.
- lucide.dev/icons is for browsing. Newer Lucide releases add names that 1.22.0 does not have yet.

An IconExperience name (`add`, `delete`, `folders2`, `clipboard_checks`) draws nothing under the Lucide theme. There
is no fallback and no console error. A few names exist in both sets with different pictures: Lucide's `delete` is a
backspace key, so Delete is `trash-2`.

## Sizes and layout

Give icons fixed dimensions: `iconsize="20"` on an `iconlist`, the button's own 16 pixels. A box that is sized before
the icon arrives keeps the layout from shifting.

## In a render stylesheet

A render stylesheet (XSL that writes HTML) is not a component, so `icon://` does not apply there. The developer
portal draws its Lucide icons in HTML as CSS masks: an element with `background-color: currentColor` and
`mask: url(<the svg>) center/contain no-repeat`, so the icon takes the text colour and the theme's variables.
icons.xios3.com answers with `Access-Control-Allow-Origin: *` (checked 2026-11-04), which a cross-origin mask image
needs. That technique has not been measured inside a deployed app's render yet: test it on a Development
deployment before relying on it.

## Measured

2026-11-04, by this skill's authors:

- In the developer portal's playground (runtime 2026.6.0): a theme with `icon="lucide"` made `icon://plus`,
  `icon://trash-2` and `icon://search` load from the Lucide collection. `color=on-primary` drew the plus white on
  a primary button, and `color=primary` drew it invisible. `icon://search?look=lucide` loaded Lucide with no Lucide
  theme. `icon://folders2` under the Lucide theme drew nothing. `theme=<the app's theme>` on an icon drew nothing,
  because that parameter takes only the runtime's own themes.
- On a Development deployment of the kit's app (the runtime a CloudBackend deployment boots): buttons drew Lucide
  from the theme alone. The `iconlist` items needed `look=lucide`. With it, `color=primary` gave `#2E83C3` and
  `color=darkIcon` gave `#2E86C8`, both the platform theme's, so the kit writes the seed out. `class="xios-color-danger"`
  filled the Delete button with the error colour, and `color=on-error` drew its icon white.
