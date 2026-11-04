# REST API — Other

48 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /spellcheck <a id="getv1spellcheck"></a>

**List spell-check languages**

Returns the languages the spell checker supports, as `<availableLanguages>` with
one `<lang>` per dictionary (`tag`, plus the English `name` and the `native` name
when known).

Although this is a GET, the server reads the request as XML: send
`Content-Type: application/xml` (or `text/xml`) with an XML body such as
`<getSpellCheckLanguages/>`, otherwise the answer is `415`. Any logged in identity
may call it.

### Request

`GET https://api.cloudbackend.com/v1/spellcheck`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<getSpellCheckLanguages>`

```xml
<getSpellCheckLanguages />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Available languages |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — "Content-Type must be text/xml or appliction/xml". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<availableLanguages>`

```xml
<availableLanguages>
  <lang tag="en" name="English" native="English" />
  <lang tag="en_GB" name="English United Kingdom" native="English" />
  <lang tag="en_US" name="English United States" native="English" />
</availableLanguages>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/spellcheck" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<getSpellCheckLanguages />'
```

---

## POST /spellcheck <a id="postv1spellcheck"></a>

**Spell-check text**

Spell-checks the text inside `<text>` and returns the same `<text>` element in
which every misspelled word is replaced by an `<sc:spell>` element
(namespace `urn:x-i-o-s:spellcheck`) holding the original word in `<sc:orig>` and
up to `suggestions` corrections in `<sc:sugg>`. `<text>` may contain markup; only
its text nodes are checked.

- `<text>` — required.
- `<suggestions>` — required; maximum number of suggestions per word.
- `<lang>` — optional language tag from `GET /spellcheck`; default `en`.

An unsupported language gives `400` ("Failed to spellcheck, probably unsupported
language"). Any logged in identity may call it.

### Request

`POST https://api.cloudbackend.com/v1/spellcheck`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<spellCheck>`

```xml
<spellCheck>
  <suggestions>5</suggestions>
  <lang>en_US</lang>
  <text>helo wrld</text>
</spellCheck>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The text with misspelled words marked |
| `400` | Bad Request — "Missing text element", "Missing suggestions element", or "Failed to spellcheck, probably unsupported language". |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — "Content-Type must be text/xml or appliction/xml". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<text>`

```xml
<text xmlns:sc="urn:x-i-o-s:spellcheck"><sc:spell><sc:orig>helo</sc:orig><sc:sugg>hello</sc:sugg><sc:sugg>help</sc:sugg></sc:spell> <sc:spell><sc:orig>wrld</sc:orig><sc:sugg>world</sc:sugg></sc:spell></text>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/spellcheck" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<spellCheck>
  <suggestions>5</suggestions>
  <lang>en_US</lang>
  <text>helo wrld</text>
</spellCheck>'
```

---

## DELETE /unsubscribe <a id="deletev1unsubscribe"></a>

**Unsubscribe email**

Unsubscribes an email address from notifications for a tenant.

### Request

`DELETE https://api.cloudbackend.com/v1/unsubscribe`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `email` | query | yes | string | The email address to unsubscribe |
| `tenant` | query | yes | string | The tenant name |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Unsubscribed successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/unsubscribe?email={email}&tenant={tenant}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE / <a id="deletev1"></a>

**Delete session (no-op)**

Does nothing and returns 204 No Content

### Request

`DELETE https://api.cloudbackend.com/v1/`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
OK
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET / <a id="getv1"></a>

**Get session (no-op)**

Does nothing and returns 204 No Content

### Request

`GET https://api.cloudbackend.com/v1/`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<session>`

```xml
<session>{session_token}</session>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /agreement/{agreementName}/{group_id} <a id="getv1agreement"></a>

**Get agreement version**

Returns the version of the named agreement (for example a EULA or terms of service)
that the logged-in identity has accepted within the given group, typically the
tenant group.

The response body is the bare version number as plain text. `0` means the
identity has not accepted any version of this agreement.

### Request

`GET https://api.cloudbackend.com/v1/agreement/{agreementName}/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `agreementName` | path | yes | string | Name of the agreement, chosen by the application (for example `dashboard`). |
| `group_id` | path | yes | integer | Group the agreement belongs to, usually the tenant group id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Accepted version, or `0` if never accepted |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
0
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/agreement/{agreementName}/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /agreement/{agreementName}/{group_id} <a id="postv1agreement"></a>

**Accept agreement**

Records that the logged-in identity has accepted the given version of the named
agreement within the group. Posting again overwrites the stored version.

### Request

`POST https://api.cloudbackend.com/v1/agreement/{agreementName}/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `agreementName` | path | yes | string | Name of the agreement, chosen by the application (for example `dashboard`). |
| `group_id` | path | yes | integer | Group the agreement belongs to, usually the tenant group id. |

#### Body

`application/xml` (required), root element `<agreement>`

```xml
<agreement version="100" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Agreement version stored |
| `400` | Bad Request — body is not an `<agreement>` element |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/agreement/{agreementName}/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<agreement version="100" />'
```

---

## DELETE /apikey <a id="deletev1apikey"></a>

**Delete an API key**

Deletes one of the logged-in identity's API keys, or all of them.

Pass exactly one selector: `all`, `api_key`, `name` or `id`. With `all=1` every API
key of the caller is removed and the other parameters are ignored. Combining
`api_key` or `name` with another selector returns 400, as does passing no selector.
Deleting a key also removes its links to configurations (e.g. webhooks).

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/apikey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | no | string | Name of the API key to delete. |
| `api_key` | query | no | string | The API key secret itself (as returned by `POST /apikey`); the server hashes it to find the key. |
| `id` | query | no | integer | Id of the API key to delete. |
| `all` | query | no | string · one of `1`, `true` | Set to `1` (or `true`) to delete all API keys of the caller. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | API key(s) deleted |
| `400` | Bad Request — no selector, or more than one selector |
| `401` | Unauthorized |
| `404` | Not Found — `Invalid API key`, `Invalid API key name`, or the id does not belong to the caller |
| `500` | Internal Server Error |

