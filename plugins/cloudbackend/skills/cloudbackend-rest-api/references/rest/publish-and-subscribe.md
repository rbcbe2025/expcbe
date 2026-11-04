# REST API — Publish and Subscribe

19 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /port <a id="postv1port"></a>

**Create a port**

Creates a pub/sub port with a container listener.

### Request

`POST https://api.cloudbackend.com/v1/port`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createPort>`

```xml
<createPort>
  <containerListener>
    <container id="{container_id}" />
  </containerListener>
</createPort>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Port created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createPortResponse>`

```xml
<createPortResponse>
  <portURI>http://...{token}</portURI>
</createPortResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/port" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createPort>
  <containerListener>
    <container id="{container_id}" />
  </containerListener>
</createPort>'
```

---

## POST /ports <a id="postv1ports"></a>

**Create multiple ports**

Creates pub/sub ports with drive and container listeners.

### Request

`POST https://api.cloudbackend.com/v1/ports`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createPorts>`

```xml
<createPorts>
  <driveListener>
    <drive id="{drive_id}" />
  </driveListener>
  <containerListener>
    <container id="{container_id}" />
  </containerListener>
</createPorts>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Ports created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createPortsResponse>`

```xml
<createPortsResponse>
  <port>
    <portURIs>
      <portURI>http://...{token}</portURI>
    </portURIs>
    <failures />
  </port>
</createPortsResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/ports" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createPorts>
  <driveListener>
    <drive id="{drive_id}" />
  </driveListener>
  <containerListener>
    <container id="{container_id}" />
  </containerListener>
</createPorts>'
```

---

## DELETE /lifestreams/{user_id} <a id="deletev1lifestreams"></a>

**Delete a lifestream thread**

Deletes all lifestream entries of one type that belong to one thread in the
lifestream of `{user_id}`. Both query parameters are required. The caller must be
`{user_id}`; otherwise `403` is returned.

No request body. Unlike the other lifestream changes, no lifestream notification
is sent for this deletion.

### Request

`DELETE https://api.cloudbackend.com/v1/lifestreams/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream is changed. Must be the caller. |
| `type` | query | yes | string · one of `friendRequest`, `friendAccept`, `guestbookEntry`, `sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`, `profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`, `webshareInvite`, `emailMessage`, `associationInvite` | Type of the entries to delete. |
| `thread` | query | yes | integer | Thread id (the `threadId` attribute of the entries) whose entries are deleted. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Entries deleted (empty body) |
| `400` | Bad Request — `Missing required parameters` (`type` empty or `thread` missing/0) |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — no entries of that type in that thread |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/lifestreams/{user_id}?type={type}&thread={thread}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /lifestreams/{user_id} <a id="getv1lifestreams"></a>

**List public lifestream entries**

Lists the lifestream of `{user_id}` as seen by other identities: only entries with
visibility `public` are returned, plus entries with visibility `friends` when the
caller is in `{user_id}`'s contacts. Private entries are never returned here, not
even to `{user_id}` — use `GET /users/{user_id}/lifestream` to see the complete
lifestream of the logged-in identity.

Results are paged with `offset` and `count` and can be filtered with `type`,
`sender`, `receiver` and `thread`. Each `<event>` carries `id`, an optional
`threadId`, `type`, `visibility`, `time`, sender and receiver ids, group ids and
names, and `seen`; the type-specific payload is inside `<data>`.

Lifestream types: `friendRequest`, `friendAccept`, `guestbookEntry`,
`sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`,
`profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`,
`webshareInvite`, `emailMessage`, `associationInvite`.

### Request

`GET https://api.cloudbackend.com/v1/lifestreams/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream is listed. |
| `offset` | query | no | integer · default `0` | Index of the first entry to return. |
| `count` | query | no | integer · default `100` | Maximum number of entries to return. Values above 1000 give `400`. |
| `ascending` | query | no | boolean · default `True` | Sort order by time; `false` returns the newest entries first. |
| `type` | query | no | string · one of `friendRequest`, `friendAccept`, `guestbookEntry`, `sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`, `profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`, `webshareInvite`, `emailMessage`, `associationInvite` | Only return entries of this type. An unknown value is ignored (no type filter). |
| `sender` | query | no | integer | Only return entries sent by this user id. |
| `receiver` | query | no | integer | Only return entries received by this user id. |
| `thread` | query | no | integer | Only return entries of this thread id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Lifestream entries |
| `400` | Bad Request — `'count' must be less than 1000` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<lifestream>`

```xml
<lifestream xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <event id="1150" type="guestbookEntry" visibility="public" time="2026-06-29T13:24:26Z" senderId="12884901977" senderGroupId="17179869184" senderName="Test Owner" receiverId="12884901977" receiverGroupId="17179869184" receiverName="Test Owner" seen="false">
    <data><entry>Hello from the guestbook</entry></data>
  </event>
