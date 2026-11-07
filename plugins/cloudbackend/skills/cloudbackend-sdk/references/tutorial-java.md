# CloudBackend SDK — Java tutorial

Installation, asynchronous programming, delegate structures and the three exercises.

9 topics from the published CloudBackend documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Tutorial Java SDK](#tutorial-java-sdk)
- [Asynchronous programming](#asynchronous-programming)
- [Exercise 1](#exercise-1)
- [Exercise 2](#exercise-2)
- [Exercise 3](#exercise-3)
- [Installation](#installation)
- [LogInDelegate structure](#logindelegate-structure)
- [queryDelegate structure](#querydelegate-structure)
- [Scripts](#scripts)

## Tutorial Java SDK

- [Exercise 1](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-1) section
- [Exercise 2](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-2) section
- [Exercise 3](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-3) section

### Tutorial objective

The following SDK Tutorial document will give an overview on how to use the backend calls in the SDK of CloudBackend (cbe). This is done with a more complete login example and by listing code examples as an exercise in three steps. The Java example is used in the descriptions here.

The examples here are based on SDK version 2.0.

Similar examples are available in C++ and Swift.

### Classes

The classes available when writing programs using the CloudBackend SDK API.


### Containers and Objects

The Database consists of [containers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container), [objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object), [key/values](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value) (meta-data), [streams](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream), [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl) which are all stored in a database belonging to either an [identity (account)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account) or [group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group). Click on the links above for more information.


### To use the Tutorial

In this tutorial you will need a CloudBackend account, the include files and a copy of the SDK binary called libcb_sdk_shared_wrapper.so.

The tutorial will focus on teaching 4 simple methods that are needed to get started with the basics of using the SDK. Remember this is not a course in Java.

The tutorial is structured in 3 exercises:

- [login to your account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-1)
- [create a Container in the root container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-2)
- [query the account and create an Object on the backend service](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-3).

At the end of this document there is a link to download the Tutorial source code.

### Acknowledgement

Many thanks to Forware AB for valuable contribution to the example code in this Tutorial.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk>*

---

## Asynchronous programming

All remote communication within the Singularity Database takes place asynchronously. Any updates are first made to the local cache of data, then asynchronously applied to the rest of the Singularity Database outside the SDK. When a remote request completes, a callback is made to the delegate you have implemented.

#### Asynchronous

Working asynchronously means that the main thread may continue to work while there is a separate parallel thread **delegate** created that will wait for the response, process the response, and optionally make any follow up processing or hand over. This means that the applications you write on top of the SDK will be event-driven instead of being triggered by a main loop. The end user experience will be a user interface that is responsive and does not freeze while waiting for a server response. Working this way guarantees everything you are presenting to the client has been propagated to the Singularity Database and will be what is retrieved if another client communicates with the database.


We are working to also provide a Synchronous implementation of the SDK to make it easier to get started with smaller projects, where performance is not an issue. This SDK will be easier to use, but will freeze operations waiting for the cloud to respond. For a good user experience, it will always be more desirable to write asynchronously on top of the SDK. Please, check back in coming versions of this document.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/asynchronous-programming>*

---

## Exercise 1

A number of Delegate files are provided in the Example Simple folder in the SDK bundle. You need:

- Tutorial.java copy it from Tutorial.template
- MyLogInDelegate.java
- MyCreateContainerDelegate.java
- MyCreateObjectDelegate.java
- MyQueryDelegate.java
- MyRemoveContainerDelegate.java
- compile.sh
- run.sh

### Template

To start off a template file has been provided. It can be copied to get your project started. Training accounts are provided in the SDK bundle and used by the template code. Test that it compiles.

**shell**

```sh
cp Tutorial.template Tutorial.java
sh compile      
```

### Add your code

In the file Tutorial.java; go to  // Exercise 1 here  and add your code to login. E.g.:

**Java**

```java
  // Exercise 1 here
cbobj = inst.myLogin("gh1");
if (cbobj.account().userId()>0) {
    System.out.println("Authenticated as: " + cbobj.account().username() + "\t" + cbobj.account().firstName() + " " + cbobj.account().lastName());
} else {
    System.out.println("Login failed.");
    cbobj.terminate();
    System.out.println(programName + " program stop.");
    return;
}
com.cbe.Container parent = cbobj.account().rootContainer();
com.cbe.Container testContainer = null;
com.cbe.Object myObject;
QueryResult qR;
Obj_KV_Map metadata = new Obj_KV_Map();
String containerName;

System.out.println(programName + "::getContainers");
qR = inst.getContainers(parent);
items = qR.getItemsSnapshot();
if(qR == null) {
    System.out.println("Query got null. ");
} else {
    System.out.println("Loaded: " + qR.containersLoaded());
    items = qR.getItemsSnapshot();
    System.out.println("Content of: /");
    for(Item item : items) {
    System.out.println(" <CNT>  " + item.name());
    }
}
```

### Compile and Run

As a last step you are now ready to, from the Linux shell terminal, compile Exercise 1 and then run the generated program.

**shell**

```sh
sh compile.sh
sh run.sh    
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-1>*

---

## Exercise 2

In this exercise you will add a Container to your account. The name of this Container should be a name that has not been used by others.

Later in Exercise 3 it will be used to create an Object in and then queried.

### Add your code

In the file Tutorial.java; go to  // Exercise 2 here  and add your code to create a new sub-container that can hold your items. E.g.:

**Java**

```java
// Exercise 2 here
    if (inquiry.inquireBool("Do you want to create a new container")) {
        containerName = inquiry.inquireString("Name of your new container", "myTutorial");
        testContainer = inst.createContainer(parent, containerName);
        if (testContainer == null) {
            System.out.println("Failed creating Container /" + containerName);
            cbobj.terminate();
            System.out.println(programName + " program stops.");
            return;
        } else {
            System.out.println("Container created: " + testContainer.name() + " (" + testContainer.id() + ")");
        }
        qR = inst.getContainers(parent);
        items = qR.getItemsSnapshot();
        if (qR == null) {
            System.out.println("Query got null. ");
        } else {
            System.out.println("Loaded: " + qR.containersLoaded());
            items = qR.getItemsSnapshot();
            System.out.println("Content of: /");
            for(Item item : items) {
                if (item.type() == com.cbe.ItemType.Container) {
                    System.out.println(" <CNT>  " + item.name());
                }
            }
        }
    } else {
        while (testContainer == null) {
            containerName = inquiry.inquireString("Which Container do you want to reuse");
            if(qR == null) {
                System.out.println("Query got null. ");
            } else {
                items = qR.getItemsSnapshot();
                for(Item item : items) {
                    if (item.type() == com.cbe.ItemType.Container) {
                        if (containerName.equals(item.name())) {
                            System.out.println(" <CNT>  " + item.name() + "  ok");
                            testContainer = com.cbe.CloudBackend.castContainer(item);
                        }
                    }
                }
            }
        }
        qR = inst.getItems(testContainer);
        items = qR.getItemsSnapshot();
        if (qR == null) {
            System.out.println("Query got null. ");
        } else {
            items = qR.getItemsSnapshot();
            System.out.println("------------------------------------------------------------");
            for(com.cbe.Item item : items) {
                if (item.type() == com.cbe.ItemType.Container) {
                    System.out.println(" <CNT>  " + item.name() + "/");
                } else {
                    System.out.println("\t" + item.name() + ":");
                    myObject = com.cbe.CloudBackend.castObject(item);
                    metadata = myObject.keyValues();
                    metadata.forEach((key, value)->{
                        System.out.printf("%20s = %-16s%s\n",
                                        key, value.getFirst(),
                                        (value.getSecond()? "\t(indexed)" : ""));
                        }
                    );
                }
            }
            System.out.println("------------------------------------------------------------");
            System.out.println("Count: " + qR.objectsLoaded() + " objects\t" + qR.containersLoaded() + " containers");
        }
    }   
```

### Compile and Run

As a last step you are now ready to, from the Linux shell terminal, compile the exercise and then run the generated program.

**shell**

```sh
sh compile.sh
sh run.sh    
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-2>*

---

## Exercise 3

In this exercise createObject and query will be implemented and used. You will add a lot of code for printing query results in different ways; one way for all the items in a Container and one method for specifically the key/values added on an object.

### Add your code

In the file Tutorial.java; go to  // Exercise 3 here  and add your code to create a new Object and query your container. E.g.:

**Java**

```java
// Exercise 3
    Obj_VI_Pair metaDataValue;
    boolean metaIndexed1;
    String metaKeyName1;
    String metaValue;
    String objectName;
    objectName    = inquiry.inquireString("Name of new object", "o1");
    metaKeyName1  = inquiry.inquireString("1. key name", "color");
    metaValue     = inquiry.inquireString("value", "white");
    metaIndexed1  = inquiry.inquireBool("indexed", true);
    metaDataValue = new Obj_VI_Pair(metaValue, metaIndexed1);
    metadata.put(metaKeyName1, metaDataValue);
    metaKeyName2  = inquiry.inquireString("2. key name", "height");
    metaValue     = inquiry.inquireString("value", "42");
    metaIndexed2  = inquiry.inquireBool("indexed", true);
    metaDataValue = new Obj_VI_Pair(metaValue, metaIndexed2);
    metadata.put(metaKeyName2, metaDataValue);
    metaKeyName3  = inquiry.inquireString("3. key name", "prize");
    metaValue     = inquiry.inquireString("value", "125");
    metaIndexed3  = inquiry.inquireBool("indexed", false);
    metaDataValue = new Obj_VI_Pair(metaValue, metaIndexed3);
    metadata.put(metaKeyName3, metaDataValue);

    myObject = inst.createObject(testContainer, objectName, metadata);

    qR = inst.getItems(testContainer);
    items = qR.getItemsSnapshot();
    if (qR == null) {
        System.out.println("Query got null. ");
    } else {
        items = qR.getItemsSnapshot();
        System.out.println("Loaded: " + qR.itemsLoaded());
        System.out.println("Content of: /" + testContainer.name() + "/");
        System.out.println("------------------------------------------------------------");
        for(com.cbe.Item item : items) {
            if (item.type() == com.cbe.ItemType.Container) {
                System.out.println(" <CNT>  " + item.name() + "/");
            } else {
                System.out.println("\t" + item.name() + ":");
                myObject = com.cbe.CloudBackend.castObject(item);
                metadata = myObject.keyValues();
                metadata.forEach((key, value)->{
                    System.out.printf("%20s = %-16s%s\n",
                                        key, value.getFirst(),
                                        (value.getSecond()? "\t(indexed)" : ""));
                    }
                );
            }
        }
        System.out.println("------------------------------------------------------------");
        System.out.println("Count: " + qR.objectsLoaded() + " objects\t" + qR.containersLoaded() + " containers");
    }    
```

Test to compile the code.

**shell**

```sh
sh compile.sh    
```

To reset the account changes, implement a way to clean up Containers and Objects that have been created.

**Java**

```java
if (inquiry.inquireBool("Delete /" + testContainer.name() + "/ ", false)) {
    System.out.println("Remove Container /" + testContainer.name() + "/");
    inst.removeContainer(testContainer);
}    
```

Another way to remove your Container is to use the rmdir command in the CLI tool.

### Compile and Run

As a last step you are now ready to from the Linux shell terminal compile the exercise and then run the generated program.

**shell**

```sh
sh compile.sh
sh run.sh    
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/exercise-3>*

---

## Installation

### Preparation

- [Ubuntu LTS](https://ubuntu.com/) Linux operating system on x86_64

- [SDK](https://github.com/CloudBackend-AB/CloudBackendSDK) — Software Development Kit (zip file) which includes the template files used with the exercises.

### Installation

From a terminal window; unpack the package file and run the installation

**shell**

```sh
cd
cd Downloads                                # the download directory or equivalent
unzip CloudBackendSDK-*                     # replace with the zip file name previously downloaded
cd CloudBackendSDK-                         # the new unpacked directory
bash installSDK.sh                          # run the full installation script
                                            # which will call the Java installation script

cd ~/cbe/current/Java/Examples
mkdir -p Tutorial                           # if not already created
cd Tutorial                                 # put exercise files here 
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/installation>*

---

## LogInDelegate structure

To make an asynchronous program the main program will also need to have Delegates that will handle the call back code.


Here is an example where the delegate is implemented as a class MyLogInDelegate.

See the comments inline describing in more detail.

**Java**

```java
import com.cbe.*;
import com.cbe.delegate.*;

public class MyLogInDelegate extends com.cbe.delegate.LogInDelegate {
    MyLogInDelegate() {}
    private boolean              finished = false;
    private String               errorInfo;
    private com.cbe.CloudBackend cbObj;

    /**
     * Called upon successful log in.
     * @param cloudBackend Instance of a CloudBackend holding the session.
     */
    @Override
    synchronized public void onLogInSuccess(com.cbe.CloudBackend cloudBackend) {
        cbObj = cloudBackend;
        // If delegate is reused, clear possible error state
        errorInfo = null;
        finished = true;
        notify();
    }

    /**
     * Called upon failed log in.
     * @param error   Error information passed from CloudBackend SDK.
     * @param context Additional context information about the original service
     *                call that has failed.
     */
    @Override
    synchronized public void onLogInError(com.cbe.delegate.Error error,
                                        com.cbe.util.Context   context) {
        errorInfo = "Login error: code=" + error.getErrorCode() +
                    ", reason=\"" + error.getReason() +
                    "\", message=\"" + error.getMessage() + "\"";
        finished = true;
        notify();
    }

    synchronized public CloudBackend waitForRsp() {
        while (!finished) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        // Reset finished flag, so current delegate instance can be reused
        finished = false;
        if (errorInfo != null) {
            throw new RuntimeException(errorInfo);
        }
        return cbObj;
    }
}   
```

### Client application code

Here is an example of parts of the client code using that delegate to wait for the callback from the server.

The writing ~~~ indicates that something needs to be added in its place.

**Java**

```java
~~~
    com.cbe.CloudBackend cloudBackend = null;
    MyLogInDelegate delegate = new MyLogInDelegate();
    try
    {
        System.out.println("Connecting as " + username);
        cloudBackend = com.cbe.CloudBackend.logIn(username, password, tenant, delegate);
        System.out.println("Waiting.");
        cloudBackend = delegate.waitForRsp();
    }
    catch (RuntimeException e)
    {
        System.out.println("Caught error:");
        e.printStackTrace();
        System.out.println();
    };
    return cloudBackend;
~~~    
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/logindelegate-structure>*

---

## queryDelegate structure

An example of an asynchronous query with the Delegate and Client code that runs after a successful LogIn.


In this asynchronous program example the Delegate thread that will handle the call back code is shown separate from the main Client code.

See the comments inline describing in more detail.

### Delegate code

**C++**

```cpp
import com.cbe.delegate.*;

public class MyQueryDelegate extends com.cbe.delegate.QueryDelegate {
    MyQueryDelegate() {}
    private boolean             finished = false;
    private String              errorInfo;
    private com.cbe.QueryResult queryResult;

    /**
     * Called upon successful query.
     * @param queryResult Instance of a QueryResult containing the result set.
     */
    @Override
    synchronized public void onQuerySuccess(com.cbe.QueryResult queryResult) {
        this.queryResult = queryResult;
        // If delegate is reused, clear possible error state
        errorInfo = null;
        finished = true;
        notify();
    }

    /**
     * Called upon a failed query() or join() call.
     * @param error   Error information passed from %CloudBackend SDK.
     * @param context Additional context information about the original service
     *                call that has failed.
     */
    @Override
    synchronized public void onQueryError(com.cbe.delegate.QueryError error,
                                        com.cbe.util.Context        context) {
        errorInfo = "Query error: code=" + error.getErrorCode() +
                    ", reason=\"" + error.getReason() +
                    "\", message=\"" + error.getMessage() + "\"";
        finished = true;
        notify();
    }

    synchronized public com.cbe.QueryResult waitForRsp() {
        while (!finished) {
            try {
            wait();
            } catch (InterruptedException e) {
            e.printStackTrace();
            }
        }
        // Reset finished flag, so current delegate instance can be reused
        finished = false;
        if (errorInfo != null) {
            throw new RuntimeException(errorInfo);
        }
        return queryResult;
    }
}   
```

### Client application code

**C++**

```cpp
public com.cbe.getObjects getItems(com.cbe.Container parentContainer) {
    Filter filter = new Filter();
    filter.setAscending(true);
    filter.setDataType(com.cbe.ItemType.Object);
    MyQueryDelegate delegate = new MyQueryDelegate();
    com.cbe.QueryResult queryResult = null;
    try
    {
        com.cbe.QueryChain chain = parentContainer.query(filter, delegate);
        queryResult = delegate.waitForRsp();
    }
    catch (RuntimeException e)
    {
        System.out.println("Caught error:");
        e.printStackTrace();
        System.out.println();
    };
    return queryResult;
}          
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/querydelegate-structure>*

---

## Scripts

Add the following two scripts compile.sh and run.sh. They are included in the SDK bundle. Alternatively, use your own scripts.

### Compile the program code

**compile.sh**

compile.sh

**shell**

```sh
#!/bin/sh
## CloudBackend AB 2021-2022.
## The libcbe.jar contains the .so library for the java sdk.
## It can set -Djava.library.path=path/to/libraries
## if you want to have them somewhere else than the standard path.

## compiling
mkdir -p classes
javac -cp '.:../../lib/com.cbe.jar' -d classes *.java
result=$?

if [ $result -gt 0 ]
then
    echo "Halting due to error returned:" $result
    exit $result
fi        
```

### Run the compiled program

**run.sh**

run.sh

**shell**

```sh
#!/bin/sh
## CloudBackend AB 2021-2022.
## The libcbe.jar contains the .so library for the java sdk.
## It can set -Djava.library.path=path/to/libraries
## if you want to have them somewhere else than the standard path.

## run
java -Djava.library.path=../../lib/ -cp 'classes:../../lib/com.cbe.jar' Tutorial    
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-java-sdk/scripts>*

---
