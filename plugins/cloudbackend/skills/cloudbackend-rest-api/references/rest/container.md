# REST API — Container

43 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /container <a id="postv1container"></a>

**Create a child container**

Creates a new child container under a parent container.

### Request

`POST https://api.cloudbackend.com/v1/container`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer>
  <container id="{parent_container_id}"/>
  <childContainer>{container_name}</childContainer>
</newContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container created successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newContainerResponse>`

```xml
<newContainerResponse>
  <newContainerId>{new_container_id}</newContainerId>
</newContainerResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/container" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer>
  <container id="{parent_container_id}"/>
  <childContainer>{container_name}</childContainer>
</newContainer>'
```

---

## PUT /container <a id="putv1container"></a>

**Modify a container**

Modifies container properties such as name, type, and encryption.

### Request

`PUT https://api.cloudbackend.com/v1/container`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<modifyContainer>`

```xml
<modifyContainer>
  <container id="{container_id}" />
  <childContainer id="{child_container_id}" />
  <name>{new_name}</name>
  <type>{new_type}</type>
  <listview>{new_listview}</listview>
  <xlink>{new_xlink}</xlink>
  <custom>{new_custom}</custom>
  <content>{new_content}</content>
  <encryption>{new_encryption}</encryption>
</modifyContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container modified |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<modifyContainerResponse>`

```xml
<modifyContainerResponse>
  OK
</modifyContainerResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/container" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<modifyContainer>
  <container id="{container_id}" />
  <childContainer id="{child_container_id}" />
  <name>{new_name}</name>
  <type>{new_type}</type>
  <listview>{new_listview}</listview>
  <xlink>{new_xlink}</xlink>
  <custom>{new_custom}</custom>
  <content>{new_content}</content>
  <encryption>{new_encryption}</encryption>
</modifyContainer>'
```

---

## GET /container <a id="getv1container"></a>

**Query a container**

Queries container contents. Returns 403 if access is denied.

### Request

`GET https://api.cloudbackend.com/v1/container`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container to query. |
| `count` | query | no | integer · default `2` | Number of levels of children to return. Defaults to 2. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container contents |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryContainerResponse>`

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
    <os:totalResults>9</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <atom:entry>
      <atom:title>file3_2.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d7@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file1_2.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d6@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file2_2.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d5@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file2_3.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d4@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file3_3.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d3@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file1_3.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d2@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file1_1.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d1@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file2_1.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005d0@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
    <atom:entry>
      <atom:title>file3_1.txt</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="text/xml; charset=ISO-8859-1" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/1" length="4" stream_1_length="4"/>
      <atom:id>mid:1000005cf@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
  </atom:feed>
</queryContainerResponse>
```

#### `403` · text/plain

```text
Access denied.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/container" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /container <a id="deletev1container"></a>

**Delete a child container**

Deletes a child container from a parent container.

### Request

`DELETE https://api.cloudbackend.com/v1/container`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteContainer>`

```xml
<deleteContainer>
  <container id="{container_id}" />
  <childContainer id="{child_container_id}" />
</deleteContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container deleted successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deleteContainerResponse>`

```xml
<deleteContainerResponse>
OK
</deleteContainerResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/container" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteContainer>
  <container id="{container_id}" />
  <childContainer id="{child_container_id}" />
</deleteContainer>'
```

---

## GET /containeracl <a id="getv1containeracl"></a>

**Get container ACL**

Returns the ACL for a container.

### Request

`GET https://api.cloudbackend.com/v1/containeracl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container whose ACL is returned. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container ACL |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getContainerACLResponse>`

```xml
<getContainerACLResponse>
  <acl tag="5rAYck+Fjmv9I0lQrtwii1YM1rw">
    <user id="{user_id}" read="1" write="1" delete="1" changeACL="1"/>
  </acl>
</getContainerACLResponse>
```

*User with full access*

```xml
<getContainerACLResponse>
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  </acl>
</getContainerACLResponse>
```

*User with restricted access*

```xml
<getContainerACLResponse>
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1" />
  </acl>
</getContainerACLResponse>
```

#### `403` · text/plain

```text
Access denied.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containeracl" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /containeracl <a id="putv1containeracl"></a>

**Set container ACL**

Sets the ACL permissions for a container.

### Request

`PUT https://api.cloudbackend.com/v1/containeracl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<setContainerACL>`

```xml
<setContainerACL>
  <container id="{container_id}"/>
  <acl tag="5rAYck+Fjmv9I0lQrtwii1YM1rw">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1"/>
  </acl>
</setContainerACL>
```

*Restrict user access*

```xml
<setContainerACL>
  <container id="{container_id}" />
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1" />
  </acl>
</setContainerACL>
```

*Restore user access*

```xml
<setContainerACL>
  <container id="{container_id}" />
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  </acl>
</setContainerACL>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | ACL updated |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<setContainerACLResponse>`

```xml
<setContainerACLResponse>
  <acl tag="{new_acl_tag}" />
</setContainerACLResponse>
```

#### `403` · text/plain

```text
Access denied.
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/containeracl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<setContainerACL>
  <container id="{container_id}"/>
  <acl tag="5rAYck+Fjmv9I0lQrtwii1YM1rw">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1"/>
  </acl>
</setContainerACL>'
```

---

## POST /objects/{container_id} <a id="postv1objects"></a>

**Upload a file**

Uploads a file (binary) to a container. The file metadata is returned in the response.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `X-Content-Type` | header | no | string | The MIME type of the uploaded file (e.g. image/jpeg, text/xml) |
| `X-File-Name` | header | no | string | The filename for the uploaded file |

#### Body

`application/octet-stream` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | File uploaded successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml

*File upload response*

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>{filename}</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
  <atom:link rel="alternate" type="{mime_type}" href="http://api/v1/objects/{container_id}/{object_id}/1" length="{bytes}" stream_1_length="{bytes}" />
  <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object>{object_id}</dc:object>
</atom:entry>
```

*Product object upload response*

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>account-product-file.cbc</atom:title>
  <atom:published></atom:published>
  <atom:updated></atom:updated>
  <atom:link rel="alternate" type="text/xml" href="" length="0" stream_1_length="0" />
  <atom:id></atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object></dc:object>
  <dc:savedCBEConfig xmlns:dc="http://xcerion.com/directory.xsd" saved="true">
    <product id="" productId="account-product-file" description="Product description" />
  </dc:savedCBEConfig>
</atom:entry>
```

*Plain text file upload response*

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>file.txt</atom:title>
  <atom:published></atom:published>
  <atom:updated></atom:updated>
  <atom:link rel="alternate" type="text/xml" href="" length="0" stream_1_length="0" />
  <atom:id></atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object></dc:object>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "X-Content-Type: {x-content-type}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Content-Type: application/octet-stream; charset=utf-8"
```

---

## POST /container/search <a id="postv1containersearch"></a>

**Search objects in a container**

Searches for objects in a container using a query string.

### Request

`POST https://api.cloudbackend.com/v1/container/search`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<queryContainer>`

