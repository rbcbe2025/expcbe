# The design brief: from one sentence to a look

Hand-written, 2026-10-09. What `scripts/designkit.py brief` does, so you can do it by hand when there is no
shell, and what to change afterwards.

## 1. The direction is picked from the idea

The idea is matched against each direction's keywords (`assets/directions.json`); the most matches win, and
nothing matched falls back to Studio. The six, with what they are for and how they feel:

| Direction | For | Tone | Primary | Type |
| --- | --- | --- | --- | --- |
| Ledger | finance, administration, back-office, inventory, CRM | precise, calm, dense | navy `#1e3a8a` | system sans, 13 px, controls 30 px, tight radii |
| Studio | agencies, creative and project tools, boards, marketing | bright, confident, warm | indigo `#4338ca` | system sans with Avenir Next for display, 14 px, controls 34 px, round |
| Clinic | health, bookings, coaching: used while stressed | calm, clear, kind | teal `#0f766e` | Helvetica, 15 px, controls 40 px, very round |
| Field | trades, fleets, sites, inspections: outdoors, gloves | sturdy, direct, high-contrast | green `#166534` | system sans, 15 px, controls 44 px, square |
| Night | developer tools, monitoring, media: hours in a dim room | focused, quiet, technical | light blue `#6fb6f2` on dark | system sans + mono, 13 px, controls 32 px |
| Paper | notes, courses, docs, writing: read more than clicked | quiet, literate, unhurried | deep green `#1f5c45` | serif display (Georgia), 15 px, line height 1.65 |

Each is a complete set of **seeds** (14 colours, every `on-` pair at 4.5:1 or better), **knobs** (fonts,
sizes, weights, line height, control height, radii) and a **voice** (the first-run line, the empty state,
after a save, after a failure). Name a direction when the idea is ambiguous (`--direction clinic`), and
recolour with `--primary #hex` when the user has a brand colour; the script refuses a primary whose white
text would fall under 4.5:1 and tells you the ratio.

## 2. What the brief says

`design-brief.md` is the one page a user, a colleague or a later session reads before touching the look:

- **Who it is for, and what one visit does** (two lines the script cannot write: fill them in from what the
  user said; one sentence each).
- **Direction**, with its reason in one line.
- **Palette**: the seeds table. Never a hex outside this table.
- **Type, spacing, shape**: the knobs.
- **Screens of the first version**: List, Detail, New; the phone rules.
- **Voice**: the four lines, in the direction's register. Change them to the product's own words; they are
  what the status bar says.
- **Icons** by role; **Logo**: a text mark until a file exists.

`design.json` is the same, machine-readable; `designkit.py moodboard design/design.json` redraws the mood
board and `theme.xml` after you edit it (a seed, a font, a voice line).

## 3. Showing it

`moodboard.html` is one page: the seeds as swatches, the derived tints the runtime will compute (hover,
border, muted text, selection) as approximations, type specimens in the direction's faces, the controls
(primary, secondary, ghost, danger, an input), a two-row list with its selection tint and the empty-state
line, and the voice. Open it in a browser, or describe it in five lines. Ask one question: this, or one of
the two nearest directions? Then stop asking about the look.

When the user has brand assets, take them here: a primary colour (`--primary`), a font name (edit
`font-display` in `design.json`; a web font is an `@import` at the top of `styles/app.css`, which costs a
network fetch on every start), a logo file (the login screen needs it as a full `https://` URL; the app's
top bar shows the name as text until then).

## 4. By hand, without the script

Copy a direction's `seeds` and `knobs` from `assets/directions.json` into a `<theme name="…" tokens="true"
dialogShadow="false">` with `<tokens>` (one element per knob), `<components>` (every component in
`components_with_token_look` with `look="token"`), `<colors>` (one `<color name="…">` per seed) and the
`<spinner>` SVG from the same file. Check each `on-` pair against its surface at 4.5:1 (relative luminance,
WCAG). Write the brief from the template above. The example app in `assets/example/` takes the theme in
place of `{{THEME}}`, and the names in place of the other placeholders (`references/layouts.md` lists them).
