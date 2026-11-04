---
name: cloudbackend-rest-api
description: "Call the CloudBackend Singularity database over its REST API (api.cloudbackend.com/v1) — log in and get a session token, create and query containers, create/save/list objects and their streams, set ACLs, share, manage drives, groups and identities — with the exact XML request and response bodies for all 513 operations bundled. Use this whenever a developer is writing code, curl commands or a client against CloudBackend from any language (Python, JavaScript, Go, shell, generated OpenAPI clients), gets a 401 after logging in, asks what XML an endpoint expects or returns, wants to avoid the SOAP API, or mentions containers, objects, streams, webshares, `WRAP access_token`, `loginResponse`, or the CloudBackend REST/HTTP API — even if they do not say 'REST'."
---

# CloudBackend REST API

The Singularity database speaks HTTP + XML. Every request goes to `https://api.cloudbackend.com/v1`,
every body in and out is XML, and every call after login carries one header. Once those three facts are
in hand, the API is a large but regular surface: 513 operations, each documented on its own card in
`references/rest/<tag>.md` with parameters, bodies, status codes and a `curl` you can run.

Work from the cards, not from memory. Element names are the contract — `<newContainer>`, not
`<createContainer>`; `<queryContainer>`, not `<query>` — and a wrong name is a `400` with no hint.
`references/rest-index.md` lists all 513 operations on one line each; open the tag file it points to.

## 1. Authenticate

```bash
curl -X POST "https://api.cloudbackend.com/v1/login" \
  -u "$USERNAME:$PASSWORD" \
  -H "Tenant: $TENANT" \
  -H "Content-Type: text/xml; charset=utf-8" \
  -d '<login />'
```

- The `Tenant` header is required when the user is **not** the tenant owner. Sending it always is harmless.
- HTTP Basic is the normal way in; HTTP Digest and an existing session token are also accepted on `/login`.
- The `200` body is `<loginResponse>`. Keep three things from it: `<session>` (your token), `<userid>`, and
  `<home>` — the id of the identity's home container, the root under which you create everything.
  It also lists the identity's `<drives>` (home, library, in, out) with `containerId` and quota.

Then, on **every** other call:

```
Authorization: WRAP access_token=<session>
```

Log out with `DELETE /login`. `GET /healthcheck` needs no token.

**The trap that costs the most time:** the published OpenAPI specification declares no security scheme,
so a client generated from it (openapi-generator, Kiota, orval, …) sends *no* Authorization header and
every call after a successful login returns `401`. Add the header yourself — a default header on the HTTP
client, or a request interceptor. The spec's `401` on 486 operations is the symptom; the missing
scheme is the cause.

## 2. Speak the vocabulary

| Word | Meaning | Where it appears |
| --- | --- | --- |
| **container** | The unit of organisation — behaves as a folder or as a table depending on how you use it. Has an owner, an ACL, optional datatype (schema). | 66 operations (`/container`, `/containers/{id}`, `/objects/{container_id}`) |
| **object** | A record. Key/value metadata (its "columns") plus zero or more **streams** (the documents/blobs it holds, each up to 2 GB). | `/object`, `/objectsave`, `/metadata`, `/stream` |
| **stream** | One document or binary attached to an object. The first stream is the object's core content. | `/stream`, `/appendstream`, upload endpoints |
| **drive** | Storage quota for an identity: home, library, in, out. | `/drive`, `/driveinfo` |
| **identity / user** | A login: a person, a device, a backend. Has its own database. | `/users/{user_id}/…`, `/userdb` |
| **group / organization** | Members plus a shared database. Tenants are groups. | `/groups/{group_id}/…`, `/organizations/…` |
| **share / webshare** | A share grants other identities access to objects; a webshare publishes a container on the web. | `/share`, `/users/{user_id}/webshares` |

One inconsistency to know so it does not bite: in request and response bodies the element **`<folderId>`
holds a container id**, and the query parameters `folderid` / `folder_id` take one too. "Folder" in a body
means container. The URLs say container; the payloads sometimes say folder.

"Document" is the same trap. There is **no `/documents` path and no Documents tag**: a document or file is
an **object**, so list a container's documents with `GET /objects/{container_id}` and fetch one with
`GET /objects/{container_id}/{object_id}/{stream_id}` (tag `object`). In bodies, `<dc:document>` holds an
object id and a share's `<documents>` element is a feed of objects.

## 3. The core flows, with the bodies that actually work

All bodies are `Content-Type: application/xml` (or `text/xml`) and need the `Authorization` header.
Placeholders in `{braces}` are yours to fill.

### Create a container

`POST /container`
```xml
<newContainer>
  <container id="{parent_container_id}"/>
  <childContainer>{container_name}</childContainer>
</newContainer>
```
Use the `<home>` id from login as the first parent. Response: `<newContainerResponse>` with the new id.