</lifestream>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/lifestreams/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /lifestreams/{user_id} <a id="postv1lifestreams"></a>

**Add a lifestream entry**

Adds an entry to the lifestream of `{user_id}`. The root element of the XML body
selects the entry type; only these types can be posted:

- `<guestbookEntry>` — writes a guestbook entry to `{user_id}`. Child elements:
  `<entry>` (required, the message text), `<visibility>` (optional, `public`
  (default), `friends`, `private` or `invited`) and `<thread id="…"/>` (optional,
  to reply within a thread). Returns `202`.
- `<profileVisitor/>` — registers the sender as a visitor of `{user_id}`'s
  profile. Returns `202`.
- `<statusMessage>` — sets the status message of `{user_id}`, which must be the
  caller. Child element `<message>` (required). Returns `200`.
- `<campaignMessage>` — uses a campaign/referral code for `{user_id}`, which must
  be the caller, and sends a private `campaignMessage` entry. Child element
  `<campaign code="…"/>` (required). A code can only be used once (`400`).
  Returns `200`.

Every body may contain `<sender id="…"/>`; it defaults to the caller and must be
the caller (or an identity whose real user is the caller), otherwise `403`. Any
other root element gives `422 Invalid root element`.

### Request

`POST https://api.cloudbackend.com/v1/lifestreams/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream receives the entry. |

#### Body

`application/xml` (required), root element `<guestbookEntry>`

*Guestbook entry*

```xml
<guestbookEntry>
  <sender id="12884901977"/>
  <entry>coverage guestbook entry</entry>
  <visibility>private</visibility>
</guestbookEntry>
```

*Profile visit*

```xml
<profileVisitor/>
```

*Status message*

```xml
<statusMessage>
  <message>Out of office until Monday</message>
</statusMessage>
```

*Campaign code*

```xml
<campaignMessage>
  <campaign code="SPRING2026"/>
</campaignMessage>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Status message or campaign message stored (empty body) |
| `202` | Guestbook entry or profile visit accepted (empty body) |
| `400` | Bad Request — malformed XML, or `CampaignEvent already sent` |
| `401` | Unauthorized |
| `403` | Forbidden — the sender (or, for `statusMessage`/`campaignMessage`, `{user_id}`) is not the caller |
| `404` | Not Found — user not found |
| `422` | Unprocessable Entity — `Invalid root element`, or a required child (`<entry>`, `<message>`, `<campaign code>`) is missing |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/lifestreams/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<guestbookEntry>
  <sender id="12884901977"/>
  <entry>coverage guestbook entry</entry>
  <visibility>private</visibility>
