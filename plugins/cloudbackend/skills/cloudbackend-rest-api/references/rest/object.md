# REST API — Object

51 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /object <a id="getv1object"></a>

**Load an object**

Loads (retrieves) an object from a container by name. Returns the object content.

### Request

`GET https://api.cloudbackend.com/v1/object`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. |
| `objectname` | query | no | string | Name of the object to load. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object content |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<loadObjectResponse>`

```xml
<loadObjectResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <db:content type="{mime_type}">
      <!-- object content -->
    </db:content>
  </db:object>
</loadObjectResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/object" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /object <a id="postv1object"></a>

**Create an object or object**

Creates a new object or object in a container. Supports createObject (with data model XML) and createObject (with Atom entry) payloads.

### Request

`POST https://api.cloudbackend.com/v1/object`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required)

```xml
<createObject xmlns:atom="http://www.w3.org/2005/Atom">
  <container id="{container_id}"/>
  <overwrite>false</overwrite>
  <atom:entry>
    <atom:content type="application/json">
      <root>
        <tag1 attr="a"/>
        <tag2>b</tag2>
      </root>
    </atom:content>
    <atom:title>json</atom:title>
  </atom:entry>
</createObject>
```

*Create object with data model*

```xml
<createObject>
  <overwrite>1</overwrite>
  <extraction>true</extraction>
  <datasrc>dataModel</datasrc>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}"
    cid="{container_id}" published="{datetime}" updated="{datetime}" mime="text/xml">
    <db:content type="text/xml">
      <{root_element}>
        <!-- object data -->
      </{root_element}>
    </db:content>
  </db:object>
</createObject>
```

*Create object with Atom entry*

```xml
<createObject>
  <container id="{container_id}"/>
  <overwrite>true</overwrite>
  <extraction>true</extraction>
  <atom:entry>
    <atom:title>{object_name}</atom:title>
    <dc:s1>92</dc:s1>
  </atom:entry>
</createObject>
```

*Create object with inline data model*

```xml
<createObject>
  <overwrite>true</overwrite>
  <extraction>true</extraction>
  <datasrc>dataModel</datasrc>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" cid="{container_id}" name="{name}" mime="{mime_type}">
    <key name="{property}">{value}</key>
  </db:object>
</createObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object created successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createObjectResponse>`

```xml
<createObjectResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <db:streams total="{bytes}" first="{bytes}" />
  </db:object>
</createObjectResponse>
```

#### `404` · text/plain

```text
Container not found.
```

#### `409` · text/plain

```text
Object already exists.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/object" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createObject xmlns:atom="http://www.w3.org/2005/Atom">
  <container id="{container_id}"/>
  <overwrite>false</overwrite>
  <atom:entry>
    <atom:content type="application/json">
      <root>
        <tag1 attr="a"/>
        <tag2>b</tag2>
      </root>
    </atom:content>
    <atom:title>json</atom:title>
  </atom:entry>
</createObject>'
```

---

## DELETE /object <a id="deletev1object"></a>

**Delete an object**

Deletes an object from a container.

### Request

`DELETE https://api.cloudbackend.com/v1/object`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteObject>`

```xml
<deleteObject>
  <container id="{container_id}" />
  <object>{object_name}</object>
</deleteObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object deleted successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deleteObjectResponse>`

```xml
<deleteObjectResponse>
OK
</deleteObjectResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/object" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteObject>
  <container id="{container_id}" />
  <object>{object_name}</object>
</deleteObject>'
```

---

## PUT /object <a id="putv1object"></a>

**Rename an object**

Renames an object in a container.

### Request

`PUT https://api.cloudbackend.com/v1/object`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<renameObject>`

```xml
<renameObject>
  <container id="{container_id}" />
  <object>{old_object_name}</object>
  <newName>{new_object_name}</newName>
</renameObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object renamed successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<renameObjectResponse>`

```xml
<renameObjectResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{new_name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <db:streams total="{count}" first="{count}" />
  </db:object>
</renameObjectResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/object" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameObject>
  <container id="{container_id}" />
  <object>{old_object_name}</object>
  <newName>{new_object_name}</newName>
</renameObject>'
```

---

## PUT /objectsave <a id="putv1objectsave"></a>

**Save or update an object**

Saves new content to an existing object.

### Request

`PUT https://api.cloudbackend.com/v1/objectsave`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required)

```xml
<saveObject>
  <container id="{container_id}"/>
  <object>xml</object>
  <extraction>true</extraction>
  <stream title="xml"/>
  <content>
    <application name="atestapp" icon="icon://rocket" instances="0">
      <share>false</share>
      <settings>
        <home>home://</home>
        <path>home://Applications</path>
      </settings>
      <about loader="false" version="1.0" revised="2024-04-10" created="2024-04-10" author="" publisher="Acme Inc.">
        <description>atestapp</description>
      </about>
      <resources>
        <item name="MyInlineDataModel"/>
      </resources>
      <view name="atestapp" title="atestapp" icon="icon://rocket">
        <panel name="MainPanel" type="row">
          <label>My Application Library</label>
          <grid name="appsGrid" height="100%">
            <row match="db:object">
              <column name="subjectCol" match="@name" display="substring-before(.,'.xml')" label="Name" filter="true" width="140"/>
              <column name="dateCol" match="@updated" display="." label="Date" filter="true" width="140"/>
            </row>
          </grid>
        </panel>
      </view>
      <process name="atestapp" description="atestapp - Process">
        <trigger view="atestapp" event="Loaded" step="init"/>
        <step id="init">
          <operation name="bind" value="home://Applications">
            <component view="atestapp" name="appsGrid"/>
          </operation>
        </step>
      </process>
    </application>
  </content>
</saveObject>
```

*Save object with content*

```xml
<saveObject>
  <container id="{container_id}" />
  <object>{object_name}</object>
  <extraction>true</extraction>
  <stream title="{stream_name}" />
  <content>
    <{root_element}>
      <!-- object content -->
    </{root_element}>
  </content>
</saveObject>
```

*Save object with data model*

```xml
<saveObject>
  <container id="{container_id}" />
  <object>{object_name}</object>
  <extraction>true</extraction>
  <stream title="{stream_name}" />
  <datasrc>dataModel</datasrc>
  <content>
    <{root_element}>
      <!-- object data -->
    </{root_element}>
  </content>
</saveObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object saved successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<saveObjectResponse>`

```xml
<saveObjectResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <db:streams total="{bytes}" first="{bytes}" />
  </db:object>
</saveObjectResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objectsave" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '…'
```

---

## GET /metadata <a id="getv1metadata"></a>

**Get object metadata**

Gets metadata for an object using query parameters.

### Request

`GET https://api.cloudbackend.com/v1/metadata`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. |
| `objectname` | query | no | string | Object name. Used when `objectid` is 0 or omitted. |
| `objectid` | query | no | integer · default `0` | Object id. Takes precedence over `objectname` when non-zero. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object metadata |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<loadMetadataResponse>`

```xml
<loadMetadataResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd">
    <db:object name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
      <db:streams total="{bytes}" first="{bytes}" />
      <root>{root_element}</root>
      <name>{display_name}</name>
      <icon>{icon}</icon>
      <desc>{description}</desc>
      <version>{version}</version>
      <publisher>{publisher}</publisher>
    </db:object>
  </db:object>
</loadMetadataResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/metadata" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /metadata <a id="putv1metadata"></a>

**Save object metadata**

Updates metadata for an object.

### Request

