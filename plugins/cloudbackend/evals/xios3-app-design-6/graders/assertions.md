---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Uses the runtime's login application: designkit.py app --login (or the same by hand): a <login> element with title Log in, a welcome description, button Log in, buttonColor and linkColor from the primary seed, reset (Forgot your password?), createPrompt and create (Create an account), a copyright line, logo.svg and the navy grid login-bg.svg; views and the app process onRequest, the xios://apps/login.xml process first and onLoad, the desktop view first; runs designkit.py login; says the console configurator needs a full https:// logo address and that sign-up needs the CRM before Production.

Assertions:
- The <login> element sets both create and reset, so sign up and forgot password always show
- Sets title, description and button text in the CloudBackend PaaS sign-in's voice (Log in, a welcome line)
- Uses the primary colour for buttonColor and linkColor
- Wires the login: views and app process onRequest, the login process declared first with onLoad
- Declares the desktop view first or explains that the login opens the first declared view
- Mentions designkit.py login or references/login.md
