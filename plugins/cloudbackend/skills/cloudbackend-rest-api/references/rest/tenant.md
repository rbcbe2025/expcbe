# REST API — Tenant

68 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /emailrules/{organization_id} <a id="postv1emailrules"></a>

**Upload email rules**

Uploads the email rules of the caller's tenant, in the `<rules>` format that
`GET /emailrules/{organization_id}` returns.

The caller must be owner or administrator of the tenant. The `{organization_id}`
path segment is ignored — the caller's own tenant is always used, and
`POST /emailrules` works the same.

### Request

`POST https://api.cloudbackend.com/v1/emailrules/{organization_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `organization_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<emailrules>`

```xml
<emailrules>
<rule name="rule-name" type="forward" destination="user@example.com" />
</emailrules>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Email rules uploaded successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/emailrules/{organization_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<emailrules>
<rule name="rule-name" type="forward" destination="user@example.com" />
</emailrules>'
```

---

## GET /emailrules/{organization_id} <a id="getv1emailrules"></a>

**Get email rules**

Returns the tenant's email rules — the mails sent on events such as `signup` or
`share` — in the same `<rules>` format that
`POST /emailrules/{organization_id}`
uploads. Each `<rule>` names its `<event type>`, optional `<action>` elements and
the `<mail>` to send (name, group, sender, reply-to, subject and body).

The caller must be owner or administrator of the tenant. The `{organization_id}`
path segment is ignored — the caller's own tenant is always used, and
`GET /emailrules` works the same. No request body.

### Request

`GET https://api.cloudbackend.com/v1/emailrules/{organization_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `organization_id` | path | yes | integer | Ignored — the caller's own tenant is used. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The tenant's email rules |
| `400` | Bad Request — the caller is not owner or administrator of a tenant |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<rules>`

```xml
<rules>
  <rule created="{datetime}" updated="{datetime}">
    <event type="signup" />
    <action name="createVerificationLink" />
    <mail name="New user welcome mail" group="welcome" created="{datetime}" updated="{datetime}" deleted="">
      <description />
      <sender />
      <senderName />
      <replyTo />
      <replyToName />
      <subject>Welcome to TestTenant</subject>
      <body>
        <h1 />
        <p />
        <info align="left" title="Username" />
        <info align="left" title="Email" />
      </body>
    </mail>
  </rule>
  <rule created="{datetime}" updated="{datetime}">
    <event type="share" />
    <mail name="User shared notification" group="sharing" created="{datetime}" updated="{datetime}" deleted="">
      <description />
      <sender />
      <senderName />
      <replyTo />
      <replyToName />
      <subject>{$name} shared {$webshare}</subject>
      <body>
        <h1 />
        <p />
        <info title="Password" />
      </body>
    </mail>
  </rule>
</rules>
```

#### `400` · text/plain

```text
Not owner or admin of tenant
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/emailrules/{organization_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /accounttype/{tenant_id} <a id="getv1accounttype"></a>

**List account types**

Returns all account types of the caller's tenant. The caller must be owner or
administrator of the tenant. The `{tenant_id}` path segment is ignored — the
caller's own tenant is always used, and `GET /accounttype` works the same.

### Request

`GET https://api.cloudbackend.com/v1/accounttype/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of account types |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<accountTypes>`

```xml
<accountTypes>
  <accountType id="54" name="ACC1" uiName="Account #1" size="123456789" cloudosPerMonth="121314"/>
  <accountType id="55" name="ACC2" uiName="Account #2" size="0" cloudosPerMonth="123"/>
  <accountType id="56" name="ACC3" uiName="Hallåäöß" size="456" cloudosPerMonth="0"/>
  <accountType id="42" name="FREE" uiName="" size="104857600" cloudosPerMonth="0"/>
  <accountType id="57" name="X" uiName="Hallåäöß" size="456" cloudosPerMonth="0"/>
</accountTypes>
```

*With account types*

```xml
<accountTypes>
  <accountType id="" name="ACC1" uiName="Account #1" size="123456789" cloudosPerMonth="121314" />
  <accountType id="" name="ACC2" uiName="Account #2" size="0" cloudosPerMonth="123" />
  <accountType id="" name="FREE" uiName="" size="104857600" cloudosPerMonth="0" />
</accountTypes>
```

*Default (FREE only)*

```xml
<accountTypes>
  <accountType id="" name="FREE" uiName="" size="104857600" cloudosPerMonth="0" />
</accountTypes>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/accounttype/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /accounttype/{tenant_id} <a id="postv1accounttype"></a>

**Create an account type**

Creates an account type with name, UI name, size, and monthly cost. A name that
already exists gives `400 Account type already exists`; use `PUT` to change an
existing account type.

The caller must be owner or administrator of the tenant. The `{tenant_id}` path
segment is ignored — the caller's own tenant is always used, and
`POST /accounttype` works the same.

### Request

`POST https://api.cloudbackend.com/v1/accounttype/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<accountType>`

```xml
<accountType name="CAT1" uiName="Coupon Account Type 1" size="123456789" cloudosPerMonth="121314"/>
```

*Create Account*

```xml
<accountType name="ACC1" uiName="Account #1" size="123456789" cloudosPerMonth="121314" />
```

*Create Account*

```xml
<accountType name="ACC2" uiName="Account #2" size="0" cloudosPerMonth="123" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Account type created or updated |
| `400` | Invalid input |

#### `200` · application/xml · `<accountType>`

```xml
<accountType id="67" name="CAT1" uiName="Coupon Account Type 1" size="123456789" cloudosPerMonth="121314"/>
```

*Account*

```xml
<accountType id="" name="ACC1" uiName="Account #1" size="123456789" cloudosPerMonth="121314" />
```

*Account*

```xml
<accountType id="" name="ACC2" uiName="Account #2" size="0" cloudosPerMonth="123" />
```

#### `400` · text/plain

*Invalid name format*

```text
Invalid account type name. Must be 1-4 chars and no spaces, tabs or control chars
```

*Missing uiName*

```text
Missing uiName attribute
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/accounttype/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<accountType name="CAT1" uiName="Coupon Account Type 1" size="123456789" cloudosPerMonth="121314"/>'
```

---

## DELETE /accounttype/{tenant_id} <a id="deletev1accounttype"></a>

**Delete an account type**

Deletes an account type of the caller's tenant by name.

The caller must be owner or administrator of the tenant. The `{tenant_id}` path
segment is ignored — the caller's own tenant is always used, and
`DELETE /accounttype` works the same.

### Request

`DELETE https://api.cloudbackend.com/v1/accounttype/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<accountType>`

```xml
<accountType name="X" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Account type deleted successfully |
| `400` | Cannot delete built-in account type |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Can't delete the FREE account type
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/accounttype/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<accountType name="X" />'
```

---

## PUT /accounttype/{tenant_id} <a id="putv1accounttype"></a>

**Update an account type**

Updates an existing account type of the caller's tenant: its `uiName`, `size`
(storage in bytes), `cloudosPerMonth` (price) and `business` flag. The name itself
cannot be changed.

Identify the account type with `account_type_id` or, if that is left out, with
`name`. Attributes that are left out keep their current value. The same rules as
on create apply: a non-`FREE` type needs a non-empty `uiName`, and `FREE` must
keep an empty `uiName` and cost nothing.

The caller must be owner or administrator of the tenant. The `{tenant_id}` path
segment is ignored — the caller's own tenant is always used, and `PUT /accounttype`
works the same. Returns the updated account type.

### Request

`PUT https://api.cloudbackend.com/v1/accounttype/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Ignored — the caller's own tenant is used. |

#### Body

`application/xml` (required), root element `<accountType>`

*Identify by id*

```xml
<accountType account_type_id="{account_type_id}" uiName="create1" size="455" cloudosPerMonth="1" />
```

*Identify by name*

```xml
<accountType name="ACC3" uiName="Hallåäöß" size="456" cloudosPerMonth="0" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The updated account type |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<accountType>`

```xml
<accountType id='{account_type_id}' name='ACC3' uiName='create1' size='455' cloudosPerMonth='1'/>
```

#### `400` · text/plain

*Neither account_type_id nor name given*

```text
ID or Name required
```

*Non-FREE type without uiName*

```text
Missing uiName attribute
```

*Caller is not tenant owner or administrator*

```text
Not owner or admin of tenant
```

#### `404` · text/plain

```text
AccountType not found
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/accounttype/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<accountType account_type_id="{account_type_id}" uiName="create1" size="455" cloudosPerMonth="1" />'
```

---

## GET /locale <a id="getv1locale"></a>

**Get locale**

Returns the current locale setting.

### Request

`GET https://api.cloudbackend.com/v1/locale`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<getLocale>`

```xml
<getLocale />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Locale setting |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getLocaleResponse>`

```xml
<getLocaleResponse>
  <locale>en_US</locale>
</getLocaleResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/locale" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<getLocale />'
```

---

## PUT /locale <a id="putv1locale"></a>

**Set locale**

Sets the locale for the authenticated user.

### Request

`PUT https://api.cloudbackend.com/v1/locale`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<setLocale>`

```xml
<setLocale />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Locale updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<setLocaleResponse>`

```xml
<setLocaleResponse>
  OK
</setLocaleResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/locale" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<setLocale />'
```

---

## PUT /locales <a id="putv1locales"></a>

**Replace the strings of a locale**

Sets the translated UI strings of one locale for the caller's tenant. The tenant's
strings are used, for example, in e-mails and invoices sent by CloudBackend PaaS,
and override the built-in strings with the same key.

Send a `<locale code="…">` element with one child element per string: the element
name is the key, its text is the string. PUT first deletes all strings the tenant
has for that locale and then stores the ones in the body; use PATCH to change
only some keys. `code` must be the first attribute of `<locale>`.

This is not the same as `/locale`, which reads or sets the language of the logged
in identity. Only the owner or an administrator of the tenant may call it
(otherwise `400`, "Not owner or admin of tenant"). Returns `204 No Content`.

### Request

`PUT https://api.cloudbackend.com/v1/locales`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<locale>`

```xml
<locale code="sv_SE">
  <alpha>First value</alpha>
  <beta>Second value</beta>
</locale>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Strings of the locale replaced |
| `400` | Bad Request — "Updates not valid xml", "Locale xml must start with <locale code="..."", or "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — "Content-Type must be application/xml or text/xml". |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Locale xml must start with <locale code="..."
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/locales" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<locale code="sv_SE">
  <alpha>First value</alpha>
  <beta>Second value</beta>
</locale>'
```

---

## PATCH /locales <a id="patchv1locales"></a>

**Add or change strings of a locale**

Adds or overwrites some UI strings of one locale for the caller's tenant. Send a
`<locale code="…">` element with one child element per string (element name =
key, text = string). Keys that are not in the body are left unchanged.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"). Returns `204 No Content`.

### Request

`PATCH https://api.cloudbackend.com/v1/locales`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<locale>`

```xml
<locale code="sv_SE">
  <beta>Updated value</beta>
  <gamma>Third value</gamma>
</locale>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Strings added or changed |
| `400` | Bad Request — "Updates not valid xml", "Locale xml must start with <locale code="..."", or "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — "Content-Type must be application/xml or text/xml". |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Updates not valid xml
```

### Example

```bash
curl -X PATCH "https://api.cloudbackend.com/v1/locales" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<locale code="sv_SE">
  <beta>Updated value</beta>
  <gamma>Third value</gamma>
</locale>'
```

---

## GET /locales/{locale} <a id="getv1localeslocale"></a>

**Get the strings of a locale**

Returns all UI strings the caller's tenant has stored for one locale, sorted by
key, as `<locale code="…">` with one child element per key. Built-in strings are
not included. A locale without strings returns an empty `<locale code="…"/>`.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"). No request body.

### Request

`GET https://api.cloudbackend.com/v1/locales/{locale}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `locale` | path | yes | string | Locale code, for example `sv_SE` or `en`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The strings of the locale |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<locale>`

```xml
<locale code="sv_SE">
  <alpha>First value</alpha>
  <beta>Updated value</beta>
  <gamma>Third value</gamma>
</locale>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/locales/{locale}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /locales/{locale} <a id="deletev1localeslocale"></a>

**Delete all strings of a locale**

Deletes all UI strings the caller's tenant has stored for one locale; the
built-in strings apply again. Only the owner or an administrator of the tenant
may call it (otherwise `400`, "Not owner or admin of tenant"). No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/locales/{locale}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `locale` | path | yes | string | Locale code, for example `sv_SE`. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Strings deleted |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/locales/{locale}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /locales/{locale}/entries/{key} <a id="getv1localesentry"></a>

**Get one string of a locale**

Returns the text of one UI string as `text/plain`. The string is resolved the
same way CloudBackend PaaS resolves it when it uses it: the tenant's own string
for the locale wins, then the tenant's string for the base language (`sv` for
`sv_SE`), then the built-in strings for the locale, the base language and English.
So a key the tenant has not set can still return a built-in text. `404` (empty
body) if no text exists for the key.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"). No request body.

### Request

`GET https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `locale` | path | yes | string | Locale code, for example `sv_SE`. |
| `key` | path | yes | string | Key of the string. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The text of the string |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `404` | Not Found — no text for this key (empty body). |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Updated through entry endpoint
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /locales/{locale}/entries/{key} <a id="putv1localesentry"></a>

**Set one string of a locale**

Sets the text of one UI string of the caller's tenant. The request body is the raw
text (it is stored as sent, for example `text/plain; charset=utf-8`; markup is
not interpreted). Creates the key if it does not exist.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"). Returns `204 No Content`.

### Request

`PUT https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `locale` | path | yes | string | Locale code, for example `sv_SE`. |
| `key` | path | yes | string | Key of the string. |

#### Body

`text/plain` (required)

```text
<b>Updated</b> & <i>escaped</i>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | String set |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: text/plain; charset=utf-8" \
  -d '<b>Updated</b> & <i>escaped</i>'
```

---

## DELETE /locales/{locale}/entries/{key} <a id="deletev1localesentry"></a>

**Delete one string of a locale**

Deletes one UI string of the caller's tenant for the locale. Deleting a key that
does not exist also returns `204`. Only the owner or an administrator of the
tenant may call it (otherwise `400`, "Not owner or admin of tenant").
No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `locale` | path | yes | string | Locale code, for example `sv_SE`. |
| `key` | path | yes | string | Key of the string. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | String deleted |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/locales/{locale}/entries/{key}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /products/{tenant_id} <a id="getv1products"></a>

**List products**

Returns all products configured for the caller's tenant. The caller must be owner
or administrator of the tenant. The `{tenant_id}` path segment is ignored — the
caller's own tenant is always used, and `GET /products` works the same.

### Request

`GET https://api.cloudbackend.com/v1/products/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of products |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<products>`

```xml
<products>
  <product id="30" sub="0" EUR="100" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="54" amount="7" description="Product desc #1" parent_product_id="0" duration="8" productIdentifier="account-product2-file" name="name 1a"/>
  <product id="31" sub="0" EUR="1100" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="17" description="Product desc #2" parent_product_id="0" duration="18" productIdentifier="account-product3-file" name="name 2a"/>
  <product id="32" sub="0" EUR="2100" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="56" amount="27" description="Product desc #3" parent_product_id="0" duration="28" productIdentifier="account-product4-file" name="name 3a"/>
  <product id="33" sub="0" EUR="4100" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="56" amount="11" description="Product desc #5" parent_product_id="0" duration="5" productIdentifier="account-product5-file" name="name 4b"/>
  <product id="35" sub="0" EUR="200" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="58" amount="1" description="Product desc #6" parent_product_id="0" duration="12" productIdentifier="account-product6-file" name="name 6"/>
  <product id="36" sub="1" EUR="0" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="2" description="Product desc #6 (sub accounts)" parent_product_id="35" duration="12" productIdentifier="account-product6-file" name=""/>
  <product id="37" sub="0" EUR="300" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="59" amount="1" description="Product desc #6" parent_product_id="0" duration="12" productIdentifier="account-product6-file" name="name 6"/>
  <product id="38" sub="1" EUR="0" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="3" description="Product desc #6 (sub accounts)" parent_product_id="37" duration="12" productIdentifier="account-product6-file" name=""/>
  <product id="39" sub="0" EUR="500" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="60" amount="1" description="Product desc #6" parent_product_id="0" duration="12" productIdentifier="account-product6-file" name="name 6"/>
  <product id="40" sub="1" EUR="0" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="5" description="Product desc #6 (sub accounts)" parent_product_id="39" duration="12" productIdentifier="account-product6-file" name=""/>
  <product id="41" sub="0" EUR="700" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="61" amount="1" description="Product desc #6" parent_product_id="0" duration="12" productIdentifier="account-product6-file" name="name 6"/>
  <product id="42" sub="1" EUR="0" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="7" description="Product desc #6 (sub accounts)" parent_product_id="41" duration="12" productIdentifier="account-product6-file" name=""/>
  <product id="43" sub="0" EUR="1100" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="62" amount="1" description="Product desc #6" parent_product_id="0" duration="12" productIdentifier="account-product6-file" name="name 6"/>
  <product id="44" sub="1" EUR="0" USD="0" SEK="0" NOK="0" DKK="0" GBP="0" account_type_id="55" amount="11" description="Product desc #6 (sub accounts)" parent_product_id="43" duration="12" productIdentifier="account-product6-file" name=""/>
</products>
```

*With products*

```xml
<products>
  <product id="{product_id}"
           sub="0"
           EUR="100"
           USD="0"
           SEK="0"
           NOK="0"
           DKK="0"
           GBP="0"
           account_type_id="{account_type_id}"
           amount="7"
           description="Product desc #1"
           name="name 1a"
           parent_product_id="0"
           duration="8"
           productIdentifier="account-product2-file"/>
  <product id="{product_id}"
           sub="0"
           EUR="1100"
           USD="0"
           SEK="0"
           NOK="0"
           DKK="0"
           GBP="0"
           account_type_id="{account_type_id}"
           amount="17"
           description="Product desc #2"
           name="name 2a"
           parent_product_id="0"
           duration="18"
           productIdentifier="account-product3-file"/>
</products>
```

*No products*

```xml
<products>
</products>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/products/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /products/{tenant_id} <a id="postv1products"></a>

**Create or update a product**

Creates a product (a price plan entry) for the caller's tenant, or updates one when
the body carries the `id` of an existing product of the tenant. Returns the stored
product.

Body attributes of `<product>`:

- `account_type_id` (required) — an account type of the caller's tenant.
- `EUR`, `USD`, `SEK`, `NOK`, `DKK`, `GBP` — prices per currency (default 0).
- `amount`, `duration` (months), `description`, `name`.
- `sub` — `1` for a sub-account product, `0` (default) otherwise.
- `parent_product_id` — a product of the tenant this one belongs to (default 0).
- `subscription` — `true` for a recurring subscription; when left out, a product
  with `duration="1"` is a subscription and any other duration a one-time payment.
- `id` — set to update an existing product instead of creating one.

The caller must be owner or administrator of the tenant. The `{tenant_id}` path
segment is ignored — the caller's own tenant is always used, and `POST /products`
works the same.

### Request

`POST https://api.cloudbackend.com/v1/products/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Ignored — the caller's own tenant is used. |

#### Body

`application/xml` (required), root element `<product>`

*Create a product*

```xml
<product sub="0" EUR="1" USD="2" SEK="3" NOK="4" DKK="5" GBP="6"
         account_type_id="{account_type_id}" amount="7" description="Product desc #1"
         parent_product_id="0" duration="8" />
```

*Update an existing product*

```xml
<product id="{product_id}" sub="0" EUR="421" USD="422" SEK="423" NOK="424" DKK="425" GBP="426"
         account_type_id="{account_type_id}" amount="427" description="New Product desc #3"
         parent_product_id="0" duration="428" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The stored product |
| `400` | Bad Request |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<product>`

```xml
<product id='{product_id}' sub='0' EUR='1' USD='2' SEK='3' NOK='4' DKK='5' GBP='6' account_type_id='{account_type_id}' amount='7' description='Product desc #1' parent_product_id='0' duration='8' productIdentifier='' name=''/>
```

#### `400` · text/plain

*account_type_id missing*

```text
Missing account_type_id attribute
```

*account_type_id unknown or of another tenant*

```text
Invalid account_type_id
```

*id unknown or of another tenant (parent_product_id gives `Invalid parent product id`)*

```text
Invalid product id
```

*sub not 0 or 1*

```text
Invalid 'sub' attribute: must be 0 or 1
```

*Caller is not tenant owner or administrator*

```text
Not owner or admin of tenant
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/products/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<product sub="0" EUR="1" USD="2" SEK="3" NOK="4" DKK="5" GBP="6"
         account_type_id="{account_type_id}" amount="7" description="Product desc #1"
         parent_product_id="0" duration="8" />'
```

---

## DELETE /products/{tenant_id} <a id="deletev1products"></a>

**Delete a product**

Deletes a product of the caller's tenant, identified by the `id` attribute of the
`<product>` body. A product of another tenant cannot be deleted
(`400 Invalid product id`).

The caller must be owner or administrator of the tenant. The `{tenant_id}` path
segment is ignored — the caller's own tenant is always used, and
`DELETE /products` works the same.

### Request

`DELETE https://api.cloudbackend.com/v1/products/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Ignored — the caller's own tenant is used. |

#### Body

`application/xml` (required), root element `<product>`

```xml
<product id="{product_id}"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Product deleted |
| `400` | Bad Request |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

*id missing*

```text
Invalid or missing product id
```

*Unknown product or product of another tenant*

```text
Invalid product id
```

*Caller is not tenant owner or administrator*

```text
Not owner or admin of tenant
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/products/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<product id="{product_id}"/>'
```

---

## GET /tenantOptions/{tenant_id} <a id="getv1tenantOptions"></a>

**Get tenant options**

Returns tenant-level options and configuration.

### Request

`GET https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Tenant options |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<tenantOptions>`

```xml
<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option2" value="new-value2"/>
  <option name="option3" value="value3"/>
</tenantOptions>
```

*With options set*

```xml
<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option2" value="value2"/>
</tenantOptions>
```

*No options*

```xml
<tenantOptions>
</tenantOptions>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /tenantOptions/{tenant_id} <a id="postv1tenantOptions"></a>

**Set tenant options**

Sets or updates tenant-level options.

### Request

`POST https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<tenantOptions>`

```xml
<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option2" value="value2"/>
</tenantOptions>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Options set successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
OK
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option2" value="value2"/>
</tenantOptions>'
```

---

## DELETE /tenantOptions/{tenant_id} <a id="deletev1tenantOptions"></a>

**Delete tenant options**

Deletes specific tenant-level options.

### Request

`DELETE https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<tenantOptions>`

```xml
<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option3" value="value3"/>
</tenantOptions>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Options deleted successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/tenantOptions/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<tenantOptions>
  <option name="option1" value="value1"/>
  <option name="option3" value="value3"/>
</tenantOptions>'
```

---

## GET /signupreferralsettings/{group_id} <a id="getv1signupreferralsettings"></a>

**Get signup referral settings**

Returns the signup referral settings for a group.

### Request

`GET https://api.cloudbackend.com/v1/signupreferralsettings/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group whose signup referral settings are returned. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Signup referral settings |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<signupReferralSettings>`

```xml
<signupReferralSettings enabled="0"/>
```

*Referral disabled*

```xml
<signupReferralSettings enabled="0" />
```

*Referral enabled*

```xml
<signupReferralSettings enabled="1" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/signupreferralsettings/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /signupreferralsettings/{group_id} <a id="postv1signupreferralsettings"></a>

**Update signup referral settings**

Enables or disables signup referrals for a group. Set `enabled="1"` to enable, `enabled="0"` to disable.

### Request

`POST https://api.cloudbackend.com/v1/signupreferralsettings/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group whose signup referral settings are updated. |

#### Body

`application/xml` (required), root element `<signupReferralSettings>`

*Enable referrals*

```xml
<signupReferralSettings enabled="1" />
```

*Disable referrals*

```xml
<signupReferralSettings enabled="0" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Settings updated successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/signupreferralsettings/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<signupReferralSettings enabled="1" />'
```

---

## GET /signupreferral/{group_id} <a id="getv1signupreferral"></a>

**Generate a referral code**

Generates a new signup referral code and returns it.

If the caller has already generated as many codes as they are allowed, an error is
returned instead. Use
`POST /signupreferral/{group_id}`
to grant an allowance.

With `uses`, the code is reusable that many times; without it the code is
single-use and the response carries no `uses` attribute.

**The group id may be omitted** — call `/signupreferral` when the caller is an
ordinary member of the tenant. It is required when the caller is not, for example
the tenant owner.

### Request

`GET https://api.cloudbackend.com/v1/signupreferral/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group to generate the code in. |
| `uses` | query | no | integer | Number of times the code may be used. Omit for a single-use code. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The generated referral code |
| `401` | Unauthorized |
| `403` | The caller has no remaining code allowance |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<code>`

```xml
<code uses="2">239d17e899c955822d02f7ca74a2f6cd33fbb39c</code>
```

*Reusable code — ?uses=2*

```xml
<code uses="2">239d17e899c955822d02f7ca74a2f6cd33fbb39c</code>
```

*Single-use code*

```xml
<code>865f3c2c1aa9e7dada28a456959f0e2bf5402134</code>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/signupreferral/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /signupreferral/{group_id} <a id="postv1signupreferralconfig"></a>

**Grant code-generation allowances**

Sets how many signup referral codes users and roles may generate with
`GET /signupreferral/{group_id}`.

Each entry sets a `maxCodes` allowance:

| Element | Effect |
|---|---|
| `<user id="…" maxCodes="n"/>` | That user may generate up to `n` codes |
| `<user name="…" maxCodes="n"/>` | Same, addressing the user by name |
| `<role id="…" maxCodes="n"/>` | **Each** user holding that role may generate up to `n` codes |
| `<role id="0" maxCodes="n"/>` | Role id `0` means every user in the group |
| `<role name="owner\|admin" maxCodes="n"/>` | Same, addressing the role by name |

Note that a `<role>` allowance is per user holding the role, not a pool shared
between them.

Read the current allowances back with
`GET /signupreferral/{group_id}/users`.

### Request

`POST https://api.cloudbackend.com/v1/signupreferral/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group the allowances apply to. |

#### Body

`application/xml` (required), root element `<signupReferral>`

```xml
<signupReferral>
  <!-- Let user with id 12345 generate up to 3 codes -->
  <user id="12345" maxCodes="3"/>
  <!-- Let user with name some-user generate up to 4 codes -->
  <user name="some-user" maxCodes="4"/>
  <!-- Allow each user that is role id=1 to generate up to 5 codes -->
  <role id="1" maxCodes="5"/>
  <!-- When role id is set to zero it works for all users in the group -->
  <role id="0" maxCodes="3"/>
  <!-- Allow each owner to generate up to 6 codes -->
  <role name="owner" maxCodes="6"/>
  <!-- Allow each admin to generate up to 7 codes -->
  <role name="admin" maxCodes="7"/>
</signupReferral>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Allowances updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/signupreferral/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<signupReferral>…</signupReferral>'
```

---

## DELETE /signupreferral/{group_id} <a id="deletev1signupreferral"></a>

**Retract a referral code**

Retracts a referral code the caller generated. **A user can only retract their own
codes.**

The code becomes unusable immediately, even if it had uses remaining. Those
remaining uses are returned to the caller's allowance, so retracting a code frees
capacity to generate another.

### Request

`DELETE https://api.cloudbackend.com/v1/signupreferral/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group the code belongs to. |
| `code` | query | yes | string | The referral code to retract. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Code retracted |
| `401` | Unauthorized |
| `403` | The code was generated by another user |
| `404` | No such code |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/signupreferral/{group_id}?code={code}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /signupreferral/{group_id}/list <a id="getv1signupreferrallist"></a>

**List generated referral codes**

Lists the referral codes that have been generated, with the caller's allowance and
how much of it is used.

On the `<codes>` element, `max` is the allowance and `used` is how many codes have
been generated against it. A `<code>` carries `remaining-uses` **only when it may
be used more than once** — a single-use code has no such attribute.

### Request

`GET https://api.cloudbackend.com/v1/signupreferral/{group_id}/list`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group whose codes are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Generated codes |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<codes>`

```xml
<codes max="3" used="3">
  <code>0888f0c235ce32fc03d4186ce8322522eec5622d</code>
  <code remaining-uses="2">de3bfdc99046dedfcf3591bf24004f7adde22a5e</code>
</codes>
```

*A single-use code and a reusable one*

```xml
<codes max="3" used="3">
  <code>0888f0c235ce32fc03d4186ce8322522eec5622d</code>
  <code remaining-uses="2">de3bfdc99046dedfcf3591bf24004f7adde22a5e</code>
</codes>
```

*No codes generated yet*

```xml
<codes max="3" used="0" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/signupreferral/{group_id}/list" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /signupreferral/{group_id}/users <a id="getv1signupreferralusers"></a>

**List who may generate referral codes**

Returns the users and roles allowed to generate signup referral codes, with each
one's `maxCodes` allowance.

This reads back what
`POST /signupreferral/{group_id}`
sets. Note that `<role>` entries come back with the role's **name** in the `id`
attribute, e.g. `id='admin'`.

### Request

`GET https://api.cloudbackend.com/v1/signupreferral/{group_id}/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group whose allowances are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Users and roles with a code allowance |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<signupReferral>`

```xml
<signupReferral>
  <user id="12884901976" maxCodes="2" />
  <user id="12884901978" maxCodes="3" />
  <role id="admin" maxCodes="4" />
</signupReferral>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/signupreferral/{group_id}/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users <a id="getv1userslist"></a>

**List tenant users**

Lists the identities of the caller's tenant. Only the tenant Owner or an
Administrator may call it; anyone else gets `400 Not owner or admin of tenant`.

Each identity is one `<users>` element under the `<data>` root with `user_id`,
`created` (UTC, `YYYY-MM-DD HH:MM:SS`), `username`, `firstname`, `lastname` and
`email`. Deleted identities are left out unless `deleted` says otherwise. Without
`count` every matching identity is returned.

Send `Accept: application/json` to get the same data as JSON instead of XML.

A trailing slash is optional (`/users/` also routes). No request body.

### Request

`GET https://api.cloudbackend.com/v1/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `has_invoices` | query | no | boolean · default `False` | `true` lists only identities that have at least one purchase paid by invoice. |
| `deleted` | query | no | string · one of `false`, `true`, `include`, `only` · default `false` | Deleted identities: `false` (default) leaves them out, `true` or `include` lists them together with active ones, `only` lists only deleted identities. |
| `from` | query | no | string | Only identities created at or after this time. An HTTP date, a UTC date (`2026-09-01`), or a time span back from now such as `30min`, `12h` or `7d`. |
| `until` | query | no | string | Only identities created before this time. Same formats as `from`. |
| `order` | query | no | string · one of `user_id`, `created`, `username`, `firstname`, `lastname`, `email` · default `user_id` | Sort column. Unknown values fall back to `user_id`. |
| `asc` | query | no | boolean | `true` (default) sorts ascending, `false` descending. Do not combine with `desc`. |
| `desc` | query | no | boolean | `true` sorts descending. Do not combine with `asc`. |
| `offset` | query | no | integer | Number of identities to skip. Only used together with `count`. |
| `count` | query | no | integer | Maximum number of identities to return. Omitted or `0` returns all. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Identities of the tenant |
| `400` | Bad Request — `Not owner or admin of tenant`, or a filter that cannot be parsed (for example `Cannot parse count; abc.` or `Both asc and desc parameters provided.`) |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<data>`

```xml
<data>
  <users>
    <user_id>{user_id}</user_id>
    <created>2026-09-07 10:15:00</created>
    <username>jane</username>
    <firstname>Jane</firstname>
    <lastname>Doe</lastname>
    <email>jane@example.com</email>
  </users>
</data>
```

#### `400` · text/plain

```text
Not owner or admin of tenant
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /campaign <a id="getv1campaign"></a>

**Activate or test a campaign code**

Activates a campaign code for the logged-in identity, or tests whether the identity
could use it. Exactly one of `usecode` or `testcode` must be given; if both are
given, `usecode` wins.

Campaign codes belong to the identity's tenant. Using a code applies the campaign —
for example extra storage quota, or a trial upgrade of a `FREE` account to a
larger account type for one or two months. A code cannot be used twice by the same
identity, and upgrade campaigns are refused for identities that already have a
paid account.

On success the response is 200 with an empty body. No request body.

### Request

`GET https://api.cloudbackend.com/v1/campaign`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `usecode` | query | no | string | Campaign code to activate for the caller. |
| `testcode` | query | no | string | Campaign code to check without activating it. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The code was activated (`usecode`) or can be used (`testcode`). Empty body. |
| `400` | Bad Request — `Invalid campaign-code or code already used`, or `Missing required parameters` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text

```

#### `400` · text/plain

```text
Invalid campaign-code or code already used
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/campaign" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /cancelSubscription <a id="deletev1cancelSubscription"></a>

**Confirm subscription cancellation**

Confirms the cancellation of the logged-in identity's subscription. The user must
first request cancellation with
`GET /cancelSubscription` and then
follow the link in the email, which eventually calls this API with the code.

The code must match the one issued to the caller and is valid for 24 hours; it is
consumed on success. The subscription is then cancelled with its payment provider
(invoice, PayPal or Stripe).

Works for blocked accounts too. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/cancelSubscription`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `code` | query | yes | string | Confirmation code from the cancellation email. |
| `reason` | query | no | string | Optional free-text reason for cancelling, passed on with the cancellation request. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Subscription cancelled |
| `400` | Bad Request — `Invalid code` (missing, wrong or older than 24 hours), or `Invalid user id` |
| `401` | Unauthorized |
| `500` | Internal Server Error — `Could not cancel the subscription` |

#### `400` · text/plain

```text
Invalid code
```

#### `500` · text/plain

```text
Could not cancel the subscription
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/cancelSubscription?code={code}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /cancelSubscription <a id="getv1cancelSubscription"></a>

**Request subscription cancellation**

Requests cancellation of the logged-in identity's subscription. A confirmation code
is created and the tenant's `cancelSubscription` system email is sent to the user
with it. When the user follows the link in the email,
`DELETE /cancelSubscription` is
called to confirm.

If the tenant hasn't added a 'cancel subscription' email, this call fails with 400.
The confirmation code expires after 24 hours.

The body is plain text: `Ok` when the email was triggered, otherwise `Failed`
(still with status 200). Works for blocked accounts too. No request body.

### Request

`GET https://api.cloudbackend.com/v1/cancelSubscription`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | `Ok` if the email was triggered, otherwise `Failed` |
| `400` | Bad Request — `This tenant can't cancel subscriptions`, or `Invalid user id` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Ok
```

#### `400` · text/plain

```text
This tenant can't cancel subscriptions
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/cancelSubscription" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /clients/{tenant_group_id} <a id="postv1clients"></a>

**Create a client**

Lets a tenant owner register another client name for the tenant. Client names
identify the applications that call the API (they are used, for example, in client
usage statistics).

The `name` attribute is required, at most 45 characters, and must be unique across
all tenants. If the name belonged to a client of the same tenant that was deleted,
that client is restored with its original id.

Only the owner of the caller's current tenant may call this; otherwise 400
`Not owner of tenant` is returned. The tenant is determined from the caller, not
from `{tenant_group_id}`: the server ignores the path segment after `/clients/`.

### Request

`POST https://api.cloudbackend.com/v1/clients/{tenant_group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_group_id` | path | yes | integer | Tenant group id. Currently ignored by the server — the caller's own tenant is used. |

#### Body

`application/xml` (required), root element `<client>`

```xml
<client name="client_name"/>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Client created or restored |
| `400` | Bad Request — `client name empty`, `client name too long`, `client name is already in use`, `Could not create a client`, `Could not restore client`, or `Not owner of tenant` |
| `401` | Unauthorized |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
client name is already in use
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/clients/{tenant_group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<client name="client_name"/>'
```

---

## GET /coupon <a id="getv1coupon"></a>

**Activate or test a coupon**

Activates a coupon code on the caller's own account, or tests whether the caller could use it.
Requires an authenticated user.

Pass exactly one of the query parameters:

- `?activate={code}` activates the coupon on the caller's account. If the account already has
  a coupon from another campaign, it is replaced. The coupon expires on the campaign's expiry
  date, or after the campaign's number of days when it has no fixed expiry date.
- `?testcode={code}` only checks that the coupon exists and that the caller may use it (usage
  limits, activation deadline, target users). Nothing is changed.

If both are given, `activate` wins. The response has no body; 200 means the coupon was
activated or is usable.

### Request

`GET https://api.cloudbackend.com/v1/coupon`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `activate` | query | no | string | Coupon code to activate on the caller's account. |
| `testcode` | query | no | string | Coupon code to test without activating it. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Coupon activated, or coupon is usable. No response body. |
| `400` | `Invalid coupon-code` (the coupon cannot be used by the caller), or `Missing required parameters` (neither `activate` nor `testcode` given). |
| `401` | Unauthorized |
| `404` | `activate` only: no coupon with that code. |
| `409` | `activate` only: this coupon is already active on the account. |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid coupon-code
```

#### `409` · text/plain

```text
Coupon already activated.
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/coupon" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /deleteTenant <a id="getv1deleteTenant"></a>

**Request tenant deletion code**

Step one of deleting a tenant: creates a deletion confirmation code and triggers the
`deleteTenant` system event, which emails the code to the tenant owner (subject
"Delete Tenant Requested"). Pass the code to `POST /deleteTenant` within 24 hours.

Only the tenant owner (or the owner of the tenant's group) may call this. Built-in tenants
such as `cloudme`, `xios` and `cloudbackend` can never be deleted.

The response is the plain text `Ok` when the event was triggered, `Failed` otherwise
(both with status 200).

### Request

`GET https://api.cloudbackend.com/v1/deleteTenant`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant` | query | no | string | Name (key) of the tenant to delete. When omitted, the tenant of the request is used (`Tenant` header, `tenant` cookie or host name). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Deletion code created; `Ok` if the email event was triggered, `Failed` if not. |
| `400` | `Invalid tenant` (unknown or non-deletable tenant) or `Invalid user` (caller is not the tenant owner). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Ok
```

#### `400` · text/plain

```text
Invalid tenant
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/deleteTenant" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /deleteTenant <a id="postv1deleteTenant"></a>

**Delete a tenant**

Step two of deleting a tenant: checks the code obtained with `GET /deleteTenant` and marks the
tenant for deletion. The deletion itself runs asynchronously after the call returns.

Only the tenant owner may call this. The code must be the latest one issued to the caller and
at most 24 hours old; a successful call consumes it.

#### Attributes of `<deleteTenant>`

| Attribute | Description |
|---|---|
| `code` | Deletion code from the email sent by `GET /deleteTenant` |
| `tenant` | Name of the tenant to delete, the same as used for the GET. When empty, the tenant of the request is used |

### Request

`POST https://api.cloudbackend.com/v1/deleteTenant`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteTenant>`

```xml
<deleteTenant code="{code}" tenant="{tenant}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Tenant marked for deletion. No response body. |
| `400` | `Invalid code` (wrong, missing or older than 24 hours), `Invalid tenant` or `Invalid user` (caller is not the tenant owner). |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid code
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/deleteTenant" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteTenant code="{code}" tenant="{tenant}" />'
```

---

## DELETE /objects/purge <a id="deletev1objectspurge"></a>

**Purge deleted data of the tenant**

Permanently removes data that has already been deleted (soft-deleted) in the
caller's tenant: deleted containers, deleted objects and the content of deleted
identities are wiped from the database and from disk. This cannot be undone;
purged items can no longer be restored.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"), and the tenant must be a partitioned tenant
(otherwise `400`, "Must be a partitioned tenant"). The tenant is taken from the
caller's login, not from the URL.

Each kind of data is purged unless its query parameter is `false`. Only items
deleted before `before` are purged (default: now). After the purge the cached
database and object sizes of the tenant are cleared.

This is the same operation as `DELETE /groups/{group_id}/purge`, whose group id is
ignored. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/objects/purge`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `folders` | query | no | boolean · default `True` | Purge deleted containers. Default `true`. |
| `documents` | query | no | boolean · default `True` | Purge deleted objects. Default `true`. |
| `users` | query | no | boolean · default `True` | Purge the content and metadata of deleted identities. Default `true`. |
| `forgotten_users` | query | no | boolean · default `False` | When `true`, only deleted identities whose user name starts with `forgotten_` (identities removed with "forget me") are purged. Default `false` (all deleted identities). |
| `before` | query | no | integer | Unix time in seconds; only items deleted before this time are purged. Default is the current time. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Deleted data purged |
| `400` | Bad Request — "Must be a partitioned tenant", or "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/objects/purge" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /statistictenant/users <a id="getv1statistictenantusers"></a>

**Get user count**

Gets the total user count for the caller's tenant.

The other `/statistictenant/…` operations have `/stats/…` equivalents; this one
does not, so `/statistictenant/users` remains the way to call it. Counts every
user in the tenant rather than grouping them — `/stats/users` is a different
operation and not a substitute.

### Request

`GET https://api.cloudbackend.com/v1/statistictenant/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `after` | query | no | string | (optional) after date (unix epoch time) |
| `before` | query | no | string | (optional) before date (unix epoch time) |
| `deleted` | query | no | string | (optional) "include" to include total users weather created or deleted as of time, omit to include users created but not yet deleted during time |

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
42
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/statistictenant/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /tenantkey <a id="getv1tenantkey"></a>

**Get tenant keys**

Returns the tenant keys (the unique tenant names, also called signup sources) owned
by the logged-in identity, as a `<tenantkeys>` list with one `<tenantkey>` element
per tenant. In a partitioned tenant database only the current tenant's key is
returned.

Only the tenant owner gets keys. For any other identity the request still succeeds
with an empty `<tenantkeys></tenantkeys>` element.

A trailing `/` is accepted; anything after it returns 404.

### Request

`GET https://api.cloudbackend.com/v1/tenantkey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Tenant keys owned by the caller (empty list if none) |
| `401` | Unauthorized |
| `404` | Path continues after `/tenantkey/` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<tenantkeys>`

*Caller owns a tenant*

```xml
<tenantkeys><tenantkey>{tenant_key}</tenantkey></tenantkeys>
```

*Caller owns no tenant*

```xml
<tenantkeys></tenantkeys>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/tenantkey" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/billing <a id="getv1usersbilling"></a>

**Get billing info**

Returns the user's billing information. If none has been stored yet, defaults are
returned: the user's e-mail and the country from the user's config. `<country>` is
the country code and `<countryFull>` its full name.

Only the user itself may call it.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/billing`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Billing information |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<billing>`

```xml
<billing>
  <vat></vat>
  <name></name>
  <reference></reference>
  <reference2></reference2>
  <email>test@xcerion.com</email>
  <phone></phone>
  <address></address>
  <city></city>
  <zipCode></zipCode>
  <country>us</country>
  <countryFull>United States</countryFull>
</billing>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/billing" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/billing <a id="putv1usersbilling"></a>

**Update billing info**

Stores the user's billing information. All elements are optional. If `<country>` is
empty, the country from the user's config is used. If `<vat>` (a VAT number) is
given, `<name>` and the country must be set too, and the VAT number is validated.

Only the user itself may call it.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/billing`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<billing>`

```xml
<billing>
  <vat></vat>
  <name></name>
  <reference></reference>
  <reference2></reference2>
  <email>test@xcerion.com</email>
  <phone></phone>
  <address></address>
  <city></city>
  <zipCode></zipCode>
  <country>us</country>
</billing>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Billing information stored |
| `400` | Bad Request (missing required business parameters, invalid VAT number, or the information could not be stored) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/billing" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<billing>
  <vat></vat>
  <name></name>
  <reference></reference>
  <reference2></reference2>
  <email>test@xcerion.com</email>
  <phone></phone>
  <address></address>
  <city></city>
  <zipCode></zipCode>
  <country>us</country>
</billing>'
```

---

## GET /users/{user_id}/invoices/{purchase_id} <a id="getv1usersinvoices"></a>

**Get invoice**

Get invoice as html, xml, json (not implemented) or pdf.

> **Partly implemented.** Get invoice as html, xml, json (not implemented) or pdf.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/invoices/{purchase_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer |  |
| `purchase_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invoice>`

```xml
<invoice purchaseId="PURCHASE-ID" date="2024-01-15" amount="9.99" currency="USD" status="paid" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/invoices/{purchase_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /users/{user_id}/invoices <a id="getv1usersinvoiceslist"></a>

**List unpaid invoices**

Lists the caller's unpaid invoices: purchases paid by invoice that have not been
paid yet, plus unpaid usage-based invoices of tenants the caller owns.
`{user_id}` must be the logged-in identity (`403` otherwise).

Each `<invoice>` has the invoice `number`, the `created`, `due`, `start` and `end`
times (Atom format), the price in cents (`priceCents`), the `currency` and the
subscription length in months (`durationMonths`). Fetch one invoice as HTML, XML or
PDF with `GET /users/{user_id}/invoices/{purchase_id}?id=invoice`.

Works for blocked accounts too. No request body.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/invoices`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | The logged-in identity. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Unpaid invoices (zero or more) |
| `401` | Unauthorized |
| `403` | Forbidden — `{user_id}` is not the logged-in identity |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invoices>`

```xml
<invoices>
  <invoice number='CB-1042' created='2026-10-01T08:00:00Z' due='2026-10-31T08:00:00Z' start='2026-10-01T08:00:00Z' end='2026-11-01T08:00:00Z' priceCents='9900' currency='EUR' durationMonths='1'/>
</invoices>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/invoices" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/invoices/{invoice_id}/credit-notes <a id="postv1usersinvoicescreditnotes"></a>

**Credit an invoice**

Credits an issued invoice: a credit note (a new invoice with negated amounts that
refers to the original purchase) is created for `{user_id}` and the action is logged
in the identity's purchase transactions. Only a tenant Owner or Administrator may
call it (`400 Not owner or admin of tenant` otherwise).

The body is a `<credit-note>` with a required `<reason>` and an optional
`<recordedBy>` naming who credited the invoice. The reason is written to the
transaction log only.

Works for blocked accounts too. The response has no body.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/invoices/{invoice_id}/credit-notes`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity the invoice was issued to. |
| `invoice_id` | path | yes | string | Invoice number (letters, digits, `_` and `-`), e.g. `CB-1042`. |

#### Body

`application/xml` (required), root element `<credit-note>`

```xml
<credit-note>
  <reason>Duplicate order</reason>
  <recordedBy>jane@example.com</recordedBy>
</credit-note>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Invoice credited |
| `400` | Bad Request — `Missing reason`, `Not owner or admin of tenant`, or a body that is not XML |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Missing reason
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/invoices/{invoice_id}/credit-notes" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<credit-note>
  <reason>Duplicate order</reason>
  <recordedBy>jane@example.com</recordedBy>
</credit-note>'
```

---

## POST /users/{user_id}/invoices/{invoice_id}/payments <a id="postv1usersinvoicespayments"></a>

**Mark an invoice as paid**

Records a payment for an invoice and marks it as paid. Only a tenant Owner or
Administrator may call it (`400 Not owner or admin of tenant` otherwise).

The body is a `<payment>` with the `currency` attribute and the children
`<amount>` and `<bankFee>` (in cents), `<paidAt>` (date the money arrived,
`YYYY-MM-DD`) and an optional `<recordedBy>` naming who registered the payment.
`amount`, `bankFee`, `paidAt` and `currency` are required.

For a subscription invoice the identity's drive is unlocked. For a usage-based
(tenant) invoice the tenant and its owner are unblocked when no unpaid invoices
remain.

Works for blocked accounts too. The response has no body.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/invoices/{invoice_id}/payments`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Identity the invoice was issued to. |
| `invoice_id` | path | yes | string | Invoice number (letters, digits, `_` and `-`), e.g. `CB-1042`. |

#### Body

`application/xml` (required), root element `<payment>`

```xml
<payment currency="EUR">
  <amount>9900</amount>
  <bankFee>150</bankFee>
  <paidAt>2026-10-12</paidAt>
  <recordedBy>jane@example.com</recordedBy>
</payment>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Payment recorded |
| `400` | Bad Request — `Missing payment data`, `Invalid invoice number`, `Failed marking purchase as paid: …` (unknown invoice number) or `Not owner or admin of tenant` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Missing payment data
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/invoices/{invoice_id}/payments" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<payment currency="EUR">
  <amount>9900</amount>
  <bankFee>150</bankFee>
  <paidAt>2026-10-12</paidAt>
  <recordedBy>jane@example.com</recordedBy>
</payment>'
```

---

## GET /users/{user_id}/purchases <a id="getv1userspurchases"></a>

**List purchases**

Lists the user's purchases. `amount` on `<purchases>` is the number of purchases.
For each purchase: payment method (`invoice` or `paypal`), creation time, invoice
number, an optional `<creditedPurchase>` (another `<purchase>`), the time payment was
received (when paid), due date, price with currency, and the coupon used (if any).

Only the user itself may call it.

### Request

`GET https://api.cloudbackend.com/v1/users/{user_id}/purchases`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The purchases |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/xml · `<purchases>`

```xml
<purchases amount='1'>
  <purchase id='{purchase_id}'>
    <paymentMethod>invoice</paymentMethod>
    <created>2026-01-01T10:00:00Z</created>
    <invoiceNumber>{invoice_number}</invoiceNumber>
    <paymentReceived>2026-01-05T10:00:00Z</paymentReceived>
    <paymentDue>2026-01-31T10:00:00Z</paymentDue>
    <price currency='EUR'>{price}</price>
    <coupon>{coupon}</coupon>
  </purchase>
</purchases>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/users/{user_id}/purchases" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/purchases <a id="postv1userspurchases"></a>

**Create a purchase**

Buys one or more products for the user, optionally with a coupon. A tenant can create
campaigns and coupons by uploading campaign files.

Body elements:

- `paymentMethod` (required): `invoice`, `paypal` or `stripe`.
- `products/product` (one or more): `id` and `amount` (max 100000). A numeric `id`
  is an account type product; a non-numeric `id` is a tenant product. Both kinds can
  not be mixed in one purchase.
- `coupon/@code` (optional): coupon code.
- `@sendEmail` (optional): the only supported value is `signup`, which also sends the
  sign-up e-mail.
- `billing` (optional): `vat`, `name`, `reference`, `reference2`, `email`, `phone`,
  `address`, `city`, `zipCode`, `country`. If a VAT number is set, `name` must be set
  too. If `country` is empty, the user's `/user/country` config value is used.
- `currency` (optional): must be `EUR` (the default).
- `returnUrl` (required for `stripe`): where Stripe returns after checkout.
- `uiMode` (optional, `stripe` only): Stripe checkout UI mode, default `embedded_page`.

Responses by payment method:

- `invoice` (account type products only): `204 No Content`.
- `paypal`: `200` with `<auth url='...' tid='...'/>` for account type products
  (`tid` is the transaction id) or `<auth url='...'/>` for tenant products. Visit the
  URL to pay. The URL is empty when nothing needs to be paid.
- `stripe`: `200` with JSON `{"clientSecret": "..."}` for the Stripe checkout.

Only the user itself may call it.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/purchases`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<purchase>`

*Account type product with PayPal (from the live tests)*

```xml
<purchase>
  <paymentMethod>paypal</paymentMethod>
  <coupon code="13DAYSOFF30"/>
  <products>
    <product id="{product_id}" amount="1"/>
  </products>
  <billing>
    <email>test@xcerion.com</email>
    <country>SE</country>
  </billing>
</purchase>
```

*Tenant products with PayPal (from the live tests)*

```xml
<purchase>
  <paymentMethod>paypal</paymentMethod>
  <products>
    <product id="couponprod1" amount="1"/>
    <product id="couponprod2" amount="2"/>
  </products>
  <billing>
    <email>test@xcerion.com</email>
    <country>SE</country>
  </billing>
</purchase>
```

*Stripe checkout*

```xml
<purchase>
  <paymentMethod>stripe</paymentMethod>
  <returnUrl>https://example.com/checkout/return</returnUrl>
  <products>
    <product id="{product_id}" amount="1"/>
  </products>
  <billing>
    <email>{email}</email>
  </billing>
</purchase>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Payment URL (PayPal) or client secret (Stripe) |
| `204` | Invoice purchase created |
| `400` | Bad Request (missing products, mixed product kinds, invalid payment method, amount too high, currency not EUR, missing returnUrl, not a valid coupon code, usage based product not supported by the payment method) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

#### `200` · application/json

```json
{
 "clientSecret": "{stripe_client_secret}"
}
```

#### `200` · application/xml · `<auth>`

```xml
<auth url='https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&amp;...' tid='{transaction_id}'/>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/purchases" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<purchase>
  <paymentMethod>paypal</paymentMethod>
  <coupon code="13DAYSOFF30"/>
  <products>
    <product id="{product_id}" amount="1"/>
  </products>
  <billing>
    <email>test@xcerion.com</email>
    <country>SE</country>
  </billing>
</purchase>'
```

---

## POST /users/{user_id}/tpurchases <a id="postv1userstpurchases"></a>

**Create PayPal purchase URL (not implemented)**

**Not implemented.** The server has no route for `/users/{user_id}/tpurchases`, so
every request is answered with `404 Not Found`. No request body.

Tenant products are bought with `POST /users/{user_id}/purchases` instead: use
`<paymentMethod>paypal</paymentMethod>` (or `stripe`) and give the tenant product ids
(non-numeric) in `<products><product id="..." amount="..."/></products>`. The PayPal
response is `<auth url='...'/>`; visit the URL to pay. After payment, PayPal notifies
the server (this can take a few minutes) and the purchase is recorded.

> **Not implemented.** The specification lists this operation, but the server does not carry it out; the description above says what a request gets instead.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/tpurchases`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the user. |

### Responses

| Status | Meaning |
| --- | --- |
| `404` | Not Found (route does not exist) |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/tpurchases" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /vat-numbers/ <a id="getv1vatnumbers"></a>

**List tenant VAT numbers**

Lists the VAT numbers registered for the caller's tenant, each with the time it
became effective (UTC). Older numbers are kept so past VAT reports stay correct.
Only the tenant Owner or an Administrator may call it
(`400 Not owner or admin of tenant` otherwise).

The trailing slash is required: `/vat-numbers` without it is `404`. Works for
blocked tenants too. No request body.

### Request

`GET https://api.cloudbackend.com/v1/vat-numbers/`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | VAT numbers (zero or more) |
| `400` | Bad Request — `Not owner or admin of tenant` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<vat-numbers>`

```xml
<vat-numbers>
  <vat-number>
    <vat_number>SE556677889901</vat_number>
    <effective_from>2026-08-13 09:30:00</effective_from>
  </vat-number>
</vat-numbers>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/vat-numbers/" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /vat-numbers/ <a id="postv1vatnumbers"></a>

**Add a tenant VAT number**

Registers a VAT number for the caller's tenant. The number (in `<number>`) is
upper-cased, must be at least 3 letters/digits starting with the country code
(`EL` is accepted for Greece), and is validated with the EU VIES service before it
is stored. Only the tenant Owner or an Administrator may call it.

The trailing slash is required. Works for blocked tenants too. The response has no
body.

### Request

`POST https://api.cloudbackend.com/v1/vat-numbers/`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<vat-number>`

```xml
<vat-number>
  <number>SE556677889901</number>
</vat-number>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | VAT number stored |
| `400` | Bad Request — `Invalid VAT number` (malformed or rejected by VIES), or `Not owner or admin of tenant` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid VAT number
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/vat-numbers/" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<vat-number>
  <number>SE556677889901</number>
</vat-number>'
```

---

## DELETE /vat-numbers/{vat_number} <a id="deletev1vatnumbers"></a>

**Delete a tenant VAT number (test tenants)**

Deletes a VAT number of the caller's tenant. For testing only: the caller must be
Owner or Administrator of a test tenant (`400 Not test tenant` otherwise). Real
tenants keep their VAT number history.

Deleting a number that is not registered also returns `200`. No request body. The
response has no body.

### Request

`DELETE https://api.cloudbackend.com/v1/vat-numbers/{vat_number}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `vat_number` | path | yes | string | The VAT number as stored (upper case), e.g. `SE556677889901`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | VAT number deleted |
| `400` | Bad Request — `Not test tenant` or `Not owner or admin of tenant` |
| `401` | Unauthorized |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/vat-numbers/{vat_number}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /tenantgroup <a id="getv1tenantgroup"></a>

**Get tenant group**

Returns the tenant group ID and name for the authenticated user.

### Request

`GET https://api.cloudbackend.com/v1/tenantgroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Tenant group info |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<tenantgroup>`

```xml
<tenantgroup id="{group_id}" name="{tenant_name}" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/tenantgroup" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /paypalcredentials/{tenant_id} <a id="getv1paypalcredentials"></a>

**Get PayPal credentials**

Gets the PayPal credentials for a tenant. Only the tenant owner can access this.

### Request

`GET https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | PayPal credentials |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<paypalCredentials>`

```xml
<paypalCredentials business='{email}' api_username='{username}' />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /paypalcredentials/{tenant_id} <a id="postv1paypalcredentials"></a>

**Set PayPal credentials**

Sets or updates the PayPal credentials for a tenant. Only the tenant owner can use this.

### Request

`POST https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

#### Body

`application/xml` (required), root element `<paypalCredentials>`

```xml
<paypalCredentials business="{email}" api_username="{username}" api_password="{password}" api_signature="{signature}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Credentials saved |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
'api_signature' can't be empty
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<paypalCredentials business="{email}" api_username="{username}" api_password="{password}" api_signature="{signature}" />'
```

---

## DELETE /paypalcredentials/{tenant_id} <a id="deletev1paypalcredentials"></a>

**Delete PayPal credentials**

Deletes the PayPal credentials for a tenant. Only the tenant owner can use this.

### Request

`DELETE https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Credentials deleted |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/paypalcredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /deleteoldfreeusers/{tenant_id} <a id="postv1deleteoldfreeusers"></a>

**Delete old free users**

Deletes the tenant's free users that were created before a given date. Only allowed when free
users have been disabled for the tenant, and only for the owner of the tenant's group.

The call returns as soon as the request is validated; the users are found and deleted
asynchronously.

#### Attributes of `<deleteOldFreeUsers>`

| Attribute | Description |
|---|---|
| `beforeDate` | Required. Free users created before this time are deleted. Formats: `2024-01-31T00:00:00Z`, `Wed, 31 Jan 2024 00:00:00 GMT`, or `2024-01-31 00:00:00` |

### Request

`POST https://api.cloudbackend.com/v1/deleteoldfreeusers/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Group id of the tenant. |

#### Body

`application/xml` (required), root element `<deleteOldFreeUsers>`

```xml
<deleteOldFreeUsers beforeDate="2024-01-31T00:00:00Z" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Deletion started. No response body. |
| `400` | `Invalid tenant group` (no tenant with that group id), `Invalid tenant` (caller is not the group owner), `Old free users can only be deleted if free users have been disabled`, `Missing @beforeDate attribute` or `Invalid beforeDate attribute`. |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Old free users can only be deleted if free users have been disabled
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/deleteoldfreeusers/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteOldFreeUsers beforeDate="2024-01-31T00:00:00Z" />'
```

---

## GET /organizations/check <a id="getv1organizationscheck"></a>

**Check whether a tenant name is available**

Checks whether a tenant name may be used. Returns 200 when the name is free and
409 with a plain-text reason when it is not.

Unauthenticated — the test suite calls this without credentials.

### Request

`GET https://api.cloudbackend.com/v1/organizations/check`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `name` | query | yes | string | Tenant name to check. Must be non-empty and use only the characters `a-z` and `0-9`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The name is available |
| `409` | The name cannot be used. The body carries the reason as plain text. |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
Ok
```

#### `409` · text/plain

*No name supplied*

```text
Tenant name must not be empty
```

*Name contains characters outside a-z 0-9*

```text
Tenant names must only use characters a-z 0-9
```

*A tenant with that name already exists*

```text
Tenant with that name already exists
```

*The name is reserved*

```text
Tenant name is reserved
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/check?name={name}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/bandwidth <a id="getv1organizationsbandwidth"></a>

**Get tenant bandwidth usage**

Returns bandwidth consumed by the tenant, broken down by date.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/bandwidth`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Tenant group id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Bandwidth usage per date |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<bandwidth>`

```xml
<bandwidth>
  <!-- zero or more dates -->
  <date value="{datetime}" bandwidth="{bytes}" />
</bandwidth>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/bandwidth" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stripecredentials/{tenant_id} <a id="getv1stripecredentials"></a>

**Get Stripe credentials**

Returns the Stripe credentials stored for a tenant. Secrets are not echoed back,
so an empty `<stripeCredentials/>` element means none are stored.

Compare `/paypalcredentials/{tenant_id}`.

### Request

`GET https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Tenant the credentials belong to. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Stored Stripe credentials |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<stripeCredentials>`

```xml
<stripeCredentials />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /stripecredentials/{tenant_id} <a id="postv1stripecredentials"></a>

**Set Stripe credentials**

Stores or replaces the Stripe credentials for a tenant. Both attributes are
required and neither may be empty. Returns 204 with an empty body on success.

### Request

`POST https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Tenant the credentials belong to. |

#### Body

`application/xml` (required), root element `<stripeCredentials>`

```xml
<stripeCredentials api_key="{stripe_api_key}" whsec="{stripe_webhook_secret}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Credentials stored. Empty body. |
| `400` | A required attribute was empty. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `400` · text/plain

*api_key was empty*

```text
'api_key' can't be empty
```

*whsec was empty*

```text
'whsec' can't be empty
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<stripeCredentials api_key="{stripe_api_key}" whsec="{stripe_webhook_secret}" />'
```

---

## DELETE /stripecredentials/{tenant_id} <a id="deletev1stripecredentials"></a>

**Delete Stripe credentials**

Removes the Stripe credentials stored for a tenant.

### Request

`DELETE https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `tenant_id` | path | yes | integer | Tenant the credentials belong to. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Credentials deleted. Empty body. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/stripecredentials/{tenant_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stats/users <a id="getv1statsusers"></a>

**Get grouped user statistics**

Gets user statistics for the caller's tenant, grouped by year, month, day or hour
over a date range. Account types, subscriptions and total users can be included.

The returned `groupByValue` attribute is the year, month, day or hour selected by
`groupby`. With `groupby=hour`, `groupByValue=3` means the 3:00–4:00 hour after
`after`.

Replaces `/statistictenant/{group_id}/usersgrouped`, which took the tenant as a
path parameter; this operation always reports on the caller's own tenant.

### Request

`GET https://api.cloudbackend.com/v1/stats/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupby` | query | no | string | (optional) year, month, day, hour, total |
| `premium` | query | no | string | (optional) If true, also group by account type / subscription |
| `after` | query | no | string | (optional) after date (unix epoch time or past timespan) |
| `before` | query | no | string | (optional) before date (unix epoch time or past timespan) |
| `activeafter` | query | no | string | (optional) show only users that logged in within timespan after creation |
| `accounttypes` | query | no | string | (optional) 1 = include account types in result; 0 = do not include them |
| `subscriptions` | query | no | string | (optional) 1 = include user defined subscriptions in result; 0 = do not include them |
| `deleted` | query | no | string | (optional) "only" for users deleted in the period, "include" for total users whether created or deleted during the period |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<usersGrouped>`

```xml
<usersGrouped>
  <users type="10GB" count="5"/>
  <users type="200G" count="2"/>
  <users type="FREE" count="4"/>
  <subscription id="sub8" count="1"/>
  <subscription id="sub4" count="1"/>
</usersGrouped>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stats/users/active <a id="getv1statsusersactive"></a>

**Get last login count**

Gets the number of users in the caller's tenant who last logged in within the
given range.

Replaces `/statistictenant/{group_id}/lastlogin`.

### Request

`GET https://api.cloudbackend.com/v1/stats/users/active`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `after` | query | no | string | (optional) after date (unix epoch time) |
| `before` | query | no | string | (optional) before date (unix epoch time) |
| `deleted` | query | no | string | (optional) "only" for users deleted at some point, "include" for total users whether created or deleted as of the time |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response. The body is a bare count. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
42
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/users/active" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stats/users/logins <a id="getv1statsuserslogins"></a>

**Get total login count**

Gets the number of users in the caller's tenant whose total login count falls in
the given range.

Replaces `/statistictenant/{group_id}/totallogins`.

### Request

`GET https://api.cloudbackend.com/v1/stats/users/logins`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `greater` | query | no | string | (optional) count users with more logins than this |
| `less` | query | no | string | (optional) count users with fewer logins than this |
| `equal` | query | no | string | (optional) count users with exactly this many logins |
| `deleted` | query | no | string | (optional) "only" for users deleted at some point, "include" for total users whether created or deleted |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response. The body is a bare count of users. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
42
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/users/logins" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stats/users/subscriptions <a id="getv1statsuserssubscriptions"></a>

**Get premium user statistics**

Gets statistics about premium accounts in the caller's tenant, grouped by year,
month, day or hour over a date range. Added and removed accounts are reported
separately.

The returned `groupByValue` attribute is the year, month, day or hour selected by
`groupby`. With `groupby=hour`, `groupByValue=3` means the 3:00–4:00 hour after
`after`.

Replaces `/statistictenant/{group_id}/premiumusers`.

### Request

`GET https://api.cloudbackend.com/v1/stats/users/subscriptions`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupby` | query | no | string | (optional) year, month, day, hour |
| `after` | query | no | string | (optional) after date (unix epoch time) |
| `before` | query | no | string | (optional) before date (unix epoch time) |
| `accounttypes` | query | no | string | (optional) 1 = include account types in result; 0 = do not include them |
| `subscriptions` | query | no | string | (optional) 1 = include user defined subscriptions in result; 0 = do not include them |
| `deleted` | query | no | string | (optional) "only" for deleted users, "include" for deleted and non-deleted users |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<premiumAccounts>`

```xml
<premiumAccounts>
  <added>
    <account type="10GB" count="1" groupByValue="6"/>
    <account type="200G" count="1" groupByValue="6"/>
    <subscription id="sub1" count="2" groupByValue="6"/>
  </added>
  <removed>
    <account type="5GB" count="1" groupByValue="7"/>
    <subscription id="sub1" count="1" groupByValue="7"/>
  </removed>
</premiumAccounts>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/users/subscriptions" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /stats/revenue <a id="getv1statsrevenue"></a>

**Get revenue statistics**

Gets revenue for the caller's tenant, grouped by year, month or day over a date
range.

Replaces `/statistictenant/{group_id}/revenue`.

### Request

`GET https://api.cloudbackend.com/v1/stats/revenue`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupby` | query | no | string | (optional) year, month, day |
| `after` | query | no | string | (optional) after date (unix epoch time) |
| `before` | query | no | string | (optional) before date (unix epoch time) |
| `deleted` | query | no | string | (optional) "only" for users deleted in the period, "include" for total users whether created or deleted during the period |
| `includeFee` | query | no | string | (optional) if true or 1, include the payment processor fee in the result, i.e. amount = sum - fee |
| `convertToEUR` | query | no | string | (optional) if true or 1, convert all payments to EUR before returning the result |
| `sub` | query | no | string | (optional) `sub` for subscriptions only, `one` for non-recurring, `all` for all revenue |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<revenues>`

```xml
<revenues>
  <revenue amount="53.47" currency="EUR" groupby="25-03"/>
  <revenue amount="1084.69" currency="EUR" groupby="25-04"/>
</revenues>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/stats/revenue" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /admin/users/total <a id="getv1adminuserstotal"></a>

**Get deployment statistics**

Gets deployment counts per tenant. Requires the caller to be the CloudBackend
owner or an administrator.

Replaces `/statisticdeploys`.

### Request

`GET https://api.cloudbackend.com/v1/admin/users/total`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupby` | query | no | string | (optional) year, month, day, hour, total |
| `after` | query | no | string | (optional) after date (unix epoch time) |
| `before` | query | no | string | (optional) before date (unix epoch time) |

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
  <tenant name="testtenantcbe" count="1" groupByValue="1"/>
  <tenant name="bobtenant" count="3" groupByValue="2"/>
</deployCount>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/admin/users/total" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /emailcredentials <a id="postv1emailcredentials"></a>

**Add email credentials**

Stores the SMTP credentials the service uses to send email for the caller's tenant.

Unlike `/paypalcredentials/{tenant_id}` and `/stripecredentials/{tenant_id}`, this
path takes no tenant id: it applies to the tenant the caller currently has set or owns.
Anything after `/emailcredentials/` in the path is ignored. The caller must be owner or
administrator of that tenant. Only POST is implemented; other methods answer 405.

#### Attributes of `<emailCredentials>`

| Attribute | Description |
|---|---|
| `host` | Required. Email host |
| `port` | Required. Email port, 1 to 65535, e.g. 587; use an encrypted port |
| `username` | Required. Username. When `password` holds an API key rather than an account password, this is typically the literal `apikey` |
| `password` | Required. Password, or API key |

### Request

`POST https://api.cloudbackend.com/v1/emailcredentials`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<emailCredentials>`

```xml
<emailCredentials host="{smtp_host}" port="587" username="apikey" password="{password}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Credentials stored. No response body. |
| `400` | `Not owner or admin of tenant`, `Invalid email host`, `Invalid email port`, `Invalid email username` or `Invalid email password`. |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Invalid email port
```

#### `401` · text/plain

```text
You need to provide credentials to access this resource
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/emailcredentials" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<emailCredentials host="{smtp_host}" port="587" username="apikey" password="{password}" />'
```

---
