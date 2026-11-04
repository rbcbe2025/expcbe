# REST API — Group

120 operations. Every request needs `Authorization: WRAP access_token=<session_token>` except the ones that authenticate. Bodies are `application/xml` unless the card says otherwise.

## POST /group <a id="postv1group"></a>

**Create a group**

Creates a new group with the specified parent, name, and visibility settings.

### Request

`POST https://api.cloudbackend.com/v1/group`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createGroup>`

```xml
<createGroup>
  <group parentId="{parent_group_id}" name="{group_name}" ownerAlias="iAmOwner" visibility="public" application="open" />
</createGroup>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group created |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createGroupResponse>`

```xml
<createGroupResponse>
  <group id="{group_id}" driveId="{drive_id}" folderId="{container_id}" name="{group_name}" memberId="{member_id}" alias="{alias}">
    <group id="{owner_role_id}" role="Owner" />
    <group id="{admin_role_id}" role="Administrator" />
  </group>
</createGroupResponse>
```

#### `409` · text/plain

```text
There is already a group with that name.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/group" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createGroup>
  <group parentId="{parent_group_id}" name="{group_name}" ownerAlias="iAmOwner" visibility="public" application="open" />
</createGroup>'
```

---

## DELETE /group <a id="deletev1group"></a>

**Delete a group**

Removes a subgroup. The body names the parent group in `<group id>` (defaults to the
root group when left out) and the group to remove in `<childGroup>`, either by id
(`<childGroup id="..."/>`) or by name (`<childGroup>name</childGroup>`).

Optional elements: `<includechildren>true</includechildren>` also removes the group's
own subgroups — without it a group that has subgroups is not removed
(`403 Group has children. Requires includechildren true`); `<comment>` is a text passed
on in the removal notification to the members.

Allowed for members of the group's Owner role and for identities with `delete` on the
parent group's subgroups ACL. Tenant groups cannot be removed. The removal itself runs
asynchronously after the response.

### Request

`DELETE https://api.cloudbackend.com/v1/group`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<removeGroup>`

```xml
<removeGroup>
  <group id="{parent_group_id}" />
  <childGroup id="{group_id}" />
  <includechildren>true</includechildren>
</removeGroup>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group removal accepted |
| `400` | Bad Request — `<childGroup>` missing or its id is 0. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not remove the group, it is a tenant group, or it has subgroups and `includechildren` is not `true`. |
| `404` | Not Found — the group (or the named child group) does not exist. |
| `415` | Unsupported Media Type — `Content-Type` is not `application/xml` or `text/xml`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<removeGroupResponse>`

```xml
<removeGroupResponse>OK</removeGroupResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/group" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<removeGroup>
  <group id="{parent_group_id}" />
  <childGroup id="{group_id}" />
  <includechildren>true</includechildren>
</removeGroup>'
```

---

## PUT /group <a id="putv1group"></a>

**Rename a group**

Renames a subgroup. The body names the parent group in `<group id>` (defaults to the
root group when left out), the group to rename in `<childGroup>` (by `id` attribute or
by name as text) and the new name in `<newName>`.

Allowed for members of the group's Owner role and for identities with `write` on the
parent group's subgroups ACL. The new name must be unique among the parent's subgroups.

### Request

`PUT https://api.cloudbackend.com/v1/group`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<renameGroup>`

```xml
<renameGroup>
  <group id="{parent_group_id}" />
  <childGroup id="{group_id}" />
  <newName>{new_group_name}</newName>
</renameGroup>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group renamed |
| `400` | Bad Request — `<newName>` or `<childGroup>` missing, or the new name is not a valid group name. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not rename the group. |
| `404` | Not Found — the group (or the named child group) does not exist. |
| `409` | Conflict — the parent already has a group with that name. |
| `415` | Unsupported Media Type — `Content-Type` is not `application/xml` or `text/xml`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<renameGroupResponse>`

```xml
<renameGroupResponse>OK</renameGroupResponse>
```

#### `409` · text/plain

```text
Group name already exists
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/group" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameGroup>
  <group id="{parent_group_id}" />
  <childGroup id="{group_id}" />
  <newName>{new_group_name}</newName>
</renameGroup>'
```

---

## GET /role <a id="getv1role"></a>

**List roles for a group**

Lists all roles (Owner, Administrator, Custom) for a group.

### Request

`GET https://api.cloudbackend.com/v1/role`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose roles are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of roles |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listRolesResponse>`

```xml
<listRolesResponse>
  <group id="{group_id}">
    <group id="{owner_role_id}" role="Owner" />
    <group id="{admin_role_id}" role="Administrator" />
    <group id="{custom_role_id}" role="Custom" name="roleName" />
  </group>
</listRolesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/role" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /role <a id="postv1role"></a>

**Create a custom role**

Creates a custom role for a group.

### Request

`POST https://api.cloudbackend.com/v1/role`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createRole>`

```xml
<createRole>
  <group id="{group_id}" />
  <name>roleName</name>
</createRole>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Role created |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createRoleResponse>`

```xml
<createRoleResponse>
  <group id="{role_id}" name="roleName" role="Custom" />
</createRoleResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/role" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createRole>
  <group id="{group_id}" />
  <name>roleName</name>
</createRole>'
```

---

## PUT /role <a id="putv1role"></a>

**Rename a role**

Renames a custom role in a group.

### Request

`PUT https://api.cloudbackend.com/v1/role`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<renameRole>`

```xml
<renameRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <newName>{new_name}</newName>
</renameRole>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Role renamed |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<renameRoleResponse>`

```xml
<renameRoleResponse>OK</renameRoleResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/role" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<renameRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <newName>{new_name}</newName>
</renameRole>'
```

---

## DELETE /role <a id="deletev1role"></a>

**Remove a role**

Removes a custom role from a group.

### Request

`DELETE https://api.cloudbackend.com/v1/role`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<removeRole>`

```xml
<removeRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
</removeRole>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Role removed |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<removeRoleResponse>`

```xml
<removeRoleResponse>OK</removeRoleResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/role" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<removeRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
</removeRole>'
```

---

## PUT /groupapplication <a id="putv1groupapplication"></a>

**Update group application**

Updates the application setting for a group (e.g. open, invite).

### Request

`PUT https://api.cloudbackend.com/v1/groupapplication`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateGroupApplication>`

```xml
<updateGroupApplication>
  <group id="{group_id}" />
  <application>invite</application>
</updateGroupApplication>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group application updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateGroupApplicationResponse>`

```xml
<updateGroupApplicationResponse>OK</updateGroupApplicationResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groupapplication" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateGroupApplication>
  <group id="{group_id}" />
  <application>invite</application>
</updateGroupApplication>'
```

---

## GET /groupdb <a id="getv1groupdb"></a>

**Query group database**

Queries the group database to list groups for a parent group.

### Request

`GET https://api.cloudbackend.com/v1/groupdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group to query. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group database results |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryGroupDBResponse>`

```xml
<queryGroupDBResponse>
  <db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:actuate="onRequest" xlink:href="home://">
    <db:group name="{group_name}" id="{group_id}" parentid="{parent_id}" published="{datetime}" updated="{datetime}">
      <author>
        <email>{email}</email>
      </author>
    </db:group>
    <db:paging start="0" size="100" total="{count}" />
  </db:result>
</queryGroupDBResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupdb" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groupdb <a id="postv1groupdb"></a>

**Get group entry**

Returns the Atom entry for a specific group.

### Request

`POST https://api.cloudbackend.com/v1/groupdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<getGroupEntry>`

```xml
<getGroupEntry>
  <group id="{group_id}" />
  <childGroup id="{child_group_id}" />
</getGroupEntry>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group entry |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getGroupEntryResponse>`

```xml
<getGroupEntryResponse>
  <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
    <atom:title>{group_name}</atom:title>
    <atom:published>{datetime}</atom:published>
    <atom:updated>{datetime}</atom:updated>
    <atom:link rel="alternate" type="application/octet-stream" href="" length="0" stream_1_length="0" />
    <atom:id>mid:{message_id}@xios.xcerion.com</atom:id>
    <dc:pgroup xmlns:dc="http://xcerion.com/directory.xsd">{parent_group_id}</dc:pgroup>
    <dc:group>{group_id}</dc:group>
    <atom:author>
      <atom:name>{author_name}</atom:name>
    </atom:author>
    <dc:sometag1>somedata1</dc:sometag1>
    <dc:sometag2>somedata2</dc:sometag2>
    <ni:sometag3 xmlns:ni="http://xcerion.com/noindex.xsd">somedata3</ni:sometag3>
    <ni:sometag4 xmlns:ni="http://xcerion.com/noindex.xsd">somedata4</ni:sometag4>
  </atom:entry>
</getGroupEntryResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groupdb" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<getGroupEntry>
  <group id="{group_id}" />
  <childGroup id="{child_group_id}" />
</getGroupEntry>'
```

---

## PUT /groupdb <a id="putv1groupdb"></a>

**Update group entry**

Updates the Atom entry metadata for a group.

### Request

`PUT https://api.cloudbackend.com/v1/groupdb`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateGroupEntry>`

```xml
<updateGroupEntry>
  <group id="{group_id}" />
  <childGroup id="{child_group_id}" />
  <atom:entry xmlns:atom="http://www.w3.org/2005/Atom">
    <atom:title>New {group_name}</atom:title>
    <atom:author>
      <atom:name>New {author_name}</atom:name>
    </atom:author>
    <dc:sometag1 xmlns:dc="http://xcerion.com/directory.xsd">somedata1</dc:sometag1>
    <dc:sometag2>somedata2</dc:sometag2>
    <ni:sometag3 xmlns:ni="http://xcerion.com/noindex.xsd">somedata3</ni:sometag3>
    <ni:sometag4>somedata4</ni:sometag4>
  </atom:entry>
</updateGroupEntry>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group entry updated |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateGroupEntryResponse>`

```xml
<updateGroupEntryResponse>
  <atom:entry>
    <atom:title>New {group_name}</atom:title>
    <atom:published></atom:published>
    <atom:updated></atom:updated>
    <atom:link rel="alternate" type="application/octet-stream" href="" length="0" stream_1_length="0" />
    <atom:id></atom:id>
    <dc:pgroup>{parent_group_id}</dc:pgroup>
    <dc:group>{group_id}</dc:group>
    <atom:author>
      <atom:name>New {author_name}</atom:name>
    </atom:author>
    <dc:sometag1>somedata1</dc:sometag1>
    <dc:sometag2>somedata2</dc:sometag2>
    <ni:sometag3>somedata3</ni:sometag3>
    <ni:sometag4>somedata4</ni:sometag4>
  </atom:entry>
</updateGroupEntryResponse>
```

#### `403` · text/plain

```text
Group information entry access denied.
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groupdb" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateGroupEntry>…</updateGroupEntry>'
```

---

## GET /groupinvite <a id="getv1groupinvite"></a>

**List invited users**

Lists users invited to a group.

### Request

`GET https://api.cloudbackend.com/v1/groupinvite`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose pending invitations are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of invited users |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listInvitedUsersResponse>`

```xml
<listInvitedUsersResponse>
  <invites>
    <invite inviterId="{user_id}" comment="some invite user comment" date="{datetime}">
      <user memberId="{user_id}" groupId="{group_id}" alias="tmjrnjgfsq"/>
    </invite>
    <invite inviterId="{user_id}" comment="some accept invite comment" date="{datetime}">
      <user memberId="{user_id}" groupId="{group_id}" alias="tmjrnjgfsq"/>
    </invite>
  </invites>
</listInvitedUsersResponse>
```

*No invited users*

```xml
<listInvitedUsersResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  <invites />
</listInvitedUsersResponse>
```

*Users have been invited*

```xml
<listInvitedUsersResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  <invites>
    <invite inviterId="{member_id}" comment="{comment1}" date="">
      <user memberId="" groupId="{group_id}" alias="{alias1}" />
    </invite>
    <invite inviterId="{member_id}" comment="{comment2}" date="">
      <user memberId="" groupId="{group_id}" alias="{alias2}" />
    </invite>
  </invites>
</listInvitedUsersResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupinvite" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groupinvite <a id="postv1groupinvite"></a>

**Invite a user to a group**

Invites a user to join a group with an optional comment.

### Request

`POST https://api.cloudbackend.com/v1/groupinvite`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<inviteGroupUser>`

```xml
<inviteGroupUser>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <comment>{comment}</comment>
</inviteGroupUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User invited |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<inviteGroupUserResponse>`

```xml
<inviteGroupUserResponse>
  OK
</inviteGroupUserResponse>
```

#### `403` · text/plain

```text
You are not allowed to invite users
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groupinvite" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<inviteGroupUser>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <comment>{comment}</comment>
</inviteGroupUser>'
```

---

## DELETE /groupinvite <a id="deletev1groupinvite"></a>

**Reject group invite**

Rejects a pending group invitation.

### Request

`DELETE https://api.cloudbackend.com/v1/groupinvite`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<rejectInviteGroupUser>`

```xml
<rejectInviteGroupUser>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <comment>{comment}</comment>
</rejectInviteGroupUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Invite rejected |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<rejectInviteGroupUserResponse>`

```xml
<rejectInviteGroupUserResponse>
  OK
</rejectInviteGroupUserResponse>
```

#### `403` · text/plain

```text
You must have a standing invitation in order to reject it!
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/groupinvite" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<rejectInviteGroupUser>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <comment>{comment}</comment>
</rejectInviteGroupUser>'
```

---

## GET /groupjoinrequests <a id="getv1groupjoinrequests"></a>

**List join group requests**

Lists pending membership requests for a group.

### Request

`GET https://api.cloudbackend.com/v1/groupjoinrequests`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose pending join requests are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of join requests |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listJoinGroupRequestsResponse>`

```xml
<listJoinGroupRequestsResponse>
  <requests>
    <request userId="{user_id}" alias="alias-user2" date="{datetime}" comment="let me join this review group again" accepted="{datetime}"/>
  </requests>
</listJoinGroupRequestsResponse>
```

*No pending requests*

