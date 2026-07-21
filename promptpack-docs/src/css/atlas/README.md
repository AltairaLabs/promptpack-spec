# Atlas token layer (vendored)

The L0 token layer of **Atlas — the AltairaLabs design system**, copied verbatim
from `@altairalabs/atlas-tokens`.

| | |
|---|---|
| Source | `AltairaLabs/atlas-components`, `packages/tokens` |
| Version | 0.2.0 |
| Upstream package | `@altairalabs/atlas-tokens` (GitHub Packages, private) |

## Why vendored rather than a dependency

`atlas-components` is a private repo and the package is published with
`access: restricted`, but `promptpack-spec` is public. Depending on it would
require a `read:packages` PAT in CI — which fork PRs never receive, so
`docs-build.yml` would fail on every outside RFC contribution, and non-org
contributors could not build the site locally.

The values here ship to every visitor as plain CSS regardless, so vendoring
exposes nothing that devtools would not.

## Layout

```
tokens/          the six-file token layer + index.css barrel
assets/fonts/    self-hosted Space Grotesk + Spline Sans Mono (OFL)
```

`tokens/fonts.css` references `../assets/fonts/*.woff2`, so the two directories
must stay siblings.

## Updating

```bash
./scripts/sync-atlas-tokens.sh ../../atlas-components
```

Then bump the version in the table above. Do not hand-edit these files — changes
belong upstream in `atlas-components`, or they will be silently overwritten on
the next sync.

## Theming

`theme-light.css` scopes on `[data-theme="light"]`; the dark ramp lives in bare
`:root`. Docusaurus stamps that same attribute on `<html>`, so the built-in
`colorMode` toggle drives Atlas directly with no adapter.
