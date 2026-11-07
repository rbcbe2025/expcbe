# UI probes — last pass: never, Development https://acme-acme-tasktrack.cloudbackend.cloud
Rules: a fresh browser context; trusted clicks only; one assertion after each action; desktop then 390 px.

| # | Action | Expected state | Result | Evidence |
| 1 | open / | the login screen: Log in, Forgot your password?, Create an account | | |
| 2 | sign in as a role-less test identity | the list shows 3 tasks and the New button | | |
| 3 | click newItem | the detail opens with empty fields | | |
| 4 | type a title, click save | the list shows the new task; the stored document reads back | | |
| 5 | click remove on that task | the task leaves the list | | |
| 6 | 390 px: open a task, then Back | the detail fills the width, Back returns to the list, nothing scrolls sideways | | |
