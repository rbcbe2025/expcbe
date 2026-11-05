---
type: llm
focus: trace
---

The run shows this: Uses on-primary or on-error for icons on filled buttons, never color=primary on a primary button

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Uses Lucide: the theme gets icon="lucide"; every icon is icon://<name>?look=lucide&amp;color=...: plus on the toolbar with color=primary, check on-primary on the filled Save button, trash-2 with color=on-error on a Delete button with class xios-color-danger, and in the iconlist items clipboard-check or folder, users and settings with the primary written out as color=4338ca because a list resolves colour names against the platform theme; no IconExperience names (add, delete, folders2); mentions designkit.py icons to check.
