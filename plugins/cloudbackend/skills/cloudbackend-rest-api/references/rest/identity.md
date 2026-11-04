# REST API — Identity

72 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /avatar/{user_id} <a id="getv1avatar"></a>

**Get user avatar**

Returns the 128×128 avatar image (PNG) of an identity. This call does not require
authentication.

The avatar is looked up from the `avatar` entry in the identity's profile, which
points to the container holding the avatar images; the object
`avatar_x128.png` in that container is returned. For other sizes use
`GET /avatar/{user_id}/{size}`.

Returns 404 if no avatar is set.

No request body.

### Request

`GET https://api.cloudbackend.com/v1/avatar/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the identity whose avatar to fetch. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Avatar image |
| `404` | Not Found — the identity has no avatar |
| `500` | Internal Server Error |

#### `404` · text/plain

```text
Not Found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/avatar/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/eula <a id="getv1userseula"></a>

**Get EULA acceptance**

Returns the EULA version and acceptance date for a user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/eula`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | EULA info |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<eula>`

```xml
<eula>
  <version>{version}</version>
  <acceptedAt>{datetime}</acceptedAt>
</eula>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/eula" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/eula <a id="putv1userseula"></a>

**Accept EULA**

Accepts a specific version of the EULA for a user.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/eula`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<version>`

```xml
<version>1200</version>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | EULA accepted |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/eula" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<version>1200</version>'
```

---

## PUT /users/{user_id}/config/user;locale <a id="putv1userconfiglocale"></a>

**Set user locale config**

Sets the locale configuration for a user.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/config/user;locale`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`text/plain` (required)

```text
sv_SE
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Locale updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/config/user;locale" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d 'sv_SE'
```

---

## GET /mygroups <a id="getv1mygroups"></a>

**Get user groups**

Returns the list of groups the authenticated user belongs to.

### Request

`GET https://api.cloudbackend.com/v1/mygroups`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of groups |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<groups>`

```xml
<groups />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/mygroups" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id} <a id="getv1users"></a>

**Get user info**

Returns detailed user information including profile, locale, and billing.

The e-mail address (in the user entry and in `<billing>`) is only included when the
caller is the user itself, or the owner or an administrator of the user's tenant.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. |
| `datasrc` | query | no | string · one of `datamodel` | Pass `datamodel` to have the embedded user entry built in its data-model form. Any other value, or leaving it out, returns the standard entry. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User info |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<userInfo>`

```xml
<userInfo>
  <user>
    <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
      <atom:title>{username}</atom:title>
      <atom:published />
      <atom:updated />
      <atom:link rel="alternate" type="application/octet-stream" href="" length="0" />
      <atom:id />
      <dc:group xmlns:dc="http://xcerion.com/directory.xsd">{group_id}</dc:group>
      <dc:user>{user_id}</dc:user>
      <dc:unique>{user_id}</dc:unique>
      <atom:author>
        <atom:name>{display_name}</atom:name>
      </atom:author>
      <dc:gender />
      <dc:country>{country}</dc:country>
      <dc:email>{email}</dc:email>
      <dc:client>{client}</dc:client>
      <dc:display>{display_name}</dc:display>
      <dc:social>{social}</dc:social>
    </atom:entry>
    <logins last="{last_login}" number="{login_count}" />
  </user>
  <locale>{locale}</locale>
  <billing>
    <vat />
    <name />
    <reference />
    <reference2 />
    <email>{billing_email}</email>
    <phone />
    <address />
    <city />
    <zipCode />
    <country>{country}</country>
    <countryFull>{country_full}</countryFull>
  </billing>
</userInfo>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id} <a id="deletev1users"></a>

**Delete a user (async)**

**Not implemented on this path.** The resource behind `/users/{user_id}` only
implements GET and POST, so a DELETE here is answered with `405 Method Not Allowed`.

To delete a user, use `DELETE /users/{user_id}/delete?code=...` (after requesting a
confirmation code with `GET /users/{user_id}/delete`). The query parameters below are
the ones that endpoint takes.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. |
| `code` | query | yes | string | Confirmation code sent by e-mail by `GET /users/{user_id}/delete`. |
| `forget` | query | no | integer · one of `0`, `1` | `1` (default) also forgets the user (removes it from indexes); `0` keeps it. |
| `deleteContent` | query | no | integer · one of `0`, `1` | `1` also deletes the user's stored content; `0` (default) does not. |

### Responses

| Status | Meaning |
| --- | --- |
| `401` | Unauthorized |
| `405` | Method Not Allowed (DELETE is not implemented on this path) |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}?code={code}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id} <a id="postv1users"></a>

**Change password**

Changes the user's password. The body is form encoded with the current and the new
password. The current password is verified before the change; a wrong current
password gives `403`.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. |

#### Body

`application/x-www-form-urlencoded` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Password changed |
| `400` | Bad Request (missing or empty `currentPassword` or `password`, unknown user) |
| `401` | Unauthorized |
| `403` | Forbidden (invalid current password) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8"
```

---

## GET /userdb <a id="getv1userdb"></a>

**Query user database**

Queries the user database for a group using OpenSearch-style queries.

### Request

`GET https://api.cloudbackend.com/v1/userdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group to query. |
| `memberid` | query | no | integer · default `0` | Member to look up. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Query results |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryUserDBResponse>`

```xml
<queryUserDBResponse>
  <db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:atom="http://www.w3.org/2005/Atom" xlink:actuate="onRequest" xlink:href="home://">
    <db:paging start="0" size="100" total="1"/>
    <db:user name="testTenantCBE" id="{user_id}" cid="{group_id}" published="{datetime}" updated="{datetime}">
      <author>test tenant</author>
      <userid>{user_id}</userid>
      <flag>hidden</flag>
    </db:user>
  </db:result>
</queryUserDBResponse>
```

*No results*

```xml
<queryUserDBResponse>
  <db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:actuate="onRequest" xlink:href="home://">
    <db:paging start="0" size="100" total="0" />
  </db:result>
</queryUserDBResponse>
```

*Results found*

```xml
<queryUserDBResponse xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <db:result xlink:actuate="onRequest" xlink:href="home://">
    <db:paging start="0" size="100" total="1" />
    <db:user name="{username}" id="{user_id}" cid="{group_id}" published="{datetime}" updated="{datetime}">
      <author>{author_name}</author>
      <userid>{user_id}</userid>
      <flag>hidden</flag>
    </db:user>
  </db:result>
</queryUserDBResponse>
```

#### `403` · text/plain

```text
User information listing access denied.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/userdb" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /userdb <a id="putv1userdb"></a>

**Update user entry**

Updates the Atom entry metadata for a user in a group.

### Request

`PUT https://api.cloudbackend.com/v1/userdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateUserEntry>`

```xml
<updateUserEntry>
  <group id="{group_id}" />
  <user id="{member_id}" />
  <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
    <atom:title>{username}</atom:title>
    <atom:author>
      <atom:name>{author_name}</atom:name>
    </atom:author>
    <dc:userid xmlns:dc="http://xcerion.com/directory.xsd">{user_id}</dc:userid>
    <dc:userid xmlns:dc="http://xcerion.com/directory.xsd">{user_id}</dc:userid>
    <dc:gender>male</dc:gender>
    <dc:utag1>somedata1</dc:utag1>
    <dc:utag2>somedata1</dc:utag2>
    <ni:utag3 xmlns:ni="http://xcerion.com/noindex.xsd">somedata1</ni:utag3>
    <ni:utag4>somedata1</ni:utag4>
  </atom:entry>
</updateUserEntry>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User entry updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateUserEntryResponse>`

```xml
<updateUserEntryResponse>
  <atom:entry>
    <atom:title>{username}</atom:title>
    <atom:published></atom:published>
    <atom:updated></atom:updated>
    <atom:link rel="alternate" type="application/octet-stream" href="" length="0" stream_1_length="0" />
    <atom:id></atom:id>
    <dc:group>{group_id}</dc:group>
    <dc:user>{member_id}</dc:user>
    <atom:author>
      <atom:name>{author_name}</atom:name>
    </atom:author>
    <dc:userid>{user_id}</dc:userid>
    <dc:gender>male</dc:gender>
    <dc:utag1>somedata1</dc:utag1>
    <dc:utag2>somedata1</dc:utag2>
    <ni:utag3>somedata1</ni:utag3>
    <ni:utag4>somedata1</ni:utag4>
  </atom:entry>
</updateUserEntryResponse>
```

#### `404` · text/plain

```text
Group not found
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/userdb" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateUserEntry>…</updateUserEntry>'
```

