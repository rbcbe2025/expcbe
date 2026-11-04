#!/bin/sh
# connect-deploy.sh <tenant> [--print]
# Adds the per-tenant CloudBackend deploy connector to Claude Code and prints its URL for the other clients.
# The documentation and build connectors come with the plugin; this one signs you in at your tenant, so it
# is added per tenant, by you, never from the plugin's .mcp.json.
set -eu

tenant=${1:-}
mode=${2:-}
case "$tenant" in
  ''|-h|--help)
    echo "usage: $0 <tenant> [--print]" >&2
    echo "  <tenant>  your CloudBackend tenant name: lowercase letters and digits" >&2
    echo "  --print   only print the URL and the per-client steps; do not touch Claude Code" >&2
    exit 2 ;;
esac
if ! printf '%s' "$tenant" | grep -Eq '^[a-z0-9]+$'; then
  echo "tenant \"$tenant\" is not [a-z0-9]+ (lowercase letters and digits only)" >&2
  exit 2
fi

url="https://mcp.cloudbackend.com/mcp/$tenant"

if [ "$mode" != "--print" ]; then
  if command -v claude >/dev/null 2>&1; then
    echo "Claude Code: adding cloudbackend-deploy ($url) at user scope"
    claude mcp add --transport http cloudbackend-deploy "$url" --scope user
    echo "Done. The first call opens the tenant's sign-in page in your browser."
  else
    echo "claude is not on PATH; nothing was added. The Claude Code command is:"
    echo "  claude mcp add --transport http cloudbackend-deploy $url --scope user"
  fi
  echo
fi

cat <<TEXT
Deploy connector URL for tenant "$tenant":
  $url

claude.ai, Claude Desktop, Cowork
  Settings > Connectors > Add custom connector, name "cloudbackend-deploy", URL above. Sign in at your tenant when asked.

Cursor
  cursor://anysphere.cursor-deeplink/mcp/install?name=cloudbackend-deploy&config=$(printf '{"url":"%s"}' "$url" | base64 | tr -d '\n')
  or in .cursor/mcp.json:  {"mcpServers":{"cloudbackend-deploy":{"url":"$url"}}}

VS Code
  code --add-mcp '{"name":"cloudbackend-deploy","type":"http","url":"$url"}'

Claude Code (by hand)
  claude mcp add --transport http cloudbackend-deploy $url --scope user
TEXT
