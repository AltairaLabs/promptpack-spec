---
sidebar_position: 0
---

# Specification Versions

The PromptPack specification evolves over time. This page helps you find the right version of the spec for your needs.

## Current Version: v1.3.1

**Status:** ✅ Current
**Released:** February 2026
**Schema:** `https://promptpack.org/schema/v1.3.1/promptpack.schema.json`

### What's New in v1.3.1

- **Skills Extension** ([RFC-0008](/docs/rfcs/skills-extension)) - Progressive-disclosure knowledge loading via the AgentSkills.io standard
- **Top-level `skills` array** - Declare skill sources as file paths, package references, or inline definitions
- **SkillPathSource** - Path-based skill source with optional `preload` flag for eager loading
- **InlineSkill** - Define skills inline with `name`, `description`, and `instructions`
- **WorkflowState `skills` field** - Directory-scoped skill filtering per workflow state

[View v1.3.1 Spec →](./overview)

---

## Previous Versions

### v1.3

**Status:** 📦 Stable
**Released:** February 2026
**Schema:** `https://promptpack.org/schema/v1.3/promptpack.schema.json`

- Workflow Orchestration - State-machine workflows over prompts with event-driven transitions
- Agent Definitions - A2A-compatible agent cards for multi-agent orchestration
- WorkflowState - Per-state persistence and orchestration modes
- AgentDef - Discovery tags, input/output MIME types

[View v1.3 Spec →](./v1.3/overview)

---

### v1.2

**Status:** 📦 Stable
**Released:** February 2026
**Schema:** `https://promptpack.org/schema/v1.2/promptpack.schema.json`

- Evals Extension - Declare automated quality checks (evals) alongside prompts
- Pack-level and prompt-level evals with Prometheus-style metrics
- Flexible eval types and triggers

[View v1.2 Spec →](./v1.2/overview)

---

### v1.1

**Status:** 📦 Stable
**Released:** November 2024
**Schema:** `https://promptpack.org/schema/v1.1/promptpack.schema.json`

- Multimodal Support - Image, audio, video, and document content
- Extensible Media Types - Custom media types (3D models, archives, etc.)
- GenericMediaTypeConfig - Flexible validation for custom media

[View v1.1 Spec →](./v1.1/overview)

---

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
| v1.3.1  | ✅ Current | Full support | - |
| v1.3    | 📦 Stable | Security fixes only | TBD |
| v1.2    | 📦 Stable | Security fixes only | TBD |
| v1.1    | 📦 Stable | Security fixes only | TBD |
| v1.0    | 📦 Stable | Security fixes only | TBD |

- **Full Support**: New features, bug fixes, and security updates
- **Security Fixes Only**: Critical security patches only
- **End of Life**: No further updates

---

## Migration from v1.3 to v1.3.1

v1.3.1 is **fully backward compatible** with v1.3. No breaking changes.

### Upgrade Steps

1. **Update schema version** in your PromptPack:
   ```json
   {
     "$schema": "https://promptpack.org/schema/v1.3.1/promptpack.schema.json",
     "version": "1.3.1"
   }
   ```

2. **(Optional) Add skills** for progressive-disclosure knowledge loading:
   ```json
   {
     "skills": [
       "./skills/billing",
       { "path": "./skills/compliance", "preload": true },
       {
         "name": "escalation-protocol",
         "description": "Steps for escalating unresolved issues",
         "instructions": "When an issue cannot be resolved:\n1. Collect details\n2. Create ticket\n3. Set expectations"
       }
     ]
   }
   ```

3. **(Optional) Add skills to workflow states** for context-scoped filtering:
   ```json
   {
     "workflow": {
       "states": {
         "billing_state": {
           "prompt_task": "billing",
           "on_event": { "resolved": "closing" },
           "skills": "./skills/billing"
         },
         "closing": {
           "prompt_task": "closing",
           "on_event": {},
           "skills": "none"
         }
       }
     }
   }
   ```

4. **Test and validate** - v1.3 packs continue to work without changes

### New Features You Can Use

- Add `skills` array at pack level to declare knowledge sources
- Use string paths, `SkillPathSource` objects, or `InlineSkill` objects
- Set `preload: true` on `SkillPathSource` for eager loading
- Add `skills` field to `WorkflowState` to scope which skills are available per state
- Use `"none"` to disable skills in specific workflow states

