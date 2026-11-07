---
type: llm
focus: last_message
---

The run shows this: Names the cause: the spec declares no securityScheme / security requirement

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Diagnoses that the spec declares no securityScheme so the generated client never sends the Authorization header; the fix is to add 'Authorization: WRAP access_token=<session>' as a default header/interceptor (and optionally the Tenant header). Does not blame credentials or CORS as the primary cause.
