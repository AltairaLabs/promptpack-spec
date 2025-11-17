# RFC 0005: PromptPack Workflow Specification Extension

- **Status:** Draft
- **Author(s):** AltairaLabs Team
- **Created:** 2025-11-17
- **Updated:** 2025-11-17
- **Related Issues:** N/A

## Summary

This RFC proposes extending the PromptPack specification to support declarative, event-driven workflows for agentic systems. The extension enables agents to transition between logical states in response to events, without embedding business logic or tool configuration inside the spec. This is a specification-only extension that does not define runtime behavior, provider implementations, or deployment concerns.

## Motivation

Modern agentic systems often require multiple phases or modes of operation during their lifecycle. For example, an agent might transition from an initial analysis phase, to planning, to execution, and finally to validation. These workflows apply to conversational assistants, automated process agents, multi-step reasoning systems, and other autonomous agents. Currently, PromptPack lacks a standard way to express these state transitions declaratively.

### Current Limitations

Without workflow support, developers must:

- Implement state management logic in runtime code
- Hardcode transitions between different prompt types
- Manage lifecycle phases outside the prompt specification
- Duplicate configuration across stateful assistants

This leads to:

- **Reduced portability** - State management tied to specific runtimes
- **Inconsistent patterns** - Each implementation handles workflows differently  
- **Complex debugging** - Workflow logic scattered across code and configuration
- **Limited reusability** - Workflow-driven assistants hard to share and adapt

### Goals

- Provide a declarative mechanism for defining agent state transitions
- Support event-driven workflow progression between prompts
- Enable workflow-driven agentic systems to be packaged portably
- Keep business logic, tool implementations, and provider configuration out of the spec
- Maintain full backward compatibility with existing PromptPacks
- Support optional metadata for state persistence and orchestration hints

### Non-Goals

- Define runtime execution semantics or behavior (implementation-specific)
- Specify tool schemas, bindings, or implementations
- Define event payload structures or validation
- Specify provider configurations (storage, events, telemetry)
- Create deployment or orchestration specifications (Omnia/Kubernetes)
- Introduce imperative logic, conditionals, or loops into the spec
- Define the implementation of workflow tools (`wf.emit_event`, etc.)

## Detailed Design

### Top-Level Structure

