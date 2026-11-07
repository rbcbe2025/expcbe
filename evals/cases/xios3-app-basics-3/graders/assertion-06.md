---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:public(ly)?[- ](readable|accessible|visible)|externally (readable|accessible|visible)|anyone (can|with the (url|link)) (read|download|open)|readable and downloadable|world[- ]readable))'
# The run shows this: Warns that the deployed container is publicly readable
# gave the judge's verdict on all 6 recorded runs (scripts/regex-backtest.mjs)
---
(?<![\s\S])(?=[\s\S]*?(?:public(ly)?[- ](readable|accessible|visible)|externally (readable|accessible|visible)|anyone (can|with the (url|link)) (read|download|open)|readable and downloadable|world[- ]readable))
