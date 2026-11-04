# REST API — Jobs

3 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## GET /jobs <a id="getv1jobs"></a>

**List jobs**

Lists all asynchronous jobs belonging to the calling user.

Each `<job>` carries its lifecycle state; see
`GET /jobs/{job_id}` for the meaning of the
individual fields.

### Request

`GET https://api.cloudbackend.com/v1/jobs`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The caller's jobs |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<jobs>`

```xml
<jobs>
  <job>
    <id>SWY0X55ZBK93</id>
    <kind>another job</kind>
    <status>pending</status>
    <source>image processing</source>
    <progress>0</progress>
    <created>2026-08-03 09:00:58</created>
    <updated>2026-08-03 09:00:58</updated>
    <expires>2026-08-04 09:00:58</expires>
    <completed>NULL</completed>
    <owner_id>18446744073709551605</owner_id>
  </job>
  <job>
    <id>ZTK9EW8D80PG</id>
    <kind>some job</kind>
    <status>pending</status>
    <source>testing</source>
    <progress>0</progress>
    <created>2026-08-03 09:00:58</created>
    <updated>2026-08-03 09:00:58</updated>
    <expires>2026-08-04 09:00:58</expires>
    <completed>NULL</completed>
    <owner_id>18446744073709551605</owner_id>
  </job>
</jobs>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/jobs" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /jobs/{job_id} <a id="getv1jobsid"></a>

**Get job details**

Returns the current state of one asynchronous job.

#### Fields

| Element | Description |
|---|---|
| `id` | Job identifier |
| `kind` | What kind of job this is |
| `status` | Lifecycle state — observed values are `pending`, `complete` and `failed` |
| `source` | What submitted the job |
| `progress` | Completion percentage, 0–100 |
| `created` / `updated` | Timestamps, `YYYY-MM-DD HH:MM:SS` |
| `expires` | When the job record is discarded |
| `completed` | Completion timestamp, or the literal string `NULL` while the job is unfinished |
| `owner_id` | Owning user |

A finished job additionally carries `<result>` with a `result_url` to fetch the
output from, and that result has its own `expires`. A failed job carries
`<error>` with a `message` and the time it `occurred`.

**`<result>` and `<error>` are not mutually exclusive** — a job may produce a
result and still report a non-critical error.

### Request

`GET https://api.cloudbackend.com/v1/jobs/{job_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `job_id` | path | yes | string | Job identifier, as returned by `GET /jobs`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The job's current state |
| `401` | Unauthorized |
| `404` | No job with that id, or it has expired |
| `500` | Internal Server Error |

#### `200` · application/xml · `<job>`

```xml
<job>
  <id>{job_id}</id>
  <kind>{kind}</kind>
  <status>pending</status>
  <source>{source}</source>
  <progress>0</progress>
  <created>{datetime}</created>
  <updated>{datetime}</updated>
  <expires>{datetime}</expires>
  <completed>NULL</completed>
  <owner_id>{user_id}</owner_id>
</job>
```

*Completed job, with a result*

```xml
<job>
  <id>ZMAWS27AKBW4</id>
  <kind>some job</kind>
  <status>complete</status>
  <source>testing</source>
  <progress>100</progress>
  <created>2026-08-03 09:07:13</created>
  <updated>2026-08-03 09:07:13</updated>
  <expires>2026-08-04 09:07:13</expires>
  <completed>2026-08-03 09:07:13</completed>
  <owner_id>18446744073709551605</owner_id>
  <result>
    <job_id>ZMAWS27AKBW4</job_id>
    <result_url>/result/url</result_url>
    <expires>2026-08-03 09:07:14</expires>
    <created>2026-08-03 09:07:13</created>
  </result>
</job>
```

*Failed job, with an error*

```xml
<job>
  <id>4AP4VDDPQSB1</id>
  <kind>some job</kind>
  <status>failed</status>
  <source>testing</source>
  <progress>0</progress>
  <created>2026-08-03 09:00:58</created>
  <updated>2026-08-03 09:00:58</updated>
  <expires>2026-08-04 09:00:58</expires>
  <completed>NULL</completed>
  <owner_id>18446744073709551605</owner_id>
  <error>
    <id>it's me</id>
    <job_id>4AP4VDDPQSB1</job_id>
    <message>ran out of steam</message>
    <occurred>2026-08-03 09:00:58</occurred>
  </error>
</job>
```

*Job still running*

```xml
<job>
  <id>SWY0X55ZBK93</id>
  <kind>another job</kind>
  <status>pending</status>
  <source>image processing</source>
  <progress>0</progress>
  <created>2026-08-03 09:00:58</created>
  <updated>2026-08-03 09:00:58</updated>
  <expires>2026-08-04 09:00:58</expires>
  <completed>NULL</completed>
  <owner_id>18446744073709551605</owner_id>
</job>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/jobs/{job_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /jobs/{job_id}/abort <a id="postv1jobsabort"></a>

**Abort a job**

Signals a job to abort by setting its status to `aborting`. Only the job's owner can abort it.
No request body; the response is 200 with no body.

This is cooperative, not pre-emptive: the running job is responsible for reading
the abort signal and acting on it, so a job may keep running, or complete, after
this call returns. Poll `GET /jobs/{job_id}` to
see whether it actually stopped.

### Request

`POST https://api.cloudbackend.com/v1/jobs/{job_id}/abort`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `job_id` | path | yes | string · pattern `^[0-9A-HJKMNP-TV-Z]{12}$` | Job to signal, a 12-character id (digits and upper-case letters, without I, L, O and U). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Abort signalled. No response body. |
| `401` | Unauthorized |
| `404` | `job not found`: no job with that id owned by the caller. |
| `500` | Internal Server Error |

#### `404` · text/plain

```text
job not found
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/jobs/{job_id}/abort" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
