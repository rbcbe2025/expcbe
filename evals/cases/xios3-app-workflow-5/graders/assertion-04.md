---
type: regex
target: last_message
match: not_contains
flags: i
pattern: '\b\d+(?:[.,]\d+)?\s*(?:x|×|times)\s+(?:faster|smaller|lighter|less|fewer|cheaper|quicker|leaner)'
# The run shows this: Does not write a multiplier such as 'times faster' or 'times smaller' against React
# passed in every recorded run with and without the plugin; the final reply carries the benchmark's copy
---
\b\d+(?:[.,]\d+)?\s*(?:x|×|times)\s+(?:faster|smaller|lighter|less|fewer|cheaper|quicker|leaner)