The workflow extension adds a new optional top-level `workflow` section to the PromptPack schema:

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "example-pack",
  "name": "Example Pack",
  "version": "1.0.0",
  "template_engine": { ... },
  "prompts": { ... },
  "workflow": {
    "version": 1,
    "entry": "initial_state",
    "states": { ... }
  }
}
```

### Schema Changes

#### New Top-Level Field: `workflow`

```json
{
  "workflow": {
    "type": "object",
    "description": "Optional workflow configuration defining event-driven state transitions between prompts",
    "required": ["version", "entry", "states"],
    "additionalProperties": false,
    "properties": {
      "version": {
        "type": "integer",
        "description": "Workflow schema version. Use 1 for this specification.",
        "enum": [1],
        "examples": [1]
      },
      "entry": {
        "type": "string",
        "description": "Initial state name. Must reference a key in the states object and a valid prompt_task.",
        "examples": ["sparring", "discovery", "initial"]
      },
      "states": {
        "type": "object",
        "description": "Map of state names to state definitions. Each state corresponds to a phase in the agent lifecycle.",
        "minProperties": 1,
        "additionalProperties": {
          "$ref": "#/$defs/WorkflowState"
        }
      },
      "engine": {
        "type": "object",
        "description": "Optional implementation-specific configuration data. Allows runtimes to include custom settings without polluting the core workflow schema.",
        "additionalProperties": true,
        "examples": [
          {
            "timeout_ms": 30000,
            "retry_policy": "exponential_backoff",
            "telemetry_enabled": true
          }
        ]
      }
    }
  }
}
```

#### New Definition: `WorkflowState`

```json
{
  "WorkflowState": {
    "type": "object",
    "description": "A single state in the workflow. Defines which prompt to execute and how to transition to other states based on events.",
    "required": ["prompt_task"],
    "additionalProperties": false,
    "properties": {
      "prompt_task": {
        "type": "string",
        "description": "Name of the prompt (task_type key) to execute in this state. Must reference a key in the prompts object.",
        "examples": ["sparring", "planning", "execution"]
      },
      "description": {
        "type": "string",
        "description": "Human-readable description of what this state does and when it's used.",
        "examples": [
          "Initial sparring phase where the assistant explores user goals",
          "Planning phase where the assistant creates a structured plan"
        ]
      },
      "on_event": {
        "type": "object",
        "description": "Map of event names to target state names. When an event is emitted, the workflow transitions to the corresponding state.",
        "additionalProperties": {
          "type": "string"
        },
        "examples": [
          {
            "GoalDefined": "planning",
            "NeedMoreInfo": "sparring"
          }
        ]
      },
      "persistence": {
        "type": "string",
        "description": "Optional hint about state persistence requirements. 'transient' states may not need long-term storage, 'persistent' states should be durably stored.",
        "enum": ["transient", "persistent"],
        "examples": ["transient", "persistent"]
      },
        "orchestration": {
          "type": "string",
          "description": "Optional hint about orchestration mode. 'internal' means the agent manages its own transitions, 'external' means an external system controls transitions, 'hybrid' uses both.",
          "enum": ["internal", "external", "hybrid"],
        "default": "internal",
        "examples": ["internal", "external", "hybrid"]
      }
    }
  }
}
```

### Validation Rules

1. **Entry State Validation**
   - The `entry` field must reference a key in the `states` object
   - The `entry` state's `prompt_task` must reference a valid key in the `prompts` object

2. **State Reference Validation**
   - All `prompt_task` values must reference valid keys in the `prompts` object
   - All `on_event` target states must reference valid keys in the `states` object
   - No circular references that would create infinite loops (warning, not error)

3. **Event Name Validation**
   - Event names in `on_event` should follow PascalCase convention (e.g., `GoalDefined`, `PlanApproved`)
   - Event names should be descriptive and domain-specific

4. **Engine Configuration Validation**
   - The `engine` object is optional and accepts any valid JSON
   - No schema validation is enforced on `engine` contents (implementation-specific)
   - Validators may warn if `engine` contains unknown properties for their runtime

5. **Backward Compatibility**
   - The `workflow` field is optional; existing PromptPacks without it remain valid
   - All existing fields and definitions remain unchanged

## Examples

### Example 1: Simple Two-State Workflow

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "simple-agent",
  "name": "Simple Agent Workflow",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "analyze": {
      "id": "analyze",
      "name": "Analysis Phase",
      "version": "1.0.0",
      "system_template": "Analyze the input data and determine the required approach. When analysis is complete, emit the AnalysisComplete event."
    },
    "execute": {
      "id": "execute",
      "name": "Execution Phase",
      "version": "1.0.0",
      "system_template": "Execute the determined approach based on the analysis."
    }
  },
  "workflow": {
    "version": 1,
    "entry": "analyze",
    "states": {
      "analyze": {
        "prompt_task": "analyze",
        "description": "Initial analysis phase to understand requirements",
        "on_event": {
          "AnalysisComplete": "execute"
        },
        "persistence": "transient",
        "orchestration": "internal"
      },
      "execute": {
        "prompt_task": "execute",
        "description": "Execution phase to perform the task",
        "persistence": "persistent",
        "orchestration": "internal"
      }
    }
  }
}
```

### Example 2: Multi-Phase Agent Workflow

