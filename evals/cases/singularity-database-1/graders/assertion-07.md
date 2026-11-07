---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:Settings/Datatypes))'
# The run shows this: Mentions where datatypes are stored: tenant://Settings/Datatypes
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:Settings/Datatypes))
