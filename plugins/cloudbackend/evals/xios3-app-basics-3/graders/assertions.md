---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Deploy from the Projects tab with the Deploy wizard; name = host name (lowercase letters/digits), manifest must be index.xml, deploy from home (private Development) or tenant (public Shared), promote through Staging to Production (snapshots under tenant://Deployments); configure the login page via 'Configure Login Page…' in Staging (carried to Production) or declare it in the manifest (xlink namespace, xlink:actuate=onRequest, <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>, <login> element); warns that the deployed container is publicly readable.

Assertions:
- Deploy from the Projects tab / Deploy wizard
- Manifest must be named index.xml
- Deployment name = host name, lowercase letters and digits
- home → private Development, tenant → public Shared; promote to Staging then Production
- Login screen via 'Configure Login Page' in Staging or declared in the manifest (xios://apps/login.xml)
- Warns that the deployed container is publicly readable
