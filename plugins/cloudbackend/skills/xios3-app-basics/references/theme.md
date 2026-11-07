# The theme: every component, modern, responsive

Every app this skill designs gets a custom theme that covers every runtime component, so nothing on screen keeps the
runtime's default look. The theme is two parts: the token theme in the manifest (the seeds and knobs a direction
picks) and the kit's stylesheet `ui/DesignKit/theme.css`, which turns those values into a modern interface. This page
says what the stylesheet does, why it is needed, how it reaches each component, and what was measured.

## Why a token theme alone is not enough

The runtime styles a component through its look. A token theme sets `look="token"` per component, and a component
follows the theme's tokens only when it ships a `-token` stylesheet. Measured in the runtime's own CSS (2026.6.0, the
`style.css` a CloudBackend deployment boots, 2026-11-05):

| Has a token look | No token look: keeps its legacy (frozen) look under any token theme |
| --- | --- |
| button, input, textarea, toolbar, iconlist (2 rules), combobox and its dropdown, checkbox (1 rule), radio, tabstrip, grid, menubar, tree, view, bush | panel, label, buttonbox, listview, toggle, table, date, calendar, slider, menu, accordion, collapse, boxlist, breadcrumbs, upload, identity, dialogs |

So an app with only the token theme still shows grey accordion headers, a default blue switch, native radios, classic
tabs and a dark legacy dialog. `theme.css` fills every gap.

## How the stylesheet reaches the components

1. **Every component is `look="token"`** in the theme's `<components>` (the 32 names in `assets/directions.json`,
   plus the view). `designkit.py check` fails on a missing one.
2. **The view component loads the stylesheet**: `<view look="token"><style href="ui/DesignKit/theme.css"/></view>`.
   The runtime puts it into every view frame (measured: it lands in the component slot, `!compCss`). It never names a
   colour: everything reads the `--xios-*` tokens, and neutrals are mixed from the seeds with `color-mix()`, so a rebrand
   or the dark direction follows on its own.
3. **The runtime's own hooks first.** A token look reads per-component custom properties, `--xc-<component>-<part>`
   (379 of them, for example `--xc-button-radius`, `--xc-input-focus`, `--xc-toolbar-surface`). The stylesheet sets them
   in `:root`; where the runtime sets a hook on the component itself (the slider's colours, the switch's size), the
   stylesheet sets it there too.
4. **Rules where no hook exists**, scoped `html body .xios-<component>` so they outrank the runtime's base rules. Three
   runtime values are written inline or behind an id and need `!important`: a field label's colour (`div.label`), a
   button box's text (`#!contentArea .box_text`, 10 px Verdana) and a dialog message's width (400 px).

## The design principles it applies

After Apple's Human Interface Guidelines (clarity, deference, depth) on a Tailwind-like scale:

- **Type**: the system stack first (`-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto`),
  15 to 16 px body, 13 px secondary, 17 px headline, display sizes with `clamp()` and tight tracking; labels small,
  uppercase, tracked.
- **Space**: a 4 px grid (`space-1` to `space-6`: 2, 4, 8, 12, 16, 24 px); cards with 16 px padding.
- **Controls**: 40 px tall (44 px on touch screens, Apple's minimum target), 12 px corners, a quiet fill instead of a
  border, a 4 px focus ring in the primary colour; fields at 16 px on a phone so it does not zoom in.
- **Surfaces**: flat panels; cards (`class="xios-card"`) float a little (a hairline border and a two-layer soft shadow);
  the top bar is translucent with a background blur.
- **Components**: buttons filled in the accent (neutral: tinted grey; danger: the error colour); an iOS switch; a
  segmented control for tabs; list rows like a grouped list (tinted selection in the primary); tables with small
  uppercase headers and 44 px rows; accordion rows with hairline separators; dropdowns and menus as floating sheets.
- **Motion**: 120 to 220 ms with an ease-out curve, and none with `prefers-reduced-motion`.

The directions keep their personality in the seeds, the display face and the density (ledger is compact at 36 px,
clinic and field roomy at 44 px), and share everything else.

## Responsive rules

- `@media (pointer: coarse)`: every target 44 px, fields 16 px.
- `@media (max-width: 640px)`: the top bar's buttons show their icon only, cards round to 14 px, and a row marked
  `class="dk-wrap"` lets its buttons share the row two by two instead of overflowing. The runtime wraps each child of a
  panel in a div of its assigned width, so `dk-wrap` is how a row of buttons wraps at all.
- `@media (min-width: 1024px)`: a little more depth on cards.
- The phone and desktop views (`references/layouts.md`) still decide the layout; the stylesheet makes each one read well
  at its size.

The top bar's groups size to their buttons: the runtime gives a group a fixed height and folds every group into its
overflow menu when the bar's content is taller than the bar, which a 44 px touch target in a 30 px group was (measured
2026-11-05 under phone emulation).

## Dialogs

A `confirm` or `alert` opens in a frame of its own that carries the platform's theme (`cbeapps`), not the app's, and
the runtime places it at a fixed 462 px, partly off a phone's screen (measured 2026-11-05). The boot page that the
CloudBackend plugin's tenant server and the deploy connector write copies the app's theme and this stylesheet into each
dialog frame, and keeps dialog frames inside a phone's width; the stylesheet then draws the dialog as a sheet (a white
card, a semibold title, the default action filled, the others tinted, no close glyph). A deployment made with the
console's Deploy Wizard keeps the console's boot page and the platform's dialog. Prefer an in-app panel over a dialog for
anything longer than one question.

## The login screen

The theme does not reach the login screen: the runtime's login application draws it before the app opens. Its colours
come from the `<login>` settings (`buttonColor`, `linkColor`, `references/login.md`); the same boot page gives it the
modern geometry (the system type, 44 px filled fields with a focus ring in the button colour, a 44 px button, an 18 px
card radius) and fits the card to a phone.

## Extending it

- A component of your own reads the same tokens (`var(--xios-color-primary)`, `var(--dk-fill)`, `var(--dk-hairline)`,
  `var(--dk-ring)`, `var(--dk-shadow-md)`), so it matches without new colours.
- A rule for a runtime component goes in the app's `styles/app.css`, scoped `html body .xios-<component>`; look the
  component's class names up in the browser's inspector on a Development deployment, and prefer a `--xc-*` hook when the
  component has one.
- Never put a hex value in a view or a stylesheet (lint G10); the seeds are the only colours.

## Measured

2026-11-05, on Development deployments booting the runtime a CloudBackend deployment serves, in Chrome at 375 px (with
phone emulation) and 1280 px, with a gallery of every common component (toolbar, type, buttons, button boxes, fields,
dropdown, date, slider, checkboxes, radios, switches, tabs, list, grid, accordion, both dialog types) in the studio and
night directions: every component drew from the theme; the dialog drew as a sheet inside the screen; the top bar kept its
buttons on a phone; a gallery page loaded 24 of 24 times headless and 12 of 12 times in the desktop app's browser with
the boot page's script.
