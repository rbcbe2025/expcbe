---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:name=\"action\"))(?=[\s\S]*?(?:action=\"clear\"))'
# The run shows this: Clears the input with an action operation
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:name=\"action\"))(?=[\s\S]*?(?:action=\"clear\"))
