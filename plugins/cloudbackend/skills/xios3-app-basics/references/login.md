# The login screen: sign in, sign up and forgot password

Every app this skill designs with a login offers all three ways in: **sign in**, **sign up** and **forgot password**.
It uses the runtime's own login application, which has the shape of the CloudBackend PaaS sign-in at
dashboard.cloudbackend.com: the logo above a white card, the labelled fields, one full-width button, and its own sign-up
and password-reset pages in the same design. This page says how to set it up, what to write, and what was measured.

## The three rules

1. **Always all three.** The sign-up link shows only when `<create>` is set, and the forgot-password link only when
   `<reset>` is set. Set both, every time, with `<createPrompt>` before the sign-up link.
2. **The CloudBackend PaaS sign-in's look.** A deep navy page with a faint grid behind the card (`login-bg.svg`), the
   app's logo above it, the title "Log in" and a welcome line, and the app's primary colour on the button and the links.
3. **Wired so nothing opens before sign-in.** The app's views and process are `xlink:actuate="onRequest"`, the login
   application's process is declared first with `onLoad`, and the desktop view is declared first.
4. **Signed in across reloads, with a way out.** `<login session="true">`, and a visible Sign out in the app.

`python3 scripts/designkit.py app --design design/design.json --out app --login` does all of it: the `<login>` element,
`logo.svg` (a text mark in the display face, light on the dark page), `login-bg.svg` and the wiring.
`--login-page light` draws a pale grey grid page instead. `python3 scripts/designkit.py login app` checks the result (the
three ways in, the texts, the logo and page, the wiring, `session="true"` and a visible Sign out) and exits 1 if any part
is missing. `design/login.xml` (from `brief`) is the element on its own, to paste by hand.

## The element

```xml
<login session="true">
  <background dark="true">login-bg.svg</background>
  <logo>logo.svg</logo>
  <title>Log in</title>
  <description>Welcome back. Log in to Planboard.</description>
  <button>Log in</button>
  <buttonColor>#4338ca</buttonColor>
  <linkColor>#4338ca</linkColor>
  <reset>Forgot your password?</reset>
  <createPrompt>Don't have an account?</createPrompt>
  <create>Create an account</create>
  <copyright>Copyright &#169; 2026 Planboard AB</copyright>
</login>
```

| Element | What it does | Source |
| --- | --- | --- |
| `background` | the page behind the card: an image, a colour, or two colours for a bottom-up gradient; `dark` sets the text colour on the page | manual |
| `logo` | the logo above the card | manual |
| `title`, `description` | the card's heading and the line under it | manual |
| `create`, `reset` | the sign-up and forgot-password links, with their texts | manual |
| `copyright` | the line under the card | manual |
| `client` | which client gathers the metrics; not shown | manual |
| `button` | the sign-in button's text (default "Sign in") | the login application's code, measured |
| `buttonColor`, `linkColor` | the button's and the links' colour (`linkColor` falls back to `buttonColor`) | the login application's code, measured |
| `createPrompt` | the line before the sign-up link | the login application's code, measured |
| `session="true"` (attribute) | keeps the sign-in across reloads | the runtime's code (below) |

## Staying signed in

The login application hands the attribute to the CloudBackend channel as `<login session="…">`. With `true`, the
runtime's authenticator stores the session the sign-in returns in the browser's `localStorage` (`:session_<tenant>`, with
`:expire_<tenant>` seven days ahead), moves the expiry forward on every request, and on the next load resumes the stored
session instead of showing the sign-in page; a rejected session brings the sign-in page back. Its logout removes both
keys. Without the attribute nothing is stored, so every reload signs the user out (read in the runtime's `system.js`,
2026.6.0, on 2026-11-05).

Two consequences for the app. It needs a visible **Sign out**: the example carries a `signOut` button (hidden until the
login option reveals it) whose step runs the runtime's logout (`<operation name="system"><logout silent="true"/></operation>`),
which ends the session and brings the sign-in page back. Without `silent="true"` the runtime first asks "Log Off? Do you
really want to log off?" in a dialog of its own, in words that do not match a Sign out button. And a shared computer keeps the user signed in for up to a week of
use, which belongs in the app's help text when it matters.

The login application also reads `support`, `eula`, `view` (a login view of your own), `username`, `password`, and titles,
descriptions and buttons for its pages under `signup`, `recovery` and `newPassword`. Their defaults read well
("Create your account", "Reset your password"), and none of them is measured yet; leave them out until one is.

The colour on the card is the theme's primary seed, darkened until it reads at 4.5:1 on white, because the card is white
on every page. The `<theme>` does not reach the login screen: the login application paints it before the app opens.

## Measured

Every rule above was measured on a deployment (2026-11-05 and 2026-11-06): the three pages, the logo and page
resolving against the app, the 470 px card and the boot page's phone fix, what opens after sign-in, and the kept
session across reloads. `login-measured.md` has each measurement with its date and what is not measured yet
(Sign out with `silent="true"`; sign-up and reset without the CRM).
