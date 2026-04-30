# PromptPack Specification

[![Spec Version](https://img.shields.io/badge/Spec-v1.3.1-blue)](https://promptpack.org/docs/spec/overview)
[![Documentation](https://img.shields.io/badge/Documentation-promptpack.org-green)](https://promptpack.org)
[![GitHub Pages](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml/badge.svg)](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Stop scattering prompts across files, repos, and providers. Package them once, run them anywhere.**

Production AI systems need more than a single prompt — they need specialized prompts, shared tools, reusable fragments, safety guardrails, and version control. PromptPack is a JSON-based spec that bundles all of that into one portable file that works across providers.

**Want to use it, not just read about it?** [**PromptKit**](https://github.com/AltairaLabs/PromptKit) is the open-source reference toolkit — install it with `npm install -g @altairalabs/promptarena @altairalabs/packc` to test, validate, and run packs in production.

## Why PromptPack?

**The problem:** As AI applications grow, prompt management becomes a mess — dozens of prompts scattered across codebases, duplicated tool definitions, no versioning, no testing, and tight coupling to a single provider.

**The solution:** A single `.promptpack.json` file that contains:

- **Multiple specialized prompts** that outperform one-size-fits-all approaches
- **Shared tools and fragments** — define once, reuse everywhere
- **Multimodal support** — text, images, audio, and structured content in prompt templates
- **Evals** — automated quality checks with Prometheus metric export, shipped alongside your prompts
- **Workflows** — state-machine orchestration over prompts with event-driven transitions
- **Agents** — A2A-compatible agent definitions for multi-agent orchestration
- **Skills** — progressive-disclosure knowledge loading with file, package, and inline sources
- **Built-in testing metadata** to track model performance across providers
- **Portable format** that works with OpenAI, Anthropic, Google, and local models

## Quick Start

```json
{
  "$schema": "https://promptpack.org/schema/latest/promptpack.schema.json",
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "tools": {
    "lookup_order": {
      "type": "function",
      "description": "Look up a customer order by ID",
      "parameters": {
        "order_id": { "type": "string", "required": true }
      }
    }
  },
  "fragments": {
    "brand_voice": "Always respond in a friendly, professional tone. Use the customer's first name."
  },
  "prompts": {
    "support": {
      "system_template": "You are a {{role}} for {{company}}. {{fragments.brand_voice}}",
      "tools": ["lookup_order"],
      "variables": [
        { "name": "role", "type": "string", "required": true },
        { "name": "company", "type": "string", "required": true }
      ]
    }
  },
  "evals": [
    {
      "id": "tone-check",
      "type": "llm_judge",
      "trigger": "sample_turns",
      "sample_percentage": 10,
      "params": {
        "judge_prompt": "Rate the response tone 1-5 for professionalism.",
        "passing_score": 4
      },
      "metric": {
        "name": "promptpack_tone_score",
        "type": "gauge",
        "range": { "min": 1, "max": 5 }
      }
    }
  ]
}
```

**Learn more:** [Getting Started Guide](https://promptpack.org/docs/getting-started)

### Run a pack

Once you've authored a pack, install [PromptKit](https://github.com/AltairaLabs/PromptKit) and try it:

```bash
npm install -g @altairalabs/promptarena @altairalabs/packc

promptarena init my-project --template iot-maintenance-demo
cd my-project
promptarena run --scenario scenarios/hardware-faults.scenario.yaml
```

PromptKit is the reference toolkit — multi-provider testing, red-team scenarios, eval reporting, and SDK deployment.

## Key Features

- **Multi-Prompt Architecture** — Specialized prompts for different scenarios instead of one-size-fits-all
- **Complete Packaging** — Prompts, tools, fragments, evals, and config in a single JSON file
- **Evals & Metrics** — Declare automated quality checks (deterministic or LLM judge) with Prometheus metric export
- **Workflows** — State-machine orchestration with event-driven transitions between prompts
- **Agents** — A2A-compatible agent definitions for multi-agent discovery and orchestration
- **Skills** — Progressive-disclosure knowledge loading with workflow state scoping
- **Multimodal Content** — Text, images, audio, and structured content in prompt templates
- **Portable & Provider-Agnostic** — Works across OpenAI, Anthropic, Google, and local models
- **Built-in Testing** — Testing metadata and quality assurance built into the spec
- **Tool Integration** — Define external tools once, reference them across all prompts
- **Template System** — Variable templating with reusable fragments for consistency

## Evals *(v1.2)*

PromptPack v1.2 lets you ship quality policy alongside your prompts. Evals are automated checks that run asynchronously and produce scores — unlike validators (guardrails) which block output inline.

```json
"evals": [
  {
    "id": "json_format",
    "type": "json_valid",
    "trigger": "every_turn",
    "metric": { "name": "promptpack_json_valid", "type": "boolean" }
  },
  {
    "id": "session-coverage",
    "type": "contains_any",
    "trigger": "on_session_complete",
    "params": { "patterns": ["Paris", "capital"] },
    "metric": { "name": "promptpack_session_coverage", "type": "boolean" }
  }
]
```

**Key concepts:**

| Feature | Description |
|---------|-------------|
| **Two scopes** | Pack-level evals apply to all prompts; prompt-level evals override by `id` |
| **Triggers** | `every_turn`, `on_session_complete`, `sample_turns`, `sample_sessions` |
| **Eval types** | Runtime-defined — deterministic (`contains`, `regex`, `json_valid`, `tools_called`) or `llm_judge` |
| **Prometheus metrics** | Each eval can declare a `metric` (gauge, counter, histogram, boolean) for monitoring |
| **Sampling** | `sample_turns`/`sample_sessions` with `sample_percentage` for cost-effective evaluation |

See [RFC-0006: Evals Extension](https://promptpack.org/docs/rfcs/evals-extension) for the full design.

## Workflows & Agents *(v1.3)*

PromptPack v1.3 adds two new top-level sections for orchestration:

**Workflows** define a state machine over your prompts — each state references a prompt key and declares event-driven transitions:

```json
"workflow": {
  "version": 1,
  "entry": "greeting",
  "states": {
    "greeting": {
      "prompt_task": "greet",
      "on_event": { "need_support": "triage", "bye": "closing" }
    },
    "triage": {
      "prompt_task": "support",
      "on_event": { "escalate": "human_handoff", "resolved": "closing" }
    }
  }
}
```

**Agents** map prompts to A2A-compatible agent definitions for multi-agent discovery and orchestration:

```json
"agents": {
  "entry": "router",
  "members": {
    "router":  { "tags": ["triage"], "description": "Routes requests to specialists" },
    "billing": { "tags": ["billing"], "input_modes": ["text/plain"] },
    "tech":    { "tags": ["technical"], "output_modes": ["text/plain", "application/json"] }
  }
}
```

See [RFC-0005: Workflow Extension](https://promptpack.org/docs/rfcs/workflow-extension) and [RFC-0007: Agents Extension](https://promptpack.org/docs/rfcs/agents-extension) for the full designs.

## Skills *(v1.3.1)*

PromptPack v1.3.1 adds progressive-disclosure knowledge loading. Skills are modular knowledge sources — file paths, package references, or inline definitions — that agents activate on demand:

```json
"skills": [
  "./skills/billing",
  { "path": "./skills/compliance", "preload": true },
  {
    "name": "escalation-protocol",
    "description": "Steps for escalating unresolved issues",
    "instructions": "When an issue cannot be resolved:\n1. Collect details\n2. Create ticket\n3. Set expectations"
  }
]
```

Workflow states can scope which skills are available per context:

```json
"states": {
  "billing_state": { "prompt_task": "billing", "on_event": {}, "skills": "./skills/billing" },
  "closing":       { "prompt_task": "closing",  "on_event": {}, "skills": "none" }
}
```

See [RFC-0008: Skills Extension](https://promptpack.org/docs/rfcs/skills-extension) for the full design.

## Documentation

- [Specification](https://promptpack.org/docs/spec/overview) — Complete PromptPack spec
- [Examples](https://promptpack.org/docs/spec/examples) — Real-world usage examples
- [Schema Reference](https://promptpack.org/docs/spec/schema-reference) — Field-by-field documentation
- [File Format](https://promptpack.org/docs/spec/file-format) — YAML structure guide

### JSON Schema

- **Latest:** [`https://promptpack.org/schema/latest/promptpack.schema.json`](https://promptpack.org/schema/latest/promptpack.schema.json)
- **Versioned:** `https://promptpack.org/schema/v1.3.1/promptpack.schema.json`

## Ecosystem

| Component | Status | Links |
|-----------|--------|-------|
| **Core Specification** | v1.3.1 Stable | [Spec](https://promptpack.org/docs/spec/overview) |
| **PromptKit** | Stable | [CLI, validation, SDK](https://promptpack.org/docs/ecosystem/promptkit-runtime) |
| **PromptArena** | Stable | [Multi-provider testing, CI/CD](https://promptpack.org/docs/ecosystem/arena-testing) |
| **LangChain.js** | Available | [`@promptpack/langchain`](https://github.com/AltairaLabs/promptpack-langchainjs) |
| **LangChain Python** | Available | [`promptpack-python`](https://github.com/AltairaLabs/promptpack-python) |
| **JSON Schema** | Available | [Auto-versioned schema](https://promptpack.org/schema/latest/promptpack.schema.json) |
| **Documentation** | Live | [promptpack.org](https://promptpack.org) |

## Governance

PromptPack follows an open governance model. See our [Governance Model](./GOVERNANCE.md), [RFC Process](https://promptpack.org/docs/processes/rfc-process), and [RFC Index](https://promptpack.org/docs/processes/rfc-index).

## Contributing

We welcome contributions! Here's how to get involved:

1. Read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md)
2. Join [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
3. Report issues using our [issue templates](.github/ISSUE_TEMPLATE/)
4. Propose specification changes via the [RFC process](https://promptpack.org/docs/processes/rfc-process)

Look for issues labeled `good first issue` to get started.

## Community

- **Website:** [promptpack.org](https://promptpack.org)
- **Discussions:** [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- **Issues:** [Issue Tracker](https://github.com/altairalabs/promptpack-spec/issues)
- **Contact:** [community@altairalabs.com](mailto:community@altairalabs.com)

## License

This project is licensed under the [MIT License](./LICENSE).

---

**Built by [AltairaLabs](https://altairalabs.com) for the conversational AI community.**
