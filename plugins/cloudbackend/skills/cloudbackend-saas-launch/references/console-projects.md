# A product as a project in the console: design, website, docs and the app

Hand-written, measured 2026-11-26 in the CloudBackend PaaS console's **Projects** section, on a throwaway project.
Use it when the work goes through the console instead of the plugin's tenant server (Claude Desktop chat,
claude.ai), or when the owner wants a website and user docs beside the app. Every line here is **console**: a
click path, no API. Labels are quoted as the console shows them; where a screen differs, the console wins, and the
difference goes into the context file's `## Decisions`.

## Rules for this section

- **Nothing is public until a deployment.** The website, the docs and the app are served only after a deployment
  that includes them; the editors' previews are private, but a **Private Preview** link opens for anyone who has
  it (only you can sign in). A deployment is the owner's word, each time.
- **Promise only what works today**, on the website, in the docs and in the app's own labels. Legal, privacy,
  pricing and compliance wording stays **Draft** until the owner or an expert confirmed it.
- **Change only what you were asked to.** Removing a section, block, page or file asks to confirm and is
  permanent: read the name in the confirmation, and ask the owner first.
- **The look is the owner's call.** Offer two or three directions in the live preview, save only the one chosen.
- **The user picks files.** Upload buttons open the system's file picker; ask the user to pick, naming the exact
  folder.

## 1. The project

**Projects › New Project** asks for the kind first; the choice decides the tabs and can be changed later from the
selector next to the name, without losing anything:

| Kind | Tabs it is for |
| --- | --- |
| **SaaS or App** | brand, roadmap, personas, website and docs, plus Development |
| **Database and Analytics** | design, docs and files; no marketing, roadmap or development tabs |
| **Development** | source, roadmap, pricing, statistics, design and docs; no personas or website |

