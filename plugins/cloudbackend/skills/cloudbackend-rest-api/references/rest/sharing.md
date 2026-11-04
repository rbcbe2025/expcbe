# REST API — Sharing

65 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /wsg0/{tenant_id}/{webshare_id}/{filename} <a id="getv1wsg0"></a>

**Download a file from a public webshare**

Downloads a file from a public webshare without authentication.

### Request

`GET https://api.cloudbackend.com/v1/wsg0/{tenant_id}/{webshare_id}/{filename}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | string |  |
| `webshare_id` | path | yes | string |  |
| `filename` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | File content |
| `404` | File not found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
File content
```

#### `404` · text/plain

```text
Not Found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsg0/{tenant_id}/{webshare_id}/{filename}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /wsg1/{tenant_id}/{webshare_id}/{filename} <a id="getv1wsg1"></a>

**Download a file from a private webshare**

Downloads a file from a password-protected webshare. Returns 200 with file content or 404 if not found/blocked.

### Request

`GET https://api.cloudbackend.com/v1/wsg1/{tenant_id}/{webshare_id}/{filename}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | string |  |
| `webshare_id` | path | yes | string |  |
| `filename` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | File content |
| `404` | File not found or blocked |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
File content
```

#### `404` · text/plain

```text
Not Found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsg1/{tenant_id}/{webshare_id}/{filename}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /ws2/{user_id}/{webshare_name} <a id="getv1ws2"></a>

**List files in a webshare**

Lists files in a webshare container without authentication.

### Request

