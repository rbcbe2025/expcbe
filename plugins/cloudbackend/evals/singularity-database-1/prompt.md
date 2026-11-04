---
name: singularity-database-1
tags: [singularity-database]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

I'm building a field-service app on CloudBackend. Technicians get assigned jobs; each job belongs to a customer and has a few photos and a signed PDF; customers must only ever see their own jobs, technicians see jobs assigned to them, and dispatchers see everything. Design the data model for the Singularity database — what are containers vs objects vs streams vs key/values here, where does it live (home:// vs tenant://), and how do the permissions work? Be concrete.
