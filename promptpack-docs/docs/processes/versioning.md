---
sidebar_position: 2
---

# Versioning

PromptPack follows semantic versioning (SemVer) to ensure compatibility and provide clear expectations for users and implementers.

## Semantic Versioning

Version numbers follow the format `MAJOR.MINOR.PATCH` where:

- **MAJOR** - Incremented for incompatible API changes
- **MINOR** - Incremented for backwards-compatible functionality additions  
- **PATCH** - Incremented for backwards-compatible bug fixes

### Examples

- `1.0.0` - Initial stable release
- `1.1.0` - Added new optional fields (backwards compatible)
- `1.1.1` - Fixed documentation or clarified behavior (no schema changes)
- `2.0.0` - Removed deprecated fields or changed required fields (breaking change)

## What Constitutes a Breaking Change

### Major Version Changes (Breaking)

- **Removing required fields** from any entity
- **Changing field types** (e.g., string to number)
- **Renaming fields** or entities
- **Removing entity types** (prompts, tools, workflows, etc.)
- **Changing validation rules** that make previously valid files invalid
- **Modifying template syntax** in incompatible ways

### Minor Version Changes (Backwards Compatible)

- **Adding new optional fields** to existing entities
- **Adding new entity types**
- **Adding new validation options** (that don't break existing files)
- **Expanding allowed values** for enumerated fields
- **Adding new features** that don't affect existing functionality

### Patch Version Changes (Backwards Compatible)

- **Documentation updates** and clarifications
- **Example corrections** and improvements
- **Clarifying ambiguous behavior** without changing functionality
- **Fixing typos** in specification text

## Version Support Policy

### Current Version

- **Full support** - Active development and bug fixes
- **Latest features** - All new capabilities available
- **Community support** - Active help and discussion

### Previous Major Version  

- **Maintenance support** - Critical bug fixes only
- **Security updates** - Vulnerabilities addressed
- **No new features** - Feature development focused on current version
- **Duration** - 12 months after new major version release

### Older Versions

- **No official support** - Community support only
- **No updates** - No bug fixes or security patches
- **Deprecation warnings** - Migration guidance provided

## Migration Guide

When breaking changes occur, we provide:

### Automated Migration Tools

- **Schema converters** for common breaking changes
- **Validation tools** to identify compatibility issues
- **Command-line utilities** for bulk file updates

### Documentation

- **Migration guides** with step-by-step instructions
- **Change summaries** highlighting key differences  
- **Code examples** showing before/after patterns
- **FAQ sections** addressing common migration questions

### Community Support

- **Migration assistance** during community office hours
- **Discussion forums** for migration questions
- **Example repositories** showing migration patterns

## Version History

### v1.0.0 (Current)

- Initial specification release
- Core entities: prompts, tools, workflows, personas, fragments
- YAML format with semantic validation
- Template variable system

### Planned Releases

#### v1.1.0 (Planned)

- Enhanced tool authentication options
- Workflow error handling improvements
- Additional validation rules
- Performance optimization guidelines

#### v2.0.0 (Future)

- Potential breaking changes under consideration
- Advanced templating features
- Multi-file PromptPack support
- Binary format options

## Implementation Compatibility

### Runtime Requirements

Runtimes supporting PromptPack should:

1. **Clearly indicate** which specification version they support
2. **Validate compatibility** before processing files
3. **Provide helpful errors** for unsupported features
4. **Document limitations** and extensions

### File Versioning

PromptPack files specify their target version:

```yaml
apiVersion: v1  # Specification version
kind: PromptPack
metadata:
  version: 2.1.0  # PromptPack content version (separate from spec version)
```

### Forward Compatibility

- **Unknown fields** should be ignored (not cause errors)
- **Graceful degradation** when optional features aren't supported
- **Clear error messages** for unsupported required features

### Backwards Compatibility

- **Older runtimes** should reject newer specification versions gracefully
- **Version checks** should happen before processing begins
- **Helpful guidance** should be provided for upgrading

## Deprecation Process

When features need to be removed:

### 1. Deprecation Warning

- **Mark as deprecated** in documentation
- **Add deprecation notices** in validation tools
- **Provide migration path** to new approach
- **Timeline** for removal (minimum 12 months)

### 2. Transition Period  

- **Both old and new** approaches supported
- **Migration tools** available
- **Community education** about upcoming changes
- **Regular reminders** about deprecation timeline

### 3. Removal

- **Breaking change** in next major version
- **Complete removal** of deprecated feature
- **Updated documentation** reflecting changes
- **Migration assistance** for remaining users