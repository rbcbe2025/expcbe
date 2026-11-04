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
| `401` | Unauthorized |
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

Resizes a drive by changing its quota. Admin can override with the override flag.

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
| `401` | Unauthorized |
| `404` | Not Found |
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
