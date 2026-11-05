#!/usr/bin/env bash
# run-evals.sh <label> [claude plugin eval options...] — one eval run of this plugin with the suite's standing flags, on a
# machine whose Claude Code runs `plugin eval` (2.1.269 or later; big: `ssh big <this repo>/scripts/run-evals.sh ...`).
# Writes plugins/cloudbackend/evals/results/<label>.json and <label>.log. The standing flags:
#   - the tenant and deploy servers answer from their stand-ins in evals/mocks/ (an account change, a sign-in, a deploy
#     never reach CloudBackend);
#   - the docs and build servers are the plugin's real ones (--allow-real-servers starts servers without a stand-in, as
#     you, outside the sandbox; both are this repository's own read-only code: the docs server reads the public portal,
#     the build server reads the files it is given), their tools granted by name;
#   - Write, Edit and Bash are granted, so a case can show the files and commands its skill asks for;
#   - --scaffold: a case with a fixture (evals/fixtures/ here, copied by gen-evals.mjs) gets those files in its working
#     directory first; the scaffolds are this repository's own generated `cp` lines;
#   - pinned models; --threshold 0 (the scores are information, not a gate, until a baseline of runs exists).
# Pass --runs, --ablation, --case, --max-cost-usd, -j as needed.
set -euo pipefail
export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"
here=$(cd "$(dirname "$0")/.." && pwd)
label=${1:?usage: run-evals.sh <label> [options]}; shift
out="$here/plugins/cloudbackend/evals/results"
mkdir -p "$out"
set +e
claude plugin eval "$here/plugins/cloudbackend" --trust-plugin --scaffold \
  --model "${EVAL_MODEL:-claude-sonnet-5-5}" --judge-model "${EVAL_JUDGE_MODEL:-claude-haiku-5-5}" \
  --allow-real-servers --allow-tools Write Edit Bash 'mcp__plugin_cloudbackend_cloudbackend-docs__*' 'mcp__plugin_cloudbackend_cloudbackend-build__*' \
  --no-publish --threshold 0 --json "$out/$label.json" "$@" > "$out/$label.log" 2>&1
code=$?
echo "exit $code" >> "$out/$label.log"
exit $code
