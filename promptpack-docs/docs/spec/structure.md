---
sidebar_position: 2
---

# Structure Reference

This page provides detailed information about the structure and fields of PromptPack files.

## File Format

PromptPack files use YAML syntax and should have the extension `.promptpack.yml` or `.promptpack.yaml`.

## Required Fields

### Metadata Section

```yaml
apiVersion: v1                    # Required: API version
kind: PromptPack                  # Required: Resource type  
metadata:
  name: string                    # Required: Unique identifier
  version: string                 # Required: Semantic version (e.g., "1.2.3")
  description: string             # Optional: Human-readable description
  authors: [string]              # Optional: List of author names
  license: string                # Optional: License identifier
  tags: [string]                 # Optional: Classification tags
  created: string                # Optional: ISO 8601 timestamp
  updated: string                # Optional: ISO 8601 timestamp
```

### Specification Section

```yaml
spec:
  prompts: [Prompt]              # Optional: Array of prompt definitions
  tools: [Tool]                  # Optional: Array of tool definitions
  workflows: [Workflow]          # Optional: Array of workflow definitions  
  personas: [Persona]            # Optional: Array of persona definitions
  fragments: [Fragment]          # Optional: Array of reusable fragments
  config: Configuration          # Optional: Runtime configuration
```

## Entity Schemas

### Prompt Schema

```yaml
name: string                     # Required: Unique prompt name
template: string                 # Required: Template with {{variable}} placeholders
description: string              # Optional: Purpose description
variables: [Variable]            # Optional: Input variable definitions
outputs: [Output]               # Optional: Expected output definitions  
examples: [Example]             # Optional: Test cases
metadata: object                # Optional: Additional key-value pairs
```

### Variable Schema

```yaml
name: string                     # Required: Variable name (supports dot notation)
type: string                     # Required: Data type (string, number, boolean, array, object)
required: boolean                # Optional: Whether required (default: false)
default: any                     # Optional: Default value
description: string              # Optional: Variable purpose
validation: ValidationRule       # Optional: Validation constraints
```

### Tool Schema

```yaml
name: string                     # Required: Unique tool name
description: string              # Required: What the tool does
parameters: [Parameter]          # Optional: Input parameters
returns: ReturnSchema           # Optional: Return value schema
endpoint: string                # Optional: API endpoint URL
method: string                  # Optional: HTTP method (GET, POST, etc.)
headers: object                 # Optional: HTTP headers
authentication: AuthConfig      # Optional: Auth configuration
```

### Workflow Schema

```yaml
name: string                     # Required: Unique workflow name
description: string              # Optional: Workflow purpose
steps: [Step]                   # Required: Ordered execution steps
variables: [Variable]           # Optional: Workflow-level variables
error_handling: ErrorConfig     # Optional: Error handling strategy
```

### Persona Schema

```yaml
name: string                     # Required: Unique persona name
description: string              # Optional: Persona description
traits: PersonaTraits           # Required: Personality characteristics
knowledge: [KnowledgeArea]      # Optional: Areas of expertise
constraints: [Constraint]       # Optional: Behavioral limitations
examples: [PersonaExample]      # Optional: Example interactions
```

## Validation Rules

PromptPack files must pass these validation checks:

1. **Schema compliance** - All required fields present with correct types
2. **Name uniqueness** - Entity names unique within their scope  
3. **Reference integrity** - All referenced entities exist
4. **Version format** - Semantic versioning (MAJOR.MINOR.PATCH)
5. **Template syntax** - Valid Mustache-style templates

## Size Limits

- Maximum file size: 10MB
- Maximum entities per type: 1000
- Maximum template length: 100KB
- Maximum variable nesting: 10 levels