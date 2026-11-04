# CloudBackend SDK — C++ tutorial

Installation, asynchronous programming, delegate structures and the three exercises.

9 topics from the published CloudBackend documentation, generated on 2026-10-10. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Tutorial C++ SDK](#tutorial-c-sdk)
- [Asynchronous programming](#asynchronous-programming)
- [Exercise 1](#exercise-1)
- [Exercise 2](#exercise-2)
- [Exercise 3](#exercise-3)
- [Installation](#installation)
- [LogInDelegate structure](#logindelegate-structure)
- [queryDelegate structure](#querydelegate-structure)
- [Scripts](#scripts)

## Tutorial C++ SDK

- [Exercise 1](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-1) section
- [Exercise 2](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-2) section
- [Exercise 3](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-3) section

### Tutorial objective

The following SDK Tutorial document will give an overview on how to use the backend calls in the SDK of CloudBackend (cbe). This is done with a more complete login example and by listing code examples as an exercise in three steps. The C++ example is used in the descriptions here.

The examples here are based on SDK version 2.1.

Similar examples are available in the Java and Swift languages.

### Classes

The classes available when writing programs using the CloudBackend SDK API.


### Containers and Objects

The Database consists of [containers](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/container), [objects](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/object), [key/values](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/key-value) (meta-data), [streams](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/stream), [ACL](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/sharing/acl) which are all stored in a database belonging to either an [identity (account)](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/account) or [group](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/group). Click on the links above for more information.


### To use the Tutorial

In this tutorial you will need a CloudBackend account, the include files and a copy of the SDK binary called libcb_sdk.a which is a static library.

The tutorial will focus on teaching 4 simple methods that are needed to get started with the basics of using the SDK. Remember this is not a course in C++.

The tutorial is structured in 3 exercises:

- [login to your account](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-1)
- [create a Container in the root container](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-2)
- [query the account and create an Object on the backend service](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-3).

At the end of this document there is a link to download the Tutorial source code.

### Acknowledgement

Many thanks to Forware AB for valuable contribution to the example code in this Tutorial.

To reset your account, do implement on your own, a way to clean up Containers and Objects that have been created.

Another way to remove your Container is to use the rmdir command in the CLI tool in the dashboard.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk>*

---

## Asynchronous programming

All remote communication within the Singularity Database takes place asynchronously. Any updates are first made to the local cache of data, then asynchronously applied to the rest of the Singularity Database outside the SDK. When remote request completes, a callback is made to the delegate you have implemented.

In this Tutorial there are two synchronous and one asynchronous examples. The synchronous have two different error handling structures; Exception throwing and Non throwing.

#### Synchronous

The synchronous SDK will be easier to use, but will freeze operations waiting for the cloud to respond. For sequential code e.g. reports or manual input, this may be a natural choice.


#### Asynchronous

Working asynchronously means that the main thread may continue to work while there is a separate parallel **delegate** thread created that will wait for the response, process the response, and optionally make any follow-up processing or hand over. This means that the applications you write on top of the SDK will be event-driven instead of being triggered by a main loop. The end user experience for users will be a user interface that is responsive and does not freeze while waiting for a server response. Working this way can also enable you to listen to changes other programs may do to the same data in the Singularity Database.


It is possible to mix both synchronous and asynchronous calls in the same program.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/asynchronous-programming>*

---

## Exercise 1

To get started with CloudBackend we need to login to the service. This first exercise demonstrates how to login a user using the different methods that we offer at the moment.

- Main.cpp
- Logic.h
- Logic1.cpp
- MyDelegates.cpp [only for the Asynchronous case]
- MyGenericFunctions.cpp
- compile.sh
- run.sh

### Exercise: Logic1.cpp

**Synchronous [exception]**

Here we demonstrate the synchronous `logIn()` function that throws.

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -
// Exit function that reports how the program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}
// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -
void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }

  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  // Call login and set member variable
  try
  {
    myCloudBackend = cbe::CloudBackend::logIn(username, password, tenant, client);
    // Confirm login and SDK version
    std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
              << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
              << std::endl;
  }
  catch (cbe::CloudBackend::LogInException& e)
  {
    std::cout << "Error, login failed! \nError info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  /* Exercise 2 */

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic 
```

**Synchronous [non-throwing]**

Here we demonstrate the synchronous `logIn()` function that is non-throwing.

**C++**

```cpp
#include "Logic.h"

#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -
// Exit function that reports how the program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
}
// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -
void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }

  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  // Call login and set member variable
  cbe::CloudBackend::LogInError logInError;
  myCloudBackend = cbe::CloudBackend::logIn(username, password, tenant, client, logInError);

  // Check if error
  if (logInError){
    // Print info about error
    std::cout << "Error, login failed! \nError info="
              << logInError << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

**Asynchronous [delegates]**

Here we demonstrate the asynchronous `logIn()` function that uses a delegate.

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -
// Exit function that reports how the program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}
// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -
void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }

  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  // Create log in delegate
  std::shared_ptr<MyLogInDelegate> logInDelegate =
                                            std::make_shared<MyLogInDelegate>();
  // Call login and set member variable
  myCloudBackend = cbe::CloudBackend::logIn(username,
                                            password,
                                            tenant,
                                            client,
                                            logInDelegate);
  // Wait for delegate to finish
  logInDelegate->waitForRsp();

  // Check if error
  if (logInDelegate->errorInfo){
    // Print info about error
    std::cout << "Error, login failed! \nError info="
              << logInDelegate->errorInfo << std::endl;
    // Exit program with unique code
    exitProgram(10);
  }
  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic    
```

**logIn() versions**

```cpp
// Synchronous logIn() that throws an exception
cbe::CloudBackend myCloudBackend = cbe::CloudBackend::logIn(username, password, tenant, client);
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Synchronous logIn() that is non-throwing
cbe::CloudBackend::LogInError logInError;
cbe::CloudBackend myCloudBackend = cbe::CloudBackend::logIn(username, password, tenant, client, logInError);
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Asynchronous logIn() that uses a delegate
std::shared_ptr<MyLogInDelegate> logInDelegate = std::make_shared<MyLogInDelegate>();
cbe::CloudBackend::logIn(username, password, tenant, client, logInDelegate);
logInDelegate->waitForRsp(); 
```

### Main program and header

**Main.cpp**

In the common start code `Main.cpp` we forward reference the instance of class Exercise (line 17; which will be coded in Logic1.cpp) and then call it in line 18.

**C++**

```cpp
#include <iostream>
#include <chrono>
#include <thread>

#include "Logic.h"
#include "cbe/util/Exception.h"

int main(int argc, char *argv[])
{
  // Use argv to indicate which binary is ran
  std::string progName = std::string(argv[0]);
  std::cout << "Started program " << progName << std::endl;

  // Try to run program
  Exercise exercise{};
  try {
    // Instead of putting the code in the main it is split into exercises
    exercise.logic();
  }
  // If something fails we should catch that exception and print it
  catch (cbe::util::Exception& e){
    std::cout << "Got exception: \"" << e.what()
              << "\"\nType: "        << e.typeAsString() << std::endl;
    if (exercise.myCloudBackend) {
      exercise.myCloudBackend.terminate();
    }
    return 1;
  }
  // If something fails that is not an exception we get the following case
  catch (...)
  {
    std::cerr << "Error caused termination of program" << std::endl;
    if (exercise.myCloudBackend) {
      exercise.myCloudBackend.terminate();
    }
    return 9;
  }
  std::cout << "Ending program " << progName << std::endl;
  if (exercise.myCloudBackend) {
    exercise.myCloudBackend.terminate();
  }
  return 0;
}   
```

**Logic.h**

In the common header file `Logic.h` add the following:

**C++**

```cpp
#ifndef INCLUDE_cbe_SOLUTION_LOGIC_BODY_H_
#define INCLUDE_cbe_SOLUTION_LOGIC_BODY_H_

#include <iostream>
#include <condition_variable>
#include <memory>
#include <mutex>

#include "cbe/Account.h"
#include "cbe/CloudBackend.h"
#include "cbe/Types.h"
#include "cbe/QueryChain.h"
#include "cbe/QueryResult.h"

class Exercise {
public:
  // Logic is the main program
  void logic();

  // Is used when code should terminate with a unique code
  void exitProgram(int errorCode);

  // General member variables to use in the code
  // The central Object owning the login session.
  cbe::CloudBackend myCloudBackend{cbe::DefaultCtor{}};
  // Top root Container - home://
  cbe::Container    rootContainer{cbe::DefaultCtor{}};

private:
  cbe::QueryResult  qResult{cbe::DefaultCtor{}};

#if 1
  // Exercise 2
  void loadContainerContents(cbe::Container container);
  void printContainerContents(cbe::QueryResult q);
  void createContainer(cbe::Container parentContainer);
  cbe::Container myContainer{cbe::DefaultCtor{}};

  // Exercise 3
  void loadContainerObjects(cbe::Container container);
  void printObjects(cbe::QueryResult q);
  cbe::Container selectContainer(const std::string& prompt);
  cbe::Object createObject(cbe::Container inContainer);
  cbe::Object object{cbe::DefaultCtor{}};
#endif

  // Generic functions
  static const bool  noBoolDefaultVal;
  static bool inquireBool(const std::string& prompt,
                          const bool&        defaultVal = noBoolDefaultVal);

  static const int noIntDefaultVal;
  static int inquireInt(const std::string& prompt,
                        const int&         defaultVal = noIntDefaultVal);

  static const std::string noStringDefaultVal;
  static std::string inquireString(const std::string& prompt,
                                   const std::string& defaultVal =
                                                            noStringDefaultVal);

  static std::string trimString(const std::string& str);

  static const char* itemTypeString(cbe::ItemType itemType);
  static void printItem(const cbe::Item& item, bool printParentId = false);

  static std::string containerName(cbe::Container  container,
                                   bool            temporary = false);
  static std::string objectName(cbe::Object  object,
                                bool         temporary = false);
};  //  class Exercise

#endif  // INCLUDE_cbe_SOLUTION_LOGIC_BODY_H_   
```

### Delegates and Helpers

MyDelegates.cpp provides to the Asynchronous programs the delegates code for that will receive and handle the callbacks with the responses from the cloud service.

**MyDelegates.cpp**

**C++**

```cpp
/*
  CloudBackend AB 2022 - 2023.
*/

#include <condition_variable>
#include <iostream>
#include <iterator>
#include <mutex>
#include <stdexcept>
#include <string>

#include "cbe/CloudBackend.h"
#include "cbe/Container.h"
#include "cbe/QueryResult.h"

#include "cbe/delegate/CreateContainerDelegate.h"
#include "cbe/delegate/LogInDelegate.h"
#include "cbe/delegate/QueryDelegate.h"

// - - - - - - - - - - - - - - - - - DELEGATES - - - - - - - - - - - - - - - - -

class MyLogInDelegate :  public cbe::delegate::LogInDelegate
{
  // Mutex lock and condition variable are used to verify that operation has
  // completed.
  std::mutex              mutex{};
  std::condition_variable conditionVariable{};

  // Used to see if callback is reached
  bool                    called = false;

  // User implemented callback, return value is cbe::CloudBackend&&
  void onLogInSuccess(cbe::CloudBackend&& cloudBackend) final {
    {
      // Lock thread during operation
      std::lock_guard<std::mutex> lock(mutex);
      this->cloudBackend = std::move(cloudBackend);
      called = true;
    }
    // Notify when operation is done to unlock
    conditionVariable.notify_one();
  }

  // User implemented error callback
  void onLogInError(cbe::delegate::Error&&  error,
                    cbe::util::Context&&    context) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      // Set member variable errorInfo with information about fail
      errorInfo = ErrorInfo{std::move(context), std::move(error)};
      called = true;
    }
    conditionVariable.notify_one();
  }
public:
  // Member variables for the delegate, will later be accessed through the
  // delegate defined in the code
  cbe::CloudBackend cloudBackend{cbe::DefaultCtor{}};
  ErrorInfo errorInfo{};

  // Wait function is called on the delegate when it is being used
  void waitForRsp() {
    std::unique_lock<std::mutex> lock(mutex);
    std::cout << "Waiting, to be logged in" << std::endl;
    conditionVariable.wait(lock, [this] { return called; });
    std::cout << "Now we have waited: " << called << std::endl;
    // Reset called flag, so current delegate instance can be reused
    called = false;
  }

}; // class MyLogInDelegate

//------------------------------------------------------------------------------

class MyQueryDelegate :  public cbe::delegate::QueryDelegate
{
  std::mutex              mutex{};
  std::condition_variable conditionVariable{};
  bool                    called = false;

  /**
   * Called upon successful query.
   * @param queryResult Instance of a QueryResult containing the result set.
   */
  void onQuerySuccess(cbe::QueryResult&& queryResult) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      this->queryResult = std::move(queryResult);
      called = true;
    }
    conditionVariable.notify_one();
  }

  /**
   * Called upon a failed query() or join() call.
   * @param error   Error information passed from %CloudBackend SDK.
   * @param context Additional context information about the original service
   *                call that has failed.
   */
  void onQueryError(cbe::delegate::QueryError&&         error,
                    cbe::util::Context&&                context) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      errorInfo = ErrorInfo{std::move(context), std::move(error)};
      called = true;
    }
    conditionVariable.notify_one();
  }

public:
  /*implementation of delegates */
  cbe::QueryResult  queryResult{cbe::DefaultCtor{}};
  ErrorInfo         errorInfo{};

  void waitForRsp() {
    std::unique_lock<std::mutex> lock(mutex);
    std::cout << "Waiting, for query" << std::endl;
    conditionVariable.wait(lock, [this] { return called; });
    std::cout << "Now we have waited: " << called << std::endl;
    // Reset called flag, so current delegate instance can be reused
    called = false;
  }
}; // class MyQueryDelegate

//------------------------------------------------------------------------------

class MyCreateContainerDelegate :  public cbe::delegate::CreateContainerDelegate
{
  std::mutex              mutex{};
  std::condition_variable conditionVariable{};

  bool                    called = false;

  void onCreateContainerSuccess(cbe::Container&& container) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      this->container = std::move(container);
      called = true;
    }
    conditionVariable.notify_one();
  }
  void onCreateContainerError(Error&& error, cbe::util::Context&& context) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      errorInfo = ErrorInfo{std::move(context), std::move(error)};
      called = true;
    }
    conditionVariable.notify_one();
  }

