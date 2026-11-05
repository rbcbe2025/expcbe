---
name: cloudbackend-rest-api-3
tags: [cloudbackend-rest-api]
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

We generated a TypeScript client from the CloudBackend OpenAPI spec with openapi-generator. Login works and returns a session, but literally every other call comes back 401 Unauthorized. The docs say the API works. What's going on and what's the fix?
