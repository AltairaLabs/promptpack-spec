---
sidebar_position: 0
---

# Specification Versions

The PromptPack specification evolves over time. This page helps you find the right version of the spec for your needs.

## Current Version: v1.1

**Status:** ✅ Current  
**Released:** November 2024  
**Schema:** `https://promptpack.org/schema/v1.1/promptpack.schema.json`

### What's New in v1.1

- **Multimodal Support** - Image, audio, video, and document content
- **Extensible Media Types** - Custom media types (3D models, archives, etc.)
- **GenericMediaTypeConfig** - Flexible validation for custom media

[View v1.1 Spec →](./overview)

---

## Previous Versions

### v1.0

**Status:** 📦 Stable  
**Released:** October 2024  
**Schema:** `https://promptpack.org/schema/v1.0/promptpack.schema.json`

The foundational release of PromptPack.

**Key Features:**
- Core JSON schema structure
- Multi-prompt packaging
- YAML authoring format
- Template variable system
- Tool and fragment sharing
- Testing metadata

[View v1.0 Spec →](./v1.0/overview) | [Migration Guide →](#migration-from-v10-to-v11)

---

## Version Support Policy

| Version | Status | Support Level | End of Life |
|---------|--------|---------------|-------------|
| v1.1    | ✅ Current | Full support | - |
| v1.0    | 📦 Stable | Security fixes only | TBD |

- **Full Support**: New features, bug fixes, and security updates
- **Security Fixes Only**: Critical security patches only
- **End of Life**: No further updates

---

## Migration from v1.0 to v1.1

v1.1 is **fully backward compatible** with v1.0. No breaking changes.

### Upgrade Steps

1. **Update schema version** in your PromptPack:
   ```json
   {
     "$schema": "https://promptpack.org/schema/v1.1/promptpack.schema.json",
     "version": "1.1.0"
   }
   ```

2. **(Optional) Add multimodal support**:
   ```json
   {
     "prompts": {
       "my-prompt": {
         "media": {
           "enabled": true,
           "supported_types": ["image"]
         }
       }
     }
   }
   ```

3. **Test and validate** - v1.0 packs continue to work without changes

### New Features You Can Use

- Add `media` field to prompts for multimodal content
- Use `image`, `audio`, `video`, `document` media types
- Define custom media types with `GenericMediaTypeConfig`

See [RFC-0004: Multimodal Support](/docs/rfcs/multimodal-support) for details.

---

## Choosing a Version

### Use v1.1 if:
- ✅ Building new PromptPacks
- ✅ Need multimodal support (images, audio, video)
- ✅ Want latest features

### Stay on v1.0 if:
- ✅ Existing packs work fine
- ✅ Don't need multimodal features yet
- ✅ Prefer maximum stability

**Recommendation:** Use v1.1 for all new projects. It's backward compatible and adds valuable capabilities.

---

## Version History

| Version | Release Date | Highlights |
|---------|--------------|------------|
| v1.1    | Nov 2024    | Multimodal support, extensible media types |
| v1.0    | Oct 2024    | Initial release: core schema, YAML format, templates |

See [Changelog](https://github.com/altairalabs/promptpack-spec/blob/main/CHANGELOG.md) for complete version history.
