# RFC 0002: YAML File Format

- **Status:** Implemented
- **Author(s):** AltairaLabs Team
- **Created:** 2025-10-05
- **Updated:** 2025-10-31
- **Implemented:** 2025-10-31
- **Related Issues:** N/A

## Summary

Add YAML as an alternative authoring format for PromptPack, providing a more human-friendly syntax for creating and editing packs while maintaining JSON as the canonical compiled format.

## Motivation

While JSON is excellent for machine processing and validation, it's not ideal for human authoring:

- **Verbose syntax** - Requires quotes, commas, and brackets
- **No comments** - Can't add inline documentation
- **Editing friction** - Easy to introduce syntax errors
- **Poor readability** - Harder to scan and understand

YAML addresses these issues while remaining compatible with the JSON schema.

### Goals

- Support YAML as an authoring format for PromptPack
- Maintain JSON as the canonical compiled format
- Provide bidirectional conversion (YAML ↔ JSON)
- Preserve all schema features and validation

### Non-Goals

- Replace JSON as the primary format
- Support YAML-specific features not compatible with JSON
- Create a new schema language

## Detailed Design

### YAML Source Format

PromptPack YAML files use the `.promptpack.yaml` extension:

```yaml
# promptpack.yaml or *.promptpack.yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: PromptConfig
metadata:
  name: customer-support
  version: 1.0.0

spec:
  # System prompt template
  system_template: |
    You are a {{role}} assistant for {{company}}.
    
    Provide helpful, professional support.
  
  # Variable definitions
  variables:
    - name: role
      type: string
      required: true
    - name: company
      type: string
      required: true
  
  # Tool definitions
  tools:
    - name: lookup_order
      description: Look up order details
```

### Compilation to JSON

The PackC compiler processes a directory of PromptConfig YAML files and combines them into a single PromptPack JSON file:

```bash
# Compile all PromptConfig files in a directory
packc compile prompts/ -o customer-support.pack.json
```

The compiler:
1. Discovers all `*.yaml` files with `kind: PromptConfig` in the target directory
2. Combines them into a single PromptPack structure
3. Validates the complete pack against the JSON schema
4. Outputs a compiled `.pack.json` file

**Output:**

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "support": {
      "id": "support",
      "name": "Support Bot",
      "version": "1.0.0",
      "system_template": "You are a {{role}} assistant...",
      "variables": [...]
    },
    "sales": {
      "id": "sales",
      "name": "Sales Assistant",
      "version": "1.0.0",
      "system_template": "You are a sales representative...",
      "variables": [...]
    }
  },
  "compilation": {
    "compiled_with": "packc-v1.0.0",
    "created_at": "2024-10-31T12:00:00Z",
    "schema": "v1"
  }
}
```

### Key Design Decisions

#### YAML for Authoring, JSON for Distribution

- **Author in YAML** - Human-friendly syntax with comments, one file per prompt
- **Compile to JSON** - Machine-optimized format for runtime, single pack file
- **Directory-based organization** - Multiple PromptConfig files in a folder
- **Version control sources** - Track individual YAML files, compiled pack can be generated

**Rationale**: Optimizes for both human authoring (separate files) and machine runtime (single file).

#### Compatible Schema

YAML must map cleanly to JSON:

```yaml
# YAML (source)
prompts:
  support:
    system_template: "Hello {{name}}"
    
# Compiles to JSON
{
  "prompts": {
    "support": {
      "system_template": "Hello {{name}}"
    }
  }
}
```

**Rationale**: Ensures full compatibility with JSON schema validation.

#### Kubernetes API Machinery Structure

YAML files follow Kubernetes resource conventions:

```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1  # Versioned API
kind: PromptConfig                              # Resource type
metadata:                                        # Identity & labels
  name: my-prompt
  version: 1.0.0
spec:                                           # Actual configuration
  system_template: "..."
  variables: [...]