`PUT https://api.cloudbackend.com/v1/metadata`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<saveMetadata>`

```xml
<saveMetadata>
  <container id="{container_id}" />
  <object>{object_name}</object>
  <content>
    <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
      <atom:title>{object_name}</atom:title>
      <atom:published>{datetime}</atom:published>
      <atom:updated>{datetime}</atom:updated>
      <atom:link rel="alternate" type="{mime_type}" />
      <dc:tag>{tags}</dc:tag>
      <dc:s1>92</dc:s1>
    </atom:entry>
  </content>
</saveMetadata>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Metadata saved successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<saveMetadataResponse>`

```xml
<saveMetadataResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <s1>92</s1>
    <tag>{tags}</tag>
    <db:streams total="0" first="0" />
  </db:object>
</saveMetadataResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/metadata" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<saveMetadata>…</saveMetadata>'
```

---

## GET /objects/{container_id} <a id="getv1objects"></a>

**List objects in a container**

Lists the objects (files) in a container. Returns an Atom feed with object entries including metadata like title, timestamps, size, and stream links.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `offset` | query | no | string | Index of first file to list |
| `count` | query | no | string | Max number of files to list (max 1000) |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of objects in the container |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom='http://www.w3.org/2005/Atom' xmlns:os='http://a9.com/-/spec/opensearch/1.1/' xmlns:dc='http://xcerion.com/directory.xsd' xmlns:ni='http://xcerion.com/noindex.xsd'>
<os:totalResults>3</os:totalResults>
<os:startIndex>0</os:startIndex>
<os:itemsPerPage>100</os:itemsPerPage>
<atom:entry>
<atom:title>file1.txt</atom:title>
<atom:published>2024-02-26T07:42:36Z</atom:published>
<atom:updated>2024-02-26T07:42:36Z</atom:updated>
<atom:link rel='alternate' type='application/octet-stream' length='5' stream_1_length='0' href='https://api.cloudbackend.com/v1/objects/8589935462/4294968604/1' />
<atom:id>mid:10000051c@xios.xcerion.com</atom:id>
<dc:container>8589935462</dc:container>
<dc:object>4294968604</dc:object>
<dc:md5>5d41402abc4b2a76b9719d911017c592</dc:md5>
</atom:entry>
<!-- ... more entries ... -->
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /objects/{container_id}/{object_id} <a id="getv1objectsxml"></a>

**Get XML content of an object**

Returns the main stream (stream `1`) of an object exactly as it is stored, without
any wrapper. It is meant for objects whose content is an XML document, which can
then be changed node by node with PUT on the same URL.

`object_id` can also be given as `:name` to address the object by its name in the
container (see `/objects/{container_id}/:{name}`). The caller must be logged in.
If the content cannot be read the answer is `404`. No request body.

To download a stream with its own content type and download headers, use
`GET /objects/{container_id}/{object_id}/{stream_id}` instead.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The stored content of stream 1 |
| `401` | Unauthorized |
| `404` | Not Found — the object or its content does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<settings>
  <theme>dark</theme>
  <items>
    <item id="1">First</item>
  </items>
</settings>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /objects/{container_id}/{object_id} <a id="putv1objectsxml"></a>

**Change XML content of an object**

Changes the XML document stored in the main stream (stream `1`) of an object
without uploading the whole document. Send an `<object>` element with two
attributes and, for `add` and `replace`, the new XML node as its only child:

- `xpath` — XPath expression that selects the node(s) to change in the stored
  document. `xpath="/"` with `action="replace"` replaces the whole document with
  the child element of the request.
- `action` — `add` (default when missing or unknown): the new node is appended as
  the last child of every selected node; `replace`: every selected node is
  replaced by the new node; `remove`: every selected node is removed (no child
  element needed).

The changed document is saved as stream 1 with content type `application/xml`.
The request body may use `<object>` or the legacy `<document>` as root element.
`object_id` can also be given as `:name`.

Returns `204 No Content` on success, `400` if the new node is not well-formed XML,
and `404` if the current content cannot be read.

### Request

`PUT https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |

#### Body

`application/xml` (required), root element `<object>`

*Append a node under /settings/items*

```xml
<object action="add" xpath="/settings/items">
  <item id="2">Second</item>
</object>
```

*Replace a node*

```xml
<object action="replace" xpath="/settings/theme">
  <theme>light</theme>
</object>
```

*Remove nodes*

```xml
<object action="remove" xpath="/settings/items/item[@id='1']" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Content changed |
| `400` | Bad Request — the new node could not be parsed. |
| `401` | Unauthorized |
| `404` | Not Found — the object or its content does not exist. |
| `415` | Unsupported Media Type — "Content-Type must be application/xml or text/xml". |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<object action="add" xpath="/settings/items">
  <item id="2">Second</item>
</object>'
```

---

## GET /objects/{container_id}/:{name} <a id="getv1objectsxmlbyname"></a>

**Get XML content of an object by name**

Same as `GET /objects/{container_id}/{object_id}`, but the object is addressed by
its name in the container: put a colon in front of the name, for example
`/objects/8589935462/:settings.xml`. Percent-encode characters that are not
allowed in a URL path (such as spaces).

