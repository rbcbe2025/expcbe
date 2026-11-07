---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token=\$TOKEN))'
# The run shows this: Sends Authorization: WRAP access_token=$TOKEN
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token=\$TOKEN))
