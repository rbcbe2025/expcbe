# REST API — Drive

5 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## PUT /drive <a id="putv1drive"></a>

**Rename a drive**

Renames a drive. Only extra drives can have their sysname changed.

### Request

`PUT https://api.cloudbackend.com/v1/drive`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<renameDrive>`

```xml
<renameDrive>
  <drive id="{drive_id}" />
  <sysname>{sysname}</sysname>
  <name>{name}</name>
</renameDrive>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Drive renamed successfully |
| `400` | Bad request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `400` · text/plain

```text
Can only change sysname on extra drives
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/drive" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameDrive>
  <drive id="{drive_id}" />
  <sysname>{sysname}</sysname>
  <name>{name}</name>
</renameDrive>'
```

---

## GET /drive <a id="getv1drive"></a>

**List drives**

Lists the drives for a user. Returns drive details including quota, size, and system type.

Without `userid` (or with your own id) your own drives are listed. To list another
user's drives, the caller must be the owner or an administrator of that user's
tenant (`403` otherwise). An unknown `userid` gives `400` ("Invalid user id").

### Request

`GET https://api.cloudbackend.com/v1/drive`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `userid` | query | no | integer · default `0` | User whose drives are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of drives |
| `400` | Bad Request — "Invalid user id" (unknown `userid`). |
| `401` | Unauthorized |
| `403` | Forbidden — `userid` is another user, and the caller is not the owner or an administrator of that user's tenant. |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listDrivesResponse>`

```xml
<listDrivesResponse>
  <drives>
    <drive>
      <driveId>{drive_id}</driveId>
      <ownerId isGroupId="false">{user_id}</ownerId>
      <folderId>{container_id}</folderId>
      <sysname>xios</sysname>
      <name/>
      <system>home</system>
      <currentSize>2149</currentSize>
      <quotaLimit>104857600</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>{datetime}</created>
    </drive>
    <drive>
      <driveId>{drive_id}</driveId>
      <ownerId isGroupId="false">{user_id}</ownerId>
      <folderId>{container_id}</folderId>
      <sysname>lib</sysname>
      <name/>
      <system>library</system>
      <currentSize>0</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>{datetime}</created>
    </drive>
    <drive>
      <driveId>{drive_id}</driveId>
      <ownerId isGroupId="false">{user_id}</ownerId>
      <folderId>{container_id}</folderId>
      <sysname>in</sysname>
      <name/>
      <system>incoming</system>
      <currentSize>0</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>{datetime}</created>
    </drive>
    <drive>
      <driveId>{drive_id}</driveId>
      <ownerId isGroupId="false">{user_id}</ownerId>
      <folderId>{container_id}</folderId>
      <sysname>out</sysname>
      <name/>
      <system>outgoing</system>
      <currentSize>0</currentSize>
      <quotaLimit>1073741824</quotaLimit>
      <maxFileSize>157286400</maxFileSize>
      <readLocked>false</readLocked>
      <writeLocked>false</writeLocked>
      <created>{datetime}</created>
    </drive>
  </drives>
</listDrivesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/drive" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PATCH /drive <a id="patchv1drive"></a>

**Resize a drive**

Sets a drive's storage quota, in bytes. Only the owner or an administrator of the
caller's tenant may resize drives (otherwise `400`, "Not owner or admin of tenant").

The body names the drive in one of two ways:

| Element | Description |
|---|---|
| `<username>` | The home drive of this identity in the caller's tenant. |
| `<driveid>` | A drive by id. Used when `<username>` is left out. The drive must belong to the caller's tenant: the home or other drive of an identity of the tenant, or the drive of the tenant's group or of any group under it (subgroups and projects). Any other drive, also one that exists in another tenant, gives `404` "Drive not found". |
| `<quota>` | Required. The new quota in bytes. |
| `<override>` | Optional, default `false`. `true` allows a quota below the drive's current size. |

A drive that is over its new quota keeps its objects, but uploads and writes that
grow it are refused until it is back under the quota; see
`PUT /objectsave`.

### Request

`PATCH https://api.cloudbackend.com/v1/drive`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<resizeDrive>`

