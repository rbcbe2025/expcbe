# REST API — Authentication

15 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /login <a id="postv1login"></a>

**Log in**

Logs in an identity and returns its profile, a new session token and the
drives and group tree it belongs to. This is normally the first call a client
makes.

**Credentials** are checked before the call runs, from the `Authorization`
header:

- HTTP Basic (`Basic base64(username:password)`). The username may also be the
  identity's e-mail address when it is unique within the tenant.
- HTTP Digest.
- An existing session token: `WRAP access_token=<session>` (or the
  `?access_token=` / `?session=` query parameter).
- A tenant OAuth2 access token: `Bearer <JWT>` issued by the tenant's Keycloak
  realm.

The **tenant** is identified by the `tenant` request header (or the `?tenant=`
query parameter, a `tenant` cookie, or the host name). A missing or unknown
tenant returns `400 Missing or invalid tenant`.

**Session token.** Every successful call creates a new session; its token is
returned in `<session>`. Send it as `Authorization: WRAP access_token=<session>`
on later calls instead of the password. End it with
`POST /logout`.

**MFA.** If the identity has e-mail MFA turned on, a login with username and
password but without `<code>` generates a code, e-mails it to the identity and
returns `401 Missing mfa code` (error number 7130). Repeat the call with the
code in `<code>` to finish the login; a wrong or expired code returns
`401 Invalid mfa code` (7131). A login that uses a session token which was
itself created after MFA does not need a code again. Sending a `<code>` for an
identity without MFA returns `400`.

**Request body.** An XML document with any root element (by convention
`<login/>`) and the `Content-Type` `application/xml` or `text/xml`; another
content type returns `415`. Optional child elements:

- `<code>` — the e-mailed MFA code.
- `<client>` — a client name, stored as the `client` attribute of
  `<lastlogin>`.
- `<tenant_client>` — a client name stored for the tenant's login statistics.

**Response.** `<loginResponse>` with `<userid>`, `<username>`, `<firstname>`,
`<lastname>`, `<locale>`, `<lastlogin client="">` (previous login time),
`<logins>` (login count), the ids of the identity's system containers
(`<home>`, `<library>`, `<in>`, `<out>`), `<contacts>` (contacts group id),
`<settings>`, `<params>` (an XML fragment), `<session>`, `<pollinterval>`
(seconds), `<verified>` (verification time, empty if not verified), `<eula>`,
`<drives>` and the identity's group tree (`<group>` with tenant groups and
roles). Depending on the account it also contains `<branding>` (tenant
branding; omitted for the legacy default tenant), `<managed>` (account managed
by an external marketplace), `<externalPayment>`, `<associatedAccount>`,
`<adminAccount>` and `<businessAccount>`.

The login response is not renamed to the public naming: drive and group
entries carry `folderId` (the container id) exactly as shown in the example.

### Request

`POST https://api.cloudbackend.com/v1/login`

Authenticates the caller — no session token yet. Send HTTP basic credentials.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `Authorization` | header | no | string | Authentication credentials. Can be: - HTTP Basic (base64-encoded `user:password`) - HTTP Digest - Session token: `WRAP access_token=<session_token>` - Tenant OAuth2 token: `Bearer <JWT>` |

#### Body

`application/xml` (required), root element `<login>`

*Log in*

```xml
<login />
```

*Log in with the e-mailed MFA code*

```xml
<login>
  <code>{mfa_code}</code>
</login>
```

*Log in and record the client name*

