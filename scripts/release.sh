#!/usr/bin/env bash
# release.sh — the plugin release, stage by stage. Run by hand, on big, after review. The only push is to the `mirror`
# remote (the private GitHub repository the testers' marketplace reads), and only when that remote exists.
#
#   scripts/release.sh --dry-run            print every stage's commands and hand-offs; run nothing
#   scripts/release.sh [--skip-evals] [--no-portal]
#
# Stages (plan 2026-11-04, Phase 2 parts C and E):
#   0  clean trees and tool versions          a  build the skills in the hub          b  sync the skills and the docs server
#   c  bump the version if plugins/ changed   d  .mcp.json, clients, README blocks, evals, marketplace, hub plugin.json
#   e  guard, build tests, validate, evals    f  pack, commit, tag, publish             g  the servers answer
#   h  portal                                 i  record (RELEASES.md, the hub's _reports/plugin/<date>.json)
# Publishing (f) copies dist/{marketplace.json,index.json,<zip>} into the hub's public/public/plugin/ (older zips stay,
# an installed archive source keeps resolving) and pushes main and the tags to `mirror`; without that remote it prints
# the hand-off. Evals (e) run with pinned models only when plugins/cloudbackend/SKILLS.json or evals/ changed since the
# last tag; --skip-evals skips them regardless. Environment: CBE_DOCS_HUB (the hub checkout; default ../estate-docs),
# RELEASE_EXTRA_REPOS (paths whose trees stage 0 also requires clean), RELEASE_EVAL_MODEL / RELEASE_JUDGE_MODEL
# (stage e; defaults below).
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
    -h|--help) sed -n '2,19p' "$0"; exit 0 ;;
    *) echo "unknown option: $a" >&2; exit 2 ;;
  esac
done

stage()   { printf '\n[%s] %s\n' "$1" "$2"; }
run()     { printf '    $ %s\n' "$1"; [ "$dry" = 1 ] || bash -c "$1"; }
note()    { printf '    %s\n' "$1"; }
handoff() { printf '    → hand-off: %s\n' "$1"; }
jsonf()   { node -e "const o=JSON.parse(require('fs').readFileSync('$1','utf8')); console.log($2)" 2>/dev/null || echo '?'; }
version() { jsonf "$plugin/.claude-plugin/plugin.json" 'o.version'; }
vendored() { sed -n 's/.*Source: \([^.]*commit [0-9a-f]*\).*/\1/p' "$plugin/servers/$1/VENDORED_FROM" 2>/dev/null | head -1; }
today=$(date +%Y-%m-%d)
[ "$dry" = 1 ] && note "DRY RUN: nothing below is executed"

stage 0 "clean trees and tool versions"
for repo in "$here" "$hub" ${RELEASE_EXTRA_REPOS:-}; do
  if [ ! -d "$repo/.git" ]; then note "$repo: not a git checkout"; [ "$dry" = 1 ] || exit 1; continue; fi
  dirty=$(git -C "$repo" status --porcelain | wc -l | tr -d ' ')
  if [ "$dirty" != 0 ]; then note "$repo: $dirty uncommitted change(s)"; [ "$dry" = 1 ] || { echo "abort: commit or archive first" >&2; exit 1; }; else note "$repo: clean"; fi
