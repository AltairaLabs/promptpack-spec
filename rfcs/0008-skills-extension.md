# RFC 0008: Skills Extension

- **Status:** Implemented
- **Author(s):** AltairaLabs Team
- **Created:** 2026-02-21
- **Updated:** 2026-02-21
- **Related Issues:** N/A

## Summary

Extend the PromptPack specification with a `skills` field for progressive-disclosure knowledge loading, following the AgentSkills.io standard. The extension adds a top-level `skills` array that declares external skill sources (file paths, package references, or inline definitions) and a `skills` string field on `WorkflowState` for directory-scoped skill filtering within workflow states.

## Motivation

As prompt packs grow in complexity, agents need access to domain-specific knowledge that goes beyond what fits in a system template. Skills represent modular, reusable knowledge units that can be loaded on demand — instructions for specific tasks, domain expertise, or behavioral patterns that an agent activates when relevant.

### Current Limitations

Without a skills mechanism, developers must:

- Embed all domain knowledge directly in system templates, leading to bloated prompts
- Manually manage which knowledge is available in which context
- Duplicate instructions across prompts when multiple prompts need the same expertise
- Hardcode knowledge loading in runtime code, breaking PromptPack's portability promise

This leads to:

- **Prompt bloat** — system templates grow unwieldy as domain knowledge accumulates
- **Poor discoverability** — no standard way to declare what knowledge an agent can access
- **Tight coupling** — knowledge management logic lives in runtime code, not the pack
- **No progressive disclosure** — all knowledge loads upfront rather than on demand

### Goals

- Allow authors to declare skill sources (file paths, packages, or inline definitions) within a pack
- Enable directory-scoped skill filtering within workflow states
- Support progressive-disclosure loading where skills activate on demand
- Maintain full backward compatibility with existing packs
- Follow the AgentSkills.io standard for skill definition and discovery

### Non-Goals

- Define skill execution semantics (how skills are interpreted at runtime)
- Specify skill resolution protocols (how packages are fetched)
- Replace or subsume the existing `agents` section — skills complement agents
- Define skill versioning or dependency resolution

## Detailed Design

### Core Concept

A **skill** is a named, self-contained unit of knowledge or instructions that an agent can load on demand. Skills can be sourced from:

1. **File paths** — local directories or files containing skill definitions
2. **Package references** — external packages following the AgentSkills.io standard
3. **Inline definitions** — skills defined directly in the pack with name, description, and instructions

### Schema Changes

#### New Top-Level Field: `skills`

```json
{
  "skills": {
    "type": "array",
    "description": "Skill sources for progressive-disclosure knowledge loading. Each entry is either a string (path or package reference) or an object with detailed configuration.",
    "items": {
      "$ref": "#/$defs/SkillSource"
    }
  }
}
```

#### New Definition: `SkillSource`

```json
{
  "SkillSource": {
    "oneOf": [
      {
        "type": "string",
        "description": "Path to a skill directory/file or a package reference (e.g., './skills', '@acme/billing-skills')."
      },
      {
        "$ref": "#/$defs/SkillPathSource"
      },
      {
        "$ref": "#/$defs/InlineSkill"
      }
    ]
  }
}
```

#### New Definition: `SkillPathSource`

```json
{
  "SkillPathSource": {
    "type": "object",
    "description": "A skill source with a path and optional preload configuration.",
    "required": ["path"],
    "additionalProperties": false,
    "properties": {
      "path": {
        "type": "string",
        "description": "Path to a skill directory, file, or package reference."
      },
      "preload": {
        "type": "boolean",
        "description": "If true, load this skill source eagerly at pack initialization rather than on demand.",
        "default": false
      }
    }
  }
}
```

#### New Definition: `InlineSkill`

```json
{
  "InlineSkill": {
    "type": "object",
    "description": "A skill defined inline within the pack. Useful for small, pack-specific skills that don't warrant a separate file.",
    "required": ["name", "description", "instructions"],
    "additionalProperties": false,
    "properties": {
      "name": {
        "type": "string",
        "description": "Human-readable name for this skill.",
        "minLength": 1
      },
      "description": {
        "type": "string",
        "description": "Brief description of what this skill provides.",
        "minLength": 1
      },
      "instructions": {
        "type": "string",
        "description": "The skill's instructions or knowledge content. Loaded into the agent's context when the skill is activated.",
        "minLength": 1
      }
    }
  }
}
```

#### New Field on `WorkflowState`: `skills`

```json
{
  "skills": {
    "type": "string",
    "description": "Skill filter for this workflow state. A path to a skill directory/file that scopes which skills are available in this state, or the literal 'none' to disable skills."
  }
}
```

### How Skills Work

1. **Declaration**: The pack's top-level `skills` array declares available skill sources. These can be file paths, package references, or inline definitions.

2. **Resolution**: At runtime, the runtime resolves each skill source:
   - **Strings** are treated as paths or package references
   - **SkillPathSource** objects provide a path with optional eager loading (`preload: true`)
   - **InlineSkill** objects contain the skill definition directly

3. **Activation**: Skills are loaded progressively — by default, they activate on demand when relevant to the current context. Skills with `preload: true` load eagerly.

4. **State Scoping**: When a `WorkflowState` declares a `skills` field, it filters which skills are available in that state. The value `"none"` disables all skills for that state.

### Specification Impact

