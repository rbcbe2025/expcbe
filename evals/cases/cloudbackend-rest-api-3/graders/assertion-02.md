---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token))(?=[\s\S]*?(?:interceptor|default header|defaultHeaders|middleware|headers))'
# The run shows this: Gives the fix: add the Authorization: WRAP access_token header (default header / interceptor)
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:WRAP access_token))(?=[\s\S]*?(?:interceptor|default header|defaultHeaders|middleware|headers))
