---
type: llm
focus: trace
---

The run shows this: Explains ACL bits read 1 / write 2 / delete 4 / changeACL 8 and inheritance

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: A model using identities for technicians/customers/dispatchers, roles or groups for dispatchers, a jobs container on tenant:// with a job datatype (schema) whose key/values are the queryable columns (customer, technician, status, due), photos and the signed PDF as streams on the job object (or child objects), ACLs expressed with the read 1/write 2/delete 4/changeACL 8 bits and inheritance from the container, datatype stored under tenant://Settings/Datatypes. Uses the correct vocabulary throughout.
