---
sidebar_position: 4
---

# File Format

Complete specification of the PromptPack YAML file format and structure.

## File Structure

PromptPack files use YAML format with a standardized structure:

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: example-pack
  version: 1.0.0
  description: Example PromptPack file
spec:
  prompts: []
  tools: []
  workflows: []
  personas: []
```

## Required Fields

Every PromptPack file must include:

### Root Level

- **`apiVersion`**: Must be `"v1"` for current specification
- **`kind`**: Must be `"PromptPack"` 
- **`metadata`**: File identification and versioning
- **`spec`**: Main content specification

### Metadata

- **`name`**: Unique identifier (lowercase, hyphens only)
- **`version`**: Semantic version (MAJOR.MINOR.PATCH)

## YAML Conventions

### Naming

- Use `kebab-case` for file names and identifiers
- Use `snake_case` for field names
- Use descriptive names that indicate purpose

### Structure

- Maintain consistent indentation (2 spaces)
- Use meaningful ordering of fields
- Group related concepts together
- Add comments for complex logic

### Examples

**Good naming:**
```yaml
metadata:
  name: customer-support-bot
  version: 2.1.0

spec:
  prompts:
    - name: greeting-prompt
      template: "Hello {{customer_name}}, how can I help you today?"
```

**Avoid:**
```yaml
metadata:
  name: CustomerSupportBot  # Use kebab-case
  version: 2.1            # Use full semantic version

spec:
  prompts:
    - name: prompt1         # Use descriptive names
      template: "Hi"        # Template too generic
```

## File Extensions

- **Recommended**: `.promptpack.yaml` or `.promptpack.yml`
- **Alternative**: `.yaml` or `.yml` (less descriptive)

## Encoding

- **Character Encoding**: UTF-8
- **Line Endings**: LF (Unix-style) recommended
- **BOM**: Not required, avoid if possible

## Comments and Documentation

YAML comments are supported and encouraged:

```yaml
# Customer support conversational system
apiVersion: v1
kind: PromptPack
metadata:
  name: support-system
  version: 1.0.0
  # Updated monthly based on customer feedback
  description: Automated customer support workflows

spec:
  # Primary conversation starters
  prompts:
    - name: greeting
      # Personalized greeting based on customer tier
      template: "Welcome {{customer_name}}"
```

## Validation

### Schema Validation

PromptPack files should validate against the JSON Schema:

```bash
# Using a schema validator
ajv validate -s promptpack-schema.json -d my-pack.yaml
```

### Linting Rules

Recommended YAML linting:

- Maximum line length: 120 characters
- No trailing whitespace
- Consistent indentation
- No duplicate keys
- Quote strings with special characters

## Multi-File Packages

Large PromptPacks can be split across multiple files:

### Directory Structure
```
my-promptpack/
├── promptpack.yaml      # Main file
├── prompts/
│   ├── greeting.yaml
│   └── support.yaml
└── tools/
    └── knowledge-base.yaml
```

### File References
```yaml
# promptpack.yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: large-system
spec:
  prompts:
    - $ref: "./prompts/greeting.yaml"
    - $ref: "./prompts/support.yaml"
  tools:
    - $ref: "./tools/knowledge-base.yaml"
```

## Best Practices

### Organization

1. **Group Related Items**: Keep similar prompts/tools together
2. **Logical Ordering**: Order by importance or usage frequency  
3. **Clear Hierarchy**: Use consistent nesting levels
4. **Readable Layout**: Add whitespace between major sections

### Maintenance

1. **Version Control**: Use semantic versioning consistently
2. **Change Documentation**: Comment significant changes
3. **Backward Compatibility**: Avoid breaking changes when possible
4. **Testing**: Validate files after modifications

### Performance

1. **File Size**: Keep individual files under 1MB when possible
2. **Complexity**: Avoid deeply nested structures
3. **References**: Use file splitting for large packages
4. **Caching**: Structure for efficient runtime loading

## Migration Guide

### From Other Formats

Converting from other prompt management systems:

**From JSON:**
```bash
# Convert JSON to YAML
yq eval -P 'promptpack.json' > promptpack.yaml
```

**From Plain Text:**
1. Create metadata section
2. Wrap prompts in template structure
3. Define variables and examples
4. Add validation rules

### Version Upgrades

When upgrading PromptPack versions:

1. **Check Compatibility**: Review breaking changes
2. **Update apiVersion**: Increment to new version
3. **Migrate Fields**: Update deprecated field names
4. **Validate**: Test with new schema
5. **Update Documentation**: Reflect version changes

---

## Related

- [Schema Reference](/docs/spec/schema-reference) - Field-by-field documentation
- [Examples](/docs/spec/examples) - Complete file examples  
- [Getting Started](/docs/getting-started) - Basic usage guide