</guestbookEntry>'
```

---

## DELETE /lifestreams/{user_id}/{event_id} <a id="deletev1lifestreamsevent"></a>

**Delete a lifestream entry**

Deletes one entry from the lifestream of `{user_id}`. The caller must be
`{user_id}`. Same as `DELETE /users/{user_id}/lifestream/{event_id}`.

Routing note: the router only sends this path to the single-entry handler when it
ends with a slash (`/lifestreams/{user_id}/{event_id}/`). Without the trailing
slash the request is handled as `DELETE /lifestreams/{user_id}` (which then
answers `400 Missing required parameters`).

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream is changed. Must be the caller. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Entry deleted |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /lifestreams/{user_id}/{event_id} <a id="getv1lifestreamsevent"></a>

**Get a lifestream entry**

Returns one lifestream entry as an `<event>` element. `{user_id}` itself can read
any of its entries; other identities can only read entries with visibility
`public`, or `friends` when they are in `{user_id}`'s contacts (otherwise `403`).
Same as `GET /users/{user_id}/lifestream/{event_id}`.

Routing note: the router only sends this path to the single-entry handler when it
ends with a slash (`/lifestreams/{user_id}/{event_id}/`). Without the trailing
slash the request is handled as `GET /lifestreams/{user_id}` and returns the list.

### Request

`GET https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream holds the entry. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The lifestream entry |
| `401` | Unauthorized |
| `403` | Forbidden — the entry is not visible to the caller |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<event>`

```xml
<event id="1150" type="guestbookEntry" visibility="public" time="2026-06-29T13:24:26Z" senderId="12884901977" senderGroupId="17179869184" senderName="Test Owner" receiverId="12884901977" receiverGroupId="17179869184" receiverName="Test Owner" seen="false">
  <data><entry>Hello from the guestbook</entry></data>
</event>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /lifestreams/{user_id}/{event_id} <a id="postv1lifestreamsevent"></a>

**Modify a lifestream entry**

Changes the `seen` flag and/or the visibility of one lifestream entry. The caller
must be `{user_id}`. Both attributes of `<entry>` are optional; an `<entry/>`
without attributes changes nothing. To change a single attribute with a plain-text
body, use `PUT /lifestreams/{user_id}/{event_id};seen` or `;visibility`.

- `seen` — `true`/`false` (or `1`/`0`).
- `visibility` — `public`, `friends`, `private` or `invited`.

Routing note: the router only sends this path to the single-entry handler when it
ends with a slash (`/lifestreams/{user_id}/{event_id}/`). Without the trailing
slash the request is handled as `POST /lifestreams/{user_id}`.

### Request

`POST https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream is changed. Must be the caller. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

#### Body

`application/xml` (required), root element `<entry>`

```xml
<entry seen="true" visibility="private"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Entry updated |
| `400` | Bad Request — malformed XML |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<entry seen="true" visibility="private"/>'
```

---

## PUT /lifestreams/{user_id}/{event_id}{attribute} <a id="putv1lifestreamseventattribute"></a>

**Modify lifestream entry attribute**

Sets one attribute of a lifestream entry using matrix syntax: the attribute name
follows the event id after a semicolon, e.g.
`PUT /lifestreams/12884901977/1150;seen`. The plain-text request body is the new
value. The caller must be `{user_id}`. Same as
`PUT /users/{user_id}/lifestream/{event_id};{attribute}`.

- `;seen` — body `true`, `false`, `1` or `0`; anything else gives `400`.
- `;visibility` — body `public`, `friends`, `private` or `invited`; anything
  else gives `400`.

Any other attribute name gives `404`. To set both attributes at once, use
`POST /lifestreams/{user_id}/{event_id}/` with an `<entry>` body.

### Request

`PUT https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}{attribute}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream is changed. Must be the caller. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |
| `attribute` | path | yes | string · one of `;seen`, `;visibility` | The attribute to set, written with its leading semicolon (`;seen` or `;visibility`) directly after the event id. |

#### Body

`text/plain` (required)

*Body for `;seen`*

```text
true
```

*Body for `;visibility`*