```xml
<queryContainer>
  <container id="{container_id}" />
  <query>{search_query}</query>
</queryContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Search results |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryContainerResponse>`

```xml
<queryContainerResponse xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <atom:feed>
    <os:totalResults>{count}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <atom:entry>
      <atom:title>{object_name}</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="{mime_type}" href="" length="{bytes}" stream_1_length="{bytes}" />
      <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
      <dc:s1>{property}</dc:s1>
    </atom:entry>
  </atom:feed>
</queryContainerResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/container/search" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<queryContainer>
  <container id="{container_id}" />
  <query>{search_query}</query>
</queryContainer>'
```

---

## GET /containerxml <a id="getv1containerxml"></a>

**Get container XML**

Returns the container hierarchy as XML.

### Request

`GET https://api.cloudbackend.com/v1/containerxml`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container to return as XML. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container XML hierarchy |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getContainerXMLResponse>`

```xml
<getContainerXMLResponse>
  <fs:container id="{container_id}">
    <fs:container id="{child_id}" name="{name}" />
  </fs:container>
</getContainerXMLResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containerxml" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /containerpath/{container_id}/{path} <a id="getv1containerpath"></a>

**Get container by path**

Resolves a path relative to a container and returns the containers along it as a
nested tree.

`{path}` is a relative path that may span several segments, so it is not a single
URL path segment — `/containerpath/8589935462/Objects/Music` resolves `Music`
inside `Objects` inside container `8589935462`. Leave it empty
(`/containerpath/8589935462/`) to get the container's immediate children.

Each container named along the path appears nested inside its parent, so the
depth of the response follows the depth of the request path.

### Request

`GET https://api.cloudbackend.com/v1/containerpath/{container_id}/{path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container the path is resolved from. |
| `path` | path | yes | string | Relative path below `container_id`, e.g. `Objects/Music`. May be empty. Slashes separate segments and are not escaped. |
| `tags` | query | no | string · one of `true`, `false` | "true" to include container tags in the result. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The containers along the resolved path, nested |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<container>`

```xml
<fs:container id="{container_id}" xmlns:fs="http://xcerion.com/containers.xsd">
  <fs:container id="{child_id}" name="Objects">
    <fs:container id="{grandchild_id}" name="Music" />
  </fs:container>
</fs:container>
```

*Empty path — the container's immediate children*

```xml
<fs:container id="{container_id}" xmlns:fs="http://xcerion.com/containers.xsd">
  <fs:container id="{child_id}" name="{child_name}" />
</fs:container>
```

*Path resolved one level down*

```xml
<fs:container id="{container_id}" xmlns:fs="http://xcerion.com/containers.xsd">
  <fs:container id="{child_id}" name="Objects">
    <fs:container id="{grandchild_id}" name="Music" />
  </fs:container>
</fs:container>
```

*tags=true*

```xml
<fs:container id="{container_id}" xmlns:fs="http://xcerion.com/containers.xsd">
  <fs:container id="{child_id}" name="Playlists">
    <fs:tag type="encrypted" value="0" group="encrypted"/>
    <fs:tag type="music" value="5" group="library" propagated="true"/>
  </fs:container>
</fs:container>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containerpath/{container_id}/{path}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /containers/{container_id} <a id="getv1containers"></a>

**List container contents**

Lists the child containers of a container. The response is an `<fs:container>`
element for the requested container with one `<fs:container>` child per
sub-container (only direct children are listed). Objects are not included; use
`GET /objects/{container_id}` for those.

Each child carries `id` and `name`, and when set `system` (for example `home`,
`trashcan`, `shared`), `hidden="true"`, `link="true"`, `deleted`, `type`,
`listview`, `custom`, `content` and an `xlink:href`.

With `?tags=true` each child also lists its tags as `<fs:tag>` elements with the
attributes `type`, `value`, `group` and, for tags inherited from a parent,
`propagated="true"`.

With `?datasrc=datamodel` the elements use the `db:` prefix and namespace
`https://cloudbackend.com/db.xsd`, and each child also carries `created`.