---

## POST /userdb <a id="postv1userdb"></a>

**Get user entry**

Returns the Atom entry for a user in a group.

### Request

`POST https://api.cloudbackend.com/v1/userdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<getUserEntry>`

```xml
<getUserEntry>
  <group id="{group_id}" />
  <user id="{user_id}" />
</getUserEntry>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User entry |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getUserEntryResponse>`

```xml
<getUserEntryResponse>
  <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
    <atom:title>{username}</atom:title>
    <atom:published></atom:published>
    <atom:updated></atom:updated>
    <atom:link rel="alternate" type="application/octet-stream" href="" length="0" />
    <atom:id></atom:id>
    <dc:group xmlns:dc="http://xcerion.com/directory.xsd">{group_id}</dc:group>
    <dc:user>{user_id}</dc:user>
    <dc:unique>{user_id}</dc:unique>
    <atom:author>
      <atom:name>{author_name}</atom:name>
    </atom:author>
    <dc:gender>male</dc:gender>
    <dc:country>{country}</dc:country>
    <ni:profile xmlns:ni="http://xcerion.com/noindex.xsd" />
    <dc:email>{email}</dc:email>
    <dc:client>{client}</dc:client>
    <dc:display>{display_name}</dc:display>
    <dc:social>{social}</dc:social>
  </atom:entry>
</getUserEntryResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/userdb" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<getUserEntry>
  <group id="{group_id}" />
  <user id="{user_id}" />
</getUserEntry>'
```

---

## GET /users/{user_id}/delete <a id="getv1usersdelete"></a>

**Request user deletion**

First step of deleting your own user: creates a confirmation code (valid for 48
hours) and triggers the tenant's `deleteUser` e-mail event, which sends the code to
the user. Confirm the deletion with `DELETE /users/{user_id}/delete?code=...`.

Only the user itself may call it. The tenant must have a `deleteUser` e-mail
template, unless `useDefault` is set and a default template exists.