```text
private
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Attribute updated |
| `400` | Bad Request — `'seen' is not a boolean value` or `Invalid 'visibility' value` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — unknown attribute, or `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/lifestreams/{user_id}/{event_id}{attribute}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d 'true'
```

---

## DELETE /users/{user_id}/lifestream <a id="deletev1userslifestream"></a>

**Delete a lifestream thread**

Deletes all lifestream entries of one type that belong to one thread in the
logged-in identity's lifestream. Both query parameters are required. The caller
must be `{user_id}`; otherwise `403` is returned. Same as
`DELETE /lifestreams/{user_id}`.

No request body. No lifestream notification is sent for this deletion.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/lifestream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `type` | query | yes | string · one of `friendRequest`, `friendAccept`, `guestbookEntry`, `sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`, `profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`, `webshareInvite`, `emailMessage`, `associationInvite` | Type of the entries to delete. |
| `thread` | query | yes | integer | Thread id (the `threadId` attribute of the entries) whose entries are deleted. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Entries deleted (empty body) |
| `400` | Bad Request — `Missing required parameters` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — no entries of that type in that thread |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/lifestream?type={type}&thread={thread}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/lifestream <a id="getv1userslifestream"></a>

**List own lifestream entries**

Lists the complete lifestream of the logged-in identity, including private
entries such as `emailMessage` and `sharePackage` notifications. The caller must
be `{user_id}`; otherwise `403` is returned. To read another identity's public
entries use `GET /lifestreams/{user_id}`.

Results are paged with `offset` and `count` and can be filtered with `type`,
`sender`, `receiver` and `thread`. Each `<event>` carries `id`, an optional
`threadId`, `type`, `visibility`, `time`, sender and receiver ids, group ids and
names, and `seen`; the type-specific payload is inside `<data>`.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/lifestream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `offset` | query | no | integer · default `0` | Index of the first entry to return. |
| `count` | query | no | integer · default `100` | Maximum number of entries to return. Values above 1000 give `400`. |
| `ascending` | query | no | boolean · default `True` | Sort order by time; `false` returns the newest entries first. |
| `type` | query | no | string · one of `friendRequest`, `friendAccept`, `guestbookEntry`, `sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`, `profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`, `webshareInvite`, `emailMessage`, `associationInvite` | Only return entries of this type. An unknown value is ignored (no type filter). |
| `sender` | query | no | integer | Only return entries sent by this user id. |
| `receiver` | query | no | integer | Only return entries received by this user id. |
| `thread` | query | no | integer | Only return entries of this thread id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Lifestream entries |
| `400` | Bad Request — `'count' must be less than 1000` |
| `401` | Unauthorized |
| `403` | Forbidden — `Lifestream access denied.` (caller is not `{user_id}`) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<lifestream>`

```xml
<lifestream xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>2</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <event id="1145" type="sharePackage" visibility="private" time="2026-06-29T13:24:26Z" senderId="12884901977" senderGroupId="17179869184" senderName="test tenant" receiverId="12884901977" receiverGroupId="17179869184" receiverName="test tenant" seen="false">
    <data><share id="25769803777"/></data>
  </event>
  <event id="1150" type="guestbookEntry" visibility="private" time="2026-06-29T13:25:02Z" senderId="12884901977" senderGroupId="17179869184" senderName="test tenant" receiverId="12884901977" receiverGroupId="17179869184" receiverName="test tenant" seen="false">
    <data><entry>coverage guestbook entry</entry></data>
  </event>
</lifestream>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/lifestream" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/lifestream <a id="postv1userslifestream"></a>

**Add a lifestream entry**

Adds an entry to the lifestream of `{user_id}`. Identical to
`POST /lifestreams/{user_id}`: the root element of the XML body selects the type.

- `<guestbookEntry>` — children `<entry>` (required), `<visibility>` (optional,
  `public` (default), `friends`, `private`, `invited`), `<thread id="…"/>`
  (optional). Returns `202`.
- `<profileVisitor/>` — registers a profile visit. Returns `202`.
- `<statusMessage>` — child `<message>` (required); `{user_id}` must be the
  caller. Returns `200`.
- `<campaignMessage>` — child `<campaign code="…"/>` (required); `{user_id}`
  must be the caller; a code can only be used once. Returns `200`.

`<sender id="…"/>` is optional and defaults to the caller; it must be the caller,
otherwise `403`. Any other root element gives `422 Invalid root element`.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/lifestream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream receives the entry. |

#### Body

`application/xml` (required), root element `<guestbookEntry>`

*Guestbook entry*

```xml
<guestbookEntry>
  <entry>Hello from the guestbook</entry>
  <visibility>public</visibility>
