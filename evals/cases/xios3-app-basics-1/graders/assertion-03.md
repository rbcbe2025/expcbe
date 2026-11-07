---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:<trigger\b[^>]*view=[^>]*component=[^>]*event=\"Select\"[^>]*step=|<trigger\b[^>]*event=\"Select\"))'
# The run shows this: Trigger uses view/component/event="Select"/step attributes
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:<trigger\b[^>]*view=[^>]*component=[^>]*event=\"Select\"[^>]*step=|<trigger\b[^>]*event=\"Select\"))