#### `404` · text/plain

```text
Invalid API key
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/apikey" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /apikey <a id="getv1apikey"></a>

**List API keys**

Lists all API keys created by the logged-in identity, with their scopes. The secret
values are never returned — they are stored only as hashes.

No request body.

### Request

`GET https://api.cloudbackend.com/v1/apikey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The caller's API keys (possibly none) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<apikeys>`

```xml
<apikeys>
  <apikey id="{apikey_id}" name="apikey 1" created="2024-03-05T07:11:00Z" updated="2024-03-05T07:11:00Z">
    <scope name="webhook" />
  </apikey>
  <apikey id="{apikey_id}" name="apikey 2" created="2024-03-05T07:11:00Z" updated="2024-03-05T07:11:00Z">
    <scope name="scope1" />
    <scope name="scope2" />
  </apikey>
</apikeys>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/apikey" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /apikey <a id="postv1apikey"></a>

**Create an API key**

Creates a new API key with one or more scopes for the logged-in identity.

The `name` attribute is required and must be unique per identity. At least one
`<scope>` with a non-empty `name` is required.

On success the response returns the API key id and the API key secret. The secret is
not stored anywhere (only its hash is), so the caller must store it securely — it
cannot be retrieved again.

### Request

`POST https://api.cloudbackend.com/v1/apikey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<apikey>`

```xml
<apikey name="webhook api key 3">
  <scope name="webhook:write" />
</apikey>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | API key created |
| `400` | Bad Request — `Invalid name`, `Missing scopes`, or `Could not create an API key, make sure the name is unique` |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<apikey>`

```xml
<apikey id="{apikey_id}" secret="{apikey_secret}"/>
```

#### `400` · text/plain

```text
Could not create an API key, make sure the name is unique
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/apikey" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<apikey name="webhook api key 3">
  <scope name="webhook:write" />
</apikey>'
```

---

## PUT /apikey <a id="putv1apikey"></a>

**Modify an API key**

Renames an API key and/or replaces its scopes. Identify the key with either `name` or
`id` (not both). The key must belong to the logged-in identity.

The body's `name` attribute becomes the new name (it must stay unique per identity;
if omitted the name is unchanged). The `<scope>` elements replace all existing
scopes. The secret is not changed.

### Request

`PUT https://api.cloudbackend.com/v1/apikey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | no | string | Current name of the API key to modify. |
| `id` | query | no | integer | Id of the API key to modify. |

#### Body

`application/xml` (required), root element `<apikey>`

```xml
<apikey name="apikey 2">
  <scope name="new-webhook" />
  <scope name="more" />
</apikey>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | API key updated |
| `400` | Bad Request — both `name` and `id` given, or `Could not update API key` (e.g. the new name is taken) |
| `401` | Unauthorized |
| `404` | Not Found — `Invalid API key name`, or no key with that id owned by the caller |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `404` · text/plain

```text
Invalid API key name
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/apikey" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<apikey name="apikey 2">
  <scope name="new-webhook" />
  <scope name="more" />
</apikey>'
```

---

## POST /downloadzip/{user_id}/webshares <a id="postv1downloadzipwebshares"></a>

**Download webshares as zip**

Downloads the requested webshares and containers as a zip file. Postdata

### Request

`POST https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<webshares>`

```xml
<webshares>
  <webshare name="new webshare name 1" userId="{user_id}" password="pswd1">
    <container id="{container_id}"/>
  </webshare>
  <webshare name="webshare name 2" userId="{user_id}">
    <container id="{container_id}"/>
  </webshare>
</webshares>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshares>`

```xml
<webshares>
<!-- one or more webshares -->
<webshare name="webshare-name" userId="user-id" password="password">
<!-- one or more container ids -->
<container id="container-id1" />
<container id="container-id2" />
<!-- ... -->
</webshare>
<webshare name="webshare-name" userId="user-id" password="password">
<!-- ... -->
</webshare>
<!-- ... -->
</webshares>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshares>
  <webshare name="new webshare name 1" userId="{user_id}" password="pswd1">
    <container id="{container_id}"/>
  </webshare>
  <webshare name="webshare name 2" userId="{user_id}">
    <container id="{container_id}"/>
  </webshare>
</webshares>'
```

---

## DELETE /node <a id="deletev1node"></a>

**Delete all nodes of a tenant**

Deletes every cloud node registered for the tenant named in the request body.
Only the owner of that tenant may call it; anyone else gets `403`. To delete a
single node, use `DELETE /node/{node_id}`.

The body is a `<node>` element with a `<tenant>` child holding the tenant name.
Returns `204 No Content`.

### Request

`DELETE https://api.cloudbackend.com/v1/node`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<node>`

```xml
<node>
  <tenant>{tenant_name}</tenant>
</node>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | All nodes of the tenant deleted |
| `400` | Missing `<tenant>` or not a valid tenant name |
| `401` | Unauthorized |
| `403` | Caller is not the tenant owner |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Not a valid tenant name.
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/node" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<node>
  <tenant>{tenant_name}</tenant>
</node>'
```

---

## POST /node <a id="postv1node"></a>

**Create a node**

Registers a new cloud node for a tenant. Only the owner of the tenant named in
`<tenant>` may call it; anyone else gets `403`.

Body (`<node>`):

- `<tenant>` — tenant name (required).
- `<network>` — at least one of `<ipv4>`, `<ipv6>` and `<dns_name>`; each is
  validated (`400 Invalid ipv4 address.` etc.).
- `<data>` — optional free text stored with the node.
- `<location>` — optional `<country>`, `<latitude>` and `<longitude>`;
  latitude and longitude must be given together and be valid coordinates.

Returns the created node. Empty values are left out of the response, and
`<location>` only appears when a country or a latitude/longitude pair is set.

### Request

`POST https://api.cloudbackend.com/v1/node`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<node>`

