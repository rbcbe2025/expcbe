---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: One reply: at most three questions (none re-asking the tenant or the idea), then an eight-line plan card of defaults ending with 'reply to change any of these; otherwise I go on'; creates cloudbackend-launch.md with ## App and ## Build; says W0 is open and that list_projects will prove the connector; never asks for a password or a token.

Assertions:
- Asks at most three questions in the opening round
- Does not re-ask the tenant name or the idea
- Sends the plan card in the same reply as the questions
- The plan card names a deployment name of lowercase letters and digits and says Development first
- The plan card says the React twin is off and the benchmark is measured plus reference
- Writes or shows cloudbackend-launch.md with ## App and ## Build sections
- Does not ask for a password, token or API key
