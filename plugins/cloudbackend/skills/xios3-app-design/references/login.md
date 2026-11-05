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

`python3 scripts/designkit.py app --design design/design.json --out app --login` does all of it: the `<login>` element,
`logo.svg` (a text mark in the display face, light on the dark page), `login-bg.svg` and the wiring.
`--login-page light` draws a pale grey grid page instead. `python3 scripts/designkit.py login app` checks the result and
exits 1 if any part is missing. `design/login.xml` (from `brief`) is the element on its own, to paste by hand.

## The element

```xml
<login>
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

The login application also reads `support`, `eula`, `view` (a login view of your own), `username`, `password`, and titles,
descriptions and buttons for its pages under `signup`, `recovery` and `newPassword`. Their defaults read well
("Create your account", "Reset your password"), and none of them is measured yet; leave them out until one is.

The colour on the card is the theme's primary seed, darkened until it reads at 4.5:1 on white, because the card is white
on every page. The `<theme>` does not reach the login screen: the login application paints it before the app opens.

## Measured

2026-11-05, on a Development deployment of the kit's app, with the runtime a CloudBackend deployment boots:

- The sign-in page showed the logo, "Log in", the welcome line, "Email or Username" and "Password" with a show button,
  "Forgot your password?", the "Log in" button in the primary colour, "Don't have an account? Create an account", and the
  copyright line, on the navy grid page.
- **Create an account** opened the sign-up page: first and last name, e-mail, username, a password of at least 16
  characters, repeated, and "Already have an account? Sign in". **Forgot your password?** opened "Reset your password"
  with "Send Reset Link" and "Back to Sign In". Both pages kept the page, the logo and the colours.
- A `logo` and a `background` that name a file next to `index.xml` rendered: the login application resolves them
  against the app. The console's Login Configurator was not re-measured; give it a full `https://` address to the logo,
  as the launch path's step 3 says.
- The card is 470 px wide, so on a phone narrower than that it runs off the screen. The boot page that the CloudBackend
  plugin's tenant server and the deploy connector write carries a short script that gives each view frame one rule, and
  with it the card fits the screen 12 px from each edge on the sign-in, sign-up and reset pages (measured at 375 px).
  A deployment made with the console's Deploy Wizard has the console's boot page and keeps the overflow. The real fix,
  a responsive card, is the login application's and has been reported to XIOS/3.
- Without a published `Tenant` container, the login's lookup of the tenant's licence text answers 404 in the browser
  console. The screen works.
- Every load logs one `TypeError ... reading 'style'` from `Utils_applyIEEmulation` in the browser console, with or
  without the plugin's boot page script (3 of 3 loads each way). It is the runtime's, reported to XIOS/3; the screen
  works. Do not chase it as an app error.

- **What opens after sign-in**, measured with a signed-in user at 467 px: the app's first declared view (the desktop
  one, as the kit declares it) and its process. The login application does not look at a view's `screen=` query, so a
  phone never gets the phone view after sign-in. The kit's desktop view therefore adapts on a narrow screen: the process
  shows one card at a time (the list, then the detail with Back, the menu button instead of the rail), and
  `styles/app.css` lets the visible card fill the width (the runtime lays the body out in fixed grid columns). Measured
  with the desktop view at 375 px: the list filled the screen, a picked task opened full width with Back, and Back
  returned to the list.

Not measured yet:

- **Sign-up and reset on a tenant without the CRM.** The flows send e-mail through the tenant's CRM. Keep both links,
  and set up the CRM before Production (cloudbackend-saas-launch, step 4).
