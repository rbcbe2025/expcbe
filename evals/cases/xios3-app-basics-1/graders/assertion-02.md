---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:<panel\b))(?=[\s\S]*?(?:<input\b[^>]*name=))(?=[\s\S]*?(?:<button\b[^>]*name=))(?=[\s\S]*?(?:<(list|grid|iconlist|listview)\b[^>]*name=))'
# The run shows this: Components sit inside a top-level <panel>; input, button and a list/grid are named
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:<panel\b))(?=[\s\S]*?(?:<input\b[^>]*name=))(?=[\s\S]*?(?:<button\b[^>]*name=))(?=[\s\S]*?(?:<(list|grid|iconlist|listview)\b[^>]*name=))
