# The login screen: what was measured

The dated measurements behind `login.md`, on Development deployments of the design kit's app with the runtime a
CloudBackend deployment boots.

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

- The sign-in page's look on plugin deployments: the boot page gives it the system type, 44 px filled fields with a
  focus ring in the button colour, a 44 px button and an 18 px card radius (measured at 375 px, 2026-11-05;
  `references/theme.md`, "The login screen").

- **What opens after sign-in**, measured with a signed-in user at 467 px: the app's first declared view (the desktop
  one, as the kit declares it) and its process. The login application does not look at a view's `screen=` query, so a
  phone never gets the phone view after sign-in. The kit's desktop view therefore adapts on a narrow screen: the process
  shows one card at a time (the list, then the detail with Back, the menu button instead of the rail), and
  `styles/app.css` lets the visible card fill the width (the runtime lays the body out in fixed grid columns). Measured
  with the desktop view at 375 px: the list filled the screen, a picked task opened full width with Back, and Back
  returned to the list.

- **The kept session**, measured 2026-11-06 on a Development deployment of the kit's app with `session="true"`, a
  signed-in user and the desktop app's browser: the sign-in wrote `:session_<tenant>` and `:expire_<tenant>`, and the
  expiry moved forward with each request; three reloads (at the browser pane's width, at 1280 px and at 375 px with phone
  emulation) opened the app straight away with no sign-in page; Sign out (then still with the runtime's confirm) removed
  both keys and brought the sign-in page back. Session state is per browser: a sign-in in one browser does not carry to
  another.

Not measured yet:

- **Sign out with `silent="true"`**: the runtime's code calls the same logout without the dialog; the run with a
  signed-in user is still to come.

- **Sign-up and reset on a tenant without the CRM.** The flows send e-mail through the tenant's CRM. Keep both links,
  and set up the CRM before Production (cloudbackend-saas-launch, step 4).
