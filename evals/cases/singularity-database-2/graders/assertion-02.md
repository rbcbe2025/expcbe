---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:own [a-z ]{0,14}database|database of (its|their) own|per-identity database|private database))'
# The run shows this: Identity has its own database
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:own [a-z ]{0,14}database|database of (its|their) own|per-identity database|private database))
