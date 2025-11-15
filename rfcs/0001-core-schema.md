# RFC 0001: Core PromptPack Schema

- **Status:** Implemented
- **Author(s):** AltairaLabs Team
- **Created:** 2025-10-01
- **Updated:** 2025-10-31
- **Implemented:** 2025-10-31
- **Related Issues:** N/A (Foundation RFC)

## Summary

This RFC defines the core JSON schema structure for PromptPack, establishing the foundational data model for packaging, distributing, and executing multi-prompt conversational AI systems.

## Motivation

Before PromptPack, there was no standard format for packaging conversational AI prompts. Teams faced:

- **No portability** - Prompts locked to specific frameworks
- **No reusability** - Difficult to share prompts across projects
- **No versioning** - Hard to track changes and maintain compatibility
- **No testing metadata** - Unknown which models work well with which prompts
- **Scattered configuration** - Tools, fragments, and prompts stored separately

### Goals

- Define a portable, JSON-based format for packaging prompts
- Support multiple specialized prompts within a single pack
- Enable sharing of tools, fragments, and configuration
- Provide version management at both pack and prompt levels
- Include testing and validation metadata

### Non-Goals

- Define runtime execution behavior (implementation-specific)
- Specify networking protocols or APIs
- Create a programming language or DSL

## Detailed Design

### Top-Level Structure

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "pack-identifier",
  "name": "Human-readable name",
  "version": "1.0.0",
  "description": "Pack description",
  "template_engine": { ... },
  "prompts": { ... },
  "tools": { ... },
  "fragments": { ... },
  "metadata": { ... },
  "compilation": { ... }
}
```

### Schema Changes

This RFC introduces the complete v1 schema with:

1. **Pack Identity**: id, name, version, description
2. **Template Engine**: Shared configuration for variable substitution
3. **Prompts**: Map of task_type → prompt configuration
4. **Tools**: Reusable function definitions
5. **Fragments**: Shared text blocks
6. **Metadata**: Optional pack-level information
7. **Compilation**: Build-time metadata

### Key Design Decisions

#### Multi-Prompt Architecture

Each pack contains multiple prompts, not just one:

```json
{
  "prompts": {
    "support": { "system_template": "..." },
    "sales": { "system_template": "..." },
    "technical": { "system_template": "..." }
  }
}
```

**Rationale**: Specialized prompts outperform generic ones.

#### Shared Resources

Tools and fragments are defined once, used by all prompts:

```json
{
  "tools": {
    "lookup_order": { ... }
  },
  "prompts": {
    "support": { "tools": ["lookup_order"] },
    "sales": { "tools": ["lookup_order"] }
  }
}
```

**Rationale**: Eliminates duplication and ensures consistency.

#### Independent Prompt Versioning

Each prompt can have its own version:

```json
{
  "version": "1.0.0",  // Pack version
  "prompts": {
    "support": { "version": "1.2.0" },  // Prompt version
    "sales": { "version": "1.0.5" }
  }
}
```

**Rationale**: Prompts evolve at different rates.

## Examples

### Minimal Pack

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "hello-world",
  "name": "Hello World Pack",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "greeting": {
      "id": "greeting",
      "name": "Greeter",
      "version": "1.0.0",
      "system_template": "Say hello to {{name}}."
    }
  }
}
```

### Complete Pack

See [schema/promptpack.schema.json](../../schema/promptpack.schema.json) examples section.

## Drawbacks

- **JSON verbosity** - More verbose than YAML (addressed in RFC-0002)
- **Schema complexity** - Many optional fields (necessary for flexibility)
- **Learning curve** - New format requires documentation (addressed with comprehensive docs)

## Alternatives

### Alternative 1: Single-Prompt Format

Only allow one prompt per file.

**Rejected**: Forces duplication of tools and fragments across files.

### Alternative 2: YAML-Only Format

Use YAML as the primary format.

**Rejected**: JSON provides better validation and tooling support. YAML added as convenience format in RFC-0002.

### Alternative 3: Programmatic API

Define a programming API instead of a data format.

**Rejected**: Limits portability across languages and frameworks.

## Adoption Strategy

### Backward Compatibility

N/A - This is the initial specification.

### Migration Path

N/A - No previous format to migrate from.

## Implementation Plan

1. **Phase 1:** Define JSON Schema ✅
2. **Phase 2:** Create validation tools ✅
3. **Phase 3:** Write specification documentation ✅
4. **Phase 4:** Implement reference runtime (PromptKit) ✅

## Testing Strategy

- JSON Schema validation against examples
- Round-trip serialization tests
- Cross-implementation compatibility tests

## Documentation Impact

- [x] Schema reference documentation
- [x] Structure documentation
- [x] Examples documentation
- [x] File format documentation
- [x] Overview documentation

## Unresolved Questions

None - All design decisions finalized.

## Future Considerations

- Multimodal content support (images, audio, video)
- Advanced workflow definitions with branching
- Plugin/extension system
- Performance optimization hints

---

## Revision History

- **2025-10-01:** Initial draft
- **2025-10-15:** Incorporated community feedback
- **2025-10-31:** Finalized and implemented

## References

- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/schema)
- [Semantic Versioning 2.0.0](https://semver.org/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