```xml
<node>
  <tenant>{tenant_name}</tenant>
  <network>
    <ipv4>123.234.34.45</ipv4>
    <ipv6>1234:5678:9abc:def0::5</ipv6>
    <dns_name>domain.name.com</dns_name>
  </network>
  <location>
    <country>Sweden</country>
    <latitude>59.324603</latitude>
    <longitude>18.055355</longitude>
  </location>
  <data>the data</data>
</node>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Node created |
| `400` | Invalid body, invalid network or location value, unknown tenant, or the node could not be created |
| `401` | Unauthorized |
| `403` | Caller is not the tenant owner |
| `500` | Internal Server Error |

#### `200` · application/xml · `<node>`

```xml
<node id='{node_id}'><network><ipv4>123.234.34.45</ipv4><ipv6>1234:5678:9abc:def0::5</ipv6><dns_name>domain.name.com</dns_name></network><location><country>Sweden</country><latitude>59.324603</latitude><longitude>18.055355</longitude></location><data>the data</data></node>
```

#### `400` · text/plain

*No network address given*

```text
Must specify at least one network subtag (ipv4, ipv6, dns_name).
```

*Unknown tenant*

```text
Not a valid tenant name.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/node" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<node>
  <tenant>{tenant_name}</tenant>
  <network>
    <ipv4>123.234.34.45</ipv4>
    <ipv6>1234:5678:9abc:def0::5</ipv6>
    <dns_name>domain.name.com</dns_name>
  </network>
  <location>
    <country>Sweden</country>
    <latitude>59.324603</latitude>
    <longitude>18.055355</longitude>
  </location>
  <data>the data</data>
</node>'
```

---

## GET /node/list/{tenant name} <a id="getv1nodelist"></a>

**List tenant nodes**

List all nodes for a tenant Only the tenant owner can list all its nodes.

### Request

`GET https://api.cloudbackend.com/v1/node/list/{tenant name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant name` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<nodes>`

