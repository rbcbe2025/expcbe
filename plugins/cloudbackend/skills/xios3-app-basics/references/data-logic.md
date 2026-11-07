# The data logic that goes with the screens

Hand-written, measured on the hosted runtime 2026.6.0 on 2026-10-09 in sample mode (a listing and records
served as files), with the database writes in the shape the manual and the measured `javascript-as-steps`
reference of `xios3-app-basics` give them. The view shows; the process binds and writes.

## The five bindings

```xml
<!-- the list: the container's listing, one row per db:object -->
<operation name="bind" value="{$itemsUrl}">
  <component view="App" name="items" select="/db:result"/>
</operation>

<!-- the detail: the selected object's own document, to the render and to each field -->
<alias name="itemUrl" value="{#App#items#@xlink:href}" model="value"/>
<operation name="bind" value="{$itemUrl}"><component view="App" name="detail" select="/"/></operation>
<operation name="bind" value="{$itemUrl}"><component view="App" name="titleInput" select="/item/title"/></operation>
<operation name="bind" value="{$itemUrl}"><component view="App" name="stateInput" select="/item/status"/></operation>
<operation name="bind" value="{$itemUrl}"><component view="App" name="notesInput" select="/item/notes"/></operation>
```

Measured: typing in a bound field changed the render at once, because both are bound to the same document.
A listing's rows carry `@name`, `@updated` and `@xlink:href`; the document's content is only in the
document, so what the list shows must be in the name or in a datatype's key/values (`singularity-database`
`datatypes.md`).

## The writes, in the process

```xml
<!-- New: a dialog, then the object; the name is the title without the characters a name may not hold -->
<step id="newItem">
  <operation name="confirm">
    <type value="input"/><title>New project</title><message>What is the project called?</message>
    <modal>false</modal><ok step="createItem" text="Add"/><cancel step="cancel" text="Cancel"/>
  </operation>
</step>
<step id="createItem" error="writeFailed">
  <alias name="newTitle" value="{!}" model="value"/>
  <alias name="newName" value="{translate($newTitle, '?/\()*:|%&amp;&lt;&quot;!', '')}" model="value"/>
  <alias name="stamp" value="{format-date('now', 'yyyy-MM-dd')}" model="value"/>
  <operation name="database" value="{$itemsUrl}">
    <create type="object" name="{$newName}.xml" rename="true">
      <content type="text/xml"><item><title>{$newTitle}</title><status>Planned</status><notes></notes><created>{$stamp}</created></item></content>
    </create>
  </operation>
</step>

<!-- Save: the fields into the document, then the document stored -->
<operation name="change" value="{$itemUrl}"><store select="/item/title" type="replaceText">{#App#titleInput}</store></operation>
<operation name="change" value="{$itemUrl}"><store select="/item/status" type="replaceText">{#App#stateInput}</store></operation>
<operation name="change" value="{$itemUrl}"><store select="/item/notes" type="replaceText">{#App#notesInput}</store></operation>
<operation name="save" value="{$itemUrl}"/>

<!-- Delete: ask, then remove -->
<operation name="confirm"><type value="confirm"/><title>Delete this project?</title><message>…</message><modal>true</modal>
  <ok step="deleteConfirmed" text="Delete"/><cancel step="cancel" text="Keep"/></operation>
<operation name="database" value="{$itemUrl}"><delete permanent="true"/></operation>
```

Rules that follow from the measured contract: a document loaded or changed in JavaScript is a copy, so
writes are these operations and nothing else; prove a write by reading the stored document back (the CLI's
`cat`), not from the screen; `rename="true"` keeps a name collision from failing the step; `error="…"` on a
step runs a step when an operation fails (the example's `writeFailed` puts the failure line in the status
bar); the dialog's answer is `{!}` in the step the dialog's `ok` names.

`translate()` removes the characters an object name may not contain (`? / \ ( ) * : | % & < " !`, and
`#`, `[`, `]`, `{`, `}`, which this call leaves out because they are hard to write inside an expression;
`rename="true"` covers the rest). A name that reads in the list is worth this; a timestamp name is the
fallback when the title is free text you do not trust.

## First run

```xml
<operation name="decision" value="{$itemsUrl}">
  <when exists="false">
    <operation name="database" value="home://Planboard/"><create type="container" name="Projects"/></operation>
  </when>
</operation>
```

A new identity opens on the empty state and the first-run line in the status bar, not on an error.
Per-user data (`home://`) needs no ACL; shared data (`tenant://…`) is created once by an administrator with
an ACL granted to a role or group (`singularity-database`).

## Sample mode

One alias, `sample`, and the same steps branch on it: the list is bound to `{$sampleUrl}`, a listing shipped
with the app (`data/items.xml`, in the `db:result` shape, whose rows point at the records next to it); New
appends a `db:object` to that listing in memory with `change` `store type="append"`, so the list grows;
Save changes the record on screen; Delete says it needs a tenant. The user sees the app before the tenant
exists, and the process is the one that ships. In the console, the sample listing's address is
`home://Applications/<app>/data/items.xml` (the project folder); set `SAMPLE` back to `false` for the
real container.

## The status line is part of the logic

Every step that changes data ends with one line in the status bar, in the direction's voice:

```xml
<operation name="callMethod" value="#App#status">
  <method name="notify"><param type="string">Saved.</param><param type="string">ok</param></method>
</operation>
```

`info` and `ok` fade; `error` stays; `busy` shows a spinner until the next `notify` or `clear`. A step that
calls a service through the proxy says `busy` before and `ok` or `error` after; the launch skill's rule that
the user must never be left wondering whether something happened is this line.