done
branch=$(git -C "$here" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')
note "branch $branch (testers follow main; a release is cut from main)"
note "node $(node --version 2>/dev/null || echo missing) · claude $(claude --version 2>/dev/null | head -1 || echo missing) (evals need 2.1.269+) · $(python3 --version 2>/dev/null || echo 'python3 missing') (the hub's skills build)"

stage a "build the skills in the hub"
run "python3 '$hub/_tools/build_skills.py'"
if [ "$dry" = 0 ] && [ -n "$(git -C "$hub" status --porcelain -- public/public/skills)" ]; then
  handoff "the rebuilt skills changed: commit them in the hub, then rerun"
  exit 1
fi
[ "$dry" = 1 ] && handoff "if public/public/skills changed, commit in the hub before continuing"

stage b "sync the skills and the documentation server into the plugin"
run "node '$here/scripts/sync-skills.mjs'"
run "node '$here/scripts/sync-skills.mjs' --check"
run "node '$here/scripts/sync-servers.mjs'"
run "node '$here/scripts/sync-servers.mjs' --check"
[ "$dry" = 1 ] && note "a documentation server not staged in the hub yet stops the release here (exit 1)"

stage c "the version"
run "node '$here/scripts/bump-version.mjs'"
v=$(version)
note "version $v"

stage d ".mcp.json, clients, README blocks, evals, the portal's marketplace, the hub's plugin.json"
run "node '$here/scripts/gen-clients.mjs'"
run "node '$here/scripts/gen-evals.mjs'"

stage e "guard, the build server's tests, validate, evals"
run "node '$here/scripts/guard.mjs'"
run "node --test '$plugin/servers/build/test.mjs'"
run "claude plugin validate '$plugin' --strict"
run "claude plugin validate '$here' --strict"
last=$(git -C "$here" tag --list 'v*' | sort -V | tail -1)
if [ "$evals" = 0 ]; then note "evals skipped (--skip-evals)"
elif ! ls "$plugin"/evals/*/prompt.md >/dev/null 2>&1; then note "no eval cases under evals/: skipped"
elif [ -n "$last" ] && git -C "$here" diff --quiet "$last" -- plugins/cloudbackend/SKILLS.json plugins/cloudbackend/evals 2>/dev/null; then note "SKILLS.json and evals/ unchanged since $last: evals skipped"; evals=0
else
  run "mkdir -p '$plugin/evals/results' && claude plugin eval '$plugin' --model '${RELEASE_EVAL_MODEL:-claude-sonnet-5-5}' --judge-model '${RELEASE_JUDGE_MODEL:-claude-sonnet-5-5}' --no-publish --threshold 0.8 --max-cost-usd 15 --json '$plugin/evals/results/$v.json'"
fi

stage f "pack, commit, tag, publish"
run "node '$here/scripts/pack.mjs'"
if [ "$dry" = 1 ] || [ -n "$(git -C "$here" status --porcelain)" ]; then
  run "git -C '$here' add -A && git -C '$here' commit -m 'release $v'"
else note "nothing to commit"; fi
if git -C "$here" rev-parse -q --verify "refs/tags/v$v" >/dev/null 2>&1; then note "tag v$v exists"
else run "git -C '$here' tag 'v$v'"; fi
files="dist/marketplace.json dist/index.json dist/cloudbackend-$v.zip"
run "mkdir -p '$hub/public/public/plugin' && cd '$here' && cp $files '$hub/public/public/plugin/'"
note "the hub's public/public/plugin/ holds $v beside every older zip (never removed: an installed archive source keeps resolving)"
handoff "commit public/public/plugin/ and public/plugin.json in the hub (its own workflow); stage h deploys the portal"
if git -C "$here" remote get-url mirror >/dev/null 2>&1; then
  if [ "$branch" = main ] || [ "$dry" = 1 ]; then run "git -C '$here' push mirror main --tags"
  else handoff "on branch $branch: merge into main first, then git push mirror main --tags (testers follow main)"; fi
else handoff "no mirror remote yet: git remote add mirror <the private GitHub repository>, then git push mirror main --tags"; fi
note "after the push: claude plugin marketplace update cloudbackend && claude plugin update cloudbackend@cloudbackend on a tester's machine shows $v"

stage g "the servers answer"
if [ "$dry" = 1 ]; then run "node '$here/scripts/check-servers.mjs' --deep"
elif ! node "$here/scripts/check-servers.mjs" --deep; then handoff "a server did not answer as promised; fix before the portal deploy"; exit 1; fi

stage h "portal"
if [ "$portal" = 0 ]; then note "skipped (--no-portal)"
else run "cd '$hub/public' && npm run build:xios && scripts/deploy-big.sh portal"; fi

stage i "record"
skills_gen=$(jsonf "$plugin/SKILLS.json" 'o.generated')
docs_src=$(vendored docs); build_src="in the plugin"
row="| $v | $today | $skills_gen | docs: ${docs_src:-?} · build: $build_src | $( [ "$evals" = 0 ] && echo 'evals skipped' || echo 'evals: see evals/results' ) |"
note "RELEASES.md row: $row"
run "printf '%s\n' '$row' >> '$here/RELEASES.md' && git -C '$here' add RELEASES.md && git -C '$here' commit -m 'release $v: record'"
run "mkdir -p '$hub/_reports/plugin' && node -e \"require('fs').writeFileSync('$hub/_reports/plugin/$today.json', JSON.stringify({version:'$v',date:'$today',skills_generated:'$skills_gen',servers:{docs:'${docs_src:-?}',build:'$build_src'},evals:$evals,portal:$portal},null,2)+'\\n')\""
handoff "the report in the hub's _reports/plugin/ is committed there by the hub's own workflow"
printf '\nrelease %s: done%s\n' "$v" "$( [ "$dry" = 1 ] && echo ' (dry run)' )"
