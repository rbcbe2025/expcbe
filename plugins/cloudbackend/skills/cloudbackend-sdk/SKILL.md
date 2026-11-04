---
name: cloudbackend-sdk
description: "Use the native CloudBackend SDKs for C++, Java and Swift (the 'SDK Mobile, IoT & Cloud', package `cbe`) to log in to the Singularity database and work with Account, Container, Object, Item, Stream, Filter and QueryResult — including the asynchronous delegate pattern (LogInDelegate, QueryDelegate), createContainer/createObject with key/values, querying, sharing and terminate(). Use this whenever a developer writes or debugs C++, Java, Swift, iOS, Android, Linux, embedded or IoT code against CloudBackend, asks how to log in from an app, how to wait for an SDK callback, where the Doxygen/Javadoc/Xcode references or GitHub releases are, or mentions cbe::CloudBackend, com.cbe, LogInDelegate or the CloudBackend SDK — even without the word 'SDK'."
---

# CloudBackend native SDKs (C++ · Java · Swift)

The SDKs are one object model in three languages. You log in once and get a `CloudBackend` object;
from it the `Account`, from the account the root `Container` of the identity's database, and from
containers everything else — sub-containers, `Object`s with key/values and `Stream`s, queries that
return `Item`s. Calls are **asynchronous**: you pass a *delegate* and are called back. Most SDK bugs are
callback bugs — using a result before it arrived, or never waiting — so the pattern in §2 is the thing
to get right first.

The bundled references are the published SDK manual: the class-by-class pages with public links, and
the three tutorials (login → create a container → query and create an object) in full.

## 1. Which SDK, from where

| Language | Platforms | Get it | API reference |
| --- | --- | --- | --- |
| C++ | Linux (Ubuntu) | GitHub `CloudBackend/SDK_Ubuntu` releases — see its README | Doxygen at cloudbackend.com/docs/cpp/ (full) and /cpp2async/ (async subset) |
| Java | Linux / JVM | GitHub `CloudBackend/SDK_Ubuntu` releases | Javadoc at cloudbackend.com/docs/java/ |
| Swift | iOS | GitHub `CloudBackend/SDK_iOS_Swift` releases — see its README | Xcode docs at cloudbackend.com/docs/swift/ |

Exact URLs are in `references/sdk-classes.md` under *References* and *Install*. You need a developer
identity on a tenant (early access is by request); the tutorials assume a username, password and
tenant name.

## 2. Log in, wait, use, terminate

The `CloudBackend` class is the entry point. `logIn` takes credentials and a **LogInDelegate**; the
delegate's success callback receives the `CloudBackend` instance, the error callback the reason. The
program must wait for one of them before doing anything else.

**C++** (namespace `cbe`, header `cbe/CloudBackend.h`):

```cpp
class MyLogInDelegate : public cbe::delegate::LogInDelegate {
  std::mutex mutex; std::condition_variable cv; bool called{};
public:
  cbe::CloudBackend cloudBackend{cbe::DefaultCtor{}};
  cbe::delegate::Error errorInfo{};   // the tutorial's field names: errorInfo, waitForRsp()
  void onLogInSuccess(cbe::CloudBackend&& cb) override { { std::lock_guard<std::mutex> l(mutex); cloudBackend = std::move(cb); called = true; } cv.notify_one(); }
  void onLogInError(cbe::delegate::Error&& e, cbe::util::Context&&) override { { std::lock_guard<std::mutex> l(mutex); errorInfo = std::move(e); called = true; } cv.notify_one(); }
  void waitForRsp() { std::unique_lock<std::mutex> l(mutex); cv.wait(l, [this]{ return called; }); }
};

auto del = std::make_shared<MyLogInDelegate>();
(void) cbe::CloudBackend::logIn(username, password, tenant, client, del);
del->waitForRsp();
if (del->errorInfo) { /* report, then return */ }
cbe::CloudBackend cloudBackend = del->cloudBackend;
del.reset();
// … work …
cloudBackend.terminate();
```

