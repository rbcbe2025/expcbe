---
type: llm
focus: trace
---

The run shows this: Deploy from the Projects tab / Deploy wizard

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Deploy from the Projects tab with the Deploy wizard; name = host name (lowercase letters/digits), manifest must be index.xml, deploy from home (private Development) or tenant (public Shared), promote through Staging to Production (snapshots under tenant://Deployments); configure the login page via 'Configure Login Page…' in Staging (carried to Production) or declare it in the manifest (xlink namespace, xlink:actuate=onRequest, <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>, <login> element); warns that the deployed container is publicly readable.