### Read a container

- `GET /container?containerid={id}&count=2` — the container and `count` levels of children (`403` if denied).
- `GET /objects/{container_id}?offset=0&count=100` — list objects (max 1000 per call).
- `GET /containers/{container_id}` — list contents; `GET /containerpath/{container_id}/{path}` — resolve a path.

### Create an object

`POST /object` — an object whose first stream is the XML you supply (Atom entry form):
```xml
<createObject xmlns:atom="http://www.w3.org/2005/Atom">
  <container id="{container_id}"/>
  <overwrite>false</overwrite>
  <atom:entry>
    <atom:title>{object_name}</atom:title>
    <atom:content type="text/xml">
      <note><text>Hello</text></note>
    </atom:content>
  </atom:entry>
</createObject>
```
Key/value metadata on the entry become the object's indexed columns (the cards show the `dc:` form).
`PUT /objectsave` updates an existing object's content (`<saveObject>`), `PUT /metadata` its metadata,
`PUT /object` renames, `DELETE /object` deletes (**by object name**, in a `<deleteObject>` body — not by
id), `POST /objectcopy` copies.

### Files and images (streams)

A file is an object whose first stream holds the bytes. Uploading into a container is **not multipart**:
the body is the raw bytes and the filename and type travel in headers. (The one exception is the
webshare upload, `POST /groups/{group_id}/webshares/{webshare_id}/{container_id}`, which really is
`multipart/form-data` — check the card whenever a body shape surprises you.)

```
POST /objects/{container_id}            (or POST /upload/{container_id} — same shape)
Authorization: WRAP access_token={session}
Content-Type: application/octet-stream
X-File-Name: photo.jpg
X-Content-Type: image/jpeg

<raw bytes>
```
`200` → one `<atom:entry>` with `<dc:object>` (the new id) and `<atom:link href="…/objects/{cid}/{oid}/1">`.
Add a stream to an existing object with `POST /objects/{cid}/{oid}/stream` (next free id) or
`POST /objects/{cid}/{oid}/{stream_id}`.

Read the bytes with `GET /objects/{container_id}/{object_id}/{stream_id}` — stream `1` is the default.
It needs the `Authorization` header, so **a browser `<img src>` cannot load it directly**: `fetch` with the
header → `blob()` → `URL.createObjectURL`. Query `dl` adds `Content-Disposition` (`?dl` uses the object's
name), `ct` overrides the returned `Content-Type`. For a URL that works with no header — an `<img src>`, a
link you hand to someone — `GET /objects/{cid}/{oid}/{stream_id}/session` returns one carrying
`?session=…`. `GET /stream?containerid=&objectid=` lists an object's streams (versions, attachments).

A listing (`GET /objects/{container_id}`) tells you what each object is: `atom:link/@type` is the mime type
and `@length` the size; `dc:object` and `dc:container` are the ids, `dc:md5` the checksum.

### Calling from a browser

Verified 2026-09-09 against `api.cloudbackend.com`: the API answers CORS preflights — the request origin is
echoed, credentials are allowed, methods `GET, POST, OPTIONS, DELETE, PUT` (no `PATCH`), and the allowed
request headers include `Authorization`, `Content-Type`, `Tenant`, `X-File-Name` and `X-Content-Type`. A
static page on any origin can call the API with `fetch`. Keep the token in memory or `sessionStorage`,
never in a URL, and parse XML with `DOMParser` using namespace-aware lookups (`atom:`, `dc:`, `os:` are
real namespaces).

### Query

`POST /query` (alias of `/querycontainer`) searches one or several containers and returns an Atom feed:
```xml
<queryContainer>
  <container id="{container_id}" count="50"/>
  <query>+report* -draft</query>
  <order>updated</order>
  <ascending>false</ascending>
</queryContainer>
```
Grammar: bare term = optional, `+term` = required, `-term` = excluded, `term*` = prefix, `"a b"` = phrase,
`field<value` / `field>value` = numeric comparison on an indexed key. Pipeline operators after `|`:
`| count` returns only `<os:totalResults>`; `| groupby field` returns `<dc:bucket>` elements with a
`count` each. Omit `<query>` to list. `POST /container/search` is the single-container form.

### Permissions and sharing

ACL bits: read 1 · write 2 · delete 4 · changeACL 8 — an entry's value is their sum, and an item inherits
its parent's ACL until given its own. Every item needs at least one entry with changeACL.

`PUT /containeracl`
```xml
<setContainerACL>
  <container id="{container_id}"/>
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="1" write="1" delete="0" changeACL="0"/>
  </acl>
</setContainerACL>
```
`GET /containeracl` first — the `tag` is an optimistic-concurrency token you must echo back.
Share objects with `POST /share` (`<createShare><objects><object container="…" id="…"/></objects></createShare>`);
publish a container on the web with `POST /users/{user_id}/webshares`.

