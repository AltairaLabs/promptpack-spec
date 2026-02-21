# Skill: Bump PromptPack Spec Version

A repeatable checklist for adding a new extension to the PromptPack specification and releasing a new spec version. This was extracted from the v1.3.0 → v1.3.1 (Skills Extension) release.

## Prerequisites

- A design document or proposal describing the new extension
- Familiarity with JSON Schema 2020-12 (`$defs`, `oneOf`, `additionalProperties`)
- The repo cloned with `promptpack-docs` ready to build (`npm install` in `promptpack-docs/`)

## Inputs

Before starting, identify:

| Input | Example (v1.3.1) |
|-------|-------------------|
| `OLD_VERSION` | `1.3.0` |
| `NEW_VERSION` | `1.3.1` |
| `OLD_VTAG` | `v1.3` |
| `NEW_VTAG` | `v1.3.1` |
| `RFC_NUMBER` | `0008` |
| `RFC_SLUG` | `skills-extension` |
| `RFC_TITLE` | `Skills Extension` |
| `FEATURE_SUMMARY` | Progressive-disclosure knowledge loading |

## Steps

### Step 1: Create the RFC

**File:** `promptpack-docs/docs/rfcs/{RFC_NUMBER}-{RFC_SLUG}.md`

- Copy the most recent RFC as a template (e.g., `0007-agents-extension.md`)
- Set `sidebar_position` to the next sequential number
- Set `slug: {RFC_SLUG}`
- Status: **Implemented** (if shipping immediately)
- Required sections: Summary, Motivation, Detailed Design (with schema JSON), Examples, Drawbacks, Alternatives, Adoption Strategy
- Include concrete JSON snippets showing the schema additions

### Step 2: Update the JSON Schema

**File:** `schema/promptpack.schema.json`

1. Bump `"version"` from `OLD_VERSION` to `NEW_VERSION`
2. Update root `"description"` to mention the new feature
3. Add new properties to the root object or existing definitions as needed
4. Add new `$defs` for any new types
5. Do NOT add new properties to `"required"` arrays (backward compatibility)
6. Validate the schema is correct JSON: `cat schema/promptpack.schema.json | python3 -m json.tool > /dev/null`

### Step 3: Archive current spec docs

**Target:** `promptpack-docs/docs/spec/{OLD_VTAG}/`

Copy these files from `docs/spec/` into the archive directory:
- `overview.md`
- `structure.md`
- `architecture-patterns.md`
- `examples.md`
- `file-format.md`
- `schema-reference.md`
- `schema-guide.md`

For **each** archived file, apply three changes:

1. **Frontmatter** — add `title: "... ({OLD_VTAG})"` (preserves sidebar_position)
2. **Version badge** — change color from `#10b981` (green/current) to `#6b7280` (gray/stable), text from `📘 {OLD_VTAG} (Current)` to `📦 {OLD_VTAG} (Stable)`
3. **Add archived warning** — right after the badge div:
   ```mdx
   :::warning Archived Version
   This is the **{OLD_VTAG}** documentation. For the latest features, see [{NEW_VTAG} docs →](../overview)
   :::
   ```
