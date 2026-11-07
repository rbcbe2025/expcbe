# After launch: the common tasks

The path is for the first launch. Afterwards most requests are one of these: route each to the owner skill and
finish with the same "check it worked" discipline (a dated evidence line, the user's confirmation, a stored
document read back).

| Task | Where to go |
| --- | --- |
| Add a field to a kind of object | singularity-database `datatypes.md`: change the datatype in `tenant://Settings/Datatypes`, and check there how objects that already exist get the new key/value |
| Add a screen or change one | xios3-app-basics `views.md` / `processes.md`, keeping the theme and the kit's patterns (`layouts.md`); then redeploy Development, verify, and promote |
| Change the look (colours, fonts, a brand) | xios3-app-basics design kit: change the seeds in `design/design.json`, `designkit.py moodboard`, paste the new theme; never a hex in a view |
| Change who can see what | singularity-database `users-and-roles.md`: the container ACL in the Database Explorer, granted to a role or group; the user tests with a test identity in a private window |
| Add a customer organisation | a group with its roles; add members from the app (console invitations are not visible to customers) |
| Change prices | singularity-database `price-plans.md`: edit the plan; the container is already published |
| Ship a change | Development → Make Public → Shared → Mark Verified → Staging → Edit Login Page (logo = the Staging host's URL) → Mark Verified → Production, `verify_deployment` after each; each promotion before Production moves the card and kills the previous address, Production keeps the Staging host (xios3-app-basics `deployment-pipeline.md`) |
| Onboard a customer by hand (no CRM) | `launch-path.md` step 4b: Identities › Create with no role, the Production address only, a private-window check, the register |
| Undo a bad release | Deployments › the Production card › Versions › Restore This Version, then `verify_deployment` |
| Move to another domain | Connect Domain on the Staging or Production card; `A` record → `83.140.241.4` |
| See usage and revenue | the Statistics section; purchase records in `/System/Purchases/` |
| Answer users | the Support desk (it needs at least one category) and the CRM's mails |
