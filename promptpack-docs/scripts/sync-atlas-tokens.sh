#!/usr/bin/env bash
# Sync the Atlas design-system token layer into this site.
#
# Atlas ships as @altairalabs/atlas-tokens on GitHub Packages, but that package
# is private and promptpack-spec is public — a dependency would break `npm ci`
# for fork PRs and for anyone outside the org. So the token layer is vendored
# instead. This script re-copies it from a local checkout of atlas-components.
#
# Usage:  ./scripts/sync-atlas-tokens.sh [path-to-atlas-components]
#
# After running, bump the version recorded in src/css/atlas/README.md and
# commit the result.
set -euo pipefail

SRC="${1:-../../atlas-components}"
DST="$(dirname "$0")/../src/css/atlas"

if [ ! -d "$SRC/packages/tokens/src" ]; then
  echo "error: no tokens package at $SRC/packages/tokens" >&2
  echo "pass the path to an atlas-components checkout as \$1" >&2
  exit 1
fi

mkdir -p "$DST/tokens" "$DST/assets/fonts"
cp "$SRC"/packages/tokens/src/*.css "$DST/tokens/"
cp "$SRC"/packages/tokens/assets/fonts/*.woff2 "$DST/assets/fonts/"

echo "synced tokens from $SRC (version $(node -p "require('$SRC/packages/tokens/package.json').version"))"
