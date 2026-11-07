---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token=))'
# The run shows this: Extracts the session token and sends 'Authorization: WRAP access_token=' on later calls
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token=))