public:
  /*implementation of delegates */
  cbe::Container container{cbe::DefaultCtor{}};
  ErrorInfo errorInfo{};

  void waitForRsp() {
    std::unique_lock<std::mutex> lock(mutex);
    std::cout << "Waiting, for create container" << std::endl;
    conditionVariable.wait(lock, [this] { return called; });
    std::cout << "Now we have waited: " << called << std::endl;
    // Reset called flag, so current delegate instance can be reused
    called = false;
  }
}; // class MyCreateContainerDelegate

//------------------------------------------------------------------------------

class MyCreateObjectDelegate :  public cbe::delegate::CreateObjectDelegate
{
  std::mutex              mutex{};
  std::condition_variable conditionVariable{};

  bool                    called = false;

  void onCreateObjectSuccess(cbe::Object&& object) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      this->object = std::move(object);
      called = true;
    }
    conditionVariable.notify_one();
  }
  void onCreateObjectError(Error&& error, cbe::util::Context&& context) final {
    {
      std::lock_guard<std::mutex> lock(mutex);
      errorInfo = ErrorInfo{std::move(context), std::move(error)};
      called = true;
    }
    conditionVariable.notify_one();
  }

public:
  /*implementation of delegates */
  cbe::Object object{cbe::DefaultCtor{}};
  ErrorInfo errorInfo{};

  void waitForRsp() {
    std::unique_lock<std::mutex> lock(mutex);
    std::cout << "Waiting, for create object" << std::endl;
    conditionVariable.wait(lock, [this] { return called; });
    std::cout << "Now we have waited: " << called << std::endl;
    // Reset called flag, so current delegate instance can be reused
    called = false;
  }
}; // class MyCreateObjectDelegate