```yaml
# YAML format for readability (per RFC-0002)
id: multi-phase-agent
name: Multi-Phase Processing Agent
version: 1.0.0

template_engine:
  version: v1
  syntax: "{{variable}}"

prompts:
  intake:
    id: intake
    name: Intake Phase
    version: 1.0.0
    system_template: |
      Process and validate incoming requests. Gather necessary context and requirements.
      When sufficient information is collected, emit the RequirementsGathered event.

  planning:
    id: planning
    name: Planning Phase
    version: 1.0.0
    system_template: |
      Develop a structured approach to fulfill the request.
      Break down the task into actionable steps. When the plan is ready, emit the PlanReady event.

  execution:
    id: execution
    name: Execution Phase
    version: 1.0.0
    system_template: |
      Execute the planned steps systematically.
      Monitor progress and handle any issues. When complete, emit the TaskComplete event.

  validation:
    id: validation
    name: Validation Phase
    version: 1.0.0
    system_template: |
      Verify the results meet requirements and quality standards.
      Check for errors or inconsistencies. Emit ValidationPassed or ValidationFailed accordingly.

workflow:
  version: 1
  entry: intake
  
  engine:
    max_state_duration_ms: 300000
    enable_state_snapshots: true
    telemetry:
      track_transitions: true
      log_level: info
  
  states:
    intake:
      prompt_task: intake
      description: Initial intake phase to gather requirements
      on_event:
        RequirementsGathered: planning
        InsufficientInfo: intake
      persistence: transient
      orchestration: internal

    planning:
      prompt_task: planning
      description: Planning phase to develop approach
      on_event:
        PlanReady: execution
        RequirementsChanged: intake
        PlanRevisionNeeded: planning
      persistence: persistent
      orchestration: hybrid

    execution:
      prompt_task: execution
      description: Execution phase to perform the work
      on_event:
        TaskComplete: validation
        BlockerFound: planning
        NeedsClarification: intake
      persistence: persistent
      orchestration: hybrid

    validation:
      prompt_task: validation
      description: Validation phase to verify results
      on_event:
        ValidationPassed: intake
        ValidationFailed: execution
      persistence: persistent
      orchestration: internal
```

### Example 3: External Orchestration

```json
{
  "id": "orchestrated-agent",
  "name": "Externally Orchestrated Agent",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "analyze": {
      "id": "analyze",
      "name": "Analysis Mode",
      "version": "1.0.0",
      "system_template": "Analyze the provided data."
    },
    "report": {
      "id": "report",
      "name": "Reporting Mode",
      "version": "1.0.0",
      "system_template": "Generate a report based on the analysis."
    }
  },
  "workflow": {
    "version": 1,
    "entry": "analyze",
    "states": {
      "analyze": {
        "prompt_task": "analyze",
        "description": "Analysis phase controlled by external orchestrator",
        "on_event": {
          "AnalysisComplete": "report"
        },
        "persistence": "persistent",
        "orchestration": "external"
      },
      "report": {
        "prompt_task": "report",
        "description": "Reporting phase controlled by external orchestrator",
        "persistence": "persistent",
        "orchestration": "external"
      }
    }
  }
}
```

## Drawbacks

### Complexity

- Adds a new concept (workflows) that users need to understand
- Increases schema complexity with nested state definitions
- May be overkill for simple single-prompt assistants

**Mitigation**: Workflow is optional. Simple use cases don't need it.

### Runtime Ambiguity

- Spec doesn't define how events are emitted or how transitions happen
- Implementation details left to runtimes
- The `engine` property allows arbitrary runtime-specific data

**Mitigation**: This is intentional. The spec defines structure, not behavior. This preserves flexibility for different runtime implementations. The `engine` property provides a standard location for runtime-specific configuration without polluting the core workflow schema.

### Validation Challenges

- Detecting circular state transitions requires graph analysis
- Event name collisions between different workflow contexts

**Mitigation**: Validation tools can provide warnings. Circular transitions aren't always errors (valid use case: returning to a previous state).

## Alternatives

### Alternative 1: Embed Workflow in Prompts

Add workflow configuration to each prompt definition instead of a top-level section.

