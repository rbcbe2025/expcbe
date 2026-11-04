# CloudBackend SDK — Swift tutorial

Installation, delegate structure and the exercises for iOS.

8 topics from the published CloudBackend documentation, generated on 2026-10-10. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Tutorial Swift SDK](#tutorial-swift-sdk)
- [Asynchronous programming](#asynchronous-programming)
- [Exercise 1](#exercise-1)
- [Exercise 2](#exercise-2)
- [Exercise 3](#exercise-3)
- [Installation](#installation)
- [LogInDelegate structure](#logindelegate-structure)
- [queryDelegate structure](#querydelegate-structure)

## Tutorial Swift SDK

- [Exercise 1](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-1) section
- [Exercise 2](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-2) section
- [Exercise 3](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-3) section

### Tutorial objective

The following SDK Tutorial document will give an overview on how to use the backend calls in the SDK of CloudBackend (cbe). This is done with a more complete login example and by listing code examples as an exercise in three steps. The Swift example is used in the descriptions here.

The examples here are based on SDK version 2.0.

Similar examples are available in Java and C++.

### Classes

The classes available when writing programs using the CloudBackend SDK API.


### Containers and Objects

The Database consists of [containers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container), [objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object), [key/values](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value) (meta-data), [streams](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream), [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl) which are all stored in a database belonging to either an [identity (account)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account) or [group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group). Click on the links above for more information.


### To use the Tutorial

In this tutorial you will need a CloudBackend account, the include files and a copy of the SDK binary called libcb_sdk_shared_wrapper.so.

The tutorial will focus on teaching 4 simple methods that are needed to get started with the basics of using the SDK. Remember this is not a course in Swift.

The tutorial is structured in 3 exercises:

- [login to your account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-1)
- [create a Container in the root container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-2)
- [query the account and create an Object on the backend service](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-3).

At the end of this document there is a link to download the Tutorial source code.

### Acknowledgement

Many thanks to Forware AB for valuable contribution to the example code in this Tutorial.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk>*

---

## Asynchronous programming

All remote communication within the Singularity Database takes place asynchronously. Any updates are first made to the local cache of data, then asynchronously applied to the rest of the Singularity Database outside the SDK. When a remote request completes, a callback is made to the delegate you have implemented.

#### Asynchronous

Working asynchronously means that the main thread may continue to work while there is a separate parallel thread **delegate** created that will wait for the response, process the response, and optionally make any follow up processing or hand over. This means that the applications you write on top of the SDK will be event-driven instead of being triggered by a main loop. The end user experience will be a user interface that is responsive and does not freeze while waiting for a server response. Working this way guarantees everything you are presenting to the client has been propagated to the Singularity Database and will be what is retrieved if another client communicates with the database.

> **Note!** The Objective-C/Swift version of the SDK is a wrap of the C++ SDK which means that the concurrency is handled in the background.


We are working to also provide a Synchronous implementation of the SDK to make it easier to get started with smaller projects, where performance is not an issue. This SDK will be easier to use, but will freeze operations waiting for the cloud to respond. For a good user experience, it will always be more desirable to write asynchronously on top of the SDK. Please, check back in coming versions of this document.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/asynchronous-programming>*

---

## Exercise 1

In this exercise you will start by logging in to access the further functionality.

### Add your code

Add your code to login.

**Swift**

```swift
import Foundation

class Logic1: NSObject,
              LogInDelegatePtr
{
    // --- Global Variables ---
    var cbe1: CloudBackend!
    var rootContainer: CBEContainer!
    var newContainer: CBEContainer!
    var qR: CBEQueryResult!

    // Since the asynchronous code lives in the wrapped C++ code locks are used
    // to ensure that no race conditions are happening.
    let lock = NSLock()

    // --- Functions ---
    func waitForRsp() -> Void {
        lock.lock()
    }

    /* Functions for Exercise 2 */

    /* Functions for Exercise 3 */

    // --- Success Callbacks ---
    func onLog(inSuccess cloudBackend: CloudBackend!) {
        NSLog("LogIn success ")
        cbe1 = cloudBackend
        rootContainer = cbe1.account().rootContainer()
        lock.unlock()
    }

    // --- Error Callbacks ---
    func onLog(inError error: CBEError!, context: CBEContext!) {
        NSLog("LogIn error ")
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }

    // --- Driver Code ---
    func runTests()  {
        lock.lock()
        /* Exercise 1 */
        let myUsername : String = "~~~"
        let myPassword : String = "~~~"
        let myTenant : String = "~~~"
        // Login
        CloudBackend.login(myUsername, password:myPassword, tenant:myTenant, delegate:self)
        waitForRsp()
        NSLog("Logged in as: %@ SDK version %@", cbe1.account().username(), cbe1.version())

        /* Exercise 2 */

        /* Exercise 3 */

        NSLog("Exercise Completed!")
    }
}
```

### Compile and Run

As a last step you are now ready to press compile and run for Exercise 1.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-1>*

---

## Exercise 2

In this exercise you will add a Container to your account. The name of this Container should be a name that has not been used by others.

Later in Exercise 3 it will be used to create an Object in and then queried.

### Add your code

Add your code to create a new sub-container that can hold your items.

**Swift**

```swift
import Foundation

class Logic2: NSObject,
              LogInDelegatePtr, QueryDelegatePtr,
              CreateContainerDelegatePtr, RemoveContainerDelegatePtr

{
    // --- Global Variables ---
    var cbe1: CloudBackend!
    var rootContainer: CBEContainer!
    var newContainer: CBEContainer!
    var qR: CBEQueryResult!

    // Since the asynchronous code lives in the wrapped C++ code locks are used
    // to ensure that no race conditions are happening.
    let lock = NSLock()
    // --- Functions ---
    func waitForRsp() -> Void {
        lock.lock()
    }

    /* Functions for Exercise 2 */
    func removeContainer() {
        var count:Int = 0
        let items:[CBEItem] = qR.getItemsSnapshot() as! [CBEItem]
        while count < items.count {
            let item:CBEItem = items[count] //as! CBEItem
            if item.name() == "newTestContainer" {
                let c = item as! CBEContainer
                c.remove(self)
                waitForRsp()
            }
            count+=1
        }
    }
    func createContainer(container: CBEContainer) -> Void  {
        print("---Creating container")
        let containerName = "newTestContainer"
        rootContainer.createContainer(containerName, delegate:self)
    }
    func loadContainerContents(container: CBEContainer) {
        print("---Loading Container contents")
        let filter1 = CBEFilter()
        filter1.setDataType(CBEItemTypeContainer)
        container.query(filter1, delegate:self)
    }
    func printContainerContents(qR: CBEQueryResult) -> Void {
        print("---Printing Container contents")
        let items:[CBEItem] = qR.getItemsSnapshot() as! [CBEItem]
        var count:Int = 0
        while count < items.count {
            let item:CBEItem = items[count] //as! CBEItem
            print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))")
            count+=1
        }
        lock.unlock()
    }
    /* Functions for Exercise 3 */

    // --- Success Callbacks ---
    func onLog(inSuccess cloudBackend: CloudBackend!) {
        NSLog("LogIn success ")
        cbe1 = cloudBackend
        rootContainer = cbe1.account().rootContainer()
        lock.unlock()
    }
    func onQuerySuccess(_ queryResult: CBEQueryResult!) {
        qR = queryResult
        lock.unlock()
    }
    func onCreateContainerSuccess(_ container: CBEContainer!) {
        newContainer = container
        lock.unlock()
    }
    func onRemoveContainerSuccess(_ containerId: CBEItemId, name: String!) {
        print("Removed old container...")
        lock.unlock()
    }

    // --- Error Callbacks ---
    func onLog(inError error: CBEError!, context: CBEContext!) {
        NSLog("LogIn error ")
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onQueryError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onCreateContainerError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onRemoveContainerError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }

    // --- Driver Code ---
    func runTests()  {
        lock.lock()
        /* Exercise 1 */
        let myUsername : String = "~~~"
        let myPassword : String = "~~~"
        let myTenant : String = "~~~"
        // Login
        CloudBackend.login(myUsername, password:myPassword, tenant:myTenant, delegate:self)
        waitForRsp()
        NSLog("Logged in as: %@ SDK version %@", cbe1.account().username(), cbe1.version())

        /* Exercise 2 */
        // Load Container contents ie. query it to get its contents
        loadContainerContents(container: rootContainer)
        waitForRsp()

        // Remove Container if it already exists
        removeContainer()

        // After loading the container, print its contents
        printContainerContents(qR:qR)
        waitForRsp()
        // Given the existing containers, should we create a new?
        createContainer(container:rootContainer)
        waitForRsp()

        /* Exercise 3 */

        NSLog("Exercise Completed!")
    }
}
```

### Compile and Run

As a last step you are now ready to press compile and run for Exercise 2.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-2>*

---

## Exercise 3

In this exercise createObject and query will be implemented and used. You will add a lot of code for printing query results in different ways; one way for all the items in a Container and one method for specifically the key/values added on an object.

### Add your code

Add your code to create a new Object and query your container.

**Swift**

```swift
import Foundation

class Logic3: NSObject,
              LogInDelegatePtr, QueryDelegatePtr,
              CreateContainerDelegatePtr, RemoveContainerDelegatePtr,
              CreateObjectDelegatePtr
{
    // --- Global Variables ---
    var cbe1: CloudBackend!
    var rootContainer: CBEContainer!
    var newContainer: CBEContainer!
    var qR: CBEQueryResult!

    // Since the asynchronous code lives in the wrapped C++ code locks are used
    // to ensure that no race conditions are happening.
    let lock = NSLock()

    // --- Functions ---
    func waitForRsp() -> Void {
        lock.lock()
    }
    /* Functions for Exercise 2 */
    func removeContainer() {
        var count:Int = 0
        let items:[CBEItem] = qR.getItemsSnapshot() as! [CBEItem]
        while count < items.count {
            let item:CBEItem = items[count] //as! CBEItem
            if item.name() == "newTestContainer" {
                let c = item as! CBEContainer
                c.remove(self)
                waitForRsp()
            }
            count+=1
        }
    }
    func createContainer(container: CBEContainer) -> Void  {
        print("---Creating container")
        let containerName = "newTestContainer"
        rootContainer.createContainer(containerName, delegate:self)
    }
    func loadContainerContents(container: CBEContainer) {
        print("---Loading Container contents")
        let filter1 = CBEFilter()
        filter1.setDataType(CBEItemTypeContainer)
        container.query(filter1, delegate:self)
    }
    func printContainerContents(qR: CBEQueryResult) -> Void {
        print("---Printing Container contents")
        let items:[CBEItem] = qR.getItemsSnapshot() as! [CBEItem]
        var count:Int = 0
        while count < items.count {
            let item:CBEItem = items[count] //as! CBEItem
            print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))")
            count+=1
        }
        lock.unlock()
    }
    /* Functions for Exercise 3 */
    func loadContainerObjects(container: CBEContainer) {
        print("---Loading Container objects")
        let filter1 = CBEFilter()
        filter1.setDataType(CBEItemTypeObject)
        container.query(filter1, delegate:self)
    }

    func printObjects(qR: CBEQueryResult) -> Void {
        print("---Printing objects")
        let items:[CBEItem] = qR.getItemsSnapshot() as! [CBEItem]
        var count:Int = 0
        print(items.count)
        while count < items.count {
            let item:CBEItem = items[count] //as! CBEItem
            print("testSDK item  \(count) \(String(describing: item)) \(String(describing: item.name()))")
            count+=1
        }
        lock.unlock()
    }

    func createObject(parentContainer: CBEContainer) -> Void {
        print("---Creating object")
        var metaPairs = Dictionary<String, Dictionary<String, Bool>>()
        var metaData = Dictionary<String, Bool>()

        //add dictionary values - constant time O(1)
        metaData["Volvo"] = false;
        metaPairs["brand"] = metaData;
        parentContainer.createObject("newObject", delegate: self, keyValues: metaPairs)
    }

    // --- Success Callbacks ---
    func onLog(inSuccess cloudBackend: CloudBackend!) {
        NSLog("LogIn success ")
        cbe1 = cloudBackend
        rootContainer = cbe1.account().rootContainer()
        lock.unlock()
    }
    func onQuerySuccess(_ queryResult: CBEQueryResult!) {
        qR = queryResult
        lock.unlock()
    }
    func onCreateContainerSuccess(_ container: CBEContainer!) {
        newContainer = container
        lock.unlock()
    }
    func onCreateObjectSuccess(_ object: CBEObject!) {
        lock.unlock()
    }
    func onRemoveContainerSuccess(_ containerId: CBEItemId, name: String!) {
        print("Removed old container...")
        lock.unlock()
    }

    // --- Error Callbacks ---
    func onLog(inError error: CBEError!, context: CBEContext!) {
        NSLog("LogIn error ")
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onQueryError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onCreateContainerError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onCreateObjectError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }
    func onRemoveContainerError(_ error: CBEError!, context: CBEContext!) {
        if let a = error, let b = context {
            NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
            NSLog("Function: %@, reason: %@", b.fnName, b.report)
        }
    }

    // --- Driver Code ---
    func runTests()  {
        lock.lock()
        /* Exercise 1 */
        let myUsername : String = "~~~"
        let myPassword : String = "~~~"
        let myTenant : String = "~~~"
        // Login
        CloudBackend.login(myUsername, password:myPassword, tenant:myTenant, delegate:self)
        waitForRsp()
        NSLog("Logged in as: %@ SDK version %@", cbe1.account().username(), cbe1.version())

        /* Exercise 2 */
        // Load Container contents ie. query it to get its contents
        loadContainerContents(container: rootContainer)
        waitForRsp()

        // Remove Container if it already exists
        removeContainer()

        // After loading the container, print its contents
        printContainerContents(qR:qR)
        waitForRsp()
        // Given the existing containers, should we create a new?
        createContainer(container:rootContainer)
        waitForRsp()

        /* Exercise 3 */
        // Load Container contents ie. query it to get its contents
        loadContainerContents(container: rootContainer)
        waitForRsp()

        // After loading the container, print its contents
        printContainerContents(qR:qR)

        // Create Object in newly created container
        createObject(parentContainer:newContainer)
        waitForRsp()

        // Query root to get all objects
        loadContainerObjects(container:rootContainer)
        waitForRsp()

        // Print Objects contents
        printContainerContents(qR: qR)

        NSLog("Exercise Completed!")
    }
}
```

### Compile and Run

As a last step you are now ready to press compile and run for Exercise 3.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-3>*

---

## Installation

### Preparation

- [Xcode](https://developer.apple.com/xcode/) Apple's IDE

- [SDK](https://github.com/CloudBackend-AB/CloudBackendSDK) — Software Development Kit (zip file) which includes the template files used with the exercises.

- [Apple Developer](https://developer.apple.com/support/app-account/) — how to register.

### Get started

1. Create new Swift project in XCode


2. Choose **App** template


3. Choose your project name

   > **Note!** Select **Storyboard** in the drop down menu for *Interface*


4. Choose where to store your project


5. Now we have to create a bridging header to enable swift to call Objective-C code. Start by creating a new group (essentially a folder) by pressing the plus sign at the bottom of the screen and call it **libraries**. This is where the following things will live
   - Bridge-Header.h
   - Include files
   - Library file(s)


   Copy the contents of the following code block and paste it in between the **define** and **endif** in your newly created bridge header.

   **Bridge-Header.h**

   ```swift
   #import <CBEIOS/CloudBackend.h>
   #import <CBEIOS/Filter.h>
   #import <CBEIOS/QueryResult.h>
   #import <CBEIOS/Container.h>
   #import <CBEIOS/Object.h>
   #import <CBEIOS/Group.h>
   #import <CBEIOS/GroupManager.h>
   #import <CBEIOS/GroupFilter.h>
   #import <CBEIOS/GroupQueryResult.h>
   #import <CBEIOS/Member.h>

   #import <CBEIOS/Types.h>
   #import <CBEIOS/delegate/Error.h>
   #import <CBEIOS/util/Context.h>

   #import <CBEIOS/delegate/AclDelegate.h>
   #import <CBEIOS/delegate/UploadDelegate.h>
   #import <CBEIOS/delegate/PublishDelegate.h>
   #import <CBEIOS/delegate/ShareDelegate.h>
   #import <CBEIOS/delegate/UnpublishDelegate.h>
   #import <CBEIOS/delegate/UnShareDelegate.h>
   #import <CBEIOS/delegate/UnsubscribeDelegate.h>
   ```

6. Now you can add the provided **include** and **static_libraries** folders inside of the **libraries** group (folder) you created before
   So now it should look like this in your file explorer:


7. Then you have to point your target to the headers and libraries you have included.
   Do the following:
   1. Press your project's name at the top of your file tree, then you should see your project and targets listed.
   2. Go to the target section and press the target named the same as your project.
   3. Then press the **Build Settings** tab
   4. Then press the **All** tab located just below the Build Settings tab

   Add the configurations listed below, you can use the filter to find the settings easier.
   - Supported platforms: press **other** and make sure *iphoneos* is the only thing present in that list.
   - **Search Paths** Header Search Paths: *libraries/include*
   - **Search Paths** Library Search Paths: *libraries/include/static_libraries*
   - **Swift Compiler — General** Objective-C Bridging Header *libraries/Bridge-Header.h*

   Below is a reference of how it should look like:



8. The last thing you have to do is to link the binary to the libraries.
   1. Go to **Build Phases**
   2. Expand the **Link Binary With Libraries**
   3. Add all .a files located in the **static_libraries** folder
   4. Press the **plus sign** and search for **libc++.tbd** and add that as well.


9. Now you should be all set!

   > **Note:** May the **Cloud** be with you!

### Available Tutorials

[Exercise 1](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-1)
[Exercise 2](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-2)
[Exercise 3](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/exercise-3)

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/installation>*

---

## LogInDelegate structure

To make an asynchronous program the main program will also need to have Delegates that will handle the call back code.


Here is an example where the delegate is implemented as a class MyLogInDelegate.

See the comments inline describing in more detail.

**Swift**

```swift
var cbe1: CloudBackend!;
func onLog(inSuccess cloudBackend: CloudBackend!) {
  NSLog("LogIn success account %@", cloudBackend.account());
  NSLog("LogIn success account %@ %u", cloudBackend.account().username(), cloudBackend.account().userId())
  NSLog("LogIn success Container %@", cloudBackend.account().rootContainer());
  NSLog("LogIn success Container %@", cloudBackend.account().rootContainer().name());
} // onLog

func onLog(inError error: CBEError!, context: CBEContext!) {
  NSLog("LogIn error ");
  if let a = error {
    NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
  }
  if let b = context {
    NSLog("Function: %@, reason: %@", b.fnName, b.report);
  }
}

// --- Driver Code ---
func runTests(){
  NSLog("calling  login ");
  let myUsername : String = "username123";
  let myPassword : String = "password123";
  let myTenant : String = "tenant123";
  let cloudBackend = CloudBackend.login(myUsername, password:myPassword, tenant:myTenant, delegate:self);
  print(cloudBackend!)
  NSLog("LoginTest done!");
}   
```

### Client application code

Here is an example of parts of the client code using that delegate to wait for the callback from the server.

The writing ~~~ indicates that something needs to be added in its place.

**Swift**

```swift
let lock = NSLock();
~~~
// Callback code
func onLog(inSuccess cloudBackend: CloudBackend!) {
  lock.unlock()
}
func onLog(inError error: CBEError!, context: CBEContext!) {
  NSLog("LogIn error ")
  if let a = error, let b = context {
  NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
  NSLog("Function: %@, reason: %@", b.fnName, b.report)
  }
}
~~~
func waitForRsp() -> Void {
  lock.lock()
}
CloudBackend.login(username, password, tenant, delegate);
waitForRsp()
~~~
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/logindelegate-structure>*

---

## queryDelegate structure

An example of an asynchronous query with the Delegate and Client code that runs after a successful LogIn.


In this asynchronous program example the Delegate thread that will handle the call back code is shown separate from the main Client code.

See the comments inline describing in more detail.

### Client application code

**Swift**

```swift
class YourApplication: NSObject, ..., QueryDelegatePtr {
  ~~~
  func onQuerySuccess(_ queryResult: CBEQueryResult!) {
  qR = queryResult
    lock.unlock()
  }
  func onQueryError(_ error: CBEError!, context: CBEContext!) {
  if let a = error, let b = context {
    NSLog("ErrorCode: %u, reason: %@, message: %@", a.errorCode, a.reason, a.message)
      NSLog("Function: %@, reason: %@", b.fnName, b.report)
    }
  }
  ~~~
} 
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-swift-sdk/querydelegate-structure>*

---
