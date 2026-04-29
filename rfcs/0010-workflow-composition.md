# RFC 0010: Workflow Composition Extension

- **Status:** Draft
- **Author(s):** Charlie Holland (chaholl)
- **Created:** 2026-04-28
- **Updated:** 2026-04-28
- **Related Issues:** N/A

## Summary

Extend PromptPack with **`composition` as a new workflow-state orchestration mode**. RFC 0005 already defines `orchestration` as the per-state extensibility dial — `internal` (agent controls transitions), `external` (system controls), `hybrid`. This RFC adds `composition`: the state's work is driven by a declarative step graph of LLM calls, tool invocations, conditionals, and parallel fan-out, rather than by an LLM or external system. A new top-level optional field `compositions` holds the named step-graph definitions; a state in composition mode references one via a `composition` field.

The workflow state machine (RFC 0005 + RFC 0009) remains PromptPack's universal orchestration primitive: every flow is a workflow. What this RFC adds is a third option for *how* a state is orchestrated. Event-driven dialogue keeps using `internal`/`external`/`hybrid`. Procedural flows — Function-style invocations, document analysis pipelines, data extraction batches, meta-eval aggregation — use `composition`.

This consolidates orchestration under a single mental model: **one workflow per pack, one orchestration dial per state, with `composition` as a new value alongside `internal`/`external`/`hybrid`**.

## Motivation

PromptPack's existing orchestration surface is the workflow state machine (RFC 0005), refined by RFC 0009 with terminal states, loop guards, artifacts, and budgets. This is the right shape for **conversational and event-driven** flows: turn-by-turn dialogue, agent loops with cycles in a state graph, A2A handoffs.

It is not the right shape for **procedural** flows that pack authors increasingly need to express:

- Document analysis pipelines where a fixed sequence of deterministic steps (classification, parallel metadata extraction, structural parsing) precedes a bounded LLM-tool synthesis step, followed by deterministic post-processing (scoring, formatting, persistence).
- Document and data pipelines (entity extraction, classification, enrichment) that fan out over a list of items and reduce results.
- Meta-eval aggregation: cluster a batch of eval results into themes via a bounded LLM call.
- Regulated workflows where compliance requires that specific steps run in a specific order — not "the agent usually remembers."
- Function-style invocations (input → structured output) where the pack is consumed programmatically, not via conversation.

- For these, authors today either:
    - Encode procedural sequences as state machines, abusing `on_event` transitions to model "next step" — verbose, unidiomatic, and hides the deterministic shape behind event semantics that don't match.
    - Push composition into the runtime layer, losing portability across PromptPack-conformant runtimes.
    - Build a single all-encompassing prompt with 30 tools and instructions like "remember to check entitlements first" — the failure mode that motivated structured composition in the first place.

A declarative composition primitive in the spec gives pack authors a shared vocabulary for these flows that any conformant runtime can execute, while keeping the workflow state machine intact for the dialogue patterns it serves well.

### Goals

- Add `composition` as a new orchestration mode on `WorkflowState`, using RFC 0005's existing extensibility surface.
- Provide a declarative step-graph composition primitive that runs when a state is in composition mode.
- Cover the common procedural shapes — sequential, conditional, parallel — without introducing imperative control flow into the spec.
- Reuse existing PromptPack concepts (prompts, tools, evals, workflows) as the building blocks; add only what's missing.
- Preserve the runtime-agnostic principle: the spec defines structure and identifiers; runtimes own execution semantics, scheduling, persistence, parallelism, retry behavior, and parsing.
- Keep workflow as the universal orchestration primitive. Compositions are reachable only through workflow states; Function-mode invocations use a one-state terminal workflow.
- Maintain full backward compatibility — packs that don't use composition mode (and continue to use `internal`/`external`/`hybrid` orchestration with `prompt_task`) are unaffected.

### Non-Goals

- Replace, supersede, or deprecate the workflow state machine (RFC 0005) or agent loop extension (RFC 0009). Both remain Implemented; this RFC adds a new value to the `orchestration` enum and a new conditional field (`composition`) on `WorkflowState`, and otherwise leaves them unchanged.
- Define runtime execution behavior — scheduling, retry backoff, parallelism strategy, error recovery, persistence, cancellation, durability semantics. All deferred to the runtime per the spec's established pattern.
- Define expression languages, arithmetic, or imperative control flow. RFC 0005 §"Alternatives / Alternative 4" and RFC 0009 §"Alternatives / Alternative 2" rejected this; we honor the prior decision (see §"Alternatives" below for how composition expresses conditionals without an expression language).
- Define output parsing, JSON repair, or partial-streaming semantics for structured outputs. Runtime concerns.
- Define how compositions are exposed by runtimes (HTTP endpoints, MCP tools, CLI invocations, queued jobs). Runtime concerns.
- Define memory backends, session storage, or conversation history semantics. Runtime concerns.
- Define inter-runtime composition or A2A delegation (covered by RFC 0007 agents).
- Specify durable execution primitives (saga compensation, position-stable IDs, long-duration event waits). Reserved for a future extension once usage patterns demand it.

## Detailed Design

### Core Insight

A composition is a directed graph of typed **steps**. Each step is one of a small set of kinds (LLM call, tool call, conditional, parallel block) with a stable `id`, optional input bindings, optional output schema, and optional declarative modifiers. The graph is **explicit and inspectable** — there is no expression language and no imperative control flow. Conditionals are predicate objects with a constrained vocabulary; loops and dynamic fan-out are deferred to a later extension where their use cases are clearer.

