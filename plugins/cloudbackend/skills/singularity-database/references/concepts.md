# Singularity database — concepts

The building blocks of the Singularity database as published in the CloudBackend documentation: what each one is, how it relates to the others, and how to get started.

26 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [The Singularity](#the-singularity)
- [Get to know](#get-to-know)
- [Choosing the right SDK](#choosing-the-right-sdk)
- [Concepts](#concepts)
- [ACL](#acl)
- [Container](#container)
- [Database](#database)
- [Datatype](#datatype)
- [Group](#group)
- [Identity](#identity)
- [Item](#item)
- [Key/Value](#key-value)
- [Object](#object)
- [Publish and Subscribe](#publish-and-subscribe)
- [Role](#role)
- [Sharing](#sharing)
- [Stream](#stream)
- [Tenant](#tenant)
- [Webhook](#webhook)
- [Default databases](#default-databases)
- [Designing the data model](#designing-the-data-model)
- [Getting started](#getting-started)
- [Onboarding](#onboarding)
- [Singularity Database](#singularity-database)
- [The SDKs](#the-sdks)
- [What kind of database?](#what-kind-of-database)

## The Singularity

- **[CloudBackend Operations Platform](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview)** — The tools within the Singularity Database to manage the owner account, configure the database, import data, query and view data, and more. *(Data Modeling & Managing Data)*

- **SDK Mobile, IoT & Cloud** — SDK library for Mobile & IoT development with cloud database connection from local programs, with code examples and tutorials. *(C++, Java, Android and iOS)*

- **SDK Web UI** — For developing web applications in Javascript and HTML with database connection. See code examples and tutorials. *(Javascript and HTML)*

- **[Code Concepts](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/code-concepts)** — See common concepts when building web applications with small useful code snippets. *(Javascript and HTML)*

- **[CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface)** — Test and verification tool to make it easy to see what you have stored in the database. Used for debugging while building apps. *(Test verification tool)*

- **[Help Authoring](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/authoring-help)** — Learn how to author help documentation compatible with the built-in help system. *(Help)*

- **[XML Development](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/xml/xml-development)** — Documentation for all XML related technologies like XML, XPath, XSLT, and XLink that are used by CloudBackend. *(XML)*

### Author and Copyright

The Singularity Database — The Database Platform as a Service (dbPaaS)
for an Accelerated User Experience and Data Mobility — Data in motion & Data at rest.

|  |  |
|---|---|
| Version: 2026-09-30 | Copyright: CloudBackend © 2026 |



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity>*

---

## Get to know

The Singularity Database (dbPaaS) comes with two extensive Software Development Kits (SDK) that allows for the development of applications on web browsers, mobile devices, Kubernetes containers, virtual machines, Windows, Mac, Linux, and IoT/embedded devices. In addition to the two SDKs, the CloudBackend web based Database and CLI provides the ability to define data models, set security policies, and other configuration. It also gives you an overview of the data and the CLI allows you to query and inspect the data in the database. With CloudBackend suite of tools, you can build complete data application solutions that can run within multi-cloud and edge environments, including make web and mobile applications into cached, accelerated device edge experiences.

The Web UI SDK is available in Javascript and the compiled library SDK, which is built in cross-compiling C++, is available with language bindings for Java, Android and Swift with more popular programming languages to be supported in the near future. A version for Objective-C is for example in development.


The CloudBackend SDK includes Smart Sync and automatic network discovery, a state synchronizing service for bi-directional communication (data pumping) between browser, device, and the cloud without the need for building a custom backend API and code on the clients to communicate with the backend API and keep data in sync. This removes a lot of tedious data pumping code from any projects. Thereby the Smart Sync allows you to rapidly build applications on web or devices that utilizes the device as a local cache (device edge), including makes it easy to write off-line first experiences that are able to function even with disruption in connectivity.

The functional components in the CloudBackend SDK, illustrated below, are the building blocks to significantly minimize your client-side development effort.


It provides an object oriented API (set of methods and classes) to be used for all application development and includes network discovery, error handling, and network communication functionality, removing the need to build all the real-time infrastructure yourself.

### The old way


### The new way


### Data in motion

The Singularity Database really excels when data needs to be in motion and seamlessly move across devices, IoT, gateways, edge, and multi-cloud. Use the SDK to query, update, or create data and the Singularity Database automatically handles the transfer of data and makes it available, right where it needs to be, according to your set policies.


### Audience

The audience of this document is anyone interested in building applications that will use the CloudBackend Singularity Database as a data management and acceleration service. It is easy to learn how to create applications leveraging decentralized data and the device edge, especially if you are familiar with any of the programming languages below. All complexities in decentralizing data in the cloud and on the device is abstracted and hidden away by the SDK. This includes the management of the database in the cloud, backend API, code on the clients to call and communicate with the backend API, data and state synchronization, and network discovery. The programming model is based around building applications on top of the SDK, as if the database is the SDK and available on the local client. This is what creates the Singularity, CloudBackend gives you the impression you have a single database, while the data may be distributed and decentralized across the world in reality - non of which you as a developer need to manage or build code for to handle the complexity of.

#### Prerequisites

You will need basic programming knowledge of any of the following:

- Java
- Android
- iOS (Swift)
- C++
- XIOS/3

### What the documentation covers

The following document will give an overview on how to use the SDK and functionality available in the CloudBackend Singularity Database, including examples of how to program the SDK.

The documentation is divided in to sections of relevance. Find the main section of interest and then follow the specific topic.

#### Getting started with CloudBackend development

To get access to our Software Development kit (SDK), please see the guide [Getting started](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know>*

---

## Choosing the right SDK

|  |  |
|---|---|

### Choosing the right SDK

The two available Software Development Kits (SDK) offers an elegant way to develop software that manages its data through the Singularity Database provided as a service by CloudBackend (dbPaaS). The languages supported by the SDK are continuously expanded. There are two different SDKs; SDK Mobile & IoT and SDK Web UI (XIOS/3). All SDKs for specific programming languages are derived from the SDK Mobile & IoT, which is written in compiled C++. Additional languages are support through the use of language bindings. This ensures that the SDK is highly efficient and uses minimal resources, regardless of the used programming language.

- C++
- Java
- Android
- iOS (Swift)
- Python (under development)
- Javascript & HTML (XIOS/3)

### Language specific notes

### Javascript & HTML (XIOS/3)

The SDK for Web UI (XIOS/3) is a separate SDK entirely written in Javascript by the XIOS/3 company with full CloudBackend compatibility. XIOS/3 makes it easy to build rich user interfaces. It manages all data in relation to CloudBackend and in addition it is an entire Edge Application Platform that enables execution of the web application within the browser (device edge). This enables the creation of applications running within a browser that are as fast as installed software. With the XIOS/3 SDK, you can choose if you only want to use the data connectivity features with CloudBackend or if you want to make use of its excellent capabilities to write applications in it as well.

For more information, please see the Documentation drop down menu at the top, SDK Web UI (XIOS/3). General information is also available at [XIOS/3](https://xios3.com/)

### C++

This is the base of the SDK with all its features. It requires C++ 11 or later version. New features will always first be available in the C++ SDK to later be made available across other languages.

### Java

The Java load out function system.load is built in to the wrappers, so when using the library only make sure that the executable is accessible for java.path. To be able to see / hover over and see doxygen like comments, add the `com.cbe-source.jar` file from the resource folder to your editor.

More details on the SDK Java API can be found in the [Package documentation](https://cloudbackend.com/docs/java/com/cbe/package-summary.html)

The library was wrapped using SWIG (Simplified Wrapper and Interface Generator) v.4.0.1 For more info on SWIG visit swig.org or their github repo. Regarding SWIG there are some std::map:s in C++ that has been wrapped to com.cbe classes. This is because there is no exact equivalent in Java for some of the std types. However, since these classes are extensions to AbstractMap and AbstractList using Map or List or AbstractMap or AbstractList should be fine. See the Simple example where an AbstractList<Item> is declared instead of a Items_vec, which is a wrapped c++ std::vector, and the return type of getItemsSnapshot().

However, it is not safe to say that this always works, e.g.:

**SWIG related**

```
container.createObject(String name, CreateObjectDelegatePtr delegate, Obj_KV_Map keyValues)
```

CreateObject relies in C++ on a std::map<std::string, std::pair<std::string, bool>>. This kind of tuple does not have any conversion through SWIG to Java other than breaking up the parts as Obj_KV_Map(String key, Obj_VI_Pair value) where Obj_VI_Pair(String metaValue, boolean Indexed) is the value. This structure might not be convertible to any normal Java structure. This will be tested in the future. Therefore some CloudBackend type classes are ok to switch out for Java types while some might not.

### Android

See the Java implementation, Android uses the same SDK.

### iOS

This is the SDK for your iOS applications written in the Swift language.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/choosing-the-right-sdk>*

---

## Concepts

Below are some specific terms that are fundamental for the Singularity Database. The building blocks are used to architect the data model, database schema, and security policies for the database. Used in combination, they become super powerful and provide a very capable data model for any project.

### Vocabulary

For an easy overview these terms are listed as separate sections accessible through the menu to the left or through the links below.

- [Tenant](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/tenant): The entity that owns all databases and identities.
- [Group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/group): A collection of members with its own database.
- [Role](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/role): An access right that can be given to an identity, container, or object.
- [Identity](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/identity): Members of the tenant, which can be an user, end-user, IoT sensor, or backend API.
- [Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/database): Keeps a collection of containers and/or objects.
- [Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/container): A collection of containers and/or objects.
- [Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/object): Similar to a row in a table, keeps key/value data and streams.
- [Item](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/item): Name used to denote both a container or object in a database result.
- [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/acl): Access Control List that governs permissions in the database.
- [Stream](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/stream): Binary or document based stream that make up an object.
- [Key/Value](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/key-value): Meta-data for objects or containers.
- [Datatype (Schema)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/datatype): Controls the behavior of objects or defines schema for containers.
- [Sharing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/sharing): Share containers or objects with other identities.
- [Publish and Subscribe](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/publish-and-subscribe): Publish or subscribe to contents outside the database.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts>*

---

## ACL

The Access Control List (ACL) of a container or object contains the Access rights. An ACL may be defined with one entry per Group, Role, or Identity that has been assigned such a right for this particular item.

It has binary representation and the value can be calculated as the sum of:
ACL-change (8) + delete (4) + write (2) + read (1).

An `item` in the data hierarchy will inherit the ACL of its parent, unless it is assigned its own ACL.

`icon://policeman` Each Item needs at least one ACL entry with changeACL permission.

> **Warning:** Limit access rights on group databases like `tenant://`
> as security requires, also down to their sub-containers and even objects, to what is needed for specific users, roles and/or groups.

### Example 1

The group database container e.g., `tenant://userinfo/` could be set up so each Member is allowed to create and update an object but only the Administrator is allowed to delete it.

Give the tenant group read and write access. The Administrator group should have full access.

If the the Member should be able to delete his own information, but nobody else, each user should have explicit delete access on own file. Give the user delete permission on that file.

### Example 2

Each Member should have a container e.g., `tenant://userinfo/NN/` where only the Member and the Administrator are allowed to read its objects but only the Administrator is allowed to delete such objects.

Give the tenant group no access. The Administrator group should have full access.

Give the user read and write permission on that container. Objects created in it will inherit the acl of that container.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/acl>*

---

## Container

A container is the fundamental data structure in CloudBackend. Depending on your use case, a container can act as a "folder" in a file system or as a "table" in a relational database, but in XIOS/3 and CloudBackend, we always refer to them as containers. Traditional folders or tables are purely possible implementations of a container.

A container can hold objects and multiple sub-containers in a hierarchy. The hierarchical capabilities make it good for graf-like scenarios or to emulate a file system.

The container has an owner, which can be an Identity or Group. Access Control Lists (ACL) can be applied to each container and they can also be shared, making it possible for a container within an Identity's Database to be shared to another Identity or to a Group.

Each container can either be generic to accept any type of objects or tied to a specific datatype, which then will enforce which objects that can be stored in the container (set schema). The schema derived from the datatype will then make the container similar to a table with set columns, as the columns will be the predefined key/values of the datatype.

Security is defined by its ACL, and the permission can be adjusted for which identities, roles or groups may access it.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/container>*

---

## Database

### Private data

The Singularity Database is able to keep multiple databases for each tenant. The tenant group itself has got a home database for the tenant for private tenant data as well as group data common to its identities (users).

### Group data

Each identity or group may also have their own databases. This makes is possible to separate ownership of data in multiple levels, which further can be refined by security policies using ACL and sharing. Good practice and a good way of ensuring compliance with local data regulations is thereby to store data that only relates to a specific identity within the identities private database(s).

### Data structure

Please note that it means that when setting up a new identity account (user) with the SDK, you may have to create the initial set of containers and objects needed for your application to work.

While developing setting up the container structure can be done using the Database Explorer or CLI in the database, but when going into production, making the initial setup of an identity should be performed by code on top of the SDK.

Each database has a quota that defines the usable storage size.

Security is defined by its ACL, and the permission can be adjusted for which identities, roles or groups may access it.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/database>*

---

## Datatype

Datatypes makes the database understand what kind of objects it is storing and also allows containers to be tied to a specific datatype (schema) that defines its columns (implied from the defined key/values of the datatype, where each key becomes a column).

Datatypes can be defined that automatically extracts key/values from XML documents stored as objects. Please see datatype for more information. The database also has built in support for many common binary types like images, movies, mp3, video, office documents, and more. As long as these datatypes are properly defined, the database will automatically extract key/values from them when stored. Automatic key/value extraction for XML documents is done by defining xpath expression (W3C standard) that points into the XML document attached as the first stream to the object. The data that the xpath points to will be stored and indexed as the value for the specified key.

Whenever a container is queried for information, the datatype can define the default key to use for searching for objects. This should be one of the defined indexed key/values of the datatype.

It is possible to define an icon to be associated with the datatype, a name, description, and also how the object should be rendered in container listings for the database explorer and XIOS/3.

Objects are defined as belonging to a specific datatype by its mime-type, root element, and/or XML namespace of the XML document. The Singularity Database comes with a set of pre-defined datatypes for binary objects that can be activated, which will extract things like ID3 tags from mp3 audio files, EXIF information from photos and more.

Use of your own datatypes requires that they are stored in the `tenant://Settings/Datatypes` container.

See also the CloudBackend Operations Platform section on [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/datatypes).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/datatype>*

---

## Group

A Group has a name and a group ID number. It can have one or many databases, sub-groups and members in the form of identities. Groups can be public, hidden or invite only.

The admin of the group decides what type the group should be and also who can become a member. It is possible to query a group of its members and get information like who of its members that are online.

The concept of a group can be applied to organizations, groups in general, data that should be shared across multiple identities and/or groups, sharing data to third parties that gain access through the group, and for graf-like hierarchical purposes.

Each group has an owner and meta-data describing the group. Gaining access to a sub-group first requires that access has been granted to its parent group.

> **Tip:** Identities can assume a new alias (optional) within each group they join, which will then become how they then will be known to other members of the group.

See also the CloudBackend Operations Platform section on [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/group>*

---

## Identity

Identity has an individual ID number, username and password and its own database. The concept of an identity can be applied to users, agents, sensors, devices, vehicles i.e., anything that needs an identity.

The Owner account should only be used for very high level account management like setting up new Identities, upgrading service subscription and support management. It is the only one that can cancel the service.

> **Tip:** Best practice is to create at least one more identity with Administrator role.

A tenant admin is able to create new Identities. New identities are normally created through one of the SDKs, and will allow users to sign-up using any client. They can also be programmatically created via the login page for deployed projects.

The number of identities is limited by the price plan being subscribed to by the owner account.

Each identity can be associated to a price plan in the subscription system that give access to a specific quota for the database or other features that the identity will have access to.

See also the CloudBackend Operations Platform section on [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/identity>*

---

## Item

Item is a common word to describe what is held in a container, i.e. sub-containers and objects.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/item>*

---

## Key/Value

Meta-data are stored as `key/value` pairs and contains information about the object. The key/values hold information about the object, e.g., title name, creation time, and more. Key/values are essential when searching for objects matching a specific key and value. It is considered good practice to always extract information from streams that later should be possible to query by the database.

Tags are simply keys without a value and can be used to have objects in multiple "virtual" containers that are the tags.

Datatypes can be defined that automatically extracts key/values from XML documents stored as objects. Please see `datatype` for more information.

Key/values are commonly used to store sensor reading and IoT data as it makes more sense to store frequent small data in key/values, than creating a stream to store it in. You may define any key/value you like for objects. Please remember to create a datatype for any custom objects with key/values that you create, so the entire system will recognize the object type.

> **Note:** Key/values are also available for containers, but these values are not searchable, i.e. you can not search for a container based on a key/value. The container key/values are available as meta-data to hold useful information about the container like for instance how to visualize the container in the UI, which schema (datatype) that is allowed for objects in the container and so on.

When using containers like a table, the key/values of objects stored in it will become like the columns in the table. It is preferable to define a datatype with these key/values and set the datatype as a schema for the container (similar to defining the schema and columns for a relational table).

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/key-value>*

---

## Object

Each Object has an owner, who may share it with other Identities.

Additional meta data can be associated with each object. It can act as a table row with key/value meta-data as columns or as a BLOB.

The object can have zero or multiple BLOBs (streams), with each stream up to 2GB in size, provided the database storage quota is not exceeded. Streams are typically JSON, XML or binary files e.g., sound, images like jpeg, png etc.

Security is defined by its ACL, and the permission can be adjusted for which identities, roles or groups may access it.


See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/object>*

---

## Publish and Subscribe

Objects or containers may be published for other identities in the database to subscribe to, or for anyone outside the database to view. Access rights to what is published is defined with the publication. Subscription to published data will give updates to any changes done to the data.

The difference of publishing something versus sharing is that by publishing the original container or object ID will not be exposed, it becomes more like a view into a container or object that third parties will have access to.

> **Tip:** By using a published container, an end user without a role can be given access to shared data in a specific group container, as they will not by default have access to group databases like `tenant://`.

Publishing will override any ACL defined for the container or object and will be subject to the read/write/edit rights associated with the publication.

> **Note:** Access create, receive or update can not be set in combination with visibility public.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/publish-and-subscribe>*

---

## Role

The Administrator role has the ability to define roles and additional roles can be defined for every group or sub-group.

Roles can be applied to a set of identities or groups through the ACL system to give access to containers or objects. Roles are thereby always owned and relative to each group.

The Developer role is intended for the software coders involved in a project.

> **Tip:** To login to the tool the user needs a role with at least ACL read access to `Identities` and to see the identities' roles needs at least ACL read access to `Roles`.

If needed separate roles can also be created for others, e.g., testers, support and people managing the service.

> **Note:** End users will normally not be assigned to any role, but will use a dedicated deployed application.
> End users without a role will not be able to login to the developer environment.

See also the CloudBackend Operations Platform section on [Identities](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/identities).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/role>*

---

## Sharing

Objects or containers belonging to an identity or group may be shared with other Identities, Roles, or Groups as defined in the ACL.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/sharing>*

---

## Stream

There may be zero, one or multiple Streams that constitutes documents or binary files (BLOB) attached to an Object.

Each stream keeps track of its mime-type, size, date added, but also the latest updated date. Any object can be queried for its streams.

Streams can be used to split large movies into chunks, keep multiple versions of an image in different resolutions, or attach files like a xml, text, pdf, e-mail etc. Streams may also be streamed to other devices as the name applies. They may have a maximum size of 2 GB each, provided the total database storage quota is not exceeded.

An object may have unlimited number of streams. The first stream of an object is always considered to be the core representation of the object, and any additional are typically attachments or thumbnails.

If the first stream is of type XML, the transaction engine may be used to work with delta changes on its parent object, which allows collaborative applications with eventual consistency to be built - coordinating edits to the same object across multiple identities.

If an object is shared, deleted, renamed, or moved to another container, all streams will follow with it.

E.g., an e-mail message would be an object that can consist of a body message as the first stream and the attachments would be the following following streams.

See also the CloudBackend Operations Platform section on [Database Explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/database-explorer).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/stream>*

---

## Tenant

Tenant is the core group for building a project on the Singularity Database. It is created together with the `Owner` account.

The Owner account should only be used for high level management of the subscription. The e-mail address is used for sign-up and password reset.

The tenant Owner and Administrator roles are able to create new Identities through the database for developing and testing purposes. New identities are normally created through one of the SDKs, and allow users to sign-up using any client.

> **Tip:** An administrator account should be added for day to day management of the tenant group.

The admin is also able to see statistics and inspect shared data for the tenant in the tenant group. The tenant group have the admin role defined from the start. New identities created will have a very limited default privileges from the start.

`icon://policeman` Additional roles may be configured for other purposes and applied to users or managers.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/tenant>*

---

## Webhook


A Webhook is a secure port for providing outside data a route into the database.

By defining a Webhook you can allow external services, like computers, apps, SaaS and IoT appliances, using their built-in tools like `curl` or `python`, to feed data directly into a specific CloudBackend container.

Data can be common textual format e.g., xml, txt, svg, json, csv etc.; as well as binary e.g., jpeg, mp3, mp4, pdf, png etc.

Those data can then be used by your developed apps.

See also the CloudBackend Operations Platform section on [Webhooks](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/database-overview/webhooks).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/concepts/webhook>*

---

## Default databases

Your account is set up with two primary databases:

- home - individual database - suitable for personal data
- tenant - shared group database - suitable for group data

Each user's or group's database size indicates the object storage used for that user. The total object storage is shown under the tenant.

Additionally CloudBackend stores data around users, objects, payments and other information in a database. This is indicated by the database size under the tenant.

The maximum storage quota limits are set based on the pricing plan and can be upgraded. Default quotas are:

- home - 100 MB
- tenant - 100 MB

A database can be referenced in a path statement with the suffix :// E.g., `home://containerA/object1` and `tenant://containerZ/object99`

It is easy to inspect your databases, see examples below:

### Graphical interface

[Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity) Explorer. tool in the left panel. Click on `home` then `tenant`.

### Command line interface

[CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity) Command Line Interface tool in the left panel.

**Type commands**

```sh
databases
pwd
use tenant
ls
```


### Temporary local text data

There is a local database in the browser for storing temporary text files. Using the `local://` saves you from transferring temporary and local data over the internet to the cloud service. local:// can be used in Web UI process code and is visible in the CLI, but not in the cloud tools like Database Explorer.

> **Note:** The data in local:// should always be deleted when no longer needed, either via added process code or manually via the CLI.

**Example commands**

```sh
databases
use local
ls
rm mytempdata.xml
```

### Overview

Click on Documentation in the left menu to learn more.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/default-databases>*

---

## Designing the data model

One of the most important features of the CloudBackend Database is its capability to work with designing a data model for the decentralized database. The data model is replicated across the entire Global Data Network and made available through the SDK. At its core, the data model provides the security for each tenant, enabling the tenant to have identities, to have central information for the tenant service, information shared by its users to the service or third parties, and information shared across users. It also defines the objects, the meta-data, the mime types and other things related to the behavior of the tenant database. Anyone familiar with defining a database schema, especially for object-oriented databases, will feel familiar with configuring the data model.


The data model is closely connected with identities such as users and groups, which means that user accounts and authentication for the tenant service is built into CloudBackend. One of the first things to figure out is therefore which identities the service needs, should any of them belong to a group? What data should the different identities and groups carry? What is common service data used to run the service as opposed to data belonging to identities or groups? Identities, groups, or the tenant can own data. It can also be shared across any of them with full Access Control List (ACL) - determining read / write / delete permissions. If data is collected by identities of a tenant and the data needs to be aggregated and accessed by a third party, the data can be shared to a group, which then the third party (as an identity) is given access to.

The following primitives are available to work with when modeling:

- Objects can have streams (0 .. n) and key/value meta-data associated with them
- Objects have an owner in the form of an identity or group
- Data can belong to tenants, groups, roles and identities
- Data can be shared, sharded, or distributed across all the above
- Containers store objects and can also contain containers - creating a hierarchical graph structure
- Groups have an owner, have member identities, can contain containers and sub-groups as graphs
- A container belongs to an identity or group
- Access rights to data such as objects, containers and key/value meta-data is managed through ACL
- Streams are BLOBs of up to 2 GB or documents like JSON and XML (controlled by mime type)
- Mime types are registered in order to define automatic meta-data extraction policies
- Delta transactional changes are supported on streams of type JSON and XML
- Synchronization in SDK and dbPaaS react to changes on queries, containers, objects, meta-data and streams


The database allows monitoring of data consumption by group and users, as well as setting quotas for identities and groups. It is possible to define roles for the tenant account and for any of the groups created.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/designing-the-data-model>*

---

## Getting started

### Overview

To facilitate working with CloudBackend we provide several tools:

- Singularity Database - The browser based graphical user interface (UI) of the CloudBackend service.
- CLI - A testing tool to make it easy to see what you have stored in your test identity (available within the UI).
- SDK Web UI (XIOS/3) - for building web-based applications (Javascript and HTML).
- SDK Mobile & IoT - for building native applications (C++, Java, Android and Swift)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started>*

---

## Onboarding

### Onboarding the Singularity Database

You will need to create a Tenant `Owner` account in order to access the database. See [Onboarding](https://db.cloudbackend.com/).

The tenant is managed using an `Administrator` identity (administrator account), which means that you will also need to create the identity with the `Administrator` role.

Once you have the admin identity and tenant setup, it is recommended to create a `Developer` user identity to login to when developing and testing applications that you write for the database. The Developer identity database will then hold all the test data, instead of the tenant admin identity which is recommended to be kept clean during development.

Additional identities for developing and testing is created using the tenant admin identity. The SDK can then be used to create identities (user accounts) for the application or service you are building, to enable self onboarding for the users to your service or app.

Log in with username and password.

- db.cloudbackend.com : for sign-up, activate and administer the owner account.
- tenantname.db.cloudbackend.com : for all other identities of this tenant, with a role with sufficient acl.




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started/onboarding>*

---

## Singularity Database

### CloudBackend

You need an identity (user account) to login to CloudBackend where you can manage the databases (the logged in identities private database and the common shared database for tenant), manage identities, define policies and perform administrative tasks using the CLI. The tenant database is intended to hold settings and common shared data that all identities of the database should have access to. The private identity database is for data that is personal for each identity. Use the security policies governed by Access Control Lists (ACL) to control who has access to the data in the tenant database. You can also use sharing to share data from an identities private database to another identity or to the tenant database. Advanced functionality like ACL, sharing, and groups are accessed using the CLI or SDK.

The identity's private database is labeled 'home://' and the tenant database is labeled 'tenant://'. Using the CLI you can type cd tenant:// or cd home:// to move between the databases. Additional databases may exists and are viewed with the command 'databases'. Type help in the CLI to see an overview of available commands, the documentation for the CLI is available in the Documentation menu section.

Access the [CloudBackend Database](https://db.cloudbackend.com/) by logging in using your `Owner` account username. For other roles the Owner provides the URL, something like: tenantname.db.cloudbackend.com


You will see the options on the left-hand side panel, e.g.:

- Home - the landing page.
- Account - shows information about your identity.
- Projects - for web SDK programs that can access the database.
- Identities - can be used to create a new identity and manage identities.
- Documentation - for Web SDK, Mobile & IoT SDK, CloudBackend, and CLI.
- Datatypes - tailor schemas that can be used to enforce a strict layout on a table.
- Database - explorer used to create, view and manage, organize, and query your data.
- CLI - a command-based tool which is useful during development to manually verify the data that your own code has created. Most functionality of the database is available here.


### Database Explorer

The Database Explorer, which is part of the database, is a visual tool to query and organize all available databases. Here you will have access both to the tenant database and the identity's database. Right click on Containers or Objects for additional context menus. If menu options like Query or Description is chosen, the visual user interface will automatically formulate the appropriate CLI command to perform the task and take you to the CLI. This is a great way to learn how to use the CLI.

For more information, please see the Documentation drop down menu at the top, here documentation for all parts of the system is available.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started/singularity-database>*

---

## The SDKs

### SDK Web UI

It is easy to start writing web applications for the Singularity Database, check out the documentation and create an application manifest that you then upload into the Projects section of CloudBackend. Double click on the application icon and it will start execute within the database with the same user privileges and access as the currently logged in database user.

If multiple users should access the application, just add additional identities using the admin account for the tenant.

Web applications can also be externally deployed on any web server, for further information, please see the SDK Web UI (XIOS/3) documentation.

### SDK Mobile & IoT

Download the Linux SDK for Mobile & IoT from the [GitHub repository](https://github.com/CloudBackend/SDK_Ubuntu/releases).

It contains packages for Ubuntu Linux on x86 development environments. These include code examples to give you a quick start.

More information in the [SDK releases on GitHub](https://github.com/CloudBackend/SDK_Ubuntu/releases).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/getting-started/the-sdks>*

---

## What kind of database?

### The Singularity Database

CloudBackend is a versatile database delivered as a service, the Singularity Database, that can be configured in many different ways. It is even possible to define a data model that combines some of the features of more than one type of database. The reason for providing all these capabilities is that often a project includes at least two of these database types and in order to have all managed by the service and abstracted by the SDK and Smart Sync, we needed to provide the flexibility to combine all these database types to some extent. Some of these characteristics that can be mimicked, includes a number of features of major database types, e.g.:

- Relational database
- Graph database
- Key/Value database
- Object store
- Object oriented database
- XML repository
- Stream database
- Identity database
- File system


#### Relational database

A Container represents a table and an Object is a record/row. The object ID represents the primary key and key/values are used to hold the column field values for each row. BLOB columns are managed as streams related to the object. This means that Access Control Lists (ACL) can control access to every row in the table. The table itself can also be controlled by ACL, which includes the ability to share a table across identities or groups. Relations to other tables is done using the container ID or even an object ID, which both can be stored in the key/value data for each object.


#### Graph database

The hierarchy of a Graph database is implemented as Containers and Sub-Containers and can be repeated as many times as needed. This can also be achieved with the CloudBackend concept of Groups and Sub-Groups that hold their own databases and containers. Tags and Key/Value pairs is used to label objects.

#### Key/Value database

Key/Value database has features often used in IoT solutions. The meta-data feature can be used to hold Key/Value pairs. When uploading a Stream, the defined datatypes will recognize many of the common meta-types and allow for automatic key/value extraction to be used as meta-data for the stream. Any data that you want to be able to search quickly and have returned in query results should be stored as key/value data, this can for instance be to/from/subject for an e-mail, name of a contact card, invoice number, amount and due date of invoices etc. See the [Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object) section [object data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/object-data) part for a list of mime-types supported.

#### Object store

BLOBs are stored as Streams to Objects and each Stream represents an object in a traditional Object store. When using the database as a document store, unstructured data store, JSON or XML repository, each CloudBackend object will have one stream associated with it, which will represent the document or binary object. For media purposes, multiple streams associated with an object can make up multiple chunks for a movie, different bit-rate qualities for a song, multiple resolutions of a photo. The streams may also be used for complex types like an e-mail, where the body of the e-mail may be the first stream, and any attachments to the e-mail become subsequent streams. Moving an object between different containers means that all streams and key/value data follows the moved object with a single operation.

#### Object oriented database

CloudBackend's combination of hierarchical containers and JSON/XML documents as objects enables representations of internal object/classes/structures in programming, where the XML documents works well to express instances of classes and its member variables. Any object oriented model with classes lends itself to be translated and serialized into a representation of containers and objects with XML.

#### Stream database

The service supports streaming of binary objects represented by data streams that are attached to an object. E.g. one e-mail is represented as an object with meta-data of to/from/cc/subject as key/values, the text body of the e-mail is stored stream 0, and images and files in attachments as stream 1..n. Each stream of the object will have its own size, mime-type etc. Another example is an image, which is represented as an object with stream 0 being original image binary and stream 1, 2, 3 being thumbnails of different resolutions. Moving an object between different containers means that all streams and key/value data follows the moved object with a single operation. When uploading the first Stream, the database will recognize any mime-type or datatype defined in the datatypes configured and if applicable, automatic meta-data extraction into key/values will happen. Automatic meta-data extraction based on datatype will only happen for the first stream, subsequent streams will not overwrite the key/values. Mime-types will be stored as-is for each stream, even if not defined in a specific datatype, these mime-types are stored in the stream objects and not in the key/value meta-data. See the [Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object) section [object data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/object-data) part for a list of mime-types supported.

#### Identity database

The Identity and Group features of CloudBackend is used to authenticate all access to data in the database. Instead of creating your own user table, CloudBackend manages your identities (and users), their personal data, and common data across identities. Each identity holds one or multiple databases, in addition groups and sub-groups can hold one or multiple databases. The database can restrict access to groups for identities and specific identities can be assigned the responsibility to grant access to groups. In addition roles can be used to define generic access to containers and objects and used on Access Control Lists (ACL) for either objects or containers. The identities that are a member of a group can be accessed, identities can also be banned from a group. Groups may also allow any identity to join. CloudBackend works similar to how Identity databases, like LDAP and Active Directory, works.

#### File system and network drives

Databases belonging to an identity or group may be used as virtual hard drives. The containers and objects may be used as folders and documents in the hard drive file system. ACL may be used as permissions on documents, and the properties of documents may be translated into meta-data (key/value) data. This allows one or all of an identity databases to be used as a file system and groups to be used as shared network drives among identities (file servers).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity/get-to-know/what-kind-of-database>*

---