```xml
<login>
  <client>my-app</client>
</login>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Logged in |
| `400` | Missing or invalid tenant, malformed body, or an MFA code sent for an identity without MFA |
| `401` | Unauthorized |
| `403` | Account suspended or not activated (raised during authentication) |
| `415` | Content-Type is not `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<loginResponse>`

```xml
<loginResponse>
  <userid>12884901977</userid>
  <username>testTenantCBE</username>
  <firstname>test</firstname>
  <lastname>tenant</lastname>
  <locale>en_US</locale>
  <lastlogin client="">2026-08-06T13:24:45Z</lastlogin>
  <logins>70</logins>
  <home>8589935539</home>
  <library>8589935540</library>
  <in>8589935541</in>
  <out>8589935542</out>
  <contacts>17179869476</contacts>
  <settings>xios</settings>
  <params />
  <session>4dbdf238d75385e6fe2b3ed36f2d1fd4</session>
  <pollinterval>10</pollinterval>
  <verified />
  <branding partner="cloudbackend" bgcolor="" hcolor="" href="" visible="false" />
  <eula version="1200" accepted="2023-08-30T11:04:51Z" />
  <drives>
    <drive>
      <driveId>30064771318</driveId>
      <ownerId isGroupId="false">12884901977</ownerId>
      <folderId>8589935539</folderId>
      <sysname>xios</sysname>
      <name />
      <system>home</system>
      <currentSize>2515108</currentSize>
      <quotaLimit>104857600</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>2023-08-30T11:04:51Z</created>
    </drive>
    <drive>
      <driveId>30064771319</driveId>
      <ownerId isGroupId="false">12884901977</ownerId>
      <folderId>8589935540</folderId>
      <sysname>lib</sysname>
      <name />
      <system>library</system>
      <currentSize>0</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>2023-08-30T11:04:51Z</created>
    </drive>
    <drive>
      <driveId>30064771320</driveId>
      <ownerId isGroupId="false">12884901977</ownerId>
      <folderId>8589935541</folderId>
      <sysname>in</sysname>
      <name />
      <system>incoming</system>
      <currentSize>152</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>2023-08-30T11:04:51Z</created>
    </drive>
    <drive>
      <driveId>30064771321</driveId>
      <ownerId isGroupId="false">12884901977</ownerId>
      <folderId>8589935542</folderId>
      <sysname>out</sysname>
      <name />
      <system>outgoing</system>
      <currentSize>879</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>2023-08-30T11:04:51Z</created>
    </drive>
  </drives>
  <group id="17179869184" name="cbe">
    <group id="17179869480" memberId="12884901979" driveId="30064771322" folderId="8589935543" name="testtenantcbe" alias="testTenantCBE" owner="true" tenantgroup="true">
      <group id="17179869481" role="Owner" />
      <group id="17179869482" role="Administrator" />
    </group>
    <group id="17186674102" memberId="12884901978" driveId="30064771301" folderId="8589935518" name="cloudbackend" alias="testTenantCBE" tenantgroup="true" />
  </group>
</loginResponse>
```

#### `400` · text/plain

```text
Missing or invalid tenant
```

#### `401` · text/plain

*Invalid username or password*

```text
Invalid username or password
```

*Missing or invalid session token*

```text
You need to provide credentials to access this resource
```

*MFA is on and no code was sent (a code has been e-mailed)*

```text
Missing mfa code
```

*Wrong or expired MFA code*

```text
Invalid mfa code
```

*The account is suspended*

```text
Account suspended
```

#### `403` · text/plain

```text
Account not activated
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/login" \
  -u "{username}:{password}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<login />'
```

---

## DELETE /login <a id="deletev1login"></a>

**Log out (no-op)**

Kept for compatibility with the SOAP `logoff` action. It authenticates the
caller and returns an empty `<logoffResponse>`, but it does **not** invalidate
the session token in the current code. To end a session, call
`POST /logout` with the token, or
`DELETE /sessions` to end all
sessions of the identity.

The request needs an XML body (any root element, e.g. `<logoff/>`) with the
`Content-Type` `application/xml` or `text/xml`; another content type returns
`415`.

### Request

`DELETE https://api.cloudbackend.com/v1/login`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<logoff>`

```xml
<logoff/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Empty logoff response |
| `401` | Unauthorized |
| `415` | Content-Type is not `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<logoffResponse>`

```xml
<logoffResponse></logoffResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/login" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<logoff/>'
```

---

## GET /sessions <a id="getv1sessions"></a>

**List active sessions**

Lists all active sessions for the authenticated user.

### Request

`GET https://api.cloudbackend.com/v1/sessions`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of sessions |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<sessions>`

