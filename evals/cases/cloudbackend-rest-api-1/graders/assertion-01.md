---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:/login\b))(?=[\s\S]*?(?:basic|b64encode|base64))'
# The run shows this: Logs in with POST /login using HTTP Basic credentials
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:/login\b))(?=[\s\S]*?(?:basic|b64encode|base64))
