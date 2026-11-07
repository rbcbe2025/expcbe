---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:name=\"database\"))(?=[\s\S]*?(?:home://Notes))(?=[\s\S]*?(?:<create\b[^>]*type=\"object\"))'
# The run shows this: Creates the object with the database operation: <create type="object"> under home://Notes
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:name=\"database\"))(?=[\s\S]*?(?:home://Notes))(?=[\s\S]*?(?:<create\b[^>]*type=\"object\"))