### Drives, groups, identities

`GET /drive` lists drives; `PATCH /drive` resizes one (`<resizeDrive><quota>{bytes}</quota><username>…</username><override>false</override></resizeDrive>` — the quota is in **bytes**).
Groups, roles, members, invitations: the Group tag (120 operations). Identities and user records: the
Identity tag (72). Tenant administration: the Tenant tag (68).

## 4. Responses and errors

| Status | Meaning in practice |
| --- | --- |
| `200` / `204` | Done. The body's root element is named on the card (`<newContainerResponse>`, `<loginResponse>`, …). A few operations return `text/plain` — `success`, `SUCCESS`, `true`, a bare number — the card says which. |
| `400` | The XML did not parse or an element is missing or misnamed. Compare against the card's example character by character. |
| `401` | No or expired token — or a generated client that never sent one (§1). Log in again. |
| `403` | Token fine, ACL says no (§3). |
| `404` | Wrong id, or an object/container that was deleted. |
| `500` | Server-side. Retry once; then report with the request body. |

Parse responses as XML, never with string matching: namespaces (`atom:`, `dc:`, `db:`) are real, and
list responses are Atom feeds (`<atom:feed>` with `<atom:entry>` items and `<os:totalResults>`).

## 5. Building a client

- **Any language:** one function that logs in and returns the token; one that sends XML with the two
  headers and parses the XML reply; then the flows above. Keep ids as strings — they exceed 2^53.
- **curl:** the cards give a ready command per operation with the right headers and body.
- **Generated clients:** usable, but add the Authorization header (§1) and expect 10 path templates
  in the spec that a router cannot serve as written (`/ws[0_9]/…`, adjacent parameters); the cards list
  the real shapes.
- **Migrating from SOAP:** the REST operation for a SOAP call usually has the SOAP operation's name as
  its XML root element — `createObject`, `resizeDrive`, `queryContainer`, `setContainerACL`. Search
  `references/rest-index.md` and the tag files for that name.

## 6. Honesty markers

A card that says **"Not implemented"** (6 in this version) is a method the specification
lists but the server rejects, has no route for, or accepts and ignores. Each card's description names the
operation to use instead — for example `POST /users/{user_id}/purchases` for
`POST /users/{user_id}/tpurchases`, and `DELETE /users/{user_id}/delete?code=…` for `DELETE /users/{user_id}`.
`GET /users/{user_id}/invoices/{purchase_id}` is marked partly implemented (no JSON format yet).

An **"Unverified by the API owners"** callout marks a request shape the API team inferred from a sibling
operation and has no test for (0 cards in this version). Treat such a body as the best
available guess and verify it against a real tenant.

## Bundled references

- `references/rest-index.md` — all 513 operations by tag, one line each: method, path, summary. Start here.
- `references/rest/<tag>.md` — the full cards: `authentication.md`, `container.md`, `object.md`,
  `sharing.md`, `drive.md`, `group.md`, `identity.md`, `tenant.md`, `publish-and-subscribe.md`,
  `jobs.md`, `webshare.md`, `share.md`, `other.md`.

The data model behind the API — tenants, identities, groups, containers, objects, ACLs, datatypes — is
its own skill, `singularity-database`; the native C++/Java/Swift libraries are `cloudbackend-sdk`.

## Version and updates

This is version 2026.10.27.4 of the cloudbackend-rest-api skill, built from the CloudBackend documentation.

Installed through the CloudBackend plugin (`claude plugin marketplace add rbcbe2025/expcbe`, then `claude plugin install cloudbackend@cloudbackend`)? Then the skill updates with the plugin: `claude plugin update cloudbackend@cloudbackend` in Claude Code; claude.ai, Claude Desktop and Cowork refresh an installed plugin at the start of a session.

Once per session, if you can fetch URLs, read https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/skills/index.json. When its `skills[].version` for `cloudbackend-rest-api` is newer than 2026.10.27.4, tell the user once, in one sentence, and give them the download (the `file` listed next to it). Do not interrupt the task for it.

CloudBackend counts which skill versions are in use, anonymously. Ask the user once, at a natural pause and never before helping, whether they agree; one answer covers every CloudBackend skill and does not count toward any question limit. Keep the answer with the project (for example in `cloudbackend-launch.md`). Only if they agreed, fetch this address when the skill is first used in a session: https://analytics.cloudbackend.com/matomo.php?idsite=2&rec=1&action_name=skill%2Fcloudbackend-rest-api%2F2026.10.27.4&url=https%3A%2F%2Fcloudbackend.com%2Fskills%2Fcloudbackend-rest-api - it records the skill's name and version and nothing else. Never send it without that agreement.
