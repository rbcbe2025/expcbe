---
type: regex
target: last_message
match: contains
flags: im
pattern: '(?<![\s\S])(?=[\s\S]*?(?:(?:Add|Edit) login screen|Configure Login(?! Page)|xios://apps/login\.xml))'
# The run shows this: Login screen declared in the manifest (xios://apps/login.xml) or written there by Development's Add login screen...
# reworded for the console's Deployments board measured 2026-11-27, where no card has a login action: the backtest pattern (Configure Login Page|xios://apps/login.xml; 3 of 6 recorded runs passed) with the earlier board's Staging form swapped for Development's form (Add or Edit login screen..., Configure Login, not Configure Login Page); not backtested, no recorded run answers the reworded point
---
(?<![\s\S])(?=[\s\S]*?(?:(?:Add|Edit) login screen|Configure Login(?! Page)|xios://apps/login\.xml))
