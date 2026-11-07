---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:<application\b))(?=[\s\S]*?(?:<view\b))(?=[\s\S]*?(?:<process\b))'
# The run shows this: One <application> document containing a <view> and a <process>
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:<application\b))(?=[\s\S]*?(?:<view\b))(?=[\s\S]*?(?:<process\b))