The composition is the unit a runtime invokes. It accepts a structured input, executes the step graph, and returns a structured output. It is stateless across invocations by default; persistence, memoization, and resume semantics are runtime concerns.

This RFC defines **five step kinds** for v1: `prompt`, `agent`, `tool`, `branch`, `parallel`. Additional kinds (`judge`, `subflow`, `speculate`, iteration, suspension, durable-mode primitives) are reserved as Future Considerations and will land in subsequent RFCs once production usage justifies them.

### How Compositions Fit Into the PromptPack

Workflow is the universal orchestration primitive: every pack flow is a workflow. What this RFC adds is a fourth value for the existing per-state `orchestration` field. Today (RFC 0005), `orchestration` accepts `internal` (agent controls transitions), `external` (system controls), or `hybrid` (both). Under this RFC, it also accepts `composition`: the state's full orchestration is handled by a declarative step graph.

When `orchestration: composition` is set, the composition takes over the state's orchestration concerns end-to-end. Specifically:

- The composition runs to completion as defined by its step graph.
- The composition's output may map to `on_event` transitions for non-terminal states, or terminate the state for terminal ones.
- Any need for external input or human-in-the-loop within the state is handled inside the composition (via composition primitives like a future `pause` step), not by setting `orchestration: external` at the state level.

`composition` is therefore not a peer of `external`/`hybrid` in the "who emits transitions" sense — selecting it delegates the full orchestration of the state to the composition itself. Mixing `orchestration: composition` with `internal`/`external`/`hybrid` on the same state is not meaningful; the composition mode is exclusive.

Compositions are reachable only through workflow states. A pack that wants Function-style programmatic invocation defines a one-state terminal workflow with `orchestration: composition`. A pack that wants conversational dialogue with rich procedural states defines a multi-state workflow where some states orchestrate `internal`ly (LLM-driven) and others orchestrate via `composition`.

What this consolidates:

| Pack flow | Encoded as |
|---|---|
| Conversational, turn-driven, possibly cyclic (agent loops with revision) | Multi-state workflow with `orchestration: internal` states (today; unchanged) |
| Procedural request/response (intent → retrieval → reasoning → commit) | One-state terminal workflow with `orchestration: composition` |
| Mixed conversational + procedural (greet, then dispatch to procedural reasoning) | Multi-state workflow mixing `internal` and `composition` states |
| Inter-pack A2A delegation | `agents` (RFC 0007), orthogonal to the above |

### Schema Changes

#### Amendment to `WorkflowState` (RFC 0005)

Two changes:

1. **Extend the `orchestration` enum** to include `composition` as a fourth value, alongside `internal`, `external`, `hybrid`.
2. **Add a `composition` field** that references a key in the new `compositions` map. Required when `orchestration: composition`; absent otherwise.
3. **`prompt_task` becomes optional** instead of required. It remains required when `orchestration` is `internal`, `external`, `hybrid`, or omitted (default `internal`); it is not used when `orchestration: composition`.

```json
{
  "WorkflowState": {
    "type": "object",
    "description": "A single state in the workflow state machine. The orchestration mode determines how the state's work is driven; in composition mode, a declarative step graph runs in place of a prompt.",
    "additionalProperties": false,
    "properties": {
      "prompt_task": {
        "type": "string",
        "description": "Reference to a prompt key defined in the pack's prompts object. Required for orchestration modes 'internal', 'external', 'hybrid'; not used in 'composition' mode."
      },
      "orchestration": {
        "type": "string",
        "description": "How the state is orchestrated. 'internal' = agent controls transitions (default). 'external' = system controls transitions. 'hybrid' = both. 'composition' = the referenced composition fully handles the state's orchestration (work + transitions): the composition runs end-to-end, and on completion its output may map to `on_event` transitions or terminate the state. Pause/external-input semantics within composition mode are handled by composition primitives (e.g., a future `pause` step), not at the state level.",
        "enum": ["internal", "external", "hybrid", "composition"],
        "default": "internal"
      },
      "composition": {
        "type": "string",
        "description": "Reference to a composition key defined in the pack's compositions object. Required when orchestration is 'composition'; absent otherwise."
      }
    },
    "if": {
      "properties": { "orchestration": { "const": "composition" } },
      "required": ["orchestration"]
    },
    "then": {
      "required": ["composition"]
    },
    "else": {
      "required": ["prompt_task"]
    }
  }
}
```

(Other `WorkflowState` properties — `description`, `on_event`, `persistence`, `terminal`, `max_visits`, `on_max_visits`, `artifacts` — are unchanged from RFC 0005 + RFC 0009.)

#### New Top-Level Field: `compositions`

```json
{
  "compositions": {
    "type": "object",
    "description": "Map of composition name to composition definition. Each composition declares a named step graph that a runtime may invoke as a structured-input/structured-output unit. Compositions are independent of and complementary to the `workflow` state machine (RFC 0005).",
    "additionalProperties": { "$ref": "#/$defs/Composition" }
  }
}
```

#### New Definition: `Composition`

