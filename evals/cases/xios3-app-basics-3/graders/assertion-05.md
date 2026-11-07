---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:Configure Login Page|xios://apps/login\.xml))'
# The run shows this: Login screen via 'Configure Login Page' in Staging or declared in the manifest (xios://apps/login.xml)
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:Configure Login Page|xios://apps/login\.xml))
