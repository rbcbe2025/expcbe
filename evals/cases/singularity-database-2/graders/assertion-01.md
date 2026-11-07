---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:\bowner\b))(?=[\s\S]*?(?:tenant))'
# The run shows this: Tenant = top-level group created with the Owner account, owns databases and identities
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:\bowner\b))(?=[\s\S]*?(?:tenant))
