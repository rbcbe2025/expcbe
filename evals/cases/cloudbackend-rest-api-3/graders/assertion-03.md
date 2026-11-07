---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?![\s\S]*?(?:(?:(most likely|the problem is|the cause is)[^.]{0,60}(wrong (password|credentials)|CORS|expired))))'
# The run shows this: Does not attribute the failure primarily to wrong credentials, CORS or token expiry
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?![\s\S]*?(?:(?:(most likely|the problem is|the cause is)[^.]{0,60}(wrong (password|credentials)|CORS|expired))))