```xml
<sessions>
  <totalResults>{count}</totalResults>
  <user-session sessionId="{session_id}" userId="{user_id}" />
</sessions>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/sessions" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /sessions <a id="deletev1sessions"></a>

**Delete all sessions**

Deletes all active sessions for the current user. Returns the number of sessions deleted.

### Request

`DELETE https://api.cloudbackend.com/v1/sessions`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Number of sessions deleted |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
3
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/sessions" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /sessions <a id="postv1sessions"></a>

**End the current session**

Same handler as `POST /logout`: ends the
session whose token is used to make this call. The call must be authenticated with
a session token (`Authorization: WRAP access_token=<session>`); that token is
deleted and can no longer be used. Other sessions of the identity stay valid — use
`DELETE /sessions` to end them all.

Returns the bare text `success`. If the call was authenticated in another way
(Basic or Digest), it returns `404 Requires token login`; if the session no longer
exists, `404 Session not found`. No request body.

### Request

`POST https://api.cloudbackend.com/v1/sessions`

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
curl -X POST "https://api.cloudbackend.com/v1/sessions" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /auth <a id="postv1auth"></a>

**Authenticate SyncML user**

Verifies the credentials of a SyncML client. This call does not require a session;
it returns 204 when the credentials are valid and an error otherwise. It does not
create a session.

The body root must be `<syncML>` with the child elements `<username>`, `<digest>` and
`<nonce>`, all required:

- `<nonce>` is a nonce chosen by the client.
- `<digest>` is `base64(md5(userDigest + ":" + nonce))`, where `userDigest` is
  `base64(md5(lower-case username + ":" + password))`.

The user is looked up in the tenant named by the `tenant` query parameter. If that
tenant does not allow free users, identities on the `FREE` account type are refused.

### Request

`POST https://api.cloudbackend.com/v1/auth`

The specification does not say whether this operation needs a session token; it declares no security scheme anywhere. Try it without one first.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant` | query | no | string | Name of the tenant the user belongs to. An unknown tenant returns 404. |

#### Body

`application/xml` (required), root element `<syncML>`

```xml
<syncML>
  <username>{username}</username>
  <digest>{digest}</digest>
  <nonce>{nonce}</nonce>
</syncML>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Credentials are valid |
| `400` | Bad Request — the body is not well-formed XML |
| `403` | Forbidden — `Authentication failed`, or `Free users can't use this API` |
| `404` | Not Found — `Tenant not found` or `User not found` |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `422` | Unprocessable Entity — `Invalid root element: …` or `Required syncML element(s) missing` |
| `500` | Internal Server Error |

#### `403` · text/plain

```text
Authentication failed
```

#### `404` · text/plain

```text
User not found
```

#### `422` · text/plain

```text
Required syncML element(s) missing
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/auth" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<syncML>
  <username>{username}</username>
  <digest>{digest}</digest>
  <nonce>{nonce}</nonce>
</syncML>'
```

---

## GET /logout <a id="getv1logout"></a>

**List active sessions (alias of /sessions)**

Same handler as `GET /sessions`:
lists all active sessions of the authenticated identity. Prefer `/sessions`.

### Request

`GET https://api.cloudbackend.com/v1/logout`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of sessions |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<sessions>`

```xml
<sessions>
  <totalResults>1</totalResults>
  <user-session sessionId="{session_id}" userId="{user_id}" />
</sessions>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/logout" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /logout <a id="deletev1logout"></a>

**Delete all sessions (alias of /sessions)**

Same handler as `DELETE /sessions`:
ends all active sessions of the authenticated identity and returns the number of
sessions deleted as plain text. Prefer `/sessions`.

