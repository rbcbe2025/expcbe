# CloudBackend SDK — classes and how-tos

The class-by-class SDK documentation (C++, Java, Swift share one object model), plus installation, references and security pages.

107 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Account](#account)
- [account data](#account-data)
- [rootContainer](#rootcontainer)
- [rootContainerId](#rootcontainerid)
- [tenantContainerId](#tenantcontainerid)
- [Container](#container)
- [ACL](#acl)
- [Adding object](#adding-object)
- [createObject Key/Values](#createobject-key-values)
- [createObject](#createobject)
- [upload](#upload)
- [uploadBinary](#uploadbinary)
- [Manage](#manage)
- [createContainer](#createcontainer)
- [move](#move)
- [remove](#remove)
- [rename](#rename)
- [Sharing](#sharing)
- [Core Object](#core-object)
- [Classes](#classes)
- [Methods](#methods)
- [addListener](#addlistener)
- [castContainer](#castcontainer)
- [castObject](#castobject)
- [cloudBackend data](#cloudbackend-data)
- [logIn](#login)
- [removeListener](#removelistener)
- [Sequence diagram](#sequence-diagram)
- [Synchronous vs. Asynchronous](#synchronous-vs-asynchronous)
- [Filter](#filter)
- [composite query](#composite-query)
- [filter get calls](#filter-get-calls)
- [filter set calls](#filter-set-calls)
- [prefixed terms](#prefixed-terms)
- [Group](#group)
- [listGroups](#listgroups)
- [listMembers](#listmembers)
- [Install](#install)
- [iOS](#ios)
- [Linux](#linux)
- [Item](#item)
- [item data](#item-data)
- [Key/Value](#key-value)
- [createObject Key/Values](#createobject-key-values)
- [keyValues()](#keyvalues)
- [updateKeyValues](#updatekeyvalues)
- [Object](#object)
- [ACL](#acl)
- [Manage](#manage)
- [move](#move)
- [remove](#remove)
- [rename](#rename)
- [Manipulating](#manipulating)
- [download](#download)
- [downloadBinary](#downloadbinary)
- [downloadStream](#downloadstream)
- [updateKeyValues](#updatekeyvalues)
- [uploadStream](#uploadstream)
- [Object data](#object-data)
- [Sharing](#sharing)
- [query Container](#query-container)
- [query with filter](#query-with-filter)
- [query with join](#query-with-join)
- [query with path](#query-with-path)
- [query](#query)
- [search with filter](#search-with-filter)
- [search with tag](#search-with-tag)
- [query Database](#query-database)
- [query with filter](#query-with-filter)
- [query with path](#query-with-path)
- [query](#query)
- [search with filter](#search-with-filter)
- [search with tag](#search-with-tag)
- [Querying](#querying)
- [QueryResult (ResultSet)](#queryresult-resultset)
- [bypassCache](#bypasscache)
- [getItemsSnapshot](#getitemssnapshot)
- [queryResult data](#queryresult-data)
- [References](#references)
- [C++](#c)
- [Java](#java)
- [Swift](#swift)
- [XIOS/3](#xios-3)
- [Security](#security)
- [Sharing](#sharing)
- [Sharing](#sharing)
- [ACL](#acl)
- [getAcl](#getacl)
- [setAcl](#setacl)
- [Publish/Subscribe](#publish-subscribe)
- [getPublished](#getpublished)
- [getSubscriptions](#getsubscriptions)
- [publish](#publish)
- [subscribe](#subscribe)
- [unpublish](#unpublish)
- [unsubscribe](#unsubscribe)
- [Shares](#shares)
- [listAvailableShares](#listavailableshares)
- [listMyShares](#listmyshares)
- [share](#share)
- [unshare](#unshare)
- [Stream](#stream)
- [downloadStream](#downloadstream)
- [getStreams](#getstreams)
- [streams](#streams)
- [uploadStream](#uploadstream)
- [Tutorial](#tutorial)

## Account

Account class offers access to a root Container and has additional information on the account like the username as well as a user's first and last name.

The account is the entry point into the user's account and Container structure through the root container.

### Declaration

**Declaring the Account object**

*Java*

```java
cbe.Account account = new Account() 
```

*Swift*

```swift
var account = CBEAccount() 
```

*C++*

```cpp
cbe::Account account 
```

The variable is assigned the account. Once signed in, the developer will be able to access the user's account, containers, Objects and other functionalities.

### Usage — example

**get the Account information after login**

*Java*

```java
cbe.Account account = cbobj.account(); 
```

*Swift*

```swift
let account = cloudBackend.account(); // Note: account becomes optional when defined like this
```

*C++*

```cpp
cbe::Account account = cloudBackend.account(); 
```

Account holds useful information, see below.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account>*

---

## account data

These calls listed shall return account specific information.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `userId()` | numeric | unique number | user account number |
| `username()` | string | login name | user account name |
| `source()` | string | parent user | tenant of the user being signed in |
| `firstName()` | string | registered | first name of the user identity |
| `lastName()` | string | registered | last name of the user identity |
| `rootContainer()` | pointer | class | the home root Container of the account |
| `tenantContainerId()` | numeric | unique number | the tenant top Container of the account |

#### Usage — example example

**Print account information**

*Java*

```java
System.out.println("logged as: " + cloudBackend.account().username()); 
```

*Swift*

```swift
NSLog("logged as:  %@", cloudBackend.account().username());
```

*C++*

```cpp
std::cout << "logged as: " << cloudBackend.account().username()) << std::endl; 
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account/account-data>*

---

## rootContainer

This returns the rootContainer that belongs to the account.

### Declaration

**Declare the root container**

*Java*

```java
cbe.Container rootContainer = new Container() 
```

*Swift*

```swift
var rootContainer = CBEContainer()
```

*C++*

```cpp
cbe::Container rootContainer 
```

### Usage — example

**Fetch the Account information**

*Java*

```java
myRootContainer = account.rootContainer();
  // or
myRootContainer = cbobj.account().rootContainer(); 
```

*Swift*

```swift
let myRootContainer = account?.rootContainer(); // ? due to optional value
  // or
let myRootContainer = cloudBackend.account().rootContainer(); 
```

*C++*

```cpp
myRootContainer = account.rootContainer();
  // or
myRootContainer = cloudBackend.account().rootContainer(); 
```

### Result

The call will give the top home root Container of this account.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account/rootcontainer>*

---

## rootContainerId

This returns the rootContainerId number of the root container also known as `home://`

### Declaration

**Declaring the root Container id**

*Java*

```java
ContainerId cid1 
```

*Swift*

```swift
var cid1 = CBEContainerId()
```

*C++*

```cpp
cbe::ContainerId cid1 
```

### Usage — example

**Get the root Container id of home://**

*Java*

```java
cid1 = myRootContainer.id(); 
```

*Swift*

```swift
if let Container = myRootContainer  {
    cid1 = root.id()
    print(cid1);
  } else {
    NSLog("container can not be unwrapped");
}
```

*C++*

```cpp
cid1 = myRootContainer.id(); 
```

### Result

The call will give the numeric id of the top home root Container of this account.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account/rootcontainerid>*

---

## tenantContainerId

This returns the tenantContainerId number of the top container also known as `tenant://`

### Declaration

**Declaring the tenant Container id**

*C++*

```cpp
cbe::ContainerId cbe::Account::tenantContainerId() const 
```

### Usage — example

**Get the top Container id of tenant://**

*C++*

```cpp
tenantTopContainerId = cloudBackend.Account().tenantContainerId(); 
```

### Result

The call will give the numeric id of the tenant group top Container of this account.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account/tenantcontainerid>*

---

## Container


Container class provides a convenient way to organize data in your account and can be used to hold Objects and other sub-containers in a hierarchical tree.

To start working with data in an account one can begin with the root Container located on the account. Here you can start creating objects, uploading, querying Container contents, and creating sub-containers.

#### Usage — example

**Example createObject()**

*Java*

```java
Container rootContainer = cbobj.account().rootContainer();
rootContainer.query(delegate);
rootContainer.createObject(name, keyValues, delegate); 
```

*Swift*

```swift
var rootContainer = cloudBackend.account().rootContainer();
rootContainer.query(self);
rootContainer.createObject(name, delegate: self, keyValues: keyValues);
```

*C++*

```cpp
cbe::Container rootContainer = cloudBackend.account().rootContainer();
rootContainer.query(delegate);
rootContainer.createObject(name, keyValues, delegate); 
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container>*

---

## ACL

See the separate section containing information on how to limit access to data that is to be shared:

- [Sharing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/sharing)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/acl>*

---

## Adding object

This describes how to add data as Objects in a container.

**Caution! The name may not contain characters:**

- ? / \ ( ) # * : [ ] | % & < " ' ! { }

Implement relevant calls in sub-classes of cbe::delegate:: and cbe::delegate::container:: to receive the callbacks needed.

- createObject()
- createObject() with added metadata
- upload()
- uploadBinary()



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/adding-object>*

---

## createObject Key/Values

Creates an empty Object with specific Key/Value pairs. Each key/value pair can optionally be indexed for faster query searches later on.

### Declaration

```java
container.createObject(name, keyValues, delegate) 
```

```swift
-(CBEObject*) createObject:(NSString*) name delegate:(id<CreateObjectDelegatePtr>) delegate keyValues:(NSDictionary*) keyValues;
```

```cpp
cbe::Object cbe::Container::createObject(std::string name, cbe::KeyValues keyValues, CreateObjectDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | Object title name |
| `keyValues` | cbe::KeyValues | optional | Key/Value map like Obj_KV_Map(String key, tuple(String value, boolean indexed) ) N.B. The order of parameters change from version 2.1. |
| `delegate` | shared pointer | for callback | uses callback onCreateObjectSuccess() or onCreateObjectError() in class cbe::delegate::CreateObjectDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onCreateObjectSuccess() and onCreateObjectError() in class cbe::delegate::CreateObjectDelegate to receive the callback.

**Example createObject() with key/value**

*Java*

```java
boolean myIndexed;
String myKey;
String myValue;
String name;
Obj_KV_Map myKeyValues = new Obj_KV_Map();
Obj_VI_Pair myDataValue;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myDataValue = new Obj_VI_Pair(myValue, myIndexed);
myKeyValues.put(myKey, myDataValue);
myObject = container.createObject(name, myKeyValues, delegate); 
```

*Swift*

```swift
//Try create object
var myIndexed = "true";
var name = "SE";
var myKey= "CNTRY";
var myValue = "Sweden";
var myKeyValues = Dictionary<String, Dictionary<String, Bool>>();
var keyValue = Dictionary<String, Bool>();
keyValue["myValue"] = true;
myKeyValues[myKey] = keyValue;
NSLog("test createObject");
container.createObject(name, delegate: self, keyValues: myKeyValues); 
```

*C++*

```cpp
bool myIndexed;
std::string myKey;
std::string myValue;
std::string name;
cbe::KeyValues myKeyValues;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myKeyValues.insert(KeyValues(myKey, std::make_pair(myValue, myIndexed)));
std::shared_ptr<CreateObjectDelegate> createObjectDelegate = std::make_shared<CreateObjectDelegate>();
myObject = container.createObject(name, myKeyValues, createObjectDelegate);
createObjectDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::CreateObjectDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onCreateObjectSuccess() will be called if call succeeds
- onCreateObjectError() will be called if call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/adding-object/createobject-key-values>*

---

## createObject

Creates an empty Object with minimum space, i.e. no Stream and no key/Values.

### Declaration

```java
container.createObject(name, delegate) 
```

```swift
-(CBEObject*) createObject:(NSString*)name delegate:(id<CreateObjectDelegatePtr>)delegate keyValues:(NSDictionary*)keyValues;
```

```cpp
cbe::Object cbe::Container::createObject(std::string name, CreateObjectDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | Object title name |
| `delegate` | shared pointer | for callback | uses callback onCreateObjectSuccess() or onCreateObjectError() in class cbe::delegate::CreateObjectDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onCreateObjectSuccess() and onCreateObjectError() in class cbe::delegate::CreateObjectDelegate to receive the callback.

**Example createObject() empty**

*Java*

```java
myEmptyObject = container.createObject(name, delegate); 
```

*Swift*

```swift
myEmptyObject = container.createObject(name, delegate:self) 
```

*C++*

```cpp
std::shared_ptr<CreateObjectDelegate> createObjectDelegate = std::make_shared<CreateObjectDelegate>();
myEmptyObject = container.createObject(name, createObjectDelegate);
createObjectDelegate->waitForRsp();
if (createObjectDelegate->errorInfo){
  std::cout << "Error: Could not create object." << std::endl;
  std::cout << createObjectDelegate->errorInfo << std::endl;
}  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::CreateObjectDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onCreateObjectSuccess() will be called if the call succeeds
- onCreateObjectError() will be called if the call fails

#### CLI — how to

The **create** [name] command in the CLI tool will create a minimal object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/adding-object/createobject>*

---

## upload

Will upload a local file to the Container. The Object is instantly returned with a temporary id. Once the response from the server is called back, the Object gets updated with the correct, unique Object id.

### Declaration

```java
container.upload(name, path, delegate) 
```

```cpp
cbe::Object cbe::Container::upload(const std::string & name, const std::string & path, UploadDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | Object title name to be fetched |
| `path` | string | title | the local path to the directory where the Object is to be fetched, ending with a / |
| `delegate` | shared pointer | for callback | uses callbacks onChunkSent() and onUploadSuccess() or onUploadError() in class cbe::delegate::UploadDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUploadSuccess() and onUploadError() in class cbe::delegate::UploadDelegate to receive the callback.

It is optional to implement callback onChunkSent() which is useful if a progress indication of the upload is wanted.

**Example file upload() to container**

*Java*

```java
MyUploadDelegate delegate = new MyUploadDelegate();
theObject = container.upload(name, path, delegate);
if (!theObject.idLoaded()) {
  System.out.println("Object creation failed!");
  return;
} else {
  System.out.println("Object created id: " + theObject.id());
}  
```

*C++*

```cpp
std::shared_ptr<UploadDelegate> uploadDelegate = std::make_shared<UploadDelegate>();
theObject = container.upload(name, path, uploadDelegate);
uploadDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UploadDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onUploadSuccess() will be called if the call succeeds
- onUploadError() will be called if the call fails

The following callback is optional:

- onChunkSent() will be called during the progress of the upload indicating how much has been done so far.

#### CLI — how to

The **upload** [name] command in the CLI tool will upload an Object to the cloud.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/adding-object/upload>*

---

## uploadBinary

Will upload a local file to the Container with the referenced binary data held in memory. The Object is instantly returned with a temporary id. Once the response from the server is called back, the Object gets updated with the correct unique Object id.

### Declaration

**Declare memory uploadBinary()**

*Java*

```java
container.uploadBinary(name, byteData, delegate) 
```

*Swift*

```swift
-(CBEObject*) upload:(NSString*)name length:(uint64_t) length data:(NSData*) data delegate:(id<UploadDelegatePtr>) delegate; 
```

*C++*

```cpp
cbe::Object cbe::Container::upload(const std::string & name, std::uint64_t length, char * byteData, UploadDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | name to be given the Object title |
| `length` | 64 bit long integer | Bytes | is the length of the Object in bytes |
| `byteData` | byte array | in memory | the byte array containing the data in memory |
| `delegate` | shared pointer | for callback | uses callbacks onChunkSent() and onUploadSuccess() or onUploadError() in class cbe::delegate::UploadDelegate |

### Usage — example

**asynchronous call**

**Example memory upload() to container**

*Java*

```java
binaryPath="../resources/Music1.mp3";
byte[] dataInMemory = Files.readAllBytes(binaryPath);
MyUploadDelegate delegate = new MyUploadDelegate();
theObject = container.uploadBinary(prop.getProperty(fileName), dataInMemory, delegate);
if (!theObject.idLoaded()) {
  System.out.println("Object creation failed!");
  return;
} else {
  System.out.println("Object created id: " + theObject.id());
}  
```

*Swift*

```swift
var theObject = container.upload(name, length:lengthOfData, byteData:data, delegate:self);
```

*C++*

```cpp
std::shared_ptr<UploadDelegate> uploadDelegate = std::make_shared<UploadDelegate>();
theObject = container.upload(name, length, byteData, uploadDelegate);
uploadDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UploadDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onUploadSuccess() will be called if the call succeeds
- onUploadError() will be called if the call fails

The following callback is optional:

- onChunkSent() will be called during the progress of the upload indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/adding-object/uploadbinary>*

---

## Manage

This describes how to organize sub-containers.

The variants are:

- createContainer()
- move()
- remove()
- rename()



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/manage>*

---

## createContainer

Call to create a sub-container inside this Container in a hierarchy.

### Declaration

**Declare createContainer()**

*Java*

```java
container.createContainer(name, delegate) 
```

*Swift*

```swift
-(CBEContainer*) createContainer:(NSString*) name delegate:(id<CreateContainerDelegatePtr>) delegate;
```

*C++*

```cpp
cbe::Container cbe::Container::createContainer(const std::string & name, CreateContainerDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name()` | string | title | new sub-container name |
| `delegate` | shared pointer | for callback | uses callback onCreateContainerSuccess() or onCreateContainerError() in class cbe::delegate::CreateContainerDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onCreateContainerSuccess() and onCreateContainerError() in class cbe::delegate::CreateContainerDelegate to receive the callback.

**Example createContainer()**

*Java*

```java
subContainer = container.createContainer(name, delegate); 
```

*Swift*

```swift
var subContainer = container.createContainer(name, delegate:self); 
```

*C++*

```cpp
std::shared_ptr<CreateContainerDelegate> createContainerDelegate = std::make_shared<CreateContainerDelegate>();
subContainer = container.createContainer(name, createContainerDelegate);
createContainerDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::object::CreateContainerDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onCreateContainerSuccess() will be called if the call succeeds
- onCreateContainerError() will be called if the call fails

#### CLI — how to

The **mkdir** [container] command in the CLI tool will create a sub-container.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/manage/createcontainer>*

---

## move

Call is used to move Container with its content to another place in the hierarchy e.g. `id()` of destination Container or the rootContainerId.

### Declaration

**Declare move()**

*Java*

```java
container.move(destinationId, delegate) 
```

*Swift*

```swift
-(void) move:(CBEContainerId) destinationId delegate:(id<MoveContainerDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Container::move(cbe::ContainerId destinationId, MoveDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `destinationId()` | cbe::ContainerId | unique number | id number of the Container to move into as sub-container (64 bit long integer) |
| `delegate` | shared pointer | for callback | uses callback onMoveSuccess() or onMoveError() in class cbe::delegate::container::MoveDelegate to receive the callback. |

### Usage — example

**Asynchronous call**

Implement callbacks onMoveSuccess() and onMoveError() in class cbe::delegate::container::MoveDelegate to receive the callback.

**Example move()**

*Java*

```java
container.move(destinationId, delegate); 
```

*Swift*

```swift
myContainer.move(destinationId, delegate:self);
```

*C++*

```cpp
std::shared_ptr<MoveDelegate> moveDelegate = std::make_shared<MoveDelegate>();
myContainer.move(destinationId, moveDelegate);
createContainerDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::container::MoveDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onCreateContainerSuccess() will be called if the call succeeds
- onCreateContainerError() will be called if the call fails

#### CLI — how to

The **mv** [container] [destination] command in the CLI tool will move a container.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/manage/move>*

---

## remove

Call is used to delete Container with all its content.

Note! All of its content of Objects and sub-containers will be deleted.

### Declaration

**Declare remove()**

*Java*

```java
container.remove(delegate) 
```

*Swift*

```swift
-(void) remove:(id<RemoveContainerDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Container::remove(RemoveDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `destinationId()` | 64 bit long integer | unique number | id number of the Container to move into as a sub-container |
| `delegate` | shared pointer | for callback | uses callback onRemoveSuccess() or onRemoveError() in class cbe::delegate::container::RemoveDelegate to receive the callback. |

### Usage — example

**Asynchronous call**

Implement callbacks onRemoveSuccess() and onRemoveError() in class cbe::delegate::container::RemoveDelegate to receive the callback.

**Example remove()**

*Java*

```java
container.remove(delegate); 
```

*Swift*

```swift
myContainer.remove(delegate); 
```

*C++*

```cpp
std::shared_ptr<RemoveDelegate> removeDelegate = std::make_shared<RemoveDelegate>();
myContainer.remove(removeDelegate);
removeDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::container::RemoveDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onRemoveSuccess() will be called if the call succeeds
- onRemoveError() will be called if the call fails

#### CLI — how to

The **rmdir** [container] command in the CLI tool will delete a sub-container.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/manage/remove>*

---

## rename

Call to change the name of the container. However, the rootContainer name can not be changed.

### Declaration

**Declare rename()**

*Java*

```java
container.rename(name, delegate) 
```

*Swift*

```swift
-(void) rename:(NSString*) name delegate:(id<RenameContainerDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Container::rename(const std::string & name, RenameDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name()` | string | title | new name for this container |
| `delegate` | shared pointer | for callback | uses callback onRenameSuccess() or onRenameError() in class cbe::delegate::container::RenameDelegate |

### Usage — example

**asynchronous call**

**Example rename()**

*Java*

```java
container.rename(name, delegate); 
```

*Swift*

```swift
container.rename(name, delegate:self); 
```

*C++*

```cpp
std::shared_ptr<RenameDelegate> renameDelegate = std::make_shared<RenameDelegate>();
myContainer.rename(newName, renameDelegate);
renameDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::container::RenameDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onRenameSuccess() will be called if the call succeeds
- onRenameError() will be called if the call fails

#### CLI — how to

The **renamedir** [container] [new name] command in the CLI tool will change the name of a sub-container.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/manage/rename>*

---

## Sharing

See the separate section containing information on how to share data:

- Sharing

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container/sharing>*

---

## Core Object

The CloudBackend class is the core Object and entry point for using the SDK. Creating an instance of CloudBackend will be the first thing to do.

In order to initiate the core CloudBackend object, you need to call the `logIn()` method in the CloudBackend class. This will return the CloudBackend Object instance that holds the currently logged in identity (user) and the Databases available for that identity.

### Declaration

**Declaring the CloudBackend object**

*Java*

```java
cbe.CloudBackend cbobj 
```

*Swift*

```swift
CloudBackend cloudBackend 
```

*C++*

```cpp
cbe::CloudBackend cloudBackend 
```

Once signed in, the CloudBackend Object will be able to access the identity's account, containers, Objects and other functionality. See the Account section for more information on how to use the account object.

#### Example

**Login to CloudBackend async**

*Java*

```java
cbe.CloudBackend cbobj = cbe.CloudBackend.logIn(username, password, tenant, client, delegate); 
```

*Swift*

```swift
CloudBackend.login(username, password:password, tenant:tenant, client:client, delegate:self); 
```

*C++*

```cpp
cbe::CloudBackend cloudBackend = cbe::CloudBackend::logIn((username, password, tenant, client, delegate); 
```

**C++ sync exception**

```cpp
cbe::CloudBackend cloudBackend = cbe::CloudBackend::logIn((username, password, tenant, client); 
```

**C++ sync non-throwing**

```cpp
cbe::CloudBackend cloudBackend = cbe::CloudBackend::logIn((username, password, tenant, client, error); 
```

When you have signed in and have fetched the identity's account, you will be able to access the root Container of the identity's main Database as shown under the Account. In the root Container you will be able to perform queries to see what is in the identity's personal Database and add data as shown under Containers.

> **Note:** Please note that the identity may hold multiple personal Databases and may have access to the shared tenant Database as well as Databases belonging to groups.

The Account root Container only points to the identity's main database. There are additional methods to list available Databases and retrieve the root Container of each one of them.

Querying will return Items that can be either Containers or Objects as detailed under Items.

At the end of the client program, finish the SDK session by calling terminate().

#### Example

**Terminating the connection**

*Java*

```java
cbobj.terminate(); 
```

*C++*

```cpp
cloudBackend.terminate(); 
```

#### Further reading

Example code is supplied with the SDK bundle, and gives a working example of how to get code and callbacks to work together.

For a detailed walkthrough of how to get started using the CloudBackend SDK and example code, see the [SDK tutorials](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object>*

---

## Classes

These are the main classes available when writing programs using the CloudBackend SDK.


##### For more information on:

[CloudBackend (Core Object)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object) | Account | Container | Object | [Item](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object) | [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) | [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter)

### Object

More details around the Object class.


### Group

More details around the Group class.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes>*

---

## Methods

The following sub-sections contains methods in the CloudBackend core Object that holds all states for one logged-in, authenticated identity belonging to a tenant.

From the CloudBackend core object; databases, groups, and more that the identity has been granted access to, can be explored. This includes the shared Database for the Tenant group, which is common to all member identities.

#### For more information see:

[Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes) [Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes) [Stream](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes) [Key/Value](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods>*

---

## addListener

Adds a listener that will receive updates as changes occur on the account.

Accounts are always updated automatically, but the notification of the update is provided by the listener functionality.

> **Note:** removeListener() should always be called when you stop using the delegate.

### Declaration

**Declaring addListener()**

*Java*

```java
ListenerHandle addListener(CloudBackendListenerDelegate delegate) 
```

*C++*

```cpp
ListenerHandle cbe::CloudBackend::addListener(cbe::delegate::CloudBackendListenerDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | on Objects | Callbacks: onRemoteObjectAdded(), onRemoteObjectMoved(), onRemoteObjectRemoved(), onRemoteObjectRenamed() in class CloudBackendListenerDelegate on event |
| `delegate` | shared pointer | on Containers | Callbacks: onRemoteContainerAdded(), onRemoteContainerMoved(), onRemoteContainerRemoved(), onRemoteContainerRenamed() in class CloudBackendListenerDelegate on event |
| `handle` | ListenerHandle | return | Handle identifying the registration of the listener. Save it to be used later when to deregister with removeListener(). |

### Usage — example

**Asynchronous call**

**Example addListener()**

*Java*

```java
MyLogInDelegate delegate = new MyListenerDelegate();
myHandle=cbobj.addListener(delegate);
while (!delegate.finished) {
  try
  {
      Thread.sleep(10);
  }
  catch(Exception e)
  {
        System.out.println(e);
  }
}   
```

*C++*

```cpp
std::shared_ptr<CloudBackendListenerDelegate> cloudBackendListenerDelegate = std::make_shared<CloudBackendListenerDelegate>();
myHandle=cloudBackend.addListener(delegate);
cloudBackendListenerDelegate->waitForRsp();
if (cloudBackendListenerDelegate->errorInfo){
  std::cout << "Error: addListener" << std::endl;
}  
```

### Result

The call will get the result as an asynchronous callback via the **itemDelegate** that implements the class **CloudBackendListenerDelegate**

Different callbacks are possible:

#### Object

- onRemoteObjectAdded() — after an Object has been added
- onRemoteObjectMoved() — after an Object has been moved
- onRemoteObjectRemoved() — after an Object has been removed
- onRemoteObjectRenamed() — after an Object has been renamed
- onObjectUpdated() — after an Object has been updated
- onMetadataAdded() — after metadata has been added to an object
- onStreamsLoaded() — after an Object has been updated with a stream

#### Container

- onRemoteContainerAdded() — after a Container has been added
- onRemoteContainerMoved() — after a Container has been moved
- onRemoteContainerRemoved() — after a Container has been removed
- onRemoteContainerRenamed() — after a Container has been renamed
- onContainerRestored() — after a Container has been restored after being deleted

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/addlistener>*

---

## castContainer

Copies an Item from a [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) to a Container. This is intended as a helper function.

### Declaration

**Declaring castContainer()**

*Java*

```java
static Container castContainer(Item item) 
```

*C++*

```cpp
static cbe::Container castContainer(cbe::Item item) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `item` | Item pointer | from QueryResult | the item you want to cast into a Container. |

### Usage — example

**Example castContainer()**

*Java*

```java
cbe.Container myContainer = com.cbe.CloudBackend.castContainer(item); 
```

*C++*

```cpp
cbe::Container myContainer =  cbe::CloudBackend::castContainer(item); 
```

### Result

The call will create a Container-based, casted copy of the Item.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/castcontainer>*

---

## castObject

Copies an Item from a [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) into an Object. This is intended as a helper function.

### Declaration

**Declaring castObject()**

*Java*

```java
static Object castObject(Item item) 
```

*C++*

```cpp
static cbe::Object castObject(cbe::Item item) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `item` | Item pointer | from QueryResult | the item you want to cast into an Object. |

### Usage — example

**Example castObject()**

*Java*

```java
cbe.Object myObject = com.cbe.CloudBackend.castObject(item); 
```

*C++*

```cpp
cbe::Object myObject = cbe::CloudBackend::castObject(item); 
```

### Result

The call will create an Object-based, casted copy of the Item.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/castobject>*

---

## cloudBackend data

These calls return login session specific information.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `account()` | pointer | class | the account of this session, see Account |
| `version()` | string | SDK | the version of the SDK used as API |
| `terminate()` | void | close | terminates the SDK session; to be called prior to the end of the client program. |

#### Usage — example

**Example terminate()**

*Java*

```java
cbe.Account myAccount = cbobj.account();
System.out.println("SDK version: " + cbobj.version());
cbobj.terminate();
```

*Swift*

```swift
let myAccount = cloudBackend.account(); // Note: myAccount becomes optional when defined like this
NSLog("SDK version:  %@", cloudBackend.version());
```

*C++*

```cpp
cbe::Account myAccount = cloudBackend.account();
std::cout << "SDK version: " << cloudBackend.version()) << std::endl;
cloudBackend.terminate();
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/cloudbackend-data>*

---

## logIn

logIn() should be the first function called when using the SDK as it gives access to all the other functionality within the SDK as well as authenticates the specified identity (user).

### Declaration

**Declaring logIn() async**

*Java*

```java
cbe.CloudBackend logIn(username, password, tenant, client, delegate) 
```

*Swift*

```swift
+(id)login:(NSString*)username password:(NSString*)password tenant:(NSString*)tenant client:(NSString*)client delegate:(id<LogInDelegatePtr>)delegate;
```

*C++*

```cpp
static cbe::CloudBackend logIn(const std::string& username, const std::string& password, const std::string& tenant, const std::string& client, LogInDelegatePtr delegate) 
```

**C++ sync exception**

```cpp
static cbe::CloudBackend logIn(const std::string& username, const std::string& password, const std::string& tenant, const std::string& client) 
```

**C++ sync non-throwing**

```cpp
static cbe::CloudBackend logIn(const std::string& username, const std::string& password, const std::string& tenant, const std::string& client, LogInError& error) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `username` | string | unique name | of the user being signed in |
| `password` | string | secret | of the user being signed in (case sensitive) |
| `tenant` | string | parent owner | tenant of the user being signed in |
| `client` | string | platform | tenant defined label describing what environment the program is running in, e.g. browser, desktop, linux_desktop, embedded, iot |
| `error` | strings | reason, message, context | if the callback encounters an error, this parameter will bring information about what did occur |
| `delegate` | shared pointer | thread address | uses callbacks onLogInSuccess() or onLogInError() in class cbe::delegate::LogInDelegate on this completion |

### Usage — example

**Asynchronous call**

Implement callbacks onLogInSuccess() and onLogInError() in class cbe::delegate::LogInDelegate to receive the callback.

**Example logIn() async**

*Java*

```java
MyLogInDelegate delegate = new MyLogInDelegate();
cbobj = cbe.CloudBackend.logIn(username, password, tenant, client, delegate);
while (!delegate.finished) {
  try
  {
    Thread.sleep(10);
  }
  catch(Exception e)
  {
    System.out.println(e);
  }
}
if (cbobj.account().userId()>0) {
  System.out.println("Login:");
  System.out.println("SDK version = " + cbobj.version());
  System.out.println("   username = " + cbobj.account().username());
  System.out.println("     userId = " + cbobj.account().userId());
  System.out.println("     tenant = " + cbobj.account().source());
  System.out.println(" first name = " + cbobj.account().firstName());
  System.out.println("  last name = " + cbobj.account().lastName());
} else {
  System.out.println("Login failed. Exit program.");
  cbobj.terminate();
  return 1;
}   
```

*Swift*

```swift
var cbe: CloudBackend!;
CloudBackend.login("username", password: "password", tenant: "tenant", client: "client", delegate: self);

func onLog(inSuccess cloudBackend: CloudBackend!) {
  NSLog("Login: ");
  NSLog(" SDK version = %@", cloudBackend.version());
  NSLog("    username = %@", cloudBackend.account().username());
  NSLog("      userId = %u", cloudBackend.account().userId());
  NSLog("      tenant = %@", cloudBackend.account().source());
  NSLog("  first name = %@", cloudBackend.account().firstName());
  NSLog("   last name = %@", cloudBackend.account().lastName());

  cbe = cloudBackend;
  if let a = cloudBackend.account() {
      NSLog("Account: %@", a);
  }
}

func onLog(inError error: CBEError!, context: CBEContext!) {
    NSLog("LogIn error ");
}
```

*C++*

```cpp
std::shared_ptr<LogInDelegate> logInDelegate = std::make_shared<LogInDelegate>();
cloudBackend = cbe::CloudBackend::logIn(username, password, tenant, client, logInDelegate);
logInDelegate->waitForRsp();
if (logInDelegate->errorInfo){
  std::cout << "Error: login failed!" << std::endl;
  std::cout << "Error info=" << logInDelegate->errorInfo << std::endl;
  cloudBackend.terminate();
  return 1;
} else {
  std::cout << "Login:" << std::endl;
  std::cout << "SDK version = "
            << logInDelegate->cloudBackend.version() << std::endl;
  std::cout << "   username = "
            << logInDelegate->cloudBackend.account().username() << std::endl;
  std::cout << "     userId = "
            << logInDelegate->cloudBackend.account().userId() << std::endl;
  std::cout << "     tenant = "
            << logInDelegate->cloudBackend.account().source() << std::endl;
  std::cout << " first name = "
            << logInDelegate->cloudBackend.account().firstName() << std::endl;
  std::cout << "  last name = "
            << logInDelegate->cloudBackend.account().lastName() << std::endl;
}  
```

The usage example above is an excerpt and it will need the code for the delegate to work. A more complete example can be found in the [Tutorial C++ Library](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/classes) section.

See the SDK bundle with included example for a complete code set.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::LogInDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onLogInSuccess() will be called when the call succeeds
- onLogInError() will be called when the call fails



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/login>*

---

## removeListener

Removes the listener that is passed in using the handle that was returned from addListener().

> **Note:** This should always be called when you stop using the delegate.

### Declaration

**Declaring removeListener()**

*Java*

```java
void removeListener(ListenerHandle handle) 
```

*C++*

```cpp
void removeListener(ListenerHandle handle) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `handle` | ListenerHandle | reference | same as was previously returned from addListener() when originally adding it. |

### Usage — example

**Example removeListener()**

*Java*

```java
cbobj.removeListener(myHandle); 
```

*C++*

```cpp
cloudBackend.removeListener(myHandle); 
```

### Result

This call will remove the specified listener.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/removelistener>*

---

## Sequence diagram

The following diagrams describes Asynchronous program flow where a delegate thread handles the callback response.

### logIn()

Sequence diagram for logIn using a delegate of the class cbe::delegate::LogInDelegate for asynchronous callbacks.


### query()

Sequence diagram for a query [optional filter] using a delegate of the class cbe::delegate::QueryDelegate for asynchronous callbacks.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/sequence-diagram>*

---

## Synchronous vs. Asynchronous

Many calls to the SDK can return either a synchronous or an asynchronous response. This leads to a decision on how you wish to work based on priorities. All remote communication within the Singularity Database internally takes place asynchronously. Any updates are first made to the local cache of data, then asynchronously applied to the rest of the Singularity Database outside the SDK. When the remote request completes, a callback is made to the delegate you have implemented.

#### Synchronous

Working synchronously allows one to immediately act on data that has been updated. This, however, means that it is possible someone else is looking at the same data without the updates you just made (inconsistency). The Singularity Database is built on the concept of eventual consistency, meaning that all SDKs viewing or holding the same Object will eventually be consistent. Additionally, if a request fails, requests dependent on the success of that request, that appear complete, will be rolled back.


#### Asynchronous

Working asynchronously means that the main thread may continue to work while there is a separate parallel thread **delegate** created that will wait for the response, process the response, and optionally make any follow up processing or hand over. This means that the applications you write on top of the SDK will be event-driven instead of being triggered by a main loop. The end user experience will be a user interface that is responsive and does not freeze while waiting for a server response. Working this way guarantees everything presented to the end user has been propagated to the Singularity Database and will be what is retrieved if another client communicates with the database.


#### Pros and cons

As of version 2 of the SDK the developer is provided with multiple sets of API with both **Synchronous** and **Asynchronous** overloading variants of the calls to communicate with the cloud service.

The Synchronous calls will be easier to use, but will freeze operations waiting for the cloud to respond. For a sequential program like a report or a sensor feeding data this is probably a good choice.

For a good interactive user experience in a user interface where multiple events happens in an unpredictable order, it is probably more desirable to write asynchronously on top of the SDK.

It is also possible to mix Synchronous and Asynchronous calls in the same program.

#### Error handling

API calls have two possible outcomes: either **success** or **error**.

The Synchronous API in version 2 is provided in two overloading variants that either uses exceptions or returns a method optional result that can be of two types: either the error information or the expected result.

In the Asynchronous API the callback delegate thread needs to cater for both cases: success and error.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/synchronous-vs-asynchronous>*

---

## Filter

The Filter class enables the use of the Query Language with more advanced database queries on Items.

Filters allow the specification of a wide range of criteria to select items based on name and key/value meta data with logical operations. See the SDK Filter.java file and the Query Language guide for more details.

A query can also be done without a filter for the full ResultSet.

### Declaration

**Declaring a filter**

*Java*

```java
Filter filter 
```

*Swift*

```swift
let filter = Filter()
```

*C++*

```cpp
cbe::Filter filter 
```

Filters can be used to limit what is returned in the QueryResult from a query, and also to see what has been set up in the filter.

#### Usage examples

**Example filter**

*Java*

```java
Filter filter1 = new Filter();
filter1.setAscending(false);
filter1.setCount(50);
filter1.setQuery("type:image/png");
ItemDelegate delegate = new ItemDelegate();
try
{
  cbobj.query(cbobj.account().rootContainer().id(), filter1, delegate);
  QueryResult qR = delegate.queryResult;
  AbstractList items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println("Item: " + item.name());
  }
}
catch (RuntimeException e)
{
  System.out.println("Caught error:");
  e.printStackTrace();
  System.out.println();
};  
```

*Swift*

```swift
var filter1 = Filter();
filter1.setAscending(false);
filter1.setCount(20);
filter1.setQuery("type:image/jpg");
cloudBackend.query(parentContainer.id(), filter1, self);
while count < items.count {
  let item:CBEItem = items[count] //as! CBEItem
  print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))");
  if(item.name() == "testiOSContainer" || item.name() == "renameiOSContainer"){
    container = item as! CBEContainer
    NSLog("remove testiOSContainer");
    toDoFunc = 1
    container.remove(self)
  }
  count+=1
}
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setAscending(false);
filter1.setCount(20);
filter1.setQuery("type:image/jpg");
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudBackend.query(parentContainer.id(), Filter filter1, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "ErrorInfo = " << queryDelegate->errorInfo << std::endl;
} else {
  cbe::QueryResult::ItemsSnapshot itemsSnapshot = queryDelegate->queryResult.getItemsSnapshot();
  for (auto& item : itemsSnapshot) {
      std::cout << item.name() << std::endl;
  }
}
```



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter>*

---

## composite query

The query() can be a simple start of word or a composite statement with logic.

#### query examples

```query
dogs cats +black -cool -"hot dogs"  
```

The query above searches for items that include the words "dog" or "cat" in one of several "text" fields (currently keyword, s1, s2, s3, s4, summary and title or content). Note the singular form! Un-prefixed words are stemmed. Additionally, the word "black" must be present in the object for a match. The word "cool" and the phrase "hot dogs", on the other hand, must not be present at all.

The query above will be translated into the following query tree:

```query
(("black") AND_MAYBE ("dog" OR "cat")) AND_NOT ("cool" OR "hot dogs")  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/composite-query>*

---

## filter get calls

These calls shall retrieve parameters that influence the search. They are used to check what has been defined for the query.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `getAscending()` | boolean | true/false | Sorting order (true=ascending) (false=descending) |
| `getContainerFirst()` | boolean | true/false | sort Containers before Objects |
| `getDeleted()` | boolean | true/false | include deleted items |
| `getByPassCache()` | boolean | true/false | skipped the local SDK cache and forced retrieval from the Server |
| `getDataType()` | integer | 4,8,12 | 4=Objects, 8=Containers, 12=Items |
| `getOffset()` | integer |  | skipped first number of items in the list returned |
| `getCount()` | integer |  | number of items in the list returned |
| `getQuery()` | string | type:value | query filter string set |
| `container()` | pointer | class | ContainerPtr of the container that the query was done on if it is in the SDK cache else a nullptr will be returned. Query has to be run before this call can be used. |

#### Usage — example

**Example get filter**

*Java*

```java
System.out.println("Fetching max: "   + filter1.getCount() +
                   " after skipping " + filter1.getOffset());  
```

*Swift*

```swift
NSLog("Fetching max: %@ after skipping %@, filter1.getCount(), filter1.getOffset());  
```

*C++*

```cpp
std::cout << "Fetching max: "   << filter1.getCount()
          << " after skipping " << filter1.getOffset()
          << std::endl;  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/filter-get-calls>*

---

## filter set calls

These calls listed shall set parameters that influences the search. The result will be a list to be returned as a QueryResult.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `setAscending()` | boolean | true/false | Sorting order (true=ascending) (false=descending) |
| `setContainerFirst()` | boolean | true/false | sort Containers before Objects |
| `setDeleted()` | boolean | true/false | include deleted items |
| `setByPassCache()` | boolean | true/false | skip the local SDK cache and force retrieval from the Server |
| `setDataType()` | integer | 4,8,12 | 4=Objects, 8=Containers, 12=Items |
| `setOffset()` | integer | skip | skip first number of items in the list to be returned in the QueryResult |
| `setCount()` | integer | maximum | maximum number of items in the list to be returned, which may be overridden by the system default maximum count |
| `setQuery()` | string | type:value | Note! Only applies to Objects. Some examples are listed below. For more examples; see the Query Language section. |

#### setQuery("string") syntax

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

See also [composite query](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/composite-query) , [prefixed terms in a query](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/prefixed-terms) and [Query Language](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/query-language)

#### Usage — example

**Example set filter**

*Java*

```java
Filter filter1 = new Filter();
filter1.setContainerFirst(true);
filter1.setOffset(40);
filter1.setCount(20);
filter1.setQuery("title:Coffee*");  
```

*Swift*

```swift
var filter1 = Filter();
filter1.setDataType(CBEItemTypeContainer);
filter1.setAscending(true);
filter1.setQuery("title:Apple"); 
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setOffset(100);
filter1.setCount(20);
filter1.setDataType(cbe::ItemType::Object);
filter1.setAscending(false);
filter1.setQuery("title:Tax*");  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/filter-set-calls>*

---

## prefixed terms

Consider the following query:

#### query examples

```query
title:money  
```

The next query will find all entries that describe JPEG or GIF images (based on the objects mime-type, which requires that the object has a stream 0 from where the mime-type is deducted, objects can not be queried on mime-type for stream 1..n), and has the word "money" in the title.

```query
title:money type:image/png type:image/gif  
```

Note that since the type field is searched for twice, the terms image/png and image/gif are combined with an OR relation, like this:

```query
"title:money" AND (type:image/png OR type:image/gif)  
```

This is probably the expected behavior for most fields, but perhaps not all. Suppose one would like to find all entries that include the words "money" and "dollar" in the title. The following query would not work: title:money title:dollar

This is since it would return all entries with either the word "money" or the word "dollar" in it. Here the prefixed "plus" terms should be used:

```query
+title:money +title:dollar  
```

The query above will correctly translate into the correct query tree:

```query
title:money AND title:dollar  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter/prefixed-terms>*

---

## Group

Group class offers access to group common information as Databases with Containers and objects. Identities can join and leave groups as per the policy of the owner.


Each group holds a Database that belongs to the group. Access to the group may be public, private, or invite only depending on the configured access rights for the group.

Roles are defined for the group, which its members can belong to.

Access Control Lists (ACL) can be given access to a group, role or identity.

Groups may contain sub-groups that first require an identity to be a member to the parent group to gain access. This can be used to create a directed graph of data and enable hierarchical databases.

The tenant data area is implemented as a group owned by the tenant administrator.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group>*

---

## listGroups

This returns a list of groups available to the user.

### Declaration

**Declaring listGroups**

*Java*

```java
void listGroups(ListGroupsDelegate delegate) 
```

*Swift*

```swift
-(void) listGroups:(id<ListGroupsDelegatePtr>)delegate;
```

*C++*

```cpp
void cbe::GroupManager::listGroups(ListGroupsDelegatePtr delegate) 
```

### Usage — example

**Asynchronous call**

Implement callbacks onListGroupsSuccess() and onListGroupsError() in class cbe::delegate::ListGroupsDelegate to receive the callback.

**Example listGroups**

*Java*

```java
com.cbe.GroupManager theGroupManager = cbobj.groupManager();
MyListGroupsDelegate listGroupsDelegate = new MyListGroupsDelegate();
theGroupManager.listGroups(listGroupsDelegate);
listGroupsDelegate.waitForRsp();  
```

*Swift*

```swift
var theGroupManager = cloudBackend.groupManager();
myGroupManager?.listGroups(self);
```

*C++*

```cpp
cbe::GroupManager myGroupManager = cloudBackend.groupManager();
std::shared_ptr<ListGroupsDelegate> listGroupsDelegate = std::make_shared<ListGroupsDelegate>();
myGroupManager.listGroups(ListGroupsDelegate);
ListGroupsDelegate->waitForRsp();  
```

### Result

The call will get the result as an asynchronous callback via the **groupDelegate** that implements the class **ListGroupsDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onListGroupsSuccess() will be called when call succeeds
- onListGroupsError() will be called when call fails

#### CLI — how to

The **groups** command in the CLI tool will list all groups that the Identity has access to.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group/listgroups>*

---

## listMembers

This returns a list of members of a group.

### Declaration

**Declaring listMembers**

*Java*

```java
void listMembers(ListMembersDelegate delegate) 
```

*Swift*

```swift
-(void) listMembers:(id<ListMembersDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Group::listMembers(ListMembersDelegatePtr delegate) 
```

### Usage — example

**Asynchronous call**

Implement callbacks onListMembersSuccess() and onListMembersError() in class cbe::delegate::ListMembersDelegate to receive the callback.

**Example listMembers**

*C++*

```cpp
MyListMembersDelegate listMembersDelegate = new MyListMembersDelegate();
group.listMembers(ListMembersDelegate);
listMembersDelegate.waitForRsp() 
```

*Swift*

```swift
var myGroupManager = cloudBackend.groupManager();
myGroupManager?.listMembers(self);
```

*C++*

```cpp
std::shared_ptr<ListMembersDelegate> listMembersDelegate = std::make_shared<ListMembersDelegate>();
theGroup.listMembers(listMembersDelegate);
ListMembersDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::ListMembersDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onListMembersSuccess() will be called when the call succeeds
- onListMembersError() will be called when the call fails

#### CLI — how to

The **members** command in the CLI tool will list all members of a group.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group/listmembers>*

---

## Install

Videos for installing the CloudBackend Mobile & IoT SDK.

- [iOS](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/install/ios)
- [Linux](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/install/linux)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/install>*

---

## iOS

#### iOS Swift SDK installation

Download the SDK bundle from [github](https://github.com/CloudBackend/SDK_iOS_Swift/releases)

Video below from an installation of the CloudBackend SDK on iOS.

#### Installation steps

1. Download the package, then unzip the file.
2. Open XCode and create a new project.
3. Select iOS and App, then hit next.
4. Name your application.
5. Input your team and Organization identifier.
6. Under interface select Storyboard, for Language select Swift, then hit next.
7. Save your project.
8. Import the files you downloaded.
9. Logic 1-2-3 are optional test files.
10. When the library and the header files are imported, we head in to the projects Build Phases and add lib C++.
11. Go to the Build Settings, here we set the search paths to headers and libraries.
12. Note! For the headers, select recursive search path since there are multiple levels of header files.
13. For the library search paths, be sure to remove the name of the library in the path if you drag and drop it.
14. Set the Bridging Header in the build settings, search for "swift compiler" and then select the "Objective-C Bridging Header".
15. Drag and drop the bridging header from the header files directory.
16. Finally, select a Run Destination and hit Command + B to build your project.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/install/ios>*

---

## Linux

#### Ubuntu Linux SDK installation

Download the SDK bundle from [github](https://github.com/CloudBackend/SDK_Ubuntu/releases)

Video below from an installation of the CloudBackend SDK on Ubuntu Linux.

#### Installation steps

1. Download the package from the link.
2. On your Ubuntu Linux computer; unzip the downloaded file.
3. cd to the unpacked folder.
4. Run the SDK install script; installSDK.sh
5. First the package for C++; answer the questions.
6. Then the Java SDK; answer the questions.
7. After the script ends, cd ..
8. CloudBackend SDK is now installed locally.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/install/linux>*

---

## Item

Item class is the base-class for both [Container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/item/item-data) class and [Object](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/item/item-data) class. It contains data that can be found on both and allows them to be presented together in a [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) from a query() call.

The QueryResult returns a list consisting of Items matching the query. An Item can be checked whether it underneath is a Container or an Object. This Item can then be cast respectively into a Container by calling [castContainer()](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/castcontainer) or into an Object by calling [castObject()](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/castobject).

See the [CloudBackend](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object) section for more information on castContainer and castObject.




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/item>*

---

## item data

These calls return item specific information. An Item can be a Container or an Object, which can be determined by the type() call.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `id()` | 64 bit long integer | unique number | id number |
| `parentId()` | 64 bit long integer | unique number | parent Container id number |
| `name()` | string | title | item name |
| `type()` | integer | 4 or 8 | 4=object, 8=container |
| `length()` | 64 bit long integer | Bytes | stored Object size |
| `aclTag()` | string | permission | access control list tag |
| `username()` | string | login name | user account name |
| `ownerId()` | 64 bit long integer | unique number | owner user id number |
| `path()` | string |  | may not return anything if it has not been set. |
| `created()` | long 64 bit time | timestamp | timestamp in Unix Epoch date and time, seconds since 1970 |
| `updated()` | long 64 bit time | timestamp | timestamp in Unix Epoch date and time, seconds since 1970 |
| `deleted()` | long 64 bit time | timestamp | timestamp in Unix Epoch date and time, seconds since 1970 |

#### Usage — example

**Example Item data**

*Java*

```java
if (myItem.type() == 4) {
  System.out.println("Object name: " + myItem.name());
} else {
  System.out.println("Container name: " + myItem.name());
}   
```

*Swift*

```swift
if(myItem.type() == CBEItemTypeObject) {
  NSLog("Object name: %@", myItem.name());
} else {
  NSLog("Container name: %@", myItem.name()); // Container = CBEItemTypeContainer
}
```

*C++*

```cpp
if (myItem.type() == cbe::ItemType::Object) {
  std::cout << "Object name: " << myItem.name() << std::endl;
} else {
  std::cout << "Container name: " << myItem.name() << std::endl;
}   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/item/item-data>*

---

## Key/Value

This section contains a collection of calls related to Key/Value pairs on the Object.

Key/Value may be seen as user defined and tailored meta-data sets. E.g.,

- Artist:ABBA
- Name:Patricia
- Name:Patrick
- Latitude:58.41*
- price<17
- age>25

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
- icon
- id
- link
- logo
- name
- published
- rights
- size
- source
- subtitle
- summary
- title
- updated
- uri

However, variations with some uppercase characters or _ may be an option.


The following calls are from the Container and Object classes.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value>*

---

## createObject Key/Values

Creates an empty object with specific Key/Value pairs. Each key/value pair can optionally be indexed for faster query searches later on.

### Declaration

**Declaring createObject() with key/values**

*Java*

```java
container.createObject(name, keyValues, delegate) 
```

*C++*

```cpp
cbe::Object cbe::Container::createObject(std::string name, cbe::KeyValues keyValues, CreateObjectDelegatePtr delegate) 
```

*Swift*

```swift
-(CBEObject*) createObject:(NSString*) name delegate:(id<CreateObjectDelegatePtr>) delegate keyValues:(NSDictionary*) keyValues; 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | object title name |
| `keyValues` | cbe::KeyValues | optional | Key/Value map like Obj_KV_Map(String key, tuple(String value, boolean indexed) ) |
| `delegate` | shared pointer | for callback | uses callback onCreateObjectSuccess() or onCreateObjectError() in class cbe::delegate::CreateObjectDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onCreateObjectSuccess() and onCreateObjectError() in class cbe::delegate::CreateObjectDelegate to receive the callback.

**Example createObject() with key/values**

*Java*

```java
boolean myIndexed;
String myKey;
String myValue;
String name;
Obj_KV_Map myKeyValues = new Obj_KV_Map();
Obj_VI_Pair myDataValue;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myDataValue = new Obj_VI_Pair(myValue, myIndexed);
myKeyValues.put(myKey, myDataValue);
myObject = container.createObject(name, myKeyValues, delegate); 
```

*C++*

```cpp
bool myIndexed;
std::string myKey;
std::string myValue;
std::string name;
cbe::KeyValues myKeyValues;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myKeyValues.insert(KeyValues(myKey, std::make_pair(myValue, myIndexed)));
std::shared_ptr<CreateObjectDelegate> createObjectDelegate = std::make_shared<CreateObjectDelegate>();
myObject = container.createObject(name, myKeyValues, createObjectDelegate);
createObjectDelegate->waitForRsp(); 
```

*Swift*

```swift
var myIndexed = "true";
var name = "SE";
var myKey= "CNTRY";
var myValue = "Sweden";
var myKeyValues = Dictionary<String, Dictionary<String, Bool>>();
var keyValue = Dictionary<String, Bool>();
keyValue["myValue"] = true;
myKeyValues[myKey] = keyValue;
container.createObject(name, delegate: self, keyValues: myKeyValues);
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::CreateObjectDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onCreateObjectSuccess() will be called if call succeeds
- onCreateObjectError() will be called if call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value/createobject-key-values>*

---

## keyValues()

returns a map of Key/Value pairs of the Object as `Obj_KV_Map(String key, tuple(String value, boolean indexed) )`

### Declaration

**Declaring keyValues()**

*Java*

```java
Obj_KV_Map object.keyValues() 
```

*Swift*

```swift
var keyValues = Dictionary<String, Dictionary<String, Bool>>()
```

*C++*

```cpp
cbe::KeyValues keyValues()  
```

### Usage — example

**Example keyValues()**

*Java*

```java
AbstractMap<String, Obj_VI_Pair> metadata1 = cObj.keyValues();
metadata1.forEach((K,V)->{
  if (V.getSecond()) {
    System.out.println(K + "=" + V.getFirst() + " \t(indexed)");
  } else {
    System.out.println(K + "=" + V.getFirst());
  }
});  
```

*Swift*

```swift
var metadata1 = obj.keyValues();
```

*C++*

```cpp
if(obj.keyValues().size() > 0) {
  std::cout << "Key/Value data: " << std::endl;
  auto keys = obj.keyValues();
  std::vector<std::string> allKeys;
  for (cbe::KeyValues::iterator keyValueIterator = keys.begin(); keyValueIterator != keys.end(); ++keyValueIterator) {
    allKeys.push_back(keyValueIterator->first);
  }
  for (std::vector<std::string>::iterator keyIterator = allKeys.begin(); keyIterator != allKeys.end(); keyIterator++) {
    std::cout << *keyIterator;
    if(std::get<1>(keys[(*keyIterator)]) == 1) {
      std::cout << " (indexed)";
    }
    std::cout << " = " << "'" << std::get<0>(keys[(*keyIterator)]) << "'" << std::endl;
  }
}  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value/keyvalues>*

---

## updateKeyValues

Adds keyValue data to the existing object. If data has the same name it will be overwritten, otherwise it will add to the existing keyValue on the object. Value can optionally be indexed for faster query searches later on.

### Declaration

**Declaring updateKeyValues()**

*Java*

```java
object.updateKeyValues() 
```

*Swift*

```swift
-(void) updateKeyValues:(id<UpdateKeyValuesObjectDelegatePtr>) delegate keyValues:(NSDictionary*) keyValues; 
```

*C++*

```cpp
void cbe::Object::updateKeyValues(KeyValues keyValues, UpdateKeyValuesDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `keyValues` | KeyValues | optional | Key/Value map like Obj_KV_Map(String key, tuple(String value, boolean indexed) ) |
| `delegate` | shared pointer | for callback | uses callback onUpdateKeyValuesSuccess() or onUpdateKeyValuesError() in class cbe::delegate::UpdateKeyValuesDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUpdateKeyValuesSuccess() and onUpdateKeyValuesError() in class cbe::delegate::UpdateKeyValuesDelegate to receive the callback.

**Example updateKeyValues()**

*Java*

```java
boolean myIndexed;
String myKey;
String myValue;
String name;
Obj_KV_Map myKeyValues = new Obj_KV_Map();
Obj_VI_Pair myDataValue;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myDataValue = new Obj_VI_Pair(myValue, myIndexed);
myKeyValues.put(myKey, myDataValue);
myObject.updateKeyValues(delegate, myKeyValues); 
```

*Swift*

```swift
var myIndexed = "true";
var name = "SE";
var myKey= "CNTRY";
var myValue = "Sweden";
var myKeyValues = Dictionary<String, Dictionary<String, Bool>>();
var keyValue = Dictionary<String, Bool>();
keyValue["myValue"] = true;
myKeyValues[myKey] = keyValue;
container.createObject(name, delegate: self, keyValues: myKeyValues);
```

*C++*

```cpp
bool myIndexed;
std::string myKey;
std::string myValue;
std::string name;
cbe::KeyValues myKeyValues;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myKeyValues.insert(KeyValues(myKey, std::make_pair(myValue, myIndexed)));
std::shared_ptr<UpdateKeyValuesDelegate> updateKeyValuesDelegate = std::make_shared<UpdateKeyValuesDelegate>();
myObject.updateKeyValues(myKeyValues, updateKeyValuesDelegate);
updateKeyValuesDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UpdateKeyValuesDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onUpdateKeyValuesSuccess() will be called if call succeeds
- onUpdateKeyValuesError() will be called if call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value/updatekeyvalues>*

---

## Object

Objects are a representation of data stored in CloudBackend. They can either contain the complete data or represent data stored and be used to access that data.

The name may not contain any of the following characters:

- ? / \ ( ) # * : [ ] | % & < " ' ! { }

Implement relevant calls in sub-classes of cbe::delegate:: and cbe::delegate::object:: to receive the asynchronous callbacks as needed.

Object requests that involve server communication will take an implementation of a delegate class.





*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object>*

---

## ACL

See the separate section containing information on how to limit access to data that is to be shared:

- [Sharing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/sharing)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/acl>*

---

## Manage

This describes how to organize objects.

The variants are:

- move()
- remove()
- rename()



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manage>*

---

## move

Call is used to move the Object to another user-specified containerId e.g. id() of other Container or the rootContainerId.

### Declaration

**Declaring move()**

*Java*

```java
object.move(long destinationContainerId, ItemDelegate delegate) 
```

*Swift*

```swift
-(void) move:(CBEObjectId) destinationContainerId delegate:(id<MoveObjectDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Object::move(cbe::ContainerId destinationContainerId, MoveDelegatePtr delegate)  
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `destinationContainerId` | ContainerId | unique number | id number of the Container to move into as a sub-container (64 bit long integer) |
| `delegate` | shared pointer | for callback | uses callback onMoveSuccess() or onMoveError() in class cbe::delegate::object::MoveDelegate to receive the callback. |

### Usage — example

**Asynchronous call**

Implement callbacks onMoveSuccess() and onMoveError() in class cbe::delegate::MoveDelegate to receive the callback.

**Example move()**

*Java*

```java
object.move(destinationId, delegate); 
```

*Swift*

```swift
object.move(destinationId, delegate:self); 
```

*C++*

```cpp
destinationId=destinationContainer.id();
std::shared_ptr<MoveDelegate> moveDelegate = std::make_shared<MoveDelegate>();
myObject.move(destinationId, moveDelegate);
moveDelegate->waitForRsp();  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::MoveDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onMoveSuccess() will be called if the call succeeds
- onMoveError() will be called if the call fails

#### CLI — how to

The **mv** [object] [destination] command in the CLI tool will move an object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manage/move>*

---

## remove

Call is used to delete the object.

### Declaration

**Declaring remove()**

*Java*

```java
object.remove(delegate) 
```

*Swift*

```swift
-(void) remove:(id<RemoveObjectDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Object::remove(RemoveDelegatePtr delegate)  
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onRemoveSuccess() or onRemoveError() in class cbe::delegate::object::RemoveDelegate to receive the callback. |

### Usage — example

**Asynchronous call**

Implement callbacks onRemoveSuccess() and onRemoveError() in class cbe::delegate::object::RemoveDelegate to receive the callback.

**Example remove()**

*Java*

```java
object.remove(); 
```

*Swift*

```swift
object.remove(destinationId, delegate:removeDelegate); 
```

*C++*

```cpp
std::shared_ptr<RemoveDelegate> removeDelegate = std::make_shared<RemoveDelegate>();
myObject.remove(destinationId, removeDelegate);
removeDelegate->waitForRsp();  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::object::RemoveDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onRemoveSuccess() will be called if the call succeeds
- onRemoveError() will be called if the call fails

#### CLI — how to

The **rm** [object] command in the CLI tool will delete an object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manage/remove>*

---

## rename

Call to change the name of the object.

### Declaration

**Declaring rename()**

*Java*

```java
object.rename(name, delegate) 
```

*Swift*

```swift
-(void) rename:(NSString*) name delegate: (id<RenameObjectDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Object::rename(const std::string & name, RenameDelegatePtr delegate)  
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `name` | string | title | new Object name |
| `delegate` | shared pointer | for callback | uses callback onRenameSuccess() or onRenameError() in class cbe::delegate::object::RenameDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onRenameSuccess() and onRenameError() in class cbe::delegate::object::RenameDelegate to receive the callback.

**Example rename()**

*Java*

```java
object.rename(name, delegate); 
```

*Swift*

```swift
var newName = "yesterdaysInformation";
object.rename(newName, delegate:self); 
```

*C++*

```cpp
newName="yesterdaysInformation";
std::shared_ptr<RenameDelegate> renameDelegate = std::make_shared<RenameDelegate>();
myObject.rename(newName, renameDelegate);
renameDelegate->waitForRsp();  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::object::RenameDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onRenameSuccess() will be called if the call succeeds
- onRenameError() will be called if the call fails

#### CLI — how to

The **rename** [object] [new name] command in the CLI tool will change the name of an object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manage/rename>*

---

## Manipulating

This describes how to use data in Objects.

- updateKeyValues()
- download()
- downloadBinary()
- downloadStream()



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating>*

---

## download

Will download the Object to a local file. In particular, this applies to the first Stream. If the Object has more than one Stream, see downloadStream().

### Declaration

**Declaring download()**

*Java*

```java
object.download(String path, TransferDelegate delegate) 
```

*C++*

```cpp
void cbe::Object::download(const std::string & path, DownloadDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string | title | the local path to the file system directory where the Object is to be stored, ending with a / |
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadSuccess() or onDownloadError() in class cbe::delegate::DownloadDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onDownloadSuccess() and onDownloadError() in class cbe::delegate::DownloadDelegate to receive the callback.

It is optional to implement callback onChunkReceived() which is useful if a progress indication of the download is wanted.

**Example download()**

*Java*

```java
object.download(path, delegate); 
```

*C++*

```cpp
myPath="/tmp/";
std::shared_ptr<DownloadDelegate> downloadDelegate = std::make_shared<DownloadDelegate>();
myObject.download(myPath, downloadDelegate);
downloadDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::DownloadDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onDownloadSuccess() will be called if the call succeeds
- onDownloadError() will be called if the call fails

The following callback is optional:

- onChunkReceived() will be called during the progress of the download indicating how much has been done so far.

#### CLI — how to

The **download** [name] [path] command in the CLI tool will download an Object to the client.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating/download>*

---

## downloadBinary

Will download the Object as binary data held in memory.

### Declaration

**Declaring download()**

*Java*

```java
object.download(delegate) 
```

*Swift*

```swift
-(void) download:(id<DownloadBinaryObjectDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Object::download(DownloadBinaryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadBinarySuccess() or onDownloadBinaryError() in class cbe::delegate::DownloadBinaryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onDownloadBinarySuccess() and onDownloadBinaryError() in class cbe::delegate::DownloadBinaryDelegate to receive the callback.

It is optional to implement callback onChunkReceived() which is useful if a progress indication of the download is wanted.

**Example download() to memory**

*Java*

```java
object.download(downloadBinaryDelegate);  
```

*Swift*

```swift
object.download(downloadBinaryDelegate);  
```

*C++*

```cpp
std::shared_ptr<DownloadBinaryDelegate> downloadBinaryDelegate = std::make_shared<DownloadBinaryDelegate>();
myObject.download(downloadBinaryDelegate);
downloadBinaryDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::DownloadBinaryDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onDownloadBinarySuccess() will be called if the call succeeds
- DownloadBinaryDelegate() will be called if the call fails

The following callback is optional:

- onChunkReceived() will be called during the progress of the download indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating/downloadbinary>*

---

## downloadStream

Will download one single Stream of the Object to a local file. This is useful if the Object has more than one Stream. The download() does the same, but is limited to the first Stream.

### Declaration

**Declaring downloadStream()**

*Java*

```java
object.downloadStream() 
```

*Swift*

```swift
-(void) downloadStream:(NSString*) path stream:(CBEStream*) stream delegate:(id<DownloadStreamObjectDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Object::downloadStream(const std::string & path, cbe::Stream stream, DownloadStreamDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string | title | the local path to the file system directory where the Object is to be stored, ending with a / |
| `stream` | cbe::Stream | class | class with information of _streamId and _length |
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadStreamSuccess() or onDownloadStreamError() in class cbe::delegate::DownloadStreamDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onDownloadStreamSuccess() and onDownloadStreamError() in class cbe::delegate::DownloadDelegate to receive the callback.

It is optional to implement callback onChunkReceived() which is useful if a progress indication of the download is wanted.

**Example downloadStream()**

*Java*

```java
object.downloadStream(); 
```

*C++*

```cpp
myPath="/tmp/";
std::shared_ptr<DownloadStreamDelegate> downloadStreamDelegate = std::make_shared<DownloadStreamDelegate>();
myObject.downloadStream(myPath, stream, downloadStreamDelegate);
downloadStreamDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::DownloadStreamDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onDownloadStreamSuccess() will be called if the call succeeds
- onDownloadStreamError() will be called if the call fails

The following callback is optional:

- onChunkReceived() will be called during the progress of the download indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating/downloadstream>*

---

## updateKeyValues

Adds keyValue data to the existing object. If the data has the same name it will be overwritten, otherwise it will add to the existing keyValue on the object. Value can optionally be indexed for faster query searches later on.

### Declaration

**Declaring updateKeyValues()**

*Java*

```java
object.updateKeyValues(Obj_KV_Map keyValues, UpdateKeyValuesDelegate delegate) 
```

*Swift*

```swift
-(void) updateKeyValues: (id<UpdateKeyValuesObjectDelegatePtr>) delegate keyValues:(NSDictionary*)keyValues;
```

*C++*

```cpp
void cbe::Object::updateKeyValues(KeyValues keyValues, UpdateKeyValuesDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `keyValues` | KeyValues | optional | Key/Value map like Obj_KV_Map(String key, tuple(String value, boolean indexed) ) N.B. The order of parameters change from version 2.1. |
| `delegate` | shared pointer | for callback | uses callback onUpdateKeyValuesSuccess() or onUpdateKeyValuesError() in class cbe::delegate::UpdateKeyValuesDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUpdateKeyValuesSuccess() and onUpdateKeyValuesError() in class cbe::delegate::UpdateKeyValuesDelegate to receive the callback.

**Example updateKeyValues()**

*Java*

```java
boolean myIndexed;
String myKey;
String myValue;
String name;
Obj_KV_Map myKeyValues = new Obj_KV_Map();
Obj_VI_Pair myDataValue;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myDataValue = new Obj_VI_Pair(myValue, myIndexed);
myKeyValues.put(myKey, myDataValue);
myObject.updateKeyValues(myKeyValues, delegate); 
```

*Swift*

```swift
var myIndexed = "true";
var name = "SE";
var myKey= "CNTRY";
var myValue = "Sweden";
var myKeyValues = Dictionary<String, Dictionary<String, Bool>>();
var keyValue = Dictionary<String, Bool>();
keyValue["myValue"] = true;
myKeyValues[myKey] = keyValue;
container.createObject(name, delegate: self, keyValues: myKeyValues);
```

*C++*

```cpp
bool myIndexed;
std::string myKey;
std::string myValue;
std::string name;
cbe::KeyValues myKeyValues;
name="SE";
myKey="CNTRY";
myValue="Sweden";
myIndexed=true;
myKeyValues.insert(KeyValues(myKey, std::make_pair(myValue, myIndexed)));
std::shared_ptr<UpdateKeyValuesDelegate> updateKeyValuesDelegate = std::make_shared<UpdateKeyValuesDelegate>();
myObject.updateKeyValues(myKeyValues, updateKeyValuesDelegate);
updateKeyValuesDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UpdateKeyValuesDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onUpdateKeyValuesSuccess() will be called if call succeeds
- onUpdateKeyValuesError() will be called if call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating/updatekeyvalues>*

---

## uploadStream

Will upload an additional Stream to the Object from a local file.

### Declaration

**Declaring uploadStream()**

*Java*

```java
object.uploadStream() 
```

*C++*

```cpp
void cbe::Object::uploadStream(const std::string & path, cbe::StreamId streamId, UploadStreamDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string | title | The local path of a file, including the filename, in the file system to be uploaded as a Stream. |
| `streamId` | cbe::StreamId | number | The sequence number of the attached Stream of the Object. If the stream id already exists, the Stream will be overwritten. |
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadStreamSuccess() or onDownloadStreamError() in class cbe::delegate::DownloadStreamDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUploadStreamSuccess() and onUploadStreamError() in class cbe::delegate::UploadStreamDelegate to receive the callback.

It is optional to implement callback onChunkSent() which is useful if a progress indication of the upload is wanted.

**Example uploadStream()**

*Java*

```java
object.uploadStream(); 
```

*C++*

```cpp
myPath="/tmp/img123_thumbnail.jpg";
streamId=2;
std::shared_ptr<UploadStreamDelegate> uploadStreamDelegate = std::make_shared<UploadStreamDelegate>();
myObject.uploadStream(myPath, streamId, uploadStreamDelegate);
uploadStreamDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UploadStreamDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onUploadStreamSuccess() will be called if the call succeeds
- onUploadStreamError() will be called if the call fails

The following callback is optional:

- onChunkSent() will be called during the progress of the upload indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/manipulating/uploadstream>*

---

## Object data

These calls return Object specific information.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `getMimeType()` | string | mime | returns the mime type of the Object e.g. xml/text or image/jpg etc. |
| `keyValues()` | map | Obj_KV_Map | see updateKeyValues() for a description |

#### Usage — example

**Example getMimeType()**

*Java*

```java
System.out.println("file mime type: " + object.getMimeType()); 
```

*Swift*

```swift
NSLog("file mime type: %@", object.getMimeType());
```

*C++*

```cpp
std::cout << "file mime type: " << object.getMimeType() << std::endl;   
```

Examples of **mime** values describing the content of an Object or a stream.

| Mime-Type | Description |
|---|---|
| application/msword | MS Word .doc file |
| application/octet-stream | Binary data |
| application/pdf | PDF Document |
| application/ppt | Microsoft PowerPoint .ppt file |
| application/vnd.oasis.opendocument.presentation | OpenDocument presentation document |
| application/vnd.oasis.opendocument.spreadsheet | OpenDocument spreadsheet document |
| application/vnd.oasis.opendocument.text | OpenDocument text document |
| application/vnd.openxmlformats-officedocument.presentationml.presentation | OpenXML Presentation Document |
| application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | OpenXML Spreadsheet Document |
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | OpenXML Word Document |
| application/x-zip-compressed | ZIP File |
| application/xls | Microsoft Excel .xls file |
| application/xml | XML File |
| application/zip | ZIP File |
| audio/mpeg | MP3 Audio |
| audio/wav | WAV Audio |
| audio/x-ms-wma | Windows Media Audio |
| audio/x-realaudio | RealPlayer Audio/Video (.rm) |
| audio/x-pn-realaudio | RealPlayer Audio/Video (.ram) |
| image/gif | GIF Image |
| image/jpeg | JPEG Image |
| image/png | PNG Image |
| message/rfc822 | e-mail message |
| text/css | Cascading Style Sheets (CSS) |
| text/csv | Comma-separated values (CSV) |
| text/html | HTML |
| text/plain | Plain Text |
| text/xml | XML File |
| video/avi | AVI Video |
| video/mov | Quicktime Video |
| video/mp4 | MP4 Video |
| video/mpeg | MPEG Video |
| video/quicktime | Quicktime Video |
| video/x-ms-wmv | Windows Media Video |
| video/x-msvideo | AVI Video |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/object-data>*

---

## Sharing

See the separate section containing information on how to share data:

- Sharing

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object/sharing>*

---

## query Container

This describes how to query the content of a Container you already have obtained e.g. the rootContainer pointer or via a queryResult after a previous query.

The variants are:

- query with path
- query
- query with filter
- query with join of multiple tables
- search with filter
- search with tags

The class [CloudBackend](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/query-with-path) has alternative ways to query, including with path.




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container>*

---

## query with filter

Call to get a filtered list of items in the container.

See the [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) and [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring query() with filter**

*Java*

```java
container.query(filter, delegate) 
```

*C++*

```cpp
cbe::Container::query(cbe::Filter filter, QueryDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `filter` | class |  | can be used to set parameters for the query; see the Filter section for details |
| `delegate` | shared pointer | for callback | uses callback onQuerySuccess() or onQueryError() in class cbe::delegate::QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example query() with filter**

*Java*

```java
Filter filter1 = new Filter();
filter1.setAscending(false);
qR = container.query(filter1, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setAscending(false);
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
container.query(filter1, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback class cbe::delegate::QueryDelegate.

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the Container is not read accessible.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/query-with-filter>*

---

## query with join

Joins are done by calling the join method on the query method. Several joins may be chained as you can continue to call join on a query method. When all joins have completed, the delegate provided in the initial query method, will be called and provided a QueryResult ResultSet.

Each join is done by matching the key/value pairs of Objects in the two containers, e.g. find the order and the customer where order.customerid = customer.id

In the **Asynchronous** query-join call statements, only the first of the methods up to the semicolon should be given a delegate. The following .join() should not have a separate delegate, but will reuse the delegate in the first method.

#### Join

**join**

```cpp
container1.query(delegate).join(container2,
                                "key from container1",
                                "key from container2",
                                filter2   [optional, query constraint],
                                Container [optional, which Container to get]); 
```

#### Chained join

**join**

```cpp
container1.query(filter1, delegate).join(container2,
                                         "key from container1",
                                         "key from container2",
                                         filter2,
                                         container2).join(container3,
                                                          "key from Container 2",
                                                          "key from Container 3",
                                                          filter3,
                                                          container2); 
```

The earlier and more a filter (narrowing query = constraint) is used on the Containers to reduce the ResultSet before each join, the better performance the query will yield.

Further specifying which the resulting Container should be, will save the need to do any merge between containers. The matching of keys is used to only reduce a QueryResult, which significantly improves the performance.

### Methods and Parameters

The join method may be called with 3 parameters, 4 parameters or 5 parameters if both optional features of filter and result Container are provided.

#### Five

**Join (five parameters)**

*Java*

```java
QueryChain join(Container containerToQuery,
                String key1,
                String key2,
                Filter constraints,
                Container containerForResults); 
```

*C++*

```cpp
virtual QueryChain join(Container containerToQuery,
                        std::string key1,
                        std::string key2,
                        cbe::Filter constraints,
                        Container containerForResults); 
```

#### Four

##### Filter

**Join (four parameters)**

*Java*

```java
QueryChain join(Container containerToQuery,
                String key1,
                String key2,
                Filter constraints); 
```

*C++*

```cpp
virtual QueryChain join(Container containerToQuery,
                        std::string key1,
                        std::string key2,
                        cbe::Filter constraints); 
```

#### Four

##### Container for result

**Join (four parameters)**

*Java*

```java
QueryChain join(Container containerToQuery,
                String key1,
                String key2,
                Container containerForResults); 
```

*C++*

```cpp
virtual QueryChain join(Container containerToQuery,
                        std::string key1,
                        std::string key2,
                        Container containerForResults); 
```

#### Three

**Join (three parameters)**

*Java*

```java
QueryChain join(Container containerToQuery,
                String key1,
                String key2);  
```

*C++*

```cpp
virtual QueryChain join(Container containerToQuery,
                        std::string key1,
                        std::string key2);  
```

**containerToQuery** — The Container you will join on.

**Key1** — The key you want to join on from the key value pairs found on each of the Objects in the Container from the preceding query or join method.

**Key2** — The key you want to join on from the key value pairs found on each of the Objects in the Container provided in the join method.

**constraints** — A filter that can be used to provide limits for the query that will be performed on the second container. See Filters and query documentation for more details.

**containerForResults** — Should be provided in the final join if attempting to get Objects from a Container other than the one provided in the final join (see example 5). This is also used to set a different Container for the next join to occur on (see example 3). By providing this optional statement, performance will be improved as the next join does not need to happen on a merge of the two previous containers. The specified Container needs to be a Container used in the initial query or a subsequent join.

### Examples

#### Example 1

The following example first shows the query in SQL and then using the CloudBackend SDK.

**SQL syntax**

```sql
select c2.* from container1 c1 inner join container2 c2
            on c1.name = c2.airport 
```

or

**SQL syntax**

```sql
select c2.* from container1 c1, container2 c2
            where c1.name = c2.airport 
```

*CloudBackend syntax*

**Declaring query() with join**

*Java*

```java
container1.query(delegate).join(container2,
                                "name",
                                "airport",
                                container2) 
```

*C++*

```cpp
container1.query(delegate).join(container2,
                                "name",
                                "airport",
                                container2) 
```

#### Example 2

The following example first shows the query in SQL and then using the CloudBackend SDK.

**SQL syntax**

```sql
select c3.* from container2 c2 inner join container1 c1 on c1.name = c2.airport
                               inner join container3 c3 on c1.type = c3.planes
                               where c1.country = "Sweden" 
```

or

**SQL syntax**

```sql
select c3.* from container1 c1, container2 c2, container3 c3
            where c1.name = c2.airport
              and c1.type = c3.planes
              and c1.country = "Sweden" 
```

*CloudBackend syntax*

**Example query() with join**

*Java*

```java
Filter filter1 = new Filter();
filter1.setQuery("country:sweden");
filter1.setDatatype(4);    // objects

container2.query(delegate).join(container1,
                                "airport",
                                "name",
                                filter1).join(container3,
                                              "type",
                                              "planes"); 
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setQuery("country:sweden");
filter1.setDatatype(ItemType::Object);

container2.query(delegate).join(container1,
                                "airport",
                                "name",
                                filter1).join(container3,
                                              "type",
                                              "planes"); 
```

#### Example 3

The following example first shows the query in SQL and then using the CloudBackend SDK. This example shows how to improve the performance of example 2 by generating a much smaller data set from the initial query, and thus making joining faster. Please note the changed order of which Container the initial query was used on and the sequence of joins.

**SQL syntax**

```sql
select c3.* from container1 c1
            inner join container2 c2 on c1.name = c2.airport
                       container3 c3 on c1.type = c3.planes
            where c1.country = "Sweden" 
```

or

**SQL syntax**

```sql
select c3.* from container1 c1, container2 c2, container3 c3
            where c1.name = c2.airport
              and c1.type = c3.planes
              and c1.country = "Sweden" 
```

*CloudBackend syntax*

**Example query() with join**

*Java*

```java
Filter filter1 = new Filter();
filter1.setQuery("country:sweden");
filter1.setDatatype(4);    // objects

container1.query(filter1, delegate).join(container2,
                                         "name",
                                         "airport",
                                         container).join(container3,
                                                         "type",
                                                         "planes",
                                                         container3); 
```

*C++*

```cpp
cbe::Filter filter1;
filter.setQuery("country:sweden");
filter.setDatatype(ItemType::Object);

container1.query(filter1, delegate).join(container2,
                                         "name",
                                         "airport",
                                         container).join(container3,
                                                         "type",
                                                         "planes",
                                                         container3); 
```

#### Example 4

This example uses two filters and specifies which Containers to continue the join on to increase the performance. The returned QueryResult will be all runways in Sweden that have a landing strip number 3.

*CloudBackend syntax*

**Example query() with join**

*Java*

```java
Filter filter2 = new Filter();
filter2.setQuery("country:sweden");
filter2.setDatatype(4);    // objects

Filter filter3 = new Filter();
filter3.setQuery("landingstrip:3");
filter3.setDatatype(4);    // objects

airports.query(delegate).join(planes,
                              "name",
                              "location",
                              filter2,
                              airports).join(runway,
                                             "runway",
                                             "id",
                                             filter3,
                                             airports);  
```

*C++*

```cpp
cbe::Filter filter2;
filter2.setQuery("country:sweden");
filter2.setDatatype(ItemType::Object);

cbe::Filter filter3;
filter3.setQuery("landingstrip:3");
filter3.setDatatype(ItemType::Object);

airports.query(delegate).join(planes,
                              "name",
                              "location",
                              filter2,
                              airports).join(runway,
                                             "runway",
                                             "id",
                                             filter3,
                                             airports);  
```

#### Example 5

We also provide tools to allow defining which Container to pull results from to make efficient queries. It is more efficient to lead with the smallest data set.

In the first alternative; if there are many planes in the system, the first query would be very inefficient.

##### Slower

*CloudBackend syntax*

**Example query() with join**

*Java*

```java
Filter filter2 = new Filter();
filter2.setQuery("country:sweden");
filter2.setDatatype(4);    // objects
planes.query(delegate).join(airports,
                            "name",
                            "location",
                            filter2);  
```

*C++*

```cpp
cbe::Filter filter2;
filter2.setQuery("country:sweden");
filter2.setDatatype(ItemType::Object);
planes.query(delegate).join(airports,
                            "name",
                            "location",
                            filter2);  
```

The second alternative performs the same function but will be more efficient, as is starts by reducing the first data set given the smaller number of matching airports vs. number of planes.

##### Faster

*CloudBackend syntax*

**Example query() with join**

*Java*

```java
Filter filter1 = new Filter();
filter1.setQuery("country:sweden");
filter1.setDatatype(4);    // objects
airports.query(filter1, delegate).join(planes,
                                       "name",
                                       "location",
                                       airports);  
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setQuery("country:sweden")
filter1.setDatatype(ItemType::Object);
airports.query(filter1, delegate).join(planes,
                                       "name",
                                       "location",
                                       airports);  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/query-with-join>*

---

## query with path

Call to get a list of items in the Container indicated by a path string starting from this Container and down in the hierarchical tree e.g., `/documents/pictures/pic.jpg` or `/documents/pictures/`

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring queryWithPath()**

*Java*

```java
container.queryWithPath(relativePath, delegate) 
```

*C++*

```cpp
queryWithPath(std::string relativePath, cbe::delegate::QueryDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string |  | path string for the query lookup e.g., /documents/pictures/pic.jpg or /documents/pictures/ |
| `delegate` | shared pointer |  | uses callback onQueryLoaded() or onLoadError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example queryWithPath()**

*Java*

```java
myPath="/brand/model/";
ItemDelegate delegate = new ItemDelegate();
qR = myContainer.queryWithPath(myPath, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
myPath="/brand/model/";
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
myContainer.queryWithPath(myPath, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
    std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/query-with-path>*

---

## query

Call to get a list of items stored in this container.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring query()**

*Java*

```java
container.query(delegate) 
```

*Swift*

```swift
container.query(self) 
```

*C++*

```cpp
cbe::Container::query(QueryDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onQuerySuccess() or onQueryError() in class cbe::delegate::QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example query()**

*Java*

```java
qR = container.query(delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*Swift*

```swift
var qR = container.query(self);
if let queryResult = qR {
  let items:[CBEItem] = queryResult.getItemsSnapshot() as! [CBEItem];
  var container:CBEContainer
  var count:Int = 0
  while count < items.count {
    let item:CBEItem = items[count] //as! CBEItem
    print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))");
    count+=1
  }
}
```

*C++*

```cpp
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
container.query(queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback in class cbe::delegate::QueryDelegate.

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the Container is not read accessible.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/query>*

---

## search with filter

Call to get a filtered list of items in the container and its sub-containers in the hierarchy.

See the [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) and [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring search() with filter**

*Java*

```java
container.search(filter, delegate) 
```

*C++*

```cpp
cbe::Container::search(cbe::Filter filter, QueryDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `filter` | class |  | can be used to set parameters for the query; see the Filter section for details |
| `delegate` | shared pointer | for callback | uses callback onQuerySuccess() or onQueryError() in class cbe::delegate::QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example search() with filter**

*Java*

```java
Filter filter1 = new Filter();
filter1.setAscending(false);
qR = container.search(filter1, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
cbe::Filter filter1;
filter1.setAscending(false);
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
container.search(filter1, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Search failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback class cbe::delegate::QueryDelegate.

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the Container is not read accessible.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/search-with-filter>*

---

## search with tag

Call to get a list of items in the container and its sub-containers in the hierarchy.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring search() with tag**

*Java*

```java
container.search(tags, delegate) 
```

*C++*

```cpp
cbe::Container::search(std::string tags, QueryDelegate delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `tags` | string |  | can be used to list tags for the query |
| `delegate` | shared pointer | for callback | uses callback onQuerySuccess() or onQueryError() in class cbe::delegate::QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Declaring search() with tag**

*Java*

```java
String tags = "invoice";
qR = container.search(tags, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
std::string tags = "invoice";
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
container.search(tags, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Search failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback class cbe::delegate::QueryDelegate.

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the Container is not read accessible.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-container/search-with-tag>*

---

## query Database

This describes how to query when you have already obtained the Container id e.g. the rootContainerId or a tenant group databaseId, via a queryResult after a previous query, the parentId of another Container or an Object or the list of Shares Containers or the list of Group containers.

The first variant uses a path relative to a start top container e.g. `path="/subcontainer1/subcontainer2/"`

The variants are:

- query with path
- query
- query with filter
- search with filter
- search with tags




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database>*

---

## query with filter

Call to get a list of items in the container.

See the [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) and [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring query() with filter**

*Java*

```java
cbobj.query(containerId, filter, delegate) 
```

*Swift*

```swift
-(CBEQueryChain*) query:(id<QueryDelegatePtr>) queryDelegate; 
```

*C++*

```cpp
query(cbe::containerId containerId, cbe::Filter filter, cbe::delegate::QueryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `filter` | class |  | can be used to set parameters for the query; see the Filter section for details |
| `delegate` | shared pointer |  | uses callback onQuerySuccess() or onQueryError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example query() with filter**

*Java*

```java
ContainerId myContainerId=rootContainer.id();
Filter filter1 = new Filter();
filter1.setAscending(false);
ItemDelegate delegate = new ItemDelegate();
qR = cbobj.query(myContainerId, filter1, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
cbe::ContainerId myContainerId=cloudBackend.account().rootContainer().id();
cbe::Filter filter1;
filter1.setAscending(false);
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudbackend.query(myContainerId, filter1, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

The usage example above is an excerpt and for it to work it will also need the code for the delegate. A more complete example can be found in the [Tutorial C++ Library](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-path) section.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-filter>*

---

## query with path

See the [QueryResult (Resultset)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

Call to get a list of items in the container indicated by a path string. e.g., `/documents/pictures/pic.jpg` or `/documents/pictures/`

### Declaration

**Declaring queryWithPath()**

*Java*

```java
cbobj.queryWithPath(relativePath, delegate) 
```

*Swift*

```swift
-(CBEQueryChain*) query:(CBEFilter*) filter delegate:id<QueryDelegatePtr>) queryDelegate;
```

*C++*

```cpp
queryWithPath(std::string relativePath, cbe::delegate::QueryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string |  | path string for the query lookup e.g. /documents/pictures/pic.jpg or /documents/pictures/ |
| `delegate` | shared pointer |  | uses callback onQueryLoaded() or onLoadError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example queryWithPath()**

*Java*

```java
myPath="/brand/model/";
ItemDelegate delegate = new ItemDelegate();
qR = cbobj.queryWithPath(myPath, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*Swift*

```swift
myPath="/brand/model/";
qR = container.queryWithPath(myPath, delegate);
```

*C++*

```cpp
myPath="/brand/model/";
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudbackend.queryWithPath(myPath, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-path>*

---

## query

This is a call to get a list of items in the container. It is intended to be used as a shortcut when the developer knows which Container they want to access. To access the root Container the developer should use the account().

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring query()**

*Java*

```java
cbobj.query(containerId, delegate) 
```

*C++*

```cpp
query(cbe::containerId containerId, cbe::delegate::QueryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer |  | uses callback onQuerySuccess() or onQueryError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Example query()**

*Java*

```java
ContainerId myContainerId=rootContainer.id();
ItemDelegate delegate = new ItemDelegate();
qR = cbobj.query(myContainerId, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*Swift*

```swift
let items:[CBEItem] = queryResult.getItemsSnapshot() as! [CBEItem];
var count:Int = 0
while count < items.count {
  let item:CBEItem = items[count] //as! CBEItem
  NSLog("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))");
  count+=1
}
```

*C++*

```cpp
cbe::ContainerId myContainerId=cloudBackend.account().rootContainer().id();
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudbackend.query(myContainerId, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

The usage example above is an excerpt and for it to work it will also need the code for the delegate. A more complete example can be found in the [Tutorial C++ Library](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-path) section.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query>*

---

## search with filter

Call to get a list of items in the container and its sub-containers in the hierarchy.

See the [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) and [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring search() with filter**

*Java*

```java
search(containerId, filter, delegate) 
```

*C++*

```cpp
search(cbe::containerId containerId, cbe::Filter filter, cbe::delegate::QueryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `filter` | class |  | can be used to set parameters for the query; see the Filter section for details |
| `delegate` | shared pointer |  | uses callback onQuerySuccess() or onQueryError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Declaring search() with filter**

*Java*

```java
ContainerId myContainerId=rootContainer.id();
Filter filter1 = new Filter();
filter1.setAscending(false);
ItemDelegate delegate = new ItemDelegate();
qR = cbobj.search(myContainerId, filter1, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
cbe::ContainerId myContainerId=cloudBackend.account().rootContainer().id();
cbe::Filter filter1;
filter1.setAscending(false);
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudbackend.search(myContainerId, filter1, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Search failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

The usage example above is an excerpt and for it to work it will also need the code for the delegate. A more complete example can be found in the [Tutorial C++ Library](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-path) section.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/search-with-filter>*

---

## search with tag

Call to get a list of items in the container and its sub-containers in the hierarchy.

See the [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section for more information.

### Declaration

**Declaring search() with tag**

*Java*

```java
search(containerId, tags, delegate) 
```

*C++*

```cpp
search(cbe::containerId containerId, cbe::Tags tags, cbe::delegate::QueryDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `filter` | class |  | can be used to set parameters for the query |
| `delegate` | shared pointer |  | uses callback onQuerySuccess() or onQueryError() in class QueryDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onQuerySuccess() and onQueryError() in class cbe::delegate::QueryDelegate to receive the callback.

**Declaring search() with tag**

*Java*

```java
ContainerId myContainerId=rootContainer.id();
String tags = "invoice";
ItemDelegate delegate = new ItemDelegate();
qR = cbobj.search(containerId, tags, delegate);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*C++*

```cpp
cbe::ContainerId myContainerId=cloudBackend.account().rootContainer().id();
std::string tags = "invoice";
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cloudbackend.search(myContainerId, tags, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Search failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

The usage example above is an excerpt and for it to work it will also need the code for the delegate. A more complete example can be found in the [Tutorial C++ Library](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/query-with-path) section.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::QueryDelegate**

The different possible callbacks are:

- onQuerySuccess() — after a query was successfully made
- onQueryError() — if a query fails, e.g. the path does not exist.

In the callback onQuerySuccess() a pointer to QueryResult is supplied. It gives a collection of items that can be processed.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database/search-with-tag>*

---

## Querying

- [Database queries](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/query-database) section
- [Container queries](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) section
- [Item](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) overview section
- [QueryResult (ResultSet)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset) section
- [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) section

Searches and queries using either the CloudBackend class or the Container class, depending on what is known.

- Search will look in the container in question and the sub-containers in the hierarchy.
- Query will just look in the container in question.

E.g. The first query is done with CloudBackend, which will return the Containers in the root container. Subsequent query in a subcontainer can be done using the specific subcontainer previously retrieved.

The Database-wide calls using CloudBackend with the Container Id can be done as:

- query with path — cloudBackend(Path)
- query — cloudBackend(Id)
- query with filter — cloudBackend(Id, filter)

The call using the Container has the following variants:

- query with path — container(path)
- query — container()
- query with filter — container(filter)

The call joining multiple Containers' pointer can be done with or without filters:

- query with join of two tables — container1().join(container2, key1, key2)
- query with join of two tables with constraints — container1().join(container2, key1, key2, filter)

For more details see the query subsections below.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/querying>*

---

## QueryResult (ResultSet)

A QueryResult contains a list (a.k.a. ResultSet) of items as an answer to a database query.

The simplest query is the one for contents of a container. This query can have Items which is a union of Objects and Containers. For information on how to use the returned Items, see the [Item](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset/getitemssnapshot) section.

Key/Values (a.k.a. metadata) are matching pairs of data attached to an Object e.g.,

- Artist:ABBA
- Name:Patricia
- Name:Patrick
- Latitude:58.41*
- Price<17
- Age>25

More complex queries can be performed on individual containers or the entire account and require the objects to match user-defined criteria from object names to meta data. More complex queries require passing in a filter with information on what you want to query for. See the [Filter](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) section.

By adding a Listener to a container, the service will monitor and keep track of changes made in the container. See the CloudBackend section [addListener](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/core-object/methods/addlistener) part.

For further information on advanced queries see the QUERY user guide document.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset>*

---

## bypassCache

Allow users to bypass cached data when pulling data stored on other users accounts, as notifications are currently not implemented for this and it will not update automatically.

> **Note:** Consult [filter documentation](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/filter) for more filtering options.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `cbe::Filter::setbyPassCache()` |  |  | Bypass cache to fetch from server instead. |
| `cbe::Filter::getbyPassCache()` |  |  | Check if cache was used or not. |

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset/bypasscache>*

---

## getItemsSnapshot

Returns a copy of a vector containing the Items for the queryResult. The queryResult will update when new data comes in but this copy will not. If iterating, make sure to create a variable for a local copy.

### Declaration

**Declaring getItemsSnapshot()**

*Java*

```java
List<Item> getItemsSnapshot() 
```

*Swift*

```swift
-(NSArray*) getItemsSnapshot; 
```

*C++*

```cpp
ItemsSnapshot getItemsSnapshot() 
```

### Usage — example

**Example getItemsSnapshot()**

*Java*

```java
ContainerId myContainerId=cloudBackend.account().rootContainer().id();
QueryResult qR = cbobj.query(myContainerId);
if (qR == null) {
  System.out.println("Query failed null. ");
} else {
  List<Item> items = qR.getItemsSnapshot();
  for(Item item : items) {
    System.out.println(item.name());
  }
}   
```

*Swift*

```swift
let items:[CBEItem] = queryResult.getItemsSnapshot() as! [CBEItem];
var container:CBEContainer
print("getting user defaults  \(String(describing: items))")
var count:Int = 0
while count < items.count {
let item:CBEItem = items[count] //as! CBEItem
print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))");
count+=1
}   
```

*C++*

```cpp
std::shared_ptr<QueryDelegate> queryDelegate = std::make_shared<QueryDelegate>();
cbe::ContainerId myContainerId=cloudBackend.account().rootContainer().id();
cloudbackend.query(myContainerId, queryDelegate);
queryDelegate->waitForRsp();
if (queryDelegate->errorInfo) {
  std::cout << "Query failed:" << std::endl;
  std::cout << "Error Info = " << queryDelegate->errorInfo << std::endl;
} else {
  queryResult = queryDelegate->queryResult;
  cbe::QueryResult::ItemsSnapshot myItemSnapshot = queryResult.getItemsSnapshot();
  for (ItemsSnapshot::iterator it = myItemSnapshot.begin(); it != myItemSnapshot.end(); ++it) {
      std::cout << (*it)->name() << std::endl;
  }
}   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset/getitemssnapshot>*

---

## queryResult data

These calls return QueryResult specific information.

| Attribute | Type | Values | Description |
|---|---|---|---|
| `itemsLoaded()` | 64 bit long integer | count | how many items are in the queryResult |
| `totalCount()` | 64 bit long integer | count | how many total items in the cloud match the query result. This may be more than loaded. |

#### Usage — example

**Example queryResult data**

*Java*

```java
System.out.println("loaded: " + qR.itemsLoaded() + " of " + qR.totalCount()); 
```

*Swift*

```swift
NSLog("loaded: %l of %l", qR.itemsLoaded(), qR.totalCount()); 
```

*C++*

```cpp
std::cout << "loaded: " << qR.itemsLoaded() << " of " << qR.totalCount() << std::endl;   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/queryresult-resultset/queryresult-data>*

---

## References

SDK Mobile, IoT & Cloud

#### How to:

- Early access — Contact us for an early access developer owner account.

#### SDK developer references

For SDK download information and complete developer reference documents see

- [Java](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/java)
- [Swift](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/swift)
- [C++](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/c%2B%2B)
- [XIOS/3 Web UI](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/xios-3)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references>*

---

## C++

### Downloads - SDK

#### Linux

Download the latest release from [github](https://github.com/CloudBackend/SDK_Ubuntu/releases) and see the README file for details on installing it.

#### SDK for Mobile & IoT information:

The reference documentation below allows you to browse code to see the classes, methods and their parameters in more detail.

- [API C++ full (Doxygen)](https://cloudbackend.com/docs/cpp/) — code documentation of the SDK library available to C++ developers
- [API C++ Async (Doxygen)](https://cloudbackend.com/docs/cpp2async/html/) — code limited documentation of the SDK library available to C++ developers

- [API C++ full (PDF)](https://cloudbackend.com/docs/cpp2sync/latex/refman.pdf) — code documentation of the SDK library C++ in PDF format
- [API C++ Async (PDF)](https://cloudbackend.com/docs/cpp2async/latex/refman.pdf) — code limited documentation of the SDK library C++ in PDF format

#### Older documentation:

- [API C++ (Doxygen)](https://cloudbackend.com/docs/cpp20/html/) — older version 2.0

- [API C++ (Doxygen)](https://cloudbackend.com/docs/cpp1/) — older version 1.4

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/c%2B%2B>*

---

## Java

### Downloads - SDK

#### Linux

Download the latest release from [github](https://github.com/CloudBackend/SDK_Ubuntu/releases) and see the README file for details on installing it.

#### SDK for Mobile & IoT information:

The reference documentation below allows you to browse code to see the classes, methods and their parameters in more detail.

- [API Java (Javadoc)](https://cloudbackend.com/docs/java/) — code documentation of the SDK library available to Java developers

#### Older documentation:

- [API Java (Javadoc)](https://cloudbackend.com/docs/java20/) — older version 2.0

- [API Java (Javadoc)](https://cloudbackend.com/docs/java1/) — older version 1.4

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/java>*

---

## Swift

### Downloads - SDK

#### iOS

Download the latest release from [github](https://github.com/CloudBackend/SDK_iOS_Swift/releases) and see the README file for details on installing it.

#### SDK for Mobile & IoT information:

The reference documentation below allows you to browse code to see the classes, methods and their parameters in more detail.

- [API Swift (XCode docs)](https://cloudbackend.com/docs/swift/) — code documentation of the SDK library Swift

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/swift>*

---

## XIOS/3

### Program editor

Login to the CloudBackend System [UI](https://db.cloudbackend.com/).

Development can be done inside the Web UI via the menu option [Projects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references) with the `icon://box_new?theme=sparse` Create and `icon://box_edit?theme=sparse` Edit buttons.

#### CloudBackend Extension for Visual Studio Code

To get access to the extension, please download the latest release from their Marketplace.

See also more information in the chapter about [using Visual Studio Code](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/application-development/development-tools/using-visual-studio-code).

#### Documentation

This documentation is available online in the Web UI documentation

#### SDK for Web UI (XIOS/3) information:

[XIOS/3](https://xios3.com/) — Web-based SDK for CloudBackend that makes it easy to build rich user interfaces. It is an entire device Edge Application Platform that also helps with executing the application within the browser, in addition to caching and managing the data from CloudBackend. You can find the entire XIOS/3 documentation in the Help section above under SDK Web UI (XIOS/3).

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/references/xios-3>*

---

## Security

The tenant account is created from the dashboard login page.

The tenant account administrator can then create and administer sub-accounts for identities that are automatically included as members in the tenant group.

A how-to guide is available via the References section at the end of this book.

- [Account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account) describes the account class.

### See also: Sharing

A separate section containing information on how to limit access to data that is to be shared: [Sharing](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/security/sharing)

- Groups e.g. tenant
- Publishing & Subscribing
- Sharing
- Access Control Lists — ACL



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/security>*

---

## Sharing

See the separate section containing information on how to share data:

- Sharing

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/security/sharing>*

---

## Sharing

A set of methods in a number of classes provides a convenient way of sharing data with different users to collaborate.

Sharing can be done with both Objects and containers.

There are some fundamentally different ways to sharing data with others:

- [Group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group) has its own top Container where the members can share Objects and sub-containers among them.

  This includes the tenant database.

- [Publish & Subscribe](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe) Objects and containers

  This is done to any user. Publications can be open or by invitation. Subscriptions can be free or password protected.

- [Share](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares) Objects and containers

  This can be done with individual access rights on both a user and group level.

- [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl)

  Access Control List for a group, Container and object. It is also required for an item that in a share.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing>*

---

## ACL

This describes the Access Control List (ACL), which determines the access rights available, i.e. (change rights, delete, write, read).

These ACL:s applies to Containers and Objects. Each setting can affect a user or a whole group with all its members.

When creating new Containers and Objects, by default they inherit the ACL of the parent container.

> **Note:** Each Item needs at least one ACL entry with changeACL permission.

### Example 1

The group Database Container e.g., `tenant://userinfo/` could be set up so each Member is allowed to create and update an object while only the Administrator is allowed to delete it.

1. Give the tenant group read and write access.
2. The Administrator group should have full access.
3. For the Member to be able to delete his own information (and nobody else but the Administrator) each user should have explicit delete access to its own object.
4. Give the user delete permission on that object.

### Example 2

Each Member are to have a Container e.g., `tenant://userinfo/NN/` where only the Member and the Administrator are allowed to create and read its objects, while only the Administrator is allowed to delete such objects.

1. Give the tenant group no access.
2. The Administrator group should have full access.
3. Give the user read and write permission on that container.

Objects created in it will inherit the acl of that container.

### Combinations

| val | rd | wrt | dlt | chg | cli | Enum name | description |
|---|---|---|---|---|---|---|---|
| 0 | - | - | - | - | ----- | NoPermission | no access; this alternative should be set to ensure a user can not access anything; should be called when unsharing an item |
| 1 | r | - | - | - | r---- | Read | enables query and download; no rename or move |
| 2 | - | w | - | - | -w--- | Write | upload to a shared Container and rename a shared item; no query or download |
| 3 | r | w | - | - | rw--- | ReadWrite | upload, download, rename and move; no delete |
| 4 | - | - | d | - | --d-- | Delete | nothing but delete |
| 5 | r | - | d | - | r-d-- | ReadDelete | download; no write, rename or upload |
| 6 | - | w | d | - | -wd-- | WriteDelete | upload, rename and delete |
| 7 | r | w | d | - | rwd-- | ReadWriteDelete | all but change ACL |
| 8 | - | - | - | a | ----a | ChangeACL | enables a user to set new ACL:s on a container/object |
| 9 | r | - | - | a | r---a | ReadChangeACL | no write, no delete |
| 10 | - | w | - | a | -w--a | WriteChangeACL | no read, no delete |
| 11 | r | w | - | a | rw--a | ReadWriteChangeACL | no delete |
| 12 | - | - | d | a | --d-a | DeleteChangeACL | no read, no write |
| 13 | r | - | d | a | r-d-a | ReadDeleteChangeACL | no write |
| 14 | - | w | d | a | -wd-a | WriteDeleteChangeACL | no read |
| 15 | r | w | d | a | rwd-a | AllPermissions | all permitted, e.g., normal for the owner of the Database like home:// |

The value is calculated as the sum of changeACL (8) + delete (4) + write (2) + read (1).

- getAcl()
- setAcl()

#### AclMap

The format of the AclMap has been extended in C++ from Release 2.1.1 to also handle groups. See the reference documentation.

#### CLI — how to

The **acl** [container] command in the CLI tool will list the ACL:s of a container.

The **acl** [object] command in the CLI tool will list the ACL:s of an object.

It may also be used to change the acl; see **help acl**



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl>*

---

## getAcl

Call to get the ACL (Access Control List) of a container.

This method is available both for Containers and Objects.

Includes userId, groupId and roleId with their respective permissions.

### Declaration

**Declaring getAcl**

*Java*

```java
void cbe.container.getAcl(ShareDelegate shareDelegate);
void cbe.object.getAcl(ShareDelegate shareDelegate); 
```

*Swift*

```swift
-(void) getAcl:(id<GetAclDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Container::getAcl(GetAclDelegatePtr delegate);
void cbe::Object::getAcl(GetAclDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onAclSuccess() or onAclError() in class cbe::delegate::AclDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onAclSuccess() and onAclError() in class cbe::delegate::AclDelegate to receive the callback.

**Example getAcl**

*Java*

```java
MyAclDelegate delegate = new MyAclDelegate();
com.std.Acl_Map aclMap myMap = null;
com.std.PermissionAclScopeEnum value = new com.std.PermissionAclScopeEnum();
try
{
  container.getAcl(delegate);
  myMap = delegate.waitForRsp();
}
catch (RuntimeException e)
{
  System.out.println("Caught error:");
  e.printStackTrace();
  System.out.println();
};
for (var entry : aclMap.entrySet()) {
  value = entry.getValue();
  System.out.println("  " + value.getSecond() + "\tid: " + entry.getKey() + " : " + value.getFirst());
}     
```

*Swift*

```swift
container.getAcl(self); 
```

*C++*

```cpp
std::shared_ptr<GetAclDelegate> getAclDelegate = std::make_shared<GetAclDelegate>();
container.getAcl(getAclDelegate);
getAclDelegate->waitForRsp();
// get the aclMap from the delegate
  for (const auto& entry : aclMap) {
    std::cout << "aclGroupId="    << entry.first
              << ", permissions=" << int(entry.second.first)
              << ", aclScope="    << int(entry.second.second)
              << std::endl;
  }  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::AclDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onAclSuccess() will be called if the call succeeds
- onAclError() will be called if the call fails

#### CLI — how to

The **acl** [container] command in the CLI tool will list the ACL:s of a container.

The **acl** [object] command in the CLI tool will list the ACL:s of an object.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl/getacl>*

---

## setAcl

Call to set the ACL of the item, i.e. (change rights, delete, write, read).

This method is available both for Containers and Objects.

Includes userId, groupId and roleId with their respective permissions.

For Containers setAcl affects the whole Container tree, with all its sub-items as well.

See cbe::Permissions and cbe::AclScope for value information.

First call getAcl() to get what is already there.

> **Note:** This is a new overriding set and not an update, so every time you call setAcl() all Id that should be there must be included in the map.

> **Note:** When calling setAcl() at least one entry needs to have changeACL set to true.

### Declaration

**Declaring setAcl**

*Java*

```java
cbe.container.setAcl(com.std.Acl_Map aclMap, AclDelegate delegate);
cbe.object.setAcl(com.std.Acl_Map aclMap, AclDelegate delegate); 
```

*Swift*

```swift
-(void) setAcl:(NSDictionary*)aclMap delegate:(id<SetAclDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Container::setAcl(cbe::AclMap aclMap, SetAclDelegatePtr delegate);
void cbe::Object::setAcl(cbe::AclMap aclMap, SetAclDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `aclMap` | map | (Id, [0..15]) | AbstractMap where the key is the groupId and userId and the value is the permission you want to set. Multiple users can be set through one call to setAcl by adding one map entry per userId and its permission (0 — 15). |
| `delegate` | shared pointer | for callback | uses callback onAclSuccess() or onAclError() in class cbe::delegate::AclDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onAclSuccess() and onAclError() in class cbe::delegate::AclDelegate to receive the callback.

**Example setAcl**

*Java*

```java
AclMap aclMap;
com.std.PermissionAclScopeEnum value = new com.std.PermissionAclScopeEnum();
value=new com.std.PermissionAclScopeEnum(com.cbe.Permissions.AllPermissions, com.cbe.AclScope.User);
aclMap.put(account.userId(), value);
value=new com.std.PermissionAclScopeEnum(com.cbe.Permissions.Read, com.cbe.AclScope.User);
aclMap.put(account2.userId(), value);
value=new com.std.PermissionAclScopeEnum(com.cbe.Permissions.ReadWrite, com.cbe.AclScope.User);
aclMap.put(account3.userId(), value);
value=new com.std.PermissionAclScopeEnum(com.cbe.Permissions.ReadWriteDelete, com.cbe.AclScope.User);
aclMap.put(account4.userId(), value);
ShareDelegate delegate = new ShareDelegate();
cbe.container.setAcl(aclMap, delegate); 
```

*Swift*

```swift
//set the acl value and type. See cbe::Permissions and cbe::AclScope for value information.
let aclValueIdTypeMap: [AnyHashable: Any] = [
  AnyHashable("15"):"1"
];
let aclValueIdTypeMap2: [AnyHashable: Any] = [
  AnyHashable("1"):"1"
];

//Maps a user, group, or role id to the acl value and type of id defined above
let idValuesMap: [AnyHashable: Any] = [
  AnyHashable("12886455783"):aclValueIdTypeMap,
  AnyHashable("12886472910"):aclValueIdTypeMap2
];
testContainer.setAcl(idValuesMap, delegate: self);  
```

*C++*

```cpp
cbe::AclMap aclMap;
aclMap.insert(std::pair<cbe::user_id_t,cbe::permission_status_t>(account.userId(), std::make_pair(cbe::Permissions::AllPermissions, cbe::AclScope::User)));
aclMap.insert(std::pair<cbe::user_id_t,cbe::permission_status_t>(account2.userId(),std::make_pair(cbe::Permissions::ReadWrite, cbe::AclScope::User)));
aclMap.insert(std::pair<cbe::user_id_t,cbe::permission_status_t>(account3.userId(),std::make_pair(cbe::Permissions::ReadDelete, cbe::AclScope::User)));
aclMap.insert(std::pair<cbe::user_id_t,cbe::permission_status_t>(account4.userId(),std::make_pair(cbe::Permissions::ReadWriteDelete, cbe::AclScope::User)));
std::shared_ptr<SetAclDelegate> setAclDelegate = std::make_shared<SetAclDelegate>();
container.setAcl(aclMap, setAclDelegate);
setAclDelegate->waitForRsp();  
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::AclDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onAclSuccess() will be called if the call succeeds
- onAclError() will be called if the call fails

#### CLI — how to

The **acl** [container] [+ | -][modes] -u [identity] command in the CLI tool will change the ACL:s of a container.

The **acl** [object] [+ | -][modes] -u [identity] command in the CLI tool will change the ACL:s of an object.

For more details, see **help acl**

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl/setacl>*

---

## Publish/Subscribe

This describes how to publish a subscription of an item to make it available to any user, and how users subscribe.

Publications can be open or by invitation. Subscriptions can be free or password protected.

This applies to both Containers and Objects.

The following class methods are available:

#### Containers

- publish()
- unpublish()
- unsubscribe()

#### Objects

- publish()
- unpublish()
- unsubscribe()

#### PublishManager

The PublishManager class handles the publications already given out to others.

- getPublished()

#### SubscribeManager

The SubscribeManager class makes publications available for the consumer to subscribe to.

- subscribe()
- getSubscriptions()

### Associated classes

The following class methods are available:

#### Item

Information on Item (classes Container and Object inherits).

- getPublished()
- getSubscribe()
- hasPublished()
- hasSubscribe()

#### Publish

Information and actions regarding a publication shared out to others.

- setTitle()
- setDescription()
- setSecurity()
- setPassword()
- getDescription()
- getPrivacy()
- getPassword()
- getPublishId()

#### Subscribe

Information about a subscription followed.

- getDate()
- getTitle()
- getDescription()
- getOwner()
- getSecurity()
- unsubscribe()



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe>*

---

## getPublished

List your publications that are provided to others.

### Declaration

**Declaring getPublished**

*Java*

```java
Items_Vec cbe.PublishManager.getPublished() 
```

*C++*

```cpp
cbe::Items cbe::PublishManager::getPublished() 
```

### Usage — example

**CloudBackend data**

**Example getPublished**

*Java*

```java
publications = cbobj.publishManager().getPublished(); 
```

*C++*

```cpp
publications = cloudBackend.publishManager().getPublished(); 
```

### Result

The call will return an Items vector.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/getpublished>*

---

## getSubscriptions

List your subscriptions.

### Declaration

**Declaring getSubscriptions**

*Java*

```java
void cbe.SubscriptionManager.getSubscriptions(GetSubscriptionsDelegate getSubscriptionsDelegate) 
```

*C++*

```cpp
void cbe::SubscriptionManager::getSubscriptions(GetSubscriptionsDelegatePtr getSubscriptionsDelegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onGetSubscriptionsSuccess() or onGetSubscriptionsError() in class cbe::delegate::GetSubscriptionsDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onGetSubscriptionsSuccess() and onGetSubscriptionsError() in class cbe::delegate::GetSubscriptionsDelegate to receive the callback.

**Example getSubscriptions**

*Java*

```java
cbobj.subscribeManager().getSubscriptions(shareId, getSubscriptionsDelegate); 
```

*C++*

```cpp
std::shared_ptr<GetSubscriptionsDelegate> getSubscriptionsDelegate = std::make_shared<GetSubscriptionsDelegate>();
cloudBackend.subscribeManager().getSubscriptions(getSubscriptionsDelegate);
getSubscriptionsDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::GetSubscriptionsDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onGetSubscriptionsSuccess() will be called if the call succeeds
- onGetSubscriptionsError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/getsubscriptions>*

---

## publish

Issue a publication of an item to anybody.

This method is available with both Container and Object.

### Declaration

**Declaring publish**

*Java*

```java
void cbe.container.publish(cbe.PublishAccess security, cbe.PublishVisibility privacy, String description, String password, PublishDelegatePtr delegate);
void cbe.object.publish(cbe.PublishAccess security, cbe.PublishVisibility privacy, String description, String password, PublishDelegatePtr delegate); 
```

*C++*

```cpp
void cbe::Container::publish(cbe::PublishAccess security, cbe::PublishVisibility privacy, std::string description, std::string password, PublishDelegatePtr delegate);
void cbe::Object::publish(cbe::PublishAccess security, cbe::PublishVisibility privacy, std::string description, std::string password, PublishDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `security` | cbe::PublishAccess | enum | number from a list of pre-defined values |
| `privacy` | cbe::PublishVisibility | enum | number from a list of pre-defined values |
| `description` | string | text | free text identifying this specific publication between you and the user/group |
| `password` | string | text | optional password string for accessing this publication |
| `delegate` | shared pointer | for callback | uses callback onPublishSuccess() or onPublishError() in class cbe::delegate::PublishDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onPublishSuccess() and onPublishError() in class cbe::delegate::PublishDelegate to receive the callback.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::PublishDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onPublishSuccess() will be called if the call succeeds
- onPublishError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/publish>*

---

## subscribe

Subscribe to a publication.

### Declaration

**Declaring subscribe**

*Java*

```java
void cbe.SubscribeManager.subscribe(long sharingUserId, long publishId, String subscribeName, SubscribeDelegate subscribeDelegate) 
```

*C++*

```cpp
void cbe::SubscribeManager::subscribe(cbe::UserId sharingUserId, cbe::PublishId publishId, std::string subscribeName, SubscribeDelegatePtr subscribeDelegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `sharingUserId` | numeric | unique number | the user id of the publisher. |
| `publishId` | numeric | unique number | the publication id of the item. |
| `delegate` | shared pointer | for callback | uses callback onSubscribeSuccess() or onSubscribeError() in class cbe::delegate::SubscribeDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onSubscribeSuccess() and onSubscribeError() in class cbe::delegate::SubscribeDelegate to receive the callback.

**Example subscribe**

*Java*

```java
cbobj.SubscribeManager().subscribe(sharingUserId, publishId, subscribeName, subscribeDelegate); 
```

*C++*

```cpp
std::shared_ptr<SubscribeDelegatePtr> subscribeDelegate = std::make_shared<SubscribeDelegatePtr>();
cloudBackend.SubscribeManager().subscribe(sharingUserId, publishId, subscribeName, subscribeDelegate);
subscribeDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::SubscribeDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onSubscribeSuccess() will be called if the call succeeds
- onSubscribeError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/subscribe>*

---

## unpublish

Withdraw an existing publication.

This method is available with both Container and Object.

### Declaration

**Declaring unpublish**

*Java*

```java
void cbe.container.unpublish(UnPublishDelegatePtr delegate);
void cbe.object.unpublish(UnPublishDelegatePtr delegate); 
```

*C++*

```cpp
void cbe::Container::unpublish(UnPublishDelegatePtr delegate);
void cbe::Object::unpublish(UnPublishDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onUnPublishSuccess() or onUnPublishError() in class cbe::delegate::UnPublishDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUnPublishSuccess() and onUnPublishError() in class cbe::delegate::UnPublishDelegate to receive the callback.

**Example unpublish**

*Java*

```java
cbe.container.unPublish(unPublishDelegate); 
```

*C++*

```cpp
std::shared_ptr<UnPublishDelegate> unPublishDelegate = std::make_shared<UnPublishDelegate>();
container.unPublish(unPublishDelegate);
unPublishDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UnPublishDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onUnPublishSuccess() will be called if the call succeeds
- onUnPublishError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/unpublish>*

---

## unsubscribe

Cancel a specific subscription.

This is available with both Objects and containers.

### Declaration

**Declaring unsubscribe**

*Java*

```java
void cbe.container.unsubscribe(UnsubscribeDelegate delegate)
void cbe.object.unsubscribe(UnsubscribeDelegate delegate)
```

*C++*

```cpp
void cbe::Container::unsubscribe(UnsubscribeDelegatePtr delegate)
void cbe::Object::unsubscribe(UnsubscribeDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onUnSubscribeSuccess() or onUnSubscribeError() in class cbe::delegate::UnsubscribeDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUnSubscribeSuccess() and onUnSubscribeError() in class cbe::delegate::UnsubscribeDelegate to receive the callback.

**Example unsubscribe**

*Java*

```java
container.unShare(shareId, shareDelegate); 
```

*C++*

```cpp
std::shared_ptr<UnsubscribeDelegatePtr> unsubscribeDelegate = std::make_shared<UnsubscribeDelegatePtr>();
container.unsubscribe(unsubscribeDelegate);
unsubscribeDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UnsubscribeDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onUnSubscribeSuccess() will be called if the call succeeds
- onUnSubscribeError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/publish-subscribe/unsubscribe>*

---

## Shares

It is possible to share Container as well as an Object with other CloudBackend users.

The following methods applies:

#### Containers

- getAcl()
- setAcl()
- share()
- unshare()

#### Objects

- getAcl()
- setAcl()
- share()
- unshare()

#### Listing

- listAvailableShares()
- listMyShares()

### Associated class

The following class methods are available:

#### Item

Information on Item (classes Container and Object inherits).

- aclMap()
- aclTag()
- getShareFromUserId()
- getShareIds()
- getUserFromShareId()

#### CLI — how to

The **shares** command in the CLI tool will list the received available shares.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares>*

---

## listAvailableShares

List shares that other users have made available.

### Declaration

**Declaring listAvailableShares**

*Java*

```java
void cbe.ShareManager.listAvailableShares(ListSharesDelegate delegate) 
```

*C++*

```cpp
void cbe::ShareManager::listAvailableShares(ListSharesDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onListSharesSuccess() or onListSharesError() in class cbe::delegate::ListSharesDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onListSharesSuccess() and onListSharesError() in class cbe::delegate::ListSharesDelegate to receive the callback.

**Example listAvailableShares**

*Java*

```java
cbe.shareManager.listAvailableShares(delegate); 
```

*C++*

```cpp
cbe::ShareManager shareManager = cloudBackend->shareManager();
std::shared_ptr<ListSharesDelegate> listSharesDelegate = std::make_shared<ListSharesDelegate>();
shareManager.listAvailableShares(listSharesDelegate);
listSharesDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::ListSharesDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onListSharesSuccess() will be called if the call succeeds
- onListSharesError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares/listavailableshares>*

---

## listMyShares

List shares that this user has made available to others.

### Declaration

**Declaring listMyShares**

*Java*

```java
void cbe.ShareManager.listMyShares(ListSharesDelegate delegate) 
```

*C++*

```cpp
void cbe::ShareManager::listMyShares(ListSharesDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callback onListSharesSuccess() or onListSharesError() in class cbe::delegate::ListSharesDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onListSharesSuccess() and onListSharesError() in class cbe::delegate::ListSharesDelegate to receive the callback.

**Example listMyShares**

*Java*

```java
cbe.shareManager.listMyShares(delegate); 
```

*C++*

```cpp
cbe::ShareManager shareManager = cloudBackend->shareManager();
std::shared_ptr<ListSharesDelegate> listSharesDelegate = std::make_shared<ListSharesDelegate>();
shareManager.listMyShares(listSharesDelegate);
listSharesDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::ListSharesDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onListSharesSuccess() will be called if the call succeeds
- onListSharesError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares/listmyshares>*

---

## share

Share an item with another user/group.

This method is available both for Containers and Objects.

This provides the user the ability to access what has been shared to them via the listAvailableShares() call.

> **Note:** [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl) should have been set prior to calling this method to define what permission a user will have e.g. to view, change and/or delete this piece of shared information.

### Declaration

**Declaring share**

*Java*

```java
void container.share(long toUserGroup, String description, ShareDelegate shareDelegate);
void object.share(long toUserGroup, String description, ShareDelegate shareDelegate); 
```

*Swift*

```swift
-(void) share:(CBEUserId)toUserGroup description:(NSString*)description delegate:(id<ShareDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Container::share(cbe::UserId toUserGroup, std::string description, ShareDelegatePtr delegate);
void cbe::Object::share(cbe::UserId toUserGroup, std::string description, ShareDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `toUserGroup` | cbe::UserId | unique number | user id number or a group id number to share to (64 bit long integer) |
| `description` | string | text | free text identifying this specific share between you and the user/group |
| `delegate` | shared pointer | for callback | uses callback onShareSuccess() or onShareError() in class cbe::delegate::ShareDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onShareSuccess() and onShareError() in class cbe::delegate::ShareDelegate to receive the callback.

**Example share**

*Java*

```java
container.share(toUserGroup, description, shareDelegate); 
```

*Swift*

```swift
container.share(toUserGroup, description:description, delegate:self); 
```

*C++*

```cpp
std::shared_ptr<ShareDelegate> shareDelegate = std::make_shared<ShareDelegate>();
container.share(shareDelegate);
shareDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::ShareDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onShareSuccess() will be called if the call succeeds
- onShareError() will be called if the call fails

#### CLI — how to

The **share** [flags] [container] command in the CLI tool will share a container.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares/share>*

---

## unshare

Un-share a Container previously shared with another user/group.

This method is available both for Containers and Objects.

### Declaration

**Declaring unShare**

*Java*

```java
void container.unShare(long shareId, ShareDelegate shareDelegate);
void object.unShare(long shareId, ShareDelegate shareDelegate); 
```

*Swift*

```swift
-(void) unShare:(CBEShareId)shareId delegate:(id<UnShareDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Container::unShare(cbe::ShareId shareId, UnShareDelegatePtr delegate);
void cbe::Object::unShare(cbe::ShareId shareId, UnShareDelegatePtr delegate); 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `shareId` | cbe::ShareId | unique number | share id number previously set up with share(), 64 bit long integer |
| `delegate` | shared pointer | for callback | uses callback onUnShareSuccess() or onUnShareError() in class cbe::delegate::UnShareDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUnShareSuccess() and onUnShareError() in class cbe::delegate::UnShareDelegate to receive the callback.

**Declaring unShare**

*Java*

```java
container.unShare(shareId, shareDelegate); 
```

*Swift*

```swift
container.unShare(shareId, delegate:self); 
```

*C++*

```cpp
std::shared_ptr<UnShareDelegate> unShareDelegate = std::make_shared<UnShareDelegate>();
container.unShare(unShareDelegate);
unShareDelegate->waitForRsp(); 
```

> **Note:** Remember to call setACL() to remove the associated permission.

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UnShareDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onUnShareSuccess() will be called if the call succeeds
- onUnShareError() will be called if the call fails

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/shares/unshare>*

---

## Stream

Stream is a class that represents files or BLOBs attached to an Object. An Object may have zero, one or multiple streams attached to it. The most usual case is for an Object to have only one stream and have its key/values describing it.

An example where multiple streams on an Object would make sense is for an e-mail, which can consist of a body message and multiple attachments of different types.




*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream>*

---

## downloadStream

Will download one single Stream of the Object to a local file. This is useful if the Object has more than one Stream. The download() does the same, but is limited to the first Stream.

### Declaration

**Declaring downloadStream()**

*Java*

```java
object.downloadStream() 
```

*Swift*

```swift
-(void) downloadStream:(NSString*) path stream:(CBEStream*) stream delegate:(id<DownloadStreamObjectDelegatePtr>) delegate;
```

*C++*

```cpp
void cbe::Object::downloadStream(const std::string & path, cbe::Stream stream, DownloadStreamDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string | title | the local path to the file system directory where the Object is to be stored, ending with a / |
| `stream` | cbe::Stream | class | class with information of _streamId and _length |
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadStreamSuccess() or onDownloadStreamError() in class cbe::delegate::DownloadStreamDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onDownloadStreamSuccess() and onDownloadStreamError() in class cbe::delegate::DownloadDelegate to receive the callback.

It is optional to implement callback onChunkReceived() which is useful if a progress indication of the download is wanted.

**Example downloadStream()**

*Java*

```java
object.downloadStream(); 
```

*C++*

```cpp
myPath="/tmp/";
std::shared_ptr<DownloadStreamDelegate> downloadStreamDelegate = std::make_shared<DownloadStreamDelegate>();
myObject.downloadStream(myPath, stream, downloadStreamDelegate);
downloadStreamDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::DownloadStreamDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onDownloadStreamSuccess() will be called if the call succeeds
- onDownloadStreamError() will be called if the call fails

The following callback is optional:

- onChunkReceived() will be called during the progress of the download, indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream/downloadstream>*

---

## getStreams

Will cache the list of streams belonging to the Object.

### Declaration

**Declaring getStreams()**

*Java*

```java
void getStreams(GetStreamsDelegatePtr delegate) 
```

*Swift*

```swift
-(void) getStreams: (id<GetStreamsDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Object::getStreams(GetStreamsDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `delegate` | shared pointer | for callback | uses callbacks onGetStreamsSuccess() or onGetStreamsError() in class cbe::delegate::GetStreamsDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onGetStreamsSuccess() and onGetStreamsError() in class cbe::delegate::GetStreamsDelegate to receive the callback.

**Example getStreams()**

*Java*

```java
object.getStreams(delegate); 
```

*Swift*

```swift
object.getStreams(self); 
```

*C++*

```cpp
std::shared_ptr<GetStreamsDelegate> getStreamsDelegate = std::make_shared<GetStreamsDelegate>();
myObject.getStreams(getStreamsDelegate);
getStreamsDelegate->waitForRsp();
cbe::Streams myStreams;
myStreams = myObject.getStream(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::GetStreamsDelegate**

One of two callbacks are possible, hence both callbacks should be implemented to handle all cases.

- onGetStreamsSuccess() will be called if call succeeds
- onGetStreamsError() will be called if call fails

See streams() for how to access the list.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream/getstreams>*

---

## streams

Returns the by getStreams() previously loaded streams attached to the object.

N.B. if getStreams() has not previously been called then streams() will return NULL.

### Declaration

**Declaring Streams vector**

*Java*

```java
Streams_Vec streams() 
```

*Swift*

```swift
-(NSArray*) streams;
```

*C++*

```cpp
cbe::Streams streams() const 
```

#### Usage — example

**Example Streams vector**

*Java*

```java
Streams_Vec sv;
object.getStreams(delegate);
sv=object.streams(); 
```

*Swift*

```swift
object.getStreams(self);
var sv = object.streams();
```

*C++*

```cpp
std::shared_ptr<GetStreamsDelegate> getStreamsDelegate = std::make_shared<GetStreamsDelegate>();
myObject.getStreams(getStreamsDelegate);
getStreamsDelegate->waitForRsp();
cbe::Streams myStreams;
myStreams = myObject.getStream(); 
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream/streams>*

---

## uploadStream

Will upload an additional Stream to the Object from a local file.

### Declaration

**Declaring uploadStream()**

*Java*

```java
object.uploadStream() 
```

*Swift*

```swift
-(void) uploadStream:(NSString*) path streamId:(uint64_t) streamId delegate:(id<UploadStreamObjectDelegatePtr>) delegate; 
```

*C++*

```cpp
void cbe::Object::uploadStream(const std::string & path, cbe::StreamId streamId, UploadStreamDelegatePtr delegate) 
```

#### Parameters

| Attribute | Type | Values | Description |
|---|---|---|---|
| `path` | string | title | The local path of file, including the filename, in the file system to be uploaded as a Stream. |
| `streamId` | cbe::StreamId | number | The sequence number of the attached Stream of the Object. If the stream id already exists, the Stream will be overwritten. |
| `delegate` | shared pointer | for callback | uses callbacks onChunkReceived() and onDownloadStreamSuccess() or onDownloadStreamError() in class cbe::delegate::DownloadStreamDelegate |

### Usage — example

**Asynchronous call**

Implement callbacks onUploadStreamSuccess() and onUploadStreamError() in class cbe::delegate::UploadStreamDelegate to receive the callback.

It is optional to implement callback onChunkSent() which is useful if a progress indication of the upload is wanted.

**Declaring uploadStream()**

*Java*

```java
object.uploadStream(); 
```

*C++*

```cpp
myPath="/tmp/img123_thumbnail.jpg";
streamId=2;
std::shared_ptr<UploadStreamDelegate> uploadStreamDelegate = std::make_shared<UploadStreamDelegate>();
myObject.uploadStream(myPath, streamId, uploadStreamDelegate);
uploadStreamDelegate->waitForRsp(); 
```

### Result

The call will get the result as an asynchronous callback via the **delegate** that implements the class **cbe::delegate::UploadStreamDelegate**

One of two mandatory callbacks are possible, hence both callbacks should be implemented to handle both cases.

- onUploadStreamSuccess() will be called if the call succeeds
- onUploadStreamError() will be called if the call fails

The following callback is optional:

- onChunkSent() will be called during the progress of the upload, indicating how much has been done so far.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream/uploadstream>*

---

## Tutorial

Please find tutorials for using the CloudBackend Mobile & IoT SDK here:

- [Tutorial C++ SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk) section
- [Tutorial Java SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk) section
- [Tutorial Swift SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk) section

The main overview books are available via the drop-down menu. For the tutorials on the browser environment use the drop down-menu and choose: SDK Web UI (XIOS/3) then click on Tutorials in that book.

### Tutorials --- specific document

- **[C++ SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk)** — The compiled C++ library SDK for Linux x86. *(C++)*

- **[Java and Android SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk)** — The compiled Java library SDK for mobile and Linux x86. *(Java & Android)*

- **[iOS Swift SDK](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk)** — The compiled Swift library SDK for iOS devices. *(Swift)*



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial>*

---
