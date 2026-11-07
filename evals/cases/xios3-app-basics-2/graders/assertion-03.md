---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:#[A-Za-z][A-Za-z0-9_]*#[A-Za-z][A-Za-z0-9_]*))(?=[\s\S]*?(?:\{\$|\{!))'
# The run shows this: Uses the manual's #view#component expression form (not a slash) and explains {$alias} / {…} expressions
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:#[A-Za-z][A-Za-z0-9_]*#[A-Za-z][A-Za-z0-9_]*))(?=[\s\S]*?(?:\{\$|\{!))
