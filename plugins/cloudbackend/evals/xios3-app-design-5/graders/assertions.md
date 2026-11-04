---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Uses Lucide: the theme gets icon="lucide"; every icon is icon://<name>?look=lucide&amp;color=...: plus on the toolbar with color=primary, check on-primary on the filled Save button, trash-2 with color=on-error on a Delete button with class xios-color-danger, and in the iconlist items clipboard-check or folder, users and settings with the primary written out as color=4338ca because a list resolves colour names against the platform theme; no IconExperience names (add, delete, folders2); mentions designkit.py icons to check.

Assertions:
- Sets icon="lucide" on the theme
- Uses Lucide names (plus, trash-2, users, settings) and no IconExperience names such as add, delete or folders2
- Adds look=lucide to the icons
- Uses on-primary or on-error for icons on filled buttons, never color=primary on a primary button
- Writes the primary colour out (4338ca) for the icons inside the iconlist
- Mentions designkit.py icons or references/icons.md