The tutorial's own delegates (`references/tutorial-cpp.md`, *LogInDelegate structure* and the
`MyDelegates` listings) are the canonical version of this — copy them rather than re-deriving the
locking, and keep their names (`errorInfo`, `waitForRsp()`, `cbe::delegate::QueryError` on the query
error path) so the four delegates you need read alike. A `client` string names your application. One
inconsistency to know: the class reference gives `createObject(name, keyValues, delegate)` (changed in
2.1) while the tutorial's exercise still shows the older `(name, delegate, keyValues)` — follow the
class reference and check the header if the compiler disagrees.

**Java** (`com.cbe.*`, `com.cbe.delegate.*`): subclass `com.cbe.delegate.LogInDelegate`, then
`cloudBackend = com.cbe.CloudBackend.logIn(username, password, tenant, delegate);` and wait on the
delegate the same way.

**Swift**: `let cloudBackend = CloudBackend.login(myUsername, password: myPassword, tenant: myTenant, delegate: self)`
with `self` implementing the delegate's callbacks; wait for the callback before using the result.

Always finish with `terminate()` — it ends the SDK session cleanly.

## 3. The object model

| Class | Role | Typical calls |
| --- | --- | --- |
| `CloudBackend` | The session. | `logIn`, `account()`, `version()`, `query(containerId, delegate)`, `terminate()` |
| `Account` | The identity: username, names, root container, the databases it can reach. | `rootContainer()`, `username()` |
| `Container` | Holds objects and sub-containers; has an ACL. | `createContainer(name)`, `createObject(name, keyValues)`, `query(delegate)`, `remove`, sharing calls |
| `Object` | A record: key/values + streams. | key/value get/set, `streams()`, upload/download, `move`, `rename`, `remove` |
| `Item` | Base of `Container` and `Object`; what queries return. | `name()`, `id()`, `parentId()`, type test |
| `Stream` | One document/blob on an object. | list, upload, download |
| `Filter` | A query: the search expression, ordering, paging, container scope. | set query string, `setAscending`, `setCount`, `setOffset`, `setOrder` |
| `QueryResult` | The items a query returned. | `getItemsSnapshot()`, totals |
| `Group` | Group databases and members. | list, `join`, `leave`, root container |

Queries use the same grammar as the REST API and XIOS/3: bare term optional, `+term` required,
`-term` excluded, `term*` prefix, `field<value` numeric — see `references/sdk-classes.md` (*query
Container*, *query Database*, *Filter*). The tutorials' `QueryDelegate` shows how to receive the result.

## 4. The tutorial path

1. **Exercise 1 — log in** and print the account's username and the SDK version.
2. **Exercise 2 — create a container** in the root container (`rootContainer.createContainer(name)`),
   handling the creation exception (C++: `cbe::Container::CreateContainerException`).
3. **Exercise 3 — query and create an object**: `container.createObject(name, keyValues)` with a map
   of key/values, then query the container and print every item and the object's key/values.

Each language has the same three exercises; `references/tutorial-cpp.md`, `references/tutorial-java.md`
and `references/tutorial-swift.md` are the full texts, including installation and the asynchronous
programming chapter.

## 5. What the SDK is a view of

Containers, objects, streams, key/values, ACLs, groups and identities are the Singularity database's
model — the skill `singularity-database` explains how to design with them (container as table via a
datatype, key/values as columns, ACL bits). The same operations over HTTP are the skill
`cloudbackend-rest-api`; a CloudBackend-hosted web UI for the same data is `xios3-app-basics`.

## Bundled references

- `references/sdk-classes.md` — every SDK class page: Core Object (CloudBackend), Account, Container, Object, Item, Stream, Key/Value, Filter, QueryResult, Group, Sharing (ACL, shares, publish/subscribe), Querying, Install, References, Security.
- `references/tutorial-cpp.md`, `references/tutorial-java.md`, `references/tutorial-swift.md` — the three tutorials in full.

## Version and updates

This is version 2026.10.10 of the cloudbackend-sdk skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fcloudbackend-sdk%2F2026.10.10&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fcloudbackend-sdk - it records the skill's name and version and nothing else. Never send it without that agreement.