```

**Rationale**: 
- **Familiar pattern** - DevOps teams already know this structure from Kubernetes
- **Extensibility** - Easy to add new resource kinds (PromptConfig, ToolConfig, FragmentConfig)
- **Versioning** - `apiVersion` enables schema evolution without breaking changes
- **Tooling compatibility** - Works with K8s ecosystem tools (kubectl, kustomize, operators)
- **Resource discovery** - `kind` field enables multi-resource directory compilation
- **Metadata separation** - Clean split between identity (metadata) and configuration (spec)

This enables features like:
- Multiple resource types in the same directory
- Kustomize overlays for environment-specific configs
- GitOps workflows with ArgoCD/Flux
- Future Kubernetes operator for prompt management

#### Comments Support

```yaml
# This is a customer support prompt
# Updated: 2024-10-31
system_template: |
  You are a support agent.
  # This comment is preserved in the template
```

**Rationale**: Documentation is critical for maintainability.

## Examples

### Simple YAML Pack

```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: PromptConfig
metadata:
  name: greeting
  version: 1.0.0

spec:
  system_template: "Say hello to {{name}}."
  
  variables:
    - name: name
      type: string
      required: true
      example: "Alice"
```

### Multi-Prompt Pack from Multiple Files

The PackC compiler combines multiple PromptConfig files into a single PromptPack:

**prompts/support.yaml:**
```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: PromptConfig
metadata:
  name: support
  version: 1.0.0

spec:
  system_template: |
    {{fragments.greeting}}
    You are a support agent.
  variables:
    - name: company
      type: string
      required: true
```

**prompts/sales.yaml:**
```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: PromptConfig
metadata:
  name: sales
  version: 1.0.0

spec:
  system_template: |
    {{fragments.greeting}}
    You are a sales representative.
  variables:
    - name: company
      type: string
      required: true
```

**Compilation:**
```bash
# Compile all YAML files in prompts/ directory into a single pack
packc compile prompts/ -o customer-support.pack.json
```

## Drawbacks

- **Two formats to maintain** - Documentation and examples need both
- **Compilation step required** - Can't use YAML directly in all runtimes
- **YAML complexity** - Indentation and multi-line strings can be tricky
- **Format confusion** - Users need to understand when to use each format

## Alternatives

### Alternative 1: JSON-Only

Keep only JSON format.

**Rejected**: Too much friction for human authoring.

### Alternative 2: YAML-Only

Use only YAML, converting to JSON internally.

**Rejected**: JSON is better for machine processing and validation.

### Alternative 3: TOML Format

Use TOML instead of YAML.

**Rejected**: YAML has better multi-line string support and wider adoption in the AI/ML ecosystem.

## Adoption Strategy

### Backward Compatibility

Fully backward compatible - JSON format unchanged.

### Migration Path

Users can continue using JSON or adopt YAML:

```bash
# Compile a directory of YAML PromptConfig files to JSON PromptPack
packc compile prompts/ -o pack.json

# Convert existing JSON PromptPack to individual YAML files
packc explode pack.json -o prompts/
```

## Implementation Plan

1. **Phase 1:** Add YAML parsing to PackC ✅
2. **Phase 2:** Implement bidirectional conversion ✅
3. **Phase 3:** Update documentation with YAML examples ✅
4. **Phase 4:** Add YAML validation ✅

## Testing Strategy

- Round-trip conversion tests (YAML → JSON → YAML)
- Schema validation for YAML sources
- Example packs in both formats
- Edge case handling (multi-line strings, special characters)

## Documentation Impact

- [x] Add YAML examples to all documentation
- [x] Document compilation process
- [x] Add format conversion guide
- [x] Update file format documentation

## Unresolved Questions

None - All design decisions finalized.

## Future Considerations

- IDE plugins for YAML authoring with schema validation
- Auto-formatting tools for YAML files
- YAML-specific linting rules

---

## Revision History

- **2024-10-05:** Initial draft
- **2024-10-15:** Added compilation examples
- **2024-10-31:** Finalized and implemented

## References

- [YAML Specification 1.2](https://yaml.org/spec/1.2/spec.html)
- [PackC Compiler Documentation](https://github.com/AltairaLabs/PromptKit)
- [RFC-0001: Core PromptPack Schema](0001-core-schema.md)
