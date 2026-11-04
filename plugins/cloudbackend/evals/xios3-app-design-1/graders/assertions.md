---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Picks a direction (Studio for an agency board) with a reason; gives the palette as token-theme seeds (primary with on-primary, surface, on-surface, error and so on) rather than scattered colours; names the type knobs; describes list + detail on desktop and list-then-detail with Back on a phone; proposes the mood board / brief before code; asks at most one question (this direction or another).

Assertions:
- Names one of the six directions (ledger, studio, clinic, field, night or paper) and gives a reason
- Gives the palette as theme seeds with on- colours (primary and on-primary, surface and on-surface)
- Mentions the token theme or tokens="true"
- Describes the phone layout as the list first and the detail with a Back button
- Asks at most one question about the design
