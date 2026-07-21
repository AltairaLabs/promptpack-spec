---
sidebar_position: 2
title: "Pack Structure (v1.4.1)"
---

# Pack Structure & Design

<span className="ppVersionBadge ppVersionBadge--archived">📦 v1.4.1 (Stable)</span>

:::warning Archived Version
This is the **v1.4.1** documentation. For the latest features, see [v1.5.0 docs →](../structure)
:::

Understanding how PromptPacks are structured helps you design better AI agent behavior — from simple multi-prompt routers to autonomous agent loops. The JSON-based format isn't just about data storage; it's architected to support real-world agent development patterns and deployment needs.

## The Multi-Prompt Architecture

A defining characteristic of PromptPacks is that **each pack can contain multiple specialized prompts** — one per workflow stage, one per routing destination, or one per agent — rather than trying to fit everything into a single generic prompt.

### Why Multiple Prompts?

**Better Performance**: Specialized prompts outperform generic ones. A prompt optimized for technical support will handle troubleshooting better than a generic "customer service" prompt trying to do everything.

**Easier Maintenance**: When you need to improve sales conversations, you modify just the sales prompt without affecting support or technical prompts.

**Independent Evolution**: Each prompt can have its own version, testing results, and optimization path while sharing common infrastructure.

**Clear Separation of Concerns**: Different prompts can use different tools, have different safety rules, and target different LLM parameters.