The `:name` form also works on the sub-resources of an object, for example
`/objects/{container_id}/:{name}/1` (stream 1), `/:{name}/session`,
`/:{name}/restore` and `/:{name}/;acl`. No request body.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/:{name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `name` | path | yes | string | Name of the object (after the `:` prefix). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The stored content of stream 1 |
| `401` | Unauthorized |
| `404` | Not Found — no object with that name, or its content does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<settings>
  <theme>dark</theme>
</settings>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/:{name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /objects/{container_id}/:{name} <a id="putv1objectsxmlbyname"></a>

**Change XML content of an object by name**

Same as `PUT /objects/{container_id}/{object_id}`, but the object is addressed by
its name (`:` prefix). Send `<object action="add|replace|remove" xpath="…">` with
the new node as child; returns `204 No Content`.

### Request

`PUT https://api.cloudbackend.com/v1/objects/{container_id}/:{name}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `name` | path | yes | string | Name of the object (after the `:` prefix). |

#### Body

`application/xml` (required), root element `<object>`

```xml
<object action="replace" xpath="/settings/theme">
  <theme>light</theme>
</object>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Content changed |
| `400` | Bad Request — the new node could not be parsed. |
| `401` | Unauthorized |
| `404` | Not Found — no object with that name, or its content does not exist. |
| `415` | Unsupported Media Type — "Content-Type must be application/xml or text/xml". |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objects/{container_id}/:{name}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<object action="replace" xpath="/settings/theme">
  <theme>light</theme>
</object>'
```

---

## POST /objectcopy <a id="postv1objectcopy"></a>

**Copy an object**

Copies an object to a different container with a new name.

### Request

`POST https://api.cloudbackend.com/v1/objectcopy`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<copyObject>`

```xml
<copyObject>
  <srcObject id="{source_object_id}" />
  <dstContainer id="{dest_container_id}" />
  <dstObject>{dest_object_name}</dstObject>
</copyObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object copied successfully |
| `500` | Internal Server Error |

#### `200` · application/xml · `<copyObjectResponse>`

```xml
<copyObjectResponse><db:object xmlns:db="https://cloudbackend.com/db.xsd" name="0000000100000530" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="application/x-mime+xml"><db:streams total="874" first="874"/><root>m:Message</root><namespace>urn:x-i-o-s:xmime</namespace><author>
```

#### `500` · text/plain

```text
Server Error
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objectcopy" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<copyObject>
  <srcObject id="{source_object_id}" />
  <dstContainer id="{dest_container_id}" />
  <dstObject>{dest_object_name}</dstObject>
</copyObject>'
```

---

## POST /stream <a id="postv1stream"></a>

**Get or copy streams**

Retrieves stream information or copies a stream between objects.

### Request

`POST https://api.cloudbackend.com/v1/stream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required)

```xml
<copyStream>
  <srcFolder id="{container_id}"/>
  <srcDocument id="{object_id}"/>
  <srcStream id="2"/>
  <dstFolder id="{container_id}"/>
  <dstDocument id="{object_id}"/>
  <dstStream id="3"/>
</copyStream>
```

*Get object streams*

```xml
<getStreams>
  <container id="{container_id}" />
  <object id="{object_id}" />
</getStreams>
```

*Copy a stream*

```xml
<copyStream>
  <srcContainer id="{source_container_id}" />
  <srcObject id="{source_object_id}" />
  <srcStream id="{source_stream_id}" />
  <dstContainer id="{dest_container_id}" />
  <dstObject id="{dest_object_id}" />
  <dstStream id="{dest_stream_id}" />
</copyStream>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
  <dc:stream>3</dc:stream>
  <atom:id>cid:100000522/3@xios.xcerion.com</atom:id>
  <atom:link rel="alternate" type="" href="https://127.0.0.1/v1/documents/{container_id}/{object_id}/3"/>
  <atom:title>new stream 2 name</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
</atom:entry>
```

*Stream list*

```xml
<getStreamsResponse>
  <db:streams>
    <db:stream>
      <db:id>1</db:id>
      <db:cid>cid:{message_id}</db:cid>
      <db:link rel="alternate" type="{mime_type}" length="{bytes}" href="" />
      <db:title />
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
  </db:streams>
</getStreamsResponse>
```

*Copied stream*

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <dc:stream>{stream_id}</dc:stream>
  <atom:id>mid:{message_id}</atom:id>
  <atom:link rel="alternate" type="" href="" />
  <atom:title>{stream_name}</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/stream" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<copyStream>
  <srcFolder id="{container_id}"/>
  <srcDocument id="{object_id}"/>
  <srcStream id="2"/>
  <dstFolder id="{container_id}"/>
  <dstDocument id="{object_id}"/>
  <dstStream id="3"/>
</copyStream>'
```

---

## PUT /stream <a id="putv1stream"></a>

**Rename a stream**

Renames a stream in an object.

### Request

`PUT https://api.cloudbackend.com/v1/stream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<renameStream>`

```xml
<renameStream>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <stream id="{stream_id}" />
  <newName>{new_name}</newName>
</renameStream>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Stream renamed successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
OK
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/stream" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameStream>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <stream id="{stream_id}" />
  <newName>{new_name}</newName>
</renameStream>'
```

---

## DELETE /stream <a id="deletev1stream"></a>

**Delete a stream**

Deletes a stream from an object.

### Request

`DELETE https://api.cloudbackend.com/v1/stream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteStream>`

```xml
<deleteStream>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <stream id="{stream_id}" />
</deleteStream>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Stream deleted successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
OK
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/stream" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteStream>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <stream id="{stream_id}" />
</deleteStream>'
```

---

## GET /stream <a id="getv1stream"></a>

**List object streams**

Lists all streams (versions/attachments) of an object.

### Request

`GET https://api.cloudbackend.com/v1/stream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. Alias of `folderid`. |
| `objectid` | query | no | integer · default `0` | Object whose streams are listed. Alias of `documentid`. |
| `folderid` | query | no | integer · default `0` | Legacy alias of `containerid`. |
| `documentid` | query | no | integer · default `0` | Legacy alias of `objectid`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of streams |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getStreamsResponse>`

```xml
<getStreamsResponse>
  <db:streams xmlns:atom="http://www.w3.org/2005/Atom" xmlns:db="https://cloudbackend.com/db.xsd">
    <db:stream>
      <db:id>1</db:id>
      <db:cid>cid:100000522/1@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="text/plain; charset=ISO-8859-9" length="15" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>2</db:id>
      <db:cid>cid:100000522/2@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="20" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>3</db:id>
      <db:cid>cid:100000522/3@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="16" href="https://api.cloudbackend.com/v1/..."/>
      <db:title>new stream 2 name</db:title>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>4</db:id>
      <db:cid>cid:100000522/4@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="20" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>4097</db:id>
      <db:cid>cid:100000522/1001@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="19" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>4098</db:id>
      <db:cid>cid:100000522/1002@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="19" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
  </db:streams>
</getStreamsResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stream" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /appendstream <a id="getv1appendstream"></a>

**List append streams**

Lists append-only streams of an object.

### Request

`GET https://api.cloudbackend.com/v1/appendstream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container` | query | no | integer · default `0` | Container holding the object. |
| `object` | query | no | integer · default `0` | Object whose append streams are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of append streams |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getAppendStreamsResponse>`

```xml
<getAppendStreamsResponse>
  <db:streams xmlns:atom="http://www.w3.org/2005/Atom" xmlns:db="https://cloudbackend.com/db.xsd">
    <db:stream>
      <db:id>4097</db:id>
      <db:cid>cid:100000522/1001@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="19" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
    <db:stream>
      <db:id>4098</db:id>
      <db:cid>cid:100000522/1002@xios.xcerion.com</db:cid>
      <db:link rel="alternate" type="" length="19" href="https://api.cloudbackend.com/v1/..."/>
      <db:title/>
      <db:published>{datetime}</db:published>
      <db:updated>{datetime}</db:updated>
    </db:stream>
  </db:streams>
</getAppendStreamsResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/appendstream" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /keys/{user_id} <a id="getv1keys"></a>

**List user keys**

Returns the keyring of the logged-in identity: all of its keys that are not deleted.
`{user_id}` must be the caller's own identity id, otherwise `403 Keyring access denied.`

Each `<key>` carries its `uri`, `<userId>`, `<keyId>`, `<service>`, `<title>`,
`<summary>`, `<data>` and `<updated>` (Atom time). The secret is never returned.

### Request

`GET https://api.cloudbackend.com/v1/keys/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the logged-in identity. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The keyring |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the caller. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<keyring>`

```xml
<keyring uri="https://api.cloudbackend.com/v1/keys/{user_id}">
  <key uri="https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}">
    <userId>{user_id}</userId>
    <keyId>{key_id}</keyId>
    <service>coverage service</service>
    <title>coverage key</title>
    <summary>coverage summary</summary>
    <data>coverage data</data>
    <updated>2024-03-05T07:11:00Z</updated>
  </key>
</keyring>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/keys/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /keys/{user_id} <a id="postv1keys"></a>

**Create a user key**

Adds a key to the keyring of the logged-in identity. `{user_id}` must be the caller's own
identity id, and the call must be made over HTTPS.

The body is a `<key>` element: `<service>` is required and must be unique within the
keyring; `<title>`, `<summary>`, `<data>` and `<secret>` are optional. The secret is
stored but never returned.

Returns the created key.

### Request

`POST https://api.cloudbackend.com/v1/keys/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the logged-in identity. |

#### Body

`application/xml` (required), root element `<key>`

```xml
<key>
  <service>coverage service</service>
  <title>coverage key</title>
  <summary>coverage summary</summary>
  <data>coverage data</data>
  <secret>coverage secret</secret>
</key>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The created key |
| `400` | Bad Request — `<service>` element missing, or the request was not made over HTTPS. |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the caller. |
| `409` | Conflict — the keyring already has a key for this service. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<key>`

```xml
<key uri="https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}">
  <userId>{user_id}</userId>
  <keyId>{key_id}</keyId>
  <service>coverage service</service>
  <title>coverage key</title>
  <summary>coverage summary</summary>
  <data>coverage data</data>
  <updated>2024-03-05T07:11:00Z</updated>
</key>
```

#### `400` · text/plain

```text
<service> element missing.
```

#### `409` · text/plain

```text
Duplicate service URIs not allowed.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/keys/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<key>
  <service>coverage service</service>
  <title>coverage key</title>
  <summary>coverage summary</summary>
  <data>coverage data</data>
  <secret>coverage secret</secret>
</key>'
```

---

## DELETE /keys/{user_id}/{key_id} <a id="deletev1keys"></a>

**Delete a user key**

Deletes one key from the keyring of the logged-in identity. `{user_id}` must be the
caller's own identity id. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the logged-in identity. |
| `key_id` | path | yes | integer | Id of the key. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key deleted |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the caller. |
| `404` | Not Found — the key does not exist. |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /keys/{user_id}/{key_id} <a id="getv1keyskey"></a>

**Get a user key**

Returns one key of the logged-in identity's keyring. `{user_id}` must be the caller's own
identity id. The secret is never returned. A key that has been deleted is still
returned, with an extra `<deleted>` element (Atom time).

### Request

`GET https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the logged-in identity. |
| `key_id` | path | yes | integer | Id of the key. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The key |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the caller. |
| `404` | Not Found — the key does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<key>`

```xml
<key uri="https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}">
  <userId>{user_id}</userId>
  <keyId>{key_id}</keyId>
  <service>coverage service</service>
  <title>coverage key</title>
  <summary>coverage summary</summary>
  <data>coverage data</data>
  <updated>2024-03-05T07:11:00Z</updated>
</key>
```

#### `404` · text/plain

```text
Key not found.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /keys/{user_id}/{key_id} <a id="putv1keys"></a>

**Modify a user key**

Replaces the fields of a key in the logged-in identity's keyring. `{user_id}` must be the
caller's own identity id, and the call must be made over HTTPS.

The body is a `<key>` element: `<service>` is required (and must stay unique within the
keyring); `<title>`, `<summary>`, `<data>` and `<secret>` are optional — a field left out
is stored as empty.

### Request

`PUT https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the logged-in identity. |
| `key_id` | path | yes | integer | Id of the key. |

#### Body

`application/xml` (required), root element `<key>`

```xml
<key>
  <service>coverage service</service>
  <title>updated title</title>
  <summary>updated summary</summary>
  <data>updated data</data>
  <secret>updated secret</secret>
</key>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key updated |
| `400` | Bad Request — `<service>` element missing, or the request was not made over HTTPS. |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the caller. |
| `409` | Conflict — another key in the keyring already uses this service. |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
<service> element missing.
```

#### `409` · text/plain

```text
Duplicate service URIs not allowed.
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/keys/{user_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<key>
  <service>coverage service</service>
  <title>updated title</title>
  <summary>updated summary</summary>
  <data>updated data</data>
  <secret>updated secret</secret>
</key>'
```

---

## POST /objects/{container_id}/{object_id}/stream <a id="postv1objectsstreamnext"></a>

**Upload to next free stream**

Stores the request body as a new stream of an existing object, using the next
free stream id (2 and up; the main stream 1 is never chosen). The response is
the Atom entry of the new **stream**, not of the object: read `<dc:stream>` to get
the id that was assigned.

Send the file as the raw request body with any `Content-Type` other than
`multipart/form-data` (for example `application/octet-stream`), and give its
real MIME type in `X-Content-Type` and its name in `X-File-Name`. A
`Content-Length` header is required and must be within the drive's maximum file
size. `multipart/form-data` is accepted only in the form produced by the upload
proxy behind `/upload`.

The caller needs write access to the container (otherwise `403`, "Folder access
denied."). Only POST is implemented; a GET on this URL returns `404`.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/stream`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `X-Content-Type` | header | no | string | MIME type of the uploaded data. |
| `X-File-Name` | header | no | string | File name of the uploaded data. |

#### Body

`application/octet-stream` (required)

```text
This is stream any 1
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the new stream |
| `400` | Bad Request — for example a missing boundary in a multipart `Content-Type`, or encryption headers that do not match the container. |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found — the object does not exist. |
| `411` | Length Required — "Missing Content-Length header." |
| `413` | Request Entity Too Large — the body exceeds the drive's maximum file size. |
| `500` | Internal Server Error — for example "No more stream ids left". |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:dc='http://xcerion.com/directory.xsd'>
  <dc:stream>2</dc:stream>
  <atom:id>cid:{object_id_hex}/2@xios.xcerion.com</atom:id>
  <atom:link rel='alternate' type='text/plain' length='25' href='https://api.cloudbackend.com/v1/documents/{container_id}/{object_id}/2'/>
  <atom:title>{file_name}</atom:title>
  <atom:published>2024-03-15T10:09:09Z</atom:published>
  <atom:updated>2024-03-15T10:09:09Z</atom:updated>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/stream" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "X-Content-Type: {x-content-type}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Content-Type: application/octet-stream; charset=utf-8" \
  -d 'This is stream any 1'
```

---

## GET /objects/{container_id}/{object_id}/{stream_id} <a id="getv1objectsstream"></a>

**Get object stream**

Gets the streamStream ID 1 is the default stream If dl is used, Content-Disposition will be added to the HTTP headers.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `object_id` | path | yes | string |  |
| `stream_id` | path | yes | integer |  |
| `favoriteId` | query | no | string | favorite id (optional) |
| `dl` | query | no | string | Use this to download it. Name of file, use "&dl" to use stream title / document name |
| `ct` | query | no | string | Content type. Use it to override 'Content-Type' header |
| `cd` | query | no | string | Content disposition. Use it to override 'Content-Disposition' header |
| `deleted` | query | no | string | allows downloading of deleted documents |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<testdata>`

```xml
<testdata>Some data here</testdata>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /objects/{container_id}/{object_id}/{stream_id} <a id="postv1objectsstream"></a>

**Upload a stream to an object**

Uploads a new content stream to an existing object. Returns an atom:entry.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `object_id` | path | yes | integer |  |
| `stream_id` | path | yes | integer |  |
| `X-Content-Type` | header | no | string | Overrides the content type recorded for the stream. |
| `X-File-Name` | header | no | string | Overrides the file name recorded for the stream. |

#### Body

`text/plain` (required)

```text
Stream content as plain text
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>filename.txt</atom:title>
  <atom:published></atom:published>
  <atom:updated></atom:updated>
  <dc:objectid>{object_id}</dc:objectid>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "X-Content-Type: {x-content-type}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d 'Stream content as plain text'
```

---

## GET /objects/{container_id}/{object_id}/{stream_id}/session <a id="getv1objectssession"></a>

**Get object stream (not a session)**

NOTE: this URL does not create a session. The server routes any path of the
form `/objects/{container_id}/{object_id}/{stream_id}/…` to the stream download
and ignores everything after the stream id, so this call behaves exactly like
`GET /objects/{container_id}/{object_id}/{stream_id}` and returns the content of
the stream.

To create an object session, call `GET /objects/{container_id}/{object_id}/session`
(without a stream id), which returns an `<object-session sessionId="…">` element.
The session id can then be passed as `?session=` to
`GET /objects/{container_id}/{object_id}/{stream_id}` to read the stream without
a username and password.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/session`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `stream_id` | path | yes | integer | Stream to return; `1` is the main stream. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The stream content, with the stream's own content type. |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/session" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /objects/{container_id}/{object_id}/{stream_id}/{filename} <a id="getv1objectsstreamfilename"></a>

**Get object stream with a file name in the URL**

Same as `GET /objects/{container_id}/{object_id}/{stream_id}`. Everything after the
stream id is ignored by the server; it only lets a browser pick a good file name
when the link is opened or saved, for example
`/objects/8589935462/8589936001/1/report.pdf`.

The caller needs read access to the object, or uses `favoriteId` for an object in
a webshare the caller can access. A session id from
`GET /objects/{container_id}/{object_id}/session` can be passed as `?session=`
instead of logging in. No request body.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/{filename}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `stream_id` | path | yes | integer | Stream to return; `1` is the main stream. |
| `filename` | path | yes | string | Any file name; ignored by the server. |
| `dl` | query | no | string | Download instead of view. Sets `Content-Type` to `application/octet-stream` and adds an `attachment` `Content-Disposition` with this file name; an empty value (`?dl`) uses the stream title or the object name. |
| `ct` | query | no | string | Overrides the `Content-Type` response header. |
| `cd` | query | no | string | Overrides the `Content-Disposition` response header. |
| `deleted` | query | no | string · one of `true` | `true` also returns the stream of a deleted object. |
| `fallbackimage` | query | no | string · one of `true`, `false` | `false` disables the fallback image that is otherwise returned for missing thumbnail streams. Default `true`. |
| `favoriteId` | query | no | integer | Id of a webshare (favorite) through which the caller reads the object; the container must be part of that webshare. |
| `session` | query | no | string | Object session id from `GET /objects/{container_id}/{object_id}/session`, used instead of logging in. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The stream content, with the stream's own content type (or the one set by `ct`/`dl`). |
| `401` | Unauthorized |
| `403` | Forbidden — no read access, or "Cannot access WebShare." |
| `404` | Not Found — object or stream missing, "Folder not found in WebShare.", or "Wrong type on favoriteid! Integer expected." |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/{filename}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /objects/{container_id}/{object_id}/{stream_id}/{filename} <a id="postv1objectsstreamfilename"></a>

**Upload a stream with a file name in the URL**

Same as `POST /objects/{container_id}/{object_id}/{stream_id}`; the file name
segment is ignored. Stores the request body as the given stream of an existing
object (stream `1` replaces the main content).

Send the data as the raw request body (any `Content-Type` other than
`multipart/form-data`) with a `Content-Length` header; `X-Content-Type` and
`X-File-Name` give the MIME type and file name to record. The caller needs write
access to the container (otherwise `403`, "Folder access denied."). Returns the
Atom entry of the object.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/{filename}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `stream_id` | path | yes | integer | Stream to write; `1` is the main stream. |
| `filename` | path | yes | string | Any file name; ignored by the server. |
| `X-Content-Type` | header | no | string | MIME type of the uploaded data. |
| `X-File-Name` | header | no | string | File name of the uploaded data. |

#### Body

`application/octet-stream` (required)

```text
Stream content
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the object |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found — the object does not exist. |
| `411` | Length Required — "Missing Content-Length header." |
| `413` | Request Entity Too Large — the body exceeds the drive's maximum file size. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>report.txt</atom:title>
  <atom:published>2024-03-15T10:09:09Z</atom:published>
  <atom:updated>2024-03-15T10:09:09Z</atom:updated>
  <dc:objectid>{object_id}</dc:objectid>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/{stream_id}/{filename}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "X-Content-Type: {x-content-type}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Content-Type: application/octet-stream; charset=utf-8" \
  -d 'Stream content'
```

---

## GET /objects/{container_id}/{object_id}/session <a id="getv1objectssessioncreate"></a>

**Create object session**

Creates an object session: a session id that grants read access to this one
object without a username and password. Pass it as `?session=` when reading a
stream, for example
`GET /objects/{container_id}/{object_id}/1?session={session_id}`.

The caller needs read access to the object (otherwise `403`, "Document access
denied."). An identity that must use multi-factor authentication gets `401`
("mfa must be used").

With `favoriteId` the session is created through a favorite (an inbound
webshare) instead: the caller needs access to the webshare and the container
must be inside it, and the session element then carries `favoriteId`.

POST and DELETE on this URL are handled by the general session resource and do
not concern the object: DELETE clears all sessions of the caller (like
`DELETE /sessions`) and POST ends the session of the token used for the call
(like `POST /logout`).

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/session`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `favoriteId` | query | no | integer | Favorite (inbound webshare) id to create the session through. A non-numeric value gives `404`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The new object session |
| `401` | Unauthorized — also "mfa must be used" for identities that must use multi-factor authentication. |
| `403` | Forbidden — "Document access denied.", or no access to the favorite. |
| `404` | Not Found — the object does not exist, `favoriteId` is not a number, or the container is not in the favorite. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<object-session>`

*Session on the caller's own access*

```xml
<object-session sessionId='{session_id}' containerId='{container_id}' objectId='{object_id}'/>
```

*Session created with favoriteId*

```xml
<object-session sessionId='{session_id}' favoriteId='{favorite_id}' containerId='{container_id}' objectId='{object_id}'/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/session" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /objects/{container_id}/{object_id}/restore <a id="postv1objectsrestore"></a>

**Restore a deleted object**

Restores a deleted object into its container under a new name and returns the
Atom entry of the restored object.

The body is a `<restoreObject>` element whose `newName` attribute is the name to
restore the object as. Without it the call fails with `422` ("Missing 'newName'
attribute").

The caller needs write access to the container and to the object. Restoring
fails with `409` when an object with that name already exists, and with `400`
when the object is not in the deleted list.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/restore`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container the object was deleted from. |
| `object_id` | path | yes | string | Id of the deleted object, or `:name` to address it by name. |

#### Body

`application/xml` (required), root element `<restoreObject>`

```xml
<restoreObject newName="new-file1.txt"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the restored object |
| `400` | Bad Request — "Could not restore document, entry not in deleted list." |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied.", "Delete access denied." or "Drive is write-locked." |
| `404` | Not Found — the object or its parent container does not exist. |
| `409` | Conflict — "Document already exists." An object with `newName` already exists. |
| `422` | Unprocessable Entity — "Missing 'newName' attribute". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:dc='http://xcerion.com/directory.xsd'>
  <atom:title>new-file1.txt</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
  <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/documents/{container_id}/{object_id}/1" length="12" stream_1_length="12" />
  <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object>{object_id}</dc:object>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/restore" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<restoreObject newName="new-file1.txt"/>'
```

---

## GET /objects/{container_id}/{object_id};acl <a id="getv1objectsacl"></a>

**Get object ACL**

Returns the access control list (ACL) of an object.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`,
`delete` and `changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in
`If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged,
and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | integer | Object whose ACL is returned. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found — "Document not found". |
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
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /objects/{container_id}/{object_id};acl <a id="putv1objectsacl"></a>

**Modify object ACL**

Replaces the access control list (ACL) of an object.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and
the current ETag in the `If-Match` header. Entries left out lose all rights;
flags left out are `0`. At least one entry must have `changeACL="1"`. If the body
carries a `tag` attribute it must equal `If-Match`.

Only identities with `changeACL` in the current ACL, or the owner of the drive
the object is on, may change it (otherwise `403 Forbidden`). If the ACL changed
since the ETag was read, the call fails with `412 Precondition Failed`. On
success the response is `204 No Content` and the `ETag` header carries the tag of
the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/objects/{container_id}/{object_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | integer | Object whose ACL is replaced. |
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
| `404` | Not Found — "Document not found". |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## POST /objects/{container_id}/{object_id}/tmpurl <a id="postv1objectstmpurl"></a>

**Create a temporary decryption URL**

For an object whose content is stored encrypted on the client side: creates a
decryption session and returns a temporary URL from which the decrypted content
can be downloaded without logging in.

Send the AES key and IV of the object, each RSA-encrypted with the server's public
key and Base64-encoded, together with the index of the server key pair to use
(`1` or `2`). Only `base64` is accepted as `encoding`. The caller needs read
access to the object (otherwise `403`, "Document access denied.").

The returned URL has the form
`…/v1/documents/{container_id}/{object_id}/tmpurl/{session}/{object_name}`; see
`GET /objects/{container_id}/{object_id}/tmpurl/{session}/{filename}`. Delete the
session afterwards with
`GET /objects/{container_id}/{object_id}/tmpurl/{session}/{filename}/delete`.

### Request

`POST https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |

#### Body

`application/xml` (required), root element `<decrypt>`

```xml
<decrypt>
  <encryptedKey>{rsa_encrypted_base64_key}</encryptedKey>
  <encryptedIv>{rsa_encrypted_base64_iv}</encryptedIv>
  <encoding>base64</encoding>
  <privateKeyIndex>1</privateKeyIndex>
</decrypt>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Temporary URL of the decrypted object |
| `400` | Bad Request — "Only base64 encoding supported" or "Invalid privateKeyIndex". |
| `401` | Unauthorized |
| `403` | Forbidden — "Document access denied." |
| `404` | Not Found — "Could not find document". |
| `415` | Unsupported Media Type — "Content-Type must be application/xml or text/xml". |
| `422` | Unprocessable Entity — "Missing 'encryptedKey'", "Missing 'encryptedIv'", "Missing 'encoding'" or "Missing 'privateKeyIndex'". |
| `500` | Internal Server Error — for example "Could not generate unique session". |

#### `200` · application/xml · `<decryptionSessionUrl>`

```xml
<decryptionSessionUrl>https://api.cloudbackend.com/v1/documents/{container_id}/{object_id}/tmpurl/{session}/{object_name}</decryptionSessionUrl>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<decrypt>
  <encryptedKey>{rsa_encrypted_base64_key}</encryptedKey>
  <encryptedIv>{rsa_encrypted_base64_iv}</encryptedIv>
  <encoding>base64</encoding>
  <privateKeyIndex>1</privateKeyIndex>
</decrypt>'
```

---

## GET /objects/{container_id}/{object_id}/tmpurl/{session} <a id="getv1objectstmpurlsession"></a>

**Download decrypted object**

Streams the decrypted content of an encrypted object, using a decryption session
created with `POST /objects/{container_id}/{object_id}/tmpurl`. No login is
needed: the session id in the URL is the credential. The session must belong to
this container and object (otherwise `400`, "Session mismatch").

The URL returned by the POST also carries the object name after the session id
(`/tmpurl/{session}/{filename}`); both forms return the same content.
No request body.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `session` | path | yes | string | Decryption session id from the URL returned by the POST. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The decrypted content |
| `400` | Bad Request — "Invalid session" or "Session mismatch". |
| `404` | Not Found — "Document not found". |
| `500` | Internal Server Error — for example "Could not open encrypted file" or "Crypt error 1". |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}"
```

---

## GET /objects/{container_id}/{object_id}/tmpurl/{session}/{filename} <a id="getv1objectstmpurlsessionfilename"></a>

**Download decrypted object with a file name in the URL**

Same as `GET /objects/{container_id}/{object_id}/tmpurl/{session}`; the file name
segment is ignored (it lets a browser pick a good file name). This is the form of
the URL returned by `POST /objects/{container_id}/{object_id}/tmpurl`. No login is
needed. No request body.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}/{filename}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `session` | path | yes | string | Decryption session id. |
| `filename` | path | yes | string | Any file name; ignored by the server. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The decrypted content |
| `400` | Bad Request — "Invalid session" or "Session mismatch". |
| `404` | Not Found — "Document not found". |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}/{filename}"
```

---

## GET /objects/{container_id}/{object_id}/tmpurl/{session}/{filename}/delete <a id="getv1objectstmpurldelete"></a>

**Delete a decryption session**

Deletes a decryption session created with
`POST /objects/{container_id}/{object_id}/tmpurl`, so that its temporary URL stops
working. Call it with the temporary URL plus `/delete`.

Unlike the download, this call requires login: the caller needs read access to the
object (otherwise `403`, "Document access denied."), and the session must belong to
this container and object. Returns `200` with an empty body. No request body.

### Request

`GET https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}/{filename}/delete`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | string | Object id, or `:name` to address the object by name. |
| `session` | path | yes | string | Decryption session id. |
| `filename` | path | yes | string | Any file name; ignored by the server. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Session deleted (empty body) |
| `400` | Bad Request — "Invalid session" or "Session mismatch". |
| `401` | Unauthorized |
| `403` | Forbidden — "Document access denied." |
| `500` | Internal Server Error |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/tmpurl/{session}/{filename}/delete" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id} <a id="deletev1usersfavoritesobjects"></a>

**Delete object in favorite**

Deletes (moves to the trash) an object inside a webshare favorite. The caller
must be `{user_id}`, and the favorite's webshare must grant `update` access;
otherwise `403`. A deleted object can be brought back with `POST` on the same
URL.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | integer | The object to delete. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Object deleted |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, or `This webshareFavorite is not set to update sharing` |
| `404` | Not Found — favorite, container or object not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id} <a id="postv1usersfavoritesobjects"></a>

**Restore object in favorite**

Restores a deleted object inside a webshare favorite (see `DELETE` on the same
URL) under the name given in `newName`, and returns its Atom entry. The caller
must be `{user_id}`.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | integer | The deleted object to restore. |

#### Body

`application/xml` (required), root element `<restoreObject>`

```xml
<restoreObject newName="restored file1.txt"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the restored object |
| `400` | Bad Request — malformed XML, `Missing newName entry` or `Must have a name` |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}` |
| `404` | Not Found — object not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>restored file1.txt</atom:title>
  <atom:published>2026-06-29T13:24:26Z</atom:published>
  <atom:updated>2026-06-29T13:30:02Z</atom:updated>
  <atom:link rel="alternate" type="text/plain; charset=ISO-8859-1" href="{object_url}" length="31" stream_1_length="31"/>
  <atom:id>mid:200000576@xios.xcerion.com</atom:id>
  <dc:container>8589935569</dc:container>
  <dc:object>8589935990</dc:object>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<restoreObject newName="restored file1.txt"/>'
```

---

## PUT /users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id} <a id="putv1usersfavoritesobjects"></a>

**Rename object in favorite**

Renames an object inside a webshare favorite and returns its Atom entry. The
caller must be `{user_id}`, and the favorite's webshare must grant `update`
access.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity that follows the webshare. |
| `favorite_id` | path | yes | integer | Id of the favorite. |
| `container_id` | path | yes | integer | Container holding the object. |
| `object_id` | path | yes | integer | The object to rename. |

#### Body

`application/xml` (required), root element `<renameObject>`

```xml
<renameObject newName="renamed file1.txt"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Atom entry of the renamed object |
| `400` | Bad Request — malformed XML, `Missing newName entry` or `Must have a name` |
| `401` | Unauthorized |
| `403` | Forbidden — caller is not `{user_id}`, or `This webshareFavorite is not set to update sharing` |
| `404` | Not Found — favorite, container or object not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>renamed file1.txt</atom:title>
  <atom:published>2026-06-29T13:24:26Z</atom:published>
  <atom:updated>2026-06-29T13:28:40Z</atom:updated>
  <atom:link rel="alternate" type="text/plain; charset=ISO-8859-1" href="{object_url}" length="31" stream_1_length="31"/>
  <atom:id>mid:200000576@xios.xcerion.com</atom:id>
  <dc:container>8589935569</dc:container>
  <dc:object>8589935990</dc:object>
</atom:entry>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/favorites/{favorite_id}/{container_id}/objects/{object_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameObject newName="renamed file1.txt"/>'
```

---

## PUT /objectmove <a id="putv1objectmove2"></a>

**Move an object**

Moves an object from one container to another, optionally renaming it. Supports data model objects.

### Request

`PUT https://api.cloudbackend.com/v1/objectmove`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<moveObject>`

```xml
<moveObject>
  <srcFolder id="{source_container_id}" />
  <srcDocument>{source_object_name}</srcDocument>
  <dstFolder id="{destination_container_id}" />
  <dstDocument>{destination_object_name}</dstDocument>
  <datasrc>dataModel</datasrc>
</moveObject>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object moved |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<moveObjectResponse>`

```xml
<moveObjectResponse>
  <db:object xmlns:db="https://cloudbackend.com/db.xsd" name="{name}" id="{object_id}" cid="{container_id}" published="{datetime}" updated="{datetime}" mime="{mime_type}">
    <db:streams total="{count}" first="{count}" />
  </db:object>
</moveObjectResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objectmove" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<moveObject>
  <srcFolder id="{source_container_id}" />
  <srcDocument>{source_object_name}</srcDocument>
  <dstFolder id="{destination_container_id}" />
  <dstDocument>{destination_object_name}</dstDocument>
  <datasrc>dataModel</datasrc>
</moveObject>'
```

---

## POST /upload/{container_id} <a id="postv1upload"></a>

**Upload a file**

Uploads a file to a container, creating a new object. Similar to
`POST /objects/{container_id}` but uses a different URL pattern. Returns the Atom
entry of the new object.

To append to an existing stream rather than create, see
`POST /upload/{group_id}/{container_id}/{md5}`.

### Request

`POST https://api.cloudbackend.com/v1/upload/{container_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `container_id` | path | yes | integer |  |
| `X-Content-Type` | header | no | string | The MIME type of the uploaded file |
| `X-File-Name` | header | no | string | The filename for the uploaded file |

#### Body

`application/octet-stream` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | File uploaded |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>{filename}</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
  <atom:link rel="alternate" type="{mime_type}" href="https://api.cloudbackend.com/v1/objects/{container_id}/{object_id}/1" length="{bytes}" stream_1_length="{bytes}" />
  <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
  <dc:container>{container_id}</dc:container>
  <dc:object>{object_id}</dc:object>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/upload/{container_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "X-Content-Type: {x-content-type}" \
  -H "X-File-Name: {x-file-name}" \
  -H "Content-Type: application/octet-stream; charset=utf-8"
```

---

## GET /metadataextract <a id="getv1metadataextract"></a>

**Extract object metadata**

Extracts metadata from an object (e.g. media file metadata like dimensions, duration).

### Request

`GET https://api.cloudbackend.com/v1/metadataextract`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the file. |
| `filename` | query | no | string | Name of the file to extract metadata from. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Extracted metadata |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<extractMetadataResponse>`

```xml
<extractMetadataResponse><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd"><atom:title>white.mp4</atom:title><atom:published>{datetime}</atom:published><atom:updated>{datetime}</atom:updated><atom:link rel="alternate" type="video/mp4" href="https://api.cloudbackend.com/v1/..." length="1537" stream_1_length="1537"/><atom:id>mid:1000005a7@xios.xcerion.com</atom:id><dc:folder>{container_id}</dc:folder><dc:document>{object_id}</dc:document><dc:width>320</dc:width><dc:height>200</dc:height><dc:thumbnail>32769</dc:thumbnail></atom:entry>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/metadataextract" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /editurl <a id="getv1editurl"></a>

**Get an external editor URL for an object**

Returns editing URLs for an object in the external editors. A single call queries
both providers, so the response body contains a `getZohoEditUrlResponse` element
followed by a `getPixlrEditUrlResponse` element.

Pass `objectid=0` to create a new document.

Each returned URL embeds a save key. When the user finishes editing, the editor
posts the document back to
`/zoho/{save_key}` or
`/pixlr/{save_key}`, which the service
handles — a client does not call those itself.

### Request

`GET https://api.cloudbackend.com/v1/editurl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. Defaults to 0. |
| `objectid` | query | no | integer · default `0` | Object to edit, or 0 to create a new document. Defaults to 0. |
| `editor` | query | no | string · one of `writer`, `sheet`, `show` · default `writer` | Which editor to open the object in. Defaults to `writer`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Editor URLs. Both provider responses are emitted, one after the other, so the payload is not a single well-formed XML document with one root element. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
<getZohoEditUrlResponse>
  <url>{zoho_edit_url}</url>
</getZohoEditUrlResponse>
<getPixlrEditUrlResponse>
  <url>{pixlr_edit_url}</url>
</getPixlrEditUrlResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/editurl" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /objectacl <a id="getv1objectacl"></a>

**Get object ACL**

Returns the ACL for an object.

### Request

`GET https://api.cloudbackend.com/v1/objectacl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `containerid` | query | no | integer · default `0` | Container holding the object. Defaults to 0. |
| `objectid` | query | no | integer · default `0` | Object whose ACL is returned. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Object ACL |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getObjectACLResponse>`

```xml
<getObjectACLResponse>
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  </acl>
</getObjectACLResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/objectacl" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /objectacl <a id="putv1objectacl"></a>

**Set object ACL**

Sets the ACL permissions for an object. The `tag` attribute carries the ACL tag
read from a preceding GET and is used for optimistic concurrency, as on
`/containeracl`.

### Request

`PUT https://api.cloudbackend.com/v1/objectacl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<setObjectACL>`

```xml
<setObjectACL>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1" />
  </acl>
</setObjectACL>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | ACL updated |
| `401` | Unauthorized |
| `403` | Access denied |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<setObjectACLResponse>`

```xml
<setObjectACLResponse>
  <acl tag="{new_acl_tag}" />
</setObjectACLResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/objectacl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<setObjectACL>
  <container id="{container_id}" />
  <object id="{object_id}" />
  <acl tag="{acl_tag}">
    <user id="{user_id}" read="0" write="0" delete="1" changeACL="1" />
  </acl>
</setObjectACL>'
```

---

## PUT /touchkey <a id="putv1touchkey"></a>

**Touch a key**

Updates the modification timestamp of a key in a keyring and sends a keyring
notification for it. This is the REST form of the SOAP action `touchKey`. See
`/keys/{user_id}` for the keyring itself.

| Element | Description |
|---|---|
| `<user id="…"/>` | Owner of the keyring. Required, and must be the caller. |
| `<key id="…"/>` | Key to touch. Required ("Missing key ID."). |

The response is the bare text `OK`, without a wrapper element.

### Request

`PUT https://api.cloudbackend.com/v1/touchkey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<touchKey>`

```xml
<touchKey>
  <key id="{key_id}" />
  <user id="{user_id}" />
</touchKey>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Key touched |
| `400` | Bad Request — `<user id>` or `<key id>` missing. |
| `401` | Unauthorized |
| `403` | Forbidden — "Keyring access denied." The user is not the caller. |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
OK
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/touchkey" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<touchKey>
  <key id="{key_id}" />
  <user id="{user_id}" />
</touchKey>'
```

---

## POST /zoho/{save_key} <a id="postv1zohosave"></a>

**Zoho editor save callback**

Receives an edited document back from the Zoho editor and saves it into the
container the edit session was opened for. No CloudBackend PaaS login is
required; the save key authorizes the call.

`{save_key}` identifies the edit session. It is issued by
`GET /editurl`, which returns the full
callback URL inside `<getZohoEditUrlResponse>`; a client does not construct this
URL itself. The key is an encrypted token holding the identity, container and
object of the session and is valid for 12 hours. The path accepts exactly one
segment — anything with an embedded `/` returns 404.

This endpoint is called by the Zoho editor, not by API clients. It is documented
so the `/editurl` flow is complete.

The body is `multipart/form-data` with the fields `filename`, `format` and
`content` (the file data). If `filename` does not already end with `format`, the
server appends `.{format}`. The file is stored as a new object with that name in
the session's container, acting as the identity in the key, which needs write
access to the container. On success the response is the plain text
`{name} saved.` with content type `application/text`.

### Request

`POST https://api.cloudbackend.com/v1/zoho/{save_key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `save_key` | path | yes | string | Edit-session key issued by `GET /editurl`. A single path segment. |

#### Body

`multipart/form-data` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Document saved |
| `400` | Save key cannot be decrypted, or the `Content-Type` has no boundary |
| `403` | The identity in the save key has no write access to the container |
| `404` | Unknown or expired save key, or the path contained more than one segment |
| `411` | Missing `Content-Length` header |
| `413` | File exceeds the allowed size for the container |
| `415` | Body is not `multipart/form-data` |
| `500` | Internal Server Error |

#### `200` · application/text

```text
report.doc saved.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/zoho/{save_key}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: multipart/form-data; charset=utf-8"
```

---

## GET /pixlr/{save_key} <a id="getv1pixlrsave"></a>

**Pixlr editor load and save callback**

Callback used by the Pixlr image editor; it is called by Pixlr, not by API
clients, and needs no credentials — the `{save_key}` itself authorizes the
call. The key is issued by
`GET /editurl`, which embeds this URL
(as both `image=` and `target=`) in the Pixlr edit URL with `method=GET`; a
client does not construct it. The key is encrypted, identifies the identity,
container and object the edit session was opened for, and expires 12 hours
after it was issued.

- **Load** (no query parameters): returns the object's default stream (the
  image to edit) with its content type and an `ETag`.
- **Save** (`image`, `type` and `title`): the server downloads the edited image
  from the `image` URL and stores it as a new object named `{title}.{type}` in
  the same container, as the identity that opened the edit session (which needs
  write access to the container). Returns `200` with an empty body.

If only some of `image`, `type` and `title` are present, or Pixlr's image URL
cannot be fetched, it returns `500`.

### Request

`GET https://api.cloudbackend.com/v1/pixlr/{save_key}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `save_key` | path | yes | string | Edit-session key issued by `GET /editurl`. A single path segment. |
| `image` | query | no | string | Save step. URL on Pixlr's server where the edited image can be downloaded. |
| `type` | query | no | string | Save step. File extension of the edited image (for example `png`), appended to `title`. |
| `title` | query | no | string | Save step. Name for the saved object, without extension. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Load returns the image stream; save returns an empty body |
| `400` | The save key could not be decrypted |
| `403` | The identity that opened the edit session has no write access to the container |
| `404` | Expired or malformed save key, or the path contained more than one segment |
| `500` | Incomplete save parameters, or the edited image could not be fetched from Pixlr |

#### `400` · text/plain

```text
Invalid savekey. This incident has been logged.
```

#### `500` · text/plain

```text
Could not save document from Pixlr
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/pixlr/{save_key}"
```

---

## POST /pixlr/{save_key} <a id="postv1pixlrsave"></a>

**Pixlr editor save callback (POST, not implemented)**

Not implemented in the current code: the handler only implements `GET`, and
Pixlr is told to use `method=GET`, so a `POST` to this path is rejected. Use the
`GET` operation on this path, which handles both loading and saving.

No request body.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`POST https://api.cloudbackend.com/v1/pixlr/{save_key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `save_key` | path | yes | string | Edit-session key issued by `GET /editurl`. A single path segment. |

### Responses

| Status | Meaning |
| --- | --- |
| `404` | Unknown save key, or the path contained more than one segment |
| `405` | Method not allowed — only GET is implemented |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/pixlr/{save_key}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /upload/{group_id}/{container_id}/{md5} <a id="postv1uploadappend"></a>

**Append a file to an object's main stream**

Appends an uploaded file to the end of an existing object's main stream (stream
1), rather than creating a new object.
`POST /upload/{container_id}` is the create
form.

Despite the parameter names in this path, the three segments are, in order: the
**container** holding the object, the **object**, and the current **MD5** of the
object's main stream. The segments may be separated by `/` or `;`.

The MD5 works as an optimistic-concurrency check: the server compares it with
the digest of the main stream as stored now, and refuses the append with `400`
("Checksum mismatch. Expected …", followed by the current digest) when they
differ, for example because someone else changed the object in the meantime.

The file is sent as `multipart/form-data`. Like `/upload/{container_id}`, the
request passes through the upload proxy in front of the API, which stores the
file part and hands it to the server; resumable uploads with `X-Content-Range`
and `Session-ID` headers are supported by that proxy. A `Content-Length` header
is required and the size must be within the drive's maximum file size.

The caller needs write access to the container (otherwise `403`, "Folder access
denied."). The response is the object's updated Atom entry.

### Request

`POST https://api.cloudbackend.com/v1/upload/{group_id}/{container_id}/{md5}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Despite its name, the id of the container holding the object. |
| `container_id` | path | yes | integer | Despite its name, the id of the object whose main stream is appended to. |
| `md5` | path | yes | string · pattern `^[a-fA-F0-9]{32}$` | Current MD5 digest of the object's main stream, as 32 hexadecimal characters. The append is refused when it does not match. |

#### Body

`multipart/form-data` (required)

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Data appended; the body is the object's updated Atom entry. |
| `400` | Bad Request — "Checksum mismatch. Expected {md5}", or a missing boundary in `Content-Type`. |
| `401` | Unauthorized |
| `403` | Forbidden — "Folder access denied." |
| `404` | Not Found — the object or its main stream does not exist. |
| `411` | Length Required — "Missing Content-Length header." |
| `413` | Request Entity Too Large — the size exceeds the drive's maximum file size. |
| `415` | Unsupported Media Type — the body is not `multipart/form-data`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<entry>`

```xml
<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd">
  <atom:title>{file_name}</atom:title>
  <atom:published>{datetime}</atom:published>
  <atom:updated>{datetime}</atom:updated>
  <atom:link rel="alternate" type="{mime_type}" href="https://api.cloudbackend.com/v1/documents/{container_id}/{object_id}/1" length="{bytes}" stream_1_length="{bytes}" />
  <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
  <dc:folder>{container_id}</dc:folder>
  <dc:document>{object_id}</dc:document>
</atom:entry>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/upload/{group_id}/{container_id}/{md5}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: multipart/form-data; charset=utf-8"
```

---
