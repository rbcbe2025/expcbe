---
name: cloudbackend-sdk-1
tags: [cloudbackend-sdk]
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Using the CloudBackend C++ SDK on Ubuntu, write a program that logs in (username/password/tenant from argv), creates a container named 'sensors' in my root container, then creates an object 'reading-1' in it with key/values temp=21 and unit=C, and finally queries the container and prints each item's name. Use the SDK's async delegate pattern properly — I've been bitten by using results before the callback fired.