```xml
<nodes tenant_name='<tenant_name>' tenant_id='<tenant_id>' owner_id='<owner_id>'>
<node id='2'>
<network>
<ipv4>192.168.1.10</ipv4>
<dns_name>local.dns</dns_name>
</network>
<location>
<latitude>59.324603</latitude>
<longitude>18.055355</longitude>
</location>
</node>
<node id='3'>
<network>
<ipv4>192.168.1.11</ipv4>
<ipv6>aaaa:bbbb:cccc:dddd:eeee:ffff:1111:2222</ipv6>
<dns_name>local2.dns</dns_name>
</network>
<location>
<country>Sweden</country>
<latitude>59.324603</latitude>
<longitude>18.055355</longitude>
</location>
</node>
</nodes>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/node/list/{tenant name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /node/{node_id} <a id="deletev1nodeid"></a>

**Delete a node**

Only tenant owners can delete their nodes. Node with id <node_id> deleted.

### Request

`DELETE https://api.cloudbackend.com/v1/node/{node_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `node_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Node with id 2 deleted.
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/node/{node_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /node/{node_id} <a id="getv1node"></a>

**Get a node**

Get one node All users can fetch a single node by its id.

### Request

`GET https://api.cloudbackend.com/v1/node/{node_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `node_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<node>`

```xml
<node id='<node_id>'>
<network>
<ipv4>192.168.1.1</ipv4>
<ipv6>aaaa:bbbb:cccc:dddd:eeee:ffff:1111:2222</ipv6>
<dns_name>local.dns</dns_name>
</network>
<location>
<country>Sweden</country>
<latitude>59.324603</latitude>
<longitude>18.055355</longitude>
</location>
</node>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/node/{node_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /node/{node_id} <a id="putv1node"></a>

**Modify a node**

Only tenant owners can modify their nodes.

### Request

`PUT https://api.cloudbackend.com/v1/node/{node_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `node_id` | path | yes | integer |  |

#### Body

`application/xml` (optional), root element `<node>`

```xml
<node>
<network>
<ipv4>192.168.1.1</ipv4>
</network>
<location>
<country>Sweden</country>
</location>
</node>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<node>`

```xml
<node id='<node_id>'>
<network>
<ipv4>192.168.1.1</ipv4>
</network>
<location>
<country>Sweden</country>
</location>
</node>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/node/{node_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<node>
<network>
<ipv4>192.168.1.1</ipv4>
</network>
<location>
<country>Sweden</country>
</location>
</node>'
```

---

## GET /organizations <a id="getv1organizations"></a>

**List organizations**

Lists the tenants (organizations) owned by the logged-in identity.

Each `<organization>` gives the tenant group `id`, its `parentGroupId`, `name`,
`signupSourceId` (the tenant id) and `signupSource` (the tenant name), followed by:

- `<subscription>` — the caller's own subscription (product, price, VAT, payment
  method, next charge, period); it is the same for every tenant in the list.
- `<limits>` — the tenant's API call limit (`api`), the object storage limit of the
  subscription's account type (`storage`), and the allowed numbers of users (`user`)
  and groups (`groups`) of the subscription.

An identity that owns no tenant gets `<organizations></organizations>`.

### Request

`GET https://api.cloudbackend.com/v1/organizations`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Tenants owned by the caller |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<organizations>`

```xml
<organizations><organization id="{group_id}" parentGroupId="{parent_group_id}" name='mytenant' signupSourceId="{tenant_id}" signupSource='mytenant'><subscription product='{product}' productId='{product_id}' description='{description}' price='0' vat='0' paymentMethod='{payment_method}' nextCharge='{next_charge}' period='{period}'/><limits api='{api_limit}' storage='{storage_limit}' user='{user_limit}' groups='{groups_limit}'/></organization></organizations>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /organizations <a id="postv1organizations"></a>

**Create an organization**

Creates a new tenant (organization) owned by the logged-in identity. Only identities of
the `cloudbackend` or `xios` tenant may create tenants.

The body is an `<organization>` element with the attributes:

- `name` (required) — tenant name: lower-case letters and digits only, not `master`,
  and not used by any existing or deleted tenant.
- `key` (required when creating a top-level tenant, which is the normal case) — an
  activation key issued to the caller for creating an organization. The key is
  consumed on success.
- `parent` (optional) — parent group id; `0` or left out means the root group, which
  is what a tenant should use.
- `displayname` (optional) — display name for the tenant's defaults; defaults to
  `name`.

The tenant group, tenant settings and the owner's sessions in the new tenant are set
up before the call returns `204 No Content`.

### Request

`POST https://api.cloudbackend.com/v1/organizations`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<organization>`

```xml
<organization name="mytenant" key="{activation_key}" displayname="My Tenant" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Tenant created |
| `400` | Bad Request — the name is empty, has characters other than a-z and 0-9, is reserved, or is already taken. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not create tenants, or the activation key is wrong. |
| `404` | Not Found — the caller's identity data was not found. |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Tenant with that name already exists
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<organization name="mytenant" key="{activation_key}" displayname="My Tenant" />'
```

---

## POST /organizations/{group_id} <a id="postv1organizationsid"></a>

**Create an organization (alias)**

Same as `POST /organizations`: the request is handled by the same code and
`{group_id}` is ignored. Use `POST /organizations` instead.

### Request

`POST https://api.cloudbackend.com/v1/organizations/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Ignored. |

#### Body

`application/xml` (required), root element `<organization>`

```xml
<organization name="mytenant" key="{activation_key}" displayname="My Tenant" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Tenant created |
| `400` | Bad Request — invalid or taken tenant name. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not create tenants, or the activation key is wrong. |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<organization name="mytenant" key="{activation_key}" displayname="My Tenant" />'
```

---

## GET /organizations/{group_id}/api/calls <a id="getv1organizationsapicalls"></a>

**Get total API calls per month**

Gets the total number of API calls per month all the users have made in a month. Query params: To get the total API calls per month from2024-10to2024-11(inclusive), pass instart=1727740800(2024-10-01 00:00:00) andend=1730419200(2024-11-01 00:00:00). The output is sorted by date.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `start` | query | no | string | Start time (inclusive) (unix epoch) |
| `end` | query | no | string | End time (inclusive) (unix epoch) |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<calls>`

```xml
<calls>
<!-- The day of the month will always be 1 and the time will always be 00:00:00 -->
<!-- Zero or more of these -->
<!-- This is sorted by date -->
<date value='ATOM-TIME' numCalls='INTEGER'/>
</calls>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/api/calls/user/{user_id} <a id="getv1organizationsapicallsuser"></a>

**Get API calls for a user**

Gets total API calls per month made by one user. The output is sorted by date. The output includes deleted users (if they're still in the db) since it returns historical data.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<calls>`

```xml
<calls>
<!-- Zero or more of these -->
<user id='USER-ID' date='ATOM-TIME' numCalls='INTEGER' />
</calls>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/api/calls/user/{user_id}/block <a id="getv1organizationsapicallsuserblock"></a>

**Get user blocked status**

Returns whether an identity of the caller's tenant is blocked from calling APIs
(`blocked='true'`) or not (`blocked='false'`). Same as the GET on the `/unblock` path.

The caller must be owner or administrator of a tenant, and the identity must belong to
that tenant. `{group_id}` is not used: the tenant is the one the caller owns or
administers.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/block`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group id (ignored; the caller's tenant is used). |
| `user_id` | path | yes | integer | Identity to check. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Blocked status |
| `400` | Bad Request — the caller is not owner or administrator of a tenant (`Not owner or admin of tenant`), or the identity is unknown or not in the caller's tenant (`Invalid user id`). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<user>`

```xml
<user id='{user_id}' blocked='true'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/block" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /organizations/{group_id}/api/calls/user/{user_id}/block <a id="postv1organizationsapicallsuserblock"></a>

**Block user from APIs**

Blocks an identity of the caller's tenant from calling any API until it is unblocked
with `POST /organizations/{group_id}/api/calls/user/{user_id}/unblock`. Blocked
identities are listed by `GET /organizations/{group_id}/api/calls/users/blocked`.

The caller must be owner or administrator of a tenant; the identity must belong to that
tenant and must not be the tenant owner. `{group_id}` is not used. No request body.

### Request

`POST https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/block`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group id (ignored; the caller's tenant is used). |
| `user_id` | path | yes | integer | Identity to block. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Identity blocked |
| `400` | Bad Request — the caller is not owner or administrator of a tenant, or the identity is unknown, not in the caller's tenant, or the tenant owner (`Invalid user id`). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid user id
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/block" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/api/calls/user/{user_id}/unblock <a id="getv1organizationsapicallsuserunblock"></a>

**Get user blocked status**

Returns whether an identity of the caller's tenant is blocked from calling APIs
(`blocked='true'`) or not (`blocked='false'`). Same as the GET on the `/block` path.

The caller must be owner or administrator of a tenant, and the identity must belong to
that tenant. `{group_id}` is not used: the tenant is the one the caller owns or
administers.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/unblock`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group id (ignored; the caller's tenant is used). |
| `user_id` | path | yes | integer | Identity to check. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Blocked status |
| `400` | Bad Request — the caller is not owner or administrator of a tenant (`Not owner or admin of tenant`), or the identity is unknown or not in the caller's tenant (`Invalid user id`). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<user>`

```xml
<user id='{user_id}' blocked='false'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/unblock" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /organizations/{group_id}/api/calls/user/{user_id}/unblock <a id="postv1organizationsapicallsuserunblock"></a>

**Unblock user from APIs**

Lets an identity of the caller's tenant call APIs again after it was blocked with
`POST /organizations/{group_id}/api/calls/user/{user_id}/block`.

The caller must be owner or administrator of a tenant; the identity must belong to that
tenant and must not be the tenant owner. `{group_id}` is not used. No request body.

### Request

`POST https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/unblock`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group id (ignored; the caller's tenant is used). |
| `user_id` | path | yes | integer | Identity to unblock. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Identity unblocked |
| `400` | Bad Request — the caller is not owner or administrator of a tenant, or the identity is unknown, not in the caller's tenant, or the tenant owner (`Invalid user id`). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid user id
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/user/{user_id}/unblock" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/api/calls/users <a id="getv1organizationsapicallsusers"></a>

**Get API calls per user**

Gets the total number of API calls per month each user has made. The output is sorted by date, number of calls, user id (in that order). The output includes deleted users (if they're still in the db) since it returns historical data. Query params: To get the total API calls per month from2024-10to2024-11(inclusive), pass instart=1727740800(2024-10-01 00:00:00) andend=1730419200(2024-11-01 00:00:00).

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `start` | query | no | string | Start time (inclusive) (unix epoch) |
| `end` | query | no | string | End time (inclusive) (unix epoch) |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<calls>`

```xml
<calls>
<!-- Zero or more of these -->
<date value='ATOM-TIME'>
<!-- One or more of these -->
<user id='USER-ID' date='ATOM-TIME' numCalls='INTEGER' />
</date>
</calls>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/api/calls/users/blocked <a id="getv1organizationsapicallsusersblocked"></a>

**List blocked users**

Gets a list of all blocked users. A blocked user is not allowed to call any API. Get list of blocked users. See REST Resource ApiCallsUserBlock for more details.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/users/blocked`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<blockedUsers>`

```xml
<blockedUsers>
<!-- Zero or more of these -->
<user id='USER-ID'/>
</blockedUsers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/api/calls/users/blocked" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /pricelist <a id="getv1pricelist"></a>

**Get price list**

Returns the tenant's products (price plans) with prices, as seen by the logged-in
identity. Requires a logged-in identity; the call is allowed even when the
tenant is blocked for non-payment. For anonymous visitors use
`GET /publicpricelist`.

The tenant is taken from `?source=`, otherwise from the request's tenant
(`tenant` header, `?tenant=`, `tenant` cookie or host name); an unknown tenant
returns `403 tenant not found.`

Without parameters the identity's own coupon discount (if any) and VAT (from
the identity's billing country) are applied. With `country`, VAT is calculated
for that country instead; with `coupon`, that coupon campaign's discount is
applied. If both are given, only `country` is used.

**Response.** `<pricelist>` with one `<product>` per product. When a discount
applies, `<pricelist>` has `discountPercentage`, `expires` (or
`expiresAfterDays`), `activationExpires`, `discountedProductGroup` and
`discountAllProducts`; when VAT applies, `vatPercentage`. Each `<product>` has:
`id`, `sub` (sub-account product, `1`/`0`), `subscription` (`1`/`0`), `name`
(account type name), `product_name`, `typeId`, `typeSize`, `duration` (months),
`cloudosMonth`, `description`, `exclVat` (business product, prices excluding
VAT), `price` (EUR), `discount` (percent), `vat` (EUR VAT), the price in each
currency (`EUR`, `USD`, `SEK`, `NOK`, `DKK`, `GBP`) and its VAT (`vatEUR` …
`vatGBP`), and `amount`. Prices are in cents. A bundle product lists the
products it contains as `<included amount typeId type typeSize description/>`
children.

### Request

`GET https://api.cloudbackend.com/v1/pricelist`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `coupon` | query | no | string | Coupon code whose campaign discount is applied to the prices. Ignored when `country` is also given. An unknown code returns `400`. |
| `country` | query | no | string | Country code used to calculate VAT instead of the identity's billing country. |
| `source` | query | no | string | Tenant name whose products are listed. Defaults to the request's tenant. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Price list |
| `400` | Coupon code not valid for the tenant |
| `401` | Unauthorized |
| `403` | Unknown tenant |
| `500` | Internal Server Error |

#### `200` · application/xml · `<pricelist>`

```xml
<pricelist vatPercentage='{vat_percent}'><product id='{product_id}' sub='0' subscription='1' name='{account_type_name}' product_name='{product_name}' typeId='{type_id}' typeSize='104857600' duration='1' cloudosMonth='1' description='This is product #1' exclVat='false' price='12345' discount='0' vat='{eur_vat}' EUR='12345' USD='{usd_cents}' SEK='{sek_cents}' NOK='{nok_cents}' DKK='{dkk_cents}' GBP='{gbp_cents}' vatEUR='{eur_vat}' vatUSD='{usd_vat}' vatSEK='{sek_vat}' vatNOK='{nok_vat}' vatDKK='{dkk_vat}' vatGBP='{gbp_vat}' amount='1'></product></pricelist>
```

#### `400` · text/plain

```text
Not a valid coupon code
```

#### `403` · text/plain

```text
tenant not found.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/pricelist" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /publicpricelist <a id="getv1publicpricelist"></a>

**Get public price list**

Returns the tenant's products (price plans) with prices, without logging in —
for example for a pricing page or a sign-up flow. No credentials are needed,
and the call is allowed even when the tenant is blocked for non-payment.

The tenant is taken from `?source=`, otherwise from the request's tenant
(`tenant` header, `?tenant=`, `tenant` cookie or host name); an unknown tenant
returns `403 tenant not found.`

Unlike `GET /pricelist`, no identity is
involved: VAT is only calculated when `country` is given, a discount only
applied when `coupon` is given, and both may be combined.

The response has the same format as `GET /pricelist`: `<pricelist>` (with
`discountPercentage`, `expires`/`expiresAfterDays`, `activationExpires`,
`discountedProductGroup` and `discountAllProducts` when a coupon applies, and
`vatPercentage` when VAT applies) containing one `<product>` per product.
Prices are in cents; see `GET /pricelist` for the product attributes.

### Request

`GET https://api.cloudbackend.com/v1/publicpricelist`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `coupon` | query | no | string | Coupon code whose campaign discount is applied to the prices. An unknown code returns `400`. |
| `country` | query | no | string | Country code used to calculate VAT. Without it no VAT is calculated. |
| `source` | query | no | string | Tenant name whose products are listed. Defaults to the request's tenant. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Price list |
| `400` | Coupon code not valid for the tenant |
| `403` | Unknown tenant |
| `500` | Internal Server Error |

#### `200` · application/xml · `<pricelist>`

```xml
<pricelist><product id='{product_id}' sub='0' subscription='1' name='{account_type_name}' product_name='{product_name}' typeId='{type_id}' typeSize='104857600' duration='1' cloudosMonth='1' description='This is product #1' exclVat='false' price='12345' discount='0' vat='0' EUR='12345' USD='{usd_cents}' SEK='{sek_cents}' NOK='{nok_cents}' DKK='{dkk_cents}' GBP='{gbp_cents}' vatEUR='0' vatUSD='0' vatSEK='0' vatNOK='0' vatDKK='0' vatGBP='0' amount='1'></product></pricelist>
```

#### `400` · text/plain

```text
Not a valid coupon code
```

#### `403` · text/plain

```text
tenant not found.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/publicpricelist" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /ratings <a id="deletev1ratings"></a>

**Remove a rating**

Removes the caller's own rating of an object, and subtracts it from the
object's totals. If the caller has not rated the object, nothing changes.

Requires a logged-in identity (the public user gets `403`). The rating
definition's ACL must give the caller DELETE access (an ACL of `0` allows
everyone). The object is identified by `item_id` and `parent_id`, and its
datatype must match the rating definition.

Returns `204 No Content`. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/ratings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | yes | string | Name of the rating definition (defined for a datatype in the tenant). |
| `item_id` | query | yes | integer | Id of the rated object. |
| `parent_id` | query | yes | integer | Id of the container holding the object. |
| `item_kind` | query | no | string · one of `document` · default `document` | Kind of rated item. Only `document` (an object) is supported; any other value returns `400 Invalid item_kind`. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Rating removed |
| `400` | Missing or invalid parameter, unknown rating name, or the object cannot be rated with this definition |
| `401` | Unauthorized |
| `403` | Public user, or the rating ACL denies DELETE |
| `500` | Internal Server Error |

#### `400` · text/plain

*parent_id missing*

```text
Missing parent_id
```

*No rating definition with that name*

```text
Rating name does not exist
```

*Object's datatype does not match the definition*

```text
It's not possible to rate this document
```

#### `403` · text/plain

```text
Forbidden
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/ratings?name={name}&item_id={item_id}&parent_id={parent_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /ratings <a id="getv1ratings"></a>

**Get ratings**

Returns the rating totals of an object for one rating definition, and what the
caller rated it.

Can be called by a logged-in identity or by the public user (no credentials).
The rating definition's ACL must give the caller READ access (an ACL of `0`
allows everyone). The object is identified by `item_id` and `parent_id`, and
its datatype must match the rating definition.

The response is a single `<rating>` element: `name`, `min_value` and
`max_value` of the definition, `total_ratings` (number of ratings),
`sum_ratings` (sum of all ratings), `user_rating` (the caller's rating, `0` if
none) and `user_has_rated` (`true`/`false`; always `false` for the public
user).

### Request

`GET https://api.cloudbackend.com/v1/ratings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | yes | string | Name of the rating definition (defined for a datatype in the tenant). |
| `item_id` | query | yes | integer | Id of the rated object. |
| `parent_id` | query | yes | integer | Id of the container holding the object. |
| `item_kind` | query | no | string · one of `document` · default `document` | Kind of rated item. Only `document` (an object) is supported; any other value returns `400 Invalid item_kind`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Rating totals and the caller's rating |
| `400` | Missing or invalid parameter, unknown rating name, invalid object, or the object cannot be rated with this definition |
| `401` | Unauthorized |
| `403` | The rating ACL denies READ |
| `500` | Internal Server Error |

#### `200` · application/xml · `<rating>`

```xml
<rating name="dt1-acl3" min_value="-100" max_value="100" total_ratings="0" sum_ratings="0" user_rating="0" user_has_rated="false" />
```

#### `400` · text/plain

*parent_id missing*

```text
Missing parent_id
```

*Unsupported item_kind*

```text
Invalid item_kind
```

*item_id/parent_id do not name an object*

```text
Invalid folder id or document id
```

#### `403` · text/plain

```text
Forbidden
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/ratings?name={name}&item_id={item_id}&parent_id={parent_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /ratings <a id="postv1ratings"></a>

**Rate an item**

Rates an object, or changes the caller's earlier rating of it. The totals are
updated: a first rating adds one to `total_ratings`, a changed rating only
adjusts `sum_ratings`.

Can be called by a logged-in identity or by the public user (no credentials).
Public ratings are not stored per user, so every public call counts as a new
rating. The rating definition's ACL must give the caller WRITE access (an ACL
of `0` allows everyone). The object is identified by `item_id` and
`parent_id`, and its datatype must match the rating definition. `rating` must
lie between the definition's minimum and maximum.

Returns `204 No Content`. No request body; all input is in query parameters.

### Request

`POST https://api.cloudbackend.com/v1/ratings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | yes | string | Name of the rating definition (defined for a datatype in the tenant). |
| `item_id` | query | yes | integer | Id of the object to rate. |
| `parent_id` | query | yes | integer | Id of the container holding the object. |
| `item_kind` | query | no | string · one of `document` · default `document` | Kind of rated item. Only `document` (an object) is supported; any other value returns `400 Invalid item_kind`. |
| `rating` | query | no | integer | The rating value, between the definition's `min_value` and `max_value` (may be negative). Defaults to `0` if omitted. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Rating stored |
| `400` | Missing or invalid parameter, rating out of range, unknown rating name, or the object cannot be rated with this definition |
| `401` | Unauthorized |
| `403` | The rating ACL denies WRITE |
| `500` | Internal Server Error |

#### `400` · text/plain

*Below the minimum*

```text
Rating value is less than min value
```

*Above the maximum*

```text
Rating value is greater than max value
```

*No rating definition with that name*

```text
Rating name does not exist
```

#### `403` · text/plain

```text
Forbidden
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/ratings?name={name}&item_id={item_id}&parent_id={parent_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /referral <a id="postv1referral"></a>

**Validate a referral code**

Checks whether a referral (campaign) code is valid for the tenant the request is
made against. No authentication is required.

The tenant is resolved from the `Tenant` request header, the `?tenant=` query
parameter, the `tenant` cookie or the host name, in that order. The code is looked
up among the tenant's referral codes and campaign codes for the given action; when
`email` is given, the code is also checked for having already been used by that
e-mail address.

The request body is a `<validCode>` element:

- `code` (required) — the referral code to check.
- `email` (optional) — e-mail address of the identity about to use the code.
- `action` (optional) — the campaign action. Only `signup` is accepted (the
  default); any other value returns 400.

The response echoes the attributes in a `<response>` element whose text is the
result: `VALID_CODE`, `INVALID_CODE` (unknown or expired code) or `INVALID_EMAIL`
(the e-mail address has already used this code). The `action` attribute is empty
when no action was sent.

### Request

`POST https://api.cloudbackend.com/v1/referral`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant` | query | no | string | Tenant key, used only when no `Tenant` header is sent. Selects the tenant whose referral campaigns are checked. |

#### Body

`application/xml` (required), root element `<validCode>`

```xml
<validCode code="ABC123" email="new.user@example.com" action="signup" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Validation result |
| `400` | Body is not a `<validCode>` element, `code` is missing, `action` is not `signup`, or the tenant has no referral campaign owner |
| `500` | Internal Server Error |

#### `200` · application/xml · `<response>`

*Code is valid*

```xml
<response code='ABC123' email='new.user@example.com' action='signup'>VALID_CODE</response>
```

*Code already used by this e-mail address*

```xml
<response code='ABC123' email='new.user@example.com' action='signup'>INVALID_EMAIL</response>
```

*Unknown or expired code*

```xml
<response code='NOPE' email='' action=''>INVALID_CODE</response>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/referral" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<validCode code="ABC123" email="new.user@example.com" action="signup" />'
```

---

## DELETE /users/{user_id}/config/{config_path} <a id="deletev1usersconfigpath"></a>

**Delete config values**

Deletes all config values at and below `config_path` (the whole subtree).
`DELETE /users/{user_id}/config/` clears the user's entire config.

Only the user itself may call it.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path, one or more `/`-separated segments such as `a/b/` (may be empty for the root). Each segment must start with a letter or `_` followed by letters, digits, `-` or `_`, or be a number. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Values deleted |
| `400` | Bad Request (invalid path segment) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/config/{config_path} <a id="getv1usersconfigpath"></a>

**Get config values**

Returns the config subtree at `config_path` as XML. Each path segment becomes an
element and each key becomes an attribute. The root element is named after the last
path segment; for the root path (`/config` or `/config/`) it is `<config>`.

Example: `GET /users/{user_id}/config/a/` returns the `<a>` subtree. A path with no
stored values gives `404` (the root path returns an empty `<config/>` instead).

Only the user itself may call it.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path, one or more `/`-separated segments such as `a/` (may be empty for the root). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The config subtree |
| `400` | Bad Request (invalid path segment) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (no values below the path) |
| `500` | Internal Server Error |

#### `200` · application/xml

*GET .../config/a/ (from the live tests)*

```xml
<a x1='123' x2='abc'>
  <b y1='x'>
    <c z1='y' />
  </b>
  <b2>
    <c2 ab='12' />
  </b2>
</a>
```

*GET .../config (from the live tests)*

```xml
<config>
  <a>
    <b c='a-b-c' />
  </a>
  <x y='some text' />
</config>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PATCH /users/{user_id}/config/{config_path} <a id="patchv1usersconfig"></a>

**Patch config values**

Merges the XML body into the config subtree at `config_path`: keys present in the
body are added or overwritten, other existing keys are kept. An attribute with an
empty value removes that key, and an empty element (no attributes, no children)
removes that subtree.

The name of the body's root element is ignored — the root stands for the node at
`config_path`; its attributes become keys there and its child elements become
sub-paths. Text content is ignored. `POST` does the same (for clients that cannot
send PATCH).

Only the user itself may call it.

### Request

`PATCH https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path, one or more `/`-separated segments such as `a/b/` (may be empty for the root). |

#### Body

`application/xml` (required)

```xml
<b z1='x1'>
  <c q1='y2'/>
</b>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Values merged |
| `400` | Bad Request (invalid XML or invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PATCH "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<b z1='\''x1'\''>
  <c q1='\''y2'\''/>
</b>'
```

---

## POST /users/{user_id}/config/{config_path} <a id="postv1usersconfig"></a>

**Modify config values**

Same as `PATCH`: merges the XML body into the config subtree at `config_path`,
adding or overwriting keys and keeping the others. An attribute with an empty value
removes that key; an empty element removes that subtree. The body's root element
name is ignored (it stands for the node at `config_path`).

Only the user itself may call it.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path, one or more `/`-separated segments such as `a/b/` (may be empty for the root). |

#### Body

`application/xml` (required)

```xml
<b z1='x1'>
  <c q1='y2'/>
</b>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Values merged |
| `400` | Bad Request (invalid XML or invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<b z1='\''x1'\''>
  <c q1='\''y2'\''/>
</b>'
```

---

## PUT /users/{user_id}/config/{config_path} <a id="putv1usersconfigpath"></a>

**Set config values**

Replaces the config subtree at `config_path` with the XML body: all existing values
below the path are removed first, then the body is stored. The body's root element
name is ignored — it stands for the node at `config_path`; its attributes become
keys there and its child elements become sub-paths. Text content is ignored.

Example: `PUT /users/{user_id}/config/` with `<root><a x1='123'><b y1='x'/></a></root>`
stores `/a;x1` and `/a/b;y1`.

Only the user itself may call it.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path, one or more `/`-separated segments such as `a/b/` (may be empty for the root). |

#### Body

`application/xml` (required)

```xml
<root>
  <a x1='123' x2='abc'>
    <b y1='x'>
      <c z1='y'/>
    </b>
    <b2>
      <c2 ab='12'/>
    </b2>
  </a>
</root>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Subtree replaced |
| `400` | Bad Request (invalid XML or invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<root>
  <a x1='\''123'\'' x2='\''abc'\''>
    <b y1='\''x'\''>
      <c z1='\''y'\''/>
    </b>
    <b2>
      <c2 ab='\''12'\''/>
    </b2>
  </a>
</root>'
```

---

## DELETE /users/{user_id}/config/{config_path}{config_key} <a id="deletev1usersconfigkey"></a>

**Delete config key**

Deletes a single config key. The key is addressed with matrix syntax: the config
path followed by `;` and the key name, e.g.
`DELETE /users/{user_id}/config/a/b;c` deletes key `c` of node `/a/b`.

Only the user itself may call it.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path of the node, `/`-separated segments such as `a/b` or `a/b/`. |
| `config_key` | path | yes | string · pattern `^;[a-zA-Z][-a-zA-Z0-9]*$` | `;` followed by the key name, e.g. `;c`. The key name must start with a letter and contain only letters, digits and `-`. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key deleted |
| `400` | Bad Request (invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/config/{config_path}{config_key} <a id="getv1usersconfigkey"></a>

**Get config key value**

Returns the value of a single config key as plain text (UTF-8). The key is addressed
with matrix syntax: the config path followed by `;` and the key name, e.g.
`GET /users/{user_id}/config/a/b;c` returns key `c` of node `/a/b`, and
`GET /users/{user_id}/config/user;locale` returns the user's locale.

A key that is not set (or has an empty value) gives `404` with an empty body.

Only the user itself may call it.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path of the node, `/`-separated segments such as `a/b` or `a/b/`. |
| `config_key` | path | yes | string · pattern `^;[a-zA-Z][-a-zA-Z0-9]*$` | `;` followed by the key name, e.g. `;c`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The value |
| `400` | Bad Request (invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (key not set) |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
a-b-c
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/config/{config_path}{config_key} <a id="putv1usersconfigkey"></a>

**Set config key value**

Sets the value of a single config key, creating it if needed. The key is addressed
with matrix syntax: the config path followed by `;` and the key name, e.g.
`PUT /users/{user_id}/config/a/b;c`.

The request body is the raw value. `Content-Type` must be `text/plain` (optionally
`; charset=utf-8`); any other content type gives `415`.

Only the user itself may call it.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `config_path` | path | yes | string | Config path of the node, `/`-separated segments such as `a/b` or `a/b/`. |
| `config_key` | path | yes | string · pattern `^;[a-zA-Z][-a-zA-Z0-9]*$` | `;` followed by the key name, e.g. `;c`. The key name must start with a letter and contain only letters, digits and `-`. |

#### Body

`text/plain` (required)

```text
1-2-3
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Value stored |
| `400` | Bad Request (invalid path segment or key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `415` | Unsupported Media Type (Content-Type is not `text/plain`) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/config/{config_path}{config_key}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d '1-2-3'
```

---

## GET /users/{user_id}/emailconfigs <a id="getv1usersemailconfigs"></a>

**List email configurations**

Returns all active e-mail groups of the tenant with the logged-in user's choice for
each (`receive` true/false). The `user_id` in the path is not used; the call always
acts on the logged-in user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/emailconfigs`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | E-mail groups |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<emailconfig>`

```xml
<emailconfig>
  <email_group id="100" name="feedback" label="Feedback" receive="false">Help us get better by giving us your feedback.</email_group>
  <email_group id="10" name="sharing" label="Sharing" receive="true">Receive email when someone has shared something with you.</email_group>
</emailconfig>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/emailconfigs" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/emailconfigs <a id="putv1usersemailconfigs"></a>

**Modify email configuration**

Sets whether the logged-in user receives e-mail from one or more e-mail groups. Each
`<email_group>` gives the group `id` and `receive`; any value other than `false`
means receive. Groups not listed are left unchanged. The `user_id` in the path is not
used; the call always acts on the logged-in user.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/emailconfigs`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

#### Body

`application/xml` (required), root element `<emailconfig>`

```xml
<emailconfig>
  <email_group id="{email_group_id}" receive="false"/>
</emailconfig>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Configuration updated |
| `400` | Bad Request (invalid XML) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/emailconfigs" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<emailconfig>
  <email_group id="{email_group_id}" receive="false"/>
</emailconfig>'
```

---

## GET /version <a id="getv1version"></a>

**Get API version**

Returns the current API version string.

### Request

`GET https://api.cloudbackend.com/v1/version`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | API version |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
0.1.1
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/version" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /healthcheck <a id="getv1healthcheck"></a>

**Health check**

Checks that the service is up and can read from the database. No authentication is required.

Returns 200 with an empty body when healthy. On a microcloud build the body is `<microcloud/>`.

### Request

`GET https://api.cloudbackend.com/v1/healthcheck`

Needs no session token: the description above says how this operation is authorized.

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Service is healthy. Empty body (or `<microcloud/>` on a microcloud build). |
| `500` | `Database connection error.` |

#### `200` · application/xml

```xml
<microcloud/>
```

#### `500` · text/plain

```text
Database connection error.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/healthcheck"
```

---

## POST /callai <a id="postv1callai"></a>

**Proxy a request to the AI provider**

Forwards a request to the configured AI provider and returns the raw provider
response along with token usage. The provider payload is carried verbatim inside
`<http-data>`, normally in a CDATA section, and is not interpreted by the service.

Compare `/call/{group_id}`, which proxies to a group's configured endpoint.

### Request

`POST https://api.cloudbackend.com/v1/callai`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<proxy>`

```xml
<proxy>
  <http-data><![CDATA[{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1,
    "messages": [
      {"role": "user", "content": "..."}
    ]
  }]]></http-data>
</proxy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Proxy result. `serverHttpCode` carries the provider's own status code, so a 200 here does not by itself mean the provider call succeeded. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<result>`

```xml
<result>
  <curlCode>0</curlCode>
  <serverHttpCode>200</serverHttpCode>
  <totalInputTokenUsage>{tokens}</totalInputTokenUsage>
  <totalOutputTokenUsage>{tokens}</totalOutputTokenUsage>
  <dataContentType>application/json</dataContentType>
  <data><![CDATA[{provider_response_body}]]></data>
</result>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/callai" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<proxy>
  <http-data><![CDATA[{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1,
    "messages": [
      {"role": "user", "content": "..."}
    ]
  }]]></http-data>
</proxy>'
```

---
