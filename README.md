# PromptPack Specification

[![Spec Version](https://img.shields.io/badge/Spec-v1.1-blue)](https://promptpack.org/docs/spec/overview)
[![Documentation](https://img.shields.io/badge/Documentation-promptpack.org-green)](https://promptpack.org)
[![GitHub Pages](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml/badge.svg)](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Stop scattering prompts across files, repos, and providers. Package them once, run them anywhere.**

Production AI systems need more than a single prompt — they need specialized prompts, shared tools, reusable fragments, safety guardrails, and version control. PromptPack is a JSON-based spec that bundles all of that into one portable file that works across providers.

## Why PromptPack?

**The problem:** As AI applications grow, prompt management becomes a mess — dozens of prompts scattered across codebases, duplicated tool definitions, no versioning, no testing, and tight coupling to a single provider.

**The solution:** A single `.promptpack.json` file that contains:

- **Multiple specialized prompts** that outperform one-size-fits-all approaches
- **Shared tools and fragments** — define once, reuse everywhere
- **Multimodal support** — text, images, audio, and structured content in prompt templates
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
  }
}
```

**Learn more:** [Getting Started Guide](https://promptpack.org/docs/getting-started)

## Key Features

- **Multi-Prompt Architecture** — Specialized prompts for different scenarios instead of one-size-fits-all
- **Complete Packaging** — Prompts, tools, fragments, and config in a single JSON file
- **Multimodal Content** — Text, images, audio, and structured content in prompt templates
- **Portable & Provider-Agnostic** — Works across OpenAI, Anthropic, Google, and local models
- **Built-in Testing** — Testing metadata and quality assurance built into the spec
- **Tool Integration** — Define external tools once, reference them across all prompts
- **Template System** — Variable templating with reusable fragments for consistency

## Documentation

- [Specification](https://promptpack.org/docs/spec/overview) — Complete PromptPack spec
- [Examples](https://promptpack.org/docs/spec/examples) — Real-world usage examples
- [Schema Reference](https://promptpack.org/docs/spec/schema-reference) — Field-by-field documentation
- [File Format](https://promptpack.org/docs/spec/file-format) — YAML structure guide

### JSON Schema

- **Latest:** [`https://promptpack.org/schema/latest/promptpack.schema.json`](https://promptpack.org/schema/latest/promptpack.schema.json)
- **Versioned:** `https://promptpack.org/schema/v1.1/promptpack.schema.json`

## Ecosystem

| Component | Status | Links |
|-----------|--------|-------|
| **Core Specification** | v1.1 Stable | [Spec](https://promptpack.org/docs/spec/overview) |
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
