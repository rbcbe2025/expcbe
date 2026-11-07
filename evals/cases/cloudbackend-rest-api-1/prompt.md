---
name: cloudbackend-rest-api-1
tags: [cloudbackend-rest-api, saturated]
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write me a small Python 3 script (standard library only, no requests) for the CloudBackend REST API. It should log in with a username, password and tenant from environment variables, create a container called 'invoices' under my home container, and then create an object in it named 'inv-0001.xml' whose content is <invoice><total>120</total></invoice>. Print the new container id and object id. I don't have the API docs open.