```json
{
  "Composition": {
    "type": "object",
    "description": "A named step graph defining a procedural composition over the pack's prompts, tools, and evals.",
    "required": ["version", "steps"],
    "additionalProperties": false,
    "properties": {
      "version": {
        "type": "integer",
        "const": 1,
        "description": "Composition format version. Currently 1."
      },
      "description": {
        "type": "string",
        "description": "Human-readable description of what this composition does."
      },
      "input_schema": {
        "type": "string",
        "description": "Reference to a JSON Schema declaring the structured input shape. Path or fragment reference."
      },
      "output_schema": {
        "type": "string",
        "description": "Reference to a JSON Schema declaring the structured output shape."
      },
      "output": {
        "type": "string",
        "description": "Step ID whose output is the composition's output. If omitted, runtimes should treat the last step's output as the composition output."
      },
      "steps": {
        "type": "array",
        "description": "Ordered array of step definitions. Order is logical; control flow is determined by the steps themselves (sequential by default; branches and parallels alter flow).",
        "items": { "$ref": "#/$defs/Step" },
        "minItems": 1
      },
      "engine": {
        "type": "object",
        "description": "Runtime-specific configuration (e.g. budgets, telemetry, scheduling hints). Per the established pattern (RFC 0005, RFC 0009), this is an opaque escape hatch with no schema enforcement.",
        "additionalProperties": true
      }
    }
  }
}
```

#### New Definition: `Step`

```json
{
  "Step": {
    "type": "object",
    "description": "A single step in a composition's step graph. The `kind` discriminator selects the step shape.",
    "required": ["id", "kind"],
    "properties": {
      "id": {
        "type": "string",
        "description": "Stable identifier for this step. Must be unique within the composition. Used for output references, eval attachment, and trace records.",
        "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$"
      },
      "kind": {
        "type": "string",
        "description": "Step kind. v1 conventional values: 'prompt', 'agent', 'tool', 'branch', 'parallel'. Following the RFC 0006 Eval.type pattern, this is a free-form string with documented conventional values; runtimes are free to support additional kinds prefixed by a vendor namespace (e.g. 'omnia.judge')."
      },
      "description": {
        "type": "string"
      },
      "depends_on": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Optional explicit predecessor step IDs. If omitted, the step is treated as sequentially following the prior step in `steps[]`. Required only when steps run after a `branch` or `parallel` and need to declare a join point."
      },
      "modifiers": {
        "$ref": "#/$defs/StepModifiers",
        "description": "Optional declarative modifiers (retry, timeout, eval attachment, etc.). Modifier semantics are runtime-defined."
      }
    },
    "oneOf": [
      { "$ref": "#/$defs/PromptStep" },
      { "$ref": "#/$defs/AgentStep" },
      { "$ref": "#/$defs/ToolStep" },
      { "$ref": "#/$defs/BranchStep" },
      { "$ref": "#/$defs/ParallelStep" }
    ]
  }
}
```

#### Step Kinds

**`PromptStep`** (`kind: "prompt"`) — a one-shot LLM invocation against a declared prompt task with an optional output schema. No tool calls.

```json
{
  "PromptStep": {
    "properties": {
      "kind": { "const": "prompt" },
      "prompt_task": {
        "type": "string",
        "description": "Reference to a prompt key defined in the pack's prompts object."
      },
      "input": {
        "$ref": "#/$defs/StepInput",
        "description": "Optional input binding. Variables resolved against the composition's input and prior steps' outputs."
      },
      "output_schema": {
        "type": "string",
        "description": "Reference to a JSON Schema for the expected output shape. Runtimes are responsible for parsing the LLM response against this schema."
      }
    },
    "required": ["kind", "prompt_task"]
  }
}
```

**`AgentStep`** (`kind: "agent"`) — a **bounded LLM-tool loop**. Distinct in name only from RFC 0007 `agents` (which describes A2A topology); see §"Terminology" below.

```json
{
  "AgentStep": {
    "properties": {
      "kind": { "const": "agent" },
      "prompt_task": { "type": "string" },
      "input": { "$ref": "#/$defs/StepInput" },
      "tools": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Subset of the pack's tools available to this agent step. Acts as a per-step scoped tool registry."
      },
      "termination": {
        "$ref": "#/$defs/TerminationPredicate",
        "description": "REQUIRED. The condition under which the bounded loop exits. Without an explicit termination predicate, an agent step is invalid."
      },
      "output_schema": { "type": "string" }
    },
    "required": ["kind", "prompt_task", "termination"]
  }
}
```

**`ToolStep`** (`kind: "tool"`) — a deterministic tool invocation. Distinct from `agent` in that the tool is called directly by the runtime, not via an LLM tool-call decision.

```json
{
  "ToolStep": {
    "properties": {
      "kind": { "const": "tool" },
      "tool": {
        "type": "string",
        "description": "Reference to a tool key defined in the pack's tools object."
      },
      "args": {
        "type": "object",
        "description": "Argument bindings. Variables resolved against the composition's input and prior steps' outputs.",
        "additionalProperties": true
      }
    },
    "required": ["kind", "tool"]
  }
}
```

**`BranchStep`** (`kind: "branch"`) — a conditional that picks a successor step based on a constrained predicate. **The predicate language is deliberately limited** (see §"Predicate Language" below).

```json
{
  "BranchStep": {
    "properties": {
      "kind": { "const": "branch" },
      "predicate": { "$ref": "#/$defs/Predicate" },
      "then": {
        "type": "string",
        "description": "Step ID to execute when the predicate evaluates true."
      },
      "else": {
        "type": "string",
        "description": "Step ID to execute when the predicate evaluates false."
      }
    },
    "required": ["kind", "predicate", "then"]
  }
}
```

**`ParallelStep`** (`kind: "parallel"`) — a static fan-out block whose branches execute concurrently and are merged by a declared reducer.

