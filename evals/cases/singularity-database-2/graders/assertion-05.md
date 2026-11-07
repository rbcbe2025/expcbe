---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:tenant://))(?=[\s\S]*?(?:restrict|limit|tight|least))'
# The run shows this: tenant:// warning: shared database, restrict to roles/groups and sub-containers
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:tenant://))(?=[\s\S]*?(?:restrict|limit|tight|least))
