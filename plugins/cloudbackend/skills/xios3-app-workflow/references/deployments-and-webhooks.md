# Deployments and webhooks, from the CloudBackend console manual

The console's Deployments page (cards, stages, promotion, versions, domains) and the Webhooks pages (the inbound side of an integration), as the CloudBackend documentation publishes them.

3 topics from the published CloudBackend documentation, generated on 2026-11-05. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Deployments](#deployments)
- [Webhooks](#webhooks)
- [XML format](#xml-format)

## Deployments

You can publish an application to be possible to use from an external domain by choosing to deploy the application. Deployments are done using the `Deploy Wizard`, which is used from the `Projects` section. Any deployed application will show up under the `Deployments` section.

> **Note:** Deployed projects are accessible from anyone on the Internet, please make sure you have a proper login page for users to login to for any deployed application.


> **Tip:** Deploying an app will by default be locked to a specific XIOS software release. Optionally it can use the latest release.

Deployed projects are available externally through the links shown when you click on a deployed application. These links are URLs in the following formats

**Deployed application Home domain**

```console
https://[tenant]-[username]-[deployment_name].cloudbackend.cloud
```

**Deployed application Group domain**

```console
https://[tenant]-[groupId]-[deployment_name].cloudbackend.cloud
```

- **[How Deployment Works](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-deployment)** — More information about how to deploy XIOS/3 applications can be found in the XIOS/3 documentation, here. *(XIOS/3 Documentation)*

- **[Deployment Tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/tutorials/application-deployment)** — A practical tutorial for how to deploy your project can be found here. *(Learn to Deploy)*

#### User sign-up

You can enable the ability for users to sign-up to your published application from the login page. Any created user from your published application will show up as a new identity under the Identities section. If you do not want new users to be able to sign-up, please disable the sign-up capabilities for your application.

Users that have self-onboarded and signed up for your application will belong to your tenant, and legally be the responsibility of you.

> **Note:** It is highly recommended that you create an End-user License Agreement (EULA) that regulates the relationship between your tenant/organization and the end-user.

#### Copyright

Published application must follow copyright laws and not publish any content stored in the database that makes a copyright or trademark infringement to any third party. It is the publisher of the application that is solely responsible for any infringements.

### Tutorials

- **[Deployment Tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/tutorials/application-deployment)** — A practical tutorial for how to deploy your project can be found here. *(Learn to Deploy)*

### CLI Commands

To publish do:

**CLI Syntax**

```console
publish [container path] [name] -p [password] -v [public] -a [read] -d [description] 
```

To unpublish do:

**CLI Syntax**

```console
cat tenant://Groups/.published
unpublish [publication id] -g [group id] 
```

To see your home publications do:

**CLI Syntax**

```console
published
```

To see your tenant publications do:

**CLI Syntax**

```console
published -g/-t
```

For more information see:

- [Publish Container/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/publish-container)
- [Unpublish Container/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/unpublish-container)
- [Published Containers/Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/sharing-commands/published-container)

### Process Development Information

Example publishing.

**Process Syntax**

```xml
<alias name="published" value="tenant://Groups/.published"/>
<operation name="bind" value="$published">
  <component view="PubView" name="deploy_list" select="/db:result"/>
</operation> 
```

For more information see:

- mount

#### Next

- [Documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/documentation)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/deployments>*

---

## Webhooks

### Understanding inbound webhooks

Webhooks will let external services, like computers, apps and IoT appliances, send data directly into CloudBackend to be stored in specific containers.

When triggered, a webhook will store the received POST request in the container and object you specify.

#### Create the webhook definition


- Click create.
- In the popup enter a name of the new definition.
- Click the "Save API secret" to include them in the definition and be able to look up secrets later on.
- If not choosing it to be saved, it becomes your responsibility to store a 45 character long secret somewhere else.

#### Set the properties


- 
- 
- 
- Select the container where incoming data should be stored.
- 
- Define the output object name, file ending, and whether it should be overwritten when the next arrives.
- Select a file ending that represents the data type, e.g., `.xml`, `.json`, `.txt`, `.jpg`, `.png`
- 
- If `Overwrite object?` is not selected, names will get a trailing timestamp to be unique.
- 
- Optionally store incoming HTTP headers in the result.
- 
- Generate API key by clicking API key Add.


#### Make a note of the API key


- The secret will be needed in the next step: `API-KEY-SECRET`
- It must end with the character: =
- If "Save API secret" was selected when creating the webhook, a secret can be Viewed when needed.

#### View the properties


- 
- 
- The webhook URL can be copied from the top of the Properties panel.
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- If "Save API secret" was selected when creating the webhook, a secret can be selected and Viewed with a click.

#### Data model matching a Datatype for automation of meta data extraction

> **Tip:** By formatting the incoming data as an XML object to match a defined `Datatype`, the CloudBackend service will extract the meta data keys.

For more information on this, see the [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes) section.

#### Calling a webhook from an external service

Once a webhook is created, external services can be configured to send their outbound webhook events into CloudBackend.

The external service must be set up with:

- Paste in your 45 character secret instead of the: `<API-KEY-SECRET>` in the calling script.
- A `Content-Type` header matching the file ending defined in the webhook’s `object` element
  (e.g., `application/json`, `text/xml`, `text/plain`, `image/jpeg`, `image/png`)
- The payload data, which will be stored in the tenant database according to the webhook definition
- Incoming data will be written into a document defined by the `object` element.
- The webhook URL: `https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/` can be copied from the Properties panel.

#### Code examples in bash

**Example: bash posting a news update - two variants**

*bash1*

```sh
#!/usr/bin/bash
SOURCE=`hostname`
curl --request POST \
     --header 'Authorization: Bearer API-KEY-SECRET' \
     --header 'Content-Type: text/xml' \
     --data "<newsfeed>Solsken i ${SOURCE}</newsfeed>" \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${SOURCE}
```

*bash2*

```sh
#!/usr/bin/bash
SOURCE=`hostname`
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: text/xml' \
     -d "<newsfeed>Molnigt med lätt regn i ${SOURCE}</newsfeed>" \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${SOURCE}
```

#### Upload a binary file

**Example: bash upload an image**

*jpeg*

```sh
#!/usr/bin/bash
PIC=/home/me/Pictures/IMG_19825.jpg
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: image/jpeg' \
     --data-binary @${PIC} \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${PIC}
```

*png*

```sh
#!/usr/bin/bash
PIC=/home/me/Pictures/graph1.png
curl -X POST \
     -H 'Authorization: Bearer API-KEY-SECRET' \
     -H 'Content-Type: image/png' \
     --data-binary @${PIC} \
     https://api.cloudbackend.com/v1/hook/{tenantName}/{webhook_name}/
echo
echo ${PIC}
```

#### Code example in python

**Example: python posting a news update**

*python*

```python
#!/usr/bin/python3
import requests
import subprocess

rootstart= "<newsfeed>"
rootend  = "</newsfeed>"
output   = subprocess.check_output(["hostname"], text=True).rstrip('\r\n')
message  = "Cloudy at " + output
payload  = rootstart + message + rootend

url     = 'https://api.cloudbackend.com/v1/hook/...'
headers = {"Authorization": "Bearer API-KEY-SECRET",
           "Content-Type": "text/xml"}

def post_news():
    res = requests.post(url, data=payload, headers=headers)
    print(res)

post_news() 
```

> **Warning:** If `url` contains any spelling error, the service will return "Not Found".
> If `API-KEY-SECRET` contains any typing error, the service will return "Forbidden".

The incoming XML payload will be stored in the container and object defined by the webhook’s `container` and `object` elements.

#### Verify that the new feed has arrived, using the cli


> **Tip:** The [Notice Tutorial - e5](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/tutorials/notice-tutorial/webhook) under exercise 5 provides further practical training on Webhook usage with instant displaying of the incoming data feed.

#### Advanced: Edit right click option

There is a right click menu option to edit the webhook object directly in `CodePad` for more advanced setups, if needed.

The webhook is stored as XML in your tenant database under `tenant://Settings/Webhooks/`.

#### Next

- [XML format](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks/xml-format) of the webhook definition object.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks>*

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