```json
{
  "ParallelStep": {
    "properties": {
      "kind": { "const": "parallel" },
      "branches": {
        "type": "array",
        "items": { "$ref": "#/$defs/Step" },
        "minItems": 2
      },
      "reduce": { "$ref": "#/$defs/Reducer" }
    },
    "required": ["kind", "branches", "reduce"]
  }
}
```

#### Predicate Language

Predicates use a **constrained, declarative shape** — not an expression language. RFC 0005 §"Alternative 4" and RFC 0009 §"Alternative 2" rejected imperative DSLs for the spec on grounds of security risk, complexity, and unwanted business logic. We honor that. Authors who need complex conditions emit a boolean from a `prompt` step and branch on its output.

```json
{
  "Predicate": {
    "oneOf": [
      { "$ref": "#/$defs/ComparePredicate" },
      { "$ref": "#/$defs/ExistsPredicate" },
      { "$ref": "#/$defs/AllOfPredicate" },
      { "$ref": "#/$defs/AnyOfPredicate" },
      { "$ref": "#/$defs/NotPredicate" }
    ]
  },
  "ComparePredicate": {
    "properties": {
      "path": {
        "type": "string",
        "description": "Reference to a value via dot-notation against the composition's input and step outputs. Example: '${classify.output.intent}'."
      },
      "op": {
        "type": "string",
        "enum": ["equals", "not_equals", "in", "not_in", "less_than", "less_than_or_equals", "greater_than", "greater_than_or_equals"]
      },
      "value": { "description": "Literal comparison value (string, number, boolean, or array for in/not_in)." }
    },
    "required": ["path", "op", "value"]
  },
  "ExistsPredicate": {
    "properties": { "path": { "type": "string" }, "exists": { "type": "boolean" } },
    "required": ["path", "exists"]
  },
  "AllOfPredicate": { "properties": { "all_of": { "type": "array", "items": { "$ref": "#/$defs/Predicate" } } }, "required": ["all_of"] },
  "AnyOfPredicate": { "properties": { "any_of": { "type": "array", "items": { "$ref": "#/$defs/Predicate" } } }, "required": ["any_of"] },
  "NotPredicate": { "properties": { "not": { "$ref": "#/$defs/Predicate" } }, "required": ["not"] }
}
```

This vocabulary is sufficient for the procedural conditionals the spec needs (intent equals X, confidence below threshold, amount greater than limit, AND/OR combinations) without introducing arithmetic, function calls, or untrusted expression evaluation.

#### Reducer Vocabulary

Reducers name how a parallel block's branch outputs are merged into a single value. v1 defines three; following the RFC 0006 `Eval.type` pattern, the field is a free-form string with documented conventional values, and runtimes may support vendor-namespaced extensions.

```json
{
  "Reducer": {
    "properties": {
      "strategy": {
        "type": "string",
        "description": "v1 conventional values: 'append' (extend lists), 'replace' (last write wins), 'barrier' (collect all outputs into a named map). Additional reducers ('aggregate', 'pick') reserved for future RFCs."
      },
      "into": {
        "type": "string",
        "description": "Name under which the merged result is exposed to subsequent steps."
      }
    },
    "required": ["strategy", "into"]
  }
}
```

#### Modifier Vocabulary

Modifiers are declarative annotations on a step. v1 defines two; semantics are runtime-defined per the established pattern.

```json
{
  "StepModifiers": {
    "properties": {
      "retry": {
        "type": "object",
        "properties": {
          "max_attempts": { "type": "integer", "minimum": 1 }
        }
      },
      "eval": {
        "type": "array",
        "items": { "type": "string" },
        "description": "References to eval keys defined in the pack's evals object (RFC 0006). Runtimes may execute these inline or post-Send."
      }
    }
  }
}
```

Additional modifiers (`timeout`, `on_error`, `cache_key`, `budget`, `recall`, `persist`, `compensate`) are reserved for future RFCs.

#### Termination Predicates (for `agent` steps)

```json
{
  "TerminationPredicate": {
    "properties": {
      "max_steps": { "type": "integer", "minimum": 1 },
      "tool_called": {
        "type": "string",
        "description": "Tool name; agent terminates when the LLM successfully invokes this tool."
      }
    },
    "anyOf": [
      { "required": ["max_steps"] },
      { "required": ["tool_called"] }
    ]
  }
}
```

v1 supports two termination shapes; richer predicates (judge-based, goal-met, budget-exhausted) are reserved for a future RFC alongside additional modifier and reducer vocabularies.

#### Step Input Bindings

```json
{
  "StepInput": {
    "description": "Input binding for a step. May be a literal value, a reference to the composition input or a prior step output via dot-notation, or an object combining the two.",
    "oneOf": [
      { "type": "string", "description": "Reference of the form '${path.to.value}'." },
      { "type": "object", "additionalProperties": true }
    ]
  }
}
```

References use dot-notation against:

- `${input.X}` — the composition's structured input.
- `${stepId.output.X}` — a prior step's structured output.

This is a strict subset of the template variable system in RFC 0003. No expressions, arithmetic, or function calls.

### Specification Impact

