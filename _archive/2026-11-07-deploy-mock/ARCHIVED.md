# The eval stand-in for cloudbackend-deploy

Archived 2026-11-07: the plugin no longer declares CloudBackend's deploy connector in .mcp.json (it signs in only for
an account with its own sign-in realm, so for most users it could only fail to connect; it is added by hand now).
Every tool here answered the 401 an account without a realm gets. An eval run has no such server any more.
