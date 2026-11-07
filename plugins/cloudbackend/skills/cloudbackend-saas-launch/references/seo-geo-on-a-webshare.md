# SEO and GEO on a webshare — what works, what cannot

Hand-written, 2026-11-04, from the developer portal's own deployment on a CloudBackend webshare
(measured 2026-09-26 to 28). A XIOS/3 application is a single page that boots the runtime; the share that
serves it has rules a crawler or an answer engine meets before the app does. Decide the stance at W1 and
do the work at W6.

## The stance

| App | Public surface | What to do |
| --- | --- | --- |
| Behind a login | none: a crawler sees the login screen | `llms.txt` and the `<about>` title; nothing else is reachable, so promise nothing |
| Public, one page | the boot page and what the app renders after boot | the list below |
| Public with articles or products | the same, plus a file per public item | mirrors as files (below) and a sitemap of real files |

## What a webshare does, measured

- **Every unknown path answers 200 with the boot page.** There are no true 404s and no prerendering: a
  crawler that asks for `/about` gets the same boot page as `/`. Status-based checks and "soft 404"
  audits read every path as a page.
- **The host's `robots.txt` is the host's.** A share does not serve its own. The host disallows every path
  beginning with `xios`, so a deployment prefix starting with `xios` is closed to search engines (the
  portal's SEO score is 63 on every such route for that reason alone); lint G18 refuses the prefix.
- **A root `llms.txt` is served when it is a real file.** When it is not, the path answers the boot page,
  which an agentic-browsing audit scores as missing. The build writes it; `verify_deployment` reports
  `real`, `fallback` or `missing`.
- **Text files are served with the type and charset the host chose**, so a file an engine should read as
  text must be ASCII or carry its own declaration (G09).
- **Files are revalidated on every visit** (`private, max-age=0`); the runtime's own files are cached by
  its host. Keep the public file count low.

## What works

1. `llms.txt` at the root: what the app is, for whom, the public pages as a list, where the manual is.
2. `<about>` in the manifest: title and description; the view titles for each public screen. These are
   what the boot page and the runtime expose; the deploy tool's `index.html` is not yours to edit.
3. Plain-text or Markdown mirrors of public content as files in the container (`docs/manual.md`, a file
   per public article), linked from `llms.txt`: an answer engine reads a file where it cannot run the app.
4. A sitemap that lists real files only; never a path that answers with the boot page.
5. A connected domain, before anyone indexes a `cloudbackend.cloud` host that dies on the next promotion.
6. Speed Index, not LCP, as the number to improve (verification-checklist.md, "Lighthouse").

## What cannot be promised

Prerendered HTML per route, true 404s, per-route meta tags, structured data on routes, hreflang per path.
Say so at W1 in one line; an app that needs them is published behind a static site or a server that
renders, with the XIOS/3 app as the signed-in part.
