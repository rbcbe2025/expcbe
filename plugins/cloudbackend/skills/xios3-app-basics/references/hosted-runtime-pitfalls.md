# Pitfalls measured on the hosted runtime (2026.6.0)

Found while building and publishing a large XIOS/3 application that boots the hosted runtime from a `boot.js` page
and is served from a CloudBackend webshare. Some never show on your own machine (the start-step race, the host's
headers and fallbacks); the rest show anywhere but are easy to miss. SKILL.md "Pitfalls" has one line per item;
this page has the detail and the fix.

- **Declare the runtime's frame in your boot page.** If the page has no `<iframe id="win">`,
  `boot.js` 2026.6.0 creates one whose document arrives asynchronously. As soon as `system.js`
  has loaded, it adjusts that document. If that comes first, start-up fails with "Cannot read
  properties of null (reading 'style')", and the page stays on its loading screen. In testing it
  failed in most cold loads, and preloading `system.js` makes it likelier. Declare
  `<iframe id="win" name="win" title="..."></iframe>` with no `src` after your loading message, and
  follow it with `<script>boot.win = document.getElementById("win").contentWindow;</script>`. Size it
  in CSS (absolute, full size, no border), and keep anything the reader must click, such as a
  "Try again" link, above it with `z-index`.
- **A `<process>` with `<script href>` children needs an XML `<step id="start">`.** In 2026.6.0 each
  export of such a script can be run as a step with `call`. Without a start step the runtime starts
  importing the script when the process starts, and a `call` to one of its functions made before the
  import has finished is skipped. Nothing is logged; the first sign is whatever the function should
  have produced going missing, for example a later "Alias is not defined" warning. Add
  `<step id="start"><alias name="myProcess" value="started"/></step>`. If you use a `step=` attribute
  on `<process>` instead, do not also run that step from a `Loaded` trigger, or it runs twice.
- **Failures can be quiet.** A failed asynchronous operation does not stop the step, and the step's
  `error=` handler does not run for it — check the result (an alias or a document the step should have
  produced). A JavaScript step that throws is different: the error is logged, but the calling step never
  continues, so catch errors inside your JavaScript steps.
- **Render stylesheets:** use `xsl:for-each` with `xsl:call-template` for lists — `xsl:apply-templates`
  over many nodes is far slower in the runtime's XSLT engine — and emit no `<br/>`, which becomes two
  line breaks.
- **Links inside a `render` are handled by the render, not the browser.** In 2026.6.0 a click on an
  element with an `href` and no `target` is cancelled and does not bubble on. If the render has a
  `Select` trigger, the `href` goes to it; otherwise an `http(s)`, relative or `#section` link does
  nothing. A link with a `target` is followed, but its target is rewritten to `_blank`. The `download`
  attribute is ignored, so a download link does nothing (only an `href` containing `?dl=` is let
  through), and Ctrl/Cmd-clicks are cancelled too. Give outside links `target="_blank"`. For in-page
  anchors, downloads and modifier-clicks, add a `click` listener in the capture phase on the render's
  document, which runs before the render sees the click: scroll to the anchor yourself, and start a
  download from an `<a download>` you create but never insert (`a.click()`). Test it by clicking the
  link and checking that a download begins, not that the link exists.
- **Publishing to a webshare:** the host labels a text file's charset from its content (ASCII files as
  ISO-8859-1, UTF-8 files as UTF-8), and other encodings of XML, XSL, CSS and JavaScript were not
  verified there, so keep those files ASCII (character references in XML and HTML, `\u` escapes in
  JavaScript); an `index.html` can start with a UTF-8 byte-order mark. An unknown path answers `200` with
  your `index.html`, so check a loaded document's content, not its status, and publish a real
  `/llms.txt`. A folder path (`/<folder>/`) answers a listing of its files, so publish nothing you would
  not list. The top-level `/xios/` path belongs to the host, which serves its own XIOS/3 runtime there;
  do not put your own files under it. The host's `robots.txt` (`Disallow: /xios`) matches every path
  that begins with those letters, so pages under `/xios3/` or `/xios-docs/` are not indexed by search
  engines. Choose a URL prefix that does not start with `xios`.
- **Announce your app's files from the boot page.** A webshare makes the browser revalidate every file on
  every visit, and the runtime discovers files one after another (the manifest, then the processes, the
  views, the skins, the styles, the modules, the data), so a warm load is a chain of round trips. List
  them in the boot page's `<head>`: `<link rel="preload" href="..." as="fetch" crossorigin>` for what the
  runtime fetches itself (XML, XSL, CSS, data) and `<link rel="modulepreload">` for your components and
  their imports. The runtime reuses these responses, so nothing is fetched twice. In our testing this
  more than halved the time to a warm page.
- **Test with network latency**, not only on your own machine — for example a local server that
  delays each response by 250 ms. Ordering problems between documents and scripts only show up there.
- **Test drag and drop with the button held.** The runtime starts a drag only once the mouse button
  has been down for 250 ms. A browser-automation drag that presses, moves and releases at once never
  starts one, and the test then reports drag and drop as broken. Press, wait longer than that, move in
  steps, then release.
- **Icons:** prefer Lucide, the collection the runtime ships (ISC licence, monochrome, recoloured from the
  theme): `icon="lucide"` on the theme, then `icon://<name>?look=lucide&color=<colour>` on every icon, the
  `on-` colour on a filled button. Lucide names are lower case with hyphens (`plus`, `trash-2`); an
  IconExperience name such as `folders2` draws nothing under the Lucide theme. `icons.md`
  has the names by role and what was measured on a deployment. Do not ship a whole
  icon font for a few dozen icons (one common symbol font is 3.7 MB). The IconExperience collections need a
  licence to publish on your own domain (use through the CloudBackend service is covered, per the docs).
- **Layout stability:** reserve space for anything that renders after the first paint, never paint a
  footer before the content above it, and give icons fixed dimensions.
- **Previewing markup inside your application:** a webshare answers with `X-Frame-Options: DENY`, so
  no page on it can be framed by URL, not even by your own application; it works on your own machine,
  which hides the problem. Frame a `blob:` document instead: it has your page's origin and no framing
  header, and it can boot the runtime with the markup as its inline startup document. Running a
  runtime inside a frame is not a supported mode in 2026.6.0. The runtime treats the outer page as its
  top window, so dropdowns, menus and dialogs open in the outer page, at the outer page's coordinates.
  Opening the same `blob:` page in a new tab needs no workaround, because there the runtime is the top
  window.
