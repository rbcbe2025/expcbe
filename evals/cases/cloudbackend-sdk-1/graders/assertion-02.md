---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:condition_variable|waitForRsp|wait\())'
# The run shows this: Waits for the callback (condition variable / waitForRsp) before using the result
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:condition_variable|waitForRsp|wait\())
