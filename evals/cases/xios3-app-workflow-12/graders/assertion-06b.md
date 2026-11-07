---
type: tool_order
before:
  tool: mcp__plugin_cloudbackend_cloudbackend-tenant__deploy
after:
  tool: mcp__plugin_cloudbackend_cloudbackend-tenant__verify_deployment
weight: 0.5
---

The run shows this: Uploads the local app folder, deploys to Development and verifies with verify_deployment
