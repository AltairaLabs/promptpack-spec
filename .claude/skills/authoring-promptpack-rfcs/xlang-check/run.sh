#!/usr/bin/env bash
# Cross-language schema check — run before every release or promotion.
#
# Loads the schema in the JSON Schema validators people actually use, in
# several languages, and validates every fixture: valid-* must pass, invalid-*
# must fail. A schema that only one ecosystem can load is a broken release —
# v1.8.0 shipped a lookahead that Go's RE2 rejects, and every pack failed
# validation in PromptKit until v1.8.1.
#
# Usage: run.sh [schema.json] [fixtures-dir]
#   defaults: schema/promptpack.schema.json, ./fixtures
# Build output goes to $XLANG_WORK (default: $TMPDIR/promptpack-xlang), never
# into the repo. A missing toolchain is reported as SKIP; only FAIL exits 1.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
SCHEMA="$(cd "$(dirname "${1:-$REPO/schema/promptpack.schema.json}")" && pwd)/$(basename "${1:-schema/promptpack.schema.json}")"
FIX="$(cd "${2:-$HERE/fixtures}" && pwd)"
WORK="${XLANG_WORK:-${TMPDIR:-/tmp}/promptpack-xlang}"
mkdir -p "$WORK"

fails=0
skips=()
results=()

have() { command -v "$1" >/dev/null 2>&1; }

check() { # check <label> <cmd...>
  local label="$1"; shift
  local log="$WORK/$label.log"
  "$@" >"$log" 2>&1
  local rc=$?
  local pass fail
  pass=$(grep -c '^PASS' "$log")
  fail=$(grep -c 'FAIL' "$log")
  if [ $rc -eq 0 ] && [ "$fail" -eq 0 ]; then
    results+=("PASS  $label ($pass)")
  else
    results+=("FAIL  $label")
    fails=$((fails + 1))
    sed 's/^/      /' "$log" | cut -c1-240
  fi
}

skip() { skips+=("$1: $2"); results+=("SKIP  $1 — $2"); }

# 0. Static pattern lint (also runs in CI).
check pattern-lint node "$REPO/scripts/check-schema-patterns.mjs" "$SCHEMA"

# 1. Python — jsonschema Draft202012Validator (promptpack-python) + PyYAML.
if have uv; then
  check python-jsonschema uv run --quiet --with 'jsonschema==4.26.0' --with 'pyyaml==6.0.2' \
    python -I "$HERE/python/check.py" "$SCHEMA" "$FIX"
else skip python "uv not installed"; fi

# 2. Go — gojsonschema (PromptKit) and santhosh-tekuri/jsonschema v6 (strict 2020-12).
if have go; then
  rm -rf "$WORK/go" && cp -R "$HERE/go" "$WORK/go"
  if go -C "$WORK/go" build -o "$WORK/go/check" . >"$WORK/go-build.log" 2>&1; then
    check go "$WORK/go/check" "$SCHEMA" "$FIX"
  else results+=("FAIL  go (build)"); fails=$((fails + 1)); sed 's/^/      /' "$WORK/go-build.log"; fi
else skip go "go not installed"; fi

# 3. JavaScript — ajv strict + the exact ajv-cli command the docs publish.
if have npm; then
  rm -rf "$WORK/js/check.mjs" && mkdir -p "$WORK/js" && cp "$HERE/js/package.json" "$HERE/js/check.mjs" "$WORK/js/"
  if npm --prefix "$WORK/js" install --silent --no-audit --no-fund >"$WORK/js-install.log" 2>&1; then
    check js-ajv node "$WORK/js/check.mjs" "$SCHEMA" "$FIX"
    # Keep in step with docs/spec/file-format.md and docs/ecosystem/community-tools.md.
    ajvcli() {
      local ok=0 f want got
      for f in "$FIX"/*.json "$FIX"/*.yaml; do
        [ -e "$f" ] || continue
        want=valid; case "$(basename "$f")" in invalid*) want=invalid;; esac
        if "$WORK/js/node_modules/.bin/ajv" validate --spec=draft2020 --strict=false -c ajv-formats \
             -s "$SCHEMA" -d "$f" >/dev/null 2>&1; then got=valid; else got=invalid; fi
        if [ "$got" = "$want" ]; then echo "PASS ajv-cli $(basename "$f")"; else echo "FAIL ajv-cli $(basename "$f")"; ok=1; fi
      done
      return $ok
    }
    check ajv-cli-documented ajvcli
  else results+=("FAIL  js (npm install)"); fails=$((fails + 1)); fi
else skip js "npm not installed"; fi

# 4. Rust — jsonschema crate, fancy-regex and regex (RE2-like) engines.
#    Cargo.lock is pinned to crates that build on rustc 1.83.
if have cargo; then
  mkdir -p "$WORK/rust" && cp -R "$HERE/rust/." "$WORK/rust/"
  if cargo build -q --release --locked --manifest-path "$WORK/rust/Cargo.toml" >"$WORK/rust-build.log" 2>&1; then
    check rust "$WORK/rust/target/release/check" "$SCHEMA" "$FIX"
  else results+=("FAIL  rust (build)"); fails=$((fails + 1)); tail -5 "$WORK/rust-build.log" | sed 's/^/      /'; fi
else skip rust "cargo not installed"; fi

# 5. .NET — JsonSchema.Net, plus the 2020-12 metaschema check.
if have dotnet; then
  mkdir -p "$WORK/dotnet" && cp "$HERE/dotnet/"* "$WORK/dotnet/"
  if dotnet build "$WORK/dotnet" -c Release -v q -nologo >"$WORK/dotnet-build.log" 2>&1; then
    check dotnet dotnet "$WORK/dotnet/bin/Release/net8.0/cs.dll" "$SCHEMA" "$FIX"
  else results+=("FAIL  dotnet (build)"); fails=$((fails + 1)); grep ' error ' "$WORK/dotnet-build.log" | sort -u | sed 's/^/      /'; fi
else skip dotnet "dotnet not installed"; fi

# 6. Ruby — json_schemer, Ruby and ECMA regexp resolvers.
if have ruby && have gem; then
  export GEM_HOME="$WORK/ruby-gems" GEM_PATH="$WORK/ruby-gems"
  gem list -i json_schemer -v 2.5.0 >/dev/null 2>&1 || gem install --no-document -q json_schemer -v 2.5.0 >/dev/null 2>&1
  check ruby ruby "$HERE/ruby/check.rb" "$SCHEMA" "$FIX"
else skip ruby "ruby not installed"; fi

# Java (networknt) is not covered here: add it when a JVM is available.

echo
echo "xlang-check: $SCHEMA"
printf '  %s\n' "${results[@]}"
if [ $fails -gt 0 ]; then echo "xlang-check: $fails FAILED"; exit 1; fi
[ ${#skips[@]} -gt 0 ] && echo "xlang-check: ok, but ${#skips[@]} skipped — say so in the release notes/PR"
[ ${#skips[@]} -eq 0 ] && echo "xlang-check: ok"
exit 0