### Pack Organization

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  
  "prompts": {
    "support": { /* optimized for general support */ },
    "sales": { /* tuned for sales conversations */ },
    "technical": { /* focused on troubleshooting */ },
    "billing": { /* handles payment issues */ }
  }
}
```

Each prompt operates independently but shares the pack's common resources.

## Shared Resources Architecture

PromptPacks eliminate duplication through shared resources that all prompts can use:

### Template Engine Configuration

```json
{
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  }
}
```

**Why Shared**: Ensures all prompts use the same templating system, making the pack portable across different runtime environments.

### Reusable Fragments

```json
{
  "fragments": {
    "company_intro": "Welcome to {{company_name}}, where customer satisfaction is our priority.",
    "escalation_notice": "Let me connect you with a specialist who can better assist you.",
    "data_privacy": "We protect your information according to our privacy policy."
  }
}
```

**Benefits**:

- **Consistency**: Same messaging across all prompts
- **Maintainability**: Update company intro once, affects all prompts
- **Localization**: Easy to swap fragments for different languages or regions

### Tool Definitions

```json
{
  "tools": {
    "lookup_customer": { /* database query tool */ },
    "create_ticket": { /* ticketing system integration */ },
    "send_email": { /* email automation tool */ }
  }
}
```

**Advantages**:

- **Reusability**: Define once, reference from any prompt
- **Security**: Centralized tool policies and permissions
- **Testing**: Tool behavior is consistent across all prompts

## Prompt-Level Specialization

While sharing common resources, each prompt has its own specialized configuration:

### Independent Parameters

```json
{
  "prompts": {
    "support": {
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 1500
      }
    },
    "sales": {
      "parameters": {
        "temperature": 0.9,
        "max_tokens": 800
      }
    }
  }
}
```

### Specialized Tool Access

```json
{
  "prompts": {
    "support": {
      "tools": ["lookup_customer", "create_ticket", "send_email"]
    },
    "sales": {
      "tools": ["lookup_customer", "get_pricing", "schedule_demo"]
    },
    "billing": {
      "tools": ["lookup_customer", "process_payment", "send_receipt"]
    }
  }
}
```

### Custom Validation Rules

```json
{
  "prompts": {
    "support": {
      "validators": [
        {"type": "max_length", "params": {"max_tokens": 500}},
        {"type": "banned_words", "params": {"words": ["impossible", "can't help"]}}
      ]
    },
    "sales": {
      "validators": [
        {"type": "sentiment", "params": {"min_positive": 0.6}},
        {"type": "max_length", "params": {"max_tokens": 300}}
      ]
    }
  }
}
```

## Version Management Strategy

PromptPacks support both pack-level and prompt-level versioning:

```json
{
  "version": "2.1.0",
  "prompts": {
    "support": {
      "version": "1.5.2"
    },
    "sales": {
      "version": "2.0.1"
    }
  }
}
```

**Benefits**:

- **Granular Updates**: Update just the sales prompt without changing support
- **Rollback Capability**: Revert individual prompts to previous versions
- **A/B Testing**: Run different prompt versions simultaneously
- **Compatibility Tracking**: Know which prompt versions work together

## Testing and Quality Assurance

PromptPacks include built-in support for testing and quality tracking:

```json
{
  "prompts": {
    "support": {
      "tested_models": [
        {
          "provider": "openai",
          "model": "gpt-4",
          "success_rate": 0.94,
          "avg_cost": 0.0045,
          "avg_latency_ms": 1200
        }
      ]
    }
  }
}
```

This enables:

- **Model Selection**: Choose the best-performing model for each prompt
- **Cost Optimization**: Balance performance vs. cost across different prompts
- **Performance Monitoring**: Track how prompts perform over time
- **Deployment Confidence**: Know before you deploy whether a prompt works well

### Evals *(v1.2+)*

PromptPacks can also declare **evals** — automated quality checks that run asynchronously and produce metrics. Evals can be defined at pack level (applying to all prompts) or prompt level (scoped to a specific prompt):

```json
{
  "evals": [
    {
      "id": "json_format",
      "type": "json_valid",
      "trigger": "every_turn",
      "metric": { "name": "promptpack_json_valid", "type": "boolean" }
    }
  ]
}
```

Unlike validators (which block output), evals score and report — making them ideal for continuous quality monitoring with Prometheus-style metric export.

## Workflow Orchestration *(v1.3+)*

PromptPack v1.3 introduces a state-machine workflow that orchestrates transitions between prompts based on events. Instead of a caller manually choosing which prompt to invoke, the workflow defines an entry state and event-driven transitions:

```json
{
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "on_event": { "billing": "billing_support", "technical": "tech_support" }
      },
      "billing_support": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing" },
        "persistence": "persistent"
      },
      "tech_support": {
        "prompt_task": "technical",
        "on_event": { "resolved": "closing" },
        "persistence": "persistent"
      },
      "closing": {
        "prompt_task": "closing",
        "on_event": {}
      }
    }
  }
}
```

Each state references a prompt key and declares which events trigger transitions to other states. States can be `transient` (context reset on entry) or `persistent` (context preserved), and orchestration can be `internal`, `external`, or `hybrid`.

## Agent Definitions *(v1.3+)*

The `agents` section maps prompts to A2A (Agent-to-Agent) protocol compatible agent cards, enabling multi-agent discovery and orchestration:

```json
{
  "agents": {
    "entry": "triage",
    "members": {
      "triage": {
        "description": "Routes requests to specialists",
        "tags": ["router"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain"]
      },
      "billing": {
        "description": "Handles billing inquiries",
        "tags": ["billing", "payments"]
      }
    }
  }
}
```

Each agent definition provides metadata for the A2A Agent Card — description, discovery tags, and supported MIME types. The `entry` field identifies which agent receives incoming requests by default.

## Skills *(v1.3.1+)*

The `skills` section declares external knowledge sources that agents can load progressively on demand. Instead of embedding all domain knowledge in system templates, skills let you keep templates lean and load expertise when it's relevant.

```json
{
  "skills": [
    "./skills/billing",
    { "path": "./skills/compliance", "preload": true },
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved customer issues",
      "instructions": "When a customer issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity\n2. Collect case details\n3. Create an escalation ticket"
    }
  ]
}
```

Skills come in three forms:

- **String paths** — reference a directory or package (`"./skills/billing"`, `"@acme/support-skills"`)
- **Path objects** — provide a path with optional `preload: true` for eager loading
- **Inline skills** — define `name`, `description`, and `instructions` directly in the pack

When combined with workflows, each state can declare a `skills` field to scope which skills are available in that context, or use `"none"` to disable skills entirely for a state.

## Agent Loops *(v1.4+)*

PromptPack v1.4 extends `WorkflowState` with the fields needed to express iterative, self-correcting execution patterns over the existing state machine — without leaving the spec. The same `workflow` block now supports terminal states, bounded loops, structured artifacts that flow across visits, and an engine-level execution budget.

```json
{
  "workflow": {
    "version": 1,
    "entry": "plan",
    "states": {
      "plan": {
        "prompt_task": "plan",
        "on_event": { "PlanReady": "implement" }
      },
      "implement": {
        "prompt_task": "implement",
        "max_visits": 5,
        "on_max_visits": "review",
        "artifacts": {
          "commit_sha":  { "type": "text/plain",       "description": "Latest generated commit" },
          "test_report": { "type": "application/json", "description": "Test runner summary" },
          "log":         { "type": "text/plain", "mode": "append", "description": "Iteration log" }
        },
        "on_event": { "CodeReady": "test" }
      },
      "test": {
        "prompt_task": "run_tests",
        "on_event":    { "TestsFailed": "implement", "TestsPassed": "done" }
      },
      "review": { "prompt_task": "review",   "terminal": true },
      "done":   { "prompt_task": "summarize", "terminal": true }
    },
    "engine": {
      "budget": { "max_total_visits": 50, "max_tool_calls": 200, "max_wall_time_sec": 600 }
    }
  }
}
```

Four building blocks turn an unbounded workflow into a production-safe agent loop:

- **`terminal: true`** — marks states that exit the workflow explicitly. A terminal state should not declare `on_event` transitions.
- **`max_visits` (per state)** — caps how many times a single state can be entered during one execution. When the limit is hit, the workflow transitions to `on_max_visits` if set, or terminates with a budget-exhausted status.
- **`artifacts`** — named slots for lightweight, structured metadata (commit SHAs, file paths, JSON summaries, diffs). Each entry declares a MIME `type`, an optional `description`, and an optional `mode`: `"replace"` (default — overwrite on each visit) or `"append"` (accumulate across visits, e.g. a log). Values are accessible to prompts as `{{artifacts.<name>}}`.
- **`engine.budget`** — a global safety net independent of per-state caps. Supports `max_total_visits`, `max_tool_calls`, and `max_wall_time_sec`. Reaching any limit terminates the workflow with a budget-exhausted status.

:::info Time-travel debugging for free
Because artifacts are captured at every state transition, runtimes that persist them produce a structured, replayable execution trace. You get audit, replay, and step-back debugging without writing any extra orchestration code.
:::

## Deployment Benefits

The pack structure provides significant operational advantages:

### Single-File Deployment

Everything needed to run your AI system is in one JSON file. No missing dependencies, no scattered configuration files, no "it works on my machine" problems.

### Environment Portability

The same pack works across:

- **Development environments** (local testing)
- **Staging systems** (integration testing)
- **Production deployments** (live systems)
- **Different cloud providers** (AWS, Azure, GCP)
- **Various AI platforms** (OpenAI, Anthropic, local models)

### Atomic Updates

Deploy new versions atomically—either the entire pack updates successfully, or it doesn't. No partial updates that leave your system in an inconsistent state.

### Configuration as Code

PromptPacks enable GitOps workflows:

- **Version Control**: Track all changes through Git
- **Code Reviews**: Review prompt changes like code changes
- **Automated Testing**: CI/CD pipelines can test pack functionality
- **Rollback**: Instantly revert to previous pack versions

## Design Principles

The pack structure follows key principles that make conversational AI more manageable:

**Modularity**: Break complex AI behavior into focused, manageable pieces
**Composability**: Combine specialized prompts with shared resources efficiently  
**Portability**: Work consistently across different environments and providers
**Observability**: Built-in testing and performance tracking for continuous improvement
**Maintainability**: Clear separation makes updates safer and easier

This architecture scales from simple single-prompt packs to complex systems with dozens of specialized prompts, all while maintaining clarity and avoiding duplication.
