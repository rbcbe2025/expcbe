---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:createObject))(?=[\s\S]*?(?:temp))(?=[\s\S]*?(?:unit))'
# The run shows this: createObject with key/values temp=21 and unit=C
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:createObject))(?=[\s\S]*?(?:temp))(?=[\s\S]*?(?:unit))
