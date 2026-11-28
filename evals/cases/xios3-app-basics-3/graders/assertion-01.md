---
type: llm
focus: trace
---

The run shows this: Says where deploying happens: a preview through the tenant server's deploy tool or a console project's Development tab, then Test and Live on the console's Deployments board

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Deploys a preview with the plugin's tenant server (upload_project, deploy: a Private Preview, then verify_deployment) or, in a console project, from its Development tab; testing and going live are clicks on the project's Deployments board (deployment-pipeline.md, measured 2026-11-27): Project › Test as freezes a version at a new address of its own (Test is the staging step), Mark as Verified, Make Live (Live keeps the Test address), Connect Domain; every release has a new address, so customers get the domain; name = host name (lowercase letters/digits), manifest must be index.xml; the login screen is part of the app's code: declared in the manifest (xlink namespace, xlink:actuate=onRequest, <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>, <login> element) or written there by Development › Add login screen..., set before Test as because a frozen version keeps the login it was frozen with (no card has a login action); warns that the deployed container is publicly readable.
