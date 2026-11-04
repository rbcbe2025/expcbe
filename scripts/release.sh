#!/usr/bin/env bash
# release.sh — the plugin release, stage by stage. Run by hand, on big, after review; never pushes (there is no remote).
#
#   scripts/release.sh --dry-run            print every stage's commands and hand-offs; run nothing
#   scripts/release.sh [--skip-evals] [--no-portal]
#
# Stages (plan section C):
#   0  clean trees and tool versions          a  build the skills in the hub        b  sync them into the plugin
#   c  bump the version if plugins/ changed   d  clients, README block, marketplace, hub plugin.json
#   e  guard, validate, evals                 f  pack, commit, tag, publish the zip  g  hosted connectors
#   h  portal                                 i  record (RELEASES.md, the hub's _reports/plugin/<date>.json)
# A stage that needs the host (f's copy, g's servers) prints the hand-off instead of failing when this machine
# cannot reach it. Environment: CBE_DOCS_HUB (the hub checkout; default ../estate-docs), RELEASE_EXTRA_REPOS
# (space-separated paths whose trees stage 0 also requires clean), RELEASE_PUBLISH_TARGET (user@host:/dir; stage f
# then scp's the hosted files there), RELEASE_EVAL_MODEL / RELEASE_JUDGE_MODEL (pinned for stage e).
set -euo pipefail
here=$(cd "$(dirname "$0")/.." && pwd)
hub=$(cd "${CBE_DOCS_HUB:-$here/../estate-docs}" 2>/dev/null && pwd || echo "${CBE_DOCS_HUB:-$here/../estate-docs}")
plugin="$here/plugins/cloudbackend"
dry=0 evals=1 portal=1
for a in "$@"; do
  case "$a" in
    --dry-run) dry=1 ;;
    --skip-evals) evals=0 ;;
    --no-portal) portal=0 ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "unknown option: $a" >&2; exit 2 ;;
  esac
done

stage()   { printf '\n[%s] %s\n' "$1" "$2"; }
run()     { printf '    $ %s\n' "$1"; [ "$dry" = 1 ] || bash -c "$1"; }
note()    { printf '    %s\n' "$1"; }
handoff() { printf '    → hand-off: %s\n' "$1"; }
version() { node -e "console.log(JSON.parse(require('fs').readFileSync('$plugin/.claude-plugin/plugin.json','utf8')).version)"; }
today=$(date +%Y-%m-%d)
[ "$dry" = 1 ] && note "DRY RUN: nothing below is executed"

stage 0 "clean trees and tool versions"
for repo in "$here" "$hub" ${RELEASE_EXTRA_REPOS:-}; do
  if [ ! -d "$repo/.git" ]; then note "$repo: not a git checkout"; [ "$dry" = 1 ] || exit 1; continue; fi
  dirty=$(git -C "$repo" status --porcelain | wc -l | tr -d ' ')
  if [ "$dirty" != 0 ]; then note "$repo: $dirty uncommitted change(s)"; [ "$dry" = 1 ] || { echo "abort: commit or archive first" >&2; exit 1; }; else note "$repo: clean"; fi
done
note "node $(node --version 2>/dev/null || echo missing) · claude $(claude --version 2>/dev/null | head -1 || echo missing) · $(python3 --version 2>/dev/null || echo 'python3 missing')"

stage a "build the skills in the hub"
run "python3 '$hub/_tools/build_skills.py'"
if [ "$dry" = 0 ] && [ -n "$(git -C "$hub" status --porcelain -- public/public/skills)" ]; then
  handoff "the rebuilt skills changed: commit them in the hub, then rerun"
  exit 1
fi
[ "$dry" = 1 ] && handoff "if public/public/skills changed, commit in the hub before continuing"

stage b "sync the skills into the plugin"
run "node '$here/scripts/sync-skills.mjs'"
run "node '$here/scripts/sync-skills.mjs' --check"

stage c "the version"
run "node '$here/scripts/bump-version.mjs'"
v=$(version)
note "version $v"

