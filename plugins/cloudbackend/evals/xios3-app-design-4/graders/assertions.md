---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Starts from the clinic direction, sets primary (and darkIcon) to #2563eb, checks on-primary white against it at 4.5:1 (it passes), puts Inter in font-sans/font-display with a system fallback and says a web font costs a fetch on every start (an @import in app.css), keeps the rest of the seeds; gives the theme element.

Assertions:
- Uses the clinic direction or says why another fits
- Sets primary to #2563eb and darkIcon to match
- Mentions the contrast check for on-primary
- Puts Inter in the font knobs with a fallback stack
- Gives a complete theme element with tokens="true", colors, tokens and a spinner
