---
sidebar_position: 4
---

# File Format & Portability

PromptPacks use JSON as their file format, optimized for both human readability and machine processing. This choice isn't arbitrary—JSON provides specific benefits that make PromptPacks practical for real-world AI development and deployment.

## Why JSON?

### Universal Compatibility

JSON works everywhere:

- **Every programming language** has robust JSON support
- **All cloud platforms** can process JSON natively
- **CI/CD pipelines** can parse and validate JSON files
- **APIs and databases** accept JSON without conversion
- **Developer tools** provide excellent JSON editing support

### Machine and Human Friendly

PromptPacks need to be both **executable by systems** and **readable by developers**. JSON strikes this balance perfectly:

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  "prompts": {
    "support": {
      "system_template": "You are a helpful {{role}} for {{company}}.",
      "variables": [
        {
          "name": "role",
          "type": "string", 
          "required": true,
          "description": "The assistant's role"
        }
      ]
    }
  }
}
```

**Human benefits**: Clean structure, clear hierarchy, easy to read and edit
**Machine benefits**: Fast parsing, strong validation, efficient processing

### Validation and Tooling

JSON's mature ecosystem provides powerful tooling:

- **Schema Validation**: Catch errors before deployment using JSON Schema
- **IDE Support**: Syntax highlighting, auto-completion, real-time validation
- **Command-line Tools**: `jq`, validation utilities, formatters
- **Version Control**: Clean diffs, merge conflict resolution

## File Structure Benefits

### Single-File Deployment

Everything your AI system needs is in one file:

```json
{
  "prompts": { "support": {...}, "sales": {...} },
  "tools": { "lookup_order": {...}, "create_ticket": {...} },
  "fragments": { "greeting": "...", "policies": "..." },
  "template_engine": { "version": "v1", "syntax": "{{var}}" }
}
```

**Deployment advantage**: Copy one file, deploy complete AI system. No missing dependencies, no broken references, no configuration drift.

### Version Control Friendly

JSON diffs clearly show what changed:

```diff
 {
   "prompts": {
     "support": {
-      "system_template": "You are a support agent.",
+      "system_template": "You are a friendly support agent.",
       "parameters": {
-        "temperature": 0.7
+        "temperature": 0.8
       }
     }
   }
 }
```

**Development benefits**: Clear change history, easy code reviews, confident rollbacks

## Practical Format Guidelines

### File Naming

Use descriptive names that indicate purpose and version:

```text
customer-support-v1.pack.json      # Recommended
support-pack-2025-10-31.json       # Date-based versioning
cs-pack.json                       # Too generic
mypack.json                        # Not descriptive
```

### Internal Organization

Structure your JSON for maintainability:

```json
{
  // Identity first - what this pack does
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  "description": "Complete customer service solution",
  
  // Shared configuration
  "template_engine": { ... },
  
  // Core content - prompts grouped logically
  "prompts": {
    "support": { ... },    // General support
    "technical": { ... },  // Technical issues  
    "billing": { ... }     // Payment problems
  },
  
  // Supporting resources
  "tools": { ... },
  "fragments": { ... }
}
```

### Readability Practices

**Use consistent formatting**:

- 2-space indentation for readability
- Logical ordering of fields
- Descriptive property names
- Clear variable naming

**Add context through structure**:

```json
{
  "prompts": {
    "support": {
      "name": "General Support Assistant",
      "description": "Handles general customer inquiries and directs to specialists",
      "system_template": "..."
    }
  }
}
```

## Validation and Quality Assurance

### Schema Validation

PromptPacks validate against JSON Schema, catching errors early:

```bash
# Validate before deployment
ajv validate -s promptpack.schema.json -d my-pack.json

# Validate in CI/CD pipeline
npm test -- --validate-packs
```

**Catches**:

- Missing required fields
- Invalid data types
- Incorrect version formats
- Malformed tool definitions
- Variable validation errors

### Development Workflow

```bash
# 1. Edit pack file
vim customer-support.pack.json

# 2. Validate structure
promptpack validate customer-support.pack.json

# 3. Test functionality  
promptpack test customer-support.pack.json

# 4. Deploy
promptpack deploy customer-support.pack.json
```

## Portability Benefits

### Cross-Platform Deployment

The same pack file works across:

```json
{
  "compilation": {
    "compiled_with": "packc-v1.0.0",
    "created_at": "2025-10-31T12:00:00Z",
    "schema": "v1"
  }
}
```

- **Local development** (laptop, Docker)
- **Cloud platforms** (AWS Lambda, Azure Functions, GCP Cloud Run)
- **Edge devices** (if supported by runtime)
- **Different AI providers** (OpenAI, Anthropic, local models)

### Environment Configuration

Packs adapt to different environments through variable substitution:

```json
{
  "prompts": {
    "support": {
      "system_template": "You work for {{company_name}} in {{environment}}.",
      "variables": [
        {
          "name": "company_name",
          "type": "string",
          "required": true
        },
        {
          "name": "environment", 
          "type": "string",
          "default": "production"
        }
      ]
    }
  }
}
```

**Runtime flexibility**: Same pack, different configurations per environment.

## Integration Patterns

### API Integration

PromptPacks work naturally with REST APIs:

```javascript
// Load and execute pack
const pack = await fetch('/api/packs/customer-support')
const prompt = pack.prompts.support
const response = await ai.complete(prompt, variables)
```

### Database Storage

Store packs in databases for dynamic loading:

```sql
CREATE TABLE promptpacks (
  id VARCHAR PRIMARY KEY,
  version VARCHAR,
  pack_data JSONB,  -- Full pack as JSON
  created_at TIMESTAMP
);
```

### Configuration Management

Integrate with configuration systems:

```yaml
# Kubernetes ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-packs
data:
  customer-support.json: |
    {
      "id": "customer-support",
      "version": "1.0.0",
      ...
    }
```

## Performance Considerations

### File Size Optimization

- **Minimize whitespace** in production files
- **Use fragments** to avoid duplication
- **Split large packs** if they exceed reasonable size (~1MB)

### Loading Efficiency

- **Cache parsed packs** in memory
- **Validate once** at load time, not per request
- **Pre-compile templates** if your runtime supports it

### Network Transfer

```json
{
  "metadata": {
    "compression": "gzip",
    "content_type": "application/json",
    "size_kb": 245
  }
}
```

Packs compress well due to JSON's structured nature and repeated patterns.

## Migration and Compatibility

### From Other Formats

Converting existing prompt systems:

```bash
# From YAML
yq eval -o=json promptpack.yaml > promptpack.json

# From CSV/spreadsheets  
python convert_prompts.py --input prompts.csv --output pack.json

# From plain text files
promptpack import --directory ./prompts/ --output pack.json
```

### Version Evolution

JSON structure supports backward-compatible evolution:

```json
{
  "version": "2.0.0",
  "compatibility": {
    "min_runtime": "1.5.0",
    "deprecated_fields": ["old_field"],
    "migration_notes": "Use new_field instead of old_field"
  }
}
```

The JSON format makes PromptPacks a practical, production-ready solution for packaging and deploying conversational AI systems at scale.