See [RFC-0008: Skills Extension](/docs/rfcs/skills-extension) for details.

---

## Migration from v1.2 to v1.3

v1.3 is **fully backward compatible** with v1.2. No breaking changes.

### Upgrade Steps

1. **Update schema version** in your PromptPack:
   ```json
   {
     "$schema": "https://promptpack.org/schema/v1.3/promptpack.schema.json",
     "version": "1.3.0"
   }
   ```

2. **(Optional) Add workflow** to orchestrate transitions between prompts:
   ```json
   {
     "workflow": {
       "version": 1,
       "entry": "triage",
       "states": {
         "triage": {
           "prompt_task": "triage",
           "on_event": { "billing": "billing_support", "technical": "tech_support" }
         }
       }
     }
   }
   ```

3. **(Optional) Add agents** for A2A protocol interoperability:
   ```json
   {
     "agents": {
       "entry": "triage",
       "members": {
         "triage": {
           "description": "Routes requests to specialists",
           "tags": ["router"]
         }
       }
     }
   }
   ```

4. **Test and validate** - v1.2 packs continue to work without changes

### New Features You Can Use

- Add `workflow` object to define state-machine orchestration over prompts
- Each state references a prompt key and declares event-driven transitions
- Control context persistence per state (`transient` or `persistent`)
- Choose orchestration mode per state (`internal`, `external`, `hybrid`)
- Add `agents` object to publish A2A Agent Cards for each prompt
- Define discovery tags and supported MIME types per agent

See [RFC-0005: Workflow Extension](/docs/rfcs/workflow-extension) and [RFC-0007: Agents Extension](/docs/rfcs/agents-extension) for details.

---

## Migration from v1.1 to v1.2

v1.2 is **fully backward compatible** with v1.1. No breaking changes.

### Upgrade Steps

1. **Update schema version** in your PromptPack:
   ```json
   {
     "$schema": "https://promptpack.org/schema/v1.2/promptpack.schema.json",
     "version": "1.2.0"
   }
   ```

2. **(Optional) Add evals** at the pack level or prompt level:
   ```json
   {
     "evals": [
       {
         "id": "json_format",
         "type": "json_valid",
         "trigger": "every_turn",
         "metric": {
           "name": "promptpack_json_valid",
           "type": "boolean"
         }
       }
     ]
   }
   ```

3. **Test and validate** - v1.1 packs continue to work without changes

### New Features You Can Use

- Add `evals` array at pack level for cross-cutting quality checks
- Add `evals` array at prompt level for prompt-specific checks
- Prompt-level evals override pack-level evals by `id`
- Attach Prometheus-style `metric` declarations to evals
- Use `trigger` to control when evals fire (`every_turn`, `on_session_complete`, `sample_turns`, `sample_sessions`)

See [RFC-0006: Evals Extension](/docs/rfcs/evals-extension) for details.

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

### Use v1.3.1 if:
- ✅ Building new PromptPacks
- ✅ Need progressive-disclosure knowledge loading (skills)
- ✅ Need workflow orchestration between prompts
- ✅ Want A2A protocol interoperability for multi-agent systems
- ✅ Want latest features

### Stay on v1.3 if:
- ✅ Existing packs work fine
- ✅ Don't need skills yet
- ✅ Prefer maximum stability

**Recommendation:** Use v1.3.1 for all new projects. It's backward compatible and adds progressive-disclosure knowledge loading.

---

## Version History

| Version | Release Date | Highlights |
|---------|--------------|------------|
| v1.3.1  | Feb 2026    | Skills: progressive-disclosure knowledge loading |
| v1.3    | Feb 2026    | Workflow orchestration, A2A agent definitions |
| v1.2    | Feb 2026    | Evals extension: pack/prompt-level evals, Prometheus metrics |
| v1.1    | Nov 2024    | Multimodal support, extensible media types |
| v1.0    | Oct 2024    | Initial release: core schema, YAML format, templates |

See [Changelog](https://github.com/altairalabs/promptpack-spec/blob/main/CHANGELOG.md) for complete version history.
