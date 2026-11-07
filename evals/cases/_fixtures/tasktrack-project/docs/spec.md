# tasktrack — solution spec (v1)
Updated 2026-11-05. One page. The user said yes to this before the design started.

## What it is, for whom
A task tracker for one person: their own tasks with a due date and a done list · customers are: individuals

## v1 features (the rest is v2)
1. a list of tasks 2. a task's detail 3. New, Save, Delete 4. the status open or done   | v2: reminders, AI summaries, sharing a list

## Screens and components (names are the names in the markup)
| Screen | Components | Phone layout |
| List | items, newItem, search | list, then detail with Back |
| Detail | titleInput, stateInput, notesInput, save, remove | full width, Back to the list |

## Data
| Kind | Fields (name: type) | Scope | Container |
| task | title: text, status: open\|done, notes: text | per user | home://tasktrack/Tasks |
Datatype: task.xdt. Control query: only the signed-in user's tasks are listed.

## Roles and access
One person per account; the container's ACL grants the owner's role read and write, nobody else.

## Channels (integrations, AI)
| Channel | Provider | Proxy pinned to | Key | Spend limit | Who may call | Cost of one call |
none in v1

## Login, sign-up, analytics, SEO and GEO
login: yes · sign-up: manual · analytics: none · public surface: no; llms.txt

## Security and legal baseline
no secrets in app/; EULA and privacy text; account deletion path; data location statement

## Documentation plan
README, manual (one section per screen), api.md; agent notes

## UI probes (action → expected state)
1. open / → the login screen with sign in, sign up and forgot password
2. sign in → the list shows 3 tasks and the New button
3. click newItem → the detail opens with empty fields
4. type a title, click save → the list shows the new task; read back the stored document
5. click remove on a task → the task leaves the list
6. at 390 px: the list, then the detail with Back; nothing scrolls sideways

## Pricing
free v1
