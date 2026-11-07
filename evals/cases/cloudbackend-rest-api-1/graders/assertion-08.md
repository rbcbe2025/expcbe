---
type: regex
target: trace
match: not_contains
pattern: 'import requests|from requests import'
# The run shows this: Does not use the requests library
# passed in every recorded run with and without the plugin; the code is in a written file, so the final message is no target, and the skill text never says 'import requests', so the trace is a safe one
---
import requests|from requests import