```xml
<listJoinGroupRequestsResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  <requests />
</listJoinGroupRequestsResponse>
```

*Pending requests exist*

```xml
<listJoinGroupRequestsResponse>
  <requests>
    <request userId="{user_id}" alias="{alias}" date="" comment="{comment}" accepted="" />
  </requests>
</listJoinGroupRequestsResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupjoinrequests" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groupjoinrequests <a id="postv1groupjoinrequests"></a>

**Request group membership**

Requests membership in a public group.

### Request

`POST https://api.cloudbackend.com/v1/groupjoinrequests`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<requestGroupMembership>`

*User 1 requests membership*

```xml
<requestGroupMembership>
  <group id="{group_id}" />
  <alias>alias-user1</alias>
  <comment>let me join</comment>
  <visibility>public</visibility>
</requestGroupMembership>
```

*User 2 requests membership*

```xml
<requestGroupMembership>
  <group id="{group_id}" />
  <alias>alias-user2</alias>
  <comment>let me join</comment>
  <visibility>public</visibility>
</requestGroupMembership>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Membership request created |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<requestGroupMembershipResponse>`

*Response with group info*

```xml
<requestGroupMembershipResponse>
  <group parentGroupId="{parent_group_id}" id="{group_id}" memberId="{member_id}" containerId="{container_id}" driveId="{drive_id}" name="{group_name}" alias="{alias}" />
</requestGroupMembershipResponse>
```

*Request accepted*

```xml
<requestGroupMembershipResponse>
  Group request accepted
</requestGroupMembershipResponse>
```

#### `403` · text/plain

```text
You can not request membership in this group
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groupjoinrequests" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<requestGroupMembership>
  <group id="{group_id}" />
  <alias>alias-user1</alias>
  <comment>let me join</comment>
  <visibility>public</visibility>
</requestGroupMembership>'
```

---

## PUT /groupmembership <a id="putv1groupmembership"></a>

**Accept join group request**

Accepts a pending group membership request.

This path also answers GET and POST, but they duplicate
`GET /groupjoinrequests` and
`POST /groupjoinrequests` exactly.
Use `/groupjoinrequests` to list pending requests or request membership; use this
path to accept (PUT) or reject (DELETE) one.

### Request

`PUT https://api.cloudbackend.com/v1/groupmembership`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<acceptJoinGroupRequest>`

```xml
<acceptJoinGroupRequest>
  <group id="{group_id}" />
  <user id="{user_id}" />
</acceptJoinGroupRequest>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Membership accepted |
| `401` | Unauthorized |
| `404` | Request not found |
| `500` | Internal Server Error |

#### `404` · text/plain

```text
Request not found
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groupmembership" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acceptJoinGroupRequest>
  <group id="{group_id}" />
  <user id="{user_id}" />
</acceptJoinGroupRequest>'
```

---

## DELETE /groupmembership <a id="deletev1groupmembership"></a>

**Reject group join request**

Rejects a pending group membership request.

### Request

`DELETE https://api.cloudbackend.com/v1/groupmembership`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<rejectJoinGroupRequest>`

```xml
<rejectJoinGroupRequest>
  <group id="{group_id}"/>
  <user id="{user_id}"/>
</rejectJoinGroupRequest>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Request rejected |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<rejectJoinGroupRequestResponse>`

```xml
<rejectJoinGroupRequestResponse>OK</rejectJoinGroupRequestResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/groupmembership" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<rejectJoinGroupRequest>
  <group id="{group_id}"/>
  <user id="{user_id}"/>
</rejectJoinGroupRequest>'
```

---

## GET /groups/{group_id} <a id="getv1groups"></a>

**Get group info**

Returns group metadata including visibility and application settings.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group info |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<groupInfo>`

```xml
<groupInfo parent_group_id="{parent_group_id}" group_id="{group_id}" drive_id="" home_container_id="" visibility="{visibility}" application="{application}" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/webshares <a id="getv1groupswebshares"></a>

**List webshares for a group**

Lists all webshares created by members of a group.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/webshares`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of webshares |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshares>`

```xml
<webshares xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>3</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <webshare id="10" groupId="{group_id}" name="group ws 1" description="" visibility="public" type="" access="read" created="{datetime}" updated="{datetime}" password="" createdState="existing"/>
  <webshare id="11" groupId="{group_id}" name="group ws 2" description="" visibility="public" type="" access="read" created="{datetime}" updated="{datetime}" password="" createdState="existing"/>
  <webshare id="12" groupId="{group_id}" name="group ws 3" description="" visibility="private" type="" access="update" created="{datetime}" updated="{datetime}" password="true" createdState="existing"/>
</webshares>
```

*With webshares*

```xml
<webshares xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>3</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <webshare id="{webshare_id}" groupId="{group_id}" name="group ws 1" description="" visibility="public" type="" access="read" created="" updated="" password="" createdState="existing" />
  <webshare id="{webshare_id}" groupId="{group_id}" name="group ws 2" description="" visibility="public" type="" access="read" created="" updated="" password="" createdState="existing" />
  <webshare id="{webshare_id}" groupId="{group_id}" name="group ws 3" description="" visibility="private" type="" access="update" created="" updated="" password="true" createdState="existing" />
</webshares>
```

*No webshares*

```xml
<webshares xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
</webshares>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/webshares" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /groups/{group_id}/webshares/{webshare_id} <a id="deletev1groupswebshares"></a>

**Delete a webshare**

Deletes a webshare by ID.

### Request

`DELETE https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
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
curl -X DELETE "https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/webshares/{webshare_id} <a id="getv1groupswebsharesid"></a>

**Get a group webshare**

Returns the settings of one webshare owned by the group: name, description,
`visibility` (`public`, `friends`, `private`, `invited`), `type`, `access`
(`read`, `create`, `update`, `createonly`) and created/updated times. `password`
is `true` when a password is set, empty when there is none, and — for tenants that
store webshare passwords in clear text — the password itself. Shared containers and
objects of the webshare, if any, follow as `<folder name id/>` and
`<document name folder id/>` child elements (this URL keeps the established
element names).

The caller needs read access to the group's webshares. No request body.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
| `webshare_id` | path | yes | integer | Id of the webshare. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The webshare |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not read the group's webshares |
| `404` | Not Found — group or webshare not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshare>`

```xml
<webshare id='{webshare_id}' groupId='{group_id}' name='group ws 1' description='' visibility='public' type='' access='read' created='{datetime}' updated='{datetime}' password='' createdState='existing'></webshare>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groups/{group_id}/webshares/{webshare_id} <a id="postv1groupswebsharesid"></a>

**Update a group webshare**

Updates a webshare owned by the group. The body is a `<webshare>` element whose
attributes **replace all settings**: `name` (required), `description`,
`visibility` (`public`, `friends`, `private`, `invited`; default `public`),
`access` (`read`, `create`, `update`, `createonly`; default `read`), `type` and
`password`. An attribute that is left out is reset to its default (empty
description, type and password), so send the full set every time.

Inbound access (`create`, `update`, `createonly`) is not allowed on a `public`
webshare (`400 Not A Valid Inbound Webshare`).

The caller needs write access to the group's webshares. Returns no content.

### Request

`POST https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
| `webshare_id` | path | yes | integer | Id of the webshare. |

#### Body

`application/xml` (required), root element `<webshare>`

```xml
<webshare name="group ws 3" description="Uploads from partners" visibility="private" access="update" type="" password="{password}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Webshare updated |
| `400` | Bad Request — invalid name, or `Not A Valid Inbound Webshare` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change the group's webshares |
| `404` | Not Found — group or webshare not found |
| `422` | Unprocessable Entity — `Missing 'name' attribute` |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groups/{group_id}/webshares/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<webshare name="group ws 3" description="Uploads from partners" visibility="private" access="update" type="" password="{password}" />'
```

---

## PUT /groupvisibility <a id="putv1groupvisibility"></a>

**Update group visibility**

Updates the visibility setting for a group (public, private).

### Request

`PUT https://api.cloudbackend.com/v1/groupvisibility`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateGroupVisibility>`

```xml
<updateGroupVisibility>
  <group id="{group_id}" visibility="{visibility}" />
</updateGroupVisibility>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Visibility updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateGroupVisibilityResponse>`

```xml
<updateGroupVisibilityResponse>
  OK
</updateGroupVisibilityResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groupvisibility" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateGroupVisibility>
  <group id="{group_id}" visibility="{visibility}" />
</updateGroupVisibility>'
```

---

## PUT /onlinestatus <a id="putv1onlinestatus"></a>

**Update online status**

Updates the online status for a user in a group.

### Request

`PUT https://api.cloudbackend.com/v1/onlinestatus`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateOnlineStatus>`

```xml
<updateOnlineStatus>
  <status groupId="{group_id}" status="online" message="{message}" />
</updateOnlineStatus>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Status updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateOnlineStatusResponse>`

```xml
<updateOnlineStatusResponse>OK</updateOnlineStatusResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/onlinestatus" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateOnlineStatus>
  <status groupId="{group_id}" status="online" message="{message}" />
</updateOnlineStatus>'
```

---

## GET /onlinestatus <a id="getv1onlinestatus"></a>

**Get online status**

Returns the online status for a group member.

### Request

`GET https://api.cloudbackend.com/v1/onlinestatus`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group the member belongs to. |
| `memberid` | query | no | integer · default `0` | Member whose online status is returned. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Online status |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getOnlineStatusResponse>`

```xml
<getOnlineStatusResponse>
  <status groupId="{group_id}" userId="{member_id}" status="online" message="" lastSeen="" />
</getOnlineStatusResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/onlinestatus" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /membershipvisibility <a id="putv1membershipvisibility"></a>

**Update membership visibility**

Updates the visibility of a user's membership in a group.

### Request

`PUT https://api.cloudbackend.com/v1/membershipvisibility`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<updateMembershipVisibility>`

```xml
<updateMembershipVisibility>
  <group id="{group_id}" visibility="private" />
</updateMembershipVisibility>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Membership visibility updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<updateMembershipVisibilityResponse>`

```xml
<updateMembershipVisibilityResponse>OK</updateMembershipVisibilityResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/membershipvisibility" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<updateMembershipVisibility>
  <group id="{group_id}" visibility="private" />
</updateMembershipVisibility>'
```

---

## GET /groupbanuser <a id="getv1groupbanuser"></a>

**List banned users**

Lists users banned from a group.

### Request

`GET https://api.cloudbackend.com/v1/groupbanuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose banned users are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of banned users |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listBannedUsersResponse>`

```xml
<listBannedUsersResponse>
  <users>
    <user id="{user_id}" name="alias-user2" bannedBy="{user_id}" bannedDate="{datetime}" bannedReason="some ban reason"/>
  </users>
</listBannedUsersResponse>
```

*No banned users*

```xml
<listBannedUsersResponse>
  <users />
</listBannedUsersResponse>
```

*Users have been banned*

```xml
<listBannedUsersResponse>
  <users>
    <user id="{member_id}" name="{alias}" bannedBy="{banned_by}" bannedDate="" bannedReason="{reason}" />
  </users>
</listBannedUsersResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupbanuser" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groupbanuser <a id="postv1groupbanuser"></a>

**Ban a user from a group**

Bans a user from a group with a reason and comment.

### Request

`POST https://api.cloudbackend.com/v1/groupbanuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<banGroupUser>`

```xml
<banGroupUser>
  <group id="{group_id}" />
  <user>{alias}</user>
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</banGroupUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User banned |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<banGroupUserResponse>`

```xml
<banGroupUserResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  OK
</banGroupUserResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groupbanuser" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<banGroupUser>
  <group id="{group_id}" />
  <user>{alias}</user>
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</banGroupUser>'
```

---

## DELETE /groupbanuser <a id="deletev1groupbanuser"></a>

**Unban a user**

Removes a ban from a user in a group.

### Request

`DELETE https://api.cloudbackend.com/v1/groupbanuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<unbanGroupUser>`

```xml
<unbanGroupUser>
  <group id="{group_id}" />
  <user id="{member_id}" />
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</unbanGroupUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User unbanned |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<unbanGroupUserResponse>`

```xml
<unbanGroupUserResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  OK
</unbanGroupUserResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/groupbanuser" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<unbanGroupUser>
  <group id="{group_id}" />
  <user id="{member_id}" />
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</unbanGroupUser>'
```

---

## DELETE /groupkickuser <a id="deletev1groupkickuser"></a>

**Kick a user from a group**

Removes a user from a group with a reason and comment.

### Request

`DELETE https://api.cloudbackend.com/v1/groupkickuser`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<kickGroupUser>`

```xml
<kickGroupUser>
  <group id="{group_id}" />
  <user>{alias}</user>
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</kickGroupUser>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | User kicked |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<kickGroupUserResponse>`

```xml
<kickGroupUserResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  OK
</kickGroupUserResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/groupkickuser" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<kickGroupUser>
  <group id="{group_id}" />
  <user>{alias}</user>
  <reason>{reason}</reason>
  <comment>{comment}</comment>
</kickGroupUser>'
```

---

## GET /groupusers <a id="getv1groupusers"></a>

**List group users**

Lists all members of a group.

### Request

`GET https://api.cloudbackend.com/v1/groupusers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose members are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of group users |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listGroupUsersResponse>`

```xml
<listGroupUsersResponse xmlns:xcr="http://xcerion.com/xcRepository.xsd">
  <users>
    <user id="{member_id}" name="{alias}" />
  </users>
</listGroupUsersResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupusers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /leavegroup <a id="postv1leavegroup"></a>

**Leave a group**

Removes the authenticated user from a group. Returns 409 if the user is the group owner.

### Request

`POST https://api.cloudbackend.com/v1/leavegroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<leaveGroup>`

```xml
<leaveGroup>
  <group id="{group_id}" />
</leaveGroup>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Left group successfully |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Group owner cannot leave |
| `500` | Internal Server Error |

#### `409` · text/plain

```text
Group owner cannot leave
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/leavegroup" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<leaveGroup>
  <group id="{group_id}" />