</guestbookEntry>
```

*Status message*

```xml
<statusMessage>
  <message>Out of office until Monday</message>
</statusMessage>
```

*Campaign code*

```xml
<campaignMessage>
  <campaign code="SPRING2026"/>
</campaignMessage>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Status message or campaign message stored (empty body) |
| `202` | Guestbook entry or profile visit accepted (empty body) |
| `400` | Bad Request — malformed XML, or `CampaignEvent already sent` |
| `401` | Unauthorized |
| `403` | Forbidden — sender or `{user_id}` is not the caller |
| `404` | Not Found — user not found |
| `422` | Unprocessable Entity — `Invalid root element` or a missing required child |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/lifestream" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<guestbookEntry>
  <entry>Hello from the guestbook</entry>
  <visibility>public</visibility>
</guestbookEntry>'
```

---

## DELETE /users/{user_id}/lifestream/{event_id} <a id="deletev1userslifestreamevent"></a>

**Delete a lifestream entry**

Deletes one entry from the logged-in identity's lifestream and sends a lifestream
notification about the removal. The caller must be `{user_id}`.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Entry deleted |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/lifestream/{event_id} <a id="getv1userslifestreamevent"></a>

**Get a lifestream entry**

Returns one lifestream entry as an `<event>` element. `{user_id}` can read any of
its entries; other identities only entries with visibility `public`, or `friends`
when they are in `{user_id}`'s contacts (otherwise `403`).

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose lifestream holds the entry. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The lifestream entry |
| `401` | Unauthorized |
| `403` | Forbidden — the entry is not visible to the caller |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<event>`

```xml
<event id="1150" type="guestbookEntry" visibility="private" time="2026-06-29T13:25:02Z" senderId="12884901977" senderGroupId="17179869184" senderName="test tenant" receiverId="12884901977" receiverGroupId="17179869184" receiverName="test tenant" seen="false">
  <data><entry>coverage guestbook entry</entry></data>
</event>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/lifestream/{event_id} <a id="postv1userslifestreamevent"></a>

**Modify a lifestream entry**

Changes the `seen` flag and/or the visibility of one lifestream entry and sends a
lifestream notification with the updated entry. The caller must be `{user_id}`.
Both attributes of `<entry>` are optional; an `<entry/>` without attributes
changes nothing.

- `seen` — `true`/`false` (or `1`/`0`).
- `visibility` — `public`, `friends`, `private` or `invited`.

To change a single attribute with a plain-text body, use
`PUT /users/{user_id}/lifestream/{event_id};seen` or `;visibility`.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |

#### Body

`application/xml` (required), root element `<entry>`

```xml
<entry seen="true" visibility="private"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Entry updated |
| `400` | Bad Request — malformed XML |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<entry seen="true" visibility="private"/>'
```

---

## PUT /users/{user_id}/lifestream/{event_id}{attribute} <a id="putv1userslifestreameventattribute"></a>

**Modify lifestream entry attribute**

Sets one attribute of a lifestream entry using matrix syntax: the attribute name
follows the event id after a semicolon, e.g.
`PUT /users/12884901977/lifestream/1150;seen` with the plain-text body `true`.
The caller must be `{user_id}`.

- `;seen` — body `true`, `false`, `1` or `0`; anything else gives `400`.
- `;visibility` — body `public`, `friends`, `private` or `invited`; anything
  else gives `400`.

Any other attribute name gives `404`. To set both attributes at once, use
`POST /users/{user_id}/lifestream/{event_id}` with an `<entry>` body.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}{attribute}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `event_id` | path | yes | integer | Id of the lifestream entry (the `id` attribute of `<event>`). |
| `attribute` | path | yes | string · one of `;seen`, `;visibility` | The attribute to set, written with its leading semicolon (`;seen` or `;visibility`) directly after the event id. |

#### Body

`text/plain` (required)

*Body for `;seen`*

```text
true
```

*Body for `;visibility`*

```text
private
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Attribute updated |
| `400` | Bad Request — `'seen' is not a boolean value` or `Invalid 'visibility' value` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — unknown attribute, or `Entry not found.` |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/lifestream/{event_id}{attribute}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d 'true'
```

---

## POST /message <a id="postv1message"></a>

**Send a message**

Sends a message to a user.

| Element | Description |
|---|---|
| `<sender id="…"/>` | User the message is sent from |
| `<user id="…"/>` | User the message is sent to |
| `<message>` | The message text |

### Request

`POST https://api.cloudbackend.com/v1/message`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<sendMessage>`

