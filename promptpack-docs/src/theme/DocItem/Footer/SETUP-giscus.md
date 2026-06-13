# giscus setup (one-time, maintainer)

RFC pages on the docs site render a [giscus](https://giscus.app) comment box,
backed by GitHub Discussions. The widget is wired up in
`src/theme/DocItem/Footer/index.tsx` and configured via `customFields.giscus`
in `docusaurus.config.ts`. It **no-ops until the two IDs below are filled in**,
so the site builds and deploys safely before setup is complete.

## Steps

1. **Install the giscus GitHub App** on the `altairalabs/promptpack-spec` repo:
   https://github.com/apps/giscus (grant it access to this repo only).
   The repo must be public and have Discussions enabled (it does).

2. **Create a Discussions category** named **`RFC Comments`**
   (repo → Settings → Discussions, or the Discussions tab → "New category").
   A free-form "Open" format is fine; giscus creates one discussion per RFC page
   on first comment.

3. **Generate the IDs** at https://giscus.app:
   - Repository: `altairalabs/promptpack-spec`
   - Page ↔ Discussions mapping: **pathname**
   - Category: **RFC Comments**
   - Copy the emitted `data-repo-id` and `data-category-id`.

4. **Fill them into `docusaurus.config.ts`** → `customFields.giscus`:
   ```ts
   repoId: 'R_xxxx…',
   categoryId: 'DIC_xxxx…',
   ```

5. Commit. The comment box now appears at the bottom of every RFC page.

## Scope / behaviour

- Renders only on individual RFC pages (`/docs/rfcs/<slug>`), not the index.
- One GitHub Discussion per RFC page (`mapping: pathname`).
- Light/dark theme follows the site's color mode.
- Loaded client-side and lazily; zero npm dependency (script embed).

## Changing scope

To show comments on other docs, widen the `isRfcPage` test in
`src/theme/DocItem/Footer/index.tsx`. To turn comments off entirely, blank the
`repoId`/`categoryId` in `customFields.giscus` (the footer falls back to the
stock footer).
