---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:(?:acme\.db\.cloudbackend\.com)|(?:\{tenant\}\.db\.cloudbackend\.com)))'
# The run shows this: Identity sign-in address
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:(?:acme\.db\.cloudbackend\.com)|(?:\{tenant\}\.db\.cloudbackend\.com)))
