---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:<order>\s*updated\s*</order>))'
# The run shows this: Sorts by updated via <order>updated</order>
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:<order>\s*updated\s*</order>))
