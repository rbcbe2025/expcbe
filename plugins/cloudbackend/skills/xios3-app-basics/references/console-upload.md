# Pushing an app's files without a tool — the CLI and the console's Upload Files dialog

Hand-written. How an app's files reach the tenant when neither the plugin's tenant server nor the VS Code / Cursor
extension is connected, and how to get an app with sub-folders up that way. Moved out of `deployment-pipeline.md`
on 2026-11-28, unchanged; that page has what happens after the files are there.

## Pushing files without a tool

Without the VS Code / Cursor extension, text files reach the tenant
through the CLI's `upload` (after `cd` into the application's container), which opens the console's Upload
Files dialog; the dialog replaces by file name. Plan a quarter of an hour per push of a few files, keep the
file count small, and version module file names so a changed module is a new upload (and the runtime does
not serve its cached copy).

## Folders first: an app with sub-folders

An upload goes into one container and does not create folders. An app whose files sit in sub-folders (the design
kit writes `views/`, `processes/`, `xsl/`, `styles/`, `ui/DesignKit/` and `data/`) needs those containers before
its files can go in, and each folder's files are uploaded into their own container. In a project, Development's
**Upload folder...** takes a whole folder; elsewhere, two ways work:

- **The CLI** (the console's CLI section, or the terminal CLI). `mkdir` creates a container and `upload` takes the
  container to upload into, so one session does the whole tree. From the app's container (`cd` to it first):

  ```console
  mkdir views
  mkdir processes
  mkdir xsl
  mkdir styles
  mkdir ui
  mkdir ui/DesignKit
  mkdir data
  upload views
  ```

  Each `upload` opens the Upload Files dialog for that container; pick that folder's files. Repeat `upload` for
  `processes`, `xsl`, `styles`, `ui/DesignKit` and `data`, then `upload` with no path for the files at the app's
  top level (`index.xml`). Create a parent before its child (`ui` before `ui/DesignKit`).
- **The Database Explorer** (console). Open the app's container, create each sub-container there (it can create
  containers, and a container may hold sub-containers), then select each one and use Upload in its toolbar for that
  folder's files.

Check before deploying: `ls` in the app's container lists every folder, and `ls views` (and so on) lists its files.
A file in the wrong container is not an error at upload time, only a blank part of the app at run time.
[Create Container](https://robinsbackend-robinsbackend-portal.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/container-commands/create-container) and
[Upload Objects](https://robinsbackend-robinsbackend-portal.cloudbackend.cloud/cloudbackend/docs/cli/command-line-interface/object-commands/upload-objects) have the
commands.