</leaveGroup>'
```

---

## POST /associatedinvite <a id="postv1associatedinvite"></a>

**Validate invite key**

Validates an association invitation key and returns details about the invitation:
the inviting identity, the account type (product) offered, and the invitation
message.

This call does not require authentication. The key is read from
`<association><validate key="…"/></association>`.

### Request

`POST https://api.cloudbackend.com/v1/associatedinvite`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<association>`

```xml
<association>
  <validate key="{invite_key}" />
</association>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Invitation found |
| `400` | Bad Request — the body is not well-formed XML |
| `404` | Not Found — `No invitation found`, `Inviting user not found`, or `Account type not found` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invitation>`

```xml
<invitation>
  <user username="{username}" name="{firstname} {lastname}"/>
  <account type="LARG" size="1.00 GB"/>
  <message>Welcome aboard!</message>
</invitation>
```

#### `404` · text/plain

```text
No invitation found
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/associatedinvite" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<association>
  <validate key="{invite_key}" />
</association>'
```

---

## DELETE /call/{group_id} <a id="deletev1call"></a>

**Proxy DELETE to external API**

Calls an external HTTP API through a proxy definition set up by the tenant owner,
sending an HTTP `DELETE` to the external server unless the body's `<method>` says
otherwise. Behaviour, setup, the request body and variable syntax are identical for
all four methods — see
`GET /call/{group_id}` for the full description.

The request body is required even for `DELETE` (`Content-Type: application/xml`).

### Request

`DELETE https://api.cloudbackend.com/v1/call/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Id of the tenant group that owns the proxy definition and the group key. |

#### Body

`application/xml` (required), root element `<proxy>`

```xml
<proxy name="proxy1name">
  <http-path>/items/42</http-path>
</proxy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The external call was attempted; see `<curlCode>` and `<serverHttpCode>` for its outcome |
| `400` | Bad Request — invalid proxy name, override not allowed, invalid variable, domain, path, params or header |
| `401` | Unauthorized |
| `403` | Forbidden — the caller has no read access to the group key of the proxy's service |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<result>`

```xml
<result>
  <curlCode>0</curlCode>
  <serverHttpCode>200</serverHttpCode>
  <dataContentType>application/json</dataContentType>
  <data><![CDATA[{"deleted":true}]]></data>
</result>
```

#### `400` · text/plain

```text
Can't override <variable> 'VARIABLE1'
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/call/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<proxy name="proxy1name">
  <http-path>/items/42</http-path>
</proxy>'
```

---

## GET /call/{group_id} <a id="getv1call"></a>

**Proxy GET to external API**

Calls an external HTTP API defined by the tenant owner and returns the external
server's response wrapped in XML. Secrets such as API keys stay on the server: they
are stored in a group key and substituted into the outgoing request, never returned
to the caller. `GET`, `POST`, `PUT` and `DELETE` on this path behave identically;
the HTTP method of this call becomes the method of the external request unless the
body's `<method>` element overrides it.

The call is open to logged-in identities and to the public (anonymous) user; access
is decided by the group key ACL (see below).

#### Setup by the tenant owner / admin

1. Add a group key with
   `POST /gkeys/{group_id}` (edit it with
   `PUT /gkeys/{group_id}/{key_id}`). Its
   `<service>` names the service; its `<secret>` holds the secret variables as an
   XML string (escape `&`, `<`, `>` as `&amp;`, `&lt;`, `&gt;`, or use a CDATA
   section):

   ```xml
   <secrets>
     <secret name="THEMOVIEDB_API_KEY" value="..."/>
     <secret name="THEMOVIEDB_ACCESS_TOKEN" value="..."/>
   </secrets>
   ```

2. Give identities and/or groups **read** access to that group key with
   `PUT /gkeys/{group_id}/{key_id};acl`.
   Add the public user id (`0`) to allow anonymous callers. Group owners and admins
   always have access.

3. Upload a proxy definition into the tenant's `/Settings/Proxy/` container as an
   object with the extension `.xdt` or `.cbc`. The object name without extension is
   the proxy name callers use (e.g. `themoviedb.xdt` → `themoviedb`) and must be
   unique per tenant:

   ```xml
   <proxy service="themoviedb" xmlns="https://cloudbackend.com/proxy.xsd">
     <http-domain>https://api.themoviedb.org</http-domain>
     <http-path allow-override="true">/3/search/movie</http-path>
     <http-params>api_key=${THEMOVIEDB_API_KEY}</http-params>
     <http-data></http-data>
     <http-header name="Authorization" value="Bearer ${THEMOVIEDB_ACCESS_TOKEN}"/>
     <http-header name="Accept" value="application/json"/>
     <variable name="LANGUAGE" value="en-US" allow-override="true"/>
   </proxy>
   ```

Elements of the proxy definition (all optional except the `service` attribute):

| Element | Meaning | `allow-override` default | Secrets allowed |
|---|---|---|---|
| `service` attribute | Must equal the `<service>` of a group key. | — | — |
| `<http-domain>` | Scheme and host, e.g. `https://api.example.com`. If missing, the caller must supply it. Keep it fixed (no override) so callers cannot redirect requests to an arbitrary host. | `false` | no |
| `<http-path>` | Path appended to the domain. Must not contain `?` or `&`. | `true` | no |
| `<http-params>` | URL-encoded query string, e.g. `a=123&b=x%20z`. Callers can always add more with `<http-append-params>`. | `false` | yes |
| `<http-data>` | Request body sent to the server. Also send a `Content-Type` `<http-header>`. | `false` | no |
| `<http-header name value>` | HTTP header; any number. | `false` | yes |
| `<variable name value>` | Non-secret variable usable in the other elements and in the caller's XML; any number. Never store secrets here. | `false` | no |

`allow-override="true"` lets the caller replace the value; if it is `false`, a
caller that sends the element gets 400 `Can't override <…>`.

#### Request body

The `<proxy>` body's `name` attribute is the proxy name. All other elements are
optional and override or extend the definition:

- `<method>` — `GET`, `POST`, `PUT` or `DELETE` (upper case) for the external call.
- `<http-domain>`, `<http-path>`, `<http-params>`, `<http-data>` — replace the
  defined value (only if overriding is allowed).
- `<http-append-params>` — appended to the query string with `&`; always allowed.
- `<http-header name value>`, `<variable name value>` — add new headers/variables
  or replace overridable ones.
- `result-cdata` attribute on `<proxy>` (default `true`) — set to `false` to get
  `<data>` XML-escaped instead of wrapped in a CDATA section.

#### Variables

`${NAME}` references a variable or secret; `${func2,func1:NAME}` transforms the value
first, right to left (`func2(func1(NAME))`). Supported functions: `json` and
`jsond` (escape for a double-quoted JSON string), `jsons` (single-quoted JSON5
string) and `urlenc` (percent-encode). `${$}` produces a literal `$`. Example: with
`NAME` = `Double quote " in string`, `"${json:NAME}"` becomes
`"Double quote \" in string"`. Secrets may be used only in `<http-header>` and
`<http-params>`/`<http-append-params>`; anywhere else an unknown name returns 400
`Invalid variable name '…'`.

#### Response

The status is 200 whenever the request was attempted, even if the external server
failed. `<curlCode>` is `0` on success or a curl error code (e.g. `7` when the
connection was refused — connections to private, loopback and other reserved IPv4 addresses and to any IPv6 address are
always refused); `<serverHttpCode>` is the external HTTP status (`0` if no
response); `<dataContentType>` and `<data>` carry the external response.

### Request

`GET https://api.cloudbackend.com/v1/call/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Id of the tenant group that owns the proxy definition and the group key. |

#### Body

`application/xml` (required), root element `<proxy>`

*Call a proxy with its defaults*

```xml
<proxy name="proxy2name">
</proxy>
```

*Override domain, append params and add a variable*

```xml
<proxy name="proxy2name">
  <http-domain>https://www.github.com</http-domain>
  <http-append-params>xyxy=${urlenc:NEW-VARIABLE1}&amp;yxyx=${urlenc:NEW-VARIABLE2}</http-append-params>
  <variable name="NEW-VARIABLE1" value="a b c"/>
  <variable name="NEW-VARIABLE2" value="1 2 3"/>
</proxy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The external call was attempted; see `<curlCode>` and `<serverHttpCode>` for its outcome |
| `400` | Bad Request — e.g. `Invalid proxy name`, `No such proxy name`, `Invalid <method> value`, `Can't override <http-domain>`, `Invalid variable name '…'`, `Invalid variable function '…'`, `Invalid domain`, `Scheme must be http:// or https://`, `Use <http-params> or <http-append-params> to add query parameters`, `Invalid http header` |
| `401` | Unauthorized |
| `403` | Forbidden — the caller has no read access to the group key of the proxy's service |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<result>`

*External server answered*

```xml
<result>
  <curlCode>0</curlCode>
  <serverHttpCode>200</serverHttpCode>
  <dataContentType>text/html; charset=utf-8</dataContentType>
  <data><![CDATA[<!DOCTYPE html>...]]></data>
</result>
```

*Connection refused (e.g. a private address)*

```xml
<result>
  <curlCode>7</curlCode>
  <serverHttpCode>0</serverHttpCode>
  <dataContentType>text/plain</dataContentType>
  <data />
</result>
```

#### `400` · text/plain

```text
No such proxy name
```

#### `403` · text/plain

```text
Forbidden
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/call/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<proxy name="proxy2name">
</proxy>'
```

---

## POST /call/{group_id} <a id="postv1call"></a>

**Proxy POST to external API**

Calls an external HTTP API through a proxy definition set up by the tenant owner,
sending an HTTP `POST` to the external server unless the body's `<method>` says
otherwise. The external request body comes from `<http-data>` (in the definition,
or from the caller if overriding is allowed). Behaviour, setup, the request body and
variable syntax are identical for all four methods — see
`GET /call/{group_id}` for the full description.

### Request

`POST https://api.cloudbackend.com/v1/call/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Id of the tenant group that owns the proxy definition and the group key. |

#### Body

`application/xml` (required), root element `<proxy>`

```xml
<proxy name="proxy2name">
  <http-header name="Content-Type" value="application/json"/>
  <http-data>{"query": "${json:SEARCH}"}</http-data>
  <variable name="SEARCH" value="some text"/>
</proxy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The external call was attempted; see `<curlCode>` and `<serverHttpCode>` for its outcome |
| `400` | Bad Request — invalid proxy name, override not allowed, invalid variable, domain, path, params or header |
| `401` | Unauthorized |
| `403` | Forbidden — the caller has no read access to the group key of the proxy's service |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<result>`

```xml
<result>
  <curlCode>0</curlCode>
  <serverHttpCode>201</serverHttpCode>
  <dataContentType>application/json</dataContentType>
  <data><![CDATA[{"id":123}]]></data>
</result>
```

#### `400` · text/plain

```text
Can't override <variable> 'VARIABLE1'
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/call/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<proxy name="proxy2name">
  <http-header name="Content-Type" value="application/json"/>
  <http-data>{"query": "${json:SEARCH}"}</http-data>
  <variable name="SEARCH" value="some text"/>
</proxy>'
```

---

## PUT /call/{group_id} <a id="putv1call"></a>

**Proxy PUT to external API**

Calls an external HTTP API through a proxy definition set up by the tenant owner,
sending an HTTP `PUT` to the external server unless the body's `<method>` says
otherwise. Behaviour, setup, the request body and variable syntax are identical for
all four methods — see
`GET /call/{group_id}` for the full description.

### Request

`PUT https://api.cloudbackend.com/v1/call/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Id of the tenant group that owns the proxy definition and the group key. |

#### Body

`application/xml` (required), root element `<proxy>`

```xml
<proxy name="proxy2name">
  <http-path>/items/42</http-path>
  <http-header name="Content-Type" value="application/json"/>
  <http-data>{"title": "${json:TITLE}"}</http-data>
  <variable name="TITLE" value="New title"/>
</proxy>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The external call was attempted; see `<curlCode>` and `<serverHttpCode>` for its outcome |
| `400` | Bad Request — e.g. `Invalid <method> value` (the value must be upper case), or an override that is not allowed |
| `401` | Unauthorized |
| `403` | Forbidden — the caller has no read access to the group key of the proxy's service |
| `415` | Unsupported Media Type — `Content-Type` must be `application/xml` or `text/xml` |
| `500` | Internal Server Error |

#### `200` · application/xml · `<result>`

```xml
<result>
  <curlCode>0</curlCode>
  <serverHttpCode>200</serverHttpCode>
  <dataContentType>application/json</dataContentType>
  <data><![CDATA[{"updated":true}]]></data>
</result>
```

#### `400` · text/plain

```text
Invalid <method> value
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/call/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<proxy name="proxy2name">
  <http-path>/items/42</http-path>
  <http-header name="Content-Type" value="application/json"/>
  <http-data>{"title": "${json:TITLE}"}</http-data>
  <variable name="TITLE" value="New title"/>
</proxy>'
```

---

## DELETE /gkeys/{group_id} <a id="deletev1gkeys"></a>

**Delete group keys**

Deletes group keys from the group's keyring: all of them (`?all=true`), the key for one
service (`?service=`), or one key by id (`?id=`). Give exactly one of the parameters; they
are checked in that order and the first one present wins. Without any of them the call
fails with `400 Missing query parameters`.

Deleting all keys requires the caller to be an owner or administrator of the group.
Deleting a single key requires owner/administrator, or `changeACL` in the key's ACL.
Deleting by a service name that does not exist still returns `204`. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/gkeys/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |
| `all` | query | no | string · one of `true`, `false`, `1`, `0` | `true` or `1` deletes every key of the group. |
| `service` | query | no | string | Service name of the key to delete. |
| `id` | query | no | integer | Id of the key to delete. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key(s) deleted |
| `400` | Bad Request — none of `all`, `service` or `id` given. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not delete the key(s). |
| `404` | Not Found — the key id does not exist. |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/gkeys/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /gkeys/{group_id} <a id="getv1gkeys"></a>

**List group keys**

