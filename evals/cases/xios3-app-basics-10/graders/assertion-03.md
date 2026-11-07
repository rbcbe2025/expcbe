---
type: llm
focus: last_message
---

The run shows this: Explains that some components keep a legacy look under a token theme alone, so the stylesheet styles them

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: Gives the app a theme that covers every component: every component look="token" in the theme's components (not only the ones used), the view component loading ui/DesignKit/theme.css (designkit.py writes both); explains that several components (accordion, toggle, radio, panel, dialogs) keep a legacy look under a token theme alone, which the kit's stylesheet covers through the runtime's --xc-* hooks and class rules, reading only the theme's tokens; Apple-style choices on a Tailwind-like scale: system type, 44 px touch targets, a phone breakpoint; rows of buttons as dk-wrap; dialogs carry the platform's theme (the plugin's boot page brings the app's theme in) or an in-app panel instead; runs designkit.py check.