The caller needs read access to the container (otherwise `403`, "Folder access
denied.").

### Request

`GET https://api.cloudbackend.com/v1/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container whose child containers are listed. |
| `include_deleted` | query | no | string · one of `true`, `false` · default `false` | `true` also lists deleted child containers (they carry a `deleted` attribute). |
| `tags` | query | no | string · one of `true`, `false` · default `false` | `true` adds the `<fs:tag>` elements of each child container. |
| `datasrc` | query | no | string · one of `datamodel` | `datamodel` returns the data-model format (`db:` prefix, `created` attribute). Any other value gives the default `fs:` format. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Child containers |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<container>`

*Default format with ?tags=true*

```xml
<fs:container id='{container_id}' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:fs='http://xcerion.com/folders.xsd'>
  <fs:container id='{child_container_id}' name='Playlists'>
    <fs:tag type='encrypted' value='0' group='encrypted'/>
    <fs:tag type='music' value='5' group='library' propagated='true'/>
  </fs:container>
  <fs:container id='{child_container_id}' name='{name}'/>
</fs:container>
```

*Data-model format (?datasrc=datamodel)*

```xml
<db:container id='{container_id}' xmlns:db='https://cloudbackend.com/db.xsd' xmlns:xlink='http://www.w3.org/1999/xlink'>
  <db:container id='{child_container_id}' name='{name}' created='2025-09-12T08:56:03Z'/>
</db:container>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /containers/{container_id}/{child_container_id} <a id="getv1containerschild"></a>

**Get container info**

Gets container info Returns Req:/v1/containers/8589935462/8589935592 See REST Resource Containers for more info on the container XML format. Returns container hierarchy as XML.

### Request

`GET https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `child_container_id` | path | yes | string |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<container>`

```xml
<fs:container id='8589935462' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:fs='http://xcerion.com/containers.xsd'>
<fs:container id='8589935592' name='NewFolder' />
</fs:container>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /containers/{container_id}/{child_container_id} <a id="postv1containersrestore"></a>

**Restore a deleted container**

Restores a deleted container under a new name.

### Request

`POST https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Parent container. |
| `child_container_id` | path | yes | integer | Deleted container to restore. |

#### Body

`application/xml` (required), root element `<restoreContainer>`

```xml
<restoreContainer newName="{new_name}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `202` | Container restoration accepted |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<restoreContainer newName="{new_name}" />'
```

---

## GET /containers/{container_id}/{child_container_id};acl <a id="getv1containerschildacl"></a>

**Get container ACL**

Returns the access control list (ACL) of a child container, addressed through
its parent.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`,
`delete` and `changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in
`If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged,
and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Parent container. |
| `child_container_id` | path | yes | integer | Child container whose ACL is returned. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found — "Folder not found". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <!-- zero or more -->
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
  <!-- zero or more -->
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
</acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /containers/{container_id}/{child_container_id};acl <a id="putv1containerschildacl"></a>

**Modify container ACL**

Replaces the access control list (ACL) of a child container, addressed through
its parent.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and
the current ETag in the `If-Match` header. Entries left out lose all rights;
flags left out are `0`. At least one entry must have `changeACL="1"`. If the body
carries a `tag` attribute it must equal `If-Match`.

Only identities with `changeACL` in the current ACL, or the owner of the drive
the container is on, may change it (otherwise `403 Forbidden`). If the ACL
changed since the ETag was read, the call fails with `412 Precondition Failed`.
On success the response is `204 No Content` and the `ETag` header carries the tag
of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Parent container. |
| `child_container_id` | path | yes | integer | Child container whose ACL is replaced. |
| `If-Match` | header | yes | string | Current ETag of the ACL, from the `tag` attribute or `ETag` header of GET. |

#### Body

`application/xml` (required), root element `<acl>`

```xml
<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | ACL replaced |
| `400` | Bad Request — `If-Match` header missing ("Missing If-Match Header"), `tag` attribute differs from `If-Match`, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — "Folder not found". |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/containers/{container_id}/{child_container_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /containers/{container_id}/:{name} <a id="getv1containerschildbyname"></a>

**Get child container by name**

Same as `GET /containers/{container_id}/{child_container_id}`, but the child
container is addressed by its name instead of its id: put a colon in front of the
name, for example `/containers/8589935462/:NewFolder`. Percent-encode characters
that are not allowed in a URL path (such as spaces).

Returns the parent container with the matching child container as XML. The caller
needs read access to the parent container (otherwise `403`, "Folder access
denied."). If the parent has no child container with that name, the answer is
`404` ("Folder not found."). No request body.

Note: the ACL of a child container cannot be addressed by name. Use the numeric
id with `/containers/{container_id}/{child_container_id};acl`, or
`/containers/{child_container_id};acl`.

### Request

`GET https://api.cloudbackend.com/v1/containers/{container_id}/:{name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Parent container. |
| `name` | path | yes | string | Name of the child container (after the `:` prefix). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The parent container with the named child container |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found — "Folder not found." |
| `500` | Internal Server Error |

#### `200` · application/xml · `<container>`

```xml
<fs:container id='{container_id}' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:fs='http://xcerion.com/containers.xsd'>
  <fs:container id='{child_container_id}' name='NewFolder' />
</fs:container>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containers/{container_id}/:{name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /containers/{container_id}/:{name} <a id="postv1containerschildbyname"></a>

**Restore a deleted container (not supported by name)**

Restoring a deleted child container (`<restoreContainer newName="…"/>`) requires
the numeric id of the child container; use
`POST /containers/{container_id}/{child_container_id}`. On this by-name URL the
server first checks that the caller has write access to the parent container
(otherwise `403`) and then always answers `400 Bad Request` ("Child folder
reference must be by numeric id for POST.").

### Request

`POST https://api.cloudbackend.com/v1/containers/{container_id}/:{name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Parent container. |
| `name` | path | yes | string | Name of the child container (after the `:` prefix). |

### Responses

| Status | Meaning |
| --- | --- |
| `400` | Bad Request — "Child folder reference must be by numeric id for POST." |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/containers/{container_id}/:{name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /containers/{container_id};acl <a id="getv1containersacl"></a>

**Get container ACL**

Returns the access control list (ACL) of a container.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`,
`delete` and `changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in
`If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged,
and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/containers/{container_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container whose ACL is returned. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found — "Folder not found". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <!-- zero or more -->
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
  <!-- zero or more -->
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
</acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/containers/{container_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /containers/{container_id};acl <a id="putv1containersacl"></a>

**Modify container ACL**

Replaces the access control list (ACL) of a container.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and
the current ETag in the `If-Match` header. Entries left out lose all rights;
flags left out are `0`. At least one entry must have `changeACL="1"`. If the body
carries a `tag` attribute it must equal `If-Match`.

Only identities with `changeACL` in the current ACL, or the owner of the drive
the container is on, may change it (otherwise `403 Forbidden`). If the ACL
changed since the ETag was read, the call fails with `412 Precondition Failed`.
On success the response is `204 No Content` and the `ETag` header carries the tag
of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/containers/{container_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container whose ACL is replaced. |
| `If-Match` | header | yes | string | Current ETag of the ACL, from the `tag` attribute or `ETag` header of GET. |

#### Body

`application/xml` (required), root element `<acl>`

```xml
<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | ACL replaced |
| `400` | Bad Request — `If-Match` header missing ("Missing If-Match Header"), `tag` attribute differs from `If-Match`, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — "Folder not found". |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/containers/{container_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## POST /downloadzip/{user_id} <a id="postv1downloadzip"></a>

**Download multiple containers as zip**

Downloads one or more containers, with everything in them recursively, as a single
zip file. The caller needs read access to every listed container.

The body is a `<cloudDrive>` element with one or more `<container id="…"/>`
children. The zip is named after the first container id (`{container_id}.zip`)
and sent as an attachment (`Content-Disposition`). Zip streaming is done by the
front-end web server; if it is not available the call fails with `500 Zip not
supported!`.

`GET` on this path is not supported (`405`); use
`GET /downloadzip/{user_id}/containers/{container_id}` for a single container.

### Request

`POST https://api.cloudbackend.com/v1/downloadzip/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity; used for the file name when no container yields content. |

#### Body

`application/xml` (required), root element `<cloudDrive>`

```xml
<cloudDrive>
  <container id="8589935569"/>
  <container id="8589935570"/>
</cloudDrive>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Zip archive of the containers |
| `400` | Bad Request — malformed XML, or `Missing items to zip` (no `<container>` given or nothing to zip) |
| `401` | Unauthorized |
| `403` | Forbidden — no read access to a container |
| `404` | Not Found — a container does not exist |
| `422` | Unprocessable Entity — `Missing 'id' attribute on <folder/>` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/downloadzip/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<cloudDrive>
  <container id="8589935569"/>
  <container id="8589935570"/>
</cloudDrive>'
```

---

## GET /downloadzip/{user_id}/containers/{container_id} <a id="getv1downloadzipcontainers"></a>

**Download container as zip**

Downloads a container and everything in it, recursively, as a zip file sent as an
attachment. The caller needs read access to the container.

The file name is `{container_id}.zip`, or the value of `dl` when given (used as
is, so include the `.zip` extension yourself).

### Request

`GET https://api.cloudbackend.com/v1/downloadzip/{user_id}/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `container_id` | path | yes | integer | The container to download. |
| `dl` | query | no | string | File name for the download (`Content-Disposition`), used as given. Defaults to `{container_id}.zip`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Zip archive of the container |
| `401` | Unauthorized |
| `403` | Forbidden — no read access to the container |
| `404` | Not Found — container not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/downloadzip/{user_id}/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /downloadzip/{user_id}/containers/{container_id} <a id="postv1downloadzipcontainers"></a>

**Download multiple containers as zip**

Same handler as `POST /downloadzip/{user_id}`: `{container_id}` is ignored and the
containers listed in the `<cloudDrive>` body are zipped.

### Request

`POST https://api.cloudbackend.com/v1/downloadzip/{user_id}/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |
| `container_id` | path | yes | integer | Ignored by this method. |

#### Body

`application/xml` (required), root element `<cloudDrive>`

```xml
<cloudDrive>
  <container id="8589935569"/>
</cloudDrive>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Zip archive of the containers |
| `400` | Bad Request — `Missing items to zip` |
| `401` | Unauthorized |
| `403` | Forbidden — no read access to a container |
| `422` | Unprocessable Entity — `Missing 'id' attribute on <folder/>` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/downloadzip/{user_id}/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<cloudDrive>
  <container id="8589935569"/>
</cloudDrive>'
```

---

## GET /downloadzip/{user_id}/favorites/{favorite_id}/containers/{container_id} <a id="getv1downloadzipfavoritescontainers"></a>

**Download favorite container as zip**

Downloads the favorite container and anything in it, recursively, as a zip file. The returned filename can be specified with the dl query/form parameter. The default name is the favorite name.

### Request

`GET https://api.cloudbackend.com/v1/downloadzip/{user_id}/favorites/{favorite_id}/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | integer |  |
| `container_id` | path | yes | integer |  |
| `dl` | query | no | string | filename w/o .zip |

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
curl -X GET "https://api.cloudbackend.com/v1/downloadzip/{user_id}/favorites/{favorite_id}/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id} <a id="getv1downloadzipwebsharescontainers"></a>

**Download webshare container as zip**

Downloads a container of a webshare, and everything in it recursively, as a zip
file. No CloudBackend PaaS login is needed. When the webshare has a password, prove
it with HTTP Digest authentication (any username) or the `ha1` parameter;
otherwise `401`.

The file name is the webshare name plus `.zip`, or the value of `dl` when given
(used as is).

### Request

`GET https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare. |
| `webshare_name` | path | yes | string | Name of the webshare. |
| `container_id` | path | yes | integer | Container inside the webshare to download. |
| `dl` | query | no | string | File name for the download (`Content-Disposition`), used as given. Defaults to `{webshare_name}.zip`. |
| `ha1` | query | no | string | Password hash of the webshare, as an alternative to Digest authentication. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Zip archive of the webshare container |
| `401` | Unauthorized — `You need to provide a valid password to access this folder-resource` |
| `404` | Not Found — webshare not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id}"
```

---

## POST /downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id} <a id="postv1downloadzipwebsharescontainers"></a>

**Download webshare container as zip**

Same as `GET` on this path, but `dl` and `ha1` may also be sent as form fields in
an `application/x-www-form-urlencoded` body (query parameters take precedence).
This lets a browser form download a password-protected webshare container without
putting the hash in the URL.

### Request

`POST https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare. |
| `webshare_name` | path | yes | string | Name of the webshare. |
| `container_id` | path | yes | integer | Container inside the webshare to download. |
| `dl` | query | no | string | File name for the download, used as given. Defaults to `{webshare_name}.zip`. |
| `ha1` | query | no | string | Password hash of the webshare. |

#### Body

`application/x-www-form-urlencoded` (optional)

```text
dl=holiday-photos.zip&ha1=5f4dcc3b5aa765d61d8327deb882cf99
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Zip archive of the webshare container |
| `401` | Unauthorized — `You need to provide a valid password to access this folder-resource` |
| `404` | Not Found — webshare not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/downloadzip/{user_id}/webshares/{webshare_name}/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
  -d 'dl=holiday-photos.zip&ha1=5f4dcc3b5aa765d61d8327deb882cf99'
```

---

## GET /links/{user_id}/{link_id} <a id="getv1links"></a>

**Download a linked object**

Downloads the content (default stream) of the object a user link points to. User
links are created with `POST /userlink`; this URL is the shareable part of such a
link and needs no CloudBackend PaaS login.

The link only works while it has not expired and still has requests left
(`maxRequests` > 0); every successful download decrements the remaining number of
requests. Otherwise, or when the object has been deleted, `404` is returned.

If the link was created with a username and password, the request must carry
HTTP Digest credentials for them (`Authorization: Digest …`); missing or wrong
credentials give `401`.

The response body is the raw file content with the object's content type, and an
`ETag` header.

### Request

`GET https://api.cloudbackend.com/v1/links/{user_id}/{link_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity that created the link. |
| `link_id` | path | yes | integer | Id of the user link (the `id` attribute of `<userLink>` returned by `POST /userlink`). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The object's content |
| `401` | Unauthorized — the link is password-protected and Digest credentials are missing or wrong |
| `404` | Not Found — no such link, link expired or used up, or the object was deleted |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/links/{user_id}/{link_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /path/{container_id} <a id="getv1path"></a>

**Get container path**

Gets the path for a container id Returns Req: /v1/path/8589935469

### Request

`GET https://api.cloudbackend.com/v1/path/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<container>`

```xml
<fs:container xmlns:fs="http://xcerion.com/containers.xsd" name='Documents' id="8589935468" path='/Documents/Music'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/path/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /search/{container_id} <a id="getv1search"></a>

**Search containers and objects**

Searches a container and everything below it and returns the matches as an Atom
feed. The call has two modes.

**Title search** (no `tag` parameter). `query` is matched against titles:

- A plain term, for example `?query=face`, matches containers and objects whose
  title starts with it (a `*` in the term is ignored).
- Space-separated `field:value` pairs search fields of the object entries, for
  example `?query=title:face type:image/jpeg`. `title:` sets the title term,
  `type:` filters by MIME type; any other field (for example `document:`) is
  matched against the entry field of that name.

Matching containers come first, as entries with `<atom:id>urn:x-i-o-s:folder:…`,
`<dc:folder>` (parent) and `<dc:childFolder>`. They are left out when a `type:`
filter is given that does not contain `folder`. Matching objects follow as their
regular Atom entries.

**Tag search** (`tag` given). Lists objects by their indexed fields instead of by
title: `tag` holds one or more `field:value` pairs separated by `|`, for example
`?tag=type:image/*` or `?tag=artist:Abba|album:Gold`. A value matches entries
whose field starts with it. A bare word without `:` matches any entry that has
that field. The containers searched are paged with `folderoffset` and
`foldercount`, and the feed carries an extra `<os:folder>` element with
`<os:foldersUsed>` and the container paging.

This path has no `container` or `object` in its name, so the response keeps the
internal names (`dc:folder`, `dc:document`, `urn:x-i-o-s:folder:`).

The caller needs read access to the container (otherwise `403`, "Folder access
denied.").

### Request

`GET https://api.cloudbackend.com/v1/search/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Root container of the search. |
| `query` | query | no | string | Title search term, or space-separated `field:value` pairs (see above). Ignored when `tag` is given. |
| `tag` | query | no | string | Switches to tag search; `\|`-separated `field:value` pairs (see above). |
| `offset` | query | no | integer · default `0` | Index of the first result to return. |
| `count` | query | no | integer · default `100` | Maximum number of results to return. |
| `order` | query | no | string · one of `title`, `size`, `created`, `updated` · default `title` | Sort field for objects. Unknown values sort by `title`. |
| `asc` | query | no | string · one of `true`, `false` · default `true` | `false` sorts descending; any other value sorts ascending. |
| `include_deleted` | query | no | string · one of `true`, `false` · default `false` | `true` also returns deleted containers and objects (containers then carry `<dc:deleted>`). |
| `folderoffset` | query | no | integer · default `0` | Tag search only. Index of the first container to search. |
| `foldercount` | query | no | integer · default `100` | Tag search only. Maximum number of containers to search. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Search results as an Atom feed |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom='http://www.w3.org/2005/Atom' xmlns:os='http://a9.com/-/spec/opensearch/1.1/' xmlns:dc='http://xcerion.com/directory.xsd'>
  <os:totalResults>2</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:entry>
    <atom:title>faces</atom:title>
    <atom:published>2016-02-19T09:55:30Z</atom:published>
    <atom:updated>2016-02-19T09:55:30Z</atom:updated>
    <atom:id>urn:x-i-o-s:folder:{child_container_id}</atom:id>
    <dc:folder>{container_id}</dc:folder>
    <dc:childFolder>{child_container_id}</dc:childFolder>
  </atom:entry>
  <atom:entry>
    <atom:title>a faces.jpg</atom:title>
    <atom:published>2016-02-08T10:16:32Z</atom:published>
    <atom:updated>2016-02-08T10:16:32Z</atom:updated>
    <atom:link rel="alternate" type="image/jpeg" href="https://api.cloudbackend.com/v1/documents/{container_id}/{object_id}/1" length="58537"/>
    <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
    <dc:folder>{container_id}</dc:folder>
    <dc:document>{object_id}</dc:document>
  </atom:entry>
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/search/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /tags/{container_id} <a id="getv1tags"></a>

**Search files by tag**

Searches files for a tag and group them by tag. The count attribute says in how many files the tag value was found / how many files are tagged that way. See search endpoint for tag filtering. More on atom entries The<atom:title/>shows unique title for the group. URL:/v1/tags/<root_container_id>?tag=<tag>[|<tag2>] Example, artist starting with D:/v1/tags/8589934672?tag=artist:D* While several albumns by Depeche Mode were found, most of the tags has been removed.For Dire Straits only one album was found, thus all that information is also available.If only one song would have been found, all information from the tag would be available. Example, artist starting with D from the eighties, gets grouped in artist, album and year:/v1/tags/8589934672?tag=artist:D*|album:*|year:198 Only one song was found from the MUSIC FOR MASSES album (as shown in the<ni:count/>element), thus all information is available.

### Request

`GET https://api.cloudbackend.com/v1/tags/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `tag` | query | no | string | tag2:value2 |

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
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
<os:totalResults>4</os:totalResults>
<os:startIndex>0</os:startIndex>
<os:itemsPerPage>100</os:itemsPerPage>
<atom:entry>
<dc:container>8589934679</dc:container>
<dc:album>101 (Disc B)</dc:album>
<dc:artist>Depeche Mode</dc:artist>
<dc:year>1989</dc:year>
<dc:composer>Martin Gore</dc:composer>
<dc:genre>Other</dc:genre>
<dc:rate>0</dc:rate>
<atom:title>Depeche Mode - 101 (Disc B) - 1989</atom:title>
<atom:id>urn:x-i-o-s:dc:artist_dc:album_dc:year:Depeche Mode - 101 (Disc B) - 1989</atom:id>
<ni:count>2</ni:count>
</atom:entry>
<atom:entry>
<dc:container>8589934679</dc:container>
<dc:album>Alchemy: Dire Straits Live Dis</dc:album>
<dc:album>Alchemy: Dire Straits Live Disc 1</dc:album>
<dc:artist>Dire Straits</dc:artist>
<dc:year>1984</dc:year>
<dc:composer>Mark Knopfler</dc:composer>
<dc:genre>Rock</dc:genre>
<dc:rate>0</dc:rate>
<atom:title>Dire Straits - Alchemy: Dire Straits Live Dis - 1984</atom:title>
<atom:id>urn:x-i-o-s:dc:artist_dc:album_dc:year:Dire Straits - Alchemy: Dire Straits Live Dis - 1984</atom:id>
<ni:count>2</ni:count>
</atom:entry>
<atom:entry>
<dc:container>8589934679</dc:container>
<dc:album>A Broken Frame</dc:album>
<dc:artist>Depeche Mode</dc:artist>
<dc:year>1982</dc:year>
<dc:composer>Martin L. Gore</dc:composer>
<dc:genre>Techno</dc:genre>
<dc:rate>0</dc:rate>
<atom:title>Depeche Mode - A Broken Frame - 1982</atom:title>
<atom:id>urn:x-i-o-s:dc:artist_dc:album_dc:year:Depeche Mode - A Broken Frame - 1982</atom:id>
<ni:count>2</ni:count>
</atom:entry>
<atom:entry>
<atom:title>DEPECHE MODE - MUSIC FOR THE MASSES - 1987</atom:title>
<atom:published>2018-05-29T15:24:27Z</atom:published>
<atom:updated>2018-05-29T15:22:24Z</atom:updated>
<atom:id>urn:x-i-o-s:dc:artist_dc:album_dc:year:DEPECHE MODE - MUSIC FOR THE MASSES - 1987</atom:id>
<dc:container>8589934679</dc:container>
<dc:object>4294968501</dc:object>
<dc:client_modified>2018-05-29T15:22:24Z</dc:client_modified>
<dc:album>MUSIC FOR THE MASSES</dc:album>
<dc:artist>DEPECHE MODE</dc:artist>
<dc:artist>Depeche Mode</dc:artist>
<dc:name>To have and to hold</dc:name>
<dc:year>1987</dc:year>
<dc:composer>Martin Gore</dc:composer>
<dc:genre>Other</dc:genre>
<dc:track>8</dc:track>
<dc:rate>0</dc:rate>
<ni:count>1</ni:count>
</atom:entry>
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/tags/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/favorites/{favorite_id}/webshare/{webshare_path} <a id="getv1usersfavoriteswebsharepath"></a>

**Browse favorite webshare**

Optional query params that are used if it's a container. If it's a file, only "s" is used. If it's a container, this API will list the container, else this API will download the file.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare/{webshare_path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `favorite_id` | path | yes | integer |  |
| `webshare_path` | path | yes | string |  |
| `order` | query | no | string | title or size or created or updated |
| `desc` | query | no | string | true or false |
| `deleted` | query | no | string | true or false |
| `query` | query | no | string | any string |
| `offset` | query | no | string | integer |
| `count` | query | no | string | integer: 0-1000 |
| `s` | query | no | string | stream id |
| `download` | query | no | string | 0 or 1 |

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
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/webshare/{webshare_path}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites/{favorite_id}/{container_id} <a id="postv1usersfavoritecontainer"></a>

**Upload file to favorite**

Uploads a file into a container of a webshare favorite (a webshare of another
identity that `{user_id}` follows). The caller must be `{user_id}`, and the
favorite's webshare must allow inbound uploads (access `create`, `createonly` or
`update`); otherwise `403`.

Send the file as `multipart/form-data` with a `Content-Length` header. The file
name is taken from the multipart part, or from the `X-File-Name` header. Optional
`Created-Date` / `Modified-Date` headers (HTTP date) and `Created-TimeZone` /
`Modified-TimeZone` set the object's client timestamps.

The `Relative-Path` header (or the `relative_path` query parameter) only affects
the `href` of the returned entry: it is appended to the favorite's `webshare/`
URL.

Example: `curl -u user:pass https://api.cloudbackend.com/v1/users/12345678/favorites/12/89101112 -F "file=@file.json;type=application/json"`

The response is the Atom entry of the new object.

Because this URL contains no `container`/`object` word, the response uses the
established element names `<dc:folder>` and `<dc:document>` for the container and
object ids.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite (see `GET /users/{user_id}/favorites`). |
| `container_id` | path | yes | integer | Container inside the favorite's webshare that receives the file. |
| `relative_path` | query | no | string | Path below the favorite's webshare root, used only to build the `href` of the returned entry. Ignored when the `Relative-Path` header is sent. |
| `Relative-Path` | header | no | string | Same as the `relative_path` query parameter; takes precedence over it. |
| `X-File-Name` | header | no | string | File name to use instead of the name in the multipart part. |
| `Created-Date` | header | no | string | Client creation time of the file, as an HTTP date. Invalid values are ignored. |
| `Modified-Date` | header | no | string | Client modification time of the file, as an HTTP date. Invalid values are ignored. |
| `Created-TimeZone` | header | no | string | Time zone of `Created-Date`, when the date itself carries none. |
| `Modified-TimeZone` | header | no | string | Time zone of `Modified-Date`, when the date itself carries none. |

#### Body

`multipart/form-data` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the uploaded object |
| `400` | Bad Request — e.g. `Missing boundary in Content-Type.` |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, webshare password no longer valid, or `This webshare is not set to inbound sharing` |
| `404` | Not Found — `WebShare favorite not found`, or the container is not part of the favorite |
| `411` | Length Required — `Missing Content-Length header.` |
| `413` | Payload Too Large — `Request Entity Too Large.` |
| `415` | Unsupported Media Type — body is not `multipart/form-data` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>new file1.txt</atom:title>
  <atom:published>2026-06-29T13:24:26Z</atom:published>
  <atom:updated>2026-06-29T13:24:26Z</atom:updated>
  <atom:link rel="enclosure" type="text/plain; charset=ISO-8859-1" href="{object_url}" length="31" stream_1_length="31"/>
  <atom:id>mid:200000576@xios.xcerion.com</atom:id>
  <dc:folder>8589935569</dc:folder>
  <dc:document>8589935990</dc:document>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Relative-Path: {relative-path}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Created-Date: {created-date}" \
  -H "Modified-Date: {modified-date}" \
  -H "Created-TimeZone: {created-timezone}" \
  -H "Modified-TimeZone: {modified-timezone}" \
  -H "Content-Type: multipart/form-data; charset=utf-8"
```

---

## DELETE /users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id} <a id="deletev1usersfavoritescontainers"></a>

**Delete container in favorite**

Deletes (moves to the trash) a child container inside a webshare favorite. The
caller must be `{user_id}`, and the favorite's webshare must grant `update`
access; otherwise `403`. A deleted container can be brought back with `POST` on
the same URL.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Parent container inside the favorite's webshare. |
| `child_container_id` | path | yes | integer | The container to delete. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Container deleted |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, or `This webshareFavorite is not set to update sharing` |
| `404` | Not Found — `WebShare favorite not found` or `The given folder is not part of this webshareFavorite` |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id} <a id="postv1usersfavoritescontainers"></a>

**Restore container in favorite**

Restores a deleted child container inside a webshare favorite (see `DELETE` on
the same URL) under the name given in `newName`. The caller must be `{user_id}`,
and the favorite's webshare must grant `update` access.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Parent container inside the favorite's webshare. |
| `child_container_id` | path | yes | integer | The deleted container to restore. |

#### Body

`application/xml` (required), root element `<restoreContainer>`

```xml
<restoreContainer newName="Restored folder name 1"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `202` | Container restored (empty body) |
| `400` | Bad Request — malformed XML |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, or the favorite does not grant `update` access |
| `404` | Not Found — favorite or container not found |
| `422` | Unprocessable Entity — `Missing 'newName' attribute` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<restoreContainer newName="Restored folder name 1"/>'
```

---

## PUT /users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id} <a id="putv1usersfavoritescontainers"></a>

**Rename container in favorite**

Renames a child container inside a webshare favorite. The caller must be
`{user_id}`, and the favorite's webshare must grant `update` access.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Parent container inside the favorite's webshare. |
| `child_container_id` | path | yes | integer | The container to rename. |

#### Body

`application/xml` (required), root element `<renameContainer>`

```xml
<renameContainer newName="Renamed Folder 1"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Container renamed |
| `400` | Bad Request — malformed XML, `Missing newName entry` or `Must have a name` |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, or `This webshareFavorite is not set to update sharing` |
| `404` | Not Found — favorite or container not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/containers/{child_container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameContainer newName="Renamed Folder 1"/>'
```

---

## GET /users/{user_id}/libraries/{library_id}/containers <a id="getv1userslibrariescontainers"></a>

**List library containers**

Lists the containers that have been added to a media library, searched within the
caller's home drive.

The response is one `<container id=…/>` element per line, without a root element.
Note that the handler writes the id value without quotes, so the body is not
well-formed XML; parse the ids textually.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity that owns the library. |
| `library_id` | path | yes | integer | Id of the library (`<libraryId>`). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Containers in the library (zero or more lines) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<container id=8589935569/>
<container id=8589935570/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/libraries/{library_id}/containers <a id="postv1userslibrariescontainers"></a>

**Add containers to library**

Adds one or more containers to a media library. The library must belong to
`{user_id}` (`403` otherwise) and every container must exist. The containers are
tagged with the library so their content is indexed for the library's media type.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity that owns the library. |
| `library_id` | path | yes | integer | Id of the library (`<libraryId>`). |

#### Body

`application/xml` (required), root element `<addContainerToLibrary>`

```xml
<addContainerToLibrary>
  <container id="8589935569"/>
  <container id="8589935570"/>
</addContainerToLibrary>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Containers added |
| `400` | Bad Request — malformed XML |
| `401` | Unauthorized |
| `403` | Forbidden — `User is not owner of the library.`, or no right to tag the container |
| `404` | Not Found — `Can't find library.` or `Folder does not exist.` |
| `422` | Unprocessable Entity — `<folder/> resources missing` (no `<container>` child) or `Missing 'id' attribute on <folder/> resource` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<addContainerToLibrary>
  <container id="8589935569"/>
  <container id="8589935570"/>
</addContainerToLibrary>'
```

---

## DELETE /users/{user_id}/libraries/{library_id}/containers/{container_id} <a id="deletev1userslibrariescontainers"></a>

**Remove container from library**

Removes container from library

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `library_id` | path | yes | integer |  |
| `container_id` | path | yes | integer |  |

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
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/libraries/{library_id}/containers/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/webshares/{webshare_id}/{container_id} <a id="postv1userswebsharescontainer"></a>

**Upload file to webshare**

Uploads a file into a container of an inbound webshare (a webshare whose access is
`create`, `createonly` or `update`). No CloudBackend PaaS login is needed; instead
the request must prove the webshare password in one of these ways:

- HTTP Digest authentication with any username (e.g. `anonymous`) and the
  webshare password,
- HTTP Basic authentication with any username and the webshare password, or
- the `ha1` query parameter.

A webshare without a password cannot receive inbound uploads (`401`).

Send the file as `multipart/form-data` with a `Content-Length` header. The file
name is taken from the multipart part, or from the `X-File-Name` header. Optional
`Created-Date` / `Modified-Date` (HTTP date) and `Created-TimeZone` /
`Modified-TimeZone` headers set the object's client timestamps.

Example: `curl --digest -u anonymous:password https://api.cloudbackend.com/v1/users/12345678/webshares/12/89101112 -F "file=@file2.json;type=application/json"`

The response is the Atom entry of the new object.

Because this URL contains no `container`/`object` word, the response uses the
established element names `<dc:folder>` and `<dc:document>` for the container and
object ids.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/{container_id}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Owner of the webshare. |
| `webshare_id` | path | yes | integer | Id of the webshare. |
| `container_id` | path | yes | integer | Container inside the webshare that receives the file. |
| `ha1` | query | no | string | Password hash of the webshare, as an alternative to Digest/Basic authentication. |
| `datasrc` | query | no | string · one of `datamodel` | Set to `datamodel` to upload in data-model mode; any other value is ignored. |
| `X-File-Name` | header | no | string | File name to use instead of the name in the multipart part. |
| `Created-Date` | header | no | string | Client creation time of the file, as an HTTP date. Invalid values are ignored. |
| `Modified-Date` | header | no | string | Client modification time of the file, as an HTTP date. Invalid values are ignored. |
| `Created-TimeZone` | header | no | string | Time zone of `Created-Date`, when the date itself carries none. |
| `Modified-TimeZone` | header | no | string | Time zone of `Modified-Date`, when the date itself carries none. |

#### Body

`multipart/form-data` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the uploaded object |
| `400` | Bad Request — e.g. `Missing boundary in Content-Type.` |
| `401` | Unauthorized — missing or wrong webshare password, or `The webshare requires a password for inbound!` |
| `403` | Forbidden — `This webshare is not set to inbound sharing`, `Invited only`, `The given folder is not part of this webshare` or `Drive is write-locked.` |
| `404` | Not Found — webshare not found, or `Folder not found.` |
| `411` | Length Required — `Missing Content-Length header.` |
| `413` | Payload Too Large — `Request Entity Too Large.` |
| `415` | Unsupported Media Type — body is not `multipart/form-data` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>newfile1.txt</atom:title>
  <atom:published>2026-06-29T13:24:26Z</atom:published>
  <atom:updated>2026-06-29T13:24:26Z</atom:updated>
  <atom:link rel="alternate" type="text/plain; charset=ISO-8859-1" href="{object_url}" length="18" stream_1_length="18"/>
  <atom:id>mid:200000576@xios.xcerion.com</atom:id>
  <dc:folder>8589935569</dc:folder>
  <dc:document>8589935990</dc:document>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/webshares/{webshare_id}/{container_id}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Created-Date: {created-date}" \
  -H "Modified-Date: {modified-date}" \
  -H "Created-TimeZone: {created-timezone}" \
  -H "Modified-TimeZone: {modified-timezone}" \
  -H "Content-Type: multipart/form-data; charset=utf-8"
```

---

## PUT /movecontainer <a id="putv1movecontainer"></a>

**Move a container**

Moves a container from one parent to another, optionally renaming it.

### Request

`PUT https://api.cloudbackend.com/v1/movecontainer`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<moveContainer>`

```xml
<moveFolder>
  <srcFolder id="{source_parent_container_id}" />
  <srcChildFolder id="{container_id}" />
  <dstFolder id="{destination_parent_container_id}" />
  <name>{new_name}</name>
</moveFolder>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container moved |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<moveContainerResponse>`

```xml
<moveContainerResponse>OK</moveContainerResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/movecontainer" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<moveFolder>
  <srcFolder id="{source_parent_container_id}" />
  <srcChildFolder id="{container_id}" />
  <dstFolder id="{destination_parent_container_id}" />
  <name>{new_name}</name>
</moveFolder>'
```

---

## POST /container/{container_id} <a id="postv1containerchild"></a>

**Create child container**

Creates a new child container inside a parent container.

### Request

`POST https://api.cloudbackend.com/v1/container/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer>
  <container id="{container_id}"/>
  <childContainer>{child_name}</childContainer>
</newContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Child container created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newContainerResponse>`

```xml
<newContainerResponse>
  <newContainerId>{container_id}</newContainerId>
</newContainerResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/container/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer>
  <container id="{container_id}"/>
  <childContainer>{child_name}</childContainer>
</newContainer>'
```

---

## POST /containersplit <a id="postv1containersplit"></a>

**Split a container into its own root**

Makes a child container the root of its own container tree, so that it gets its
own ACL root. This is the REST form of the SOAP action `splitFolderXML`.

| Element | Description |
|---|---|
| `<folder id="…"/>` | Parent container. Required. |
| `<childFolder id="…"/>` | Child container to split off. Required. |
| `<xlink>` | Optional link stored on the new root. |

The caller needs write access to both containers. Splitting a child that is
already a root succeeds without change.

NOTE: this route is not reachable in the current server. The server renames
`container` to `folder` in every request path before routing, which turns
`/containersplit` into `/foldersplit`, and no route exists for that name, so the
call returns `404 Not Found`. The request body is also read without the public
renaming, so it must use `<folder>` and `<childFolder>`. Use the SOAP action
`splitFolderXML` (or `splitContainerXML`) instead.

### Request

`POST https://api.cloudbackend.com/v1/containersplit`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<splitContainerXML>`

```xml
<splitContainerXML>
  <folder id="{container_id}" />
  <childFolder id="{child_container_id}" />
</splitContainerXML>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Container split |
| `400` | Bad Request — `<folder id>` or `<childFolder id>` missing or `0`. |
| `401` | Unauthorized |
| `403` | Forbidden — no write access to one of the containers. |
| `404` | Not Found — returned for every call today (see the note above); otherwise the child container does not exist or is not a child of the parent. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<splitContainerXMLResponse>`

```xml
<splitContainerXMLResponse>OK</splitContainerXMLResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/containersplit" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<splitContainerXML>
  <folder id="{container_id}" />
  <childFolder id="{child_container_id}" />
</splitContainerXML>'
```

---

## POST /query <a id="postv1query"></a>

**Query containers**

Queries one or more containers and returns matching containers and objects as an
Atom feed. Short form of `/querycontainer`; both resolve to the same handler.

#### Request elements

| Element | Description |
|---|---|
| `<container id="…" count="…"/>` | Container to search. Repeat it to search several in one call. The optional `count` attribute limits results. |
| `<query>` | Search expression — see the grammar below. Omit it to list the container. |
| `<order>` | Field to sort by, e.g. `title` or `updated`. |
| `<ascending>` | `true` or `false`. |
| `<numeric>` | `true` to treat `groupby` values as numbers rather than strings. |

#### Query expression grammar

Terms are matched against the object title and its indexed metadata fields.

| Form | Meaning | Example |
|---|---|---|
| `a` | Optional term — an object matching any bare term is returned | `a b` returns objects matching `a` or `b` |
| `+a` | Required — every result must match | `+a b` returns only objects matching `a`, ranked by whether they also match `b` |
| `-a` | Excluded — no result may match | `-a b c` returns objects matching `b` or `c` but not `a` |
| `a*` | Prefix wildcard | `a*` matches `a`, `abc` |
| `"a b"` | Phrase — the words must appear together | `+"a b"` |
| `field<value`, `field>value` | Numeric comparison against an indexed field | `s1<100`, `+s1>1 +s1<3` |

The `+`, `-` and bare prefixes combine with comparisons the same way they combine
with terms, so `+a b -s1<100` means "must match `a`, must not have `s1` below 100,
prefer objects also matching `b`".

#### Pipeline operators

Append `| operator` to post-process the result set:

| Operator | Effect |
|---|---|
| `count` | Returns `<os:totalResults>` only, with no `<atom:entry>` elements |
| `groupby <field>` | Groups results into `<dc:bucket>` elements keyed on the field |

Operators can be chained: `a b \| groupby s1 \| count` returns one empty
`<dc:bucket>` per distinct value, each carrying a `count` attribute.

### Request

`POST https://api.cloudbackend.com/v1/query`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<queryContainer>`

```xml
<queryContainer>
  <container id="{container_id}" count="2" />
  <query>'{search_term}'</query>
</queryContainer>
```

*Search several containers, sorted by title*

```xml
<queryContainer>
  <container id="{container_id_1}" />
  <container id="{container_id_2}" />
  <order>title</order>
  <ascending>true</ascending>
</queryContainer>
```

*Search a single container by filename*

```xml
<queryContainer>
  <container id="{container_id}" count="2" />
  <query>'{filename}'</query>
</queryContainer>
```

*Require one term, exclude another*

```xml
<queryContainer>
  <container id="{container_id}" />
  <query>+a -b c</query>
</queryContainer>
```

*Bound an indexed numeric field on both sides*

```xml
<queryContainer>
  <container id="{container_id}" />
  <query>+s1&gt;1 +s1&lt;3</query>
</queryContainer>
```

*Return the match count without the entries*

```xml
<queryContainer>
  <container id="{container_id}" />
  <query>a | count</query>
</queryContainer>
```

*Group by an indexed field and count each bucket*

```xml
<queryContainer>
  <container id="{container_id}" />
  <query>a b | groupby s1 | count</query>
  <numeric>true</numeric>
</queryContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Query results as an Atom feed. The shape of the feed body depends on the pipeline operators used in `<query>`. |
| `400` | Bad Request. The request body root element is not a recognised operation. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryContainerResponse>`

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>{total}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <atom:entry>
      <atom:title>{object_name}</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="{mime_type}" href="{object_url}" length="{bytes}" stream_1_length="{bytes}" />
      <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
  </atom:feed>
</queryContainerResponse>
```

*Default — one atom:entry per match*

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>{total}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <atom:entry>
      <atom:title>{object_name}</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="{mime_type}" href="{object_url}" length="{bytes}" stream_1_length="{bytes}" />
      <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
      <dc:container>{container_id}</dc:container>
      <dc:object>{object_id}</dc:object>
    </atom:entry>
  </atom:feed>
</queryContainerResponse>
```

*`| count` — totals only, no entries*

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>{total}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
  </atom:feed>
</queryContainerResponse>
```

*`| groupby s1` — entries nested in buckets*

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>{total}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <dc:bucket groupByField="s1" groupByValue="1" count="1">
      <atom:entry>
        <atom:title>{object_name}</atom:title>
        <dc:container>{container_id}</dc:container>
        <dc:object>{object_id}</dc:object>
        <dc:s1>1</dc:s1>
      </atom:entry>
    </dc:bucket>
  </atom:feed>
</queryContainerResponse>
```

*`| groupby s1 | count` — empty buckets carrying counts*

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>4</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <dc:bucket groupByField="s1" groupByValue="1" count="1" />
    <dc:bucket groupByField="s1" groupByValue="2" count="1" />
    <dc:bucket groupByField="s1" groupByValue="3" count="1" />
    <dc:bucket groupByField="s1" groupByValue="100" count="2" />
  </atom:feed>
</queryContainerResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/query" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<queryContainer>
  <container id="{container_id}" count="2" />
  <query>'\''{search_term}'\''</query>
</queryContainer>'
```

---

## POST /querycontainer <a id="postv1querycontainer"></a>

**Query containers**

Queries one or more containers and returns matching containers and objects as an
Atom feed. Identical to `/query`; both resolve to the same handler.

See `POST /query` for the full request
element list, the query expression grammar, and the pipeline operators.

### Request

`POST https://api.cloudbackend.com/v1/querycontainer`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<queryContainer>`

```xml
<queryContainer>
  <container id="{container_id}" count="2" />
  <query>'{search_term}'</query>
</queryContainer>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Query results as an Atom feed |
| `400` | Bad Request. The request body root element is not a recognised operation. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryContainerResponse>`

```xml
<queryContainerResponse>
  <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
    <os:totalResults>{total}</os:totalResults>
    <os:startIndex>0</os:startIndex>
    <os:itemsPerPage>100</os:itemsPerPage>
    <!-- atom:entry elements -->
  </atom:feed>
</queryContainerResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/querycontainer" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<queryContainer>
  <container id="{container_id}" count="2" />
  <query>'\''{search_term}'\''</query>
</queryContainer>'
```

---