Returns the group's keyring: every group key the caller may read. Group owners and
administrators see all keys; other identities see the keys whose ACL gives them `read`
(see `/gkeys/{group_id}/{key_id};acl`).

Each `<key>` carries its `uri`, `<groupId>`, `<keyId>`, `<service>`, `<title>`,
`<summary>`, `<data>` and `<updated>` (Atom time). The secret of a group key is never
returned.

### Request

`GET https://api.cloudbackend.com/v1/gkeys/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The group keyring |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<keyring>`

```xml
<keyring uri="https://api.cloudbackend.com/v1/gkeys/{group_id}">
  <key uri="https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}">
    <groupId>{group_id}</groupId>
    <keyId>{key_id}</keyId>
    <service>service1 #1</service>
    <title>title service1 #1</title>
    <summary>summary #1</summary>
    <data>data 1 2 3 #1</data>
    <updated>2024-01-01T00:00:00Z</updated>
  </key>
</keyring>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/gkeys/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /gkeys/{group_id} <a id="postv1gkeys"></a>

**Create a group key**

Adds a key to the group's keyring. Only owners and administrators of the group may add
keys, and the call must be made over HTTPS.

The body is a `<key>` element: `<service>` is required and must be unique within the
group's keyring; `<title>`, `<summary>`, `<data>` and `<secret>` are optional. The secret
is stored but never returned.

Returns the created key (without the secret).

### Request

`POST https://api.cloudbackend.com/v1/gkeys/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |

#### Body

`application/xml` (required), root element `<key>`

```xml
<key>
  <service>service1 #1</service>
  <title>title service1 #1</title>
  <summary>summary #1</summary>
  <data>data 1 2 3 #1</data>
  <secret>some secret #1</secret>
</key>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The created key |
| `400` | Bad Request — `<service>` element missing, or the request was not made over HTTPS. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not an owner or administrator of the group. |
| `409` | Conflict — the group already has a key for this service. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<key>`

```xml
<key uri="https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}">
  <groupId>{group_id}</groupId>
  <keyId>{key_id}</keyId>
  <service>service1 #1</service>
  <title>title service1 #1</title>
  <summary>summary #1</summary>
  <data>data 1 2 3 #1</data>
  <updated>2024-01-01T00:00:00Z</updated>
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
curl -X POST "https://api.cloudbackend.com/v1/gkeys/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<key>
  <service>service1 #1</service>
  <title>title service1 #1</title>
  <summary>summary #1</summary>
  <data>data 1 2 3 #1</data>
  <secret>some secret #1</secret>
</key>'
```

---

## DELETE /gkeys/{group_id}/{key_id} <a id="deletev1gkeyskey"></a>

**Delete a group key**

Deletes one key from the group's keyring. Allowed for owners and administrators of the
group and for identities with `changeACL` in the key's ACL. No request body.

### Request

`DELETE https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |
| `key_id` | path | yes | integer | Id of the group key. |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Key deleted |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not delete this key. |
| `404` | Not Found — the key does not exist. |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /gkeys/{group_id}/{key_id} <a id="getv1gkeyskey"></a>

**Get a group key**

Returns one group key. Allowed for owners and administrators of the group and for
identities with `read` in the key's ACL. The secret is never returned.

### Request

`GET https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |
| `key_id` | path | yes | integer | Id of the group key. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The group key |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not read this key. |
| `404` | Not Found — the key does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<key>`

```xml
<key uri="https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}">
  <groupId>{group_id}</groupId>
  <keyId>{key_id}</keyId>
  <service>service1 #1</service>
  <title>title service1 #1</title>
  <summary>summary #1</summary>
  <data>data 1 2 3 #1</data>
  <updated>2024-01-01T00:00:00Z</updated>
</key>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /gkeys/{group_id}/{key_id} <a id="putv1gkeys"></a>

**Modify a group key**

Replaces the fields of a group key. Allowed for owners and administrators of the group
and for identities with `changeACL` in the key's ACL; the call must be made over HTTPS.

The body is a `<key>` element: `<service>` is required (and must stay unique within the
keyring); `<title>`, `<summary>`, `<data>` and `<secret>` are optional — a field left out
is stored as empty.

### Request

`PUT https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group that owns the keyring. |
| `key_id` | path | yes | integer | Id of the group key. |

#### Body

`application/xml` (required), root element `<key>`

```xml
<key>
  <service>service1 #1</service>
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
| `403` | Forbidden — the caller may not change this key. |
| `404` | Not Found — the key does not exist. |
| `409` | Conflict — another key of the group already uses this service. |
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
curl -X PUT "https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<key>
  <service>service1 #1</service>
  <title>updated title</title>
  <summary>updated summary</summary>
  <data>updated data</data>
  <secret>updated secret</secret>
</key>'
```

---

## GET /gkeys/{group_id}/{key_id};acl <a id="getv1gkeyskeyacl"></a>

**Get group key ACL**

Returns the access control list (ACL) of a group key. The ACL decides who besides the group's owners and administrators may read (`read`), update and delete (`changeACL`) the key.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `key_id` | path | yes | integer | Id of the group key. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group key does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /gkeys/{group_id}/{key_id};acl <a id="putv1gkeyskeyacl"></a>

**Modify group key ACL**

Replaces the access control list (ACL) of a group key. The ACL decides who besides the group's owners and administrators may read (`read`), update and delete (`changeACL`) the key.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only the group's owners and administrators, or identities with `changeACL` in the current ACL, may change it (otherwise `403 Forbidden`).

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `key_id` | path | yes | integer | Id of the group key. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group key does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/gkeys/{group_id}/{key_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/bans <a id="getv1groupsbans"></a>

**List banned users**

Lists the members banned from the group. Each `<user>` gives the banned member id
(`id`), its alias in the group (`name`), the member who banned it (`bannedBy`), when
(`bannedDate`, Atom time) and why (`bannedReason`). An empty list is returned as
`<users/>`.

The caller needs `read` on the group's bans ACL (`/groups/{group_id}/bans;acl`).

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/bans`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Banned members |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not list banned users. |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<users>`

```xml
<users><user id='{member_id}' name='{alias}' bannedBy='{banned_by_member_id}' bannedDate='2024-03-05T07:11:00Z' bannedReason='{reason}'/></users>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/bans" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /groups/{group_id}/bans/{member_user_id} <a id="deletev1groupsbans"></a>

**Remove a ban**

Removes a ban. Returns 204 No Content.

### Request

`DELETE https://api.cloudbackend.com/v1/groups/{group_id}/bans/{member_user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `member_user_id` | path | yes | integer |  |

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
curl -X DELETE "https://api.cloudbackend.com/v1/groups/{group_id}/bans/{member_user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/bans;acl <a id="getv1groupsbansacl"></a>

**Get bans ACL**

Returns the access control list (ACL) of the group's ban list. `read` on this ACL is required to list banned members with `GET /groups/{group_id}/bans`.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/bans;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/bans;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/bans;acl <a id="putv1groupsbansacl"></a>

**Modify bans ACL**

Replaces the access control list (ACL) of the group's ban list. `read` on this ACL is required to list banned members with `GET /groups/{group_id}/bans`.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `groupbansaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/bans;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/bans;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/invitations <a id="getv1groupsinvitations"></a>

**List group invitations**

List group invitations Returns

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/invitations`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invites>`

```xml
<invites>
<invite inviterId='inviter-member-user-id' comment='comment' date='invite-date'>
<user memberId='invited-member-user-id' groupId='invited-group-id' alias='invited-alias'/>
</invite>
<!-- ... -->
</invites>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/invitations" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/invitations;acl <a id="getv1groupsinvitationsacl"></a>

**Get invitations ACL**

Returns the access control list (ACL) of the group's invitations. `write` on this ACL is required to invite identities to the group and `delete` to withdraw invitations.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/invitations;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/invitations;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/invitations;acl <a id="putv1groupsinvitationsacl"></a>

**Modify invitations ACL**

Replaces the access control list (ACL) of the group's invitations. `write` on this ACL is required to invite identities to the group and `delete` to withdraw invitations.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `groupinvitationsaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/invitations;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/invitations;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## DELETE /groups/{group_id}/purge <a id="deletev1groupspurge"></a>

**Purge deleted items from database**

Deletes deleted objects/containers/users from db/disk. The caller of the API must be the owner or admin. Output: Nothing

### Request

`DELETE https://api.cloudbackend.com/v1/groups/{group_id}/purge`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `before` | query | no | string | 0 |

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
curl -X DELETE "https://api.cloudbackend.com/v1/groups/{group_id}/purge" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/requests <a id="getv1groupsrequests"></a>

**List group requests**

List group requests Returns

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/requests`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<requests>`

```xml
<requests>
<!-- @accepted is optional -->
<request userId='123456'" alias='alias'" date='atom-time'" comment='comment'" accepted='atom-time'" />
<!-- ... -->
</requests>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/requests" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groups/{group_id}/requests;acl <a id="getv1groupsrequestsacl"></a>

**Get requests ACL**

Returns the access control list (ACL) of the group's membership requests. The ACL governs who may see and handle requests to join the group.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/requests;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/requests;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/requests;acl <a id="putv1groupsrequestsacl"></a>

**Modify requests ACL**

Replaces the access control list (ACL) of the group's membership requests. The ACL governs who may see and handle requests to join the group.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `grouprequestsaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/requests;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/requests;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## POST /groups/{group_id}/roles <a id="postv1groupsroles"></a>

**Create a role**

Creates a custom role in the group. The role name is sent as a form field `name`
(`Content-Type: application/x-www-form-urlencoded`); it must not be empty and must be
unique within the group.

The caller needs `write` on the group's roles ACL (`/groups/{group_id}/roles;acl`). The
new role gets that ACL as its own role ACL, and all group members are notified.
Returns the new role as a `<group>` element with `role='Custom'`.

### Request

`POST https://api.cloudbackend.com/v1/groups/{group_id}/roles`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |

#### Body

`application/x-www-form-urlencoded` (required)

```text
name=new-role
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The created role |
| `400` | Bad Request — `name` missing, empty or invalid. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not create roles in this group. |
| `404` | Not Found — the group does not exist. |
| `409` | Conflict — the group already has a role with this name. |
| `415` | Unsupported Media Type — the body is not `application/x-www-form-urlencoded`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<group>`

```xml
<group id='{role_id}' name='new-role' role='Custom'/>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groups/{group_id}/roles" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
  -d 'name=new-role'
```

---

## GET /groups/{group_id}/roles/{role_id};acl <a id="getv1groupsroleacl"></a>

**Get role ACL**