```xml
<sendMessage>
  <sender id="{user_id}"/>
  <user id="{user_id}"/>
  <message>{message}</message>
</sendMessage>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Message sent |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<sendMessageResponse>`

```xml
<sendMessageResponse>OK</sendMessageResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/message" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<sendMessage>
  <sender id="{user_id}"/>
  <user id="{user_id}"/>
  <message>{message}</message>
</sendMessage>'
```

---

## GET /createportshare[0_9]/{user}/{webshare} <a id="getv1createportshare"></a>

**Create a port listening to a webshare**

Creates a pub/sub port that listens to an identity's webshare and returns the
port URI to connect to. This is the webshare counterpart of `POST /port` and
`POST /ports`, which listen to containers and drives.

`[0_9]` in the path denotes an optional single digit: `/createportshare`,
`/createportshare0` … `/createportshare9` all reach this endpoint, as with
`/ws[0_9]`. The two path segments may be separated by `/` or `;` —
`/createportshare/{user};{webshare}` also routes.

Access follows the webshare's settings:

- Public webshare without password — no login needed.
- Password-protected webshare — send the webshare password with HTTP Digest or
  Basic authentication (any username, e.g. `anonymous`); otherwise `401`.
- Invited-only webshare — a CloudBackend PaaS login is required.

No request body.

### Request

`GET https://api.cloudbackend.com/v1/createportshare[0_9]/{user}/{webshare}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user` | path | yes | string | Owner of the webshare — a user id or a username. |
| `webshare` | path | yes | string | The webshare — an id or a name. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The port URI to connect to |
| `401` | Unauthorized — `You need to provide a valid password to access this webshare-resource`, or login required for an invited-only webshare |
| `404` | No such user or webshare |
| `500` | Internal Server Error |

#### `200` · text/xml · `<port>`

```xml
<port>
  <portURIs>
    <portURI>http://mess002.cloudbackend.com/DOJUaSqUfTc-uKN*h4FSjRmkKnc7xhVEr3vjro4BhuA</portURI>
  </portURIs>
</port>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/createportshare/{user}/{webshare}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /createportshare[0_9]/{user}/{webshare} <a id="postv1createportshare"></a>

**Create a port listening to a webshare (not implemented)**

Not implemented: the `CreatePublicPort` resource only implements `GET` (its
former `POST` handler is commented out in the code), so a `POST` to this path is
rejected with `405 Method Not Allowed`. Use `GET` on the same path.

No request body.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`POST https://api.cloudbackend.com/v1/createportshare[0_9]/{user}/{webshare}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user` | path | yes | string | Owner of the webshare — a user id or a username. |
| `webshare` | path | yes | string | The webshare — an id or a name. |

### Responses

| Status | Meaning |
| --- | --- |
| `404` | No such user or webshare |
| `405` | Method Not Allowed |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/createportshare/{user}/{webshare}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
