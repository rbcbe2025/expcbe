# Price plans and payments

Selling subscriptions from a tenant: configuring the payment destination, account types, creating and editing price plans, publishing them to signed-out visitors, starting a checkout from an application, and where purchase confirmations land.

2 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Priceplans in your application](#priceplans-in-your-application)
- [Managing priceplans](#managing-priceplans)

## Priceplans in your application

### Making Price Plans Available for Purchase

In this chapter we describe how to expose your tenant’s price plans to your application users and how to enable purchases using the supported payment flow.

### Making the priceplans available for users

All created price plans are stored in the container `tenant://Settings/Products/Priceplans` within the tenant database. In order for external users to access the priceplans we need to make need to make the container publicly available; which is called to publish a container.

Publishing a container could be done in a few different ways, in this case we want a public, non-password protected publish.

- via the `CLI` through the `publish` command. `publish [containername]`
- via the `Database Explorer` by right clicking the container and press the `publish` option.

Publishing a container makes its metadata publicly accessible, allowing your application to read and display the available price plans.

By publishing a container in this manor, we are now able to `mount` it and access it as non-logged-in users.

**Mounting a container**

```xml
<operation name="database">
  <mount name="priceplans">
    <published name="priceplans" groupId="xxxxxxxxxxx" tenant="yourtenanthere" />
  </mount>
</operation>
```

> **Note:** You can easily get your `groupId` from the CLI command `groups`.
> You can easily get your `tenant` from the identities page.

The mounted container can now be accessed through `priceplans://`.

### Making the priceplans purchaseble

Currently, PayPal is the only supported payment provider. The purchase flow consists of two main steps:

- Create a checkout session to generate the PayPal payment URL
- Redirect the user to the returned URL so they can complete the payment

The examples below show how to initiate the purchase and redirect the user to PayPal.

**Create Checkout Session**

```xml
<operation name="tenant">
  <purchase method="paypal" user-id="BUYER_USER_ID" responseAlias="auth" account-type="Optional" coupon-code="Optional" currency="Optional. Default: EUR.">
    <products>
      <product id="PRODUCT_ID" amount="NUMBER_OF_THIS_PRODUCT" />
      <!--
    One or more products here.

    Note that when it's a subscription, there can only be one product, the subscription itself,
    and it's an error if this API is called with a subscription and any other product.

    product@quantity attribute must be '1' if it's a subscription.

    The id refers to the productId, which can be found in the object’s productId key.
    -->
    </products>
    <billing>
      <!-- if empty, checks /user/country config value, else tries to use user locale (must be 5 chars), and failing that uses "US" -->
      <country>...</country>
      <!-- email is required -->
      <email>...</email>
      <!-- VAT number. If set, name must be set too -->
      <vat>...</vat>
      <name>...</name>
      <!-- Optional -->
      <reference>...</reference>
      <reference2>...</reference2>
      <phone>...</phone>
      <address>...</address>
      <city>...</city>
      <zipCode>...</zipCode>
    </billing>
  </purchase>
</operation>
```

> **Note:** You can inspect a priceplans metadata by running the `meta` command followed by the full path (e.g. `Settings/Products/Priceplans/myPriceplan.cbc`) in the CLI. Alternatively, you can right-click the object in the `Database Explorer` and select `View Metadata`.

**Redirect User to Checkout**

```xml
<alias name="url" value="$auth#/auth/@url" />

<operation name="open" value="{$url}">
  <browser name="Purchase" />
</operation>
```

**Full step example**

```xml
<step id="createPurchaseSession">
  <alias name="priceplan" value="!" />
  <alias name="productId" value="$priceplan#productId" />

  <operation name="tenant">
    <purchase method="paypal" user-id="2" responseAlias="auth">
      <products>
        <product id="{$productId}" amount="1" />
      </products>
      <billing>
        <email>buyer@email.com</email>
        <country>SE</country>
      </billing>
    </purchase>
  </operation>

  <alias name="url" value="$auth#/auth/@url" />
  <operation name="open" value="{$url}">
    <browser name="Purchase" />
  </operation>
</step>
```

### Purchase confirmation

After a user completes a payment, it may take a few minutes before PayPal notifies our system. Once PayPal sends this notification, a file is created in /System/Purchases/ with information about the purchase. If the user later cancels the subscription, a new file will be created in the same folder to reflect the cancellation.

#### Next

- [Statistics](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/statistics)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans-in-your-application>*

---

## Managing priceplans

### Configure Payment

Before you can create any price plans, you must first configure a payment destination. This is done by clicking the **Configure Payment** button, which opens a panel where you can select the payment service to use (currently only PayPal is supported) and enter the required information. You can change the payment destination at any time by deleting the existing configuration and setting up a new one.


### Manage Account Types

Account types are used to define changes that are applied to an account when a subscription is activated. An account type included in a price plan specifies values such as storage size and cloudos per month, which are applied to the account when the subscription becomes active.

- `Cloudos` – Credits consumed by services within the tenant
- `Size` - Size in bytes of the user's drive

You can manage account types by clicking the **Manage Account Types** button, which opens a panel where you can create new account types or view and delete existing account types for the tenant. The panel also shows which price plans each account type is included in.



> **Note:** Account types that are included in one or more price plans can not be deleted. The account type must first be removed from all associated price plans.

### Create a price plan

Click **Add Plan** to create a new price plan for your tenant. The list below explains which information is required and which fields are optional.


Priceplan attributes:

- **Required**
- `Title` - The name of the price plan shown to end users
- `Subscription interval` - How often the subscription is billed (monthly or yearly)
- `Price` - The cost of the subscription for the selected interval
- `Currency` - The currency used for the subscription price
- **Optional**
- `Main benefit` - The primary value or feature highlighted for the price plan
- `Summary` - A short description of what the price plan includes
- `Account type` - The account type applied when the subscription is activated
- `Included in the price plan` - A list of features included in the subscription

Created price plans are displayed as cards, providing a quick overview of pricing and included features.


### Edit a price plan

To edit an existing price plan, simply select the card representing the plan you want to modify. When a card is selected, an edit panel opens on the right-hand side, where you can update the plans details such as title, summary, main benefit, subscription interval, price, currency, account type, and included features.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/priceplans/priceplans>*

---
