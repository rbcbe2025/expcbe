---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:cloudbackend\.com/docs/swift))'
# The run shows this: Points to the Xcode docs at cloudbackend.com/docs/swift
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:cloudbackend\.com/docs/swift))