Returns the access control list (ACL) of one role of the group. A new role starts with a copy of the group's roles ACL (`/groups/{group_id}/roles;acl`).

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/roles/{role_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `role_id` | path | yes | integer | Id of the role (roles are groups). |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group or role does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/roles/{role_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/roles/{role_id};acl <a id="putv1groupsroleacl"></a>

**Modify role ACL**

Replaces the access control list (ACL) of one role of the group. A new role starts with a copy of the group's roles ACL (`/groups/{group_id}/roles;acl`).

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`).

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/roles/{role_id};acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `role_id` | path | yes | integer | Id of the role (roles are groups). |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group or role does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/roles/{role_id};acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/roles;acl <a id="getv1groupsrolesacl"></a>

**Get roles ACL**

Returns the access control list (ACL) of the group's roles. `write` on this ACL is required to create roles with `POST /groups/{group_id}/roles`; new roles get this ACL as their initial role ACL.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/roles;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/roles;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/roles;acl <a id="putv1groupsrolesacl"></a>

**Modify roles ACL**

Replaces the access control list (ACL) of the group's roles. `write` on this ACL is required to create roles with `POST /groups/{group_id}/roles`; new roles get this ACL as their initial role ACL.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `grouprolesaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/roles;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/roles;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/subgroups <a id="getv1groupssubgroups"></a>

**List group tree**

Returns the tree of all groups the logged-in identity belongs to, as nested `<group>`
elements under `<groups>`. Note that `{group_id}` is not used: the result is the same
for any group id.

Each group carries `id`, `memberId` (the caller's member id in it), `driveId`,
`folderId` (the group's root container — this response keeps the internal attribute
name), `name` and `alias` (the caller's alias); `owner="true"` marks groups the
caller owns and `tenantgroup="true"` marks tenant groups. Role entries appear as child
`<group id role>` elements (`Owner`, `Administrator`, ...). The root of the tree is the
`cbe` group.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/subgroups`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Any group id (ignored). |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The caller's group tree |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<groups>`

```xml
<groups>
  <group id="{root_group_id}" name="cbe">
    <group id="{tenant_group_id}" memberId="{member_id}" driveId="{drive_id}" folderId="{container_id}" name="{tenant_name}" alias="{alias}" owner="true" tenantgroup="true">
      <group id="{group_id}" memberId="{member_id}" driveId="{drive_id}" folderId="{container_id}" name="{group_name}" alias="covOwner" owner="true">
        <group id="{owner_role_id}" role="Owner" />
        <group id="{admin_role_id}" role="Administrator" />
      </group>
      <group id="{owner_role_id}" role="Owner" />
      <group id="{admin_role_id}" role="Administrator" />
    </group>
  </group>
</groups>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/subgroups" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /groups/{group_id}/subgroups <a id="postv1groupssubgroups"></a>

**Create a subgroup**

Creates a subgroup of `{group_id}` with the caller as owner. The fields are sent as a
form (`Content-Type: application/x-www-form-urlencoded`):

- `name` (required) — name of the new group, unique among the parent's subgroups.
- `alias` (required) — the caller's alias in the new group.
- `application` (optional) — how identities join: `open` (default), `invite`, `review`
  or `closed`.
- `visibility` — the code intends `public` (default), `friends`, `private` or
  `invited`, but because of a server defect any `visibility` field is rejected with
  `400 Invalid visibility argument`; leave it out.

The caller needs `write` on the parent's subgroups ACL. Returns the new group with its
drive, root container (`folderId`), the caller's member id and alias, and its Owner and
Administrator roles.

### Request

`POST https://api.cloudbackend.com/v1/groups/{group_id}/subgroups`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Parent group id. |

#### Body

`application/x-www-form-urlencoded` (required)

```text
name=new-group&alias=my-alias&application=open
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The created group |
| `400` | Bad Request — `name` or `alias` missing, invalid `application` or any `visibility`, the root group as parent, or the tenant's group limit reached. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not create groups under this parent. |
| `409` | Conflict — the parent already has a group with that name. |
| `415` | Unsupported Media Type — the body is not `application/x-www-form-urlencoded`. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<group>`

```xml
<group id='{group_id}' driveId='{drive_id}' folderId='{container_id}' name='new-group' memberId='{member_id}' alias='my-alias'>
  <group id='{owner_role_id}' role='Owner' />
  <group id='{admin_role_id}' role='Administrator' />
</group>
```

#### `409` · text/plain

```text
There is already a group with that name.
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/groups/{group_id}/subgroups" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
  -d 'name=new-group&alias=my-alias&application=open'
```

---

## GET /groups/{group_id}/subgroups;acl <a id="getv1groupssubgroupsacl"></a>

**Get subgroups ACL**

Returns the access control list (ACL) of the group's subgroups. `write` on this ACL is required to create or rename subgroups and `delete` to remove them.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/subgroups;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/subgroups;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/subgroups;acl <a id="putv1groupssubgroupsacl"></a>

**Modify subgroups ACL**

Replaces the access control list (ACL) of the group's subgroups. `write` on this ACL is required to create or rename subgroups and `delete` to remove them.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `groupsubgroupsaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/subgroups;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/subgroups;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/users;acl <a id="getv1groupsusersacl"></a>

**Get users ACL**

Returns the access control list (ACL) of the group's member list. The ACL governs who may list and manage the members of the group.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/users;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/users;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/users;acl <a id="putv1groupsusersacl"></a>

**Modify users ACL**

Replaces the access control list (ACL) of the group's member list. The ACL governs who may list and manage the members of the group.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `groupusersaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/users;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/users;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /groups/{group_id}/webshares;acl <a id="getv1groupswebsharesacl"></a>

**Get webshares ACL**

Returns the access control list (ACL) of the group's webshares. The ACL governs who may list and manage the group's webshares.

The ACL is an `<acl>` element with one `<user id>` entry per identity and one
`<group id>` entry per group or role, each with the flags `read`, `write`, `delete` and
`changeACL` (`1` or `0`). The `tag` attribute is the ACL's ETag.

The same tag is returned in the `ETag` response header. Send it in `If-None-Match` to get `304 Not Modified` (no body) when the ACL is unchanged, and in `If-Match` when changing the ACL with PUT.

### Request

`GET https://api.cloudbackend.com/v1/groups/{group_id}/webshares;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
| `If-None-Match` | header | no | string | ETag from an earlier GET; if it still matches, the server answers `304 Not Modified`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The ACL |
| `304` | Not Modified — `If-None-Match` equals the current ETag. |
| `401` | Unauthorized |
| `404` | Not Found — the group does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<acl>`

```xml
<acl tag='0RS3rszoFPWIfhVBPHSjL0czPXQ'><user id='{user_id}' read='1' write='1' delete='1' changeACL='1'/><group id='{group_id}' read='1' write='0' delete='0' changeACL='0'/></acl>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groups/{group_id}/webshares;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-None-Match: {if-none-match}"
```

---

## PUT /groups/{group_id}/webshares;acl <a id="putv1groupswebsharesacl"></a>

**Modify webshares ACL**

Replaces the access control list (ACL) of the group's webshares. The ACL governs who may list and manage the group's webshares.

Send the complete new ACL as an `<acl>` document (same format as GET returns) and the current ETag in the `If-Match` header. Entries left out lose all rights; flags left out are `0`. At least one entry must have `changeACL="1"`. If the body carries a `tag` attribute it must equal `If-Match`.

Only identities that have `changeACL` in the current ACL, or that are in the group's Owner role, may change it (otherwise `403 Forbidden`). After a change, a `groupwebsharesaclchanged` notification is sent to all members of the group.

If the ACL changed since the ETag was read, the call fails with `412 Precondition Failed`. On success the response is `204 No Content` and the `ETag` header carries the tag of the new ACL.

### Request

`PUT https://api.cloudbackend.com/v1/groups/{group_id}/webshares;acl`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group id. |
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
| `400` | Bad Request — `If-Match` header missing, `tag` attribute differs from `If-Match`, an entry without a valid `id`, an invalid flag value, or no entry with `changeACL="1"`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not change this ACL. |
| `404` | Not Found — the group does not exist. |
| `412` | Precondition Failed — the ACL changed since the ETag in `If-Match` was read. |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/groups/{group_id}/webshares;acl" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "If-Match: {if-match}" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<acl tag="0RS3rszoFPWIfhVBPHSjL0czPXQ">
  <user id="{user_id}" read="1" write="1" delete="1" changeACL="1" />
  <group id="{group_id}" read="1" write="0" delete="0" changeACL="0" />
</acl>'
```

---

## GET /gwebshares/{group_id} <a id="getv1gwebshares"></a>

**List group webshares**

Lists the webshares belonging to a group.

A trailing slash is optional — `/gwebshares/{group_id}` and
`/gwebshares/{group_id}/` address the same resource.

### Request

`GET https://api.cloudbackend.com/v1/gwebshares/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webshares>`

```xml
<webshares>
<!-- zero or more -->
<webshare id="WEBSHARE-ID" name="WEBSHARE-NAME" userId="USER-ID"
  access="public" visibility="visible" />
</webshares>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/gwebshares/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /hook/{group_id}/{webhook_name} <a id="postv1hook"></a>

**Trigger webhook handler**

Inbound webhook handler. The request body is stored as an object in the destination container
defined by the tenant's webhook definition (a webhook file stored in `/Settings/Webhooks/*.xdt`).
`{webhook_name}` is the value of the `name` attribute in that webhook file.

Requirements:

- The first path segment is the tenant name (lower-case letters and digits), not a numeric id.
- The request must use HTTPS; a plain HTTP request is rejected with 400.
- No session login is used. Instead send `Authorization: Bearer {api_key}` with a webhook key
  for this webhook that has the `webhook:write` scope. The key's identity must have write access
  to the destination container.

The object is named after the file name in the webhook definition; unless the webhook is set to
overwrite, a millisecond timestamp is added (`name-1700000000000.ext`). An `X-File-Name` header
overrides the name. The object's content type is the request `Content-Type` (guessed from the
name, or `text/plain`, when missing). HTTP headers listed in the webhook definition are stored
as `dc:` metadata on the object.

The body is written asynchronously after the call returns, so slow senders do not time out;
the call itself returns 204 with no body.

### Request

`POST https://api.cloudbackend.com/v1/hook/{group_id}/{webhook_name}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | string · pattern `^[a-z0-9]+$` | Tenant name (key) that owns the webhook. Despite the parameter name, this is not a numeric group id. |
| `webhook_name` | path | yes | string | Webhook name, as in the `name` attribute of the webhook file. |

#### Body

`*/*` (optional)

```text
{"event":"order.created","id":"1234"}
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Payload accepted and queued for storage. No response body. |
| `400` | `Request not allowed on unencrypted channel.` |
| `403` | The bearer key is not a `webhook:write` key for this webhook, or its identity has no write access to the destination container. |
| `404` | Unknown tenant, or no webhook with that name. |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/hook/{group_id}/{webhook_name}" \
  -H "Authorization: Bearer {api_key}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"event":"order.created","id":"1234"}'
```

---

## GET /hook/signkey <a id="getv1hooksignkey"></a>

**Generate webhook signing key**

Generates a new signing key for the outbound webhooks of the caller's tenant and
returns it as `<key>whsec_…</key>`. CloudBackend PaaS signs the webhook messages it
sends with this key, so the webhook handler can verify that a message really comes
from CloudBackend PaaS. Store the key safely; it is shown only once. If the key is
compromised, call this API again to generate a new one and update the code that
verifies the webhook messages.

Only the owner or an administrator of the tenant may call it (otherwise `400`,
"Not owner or admin of tenant"). The tenant is taken from the caller's login.
No request body.

Use exactly `/hook/signkey`. A URL with a group id such as `/hook/{group_id}/signkey`
is routed to the inbound webhook `POST /hook/{group_id}/{webhook_name}` instead
and does not generate a key.

### Request

`GET https://api.cloudbackend.com/v1/hook/signkey`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The new signing key |
| `400` | Bad Request — "Not owner or admin of tenant". |
| `401` | Unauthorized |
| `500` | Internal Server Error — the key could not be stored. |

#### `200` · application/xml · `<key>`

```xml
<key>whsec_XZU7D9HrJbIAB2q7AdUQn2u2xv4gs2p6BNcDZC/2kSY=</key>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/hook/signkey" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /invitationValidation <a id="postv1invitationValidation"></a>

**Validate group invitation key**

Looks up an invitation by its key. When a user has been invited by a group, the invitation
key from the invitation email can be validated with this call before the invitation is
accepted. Requires an authenticated user. Nothing is changed.

#### Request

`<invitation>` with one `<validate key="..."/>` child holding the invitation key.

#### Response attributes of `<invite>`

| Attribute | Description |
|---|---|
| `inviterUserId` | User id of the inviter |
| `inviterGroupId` | Group id of the inviter |
| `email` | Invited email address |
| `invitationKey` | The invitation key |
| `invitedUserId` | User id of the invited user; only present when the invitee already has an account |
| `invitedGroupId` | Group the user is invited to |
| `inviterType` | `group` or `user` |
| `invitedRole` | Role type of the invitation: `community`, `admin`, `custom`, `owner`, `contact`, `contact_role`, `customer` or `sales` |
| `paymentResponsibleId` | Id of the party that pays for the invited user |
| `coupon` | Coupon code; only present when the invitation carries one |
| `productId` | Product (account type) id, `0` if none |
| `inviteDate` | When the invitation was sent |
| `expireDate` | When the invitation expires |
| `productDescription`, `productSize` | Product details; only present when `productId` is not `0` |

### Request

`POST https://api.cloudbackend.com/v1/invitationValidation`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<invitation>`

```xml
<invitation>
  <validate key="92d71e8c4c74602dbbcf26bf5bd05eba"/>
</invitation>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The invitation. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | No invitation with that key. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invite>`

```xml
<invite inviterUserId='{user_id}' inviterGroupId='{group_id}' email='invitee@example.com' invitationKey='92d71e8c4c74602dbbcf26bf5bd05eba' invitedGroupId='{group_id}' inviterType='group' invitedRole='customer' paymentResponsibleId='{group_id}' productId='0' inviteDate='2025-01-15T09:30:00Z' expireDate='2025-02-14T09:30:00Z'></invite>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/invitationValidation" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<invitation>
  <validate key="92d71e8c4c74602dbbcf26bf5bd05eba"/>
</invitation>'
```

---

## GET /organizations/{group_id} <a id="getv1organizationsid"></a>

**Get organization details**

Returns one organization: a group that has a Customer role and in which the logged-in
identity holds the Owner, Administrator or a custom role.

The `<organization>` element has the same layout as in `GET /organizations`, but only
`id`, `parentGroupId`, `name`, `signupSourceId` and `signupSource` are filled in; the
`<subscription>` and `<limits>` children carry empty or zero values. For a group that
is not a tenant group, `signupSourceId` is `0` and `signupSource` is left out — in
that case the server omits the `>` that closes the `<organization` start tag, so the
response is not well-formed XML.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Organization (group) id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The organization |
| `401` | Unauthorized |
| `404` | Not Found — no such organization for this caller. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<organization>`

```xml
<organization id="{group_id}" parentGroupId="{parent_group_id}" name='mytenant' signupSourceId="{tenant_id}" signupSource='mytenant'><subscription product='' productId='0' description='' price='0' vat='0' paymentMethod='' nextCharge='0' period='0'/><limits api='0' storage='0' user='0' groups='0'/></organization>
```

#### `404` · text/plain

```text
Group not found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /organizations/{group_id}/member/{user_id} <a id="deletev1organizationsmember"></a>

**Remove a member from an organization**

Removes a user from an organization tenant group.

### Request

`DELETE https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml

```xml
SUCCESS
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/member/{user_id} <a id="getv1organizationsmember"></a>

**Get organization member**

Allows a tenant owner or admin to get a user entry and billing info. The user must be a member of the tenant. Returns

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `user_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<userInfo>`

```xml
<userInfo>
<user>
<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:os='http://a9.com/-/spec/opensearch/1.1/' xmlns:dc='http://xcerion.com/directory.xsd' xmlns:ni='http://xcerion.com/noindex.xsd'>
<atom:title>cbeu1</atom:title>
<atom:published>2024-02-27T05:25:43Z</atom:published>
<atom:updated>1970-01-01T00:00:00Z</atom:updated>
<atom:link rel='alternate' type='application/octet-stream' href='urn:x-i-o-s:users/17179869184/12884901981/1' length='0' />
<atom:id>mid:12884901981@xios.xcerion.com</atom:id>
<dc:group>17179869184</dc:group>
<dc:user>12884901981</dc:user>
<dc:unique>12884901981</dc:unique>
<atom:author>
<atom:name>John Doe</atom:name>
</atom:author>
<dc:gender></dc:gender>
<dc:country></dc:country>
<ni:profile></ni:profile>
<dc:email>test@xcerion.com</dc:email>
<dc:client>Mobile Web FileExplorer</dc:client>
<dc:display>John</dc:display>
<dc:social>mycloudme</dc:social>
</atom:entry>
<logins last="1970-01-01 00:00:00" number="0" />
</user>
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
</userInfo>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /organizations/{group_id}/member/{user_id} <a id="putv1organizationsmember"></a>

**Change an organization member's email**

Lets the tenant owner or an administrator change the email address of a user
(sub-user) of the tenant.

The body is `<organization username="…" email="…"/>`. Both attributes are
required: `email` is the new address, and `username` must be the current username
of `{user_id}` — it guards against changing the wrong user's email. Only the email
is changed; the username stays the same. The address is stored as given (it is not
verified and no mail is sent).

The caller must be owner or administrator of `{group_id}`. Returns the bare text
`SUCCESS`.

### Request

`PUT https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The tenant group. The caller must be its owner or an administrator. |
| `user_id` | path | yes | integer | Id of the user whose email is changed. |

#### Body

`application/xml` (required), root element `<organization>`

```xml
<organization username="{username}" email="new.address@example.com" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Email changed |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not owner or administrator of `{group_id}` |
| `404` | Not Found — `username required`, `email required`, or `User not found` (no user with that id and username) |
| `500` | Internal Server Error |

#### `200` · text/plain

```text
SUCCESS
```

#### `404` · text/plain

*username attribute missing*

```text
username required
```

*email attribute missing*

```text
email required
```

*user id and username do not match a user*

```text
User not found
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/organizations/{group_id}/member/{user_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<organization username="{username}" email="new.address@example.com" />'
```

---

## GET /organizations/{group_id}/organizations <a id="getv1organizationsorganizations"></a>

**List suborganizations**

Lists the suborganizations of an organization: direct subgroups of `{group_id}` that
have a Customer role and in which the logged-in identity holds the Owner,
Administrator or a custom role.

Each `<organization>` has the same layout as in `GET /organizations/{group_id}`
(`<subscription>` and `<limits>` carry empty or zero values). A trailing slash is
optional — `/organizations/{group_id}/organizations` and
`/organizations/{group_id}/organizations/` address the same resource.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/organizations`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Parent organization (group) id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Suborganizations |
| `401` | Unauthorized |
| `500` | Internal Server Error |

#### `200` · application/xml · `<organizations>`

```xml
<organizations><organization id="{group_id}" parentGroupId="{parent_group_id}" name='new-sub-org' signupSourceId="{tenant_id}" signupSource='new-sub-org'><subscription product='' productId='0' description='' price='0' vat='0' paymentMethod='' nextCharge='0' period='0'/><limits api='0' storage='0' user='0' groups='0'/></organization></organizations>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/organizations" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /organizations/{group_id}/organizations <a id="postv1organizationsorganizations"></a>

**Create a suborganization**

Not available: creating suborganizations is disabled in the server, and every call
returns `403 Forbidden` without reading the request body.

### Request

`POST https://api.cloudbackend.com/v1/organizations/{group_id}/organizations`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Parent organization (group) id. |

### Responses

| Status | Meaning |
| --- | --- |
| `401` | Unauthorized |
| `403` | Forbidden — the operation is disabled. |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations/{group_id}/organizations" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/taggedusers <a id="getv1organizationstaggedusers"></a>

**List tagged users**

Gets tagged users The user of the API must be an admin or owner. Returns

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/taggedusers`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `order` | query | no | string | "created", "email", "username", "id" |
| `desc` | query | no | string | "true" for descending sort, "false" for ascending sort |
| `deleted` | query | no | string | "true" to include deleted users, "false" to only include non-deleted users |
| `from` | query | no | string | date (user creation date), eg. "2023-08-30T11:04:51Z" |
| `until` | query | no | string | date (user creation date), eg. "2023-08-30T11:04:51Z" |
| `groupby` | query | no | string | <not used> |
| `offset` | query | no | string | index of first user to list |
| `count` | query | no | string | max number of users to list. Max value is 1000. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<users>`

```xml
<users>
<user id="12884901985"
username='cbeu3'
email='test@xcerion.com'
account=''
productId="0"
created="2024-02-27T05:25:44Z" />
<!-- ... -->
</users>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/taggedusers" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /organizations/{group_id}/users <a id="deletev1organizationsusers"></a>

**Delete user invitation**

Withdraws the pending invitation of an e-mail address to the organization. The body is
an `<invite>` element whose `email` attribute names the invited address.

The caller needs `delete` on the group's invitations ACL
(`/groups/{group_id}/invitations;acl`). The response has an empty body.

### Request

`DELETE https://api.cloudbackend.com/v1/organizations/{group_id}/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Organization (group) id. |

#### Body

`application/xml` (required), root element `<invite>`

```xml
<invite email="invited@example.com" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Invitation deleted (empty body) |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not delete invitations. |
| `500` | Internal Server Error |

#### `403` · text/plain

```text
You are not allowed to delete invitations
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/organizations/{group_id}/users" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<invite email="invited@example.com" />'
```

---

## GET /organizations/{group_id}/users <a id="getv1organizationsusers"></a>

**List organization users**

Lists the members and pending invitations of an organization. Only owners and
administrators of the group may call it.

The `<users>` element contains:

- one `<invite>` per pending invitation (inviter, invited e-mail, invitation key, role,
  product and dates);
- one `<user>` per member, with `id`, `name`, `email`, `groupId`, `accountTypeId` and a
  `<role>` element per role it holds; members whose only role is Customer are written
  as `<customer>` instead of `<user>`.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Organization (group) id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Members and invitations |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not an owner or administrator of the group. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<users>`

```xml
<users>
  <invite inviterUserId='{user_id}' inviterGroupId='{group_id}' email='invited@example.com' invitationKey='818863b6140353913b676b2d292b16cc' invitedGroupId='{invited_group_id}' inviterType='group' invitedRole='community' paymentResponsibleId='{group_id}' productId='23' inviteDate='2017-03-28T06:58:28Z' expireDate='1970-01-01T00:00:00Z' productDescription='' productSize='18446744073709551360'></invite>
  <user id="{user_id}" name='dj001' email='admin@example.com' groupId="{group_id}" accountTypeId="2">
    <role>admin</role>
    <role>owner</role>
  </user>
  <customer id="{customer_user_id}" name='dj002' email='customer@example.com' groupId="{group_id}" accountTypeId="11">
    <role>customer</role>
  </customer>
</users>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/users" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /organizations/{group_id}/users <a id="postv1organizationsusers"></a>

**Invite users to organization**

Invites one or more e-mail addresses to the organization and sends each an invitation
e-mail (the tenant's `inviteUser` template). The body is a `<users>` element with one
child per invitation; the element name selects the role:

- `<customer email="..." productId="..."/>` — invite as customer.
- `<admin email="..." productId="..."/>` — invite as administrator.
- `<user email="..." productId="..."><role>...</role></user>` — the first `<role>`
  decides: `customer`, `admin`, or any other text with an `id` attribute naming a
  custom role (`<role id="{role_id}">custom</role>`).

`email` is required; `productId` (optional) attaches a product (price plan) to the
invitation. The caller needs `write` on the group's invitations ACL.

The response lists an `<invite>` for every invitation created and a `<failed>` element
(with `status` and `reason`) for every address that already belongs to the
organization. Any other error aborts the whole request.

### Request

`POST https://api.cloudbackend.com/v1/organizations/{group_id}/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Organization (group) id. |

#### Body

`application/xml` (required), root element `<users>`

```xml
<users>
  <customer email="customer@example.com" productId="23" />
  <admin email="admin@example.com" />
  <user email="member@example.com">
    <role id="{role_id}">custom</role>
  </user>
</users>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Created invitations and failures |
| `400` | Bad Request — group id 0, an entry without `email`, an unknown element name, or a `<user>` without a valid `<role>`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not invite users to this group. |
| `404` | Not Found — the group or a referenced identity does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invites>`

```xml
<invites>
  <invite inviterUserId='{user_id}' inviterGroupId='{group_id}' email='customer@example.com' invitationKey='92d71e8c4c74602dbbcf26bf5bd05eba' invitedGroupId='{invited_group_id}' inviterType='group' invitedRole='community' paymentResponsibleId='{group_id}' productId='23' inviteDate='2017-03-21T15:18:25Z' expireDate='1970-01-01T00:00:00Z' productDescription='Business Plan' productSize='536870912000'></invite>
  <failed email='admin@example.com' status='409' reason='Already a user'/>
</invites>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/organizations/{group_id}/users" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<users>
  <customer email="customer@example.com" productId="23" />
  <admin email="admin@example.com" />
  <user email="member@example.com">
    <role id="{role_id}">custom</role>
  </user>
</users>'
```

---

## PUT /organizations/{group_id}/users <a id="putv1organizationsusers"></a>

**Invite users to organization**

Same as `POST /organizations/{group_id}/users`: invites the e-mail addresses listed in
the `<users>` body and returns the `<invites>` result.

### Request

`PUT https://api.cloudbackend.com/v1/organizations/{group_id}/users`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Organization (group) id. |

#### Body

`application/xml` (required), root element `<users>`

```xml
<users>
  <customer email="customer@example.com" productId="23" />
</users>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Created invitations and failures |
| `400` | Bad Request — group id 0, an entry without `email`, an unknown element name, or a `<user>` without a valid `<role>`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller may not invite users to this group. |
| `404` | Not Found — the group or a referenced identity does not exist. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<invites>`

```xml
<invites>
  <invite inviterUserId='{user_id}' inviterGroupId='{group_id}' email='customer@example.com' invitationKey='92d71e8c4c74602dbbcf26bf5bd05eba' invitedGroupId='{invited_group_id}' inviterType='group' invitedRole='community' paymentResponsibleId='{group_id}' productId='23' inviteDate='2017-03-21T15:18:25Z' expireDate='1970-01-01T00:00:00Z' productDescription='Business Plan' productSize='536870912000'></invite>
</invites>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/organizations/{group_id}/users" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<users>
  <customer email="customer@example.com" productId="23" />
</users>'
```

---

## GET /organizations/{group_id}/users/{user} <a id="getv1organizationsuser"></a>

**Get organization user**

Gets a user in the organization. The caller must be an admin or owner.

For this operation `{user}` is a numeric user id.

**The root element is either `<user>` or `<customer>`** — a client must accept
both. `<role>` may appear zero or more times, with values `community`, `admin`,
`custom`, `owner`, `contact`, `contact_role`, `customer` or `sales`.

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/users/{user}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `user` | path | yes | integer | Numeric user id. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Caller is not an admin or owner |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<user>`

```xml
<user id="{user_id}" name="{username}" email="{email}" groupId="{group_id}" accountTypeId="{id}">
  <!-- zero or more: community, admin, custom, owner, contact, contact_role, customer, sales -->
  <role>admin</role>
  <role>owner</role>
  <role>customer</role>
</user>
```

*Root element is user*

```xml
<user id="{user_id}" name="{username}" email="{email}" groupId="{group_id}" accountTypeId="{id}">
  <!-- zero or more: community, admin, custom, owner, contact, contact_role, customer, sales -->
  <role>admin</role>
  <role>owner</role>
  <role>customer</role>
</user>
```

*Root element is customer*

```xml
<customer id="{user_id}" name="{username}" email="{email}" groupId="{group_id}" accountTypeId="{id}">
  <role>customer</role>
</customer>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/users/{user}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /organizations/{group_id}/users/{user} <a id="deletev1organizationsuserinvite"></a>

**Delete invitation by email**

Deletes a pending invitation to the organization.

For this operation `{user}` is the invitee's email address, not a user id. The
service selects the operation by whether the segment is numeric.

### Request

`DELETE https://api.cloudbackend.com/v1/organizations/{group_id}/users/{user}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `user` | path | yes | string | Email address the invitation was sent to. |

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
curl -X DELETE "https://api.cloudbackend.com/v1/organizations/{group_id}/users/{user}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /organizations/{group_id}/usersearch <a id="getv1organizationsusersearch"></a>

**Search organization users**

Allows a tenant owner or admin to search the tenant group. Returns

### Request

`GET https://api.cloudbackend.com/v1/organizations/{group_id}/usersearch`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |
| `q` | query | no | string | query. Can also be "" or "*" to search everything. The first characters of the query must match the email/username, so it's a wildcard search eg.some-name* |
| `offset` | query | no | string | index of first user to list |
| `count` | query | no | string | max number of users to list |
| `deleted` | query | no | string | Pass in "only" to include only deleted users, "include" to include deleted and non-deleted users, any other value to include non-deleted users |
| `type` | query | no | string | "email" to search by email, "username" to search by username, "all" to search by email and username |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<users>`

```xml
<users xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
<os:totalResults>8</os:totalResults>
<os:startIndex>0</os:startIndex>
<os:itemsPerPage>100</os:itemsPerPage>
<user username='cbeu7' userId='12884901993' firstname='John' lastname='Doe' email='test@xcerion.com' />
<user username='cbeu8' userId='12884901995' firstname='John' lastname='Doe' email='test@xcerion.com' />
<user username='cbeu9' userId='12884901997' firstname='John' lastname='Doe' email='test@xcerion.com' />
<!-- ... -->
</users>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/organizations/{group_id}/usersearch" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /tproducts/{group_id} <a id="getv1tproducts"></a>

**Get group products**

Get all products added to/Settings/Products/ Output The output (theproducttags) is similar to the files stored in/Settings/Products/

### Request

`GET https://api.cloudbackend.com/v1/tproducts/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer |  |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Successful response |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<products>`

```xml
<products>
<product id='prod1' description='This is product #1' subscription='false' duration='0'>
<price cents='12345' currency='EUR' />
</product>
<product id='prod2' description='Another product' subscription='false' duration='0'>
<price cents='34' currency='EUR' />
</product>
<product id='sub1' description='A subscription' subscription='true' duration='1'>
<price cents='79999' currency='EUR' />
</product>
</products>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/tproducts/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /users/{user_id}/accounts/invites <a id="postv1usersaccountsinvites"></a>

**Send association invite**

Invites an e-mail address to become an associated account, using one of the user's
prepaid plans of the given account type. An invitation key is generated, one plan of
that type is reserved, and an invitation e-mail with a link containing the key is
sent. The invited person accepts with `POST /users/{user_id}/accounts`.

Body elements:

- `account/email` (required): address to invite.
- `account/type`: account type name (1-4 characters) of the prepaid plan to use.
- `account/accessControl`: `true` lets the inviting account later delete the
  associated account (see `DELETE /users/{user_id}/accounts/{association_id}`).
- `message` (optional): personal message included in the e-mail.

Only the user itself may call it.

### Request

`POST https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the inviting user. Must be the logged-in user. |

#### Body

`application/xml` (required), root element `<invite>`

```xml
<invite>
  <account>
    <email>{email}</email>
    <type>{account_type_name}</type>
    <accessControl>true</accessControl>
  </account>
  <message>Optional message</message>
</invite>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitation created and e-mailed |
| `400` | Bad Request (missing email, unknown account type, a pending invitation already exists for the address, or no prepaid plan of that type available) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<invite>
  <account>
    <email>{email}</email>
    <type>{account_type_name}</type>
    <accessControl>true</accessControl>
  </account>
  <message>Optional message</message>
</invite>'
```

---

## DELETE /users/{user_id}/accounts/invites/{invite_id} <a id="deletev1usersaccountsinvites"></a>

**Delete association invite**

Deletes a pending association invitation and returns its reserved prepaid plan to
the inviting user. Only the inviting user may call it.

### Request

`DELETE https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites/{invite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the inviting user. Must be the logged-in user. |
| `invite_id` | path | yes | integer | Id of the invitation (the `<id>` of a pending `<association>` in `GET /users/{user_id}/accounts`). |

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitation deleted |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (no such invitation) |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites/{invite_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## PUT /users/{user_id}/accounts/invites/{invite_id} <a id="putv1usersaccountsinvites"></a>

**Resend association invite**

Sends a new association invitation key to the e-mail address of the pending
invitation `invite_id`. The body is optional; if it contains `<invite><message>`, that
message is used in the new e-mail. A missing or unparsable body is ignored.

Only the inviting user may call it.

### Request

`PUT https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites/{invite_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | path | yes | integer | Id of the inviting user. Must be the logged-in user. |
| `invite_id` | path | yes | integer | Id of the pending invitation. |

#### Body

`application/xml` (optional), root element `<invite>`

```xml
<invite>
  <message>Some optional message</message>
</invite>
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Invitation re-sent |
| `400` | Bad Request (sign-up source not found for the user) |
| `401` | Unauthorized |
| `403` | Forbidden (not the logged-in user) |
| `404` | Not Found (no such invitation, or invalid account type) |
| `500` | Internal Server Error |

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/users/{user_id}/accounts/invites/{invite_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<invite>
  <message>Some optional message</message>
</invite>'
```

---

## GET /wsg[0_9]/{group_id} <a id="getv1wsg"></a>

**List group public webshares**

Get a group's public webshares.

`[0_9]` in the path denotes an optional single digit: `/wsg`, `/wsg0`, `/wsg1` …
`/wsg9` all reach this endpoint. The digit selects the response variant used by
different clients.

### Request

`GET https://api.cloudbackend.com/v1/wsg[0_9]/{group_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group whose public webshares are listed. |
| `offset` | query | no | integer | integer |
| `count` | query | no | integer | integer: 0-1000 |

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
curl -X GET "https://api.cloudbackend.com/v1/wsg/{group_id}" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /wsg[0_9]/{group_id}/{webshare_id} <a id="getv1wsgwebshare"></a>

**Get group webshare information**

Returns the description of one group webshare. `?meta=true` is required here;
without it the call fails with `400 Request missing path or meta-parameter` (to
list the content, add a path: `GET /wsg[0_9]/{group_id}/{webshare_id}/`).

No login is needed, except for webshares with visibility `invited`, which need a
logged-in identity that was invited. For an invited webshare, `?visibility=true`
(with `meta=true`) works without login and returns a shorter description with
`<require login='true' invitation='true'/>`. A password-protected webshare is
marked with `<category … term='protected'/>`.

`[0_9]` in the path denotes an optional single digit, as on
`GET /wsg[0_9]/{group_id}`. The two segments may be separated by `/` or `;`. No
request body.

### Request

`GET https://api.cloudbackend.com/v1/wsg[0_9]/{group_id}/{webshare_id}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
| `webshare_id` | path | yes | string | The webshare — an id or a name. |
| `meta` | query | yes | string · one of `true` | Must be `true`. |
| `visibility` | query | no | string · one of `true`, `false` · default `false` | `true` returns the short public description of an `invited` webshare without login. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Webshare description |
| `400` | Bad Request — `Request missing path or meta-parameter` |
| `401` | Unauthorized — an `invited` webshare without login |
| `403` | Forbidden — the caller was not invited to the webshare |
| `404` | Not Found — group or webshare not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<webShare>`

```xml
<webShare><title>Photos</title><published>2026-09-23T10:00:00Z</published><updated>2026-09-23T10:00:00Z</updated><id>urn:x-i-o-s:webshare:{webshare_id}</id><type>gallery</type><link rel='alternate' type='text/html' href='{group_uri}/gwebshare/Photos/'/><groupName>Marketing</groupName><groupId>{group_id}</groupId><nrFollowers>2</nrFollowers><access>read</access><description>Product photos</description></webShare>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsg/{group_id}/{webshare_id}?meta={meta}"
```

---

## POST /wsg[0_9]/{group_id}/{webshare_id} <a id="postv1wsgwebshare"></a>

**Create a container in a group webshare**

Creates a container inside a group webshare and returns its id. The body is a
`<newContainer>` with `containerId` (the parent container, inside the webshare) and
`childName` (name of the new container); the established spelling
`<newFolder folderId childName>` is accepted too.

A password-protected webshare needs the webshare password with Basic or Digest
authentication (`401` otherwise).

`[0_9]` in the path denotes an optional single digit, as on
`GET /wsg[0_9]/{group_id}`. The two segments may be separated by `/` or `;`.

### Request

`POST https://api.cloudbackend.com/v1/wsg[0_9]/{group_id}/{webshare_id}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
| `webshare_id` | path | yes | string | The webshare — an id or a name. |

#### Body

`application/xml` (required), root element `<newContainer>`

```xml
<newContainer containerId="{container_id}" childName="Uploads" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Id of the new container |
| `400` | Bad Request — `No folder id given.` or `No ChildFolderName could be found.` |
| `401` | Unauthorized — `You need to provide a valid password to access this webshare-resource` |
| `404` | Not Found — group or webshare not found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<newFolderId>`

```xml
<newFolderId>{container_id}</newFolderId>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/wsg/{group_id}/{webshare_id}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="{container_id}" childName="Uploads" />'
```

---

## POST /wsg[0_9]/{group_id}/{webshare_id}/{path} <a id="postv1wsg"></a>

**Create group webshare container**

Creates a container inside a group webshare, at the given path.

`{path}` is a location within the webshare's container structure and is parsed by
the service, so it may span several segments — it is not a single path segment.

`[0_9]` in the path denotes an optional single digit, as on
`GET /wsg[0_9]/{group_id}`.

The group and webshare segments may be separated by `/` or `;` —
`/wsg2/{group_id};{webshare_id}/{path}` also routes.

### Request

`POST https://api.cloudbackend.com/v1/wsg[0_9]/{group_id}/{webshare_id}/{path}`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
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
curl -X POST "https://api.cloudbackend.com/v1/wsg/{group_id}/{webshare_id}/{path}" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<newContainer containerId="{container_id}" childName="{child_name}" />'
```

---

## GET /wsg[0_9]/{group_id}/{webshare_id}/{path} <a id="getv1wsgpath"></a>

**Browse or download from a group webshare**

Reads content of a group webshare at `{path}`. No CloudBackend PaaS login is
needed, except for webshares with visibility `invited`, which need a logged-in
identity that was invited.

- When `{path}` is a container, the response is an Atom feed listing it
  (`Content-Type: application/atom+xml`). Address a container with a trailing
  slash — `/wsg3/{group_id}/{webshare_id}/` lists the webshare root; without the
  slash the call answers `303 See Other` with the slash added in `Location`.
- When `{path}` is an object, its stream is returned as is (`?s=` picks a
  stream, `?dl` makes it a download). Objects cannot be read from a `createonly`
  webshare (`403`).

A password-protected webshare needs the webshare password with HTTP Digest or
Basic authentication (any username, e.g. `anonymous`); otherwise `401`.

`[0_9]` in the path denotes an optional single digit, as on
`GET /wsg[0_9]/{group_id}`. The group and webshare segments may be separated by
`/` or `;`. `?meta=true` is not allowed together with a path (`400`); use
[`GET /wsg[0_9]/{group_id}/{webshare_id}`](#tag/Group/operation/getv1wsgwebshare)
for the webshare description. No request body.

### Request

`GET https://api.cloudbackend.com/v1/wsg[0_9]/{group_id}/{webshare_id}/{path}`

Needs no session token: the description above says how this operation is authorized.

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Group owning the webshare. |
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
| `404` | Not Found — group, webshare or path not found |
| `500` | Internal Server Error |

#### `200` · application/atom+xml · `<feed>`

```text
<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://xcerion.com/directory.xsd" xmlns:os="http://a9.com/-/spec/opensearch/1.1/">
  <os:totalResults>0</os:totalResults>
  <os:startIndex>0</os:startIndex>
  <os:itemsPerPage>100</os:itemsPerPage>
  <atom:link rel="self" href="{self_url}" />
  <atom:author>
    <atom:name>{group_name}</atom:name>
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
Some wsg1 file 1
```

#### `404` · text/plain

```text
Document 'invalid-file.txt' not found
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/wsg/{group_id}/{webshare_id}/{path}"
```

---

## POST /changegroupalias <a id="postv1changegroupalias"></a>

**Change group alias**

Changes a user's alias within a group.

### Request

`POST https://api.cloudbackend.com/v1/changegroupalias`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<changeGroupAlias>`

```xml
<changeGroupAlias>
  <group id="{group_id}" />
  <newAlias>{new_alias}</newAlias>
</changeGroupAlias>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Alias changed |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<changeGroupAliasResponse>`

```xml
<changeGroupAliasResponse>OK</changeGroupAliasResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/changegroupalias" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<changeGroupAlias>
  <group id="{group_id}" />
  <newAlias>{new_alias}</newAlias>
</changeGroupAlias>'
```

---

## GET /testemail <a id="getv1testemail"></a>

**List test emails**

Returns the test emails captured for the caller's current group. Used to verify
that email sending works.

These are emails captured for inspection, not sent mail — to *send* a test email,
use `POST /sendemail` with `test="true"`.

### Request

`GET https://api.cloudbackend.com/v1/testemail`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of captured test emails |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<emails>`

```xml
<emails>
  <email userId="{user_id}" sent="{datetime}">
    <!-- email content (MIME format) -->
  </email>
</emails>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/testemail" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## DELETE /testemail <a id="deletev1testemail"></a>

**Delete test emails**

Deletes all captured test emails for the caller's current group.

### Request

`DELETE https://api.cloudbackend.com/v1/testemail`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Test emails deleted |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/testemail" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /testexchangerate <a id="getv1testexchangerate"></a>

**Get exchange rate**

Gets the current exchange rate for a currency pair, using the caller's current
group's configuration.

### Request

`GET https://api.cloudbackend.com/v1/testexchangerate`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `from` | query | no | string | Source currency, e.g. `SEK`. |
| `to` | query | no | string | Target currency, e.g. `EUR`. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | The exchange rate. `success` is `1` when the lookup worked; `result` is the rate to multiply by when converting from `from` to `to`. |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<exchangeRate>`

```xml
<exchangeRate success="1" result="0.090219" />
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/testexchangerate" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /groupmemberships <a id="getv1groupmemberships"></a>

**List group memberships**

Lists the groups a user is a member of.

### Request

`GET https://api.cloudbackend.com/v1/groupmemberships`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `userid` | query | no | integer · default `0` | User whose group memberships are listed. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group memberships |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listGroupMembershipsResponse>`

```xml
<listGroupMembershipsResponse>
  <groups>
    <group id="{group_id}"/>
  </groups>
</listGroupMembershipsResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/groupmemberships" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /rolemember <a id="getv1rolemember"></a>

**List role members**

Lists the users holding a role in a group. See `/role` for the roles themselves.

### Request

`GET https://api.cloudbackend.com/v1/rolemember`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group the role belongs to. Defaults to 0. |
| `roleid` | query | no | integer · default `0` | Role whose members are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of users holding the role |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listRoleUsersResponse>`

```xml
<listRoleUsersResponse>
  <users>
    <user id="{member_id}" name="{alias}" />
  </users>
</listRoleUsersResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/rolemember" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /rolemember <a id="postv1rolemember"></a>

**Add role member**

Adds a user to a group role.

### Request

`POST https://api.cloudbackend.com/v1/rolemember`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<addRoleMember>`

```xml
<addRoleMember>
  <group id="{group_id}"/>
  <role id="{role_id}"/>
  <user>{username}</user>
</addRoleMember>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Role member added |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<addRoleMemberResponse>`

```xml
<addRoleMemberResponse>OK</addRoleMemberResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/rolemember" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<addRoleMember>
  <group id="{group_id}"/>
  <role id="{role_id}"/>
  <user>{username}</user>
</addRoleMember>'
```

---

## DELETE /rolemember <a id="deletev1rolemember"></a>

**Remove role member**

Removes a user from a group role.

Identify the member either by id, as `<user id="{user_id}" />`, or by name, as
`<user>{username}</user>`.

### Request

`DELETE https://api.cloudbackend.com/v1/rolemember`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<removeRoleMember>`

```xml
<removeRoleMember>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <user id="{user_id}" />
</removeRoleMember>
```

*Identify the member by id*

```xml
<removeRoleMember>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <user id="{user_id}" />
</removeRoleMember>
```

*Identify the member by username*

```xml
<removeRoleMember>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <user>{username}</user>
</removeRoleMember>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Role member removed |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<removeRoleMemberResponse>`

```xml
<removeRoleMemberResponse>OK</removeRoleMemberResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/rolemember" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<removeRoleMember>
  <group id="{group_id}" />
  <role id="{role_id}" />
  <user id="{user_id}" />
</removeRoleMember>'
```

---

## GET /contact <a id="getv1contact"></a>

**List contacts**

Returns the contact list for a group.

### Request

`GET https://api.cloudbackend.com/v1/contact`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group whose contact list is returned. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getContactListResponse>`

```xml
<getContactListResponse>
  <!-- zero or more contacts -->
  <user id="{user_id}" name="{username}" visibility="{public|private}" />
</getContactListResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/contact" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /contact <a id="postv1contact"></a>

**Add a contact**

Adds a user to a contact group, the REST form of the SOAP action `addContact`.

| Element | Description |
|---|---|
| `<group id="…"/>` | Contact group. Required; without it the call fails with "Failed to get group id." |
| `<role id="…"/>` | Optional contact role inside the group. |
| `<user id="…"/>` | User to add. Required. |
| `<visibility>` | Optional: `public` (default), `friends`, `private` or `invited`. |

The caller must be the owner of the contact group.

### Request

`POST https://api.cloudbackend.com/v1/contact`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<addContact>`

```xml
<addContact>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <visibility>public</visibility>
</addContact>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact added |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error. Application errors surface here as an embedded `<error>` element carrying the real status in its `code` attribute, rather than as that HTTP status. Read the `code` attribute, not the HTTP status, to tell these errors apart. |

#### `200` · application/xml · `<addContactResponse>`

```xml
<addContactResponse>OK</addContactResponse>
```

#### `500` · application/xml

*The user id does not resolve*

```xml
<error number="0" code="403" description="Forbidden">User not found</error>
```

*The user is already in the contact list*

```xml
<error number="0" code="409" description="Conflict">Contact is already added to contact list.</error>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/contact" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<addContact>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <visibility>public</visibility>
</addContact>'
```

---

## PUT /contact <a id="putv1contact"></a>

**Set contact visibility**

Changes the visibility of an existing contact, the REST form of the SOAP action
`setContactVisibility`. `<group id>`, `<user id>` and `<visibility>` (`public`,
`friends`, `private` or `invited`) are all required.

### Request

`PUT https://api.cloudbackend.com/v1/contact`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<setContactVisibility>`

```xml
<setContactVisibility>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <visibility>private</visibility>
</setContactVisibility>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Visibility updated |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<setContactVisibilityResponse>`

```xml
<setContactVisibilityResponse>OK</setContactVisibilityResponse>
```

### Example

```bash
curl -X PUT "https://api.cloudbackend.com/v1/contact" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<setContactVisibility>
  <group id="{group_id}" />
  <user id="{user_id}" />
  <visibility>private</visibility>
</setContactVisibility>'
```

---

## DELETE /contact <a id="deletev1contact"></a>

**Remove a contact**

Removes a user from a contact group, or from one contact role in it. This is the
REST form of the SOAP action `removeContact`, and unlike most DELETE calls it
reads an XML request body.

| Element | Description |
|---|---|
| `<group id="…"/>` | Contact group. Required. |
| `<role id="…"/>` | Optional. When given, the user is removed from this contact role only; when left out, the user is removed from the contact group. |
| `<user id="…"/>` | User to remove. Required. |

Removing from the group fails with `404` while the user is still in one of the
group's contact roles; remove the role memberships first.

The caller must be the owner of the contact group.

### Request

`DELETE https://api.cloudbackend.com/v1/contact`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<removeContact>`

```xml
<removeContact>
  <group id="{group_id}" />
  <user id="{user_id}" />
</removeContact>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact removed |
| `400` | Bad Request — `<group id>` or `<user id>` missing or `0`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not the owner of the contact group. |
| `404` | Not Found — "Contact is not present in contact list, or is still part of a contact role", or "Contact is not present in role." when `<role>` is given. |
| `500` | Internal Server Error |

#### `200` · application/xml · `<removeContactResponse>`

```xml
<removeContactResponse>OK</removeContactResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/contact" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<removeContact>
  <group id="{group_id}" />
  <user id="{user_id}" />
</removeContact>'
```

---

## GET /contactrole <a id="getv1contactrole"></a>

**List contact roles**

Lists the contact roles defined in a contact group. The roles are returned as
`<group>` elements with `role="Contact"` inside a `<group>` element for the
contact group.

### Request

`GET https://api.cloudbackend.com/v1/contactrole`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Contact group whose roles are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact role list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listContactRolesResponse>`

```xml
<listContactRolesResponse>
  <group id="{group_id}">
    <!-- zero or more roles -->
    <group id="{role_id}" role="Contact" name="{role_name}" />
  </group>
</listContactRolesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/contactrole" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /contactrole <a id="postv1contactrole"></a>

**Create a contact role**

Creates a contact role in a contact group, the REST form of the SOAP action
`createContactRole`. `<group id>` (the contact group) and `<name>` are required.

The response lists the new role as a `<group>` element with `role="Contact"`;
its `id` is the id of the new role.

The caller must be the owner of the contact group. A role with the same name in
the group gives `409 Conflict`.

### Request

`POST https://api.cloudbackend.com/v1/contactrole`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<createContactRole>`

```xml
<createContactRole>
  <group id="{group_id}" />
  <name>{role_name}</name>
</createContactRole>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact role created |
| `400` | Bad Request — `<group id>` or `<name>` missing ("Failed to get name parameter."). |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not the owner of the contact group. |
| `409` | Conflict — "A contact role with the same name already exists". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<createContactRoleResponse>`

```xml
<createContactRoleResponse>
  <group id="{group_id}">
    <group id="{role_id}" role="Contact" name="{role_name}" />
  </group>
</createContactRoleResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/contactrole" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<createContactRole>
  <group id="{group_id}" />
  <name>{role_name}</name>
</createContactRole>'
```

---

## DELETE /contactrole <a id="deletev1contactrole"></a>

**Delete a contact role**

Deletes a contact role from a contact group, the REST form of the SOAP action
`deleteContactRole`. Unlike most DELETE calls it reads an XML request body with
`<group id>` (the contact group) and `<role id>` (the role), both required.

All contacts in the role are removed from it.

The caller must be the owner of the contact group.

### Request

`DELETE https://api.cloudbackend.com/v1/contactrole`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<deleteContactRole>`

```xml
<deleteContactRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
</deleteContactRole>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Contact role deleted |
| `400` | Bad Request — `<group id>` or `<role id>` missing or `0`. |
| `401` | Unauthorized |
| `403` | Forbidden — the caller is not the owner of the contact group. |
| `404` | Not Found — "Contact role not found". |
| `500` | Internal Server Error |

#### `200` · application/xml · `<deleteContactRoleResponse>`

```xml
<deleteContactRoleResponse>OK</deleteContactRoleResponse>
```

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/contactrole" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<deleteContactRole>
  <group id="{group_id}" />
  <role id="{role_id}" />
</deleteContactRole>'
```

---

## GET /friendlist <a id="getv1friendlist"></a>

**List friends**

Returns the friend list for a user within a group.

### Request

`GET https://api.cloudbackend.com/v1/friendlist`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group to list friends in. Defaults to 0. |
| `userid` | query | no | integer · default `0` | Member whose friends are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Friend list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<getFriendListResponse>`

```xml
<getFriendListResponse>
  <!-- zero or more friends -->
  <user id="{user_id}" name="{username}" />
</getFriendListResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/friendlist" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## GET /memberroles <a id="getv1memberroles"></a>

**List a member's roles**

Lists the roles a member holds in a group.

### Request

`GET https://api.cloudbackend.com/v1/memberroles`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Parameters

| Name | In | Required | Type | Notes |
| --- | --- | --- | --- | --- |
| `groupid` | query | no | integer · default `0` | Group to look the member up in. Defaults to 0. |
| `userid` | query | no | integer · default `0` | Member whose roles are listed. Defaults to 0. |

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Member role list |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<listMemberRolesResponse>`

```xml
<listMemberRolesResponse>
  <!-- zero or more roles -->
  <role id="{role_id}" name="{role_name}" />
</listMemberRolesResponse>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/memberroles" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /querygroup <a id="postv1querygroup"></a>

**Query the group database**

Queries the group database.

Omit `<query>` to list all groups under `<group id>`. This replaces the
deprecated `GET /group` (`listGroups`) call.

### Request

`POST https://api.cloudbackend.com/v1/querygroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<queryGroupDB>`

```xml
<queryGroupDB>
  <group id="{group_id}" />
  <query>group:{child_group_id}</query>
</queryGroupDB>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Group query results |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<queryGroupDBResponse>`

```xml
<queryGroupDBResponse xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <db:result xlink:actuate="onRequest" xlink:href="home://">
    <db:paging start="0" size="100" total="{total}" />
    <db:group name="{group_name}" id="{group_id}" parentid="{parent_group_id}" published="{datetime}" updated="{datetime}">
      <author>{owner_name}</author>
    </db:group>
  </db:result>
</queryGroupDBResponse>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/querygroup" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<queryGroupDB>
  <group id="{group_id}" />
  <query>group:{child_group_id}</query>
</queryGroupDB>'
```

---

## POST /sendemail <a id="postv1sendemail"></a>

**Send batch emails**

Sends a batch of emails, or sends a single test email, on behalf of the caller's
current group.

Requirements:

- The caller must be an admin or owner.
- Every id in `<userIds>` must be a member of the tenant.
- `Content-Type: application/xml` is required.

`type` names the email type and must match an email rule whose `<event type="…"/>`
has the same value — see
`POST /emailrules/{organization_id}`.

In batch mode both `<userIds>` and `<emailAddresses>` are optional and each accepts
a list separated by commas or spaces, so a call can target members, arbitrary
addresses, or both.

Setting `test="true"` sends a single test email. Where the template needs data that
is only available in a real send, example data is substituted.

### Request

`POST https://api.cloudbackend.com/v1/sendemail`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<email>`

```xml
<email type="{email_type}">
  <userIds>123123123 345345345 567567567</userIds>
  <emailAddresses>email1@example.com email2@example.com etc@etc.com</emailAddresses>
</email>
```

*Send to members and arbitrary addresses*

```xml
<email type="{email_type}">
  <!-- optional: user ids, separated by commas or spaces -->
  <userIds>123123123 345345345 567567567</userIds>
  <!-- optional: email addresses, separated by commas or spaces -->
  <emailAddresses>email1@example.com email2@example.com etc@etc.com</emailAddresses>
</email>
```

*Send a single test email*

```xml
<email type="{email_type}" test="true">
  <userIds>{user_id}</userIds>
</email>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Emails sent |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Caller is not an admin or owner of the tenant |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/sendemail" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<email type="{email_type}">
  <userIds>123123123 345345345 567567567</userIds>
  <emailAddresses>email1@example.com email2@example.com etc@etc.com</emailAddresses>
</email>'
```

---

## GET /emailgroup <a id="getv1emailgroup"></a>

**List email groups**

Lists the email groups defined for the caller's current group.

### Request

`GET https://api.cloudbackend.com/v1/emailgroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | List of email groups |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<email_groups>`

```xml
<email_groups>
  <email_group id="123" name="feedback" label="Feedback" receive="false">Help us get better by giving us your feedback.</email_group>
  <email_group id="124" name="groupname1" label="Updated label" receive="false">Updated description</email_group>
  <email_group id="130" name="info" label="Info" receive="false">Get information on news and issues.</email_group>
  <email_group id="456" name="sharing" label="Sharing" receive="true">Receive email when someone has shared something with you.</email_group>
  <email_group id="457" name="tips" label="Tips" receive="false">Get tips on how to use the service.</email_group>
</email_groups>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/emailgroup" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---

## POST /emailgroup <a id="postv1emailgroup"></a>

**Add an email group**

Adds an email group to the caller's current group.

| Field | Description |
|---|---|
| `name` | The unique group name. Use the special name **`must-email`** when the mail is important enough that the user must not be able to ignore it — password recovery, MFA, and similar. |
| `label` | Optional display label. |
| element text | Optional description. |
| `receive` | Controls the default. **`true`** — the user receives the mail and may opt out. **`false`** — the mail is not sent unless the user opts in. |

### Request

`POST https://api.cloudbackend.com/v1/emailgroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<email_group>`

```xml
<email_group name="{name}" label="{label}" receive="true|false">{description}</email_group>
```

*On by default, user may opt out*

```xml
<email_group name="sharing" label="Sharing" receive="true">Receive email when someone has shared something with you.</email_group>
```

*Off by default, user must opt in*

```xml
<email_group name="tips" label="Tips" receive="false">Get tips on how to use the service.</email_group>
```

*Mail the user cannot opt out of*

```xml
<email_group name="must-email" label="Account security" receive="true">Password recovery and multi-factor authentication messages.</email_group>
```

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Email group added |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<email_group>`

```xml
<email_group id="{id}" name="feedback" label="Feedback" receive="false">Help us get better by giving us your feedback.</email_group>
```

### Example

```bash
curl -X POST "https://api.cloudbackend.com/v1/emailgroup" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<email_group name="{name}" label="{label}" receive="true|false">{description}</email_group>'
```

---

## DELETE /emailgroup <a id="deletev1emailgroup"></a>

**Delete an email group**

Deletes an email group from the caller's current group, identified by `name`.

### Request

`DELETE https://api.cloudbackend.com/v1/emailgroup`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

#### Body

`application/xml` (required), root element `<email_group>`

```xml
<email_group name="{name}" />
```

### Responses

| Status | Meaning |
| --- | --- |
| `204` | Email group deleted. Empty body. |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example

```bash
curl -X DELETE "https://api.cloudbackend.com/v1/emailgroup" \
  -H "Authorization: WRAP access_token=<session_token>" \
  -H "Content-Type: application/xml; charset=utf-8" \
  -d '<email_group name="{name}" />'
```

---

## GET /diskusage <a id="getv1diskusage"></a>

**Get disk usage**

Gets database and disk usage for the caller's current group.

The caller must be the owner or an admin.

| Attribute | Description |
|---|---|
| `db` | Database usage, in bytes |
| `objects` | Object storage usage |

### Request

`GET https://api.cloudbackend.com/v1/diskusage`

Requires a session token: `Authorization: WRAP access_token=<session_token>`. See [Authentication](authentication.md).

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Usage figures |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Caller is not the owner or an admin |
| `404` | Not Found |
| `500` | Internal Server Error |

#### `200` · application/xml · `<usage>`

```xml
<usage db="7733248" objects="110"/>
```

### Example

```bash
curl -X GET "https://api.cloudbackend.com/v1/diskusage" \
  -H "Authorization: WRAP access_token=<session_token>"
```

---
