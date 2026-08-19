---
title: "How to Add a Composition"
sidebar:
  order: 2
---

Add a **composition** to a PromptPack so a workflow state runs a declarative step graph — classify → branch → extract, or parallel fan-out → synthesize — instead of a single prompt. Compositions express *procedural* flows (document pipelines, data extraction, request → reason → commit) that don't fit the turn-by-turn dialogue shape.

## Prerequisites

- A PromptPack with the prompts/tools you want to orchestrate (v1.5+ schema)
- Understanding of [Pack Structure](/docs/spec/structure) and [Workflows](/docs/guides/add-workflow)
- Familiarity with the [Compositions schema reference](/docs/spec/schema-guide#compositions-v15)

## When to Use Composition vs internal / external / hybrid

A workflow state's `orchestration` value chooses the shape of its flow. `composition` is a *fourth* value alongside the three event-driven modes:

| Orchestration | Shape | Reach for it when |
|--------------|-------|-------------------|
| `internal` (default) | Conversational, agent emits transitions | Turn-by-turn dialogue, agent loops with cycles |
| `external` | Conversational, system emits transitions | Human-in-the-loop, system-controlled routing |
| `hybrid` | Conversational, both | Mixed control dialogue |
| `composition` | **Procedural, step graph** | Fixed sequences: classify → branch → extract, parallel fan-out → synthesize, Function-mode packs |

Choose `composition` when the flow is deterministic and procedural — the steps and their order are known up front, not driven by conversation events. Choose `internal`/`external`/`hybrid` when the flow is dialogue that converges over turns.

:::info Workflow is still the universal entry point
Compositions are reached *only* through a workflow state. A purely procedural pack is just a one-state terminal workflow whose state is in composition mode — see the [Function-mode wrapper](#function-mode-the-one-state-wrapper-idiom) below.
:::

## Step 1: Wire a State to a Composition

Set `orchestration: composition` on a state and point its `composition` field at a key in the top-level `compositions` map. A composition-mode state omits `prompt_task` (it's required only for the other modes):

```json
{
  "workflow": {
    "version": 1,
    "entry": "main",
    "states": {
      "main": {
        "orchestration": "composition",
        "composition": "analyze_document",
        "terminal": true
      }
    }
  }
}
```

Rules:
- A `composition`-mode state **must** set `composition` and **may** omit `prompt_task`.
- Every other state (including the default `internal`) **must** set `prompt_task` and **must not** set `composition`.
- The `composition` value must resolve to a key in `compositions`.
- `composition` is exclusive — don't combine it with `internal`/`external`/`hybrid` semantics on the same state.

## Step 2: Define the Composition

Add a top-level `compositions` map, keyed by name. Each composition declares a `version` (currently `1`) and an ordered `steps` array. Order is logical: steps run sequentially by default; `branch` and `parallel` alter the flow. The graph must be **acyclic**.

```json
{
  "compositions": {
    "analyze_document": {
      "version": 1,
      "description": "Classify a document and route to a type-specific analyzer.",
      "input_schema": "schemas/document.json",
      "output_schema": "schemas/analysis.json",
      "steps": [ /* … */ ]
    }
  }
}
```

Optional fields: `input_schema` / `output_schema` (references to JSON Schemas), `output` (the step ID whose output is the composition's output — defaults to the last step), and `engine` (opaque runtime config).

## Step 3: Add Steps

A composition is a directed acyclic graph of typed steps. v1 defines five kinds. Every step has a unique `id` (pattern `^[a-zA-Z_][a-zA-Z0-9_]*$`) and a `kind`.

### `prompt` — one-shot LLM call

```json
{
  "id": "classify",
  "kind": "prompt",
  "prompt_task": "doc_classifier",
  "input": "${input.text}",
  "output_schema": "schemas/document-type.json"
}
```

### `agent` — bounded LLM-tool loop

An agent step runs an LLM with a scoped tool registry until its **required** `termination` predicate is met (`max_steps` and/or `tool_called`). Without `termination` the step is invalid.

```json
{
  "id": "synthesize",
  "kind": "agent",
  "prompt_task": "doc_analyzer",
  "input": "${extract_metadata.output.metadata}",
  "tools": ["doc.section_lookup", "ref.search"],
  "termination": { "max_steps": 10 },
  "output_schema": "schemas/analysis.json"
}
```

### `tool` — deterministic call

The runtime calls the tool directly (not via an LLM tool-call decision):

```json
{
  "id": "structure",
  "kind": "tool",
  "tool": "doc.parse_structure",
  "args": { "content": "${input.text}" }
}
```

### `branch` — conditional

Picks `then` (required) or `else` (optional) based on a constrained predicate — see [Step 4](#step-4-gate-flow-with-predicates).

```json
{
  "id": "route",
  "kind": "branch",
  "predicate": { "path": "${classify.output.type}", "op": "equals", "value": "research_paper" },
  "then": "extract_paper",
  "else": "extract_general"
}
```

### `parallel` — fan-out + reduce

See [Step 5](#step-5-fan-out-with-parallel--reduce).

### Step input bindings

Steps wire together with `${...}` references — a strict subset of the template-variable system, with **no expressions**:

- `${input.X}` — the composition's structured input.
- `${stepId.output.X}` — a prior step's structured output.

## Step 4: Gate Flow with Predicates

`branch` predicates use a **constrained, declarative** vocabulary — not an expression language. A predicate is exactly one of:

- **Compare** — `{ path, op, value }` with `op` ∈ `equals`, `not_equals`, `in`, `not_in`, `less_than`, `less_than_or_equals`, `greater_than`, `greater_than_or_equals`.
- **Exists** — `{ path, exists: true|false }`.
- **Combinators** — `{ all_of: [...] }` (AND), `{ any_of: [...] }` (OR), `{ not: ... }`.

```json
{
  "id": "needs_deep_review",
  "kind": "branch",
  "predicate": {
    "any_of": [
      { "path": "${assess.output.confidence}", "op": "less_than", "value": 0.8 },
      { "path": "${assess.output.complexity}", "op": "greater_than", "value": 7 }
    ]
  },
  "then": "deep_review",
  "else": "quick_summary"
}
```

:::tip Lifting complex conditions
Need a condition the predicate language can't express? Emit a boolean from a `prompt` step and branch on it: `{ "path": "${gate.output.proceed}", "op": "equals", "value": true }`. This keeps business logic out of the spec while staying declarative.
:::

## Step 5: Fan Out with parallel + reduce

A `parallel` step runs **≥2 branches** concurrently and merges them with a required `reduce`:

```json
{
  "id": "extract_metadata",
  "kind": "parallel",
  "branches": [
    { "id": "title",    "kind": "prompt", "prompt_task": "title_extractor",   "input": "${input.text}" },
    { "id": "keywords", "kind": "prompt", "prompt_task": "keyword_extractor", "input": "${input.text}" },
    { "id": "structure","kind": "tool",   "tool": "doc.parse_structure", "args": { "content": "${input.text}" } }
  ],
  "reduce": { "strategy": "barrier", "into": "metadata" }
}
```

Reducer strategies:
- **`append`** — extend lists across branch outputs.
- **`replace`** — last write wins.
- **`barrier`** — collect every branch output into a named map.

The merged result lands under `into`, read downstream as `${extract_metadata.output.metadata}`.

## Step 6 (optional): Add Modifiers

Any step can carry `modifiers`:

```json
{
  "id": "synthesize",
  "kind": "agent",
  "prompt_task": "doc_analyzer",
  "termination": { "max_steps": 10 },
  "modifiers": {
    "retry": { "max_attempts": 2 },
    "eval": ["analysis_quality"]
  }
}
```

- **`retry`** — `{ "max_attempts": N }` retry budget for the step.
- **`eval`** — references to keys in the pack's `evals` object (RFC 0006); runtimes may run them inline or post-Send.

## Function-Mode: the One-State Wrapper Idiom

A pack that is purely procedural — no dialogue — is just a one-state terminal workflow whose state is in composition mode. This six-line wrapper is the standard idiom for invoking a pack programmatically (input → structured output):

```json
{
  "workflow": {
    "version": 1,
    "entry": "main",
    "states": {
      "main": { "orchestration": "composition", "composition": "analyze_document", "terminal": true }
    }
  }
}
```

The workflow state machine stays the universal entry point; the composition does the procedural work.

## Complete Example

A document analyzer that classifies and routes to a type-specific extractor:

```json
{
  "$schema": "https://promptpack.org/schema/v1.5.0/promptpack.schema.json",
  "id": "document-analyzer",
  "name": "Document Analyzer",
  "version": "1.0.0",
  "template_engine": { "version": "v1", "syntax": "{{variable}}" },
  "prompts": {
    "doc_classifier": {
      "id": "doc_classifier", "name": "Classifier", "version": "1.0.0",
      "system_template": "Classify the document. Return JSON: { \"type\": \"research_paper\" | \"general\" }.\n\n{{input}}",
      "parameters": { "temperature": 0.0 }
    },
    "research_paper_extractor": {
      "id": "research_paper_extractor", "name": "Paper Extractor", "version": "1.0.0",
      "system_template": "Extract title, authors, abstract, findings.\n\n{{input}}",
      "parameters": { "temperature": 0.2 }
    },
    "general_doc_extractor": {
      "id": "general_doc_extractor", "name": "General Extractor", "version": "1.0.0",
      "system_template": "Extract a summary and main entities.\n\n{{input}}",
      "parameters": { "temperature": 0.2 }
    }
  },
  "workflow": {
    "version": 1,
    "entry": "main",
    "states": {
      "main": { "orchestration": "composition", "composition": "analyze_document", "terminal": true }
    }
  },
  "compositions": {
    "analyze_document": {
      "version": 1,
      "description": "Classify a document and route to a type-specific analyzer.",
      "steps": [
        { "id": "classify", "kind": "prompt", "prompt_task": "doc_classifier", "input": "${input.text}" },
        {
          "id": "route", "kind": "branch",
          "predicate": { "path": "${classify.output.type}", "op": "equals", "value": "research_paper" },
          "then": "extract_paper", "else": "extract_general"
        },
        { "id": "extract_paper",   "kind": "prompt", "prompt_task": "research_paper_extractor", "input": "${input.text}" },
        { "id": "extract_general", "kind": "prompt", "prompt_task": "general_doc_extractor",   "input": "${input.text}" }
      ]
    }
  }
}
```

## Validation Checklist

- [ ] The composition-mode state sets `composition` and omits `prompt_task`
- [ ] Every non-composition state still sets `prompt_task` and omits `composition`
- [ ] The state's `composition` resolves to a key in `compositions`
- [ ] Each `Step.id` is unique within the composition (including nested `parallel.branches`) and matches `^[a-zA-Z_][a-zA-Z0-9_]*$`
- [ ] Every `prompt_task`, `tool`, `eval`, and `then`/`else`/`depends_on` reference resolves
- [ ] Every `${...}` path resolves to `input` or a prior step's `output`
- [ ] Each `agent` step has a `termination` predicate
- [ ] Each `parallel` step has ≥2 branches and a `reduce`
- [ ] Each `branch` predicate uses the constrained shape (no free-form expressions)
- [ ] The composition graph is acyclic
- [ ] Pack validates against the v1.5 JSON schema

:::warning Common Mistakes
- **Missing `termination` on an agent step**: agent steps require it — without it the loop is unbounded and the pack fails validation.
- **Single-branch `parallel`**: a `parallel` needs at least two branches and a `reduce`.
- **Expression in a predicate**: `${a < 0.8 || b > 7}` is not valid. Use a compare/combinator predicate, or lift the logic into a `prompt` step that emits a boolean.
- **Cyclic graph**: if you need a loop, encode it at the workflow state-machine layer (`on_event` + `max_visits`), not inside a composition.
:::

## Next Steps

- [How to Add a Workflow](/docs/guides/add-workflow) — the state machine compositions plug into
- [Architecture Patterns](/docs/spec/architecture-patterns#workflow-composition-integration-v15) — procedural vs conversational orchestration
- [Document Analyzer example](/docs/spec/examples#procedural-document-analyzer-with-composition-v15) — full composition pack
- [Compositions schema reference](/docs/spec/schema-guide#compositions-v15) — every property table
- [RFC 0010: Workflow Composition](/docs/rfcs/workflow-composition) — design rationale
