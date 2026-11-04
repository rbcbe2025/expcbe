#!/bin/sh
# run-build-server.sh [data-dir]
# Starts the cloudbackend-build server (`python -m cbemcp_build` over stdio) from the Python environment that
# scripts/ensure-build-venv.sh made in the plugin's data directory. Claude Code expands ${CLAUDE_PLUGIN_DATA} in a
# server's args and env but not in its command (measured on 2.1.316, 2026-11-04), so .mcp.json runs this script
# from ${CLAUDE_PLUGIN_ROOT} and passes the data directory as its argument; the environment variable is the fallback.
set -u
root=${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}
data=${1:-}
case "$data" in ''|'$'*) data=${CLAUDE_PLUGIN_DATA:-} ;; esac
py="$data/venv/bin/python"
if [ -z "$data" ] || [ ! -x "$py" ]; then
  echo "cloudbackend plugin: the build server's Python environment is not there yet (${py:-no data directory}); the session-start hook makes it once, then start a new session" >&2
  exit 1
fi
PYTHONPATH="$root/servers/build/src${PYTHONPATH:+:$PYTHONPATH}"
PYTHONDONTWRITEBYTECODE=1                      # no __pycache__ inside the plugin tree
export PYTHONPATH PYTHONDONTWRITEBYTECODE
exec "$py" -m cbemcp_build
