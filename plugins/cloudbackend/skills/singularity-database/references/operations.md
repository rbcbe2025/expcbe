# Running the service — support desk, proxy, database explorer

The console pages a tenant uses after launch: the support ticket desk (owner, member and administrator views), the API proxy, and the database explorer's WebDAV and restore features.

9 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [published](#published)
- [WebDAV](#webdav)
- [AI](#ai)
- [Proxy Setup (Web UI)](#proxy-setup-web-ui)
- [XML format](#xml-format)
- [Administrator](#administrator)
- [Member](#member)
- [Owner](#owner)
- [XML format](#xml-format)

## published

### published - view container externally

Share your the CloudBackend database container to your friends for them to view pictures and more.


Compile your published URL and send it to your friends.

### published objects for external access

It is also possible to publish single objects individually.


#### URL

#### published - view home container externally

**home://** published - URL becomes `https://{tenantname}.db.cloudbackend.com/published/?username={username}&sharename={publishname}`.

> **Tip:** To see your home:// publications in CLI do:
>
> **CLI Syntax**
>
> ```console
> published
> ```

#### published - view group container externally

**tenant://** published - URL becomes `https://{tenantname}.db.cloudbackend.com/published/?groupId={groupId}&sharename={publishname}`.

> **Tip:** To see your tenant:// or group publications in CLI do:
>
> **CLI Syntax**
>
> ```console
> published -g/-t
> ```

#### Next

- [WebDAV](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer/de-webdav)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer/de-published>*

---

## WebDAV

### WebDAV - mount CloudBackend as a hard drive

Connect the CloudBackend database to your local computers filesystem using **WebDAV** to access data in the database or upload data. WebDAV is available on Windows, Mac, Linux, Android, and iOS.

> **Note:** **Identity:** Identities access WebDAV using `https://webdav.cloudbackend.com/{tenant-name}/{username}`.

> **Note:** **Tenant Owner:** Tenant owner account access WebDAV using `https://webdav.cloudbackend.com/{username}`.

When prompted by WebDAV, enter your username and password. The reason why `{tenant-name}` is needed in front of WebDAV for identities, is that they login through the tenant and thereby need to specify which tenant on CloudBackend they are logging in to. This has to do with that identity accounts are owned and managed by the tenant, and not by CloudBackend. The same username may exist under multiple tenants.

WebDAV will give a simplified view of your database that is compatible with your local computers filesystem, this means that the only stream you will be able to see through WebDAV for an object is the first stream, you will not be able to see or change ACLs or access meta-data for containers. It is however, a very convenient way to ingest or access data with. Please note that versioning of objects is not supported through WebDAV. Any XML objects uploaded through WebDAV will run through the datatype system for automatic key/value meta-data extraction if you have defined matching [datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes).


#### Next

- [CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/cli)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer/de-webdav>*

---

## AI

AI assistant support to the SDK Web UI documentation using OpenAI ChatGPT. The AI will help you find what you need in the documentation and it can also help you build applications, find the right icon to use or add code to an existing application. We have trained the AI on the entire documentation of CloudBackend and XIOS/3.

#### Supported documentation

- SDK Web UI (XIOS/3)
- XML Development

#### Usage

> **Note:**You have to be logged in to access the AI chat!

1. Press the AI button in the toolbar to open the chat panel


2. Enter your prompt and press either enter or the ask button


3. While the AI is thinking there will be a spinner animation
4. You receive an answer and can continue chatting with the AI assistant


#### Conversation History

The AI will keep track of the user's previous prompts and the assistants answers until it has reached its token limit. When this happens you will get message in the chat from CloudBackend saying that this has occured and a fresh conversation has started but the previous context will be forgotten.

> **Note:** "Max tokens of AI conversation reached, new thread is started which means that previous discussion and context is forgotten."

#### Next

- [Feedback / Support](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation/ai>*

---

## Proxy Setup (Web UI)

### Creating a proxy using the Web UI

Most proxies are created using the `Create Proxy` dialog in the CloudBackend PaaS. The UI provides a simplified setup that generates a valid proxy XML document and securely stores the API key in the `keyring`.

To create a proxy:

1. Navigate to `Settings → Proxy` in your tenant.
2. Click `Create` to open the `Quick Proxy Setup` dialog.
3. Enter a `Proxy Name`. This becomes both the `name` and `service` attribute in the proxy XML and is used when referencing the proxy from a [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/channel).
4. Enter the `API Domain`. This must include the protocol (for example, `https://api.example.com`). It corresponds to the `http-domain` element in the XML.
5. Choose how the API key should be sent using the `Authorization method`. You can either send the key as an HTTP header or as a query parameter.

#### Option 1: Send API key as HTTP header

Select `Add http-header` when the external API expects authentication in a request header (for example, `Authorization: Bearer <token>`).

- `HTTP Header` - Enter the header name (for example, `Authorization` or `X-API-Key`).
- `Header Value` - Reference the key using the variable format `${proxyName_key}`.
- `Secret API Key` - Enter the actual API key. This value is securely stored in the `keyring` and not written directly into the XML.

When saved, the UI generates a proxy definition containing an `http-header` element that references the stored secret, for example:

**Proxy with Header Authentication**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="myproxy" service="myproxy">
  <http-path />
  <http-domain allow-override="false">https://api.example.com</http-domain>
  <http-header allow-override="false" name="Authorization" value="Bearer ${myproxy_key}"/>
</proxy>
```


#### Option 2: Send API key as query parameter

Select `Add http-params` when the external API expects the key as part of the request URL (for example, `?api_key=XXXX`).

- `HTTP Query Parameter` - Enter the parameter name, such as `api_key=` followed by the variable in the format `${proxyName_key}`.
- `Secret API Key` - Enter the API key value. The value is stored securely in the `keyring`.

The generated proxy contains an `http-params` element referencing the secret:

**Proxy with Query Parameter Authentication**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="myproxy" service="myproxy">
  <http-path />
  <http-domain allow-override="false">https://api.example.com</http-domain>
  <http-params allow-override="false">api_key=${myproxy_key}</http-params>
</proxy>
```

> **Note:** **Security:** In both cases, the actual API key is never stored in plain text inside the proxy XML. It is saved in the `keyring` and referenced using `${myproxy_key}`.

After clicking `Create`, the proxy is saved under `tenant://Settings/Proxy` and can immediately be used in a [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/channel) operation.


#### Configuring Access Control (ACL)

After defining the proxy settings, you must configure who is allowed to use the proxy. Access is controlled through an [Access Control List (ACL)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/acl).

The ACL determines which users or roles are permitted to execute the proxy via a [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/channel) operation. Only the listed users or roles will be able to call the proxy - unless public access is explicitly enabled.

#### Adding users or roles

- `Add User` - Grants access to a specific user account.
- `Add Role` - Grants access to all users assigned to a specific role.
- `Add Public Access` - Allows any user to call the proxy.

For each entry, permissions such as `Read`, `Write`, `Delete`, and `Edit` can be configured. To allow a proxy to be executed in processes, the relevant execution permissions must be enabled.

> **Note:** **Security:** If no ACL entries are defined, the proxy will not be accessible. If `Public Access` is enabled, any user can use the proxy.

It is recommended to grant access through roles rather than individual users. This simplifies maintenance and ensures consistent access control across environments.


#### Sending request body data (POST / PUT)

When calling APIs that require a request body (for example POST or PUT requests), the proxy must define an `http-data` element in the [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format). In many integrations, the body content is dynamic and provided at runtime from the calling [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/channel).

To allow dynamic request bodies, the `http-data` element must have its `allow-override` attribute set to `true`. This enables the process to override the static value defined in the proxy.

**Proxy with Overrideable Request Body**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="myproxy" service="myproxy">
  <http-path />
  <http-domain allow-override="false">https://api.example.com</http-domain>
  <http-params allow-override="false">api_key=${myproxy_key}</http-params>
  <http-data allow-override="true"/>
  <http-header allow-override="false" name="Content-Type" value="application/json" />
</proxy>
```

In the example above:

- `method` is set to `POST`.
- `http-data` is defined and marked as overrideable.
- The `Content-Type` header is explicitly set.

> **Note:** **Important:** When sending request body data, the `Content-Type` header must be defined using an `http-header` element. For JSON payloads, this is typically `application/json`. Without the correct content type, many APIs will reject the request.

The actual body content can then be supplied dynamically from the calling `channel` operation, provided that `allow-override` is set to `true`.

#### Further reading

See also the Proxy tutorial example [Chatbot Tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/chatbot-tutorial).

#### Next

- [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/web-ui>*

---

## XML format

### Understanding the XML format of a proxy

A `Proxy Service` is stored as an XML document where each proxy is represented by a single XML file. While the `Proxy` section in the UI allows visual editing, advanced users can directly edit the XML. All proxies must have the file extension `.cbc` and be stored under `tenant://Settings/Proxy`.

> **Note:** Always ensure the XML document is well-formed before saving. A broken XML will render the proxy inactive. CodePad or similar tools indicate the validity of the document.

Sensitive information, such as API keys, is stored in the `keyring` and referenced in the proxy using `${secret}`. Secrets can be used in `http-header` or `http-params` elements. Functions can also be applied on secrets or variables using the format `${function:secret_or_variable}`, e.g.:

- `urlenc` – URL encode / percent encode
- `json`, `jsond` – JSON string escape (double quotes)
- `jsons` – JSON string escape (single quotes)

Using functions is optional; they can also be handled in the process language when calling the proxy via a `channel`.

#### Minimal proxy declaration

A minimal valid proxy declaration looks like this:

**Minimal Proxy**

```xml
<?xml version="1.0" encoding="utf-8"?>
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="myproxy" service="myproxy"/>
```

> **Note:** This minimal proxy does not call any service, and lacks `http-header`, `http-params`, `http-path`, or secret references. It is valid but not functional until fully configured.

#### Full proxy declaration example

**Full Proxy XML**

```xml
<?xml version="1.0" encoding="utf-8"?>
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="myproxy" service="myproxy">
  <method>POST</method> <!-- GET / POST / PUT / DELETE -->
  <http-domain allow-override="false">https://api.example.com</http-domain>
  <http-path allow-override="true">v1/resource</http-path>
  <http-data allow-override="true">{"param1":"value1"}</http-data>
  <http-params allow-override="true">${urlenc:secret}</http-params>
  <http-header allow-override="true" name="Authorization" value="Bearer ${secret}"/>
  <http-header allow-override="true" name="Accept" value="application/json"/>
  <http-variable allow-override="true" name="my-variable" value="Some value"/>
  <http-variable allow-override="true" name="another-variable" value="Another value"/>
</proxy>
```

### Element: proxy

The root element is `proxy`. It must declare the namespace `https://cloudbackend.com/proxy.xsd`. All elements and attributes belong to this namespace.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Unique proxy identifier | The unique name of the proxy document. |
| `service` | string | Associated service/keyring | Links the proxy to a keyring service where secrets are stored. |
| `xmlns` | namespace | Mandatory XML namespace | Must be set to `https://cloudbackend.com/proxy.xsd`. Any other value will invalidate the proxy. |

#### Child elements

The following child elements are supported. Symbols indicate occurrence:

- `method` – single element
- `http-domain` – single, override allowed only if needed
- `http-path` – single, overrideable
- `http-data` – single, overrideable
- `http-params` – single, overrideable, can include secrets/functions
- `http-header` – multiple allowed, overrideable, can include secrets/functions
- `http-variable` – multiple allowed, overrideable, for non-secret dynamic values

### Element: method

Defines the HTTP method for the proxy: GET, POST, PUT, DELETE, etc. Occurs once per proxy.

#### Attributes

None.

#### Child elements

None.

### Element: http-domain

Defines the target domain for the proxy request.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `allow-override` | boolean | Whether this value can be overridden in the process | Recommended to keep `false` for security. |

### Element: http-path

Defines the path segment of the request URL. Can be overridden if dynamic paths are needed.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `allow-override` | boolean | Whether this value can be overridden in the process | Defaults to `true`. |

### Element: http-data

Request body data for POST/PUT requests. Can reference variables or secrets. To send dynamic data from an application this element must have its `allow-override` attribute set to `true`.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `allow-override` | boolean | Whether this value can be overridden in the process |  |

### Element: http-params

Query parameters for the request. Can reference secrets/variables and functions: `${secret}`, `${urlenc:secret}`, etc.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `allow-override` | boolean | Whether this value can be overridden in the process |  |

### Element: http-header

HTTP headers to include in the request. Multiple headers can be defined. Values can reference secrets/variables and functions.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Header name |  |
| `value` | string | Header value, can reference secret/variable |  |
| `allow-override` | boolean | Whether this value can be overridden in the process |  |

### Element: http-variable

Non-secret dynamic values that can be referenced elsewhere in the proxy using `${my-variable}`. Functions can also be applied.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Variable name |  |
| `value` | string | Variable value |  |
| `allow-override` | boolean | Whether this value can be overridden in the process |  |

#### Next

- [Webhooks](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/proxy/xml-format>*

---

## Administrator

### Administrator or other support team role

The Administrator or designated support team members or engineers will validate, assign and process incoming support tickets.

Tickets are sorted such that the most recent updates are at the top of the grid.

The Tabs can be used to select only one section category.

Click on a ticket to see and use the `Message and case log` where you can communicate with the ticket creator to ask for clarification, answer questions and report back on progress.

Right-click on a ticket to Manage it. There you can change status of the ticket, assign it it to a team member. You can also view any attachments.


#### Next

- [Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/administrator>*

---

## Member

### Member or other role

The Owner or Administrator will set up the desired support sections (categories) prior to admitting members to submit tickets.

See the menu bar above to the right. To create a ticket or feedback, click on the `icon://star?theme=cbeapps` Create button.


From the drop down menus, select first Section and then Subsection and so on.

> **Note:** To be useful the most appropriate category `Section` and `Subsection` should be determined.

The better the description is, the faster the matter can be understood. If it is hard to recreate or understand, additional information may be required.

> **Tip:** With more information provided the support will have better chance to recreate any problem.


Optionally add a screenshot or other attachment to further explain the matter.


Click on a ticket to see and use the `Message and case log` where you can communicate with the support team see status of the ticket and answer any questions from the support team. The Log panel my be toggled by clicking the `icon://messages?theme=cbeapps` Log button above.

Related menu options become available in the menu bar above.

By doing a right click on a ticket a complementary small menu opens up.


If the fundamentals of the ticket has changed, the `icon://pencil` Edit button may be used to alter the settings of the ticket.


To change the screenshot attachments of a ticket, right-click on the ticket and select Screenshots `icon://photos` Screenshot button may be used to list the attachments of the ticket.


The grid lists the attachments already attached to the ticket and which are visible to the support team.

To view an attachment double click on it. This will minimize the small window and display the attachment in the CLI. The small window can be brought back by clicking on **View Screenshots** in the menu on the left. The same goes for the **Support** view, see the menu on the left.

The white field in the lower part of the window view shows the local work area of files that can be attached to the ticket.


To remove an attachment of this ticket, select the image icon in the white field in the lower part of the window and click Delete.

To add an attachment of this ticket, click Upload.

Attach button may be used to save the modified set of files to be the new attachments of the ticket, replacing the old attachments.

Exit button will close the view without any changes to the ticket.

#### Next

- [Administrator](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/administrator)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/member>*

---

## Owner

### Owner role

Prior to admitting members, the Owner should set up the support sections (categories) that are to be available for the members. A default setup will be loaded, which can be amended and updated to suit the organization.

> **Warning:** The support system needs to be configured with at least one category `Section`. Each Section will need at least one `Subsection`.

See the menu bar above to the right. Click on the `icon://gearwheel?theme=cbeapps` Config button.


At the left half of the screen: Input a new Section name and press Add.


At the left half of the screen: Select the specific Section by clicking it.

At the right half of the screen: Input a new Subsection name and press Add.


> **Tip:** By first clicking on the CloudBackend button, an Owner may submit a ticket to the CloudBackend support desk using the similar process as a Member.
> ( Alternatively via e-mail to support @ cloudbackend.com ).

#### Next

- [Member](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/member)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/support/owner>*

---

## XML format

### Understanding the XML format of a webhook

Each webhook is a .cbc XML file stored in `tenant://Settings/Webhooks`.

It defines the container and file for storing incoming POST request data.

### Element: webhook

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Unique webhook name per group |  |
| `xmlns` | namespace | Mandatory XML namespace (https://cloudbackend.com/webhooks.xsd) |  |
| `secret` | boolean | If true, api key secrets to be stored here in clear text |  |

### Child elements

- container
- object
- store-header (*)

### Element: container

Specifies the destination container where the webhook data will be stored.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `id` | string | Folder ID where incoming data is stored |  |

### Element: object

Defines the target object name and file ending for storing POST request data. The file ending should match the type of data being received (.xml, .json, .txt, .cbc).

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Output object name |  |
| `overwrite` | boolean | If true, overwrites same file on each request; if false, a new file with timestamp is created |  |

### Element: apikeys

Lists api keys in clear text. Minimum one is required to be useful.

### Sub nodes

- apikey

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Secrets name |  |
| `id` | numeric | Unique id. |  |
| `secret` | string | api key secret in clear text. |  |

### Element: store-header

Specifies an HTTP header from the POST request to store in the result file. Multiple `store-header` elements are allowed.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | HTTP header name to store |  |

The XML documentation contains related information for advanced developers.

### Further reading

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT and XLink that are used by CloudBackend. *(XML)*

#### Next

- [Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks/xml-format>*

---
