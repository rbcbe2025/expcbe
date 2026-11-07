---
type: llm
focus: trace
---

The run shows this: CloudBackend.login(username, password:, tenant:, delegate:) form

PASS if the run's messages, tool calls or written files show it. FAIL if it is missing, contradicted, or only claimed
without the matching content or call. Judge this one point only.

What a full answer looks like, for context: CloudBackend.login(username, password: …, tenant: …, delegate: self) with the delegate callbacks (success gives the CloudBackend instance) and waiting for the callback (e.g. the tutorial's waitForRsp); download from GitHub CloudBackend/SDK_iOS_Swift releases; Xcode docs at cloudbackend.com/docs/swift/; terminate() at the end.