`GET https://api.cloudbackend.com/v1/ws2/{user_id}/{webshare_name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_name` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare file listing |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:link rel="self" href="" />
  <atom:author>
    <atom:name>sharer</atom:name>
    <atom:uri></atom:uri>
  </atom:author>
  <atom:id></atom:id>
  <atom:title>readWebshare</atom:title>
  <atom:updated></atom:updated>
  <atom:published></atom:published>
  <atom:summary />
  <dc:resourceContainer>{container_id}</dc:resourceContainer>
  <dc:webshare id="{webshare_id}" access="read" name="readWebshare" description="" />
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/ws2/{user_id}/{webshare_name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /ws2/{user_id}/{webshare_name} <a id="postv1ws2"></a>

**Create a container in a webshare**

Creates a child container in a webshare (inbound sharing).

### Request

`POST https://api.cloudbackend.com/v1/ws2/{user_id}/{webshare_name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_name` | path | yes | string |  |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="{container_id}" childName="childContainer" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `401` | Unauthorized |
| `403` | Inbound sharing not enabled |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `403` · text/plain

```text
This webshare is not set to inbound sharing
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/ws2/{user_id}/{webshare_name}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="{container_id}" childName="childContainer" />'
```

---

## POST /groups/{group_id}/webshares/{webshare_id}/{container_id} <a id="postv1groupswebsharesupload"></a>

**Upload a file to a webshare container**

Uploads a file to a webshare container using multipart/form-data. Supports anonymous access with digest or basic auth.

### Request

`POST https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `webshare_id` | path | yes | string |  |
| `container_id` | path | yes | integer |  |

#### Body

`multipart/form-data` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | File uploaded successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>newfile.txt</atom:title>
  <atom:published></atom:published>
  <atom:updated></atom:updated>
  <atom:link rel="alternate" type="text/plain; charset=ISO-8859-1" href="" length="18" stream_1_length="18" />
  <atom:id></atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object></dc:object>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: multipart/form-data; charset=utf-8"
```

---

## POST /share <a id="postv1share"></a>

**Create a share**

Shares containers and/or objects of the logged-in identity with identities and groups.
The body (`Content-Type: application/xml`) may contain:

- `<description>` — free text.
- `<folders><folder parent="{parent_container_id}" child="{container_id}"/></folders>` —
  containers to share.
- `<documents><document folder="{container_id}" id="{object_id}"/></documents>` —
  objects to share, by `id` or by `name`.
- `<users><user id="{user_id}"/></users>` and `<groups><group id="{group_id}"/></groups>`
  — who the share is for.

Unlike most endpoints, this one does not translate the public names: the elements must
be spelled `folders`/`folder` and `documents`/`document` as shown.

Returns the id of the new share wrapped in `<createShareResponse>`.

### Request

`POST https://api.cloudbackend.com/v1/share`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createShare>`

```xml
<createShare>
  <description>Share 1</description>
  <documents>
    <document folder="{container_id}" name="file1.txt" />
  </documents>
  <users>
    <user id="{user_id}" />
  </users>
</createShare>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Share created |
| `400` | Bad Request — a `<folder>` without `parent`/`child`, a `<document>` without `folder`, or without `id`/`name`, or a named object that does not exist. |
| `401` | Unauthorized |
| `404` | Not Found |
| `415` | Unsupported Media Type — `Content-Type` is not `application/xml` or `text/xml`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createShareResponse>`

```xml
<createShareResponse>25769803777</createShareResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/share" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createShare>
  <description>Share 1</description>
  <documents>
    <document folder="{container_id}" name="file1.txt" />
  </documents>
  <users>
    <user id="{user_id}" />
  </users>
</createShare>'
```

---

## GET /share <a id="getv1share"></a>

**List my shares**

Lists all shares owned by the authenticated user. No request body is read, but the
request must carry `Content-Type: application/xml` (or `text/xml`), otherwise it is
rejected with `415 Unsupported Media Type`.

### Request

`GET https://api.cloudbackend.com/v1/share`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of shares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listMySharesResponse>`

```xml
<listMySharesResponse>
  <shares>
    <share id="{share_id}" owner="{user_id}" created="{datetime}" description="">
      <objects>
        <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
          <os:totalResults>1</os:totalResults>
          <os:startIndex>0</os:startIndex>
          <os:itemsPerPage>1</os:itemsPerPage>
          <atom:entry>
            <atom:title>{object_name}</atom:title>
            <atom:published>{datetime}</atom:published>
            <atom:updated>{datetime}</atom:updated>
            <atom:link rel="alternate" type="{mime_type}" href="" length="0" stream_1_length="0" />
            <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
            <dc:container>{container_id}</dc:container>
            <dc:object>{object_id}</dc:object>
            <dc:tag>{tags}</dc:tag>
            <dc:s1>{property}</dc:s1>
          </atom:entry>
        </atom:feed>
      </objects>
    </share>
  </shares>
</listMySharesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/share" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /share <a id="deletev1share"></a>

**Delete a share**

Deletes a share. The body (`Content-Type: application/xml`) names the share in
`<share id>`. Only the owner of the share may delete it.

### Request

`DELETE https://api.cloudbackend.com/v1/share`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteShare>`

```xml
<deleteShare>
  <share id="{share_id}" />
</deleteShare>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Share deleted |
| `400` | Bad Request — `<share id>` missing. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller does not own the share. |
| `415` | Unsupported Media Type — `Content-Type` is not `application/xml` or `text/xml`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deleteShareResponse>`

```xml
<deleteShareResponse>OK</deleteShareResponse>
```

#### `400` · text/plain

```text
Missing share id.
```

#### `403` · text/plain

```text
You can only delete your own shares.
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/share" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteShare>
  <share id="{share_id}" />
</deleteShare>'
```

---

## POST /listmyshare <a id="postv1listmyshare"></a>

**Get share details**

Returns details for a specific share by ID.

### Request

`POST https://api.cloudbackend.com/v1/listmyshare`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<listMyShare>`

```xml
<listMyShare>
  <share id="{share_id}" />
</listMyShare>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Share details |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listMyShareResponse>`

```xml
<listMyShareResponse>
  <share id="{share_id}" owner="{user_id}" created="{datetime}" description="">
    <objects>
      <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
        <os:totalResults>1</os:totalResults>
        <os:startIndex>0</os:startIndex>
        <os:itemsPerPage>1</os:itemsPerPage>
        <atom:entry>
          <atom:title>{object_name}</atom:title>
          <atom:published>{datetime}</atom:published>
          <atom:updated>{datetime}</atom:updated>
          <atom:link rel="alternate" type="{mime_type}" href="" length="0" stream_1_length="0" />
          <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
          <dc:container>{container_id}</dc:container>
          <dc:object>{object_id}</dc:object>
          <dc:tag>{tags}</dc:tag>
          <dc:s1>{property}</dc:s1>
        </atom:entry>
      </atom:feed>
    </objects>
  </share>
</listMyShareResponse>
```

#### `404` · text/plain

```text
Share not found.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/listmyshare" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<listMyShare>
  <share id="{share_id}" />
</listMyShare>'
```

---

## POST /users/{user_id}/webshares <a id="postv1userswebshares"></a>

**Create a webshare**

Creates a webshare for a container, optionally with visibility, access level, and password.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/webshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<webshare>`

```xml
<webshare name="createOnlyWebshare" access="createonly" visibility="private" password="password">
  <container name="createOnlyWebshare" id="{container_id}"/>
</webshare>
```

*Public read access*

```xml
<webshare name="group ws 1">
  <container name="wsg container 1" id="{container_id}" />
</webshare>
```

*Private update access with password*

```xml
<webshare name="group ws 3" visibility="private" access="update" password="inboundpass">
  <container name="wsg container 3" id="{container_id}" />
</webshare>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshare>`

```xml
<webshare id="16" userId="{user_id}" name="createOnlyWebshare" description="" visibility="private" type="" access="createonly" created="{datetime}" updated="{datetime}" password="true" createdState="created">
  <container name="createOnlyWebshare" id="{container_id}"/>
</webshare>
```

*Public read webshare*

```xml
<webshare id="" groupId="{group_id}" name="group ws 1" description="" visibility="public" type="" access="read" created="" updated="" password="" createdState="created">
  <container name="wsg container 1" id="" />
</webshare>
```

*Private update webshare with password*

```xml
<webshare id="" groupId="{group_id}" name="group ws 3" description="" visibility="private" type="" access="update" created="" updated="" password="true" createdState="created">
  <container name="wsg container 3" id="" />
</webshare>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/webshares" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshare name="createOnlyWebshare" access="createonly" visibility="private" password="password">
  <container name="createOnlyWebshare" id="{container_id}"/>
</webshare>'
```

---

## GET /users/{user_id}/webshares <a id="getv1userswebshares"></a>

**List webshares**

Lists webshares owned by a user.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/webshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of webshares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshares>`

```xml
<webshares xmlns:os='http://a9.com/-/spec/opensearch/1.1/'>
  <os:totalResults>{count}</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <webshare id='{webshare_id}' userId='{user_id}' name='{name}' description='{description}' visibility='private' type='' access='create' created='{datetime}' updated='{datetime}' />
</webshares>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/webshares" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/webshares/{webshare_id} <a id="getv1userswebshare"></a>

**Get webshare details**

Gets detailed information about a specific webshare.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare details |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshare>`

```xml
<webshare id='{webshare_id}' userId='{user_id}' name='{name}' description='{description}' visibility='private' type='' access='create' created='{datetime}' updated='{datetime}' />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/webshares/{webshare_id} <a id="deletev1userswebshares"></a>

**Delete a webshare**

Deletes a webshare by ID.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare deleted successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/webshares/{webshare_id} <a id="postv1userswebshare"></a>

**Update a webshare**

Updates a webshare's name, description, visibility, access level, or password.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_id` | path | yes | string |  |

#### Body

`application/xml` (required), root element `<webshare>`

```xml
<webshare name="{new_name}" description="{new_description}" visibility="private" access="create" password="{password}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshare name="{new_name}" description="{new_description}" visibility="private" access="create" password="{password}" />'
```

---

## GET /users/{user_id}/favorites <a id="getv1usersfavorites"></a>

**List favorites**

Lists the user's favorite webshares.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/favorites`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of favorites |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<favorites>`

```xml
<favorites xmlns:os='http://a9.com/-/spec/opensearch/1.1/'>
  <os:totalResults>{count}</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <favorite id='{favorite_id}' userId='{user_id}' webShareId='{webshare_id}' webShareName='{name}' sharingUserId='{user_id}' sharingUserName='{username}' name='{name}' />
</favorites>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/favorites" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites <a id="postv1usersfavorites"></a>

**Add a webshare to favorites**

Adds a webshare to the user's favorites list, optionally with a password.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<favorite>`

```xml
<favorite webShareId="{webshare_id}" webShareName="readWebshare" sharingUserId="{sharing_user_id}" sharingUserName="sharer" name="readWebshare" password="password" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Favorite added |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<favorite>`

```xml
<favorite userId="{user_id}" webShareId="{webshare_id}" sharingUserId="{sharing_user_id}" sharingUserName="sharer" description="" name="readWebshare" password="" container_id="{container_id}" object_id="0">
  <webshare id="{webshare_id}" userId="{sharing_user_id}" name="readWebshare" description="" visibility="public" type="" access="read" created="" updated="" password="" createdState="existing">
    <container name="readWebshare" id="{container_id}" />
  </webshare>
</favorite>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<favorite webShareId="{webshare_id}" webShareName="readWebshare" sharingUserId="{sharing_user_id}" sharingUserName="sharer" name="readWebshare" password="password" />'
```

---

## GET /users/{user_id}/favorites/{favorite_id} <a id="getv1usersfavorite"></a>

**Get a favorite webshare**

Returns details about a favorited webshare.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Favorite details |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<favorite>`

```xml
<favorite id="{favorite_id}" userId="{user_id}" webShareId="{webshare_id}" description="" sharingUserId="{sharing_user_id}" sharingUserName="sharer" name="readWebshare" password="" container_id="{container_id}" object_id="0">
  <webshare id="{webshare_id}" userId="{sharing_user_id}" name="readWebshare" description="" visibility="public" type="" access="read" created="" updated="" password="" createdState="existing">
    <container name="readWebshare" id="{container_id}" />
  </webshare>
</favorite>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/favorites/{favorite_id} <a id="deletev1usersfavorites"></a>

**Remove a favorite**

Removes a webshare from the user's favorites.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Favorite removed successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites/{favorite_id} <a id="postv1usersfavorite"></a>

**Copy favorite content**

Copies folders from a favorite webshare to a destination folder.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

#### Body

`application/xml` (required), root element `<copy>`

```xml
<copy destinationContainer="{container_id}">
  <containers>
    <container childContainer="{child_container_id}" />
  </containers>
</copy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Content copied |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<copy destinationContainer="{container_id}">
  <containers>
    <container childContainer="{child_container_id}" />
  </containers>
</copy>'
```

---

## PUT /users/{user_id}/favorites/{favorite_id} <a id="putv1usersfavorite"></a>

**Update a favorite**

Updates a favorite's name or password.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

#### Body

`application/xml` (required), root element `<favorite>`

```xml
<favorite name="{new_name}" password="{password}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Favorite updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<favorite name="{new_name}" password="{password}" />'
```

---

## GET /users/{user_id}/favorites/{favorite_id}/webshare <a id="getv1usersfavoriteswebshare"></a>

**List files in a favorited webshare**

Returns the Atom feed listing files in a favorited webshare.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare file listing |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:link rel="self" href="" />
  <atom:author>
    <atom:name>sharer</atom:name>
    <atom:uri></atom:uri>
  </atom:author>
  <atom:id></atom:id>
  <atom:title>readWebshare</atom:title>
  <atom:updated></atom:updated>
  <atom:published></atom:published>
  <atom:summary />
  <dc:resourceContainer>{container_id}</dc:resourceContainer>
  <dc:webshare id="{webshare_id}" access="read" name="readWebshare" description="" />
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites/{favorite_id}/webshare <a id="postv1usersfavoriteswebshare"></a>

**Create a container in a favorited webshare**

Creates a child container in a favorited webshare (inbound sharing).

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | string |  |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="{container_id}" childName="childContainer" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container created |
| `401` | Unauthorized |
| `403` | Inbound sharing not enabled |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newContainerId>`

```xml
<newContainerId>{container_id}</newContainerId>
```

#### `403` · text/plain

```text
This webshare is not set to inbound sharing
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="{container_id}" childName="childContainer" />'
```

---

## GET /userlink <a id="getv1userlink"></a>

**List user links**

Lists all user links for the authenticated user.

### Request

`GET https://api.cloudbackend.com/v1/userlink`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<listUserLinks>`

```xml
<listUserLinks />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of user links |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listUserLinksResponse>`

```xml
<listUserLinksResponse>
  <userLinks />
</listUserLinksResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/userlink" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<listUserLinks />'
```

---

## POST /userlink <a id="postv1userlink"></a>

**Create a user link**

Creates a shareable link for an object.

### Request

`POST https://api.cloudbackend.com/v1/userlink`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createUserLink>`

```xml
<createUserLink>
  <container id="{container_id}" />
  <object>{object_name}</object>
  <maxRequests>{max_requests}</maxRequests>
</createUserLink>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User link created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createUserLinkResponse>`

```xml
<createUserLinkResponse>
  <userLink id="{link_id}" containerId="{container_id}" objectId="{object_id}" expires="{datetime}" maxRequests="{max_requests}" username="{username}" xiosPath="{path}" />
</createUserLinkResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/userlink" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createUserLink>
  <container id="{container_id}" />
  <object>{object_name}</object>
  <maxRequests>{max_requests}</maxRequests>
</createUserLink>'
```

---

## DELETE /userlink <a id="deletev1userlink"></a>

**Delete a user link**

Deletes a user link by ID.

### Request

`DELETE https://api.cloudbackend.com/v1/userlink`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteUserLink>`

```xml
<deleteUserLink>
  <link id="{link_id}" />
</deleteUserLink>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Link deleted |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deleteUserLinkResponse>`

```xml
<deleteUserLinkResponse>OK</deleteUserLinkResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/userlink" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteUserLink>
  <link id="{link_id}" />
</deleteUserLink>'
```

---

## GET /gwebshares/blocked <a id="getv1gwebsharesblocked"></a>

**List blocked webshares**

Returns all blocked webshares for a tenant.

### Request

`GET https://api.cloudbackend.com/v1/gwebshares/blocked`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `wstenant` | query | yes | string | The tenant name |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of blocked webshares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<blocked>`

```xml
<blocked>
  <ws groupId="{group_id}" wsId="10" wsName="group ws 1"/>
  <ws groupId="{group_id}" wsId="11" wsName="group ws 2"/>
</blocked>
```

*With blocked webshares*

```xml
<blocked>
  <ws groupId="{group_id}" wsId="{webshare_id}" wsName="group ws 1" />
  <ws groupId="{group_id}" wsId="{webshare_id}" wsName="group ws 2" />
</blocked>
```

*No blocked webshares*

```xml
<blocked>
</blocked>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/gwebshares/blocked?wstenant={wstenant}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /gwebshares/block <a id="postv1gwebsharesblock"></a>

**Block a group webshare**

Blocks a group webshare, identified by the owning group (`groupid`) and the
webshare name (`ws`), so it can no longer be reached through its public URLs.
The caller must be the owner or an administrator of the tenant the group belongs
to; otherwise `401` is returned.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/gwebshares/block`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | yes | integer | Id of the group that owns the webshare. |
| `ws` | query | yes | string | Name of the webshare to block. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare blocked |
| `400` | Bad Request — `Missing webshare name`, `Missing group id`, `Invalid group id` or `Invalid webshare name` |
| `401` | Unauthorized — not logged in, or not owner/admin of the group's tenant |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/gwebshares/block?groupid={groupid}&ws={ws}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /gwebshares/unblock <a id="postv1gwebsharesunblock"></a>

**Unblock a group webshare**

Unblocks a previously blocked group webshare (see `POST /gwebshares/block`),
identified by the owning group (`groupid`) and the webshare name (`ws`). The caller
must be the owner or an administrator of the tenant the group belongs to;
otherwise `401` is returned.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/gwebshares/unblock`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | yes | integer | Id of the group that owns the webshare. |
| `ws` | query | yes | string | Name of the webshare to unblock. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare unblocked |
| `400` | Bad Request — `Missing webshare name`, `Missing group id`, `Invalid group id` or `Invalid webshare name` |
| `401` | Unauthorized — not logged in, or not owner/admin of the group's tenant |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/gwebshares/unblock?groupid={groupid}&ws={ws}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /public/users/{username}/{webshare_path} <a id="getv1publicusers"></a>

**Redirect to webshare location**

Returns HTML that points to the new location and also updates the HTTPLocationheader.

### Request

`GET https://api.cloudbackend.com/v1/public/users/{username}/{webshare_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `username` | path | yes | string |  |
| `webshare_path` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/html

```html
<html><body>Redirecting to <a href="https://example.cloudbackend.cloud/webshare">new location</a></body></html>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/public/users/{username}/{webshare_path}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/followinvites <a id="getv1usersfollowinvites"></a>

**List follow invites**

Lists the webshare invitations that `{user_id}` has received and not yet acted
on (see `POST /webshares/invite/{user_id}`). The caller must be `{user_id}`.

Each `<invited>` element gives the invite `id`, the invited `userId` and/or
`email`, the `access` level when it is not read-only, the sharing identity
(`sharingUserId` / `sharingUsername`, or `sharingGroupId` / `sharingGroupname`
for a group webshare), `webShareName`, `webShareId`, `created`, and the webshare
`password` when one was passed with the invitation.

To decline an invitation use `DELETE /users/{user_id}/followinvites/{invite_id}`.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/followinvites`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The invited identity; must be the caller. |
| `sharinguserid` | query | no | integer · default `0` | Only list invitations from this sharing user id. `0` lists all. A non-numeric value gives `404`. |
| `order` | query | no | string · one of `created`, `name`, `sharinguserid`, `sharingusername` · default `created` | Sort field (`name` is the webshare name). Any other value sorts by `created`. |
| `desc` | query | no | boolean · default `False` | `true` sorts in descending order. |
| `offset` | query | no | integer · default `0` | Index of the first invitation to return. |
| `count` | query | no | integer · default `100` | Maximum number of invitations to return. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Received invitations |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — `Wrong type on sharinguserid! Integer expected.` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<followinvites>`

```xml
<followinvites xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <invited id="30" userId="12884901959" email="follower@example.com" access="update" sharingUserId="12884901958" sharingUsername="sharer" webShareName="webshare name 3" webShareId="5" created="2026-06-29T13:24:26Z"/>
</followinvites>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/followinvites" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/followinvites/{invite_id} <a id="deletev1usersfollowinvites"></a>

**Decline follow invite**

Declines (deletes) a webshare invitation that `{user_id}` has received. The
caller must be `{user_id}`. `{invite_id}` is the `id` of an `<invited>` element
from `GET /users/{user_id}/followinvites`.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/followinvites/{invite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The invited identity; must be the caller. |
| `invite_id` | path | yes | integer | Id of the invitation. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitation declined |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — no such invitation |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/followinvites/{invite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/xtenant <a id="getv1usersxtenant"></a>

**List cross-tenant grants**

Lists the cross-tenant grants the caller has given. A grant lets an identity
(`usingUserId`) that reaches this tenant with the `xtenant` request header use one
of the caller's containers or objects.

`resourceKind` is `folder-recursively` (a container and everything below it),
`folder` (one container and the objects in it) or `document` (one object);
`resourceId` is the container or object id. `read`, `write` and `delete` are `1` or
`0`.

`{user_id}` must be the logged-in identity (`403` otherwise). No request body.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/xtenant`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Grants (zero or more) |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

#### `200` · application/xml · `<xtenantResources>`

```xml
<xtenantResources>
  <xtenantResource id='1' givingUserId='{user_id}' resourceId='{container_id}' usingUserId='{using_user_id}' read='1' write='0' delete='0' resourceKind='folder-recursively'/>
  <xtenantResource id='2' givingUserId='{user_id}' resourceId='{object_id}' usingUserId='{using_user_id}' read='1' write='0' delete='0' resourceKind='document'/>
</xtenantResources>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/xtenant" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/xtenant <a id="postv1usersxtenant"></a>

**Grant cross-tenant access**

Gives an identity cross-tenant access to one of the caller's containers or objects.
The body is an `<xtenantResource>` with the attributes `resourceKind`
(`folder-recursively`, `folder` or `document`), `resourceId` (container or object
id), `usingUserId` (identity that gets access) and the optional rights `read`,
`write` and `delete` (`1`/`0`, default `0`).

`{user_id}` must be the logged-in identity (`403` otherwise). The response has no
body.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/xtenant`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity, which gives the access. |

#### Body

`application/xml` (required), root element `<xtenantResource>`

```xml
<xtenantResource resourceKind="folder-recursively" resourceId="{container_id}" usingUserId="{using_user_id}" read="1" write="0" delete="0" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Grant added |
| `400` | Bad Request — `Missing @resourceId`, `Missing @usingUserId` or `Missing @resourceKind` |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Missing @resourceKind
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/xtenant" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<xtenantResource resourceKind="folder-recursively" resourceId="{container_id}" usingUserId="{using_user_id}" read="1" write="0" delete="0" />'
```

---

## DELETE /users/{user_id}/xtenant <a id="deletev1usersxtenant"></a>

**Remove cross-tenant grants**

Removes grants the caller has given. Use one query parameter: `all=1` removes every
grant, `usingUserId` removes all grants to that identity, `id` removes one grant.
Without any of them nothing is removed (still `200`).

`{user_id}` must be the logged-in identity (`403` otherwise). No request body. The
response has no body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/xtenant`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `all` | query | no | boolean | `1`/`true` removes all grants of the caller. |
| `usingUserId` | query | no | integer | Remove all grants to this identity. |
| `id` | query | no | integer | Remove the grant with this `id`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Grants removed |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/xtenant" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/webshares/{webshare_id}/followers <a id="deletev1userswebsharesfollowers"></a>

**Delete webshare invite**

Withdraws an invitation to the webshare, identified by the invited e-mail address
(`email`) or by the invited identity (`userinviteid`). The caller must be
`{user_id}`, the webshare owner. When nothing matches, `404` is returned.

To remove an identity that already follows the webshare, use
`DELETE /users/{user_id}/webshares/{webshare_id}/followers/{favorite_id}`.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare; must be the caller. |
| `webshare_id` | path | yes | integer | Id of the webshare. |
| `email` | query | no | string | E-mail address of the invitation to withdraw (the `email` attribute of an `<invited>` follower). |
| `userinviteid` | query | no | integer | Id of an invited associated identity (the `userInviteId` attribute of an `<invited>` follower). |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitation withdrawn |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — no matching invitation or follower |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/webshares/{webshare_id}/followers <a id="getv1userswebsharesfollowers"></a>

**List webshare followers**

Lists who has access to the webshare: identities that follow it (`<follower>`
elements, with their `favoriteId`) and outstanding invitations (`<invited>`
elements). The caller must be `{user_id}`, the webshare owner.

Each element carries `access`, `email`, `type` (`follower` or `invited`),
`created`, and when known `userId`, `userInviteId`, `username`, `firstname`,
`lastname`, `favoriteId` and `blocked`.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare; must be the caller. |
| `webshare_id` | path | yes | integer | Id of the webshare. |
| `order` | query | no | string · one of `created`, `email`, `type`, `access` · default `created` | Sort field. Any other value sorts by `created`. |
| `desc` | query | no | boolean · default `False` | `true` sorts in descending order. |
| `offset` | query | no | integer · default `0` | Index of the first entry to return. |
| `count` | query | no | integer · default `100` | Maximum number of entries to return. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Followers and invitations |
| `401` | Unauthorized |
| `403` | Forbidden — `Access denied.` (caller is not `{user_id}`) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<followers>`

```xml
<followers xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <invited access="update" email="follower@example.com" type="invited" created="2026-06-29T13:24:26Z" userId="12884901959" username="follower" firstname="follower" lastname="share"/>
</followers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/webshares/{webshare_id}/followers <a id="putv1userswebsharesfollowers"></a>

**Update webshare followers**

Not implemented: the handler accepts the request, ignores any body and returns
`204` without changing anything. Followers are managed with
`POST /webshares/invite/{user_id}` and the `DELETE` methods.

No request body.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare. |
| `webshare_id` | path | yes | integer | Id of the webshare. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | No change made |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/webshares/{webshare_id}/followers/{favorite_id} <a id="deletev1userswebsharesfollower"></a>

**Remove a webshare follower**

Removes a follower from the webshare by deleting their favorite, so the follower
loses access. `{favorite_id}` is the `favoriteId` of a `<follower>` from
`GET /users/{user_id}/webshares/{webshare_id}/followers`. The optional `email` /
`userinviteid` query parameters additionally match an outstanding invitation. The
caller must be `{user_id}`, the webshare owner.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare; must be the caller. |
| `webshare_id` | path | yes | integer | Id of the webshare. |
| `favorite_id` | path | yes | integer | The follower's favorite id (`favoriteId`). |
| `email` | query | no | string | E-mail address of an invitation to withdraw instead, if no favorite matches. |
| `userinviteid` | query | no | integer | Invited associated identity to withdraw instead, if no favorite matches. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Follower removed |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — no matching follower or invitation |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/webshares/{webshare_id}/followers/{favorite_id} <a id="getv1userswebsharesfollower"></a>

**List webshare followers**

Same handler as `GET /users/{user_id}/webshares/{webshare_id}/followers`:
`{favorite_id}` is ignored and all followers and invitations of the webshare are
returned. The caller must be `{user_id}`. Accepts the same `order`, `desc`,
`offset` and `count` query parameters.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers/{favorite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare; must be the caller. |
| `webshare_id` | path | yes | integer | Id of the webshare. |
| `favorite_id` | path | yes | integer | Ignored by this method. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Followers and invitations |
| `401` | Unauthorized |
| `403` | Forbidden — `Access denied.` (caller is not `{user_id}`) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<followers>`

```xml
<followers xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <follower access="read" email="follower@example.com" type="follower" created="2026-06-29T13:24:26Z" userId="12884901959" username="follower" favoriteId="12"/>
</followers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/followers/{favorite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/webshares/{webshare_id}/resources <a id="putv1userswebsharesresources"></a>

**Remove webshare resources**

Removes containers and/or objects from the resources of a webshare. The containers
and objects themselves are not deleted, only no longer shared. The caller must be
`{user_id}`, the webshare owner.

The body is a `<webshare>` element with one or more `<delete>` children, each with
both attributes: `container_id` and `object_id` (use `object_id="0"` to remove a
container). Every listed resource must be part of the webshare, otherwise `400`.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/resources`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare; must be the caller. |
| `webshare_id` | path | yes | integer | Id of the webshare. |

#### Body

`application/xml` (required), root element `<webshare>`

```xml
<webshare>
  <delete container_id="8589935569" object_id="0"/>
</webshare>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Resources removed from the webshare |
| `400` | Bad Request — malformed XML, or `Not all resources was in webshare` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `422` | Unprocessable Entity — `<delete/> resources missing`, or a `<delete>` lacks `container_id` or `object_id` |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/resources" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshare>
  <delete container_id="8589935569" object_id="0"/>
</webshare>'
```

---

## POST /webshares/block <a id="postv1websharesblock"></a>

**Block a user webshare**

Blocks a webshare owned by an identity, so it can no longer be reached through
its public webshare URLs. The caller must be the owner or an administrator of the
tenant given in `wstenant`; otherwise `401` is returned.

The webshare is identified by its name (`ws`) and its owner, given as **exactly
one** of `user` (username) or `userid`. The owner must belong to the tenant named
in `wstenant`.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/webshares/block`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `wstenant` | query | yes | string | Name of the tenant that owns the webshare (the webshare owner's tenant, not necessarily the caller's). |
| `ws` | query | yes | string | Name of the webshare to block. |
| `user` | query | no | string | Username of the webshare owner. Give either `user` or `userid`, not both. |
| `userid` | query | no | integer | User id of the webshare owner. Give either `user` or `userid`, not both. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare blocked |
| `400` | Bad Request — `Missing wstenant`, `Invalid tenant`, `Missing webshare name`, `Missing username or user id`, `Need username or user id, not both`, `Invalid username`, `Invalid user id`, `Invalid username/user id` (owner is in another tenant) or `Invalid webshare name`. |
| `401` | Unauthorized — not logged in, or not owner/admin of the tenant |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/webshares/block?wstenant={wstenant}&ws={ws}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /webshares/blocked <a id="getv1websharesblocked"></a>

**List blocked webshares**

Lists all blocked identity webshares in the tenant given in `wstenant`. The caller
must be the owner or an administrator of that tenant; otherwise `401` is returned.

Each `<ws>` element gives the owner's user id (`userId`), the webshare id (`wsId`)
and the webshare name (`wsName`). Group webshares are listed by
`GET /gwebshares/blocked`.

### Request

`GET https://api.cloudbackend.com/v1/webshares/blocked`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `wstenant` | query | yes | string | Name of the tenant whose blocked webshares are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Blocked webshares (zero or more `<ws>` elements) |
| `400` | Bad Request — `Missing wstenant` or `Invalid tenant` |
| `401` | Unauthorized — not logged in, or not owner/admin of the tenant |
| `500` | Internal Server Error |

#### `200` · application/xml · `<blocked>`

```xml
<blocked>
  <ws userId="12884901958" wsId="3" wsName="new webshare name 1"/>
</blocked>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/webshares/blocked?wstenant={wstenant}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /webshares/domain <a id="getv1websharesdomain"></a>

**Get webshare domain info**

Gets the webshare domain info for an individual domain or all for an owner based on parameter passed in. If successful,200 OKis returned and this XML Result:/?domain=<domain> /?owner=<webshare_owner_id> If the domain wasn't added by using thePOSTcall,204 No Contentis returned.

### Request

`GET https://api.cloudbackend.com/v1/webshares/domain`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | query | no | string | Domain, eg. some.domain.com, but can be any unique string |
| `owner` | query | no | string | webshare owner id (currently tenant group id) |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<domains>`

```xml
<domains total='2'>
<webshareDomain domain='some.domain.com' cert_object_id='4294968620' key_object_id='4294968621' cert_container_id='4294968620' key_container_id='4294968621'  cert_object_id='4294968620' key_object_id='4294968621' webshare_name='some.domain.com' weshare_owner_id='12345' tenant='sometenant' />
<webshareDomain domain='domainwihtautokey.com' cert_object_id='0' key_object_id='0' cert_container_id='0' key_container_id='0'  cert_object_id='0' key_object_id='0' webshare_name='domainwihtautokey' weshare_owner_id='12345' tenant='sometenant' />
<domains>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/webshares/domain" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /webshares/domain <a id="postv1websharesdomain"></a>

**Add a webshare domain**

Adds a webshare domain Postdata

### Request

`POST https://api.cloudbackend.com/v1/webshares/domain`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | query | no | string | none |
| `webshare_id` | query | no | string | none |
| `webshare_group_id` | query | no | string | 0 |
| `webshare_name` | query | no | string | "" |
| `cert_folder_id` | query | no | string | 0 |
| `cert_docment_id` | query | no | string | 0 |
| `key_folder_id` | query | no | string | 0 |
| `key_document_id` | query | no | string | 0 |

#### Body

`application/xml` (required), root element `<webshareDomain>`

```xml
<webshareDomain domain="testcbejaydomain.org" webshare_group_id="{group_id}" webshare_name="testwebshare"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshareDomain>`

```xml
<webshareDomain domain="some.domain.com" cert_object_id="0" key_object_id="0" cert_container_id="0" key_container_id="0" cert_object_id="0" key_object_id="0" webshare_name="some name" webshare_group_id="some group id" tenant="some tenant" />
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/webshares/domain" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshareDomain domain="testcbejaydomain.org" webshare_group_id="{group_id}" webshare_name="testwebshare"/>'
```

---

## DELETE /webshares/domain <a id="deletev1websharesdomain"></a>

**Delete a webshare domain**

Removes a webshare domain registration.

### Request

`DELETE https://api.cloudbackend.com/v1/webshares/domain`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | query | yes | string | Domain to remove. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Domain deleted |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
success
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/webshares/domain?domain={domain}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /webshares/invite/{user_id} <a id="postv1websharesinvite"></a>

**Invite users to webshare**

Invites one or more recipients to one or more webshares. Each recipient gets a
`webshareInvite` lifestream entry (and, where configured, an e-mail) and can then
follow the webshare as a favorite; outstanding invitations are listed by
`GET /users/{user_id}/followinvites` (recipient side) and
`GET /users/{user_id}/webshares/{webshare_id}/followers` (owner side). The caller
must be `{user_id}`.

`<webshares>` holds one or more `<webshare>` elements:

- `id` (required) — the webshare id.
- `password` (optional) — the webshare password, passed on to the recipients.
- `ownerId` (optional) — the webshare owner's user id; defaults to `{user_id}`.
  Set it to re-share another identity's webshare.

`<recipients>` holds one or more `<recipient>` elements, each with one of these
attributes:

- `userId` — an identity in the same tenant.
- `inviteId` — an associated-account invite id.
- `email` — an e-mail address. E-mail invitations are not allowed for identities
  on a `FREE` account type (spam prevention); the live tests show this failing
  with `500`.
- `memberId` — a member id (used by the legacy CloudMe tenant).

`<message>` (optional) is a text included in the invitation.

### Request

`POST https://api.cloudbackend.com/v1/webshares/invite/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The inviting identity; must be the caller. |

#### Body

`application/xml` (required), root element `<webshareInvite>`

```xml
<webshareInvite>
  <webshares>
    <webshare id="5" password="pswd3pswd3pswd3pswd3" ownerId="12884901958"/>
  </webshares>
  <recipients>
    <recipient userId="12884901959"/>
  </recipients>
  <message>This is the message that the user will read</message>
</webshareInvite>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitations sent |
| `400` | Bad Request — malformed XML, `Invalid User-id`, `Invite not allowed for this webshare` or `Failed to send webshare invite` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not `{user_id}` |
| `404` | Not Found — a webshare does not exist |
| `422` | Unprocessable Entity — `Missing 'id' attribute on <webshare/>`, `Missing webshare for invite`, `Missing 'email' or 'id' on <recipient/>` or `Missing recipients for invite` |
| `500` | Internal Server Error — e.g. e-mail invitation from a `FREE` account |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/webshares/invite/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshareInvite>
  <webshares>
    <webshare id="5" password="pswd3pswd3pswd3pswd3" ownerId="12884901958"/>
  </webshares>
  <recipients>
    <recipient userId="12884901959"/>
  </recipients>
  <message>This is the message that the user will read</message>
</webshareInvite>'
```

---

## POST /webshares/unblock <a id="postv1websharesunblock"></a>

**Unblock a user webshare**

Unblocks a previously blocked identity webshare (see `POST /webshares/block`). The
caller must be the owner or an administrator of the tenant given in `wstenant`;
otherwise `401` is returned.

The webshare is identified by its name (`ws`) and its owner, given as **exactly
one** of `user` (username) or `userid`. The owner must belong to the tenant named
in `wstenant`.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/webshares/unblock`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `wstenant` | query | yes | string | Name of the tenant that owns the webshare (the webshare owner's tenant, not necessarily the caller's). |
| `ws` | query | yes | string | Name of the webshare to unblock. |
| `user` | query | no | string | Username of the webshare owner. Give either `user` or `userid`, not both. |
| `userid` | query | no | integer | User id of the webshare owner. Give either `user` or `userid`, not both. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare unblocked |
| `400` | Bad Request — `Missing wstenant`, `Invalid tenant`, `Missing webshare name`, `Missing username or user id`, `Need username or user id, not both`, `Invalid username`, `Invalid user id`, `Invalid username/user id` (owner is in another tenant) or `Invalid webshare name`. |
| `401` | Unauthorized — not logged in, or not owner/admin of the tenant |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/webshares/unblock?wstenant={wstenant}&ws={ws}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /webshares/{user_id} <a id="getv1webshares"></a>

**List user webshares**

Lists the public webshares of `{user_id}` as an Atom feed. No login is needed;
only webshares with visibility `public` are included. Each `<atom:entry>` has the
webshare name as `<atom:title>`, an `alternate` link to its HTML page and an
`enclosure` link to its content feed.

The canonical URL ends with a slash: a request to `/webshares/{user_id}` is
answered with `301 Moved Permanently` and a `Location` of
`/webshares/{user_id}/`.

### Request

`GET https://api.cloudbackend.com/v1/webshares/{user_id}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity whose public webshares are listed. |
| `offset` | query | no | integer · default `0` | Index of the first webshare to return. |
| `count` | query | no | integer · default `100` | Maximum number of webshares to return. Values above 1000 give `400`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom feed of public webshares |
| `301` | Moved Permanently — redirect to the URL with a trailing slash |
| `400` | Bad Request — `'count' must be less than 1000` |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/atom+xml · `<feed>`

```text
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:author>
    <atom:name>sharer share</atom:name>
    <atom:uri>{author_uri}</atom:uri>
  </atom:author>
  <atom:entry>
    <atom:title>webshare name 1</atom:title>
    <atom:published>2026-06-29T13:24:26Z</atom:published>
    <atom:updated>2026-06-29T13:24:26Z</atom:updated>
    <atom:id>{webshare_uri}</atom:id>
    <atom:link rel="alternate" type="text/html" href="{webshare_html_uri}"/>
    <atom:link rel="enclosure" type="application/atom+xml" href="{webshare_feed_uri}"/>
  </atom:entry>
  <atom:id>https://api.cloudbackend.com/v1/webshares/12884901958/</atom:id>
  <atom:link rel="self" href="https://api.cloudbackend.com/v1/webshares/12884901958/"/>
  <atom:title>WebShares: sharer share</atom:title>
  <atom:updated>2026-06-29T13:24:26Z</atom:updated>
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/webshares/{user_id}"
```

---

## GET /webshares/{user_id}/{webshare_name}/qr <a id="getv1websharesqr"></a>

**Download webshare QR code**

Downloads a QR code png file.

### Request

`GET https://api.cloudbackend.com/v1/webshares/{user_id}/{webshare_name}/qr`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `webshare_name` | path | yes | string |  |

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
�PNG
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/webshares/{user_id}/{webshare_name}/qr" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /ws[0_9]/{user_id}/{webshare_id} <a id="getv1ws"></a>

**Get webshare feed**

Gets webshare metadata as an Atom feed.

`[0_9]` in the path denotes an optional single digit: `/ws`, `/ws0`, `/ws1` …
`/ws9` all reach this endpoint. The digit selects the response variant used by
different clients.

The two segments may be separated by `/` or `;` — `/ws2/{user_id};{webshare_id}`
also routes.

### Request

`GET https://api.cloudbackend.com/v1/ws[0_9]/{user_id}/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | string | Owner of the webshare — a user id or a username. |
| `webshare_id` | path | yes | string | The webshare — an id or a name. |
| `meta` | query | no | string | false or true |
| `visibility` | query | no | string | false or true |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://xcerion.com/directory.xsd"
  xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <!-- zero or more atom:entry elements -->
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/ws/{user_id}/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /ws[0_9]/{user_id}/{webshare_id}/{path} <a id="postv1ws"></a>

**Create webshare container**

Creates a container inside a webshare, at the given path.

`{path}` is a location within the webshare's container structure and is parsed by
the service, so it may span several segments — it is not a single path segment.

`[0_9]` in the path denotes an optional single digit, as on
`GET /ws[0_9]/{user_id}/{webshare_id}`.

### Request

`POST https://api.cloudbackend.com/v1/ws[0_9]/{user_id}/{webshare_id}/{path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | string | Owner of the webshare — a user id or a username. |
| `webshare_id` | path | yes | string | The webshare — an id or a name. |
| `path` | path | yes | string | Location within the webshare's container structure, parsed by the service. May span several segments. |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="{container_id}" childName="{child_name}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/ws/{user_id}/{webshare_id}/{path}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="{container_id}" childName="{child_name}" />'
```

---

## GET /ws[0_9]/{user_id}/{webshare_id}/{path} <a id="getv1wspath"></a>

**Browse or download from a webshare**

Reads content of a user's webshare at `{path}`. No CloudBackend PaaS login is
needed, except for webshares with visibility `invited`, which need a logged-in
identity that was invited.

- When `{path}` is a container, the response is an Atom feed listing it
  (`Content-Type: application/atom+xml`). Address a container with a trailing
  slash — `/ws3/{user_id}/{webshare_id}/` lists the webshare root; without the
  slash the call answers `303 See Other` with the slash added in `Location`.
- When `{path}` is an object, its stream is returned as is (`?s=` picks a
  stream, `?dl` makes it a download). Objects cannot be read from a `createonly`
  webshare (`403`).

A password-protected webshare needs the webshare password with HTTP Digest or
Basic authentication (any username, e.g. `anonymous`); otherwise `401`.

`[0_9]` in the path denotes an optional single digit, as on
`GET /ws[0_9]/{user_id}/{webshare_id}`. The user and webshare segments may be separated by
`/` or `;`. `?meta=true` is not allowed together with a path (`400`); use
[`GET /ws[0_9]/{user_id}/{webshare_id}?meta=true`](#tag/Sharing/operation/getv1ws)
for the webshare description. No request body.

### Request

`GET https://api.cloudbackend.com/v1/ws[0_9]/{user_id}/{webshare_id}/{path}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | string | Owner of the webshare — a numeric user id, or a username prefixed with `:` (e.g. `:jdoe`). |
| `webshare_id` | path | yes | string | The webshare — a numeric id, or a name prefixed with `:` (e.g. `:Photos`). |
| `path` | path | yes | string | Container or object inside the webshare, URL-encoded; may span several segments (`sub1/subfile1.txt`). Empty (just the trailing slash) for the webshare root. |
| `offset` | query | no | integer · default `0` | Container listing only — index of the first entry. |
| `count` | query | no | integer · default `100` | Container listing only — maximum number of entries (at most 1000). |
| `order` | query | no | string | Container listing only — sort order of the entries. |
| `desc` | query | no | string · one of `true`, `false` · default `false` | Container listing only — `true` sorts descending. |
| `deleted` | query | no | string · one of `true`, `false` · default `false` | Container listing only — `true` lists deleted entries. |
| `query` | query | no | string | Container listing only — filter text. |
| `type` | query | no | string | Container listing only — filter on entry type. |
| `datasrc` | query | no | string · one of `datamodel` | Container listing only — `datamodel` returns the listing in the data-model variant. |
| `s` | query | no | integer | Object only — stream id to return. Default the object's default stream. |
| `dl` | query | no | string | Object only — when present, the stream is sent as a download (`Content-Disposition: attachment`) with this file name; an empty `dl` uses the stream's title. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container listing (Atom feed) or the object's content |
| `303` | See Other — a container was addressed without a trailing slash; `Location` holds the URL with the slash |
| `400` | Bad Request — `Meta-request with path not allowed`, or `'count' must be less than 1000` |
| `401` | Unauthorized — `You need to provide a valid password to access this webshare-resource`, or an `invited` webshare without login |
| `403` | Forbidden — the caller was not invited to the webshare, or an object was requested from a `createonly` webshare |
| `404` | Not Found — user, webshare or path not found |
| `500` | Internal Server Error |

#### `200` · application/atom+xml · `<feed>`

```text
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:link rel="self" href="{self_url}" />
  <atom:author>
    <atom:name>{owner_full_name}</atom:name>
    <atom:uri>{author_uri}</atom:uri>
  </atom:author>
  <atom:id>{self_url}</atom:id>
  <atom:title>Photos</atom:title>
  <atom:updated>{datetime}</atom:updated>
  <atom:published>{datetime}</atom:published>
  <atom:summary />
  <dc:resourceFolder>{container_id}</dc:resourceFolder>
  <dc:webshare id="{webshare_id}" access="read" name="Photos" description="" />
</atom:feed>
```

#### `200` · text/plain

```text
Some sub1 file 1
```

#### `404` · text/plain

```text
Document 'invalid-file.txt' not found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/ws/{user_id}/{webshare_id}/{path}"
```

---

## GET /wsd <a id="getv1wsd"></a>

**Get webshare by domain**

Returns the contents of a domain-based webshare as an Atom feed.

The domain is passed as a query parameter here; `GET /wsd/{domain}` is the
equivalent path form. Prefer this parameter form — the path form has been
reported to fail for some `.com` domains.

Add `path` to fetch a single object instead of the listing, e.g.
`?domain=example.org&path=/Some file`. The equivalent path form is
`GET /wsd/{domain}/{path}` — note that
this parameter form takes a leading slash on `path` and the path form does not.

### Request

`GET https://api.cloudbackend.com/v1/wsd`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | query | yes | string | Domain the webshare is published under, e.g. `example.com`. |
| `path` | query | no | string | Path to a container or object inside the webshare, e.g. `/Some file`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom='http://www.w3.org/2005/Atom' xmlns:os='http://a9.com/-/spec/opensearch/1.1/' xmlns:dc='http://xcerion.com/directory.xsd' xmlns:ni='http://xcerion.com/noindex.xsd'>
<os:totalResults>2</os:totalResults>
<os:startIndex>0</os:startIndex>
<os:itemsPerPage>100</os:itemsPerPage>
<atom:link rel='self' href='http://127.0.0.1/v1/wsd/?offset=0&amp;count=100' />
<atom:author>
<atom:name>testcbetenantjay</atom:name>
<atom:uri>http://my.cloudme.com/testcbetenantjay</atom:uri>
</atom:author>
<atom:id>http://127.0.0.1/v1/wsd/</atom:id>
<atom:title>sharetest2</atom:title>
<atom:updated>2024-10-31T07:50:17Z</atom:updated>
<atom:published>2024-10-31T07:50:17Z</atom:published>
<atom:summary>Deploy:1234</atom:summary>
<dc:resourceFolder>8589936429</dc:resourceFolder>
<dc:webshare id='68' access='read' name='sharetest2' description='Deploy:1234' />
<atom:entry>
<atom:title>jaydomaintest</atom:title>
<atom:published>2024-10-31T07:50:17Z</atom:published>
<atom:updated>2024-10-31T07:50:17Z</atom:updated>
<atom:id>urn:x-i-o-s:container:8589936430</atom:id>
<dc:container>8589936429</dc:container>
<dc:childFolder>8589936430</dc:childFolder>
<atom:link rel='alternate' type='text/html' href='http://my.cloudme.com/testcbetenantjay/wsg2/68/jaydomaintest/' />
<atom:link rel='enclosure' type='application/atom+xml' href='http://127.0.0.1/v1/wsd/jaydomaintest/' />
</atom:entry>
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
<atom:title>aMessageIThink</atom:title>
<atom:published>2021-07-22T07:54:40Z</atom:published>
<atom:updated>2024-10-31T07:46:16Z</atom:updated>
<atom:link rel="alternate" type="text/html" href="http://my.cloudme.com/testcbetenantjay/wsg2/68/aMessageIThink" length="547" stream_1_length="547" />
<atom:id>mid:10000080a@xios.xcerion.com</atom:id>
<dc:container>8589936429</dc:container>
<dc:object>4294969354</dc:object>
<atom:link rel="enclosure" type="text/xml" href="http://127.0.0.1/v1/wsd/aMessageIThink" />
</atom:entry>
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsd?domain={domain}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /wsd <a id="postv1wsdparam"></a>

**Create container in domain webshare (parameter form)**

Parameter form of
`POST /wsd/{domain}`: the domain is passed as
`?domain=`, which avoids the problems the path form has with some `.com` domains.

Creates a child container inside a container of the group webshare that is mapped
to the domain (see `/webshares/domain`), and returns the new container id. No
CloudBackend PaaS login is needed. The webshare must allow inbound content (access
`create`, `createonly` or `update`), and the parent container must be part of the
webshare. When the webshare is password-protected, prove the password with HTTP
Digest or Basic authentication (any username, e.g. `anonymous`); otherwise `401`.

The body is `<newContainer containerId="…" childName="…"/>` (the established form
`<newFolder folderId="…" childName="…"/>` is accepted too); the response uses the
established element name `<newFolderId>`.

### Request

`POST https://api.cloudbackend.com/v1/wsd`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | query | yes | string | Domain the webshare is published under, e.g. `example.com`. |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="8589935565" childName="wsg sub container"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Id of the new container |
| `400` | Bad Request — malformed XML, `No folder id given.` or `No ChildFolderName could be found.` |
| `401` | Unauthorized — `You need to provide a valid password to access this webshare-resource` |
| `403` | Forbidden — `This webshare is not set to inbound sharing`, `Invited only` or `The given folder is not part of this webshare` |
| `404` | Not Found — `Domain not specified` (no `domain` parameter), `Domain not found`, or webshare not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newFolderId>`

```xml
<newFolderId>8589935566</newFolderId>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/wsd?domain={domain}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="8589935565" childName="wsg sub container"/>'
```

---

## GET /wsd/{domain} <a id="getv1wsddomain"></a>

**Get domain webshare content**

Lists the contents of a domain-based webshare as an Atom feed. A trailing slash
is optional — `/wsd/{domain}` and `/wsd/{domain}/` address the same resource.

`GET /wsd?domain={domain}` is the equivalent parameter form and is preferred, as
this path form has been reported to fail for some `.com` domains.

Each `<atom:entry>` in the feed carries an `<atom:link rel="enclosure">` holding
the URL of the object it describes — see
`GET /wsd/{domain}/{path}`.

### Request

`GET https://api.cloudbackend.com/v1/wsd/{domain}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | path | yes | string | Domain name mapped to a group webshare. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare content feed |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd">
<os:totalResults>2</os:totalResults>
<os:startIndex>0</os:startIndex>
<os:itemsPerPage>100</os:itemsPerPage>
<!-- atom:entry elements for each file/folder -->
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsd/{domain}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /wsd/{domain} <a id="postv1wsd"></a>

**Create container in domain webshare**

Creates a child container inside a container of the group webshare that is mapped
to `{domain}` (see `/webshares/domain`), and returns the new container id. No
CloudBackend PaaS login is needed.

The webshare must allow inbound content (access `create`, `createonly` or
`update`), and the parent container must be part of the webshare. When the
webshare is password-protected, prove the password with HTTP Digest or Basic
authentication (any username, e.g. `anonymous`); otherwise `401`.

The body is `<newContainer containerId="…" childName="…"/>` (the established
form `<newFolder folderId="…" childName="…"/>` is accepted too). Because this URL
contains no `container` word, the response uses the established element name
`<newFolderId>`.

### Request

`POST https://api.cloudbackend.com/v1/wsd/{domain}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | path | yes | string | Domain name mapped to a group webshare. |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="8589935565" childName="wsg sub container"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Id of the new container |
| `400` | Bad Request — malformed XML, `No folder id given.` or `No ChildFolderName could be found.` |
| `401` | Unauthorized — `You need to provide a valid password to access this webshare-resource` |
| `403` | Forbidden — `This webshare is not set to inbound sharing`, `Invited only` or `The given folder is not part of this webshare` |
| `404` | Not Found — `Domain not found`, or webshare not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newFolderId>`

```xml
<newFolderId>8589935566</newFolderId>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/wsd/{domain}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="8589935565" childName="wsg sub container"/>'
```

---

## PUT /acl <a id="putv1acl"></a>

**Set temporary ACLs**

Grants temporary rights on containers or objects to other identities. This is
the REST form of the SOAP action `setTempACLs`.

The body is an XML document whose root element name is not checked. It holds
one `<tacl>` element per grant:

| Element | Description |
|---|---|
| `<folder id="…"/>` | Container the grant applies to. Required. |
| `<document id="…"/>` or `<document>name</document>` | Optional. Object in that container, by id or by name. Leave out to grant on the container itself. |
| `<user id="…" read="1" write="0" delete="0" changeACL="0"/>` | Identity that receives the rights. Flags left out are `0`. |

This path has no `container` or `object` in its name, so the server does not
translate public names in the body: the container and object elements must be
written `<folder>` and `<document>`, as shown.

The caller must hold `changeACL` on every container or object named (otherwise
`403 Forbidden`, "Folder ACL access denied." or "Document ACL access denied.").
An object given by a name that does not exist gives `404`.

Only PUT is implemented on this path. A GET returns `405`.

### Request

`PUT https://api.cloudbackend.com/v1/acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<setTempACLs>`

```xml
<setTempACLs>
  <tacl>
    <folder id="{container_id}" />
    <document>{object_name}</document>
    <user id="{user_id}" read="1" write="0" delete="0" changeACL="0" />
  </tacl>
</setTempACLs>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Temporary rights saved |
| `400` | Bad Request — a `<tacl>` without `<folder id>` or `<user id>`, or an id of `0`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller lacks `changeACL` on a named container or object. |
| `404` | Not Found — an object name does not exist in the container. |
| `415` | Unsupported Media Type — `Content-Type` is not `application/xml` or `text/xml`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<setTempACLsResponse>`

```xml
<setTempACLsResponse>OK</setTempACLsResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<setTempACLs>
  <tacl>
    <folder id="{container_id}" />
    <document>{object_name}</document>
    <user id="{user_id}" read="1" write="0" delete="0" changeACL="0" />
  </tacl>
</setTempACLs>'
```

---

## GET /containergroupshares <a id="getv1containergroupshares"></a>

**List available group shares**

Lists the containers and objects a group has made available to the caller.

### Request

`GET https://api.cloudbackend.com/v1/containergroupshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `userid` | query | no | integer · default `0` | Restrict the listing to shares available to this user. Defaults to 0. |
| `groupid` | query | no | integer · default `0` | Group whose shares are listed. Defaults to 0. |
| `includecontainers` | query | no | boolean · default `True` | Include shared containers in the result. |
| `includeobjects` | query | no | boolean · default `True` | Include shared objects in the result. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Available group shares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listAvailableGroupSharesResponse>`

```xml
<listAvailableGroupSharesResponse>
  <!-- zero or more shares -->
  <container id="{container_id}" name="{name}" />
  <object id="{object_id}" name="{name}" />
</listAvailableGroupSharesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containergroupshares" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /containershares <a id="getv1containershares"></a>

**List container shares**

Lists the shares that exist on a container.

### Request

`GET https://api.cloudbackend.com/v1/containershares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container whose shares are listed. Defaults to 0. |
| `childcontainerid` | query | no | integer · default `0` | Optional child container to restrict the listing to. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container share list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listContainerSharesResponse>`

```xml
<listContainerSharesResponse>
  <!-- zero or more shares -->
  <share id="{share_id}" user="{user_id}" access="{access}" />
</listContainerSharesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containershares" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /objectshares <a id="getv1objectshares"></a>

**List object shares**

Lists the shares that exist on an object.

### Request

`GET https://api.cloudbackend.com/v1/objectshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. Defaults to 0. |
| `objectid` | query | no | integer · default `0` | Object whose shares are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object share list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listObjectSharesResponse>`

```xml
<listObjectSharesResponse>
  <!-- zero or more shares -->
  <share id="{share_id}" user="{user_id}" access="{access}" />
</listObjectSharesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objectshares" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /sharedobject <a id="getv1sharedobject"></a>

**Load a shared object**

Loads an object that has been shared with the caller, the REST form of the SOAP
action `loadSharedDocument`.

NOTE: this route is not reachable in the current server. The server renames
`object` to `document` in every request path before routing, which turns
`/sharedobject` into `/shareddocument`, and no route exists for that name, so the
call returns `404 Not Found`. Use the SOAP action `loadSharedObject` instead.

### Request

`GET https://api.cloudbackend.com/v1/sharedobject`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the shared object. Defaults to 0. |
| `objectid` | query | no | integer · default `0` | Shared object to load. Defaults to 0. |
| `streamid` | query | no | integer · default `1` | Stream to load. Defaults to 1. |
| `token` | query | no | string | Share token authorising access to the object. Empty when omitted. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Shared object contents |
| `401` | Unauthorized |
| `403` | Access denied. The token does not grant access to the object. |
| `404` | Not Found — returned for every call today (see the note above). |
| `500` | Internal Server Error |

#### `200` · application/xml · `<loadSharedObjectResponse>`

```xml
<loadSharedObjectResponse>
  <!-- object content -->
</loadSharedObjectResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/sharedobject" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /sharedobject <a id="putv1sharedobject"></a>

**Update a shared object**

Applies collaborative-editing transactions to a shared object, the REST form of
the SOAP action `updateSharedDocument`.

| Element | Description |
|---|---|
| `<folder id="…"/>` | Container holding the object. Required. |
| `<document id="…"/>` or `<document>name</document>` | Object, by id or by name. Required. |
| `<stream id="…"/>` | Optional stream, default `1`. |
| `<token>` | Share token. Required ("Failed to get token parameter."). |
| `<transaction id="…">…</transaction>` | Zero or more transactions to apply. If any are sent, the first must carry a non-zero `id` ("Missing transaction ID"). |

The caller needs write access to the object.

NOTE: this route is not reachable in the current server. The server renames
`object` to `document` in every request path before routing, which turns
`/sharedobject` into `/shareddocument`, and no route exists for that name, so the
call returns `404 Not Found`. The request body is also read without the public
renaming, so it must use `<folder>` and `<document>`. Use the SOAP action
`updateSharedObject` instead.

### Request

`PUT https://api.cloudbackend.com/v1/sharedobject`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateSharedObject>`

```xml
<updateSharedObject>
  <folder id="{container_id}" />
  <document id="{object_id}" />
  <stream id="1" />
  <token>{share_token}</token>
  <transaction id="{transaction_id}">{transaction}</transaction>
</updateSharedObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Shared object updated |
| `400` | Bad Request — container, object or token missing, or transactions without an id. |
| `401` | Unauthorized |
| `403` | Forbidden — "Document write access denied." |
| `404` | Not Found — returned for every call today (see the note above). |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateSharedObjectResponse>`

```xml
<updateSharedObjectResponse>OK</updateSharedObjectResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/sharedobject" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateSharedObject>
  <folder id="{container_id}" />
  <document id="{object_id}" />
  <stream id="1" />
  <token>{share_token}</token>
  <transaction id="{transaction_id}">{transaction}</transaction>
</updateSharedObject>'
```

---

## GET /sharedobjectcheck <a id="getv1sharedobjectcheck"></a>

**Check a shared object for changes**

Reports whether a shared object has changed since a given transaction.

### Request

`GET https://api.cloudbackend.com/v1/sharedobjectcheck`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the shared object. Defaults to 0. |
| `objectid` | query | no | integer · default `0` | Shared object to check. Defaults to 0. |
| `streamid` | query | no | integer · default `1` | Stream to check. Defaults to 1. |
| `transactionid` | query | no | integer · default `0` | First transaction to check from. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Change status for the shared object |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<checkSharedObjectResponse>`

```xml
<checkSharedObjectResponse>
  <transaction id="{last_transaction_id}" />
</checkSharedObjectResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/sharedobjectcheck" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /sharedobjectsave <a id="putv1sharedobjectsave"></a>

**Save a shared object**

Writes the current collaborative-editing state of a shared object to its stream
and returns the object's updated Atom entry. This is the REST form of the SOAP
action `saveSharedDocument`. The content itself is not sent; the server saves
the state built up by earlier transactions.

| Element | Description |
|---|---|
| `<folder id="…"/>` | Container holding the object. Required ("Missing folder id."). |
| `<document id="…"/>` or `<document>name</document>` | Object, by id or by name. Required. |
| `<stream id="…"/>` | Optional stream, default `1`. |

The caller needs write access to the object.

NOTE: this route is not reachable in the current server. The server renames
`object` to `document` in every request path before routing, which turns
`/sharedobjectsave` into `/shareddocumentsave`, and no route exists for that name,
so the call returns `404 Not Found`. The request body is also read without the
public renaming, so it must use `<folder>` and `<document>`. Use the SOAP action
`saveSharedObject` instead.

### Request

`PUT https://api.cloudbackend.com/v1/sharedobjectsave`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<saveSharedObject>`

```xml
<saveSharedObject>
  <folder id="{container_id}" />
  <document id="{object_id}" />
  <stream id="1" />
</saveSharedObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Shared object saved; the body is the object's updated Atom entry. |
| `400` | Bad Request — "Missing folder id." or the object is missing. |
| `401` | Unauthorized |
| `403` | Forbidden — "Document write access denied." |
| `404` | Not Found — returned for every call today (see the note above). |
| `500` | Internal Server Error |

#### `200` · application/xml · `<saveSharedObjectResponse>`

```xml
<saveSharedObjectResponse>
  <atom:entry>
    <atom:title>{object_name}</atom:title>
    <atom:updated>{datetime}</atom:updated>
    <!-- remaining entry elements -->
  </atom:entry>
</saveSharedObjectResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/sharedobjectsave" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<saveSharedObject>
  <folder id="{container_id}" />
  <document id="{object_id}" />
  <stream id="1" />
</saveSharedObject>'
```

---

## GET /wsd/{domain}/{path} <a id="getv1wsddomainpath"></a>

**Get an object from a domain webshare**

Fetches a single object from a domain-based webshare and returns its content.

No authentication is required — a domain webshare is public.

`GET /wsd?domain={domain}&path=/{path}` is the equivalent parameter form. Note the
difference in how the path is written: the parameter form takes a leading slash
(`path=/Some file`), the path form does not (`/wsd/example.org/Some%20file`).

`GET /wsd/{domain}` lists what is in the
webshare. Each `<atom:entry>` in that listing carries an
`<atom:link rel="enclosure">` holding the full URL for this operation, so a client
normally follows those links rather than building the path itself.

The response is the object's own content, so its shape and content type vary by
object — the examples below are two real cases, not a fixed schema.

### Request

`GET https://api.cloudbackend.com/v1/wsd/{domain}/{path}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `domain` | path | yes | string | Domain the webshare is published under, e.g. `example.org`. |
| `path` | path | yes | string | Object name within the webshare, URL-encoded — `Some file` is written `Some%20file`. May span several segments for an object nested below the webshare root. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The object's content |
| `404` | No such domain webshare, or no object at that path |
| `500` | Internal Server Error |

#### `200` · application/xml

*A stored message object*

```xml
<m:Message xmlns:m="urn:x-i-o-s:xmime">
  <m:Content-Type>multipart/alternative</m:Content-Type>
  <m:Body>
    <m:Message>
      <m:Content-Type>text/plain</m:Content-Type>
      <m:Body>more testing</m:Body>
    </m:Message>
    <m:Message>
      <m:Content-Type>text/x-html+xml</m:Content-Type>
      <m:Body>
        <html><body><P>more testing</P></body></html>
      </m:Body>
    </m:Message>
  </m:Body>
  <m:Subject>test more</m:Subject>
  <m:X-Priority>3</m:X-Priority>
  <m:From>qwer qwer &lt;c@b.com&gt;</m:From>
  <m:Reply-To>qwer qwer &lt;c@b.com&gt;</m:Reply-To>
  <m:To>jay zimmermann &lt;a@b.com&gt;</m:To>
</m:Message>
```

*An arbitrary XML object*

```xml
<root-el>
  <something>New file</something>
  <more>here</more>
  <eof/>
</root-el>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsd/{domain}/{path}"
```

---