- The `skills` field is added to the top-level pack schema as an optional property
- The `SkillSource`, `SkillPathSource`, and `InlineSkill` definitions are added to `$defs`
- A `skills` string field is added to `WorkflowState`
- All existing fields and definitions remain unchanged
- Packs without `skills` are unaffected

### Validation Rules

1. **Inline skill uniqueness**: Inline skill `name` values should be unique within the `skills` array
2. **Path validation**: File paths in `SkillPathSource` and string entries should point to valid locations (runtime validation)
3. **WorkflowState skills**: The `skills` field on a workflow state must be either a valid path/reference or the literal string `"none"`
4. **Backward compatibility**: The `skills` field is optional; existing packs without it remain valid

## Examples

### Example 1: File Path Skills

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.3.1",
  "skills": [
    "./skills/billing",
    "./skills/technical-support"
  ],
  "prompts": { "..." : "..." }
}
```

### Example 2: Mixed Skill Sources

```json
{
  "id": "enterprise-support",
  "name": "Enterprise Support Pack",
  "version": "1.3.1",
  "skills": [
    "./skills/common",
    { "path": "./skills/compliance", "preload": true },
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved customer issues",
      "instructions": "When a customer issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity\n2. Collect case details\n3. Create an escalation ticket\n4. Provide the ticket reference to the customer"
    }
  ],
  "prompts": { "..." : "..." }
}
```

### Example 3: Workflow State Skill Scoping

```json
{
  "id": "support-workflow",
  "name": "Support Workflow",
  "version": "1.3.1",
  "skills": [
    "./skills/billing",
    "./skills/technical",
    "./skills/general"
  ],
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "on_event": { "billing": "billing_state", "technical": "tech_state" },
        "skills": "./skills/general"
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing" },
        "skills": "./skills/billing"
      },
      "tech_state": {
        "prompt_task": "technical",
        "on_event": { "resolved": "closing" },
        "skills": "./skills/technical"
      },
      "closing": {
        "prompt_task": "closing",
        "on_event": {},
        "skills": "none"
      }
    }
  },
  "prompts": { "..." : "..." }
}
```

## Drawbacks

### Minimal Runtime Specification

The design intentionally leaves skill resolution and execution to runtimes. This provides flexibility but means different runtimes may handle skills differently.

**Mitigation**: The AgentSkills.io standard provides a reference implementation. PromptKit will serve as the canonical runtime.

### Path-Based References

File paths are environment-dependent. A skill path that works locally may not resolve in a cloud deployment.

**Mitigation**: Package references (`@scope/package`) provide a portable alternative. Runtimes can also remap paths during deployment.

## Alternatives

### Alternative 1: Skills on Each Prompt

Add a `skills` array directly on each prompt definition.

**Rejected**: Skills are a pack-level concern — they represent shared domain knowledge. Per-prompt skills would lead to duplication. Workflow state scoping provides per-context filtering when needed.

### Alternative 2: Extend the Fragments System

Reuse the existing `fragments` mechanism for skill content.

**Rejected**: Fragments are compile-time text substitutions. Skills are runtime knowledge units with progressive disclosure. They serve fundamentally different purposes.

### Alternative 3: Embed in Agents Section

Add skills as a property of `AgentDef`.

**Rejected**: Skills are orthogonal to agents. A pack can use skills without agents, and vice versa. Coupling them would limit flexibility.

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

The `skills` field is entirely optional. Existing packs without it remain valid. Runtimes that don't support skills ignore the field.

### Migration Path

No migration required. Adoption is incremental:

1. **Phase 1**: Continue using packs without skills (current behavior)
2. **Phase 2**: Add top-level `skills` with file path references
3. **Phase 3**: Use inline skills for small, pack-specific knowledge
4. **Phase 4**: Add `skills` to workflow states for context-scoped filtering

### Runtime Support Levels

- **Level 0**: Ignore `skills` field (backward compatible)
- **Level 1**: Resolve skill sources and load at startup
- **Level 2**: Full progressive-disclosure loading with workflow state scoping

## Unresolved Questions

### 1. Package Reference Format

Should package references follow npm-style (`@scope/package`) or a custom format? The current design accepts any string, leaving format interpretation to runtimes.

**Proposal**: Accept any string. Runtimes that support package resolution define their own conventions.

### 2. Skill Priority and Conflicts

When multiple skill sources provide conflicting instructions, which takes precedence?

**Proposal**: Last-declared wins (array order matters). Runtimes may provide more sophisticated conflict resolution.

### 3. Relationship with System Templates

Should skills append to or replace system template content?

**Proposal**: Skills supplement the system template. The system template defines core behavior; skills provide additional context-specific knowledge.

## Future Considerations

### Skill Dependencies

Skills that depend on other skills:

```json
{
  "name": "advanced-billing",
  "description": "Advanced billing procedures",
  "instructions": "...",
  "depends_on": ["basic-billing"]
}
```

### Skill Conditions

Conditional skill activation based on runtime state:

```json
{
  "path": "./skills/premium-support",
  "condition": "customer.tier == 'enterprise'"
}
```

### Skill Metrics

Track skill activation frequency and effectiveness via the existing evals/metrics system.

---

## Revision History

- **2026-02-21:** Initial draft

## References

- [RFC 0005: Workflow Extension](./0005-workflow-extension.md)
- [RFC 0007: Agents Extension](./0007-agents-extension.md)
- [AgentSkills.io Standard](https://agentskills.io)
- [PromptKit Skills Implementation](https://github.com/AltairaLabs/PromptKit)
