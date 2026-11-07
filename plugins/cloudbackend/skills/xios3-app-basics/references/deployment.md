# XIOS/3 — deployment

Deploying an application on CloudBackend PaaS and elsewhere: the deploy wizard, pipelines and stages, the login application, users, any web server, Android.

7 topics from the published XIOS/3 documentation, generated on 2026-11-07. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Application Deployment](#application-deployment)
- [Creating and Managing Users](#creating-and-managing-users)
- [Deploying an Android Application](#deploying-an-android-application)
- [Deploying on any WebServer](#deploying-on-any-webserver)
- [Deploying an iOS Application](#deploying-an-ios-application)
- [Login Application](#login-application)
- [Managing Deployments](#managing-deployments)

## Application Deployment

This section will go through everything necessary regarding deploying a XIOS/3 application: from doing the actual deployment in the web UI and moving it forward through the deployment pipeline, to adding and editing a login page and allowing for external user creation.

We will go through the basics below, and you may read more about each step in their own sections. You may also try it practically in our [deploy tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/tutorials/application-deployment).

> **Note:** **Custom domain DNS:** to connect your own domain to a deployment, point its DNS (an `A` record) to `83.140.241.4`. The certificate and domain binding steps are covered in the [Managing Deployments](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/managing-deployments) section.

> **Note:** This is the quickest way to deploy an application using CloudBackend. You may of course deploy your XIOS/3 application on any backend or webserver of your choice.

#### Deploying an Application

Any application containing the required parts of an [application manifest](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/overall-structure) can quickly be deployed from within the Projects tab; just select the application package you wish to deploy and select `icon://share` `Deploy` in the top toolbar, or use the context menu.


This will open the `Deploy Wizard`, where you set the name of your deployment. The name is used both internally and as the host name in the deployment's access URL, so it may only contain lowercase letters and digits; it is prefilled from the name of your project. The wizard only deploys from the `home` and `tenant` drives, and the application manifest in the container must be named `index.xml` (the wizard offers to rename it for you if it is not). A deployment always uses the latest available XIOS/3 release.

When you click `Deploy` the wizard validates the name and the application files, bundles external dependencies and rewrites absolute paths, adds an index page and a datatypes object to your project, and publishes it on the web. Your deployed application then appears as a card in its **deployment pipeline** in the Deployments tab, ready to be promoted through the `Development`, `Shared`, `Staging` and `Production` stages.

Which stage the card starts in follows from the drive you deploy from, and is not a choice in the wizard: a project on your `home` drive becomes a **private** `Development` deployment, a project on the `tenant` drive becomes a **public** `Shared` deployment. In both cases the project container itself is published, so the deployment is served straight out of `home://Applications` or `tenant://Applications` in the CloudBackend database. Only the `Staging` and `Production` snapshots get containers of their own, under `tenant://Deployments`.

More information about managing deployments can be found [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/managing-deployments).

> **Note:** Anything inside the deployed container will be externally accessible, e.g. visible and downloadable. Editing, removing, or replacing objects in the deployed container will change the deployed application, if the deployment URL is reloaded in the browser.

#### Adding Login Screen

To enable you to quickly deploy a fully functional application you may also add a customizable login screen to show before your application is launched. The login screen is not part of the Deploy Wizard. You add and customize it afterwards with the `Login Configurator`, opened from the `Configure Login Page...` button in the properties panel of the Deployments tab. That button is available for a deployment in the `Staging` stage, and the configuration you save there is carried forward when the deployment is promoted to `Production`. You can also add a login screen manually by editing your application manifest before deploying. Explained below and [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application).

Clients are used to distinguish between different user bases or application areas, for instance web, mobile or IoT solutions, and give you statistics about your users per client. Deployments made through the Web UI are registered against your tenant's *Web* client, which is created for you the first time it is needed. The client type can be changed in the properties dialog in the Clients tab. Read more about Clients here.

#### Adding Login Screen Manually

You may also customize your login screen already in the application manifest before deploying. This requires four simple steps:

1. Declare the `xlink` namespace in the `application` tag using: `xmlns:xlink="http://www.w3.org/1999/xlink"`
2. Add `xlink:actuate="onRequest"` in both your application's `process` and [`view`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) elements
3. Add this `process` element before your application's main `process` element: `<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>`
4. Add a [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element within your application manifest, as this is where you will make the most basic settings for your login.

Step four can be omitted if you just want a default login screen. More information about customizing your login screen can be found [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application).

#### User Creation and Management

To enable external users to be created, including password recovery for these, from the login screen you first need to set up the CRM module of CloudBackend. More information about how this is done can be found here.

To enable user creation and password recovery you just add [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create) and `reset` elements within your [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element in the application manifest. The text you write in this element will be the text shown for each link on the login page.

More information about user creation and management can be found [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/creating-and-managing-users).



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment>*

---

## Creating and Managing Users

In order for your external users to create accounts on your application, and for them to reset / recover any forgotten passwords, you just add [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create) and `reset` elements within your [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element in the application manifest. Adding one or both of these elements will show the corresponding link on the login page, omitting one or both will not show that link. The text you write within the element will be the text shown on the login page, for example `<create>Create User</create>` will enable user creation and show the text *Create User* for the link on the login page.

> **Note:** To enable external users to be created, including password recovery for these, from the login screen you first need to set up your CRM module of CloudBackend. More information about how this is done can be found here.

#### How Users are Created

When an external user wants to create an account using the Create Users application they will fill in the necessary information in the UI, such as desired username, password and email. The application will automatically check credentials, for example so that there are no existing users with that name or email, and if everything is good create the user and send an email for them to verify.

#### Managing Users

Users created through the Create Users application will appear in the [Identities tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment). This is also where you will do most of the user management.

#### Password Recovery

> **Note:** This is an upcoming feature, that is not released yet. You may still add a password recovery text and link to your login screen, and it will show up and work as soon as we release the feature.

Built into the service is also ways for users to recover and reset lost passwords. Clicking the link for password reset (if enabled) on the login page of your application will open a dialog for the user to enter their username, after which an email with a link to reset the password will be sent to the email tied to that user.

To enable password recovery just add the `reset` element within your [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element in the application manifest. The text you write within the element will be the text shown on the login page, for example `<reset>Forgot password?</reset>` will enable password reset and show the text *Forgot password?* for the link on the login page. If this element is omitted, there will be no password reset link in the login page UI.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/creating-and-managing-users>*

---

## Deploying an Android Application

After deploying an application, your users can access it using the provided url or the domain set by you. However, they can only access it through the browser. This tutorial will change that, by integrating the webpage into a `WebView` in an Android Application.

#### Getting started

To get started with this tutorial, we need a few things.

1. Firstly, we need a deployed application (located in `home://Applications` or `tenant://Deployments`). You can follow the [deploy tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/tutorials/application-deployment) tutorial to get one.
2. Then, we need an IDE for creating the android application. You can get Android Studio [here](https://developer.android.com/studio).

For more information about how to install Android Studio, you can follow Google's tutorial on it [here](https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio#0). For the tutorial, Android Studio Panda 1 Patch 1 (Released February 13, 2026) was used on Windows 11.

#### Android Studio

These are the steps required to create an Android Studio project and the code needed to launch your xios application.

1. Start Android Studio and create an `Empty Views Activity`.
2. Give the application a name and select the Language `Kotlin`. (This can be set to `Java` but the code will be slightly different).
3. Create the project and wait a while while `Gradle` finishes initializing and building. This can take a while so be patient.

#### ApplicationManifest

The first thing we need to do is address the application manifest. In Android development, the application manifest (`AndroidManifest.xml`) is a required XML file that provides essential metadata about the app to the Android operating system, build tools, and the Google Play Store. It serves as a blueprint that declares the app's components (like activities and services), required permissions, and hardware or software requirements needed for the app to function. It can be found at `app/manifests/AndroidManifest.xml`.

For this we need to add a permission to use the internet. It is a line of code which declares that the application requires full network access, granting it the necessary permission to open network sockets and exchange data with the internet.

**Enable internet access in the application manifest**

```java
<uses-permission android:name="android.permission.INTERNET" />
```

**Full Application Manifest**

**ApplicationManifest.xml**

```java
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:tools="http://schemas.android.com/tools">
  <uses-permission android:name="android.permission.INTERNET" />

  <application
      android:allowBackup="true"
      android:dataExtractionRules="@xml/data_extraction_rules"
      android:fullBackupContent="@xml/backup_rules"
      android:icon="@mipmap/ic_launcher"
      android:label="@string/app_name"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:supportsRtl="true"
      android:theme="@style/Theme.MyApplication">
      <activity
          android:name=".MainActivity"
          android:exported="true">
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
      </activity>
  </application>
</manifest>
```

#### Layout

Next up, we need to specify what we want the app to render. This is done with layout files. Layout files are XML-based documents located in the `res/layout` directory that define the visual structure and UI components of an app's user interface, such as buttons, text fields, and images. They separate the presentation layer from the `Java` or `Kotlin` logic, allowing you to build responsive designs that automatically adapt to different screen sizes and orientations.

XIOS is a type of web application. Therefore we want to render the webpage that XIOS creates. This is done with a [WebView](https://developer.android.com/develop/ui/views/layout/webapps/embed-web-content-in-app). A `WebView` is a specialized view component that allows you to display interactive web content or entire websites directly within your Android application's layout. It essentially acts as an embedded browser window, using the underlying Chromium engine to render HTML, CSS, and JavaScript.

The template we chose when creating this project created the files we need to get started. You can navigate to `app/res/layout/activity_main.xml`. Creating a `WebView` is fairly straightforward. We simply define the `WebView` component and specify the width and height.

**Defining the WebView**

```xml
<WebView
  android:id="@+id/myWebView"
  android:layout_width="match_parent"
  android:layout_height="match_parent" />
```

**Full Layout File**

**ApplicationManifest.xml**

```java
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  xmlns:tools="http://schemas.android.com/tools">
  <uses-permission android:name="android.permission.INTERNET" />

  <application
      android:allowBackup="true"
      android:dataExtractionRules="@xml/data_extraction_rules"
      android:fullBackupContent="@xml/backup_rules"
      android:icon="@mipmap/ic_launcher"
      android:label="@string/app_name"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:supportsRtl="true"
      android:theme="@style/Theme.MyApplication">
      <activity
          android:name=".MainActivity"
          android:exported="true">
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
      </activity>
  </application>
</manifest>
```

#### Kotlin

Like with the layout, Android Studio has supplied us with a `MainActivity.kt` file for our `Kotlin` code. `MainActivity.kt` is the controller where you write the code that makes your app actually do things, like responding to clicks or fetching data. It links your logic to the visual layout by "inflating" the XML file and managing the Activity's lifecycle states.

We need to add some imports and code to make our android app load our deployed application. The supplied `MainActivity.kt` file should look something like this:

**Defining the WebView**

```java
package com.example.myapplication

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }
}
```

To start, we need to get the `WebView` and give it access to run javascript and use DOM Storage. Then we define the url to the deployment (retrievable from the properties of the deployment object in `home://Applications` or `tenant://Deployments`) and some final code to handle back button presses since the default behavior is to exit the application. Simply add the code below underneath of `ViewCompat.setOnApplyWindowInsetsListener`.

**Defining the WebView**

```java
package com.example.myapplication

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.activity.OnBackPressedCallback

class MainActivity : AppCompatActivity() {

    private lateinit var myWebView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        myWebView = findViewById(R.id.myWebView)
        myWebView.settings.javaScriptEnabled = true
        myWebView.settings.domStorageEnabled = true
        myWebView.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                println("WebView Error: $description")
            }
        }
        myWebView.loadUrl("https://mydeployment.cloudbackend.cloud")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (myWebView.canGoBack()) {
                    myWebView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}
```

**MainActivity.kt - Code Explanation**

**Line 1 - 11**
Package declaration and imports of necessary Android libraries, including `WebView` components and back-button handling utilities.
**Line 13**
Defines the `MainActivity` class and declares a `myWebView` variable using `lateinit` so it can be accessed by multiple functions later.
**Line 18 - 21**
The `onCreate` function initializes the activity, enables edge-to-edge display, and links the `Kotlin` code to the `activity_main` XML layout.
**Line 23 - 27**
Sets up a listener to adjust the UI padding automatically, ensuring content isn't hidden behind system bars like the status or navigation bars.
**Line 29 - 32**
Locates the `WebView` in the layout by its ID and enables JavaScript and DOM storage so modern web apps can run correctly.
**Line 32 - 41**
Attaches a `WebViewClient` to handle page navigation and overrides the error function to print any loading failures to the developer console.
**Line 42**
Tells the `WebView` to load the specific web address provided in the string. You can find this URL in the properties of your deployment in `home://Applications` or `tenant://Deployments`.
**Line 44 - 53**
Registers a custom back-button handler that checks if the `WebView` has internal history to go back to; if not, it allows the app to close normally.

You can now test this by creating an emulated android device which you can read about [here](https://developer.android.com/studio/run/managing-avds), and pressing run or debug. You should be able to see your deployed application running on the emulated android device. The image below show the application running on the Android emulator.


When done with the app and deployment, you can follow [this](https://developer.android.com/studio/publish) tutorial by Google to publish it.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/deploying-on-android>*

---

## Deploying on any WebServer

> **Note:** This requires a downloaded version of XIOS/3. Please contact XIOS/3 for more information.

XIOS/3 is loaded and initialized in multiple steps to support a distributed and flexible architecture. The first step is an HTML file that sets up the initial loading conditions for the environment, both in terms of fundamentals, such as what the home domain name should be and if HTTP or HTTPS is used, but also to give the developer the final say in how XIOS/3 is loaded.

In the HTML page the boot parameters for XIOS/3 is defined in the JavaScript object "boot". Then, when all deployment specific additions are made, XIOS/3 bootloader is loaded into the page. It will load and start XIOS/3 according to the boot object.

### HTML Loading Page

Minimally the HTML loading page only needs to load the boot loader, and it will default to load the shell application.

**Minimal HTML loading page**

```xml
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="overflow: hidden;">
    <script src="/xios/boot.js" charset="utf-8"></script>
  </body>
</html>
```

Every deployment of actual code projects requires at least that XIOS/3 is given an application to start executing, instead of loading the shell application. This is controlled by the startup member of the boot object. To load the example startup process "xios/config/startup.xml", add the following script element to the HTML header.

**Define boot and load startup**

```xml
<script>
var boot = {
  startup : "/xios/config/startup.xml"
};
</script>
```

The "xios/config/startup.xml" document accomplish two things. It defines a new protocol in XIOS/3 under the name "https" using the HTTPS protocol module. This allows you to load data using https://-URLS within XIOS/3. Having done that it starts the shell application "xios/apps/shell/shell.xml".

What should go into the startup document depends on your project. If you are making a stand alone application, you can point XIOS/3 startup sequence to the main document directly. If you want to separate the XIOS/3 environment and the applications running within it, it could make sense to limit the start script to initialization and then hand over to external applications or another loader.

**startup.xml**

```xml
<process>
  <step id="start" name="Start Shell">
    <operation name="channel">
      <name>https</name>
      <title>HTTPS</title>
      <protocol>HTTPS</protocol>
    </operation>
    <operation name="open" value="xios://apps/shell/shell.xml"/>
  </step>
</process>
```

When deploying using CloudBackend infrastucture it is possible to lock a deployment to a specific version of XIOS/3 to avoid any regressions or changes in functionality. This is achieved by declaring the location of the XIOS/3 runtime in the boot object and setting the path to the boot script to match.

**Minimal HTML loading page**

```xml
<html>
  <head>
    <meta charset="utf-8" />
    <script>
var boot = {
  runtime : "/xios_v2026.1.0",
  startup : "myApplication.xml",
};
    </script>
  </head>
  <body style="overflow: hidden;">
    <script src="/xios_v2026.1.0/boot.js" charset="utf-8"></script>
  </body>
</html>
```

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/deploying-on-any-webserver>*

---

## Deploying an iOS Application

In this tutorial, you will:

1. Create a basic iOS app in Xcode
2. Embed your deployed web app inside a WKWebView
3. Launch it in the iOS Simulator

After deploying an application, your users can access it using the provided url or the domain set by you. However, they can only access it through the browser. This tutorial will change that, by integrating the webpage into a `WebView` in an iOS Application.

#### Getting started

To get started with this tutorial, we need a few things.

1. Firstly, we need a deployed application (located in `home://Applications` or `tenant://Deployments`). You can follow the [deploy tutorial](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/tutorials/application-deployment) tutorial to get one.
2. For making iOS applications you are required to have a MacBook as they are the only ones to be able to build for the Apple ecosystem.
3. Then, we need an IDE for creating the iOS application. You can get Xcode [here](https://apps.apple.com/us/app/xcode/id497799835?mt=12).

For more information about how to install Xcode, you can follow Apple's tutorial on it [here](https://developer.apple.com/documentation/xcode). For the tutorial, Xcode 26.3 (Released February 26, 2026) was used on macOS Tahoe.

#### Xcode

These are the steps required to create an Xcode project and the code needed to launch your xios application.

1. Start Xcode and choose `Create New Project`.
2. Choose iOS - App for the template and click `Next`.
3. Give it a name and choose the Interface to be `Storyboard` and Language `Swift`

If you followed the steps correctly you will see these files in your project navigator.


#### Swift

When you have created the project correctly, you can see a few important files created. The one we will change is called SceneDelegate. The SceneDelegate is responsible for managing your app's UI lifecycle. It is where the main window is created and where you define which ViewController is shown when the app launches. This is one of the two files we will edit.

#### WebViewController

To create our WebView, which you can read more about [here](https://developer.apple.com/documentation/webkit/wkwebview). Create a new swift file in your project and name it `WebViewController.swift`. This will act as our view to hold the WebView. Then you need to enter the code we need to get the app to display our content.

**Defining the WebView**

```swift
import UIKit
import WebKit

class WebViewController: UIViewController, WKUIDelegate {

  var webView: WKWebView!

  override func loadView() {
      let webConfiguration = WKWebViewConfiguration()
      webView = WKWebView(frame: .zero, configuration: webConfiguration)
      webView.uiDelegate = self
      view = webView
  }

  override func viewDidLoad() {
      super.viewDidLoad()

      if let myURL = URL(string: "https://mydeployment.cloudbackend.cloud") {
          let myRequest = URLRequest(url: myURL)
          webView.load(myRequest)
      }
  }
}
```

**WebViewController.swift - Code Explanation**

**Line 1 - 2**
Imports `UIKit` for core iOS UI components like `UIViewController`, and `WebKit` for using `WKWebView` to display web content inside the app.

**Line 4**
Declares the `WebViewController` class, which inherits from `UIViewController` and conforms to `WKUIDelegate` so it can handle JavaScript alerts, pop-ups, and other UI-related web events.

**Line 6**
Defines a `WKWebView` variable named `webView`. The exclamation mark (`!`) means it will be initialized later but is expected to always have a value after setup.

**Line 8 - 13**
Overrides `loadView()` to create the interface programmatically instead of using a Storyboard. It creates a `WKWebViewConfiguration`, initializes the `WKWebView` with that configuration, assigns the controller as its `uiDelegate`, and sets the web view as the main view of this controller.

**Line 15 - 16**
Overrides `viewDidLoad()` and calls `super.viewDidLoad()` to ensure the default setup from `UIViewController` runs properly.

**Line 18 - 21**
Safely creates a `URL` from the given string using optional binding. If successful, it builds a `URLRequest` and tells the `webView` to load the webpage, which displays the site inside the app.

#### SceneDelegate

Now we need to connect our new `WebViewController` code to our `SceneDelegate` file. To do this, open the `SceneDelegate` file and find the `scene` function. This will be replaced with the following code:

**Defining the WebView**

```swift
func scene(_ scene: UIScene,
          willConnectTo session: UISceneSession,
          options connectionOptions: UIScene.ConnectionOptions) {

  guard let windowScene = scene as? UIWindowScene else { return }

  let window = UIWindow(windowScene: windowScene)
  window.rootViewController = WebViewController()
  self.window = window
  window.makeKeyAndVisible()
}
```

Without this code, your app would still try to load the default Storyboard interface.

**SceneDelegate.swift - Code Explanation**

**Line 1 - 3**
Defines the `scene(_:willConnectTo:options:)` method, which is called when the app's scene is first created and attached to the system. This is where you set up the initial UI for that scene.

**Line 5**
Uses a `guard` statement to safely cast the incoming `UIScene` to a `UIWindowScene`. If the cast fails, the function exits early because a window cannot be created without a valid window scene.

**Line 7**
Creates a new `UIWindow` object and attaches it to the valid `UIWindowScene`, which represents the app's visible interface on screen.

**Line 8**
Sets the window's `rootViewController` to a new instance of `WebViewController`, making it the first screen shown when the app launches.

**Line 9**
Assigns the created window to the SceneDelegate's `window` property so it is retained and managed properly.

**Line 10**
Calls `makeKeyAndVisible()` to display the window and make it the main window that receives user input.

#### Test the Application

When you have added the code, you can now run the application using the iOS Simulator. You can read more about the simulator [here](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device).

1. Select a simulator device (for example, iPhone 17 Pro) from the device dropdown in Xcode.
2. Press the ▶ Run button at the top of Xcode to build and launch the app.
3. Wait for the iOS Simulator to start and install the app automatically.
4. Verify that your deployed web application loads correctly inside the app.

If everything is configured correctly, your web application should now display inside the WebView.

The image below shows a currency converting app running on the emulated iPhone 17 Pro.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/deploying-on-ios>*

---

## Login Application

When deploying an application from the [Projects tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) you have the option to add a login screen to your application. This will automatically add the necessary resources to your application manifest, and the elements can be edited in the [Deployments tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) for a selected deployment. If you wish to edit the elements directly in the application manifest this can easily be done by following the steps below.

If you wish to customize the login screen directly in your application manifest you need to do these four simple steps:

1. Declare the `xlink` namespace in the `application` tag using: `xmlns:xlink="http://www.w3.org/1999/xlink"`
2. Add `xlink:actuate="onRequest"` in both your application's `process` and [`view`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/view) elements
3. Add this `process` element before your application's main `process` element: `<process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>`
4. Add a [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element within your application manifest, as this is where you will make the most basic settings for your login.

The first three steps are quite straight-forward. Below we will address how to easily customize your login page using settings in a [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element in your application manifest, as well as how to customize it even further by editing the login application itself (only recommended for experienced XIOS/3 users).

#### Login Settings

To quickly customize the most visible parts of the login screen you just have to make adjustments to the [`login`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/login) element in your application manifest. This includes setting your own logo, background image or color, texts, and whether or not to allow user creation and password recovery. Below is an example of how this `login` element can look, so you can copy it into your own code, with an explanation of each element below the code.

**Login Settings Element**

```xml
<login>
  <background dark="true">https://www.xios3.com/files/junglewebbg.png</background>
  <logo>https://www.xios3.com/files/logoxiosv2b.png</logo>
  <title>My XIOS/3 Application</title>
  <description>Please sign in using your credentials.</description>
  <copyright>Copyright © 2024 XIOS/3 AB, All rights reserved.</copyright>
  <create>Create new user</create>
  <reset>Forgot password?</reset>
  <client>webClient</client>
</login>
```

Explanation:

- `background`: The background of the login screen. Can be set as a URL to an externally accessible image, the name (with file ending) of an image uploaded into the selected Deployment's container, or a `#000000` to `#ffffff` color. (Setting two colors separated by a comma (,) will create a bottom-up gradient between the first and second color.) The `background` element can also have the attribute `dark` with values `true` or `false` if you already know if your background is dark or light, so that the color of fonts can be set accordingly. If this is omitted XIOS/3 will automatically try to set the proper font color.
- `logo`: The main logo shown. Can be set as a URL to an externally accessible image, or the name (with file ending) of an image uploaded into the selected Deployment's container.
- `title`: The main title on the login screen. Often the title of the application, or company name.
- `description`: The text shown below the title, such as description of the application or a prompt to the user.
- `copyright`: Copyright text shown at the bottom of the login page.
- [`create`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/create): Sets text shown for opening the Create User application. If this element is omitted a link to opening Create User application will not show.
- `reset`: Sets text shown for opening the Reset Password application. If this element is omitted a link to opening Reset Password application will not show.
- `client`: Sets which of your defined Clients this deployment will use for gathering metrics. This will not be visible on the login screen.

An image of the login screen with this example code can be seen below.

> **Note:** To send designed e-mail from your own SendGrid account during end user creation and password recovery requires that you have set up your CRM module of CloudBackend. The CRM module has not been released yet.


#### Customizing Login Further

For experienced XIOS/3 users there is also the possibility to customize the entire login application, done by editing the login.xml view and process code within XIOS/3.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application>*

---

## Managing Deployments

Any application containing the required parts of an [application manifest](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-packaging/overall-structure) can quickly be deployed from within the [Projects tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment); just select the application package in `home` or `tenant` that you wish to deploy and select `icon://share` `Deploy` in the top toolbar, or use the context menu.

The `Deploy Wizard` lets you set your deployment's name, which may only contain lowercase letters and digits because it also becomes the host name of the deployment's access URL. When you finish the wizard, your application is published into the pipeline. Deploying from your own `home` drive gives a private **development** deployment served from that drive; deploying from the `tenant` drive gives a public **shared** deployment. From there you move it forward through the deployment pipeline in the [Deployments tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment). A login screen is not part of the wizard; it is configured afterwards from the properties panel, as described under **Customizing Login Screen** below.

#### The Deployment Pipeline


In the [Deployments tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) each project is shown as a **pipeline board** with five columns that follow the life cycle of a deployment, from left to right: `My Projects`, `Development`, `Shared Projects`, `Staging` and `Production`. A header above the boards names the five stages and counts how many deployments you currently have in each of them. Every deployment is a **card**. You advance a card by dragging it into the next column, by right-clicking it and choosing the matching `Promote` action, or by pressing the `Promote to <stage>` button in the properties panel. The board only accepts a card into a column when that stage's requirements are met, so an invalid drop is rejected. A card can only ever be moved forward one step at a time, with the exception of `Shared`, from which a card can be moved to either `Staging` or `Production`.

Each board is labelled with its project name and icon, and carries the client it belongs to (normally `Web`) in the footer under the `Production` column, next to a `Login` marker that appears once a login screen has been configured for that client. Until you have deployed anything the tab shows no boards at all, only a note that deployments appear here after you deploy an application, and a link into the [Projects tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment).

Two properties on each card decide whether it may advance. Both are set from the card's right-click menu:

- **Visibility**: *Private* (the card, and with it the deployment's access URL, is only visible to you) or *Public* (visible to everyone in your tenant). Toggle it with `Make Public` / `Make Private` in the context menu.
- **Test status**: *Unchecked*, *Verified* or *Broken*. Set it with `Mark Verified`, `Mark Broken` or `Mark Unchecked` in the context menu. Only a *Verified* card can move on to Staging or Production, and the `Promote to <stage>` buttons in the properties panel are only enabled for a *Verified* card. Promoting a card to `Shared` or `Staging` resets its test status to *Unchecked*, while promoting to `Production` keeps it *Verified*.

#### Stages and What Each One Requires

- **My Projects**: the starting point of the pipeline, showing the source application a deployment is made from. To avoid clutter for users with many projects, this column does **not** list every application in your `home://Applications`. A card only appears for a project that already has a deployment **and** that you own (its source living in your `home://Applications`).
  *How to enter:* nothing is promoted into this column. A project first enters the pipeline when you deploy it with the `Deploy Wizard` from the [Projects tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment).
  *Next step:* drag the card into `Development` to create a development deployment from the current source. The `Deploy Wizard` already places a card in the stage that follows from the drive you deployed from, so use this mainly when you do not have a development deployment yet, for example when your only card for that project is a `Shared` one deployed from the tenant drive.
- **Development**: your private working deployment, served from your `home` drive so you can keep iterating on it. Because it is served straight from your live source, any change you make to the application is reflected on its access URL instantly. Just reload the deployment URL to see it.
  *Private vs. public:* a development deployment is **private** by default, so only you can see it, and no other tenant member sees its pipeline or its access URL. Setting it to **public** (with `Make Public`) lets other tenant members see the pipeline, which also exposes its access URL to them, and is required before you can promote it to `Shared`. Making it private again only hides the pipeline. It does **not** revoke access to the deployment itself, so anyone who saved the access URL while it was public can still reach it.
  *Others' deployments:* another user cannot promote, publish, edit or delete your development deployment. The only thing they can do to it is set its test status to *Verified*, *Broken* or *Unchecked*.
  *How to enter:* drag a card from `My Projects`, or deploy a project from your `home` drive with the `Deploy Wizard`.
  *Multiple development deployments:* drag-and-drop creates only **one** development deployment per project and user. If you already have one of your own the drag is blocked, so move or delete it first. To keep several development deployments of the same project at once, add them with the `Deploy Wizard` instead, giving each a different name.
- **Shared**: almost exactly like a `Development` deployment (a live copy served straight from its files, so changes show up on the access URL immediately), except it lives in the tenant drive, in a copy of the project under `tenant://Applications`: anyone in the tenant with the right permissions can see it **and edit the actual files**. This makes it the place for a team to collaborate on a project.
  *How to enter:* the card must be **your own** and its visibility must be *Public*. If it is still private, dragging it onto `Shared` offers to make it public and move it in one step; the `Promote to Shared` button and the context menu action instead ask you to make it public first. A project deployed straight from the tenant drive also lands here.
  *One card at a time:* a client keeps a single active shared card, so promoting again replaces the shared copy for everyone in the tenant. You are asked to confirm that overwrite, and the history of the card you replace is carried over to the new one.
- **Staging**: a point-in-time **snapshot** used as a test environment for final checks before going live. Unlike Shared, a staging deployment is frozen: later edits to the source do not change it.
  *How to enter:* promote a card from `Shared`; its test status must be *Verified* (use `Mark Verified` first).
- **Production**: the live, final stage, also a point-in-time **snapshot** so the running version stays stable regardless of ongoing development. A production card connected to a custom domain is pinned to the top of the column and locked.
  *How to enter:* promote a *Verified* card from `Staging`. You may also promote straight from `Shared`, but the board will first warn you to stage it for testing. Production is terminal, so cards cannot be promoted any further.

> **Note:** Domain cards (deployments connected to a custom domain) cannot themselves be dragged between stages. Connecting a domain is covered under **Connecting a Custom Domain** below.

#### Connecting a Custom Domain

In the `Staging` and `Production` columns you can attach a custom domain to a deployment by dragging a normal (non-domain) card onto an existing domain card in the same column; this re-points that domain to the deployment you dropped. You can also connect and disconnect domains from a card's right-click menu. The full domain setup, including DNS, is described further down.

`Connect Domain` asks you for the domain name and then requests a Let's Encrypt certificate for it automatically. If a certificate for that domain already exists and is bound to another deployment, you are asked whether to re-point it to this one instead. `Disconnect Domain` unbinds the domain and removes its certificate; when several domains are bound to the same deployment you get to pick which one to disconnect.

**Replacing the version on a domain:** when you drop a card onto a domain card, the version that was previously connected to that domain is **replaced** by the one you dropped. The replaced version is marked **inactive** and no longer appears as a card in the pipeline. It is not deleted, only hidden.

> **Note:** **Important:** a replaced (inactive) version is not lost and can be brought back. Click a card in that column to open its properties, scroll down to the *Versions* grid, select the version you want, and click the `Restore This Version` button. That version becomes active again and reappears in the pipeline as the one connected to the domain.


#### Other Card Actions

A card's right-click menu also offers a few navigation and management actions:

- `Go to Project`: opens the project's source in the [Projects tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment).
- `Go to Deployment`: opens the container the card is deployed from in the [Database tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) (Database Explorer).
- `Delete Deployment`: removes the deployment from the pipeline and unpublishes it. Your project files are not touched, so the source container and everything in it stays in the database.

> **Note:** deleting the **last** deployment of a project goes further, and the confirmation dialog warns you about it: the pipeline itself is removed, and with it every `Staging` and `Production` snapshot container that project has under `tenant://Deployments`. Your project in `home://Applications` or `tenant://Applications` is still left alone.

The version shown on a card comes from the deployed application's manifest. For `Development` and `Shared` cards, which serve the live files, editing the version in the manifest updates the card the next time the Deployments tab is loaded. `Staging` and `Production` cards are snapshots and keep the version they were promoted with.

#### The Properties Panel

You can easily manage your deployed applications from the [Deployments tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment). Clicking a card opens the `Properties` panel to the right of the boards; the `Properties` button in the toolbar hides and shows it again, and the `Help` button next to it opens the documentation for the section. Clicking empty board space clears the selection. The panel holds:

- the project's name and icon, the date the card was last `Updated`, its `Version`, and its test `Status` as a badge.
- a `Promote to <stage>` button for each stage the card can advance to.
- the `Access URL` the deployed application is reachable on (click it to open the deployment in a browser window; it shows your custom domain once one is connected), the `Client` the deployment belongs to, the date it was `Deployed`, and whether a `Login` screen is configured.
- `Contents of Deployment`, listing the objects in the deployment's container with the time each was last updated, together with `Go to Project` and `Go to Deployment` buttons that jump to the source project and to the deployed container.
- a `Versions` grid with the `Restore This Version` button, shown for `Staging` and `Production` cards that have older, replaced versions. See **Connecting a Custom Domain** above.
- `History`, a log of everything that has happened to the deployment: promotions, test-status and visibility changes, domains connected and disconnected, and version restores.
- a `Configuration` group with `Connect Domain...` and `Disconnect Domain...` for `Staging` and `Production` cards, and `Configure Login Page...` (labelled `Edit Login Page...` once one exists) for `Staging` cards.

For another user's `Development` card the panel is reduced to what you are allowed to see and do: no promote button and no contents listing.


By default, applications are assigned a system domain following these patterns:

**Deployed application Home domain**

```console
https://[tenant]-[username]-[deployment_name].cloudbackend.cloud
```

**Deployed application Group domain**

```console
https://[tenant]-[groupId]-[deployment_name].cloudbackend.cloud
```

A `Development` deployment uses the home pattern with your user name, a `Shared` deployment the group pattern with the project name. `Staging` and `Production` snapshots also use the group pattern, but their name carries the timestamp of the promotion (for example `myapp_20260729103000`), which is why an access URL changes when a card is promoted into those stages. To use your own external domain, right-click the deployment card in `Staging` or `Production` and choose `Connect Domain`, or use the `Connect Domain` button in its properties panel. This binds the domain to the deployment you acted on automatically, so XIOS routes incoming requests to it. There are no certificate files to select in the Deployments section; the generated certificate configuration (for example `mydomain.com.xml`) is stored in `tenant://Settings/Certificates`. To finish the setup, point the domain's DNS (an `A` record) to `83.140.241.4`.


#### Customizing Login Screen

The image below shows the configurator for customizing a deployment's login screen. Open it with `Configure Login Page...` in the properties panel of a `Staging` deployment. Any values already set in the application manifest will be visible here, and can be edited. An explanation to each element can be found [here](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application). Any fields that are left empty or erased will not show in the deployment's login screen, and changes only take effect when you press `Save`.

The configuration you save is kept on the project's pipeline, per client, as well as in the deployed application's manifest. That is what lets it survive a promotion: when the staging card is promoted to `Production` a fresh copy of the application is made, and the saved login configuration is written into it again, so you do not have to set the login screen up a second time.

Clients are used to distinguish between different user bases or application areas, for instance web, mobile or IoT solutions, and give you statistics about your users per client. Deployments made through the Web UI are registered against your tenant's *Web* client, which is created for you the first time it is needed. The client type can be changed in the properties dialog in the [Clients tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment). Read more about Clients here.


The background can be set as a URL to an externally accessible image, or the name (with file ending) of an image uploaded into the selected Deployment's container, or a `#000000` to `#ffffff` color. (Setting two colors separated by a comma (,) will create a bottom-up gradient between the first and second color.) The Logo can be set as a URL to an externally accessible image, or the name (with file ending) of an image uploaded into the selected Deployment's container.

The `Background Dark / Light` setting tells the login screen whether your background is dark or light so it can choose a readable font color. It maps to the `dark` attribute of the `background` element (see the [Login Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application) section); if you are unsure, leaving it lets XIOS/3 try to detect the right font color automatically.

For a colour you can also use the colour picker next to the `Background` field instead of typing a hex code. To use an image that lives in the deployment's own container, click the folder icon next to `Logo URL` or `Background`; it opens a file picker on that container and fills the field in with the image you choose.

To see a preview of the deployment's login screen you can click on the `Preview` button. This will open a window in the web UI giving you an idea what your login screen will look like. If you make any changes you might have to close the preview and click the button again.

**Show EULA on user creation**: when this box is checked, anyone creating an account through your login screen must accept an end-user license agreement before the account is created. This shows the standard CloudBackend sub-user EULA, or your tenant's own custom EULA if one has been created.

> **Note:** Password recovery is an upcoming feature, which is not released yet. You may still customize a password recovery text and link to your login screen, and it will show up and work as soon as we release the feature.

#### Viewing Deployments in the Database

As mentioned, deployed applications will also appear in the [Database tab](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment) of CloudBackend. A `Development` deployment is your project itself under `home://Applications`, a `Shared` deployment is the tenant copy under `tenant://Applications`, and each `Staging` or `Production` snapshot has its own timestamped container under `tenant://Deployments`. The `Go to Deployment` action on a card takes you straight to the right one. Navigating to the container for a specific deployment will allow you to see the objects for that deployment. This means that you can edit, replace, or remove the application, and any changes will affect that deployment itself. You will also be able to see and edit the properties of a deployed object using the Database Explorer's Properties dialog, as seen in the image below.



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/managing-deployments>*

---
