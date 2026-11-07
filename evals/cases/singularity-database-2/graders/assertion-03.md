---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:\b7\b[^.]{0,80}(delete|1\s*\+\s*2\s*\+\s*4)))(?=[\s\S]*?(?:\b15\b[^.]{0,90}(changeACL|change ACL|chang(e|ing) the ACL|all four|everything|full)))'
# The run shows this: 7 = read+write+delete and 15 = all four including changeACL
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:\b7\b[^.]{0,80}(delete|1\s*\+\s*2\s*\+\s*4)))(?=[\s\S]*?(?:\b15\b[^.]{0,90}(changeACL|change ACL|chang(e|ing) the ACL|all four|everything|full)))
