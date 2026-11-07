---
type: llm
focus: trace
---

The run shows this: Declares the desktop view first or explains that the login opens the first declared view

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Uses the runtime's login application: designkit.py app --login (or the same by hand): a <login> element with title Log in, a welcome description, button Log in, buttonColor and linkColor from the primary seed, reset (Forgot your password?), createPrompt and create (Create an account), a copyright line, logo.svg and the navy grid login-bg.svg; views and the app process onRequest, the xios://apps/login.xml process first and onLoad, the desktop view first; runs designkit.py login; says the console configurator needs a full https:// logo address and that sign-up needs the CRM before Production.
