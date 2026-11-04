---
type: llm
focus: trace
---

Judge the whole run (the messages and the tool calls) against the assertions below; each is what a correct run shows.
PASS if every assertion holds. FAIL if any assertion is missing, contradicted, or only claimed without the matching
content or call.

Expected: A model using identities for technicians/customers/dispatchers, roles or groups for dispatchers, a jobs container on tenant:// with a job datatype (schema) whose key/values are the queryable columns (customer, technician, status, due), photos and the signed PDF as streams on the job object (or child objects), ACLs expressed with the read 1/write 2/delete 4/changeACL 8 bits and inheritance from the container, datatype stored under tenant://Settings/Datatypes. Uses the correct vocabulary throughout.

Assertions:
- Models technicians, customers and dispatchers as identities
- Uses roles or groups for dispatchers (not per-user ACL entries)
- Puts shared job data on tenant:// (or a group database) and personal data on home://
- Uses a datatype/schema on the jobs container so key/values are columns
- Photos and the signed PDF are streams (or objects with streams)
- Explains ACL bits read 1 / write 2 / delete 4 / changeACL 8 and inheritance
- Mentions where datatypes are stored: tenant://Settings/Datatypes
