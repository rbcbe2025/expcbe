---
type: regex
target: last_message
match: contains
flags: i
pattern: '\b(?:rotat|revok|regenerat|replace (?:the|that|this) key|new key)'
# The run shows this: Tells the user to rotate the key
# passed in every recorded run with and without the plugin; kept as a free guard
---
\b(?:rotat|revok|regenerat|replace (?:the|that|this) key|new key)
