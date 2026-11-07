---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:callMethod))(?=[\s\S]*?(?:notify))'
# The run shows this: Proposes a status line driven from the process with callMethod notify
# gave the judge's verdict on all 12 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:callMethod))(?=[\s\S]*?(?:notify))
