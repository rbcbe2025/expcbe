# XIOS/3 — data: the Data Virtualization Layer and the CloudBackend database

Channels and mounting, datatypes, object properties, managing objects, containers, groups and datatypes from process markup, key/values, searching and the query language.

22 topics from the published XIOS/3 documentation, generated on 2026-11-06. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [CloudBackend Database](#cloudbackend-database)
- [Account](#account)
- [Developer Environment](#developer-environment)
- [Managing Containers](#managing-containers)
- [Managing Datatypes](#managing-datatypes)
- [Performing Actions](#performing-actions)
- [Managing Groups](#managing-groups)
- [Managing Objects](#managing-objects)
- [Overall Structure](#overall-structure)
- [Searching the Database](#searching-the-database)
- [System Permissions](#system-permissions)
- [Tenant](#tenant)
- [Using Key - Value pairs](#using-key-value-pairs)
- [Data Virtualization Layer](#data-virtualization-layer)
- [Datatype Association](#datatype-association)
- [Existing Datatypes](#existing-datatypes)
- [Introduction](#introduction)
- [Mounting a Database](#mounting-a-database)
- [Object Properties](#object-properties)
- [The host Protocol](#the-host-protocol)
- [The xios Protocol](#the-xios-protocol)
- [Query Language](#query-language)

## CloudBackend Database

This section of the documentation contains information about using the CloudBackend Singularity Database that is available through the Data Virtualization Layer and the CloudBackend channel communicator.


In the chapter [Overall Structure](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/overall-structure) we explain how the Data Virtualization Layer works and what it consists of.

Managing the Data Virtualization Layer using process markup to handle [Objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects), [Containers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-containers) and [Groups](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-groups) is covered extensively with several examples provided. There is also a section about managing [Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-datatypes), used to associate certain objects to certain applications or data models. The final chapter covers how to perform [searches](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database) in the Data Virtualization Layer.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database>*

---

## Account

All users have access to their own database, which can be explored using the "Database Explorer". This database is referred to as `home://` and acts similar to any other database. It allows you to create, edit and remove objects, containers and shortcuts. This is done either by using default applications or by developing your own applications to handle it.

### User Quota

The quota will depend on which tenant the account belongs to and on which price plan the tenant or user account is on.

### Uploading

When uploading objects to your CloudBackend account and developing applications there are limitations to what is allowed to be uploaded to your CloudBackend account or the account of a group. The size of the object that is to be uploaded can be up to 2 GB per stream, provided it is within the quota. Every object may hold an unlimited number of streams.

There are also limitations to object sizes when uploading objects, which is the same as one stream, 2 GB. It is generally not advised to upload such large files, it is better to break things up into multiple files or many streams that then are attached to the object.

### Downloading

All uploaded objects are available for download. This is done by accessing the object stream directly by providing the URL to the object like such:

- `https://api.cloudbackend.com/v1/documents/container_id/object_id/stream_id`

All documents have [meta data elements](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects) describing their URL, as well as `container_id`, `object_id`, and `stream_id`.

> **Note:** for downloading to work the user must be logged in to the CloudBackend account that has the object. This means that you can not forward this link to other people so that they can download it. Also that there currently is no bandwidth limitations, although CloudBackend reserves the right to impose such limitations when deemed to be necessary.

### Account Actions

Under the tutorials in [User Action Tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/useractions-tutorial) you can read about how to create users, reset passwords and delete users.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/account>*

---

## Developer Environment

CloudBackend comes with a fully integrated SDK for Web UI.

### Theme

CloudBackend has added its own UI default skin, which is specified as `theme="cloudbackend"`.

### Program editor

Development can be done inside the UI via the menu option [Applications](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database) with the `icon://box_new?theme=sparse` Create and `icon://box_edit?theme=sparse` Edit buttons.

### Visual Studio Code™

The extension `CloudBackend for Visual Studio Code` UI coding will provide IntelliSense type code validation for local development with download-upload synchronization with the cloud database for instant code testing.


See also more information in the chapter about [using Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-development/development-tools/using-visual-studio-code).

### Testing application code

Test your application code in a browser where you turn on the browser's Developer Tool (Ctrl+Shift+I) and look in its `Console` for any error messages pertaining to your application.

After any code updates start the retesting by first doing a browser `Empty Cache and Hard Reload` by right-clicking on the browser reload button.

### Verifying data

Check the data architecture and the data content using the [Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database) and the [CLI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database) tools.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/developer-environment>*

---

## Managing Containers

This chapter is intended to provide the reader with the knowledge to manage CloudBackend `containers`. Containers are similar to tables in a relational database, but they may be hierarchical, meaning that a container may contain sub-containers and so forth.

To inspect a `database` open the CLI application and type in the following:

- `xmlpad home://`

> **Note:** All *mounted* `groups` also have a `database`. This database is accessible to all group members. Use ACLs to control who may see its sub-containers.

> **Warning:** The CloudBackend item `container` described here is not the same thing as the XIOS UI *component* [container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/container).

### home://

In the `database` document, there is only one root element, the `db:result` element. Each result element can contain one or several `db:container` or `db:object` elements. If there is sub-containers, the `xlink:href` attribute of a container will provide you with the path to query that container for further results.

Each `db:container` element has an `id` attribute, which is set by the database as a unique ID when the object is created and a `name` attribute which is given to the element when the `db:container` is created.

This result, containers, and objects utilizes the [db namespace](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/db-namespace) and therefore such a namespace declaration must be in any document that handles data from the database.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `id` | numerical | [0...n] | Database ID of container |
| `name` | string | Any string value | Name of the container |
| `view` | string | Any string value | Suggested view to use for rendering a listing of the result |
| `data` | string | JSON | Key/value meta data stored for the database root |
| `schema` | string | Name of a datatype | Name of the datatype that uploading and creation of objects is locked to for root of database |
| `type` | string | Type of result | Indicates if the database result is coming from a database search query or from listing a single container. |
| `xlink:href` | string | path | Specifies the absolute path to the container |

*(tested)*

```xml
<?xml version="1.0"?>

<db:result xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:db="https://cloudbackend.com/db.xsd"
  id="56295858899" xlink:actuate="onRequest" xlink:href="home://">
  <db:container id="592" cid="56295858899" name="Documents" xlink:href="home://Documents"/>
  <db:container id="602" cid="56295858899" name="Applications" xlink:href="home://Applications"/>
</db:result>
```

### Creating containers

Containers are created by calling the create instruction which is part of the database operation.

In our example below we define two aliases. The first, `containerPath`, which references the container we want our new container to be created in. The second alias, `containerName`, contains the name of the container which we wish to create.

**Name Convention**

The following characters are forbidden to use in container names:

- ? / \ ( ) # * : [ ] | % & " ' ! { }

We use the [database operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/database) on the data in the alias `containerPath` to create one `db:container` within the database root. The name of the new container will be `My New Container` just as we defined it in the alias `containerName`.

**Creating a new container** *(tested, fragment)*

```xml
<alias name="containerPath" value="home://" />
<alias name="containerName" value="My New Container" model="value"/>

<operation name="database" value="{$containerPath}">
  <create type="container" name="{$containerName}" />
</operation>
```

#### Handling container ACL rights

Container ACL rights can be appended to a container when it is created. By adding an `acl` element as a child element of the `db:container` that we are creating, we can define ACL permissions. It is also possible to set permission rights on objects. The `acl` element can have either `user`, `group`, `role` child elements. They have `id`, `read`, `write`, `delete` and `changeACL` attributes which are used to define the permissions.

The code below will give the an identity with the id 20013 full permission for the container as well as changing the container ACL rights (`changeACL` attribute). It also provides read access for all members of the group which has id 410. The members cannot create or delete objects in the container, just read the objects. The `changeACL` attribute for the `group` element is set to 0 which stops the group members from changing the permission rights.

> **Warning:** Each Item needs at least one ACL entry with changeACL permission set to true.

**Adding a container with configured ACL**

```xml
<operation name="change" value="home://">
  <store type="append" select="/db:result">
    <db:container name="data">
      <acl>
        <group id="{$adminGroup}" read="true" write="true" delete="true" changeACL="true"/>
        <group id="{$userGroup}" read="true" write="false" delete="false" changeACL="false"/>
      </acl>
    </db:container>
  </store>
</operation>
```

### Editing containers

There are restrictions to how containers can be edited. The `id` attribute which is used to identify the container and the system attribute (which only exist on certain system containers) can never be changed. Thus the `name` attribute is used to rename containers.

The example below illustrates how to rename a container named `New Container` to `myContainer` by replacing the `name` attribute of the container in the parent containers `db:result`.

**Renaming a container** *(tested, fragment)*

```xml
<alias name="oldName" value="New Container" model="value"/>
<alias name="newName" value="myContainer" model="value"/>

<operation name="change" value="$parentContainer">
  <store type="replaceText" select="/db:result/db:container[@name='{$oldName}']/@name">{$newName}</store>
</operation>
```

### Deleting containers

Containers are deleted by using the database operation with the delete instruction.

The delete instruction requires the absolute path to the container. With the help of the attributes @permanent and @silent, we can control whether the container will be moved into the `Trashcan`, and if we require a system dialog for user confirmation or not.

**Deleting a container** *(tested)*

```xml
<operation name="database" value="home://Documents/">
  <delete permanent="true" silent="false"/>
</operation>
```

### Moving containers

Moving containers is done using the database operation or Database Explorer.

### Copying containers

Copying containers is done using the database operation or Database Explorer.

### Searching containers

The process markup language allows you to search containers by making queries to the database. You can only search in one container at a time. To learn how to make searches in containers read the "[Searching the Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database)" chapter. If you need to search multiple containers, use the Action URL `search()`, please see the reference manual for more information.

### Publishing containers

Publishing containers is a powerful way to provide different data to an application or share data between entities. This can be static data with local editing options, fully editable and readable data and receiving only data. These can be created through the [database explorer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database), via cli commands publish and unpublish or through the publish instruction.

Using the database explorer simply right-click on the container you want to publish then choose "Publish...", this opens a dialog with options for visibility and access rights as well as what you want to name this publication and a password field. A password is required for any published container with more than read-access.

Once created it can be accessed by mounting with the mount instruction.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-containers>*

---

## Managing Datatypes

Datatypes (also called container schemas) are used to associate certain objects to certain applications or data models, with the ability to apply custom look and icon. They also apply to standard applications such as Database Explorer, Document Selector and Object selection dialogs. All datatypes are stored under `tenant://Settings/Datatypes` or when installed together with an application in the identity's settings file.

### Creating datatype

The easy way to create a datatype is to use the `Datatype` section in CloudBackend. It will create the basic datatype document and store it for all identities of the tenant to use under `tenant://Settings/Datatypes`. Any meta-data extraction defined in the datatype will be applied to objects uploaded by any logged in identity.

More information about datatypes and the XML document format of it can be found the CloudBackend Datatypes section help.

We add a `type` element consisting of the two required attributes and two optional attribute, `namespace` and `element`. You can read about their purpose in the "[Datatype Association](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/datatype-association)" section.

We append a `description` child element that is used as a longer description of the datatype and can be used for tool-tips. The `open`, `edit` and `preview` elements are used to define which application should be used to open an object associated with the datatype, which should be used to edit the object (for XML documents the XMLpad editor might be a good choice) and which XSL transformer should be used to preview the object.

The `icon` element contains a URL to the icon, either a SVG using the `icon://` protocol or a png image in 32x32 pixels resolution. Read more about this in the [Existing Datatypes](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/existing-datatypes) section. The `listview` element is used to define additional keywords which might be used to display different listviews depending of the content of this element in Database Explorer.

**Adding a new datatype** *(tested)*

```xml
<operation name="change" value="#TypeManager">
  <store select="/types" type="append">
    <type name="testXML" mime="text/xml" namespace="http://cloudbackend.com/doc/test" element="testElement">
      <description>TEST XML Document</description>
      <open>apps/desktop/noteapp.xml</open>
      <edit>xios/apps/xmlpad/xmlpad.xml</edit>
      <preview></preview>
      <icon>icon://document_tag</icon>
      <listviews></listviews>
    </type>
  </store>
</operation>
```

### Editing datatypes

Using the datatype created above we can again use the [change operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/change) to replace the `text()` node of the `icon` element with a new icon. So instead of `document_xml.png` it will be `document_text.png`.

> **Note:** Note that the Database Explorer might need to be reloaded for the change to take effect.

This is because XSLT documents are not updated unless using the [updateRedraw method](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/methods/updateredraw).

**Changing datatype icon** *(tested)*

```xml
<operation name="change" value="#TypeManager">
  <store select="/types/type[@name='testXML']/icon/text()" type="replaceText">icon://document_txt</store>
</operation>
```

> **Note:** If you change the definition of the datatypes `index key` it will not update the metadata information in the cloud database of an already existing object. Please make any changes within the XML document to be reindexed and save it. The datatype system of the database will then update the indexed `key/value`.

### Deleting datatypes

Deleting datatypes is a matter of deleting the object from `tenant://Settings/Datatypes`, or for identities, the node-set from the `#Settings` XML document using the [change operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/change).

**Deleting the datatype** *(tested)*

```xml
<operation name="change" value="#TypeManager">
  <delete select="/types/type[@name='testXML']"/>
</operation>
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-datatypes>*

---

## Performing Actions

Actions can be performed on objects which are handled by [operation open](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/open). Information regarding which application should be used to perform a specific action on an object is set in the `settings.xml` object.

All datatypes can be either `opened`, `edited` or `previewed`. Due to the fact that XML documents can be defined in many different ways, these actions can be used to sort them out and open different applications depending on the associated datatype.

#### Open

The `open` action handles which application should be used to open for managing the object. It actually works by `mime-type` and `root` element of the object. In order to open an XML document with a specific application the datatype must be defined in `settings.xml`, or else it will open in the default application for XML documents, `XMLpad`.

#### Edit

This option refers to which application should handle the editing process of the object. Many times this would be the same application that is used to open the object. There are however exceptions such as `view` and `process` markup documents or any objects that are meant be edited by an editor, which may be displayed in a completely different way.

#### Preview

This action is also optional and is used as a third option to open an object by only getting a preview of it. The preview element points to a XSL document that performs the preview transformation of the object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-datatypes/performing-actions>*

---

## Managing Groups

This chapter is intended to provide the reader with the knowledge to manage and understand the Groups' functionality offered in CloudBackend.

Groups are a special feature in the CloudBackend database that allows several individuals to share a common database that the membership to the group gives access to. There exists two types of groups, `public` and `private`. Anyone can access the database of a `public` group (if mounted), but to be able to gain access to the database of a `private` group one must join the group and then login to (`mount`) the group. Once the login is completed, the group will appear as a database in the Database Explorer as `groupname://` and it will also be available throughout the system, including the CLI. The CLI command `databases` will show all currently available and mounted databases. The CLI command `mount` enables you to mount a group. Through program code, the `database` operation is used with the `mount` instruction.

Group actions, such as `joining`, `leaving` and `creating` groups are available in the process markup language and the CLI. Application built will utilize the process markup functionality while the CLI has special built in features for managing groups.

### Listing Groups and subGroups

A list of of all available groups (hidden groups are not listed) is available to all users in the CLI.

Listing of groups and databases

- `groups`
- `databases`

### Creating Groups

By creating a group you reserve that specific group name and the creator becomes the owner of the group. The owner has full rights to the group, including creating additional sub-groups and to appoint identities to `Administrators`, which can utilize functionality that ordinary members can not. Please see the `Identities` section of CloudBackend to manage identities and their role access, including creating new roles.

A group can be created in any of the following ways:

**Using process markup**

**ActionURL syntax**

```xios
[database name]://createGroup([groupName], [owner alias])
```

**Example**

```xml
<operation name="open" value="home://createGroup(Jenny's Group , Jenny)"/>
```

**Using CLI**

To perform the same action in the CLI you write one of the following commands:

```console
groups -n "Jenny's Group" Jenny
cat "createGroup(Jenny's Group , Jenny)"
```

**Database Explorer**

Open the Database Explorer application, go to `tenant://` and select the `Groups` container. A list of groups should be displayed. If you right-click on a group icon, a context-menu with options to that specific group will appear. If you right-click outside a group you should instead get a menu with the option `Create New Group`.

Once you have chosen that option a new window will appear notifying you of the need to select a name for your group and your desired username (alias) in the group. An identity that creates a new group or becomes a member of a group has the option to select a new `alias` for the group. The alias is similar to a username, but local within the group. The same name as the identity may be used for the alias.

> **Note:** you may not use a group name that is already in use.

If you try to register a group that already exists a system dialog will appear notifying you that the intended registration failed because it already exists.

If the group name is available and your registration was successful a system dialog should appear stating that the group was created. Your group is now available at the last group in the `Groups` container.

### Creating Subgroups

The default setting for groups is that they support `subgroups`. This means that groups can be created within those groups and are considered to be subGroups. Creation of subgroups can be denied by the group **owner**. In order to create a subgroup the parent group must be mounted.

Subgroups are created by any of the following ways:

**Using process markup**

**ActionURL syntax**

```xios
[database name]://createGroup([groupName], [owner alias])
```

**Example**

```xml
<operation name="open" value="tenant://createGroup(Jenny's Group , Jenny)"/>
```

**Using CLI**

To perform the same action in the CLI you write one of the following commands:

**Using CLI**

```console
tenant://> groups -n "Jenny's Group" Jenny tenant
tenant://> cat "createGroup(Jenny's Group , Jenny)"
```

**Using Database Explorer**

This action is currently not supported in Database Explorer.

### Joining Groups

Groups can be joined by any of the following ways:

**Using process markup**

**ActionURL syntax**

```xios
[channel name]://join([group Path], [user alias])
```

**Example**

```xml
<operation name="open" value="tenant://join(Jenny's Group, Kirk Smith)"/>
```

**Using CLI**

```console
cat "join(Jenny's Group, Kirk Smith)"
groups -j "Jenny's Group" "Kirk Smith"
```

**Using Database Explorer**

In the Groups container, right-click on a group and select the `Join Group` option from the context-menu.

### Leaving Groups

Members can choose to leave a group at any time.

> **Note:** group owners may not leave their groups.

**Using process markup**

**ActionURL syntax**

```xios
[channel name]://leaveGroup([group Path])
```

**Example**

```xml
<operation name="open" value="tenant://leaveGroup(Jenny's Group)"/>
```

**Using CLI**

```console
groups -q "Jenny's Group"
cat "tenant://leaveGroup(Jenny's Group)"
```

**Using Database Explorer**

Right-click on group name and select the option `Leave Group`.

> **Note:** this option is only available if you have not mounted the group.

### Mounting Groups

Users can login to (mount) groups in any of the following ways:

**Using process markup**

**ActionURL syntax**

```xml
<operation name="database">
  <mount name="finance">
    <group path="Finance"/>
  </mount>
</operation>
```

The example will mount the group `Finance` as `finance://`.

**Using CLI**

```console
mount [database name] [group name]
mount finance Finance
groups -l [database name] [group name]
groups -l finance Finance
```

**Using Database Explorer**

In the `Groups` container, right-click on a group and select the `Login to Group` option from the context-menu.

### Group members

For each `identity` that joins a group a `profile` will be created inside the `Profiles` container inside the group's database. The XML document object is named after the member's alias and does not have any extension to the object name. It is however an XML document and only contains a self-enclosing `profile` element.

The type of information that should be stored in these profile documents is public information about the member, the reason being that the object is viewable by all members of the group. Non-public information should be stored on the member's local private database (`home://`) where only the identity itself can access the information.

Note that members can change their `alias` in a group at any time by using the following command in the CLI.

```console
[channel]://> groups -h [new alias]
```

#### Estimating the number of members

To estimate the number of members of a group you need to do a query of the objects inside the `Profiles` container. Only a maximum of 100 objects will be listed in the `db:result`, the total number of members can be found in the `db:paging` element `total` attribute.

A list of all members in a group can be acquired by using the following command in the CLI

```console
groups -m "Jenny's Group"
cat "home://Groups/Jenny's Group[root='user']"
```

### Customizing Group Behavior

There are a few ways to alter or customize the behavior of groups. These include auto mounting and auto starting applications located in the group database.

#### Auto mounting

To make a group `auto mount` it needs to be defined in the `#Config`.

> **Note:** this will only work if the group has been mounted once before, and therefore created a database node in `#Config`.

All groups can be found in the `channels` element as child elements.

```xml
<operation name="change" value="#Config">
  <store type="replaceText" select="/config/*/channels/*[@friendly = 'Jenny's Group']/@automount">true</store>
</operation>
```

#### Auto starting applications

Groups can also launch applications when mounted. These can then utilize the group's shared database. This is possible by using an `autostart.xml` document which is placed in the group's root container as an object.

The `autostart.xml` is an process markup document that might look like this:

```xml
<process name="jennysAutostart" xmlns="https://xios3.xom/process/1.0">
  <step id="start" name="Open Application">
    <operation name="open" value="apps/JennyApp.xml"/>
  </step>
</process>
```

The code above will simply open an object located at `apps/JennyApp.xml`.

> **Note:** since this application uses the groups shared database, it does require that the identity has mounted the group database in order for it to work.

> **Warning:** If the group is not mounted, the application will not appear.

### Role handling

All commands for role handling are handled through the CloudBackend `Identity` section or the CLI. If the channel is `cbe` then a group name must be provided. If the channel is the group then no group name should be provided.

**Listing roles**

Lists all available roles in a group. Excluding `owner` group and `admin` group.

```console
groups [group name] -o
```

**Creating roles**

Creates a new role for the group.

```console
groups [group name] -c [role name]
```

**Adding role members**

Promotes the member to a certain group.

> **Note:** Note that the `member id` must be known.

```console
groups [group name] -a [role name] [user id]
```

**Removing role members**

Demotes the member from a certain group.

> **Note:** Note that the `member id` must be known.

```console
groups [group name] -r [role name] [user id]
```

### Group profile.xml

Every group administrator can create a `profile.xml` document that can be placed in the root container of the group. This XML document object will contain information about the group and will be treated in a special way by the database, because it is indexed for the purpose of retrieving information about a group using the `Properties` menu option.

**profile.xml document syntax**

```xml
<?xml version="1.0"?>

<groupDescription xmlns="https://cloudtop.com/profiles/group/1.0">
  <name>GroupName</name>
  <owner>Alias of group owner</owner>
  <icon>http://sport.com/pics/icon.ico</icon>
  <logo>http://sport.com/pics/logo100x100.gif</logo>
  <terms>The terms for joining the group</terms>
  <shortDescription>
    A description that is less than 100 characters...
  </shortDescription>
  <fullDescription>
    A full description of the group.
  </fullDescription>
  <keywords>
    <keyword>keyword1</keyword>
    <keyword>keyword2</keyword>
  </keywords>
  <userProfileTemplate>
    <data id="userProfileField_name" caption="Name" component="input" indexed="true" required="true" value=""/>
    <data id="userProfileField_city" caption="City" component="input" indexed="true" required="false" value=""/>
    <data id="userProfileField_profession" caption="Profession" component="input" indexed="true" required="false" value=""/>
  </userProfileTemplate>
</groupDescription>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-groups>*

---

## Managing Objects

This chapter is intended to provide the reader with the knowledge of how the CloudBackend database handles objects and how to create, edit and delete objects by altering the db:result.

**Name Convention**

The following characters are forbidden to use in object names:

- ? / \ ( ) # * : [ ] | % & < " ' ! { }

### Creating objects

Objects are created by appending an `db:object` element to an [db:container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/atom-namespace). The result is retrieved when making a container listing or query in a specific container. To append the XML data we must use the [change operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/change).

#### Creating an object

**The operation will create a new document called MyNewDocument.xml in the Documents container.**

```xml
<operation name="database" value="home://Documents/">
  <create type="object" name="MyNewDocument.xml">
    <author>
      <name>Lewis Carroll</name>
      <email>alice@wonderland.com</email>
      <uri></uri>
    </author>
    <summary>A children's novel and an example of the literary nonsense genre.</summary>
    <acl>
      <user id="{$userId}" read="true" write="true" delete="false" changeACL="true"/>
      <group id="{$tenantId}" read="true" write="false" delete="false" changeACL="false"/>
      <role  id="{$adminGroupId}" read="true" write="true" delete="true" changeACL="false"/>
    </acl>
    <index>
      <key name="keyword" index="true"/>    <!-- searchable metadata -->
      <key name="freetext" index="false"/>  <!-- non searchable metadata -->
    </index>
    <content type="text/xml">
<book isbn="123456789">
  <title lang="en">
    Alice's Adventures in Wonderland
  <title>
  <title lang="sv">
    Alice i Underlandet
  <title>
  <published>1865</published>
  <abstract lang="en">
    It details the story of a girl named Alice who falls through a rabbit hole into a fantasy world of anthropomorphic creatures.
  </abstract>
  <abstract lang="sv">
    Boken handlar om den lilla flickan Alices äventyr i en värld som strider mot all logik.
  </abstract>
</book>
    </content>
  </create>
</operation>
```

The above process markup code will use the [database operation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/database) to save a document named `MyNewDocument.xml` in the `home://Documents/` container.

Using this operation you can easily create an object, set the content, set the permissions rights and set the meta data. In the `author` element which corresponds to the `@author` attribute we populate the child element's `name`, `email` and `uri` which will then be available as `@name`, `email` and `@xlink:href` as *meta data*. The same is true for the `summary` element which will be available as `summary` in the meta data.

The `acl` element contains the permission rights for the object. You may add user, group and role elements and give them specific rights. You can define the `read`, `write` and `delete` rights but also the right to change the ACL information. At least one, usually the owner, must have changeACL rights set to true.

The `index` element defines the key/values for an object. If you set the `index` attribute on the key element to **false**, the keyword will not be available as a searchable key when searching the database.

Finally the `content` element which allows you to directly define the contents of the object by adding it inside the element. The `type` attribute on the `content` element will define the `content-type` (mime-type) in the meta data.

#### The object created

The above code will generate an object called `MyNewDocument.xml` in the Documents container (`home://Documents`). When opened the object should look like this.

> **Tip:** Note that if trying to rename an object to one name that is already being used by another object it will result in a system dialog notifying the end-user that there already is an object with that name.

> **Warning:** An object can not be named exactly as a sub-container in the same path.

**MyNewDocument.xml in home://Documents/** *(tested)*

```xml
<?xml version="1.0"?>

<newContent>My New Object...</newContent>
```

#### Handling object rights (object permissions)

Object rights are appended to an object when it is created (see above) or by changing existing object permissions. The `acl` element can have either `user` or `group` child elements. Both of these have `id`, `read`, `write`, `delete` and `changeACL` attributes which are used to define permissions.

The code below will give a user with the id 20013 full permission for the object as well as changing the object rights (changeACL attribute). It also provides read access for all members of the group which has id 410. The members cannot write anything in the object or delete it.

> **Warning:** Each Item needs at least one ACL entry with changeACL permission set to true.

**Configuring ACLs** *(tested)*

```xml
<acl>
  <user id="20013" read="true" write="true" delete="true" changeACL="true"/>
  <group id="410" read="true" write="false" delete="false" changeACL="false"/>
</acl>
```

### Meta Data

Meta Data is descriptive data about an object and its content. In CloudBackend object meta data is appended as child elements to the `db:object` element. Keys of key/values thereby have to **conform** to the XML standards restrictions of naming elements. A key can never have a name that is not a valid name for an XML element.

Keys that should not be searchable through the database (to save space), should have the `index` attribute set to `false`.

Developers can create and store their own meta data elements using `db:object` child key/value elements, `key`. There are limitations to what the key/value can be named, as we only accept valid XML element names as key names. In addition, any element name used in the atom namespace is not allowed.

A list of reserved element names using the atom-namespace can be found in the [atom namespace](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/atom-namespace) dictionary entry.

The CLI has a command named `meta` that lists all meta data entries of an object. In the example below we will list all meta data of the `Wallpapers.xml` object.

- `meta home://Wallpapers.xml`

#### Accessing meta data of an object

There are two different ways of accessing meta data of an object. The first is to create a db:result listing by searching for an object in a particular container, thus generating a `db:result` containing only one `db:object` element. Any key/values will be located as child elements to `db:object`.

The second way is to access the meta data for a specific object which is possible if the object path is known. In order to get the meta data we write the entire URL followed by a slash, like such:

`home://Container1/Container2/`

The code below is the returned XML for our example, `Wallpapers.xml`:

**Wallpapers.xml** *(tested)*

```xml
<db:object xmlns:db="https://cloudbackend.com/db.xsd" name="Wallpapers.xml"
  created="2024-01-28T11:42:10Z" published="2024-01-28T11:42:10Z" cid="5910" id="452165"
  xlink:href="home://Wallpapers.xml" mime="text/xml">
  <db:streams total="143" first="143"/>
  <root index="false">wallpapers</root>
  <link>Wallpapers.xml</link>
  <content></content>
  <acl tag="475d55G81-s23ssD">
    <user id="181" read="true" write="true" delete="true" changeACL="true"/>
  </acl>
</db:object>
```

The code above is returned when using an URL similar to one in the debug operation below. The XML document of the meta data is divided into indexed meta and non-index meta data. The acl element contains information regarding which identity can edit the object, in this case only one identity.

*(tested)*

```xml
<operation name="debug" value="home://Wallpapers.xml/">alert:plain</operation>
```

#### Changing meta data for an object

**Example of meta data** *(tested)*

```xml
<operation name="change" value="home://Documents/">
  <store type="replaceText" select="/db:result/db:object[@name='DocTestFile.xml']/@name">
    Changed title
  </store>
</operation>
```

As mentioned earlier, only meta data elements stored under a `db:object` is indexed and searchable, unless the attribute `index="false"` is used. This means that the default behavior is indexed. For the example above you will be able to search for `@name`, `@author` and `keywords`. To understand how searches are made read the "[Searching the Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database)" chapter.

The `developer` with `index="false"` will not be indexed and you will not be able to search for that information. You can however use it when it is available in `db:object`.

The name of the object created will be `DocTestFile.xml` and it will be created in `home://Documents` container. The only contents of the object will be a single element (<document/>)

### Attachments

CloudBackend allows for XML documents to be attached to other documents as streams. This is accomplished by adding information to the meta XML of the object which the attachments will be a part of.

Because the meta data is available as XML data we use the [change](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/change) operation to append our attachment. In the value attribute we provide the meta data of the object that we want to append the attachment to. This is done by adding one additional forward slash (/) to the object path.

All attachments of the object will be available in the attachments element as document elements. The `id` attribute is a positive integer, which means that the value must be a number higher than 0. Because the id 1 is already in use, the attachment id can thus be 2 or higher.

> **Note:** there already exists one attachment with the id 1, which is the main part of the object itself.

When creating an attachment with an id that already exists it will overwrite any attachment that exist with the same id. It is important to understand that attachments can not have their own meta data appended to them since they are only part of a document.

**This will create an empty attachment to the document 'file.xml' and will have the name 'My attachment' and the id 2.** *(tested)*

```xml
<operation name="change" value="home://file.xml/">
  <store type="append" select="/meta/attachment">
    <document name="My attachment" id="2"/>
  </store>
</operation>
```

The attached stream can be accessed by adding a forward slash and then the id within brackets like such:

- `home://file.xml/[2]`

This means that the original stream can be accessed in one of two ways:

1. `home://file.xml`
2. `home://file.xml/[1]`

### Database results (db:result)

Database results are created every time you ask for the contents of a virtual container and is returned from the database in the form of an XML `db:result`. Results are also created when making a search query.

A `db:result` looks as a normal container path with a slash at the end of the path. If the slash is omitted the path will just be a string. When a slash is used it will return the XML document of the result.

| URL | Description | Result |
|---|---|---|
| `home://Documents` | Path to container | string value |
| `home://Documents/` | Database result of container contents | XML data |

The `db:result` below is an example of a XML document returned when asking for the contents of the container `home://`. The root element is the `db:result` and notice the `db:` namespace prefix declaration.

The `db:paging` element at the top of the document contains the number of search results. It is also used for pagination when supported. The reason is that every listing of the contents of a container is regarded as a search query for the database.

All objects are listed as `db:object` node-sets. The document below lists one `db:object` node-set and therefore one object. The entry contains details about the object, such as object name (`@name`), when it was published (`@published`) and in what container it is located (`@xlink:href`).

**Result from querying a database like home://** *(tested)*

```xml
<?xml version="1.0"?>

<db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <db:paging total="1" start="0" size="100"/>

  <db:object name="Wallpapers.xml" id="5910" cid="20086" xlink:href="home://Wallpapers.xml"
             published="2024-01-28T11:42:10Z" updated="2024-01-28T11:42:10Z">
    <db:streams mime="text/xml" first="89"/>
    <root>wallpapers</root>
  </db:object>

</db:result>
```

### Renaming objects (files)

To rename an object (such as a file) using the process markup language all you need to do is to use to change operation to replace the old `@name` attribute with a new containing the new object name.

> **Note:** two items can not have the same name in a container (folder).

If you try to rename the object to a name which already exists a system dialog notifying the end-user that the object name is in use will appear.

**Renaming an object in home://Documents/** *(tested)*

```xml
<operation name="change" value="home://Documents/?title:DocTestFile.xml">
  <store type="replaceText" select="/db:result/db:object/@name">
    AnotherName.xml
  </store>
</operation>
```

The example above makes a search query to the database for an object named `DocTestFile.xml` that should be located inside `home://Documents/`. It will return an `db:container` XML document. To better understand search queries, read the [Searching the Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database) chapter.

The feed returned will only contain one `db:object` since there can only be one object that is named `DocTextFile.xml`. We proceed to select the `@name` in the only `db:object` and replace it with our new `@name` containing the text `AnotherName.xml` which will be the new name of our object.

### Deleting objects (files)

To delete an object we need to remove it from the db:container. The example below will use the `change` operation and the child element `delete` to select an object named `DocTestFile.xml` and delete it.

If you try to delete an object that does not exist, no system dialog will notify the user of the failure to remove it. It will only appear as an error message in the debugger, saying that the XPath way faulty and that it did not match anything.

**Deleting an object permanently** *(tested)*

```xml
<operation name="database" value="home://Documents/DocTestFile.xml">
  <delete permanent="true" silent="false"/>
</operation>
```

### Moving objects (files)

Moving objects is a simple matter of using the database operation.

> **Note:** The path to the `target container`, defined in the `to` attribute, should end with a slash.

**Moving an object (file) to a new directory**

```xml
<operation name="database" value="home://Documents/DocTestFile.xml">
  <move to="home://Applications/" silent="true"/>
</operation>
```

### Copying objects (files)

Note that this will both copy and paste the object in the same container. To work as default copy-paste it needs to be broken up into two operations; `copy` to copy the object path `targetObject`, but you will also need to retrieve a target container using alias `model="container"`.

> **Tip:** The path to the `targetContainer`, defined in the `to` attribute, should end with a slash.

**This will actually copy the object and rename it so that there is no name conflict** *(tested)*

```xml
<operation name="database" value="home://Documents/DocTestFile.xml">
  <copy to="home://Copies/"/>
</operation>
```

### Uploading objects (files)

Uploading of an object is done by using the [database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/database) operation.

**This will open a dialog window that will enable the user to upload an object in the Documents container** *(tested)*

```xml
<operation name="database">
  <upload to="home://Documents/"/>
</operation>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects>*

---

## Overall Structure

The CloudBackend Database, which through XIOS/3 is exposed as a [Data Virtualization Layer](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer) consisting of databases, containers, and objects. It utilizes XML for its data model and communication. Every container query result is returned as an `db:result` which is similar to a database result set, or an `RSS feed` that websites use to syndicate news on websites. In the application Database Explorer this `db:result` can be visualized in several different ways.

In this section, we will more closely explain how the different components of the virtual data layer function.

#### Objects

All objects are stored in the database that the CloudBackend protocol module connects to. Upload is possible via either the Database Explorer, CLI, WebDAV, or by using an [alias](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development/aliases) (model open).

In container listings and search queries each object is presented as an db:object in an db:container. In this db:object element you are provided with the location of the object, MIME-type and other object specific information.

To learn more about how to use db:result, read the [Managing Objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects) chapter. Information about how search queries work can be found in the [Searching the Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database) chapter.

#### Containers

All containers are virtual and the entire object structure is stored in the container-root object. It is this object that is used to render the container structure in applications such as the Database Explorer.

In CloudBackend containers use the [db: namespace](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/db-namespace). This means that this namespace must be declared in any document that is used to modify object structure or display it.

#### Shortcuts

A user can create a shortcut to any object by right-clicking on an object and selecting the "Add shortcut to desktop"-option in the context menu. Any user can also right-click directly on the desktop to create a "shortcut" or an "iLauncher Shortcut". The latter is used for external applications or mail services. The "shortcut" option requires a Path to the application object and can also be provided a parameter in the form of a trigger.

CloudBackend also supports container `shortcuts`; this is done by pointing the shortcut to a container and ending the destination URL with a slash like such:

- `home://Documents/`

The final slash is very important as it indicates if it is an object or a container.

The shortcut functionality works by adding an `db:object` to the `settings.xml` file.

> **Note:** that the [db: namespace](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/dictionary/db-namespace) is used.

#### Groups and Tenant

Groups are a special feature in CloudBackend where a group is represented with a separate database, in which documents can be shared within that group.

A [tenant](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/tenant) is also a type of group, but it is the main shared database for a tenant that all its end-users can access.

More information about creating and managing groups can be found in the [Managing Groups](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-groups) chapter of this section.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/overall-structure>*

---

## Searching the Database

This chapter is intended to explain how to perform searches and how to filter searches. The documentation will show that the CloudBackend database can be used as a replacement for an SQL based database.

It is possible to only retrieve the number of results found, without having the database send the information. This has advantages since it results in less bandwidth for the end-user.

#### Query Syntax

The query language that is used to communicate with the database is rather simple, yet if used correctly it can be very powerful. A search query is a list of search terms separated by whitespace and is presented in any of the following ways:

1. `[+/-][prefix:]term[*]`
2. `[+/-][prefix:]'term"term term'[*]`
3. `[+/-][prefix:]"term'term term"[*]`

The information contained in the brackets is optional. The plus and minus sign in front of the prefix is used to define if the term must or must not exist. This is similar to `AND` and `AND NOT` in SQL. Unprefixed terms are neither plus nor minus, they are instead used to increase the weight of a result and make it more relevant.

The prefix is also optional, but highly recommended to use. It consists of the local-name of an element, meaning that the namespace should not be used. As we mentioned in the meta data section of "Managing Objects" the local-name must be unique in the meta data field elsewise search will not be possible. If the prefix is omitted it will search all searchable meta data fields.

A term is often simply a word. If that is the case, then apostrophes and quotation marks should not be used. If a phrase is used and it contains whitespace, then these must be used to enclose the search phrase.

> **Note:** if the phrase contains quotation marks, then apostrophes should be used to enclose the term and vice versa.

To make the database return objects that contain words that start with the term supplied we must append an asterisk to our term.

1. `home://Documents/?+title:Acme*`
2. `home://Documents/?+summary:'Jenny"s Party'*`
3. `home://Documents/?+summary:"Jenny's Party"*`

> **Warning:** Note that we are using a slash at the end of the container path to indicate that we want to deal with XML data. If the slash is omitted, the search will fail.

### Filtering

Filtering search results is done by adding one or more search conditions. These are separated by whitespace. Only search results that match all conditions will be returned.

- `home://Documents/?+title:Acme -title:Sales -title:Jenny`

#### Special handling of @published, startdate and enddate key/values

These meta data fields are reserved and will be handled in a special way. The `@published`, which is set automatically by the database, is not indexed. Instead three separate values are indexed from the timestamp. The following date "2024-02-04" would index the following values:

- pubyear:2024
- pubmonth:02
- pubweek:06

A search query to fetch all objects created in February 2024 might look like this:

- `cat home://Documents/?pubyear:2024 pubmonth:02`

The `startdate` and `enddate` which might be used to create appointments which span over a time period and not just a moment in time might look like this when added as key/value meta data:

*(fragment)*

```xml
<startdate date="2023-12-10" time="01:54:00" zone="Z"/>
<enddate date="2024-01-09" time="00:00:00" zone="Z"/>
```

It would result in a special indexing that would save the following data

- year:2023
- year:2024
- month:12
- month:01
- week:50, week:51, week:52, week:01, week:02

#### No search results

When the database does not find any objects matching the search criteria it will only return the following XML. Note that this is the same as when there are no objects in a container.

**Empty container**

```xml
<?xml version="1.0"?>
<db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <db:paging start="0" size="100" total="0"/>
</db:result>
```

#### Next

- [Query Language](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/query-language)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/searching-the-database>*

---

## System Permissions

The CloudBackend offers object and container permission handling for local objects as well as user and group permissions for the Group functionality.

### Group permissions

Each group can have three general permission levels (customized roles are covered in the [Managing groups section](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-groups)). The general roles are `Owner`, `Administrator` and `Member` which all have predefined access rights in the group.

The owner is a superuser that has full rights across the system. The owner is usually the creator of the group and is also the only user that can promote and demote users to become `administrators`. These have more access rights than normal users in the group. The Administrator role is created automatically when the group is created.

Normal members have access to the database but can not create or delete objects or containers without the owner or admin setting special permissions for objects or containers. Objects inherit the rights of the container unless they have their own rights defined.

### Identity permissions

A Member has full access to the personal private database i.e., `home://`.

To `share` an item to another user, explicit permissions needs to be assigned prior to sharing it.

Specific identity permissions can be given to items in a group database e.g., `tenant://`

### Overlapping permissions

In cases where multiple ACL's are overlapping for a user, the sum of applicable permissions are applied for each item.

### Additional

Objects created in CloudBackend can handle basic read, write and delete permissions. This can be done by modifying the meta data of the object in question. These permissions can also be changed using [process markup](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/process-development).

### Combinations

| val | rd | wrt | dlt | chg | cli | Set | description |
|---|---|---|---|---|---|---|---|
| 0 | - | - | - | - | ----- | No Permission | no access; this alternative should be set to ensure a user can not access anything; should be used when unsharing an item |
| 1 | r | - | - | - | r---- | Read | enables query and download; no rename or move |
| 2 | - | w | - | - | -w--- | Write | upload to a shared container and rename a shared item; no query or download |
| 3 | r | w | - | - | rw--- | Read Write | upload, download, rename and move; no delete |
| 4 | - | - | d | - | --d-- | Delete | nothing but delete |
| 5 | r | - | d | - | r-d-- | Read Delete | download; no write, rename or upload |
| 6 | - | w | d | - | -wd-- | Write Delete | upload, rename and delete |
| 7 | r | w | d | - | rwd-- | Read Write Delete | all but change ACL |
| 8 | - | - | - | a | ----a | ChangeACL | enables a user to set new ACL:s on a container/object |
| 9 | r | - | - | a | r---a | Read ChangeACL | no write, no delete |
| 10 | - | w | - | a | -w--a | Write ChangeACL | no read, no delete |
| 11 | r | w | - | a | rw--a | Read Write ChangeACL | no delete |
| 12 | - | - | d | a | --d-a | Delete ChangeACL | no read, no write |
| 13 | r | - | d | a | r-d-a | Read Delete ChangeACL | no write |
| 14 | - | w | d | a | -wd-a | Write Delete ChangeACL | no read |
| 15 | r | w | d | a | rwd-a | All Permissions | all permitted |

> **Warning:** Each Item needs at least one ACL entry with changeACL permission set to true.

### Example 1

The group database container e.g., `tenant://userinfo/` could be set up so each Member is allowed to create and update an object while only the Administrator is allowed to delete it.

1. Give the tenant group read and write access.
2. The Administrator group should have full access.
3. For the Member to be able to delete his own information (and nobody else but the Administrator) each user should have explicit delete access to its own object.
4. Give the user delete permission on that object.

**Example 1 - Create an object with user read-write-delete permissions.**

```xml
<operation name="database" value="tenant://userinfo/">
  <create type="object" name="Lisa.xml">
    <acl>
      <group id="234567" read="true" write="true" delete="true" changeACL="true"/>
      <user id="1234567" read="true" write="true" delete="true" changeACL="false"/>
    </acl>
    <content type="text/xml">
      <staff firstName="Lisa" lastName="Person" startDate="{$date}" endDate="9999-99-99"/>
    </content>
  </create>
</operation>
```

This gives the object `tenant://userinfo/Lisa.xml` which allows the user to update their data.

### Example 2

Each Member is to have a container e.g., `tenant://userinfo/NN/` where only the Member and the Administrator are allowed to create and read its objects, while only the Administrator is allowed to delete such objects.

1. Give the tenant group no access.
2. The Administrator group should have full access.
3. Give the user read and write permission on that container.

Objects created in it will inherit the ACL of that container.

**Example 2 - Create a container with read-write permissions for a user.**

```xml
<operation name="database" value="tenant://userinfo/">
  <create type="container" name="Lisa">
    <acl>
      <group id="234567" read="true" write="true" delete="true" changeACL="true"/>
      <user id="1234567" read="true" write="true" delete="false" changeACL="false"/>
    </acl>
  </create>
</operation>
```

This gives the container `tenant://userinfo/Lisa/` where that user can create and update multiple data objects.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/system-permissions>*

---

## Tenant

The `tenant://` database is a shared database for the entire tenant and all its end-users. It is a group that all the group commands and operations will work with. In fact, any additional created group within a tenant end up becoming a subgroup to the tenant group. Use the CLI command `use tenant` to change database to the tenant database.

### Group Quota

The quota will depend on price plan chosen by the tenant.

### Uploading

Any containers created or objects uploaded to the tenant will be available for all identities, unless the `ACL` specifies otherwise. Containers may be configured as read-only for data that is required to be shared to all identities using ACLs.

> **Note:** You can read more about ACLs in the CloudBackend documentation.

The same limitations on object size apply to the tenant database as is for the identity's `home://` database, 2 GB per stream or initial object file.

### Downloading

All uploaded objects are available for download. This is done by accessing the object directly by providing the URL to the object like such:

- `https://api.cloudbackend.com/v1/documents/container_id/object_id/stream_id`

All objects have [meta data elements](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects) describing their URL, as well as `container_id`, `object_id`, and `stream_id`.

> **Note:** Note that for downloading to work the user must be logged in to the CloudBackend account that has the object. This means that you cannot forward this link to other people so that they can download it. Also that there currently is no bandwidth limitations, although CloudBackend reserves the right to impose such limitations when it is deemed to be necessary.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/tenant>*

---

## Using Key - Value pairs

In addition to the standard metadata additional Key/Value pairs can be added to Objects as needed.

### Key syntax

Key names are case sensitive and must start with a letter or underscore.

The following lower case words are reserved and may not be used as a key name.

- author
- category
- content
- contributor
- date
- email
- entry
- feed
- generator
- id
- icon
- link
- logo
- name
- published
- rights
- source
- subtitle
- summary
- title
- updated
- uri
- size

However, variations with some uppercase characters or _ may be an option.

### Value syntax

Value is a string with length of 0-255 bytes.

### Filtered search

Meta data, like Key/Value pairs, on Objects can be used to filter searches in the cloud.

Key/Value can be used to filter when selecting data.

- : matching string
- * wildcard (at the end of the search string)
- < less than numerically
- > more than numerically

- Artist:ABBA
- City:Linköping
- Firstname:Patricia
- Firstname:Patrick
- Firstname:Pat*
- Latitude:58.41*
- price<1000
- age>25

**Example code**

```xml
<alias name="searchResults" value="home://search(/Documents,City:Linköping)" model="data"/>
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/using-key---value-pairs>*

---

## Data Virtualization Layer

The XIOS/3 `Data Virtualization Layer` is a local, client-side, in-browser database abstraction for local, in-memory, and remote object storage and services. The virtual data layer abstraction provides generic methods to work with data stored in a wide range of different systems, databases, data formats, or APIs.


*Note that all operations are not available on all communication channel implementations, but depends on the inherent constraints and functionality of the underlying storage as well as the feature set of the protocol module that communicates with the storage.*

Many of the system functions and applications in XIOS/3 assume that the default database is named `home://`. There is, however, no requirement that any database from the data virtualization layer is mounted in XIOS/3. This means that XIOS/3 and applications can run even without any backend or communication to an API.

The data virtualization layer is made available by a `communicator` through a mounted `channel`. One common communicator used in XIOS/3 is the `CloudBackend` communicator, which often is mounted as `home://` and `tenant://`. However, you can set up your own channels (protocols) to communicate with any external resource, as in the illustration below where a wrapped Google Maps component is bound to the external API of a Swedish weather service, SMHI.


After reading this section you should have basic understanding of how datatypes in XIOS/3 work and how to associate datatypes while also knowing that there are existing datatypes and where they are located.

We will also provide you with an overlook of [object properties](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/object-properties), intended to educate the reader of available object properties set by the system such as when the object was created. Again, this is intended to give the reader an introduction to the data virtualization layer and does not offer any code examples. These can instead be located in the "[CloudBackend Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database)" section.

This section also introduces the three different actions that can be performed on objects: `open`, `edit` and `preview`. These can be found in the "[Performing Actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-datatypes/performing-actions)" section.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer>*

---

## Datatype Association

Datatype associations are stored in the users' apps installed document under each application.

The main purpose of datatypes is to define which applications should be used to open and execute an object. Secondly, datatypes are used by default XIOS/3 applications such as Document Explorer and Document Selector although they can be used by any application created.

The XML data contains information that differentiates the different object (file) types. Data needed to identify the object is stored in the root element as attributes. Additional information needed to handle the object is stored as child elements. These include which applications are used to open, edit and preview the object as well as the icon of the object.

### Priority

Since working with XIOS/3 is synonymously working with XML data, there are many different XML document formats that needs to be identified in a different way than only by if the `mime-type` is either `application/xml` or `text/xml`. XIOS/3 allows to define the `root` element of the XML document as well as a namespace to uniquely identify XML document.

The following priority applies for documents:

1. `Namespace (@namespace) [only if MIME-type is text/xml]`
2. `Root element (@element) [only if MIME-type is text/xml]`
3. `MIME-type (@mime)`

When a `namespace` attribute is present it will define the object type of XML documents. If it is not present on the `type` element, it will instead try to identify the type by the `element` attribute. This is however only available for `text/xml` MIME-type documents. Both `@namespace` and `@element` are optional and only apply to XML documents (text/xml).

### Namespace

The `namespace` attribute is default for documents that are related to CloudTop applications such as Mail and Calendar. Due to the fact that `View`, `Process` and `Application` documents are also XML documents they must have namespace declarations.

A namespace declaration for the presentation document format looks like this:

- `xmlns="https://cloudtop.com/presentation/1.0"`

The custom namespace is inserted in the xpc:ns attribute on the root element of the document. Looking at the first attribute xmlns:xpc it always points to the XIOS/3 process namespace. It ensures that the namespace will not create a collision with other namespaces by reserving the namespace. The second attribute is then used to define the namespace of the xpc. This information will be extracted by XIOS/3 when the document is saved and added to the meta data of the object as `namespace` key/value which will make the namespace available in container listings and database searches.

XIOS/3 will match the `namespace` key/value with defined object types to determine which application should be used to open the object type. Note that the object type must be registered in `#Settings` for a lookup to be successful, else it will fall back to identify the document by either root element or MIME-type.

- `https://xios3.com/app/1.0`
- `https://xios3.com/process/1.0`
- `https://xios3.com/view/1.0`

- `https://cloudtop.com/presentation/1.0`
- `https://cloudtop.com/calendar/1.0`

- `https://cloudtop.com/shortcut/1.0`

### MIME-type

The MIME type value that needs to be set in the `mime` attribute is IANA approved standard.

[IANA (Internet Assigned Numbers Authority) MIME Media Types](http://www.iana.org/assignments/media-types/)

### Root element

If the XML schema has been defined for the XML document type, it then might be appropriate to use the root element in the `element` attribute. Note that while it may help to differentiate the different XML types it is recommended to also use the `schema` attribute since it is truly unique.

### Managing Datatypes Through CloudBackend

Please see the CloudBackend Database section.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/datatype-association>*

---

## Existing Datatypes

In XIOS/3 some object types are predefined. These are stored in `#TypeManager` document, in `tenant://Settings/Datatypes`, and as `type` elements in every user's `settings.xml` document. The information stored in this element is used to set how the specific object type should be identified and which XIOS/3 actions should be performed on the object when executed in a certain way, which application should be used to edit the object and which should be used to open it.

To learn more about XIOS/3 actions read the [Performing Actions](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-datatypes/performing-actions) section.

While all users have access to generic XIOS/3 and standard object types every user can add more object types by manipulating `settings.xml` or by using the `Control Panel` application to change the object. The "Datatypes" section can be found in the "System" tab of the Control Panel.

### icon

Defines the icon of the document and should by either an icon protocol icon like `icon://folder`, or a 32x32 pixels png icon. This icon is accessed by applications such as Document Explorer. It is important to note the there should also be sibling folders containing smaller and larger icons (if non SVG icons are used).

- 16x16
- 24x24
- 32x32
- 64x64
- 128x128

All folders above should contain icons with their respective size. The 16x16 and 32x32 folders always contain icons since Document Explorer as well as other XIOS/3 applications makes use of this folder structure to get larger and smaller icons by replacing the size with the desired size, e.g. 32x32 with 16x16.

### name

The friendly (short) name of the object type. This is intended to be used when hovering objects in applications such as Document Explorer.

### mime-type (content-type)

The mime type used to define the object (file) type. For ordinary XML documents this is either `application/xml` or `text/xml` according to [IANA](http://www.iana.org/assignments/media-types/) standard. This attribute must be set in order to identify the `mime-type` so that an object of type text file can be differentiated from an XML document.

### element

This attribute is made to contain the root element of the document in order to better separate different XML documents. Although this way is useful, we recommend that you use the `schema` attribute.

### namespace

The `namespace` attribute is used as a primary identifier for object type association for XML documents. It allows for the creation of unique text/xml object types. This means that there can be almost an infinite number of different XML document types defined.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/existing-datatypes>*

---

## Introduction

A common problem when developing software based on the common MVC (Model, [View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view), Controller) paradigm is that Models tend to become highly dependent on the structure of the underlying Data Source and protocols used for communicating with them. To resolve this problem, an abstraction of a Data Model's underlying Data Sources is required. The invention described here, provides means for automating and standardizing the interaction between Data Models and Data Sources.

### The Problem

The `Model`, `View`, `Controller` (or MVC) is a development pattern introduced as a way to organize code where user interface description (`[View](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view)`) and data concerns (`Model`) are kept separate and where updates to one of the components won't necessarily require updates to the other. Introducing an intermediate component, the `Controller`, which handles application logic and decouples the view and the data, does this.

A common problem today is how to effectively manage underlying data sources. The picture below serves to illustrate the problem. In this picture, a programmer is creating two pieces of software using the MVC design pattern. Each application has its own `Data Model`, providing the data structures needed in order to fulfill the software's objectives. In this example, the programmer is forced to explicitly provide code (Data Handler 1-6) for interpreting the information that is communicated back and forth between the Model and its underlying data source on the Server.


This approach will become virtually unmanageable as new Data Handlers are added for each new Data Model, Server, or communication protocol. Not only does this approach entail unnecessary costs for software development and maintenance, it also reduces the reusability of well functioning code.

### The Solution - Data Source Abstraction

The invention calls for a communication manager to be introduced on the client side that manages communication channels to different servers. Some channels are used for communicating with `JSON`, `GraphQL`, `XML Web Services (SOAP / WSDL)`, others might be used for accessing and extracting data from traditional HTML based web sites (enabling easy mash-ups).


The invention is based on a `Communicator` API for implementing new communicators that are instantiated to `channels`. A communicator may be instantiated into multiple channels (speaking to different servers or services on one server).

A Communicator helps a programmer to abstract the access to servers and data by presenting this access as simple XML documents suitable for data binding and processing. The implementation of a Communicator is similar to implementing a new `Internet protocol` and can be used to make the `Data Model` speak to any type of existing server APIs (while still exposing all information access and changes to the data Model as XML documents). Normally different Communicator implementations exists for communicating using different protocols and methods to server resources.

The Communicator API enables the abstraction of `Data Sources` and enables Data Models to have its data accessible in XML format at all times regardless of how the data is stored and managed on the server side or in transit (for example in JSON).

### Communicator API

The communicator API is built around the idea that any data source can be accessed using just a `URL` (Unique Resource Locator). The channel implementing the Communicator API only exposes its data through URLs and return and manages `XML Document` objects that the outside world can use as Models.

Channels constantly monitor changes to its XML Documents. Any change is propagated back to the server and any change on the server is propagated into the data model. Using this scheme, both the server and the client's data model is always updated and current.

Using this simple methodology it becomes possible to create channels implementing `XML Web Services` or `REST APIs` (calling methods and passing parameters to servers), channels by default creates a `data virtualization layer`, a standardized data model, and channels may also perform extraction of data for mashups. Each one accessed and used from an applications point of view in the same way, through an XML document (enabling complete abstraction of data). The application using the XML document cannot tell from which channel it arrived or what kind of underlying data source it is created from.

Having only one way of using, manipulating and creating data simplifies application development and implementation of the data abstraction solution. Applications may also easily change from one data source to another and possible also at runtime. If the user interfaces of one application are XML, using full data abstraction that XML may also become the in data to another application (introducing `Electronic Data Interchange` (EDI) and mashup functionality without adding any extra levels of work or complexity).

From the models, the Communicator API channels are accessed with the `name` of the channel as the `URL protocol` and the rest of the URL as information to the channel to be treated at the channels own discretion (like a REST API):

- `{protocol}://container/document.xml` i.e.:
- `mychannel://container/document.xml` or
- `tenant://Applications/myApp.xml`

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/introduction>*

---

## Mounting a Database

Please see the reference section the process operation, `database`, and its [mount](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer) command. You can also find information on how to mount a channel and database using the CLI. Please visit the CLI manual for information about the mount command.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/mounting-a-database>*

---

## Object Properties

All objects have their meta data exposed through the virtual `.meta` document in the database. In the database, the actual object is treated as a directory in which the `.meta` document can be found. For example the object `public.xml` has its meta data document readable at `public.xml/.meta`. The contents of the meta data document is conforming to the CloudBackend database format with the `db:` namespace.

The properties below are available as attributes in the [meta data XML listing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/cloudbackend-database/managing-objects) of an object.

### Created

The creation time of an object is available in the `published` attribute of the meta data document. The text content will be a timestamp in the format of `YYYY-MM-DDThh:mm:ssZ`, e.g. `2023-01-17T13:25:57Z`.

### Modified

The time of last modification is available in the `updated` attribute of the meta data document. The text content will be a timestamp in the format of `YYYY-MM-DDThh:mm:ssZ`, e.g. `2023-01-17T13:25:57Z`.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/object-properties>*

---

## The host Protocol

The "host" protocol allows access to resources on the webserver where the top document (the HTML document) is hosted. This is where traditionally all relative URLs in an HTML document would go. Since the underlaying transport protocol is simple HTTP or HTTPS and the webserver could be any webserver this database offers no object listings, automatic updates, metadata or any other of the advanced features.

Two virtual objects are created in the database, .url and .cookies, that allows you to access and modify the URL and the cookies of the web page respectively.

### The .url document

The .url document contains the URL of the current browser page, a breakdown of its domain, subdomain, and hashtag (fragment) in attributes, and all the query variables as child nodes to the url element. Modyfying these values will modify the URL of the page as presented to the end user.

**Examle .url document**

```xml
<url href="https://xios.com/demo.html?variable=value#fragment"
     domain="xios.com" subdomain="xios" hash="fragment">
  <param key="variable">value</param>
 </url>
```

### The .cookies document

The .cookies document contains the cookies associated with the current browser page, all listed as child elements to the root element. Adding, removing, and altering the values will update the cookies. In addition, new and updated cookies can have the "expire" and "path" attributes set to control the expiration date and scope of the cookie. These values are however not shown in the .cookies document.

**Exmaple .cookies document**

```xml
<cookies>
  <cookie key="lang" value="en_US"/>
</cookies>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/the-host-protocol>*

---

## The xios Protocol

The xios protocol is a protocol to access XIOS/3 resources. These may reside on a different webserver than the main page is loaded from, or spread on multiple servers. System applications and component dependencies are loaded over this protocol.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/data-virtualization-layer/the-xios-protocol>*

---

## Query Language

The supported query language is a powerful way to do queries in the CloudBackend Singularity Database. It allows querying across ranges, dates, key/value data, and object meta-data. It also makes it possible to include logical operations in queries and is the equivalent of SQL for CloudBackend.

The query language can be used through the CLI in the CloudBackend database together with XIOS/3, or with Filters in the CloudBackend SDK for Mobile & IoT.

### The query language

The query language works relative to the key/values and meta-data of objects in the database. Queries are performed against one or multiple containers, which provide a result set. The queries allow matching based on both boolean and probabilistic methods.

CloudBackend excels at finding object key/values that include a specific value of a key (called a term). Think of it as an index at the end of a book, where you can quickly locate all the pages that refer to a specific word or concept. Multiple result sets can then be merged based on common boolean operations like AND, OR, NOT etc. or simply weighted based on the relevance (which is more useful in an offline indexing scenario than key/value queries).

### The query syntax

The query language is very simple, yet rather powerful.

- (+/-)? (prefix)? (term with no blanks)
- (+/-)? (prefix)? (term with ' and blanks)
- (+/-)? (prefix)? (term with " and blanks)

A term is the word or phrase you wish to search for. Phrases are always enclosed by single or double quotes. The prefix, which is optional, is the key name. Finally, you may include a + or - sign in front of the prefix (or term, if there is no prefix) to indicate that the term must or must not exist.

Some key/values will also be stem-indexed (see next section). Searching for terms in these key/values will actually search for the stemmed term. By using the phrase syntax (single or double quotes) or by beginning the term with a capital letter will force the query parser to search for the word as-is instead.

#### Key/Value term syntax

[Key-word] [operator] [Value as string]

The key-word is case sensitive.

- : makes a string search ( * wildcard at the end makes a string search with a specific beginning followed by any characters)
- > gives a numerical greater than comparison.
- < gives a numerical less than comparison.

- Artist:ABBA
- Name:Pat*
- Id:010203
- Latitude:58.41*
- City:London
- Size:42
- Price<100
- Age>18

### Building the query tree

- All "plus" terms are combined with an AND relation, which simply means that all of them must exist.
- All "minus" terms are combined with an OR relation, and the group is added to the query with an AND_NOT relation, meaning that none of the terms must exist.
- All unprefixed terms with neither a plus or minus sign in front of them are combined with an OR relation, and then added to the query with an AND_MAYBE relation. This means that they do not have to be present, but objects that do include them will get higher ranking than those which don't.
- Prefixed terms with neither a plus or minus sign in front of them are grouped by their prefix. All terms with the same prefix are grouped with an OR relation, and all groups are then combined with an AND relation. The group of groups is then added to the query with a FILTER relation, which is equivalent with an AND relation, except that FILTER terms do not affect the ranking at all.

A term is the word or phrase you wish to search for. Phrases are always enclosed by single or double quotes. The prefix, which is optional, is the key name. Finally, you may include a + or - sign in front of the prefix (or term, if there is no prefix) to indicate that the term must or must not exist.

See below for example queries that might make it easier to understand how the query tree is created from a query string.

### System key/value terms and prefixes

There are a few pre-defined key/values in the meta-data that are bound to a so-called query prefix, and they are listed below. A query prefix is just a way of saying that the specific word has a special meaning and should be searchable as such. For example the title prefix, means that the words in the title for an object will not only be indexed as-is, but also with a prefix. title:spring finds objects that contain the word 'spring' in the title.. Note, title has nothing to do with the name of the author or creator of an object.

The list of pre-defined prefixes is shown below, as well at the objects' key/value they are bound to. Using the meta-data capabilities of the database, an arbitrary number of key/value pairs can be added to an objects meta-data. They can be in the form of non-indexed key/value pairs, or indexed key/value pairs that are searchable using the query language (but take up more space). Non-indexed key/value pairs are not possible to use as terms in the query language.

All defined prefixes are boolean prefixes, which means that if specified in a query, boolean semantics apply and not probabilistic.

Some of the key/values (currently author, content, rights, keyword, recipient, summary, tag and title) will also be indexed stemmed, that is, in addition to being indexed as-is (but with a prefix), the root of the word will also be indexed (with the prefix). A query with the term keyword:phones will also match an entry with the value of the key 'phone'.

The key/values; keyword, summary and title and content will additionally be indexed without the prefix, since they are assumed to include textual content.

Additionally, the key/values; published, updated, 'link rel="alternate" length="..."' and title are treated special to make it possible to sort the query result based on these key/values.

The inner workings of meta-data has been modelled after the W3C Atom standard with the ability for user custom extensions of key/value data and tags. This means that the objects stored in the database are extended with meta-data and key/values.

The following keys and prefixes are not available on all objects. Please check the available key/values of an object or its data type before including terms in queries.

| Query prefix | Key/Value | Description |
|---|---|---|
| title | @name | An objects title or rather simply the title of the object. |
| tag | tag | A user-specified tag (like "family", "London", "My wedding" etc). |
| type | @mime | The object's MIME type of its main stream (first stream). |
| namespace | namespace | The XML namespace if the object is an XML document. |
| schema | schema | The W3C schema of an object that is of type XML document, if it is defined in the XML. |
| author | author | The author's name, email or URI. |
| country | country | A two-letter ISO country code (same as used in domain names). |
| flag | flag | A general-purpose key/value flag that can be used by applications. |
| keyword | keyword | Keywords that describe the object. |
| lang | lang | The language of the object as a two-character ISO code. |
| recipient | recipient | The recipient's name, email or URI. |
| rights | rights | A copyright string. |
|  | content | Full-text free-text index of the main stream (first stream). |
| summary | summary | A summary of the object's content. |
|  | @published | This key is not indexed as-is (see pubweek, pubmonth, pubyear). |
| pubweek |  | This prefix is calculated from the published key. |
| pubmonth |  | This prefix is calculated from the published key. |
| pubyear |  | This prefix is calculated from the published key. |
|  | startdate | This key is not indexed as-is (see month, week, year). |
|  | enddate | This key is not indexed as-is (see month, week, year). |
| week |  | This prefix is calculated from the startdate and enddate keys. |
| month |  | This prefix is calculated from the startdate and enddate keys. |
| year |  | This prefix is calculated from the startdate and enddate keys. |
| object | @id | The object ID as a decimal number. |
| container | @pid | The ID of the container the object is located in (a decimal number). |
|  | @id | This key is not indexed. |

### Data types and automatic indexing

Data types may be defined to automatically index and extract meta-data from the main stream (first stream) of objects that matches the data type.

It is good practice to leverage the system key/value pairs and have the data type store its automated indexed data types as one of the above if there is a need to include the key/value pairs in the query language. Key/value pairs like flag, and more can be effectively used. Custom-defined automated meta-data extraction is currently supported for objects of MIME-type XML.

The CloudBackend database is shipped with templates for many known document and MIME-types, whereof the database knows how to automatically extract relevant key/value pairs, like for instance IDV3 tags from mp3 files or EXIF data from photos. In order to make use of this automated meta-data extraction, you need to enable the data type templates that you need meta-data extraction for. Each tenant account comes with no data types activated.

### Flag prefix values in use

Flags are application specific and defined by the developer. These flags are used for some of the built-in capabilities of the CloudBackend database when it comes to certain MIME-types of documents (if the corresponding data types are activated for the tenant).

- hidden
- avatar

- answered
- deleted
- flagged
- seen
- draft
- recent

### Special handling of published

The key/values published will not be indexed as-is. Instead, the dates specified will be recalculated as pubyear/year (the year with 4 digits), pubmonth/month (the month as two digits, 01 to 12) and pubweek/week (the ISO week number, 01 to 53).

We will use the following object meta-data as a simplified example:

```xml
<db:object name="t1.txt" published="2024-12-09T10:24:42Z" updated="2024-12-09T10:24:42Z" mime="text/plain" cid="62958581623899" id="560495422" xlink:actuate="onRequest" xlink:href="home://t1.txt"/> 
```

- pubyear:2024
- pubmonth:12
- pubweek:50

The idea is that any object, be it a text document, picture, calendar entry, email or to-do note, can be marked with a date or date range. Relevant objects can then be found quickly and presented in a calendar or reminder view in an application.

### Special handling of startdate and enddate

The key/values; startdate and enddate will not be indexed as-is. In case of startdate and enddate, the full range will be indexed.

We will use the following object meta-data as a simplified example:

```xml
<db:object name="t1.txt" published="2024-12-01T01:00:00Z" updated="2024-12-02T10:24:42Z" mime="text/plain" cid="62958581623899" id="560495422" xlink:actuate="onRequest" xlink:href="home://t2.xml">
  <startdate date="2024-12-29" time="06:01:00" zone="Z"/>
  <enddate date="2025-01-01" time="17:59:59" zone="Z"/>
</db:object> 
```

- year:2024, year:2025
- month:12, month:01
- week:52, week:01

The idea is that any object, be it a text document, picture, calendar entry, email or to-do note, can be marked with a date or date range. Relevant objects can then be found quickly and presented in a calendar or reminder view in an application.

(Note that since the year, month and week is indexed individually, the application will have to post-filter the search result, since the query "({year:2024 AND month:12})" will yield a false match.)

### Special handling of content

The content key/value will always be removed from the object when it is returned from the database. However, it is still indexed (as-is and stemmed), which means that this key/value is perfect for full-text indexing. The client can thus easily create a full-text index of any object simply by serializing the object to plain text string, then put the text inside the key 'content' value.

### Handling of non-system key/values

When an unknown prefix is found, it is simply indexed as-is, with prefix. It will not be added without prefix. Unknown keys are not stemmed. This applies to all user defined key/values and tags.

Please note that key/value pairs and tags that are defined as non-indexed cannot be queried. They are retrieved by querying the object on other parameters and then retrieving the meta-data to view them. It is recommended to use non-indexed key/value pairs as the default for all meta-data that is not required to be searchable as this is much more economical with less used storage space for the tenant. It will also increase the query performance for the keys that really should be searchable.

### Multiple search words

Normal, plus and minus terms:

```query
dogs cats +black -cool -"hot dogs" 
```

The query above searches for items that include the words "dog" or "cat" in one of several key/values (currently keyword, summary and title or content). Note the singular form! Unprefixed words are stemmed. Additionally, the word "black" must be present in the objects key/values for a match. The word "cool" and the phrase "hot dogs", on the other hand, must not be present at all.

The query above will be translated into the following query tree:

```query
(("black") AND_MAYBE ("dog" OR "cat")) AND_NOT ("cool" OR "hot dogs") 
```

If the query instead had been written using an initial capital letter on the words "dogs" or "cats", or had these words been quoted, like this:

```query
"dogs" cats +black -cool -"hot dogs" 
```

The resulting query tree would have been:

```query
(("black") AND_MAYBE ("dogs" OR "cats")) AND_NOT ("cool" OR "hot dogs") 
```

(Note the plural form on "dogs" and "cats".)

#### Prefixed terms

Consider the following query:

```query
title:money 
```

It will simply find all objects that include the word "money" in the title.

The next query will find all objects that describe JPEG or GIF images (based on the objects MIME-type, which requires that the object has a main stream 0 from where the MIME-type is deducted. Objects can not be queried on MIME-type for stream 1..n), and has the word "money" in the title key/value.

```query
title:money type:image/png type:image/gif 
```

Note that since the type key/value is searched for twice, the terms image/png and image/gif are combined with an OR relation, like this:

```query
"title:money" AND (type:image/png OR type:image/gif) 
```

This is probably the expected behavior for most key/values, but perhaps not all. Suppose one would like to find all objects that include the words "money" and "dollar" in the title key/value. The following query would not work:

```query
title:money title:dollar 
```

This is becuase it would return all objects with either the word "money" or the word "dollar" in it. Here the prefixed "plus" terms should be used:

```query
+title:money +title:dollar 
```

The query above will correctly translate into the correct query tree:

```query
title:money AND title:dollar 
```

#### Date queries

The following query example will return a set of candidate objects to be displayed in a calendar view of January 2025:

```query
year:2025 month:01 
```

### Additional query parameters

In addition to the query language, each query done using the query language may also include these parameters to further refine the query result.

These parameters are used to optimize, paginate, sort, or add special handling to executed queries. Please see the documentation for respective SDK on how to provide and use these parameters.

| Parameter | Description |
|---|---|
| query | The supplied query language string to search for |
| filter | A regular expression that is used to filter each result entry. See below for more information. |
| offset | The offset of the first object item to return, when paginating the query result list using count. The default, if unspecified, is 0. Please note that pagination is always turned on by default with count below. |
| count | The number of item objects to return. The default is 100. Use pagination to access objects beyond this specified count. |
| order | The sort order of the query result. The sort key can be any of these default meta-data key/values; title, published, updated and length. The default, if not present, is to sort by relevance according to the search criteria. |
| locale | A locale (like en_US or sv_SE) to be used when sorting. If unspecified or illegal, the C++ locale will be used. |
| numeric | Use numeric sorting, so for example Q9 comes before Q10. |
| ascending | The sort order for the query list, can be true or false. The default is true. |
| include_deleted | If selected, deleted revisions of objects will be included in the query result. This allows displaying a list of all previous revisions of an object. Can be set to true or false (default). If turned on, a key named 'dc:deleted' will appear on all previous revisions of the object with the value 'true'. |
| checksum | Can be true or false (default). Object items are returned with the key 'md5' if turned on. The value will be the MD5 checksum of the main stream of each object (first stream). Please note: If set to 'true', it will make most other parameters like query, filter and order ineffective and bypassed, as the datasrc parameter is set to 'db'. |
| datasrc | Can be 'default' (default) or 'db'. When running with the default data source, queries can be performed on the objects key/values. If set to 'db', it makes the query result sorted by title and includes all objects in the specified container(s), as the query runs in simple mode. The benefit of invoking the simple 'db' mode is that it yields much faster responses and allows for an optimization when more complex queries using the Query Language is not required. |

### Topics

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/query-language>*

---
