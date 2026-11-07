---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:changeACL|change ACL))(?=[\s\S]*?(?:inherit))'
# The run shows this: Explains ACL bits read 1 / write 2 / delete 4 / changeACL 8 and inheritance
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:changeACL|change ACL))(?=[\s\S]*?(?:inherit))
