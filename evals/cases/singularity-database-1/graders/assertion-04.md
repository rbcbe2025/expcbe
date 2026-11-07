---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:datatype))(?=[\s\S]*?(?:key/?value))'
# The run shows this: Uses a datatype/schema on the jobs container so key/values are columns
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:datatype))(?=[\s\S]*?(?:key/?value))
