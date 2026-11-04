# REST API — Share

2 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /availableshares <a id="getv1availableshares"></a>

**List available shares**

Lists shares available to the current user.

### Request

`GET https://api.cloudbackend.com/v1/availableshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<listAvailableShares>`

```xml
<listAvailableShares>
</listAvailableShares>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Available shares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listAvailableSharesResponse>`

```xml
<listAvailableSharesResponse>
  <shares>
    <share id="{share_id}" owner="{user_id}" created="{datetime}" description="Share 1">
      <folders>
        <folder parent="{container_id}" child="{container_id}" name="ShareFolder1" content=""/>
        <folder parent="{container_id}" child="{container_id}" name="ShareFolder2" content=""/>
        <folder parent="{container_id}" child="{container_id}" name="ShareFolder3" content=""/>
      </folders>
      <documents>
        <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
          <os:totalResults>3</os:totalResults>
          <os:startIndex>0</os:startIndex>
          <os:itemsPerPage>3</os:itemsPerPage>
          <atom:entry>
            <atom:title>file1.txt</atom:title>
            <atom:published>{datetime}</atom:published>
            <atom:updated>{datetime}</atom:updated>
            <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
            <atom:id>mid:1000005a9@xios.xcerion.com</atom:id>
            <dc:folder>{container_id}</dc:folder>
            <dc:document>{object_id}</dc:document>
          </atom:entry>
          <atom:entry>
            <atom:title>file2.txt</atom:title>
            <atom:published>{datetime}</atom:published>
            <atom:updated>{datetime}</atom:updated>
            <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
            <atom:id>mid:1000005aa@xios.xcerion.com</atom:id>
            <dc:folder>{container_id}</dc:folder>
            <dc:document>{object_id}</dc:document>
          </atom:entry>
          <atom:entry>
            <atom:title>file3.txt</atom:title>
            <atom:published>{datetime}</atom:published>
            <atom:updated>{datetime}</atom:updated>
            <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
            <atom:id>mid:1000005ab@xios.xcerion.com</atom:id>
            <dc:folder>{container_id}</dc:folder>
            <dc:document>{object_id}</dc:document>
          </atom:entry>
        </atom:feed>
      </documents>
    </share>
    <share id="{share_id}" owner="{user_id}" created="{datetime}" description="Share 2">
      <folders>
        <folder parent="{container_id}" child="{container_id}" name="ShareFolder3" content=""/>
      </folders>
      <documents>
        <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
          <os:totalResults>1</os:totalResults>
          <os:startIndex>0</os:startIndex>
          <os:itemsPerPage>1</os:itemsPerPage>
          <atom:entry>
            <atom:title>file3.txt</atom:title>
            <atom:published>{datetime}</atom:published>
            <atom:updated>{datetime}</atom:updated>
            <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
            <atom:id>mid:1000005ab@xios.xcerion.com</atom:id>
            <dc:folder>{container_id}</dc:folder>
            <dc:document>{object_id}</dc:document>
          </atom:entry>
        </atom:feed>
      </documents>
    </share>
  </shares>
</listAvailableSharesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/availableshares" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<listAvailableShares>
</listAvailableShares>'
```

---

## GET /sharelist <a id="getv1sharelist"></a>

**Get share details**

Gets detailed information about a share including its folders and objects.

### Request

`GET https://api.cloudbackend.com/v1/sharelist`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `shareid` | query | no | integer · default `0` | Share to describe. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Share details |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listShareResponse>`

```xml
<listShareResponse>
  <share id="{share_id}" owner="{user_id}" created="{datetime}" description="Share 1">
    <folders>
      <folder parent="{container_id}" child="{container_id}" name="ShareFolder1" content=""/>
      <folder parent="{container_id}" child="{container_id}" name="ShareFolder2" content=""/>
      <folder parent="{container_id}" child="{container_id}" name="ShareFolder3" content=""/>
    </folders>
    <documents>
      <atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:ni="http://xcerion.com/noindex.xsd">
        <os:totalResults>3</os:totalResults>
        <os:startIndex>0</os:startIndex>
        <os:itemsPerPage>3</os:itemsPerPage>
        <atom:entry>
          <atom:title>file1.txt</atom:title>
          <atom:published>{datetime}</atom:published>
          <atom:updated>{datetime}</atom:updated>
          <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
          <atom:id>mid:1000005a9@xios.xcerion.com</atom:id>
          <dc:folder>{container_id}</dc:folder>
          <dc:document>{object_id}</dc:document>
        </atom:entry>
        <atom:entry>
          <atom:title>file2.txt</atom:title>
          <atom:published>{datetime}</atom:published>
          <atom:updated>{datetime}</atom:updated>
          <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
          <atom:id>mid:1000005aa@xios.xcerion.com</atom:id>
          <dc:folder>{container_id}</dc:folder>
          <dc:document>{object_id}</dc:document>
        </atom:entry>
        <atom:entry>
          <atom:title>file3.txt</atom:title>
          <atom:published>{datetime}</atom:published>
          <atom:updated>{datetime}</atom:updated>
          <atom:link rel="alternate" type="text/plain; charset=ISO-8859-9" href="https://api.cloudbackend.com/v1/..." length="6" stream_1_length="6"/>
          <atom:id>mid:1000005ab@xios.xcerion.com</atom:id>
          <dc:folder>{container_id}</dc:folder>
          <dc:document>{object_id}</dc:document>
        </atom:entry>
      </atom:feed>
    </documents>
  </share>
</listShareResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/sharelist" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