- **New top-level field**: `compositions` added to the root pack object schema. Optional; existing packs without the field are unaffected.
- **Amendment to `WorkflowState` (RFC 0005)**: `orchestration` enum extended to include `composition`; new optional `composition` field referencing the `compositions` map; `prompt_task` becomes optional (required when `orchestration` is not `composition`). Strictly additive — packs using `internal`/`external`/`hybrid` orchestration with `prompt_task` are unchanged.
- **New definitions**: `Composition`, `Step`, `PromptStep`, `AgentStep`, `ToolStep`, `BranchStep`, `ParallelStep`, `Predicate` (and variants), `Reducer`, `StepModifiers`, `TerminationPredicate`, `StepInput`.
- **No changes to other existing definitions**: `WorkflowConfig`, `Eval`, `Tool`, `Prompt`, `PipelineConfig`, `agents` are all untouched.
- **Pack metadata**: pack authors who use `compositions` should declare the spec version that includes this RFC.

### Validation Rules

- `compositions` keys must be unique pack-wide and must not collide with reserved runtime names.
- A `WorkflowState` with `orchestration: composition` MUST set `composition` and MAY omit `prompt_task`.
- A `WorkflowState` with any other `orchestration` value (including default `internal`) MUST set `prompt_task` and MUST NOT set `composition`.
- Every `composition` reference on a `WorkflowState` must resolve to a key in the pack's `compositions` object.
- Each `Step.id` must be unique within its containing composition (including across nested `parallel.branches`).
- `Step.id` must match `^[a-zA-Z_][a-zA-Z0-9_]*$`.
- Every `prompt_task` reference in `PromptStep` and `AgentStep` must resolve to a key in the pack's `prompts` object.
- Every `tool` reference in `ToolStep` and `AgentStep.tools[]` must resolve to a key in the pack's `tools` object.
- Every `then` / `else` / `depends_on` step ID reference must resolve to a step in the same composition.
- Every `eval` modifier reference must resolve to a key in the pack's `evals` object.
- Every `${...}` reference path must resolve to either `input` or a prior step's `output`.
- `AgentStep` MUST have a `termination` predicate.
- `ParallelStep` MUST have at least two branches and a declared reducer.
- `BranchStep.predicate` MUST conform to the constrained `Predicate` shape — no free-form expressions.
- The composition graph MUST be acyclic. (Loops are deferred to a future RFC; if cyclic flow is needed, encode at the workflow state-machine layer.)

### Terminology

Three terms in the spec contain the word "agent." Disambiguating:

- **`agents` (RFC 0007)** — pack-level A2A topology. Declares which prompts of this pack are exposed as A2A-discoverable agents and how they relate to one another.
- **`workflow.states.<name>`** — a state in the conversational state machine (RFC 0005). May be marked terminal (RFC 0009) or guarded by `max_visits`.
- **`agent` step (this RFC)** — a step kind within a composition representing a *bounded LLM-tool loop*. Internal to a single composition; not visible at the A2A layer.

These are different concepts at different scopes and should not be conflated. Future extensions may rename the step kind (e.g. `tool_loop`, `bounded_agent`) if the overload becomes practically confusing; v1 retains `agent` for vocabulary consistency with widely-used agent-framework terminology.

### Runtime Support Levels

Following the pattern established by RFC 0001, RFC 0005, RFC 0006, RFC 0007, RFC 0008, RFC 0009:

- **Level 0 (ignore):** Runtime treats `compositions` as an unknown field and ignores it. Packs remain functional for prompts, tools, workflows, and other extensions.
- **Level 1 (validate):** Runtime parses and schema-validates `compositions` but does not execute them. Useful for pack-authoring tooling.
- **Level 2 (execute v1):** Runtime executes the v1 step kinds (`prompt`, `agent`, `tool`, `branch`, `parallel`), v1 reducers (`append`, `replace`, `barrier`), v1 modifiers (`retry`, `eval`), and the constrained predicate language. Execution semantics — scheduling, parallelism strategy, retry behavior, output parsing, eval attachment — are runtime-defined.
- **Level 3 (vendor extensions):** Runtime supports additional vendor-namespaced step kinds, reducers, or modifiers beyond the v1 vocabulary.

Level 0 is the minimum conformance bar. A runtime that does not implement compositions remains a conformant PromptPack runtime.

## Examples

All examples below illustrate procedural document-analysis flows — Function-mode packs invoked programmatically with a structured input and structured output. Each example builds on the previous one to show progressively more of the v1 vocabulary.

### Example 1: Single-Step Composition

A pack that classifies a document into one of a fixed set of types. The workflow is a single terminal state; the composition is one prompt step.

```yaml
workflow:
  version: 1
  entry: main
  states:
    main:
      orchestration: composition
      composition: classify_document
      terminal: true

compositions:
  classify_document:
    version: 1
    description: "Classify a technical document into its type."
    input_schema: "schemas/document.json"
    output_schema: "schemas/document-type.json"
    output: "classify"
    steps:
      - id: classify
        kind: prompt
        prompt_task: "doc_classifier"
        input: "${input.text}"
        output_schema: "schemas/document-type.json"
```

### Example 2: Sequential Composition with a Branch

A pack that classifies a document and routes to a type-specific extractor. Demonstrates `branch` with a constrained predicate.

