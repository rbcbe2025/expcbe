# Pitfalls met while building the tutorial application

The shopping-list tutorial's pitfall reference and its page on deploying with a login, from the published XIOS/3 manual.

2 topics from the published XIOS/3 documentation, generated on 2026-11-06. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Deploying with a Login](#deploying-with-a-login)
- [Pitfall Reference](#pitfall-reference)

## Deploying with a Login

Everything so far has run inside the console, where you are already signed in. A deployment is different, and the difference is not obvious until it fails.

### 1. Why a deployment needs a login

> **Note:** **Rule:** `home://` resolves to the database of the *signed-in identity*. Open a deployment URL cold and there is no session, so `home://` resolves to nothing and every path in the application fails.

The answer is the platform's [login application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/guides/application-deployment/login-application), not authentication code of your own. It is four additions to the manifest.

**Adding the login application** *(fragment)*

```xml
<application name="assistant"
             xmlns:db="https://cloudbackend.com/db.xsd"
             xmlns:xlink="http://www.w3.org/1999/xlink">

  <about version="1.0"/>

  <!-- 1. the login application runs first -->
  <process xlink:actuate="onLoad" xlink:href="xios://apps/login.xml"/>

  <!-- 2. what the sign-in page says -->
  <login>
    <title>Shopping</title>
    <description>Sign in to reach your shopping lists.</description>
    <copyright>Personal Assistant App</copyright>
  </login>

  <!-- 3. and 4. your own view and process wait until after sign-in -->
  <view xlink:actuate="onRequest" name="shopping" ...>
  <process xlink:actuate="onRequest" name="assistantProcess" ...>

</application>
```

Nothing else changes. No user model, no data model change, no authentication logic. Once a session exists, `home://` is that user's own database and every path in the application resolves exactly as it did in the console.

### 2. Where the data should live

A tempting shortcut, when a deployment does not immediately work, is to move the data to `tenant://`. Resist it.

| Channel | What it means for a shopping list |
|---|---|
| `home://` | Private per identity. Every signed-in user gets their own lists, with no code at all. |
| `tenant://` | Shared by everyone in the tenant. Not "a single user", but one shopping list that everybody edits at once. |

The migration direction matters too. Moving `home://` to a shared channel later is the cheap move: the documents relocate, the bindings keep working, and access is controlled by the container's permissions rather than by application logic. Going the other way means untangling one shared pool into per-person data and deciding who owns what.

> **Note:** This is exactly why the base path lives in one alias in the `start` step. Changing channel later is a one-line edit.

### 3. Test through Add to Home Screen

Not in a browser tab. Standalone mode removes the browser chrome, which is worth roughly 100 pixels of list, and it is how the application will actually be used. It is also the only way to find out what happens when the phone locks for fifteen minutes and comes back, which is the most likely real failure in a shop and the one a desktop browser can never show you.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/deploying-with-a-login>*

---

## Pitfall Reference

Every one of these was met while building the application this tutorial describes. They share a family resemblance worth naming: the runtime ignores markup it does not recognise, and several of these failures produce a screen that looks correct and does nothing. That is why the list is worth reading before you need it.

| Symptom | Cause | Fix | Chapter |
|---|---|---|---|
| A step called `start` runs twice | `process/@step` defaults to `start`, so it runs on process load and again from a [`Loaded`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/loaded) trigger. | Point `step` at an empty `boot` step and keep the trigger. | [The Application Shell](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/the-application-shell) |
| A touch tap does nothing | A tap fires [`DoubleClick`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/doubleclick), not [`Select`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/events/select). Works with a mouse, dead under a thumb, silent in every log. | Wire both events on every tap interaction. | [Opening a List and Adding Items](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/opening-a-list-and-adding-items) |
| A bind with a predicate renders nothing | A `select` that resolves to a node-set of the items themselves produces no rows. | Bind to the parent element and put the predicate in the rule `match`. | [Showing the Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/showing-the-data) |
| Rows are alphabetised | `sort` defaults to `ascending`. | Set `sort="position"`. | [Showing the Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/showing-the-data) |
| A second tap starts an inline rename | `rename` defaults to `true`. | Set `rename="false"`. | [Showing the Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/showing-the-data) |
| Rows are a fixed 158 pixels wide | The row carries an inline width and height from `itemwidth`. | Override those two properties with `!important`. Nothing else needs it. | [Styling the Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/styling-the-application) |
| The stylesheet does not reach the label | The label is `.textcontainer .text`, not a bare `.text`. | Read the rendered DOM before writing selectors. | [Styling the Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/styling-the-application) |
| A name with a quote or angle bracket stores the raw template | User text serialised into a `store` node-set produces markup that fails to parse. An ampersand and an apostrophe survive by luck, which hides the problem. | Append a skeleton with generated values only, then write the text with `replaceText`. | [Creating a Shopping List](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/creating-a-shopping-list) |
| An alias holding a function returns text, not a value | An `value` containing `{…}` is a string template, so the expression is never evaluated. | Do the computation in a [`decision`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision) test instead. | [Empty States and Button State](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/empty-states-and-button-state) |
| A decision always takes the otherwise branch | `text()` selects nothing when the value is a plain string, so no `when` matches. | Write node-free tests such as `'{$flag}' = 'on'` and omit `value`. | [Empty States and Button State](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/empty-states-and-button-state) |
| A decision value beginning with punctuation misbehaves | A value like `\|{$flag}\|` is parsed as a path reference, not a literal. | Avoid probe values entirely; test the alias directly. | [Empty States and Button State](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/empty-states-and-button-state) |
| An operation throws on a dollar sign | A literal `$` in a `value` attribute starts an alias or URL reference. | Only write it inside braces as an expression. User data containing one is fine. | [Empty States and Button State](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/empty-states-and-button-state) |
| Reading an attribute returns a path | `$listDoc#/…/@name` in an alias gave back the document URL. | Read attributes from the component selection: `{#view#comp#@name}`. | [Editing and Deleting](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/editing-and-deleting) |
| Deleting an object does nothing | `permanent="false"` needs a Trashcan container on `home://`. Without one the object survives while its index entry is removed. | Ensure the Trashcan exists in bootstrap. | [Creating a Shopping List](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/creating-a-shopping-list) |
| A button never greys out | A [`button`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/components/button) is created enabled and stays so until an event fires. | Set `enabled="false"` in the markup for the start-up state. | [Empty States and Button State](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/empty-states-and-button-state) |
| The page zooms when a field is focused | Safari zooms below 16 pixels, measuring the inner element rather than the wrapper. | Set 16 pixels with `!important` on the inner element. | [Styling the Application](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/styling-the-application) |
| An icon does not appear | The name does not exist. `checkbox_checked` is not in the set. | The console reports `Unable to load icon`, so verify names there. | [Showing the Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/showing-the-data) |
| Angle-bracketed text vanishes from a label | Labels are assigned through `innerHTML`, so markup in the text is interpreted. | Leave it. The document is correct; working around it would make screen and data disagree. | [Showing the Data](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/showing-the-data) |
| Changes made offline are lost | Nothing accumulates locally and a failed save is silent. | Treat it as a product constraint, not a bug. Decide deliberately before building on it. | [Checking Items Off](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/checking-items-off) |
| Every path fails in a deployment | There is no session, so `home://` resolves to nothing. | Add the platform login application to the manifest. | [Deploying with a Login](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/deploying-with-a-login) |

### When nothing happens at all

The most common failure in a XIOS/3 application is a control that does nothing, and it is almost always wiring rather than logic. Check in this order:

1. The trigger's view, component and event spelling.
2. That the event actually exists on that component.
3. That the event is the right one for the input device. A tap is not a click.
4. Expression shape: `{#shopping#toBuy}`, not `{#shopping/toBuy}`.
5. That the component is inside a panel.
6. That the namespaces are declared, if a rule matches `db:` elements.
7. That rules use plain XPath in `match`, not XIOS/3 expressions.
8. That a [`decision`](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/reference/operations/decision) in the path is not silently falling through to `otherwise`.

### Two habits worth keeping

- **Inspect the document, not only the screen.** For every flow, open the object and confirm the XML matches what the interface shows, that only the intended node changed, and that nothing was orphaned or duplicated. Several bugs above looked fine on screen.
- **Verify on the device before calling a flow done.** Three of the entries in the table cannot be reproduced on a desktop at all.

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/xios3/docs/tutorials/shopping-list-tutorial/pitfall-reference>*

---
