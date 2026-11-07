---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:organi[sz]ations?))(?=[\s\S]*?(?:\bacmeadmin\b))(?=[\s\S]*?(?:\bacmedev\b))(?=[\s\S]*?(?:deployment name))(?=[\s\S]*?(?:(?:reply to change)|(?:otherwise I (go|carry|move) on)))'
# The run shows this: Proposes the plan card with its defaults (organisations, <tenant>admin and <tenant>dev, the deployment name) for the user to correct
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:organi[sz]ations?))(?=[\s\S]*?(?:\bacmeadmin\b))(?=[\s\S]*?(?:\bacmedev\b))(?=[\s\S]*?(?:deployment name))(?=[\s\S]*?(?:(?:reply to change)|(?:otherwise I (go|carry|move) on)))