No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/logout`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Number of sessions deleted |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
3
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/logout" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /userauth <a id="getv1userauth"></a>

**Validate user and get HA1 session**

Validates the logged-in identity and returns an `HA1` session key (`HAS`) in an
`<auth>` element.

The `HAS` can be exchanged exactly once, within 5 minutes, for the identity's
`HA1` digest hash through the OpenID login handler
(`GET /openidlogin?op=login&has={HAS}`). The session is deleted when it is used.

No request body.

### Request

`GET https://api.cloudbackend.com/v1/userauth`

The specification does not say whether this operation needs a session token; it declares no security scheme anywhere. Try it without one first.

### Responses

| Status | Meaning |
| --- | --- |
| `200` | HA1 session key |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<auth>`

```xml
<auth>f086476c2100b3936106cb6ef39cd684</auth>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/userauth" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /openidlogin <a id="getv1openidlogin"></a>

**OpenID 2.0 login (AppDirect marketplace)**

Browser endpoint for signing in through an OpenID 2.0 provider, used by the
AppDirect marketplace integration. It is called by the browser and the
provider, not with the `Authorization: WRAP access_token=…` scheme the rest of
this API uses; no credentials are needed. The `op` query parameter selects the
step:

1. **Initiate** (no `op`): `?openid={identifier}` starts the flow. The server
   sets an `ht_session` cookie and answers `303 See Other` with a `Location`
   pointing at the OpenID provider (return URL `/openidlogin?op=confirm&asid=…`).
   A missing `openid` returns `400`.
2. **Confirm** (`op=confirm`): the provider redirects the browser back here with
   its `openid.*` response parameters. When the asserted identity belongs to a
   CloudBackend identity, the server creates a one-time HA1 session and answers
   `303` to the configured web UI URL with `?u={username}&has={has}&openid={identifier}`.
   If no identity is linked to the OpenID it returns `500` with the text
   `No user for this open-id … was found`; if the provider response has no
   identity, `500 No openid identity was found`.
3. **Login** (`op=login`): `?op=login&has={has}` returns the identity's HA1
   digest hash as plain text, which the web UI uses to sign in. The `has` value
   can be used only once; an unknown or used value returns `403`, a missing one
   `400 Missing session`.

If initiating or confirming throws, the server answers `303` to
`/en/?msg=loginFailed&msg2={error message}` instead.

### Request

`GET https://api.cloudbackend.com/v1/openidlogin`

The specification does not say whether this operation needs a session token; it declares no security scheme anywhere. Try it without one first.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `op` | query | no | string · one of `confirm`, `login` | Step of the flow. Omit it to initiate; `confirm` handles the provider's redirect back; `login` exchanges a one-time `has` value for the HA1 hash. |
| `openid` | query | no | string | OpenID identifier to sign in with. Required when `op` is omitted. |
| `has` | query | no | string | One-time HA1 session id from the confirm redirect. Required when `op=login`. |
| `asid` | query | no | string | Association id the server adds to its own return URL; sent back by the provider with `op=confirm`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `op=login`: the identity's HA1 hash |
| `303` | Redirect to the OpenID provider (initiate), to the web UI (confirm), or to the login-failed page |
| `400` | Missing `openid` (initiate) or missing `has` (login) |
| `403` | `op=login` with an unknown or already used `has` |
| `500` | No identity linked to the OpenID, or no identity in the provider response |

#### `200` · text/plain

```text
{ha1}
```

#### `400` · text/plain

*Initiate without openid*

```text
Missing ?openid={openid} in endpoint configuration on AppDirect Marketplace
```

*op=login without has*

```text
Missing session
```

#### `500` · text/plain

```text
No openid identity was found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/openidlogin" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /keycloak <a id="getv1keycloak"></a>

**Keycloak login entry point**

Not implemented in the current code: the `/keycloak` resource only implements POST
(initialize Keycloak for the tenant), so a GET answers 405 Method Not Allowed. The route
also matches paths below `/keycloak/` and the matrix form `/keycloak;...`.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`GET https://api.cloudbackend.com/v1/keycloak`

