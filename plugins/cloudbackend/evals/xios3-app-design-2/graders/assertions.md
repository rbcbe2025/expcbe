---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Replaces the inline colours with a token theme in the manifest (seeds and knobs, components with look="token", a spinner), the panel becomes class="xios-card", the label class="xios-type-label"; says why a hex in the view stops following the theme; keeps the component names.

Assertions:
- Removes the hex colours from the view
- Adds a theme element with tokens="true"
- Uses class="xios-card" on the panel
- Uses class="xios-type-label" on the label
- Mentions look="token" for the components
