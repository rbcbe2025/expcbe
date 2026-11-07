---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:/v1/query))(?=[\s\S]*?(?:<queryContainer>))'
# The run shows this: Uses POST /query (or /querycontainer) with a <queryContainer> body
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:/v1/query))(?=[\s\S]*?(?:<queryContainer>))
