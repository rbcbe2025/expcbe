#!/usr/bin/env bash
# run-evals.sh <label> [options] — scripts/run-evals.mjs with the PATH a non-interactive ssh session on big lacks
# (the claude CLI and node live in ~/.local/bin and /opt/homebrew/bin there). See run-evals.mjs for the options.
set -euo pipefail
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
here=$(cd "$(dirname "$0")/.." && pwd)
exec node "$here/scripts/run-evals.mjs" "$@"
