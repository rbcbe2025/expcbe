#!/bin/sh
# ensure-build-venv.sh [data-dir]
# The plugin's SessionStart hook (hooks/hooks.json): the Python environment the cloudbackend-build server runs in.
# Creates <data-dir>/venv once, with uv when it is installed (it fetches a Python 3.12 if the machine has none),
# else with a python3 of 3.12 or newer, and installs servers/build/requirements.txt into it. A stamp file keyed on
# the requirements' sha256 makes every later session a no-op; a changed requirements file installs again.
# Quiet: nothing on stdout (a SessionStart hook's stdout goes to the model), one line on stderr only when it did
# something or cannot (no Python, no uv: says so). Always exit 0, so a session is never blocked by this.
# <data-dir> is ${CLAUDE_PLUGIN_DATA}, expanded by Claude Code in the hook command; the environment variable is
# the fallback when the argument arrived unexpanded.
set -u
root=${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}
data=${1:-}
case "$data" in ''|'$'*) data=${CLAUDE_PLUGIN_DATA:-} ;; esac
say() { printf 'cloudbackend plugin: %s\n' "$1" >&2; }
if [ -z "$data" ]; then say "no plugin data directory (CLAUDE_PLUGIN_DATA); the build server cloudbackend-build is not set up"; exit 0; fi
req="$root/servers/build/requirements.txt"
if [ ! -f "$req" ]; then say "servers/build/requirements.txt is missing: this copy of the plugin carries no build server"; exit 0; fi

digest() {
  if command -v shasum >/dev/null 2>&1; then shasum -a 256 "$1" | cut -d' ' -f1
  elif command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1
  else openssl dgst -sha256 "$1" | sed 's/.*= //'; fi
}
sum=$(digest "$req")
venv="$data/venv"
stamp="$data/venv.requirements.sha256"
log="$data/venv-install.log"
if [ -x "$venv/bin/python" ] && [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$sum" ]; then exit 0; fi

mkdir -p "$data" 2>/dev/null || { say "cannot create $data; the build server is not set up"; exit 0; }
lock="$data/venv.lock"
if ! mkdir "$lock" 2>/dev/null; then
  # Another session is installing; a lock older than 30 minutes is a crash's leftover.
  if [ -n "$(find "$lock" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then rmdir "$lock" 2>/dev/null; mkdir "$lock" 2>/dev/null || exit 0
  else exit 0; fi
fi
trap 'rmdir "$lock" 2>/dev/null' EXIT INT TERM
rm -f "$stamp"
: > "$log"

# Which Python: uv first (it brings a 3.12 if the machine has none), else the newest python3 of 3.12 or later.
version_ok() { "$1" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 12) else 1)' 2>/dev/null; }
made=''
if command -v uv >/dev/null 2>&1; then
  if uv venv --quiet --python '>=3.12' "$venv" >>"$log" 2>&1 && uv pip install --quiet --python "$venv/bin/python" -r "$req" >>"$log" 2>&1; then made="uv $(uv --version 2>/dev/null | cut -d' ' -f2)"
  else rm -rf "$venv"; fi
fi
if [ -z "$made" ]; then
  py=''
  for candidate in python3.14 python3.13 python3.12 python3 python; do
    if command -v "$candidate" >/dev/null 2>&1 && version_ok "$candidate"; then py=$(command -v "$candidate"); break; fi
  done
  if [ -z "$py" ]; then
    say "the build server cloudbackend-build needs Python 3.12 or uv and this machine has neither on PATH (details: $log); install uv from https://docs.astral.sh/uv/ and start a new session"
    exit 0
  fi
  if "$py" -m venv "$venv" >>"$log" 2>&1 && "$venv/bin/python" -m pip install --quiet --disable-pip-version-check -r "$req" >>"$log" 2>&1; then made="$("$py" -c 'import sys; print("python %d.%d.%d" % sys.version_info[:3])')"
  else
    rm -rf "$venv"
    say "installing the build server cloudbackend-build failed (see $log); it is retried at the next session"
    exit 0
  fi
fi
printf '%s\n' "$sum" > "$stamp"
say "installed the build server cloudbackend-build into $venv ($made); it connects from the next session on"
exit 0
