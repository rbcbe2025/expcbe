# Fixtures for the eval cases

`scripts/gen-evals.mjs` copies a fixture into each case that needs files on disk (`FIXTURES` in the script) and writes
the case's `case.yaml` and `scaffold.sh`, which copies the fixture into the run's working directory before the agent
starts. A run needs `--scaffold` for that (`scripts/run-evals.sh` passes it). Without a fixture, a case that says "my
package" or "the upload passed" meets an empty folder, and a careful run stops to ask instead of doing the step.

| Fixture | Cases | What it is |
| --- | --- | --- |
| `tasktrack/` | xios3-app-workflow 3, 5, 6, 7, 8, 9, 11, 12 (as `app/`) | The design kit's first version of the task tracker, behind the login screen: `designkit.py brief --app tasktrack --idea "a task tracker for one person: their own tasks with a due date and a done list" --item task`, then `designkit.py app --design design/design.json --items "home://tasktrack/Tasks" --out app --login` (xios3-app-design 2026.11.5.5). Clean under `lint_project` build and ship. |
| `tasktrack-project/` | xios3-app-workflow 5, 6, 7, 8, 9 (at the root, beside `app/`): the cases past the first deploy | The project those prompts pick up: `cloudbackend-launch.md` with W0 to W4 ticked and their evidence lines (tenant acme, the tenant server route, no browser tool), `docs/spec.md` and `tests/ui-probes.md` from the workflow skill's templates in `references/project-layout.md`, naming the fixture app's components. By hand. |
| `dated-gallery/` | xios3-app-design 7 (at the root) | A view with every common component under the theme the kit wrote before 2026-11-05: thirteen components `look="token"`, no `ui/DesignKit/theme.css`, so the accordion, switch, radios and dialog keep their legacy look. The view is the gallery the theme was measured with (`references/theme.md`). |
| `planboard-login/` | xios3-app-design 8 (at the root) | `designkit.py app --login` for Planboard, then `<login>` without `session="true"` and the Sign out hidden, as the kit wrote it before 2026-11-05: every reload signs the user out. `designkit.py login` reports both. |
| `broken-package/` | xios3-app-workflow 2 (at the root) | The package that case's prompt describes, by hand: `views/view.xml` with a `<select>` and `<option>`s, `<process version="1">` with `<operation name="call" step="save"/>`, and `layout/app.css` with `#336699`. `lint_project` reports exactly G01, G02, G04 and G05 under build, and G10 as well under ship. |

Regenerate `tasktrack/` with the commands above when the design kit's output changes, and keep it clean under both lint
profiles.