The specification does not say whether this operation needs a session token; it declares no security scheme anywhere. Try it without one first.

### Responses

| Status | Meaning |
| --- | --- |
| `405` | Method Not Allowed |

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/keycloak" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /keycloak <a id="postv1keycloak"></a>

**Initialize Keycloak for the tenant**

Sets up Keycloak sign-in for the caller's tenant. Creates a Keycloak realm named after the
tenant, adds the `baxide.user.id` user attribute, trusts `127.0.0.1` and `localhost`, adds the
CloudBackend storage provider, and adds an optional `full` client scope.

Only the owner or an administrator of the tenant may call this. No request body; the response
is 200 with no body.

### Request

`POST https://api.cloudbackend.com/v1/keycloak`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Keycloak initialized. No response body. |
| `400` | `Not owner or admin of tenant`. |
| `401` | Unauthorized |
| `403` | The caller's current tenant is not the tenant they own or administer. |
| `500` | A Keycloak setup step failed. |

#### `400` · text/plain

```text
Not owner or admin of tenant
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/keycloak" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /oauthprovider <a id="getv1oauthprovider"></a>

**List enabled login providers**

Lists the external login (OAuth / OpenID Connect) providers enabled in the Keycloak
realm of the caller's tenant. Only the tenant Owner or an Administrator may call it
(`400 Not owner or admin of tenant` otherwise).

Each `<provider>` has the provider type (`id`), its `alias`, `displayname`,
`enabled` (`1`/`0`) and Keycloak's `internalID`.

A trailing slash is optional. No request body.

### Request

`GET https://api.cloudbackend.com/v1/oauthprovider`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Enabled providers |
| `400` | Bad Request — `Not owner or admin of tenant` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<providers>`

```xml
<providers>
  <provider id='google' alias='google' displayname='' enabled='1' internalID='89e83fc5-7c5c-435a-8777-d72f8a3b91ed'/>
  <provider id='oidc' alias='oidc' displayname='Placeholder OIDC' enabled='1' internalID='67227583-e6b6-49af-8e20-99ba3afeafc2'/>
</providers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/oauthprovider" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /oauthprovider <a id="postv1oauthprovider"></a>

**Enable a login provider**

Enables an external login provider in the Keycloak realm of the caller's tenant,
so identities can log in with it. Only the tenant Owner or an Administrator may
call it (`400 Not owner or admin of tenant` otherwise).

The body is a `<provider>` with the attributes `name` (alias of the provider in the
realm), `providerid` (provider type known to Keycloak, e.g. `google` or `github` —
see `GET /oauthproviders`), `clientid` and `secret` (the OAuth client credentials
issued by the provider). All four are required.

If the tenant has no Keycloak realm name, nothing is done. The response has no
body.

### Request

`POST https://api.cloudbackend.com/v1/oauthprovider`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<provider>`

```xml
<provider name="github" providerid="github" clientid="{client_id}" secret="{client_secret}"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Provider enabled |
| `400` | Bad Request — `Not owner or admin of tenant`, or a body that is not XML |
| `401` | Unauthorized |
| `422` | Unprocessable Entity — `Missing 'name' attribute`, `Missing 'providerid' attribute`, `Missing 'clientId' attribute` or `Missing 'secret' attribute` |
| `500` | Internal Server Error |

#### `422` · text/plain

```text
Missing 'secret' attribute
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/oauthprovider" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<provider name="github" providerid="github" clientid="{client_id}" secret="{client_secret}"/>'
```

---

## GET /oauthproviders <a id="getv1oauthproviders"></a>

**List supported login providers**

Lists the external login provider types that can be enabled with
`POST /oauthprovider`. Currently a fixed list: Google and Github. Requires a
logged-in identity.

A trailing slash is optional. No request body.

### Request

`GET https://api.cloudbackend.com/v1/oauthproviders`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Supported providers |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<providers>`

```xml
<providers>
  <provider name='Google' id='google'/>
  <provider name='Github' id='github'/>
</providers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/oauthproviders" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
