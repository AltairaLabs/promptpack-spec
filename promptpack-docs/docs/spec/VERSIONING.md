# Specification Versioning

## Overview

PromptPack uses a **manual versioning approach** for specification documentation. This gives us fine-grained control—only the `/docs/spec/` folder is versioned, while processes, RFCs, and ecosystem docs remain current.

## Directory Structure

```
docs/
├── spec/
│   ├── versions.md          # Version index and migration guide
│   ├── overview.md          # v1.1 (current) 
│   ├── examples.md
│   ├── file-format.md
│   ├── schema-reference.md
│   ├── schema-guide.md
│   ├── structure.md
│   │
│   └── v1.0/                # Archived v1.0 docs
│       ├── overview.md
│       ├── examples.md
│       ├── file-format.md
│       ├── schema-reference.md
│       ├── schema-guide.md
│       └── structure.md
│
├── processes/               # Always current (not versioned)
├── rfcs/                    # Always current (auto-generated)
└── ecosystem/               # Always current (not versioned)
```

## Creating a New Specification Version

When releasing a new major/minor version (e.g., v1.2):

### 1. Archive Current Version

```bash
# From promptpack-docs directory
mkdir -p docs/spec/v1.1
cp docs/spec/*.md docs/spec/v1.1/

# Add version badge to archived docs
# (See v1.0/overview.md for example)
```

### 2. Update Version Index

Edit `docs/spec/versions.md`:
- Move current version to "Previous Versions"
- Add new version as "Current Version"
- Update migration guide

### 3. Update Sidebars

Edit `sidebars.ts` to add collapsed section for archived version:

```typescript
{
  type: 'category',
  label: 'v1.1 (Archived)',
  collapsed: true,
  items: [
    'spec/v1.1/overview',
    'spec/v1.1/examples',
    // ... other v1.1 docs
  ],
}
```

### 4. Update Main Spec Docs

Edit current docs in `docs/spec/` with v1.2 content:
- Update version badge
- Add "What's New" info box
- Update schema URLs
- Document new features

### 5. Test Locally

```bash
npm start
# Verify:
# - Version switcher works
# - Archived docs are accessible
# - Links work correctly
```

## Version Badge Examples

### Current Version (v1.1)

```markdown
<div style={{
  padding: '8px 16px',
  backgroundColor: '#10b981',
  color: 'white',
  borderRadius: '6px',
  display: 'inline-block',
  marginBottom: '24px',
  fontWeight: 'bold'
}}>
  📘 v1.1 (Current)
</div>

:::info Version Information
This documentation covers **v1.1** of the PromptPack specification.
Looking for the previous version? [View v1.0 docs →](./v1.0/overview)
:::
```

### Archived Version (v1.0)

```markdown
<div style={{
  padding: '8px 16px',
  backgroundColor: '#6b7280',
  color: 'white',
  borderRadius: '6px',
  display: 'inline-block',
  marginBottom: '24px',
  fontWeight: 'bold'
}}>
  📦 v1.0 (Stable)
</div>

:::warning Archived Version
This is the **v1.0** documentation. For the latest features, see [v1.1 docs →](../overview)
:::
```

## Why Manual Versioning?

### Advantages

✅ **Selective Versioning** - Only spec is versioned, not entire docs
✅ **Simple Structure** - Easy to understand and maintain  
✅ **Git History** - All versions in same repo
✅ **No Build Complexity** - No special Docusaurus configuration needed
✅ **Flexible** - Can version individual pages if needed

### Tradeoffs

⚠️ **Manual Process** - Requires copying files manually
⚠️ **No Built-in Switcher** - Must implement version navigation manually

## Version Support Policy

- **Current Version** - Full support (features, bugs, security)
- **Previous Version** - Security fixes only
- **Older Versions** - Archived, no updates

## Best Practices

1. **Always keep versions.md up to date** - It's the canonical source of truth
2. **Test all links** - Especially between versions
3. **Add migration guides** - Help users upgrade between versions
4. **Clear visual indicators** - Version badges on every archived page
5. **Preserve historical accuracy** - Don't backport features to old docs

## Alternative: Docusaurus Versioning

If you want automatic version management in the future:

```bash
# Creates versioned snapshot of ALL docs
npm run docusaurus docs:version 1.1

# Structure becomes:
# docs/              (next/current)
# versioned_docs/
#   version-1.1/
#   version-1.0/
```

See: https://docusaurus.io/docs/versioning

**Current decision:** Manual versioning for more control over what gets versioned.
