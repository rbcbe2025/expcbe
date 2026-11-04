---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: Calls deploy from home, then verify_deployment; claims 'live' only from index_xml_match being true, never from a 200 (every path answers 200 with the boot page); writes the W4 evidence line with the URL and the UTC time; warns about the publish-then-load race.

Assertions:
- Calls deploy and then verify_deployment
- Says a 200 status proves nothing because every path answers the boot page
- Claims live only from index_xml_match (a content checksum)
- Writes a W4 evidence line with the deployment URL and a UTC time
- Does not ask for credentials