```json
{
  "prompts": {
    "sparring": {
      "system_template": "...",
      "transitions": {
        "GoalDefined": "planning"
      }
    }
  }
}
```

**Rejected**:

- Violates separation of concerns (prompt content vs. workflow structure)
- Makes it harder to visualize the complete workflow
- Limits ability to define global workflow properties

### Alternative 2: Separate Workflow File

Define workflows in a separate `.workflow.json` file that references a PromptPack.

**Rejected**:

- Breaks the "single file" portability principle
- Increases complexity of packaging and distribution
- Makes it harder to version workflows with their prompts

### Alternative 3: Use Tool Definitions for Workflow

Define workflow transitions as special tools that prompts can call.

**Rejected**:

- Confuses the purpose of tools (external actions) with workflow (internal state)
- Makes workflow implicit rather than explicit
- Doesn't provide clear visualization of state machine

### Alternative 4: Imperative Workflow DSL

Create a full workflow language with conditionals, loops, and expressions.

```json
{
  "workflow": {
    "if": "goal_defined == true",
    "then": "transition_to(planning)",
    "else": "stay_in(sparring)"
  }
}
```

**Rejected**:

- Goes against the declarative philosophy of PromptPack
- Introduces security concerns with executing arbitrary code
- Significantly increases implementation complexity
- Pushes business logic into the spec (explicit non-goal)

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

The `workflow` field is entirely optional. Existing PromptPacks without workflow definitions remain completely valid. No changes are required to existing specs, tools, or runtimes.

### Migration Path

No migration required. Users can adopt workflows incrementally:

1. **Phase 1**: Continue using PromptPacks without workflows (current behavior)
2. **Phase 2**: Add workflow definitions to new packs for stateful assistants
3. **Phase 3**: Retrofit workflows into existing complex assistants as needed

Runtimes that don't support workflows will simply ignore the `workflow` field and execute prompts as before.

### Runtime Support

Runtimes (like PromptKit) can choose their level of workflow support:

- **Level 0**: Ignore workflow field completely (backward compatible)
- **Level 1**: Validate workflow structure but don't execute transitions
- **Level 2**: Full workflow execution with event handling and state transitions

## Unresolved Questions

### 1. Should `persistence` be mandatory?

Currently `persistence` is optional. Should we require all states to declare their persistence requirements?

**Proposal**: Keep optional for now. Runtimes can default to sensible behavior.

### 2. Should we support workflow-level metadata?

Should we add optional fields for analytics, versioning, or custom metadata at the workflow level?

```json
{
  "workflow": {
    "version": 1,
    "entry": "sparring",
    "metadata": {
      "analytics_id": "workflow-v1",
      "workflow_version": "2.1.0"
    },
    "states": { ... }
  }
}
```

**Proposal**: The `engine` property provides a standard place for implementation-specific data. For standardized metadata, a future RFC could define common fields.

### 3. How should validation surface errors?

Should workflow validation be strict (fail on any issue) or lenient (warn on potential issues)?

**Proposal**:

- Fail on structural errors (invalid references)
- Warn on potential logic issues (circular transitions, unreachable states)

### 4. Should we support state parameters?

Should states be able to accept parameters that modify prompt behavior?

```json
{
  "planning": {
    "prompt_task": "planning",
    "parameters": {
      "detail_level": "high"
    }
  }
}
```

**Proposal**: Defer to future RFC. Use prompt variables for now.

### 5. Should we support parallel states?

Should the spec allow multiple states to be active simultaneously?

**Proposal**: No. Keep simple single-active-state model. Parallel workflows can be modeled with separate packs if needed.

---

## Revision History

- **2025-11-17:** Initial draft

## References

- [RFC 0001: Core PromptPack Schema](./0001-core-schema.md)
- [RFC 0002: YAML Format Support](./0002-yaml-format.md)
- [Finite-State Machines](https://en.wikipedia.org/wiki/Finite-state_machine)
- [Event-Driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/schema)