Then: **Project name** (letters, digits, spaces and hyphens), **Your alias in the project**, **Project image**
(**Icon...**, **From database...**, **Upload...**; in the icon picker a click and **Select** works), **Short
description** (the project card, search, and the website's hero tagline) and **Long description**. **Create** opens
the project: Overview, Design, Development, Website, Docs, Deployments, Roadmap, Personas, Files, Mail.

- **The name cannot change.** **Edit...** has no name field, and the name is the project's database: a new app's
  `<path>` is `<project-name>://`. Settle it with the owner before **Create**.
- **Edit... opens with both descriptions empty, and Save stores them empty** (measured: the card then said "No
  description yet"). Retype the short and long description every time you save it.
- **Archive...** hides the project and deletes nothing; **Reactivate** brings it back. **Delete...** appears only on
  an archived project.

## 2. Design

The **Design** tab holds the project's themes. **Editing** picks one (**New...**, **Rename...**); a theme that
nothing uses says "Not used by the website, the docs or any app". The Website and Docs tabs each pick their theme in
their **Themes** panel; an app picks one in Development (section 5). **Save** stores it, **Revert** undoes; the
**XML** view next to **Theme** shows the source.

| Group | Controls |
| --- | --- |
| Theme | **Light** or **Dark**: one appearance per theme. **Start from a preset**: Surprise me, Cobalt, Ultraviolet, Press, Acid, Bubblegum, Ink |
| Colour | **Brand colour** (the rest derive from it), **Shuffle**, **Accent colour**, **State colours** (Error, Warning, Success), **Make readable**, **Contrast** (WCAG) |
| Surface | Neutral, Warm, Cool, Tinted |
| Type | **Personality**: Geometric, Editorial, Brutal, Rounded, Neutral. **Font**: one for headings and text, from a list or **Upload font...** (.woff2, .woff, .ttf or .otf, up to 400 KB) |
| Geometry | **Base size** S/M/L · **Radius** None/S/M/L · **Density** Compact/Comfortable/Spacious · **Elevation** Flat/Soft/Hard/Glass · **Border** Hairline/Regular/Bold |
| Logo | horizontal logo and square symbol (**Upload...**); addresses for mails (a public `https://` PNG or JPG: Gmail and Outlook show no SVG); size; description |
| Words | **Brand story**, **Copyright** (the website's footer), **Mood board** |

Owner's words to controls: *calm, professional*: Light, Neutral or Cool, Neutral or Geometric, Radius M, Comfortable.
*Friendly*: Light, Warm, Rounded, Radius L, Spacious. *Technical*: Dark or Light, Cool, Geometric, Radius S, Compact,
Border Regular. *Premium*: Neutral, Editorial, Base size L, Spacious, Border Hairline. The brand colour always comes
from the owner. Normal text needs **4.5:1**; 3:1 is enough only for large text, icons and field borders. **Make
readable** fixes the state colours. Check the Font row after a Personality: a preset can choose a serif nobody asked
for.

## 3. Website

**Start from a template**: Software product, Mobile app, Services or Developer platform. **Every template ships
invented content.** Software product has "10k+ teams", "99.9% uptime", "5 min", a quote by "Name, company" and
"try it free for 30 days". Overwrite or remove every one of them.

- **The hero** is the project's name and short description.
- **Sections** (**+ Section**): Text, Banner, 3 Boxes, 6 Boxes, Grid, Custom. A section's card opens its dialog on
  a **double-click**; a single click only selects it.
- **Blocks**, inside the section dialog: pick a template (Card, Feature, Stat, Quote, Image, Button), then **Add
  block**. Its form (title, text, icon, **Link for a button**: `https://` or `mailto:`) is open **only right after
  Add block**. Picking an existing block opens no form, so a link cannot be changed later: remove the block and add
  it again. Before the first deployment the app has no address; leave buttons to it out until then.
- **Preview** is the live page: double-click a text to change it, drag a section or block to move it. Edit one text
  at a time and check it before the next.
- **Turn off...** leaves the website out of the next deployment; it keeps what is there.

## 4. Docs

**+ Page**: Title, **Category** (Onboarding, Guides, Reference, Support), **Status** (Draft, Published, Stale),
Content. A new page starts as **Guides / Draft**: set both.

- The marks: `## Heading` (`###`, `####` smaller), `- item`, `1. item`, a paragraph starting `Note:`, `Tip:`,
  `Warning:` or `Rule:` becomes a note, code between ``` fences. The page cards show the marks as typed; the
  preview renders them.
- **The menu lists categories in the order their first page was created.** Create every Onboarding page first,
  then Guides, Reference, Support.
- **Published** only what is true today; **Draft** for a planned feature, pricing, legal or privacy wording, and
  placeholders. Each card has **Publish**; the preview marks Draft pages with a badge.
- A small product needs 8 to 14 pages: Onboarding ("Get started: your first <thing>"), a Guide per task, Reference
  for the rules and calculations the product applies, Support (FAQ, payment, privacy, contact). **Write pages** and
  **Suggest pages** (AI) need an app in Development. The Docs tab has its own **Turn off...**.

## 5. The app in Development

With no app yet: **New app...** names it (its folder is `Development/<app>/`) and starts from **Empty app**, **Hello
World** or **Import app...**, which copies an app's folder from any drive into Development. Every template creates
`index.xml`, `views/` and `processes/` with a first view and process, `layout/style.css`, `locale/en_US.xml` and an
empty `images/`. **Upload app...** takes a folder from the user's computer.

With an app:

- The tree's right-click menu: **New file**, **New Folder**, **Upload files...**, **Upload folder...**, **Rename**,
  **Delete...**. The file panel: **Open in Codepad...**, **Download**, **Delete...**. The editor: **Save**, **Find**,
  **Go to line**, **Format**; it does not complete closing tags.
- **Validate** runs the console's verification over the app's files ("No errors found"). It is not the tenant
  grammar: run `lint_project` too where the build server is connected, and fix every error first.
- **Add login screen...** opens **Configure Login**: Branding, Sign In, Sign Up, Password Reset, Verify (logo
  address, background, button and link colours, copyright, support email). xios3-app-basics `login.md` decides
  what goes in. Save writes it into the app's `index.xml`; it is the only login setting, so set it before **Test as**.
- The theme menu: **Its own theme** (kept in the app) or one of the project's themes. An app built with the
  xios3-app-basics design kit keeps its own theme; give the website and docs the matching project theme instead.
- **Preview app** runs it from Development without publishing.

**One app, one route.** The plugin's tenant server uploads to the account's own drive (`deploy-rules.md`); an app
made here lives in the project's database. Do not build the same app both ways.

## 6. Deployments

The project's **Deployments** tab is a pipeline: **My Code** (only you see it), **Private Preview** (only you can
sign in), **Project** (the project's main version), **Test** (frozen versions being tested), **Live** (tested
versions users see). A new app appears under Project as version 1.1.

The path: Project › **Test as 1.1** (a new address per version) › **Mark as Verified** › **Make Live** (answer **Go
live?**; the address stays) › **Connect Domain** (`A` record `83.140.241.4`). Every release gets a new address, so
customers get the domain. Each card's actions, every dialog and what each click does to the address, measured
2026-11-27: xios3-app-basics `deployment-pipeline.md`. Each move is the owner's word, and after every one run
`verify_deployment` or open the address yourself: the badge is the test status, not proof that an address answers.

## Not measured on 2026-11-26

Whether a free tenant still stops at five projects (each project is a group); the exact contrast at which the badge
says AA; whether **+ Add block** in the live preview gives a block a form; what choosing a project theme writes into
an app.

## Report to the owner

**Done** (project, theme settings, pages per category with which are Draft and why, website sections, app files,
the preview), **not done** (deployment, button links, placeholders), **gaps** (what the console could not do, with
the workaround), and **claims to check** before anything goes public.
