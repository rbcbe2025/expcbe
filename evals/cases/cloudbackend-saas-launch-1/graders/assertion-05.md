---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:(?:no role)|(?:without (a|any) role)|(?:no console role)|(?:not (be )?(assigned|given) (a|any) role)))'
# The run shows this: Customers get no console role
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:(?:no role)|(?:without (a|any) role)|(?:no console role)|(?:not (be )?(assigned|given) (a|any) role)))
