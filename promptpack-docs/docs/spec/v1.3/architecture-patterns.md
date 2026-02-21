---
sidebar_position: 3
title: "Architecture Patterns (v1.3)"
---

# Architecture Patterns

PromptPack has grown from a simple prompt-packaging format into a full-stack specification for conversational AI systems. This page explains how the major building blocks relate to each other and when to use each one.

## How the Pieces Fit Together

A PromptPack is organized in layers. Lower layers are simpler and more universal; higher layers are optional and compose on top of the lower ones.

```
┌─────────────────────────────────────────────┐
│  Agents       Inter-system discovery (A2A)  │  v1.3
├─────────────────────────────────────────────┤
│  Workflow     Intra-pack state machine      │  v1.3
├─────────────────────────────────────────────┤
│  Evals        Async quality measurement     │  v1.2
├─────────────────────────────────────────────┤
│  Validators   Inline guardrails             │  v1.0
├─────────────────────────────────────────────┤
│  Tools & Fragments   Shared resources       │  v1.0
├─────────────────────────────────────────────┤
│  Prompts      Core behavior definitions     │  v1.0
└─────────────────────────────────────────────┘
```

**Prompts** define what the LLM does. **Tools & Fragments** provide shared resources that prompts reference. **Validators** add inline guardrails that block bad output. **Evals** add async quality measurement that scores and reports. **Workflow** orchestrates transitions between prompts via a state machine. **Agents** expose prompts as discoverable services via the A2A protocol.

Each layer is optional — a valid PromptPack only requires `id`, `name`, `version`, `template_engine`, and at least one prompt. You adopt higher layers only when you need them.

## Workflows vs Agents

These two v1.3 features solve different problems and can be used independently or together.

| Aspect | Workflow | Agents |
|--------|----------|--------|
| **Purpose** | Orchestrate transitions *within* a pack | Make prompts discoverable *across* systems |
| **Mechanism** | State machine with event-driven transitions | A2A Agent Cards with metadata and tags |
| **Scope** | Intra-pack (states reference prompt keys) | Inter-system (external services discover agents) |
| **Requires** | `workflow` top-level field | `agents` top-level field |
| **Entry point** | `workflow.entry` — first state in the machine | `agents.entry` — default agent for incoming requests |
| **Key benefit** | Automated routing without caller logic | Multi-agent discovery and interoperability |

### Decision Matrix

| Scenario | Use Workflow? | Use Agents? |
|----------|:---:|:---:|
| Single prompt, no routing needed | — | — |
| Multiple prompts, caller chooses which to invoke | — | — |
| Automated routing between prompts based on events | Yes | — |
| Prompts need to be discoverable by external systems | — | Yes |
| Automated routing *and* external discovery | Yes | Yes |
| Standalone agents communicating via A2A (no internal state machine) | — | Yes |

:::info
Workflow and agents are orthogonal. A prompt can participate in a workflow state *and* be an agent member simultaneously. The workflow manages intra-pack state; agents manage inter-system discovery.
:::

## Validators vs Evals

Both assess LLM output quality, but they operate at different points in the pipeline and serve different purposes.

| Aspect | Validators | Evals |
|--------|-----------|-------|
| **Runs when?** | Inline, every response | Async, on schedule or trigger |
| **Blocks output?** | Yes (when `fail_on_violation: true`) | No — scores and reports |
| **Scope** | Prompt-level only | Prompt-level or pack-level |
| **Type system** | Enum with `custom` escape hatch | Free string (runtimes define types) |
| **Metrics** | None | Prometheus-style metric declarations |
| **Version introduced** | v1.0 | v1.2 |

### Decision Matrix

| Scenario | Use Validators? | Use Evals? |
|----------|:---:|:---:|
| Block toxic or unsafe content before it reaches users | Yes | — |
| Monitor tone quality over time with dashboards | — | Yes |
| Enforce character limits on social media responses | Yes | — |
| Measure brand voice consistency across all prompts | — | Yes |
| PII detection that must never leak | Yes | — |
| Sample 10% of responses for LLM-judge quality scoring | — | Yes |
| Both block bad output *and* track quality trends | Yes | Yes |

:::info
Validators and evals are complementary, not competitive. Use validators for hard safety guardrails and evals for continuous quality monitoring. The same prompt engineer typically authors both.
:::

## Orchestration Patterns

The workflow state machine supports several common multi-prompt patterns. Choose based on your use case.

### Router + Specialists

A triage prompt classifies requests and routes to specialized prompts.

```
         ┌─ billing ─────┐
triage ──┤               ├── closing
         └─ technical ───┘
```

**When to use**: Customer support, help desks, any system where incoming requests need classification before handling.

### Pipeline

Prompts execute in sequence, each processing the output of the previous one.

```
intake ── analyze ── draft ── review
```

**When to use**: Document processing, content generation pipelines, multi-step analysis.

### Agent Mesh

Multiple agents communicate via A2A without a central workflow. Each agent discovers and invokes others through tool references.

```
researcher ←→ fact_checker ←→ writer
```

**When to use**: Loosely coupled agents that need to collaborate without rigid sequencing. Use the `agents` section *without* `workflow`.

### Hybrid

Combine workflow orchestration internally with agent discovery externally.

```
[Workflow: triage → specialist → closing]
     ↕ A2A
[External systems discover and invoke agents]
```

**When to use**: Systems that need both internal routing logic and external interoperability.

## Multimodal Integration

The `media` configuration (v1.1+) composes with all other features:

- **With Prompts**: Each prompt can declare its own `media` config — supported types, format restrictions, size limits, and multimodal examples with `parts` arrays
- **With Validators**: Validators run on the text output regardless of whether the input was multimodal
- **With Evals**: Evals can assess multimodal interactions (e.g., an LLM judge evaluating whether the response correctly interpreted an image)
- **With Workflow**: A workflow state can route to a prompt that accepts images, while another state routes to a text-only prompt
- **With Agents**: Agent input/output modes (`input_modes`, `output_modes`) declare which MIME types the agent supports, complementing the prompt-level `media` config

:::info
Multimodal and text-only prompts can coexist in the same pack. A pack might have an image-aware `product_lookup` prompt and a text-only `catalog_writer` prompt — the media config is per-prompt, not per-pack.
:::

## Feature Compatibility Matrix

| Feature | Version | Combines With |
|---------|---------|---------------|
| Prompts | v1.0 | Everything |
| Tools & Fragments | v1.0 | Prompts, Workflow, Agents |
| Validators | v1.0 | Prompts |
| Parameters | v1.0 | Prompts, Model Overrides |
| Tested Models | v1.0 | Prompts |
| Model Overrides | v1.0 | Prompts |
| Media (multimodal) | v1.1 | Prompts, Agents (MIME types) |
| Evals | v1.2 | Prompts (prompt-level), Pack (pack-level) |
| Workflow | v1.3 | Prompts (via `prompt_task`), Agents |
| Agents | v1.3 | Prompts (via `members`), Workflow |

## Next Steps

- **Build your first workflow**: [How to Add a Workflow](/docs/guides/add-workflow)
- **Set up agents**: [How to Set Up Agents](/docs/guides/setup-agents)
- **Add quality monitoring**: [How to Add Evals](/docs/guides/add-evals)
- **See full examples**: [Real-World Examples](/docs/spec/examples)
- **Design rationale**: [RFC 0005: Workflow Extension](/docs/rfcs/workflow-extension) · [RFC 0007: Agents Extension](/docs/rfcs/agents-extension) · [RFC 0006: Evals Extension](/docs/rfcs/evals-extension)
