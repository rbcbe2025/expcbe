# The CRM — e-mail to your users

The built-in CRM sends the e-mails a deployed application's users get: verification and welcome mails, reminders, account deletion. Setting it up (Owner only, relay host), mails, rules, templates, settings and deploying them.

6 topics from the published CloudBackend documentation, generated on 2026-10-15. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Add Banners and Settings](#add-banners-and-settings)
- [Create Email](#create-email)
- [Create Rule](#create-rule)
- [Create Template](#create-template)
- [Deploy Emails](#deploy-emails)
- [Getting started](#getting-started)

## Add Banners and Settings

### Adding company color schemes, links and banners / company logos

The Settings tab is where you fill out all your customizable e-mail content. The following picture displays all fields:


From the previous chapter an short explanation on what each field represents and what it should be filled out with:

- `link` - link is a link to company website that should be embedded in the logo. (https://....)
- `logo` - logo is the company logo / banner that you include in the e-mail. (https://....)
- `invlogo` - invlogo is the inverted logo / banner. (https://....)
- `box/@use` - If true it adds a grey div / box. (checkbox)
- `box/@subject` - Header with your text as subject. (text)
- `box` - Contents to your header in the grey box, (text).
- `copyright` - Include copyright text. (text)
- `links` - Root node of one or more links to company pages on social media. (N.A)
- `links/twitter` - Link to company Twitter / X page. (https://x....)
- `links/linkedin` - Link to company Linkedin page. (https://linkedin....)
- `links/facebook` - Link to company Facebook page. (https://facebook....)
- `links/blog` - Link to company blog page. (https://....)

Once some or all are filled out save the settings file via the save button and check out a mail in the mail tab.

#### Next

- [Deploy Emails](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/deploy-emails)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/add-settings>*

---

## Create Email

### Creating a new mail

In this section we will walk through the data model of e-mails plus functionality associated with e-mails and how you can use these variables to compose them.

In the following section all e-mail nodes are displayed with explanation on what it corresponds to in the UI or other functionality of the CRM.

#### Mail xml data example

**Mail XML**

```xml
<?xml version="1.0" encoding="utf-8"?>
<mail name="Change password mail" group="must-email" created="2020-10-25T14:19:33Z" updated="2020-12-25T14:19:33Z">
  <description/>
  <sender>no-reply@company.com</sender>
  <senderName/>
  <replyTo>no-reply@company.com</replyTo>
  <replyToName/>
  <subject>{$tenantdisplay} Password Change</subject>
  <body>
    <h1>Password Change Requested</h1>
    <p>{$tenantdisplay} has received a request to change your password. If
        you have not requested this, safely ignore this e-mail and nothing
        will happen.</p>
    <info title="Requested for username">{$username}</info>
    <p>The following link is valid for 24 hours and will allow you to
       set a new password:</p>
    <info title="Link" link="https://{$tenant}.db.company.com/?u={$username}&amp;c={$action:changePassword/changePasswordCode/@code}"/>
  </body>
</mail>
```

### Element: mail

The root element is `mail`. the following attributes needs to be defined on the root mail node.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Unique mail identifier | The unique name of the mail. |
| `group` | string | Associated mail group | Categorizes e-mails in to groups both for end-users to turn on/off mail notifications from but also used for specifying what mail template to use. |
| `created` | string | Created date and time | Created date and time. |
| `updated` | string | Updated date and time | Updated date and time. |

#### Child elements

The following child elements are supported.

- `description` – Description of what the mail represents
- `sender` – sender e-mail address
- `senderName` – sender name
- `replyTo` – reply to e-mail address
- `subject` – mail subject, can include use of variables
- `body` – body of the mail

### Element: body

Defines the body of the mail / content of the mail to be sent.

#### Child elements

The following child elements are supported.

- `h1` – Header text
- `p` – Paragraph
- `info` – info
- `link` – link
- `button` – button

### Element: h1

html style header.

#### Attributes

None.

#### Child elements

None.

### Element: p

html style header.

#### Attributes

None.

#### Child elements

None.

### Element: info

Defines an info block, usage with attributes like link with link url, variables can be used in links.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `title` | string | String | Title of your info block. |
| `link` | string | url to clickable link. Usage of variables ex {$username}, {$publish} etc is possible. | url e.g., `https://companywebsite.com/?user{$username}/main/infopage` |

### Variable usage in e-mails

The e-mail system allows for certain variables to be used. following is a list of all currently available variables:

- `{$username}` - user's username, e.g., <p>Signed in as {$username}.</p>
- `{$email}` - user's e-mail, e.g., <p>Contact e-mail: {$email}</p>
- `{$firstname}` - user's firstname, e.g., <p>Hi {$firstname}, welcome back.</p>
- `{$FIRSTNAME}` - user's firstname (uppercase), e.g., <p>HELLO {$FIRSTNAME}!</p>
- `{$name}` - user's full name (first + last name), e.g., <p>Account owner: {$name}</p>
- `{$plan}` - 1-4 char account type name (see /v1/accounttype API to list/add account types), e.g., <p>Plan: {$plan}</p>
- `{$used}` - user's home drive size, eg. "123 bytes", "12.34 MB", etc, e.g., <p>Storage used: {$used}</p>
- `{$space}` - user's home drive quota, eg. "123 bytes", "12.34 MB", etc, e.g., <p>Storage quota: {$space}</p>
- `{$used_perc}` - user's home drive used percentage as an integer, e.g., <p>Usage: {$used_perc}%</p>
- `{$expiration}` - date when user's account expires or "-" if it does not expire, e.g., <p>Expires on: {$expiration}</p>
- `{$webshare}` - webshare name, e.g., <p>Share name: {$webshare}</p>
- `{$password}` - webshare password, e.g., <p>Share password: {$password}</p>
- `{$type}` - webshare type ("Collaboration", "WebShare Plus", or "WebShare"), e.g., <p>Share type: {$type}</p>
- `{$permissions}` - webshare permissions as a translated string ("read, write and delete rights", "read and write rights", or "read rights"), e.g., <p>Access: {$permissions}</p>
- `{$description}` - webshare description, e.g., <p>Description: {$description}</p>
- `{$message}` - webshare message, e.g., <p>Message from owner: {$message}</p>
- `{$link}` - all text inside a <link> tag, e.g., <p>Link text: {$link}</p>
- `{$invitation_code}` - invitation code, e.g., <p>Invitation code: {$invitation_code}</p>
- `{$invitation_plan}` - invitation product description or "Free plan" if it's a free account, e.g., <p>Invitation plan: {$invitation_plan}</p>
- `{$invite_link}` - invite link, e.g., <p>Accept invitation: <a href="{$invite_link}">{$invite_link}</a></p>
- `{$invite_subject}` - invite subject, e.g., <p>Subject: {$invite_subject}</p>
- `{$invite_signupSource}` - invite signup source, e.g., <p>Signup source: {$invite_signupSource}</p>
- `{$invite_accountTypeSize}` - invite account type size eg. "123 bytes", "12.34 MB", etc, e.g., <p>Included storage: {$invite_accountTypeSize}</p>
- `{$invite_message}` - invite message, e.g., <p>Personal note: {$invite_message}</p>
- `{$inviter_userId}` - inviter user id, e.g., <p>Inviter user id: {$inviter_userId}</p>
- `{$inviter_name}` - inviter name, e.g., <p>Invited by: {$inviter_name}</p>
- `{$inviter_email}` - inviter e-mail, e.g., <p>Inviter e-mail: {$inviter_email}</p>
- `{$inviter_message}` - inviter message, e.g., <p>Inviter message: {$inviter_message}</p>

The variables can be used in text paragraphs, subject of an e-mail, headers and in link attributes for info or button nodes. There is a easy guide showing examples in the mail editor as shown in the following image:


In the next chapter a walk through of Rules and how to create / match them with e-mails will be shown.

#### Next

- [Create Rule](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-rule)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-mail>*

---

## Create Rule

### Creating a new rule

In this chapter we will look at the xml data model of rules and how we can create and combine a rule with an e-mail. A rule is simply an action as a response to an event or filter (cron job). The rule is linking the e-mail that should be sent out with either an event or after a time span from an event set by the CRM system.

An example of event that triggers the e-mail to be sent is:

- End user triggers that he or she wants multi factor authentication for their account.

This event in the system then triggers the e-mail system to check if there is any rule around the event and if so sends out the defined e-mail to the end user.

Following is the rule xml that gets stored in the Database when creating a rule.

#### Rule xml data example

**Rule XML**

```xml
<?xml version="1.0" encoding="utf-8"?>
<rule name="test.xml" active="false" created="2026/03/09" updated="2026/03/09">
  <event type="cancel"/>
  <action type="null"/>
  <mail name="cancel subscription"/>
</rule>
```

### Element: rule

The root element is `rule`. The following attributes needs to be defined on the root mail node.

#### Attributes

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | Unique rule identifier | The unique name of the rule. |
| `created` | string | Created date and time | Created date and time. |
| `updated` | string | Updated date and time | Updated date and time. |

#### Child elements

The following child elements are supported.

- `event` – What event that triggers the rule, events corresponds to requests or events due to some criteria being met.
- `action` – Trigger system actions like generate coupons, codes or simply system information like variables.
- `mail` – Links rule to what e-mail. Only 1 to 1 relation.

### Element: event

Defines what event / api triggers the associated mail.

### Event - API relations

The following event types are possible to choose from and corresponding apis or criteria that triggers the event.

- `signup` - Triggered by createUser
- `share` - Triggered by [invite](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/database)
- `renew` - Triggered by upcoming due date on subscription renewal.
- `subscription` - Triggered by buying subscription. Notifies the end user the subscription started
- `invoice` - Triggered by invoice option as payment option for subscription. Due date of invoice determine when its sent out.
- `changePassword` - Triggered by [changePassword](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/tenant)
- `cancel` - Triggered by [cancelSubscription](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/tenant)
- `deleteUser` - Triggered by deleteUser type set to requestdelete
- `mfa_change` - Triggered by POST action to cbeapi://users/{user_id}/mfa. Changing MFA status for an account.
- `mfa_login` - Triggered by login
- `sendVerificationCode` - Triggered by [sendVerificationCode](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/tenant)
- `inviteAssociate` - Triggered by [inviteAssociate](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/operations/tenant)
- `invoice_reminder` - Triggered by due date of invoice.

#### Next

- [Create Template](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-template)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-rule>*

---

## Create Template

### Creating a new template

In this Section we will look at the customizable layout system of the CRM. Starting with the a simple overview of the building blocks of the xsl / xslt that constitute the layout template xsl.

In the following xsl you can see an `xsl:stylesheet` with an import statement and a template block. Inside the template block is a pure html coded part. The HTML part of this xsl is completely customizable but there is some pointers that needs to be taken.

#### Mail layout xsl

**mail_layout.xsl**

```xml
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">

  <xsl:import href="host://service/data/mail/logic.xslt"/>

  <xsl:template match="crmMessage">

    <html xml:lang="en" lang="en">
      <head>
        <title>
          <xsl:value-of select="mail/subject"/>
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="Basic email rendering template for CloudBackend users." />
      </head>
      <style type="text/css">
         span.placeholder {
            color: #3086c7;
            padding: 0.2rem;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fafafa;
          }

          .logo-light { display: none; }

          @media (prefers-color-scheme: dark) {
            .logo-light { display: none !important; }
            .logo-dark  { display: block !important; }
          }
      </style>
      <body style="margin: 0px; padding: 0px;" bgcolor="#ffffff">
        <table height="100%" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align:center;">
              <xsl:text>
              </xsl:text>
            </td>
          </tr>
          <xsl:text>
          </xsl:text>
          <tr>
            <td valign="top" align="center" style="padding: 20px; padding-left: 44px; padding-right: 44px;">
              <div style="width:680px;">
                <xsl:text>
                </xsl:text>
                <table border="0" width="100%" cellspacing="0" cellpadding="0">
                  <!-- Top: Logo -->
                  <xsl:if test="crm/link/text() != ''">
                    <tr>
                      <td align="center" colspan="3" style="border-bottom:1px solid #ccc; padding:10px 0;">
                        <xsl:if test="crm/logo/text() != ''">
                          <a href="{crm/link}" target="_blank">
                            <img border="0" width="150" height="35" class="logo-light" style="display:block; max-width:150px;" alt="Logo" src="{crm/logo}" />
                          </a>
                        </xsl:if>
                        <xsl:if test="crm/invlogo/text() != ''">
                          <a href="{crm/link}" target="_blank">
                            <img border="0" width="150" height="35" class="logo-dark" style="display:none; max-width:150px;" alt="Logo" src="{crm/invlogo}" />
                          </a>
                        </xsl:if>
                      </td>
                    </tr>
                  </xsl:if>
                  <!-- Main content row -->
                  <tr>
                    <td valign="top" align="center" style="padding:0; font-size:22px; font-family:arial, sans-serif; color:#000000;">
                      <xsl:apply-templates select="mail/body"/>
                    </td>
                  </tr>
                  <xsl:if test="crm/box[@use = 'true']">
                    <tr>
                      <td colspan="2" align="center" style="background:#f3f3f3; padding:15px;">
                        <div style="font-size:22px; color:#408be7; margin-bottom:10px; font-weight:bold;">
                          <xsl:value-of select="crm/box/@subject"/>
                        </div>
                        <div style="color:#333; line-height:1.5; font-size:14px;">
                          <xsl:value-of select="crm/box"/>
                        </div>
                      </td>
                    </tr>
                  </xsl:if>
                  <!-- Social links -->
                  <xsl:if test="crm/links/*/text() != ''">
                    <tr>
                      <td colspan="3" style="padding:20px 0; text-align:center; border-top:1px solid #eee;">
                      <xsl:if test="crm/links/twitter != ''">
                        <a href="{crm/links/twitter}" target="_blank" style="margin:0 10px; text-decoration:none; color:#1DA1F2; font-size:12px;">X / Twitter</a>
                      </xsl:if>
                      <xsl:if test="crm/links/linkedin != ''">
                        <a href="{crm/links/linkedin}" target="_blank" style="margin:0 10px; text-decoration:none; color:#0077B5; font-size:12px;">LinkedIn</a>
                      </xsl:if>
                      <xsl:if test="crm/links/facebook != ''">
                        <a href="{crm/links/facebook}" target="_blank" style="margin:0 10px; text-decoration:none; color:#1877F2; font-size:12px;">Facebook</a>
                      </xsl:if>
                      <xsl:if test="crm/links/blog != ''">
                        <a href="{crm/links/blog}" target="_blank" style="margin:0 10px; text-decoration:none; color:#333; font-size:12px;">Blog</a>
                      </xsl:if>
                      </td>
                    </tr>
                  </xsl:if>
                  <!-- Footer -->
                  <xsl:if test="crm/copyright/text() != ''">
                    <tr>
                      <td colspan="3" style="padding-top:15px; font-size:10px; color:#999; border-top:1px solid #eee; text-align:center;">
  ©                      <xsl:value-of select="crm/copyright"/>
                      </td>
                    </tr>
                  </xsl:if>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

### Element: xsl:template match="crmMessage"

Element `xsl:template match="crmMessage"` is necessary to include in your customizable xsl. This is due to the data model of the combined mail data and settings.xml. In the next chapter we will discuss how to modify placeholder values in the settings.xml, but for now all you need to know is that placeholder values exists and how they are used in the template. The template is set on a render component and the data that it is bound to is the current mail and the chosen layout. The complete data bound looks as follows:

> **Note:**
>
> **mail_layout.xsl**
>
> ```xml
> <xsl:import href="host://service/data/mail/logic.xslt"/>
> ```
>
> The import statement also needs to be included in the layout since it handles logic for headers, variables, info nodes, etc.

#### crmMessage

**mail_layout.xsl**

```xml
<crmMessage xlink:loaded="host://service/processes/crm.xml">
  <mail name="Forget user mail" group="must-email" created="2020-10-25T14:19:33Z" updated="2020-12-25T14:19:33Z" deleted="1970-01-01T00:00:00Z">
    <description/>
    <sender/>
    <senderName/>
    <replyTo/>
    <replyToName/>
    <subject>Delete {$tenantdisplay} user {$action:deleteUser/deleteUserCode/@user}</subject>
    <body>
      <h1>Delete User Requested</h1>
      <p>{$tenantdisplay} has received a request to delete your user and all data.
         If you have not requested this, safely ignore this email and nothing will happen.
      </p>
      <info title="Requested for username">{$username}</info>
      <p>The following link will allow you to delete your User:</p>
      <info title="Link" link="https://{$tenant}.db.cloudbackend.com/?action=forgetuser&username={$username}&code={$action:deleteUser/deleteUserCode/@code}"/>
    </body>
  </mail>
  <crm template="tenant://CRM/Templates/mail_layout.xsl" config_host="false()" sender="" replyTo="">
    <link/>
    <logo/>
    <invlogo/>
    <box use="false" subject=""/>
    <copyright/>
    <links>
      <twitter/>
      <linkedin/>
      <facebook/>
      <blog/>
    </links>
  </crm>
 </crmMessage>
```

### Element: crm

Element `crm` is a sub node of crmMessage as seen in the xml above. Child nodes like link, logo, invlogo, ... ,links/blog are placeholders and can be used in the layout HTML part. In the next chapter a run through on how to modify these values will be done, but for template creation you can view these as placeholder values for href:s, that points to external resources like banners and links, and text areas with information text. The following list explains what each child node is used for:

- `link` - link is a link to company website that should be embedded in the logo.
- `logo` - logo is the company logo / banner that you include in the e-mail.
- `invlogo` - invlogo is the inverted logo / banner.
- `box/@use` - If true it adds a grey div / box.
- `box/@subject` - Header with your text as subject.
- `box` - Contents to your header in the grey box, (text).
- `copyright` - Include copyright text.
- `links` - Root node of one or more links to company pages on social media.
- `links/twitter` - Link to company Twitter / X page.
- `links/linkedin` - Link to company Linkedin page.
- `links/facebook` - Link to company Facebook page.
- `links/blog` - Link to company blog page.

> **Note:** All logo resources needs to be in the png format, due to how e-mail clients work. Feel free to include any or none of the placeholders and check the results in the mail tab.

#### Advanced Users

For advanced users used to xslt the whole layout with how you want headers buttons, links and info nodes are completely customizable. what you need to know is how the message is structured before its sent out. In the database tab you will need to go to the path Settings/EmailTemplates/{group}/html and modify the main.xslt. This is the final xslt that is read before sending out the e-mail. {group} in this case is the e-mail group. you can have custom layouts for each e-mail group you have created. To use one default template for all your e-mails the path is Settings/EmailTemplate/_default/html. The main xslt can not be visualized at the moment.

The following is the xml data that the main.xslt reads before sending out the e-mail:

#### Final message form before send out.

**email**

```xml
<event version="1.0">
  <sender>
    <user id='' memberId='' groupId='' name='' displayName=''/>
  </sender>
  <receiver>
    <user id='' memberId='' groupId='' email='' name='' displayName=''/>
  </receiver>
  <id></id>
  <thread></thread>
  <type>emailMessage</type>
  <visibility>private</visibility>
  <time></time>
  <data>
    <emailMessage template="main.xslt" template_plain="main.xslt">
      <type>general</type>
      <receiver userId='' username=''>some_email@company.com</receiver>
      <signupSourceId>1</signupSourceId>
      <locale>en_US</locale>
      <group>welcome</group>
      <subject>Welcome to Company</subject>
      <cc></cc>
      <bcc></bcc>
      <body>
        <h1></h1>
        <p></p>
        <info align="left" title="Username">{$username}</info>
        <info align="left" title="Email">{$email}</info>
        <info align="left" title="Profile" link="https://someLink"/>
        <p>Some text</p>
        <info title="Link" link="https://someLink"/>
        <p>Some more text.</p>
        <button link="https://someLink" caption="Follow" title="Follow">Follow</button>
      </body>
    </emailMessage>
  </data>
  <tenantId></tenantId>
</event>
```

In the system what is marked as {$variable} in the xml above is substituted for actual data values in this final form. you can use all {$} variables and not have to create any translations for it in your custom xslt. However regarding [`button`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/reference/components/button), `info`, `h1`, `p`, etc you need to make your own xslt translations with templates for the e-mail to understand how to format it.

#### Next

- [Add Banners and Settings](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/add-settings)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-template>*

---

## Deploy Emails

### Deploy Emails

The Final step when your mail, rule, template and settings are done is to simply deploy the state.To trigger deploy click the deploy button under either rules tab or mail tab. The deploy will save the settings in the cloud platform and your template will be adjusted and placeholder values will be fixed. The following is the deployment xml with rules and e-mails attached to them:

#### deployment.xml

**deployment.xml**

```xml
<rules version="1.0" created="2026/01/14">
 <rule created="2022-09-25T14:19:34Z" updated="2022-09-27T14:19:34Z">
   <event type="changePassword"/>
   <action name="changePassword"/>
   <mail name="Change password mail"/>
 </rule>
 <rule created="2020-10-25T14:19:34Z" updated="2020-12-25T14:20:34Z">
   <event type="deleteUser"/>
   <action name="deleteUser"/>
   <mail name="Forget user mail"/>
 </rule>
 <rule created="2025-03-24T08:16:58Z" updated="2025-03-24T08:16:58Z">
   <event type="mfa_change"/>
   <action name="mfa"/>
   <mail name="Change MFA method email"/>
 </rule>
 <rule created="2025-03-24T08:16:58Z" updated="2025-03-24T08:16:58Z">
   <event type="mfa_login"/>
   <action name="mfa"/>
   <mail name="MFA login code email"/>
 </rule>
 <mail name="Change password mail" group="welcome" created="2020-10-25T14:19:33Z" updated="2020-12-25T14:19:33Z" deleted="1970-01-01T00:00:00Z">
   <description/>
   <sender>no-reply@cloudbackend.com</sender>
   <senderName/>
   <replyTo>no-reply@cloudbackend.com</replyTo>
   <replyToName/>
   <subject>{$tenantdisplay} Password Change</subject>
   <body>
     <h1>Password Change Requested</h1>
     <p>{$tenantdisplay} has received a request to change your password.
         If you have not requested this, safely ignore this email and nothing will happen.
     </p>
     <info title="Requested for username">{$username}</info>
     <p>The following link is valid for 24 hours and will allow you to set a new password:
     </p>
     <info title="Link" link="https://{$tenant}.db.cloudbackend.com/?u={$username}&c={$action:changePassword/changePasswordCode/@code}"/>
   </body>
 </mail>
 <mail name="Forget user mail" group="welcome" created="2020-10-25T14:19:33Z" updated="2020-12-25T14:19:33Z" deleted="1970-01-01T00:00:00Z">
   <description/>
   <sender>no-reply@cloudbackend.com</sender>
   <senderName/>
   <replyTo>no-reply@cloudbackend.com</replyTo>
   <replyToName/>
   <subject>Delete {$tenantdisplay} user {$action:deleteUser/deleteUserCode/@user}</subject>
   <body>
     <h1>Delete User Requested</h1>
     <p>{$tenantdisplay} has received a request to delete your user and all data.
               If you have not requested this, safely ignore this
               email and nothing will happen.
     </p>
     <info title="Requested for username">{$username}</info>
     <info title="User">{$action:deleteUser/deleteUserCode/@user}</info>
     <p>The following link will allow you to delete your User:</p>
     <info title="Link" link="https://{$tenant}.db.cloudbackend.com/?action=forgetuser&username={$username}&code={$action:deleteUser/deleteUserCode/@code}"/>
   </body>
 </mail>
 <mail name="Change MFA method email" group="must-email" created="2025-03-24T08:16:57Z" updated="2025-03-24T08:16:57Z" deleted="1970-01-01T00:00:00Z">
   <description/>
   <sender>no-reply@cloudbackend.com</sender>
   <senderName/>
   <replyTo>no-reply@cloudbackend.com</replyTo>
   <replyToName/>
   <subject>Request to change two-factor authentication method</subject>
   <body>
     <h1>New two-factor authentication code</h1>
     <p>Use this code to change two-factor authentication.</p>
     <info title="Username">{$username}</info>
     <info title="Code">{$action:mfa/code}</info>
   </body>
 </mail>
 <mail name="MFA login code email" group="must-email" created="2025-03-24T08:16:57Z" updated="2025-03-24T08:16:57Z" deleted="1970-01-01T00:00:00Z">
   <description/>
   <sender>no-reply@cloudbackend.com</sender>
   <senderName/>
   <replyTo>no-reply@cloudbackend.com</replyTo>
   <replyToName/>
   <subject>New two-factor authentication login code</subject>
   <body>
     <h1>New two-factor authentication login code</h1>
     <p>Two-factor authentication is enabled and a code is required to login for enhanced security.
     </p>
     <info title="Username">{$username}</info>
     <info title="Login code">{$action:mfa/code}</info>
   </body>
 </mail>
</rules>
```

When done you will now have e-mails and rules in place for events in the system.

#### Next

- [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/deploy-emails>*

---

## Getting started

### Getting Started

When getting started with the CRM system you should be logged in to the at least once with the owner of your tenant. The owner account is the only account that can setup CloudBackend as a relay host for your e-mail service provider. When clicking on the CRM tab on the left sidebar for the first time you will be prompted with a question as the picture below:


If you accept you will get standard e-mails to be setup for you that are crucial in some cases. E.g., the forget user e-mail handles the e-mail that creates the forget/delete user code necessary for end users requesting to remove themselves from the tenants platform. We strongly suggest that tenants accept and let our system at least create these e-mails for you together with a default template.

Once the standard e-mails are configured together with rules, you can modify the text of the e-mails, potential links to use instead etc. When you as a tenant owner feel satisfied with the contents of your standard e-mails It is time to deploy, but before being able to deploy you need to configure CloudBackend as the relay host in relation to your e-mail provider. If not set up, deploy will show the following warning:


To set the host click host button and configure your relay host information, examples will follow.

> **Note:** To set host you need to be logged in as owner.


As an example using `sendgrid` as e-mail provider this would look like this:



> **Note:** Search your provider + set relay host or smtp settings, to find out what configuration options you need to set.

Now you have added all settings to be able to deploy. Once you have deploy e-mails with its rules will be active and end users will receive e-mails from your company e-mail.

#### Next

- [Create Email](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/create-mail)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/crm/getting-started>*

---
