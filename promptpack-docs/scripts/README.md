# Documentation Build Scripts

## Overview

This directory contains scripts for automating the Docusaurus documentation build process.

## Scripts

### `sync-rfcs.js`

**Purpose:** Automatically sync RFC documents from `/rfcs/` to `/promptpack-docs/docs/rfcs/` with proper Docusaurus frontmatter.

**Why:** Maintains a single source of truth for RFCs in the root `/rfcs/` directory while making them available in the documentation site with proper metadata.

**Usage:**

```bash
# Run manually
npm run sync-rfcs

# Runs automatically before:
npm start   # (via prestart hook)
npm build   # (via prebuild hook)
```

**What it does:**

1. Reads RFC files from `/rfcs/` directory
2. Adds Docusaurus frontmatter (sidebar position, title, description)
3. Writes processed files to `/promptpack-docs/docs/rfcs/`
4. Skips template files (`0000-template.md`)

**Adding a new RFC:**

1. Create your RFC in `/rfcs/0005-your-rfc.md`
2. Add metadata to `RFC_METADATA` in `sync-rfcs.js`:
   ```javascript
   '0005-your-rfc.md': {
     position: 5,
     title: 'RFC-0005: Your RFC Title',
     description: 'Brief description of your RFC',
   },
   ```
3. Run `npm run sync-rfcs` or restart the dev server
4. Update `/promptpack-docs/sidebars.ts` to add `'rfcs/your-rfc'` to the RFCs category

**Output:** Generated files in `/promptpack-docs/docs/rfcs/*.md` are gitignored and regenerated on each build.

## Workflow

### Local Development

```bash
cd promptpack-docs
npm start  # Syncs RFCs, then starts dev server
```

### Production Build

```bash
cd promptpack-docs
npm build  # Syncs RFCs, then builds static site
```

### GitHub Actions / CI/CD

The sync happens automatically before build:

```yaml
- name: Build documentation
  run: |
    cd promptpack-docs
    npm ci
    npm run build  # sync-rfcs runs via prebuild hook
```

## File Structure

```
promptpack-spec/
├── rfcs/                          # Source of truth
│   ├── 0001-core-schema.md       # Original RFC
│   ├── 0002-yaml-format.md
│   └── ...
│
├── promptpack-docs/
│   ├── docs/
│   │   └── rfcs/                  # Generated (gitignored)
│   │       ├── 0001-core-schema.md  # RFC + frontmatter
│   │       └── ...
│   │
│   └── scripts/
│       ├── README.md              # This file
│       └── sync-rfcs.js           # Sync script
```

## Benefits

✅ **Single Source of Truth** - RFCs maintained in root `/rfcs/` directory
✅ **Automatic Sync** - No manual copying required
✅ **Clean Git History** - Generated files are gitignored
✅ **CI/CD Ready** - Works seamlessly in automated builds
✅ **Easy to Update** - Edit RFCs in `/rfcs/`, rebuild docs automatically
