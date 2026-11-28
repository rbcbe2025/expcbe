# After launch: the common tasks

The path is for the first launch. Afterwards most requests are one of these: route each to the owner skill and
finish with the same "check it worked" discipline (a dated evidence line, the user's confirmation, a stored
document read back).

| Task | Where to go |
| --- | --- |
| Add a field to a kind of object | singularity-database `datatypes.md`: change the datatype in `tenant://Settings/Datatypes`, and check there how objects that already exist get the new key/value |
| Add a screen or change one | xios3-app-basics `views.md` / `processes.md`, keeping the theme and the kit's patterns (`layouts.md`); then redeploy, verify, and ship it as below |
| Change the look (colours, fonts, a brand) | xios3-app-basics design kit: change the seeds in `design/design.json`, `designkit.py moodboard`, paste the new theme; never a hex in a view |
| Change who can see what | singularity-database `users-and-roles.md`: the container ACL in the Database Explorer, granted to a role or group; the user tests with a test identity in a private window |
| Add a customer organisation | a group with its roles; add members from the app (console invitations are not visible to customers) |
| Change prices | singularity-database `price-plans.md`: edit the plan; the container is already published |
| Ship a change | the project's Deployments tab: Project › Test as <n> → Mark as Verified → Make Live → Move Domain Here on the new Live card, `verify_deployment` after each; every version gets a new address, Live keeps the one it had in Test, and the domain is the only address that survives a release (xios3-app-basics `deployment-pipeline.md`) |
| Onboard a customer by hand (no CRM) | `launch-path.md` step 4b: Identities › Create with no role, the domain (or the Live address) only, a private-window check, the register |
| Undo a bad release | while the previous version is still in Live: Move Domain Here on its card (or the card's Versions › Restore This Version), then `verify_deployment`; not measured yet |
| Move to another domain | Connect Domain on the Test or Live card; `A` record → `83.140.241.4`, no other A or AAAA records |
| See usage and revenue | the Statistics section; purchase records in `/System/Purchases/` |
| Answer users | the Support desk (it needs at least one category) and the CRM's mails |