```yaml
workflow:
  version: 1
  entry: main
  states:
    main:
      orchestration: composition
      composition: analyze_document
      terminal: true

compositions:
  analyze_document:
    version: 1
    description: "Classify a document and route to a type-specific analyzer."
    input_schema: "schemas/document.json"
    output_schema: "schemas/analysis.json"
    steps:
      - id: classify
        kind: prompt
        prompt_task: "doc_classifier"
        input: "${input.text}"
        output_schema: "schemas/document-type.json"

      - id: route
        kind: branch
        predicate:
          path: "${classify.output.type}"
          op: equals
          value: "research_paper"
        then: extract_paper
        else: extract_general

      - id: extract_paper
        kind: prompt
        prompt_task: "research_paper_extractor"
        input: "${input.text}"
        output_schema: "schemas/analysis.json"

      - id: extract_general
        kind: prompt
        prompt_task: "general_doc_extractor"
        input: "${input.text}"
        output_schema: "schemas/analysis.json"
```

### Example 3: Parallel Metadata Extraction Followed by an Agent Step

A deeper analysis pack: extract several views of a document in parallel (deterministic tool calls and small prompts), then synthesize with a bounded agent step that has access to lookup tools.

```yaml
workflow:
  version: 1
  entry: main
  states:
    main:
      orchestration: composition
      composition: deep_analyze
      terminal: true

compositions:
  deep_analyze:
    version: 1
    description: "Extract metadata in parallel, then synthesize a structured analysis."
    input_schema: "schemas/document.json"
    output_schema: "schemas/analysis.json"
    steps:
      - id: extract_metadata
        kind: parallel
        branches:
          - id: title
            kind: prompt
            prompt_task: "title_extractor"
            input: "${input.text}"
          - id: keywords
            kind: prompt
            prompt_task: "keyword_extractor"
            input: "${input.text}"
          - id: structure
            kind: tool
            tool: "doc.parse_structure"
            args: { content: "${input.text}" }
          - id: citations
            kind: tool
            tool: "doc.extract_citations"
            args: { content: "${input.text}" }
        reduce:
          strategy: barrier
          into: metadata

      - id: synthesize
        kind: agent
        prompt_task: "doc_analyzer"
        input: "${extract_metadata.output.metadata}"
        tools: ["doc.section_lookup", "ref.search", "kb.lookup"]
        termination:
          max_steps: 10
        output_schema: "schemas/analysis.json"
        modifiers:
          eval: ["analysis_quality"]
```

### Example 4: Composite Predicate

A composite predicate gating a deep-review path without an expression language.

```yaml
- id: needs_deep_review
  kind: branch
  predicate:
    any_of:
      - path: "${assess.output.confidence}"
        op: less_than
        value: 0.8
      - path: "${assess.output.complexity}"
        op: greater_than
        value: 7
      - path: "${assess.output.flagged_terms}"
        op: not_equals
        value: []
  then: deep_review
  else: quick_summary
```

## Drawbacks