The response body is plain text: `Ok` when the e-mail event was triggered, `Failed`
otherwise.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/delete`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `useDefault` | query | no | string · one of `1`, `0`, `true`, `false` | `1`/`true` allows the default `deleteUser` e-mail template to be used when the tenant has none of its own. Default `false`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `Ok` or `Failed` |
| `400` | Bad Request (not the logged-in user, or the tenant can't delete users) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Ok
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/delete" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/delete <a id="deletev1usersdelete"></a>

**Delete a user (async)**

Second step of deleting your own user: verifies the confirmation code from
`GET /users/{user_id}/delete` (valid for 48 hours, single use) and deletes the user
asynchronously. The response is returned before the deletion has finished.

Only the user itself may call it.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/delete`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `code` | query | yes | string | Confirmation code received by e-mail. |
| `forget` | query | no | string · one of `1`, `0`, `true`, `false` | `1`/`true` (default) also forgets the user (removes the user's identity data); `0`/`false` keeps it. |
| `deleteContent` | query | no | string · one of `1`, `0`, `true`, `false` | `1`/`true` also deletes the user's stored content; `0`/`false` (default) does not. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Deletion started (asynchronous) |
| `400` | Bad Request (not the logged-in user, or invalid/expired code) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/delete?code={code}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /deleteuser <a id="deletev1deleteuser"></a>

**Delete a user by username**

Deletes an identity of the current tenant by username, using the confirmation code
that was e-mailed to the identity by `GET /users/{user_id}/delete`. No login is
required: the code is the proof of ownership.

The code is valid for 48 hours and can be used once. The deletion runs
asynchronously; the call returns `204 No Content` as soon as it has been queued.

### Request

`DELETE https://api.cloudbackend.com/v1/deleteuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `username` | query | yes | string | Username of the identity to delete, within the tenant of the request. |
| `code` | query | yes | string | Confirmation code from the delete-user e-mail. |
| `forget` | query | no | string · one of `true`, `false`, `1`, `0` · default `true` | When true (the default), the identity is forgotten completely, so the username can be reused. |
| `deleteContent` | query | no | string · one of `true`, `false`, `1`, `0` · default `false` | When true, the identity's stored content is deleted as well. Default false. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Deletion queued (no content) |
| `400` | Bad Request — unknown username (`Invalid user id`), or a wrong, used or expired code (`Invalid code`). |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid code
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/deleteuser?username={username}&code={code}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /usersearch <a id="getv1usersearchquery"></a>

**Search for users**

Searches for users matching a query and returns an Atom feed with OpenSearch
paging.

Use `/usersearch/{username}` to look up a single user by exact name.

### Request

`GET https://api.cloudbackend.com/v1/usersearch`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `q` | query | no | string | Search query. Supports a trailing `*` wildcard, e.g. `cbe*`. |
| `g` | query | no | string · default `cloudme` | Tenant group id to search. Defaults to `cloudme`. |
| `offset` | query | no | integer · default `0` | Start index. Defaults to 0. |
| `count` | query | no | integer · default `100` | Maximum number of results. Defaults to 100. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Matching users as an Atom feed |
| `401` | Unauthorized |
| `403` | User search not enabled |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>{total}</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>{count}</os:itemsPerPage>
  <!-- zero or more atom:entry elements, one per user -->
</atom:feed>
```

#### `403` · text/plain

```text
UserSearch is not enabled
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/usersearch" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /usersearch/{username} <a id="getv1usersearch"></a>

**Search for a user by name**

Looks up a single user by exact username.

Use `/usersearch` with a `q` parameter to search for users matching a pattern.

### Request

`GET https://api.cloudbackend.com/v1/usersearch/{username}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `username` | path | yes | string | Exact username to look up. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The matching user |
| `401` | Unauthorized |
| `403` | User search not enabled |
| `404` | No user with that name |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
  <atom:title>{username}</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
  <atom:link rel="alternate" type="application/octet-stream" href="{href}" length="0" />
  <atom:id>{id}</atom:id>
  <dc:group>{group_id}</dc:group>
  <dc:user>{user_id}</dc:user>
  <dc:unique>{unique_id}</dc:unique>
  <atom:author>
    <atom:name>{display_name}</atom:name>
  </atom:author>
  <dc:gender />
  <dc:country />
  <ni:profile />
  <dc:client>{client}</dc:client>
  <dc:display>{display}</dc:display>
  <dc:social>{social}</dc:social>
</atom:entry>
```

#### `403` · text/plain

```text
UserSearch is not enabled
```

#### `404` · text/plain

```text
User not found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/usersearch/{username}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /activate <a id="getv1activate"></a>

**Create a tenant (send activation email)**

Starts tenant creation for the logged-in identity by sending it an activation email.

The server creates (or reuses) a verification code that grants the right to create a
tenant, opens a new session for the caller, and triggers the `getUserActivation`
system event of the caller's own tenant. That event sends the email; it receives the
`tenant` prefix and the new session id as parameters. The user should then check the
email for the activation link.

The body is plain text: `Ok` when the event was triggered, `Failed` when the caller's
tenant could not be found or the system event could not be triggered (still with
status 200).

`recaptchaResponse` is verified against reCAPTCHA (action `activate`), but a failed
verification is currently only logged and does not reject the request.

No request body.

### Request

`GET https://api.cloudbackend.com/v1/activate`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `recaptchaResponse` | query | no | string | reCAPTCHA token produced by the client for the action `activate`. A failed check is logged only. |
| `tenant` | query | no | string | Name of the tenant to create. It is passed to the email template as the `tenant` parameter with a trailing `.` appended (e.g. `mytenant.`), so it can be used as a host-name prefix. Empty by default. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `Ok` if the activation email was triggered, otherwise `Failed` |
| `401` | Unauthorized |
| `500` | Internal Server Error — e.g. `Failed to create user session` |

#### `200` · text/plain

```text
Ok
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/activate" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /activate <a id="postv1activate"></a>

**Activate user account**

Activates the logged-in identity's account with an invitation key.

The key is looked up in two places:

- an assign-user session (created when an external OpenID / AppDirect identity is to
  be linked): the session is consumed and the OpenID is linked to the caller;
- a group invitation: the caller is added to the inviting group and its customer
  role. For a new user, the invitation's payment-responsible identity, coupon and
  product (account type) are applied and the account is set to grouped invoicing.

An unknown key is silently ignored — the call still returns 204. Invitations sent by
a user rather than a group are not supported (501).

### Request

`POST https://api.cloudbackend.com/v1/activate`

Authenticates the caller — no session token yet. Send HTTP basic credentials.

#### Body

`application/xml` (required), root element `<activate>`

```xml
<activate>
  <invite key="92d71e8c4c74602dbbcf26bf5bd05eba" />
</activate>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Request processed (also returned when the key matched nothing) |
| `400` | Bad Request — the body is not well-formed XML |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |
| `501` | Not Implemented — `Only supports invites by group right now.` |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/activate" \
  -u "{username}:{password}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<activate>
  <invite key="92d71e8c4c74602dbbcf26bf5bd05eba" />
</activate>'
```

---

## GET /avatar/{user_id}/{size} <a id="getv1avatarsized"></a>

**Get user avatar**

Gets the avatar Supported sizes: 16, 24, 32, 48, 128

### Request

`GET https://api.cloudbackend.com/v1/avatar/{user_id}/{size}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `size` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/avatar/{user_id}/{size}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /changegroupowner <a id="putv1changegroupowner"></a>

**Change group owner**

Transfers ownership of a group to another identity. Only the current owner of the
group may call it; anyone else gets `403 Forbidden`.

The request body is a `<change>` element:

- `groupId` (required) — the group whose ownership is transferred.
- `newOwnerId` (required) — the identity that becomes the new owner. It must already
  be a member of the group, otherwise the transfer fails with `403 Forbidden`.
- `recursive` (optional, `true`/`false`, default `false`) — when `true`, ownership is
  also transferred in every subgroup (at any depth) that the caller owns; subgroups
  owned by someone else are left unchanged.

The new owner is added to the group's Owner and Administrator roles and the previous
owner is removed from the Owner role. The response lists the id of every group whose
ownership was transferred.

### Request

`PUT https://api.cloudbackend.com/v1/changegroupowner`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<change>`

```xml
<change groupId="{group_id}" newOwnerId="{user_id}" recursive="false" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Groups whose ownership was transferred |
| `400` | Bad Request — `groupId` or `newOwnerId` is missing. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not the group owner, or the new owner is not a member of the group. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<groups>`

```xml
<groups><group>{group_id}</group><group>{subgroup_id}</group></groups>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/changegroupowner" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<change groupId="{group_id}" newOwnerId="{user_id}" recursive="false" />'
```

---

## POST /event <a id="postv1event"></a>

**Send an event**

Sends a lifestream event (notification) from the caller to another identity. The
event is queued for the event notification service, which delivers it to the
receiver's lifestream (and, for `emailMessage`, by e-mail).

The request body is a `<sendEvent>` element (the root name is not checked) with:

- `<sender id>` — must be the caller (or an alias of the caller), otherwise `403`.
- `<receiver id>` — the identity that receives the event; must exist (otherwise
  `404`, "User not found.").
- `<type>` — required: `friendRequest`, `friendAccept`, `guestbookEntry`,
  `sharePackage`, `statusMessage`, `statusChanged`, `profileVisitor`,
  `profileUpdate`, `itemExpiry`, `webshareUpdate`, `campaignMessage`,
  `webshareInvite`, `emailMessage` or `associationInvite`.
- `<thread id>` — optional id of the event this one answers.
- `<visibility>` — optional: `public` (default), `friends`, `private` or `invited`.
- `<data>` — optional; its content is stored as the event data.

If neither sender nor receiver is given the answer is `400` ("Missing sender and
receiver"). The response is `<sendEventResponse>OK</sendEventResponse>`. The
`Content-Type` must be `application/xml` or `text/xml`.

### Request

`POST https://api.cloudbackend.com/v1/event`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<sendEvent>`

```xml
<sendEvent>
  <sender id="{user_id}" />
  <receiver id="{receiver_user_id}" />
  <type>statusMessage</type>
  <visibility>public</visibility>
  <data><message>Hello</message></data>
</sendEvent>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Event sent |
| `400` | Bad Request — "Missing sender and receiver" or "Missing type". |
| `401` | Unauthorized |
| `403` | Forbidden — "Access denied." (sender is not the caller). |
| `404` | Not Found — "User not found." (receiver). |
| `415` | Unsupported Media Type — "Content-Type must be text/xml or appliction/xml". |
| `500` | Internal Server Error — for example an unknown `type`. |

#### `200` · application/xml · `<sendEventResponse>`

```xml
<sendEventResponse>OK</sendEventResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/event" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<sendEvent>
  <sender id="{user_id}" />
  <receiver id="{receiver_user_id}" />
  <type>statusMessage</type>
  <visibility>public</visibility>
  <data><message>Hello</message></data>
</sendEvent>'
```

---

## POST /logout <a id="postv1logout"></a>

**Log out (invalidate session)**

Ends the session whose token is used to make this call. The call must be
authenticated with a session token
(`Authorization: WRAP access_token=<session>`); that token is deleted and can no
longer be used.

Returns the bare text `success`. If the call was authenticated in another way
(Basic or Digest), it returns `404 Requires token login`; if the session no
longer exists, `404 Session not found`.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/logout`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Session ended |
| `401` | Unauthorized |
| `404` | The call was not authenticated with a session token, or the session was not found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
success
```

#### `404` · text/plain

*Authenticated with username and password instead of a token*

```text
Requires token login
```

*The session no longer exists*

```text
Session not found
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/logout" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /push/{user_id} <a id="postv1push"></a>

**Register device for push notifications**

Registers (or updates) a mobile device to receive push notifications for an
identity. Only the identity itself may register its devices; any other
`{user_id}` returns `403`.

Body (`<registerPush>`):

- `<device id="…" platform="…">` — the device's push token and its platform,
  `IOS` or `ANDROID` (both attributes required; a missing one returns `422`).
  Any other platform returns `400`.
- `<hotUpdate>` inside `<device>` — optional, `true` to also receive silent
  "hot update" pushes while the device is in active use. Defaults to `false`.

Returns `204 No Content`.

### Request

`POST https://api.cloudbackend.com/v1/push/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the identity registering the device; must be the caller. |

#### Body

`application/xml` (required), root element `<registerPush>`

```xml
<registerPush>
  <device id="{device_token}" platform="ANDROID">
    <hotUpdate>true</hotUpdate>
  </device>
</registerPush>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Device registered |
| `400` | Unknown platform or the device could not be registered |
| `401` | Unauthorized |
| `403` | `{user_id}` is not the caller |
| `422` | Missing `id` or `platform` attribute on `<device>` |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Could not register device for push
```

#### `422` · text/plain

```text
Missing 'platform' attribute
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/push/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<registerPush>
  <device id="{device_token}" platform="ANDROID">
    <hotUpdate>true</hotUpdate>
  </device>
</registerPush>'
```

---

## GET /recover <a id="getv1recover"></a>

**Request password recovery email**

Sends a password recovery email containing a recovery code. No authorization is
needed.

Identify the account with either `user` or `email`. Follow up with
`POST /recover` to set the new password.

### Request

`GET https://api.cloudbackend.com/v1/recover`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user` | query | no | string | Username of the account to recover. Use this or `email`. |
| `email` | query | no | string | Email address of the account to recover. Use this or `user`. |
| `useDefault` | query | no | boolean | Send the default recovery email template. |
| `tenant` | query | no | string | Tenant the account belongs to. May also be supplied as the `Tenant` header. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Recovery email sent |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Ok
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/recover" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /recover <a id="postv1recover"></a>

**Change password with recovery code**

Sets a new password using the recovery code emailed by `GET /recover`. The code
is valid for 24 hours; once it expires, request a new one.

Identify the account with either `username` or `email` on the `<recover>`
element.

### Request

`POST https://api.cloudbackend.com/v1/recover`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant` | query | no | string | Tenant the account belongs to. |

#### Body

`application/xml` (required), root element `<recover>`

```xml
<recover code="{recovery_code}" username="{username}" password="{new_password}" />
```

*Identify the account by username*

```xml
<recover code="{recovery_code}" username="{username}" password="{new_password}" />
```

*Identify the account by email*

```xml
<recover code="{recovery_code}" email="{email}" password="{new_password}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Password changed. Empty body. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/recover" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<recover code="{recovery_code}" username="{username}" password="{new_password}" />'
```

---

## POST /sendVerificationCode <a id="postv1sendVerificationCode"></a>

**Send verification code email**

Asks the server to e-mail a verification code to the logged-in identity, for
example to confirm the identity's e-mail address. The code is then confirmed with
`POST /verifyUser`.

The server raises the `sendVerificationCode` system event for the identity's
tenant (event data `<user userId='{user_id}'/>`); the e-mail itself is sent by the
tenant's event handling, so its content and sender are configured per tenant.

No request body. Returns 204 with no body on success.

### Request

`POST https://api.cloudbackend.com/v1/sendVerificationCode`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Verification event raised |
| `401` | Unauthorized |
| `404` | Identity not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/sendVerificationCode" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/account <a id="getv1usersaccount"></a>

**Get account info**

Returns the account (subscription) of the user: balance, account type, account state
and, when set, cost, lifespan, expiry, lock time, free size, payment-processor
subscription id, the administrating (associating) user and the features of the
account type. Only the user itself may call it.

`<state>` is one of:

- `NORM` normal (no subscription)
- `PONE` one-time payment
- `PSUB` payment-processor (PayPal) subscription
- `PCIP` payment-processor cancellation in progress
- `PCAN` payment-processor subscription cancelled
- `PF_1` payment-processor payment failed once
- `PFAI` payment-processor payment failed
- `PACA` payment-processor auto-cancel
- `ISUB` invoice subscription
- `ICAN` invoice subscription cancelled
- `GSUB` grouped invoice
- `GCAN` grouped invoice cancelled

The optional elements `<cost>`, `<lifespan>`, `<expires>`, `<lockTime>`, `<freeSize>`,
`<subscriptionId>`, `<admin>` and `<features>` are only present when they have a value.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/account`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The account |
| `401` | Unauthorized |
| `403` | Forbidden (not the user's own account) |
| `404` | Not Found (no account, or no FREE account type in the tenant) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<account>`

*Free account (from the live tests)*

```xml
<account>
  <balance>0</balance>
  <type>FREE</type>
  <state>NORM</state>
  <freeSize>104857600</freeSize>
</account>
```

*All optional elements present*

```xml
<account>
  <balance>{balance}</balance>
  <type>{account_type}</type>
  <state>PSUB</state>
  <cost>{cost}</cost>
  <lifespan>{lifespan}</lifespan>
  <expires>2026-01-01T00:00:00Z</expires>
  <lockTime>2026-02-01T00:00:00Z</lockTime>
  <freeSize>{free_size}</freeSize>
  <subscriptionId>{paypal_subscription_id}</subscriptionId>
  <admin>{admin_user_id}</admin>
  <features>
    <feature name='{feature}'/>
  </features>
</account>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/account" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/account <a id="postv1usersaccount"></a>

**Change or cancel account**

Changes the account type, or cancels the current subscription. The XML body decides
the action:

**Change account type** — root element `<change>`:

- `type` (required): name of the new account type, e.g. `CAT2` or `FREE`.
- `vat` (required): `true`/`false`. It must be present, but the server recalculates it
  from the user's `/user/country` config value.
- `state` (optional, default `NORM`): the account state to move to, e.g. `PSUB` for a
  PayPal subscription or `PONE` for a one-time payment (values as listed under GET).
- `duration` (optional): number of months to pay for. Default is 1 for subscriptions
  and 12 otherwise.

If payment is needed, the response is `200` with `<auth url='...'/>`; the user must
visit that PayPal URL and pay to activate the new type. If the change could be done
directly (for example a change covered by the existing balance, or a change to `FREE`
on an expired account), the response is `204 No Content`.

**Cancel subscription** — root element `<cancel>` with an optional `<reason>` text.
Cancels the PayPal subscription or invoice. Only the user itself may cancel. Returns
`204 No Content` on success.

Only the user itself may call this endpoint.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/account`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

#### Body

`application/xml` (required)

*Change account type (from the live tests)*

```xml
<change type="CAT2" vat="true" state="PSUB"/>
```

*Cancel the subscription*

```xml
<cancel>
  <reason>The reason here</reason>
</cancel>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Payment is required; visit the URL to pay and activate the new account type |
| `204` | Account type changed, or subscription cancelled |
| `400` | Bad Request (missing/invalid `type` or `vat`, invalid account type, too much data for the new type, cancellation in progress, failed to cancel, unknown root element) |
| `401` | Unauthorized (also returned for AppDirect users) |
| `403` | Forbidden (not the user's own account) |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<auth>`

```xml
<auth url='https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&amp;...'/>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/account" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<change type="CAT2" vat="true" state="PSUB"/>'
```

---

## GET /users/{user_id}/accounts <a id="getv1usersaccounts"></a>

**List account associations**

Lists the prepaid plans the user has bought for other accounts, and the accounts
associated with (or invited by) the user. Pending invitations are returned as
`<association>` elements with `<pending>true</pending>` and `userId='0'`. If the user
is itself an associated account, its sibling associations are returned instead.

Only the user itself may call it.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/accounts`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Prepaid plans and associations |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<associations>`

```xml
<associations>
  <prepaidPlans>
    <prepaidPlan>
      <id>{plan_id}</id>
      <amount>5</amount>
      <type>{account_type_name}</type>
      <type_id>{account_type_id}</type_id>
      <inUse>1</inUse>
      <created>2026-01-01T10:00:00Z</created>
      <updated>2026-01-02T10:00:00Z</updated>
      <expires>2027-01-01T10:00:00Z</expires>
      <active>true</active>
    </prepaidPlan>
  </prepaidPlans>
  <association userId='{associated_user_id}'>
    <id>{association_id}</id>
    <username>{username}</username>
    <firstname>{firstname}</firstname>
    <lastname>{lastname}</lastname>
    <email>{email}</email>
    <type_id>{account_type_id}</type_id>
    <pending>false</pending>
    <accessControl>true</accessControl>
    <created>2026-01-02T10:00:00Z</created>
  </association>
</associations>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/accounts" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/accounts <a id="postv1usersaccounts"></a>

**Create account association**

Accepts an association invitation: associates the user's account with the inviting
account using the invitation key that was e-mailed to the user. The user's account
must be a `FREE` account that is not already associated. The account is changed to
the invited account type (expiring with the inviter's prepaid plan), the user's
e-mail is marked as verified, and the invitation is consumed.

Body: `<association><invite key="..." sendEmail="..."/></association>`.
`sendEmail` is optional; the only supported value is `signup`, which also sends the
tenant's sign-up e-mail to the user.

Only the user itself may call it.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/accounts`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user accepting the invitation. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<association>`

```xml
<association>
  <invite key="{invite_key}" sendEmail="signup"/>
</association>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Association created |
| `400` | Bad Request (account already associated, or account is a premium account) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (no account, unknown invitation key, or invalid invite type) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/accounts" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<association>
  <invite key="{invite_key}" sendEmail="signup"/>
</association>'
```

---

## DELETE /users/{user_id}/accounts/{association_id} <a id="deletev1usersaccounts"></a>

**Delete account association**

Removes the association between the user's account and an associated account. The
associated account is downgraded to the tenant's `FREE` account type, the prepaid
plan is returned to the user, and shares between the two are cleaned up.

With `?account=delete`, the associated user account is deleted as well — but only if
the association was created with access control (`accessControl` true).

Only the user itself (the administrating account) may call it.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/accounts/{association_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the administrating user. Must be the logged-in user. |
| `association_id` | path | yes | integer | Id of the association (the `<id>` of an `<association>` in `GET /users/{user_id}/accounts`). |
| `account` | query | no | string · one of `delete` | Pass `delete` to also delete the associated user account (only when the association has access control). Any other value is ignored. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Association removed |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (no such association) |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/accounts/{association_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/activate <a id="getv1usersactivate"></a>

**Request activation e-mail**

Starts activation of the logged-in user: creates (or reuses) an activation code and a
user session, and triggers the tenant's `getUserActivation` e-mail event for the user.
The `user_id` in the path is not used; the call always acts on the logged-in user.
Same as `GET /activate`.

The response body is plain text: `Ok` when the e-mail event was triggered, `Failed`
when it could not be (for example no sign-up source or no e-mail template).

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/activate`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |
| `recaptchaResponse` | query | no | string | reCAPTCHA token for the `activate` action. It is verified, but a failure is currently only logged. |
| `tenant` | query | no | string | Tenant name prefix passed to the e-mail template (as `tenant`, with a trailing `.` added). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `Ok` or `Failed` |
| `401` | Unauthorized |
| `500` | Internal Server Error (failed to create user session) |

#### `200` · text/plain

```text
Ok
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/activate" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/activate <a id="postv1usersactivate"></a>

**Activate user**

Activates the logged-in user's account with an invitation key: either an
assign-user (OpenID) session key or a group invitation key. For a group invitation
the user is added to the inviting customer group and gets the invited account type.
The `user_id` in the path is not used; the call always acts on the logged-in user.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/activate`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

#### Body

`application/xml` (required), root element `<activate>`

```xml
<activate>
  <invite key="{invite_key}"/>
</activate>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Processed (an unknown key is silently ignored) |
| `400` | Bad Request (body is not valid XML) |
| `401` | Unauthorized |
| `500` | Internal Server Error |
| `501` | Not Implemented (the invitation is not a group invitation) |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/activate" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<activate>
  <invite key="{invite_key}"/>
</activate>'
```

---

## GET /users/{user_id}/activateUser <a id="getv1usersactivateUser"></a>

**Request activation e-mail**

Alias of `GET /users/{user_id}/activate`: creates an activation code and a user
session for the logged-in user and triggers the `getUserActivation` e-mail event.
The `user_id` in the path is not used. Returns `Ok` or `Failed` as plain text.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/activateUser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |
| `recaptchaResponse` | query | no | string | reCAPTCHA token for the `activate` action. It is verified, but a failure is currently only logged. |
| `tenant` | query | no | string | Tenant name prefix passed to the e-mail template (as `tenant`, with a trailing `.` added). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `Ok` or `Failed` |
| `401` | Unauthorized |
| `500` | Internal Server Error (failed to create user session) |

#### `200` · text/plain

```text
Ok
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/activateUser" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/activateUser <a id="postv1usersactivateUser"></a>

**Activate user**

Alias of `POST /users/{user_id}/activate`: activates the logged-in user's account
with an invitation key (assign-user session key or group invitation key). The
`user_id` in the path is not used.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/activateUser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

#### Body

`application/xml` (required), root element `<activate>`

```xml
<activate>
  <invite key="{invite_key}"/>
</activate>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Processed (an unknown key is silently ignored) |
| `400` | Bad Request (body is not valid XML) |
| `401` | Unauthorized |
| `500` | Internal Server Error |
| `501` | Not Implemented (the invitation is not a group invitation) |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/activateUser" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<activate>
  <invite key="{invite_key}"/>
</activate>'
```

---

## GET /users/{user_id}/config <a id="getv1usersconfig"></a>

**Get full user config**

Gets the entire configuration tree for a user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/config`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User configuration |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<config>`

```xml
<config>
  <date format="YYYY-MM-DD"/>
  <time adjust="true" format="24h" zone="+0100"/>
  <user locale="en_US"/>
</config>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/config" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/config <a id="putv1usersconfig"></a>

**Replace full user config**

Replaces the entire user configuration tree.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/config`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<config>`

```xml
<config>
  <user locale="en_US" />
  <date format="YYYY-MM-DD" />
  <time adjust="true" format="24h" zone="+0100" />
</config>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Configuration replaced |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/config" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<config>
  <user locale="en_US" />
  <date format="YYYY-MM-DD" />
  <time adjust="true" format="24h" zone="+0100" />
</config>'
```

---

## DELETE /users/{user_id}/config <a id="deletev1usersconfig"></a>

**Delete user config**

Deletes the entire user configuration.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/config`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Configuration deleted |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/config" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PATCH /users/{user_id}/config <a id="patchv1usersconfigroot"></a>

**Merge into user config**

Merges the XML body into the user's whole configuration tree: keys present in the
body are added or overwritten, other existing keys are kept (unlike `PUT`, which
replaces the whole tree). An attribute with an empty value removes that key, and an
empty element (no attributes, no children) removes that subtree.

The name of the body's root element is ignored — the root stands for the top of the
config tree; its attributes become keys there and its child elements become
sub-paths. Text content is ignored. `POST` does the same, for clients that cannot
send `PATCH`. To merge below a sub-path, use
`PATCH /users/{user_id}/config/{config_path}`.

Only the user itself may call it.

### Request

`PATCH https://api.cloudbackend.com/v1/users/{user_id}/config`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<config>`

```xml
<config>
  <time format="12h" />
  <date format="" />
</config>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Values merged |
| `400` | Bad Request (invalid XML or invalid key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PATCH "https://api.cloudbackend.com/v1/users/{user_id}/config" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<config>
  <time format="12h" />
  <date format="" />
</config>'
```

---

## POST /users/{user_id}/config <a id="postv1usersconfigroot"></a>

**Merge into user config (POST form)**

Same as `PATCH /users/{user_id}/config`, for clients (such as browsers) that do not
send the `Authorization` header with `PATCH`: merges the XML body into the user's
configuration tree, adding or overwriting keys and keeping the others. An attribute
with an empty value removes that key; an empty element removes that subtree. The
body's root element name is ignored.

Only the user itself may call it.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/config`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<config>`

```xml
<config>
  <time format="12h" />
  <date format="" />
</config>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Values merged |
| `400` | Bad Request (invalid XML or invalid key name) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/config" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<config>
  <time format="12h" />
  <date format="" />
</config>'
```

---

## GET /users/{user_id}/encryption <a id="getv1usersencryption"></a>

**Get encryption key**

Returns the logged-in user's stored client-side encryption key, IV and HA1. The
`user_id` in the path is not used; the call always acts on the logged-in user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/encryption`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The encryption key |
| `401` | Unauthorized |
| `404` | Not Found (no key stored) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<encryption>`

```xml
<encryption>
  <key>{key}</key>
  <iv>{iv}</iv>
  <ha1>{ha1}</ha1>
</encryption>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/encryption" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/encryption <a id="postv1usersencryption"></a>

**Create encryption key**

Stores a client-side encryption key for the logged-in user. `<key>` and `<iv>` are
required, `<ha1>` is optional. Fails with `409` if a key already exists; use `PUT` to
replace it. The `user_id` in the path is not used.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/encryption`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

#### Body

`application/xml` (required), root element `<encryption>`

```xml
<encryption><key>testkey2</key><iv>testiv2</iv><ha1>testha1</ha1></encryption>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key created |
| `400` | Bad Request (missing key or iv) |
| `401` | Unauthorized |
| `409` | Conflict (a key already exists) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/encryption" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<encryption><key>testkey2</key><iv>testiv2</iv><ha1>testha1</ha1></encryption>'
```

---

## PUT /users/{user_id}/encryption <a id="putv1usersencryption"></a>

**Update encryption key**

Replaces the logged-in user's stored encryption key. `<key>` and `<iv>` are required,
`<ha1>` is optional. An "encryption changed" notification is sent to the user's
devices. The `user_id` in the path is not used.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/encryption`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

#### Body

`application/xml` (required), root element `<encryption>`

```xml
<encryption><key>testkey2</key><iv>testiv2</iv><ha1>testha1</ha1></encryption>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key updated |
| `400` | Bad Request (missing key or iv) |
| `401` | Unauthorized |
| `404` | Not Found (no key stored yet; use POST) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/encryption" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<encryption><key>testkey2</key><iv>testiv2</iv><ha1>testha1</ha1></encryption>'
```

---

## GET /users/{user_id}/eula/{version} <a id="getv1userseulaversion"></a>

**Get accepted EULA version**

Returns the EULA version the logged-in user has accepted and when. The `<eula>`
element is empty if no version has been accepted. Both `user_id` and `version` in the
path are ignored; this is the same as `GET /users/{user_id}/eula`.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/eula/{version}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |
| `version` | path | yes | integer | Ignored for GET. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Accepted EULA version |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<eula>`

```xml
<eula>
  <version>1200</version>
  <acceptedAt>2026-01-21T08:10:22Z</acceptedAt>
</eula>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/eula/{version}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/eula/{version} <a id="putv1userseulaversion"></a>

**Accept EULA version**

Records that the logged-in user accepts EULA version `version` (an integer, e.g.
`1200`). No request body is read — except when `version` is `0`, in which case the
version is read from a `<version>` body as in `PUT /users/{user_id}/eula`. The
`user_id` in the path is not used; the call always acts on the logged-in user.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/eula/{version}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |
| `version` | path | yes | integer | The EULA version being accepted, e.g. `1200`. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | EULA version recorded |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/eula/{version}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/libraries <a id="getv1userslibraries"></a>

**List media libraries**

Lists the media libraries of `{user_id}`. A media library groups containers of one
media type (music, movies, photos, …) so their content can be indexed and browsed
by category.

The response is a sequence of `<userLibrary>` elements **without a common root
element**. `<type>` is one of `Music`, `Movies`, `Videos`, `Photos`, `Youtube`,
`Series`, `Documents`, `Albums`. When the identity has no libraries (or does not
exist) `404` is returned.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose libraries are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The identity's libraries |
| `401` | Unauthorized |
| `404` | Not Found — `Can't find user or user has no libraries.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<userLibrary>`

```xml
<userLibrary><libraryId>6</libraryId><userId>12884901890</userId><name>Movies</name><type>Movies</type><created>2014-05-06T10:16:25Z</created><updated>2014-05-06T10:16:25Z</updated></userLibrary>
<userLibrary><libraryId>5</libraryId><userId>12884901890</userId><name>Music</name><type>Music</type><created>2014-05-06T10:16:25Z</created><updated>2014-05-06T10:16:25Z</updated></userLibrary>
<userLibrary><libraryId>4</libraryId><userId>12884901890</userId><name>Photos</name><type>Photos</type><created>2014-05-06T10:16:25Z</created><updated>2014-05-06T10:16:25Z</updated></userLibrary>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/libraries <a id="postv1userslibraries"></a>

**Create a media library**

Creates a media library for `{user_id}` and returns it as `<userLibrary>`.

The body is a `<library>` element with both attributes required:

- `name` — the library name (must not be empty).
- `type` — the media type, case-insensitive: `music`, `movies`, `videos`,
  `photos`, `youtube`, `series`, `documents` or `albums`.

A library with the same name and type for the same identity gives `409`. The code
only checks that `{user_id}` exists, not that it is the caller.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/libraries`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity the library is created for. |

#### Body

`application/xml` (required), root element `<library>`

```xml
<library name="yt" type="youtube"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The created library |
| `400` | Bad Request — malformed XML, `A library must have a name.` or `Incorrect type` |
| `401` | Unauthorized |
| `404` | Not Found — `User does not exist` or `Missing 'library' node.` |
| `409` | Conflict — `Duplicated entry.` |
| `422` | Unprocessable Entity — `Missing 'name' attribute.` or `Missing 'type' attribute.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<userLibrary>`

```xml
<userLibrary>
  <libraryId>8</libraryId>
  <userId>12884901889</userId>
  <name>yt</name>
  <type>Youtube</type>
  <created>2024-03-04T08:22:10Z</created>
  <updated>2024-03-04T08:22:10Z</updated>
</userLibrary>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/libraries" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<library name="yt" type="youtube"/>'
```

---

## GET /users/{user_id}/libraries/categories <a id="getv1userslibrariescategories"></a>

**List library categories**

Lists the browse categories found in the containers of all of `{user_id}`'s media
libraries, with the number of distinct values in each. The caller must be
`{user_id}`; otherwise `403` is returned.

Each `<category>` gives `libraryId`, `folderCategoryId` (the attribute keeps its
established name, as this URL contains no `container` word), `category` (one of
`album`, `artist`, `year`, `genre`, `director`, `actor`, `country`) and `count`.
Categories are listed per container and are not merged per library. Use
`GET /users/{user_id}/libraries/{library_id}/categories/{category_id}/values` to
list the values of one category.

`offset` and `count` are accepted but not applied to this list.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/categories`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `offset` | query | no | integer · default `0` | Accepted for symmetry with the values listing; not applied here. |
| `count` | query | no | integer · default `100` | Accepted for symmetry with the values listing; not applied here. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Categories |
| `401` | Unauthorized |
| `403` | Forbidden — `Library access denied` (caller is not `{user_id}`) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<categories>`

```xml
<categories xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
  <os:totalResults>2</os:totalResults>
  <category libraryId="5" folderCategoryId="17" category="artist" count="42"/>
  <category libraryId="5" folderCategoryId="18" category="album" count="57"/>
</categories>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/categories" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/libraries/{library_id} <a id="getv1userslibrary"></a>

**List media libraries**

Same handler as `GET /users/{user_id}/libraries`: `{library_id}` is ignored and
all libraries of `{user_id}` are returned as a sequence of `<userLibrary>`
elements without a common root element. There is no single-library GET.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose libraries are listed. |
| `library_id` | path | yes | integer | Ignored by this method. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The identity's libraries |
| `401` | Unauthorized |
| `404` | Not Found — `Can't find user or user has no libraries.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<userLibrary>`

```xml
<userLibrary><libraryId>6</libraryId><userId>12884901890</userId><name>Movies</name><type>Movies</type><created>2014-05-06T10:16:25Z</created><updated>2014-05-06T10:16:25Z</updated></userLibrary>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/libraries/{library_id} <a id="putv1userslibraries"></a>

**Modify a media library**

Renames a media library or changes its type. Only one attribute is applied per
request: when `name` is present the library is renamed (and `type` is ignored);
otherwise `type` is changed. Valid types (case-insensitive): `music`, `movies`,
`videos`, `photos`, `youtube`, `series`, `documents`, `albums`.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity that owns the library. |
| `library_id` | path | yes | integer | Id of the library (`<libraryId>`). |

#### Body

`application/xml` (required), root element `<library>`

*Rename the library*

```xml
<library name="Holiday photos"/>
```

*Change the library type*

```xml
<library type="photos"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Library updated |
| `400` | Bad Request — malformed XML, `Name must contain characters.` or `Incorrect type` |
| `401` | Unauthorized |
| `404` | Not Found — `Missing 'library' node.` or `Can't find library.` |
| `422` | Unprocessable Entity — `Missing attributes.` (neither `name` nor `type`) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<library name="Holiday photos"/>'
```

---

## GET /users/{user_id}/libraries/{library_id}/categories/{category_id}/values <a id="getv1userslibrariescategoriesvalues"></a>

**List category values**

Lists the distinct values of one category (for example all artists) across the
containers of a media library, with the number of occurrences of each value. The
library must belong to the caller; otherwise `403` is returned.

Each `<categoryValue>` gives `libraryValueId` (use it as `{value_id}` to drill
down), `category`, `value`, `count` and `subCategoriesExist`. When
`subCategoriesExist` is `true`, list the sub-values with
`GET …/categories/{category_id}/values/{value_id}/values`.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/categories/{category_id}/values`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `library_id` | path | yes | integer | Id of the library (`<libraryId>`). |
| `category_id` | path | yes | string · one of `album`, `artist`, `year`, `genre`, `director`, `actor`, `country` | The category, given by name. `album`, `artist`, `year` and `genre` apply to music; `year`, `genre`, `director`, `actor` and `country` to movies. |
| `offset` | query | no | integer · default `0` | Index of the first value to return. |
| `count` | query | no | integer · default `100` | Maximum number of values to return. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Category values |
| `400` | Bad Request — `Missing input parameters to process request` (category `unknown`) |
| `401` | Unauthorized |
| `403` | Forbidden — `Library access denied` |
| `404` | Not Found — `Could not find library` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<categoryValues>`

```xml
<categoryValues xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <categoryValue libraryValueId="311" category="artist" value="Miles Davis" count="12" subCategoriesExist="true"/>
</categoryValues>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/categories/{category_id}/values" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/libraries/{library_id}/categories/{category_id}/values/{value_id}/values <a id="getv1userslibrariescategoriesvaluesvalues"></a>

**List nested category values**

Lists the sub-values below one category value, for example the albums of one
artist. `{value_id}` is the `libraryValueId` of a `<categoryValue>` whose
`subCategoriesExist` is `true`. The response has the same `<categoryValues>`
format as the parent listing.

Only `{value_id}` selects the data; `{library_id}` must be non-zero and
`{category_id}` a known category, but neither is used to filter. The code does
not yet perform an access check on this call.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/categories/{category_id}/values/{value_id}/values`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `library_id` | path | yes | integer | Id of the library (`<libraryId>`); must be non-zero. |
| `category_id` | path | yes | string · one of `album`, `artist`, `year`, `genre`, `director`, `actor`, `country` | The parent category, given by name. |
| `value_id` | path | yes | integer | The `libraryValueId` of the parent category value. |
| `offset` | query | no | integer · default `0` | Index of the first value to return. |
| `count` | query | no | integer · default `100` | Maximum number of values to return. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Sub-category values |
| `400` | Bad Request — `Missing input parameters to process request` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<categoryValues>`

```xml
<categoryValues xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <categoryValue libraryValueId="412" category="album" value="Kind of Blue" count="5" subCategoriesExist="false"/>
</categoryValues>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/categories/{category_id}/values/{value_id}/values" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/libraries/{library_id}/states <a id="getv1userslibrariesstates"></a>

**List library index states**

Lists the media-indexing state of every library container of `{user_id}`.
`{library_id}` is ignored: states for all of the identity's libraries are
returned.

Each `<libraryIndexState>` gives the `folder` (container id), the `updated` time, the
`progress` and the `status`, which is one of:

- `not_started` — indexing has not begun.
- `running` — indexing is in progress.
- `success` — indexing finished.
- `failed` — indexing failed.

No query parameters.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/states`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose index states are listed. |
| `library_id` | path | yes | integer | Ignored by this method. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Index states |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<libraryIndexStates>`

```xml
<libraryIndexStates>
  <libraryIndexState folder="8589935569" updated="2024-03-04T08:22:10Z" progress="100" status="success"/>
</libraryIndexStates>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/states" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/mfa <a id="getusersmfa"></a>

**Get MFA status**

Returns the user's multi-factor authentication type in the `type` attribute:
`none` (MFA off) or `email` (a code is e-mailed at login). Only the user itself may
call it.

When MFA is on, requests authenticated with username/password are rejected with
`401 mfa must be used`; authenticate with a user session instead (see
`GET /users/{user_id}/session`, then pass `?session=...`).

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/mfa`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | MFA status |
| `401` | Unauthorized (also `mfa must be used` when MFA is on and no session is used) |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<mfa>`

```xml
<mfa userId="{user_id}" type="none" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/mfa" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/mfa <a id="postusersmfa"></a>

**Change MFA type**

Changes the user's MFA type. No request body. The new type and the verification code
are query parameters. Only the user itself may call it.

Turning on `email` is a two-step flow:

1. `POST ...?mfa=email` — a code is e-mailed to the user; the result has `code="1"`
   and `<sentTo email='...'/>`.
2. `POST ...?mfa=email&code=<code>` — the result has `code="0"` and MFA is changed.

The response is always `200` with `<mfaResult code message>`:
`0` = MFA changed, `1` = need MFA code (code sent), `2` = invalid MFA code.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/mfa`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `mfa` | query | yes | string · one of `none`, `email` | New MFA type. `none` turns MFA off; `email` sends a code by e-mail at login. |
| `code` | query | no | string | The MFA code received by e-mail, when confirming the change. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Result of the change |
| `400` | Bad Request (missing `mfa` query parameter) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<mfaResult>`

*MFA changed*

```xml
<mfaResult code="0" message="MFA changed" />
```

*Code sent by e-mail*

```xml
<mfaResult code="1" message="Need MFA code">
  <sentTo email="{email}" />
</mfaResult>
```

*Invalid code*

```xml
<mfaResult code="2" message="Invalid MFA code" />
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/mfa?mfa={mfa}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/xtenantmappings <a id="getv1usersxtenantmappings"></a>

**List cross-tenant identity mappings**

Lists the caller's cross-tenant identity mappings. A mapping says which identity
(`externalUserId`) the caller acts as in another tenant (`externalTenantId`) when
a request carries the `xtenant: <tenant name>` header. Without a mapping, the
identity with the same username (and password) in the other tenant is used.

`{user_id}` must be the logged-in identity (`403` otherwise). No request body.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Mappings (zero or more) |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

#### `200` · application/xml · `<xtenantUserMappings>`

```xml
<xtenantUserMappings>
  <xtenantUserMapping id='1' usingUserId='{user_id}' externalTenantId='{tenant_id}' externalUserId='{external_user_id}'/>
</xtenantUserMappings>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/xtenantmappings <a id="postv1usersxtenantmappings"></a>

**Add a cross-tenant identity mapping**

Maps the caller to an identity in another tenant. The body is an
`<xtenantUserMapping>` with the attributes `externalTenantId` and
`externalUserId`; the external identity must exist and not be deleted.

`{user_id}` must be the logged-in identity (`403` otherwise). The response has no
body.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |

#### Body

`application/xml` (required), root element `<xtenantUserMapping>`

```xml
<xtenantUserMapping externalTenantId="{tenant_id}" externalUserId="{external_user_id}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Mapping added |
| `400` | Bad Request — `Missing @externalTenantId`, `Missing @externalUserId` or `Invalid @externalUserId` |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid @externalUserId
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<xtenantUserMapping externalTenantId="{tenant_id}" externalUserId="{external_user_id}" />'
```

---

## DELETE /users/{user_id}/xtenantmappings <a id="deletev1usersxtenantmappings"></a>

**Remove cross-tenant identity mappings**

Removes mappings of the caller. Use `all=1` to remove every mapping, `id` to remove
one, or `externalTenantId` together with `externalUserId` to remove the mapping to
that identity. Without any of them nothing is removed (still `200`).

`{user_id}` must be the logged-in identity (`403` otherwise). No request body. The
response has no body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `all` | query | no | boolean | `1`/`true` removes all mappings of the caller. |
| `id` | query | no | integer | Remove the mapping with this `id`. |
| `externalTenantId` | query | no | integer | Tenant of the mapped identity. Requires `externalUserId`. |
| `externalUserId` | query | no | integer | Mapped identity. Requires `externalTenantId`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Mappings removed |
| `400` | Bad Request — `Missing externalUserId query param` or `Missing externalTenantId query param` |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/xtenantmappings" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/referralcode <a id="getv1usersreferralcode"></a>

**Get user referral code**

No authorization is needed. Gets or creates the user referral code. Returns

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/referralcode`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<referral>`

```xml
<referral code='c46e856ed1293ca38ab30822693aa56c' userId='12884901958'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/referralcode" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/session <a id="getv1userssession"></a>

**Create user session**

Creates a user session for the logged-in user and returns its id. Use the session id
instead of username/password on later requests, either as the query parameter
`?session=<id>` (or `?access_token=<id>`) or in the header
`Authorization: WRAP access_token="<id>"`. A session expires 7 days after it was last
used; call this API again to get a new one.

If the user has MFA turned on, the first call fails with `401 Missing mfa code` and a
code is e-mailed; call again with `?code=<code>`.

`user_id` must be the logged-in user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/session`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |
| `code` | query | no | string | MFA code received by e-mail. Needed only when the user has MFA turned on. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The new session |
| `401` | Unauthorized (bad user id, `Missing mfa code`, or `Invalid mfa code`) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<user-session>`

```xml
<user-session sessionId='af37cc80bef6b43f5ef92a8dda1da62c' userId='12884901958'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/session" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/session <a id="deletev1userssession"></a>

**Clear all user sessions**

Deletes all user sessions of the logged-in user (logs out everywhere). The response
body is the number of sessions removed, as plain text. The `user_id` in the path is
not used. Same as `DELETE /sessions`.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/session`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored; the logged-in user is used. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Number of sessions removed |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
3
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/session" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/session <a id="postv1userssession"></a>

**Clear current session**

Deletes the session used to make this request (log out). The request must be
authenticated with `Authorization: WRAP access_token="<session id>"`.
No request body. Returns `success` as plain text. Same as `POST /logout`.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/session`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Ignored. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Session cleared |
| `401` | Unauthorized |
| `404` | Not Found (`Requires token login` when no WRAP token is sent, or `Session not found`) |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
success
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/session" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /validatevat <a id="getv1validatevat"></a>

**Validate VAT number**

Validates a VAT number. No authentication is required.

For EU countries the number is checked against the European Commission's VIES
`checkVatService` and the fields of its reply are returned. For countries that are
not marked as EU in the server's country table, no check is made: the response
contains the given country code, `valid` is `true` and the other fields are empty.

The result is returned as XML (`text/xml`, root `<validateVatResponse>`) by
default, or as JSON (root `checkVatResponse`) with `?format=json`. All values,
including `valid`, are strings.

### Request

`GET https://api.cloudbackend.com/v1/validatevat`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `vatnumber` | query | yes | string | VAT number to check, without the country prefix. |
| `countrycode` | query | yes | string | Two-letter country code of the VAT number (for example `SE`). |
| `format` | query | no | string · one of `xml`, `json` · default `xml` | Response format, case-insensitive. `xml` (default) or `json`; anything else returns 400. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Validation result |
| `400` | `vatnumber` or `countrycode` missing, unsupported `format`, or the EU VIES service could not be reached or its reply could not be parsed |
| `500` | Internal Server Error |

#### `200` · application/json

```json
{"checkVatResponse": {"countryCode": "SE","vatNumber": "556677889901","requestDate": "2026-10-16+02:00","valid": "true","name": "EXAMPLE AB","address": "STORGATAN 1 111 22 STOCKHOLM"}}
```

#### `200` · text/xml · `<validateVatResponse>`

```xml
<?xml version="1.0" encoding="UTF-8"?><validateVatResponse><countryCode>SE</countryCode><vatNumber>556677889901</vatNumber><requestDate>2026-10-16+02:00</requestDate><valid>true</valid><name>EXAMPLE AB</name><address>STORGATAN 1 111 22 STOCKHOLM</address></validateVatResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/validatevat?vatnumber={vatnumber}&countrycode={countrycode}"
```

---

## POST /verifyUser <a id="postv1verifyUser"></a>

**Verify user identity**

Confirms an identity with a verification (activation) code, such as the one sent
by `POST /sendVerificationCode`.
No authentication is required; the code itself identifies the identity.

The request body is a `<verification>` element whose `code` attribute holds the
code. A valid code is consumed, the identity is marked verified and a
user-verified notification is sent. Returns 204 with no body on success.

### Request

`POST https://api.cloudbackend.com/v1/verifyUser`

Needs no session token: the description above says how this operation is authorized.

#### Body

`application/xml` (required), root element `<verification>`

```xml
<verification code="A1B2C3D4E5" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Identity verified |
| `400` | Body is not well-formed XML |
| `404` | Code is not valid (unknown, already used, or missing) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/verifyUser" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<verification code="A1B2C3D4E5" />'
```

---

## GET /notification <a id="getv1notification"></a>

**Get notification config**

Gets the notification configuration for the current user, including per-event settings for propagation, email, and lifestream.

### Request

`GET https://api.cloudbackend.com/v1/notification`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<fetchNotificationConfig>`

```xml
<fetchNotificationConfig/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Notification configuration |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<fetchNotificationConfigResponse>`

```xml
<fetchNotificationConfigResponse>
  <notificationConfig>
    <event type="friendRequest" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="friendAccept" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="guestbookEntry" propagateIn="true" propagateOut="true" emailIn="true" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="true" lifeStreamPropagated="true" visibility="public"/>
    <event type="sharePackage" propagateIn="false" propagateOut="false" emailIn="true" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="true" lifeStreamPropagated="true" visibility="public"/>
    <event type="statusMessage" propagateIn="false" propagateOut="true" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="true" lifeStreamPropagated="true" visibility="public"/>
    <event type="statusChanged" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="profileVisitor" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="profileUpdate" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="itemExpiry" propagateIn="false" propagateOut="false" emailIn="true" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="webshareUpdate" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="campaignMessage" propagateIn="false" propagateOut="false" emailIn="true" emailOut="false" emailPropagated="false" lifeStreamIn="false" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="webshareInvite" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="emailMessage" propagateIn="false" propagateOut="false" emailIn="true" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
    <event type="associationInvite" propagateIn="false" propagateOut="false" emailIn="false" emailOut="false" emailPropagated="false" lifeStreamIn="true" lifeStreamOut="false" lifeStreamPropagated="true" visibility="public"/>
  </notificationConfig>
</fetchNotificationConfigResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/notification" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<fetchNotificationConfig/>'
```

---

## PUT /notification <a id="putv1notification"></a>

**Update notification config**

Updates the notification configuration for the current user.

### Request

`PUT https://api.cloudbackend.com/v1/notification`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<modifyNotificationConfig>`

```xml
<modifyNotificationConfig>
  <event type="friendRequest" propagateIn="true" propagateOut="true" emailIn="true" emailOut="true" lifeStreamIn="true" lifeStreamOut="true" visibility="public"/>
</modifyNotificationConfig>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Configuration updated |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<modifyNotificationConfigResponse>`

```xml
<modifyNotificationConfigResponse>OK</modifyNotificationConfigResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/notification" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<modifyNotificationConfig>
  <event type="friendRequest" propagateIn="true" propagateOut="true" emailIn="true" emailOut="true" lifeStreamIn="true" lifeStreamOut="true" visibility="public"/>
</modifyNotificationConfig>'
```

---

## POST /user <a id="postv1user"></a>

**Create a user**

Creates a new user account.

### Request

`POST https://api.cloudbackend.com/v1/user`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createUser>`

```xml
<createUser>
  <username>{username}</username>
  <password>{password}</password>
  <first>{first_name}</first>
  <last>{last_name}</last>
  <email>{email}</email>
  <source>{tenant}</source>
  <token>{token}</token>
  <eulaVersion>0</eulaVersion>
</createUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User created |
| `400` | Bad Request |
| `409` | Conflict (duplicate username or email) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createUserResponse>`

```xml
<createUserResponse>
  <status>SUCCESS</status>
  <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
    <atom:title>{username}</atom:title>
    <atom:published>{datetime}</atom:published>
    <atom:updated>{datetime}</atom:updated>
    <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
    <dc:userid>{user_id}</dc:userid>
  </atom:entry>
</createUserResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/user" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createUser>
  <username>{username}</username>
  <password>{password}</password>
  <first>{first_name}</first>
  <last>{last_name}</last>
  <email>{email}</email>
  <source>{tenant}</source>
  <token>{token}</token>
  <eulaVersion>0</eulaVersion>
</createUser>'
```

---

## GET /lastlogins <a id="getv1lastlogins"></a>

**List last logins**

Returns the most recent user logins and the most recent group logins. A single
call runs both queries, so the response body contains a `listLastLoginsResponse`
element followed by a `listLastGroupLoginsResponse` element.

### Request

`GET https://api.cloudbackend.com/v1/lastlogins`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `maxresponses` | query | no | integer | Maximum number of entries to return. Sent as the `<limit>` element; empty when omitted, which lets the service apply its own default. |
| `sex` | query | no | string | Filter by gender. Sent as the `<gender>` element; empty when omitted. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Recent logins. Both query responses are emitted, one after the other, so the payload is not a single well-formed XML document with one root element. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<listLastLoginsResponse>
  <!-- zero or more users -->
  <user id="{user_id}" name="{username}" lastlogin="{datetime}" />
</listLastLoginsResponse>
<listLastGroupLoginsResponse>
  <!-- zero or more groups -->
  <group id="{group_id}" name="{group_name}" lastlogin="{datetime}" />
</listLastGroupLoginsResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/lastlogins" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /library <a id="getv1library"></a>

**Query a library**

Queries the contents of a library.

Unlike most endpoints in this API the handler emits no wrapper element, so the
response is the raw `queryLibrary` result.

### Request

`GET https://api.cloudbackend.com/v1/library`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `libraryid` | query | no | integer · default `0` | Library to query. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Library contents, returned without a response wrapper element. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<db:result xmlns:db="https://cloudbackend.com/db.xsd">
  <db:paging start="0" size="100" total="{total}" />
  <!-- library entries -->
</db:result>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/library" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /queryuser <a id="postv1queryuser"></a>

**Query the user database**

Queries the user database for a group.

### Request

`POST https://api.cloudbackend.com/v1/queryuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<queryUserDB>`

```xml
<queryUserDB>
  <group id="{group_id}" />
</queryUserDB>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User query results |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryUserDBResponse>`

```xml
<queryUserDBResponse>
  <db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:actuate="onRequest" xlink:href="home://">
    <db:paging start="0" size="100" total="{total}" />
    <db:user name="{username}" id="{user_id}" cid="{group_id}" published="{datetime}" updated="{datetime}">
      <author>{display_name}</author>
      <userid>{owner_user_id}</userid>
      <flag>hidden</flag>
    </db:user>
  </db:result>
</queryUserDBResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/queryuser" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<queryUserDB>
  <group id="{group_id}" />
</queryUserDB>'
```

---

## GET /stats/users/client/{client_name} <a id="getv1statsusersclient"></a>

**Get client user count**

Gets the number of users a named client has.

Replaces `/statisticclient/{clientName}/users` and `/statistics/{clientName}/users`,
which were two spellings of the same route.

### Request

`GET https://api.cloudbackend.com/v1/stats/users/client/{client_name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `client_name` | path | yes | string | Client to report on, e.g. `cloudme`. |
| `after` | query | no | string | (optional) accounts created after (unix epoch time) |
| `before` | query | no | string | (optional) accounts created before (unix epoch time) |
| `deleted` | query | no | string | (optional) "only" for deleted users, "include" for deleted and non-deleted users |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<statistics>`

```xml
<statistics>
  <users total="42" active="35" />
</statistics>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/users/client/{client_name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /admin/deployments/stats <a id="getv1admindeploymentsstats"></a>

**Get end user statistics**

Gets end users created per tenant. Requires the caller to be the CloudBackend
owner or an administrator.

Replaces `/statisticeus`.

### Request

`GET https://api.cloudbackend.com/v1/admin/deployments/stats`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupby` | query | no | string | (optional) year, month, day, hour, total |
| `after` | query | no | string | (optional) created after date (unix epoch time) |
| `before` | query | no | string | (optional) created before date (unix epoch time) |
| `deleted` | query | no | string | (optional) "only" for deleted users, "include" for deleted and non-deleted users |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deployCount>`

```xml
<deployCount>
  <totalResults>1</totalResults>
  <tenant name="cloudbackend" count="7" groupByValue="1"/>
  <tenant name="cloudme" count="20" groupByValue="3"/>
</deployCount>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/admin/deployments/stats" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