4. **Remove** the `:::info Version Information` block (if present — that's a current-version element)

### Step 4: Update current spec docs to new version

Update each file in `docs/spec/`:

#### `overview.md`
- Badge text: `📘 {NEW_VTAG} (Current)`
- Info box: mention new feature, link to archived version
- Add new feature to the solution JSON snippet
- Add a new "Core Benefits" subsection describing the feature

#### `structure.md`
- Add a new section describing the feature's place in pack structure
- Include a JSON example showing the new fields

#### `architecture-patterns.md`
- Update ASCII layer diagram if the feature adds a new layer
- Add a feature integration section (comparison table if useful, e.g., "Skills vs Fragments")
- Update Feature Compatibility Matrix
- Add link to new guide in Next Steps

#### `examples.md`
- Add a complete JSON example pack using the new feature
- Add a bullet to "Why These Examples Matter"

#### `schema-guide.md`
- Add rows to relevant property tables (Root Properties, WorkflowState, etc.)
- Add a full feature section with sub-tables for each new type, JSON example, and info admonition
- Place it in logical order among existing sections

#### `schema-reference.md`
- **Skip** — this file is auto-generated from the schema. Regenerate via CI or the schema-to-docs tool.

### Step 5: Update `docs/spec/versions.md`

- Change "Current Version" heading to `{NEW_VTAG}` with feature list
- Move old version to "Previous Versions" with link to `./v{OLD_VTAG}/overview`
- Add `{NEW_VTAG}` row to "Version Support Policy" table
- Add "Migration from {OLD_VTAG} to {NEW_VTAG}" section with upgrade steps and code examples
- Update "Choosing a Version" advice for new vs old
- Add row to "Version History" table

### Step 6: Update `sidebars.ts`

- Add a new collapsed category for the archived version:
  ```typescript
  {
    type: 'category',
    label: '{OLD_VTAG} (Archived)',
    collapsed: true,
    items: [
      'spec/{OLD_VTAG}/overview',
      'spec/{OLD_VTAG}/structure',
      'spec/{OLD_VTAG}/architecture-patterns',
      'spec/{OLD_VTAG}/examples',
      'spec/{OLD_VTAG}/file-format',
      'spec/{OLD_VTAG}/schema-reference',
      'spec/{OLD_VTAG}/schema-guide',
    ],
  },
  ```
- If creating a new guide, add it to the Guides category

### Step 7: Update `README.md`

- Badge: `OLD_VTAG` → `NEW_VTAG`
- Schema URL: `OLD_VTAG` → `NEW_VTAG`
- Add feature bullet to "What's in a pack" list
- Add feature bullet to "Key Features" list
- Add a feature section with code examples (between existing feature sections)
- Update ecosystem table version references

### Step 8: Sync static schema files

**Option A (script):**
```bash
cd promptpack-docs && node scripts/sync-schema.js
```
This copies `schema/promptpack.schema.json` to:
- `static/schema/v{NEW_VERSION}/promptpack.schema.json`
- `static/schema/latest/promptpack.schema.json`

**Option B (manual):**
```bash
mkdir -p promptpack-docs/static/schema/{NEW_VTAG}
cp schema/promptpack.schema.json promptpack-docs/static/schema/{NEW_VTAG}/
cp schema/promptpack.schema.json promptpack-docs/static/schema/latest/
```

### Step 9: Update RFC index

**File:** `promptpack-docs/docs/processes/rfc-index.md`

- Add row to RFC table (between `<!-- RFC_TABLE_START -->` and `<!-- RFC_TABLE_END -->`):
  ```markdown
  | [RFC-{RFC_NUMBER}](/docs/rfcs/{RFC_SLUG}) | 🚀 Implemented | {RFC_TITLE} |
  ```
- Update statistics: increment "Total RFCs" and "Implemented" counts

### Step 10: Create how-to guide (if applicable)

**File:** `promptpack-docs/docs/guides/{guide-name}.md`

- Follow the pattern of existing guides (`add-workflow.md`, `setup-agents.md`, `add-evals.md`)
- Typical structure: intro, prerequisites, numbered steps, before/after example, validation checklist, common mistakes
- Add to `sidebars.ts` Guides category

## Verification

```bash
cd promptpack-docs

# 1. Validate schema JSON is well-formed
cat ../schema/promptpack.schema.json | python3 -m json.tool > /dev/null

# 2. Build the docs site (catches broken links, MDX errors)
npm run build

# 3. Spot-check locally
npm run serve
# Visit: /docs/spec/overview (current version badge)
# Visit: /docs/spec/{OLD_VTAG}/overview (archived badge + warning)
# Visit: /docs/spec/versions (migration guide)
# Visit: /docs/rfcs/{RFC_SLUG} (new RFC)
# Visit: /docs/guides/{guide} (new guide)
```

## Notes

- `schema-reference.md` uses auto-generated `<a name="...">` anchors. Docusaurus's broken-anchor checker doesn't recognize these, so `onBrokenAnchors` is set to `'warn'` in `docusaurus.config.ts`. This is expected.
- The `schema-reference.md` file should be regenerated from the schema after schema changes. Copy the regenerated version to both `docs/spec/schema-reference.md` and `docs/spec/{OLD_VTAG}/schema-reference.md`.
- All new properties must be optional (not in `required` arrays) to maintain backward compatibility within a major version.
- The version badge colors are: `#10b981` (green) for current, `#6b7280` (gray) for archived stable.
