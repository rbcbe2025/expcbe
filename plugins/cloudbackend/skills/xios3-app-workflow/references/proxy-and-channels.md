# Proxy channels and external APIs, from the XIOS/3 manual

The proxy guide (configuration and process code), the chatbot tutorial's proxy and process pages, and the code concept for binding a component to an external API. The workflow's hand-written references/ai-and-integrations-via-proxy.md builds on these.

6 topics from the published XIOS/3 documentation, generated on 2026-11-04. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Bind UI components to an external API](#bind-ui-components-to-an-external-api)
- [Proxy](#proxy)
- [Configuration](#configuration)
- [Process code](#process-code)
- [Application Process](#application-process)
- [Setting up a proxy](#setting-up-a-proxy)

## Bind UI components to an external API

This concept shows how to [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) a component, in this case a [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid), to data in an external API.

You can run the code directly here, and copy the parts you need for your application.

#### Code Snippet

**Binding to External API Concept** *(tested, runnable)*

```xml
<application name="apiBind" icon="icon://earth_location">
  <view name="apiBind" title="Binding an External API" icon="icon://earth_location" width="400" height="400">
    <panel name="MainPanel">
      <grid name="myGrid" selection="row">
        <row match="/metObsParameter/station[active = 'true']">
          <column match="name" display="." width="150" label="Name"/>
          <column match="longitude" display="." width="50" label="Long"/>
          <column match="latitude" display="." width="50" label="Lat"/>
        </row>
      </grid>
    </panel>
  </view>

  <process name="apiBind - Process">
    <trigger view="apiBind" event="Loaded" step="bindAPI"/>

    <step id="start">
      <operation name="channel">
        <name>https</name>
        <title>HTTPS</title>
        <protocol>HTTPS</protocol>
      </operation>
    </step>

    <step id="bindAPI">
      <operation name="bind" value="https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/11.xml">
        <component name="myGrid" view="apiBind"/>
      </operation>
    </step>
  </process>
</application>
```

#### Code Explanation

**Line 5 - 9**
In our [`grid`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid) we want to produce one row for each element in the bound document that matches every `station` in `metObsParameter` that has `active` = `true`. Then we want each row to show this station's `name`, `longitude`, and `latitude` using the `match` attribute for each. `display="."` means that we will show the value that comes from that node.

**Line 15**
This `trigger` will be initiated once the entire application is loaded, using `event="Loaded"`, triggering the `bindAPI` `step`.

**Line 17 - 23**
Any `step` with `id="start"` will always run first, as soon as the process code is loaded. In this `step` we use the [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel) `operation` to set up a HTTPS protocol, stated in the `protocol` element, with `name` https and `title` HTTPS.

**Line 26 - 28**
Here we use the [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind) `operation` with the important `value` attribute pointing to our external API. This is the Swedish Weather Service's external API for listing weather stations and their data. The data in this API is bound to the `myGrid` `component`.

### Used Building Blocks

**UI Components:**

- [grid](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/grid)

**Process Operations:**

- [bind](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/bind)
- [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/code-concepts/bind-ui-components-to-an-external-api>*

---

## Proxy

In this section we will describe how to setup and use an API proxy. Specifically how to configure a proxy-file, how to hide and use any API-tokens or other forms of authentification and lastly but certainly not least how to use them in your application code.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/proxy>*

---

## Configuration

To configure an API we need two things.

Firstly, a file within the tenant://Settings/Proxy container. This is easily configurable from the Proxy section by simply creating one and editing it through the properties sidepanel. The resulting file is an xml-type file with a root-element named proxy. For advanced users you could edit the file directly, however editing throught the UI is the recommended way.

```xml
<?xml version="1.0"?>

<proxy name="NAME" service="SERVICE-NAME" xmlns="https://cloudbackend.com/proxy.xsd">
  <http-domain allow-override="BOOL">https://some.server.com</http-domain>
  <http-path allow-override="BOOL">/some/path/here</http-path>
  <http-params allow-override="BOOL"></http-params>
  <http-data allow-override="BOOL">SOME DATA</http-data>
  <http-header allow-override="BOOL" name="Header1" value="Value #1" />
  <http-header allow-override="BOOL" name="Header2" value="Value #2" />
  <variable allow-override="BOOL" name="VARIABLE1" value="Some variable data #1" />
  <variable allow-override="BOOL" name="VARIABLE2" value="Some variable data #2" />
</proxy>
```

Secondly, a key needs to be setup. To do so press the keyring button in the proxy section. This will launch an application where you can choose which group and wether to create, edit or delete this key for the chosen group. The key **needs to match the service name given.** It can also include some descriptive information and if needed any volatile information (e.g. authentication tokens).

#### Secrets

To add any secrets they have to be passed as an xml-structure similar to the following.

```xml
<secrets>
  <secret name="MY_SECRET_TOKEN" value="abcd1234" />
  <secret name="MY_SECRET_PASSWORD" value="1234abcd" />
</secrets>
```

These secret tokens are saved securely on the server and not visible to any user once set. They can be overwritten at any time by the owner/admin of the current tenant. To use them in your proxy simply write `${MY_SECRET_TOKEN}` where otherwise the token would be placed.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/proxy/configuration>*

---

## Process code

When writing process code for your application there are two steps required.

The first is a `channel` operation which gives you the protocol to access your proxy, the second is a `callService` operation that actuactes the call.

```xml
<operation name="channel" value="proxy_name">
  <name>channel_name</name>
  <protocol>APIProxy</protocol>
  <adapter path="/" type="CompactJSON"/>
</operation>
```

In the example above proxy_name would be whatever name you've given your proxy, channel_name can be what makes sense to you, APIProxy is the neccessary protocol to use when handling proxies and CompactJSON is one of the adapters that we require to handle the incoming data. In the case of CompactJSON it will take the entire response and convert it into a xml-structure to be easier handled when developing an application.

```xml
<operation name="callService" value="channel_name://">
  <body>
    <method>GET</method>
    <http-path>/path/to/my/api</http-path>
  </body>
</operation>
```

Here we simply call the api with the name we gave it when creating the channel. Depending on how it was configured in the initial proxy-file we can also pass override parameters in the body-element.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/proxy/process-code>*

---

## Application Process

### The process code

In this section we will learn how to create an AI agent using the [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel) and [callService](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callservice) operations. And how to display the conversation using [aliases](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases). We will be using the Mistral [conversation API](https://docs.mistral.ai/agents/agents). For the best performance with your agent it's recommended to upload documents which the agent can access, and to use the [Documents API](https://docs.mistral.ai/agents/tools/built-in/document_library), which is a variation of the [conversation API.](https://docs.mistral.ai/agents/agents) How this is done varies by API provider and falls outside the scope of this tutorial. In this tutorial we will simply look at connecting to and chatting to an agent, but be aware that this exists and is the best way of setting up a chatbot agent for your specific need.

The things that our process code need to do are the following:

1. Set up a channel using our proxy
2. Create an agent
3. Send and receive messages to the agent
4. Display the messages in the view
5. Disable input while waiting for a response
6. Reset the conversation

#### Initializing our agent

**Initialisation code**

```xml
<process name="chatProcess">
      <trigger view="chatbotView" event="Loaded" step="init"/>

      <step id="init">
        <operation name="channel">
          <name>chatbot</name>
          <proxy>chatbot</proxy>
          <title>AI Chatbot</title>
          <protocol>PROXY</protocol>
          <adapter path="/" type="CompactJSON"/>
        </operation>

        <operation name="callService" value="chatbot://v1/agents">
          <wait>true</wait>
          <method>POST</method>
          <document>agent://start</document>
          <body type="json" eval="pct">
            {
              "model": "mistral-medium-latest",
              "name": "Service Helper",
              "description": "An agent that will help answer questions about shoes."
            }
          </body>
        </operation>

        <alias name="agentId" value="agent://start#/*/id"/>

        <alias name="conversationDoc" model="newsilent">
          <messages>
            <response>Welcome to the start of the support chat. How can I help you?</response>
          </messages>
        </alias>

        <operation name="bind" value="$conversationDoc">
          <component view="chatbotView" name="chat"/>
        </operation>
      </step>
  </proccess>
```

The first step for our process is setting up a [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel). This allows us to use the proxy we defined earlier, with our secret API key. We use this channel on in our [callService](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callservice) operation, which allows us to make direct API calls to a specific endpoint.

There are several important points to take of note of in the [callService](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callservice) operation. Declaring the body of our request to be of type `json` will automatically set the content type headers to json, allowing us to avoid explicitly declaring them. We also explicitly declare the method of the request and set it to *POST*, so that the proxy knows what method to use to send the request to the endpoint. Finally we also declare the variable in which the response will be received in the `document` tag. The response from our endpoint looks something like this, where the `id` of the response is the identifier of our new chatbot agent.

Finally we declare the `conversationDoc` [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) that will be used to display our questions and responses in the view. We've declared an initial message to show the user as they enter the chat.

**Mistral API response**

```xml
<_X30_>
  <instructions>null</instructions>
  <completion_args>
    <stop>null</stop>
    <presence_penalty>null</presence_penalty>
    <frequency_penalty>null</frequency_penalty>
    <temperature>null</temperature>
    <top_p>null</top_p>
    <max_tokens>null</max_tokens>
    <random_seed>null</random_seed>
    <prediction>null</prediction>
    <response_format>null</response_format>
    <tool_choice>auto</tool_choice>
  </completion_args>
  <model>mistral-medium-latest</model>
  <name>Simple Agent</name>
  <description>A simple Agent with persistent state.</description>
  <handoffs>null</handoffs>
  <metadata>null</metadata>
  <object>agent</object>
  <id>ag_019c478f9cf875f7b3f851ed86ea5c76</id>
  <version>0</version>
  <created_at>2026-02-10T12:38:40.143930Z</created_at>
  <updated_at>2026-02-10T12:38:40.143932Z</updated_at>S
  <deployment_chat>false</deployment_chat>
  <source>api</source>
</_X30_>
```

#### Sending our message

The Mistral conversations API has separate endpoints for starting and continuing conversations. This code will create a conversation if one does not already exists and pass in the `agentId` variable we created in the `init` step. We capture the response from the AI by xpathing to the content and storing it in our `aiResponse` variable, the response will be appended to the chat in a later step.

An important thing to take note of here is the `eval` attribute on the `<body>` tags. This allows us to escape and evaluate XIOS/3 aliases inside the JSON string, between "(% %)" markers. The [callService](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callservice) is a complex operation and this tutorial does not cover all of its use cases.

**Process code to open and continue a conversation**

```xml
<alias name="hasConversation" value="is-alias(conversationId)"/>

<operation name="decision">
  <when test="{$hasConversation}">
    <operation name="callService" value="chatbot://v1/conversations/{$conversationId}">
      <wait>true</wait>
      <document>agent://response</document>
      <body type="json" eval="pct">
        {
        "inputs": "(%$userMessage%)",
        "stream": false,
        "store": true,
        "handoff_execution": "server"
        }
      </body>
    </operation>
    <alias name="aiResponse" value="agent://response#/json/outputs/content"/>
  </when>

  <otherwise>
    <operation name="callService" value="chatbot://v1/conversations">
      <wait>true</wait>
      <document>agent://response</document>
      <body type="json" eval="pct">
        {
        "inputs": [
        {
        "role": "user",
        "content": "(%$userMessage%)",
        "object": "entry",
        "type": "message.input"
        }
        ],
        "stream": false,
        "agent_id": "(%$agentId%)"
        }
      </body>
    </operation>
    <alias name="aiResponse" value="agent://response#/json/outputs/content"/>
    <alias name="conversationId" value="agent://response#/json/conversation_id" />
  </otherwise>
</operation>
```

#### Handling the response

The following code is the full code for handling messaging with our chatbot. It will disable and re-enable the chat as we wait for responses. It will also append the messages and responses to the `conversationDoc` [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases).

**Full conversation handling code**

```xml
<step id="sendQuestion">
  <alias name="userMessage" value="#chatbotView#aiInput.getValue()"/>
  <operation name="call" value="disableChat" />

  <operation name="change" value="$conversationDoc">
    <store select="messages" type="append"><question>{$userMessage}</question></store>
  </operation>

  <alias name="hasConversation" value="is-alias(conversationId)"/>

  <operation name="decision">

    <when test="{$hasConversation} and {$conversationId} != ''">
      <operation name="callService" value="chatbot://v1/conversations/{$conversationId}">
        <wait>true</wait>
        <document>agent://response</document>
        <body type="json" eval="pct">
          {
          "inputs": "(%$userMessage%)",
          "stream": false,
          "store": true,
          "handoff_execution": "server"
          }
        </body>
      </operation>
      <alias name="aiResponse" value="agent://response#/json/outputs/content"/>
    </when>

    <otherwise>
      <operation name="callService" value="chatbot://v1/conversations">
        <wait>true</wait>
        <document>agent://response</document>
        <body type="json" eval="pct">
          {
          "inputs": [
          {
          "role": "user",
          "content": "(%$userMessage%)",
          "object": "entry",
          "type": "message.input"
          }
          ],
          "stream": false,
          "agent_id": "(%$agentId%)"
          }
        </body>
      </operation>

      <alias name="aiResponse" value="agent://response#/json/outputs/content"/>
      <alias name="conversationId" value="agent://response#/json/conversation_id" />
    </otherwise>
  </operation>

  <operation name="change" value="$conversationDoc">
    <store select="messages" type="append"><response>{$aiResponse}</response></store>
  </operation>

  <operation name="call" value="enableChat" />

</step>

<step id="disableChat">'
  <operation name="action" value="#chatbotView">
    <component name="aiInput" action="clear"/>
    <component name="aiInput" action="disable"/>
    <component name="askAI" action="disable"/>
  </operation>
</step>

<step id="enableChat">
  <operation name="action" value="#chatbotView">
    <component name="aiInput" action="enable"/>
    <component name="askAI" action="enable"/>
  </operation>
</step>
```

#### Resetting our conversation

To reset the conversation we must reset the `conversationId` [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) to force a new conversation when we send a message. We must also reset the `conversationDoc` [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) so that the message history in the view is reset.

**Resetting the conversation**

```xml
<step id="resetConversation">
  <alias name="conversationId" value=""/>
  <operation name="change" value="$conversationDoc">
    <store select="messages" type="replace">
      <messages>
        <response>Welcome to the start of the support chat. How can I help you?</response>
      </messages>
    </store>
  </operation>
</step>
```

[Next](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/chatbot-tutorial/complete) we will look at the complete code.

Version: 2026-02-12
Author: Pontus Grandin

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/chatbot-tutorial/process>*

---

## Setting up a proxy

In this tutorial we will learn how to set up an AI chatbot, which could be used for answering questions about products or provided services. Just like in the [User Actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/useractions-tutorial) tutorial we will be creating an [application component](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/ui-development/using-components/types), which are components that are practically applications in their own right. In this tutorial we will learn how to set up an AI chatbot using [Mistral's free API tier](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key), but this process should be similar for other API providers.

### Configuring the proxy

In the first part of this tutorial we will look into setting up a simple proxy using the graphical interface. A proxy is a way of defining how to connect to an external API endpoint. In this tutorial we will simply see how to set one up and how to use it for creating an AI chatbot. For a deep dive into how a proxy works you can read through the proxy documentation page.

To get started with using a proxy we will head to the Proxy section of the CloudBackend PaaS, available from the left-hand navigation menu. The advanced configuration is outside the scope of this tutorial and is not necessary for setting up a working chatbot agent.


Following is a short explanation of the necessary fields and the best practices to follow.

**Necessary fields:**

1. Proxy Name
2. API Domain
3. Authorization method
4. HTTP Header
5. Header Value
6. API Key

The `Proxy Name` field is self-explanatory and is the name of the proxy as it's seen in the dashboard. It's also what will be used to reference the proxy inside XIOS/3 process code. It carries signifance for the naming scheme of the `Header Value` field as will be seen later. Best practice is to keep the name in lowercase.

The `API Domain` field is the URL that the proxy will point to. In some cases it may be useful to have the proxy point to a single endpoint, however in our case we will add the endpoints in the XIOS/3 process code.

The `Authorization Method` field is the way the proxy will send the authorization to the endpoint. Our endpoint takes the API key as a header so we have the `Add http-header` selected.

The `HTTP Header` field is the header in which the API key will be sent. The Mistral API accepts the key in the `Authorization` header.

The `Header Value` field and dropdown selection is the value that thg:\AI tutorial\proxyACL.pngce `HTTP Header` takes when sent to the API. Take care here as the input field must be written in the following format: `${proxyName_key}`. In our case that will be `${chatbot_key}`. The dropdown selection is the prefix to the value, in our case Bearer. Some API's take another prefix, such as AWS.

The `API Key` field is your private API Key which will be used to authenticate the request to the server. This should be replaced with **your** key. If you plan to follow along with the tutorial I recommend getting a free API key from [Mistral](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key) from their experimental API tier.

#### Setting up proxy rights

A proxy can also have different access rights set. This could, for example, mean that certain API's could be limited to logged in users, or power users. In our case we want our chatbot to be available to all users, so we will select the `Add Public Access` button.


Once we press finish the proxy should appear on the proxy page, and the proxy should have been successfully created with correct ACL rights and information to be used with our chatbot. But there is one final step before we are done configuring the proxy. By right clicking the proxy icon and selecting *edit* we can see an XML representation of the proxy. In this XML representation of our proxy we will see that the domain and authorization header from the graphical interface has been set. But there are a few more things to add.

**Successfully created proxy**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="chatbot" service="chatbot">
  <http-path />
  <http-domain allow-override="false">https://api.mistral.ai</http-domain>
  <http-header allow-override="false" name="Authorization" value="Bearer ${chatbot_key}"/>
</proxy>
```

#### Final proxy configuration

To finish our setup we want to add two more headers and allow users to send data using the POST and PUT HTTP methods. To achieve this we will add two `<http-header>` elements where we want to set the `Content-Type` and `Accept` headers to `application/json`. This will allow all requests routed through the proxy to pass along these headers to the endpoint. This allows us to omit these headers when we later call the endpoints using the [callService](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/callservice) operation.

Finally to allow our users to send dynamic data through POST and PUT requests we need to create a `<http-data>` element with the `allow-override` attribute set to `true`. Our final proxy should look something like this.

**Final proxy configuration**

```xml
<proxy xmlns="https://cloudbackend.com/proxy.xsd" name="chatbot" service="chatbot">
  <http-path/>
  <http-domain allow-override="false">https://api.mistral.ai</http-domain>
  <http-header allow-override="false" name="Authorization" value="Bearer ${chatbot_key}"/>
  <http-header allow-override="false" name="Content-Type" value="application/json"/>
  <http-header allow-override="false" name="Accept" value="application/json"/>
  <http-data allow-override="true" />
</proxy>
```

In the [next](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/chatbot-tutorial/view) part of the tutorial will look at using the proxy we have made with the [channel](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/channel) operation, and creating view code for the chat.

Version: 2026-02-11
Author: Pontus Grandin

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/chatbot-tutorial/proxy>*

---