stage d "clients, README blocks, hosted marketplace, the hub's plugin.json"
run "node '$here/scripts/gen-clients.mjs'"

stage e "guard, validate, evals"
run "node '$here/scripts/guard.mjs'"
run "claude plugin validate '$plugin' --strict"
run "claude plugin validate '$here' --strict"
if [ "$evals" = 0 ]; then note "evals skipped (--skip-evals)"
elif ! ls "$plugin"/evals/*/prompt.md >/dev/null 2>&1; then note "no eval cases under evals/ yet: skipped"
else
  run "mkdir -p '$here/evals/results' && claude plugin eval '$plugin' --model '${RELEASE_EVAL_MODEL:-claude-sonnet-5-5}' --judge-model '${RELEASE_JUDGE_MODEL:-claude-sonnet-5-5}' --no-publish --threshold 0.8 --max-cost-usd 15 --json '$plugin/evals/results/$v.json'"
fi

stage f "pack, commit, tag, publish"
run "node '$here/scripts/pack.mjs'"
if [ "$dry" = 1 ] || [ -n "$(git -C "$here" status --porcelain)" ]; then
  run "git -C '$here' add -A && git -C '$here' commit -m 'release $v'"
else note "nothing to commit"; fi
if git -C "$here" rev-parse -q --verify "refs/tags/v$v" >/dev/null 2>&1; then note "tag v$v exists"
else run "git -C '$here' tag 'v$v'"; fi
files="dist/marketplace.json dist/index.json dist/cloudbackend-$v.zip"
if [ -n "${RELEASE_PUBLISH_TARGET:-}" ]; then run "cd '$here' && scp $files '$RELEASE_PUBLISH_TARGET/'"
else handoff "copy $files to the directory served at https://mcp.cloudbackend.com/plugin/ (set RELEASE_PUBLISH_TARGET=user@host:/dir to scp)"; fi
note "after the copy: claude plugin marketplace update cloudbackend && claude plugin update cloudbackend@cloudbackend on a client shows $v"

stage g "hosted connectors"
local_cb=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$hub/cloudbackend/toc.json','utf8')).generated)" 2>/dev/null || echo '?')
local_x=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$hub/xios/toc.json','utf8')).generated)" 2>/dev/null || echo '?')
handoff "release the hosted docs and build servers from the corpora the skills were built from (cloudbackend $local_cb, xios $local_x); their own repositories carry the steps"
if [ "$dry" = 1 ]; then run "node '$here/scripts/check-hosted.mjs'"
elif ! node "$here/scripts/check-hosted.mjs"; then handoff "the hosted check did not pass; rerun scripts/check-hosted.mjs once the host is released"; fi

stage h "portal"
if [ "$portal" = 0 ]; then note "skipped (--no-portal)"
else run "cd '$hub/public' && npm run build:xios && scripts/deploy-big.sh portal"; fi

stage i "record"
skills_gen=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$plugin/SKILLS.json','utf8')).generated)" 2>/dev/null || echo '?')
row="| $v | $today | $skills_gen | cloudbackend $local_cb · xios $local_x | $( [ "$evals" = 0 ] && echo 'evals skipped' || echo 'evals: see evals/results' ) |"
note "RELEASES.md row: $row"
run "printf '%s\n' '$row' >> '$here/RELEASES.md' && git -C '$here' add RELEASES.md && git -C '$here' commit -m 'release $v: record'"
run "mkdir -p '$hub/_reports/plugin' && node -e \"require('fs').writeFileSync('$hub/_reports/plugin/$today.json', JSON.stringify({version:'$v',date:'$today',skills_generated:'$skills_gen',corpora:{cloudbackend:'$local_cb',xios:'$local_x'},evals:$evals,portal:$portal},null,2)+'\\n')\""
handoff "the report in the hub's _reports/plugin/ is committed there by the hub's own workflow"
printf '\nrelease %s: done%s\n' "$v" "$( [ "$dry" = 1 ] && echo ' (dry run)' )"
