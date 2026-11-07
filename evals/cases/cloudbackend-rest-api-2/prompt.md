---
name: cloudbackend-rest-api-2
tags: [cloudbackend-rest-api, saturated]
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Using curl against CloudBackend's REST API, how do I search a container (id 562958583366234) for objects whose title starts with 'report' but are not tagged draft, sorted by last update, and separately just get the count? I already have a session token in $TOKEN.
