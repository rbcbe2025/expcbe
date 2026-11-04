# REST API — Webshare

2 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /wsauth/{user_id}/{webshare_id} <a id="postv1wsauth"></a>

**Authenticate for webshare**

Checks access to a webshare before its content is fetched. No CloudBackend PaaS
login is required.

If the webshare has no password, the call succeeds right away. If it is
password-protected, the request must carry an HTTP Digest `Authorization` header
computed with the webshare password (any user name is accepted). The response is
204 with no body on success; 401 when no Digest credentials are sent; 403 when the
password is wrong.

No request body.

### Request

`POST https://api.cloudbackend.com/v1/wsauth/{user_id}/{webshare_id}`

The specification does not say whether this operation needs a session token; it declares no security scheme anywhere. Try it without one first.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | string | Owner of the webshare, as a numeric identity id or a user name / e-mail address (looked up in the request's tenant). Prefix with `:` to force a name lookup. |
| `webshare_id` | path | yes | string | Webshare, as a numeric webshare id or the webshare name. Prefix with `:` to force a name lookup. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Access granted |
| `401` | Webshare is password-protected and no Digest credentials were sent |
| `403` | Digest credentials do not match the webshare password |
| `404` | User or webshare not found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/wsauth/{user_id}/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /ws2/{user_id} <a id="getv1ws2user"></a>

**List webshares for a user**

Lists all webshares owned by a user. Returns an Atom feed.

### Request

`GET https://api.cloudbackend.com/v1/ws2/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare listing |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<feed>`

```xml
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>1</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <!-- webshare entries -->
</atom:feed>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/ws2/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
