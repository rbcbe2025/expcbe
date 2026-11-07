---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:SDK_iOS_Swift))'
# The run shows this: Points to the GitHub release (SDK_iOS_Swift) for download
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:SDK_iOS_Swift))