//------------------------------------------------------------------------------  
```

`MyGenericFunctions.cpp` provides some generic functions for input and printing.

As a last step you are now ready to from the Linux shell terminal compile Exercise 1 and then run the generated program.

**shell**

```sh
sh compile.sh 1      # compile exercise 1
sh run.sh 1          # run your compiled exercise 1  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-1>*

---

## Exercise 2

In this exercise we will add a Container to your account. The name of this Container is of course arbitrary and you can use a naming convention you like.

- Logic2.cpp

### Exercise: Logic2.cpp

**Synchronous [exception]**

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  try
  {
    myContainer = parentContainer.createContainer(name);
  }
  catch (const cbe::Container::CreateContainerException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;
  try
  {
    // Create a filter that limits the query to only return containers
    cbe::Filter containerFilter;
    containerFilter.setDataType(cbe::ItemType::Container);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(containerFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  try
  {
    // Call login and set member variable
    myCloudBackend = cbe::CloudBackend::logIn(username,
                                              password,
                                              tenant,
                                              client);
  }
  catch (const cbe::CloudBackend::LogInException& e)
  {
    // print info about error
    std::cout << "error, login failed! \nerror info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = myCloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

**Synchronous [non-throwing]**

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  try
  {
    myContainer = parentContainer.createContainer(name);
  }
  catch (const cbe::Container::CreateContainerException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;
  try
  {
    // Create a filter that limits the query to only return containers
    cbe::Filter containerFilter;
    containerFilter.setDataType(cbe::ItemType::Container);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(containerFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  try
  {
    // Call login and set member variable
    myCloudBackend = cbe::CloudBackend::logIn(username,
                                              password,
                                              tenant,
                                              client);
  }
  catch (const cbe::CloudBackend::LogInException& e)
  {
    // print info about error
    std::cout << "error, login failed! \nerror info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = myCloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

**Asynchronous [delegates]**

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyDelegates.cpp"
#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  try
  {
    myContainer = parentContainer.createContainer(name);
  }
  catch (const cbe::Container::CreateContainerException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;
  try
  {
    // Create a filter that limits the query to only return containers
    cbe::Filter containerFilter;
    containerFilter.setDataType(cbe::ItemType::Container);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(containerFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  try
  {
    // Call login and set member variable
    myCloudBackend = cbe::CloudBackend::logIn(username,
                                              password,
                                              tenant,
                                              client);
  }
  catch (const cbe::CloudBackend::LogInException& e)
  {
    // print info about error
    std::cout << "error, login failed! \nerror info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = myCloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

Compile and run Logic2.cpp.

**shell**

```sh
sh compile.sh 2      # compile exercise 2
sh run.sh 2          # run your compiled exercise 2  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-2>*

---

## Exercise 3

In this exercise query and createObject will be implemented and used. We will add a lot of code for printing query results in different ways; one way for all the items in a Container and one method for specifically the key/values added on an object.

- Logic3.cpp

### Exercise: Logic3.cpp

**Synchronous [exception]**

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  try
  {
    myContainer = parentContainer.createContainer(name);
  }
  catch (const cbe::Container::CreateContainerException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;
  try
  {
    // Create a filter that limits the query to only return containers
    cbe::Filter containerFilter;
    containerFilter.setDataType(cbe::ItemType::Container);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(containerFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// The same as loadContainerContents but with different filter
void Exercise::loadContainerObjects(cbe::Container container) {
  std::cout << "Getting Objects in Container " << containerName(container)
            << std::endl;

  try
  {
    // Create a filter that limits the query to only return objects
    cbe::Filter objectFilter;
    objectFilter.setDataType(cbe::ItemType::Object);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(objectFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    // Check if error
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about fail
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(33);
  }
}

void Exercise::printObjects(cbe::QueryResult queryResult) {
  cbe::Object tempObject{cbe::DefaultCtor{}}; // nullptr;
  std::cout << "Printing Objects from query result: " << std::endl;
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // Loop through Objects from queryResult
  for (const auto& item : queryResult.getItemsSnapshot()) {
    if (item.type() == cbe::ItemType::Object) {
      printItem(item);
      tempObject = cbe::CloudBackend::castObject(item);

      // Get key/value information to print
      const auto keyValues = tempObject.keyValues();
      if (!keyValues.empty()) {

        // Loop through key/values for each object
        for (const auto& keyValue : keyValues) {
          const auto& key      = keyValue.first;
          const auto& sdkValue = keyValue.second;
          const auto  indexed  = std::get<bool>(sdkValue);
          std::cout << "    " << key << " = " << "'"
                    << std::get<std::string>(sdkValue)
                    << "'" << (indexed? " \t\t(indexed)" : "") << std::endl;
        }
      }  // if (!keyValues.empty())
    }   // if (item.type() == cbe::ItemType::Object)
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // If Container does not contain any objects
  if (!tempObject) {
    std::cout << "Sorry, no Objects found in the Container!" << std::endl;
  }
}

cbe::Container Exercise::selectContainer(const std::string& prompt) {
  std::cout << "Select Container" << std::endl;
  const auto items = this->qResult.getItemsSnapshot();

  // Do the following until user has entered a Container that exists
  while (true) {
    // Generic function to get string from user input
    const auto containerName = inquireString(prompt);

    // Loop through and look for Container that user has requested
    for (const auto& item : items) {

      // If Container is found, return it
      if (item.name() == containerName) {
        return cbe::CloudBackend::castContainer(item);
      }
    }

    // If Container is not fount an error is printed
    std::cout << "Error: the Container you asked for, \"" << containerName
              << "\", was not found; following are the options:" << std::endl;
    // Loops through available Containers to select
    for (const auto& item : items) {
      printItem(item);
    }
  }
}

cbe::Object Exercise::createObject(cbe::Container inContainer) {
  std::cout << "Create Object" << std::endl;

  // Generic functions to get string from user input
  const std::string name = inquireString("Set name for Object");

  // Set the number of key/values the user wants to input
  const int numOfTags =
                       inquireInt("Set the number of Key/Value pairs you want");

  // Create variable for key/values
  cbe::KeyValues keyValues;

  for (int i = 1; i <= numOfTags; i++) {

    // String that will contain the key name
    std::string keyName{};

    // Set keyName and check if it is valid
    while(true) {
      keyName = inquireString("Name of Key #" + std::to_string(i));
      if(!isdigit(keyName[0])){
        break;
      }
      // Error message if user input starts with a number
      std::cout << "Key can not start with numerical! " << std::endl;
    }

    // Generic function to get string from user input
    const auto value =
        inquireString("Value for #" + std::to_string(i) + " '" + keyName + "'");

    // Generic function to get bool from user input
    // Indexed key/values are quicker to access through searching
    const auto indexed =
                       inquireBool("Make KeyValue pair #" + std::to_string(i) +
                                   " indexed or not (y indexed, n not indexed",
                                   true /* defaultVal */);
    // Insert value for key
    keyValues[keyName] = std::pair<std::string, bool>(value, indexed);
  }
  cbe::Object object{cbe::DefaultCtor{}};
  try
  {
    // Create Object with name, key/values
    Object =  inContainer.createObject(name, keyValues);
  }
  catch (const cbe::Container::CreateObjectException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not create object." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit with unique code
    exitProgram(31);
  }
  // Return Object from object
  return object;
}

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  try
  {
    // Call login and set member variable
    myCloudBackend = cbe::CloudBackend::logIn(username,
                                              password,
                                              tenant,
                                              client);
  }
  catch (const cbe::CloudBackend::LogInException& e)
  {
    // print info about error
    std::cout << "error, login failed! \nerror info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = myCloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  // Load Container contents ie. query it to get its contents
  loadContainerContents(rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Print the number of items in the container
  std::cout << "Item count: " << this->qResult.getItemsSnapshot().size()
            << std::endl;

  // Prompts the user to select a Container in which an Object is to be created
  this->myContainer =
     selectContainer("In which Container do you want to create the new object");

  // Print the Container the user selected
  std::cout << "Container: " << containerName(this->myContainer) << std::endl;

  // Creates an Object in the selected container
  Object = createObject(this->myContainer);

  // Prints information about the Object that has been created
  std::cout << "Designated name: " << objectName(object, true) << std::endl;
  std::cout << "Object name: " << objectName(object) << std::endl;

  // Finally after the Object has been created, load its contents
  loadContainerObjects(this->myContainer);

  // Print all Objects and its content
  printObjects(this->qResult);

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

**Synchronous [non-throwing]**

**C++**

```cpp
#include "Logic.h"
#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  try
  {
    myContainer = parentContainer.createContainer(name);
  }
  catch (const cbe::Container::CreateContainerException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;
  try
  {
    // Create a filter that limits the query to only return containers
    cbe::Filter containerFilter;
    containerFilter.setDataType(cbe::ItemType::Container);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(containerFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// The same as loadContainerContents but with different filter
void Exercise::loadContainerObjects(cbe::Container container) {
  std::cout << "Getting Objects in Container " << containerName(container)
            << std::endl;

  try
  {
    // Create a filter that limits the query to only return objects
    cbe::Filter objectFilter;
    objectFilter.setDataType(cbe::ItemType::Object);

    // Call query function with filter
    qResult = static_cast<cbe::QueryResult>(container.query(objectFilter));
  }
  catch (const cbe::Container::QueryException& e)
  {
    // Check if error
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about fail
    std::cout << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(33);
  }
}

void Exercise::printObjects(cbe::QueryResult queryResult) {
  cbe::Object tempObject{cbe::DefaultCtor{}}; // nullptr;
  std::cout << "Printing Objects from query result: " << std::endl;
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // Loop through Objects from queryResult
  for (const auto& item : queryResult.getItemsSnapshot()) {
    if (item.type() == cbe::ItemType::Object) {
      printItem(item);
      tempObject = cbe::CloudBackend::castObject(item);

      // Get key/value information to print
      const auto keyValues = tempObject.keyValues();
      if (!keyValues.empty()) {

        // Loop through key/values for each object
        for (const auto& keyValue : keyValues) {
          const auto& key      = keyValue.first;
          const auto& sdkValue = keyValue.second;
          const auto  indexed  = std::get<bool>(sdkValue);
          std::cout << "    " << key << " = " << "'"
                    << std::get<std::string>(sdkValue)
                    << "'" << (indexed? " \t\t(indexed)" : "") << std::endl;
        }
      }  // if (!keyValues.empty())
    }   // if (item.type() == cbe::ItemType::Object)
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // If Container does not contain any objects
  if (!tempObject) {
    std::cout << "Sorry, no Objects found in the Container!" << std::endl;
  }
}

cbe::Container Exercise::selectContainer(const std::string& prompt) {
  std::cout << "Select Container" << std::endl;
  const auto items = this->qResult.getItemsSnapshot();

  // Do the following until user has entered a Container that exists
  while (true) {
    // Generic function to get string from user input
    const auto containerName = inquireString(prompt);

    // Loop through and look for Container that user has requested
    for (const auto& item : items) {

      // If Container is found, return it
      if (item.name() == containerName) {
        return cbe::CloudBackend::castContainer(item);
      }
    }

    // If Container is not fount an error is printed
    std::cout << "Error: the Container you asked for, \"" << containerName
              << "\", was not found; following are the options:" << std::endl;
    // Loops through available Containers to select
    for (const auto& item : items) {
      printItem(item);
    }
  }
}

cbe::Object Exercise::createObject(cbe::Container inContainer) {
  std::cout << "Create Object" << std::endl;

  // Generic functions to get string from user input
  const std::string name = inquireString("Set name for Object");

  // Set the number of key/values the user wants to input
  const int numOfTags =
                       inquireInt("Set the number of Key/Value pairs you want");

  // Create variable for key/values
  cbe::KeyValues keyValues;

  for (int i = 1; i <= numOfTags; i++) {

    // String that will contain the key name
    std::string keyName{};

    // Set keyName and check if it is valid
    while(true) {
      keyName = inquireString("Name of Key #" + std::to_string(i));
      if(!isdigit(keyName[0])){
        break;
      }
      // Error message if user input starts with a number
      std::cout << "Key can not start with numerical! " << std::endl;
    }

    // Generic function to get string from user input
    const auto value =
        inquireString("Value for #" + std::to_string(i) + " '" + keyName + "'");

    // Generic function to get bool from user input
    // Indexed key/values are quicker to access through searching
    const auto indexed =
                       inquireBool("Make KeyValue pair #" + std::to_string(i) +
                                   " indexed or not (y indexed, n not indexed",
                                   true /* defaultVal */);
    // Insert value for key
    keyValues[keyName] = std::pair<std::string, bool>(value, indexed);
  }
  cbe::Object object{cbe::DefaultCtor{}};
  try
  {
    // Create Object with name, key/values
    Object =  inContainer.createObject(name, keyValues);
  }
  catch (const cbe::Container::CreateObjectException& e)
  {
    std::cout << "Error!" << std::endl;
    std::cout << "Could not create object." << std::endl;

    // Print info about error
    std::cout << e.what() << std::endl;

    // Exit with unique code
    exitProgram(31);
  }
  // Return Object from object
  return object;
}

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  try
  {
    // Call login and set member variable
    myCloudBackend = cbe::CloudBackend::logIn(username,
                                              password,
                                              tenant,
                                              client);
  }
  catch (const cbe::CloudBackend::LogInException& e)
  {
    // print info about error
    std::cout << "error, login failed! \nerror info="
              << e.what() << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = myCloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  // Load Container contents ie. query it to get its contents
  loadContainerContents(rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Print the number of items in the container
  std::cout << "Item count: " << this->qResult.getItemsSnapshot().size()
            << std::endl;

  // Prompts the user to select a Container in which an Object is to be created
  this->myContainer =
     selectContainer("In which Container do you want to create the new object");

  // Print the Container the user selected
  std::cout << "Container: " << containerName(this->myContainer) << std::endl;

  // Creates an Object in the selected container
  Object = createObject(this->myContainer);

  // Prints information about the Object that has been created
  std::cout << "Designated name: " << objectName(object, true) << std::endl;
  std::cout << "Object name: " << objectName(object) << std::endl;

  // Finally after the Object has been created, load its contents
  loadContainerObjects(this->myContainer);

  // Print all Objects and its content
  printObjects(this->qResult);

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

**Asynchronous [delegates]**

**C++**

```cpp
#include "Logic.h"

#include <algorithm>  // std::find_if_not
#include <cctype>     // std:isspace, std::tolower, std::toupper
#include <cstring>
#include <iomanip>    // std::setw
#include <ios>        // std::left
#include <sstream>    // std::ostringstream
#include <stdexcept>
#include <string>

#include "MyDelegates.cpp"
#include "MyGenericFunctions.cpp"
#include "../user_credentials.cpp"

// - - - - - - - - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - - - - - -

// Exit function that reports how program was terminated
void Exercise::exitProgram(const int exitCode) {
  std::ostringstream oss;
  oss << "Exiting program with exit code: " << exitCode << ".";
  if (myCloudBackend) {
    myCloudBackend.terminate();
  }
  throw std::invalid_argument( oss.str() );
}

/* Exercise 2 */

// Creates a new Container in the parentContainer argument that is passed in
void Exercise::createContainer(cbe::Container parentContainer) {
  std::cout << "Logic: Create container" << std::endl;
  // Generic function to get string from user input
  const auto name = inquireString("Set name for Container");

  // Create a delegate that is going to be used for the createContainer method
  std::shared_ptr<MyCreateContainerDelegate> createContainerDelegate =
                                  std::make_shared<MyCreateContainerDelegate>();
  parentContainer.createContainer(name, createContainerDelegate);

  // Calling wait for the delegate to finish
  createContainerDelegate->waitForRsp();

  // Check if error, can also check if a Container was constructed.
  if (createContainerDelegate->errorInfo){
    std::cout << "Error!" << std::endl;
    std::cout << "Container creation failed." << std::endl;

    // Print info about error
    std::cout << createContainerDelegate->errorInfo << std::endl;

    // Exit program with unique code
    exitProgram(21);
  }

  // Get Container from the delegate
  this->myContainer = createContainerDelegate->container;
}

// Loads Container contents to be able to see what is inside the Container that
// is passed in
void Exercise::loadContainerContents(cbe::Container container) {
  // Generic function to print information about container
  std::cout << "Getting sub-container of " << containerName(container)
            << std::endl;

  // Create a filter that limits the query to only return containers
  cbe::Filter containerFilter;
  containerFilter.setDataType(cbe::ItemType::Container);
  std::shared_ptr<MyQueryDelegate> queryDelegate =
                                            std::make_shared<MyQueryDelegate>();

  // Call query function with filter and delegate
  container.query(containerFilter, queryDelegate);

  // Wait for delegate to finish
  queryDelegate->waitForRsp();

  // Check if error
  if (queryDelegate->errorInfo){ // Could also check if qResult was constructed
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about error
    std::cout << queryDelegate->errorInfo << std::endl;

    // Exit program with unique code
    exitProgram(30);
  }

  // Get queryResult from the delegate
  this->qResult = queryDelegate->queryResult;
}

// Function that prints Container contents
void Exercise::printContainerContents(cbe::QueryResult qResult) {
  // Put queryResult in vector of cbe::Item
  std::vector<cbe::Item> items = qResult.getItemsSnapshot();
  std::cout << "------------------------------------------------------------"
            << std::endl;
  // Loop through items and print them
  for (const auto& item : items) {
    // Generic print function
    printItem(item);
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;
}

/* Exercise 3 */

// The same as loadContainerContents but with different filter
void Exercise::loadContainerObjects(cbe::Container container) {
  std::cout << "Getting Objects in Container " << containerName(container)
            << std::endl;
  std::shared_ptr<MyQueryDelegate> queryDelegate =
                                            std::make_shared<MyQueryDelegate>();

  // Create a filter that limits the query to only return objects
  cbe::Filter objectFilter;
  objectFilter.setDataType(cbe::ItemType::Object);

  // Call query function with filter and delegate
  container.query(objectFilter, queryDelegate);

  // Wait for delegate to finish
  queryDelegate->waitForRsp();
   // Check if error
  if (queryDelegate->errorInfo){ // Can check if qResult was constructed.
    std::cout << "Error!" << std::endl;
    std::cout << "Could not load Container contents." << std::endl;

    // Print info about fail
    std::cout << queryDelegate->errorInfo << std::endl;

    // Exit program with unique code
    exitProgram(33);
  }

  // Get queryResult from the delegate
  this->qResult = queryDelegate->queryResult;
}

void Exercise::printObjects(cbe::QueryResult queryResult) {
  cbe::Object tempObject{cbe::DefaultCtor{}}; // nullptr;
  std::cout << "Printing Objects from query result: " << std::endl;
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // Loop through Objects from queryResult
  for (const auto& item : queryResult.getItemsSnapshot()) {
    if (item.type() == cbe::ItemType::Object) {
      printItem(item);
      tempObject = cbe::CloudBackend::castObject(item);

      // Get key/value information to print
      const auto keyValues = tempObject.keyValues();
      if (!keyValues.empty()) {

        // Loop through key/values for each object
        for (const auto& keyValue : keyValues) {
          const auto& key      = keyValue.first;
          const auto& sdkValue = keyValue.second;
          const auto  indexed  = std::get<bool>(sdkValue);
          std::cout << "    " << key << " = " << "'"
                    << std::get<std::string>(sdkValue)
                    << "'" << (indexed? " \t\t(indexed)" : "") << std::endl;
        }
      }  // if (!keyValues.empty())
    }   // if (item.type() == cbe::ItemType::Object)
  }
  std::cout << "------------------------------------------------------------"
            << std::endl;

  // If Container does not contain any objects
  if (!tempObject) {
    std::cout << "Sorry, no Objects found in the Container!" << std::endl;
  }
}

cbe::Container Exercise::selectContainer(const std::string& prompt) {
  std::cout << "Select Container" << std::endl;
  const auto items = this->qResult.getItemsSnapshot();

  // Do the following until user has entered a Container that exists
  while (true) {
    // Generic function to get string from user input
    const auto containerName = inquireString(prompt);

    // Loop through and look for Container that user has requested
    for (const auto& item : items) {

      // If Container is found, return it
      if (item.name() == containerName) {
        return cbe::CloudBackend::castContainer(item);
      }
    }

    // If Container is not fount an error is printed
    std::cout << "Error: the Container you asked for, \"" << containerName
              << "\", was not found; following are the options:" << std::endl;
    // Loops through available Containers to select
    for (const auto& item : items) {
      printItem(item);
    }
  }
}

cbe::Object Exercise::createObject(cbe::Container inContainer) {
  std::cout << "Create Object" << std::endl;

  // Generic functions to get string from user input
  const std::string name = inquireString("Set name for Object");

  // Set the number of key/values the user wants to input
  const int numOfTags =
                       inquireInt("Set the number of Key/Value pairs you want");

  // Create variable for key/values
  cbe::KeyValues keyValues;

  for (int i = 1; i <= numOfTags; i++) {

    // String that will contain the key name
    std::string keyName{};

    // Set keyName and check if it is valid
    while(true) {
      keyName = inquireString("Name of Key #" + std::to_string(i));
      if(!isdigit(keyName[0])){
        break;
      }
      // Error message if user input starts with a number
      std::cout << "Key can not start with numerical! " << std::endl;
    }

    // Generic function to get string from user input
    const auto value =
        inquireString("Value for #" + std::to_string(i) + " '" + keyName + "'");

    // Generic function to get bool from user input
    // Indexed key/values are quicker to access through searching
    const auto indexed =
                       inquireBool("Make KeyValue pair #" + std::to_string(i) +
                                   " indexed or not (y indexed, n not indexed",
                                   true /* defaultVal */);
    // Insert value for key
    keyValues[keyName] = std::pair<std::string, bool>(value, indexed);
  }

  // Delegate for createObject
  std::shared_ptr<MyCreateObjectDelegate> createObjectDelegate =
                                    std::make_shared<MyCreateObjectDelegate>();

  // Check if user has created any key/values
  if (numOfTags > 0) {
    // Create Object with name, delegate and key/values
    inContainer.createObject(name, createObjectDelegate, keyValues);
  } else {
    // Create Object without key/values
    inContainer.createObject(name, createObjectDelegate);
  }

  // Wait for delegate to finish
  createObjectDelegate->waitForRsp();

  // Check if error
  if (createObjectDelegate->errorInfo){
    std::cout << "Error!" << std::endl;
    std::cout << "Could not create object." << std::endl;

    // Print info about error
    std::cout << createObjectDelegate->errorInfo << std::endl;

    // Exit with unique code
    exitProgram(31);
  }
  // Return Object from delegate
  return createObjectDelegate->object;
}

// - - - - - - - - - - - - - - LOGIC EXERCISE 1,2,3 - - - - - - - - - - - - - -

void Exercise::logic() {
  /* Exercise 1 */
  // Generic function to get bool from user input
  const bool login = inquireBool("Do you want to login", true /* defaultVal*/);

  // If user responds with a no then exit
  if (!login) {
    // Exit program with unique code
    exitProgram(11);
  }
  // Generic function to get strings from user input
  // Second argument is "default value", user only has to press enter
  const auto username = inquireString("Type username", "gitHubTester1");
  const auto password = inquireString("Type password");
  const auto tenant   = inquireString("Enter  tenant", "cbe_githubtesters");
  const std::string client = "linux_desktop";

  // Create log in delegate
  std::shared_ptr<MyLogInDelegate> logInDelegate =
                                            std::make_shared<MyLogInDelegate>();

  // Call login and set member variable
  myCloudBackend = cbe::CloudBackend::logIn(username,
                                            password,
                                            tenant,
                                            client,
                                            logInDelegate);

  // Wait for delegate to finish
  logInDelegate->waitForRsp();

  // Check if error
  if (logInDelegate->errorInfo){
    // Print info about error
    std::cout << "Error, login failed! \nError info="
              << logInDelegate->errorInfo << std::endl;

    // Exit program with unique code
    exitProgram(10);
  }

  // Confirm login and SDK version
  std::cout << "\nLogged in as:\t" << myCloudBackend.account().username()
            << "\nSDK version:\t"  << myCloudBackend.version() << "\n"
            << std::endl;

  /* Exercise 2 */
  // Put root Container in member variable
  this->rootContainer = logInDelegate->cloudBackend.account().rootContainer();

  // Load Container contents ie. query it to get its contents
  loadContainerContents(this->rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Given the existing containers, should we create a new?
  if (inquireBool("Do you want to create a new container", false)) {

    // Create a new Container in the Container referred container
    createContainer(rootContainer);

    // Print some information about container
    std::cout << "Container name: "
              << containerName(this->myContainer, true /* temporary */)
              << std::endl;
  }

  /* Exercise 3 */

  // Load Container contents ie. query it to get its contents
  loadContainerContents(rootContainer);

  // After loading the container, print its contents
  printContainerContents(this->qResult);

  // Print the number of items in the container
  std::cout << "Item count: " << this->qResult.getItemsSnapshot().size()
            << std::endl;

  // Prompts the user to select a Container in which an Object is to be created
  this->myContainer =
     selectContainer("In which Container do you want to create the new object");

  // Print the Container the user selected
  std::cout << "Container: " << containerName(this->myContainer) << std::endl;

  // Creates an Object in the selected container
  Object = createObject(this->myContainer);

  // Prints information about the Object that has been created
  std::cout << "Designated name: " << objectName(object, true) << std::endl;
  std::cout << "Object name: " << objectName(object) << std::endl;

  // Finally after the Object has been created, load its contents
  loadContainerObjects(this->myContainer);

  // Print all Objects and its content
  printObjects(this->qResult);

  std::cout << "Exercise completed!" << std::endl;
  myCloudBackend.terminate();
} // void Exercise::logic
```

Compile and run Logic3.cpp.

**shell**

```sh
sh compile.sh 3      # compile exercise 3
sh run.sh 3          # run your compiled exercise 3  
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/exercise-3>*

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
cd CloudBackendSDK-*                        # the new unpacked directory
bash installSDK.sh                          # run the full installation script
                                            # which will call the C++ installation script

cd ~/cbe/current/C++/Examples
mkdir -p Tutorial                           # if not already created
cd Tutorial                                 # put exercise files here
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/installation>*

---

## LogInDelegate structure

To make an asynchronous program the main program will also need to have Delegates that will handle the call back code.


Here is an example where the delegate is implemented from lines 7-66 as a class MyLogInDelegate. Lines 68-99 constitutes the Client code (compare with the image above).

See the comments inline describing in more detail.

The writing ~~~ indicates that something needs to be added in its place.

**C++**

```cpp
#include "cbe/CloudBackend.h"
~~~
#include <condition_variable>
#include <mutex>
~~~
int main() {
  // First, declare and implement a LogInDelegate class
  class MyLogInDelegate : public cbe::delegate::LogInDelegate {
    std::mutex              mutex{};
    std::condition_variable conditionVariable{};
    // Indicates operation completed - success or failure
    bool                    called{};
  public:
    // Default construct this CloudBackend member. If the method
    // onLogInSuccess() will not not be called, this default constructed state
    // implies that this cloudBackend Object is not valid due to a successful
    // log in
    cbe::CloudBackend cloudBackend{ cbe::DefaultCtor{} };

    // Default construct this cbe::delegate::Error member, If the method
    // onLogInError() will not not be called, this default constructed state
    // implies no error. Otherwise, thus error Object will contain the error
    // information.
    cbe::delegate::Error error{};
    // Implement the cbe::delegate::LogInDelegate interface callbacks (private
    // cause they are only used by the SDK):
  private:
    // Called upon successful login.
    void onLogInSuccess(cbe::CloudBackend&& cloudBackend) final {
      {
        std::lock_guard<std::mutex> lock(mutex);
        // Put error member into the default constructed state to
        // indicate success (i.e., no error)
        error = cbe::delegate::Error{};
        // Change state of cloudBackend member to indicate success
        this->cloudBackend = std::move(cloudBackend);
        // Indicate operation completed, member cloudBackend non-default
        // constructed state indicates success
        called = true;
      }
      conditionVariable.notify_one();
    }
    // Called upon a failed login.
    void onLogInError(Error&& error, cbe::util::Context&& context) final {
      {
        std::lock_guard<std::mutex> lock(mutex);
        // Put cloudBackend member into the default constructed state to
        // indicate no-success
        cloudBackend = cbe::CloudBackend{ cbe::DefaultCtor{} };
        // Change state of error member to indicate failure
        this->error = std::move(error);
        // Indicate operation completed, member member cloudBackend default
        // constructed state indicates failure
        called = true;
      }
      conditionVariable.notify_one();
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public:
    void waitForRsp() {
      std::unique_lock<std::mutex> lock(mutex);
      conditionVariable.wait(lock, [this]{ return called; });
      // Reset called flag, so current delegate instance can be reused
      called = false;
    }
  }; // class MyLogInDelegate
  ~~~
  // Then,  carry out the login:
  static constexpr const char* const username = "~~~";
  static constexpr const char* const password = "~~~";
  static constexpr const char* const tenant   = "~~~";
  const std::string client = "linux_desktop";
  ~~~
  std::shared_ptr<MyLogInDelegate> myLogInDelegate =
                                    std::make_shared<MyLogInDelegate>();
  // Invoke the login (cast to return value to void to indicate is deliberately
  // discarded)
  (void) cbe::CloudBackend::logIn(username, password, tenant, client, myLogInDelegate);
  // Await the login procedure to run to completion
  myLogInDelegate->waitForRsp();

  // Test if login failed
  if (myLogInDelegate->error) {
    // Failed to login!
    std::cout << "Failed to login: error={" << myLogInDelegate->error << '}'
              << std::endl;
    //  Bail out!
    ~~~
    // End of session, tell cbe that you are terminating
    cloudBackend.terminate();
    ~~~
    }
  // Since we have a complete CloudBackend Object now, copy it from the delegate
  cbe::CloudBackend cloudBackend = myLogInDelegate->cloudBackend;
  // Dispose the delegate object, not needed anymore
  myLogInDelegate.reset();
  // Do your stuff
  ~~~
  // End of session, tell cbe that you are terminating
  cloudBackend.terminate();
}   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/logindelegate-structure>*

---

## queryDelegate structure

An example of an asynchronous query with the Delegate and Client code that runs after a successful LogIn.


In this asynchronous program example the Delegate thread that will handle the call back code is shown separate from the main Client code.

See the comments inline describing in more detail.

The writing ~~~ indicates that something needs to be added in its place.

### Delegate code

**C++**

```cpp
#include "cbe/delegate/QueryDelegate.h"
~~~
#include <condition_variable>
#include <mutex>
~~~
class MyQueryDelegate :  public cbe::delegate::QueryDelegate {
  std::mutex              mutex{};
  std::condition_variable conditionVariable{};
  // Indicates operation completed - success or failure
  bool                    called = false;
public:
  cbe::QueryResult  queryResult{cbe::DefaultCtor{}};
  ErrorInfo         errorInfo{};
private:
  // Called upon successful query.
  void onQuerySuccess(cbe::QueryResult&& queryResult) final {
    {
      std::lock_guard<std::mutex> lock{mutex};
      // Change state of queryResult member to indicate success
      this->queryResult = std::move(queryResult);
      // Indicate operation completed, member queryResult indicates success
      called = true;
      // If delegate is reused, clear possibly error state
      errorInfo = ErrorInfo{};
    }
    conditionVariable.notify_one();
  } // onQuerySuccess()

  // Called upon a failed query() or join() call.
  void onQueryError(cbe::delegate::QueryError&& error,
                    cbe::util::Context&&        context) final {
    {
      std::lock_guard<std::mutex> lock{mutex};
      // Activate errorInfo member to indicate no-success
      errorInfo = ErrorInfo{std::move(context), std::move(error)};
      // Indicate operation completed, member Object indicates failure
      called = true;
      // If delegate is reused, clear possibly success state
      queryResult = QueryResult{cbe::DefaultCtor{}};
    }
    conditionVariable.notify_one();
  } // onQueryError()
public:
  void waitForRsp() {
    std::unique_lock<std::mutex> lock{mutex};
    conditionVariable.wait(lock, [this] { return called; });
    // Reset called flag, so current delegate instance can be reused
    called = false;
  } // wait()
}; // class MyQueryDelegate   
```

### Client application code

**C++**

```cpp
// LogIn
~~~
std::shared_ptr<MyQueryDelegate> queryDelegate =
                                    std::make_shared<MyQueryDelegate>();
const cbe::ContainerId myContainerId =
                                  cloudBackend.account().rootContainer().id();
cloudBackend.query(myContainerId, queryDelegate);
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
~~~   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/querydelegate-structure>*

---

## Scripts

Add the following two scripts compile.sh and run.sh. They are included in the SDK bundle.

If you want to use your own scripts do so, but if you just want to copy paste, review the following and read the comments in the script:

### Compile the program code

**compile.sh**

`compile.sh` shell script.

**shell**

```sh
#!/bin/sh
## Copyright CloudBackend AB 2022.
## compile.sh #
## version 2023-02-03
## This compiler script has sections corresponding to
## the different exercises in the Tutorial # on the website.
## Submit the number of the Exercise to compile.
## Example: sh compile.sh 1

if [ $# -gt 0 ]
then
    exe=$1
else
    exe="0"
fi
ARCH=`uname -m`
echo "computer architecture:" ${ARCH}
case "$ARCH" in
    "x86_64")
    COMPILER_COMMAND="g++ -std=c++17 -pthread "
    WARNINGS="-Wpedantic -Wall -Wextra -Weffc++ -Wsuggest-override -Wno-unused-parameter"
    # your path to the copy of the SDK binary lib
    # libcbe="../../lib/Linux_x86/libcb_sdk.so"    # export LD_LIBRARY_PATH="../../lib/Linux_x86/"
    libcbe="../../lib/Linux_x86/libcb_sdk.a"
    ;;

    *)
    echo ${ARCH} "platform is not supported in this release"
    exit 1
    ;;
esac

echo "compile exercise:" ${exe}
case "${exe}" in
    1|2|3)
    # Tutorial exercise 1:
    ${COMPILER_COMMAND} ${WARNINGS} -o tut${exe} Main.cpp Logic${exe}.cpp ${libcbe} -I "../../include"
    command_result=$?
    ;;

    *)
    # Default.
    echo "syntax : "$0" <1-3> "
    echo "example: "$0" 1"
    exit 2
    ;;
esac

if [ ${command_result} -eq 0 ]
then
    echo "to run use: sh run.sh" ${exe}
else
    echo "compilation had errors"
fi   
```

* note that two actions are needed in this script, first the `${libcbe}` variable needs to point to where you have the binary, second is the `-I` flag which needs to point to where you have the include folder for the SDK.

Alternatively, if you would like to use the libcb_sdk.so, prior to running the compiled code, set `export LD_LIBRARY_PATH="../../lib/Linux_x86/"`

### Run the compiled program

**run.sh**

`run.sh` shell script.

**shell**

```sh
#!/bin/sh
## run.sh #
## This run script has sections corresponding to the different exercises in the Tutorial on the website.
## Submit the number of the exercise to compile.
## example: sh run.sh 1

echo "CloudBackend SDK is provided under a limited evaluation license "
echo "that is not for production use."

if [ $# -gt 0 ]
then
  exe=$1
else
  exe="0"
fi
ARCH=`uname -m`
echo "computer architecture:" ${ARCH}
export LD_LIBRARY_PATH="../../lib/Linux_x86"
case "$exe" in
  1|2|3)
  echo "run exercise:" ${exe}
  ./tut${exe}
  ;;

  *)
  # Default.
  echo
  echo "syntax: "$0" <1-3> "
  echo "example: sh run.sh 1"
  exit 1
  ;;
esac   
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/sdk/tutorial-c-sdk/scripts>*

---
