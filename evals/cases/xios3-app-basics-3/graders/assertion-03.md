---
type: llm
focus: trace
---

The run shows this: Deployment name = host name, lowercase letters and digits

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Deploy to Development with the plugin's tenant server (upload_project, deploy, then verify_deployment) or, without it, from the Projects tab with the Deploy wizard; promoting to Staging and Production is clicks in the console's Deployments section; name = host name (lowercase letters/digits), manifest must be index.xml, deploy from home (private Development) or tenant (public Shared), promote through Staging to Production (snapshots under tenant://Deployments); configure the login page via 'Configure Login Page…' in Staging (carried to Production) or declare it in the manifest (xlink namespace, xlink:actuate=onRequest, <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>, <login> element); warns that the deployed container is publicly readable.
