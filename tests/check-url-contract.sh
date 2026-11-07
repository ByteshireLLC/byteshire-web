#!/usr/bin/env bash
# Fails if the built site is missing any path in tests/url-contract.txt.
# Usage: tests/check-url-contract.sh <built-site-dir>
set -euo pipefail

fail() { echo "FATAL: $*" >&2; exit 1; }

site="${1:-dist}"
contract="$(dirname "$0")/url-contract.txt"
[[ -d "$site" ]] || fail "no built site at '$site' — run the build first"
[[ -f "$contract" ]] || fail "no contract at '$contract'"

missing=0
checked=0
while read -r path kind; do
  [[ -z "$path" || "$path" == \#* ]] && continue
  checked=$((checked + 1))
  case "$kind" in
    page|redirect) target="$site${path}index.html" ;;
    file)          target="$site${path}" ;;
    *)             fail "unknown kind '$kind' for $path in $contract" ;;
  esac
  if [[ ! -s "$target" ]]; then
    echo "✗ missing $kind: $path (expected $target)" >&2
    missing=$((missing + 1))
  elif [[ "$kind" == "redirect" ]] && ! grep -q 'http-equiv="refresh"' "$target"; then
    echo "✗ $path is not a redirect page" >&2
    missing=$((missing + 1))
  fi
done < "$contract"

if (( missing > 0 )); then
  fail "$missing of $checked contract paths are missing or wrong in $site"
fi
echo "✓ all $checked contract paths present in $site"