- **Function-mode packs require a workflow wrapper.** A pack that's purely procedural (e.g., a meta-eval aggregator) must declare a single-state terminal workflow whose task is a composition, even though there's no dialogue. This is small ceremony — six lines of YAML — but it is ceremony. Mitigation: documentation patterns that show this as a standard idiom; runtime tooling can hide the wrapper for purely Function-mode invocations if desired.
- **Schema growth.** New top-level `compositions` field, several new definitions, and an amendment to `WorkflowState`. Validators and pack tooling must support the new shapes. Mitigated by Level 0 conformance — runtimes that don't care can ignore.
- **Constrained predicate language is more verbose than expressions.** Authors writing complex conditions emit boolean outputs from `prompt` steps and branch on them, rather than writing inline expressions. This is intentional (per RFC 0005 / RFC 0009 prior decisions) but is a real ergonomic cost. Mitigation: documentation patterns showing how to "lift" a complex predicate into a `prompt` step.
- **Terminology overload of "agent."** Three uses across the spec (RFC 0007 agents, workflow agent loops via RFC 0009, this RFC's `agent` step). Mitigation: explicit terminology section in spec docs; possible future rename of the step kind if it proves confusing.
- **Step kind enumeration is finite.** Authors with use cases not covered by v1's five kinds must wait for future RFCs (or use vendor-namespaced kinds with reduced portability). Mitigated by selecting the most broadly useful five and reserving the rest as a tracked roadmap.
- **No iteration in v1.** `foreach`, `map`, `while`, and `refine` patterns deferred. Authors needing iteration must either encode it at the workflow state-machine layer (cycles via `on_event` and `max_visits`, per RFC 0009) or wait for a follow-on RFC. Reasonable for v1 because most procedural use cases are sequential or static-parallel.

## Alternatives

### Alternative 1: Sibling top-level orchestration primitive

Make `compositions` a top-level orchestration primitive parallel to `workflow` — invoked directly by the runtime, not through a workflow state. Pack authors pick which top-level primitive their pack uses based on flow shape.

**Why not chosen:** two parallel top-level orchestration primitives produce a "which one do I use?" decision at the start of every pack-authoring exercise, and the answer is never crisp at the boundary (e.g., a procedural pack that occasionally needs an event hook). The chosen design keeps **workflow as the universal entry point** and makes composition a richer alternative to a single-prompt task inside a state. One mental model; the question collapses to "what runs in this state?" rather than "which top-level primitive?"

### Alternative 2: Imperative DSL with expression language

Allow free-form expressions (`${classify.output.confidence < 0.8 || amount > 500}`), arithmetic, function calls.

**Why not chosen:** RFC 0005 §"Alternatives / Alternative 4" and RFC 0009 §"Alternatives / Alternative 2" explicitly rejected imperative DSLs for the spec on grounds of: misalignment with PromptPack's declarative philosophy, security concerns (executing untrusted expressions), implementation complexity, and pushing business logic into the spec (an explicit non-goal). We honor those prior rejections. The constrained predicate language in this RFC provides sufficient expressiveness for procedural conditionals while preserving those properties.

### Alternative 3: Inline compositions inside `WorkflowState`

Instead of a top-level `compositions` map referenced by name, embed the composition definition directly inside the state.

**Why not chosen:** named compositions in a top-level map enable reuse — a single composition can be referenced from multiple states (e.g., from both a primary dispatch state and a fallback state) and is easier to share, version, and document. Inline-only compositions force duplication and make state definitions much larger. The map shape mirrors `prompts`, `tools`, `evals`, `skills`.

### Alternative 4: Defer to runtime-specific configuration

Don't define composition in the spec at all; let each runtime invent its own.

**Why not chosen:** PromptPack's central value is that a pack runs across conformant runtimes. Composition is becoming a primary use case for procedural agent platforms; without a spec primitive, packs that use composition become runtime-locked. The point of the spec is to prevent exactly that.

### Alternative 5: Adopt an existing workflow IDL (BPMN, Argo, Temporal IDL)

Reuse an established workflow language as PromptPack's composition primitive.

**Why not chosen:** existing workflow IDLs are designed for general computation and bring substantial surface area irrelevant to LLM-centric packs (dynamic worker pools, sub-second timer semantics, durable cluster topologies). They also encode imperative control flow that the spec has rejected. A purpose-built primitive that reuses PromptPack's existing `prompts`, `tools`, `evals` is leaner and more idiomatic.

### Alternative 6: True unification — single graph primitive replacing both

Collapse `workflow` and `compositions` into one primitive: directed graph of nodes with multiple transition types (`next`, `on_event`, `when`, `parallel`).

**Why not chosen:** would require deprecating or restructuring RFC 0005 + RFC 0009, both Implemented and shipped at v1.3, with substantial ecosystem cost on existing adapters. The state-machine and step-graph models also genuinely express different flow shapes (cyclic dialogue vs acyclic procedure); folding them creates a generic primitive where the specialization is hidden in vocabulary choice — worse for authors. The chosen design (workflow universal, composition as a richer state task) achieves consolidation without breaking what's shipped.

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

Packs that don't use `compositions` are unaffected. Existing workflow definitions (RFC 0005, RFC 0009), agents (RFC 0007), evals (RFC 0006), and other extensions are unchanged. Conformant runtimes that don't implement composition execution remain conformant (Level 0).

### Migration Path

No migration is required for existing packs. Pack authors who previously encoded procedural flows as event-driven state machines may, at their option, restructure them as one-state workflows with `orchestration: composition` — this is a refactor, not a forced migration. The workflow state machine remains the universal orchestration primitive; what's new is a third orchestration mode.

For runtimes:

1. **Level 0 → Level 1**: implement schema validation for the new `compositions` field and the amended `WorkflowState` (extended `orchestration` enum, new conditional `composition` field). Modest effort.
2. **Level 1 → Level 2**: implement step handlers for the v1 kinds, reducers, modifiers, and predicate language. The workflow executor must additionally recognise `orchestration: composition`, resolve the state's `composition` reference, and dispatch into the composition step graph. Substantial effort, comparable to implementing RFC 0005's workflow execution plus a new step interpreter.

## Unresolved Questions

1. **Composition output binding.** Should the `output` field on a `Composition` (which step's output is the composition's output) be required or default to "the last sequentially-executed step"? Current draft: optional with documented default of "last step." Reasonable for v1; revisit if ambiguity arises in practice.
2. **Implicit vs explicit `depends_on`.** Current draft: sequential by default; `depends_on` required only after `branch` or `parallel`. Alternative: make all dependencies explicit. Trade-off is verbosity vs. clarity. Sequential default mirrors how authors think and is the established style across declarative workflow languages (GitHub Actions, BPMN). Worth confirming during prototyping.
3. **Vendor namespacing convention for step kinds.** Following RFC 0006 `Eval.type` pattern, free-form strings allow `omnia.judge`, `langchain.refine`, etc. Should the spec recommend a namespace style (`vendor.kind`, `vendor:kind`, reverse-DNS)? RFC 0006 doesn't formalize this; consistency would help.
4. **Predicate path syntax.** Current draft uses `${classify.output.intent}` — same form as RFC 0003 template variables. Should the predicate's `path` field accept the bare dot-path (`classify.output.intent`) for compactness, or always require the `${...}` wrapper? Wrapper is more consistent with RFC 0003 but less readable in nested predicate structures.
5. **Step ID uniqueness across nested `parallel.branches`.** Current draft requires unique within the entire composition. Alternative: scope IDs to the immediate parallel block. Global uniqueness simplifies references but constrains author choice. Worth deciding during prototyping.
6. **Reserving step kind names.** Should the spec list `judge`, `subflow`, `speculate`, `foreach`, `map`, `while`, `pause`, `await_event`, `compensate` as reserved future kinds (preventing vendor use) or leave them entirely unreserved until a future RFC defines them? Reserving prevents conflict; not reserving allows vendor experimentation.
7. **Interaction with `agents` (RFC 0007).** May a composition `step` invoke another agent (declared via `agents.members`) via a special step kind like `delegate`? Reasonable to defer to a future RFC; flagged here to avoid surprise.
8. **Error semantics on unhandled branch outputs.** When a `branch` predicate evaluates false and `else` is omitted, current draft is silent on whether execution skips to the next sequentially-following non-branched step or terminates. Default should probably be "skip to next" but worth confirming.
9. **Engine block scoping.** Current draft places `engine` at the composition level only. Should individual steps also have an `engine` escape hatch for runtime-specific per-step configuration? Likely yes; deferred until a real use case.

## Implementation Plan

1. **Phase 1: Schema and validation**
   - [ ] Add `compositions` field and definitions to `schema/promptpack.schema.json`
   - [ ] Add validation tests covering ID uniqueness, reference resolution, predicate shape, agent termination requirement
   - [ ] Update pack examples in `promptpack-docs/`

2. **Phase 2: Reference documentation**
   - [ ] Add composition primitive documentation alongside RFC 0005 workflow docs
   - [ ] Decision guide: "when a state should use `orchestration: composition` vs `internal`/`external`/`hybrid`"
   - [ ] Worked examples covering the v1 step kinds, including the one-state Function-mode wrapper idiom

3. **Phase 3: Reference runtime support (informational)**
   - [ ] First runtime (PromptKit) implements Level 2
   - [ ] Document execution-semantics conventions PromptKit chooses (parallelism, retry, parsing) as a reference for other runtimes — non-normative

4. **Phase 4: Adoption signal review**
   - [ ] After ~6 months, review which step kinds, reducers, and modifiers from the deferred set have surfaced real demand
   - [ ] Open follow-on RFCs for the highest-signal additions (likely `judge`, `subflow`, iteration)

## Testing Strategy

### Validation Tests

- A pack with a `compositions` field validates against the schema.
- A composition with duplicate step IDs fails validation.
- A composition with an unresolved `prompt_task`, `tool`, or `eval` reference fails validation.
- A composition with a cyclic step graph fails validation.
- An `agent` step missing `termination` fails validation.
- A `parallel` step with fewer than two branches fails validation.
- A `parallel` step missing `reduce` fails validation.
- A `branch` predicate using arithmetic, function calls, or arbitrary expressions fails validation.
- A `${...}` reference to a non-existent path fails validation.

### Compatibility Tests

- A pack without `compositions` is unaffected by introduction of this RFC.
- A Level-0 runtime (ignoring `compositions`) loads such packs successfully and executes other features normally.
- Existing RFC 0005 workflows in a pack that also defines `compositions` continue to execute identically.

## Documentation Impact

- [ ] New section in pack reference documentation: "Compositions"
- [ ] Decision guide: workflow vs compositions
- [ ] Worked example: technical document analyzer
- [ ] Updated `promptpack.schema.json` with full definitions
- [ ] Cross-references from RFC 0005 / RFC 0009 / RFC 0007 to the new RFC
- [ ] Terminology section disambiguating "agent" across RFC 0007, RFC 0009, and this RFC

## Future Considerations

This RFC is deliberately scoped tight. The following are all candidates for follow-on RFCs once production usage signals real demand:

### Additional Step Kinds

- **`judge`** — LLM-as-evaluator over a prior step's output, emitting score + rationale. Likely the highest-priority follow-on; pairs naturally with `eval` modifier.
- **`refine`** — paired prompt + judge with a retry budget; common pattern, currently expressible via composition but worth a sugar primitive.
- **`subflow`** — recursive invocation of another composition. Enables larger compositions assembled from reusable units.
- **`speculate`** — race N alternatives, pick best. Useful for prompt-variant racing once eval volume warrants it.
- **`foreach` / `map` / `while`** — iteration. `foreach` over static collections, `map` for dynamic LLM-driven decomposition, `while` until predicate. Significant scope; warrants a dedicated RFC.
- **`pause`** — human-in-the-loop suspension with a typed `resume_schema`. Required for HITL workflows; depends on runtime durability semantics.

### Additional Modifiers

- **`timeout`** — per-step kill-switch.
- **`on_error → fallback`** — forward recovery.
- **`cache_key`** — content-addressed memoization.
- **`budget`** — typed: tokens / wallclock / steps. Distinct from RFC 0009's workflow-level `engine.budget`; this is per-step.
- **`recall` / `persist`** — memory hooks.
- **`compensate`** — saga undo (durable mode only).

### Additional Reducers

- **`aggregate`** — binary op (sum, max, set-union).
- **`pick`** — first-or-best by scoring fn (used by `speculate`).
- **User-defined reducers** — extensibility once the built-ins prove insufficient.

### Durable Mode

A future RFC may introduce a `durable: true` flag on compositions enabling Temporal/Inngest-style semantics: position-stable step IDs (idempotent re-execution), `await_event` step kind for productive long waits, `compensate:` modifier for backward recovery. Required for multi-day enterprise/regulated workflows. Deferred until a concrete use case emerges.

### Composition × Agents Integration

A future RFC may permit a composition step to invoke an agent declared via RFC 0007 `agents.members` as an A2A delegation. This bridges intra-pack composition with inter-pack delegation.

---

## Revision History

- **2026-04-28:** Initial draft.

## References

- [RFC 0001: Core Schema](./0001-core-schema.md)
- [RFC 0002: YAML Format](./0002-yaml-format.md)
- [RFC 0003: Template Variables](./0003-template-variables.md)
- [RFC 0005: Workflow Specification Extension](./0005-workflow-extension.md)
- [RFC 0006: Evals Extension](./0006-evals-extension.md)
- [RFC 0007: Agents Extension](./0007-agents-extension.md)
- [RFC 0009: Agent Loop Extension](./0009-agent-loops.md)