```xml
<resizeDrive>
  <quota>{bytes}</quota>
  <username>{username}</username>
  <override>false</override>
</resizeDrive>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Drive resized |
| `400` | Bad Request — "Missing username or drive ID." (neither `<username>` nor `<driveid>`), "Missing drive ID." (no `<quota>`), "New quota is lower then current drive useage" (without `<override>true</override>`) or "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `404` | Not Found — "Drive not found": the drive does not exist, or `<driveid>` names a drive outside the caller's tenant. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<resizeDriveResponse>`

```xml
<resizeDriveResponse>OK</resizeDriveResponse>
```

### Example

```bash
curl -X PATCH "https://api.cloudbackend.com/v1/drive" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<resizeDrive>
  <quota>{bytes}</quota>
  <username>{username}</username>
  <override>false</override>
</resizeDrive>'
```

---

## GET /driveinfo <a id="getv1driveinfo"></a>

**Get drive info**

Gets detailed information about a specific drive including quota, size, and lock status.

### Request

`GET https://api.cloudbackend.com/v1/driveinfo`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `driveid` | query | no | integer · default `0` | Drive to describe. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Drive information |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getDriveInfoResponse>`

```xml
<getDriveInfoResponse>
  <drive>
    <driveId>{drive_id}</driveId>
    <ownerId isGroupId="false">{user_id}</ownerId>
    <folderId>{container_id}</folderId>
    <sysname>out</sysname>
    <name/>
    <system>outgoing</system>
    <currentSize>0</currentSize>
    <quotaLimit>1073741824</quotaLimit>
    <maxFileSize>157286400</maxFileSize>
    <readLocked>false</readLocked>
    <writeLocked>false</writeLocked>
    <created>{datetime}</created>
  </drive>
</getDriveInfoResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/driveinfo" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /driveuploadsize <a id="putv1driveuploadsize"></a>

**Set the drive maximum upload size**

Sets the maximum per-file upload size for a named user's drive.

The target drive is identified by `<username>`, not by a drive id. `<fileSize>`
is in bytes.

The caller must be the tenant owner or an administrator of the tenant; the signup
source is resolved from the caller before the change is applied.

By default the new limit may not be lower than the drive's current largest file.
Set `<override>true</override>` to apply a lower limit anyway.

### Request

`PUT https://api.cloudbackend.com/v1/driveuploadsize`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateDriveMaxFileSize>`

```xml
<updateDriveMaxFileSize>
  <username>{username}</username>
  <fileSize>{bytes}</fileSize>
</updateDriveMaxFileSize>
```

*Raise the limit for a user*

```xml
<updateDriveMaxFileSize>
  <username>{username}</username>
  <fileSize>157286401</fileSize>
</updateDriveMaxFileSize>
```

*Lower the limit past the current largest file*

```xml
<updateDriveMaxFileSize>
  <username>{username}</username>
  <fileSize>157286400</fileSize>
  <override>true</override>
</updateDriveMaxFileSize>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Maximum upload size updated |
| `400` | Bad Request. Returned both when the caller lacks permission and when the new limit is rejected — this endpoint does not use 403. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateDriveMaxFileSizeResponse>`

```xml
<updateDriveMaxFileSizeResponse>OK</updateDriveMaxFileSizeResponse>
```

#### `400` · text/plain

*Caller is not the tenant owner or an administrator*

```text
Not owner or admin of tenant
```

*New limit is below the drive's current largest file*

```text
New max file size is lower then current file size
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/driveuploadsize" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateDriveMaxFileSize>
  <username>{username}</username>
  <fileSize>{bytes}</fileSize>
</updateDriveMaxFileSize>'
```

---
