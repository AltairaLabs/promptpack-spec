# PromptPack Specification

[![Spec Version](https://img.shields.io/badge/Spec-v1%20(Draft)-blue)](https://promptpack.org/docs/spec/overview)
[![Documentation](https://img.shields.io/badge/Documentation-promptpack.org-green)](https://promptpack.org)
[![GitHub Pages](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml/badge.svg)](https://github.com/altairalabs/promptpack-spec/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **The open specification for packaging multi-prompt conversational AI systems into portable, reusable bundles.**

PromptPack is a JSON-based format that packages everything needed to run sophisticated conversational AI—multiple specialized prompts, shared tools, reusable fragments, and configuration—into a single portable file.

## 🚀 Quick Start

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
  "prompts": {
    "support": {
      "system_template": "You are a {{role}} for {{company}}. Help customers professionally.",
      "variables": [
        {
          "name": "role",
          "type": "string",
          "required": true
        }
      ]
    }
  }
}
```

**Learn more:** [Getting Started Guide](https://promptpack.org/docs/getting-started)

## 📖 Documentation

- **📋 [Specification](https://promptpack.org/docs/spec/overview)** - Complete PromptPack spec
- **🔧 [Examples](https://promptpack.org/docs/spec/examples)** - Real-world usage examples  
- **📚 [Schema Reference](https://promptpack.org/docs/spec/schema-reference)** - Field-by-field documentation
- **🏗️ [File Format](https://promptpack.org/docs/spec/file-format)** - YAML structure guide

### JSON Schema

- **Latest:** [`https://promptpack.org/schema/latest/promptpack.schema.json`](https://promptpack.org/schema/latest/promptpack.schema.json)
- **Versioned:** `https://promptpack.org/schema/v1.1/promptpack.schema.json`

## 🌟 Key Features

- **🎯 Multi-Prompt Architecture** - Specialized prompts for different scenarios instead of one-size-fits-all
- **📦 Complete Packaging** - Everything needed (prompts, tools, fragments) in a single JSON file
- **🔄 Reusable & Portable** - Works across different AI providers and deployment environments
- **🧪 Built-in Testing** - Testing metadata and quality assurance built into the specification
- **🛠️ Tool Integration** - Define external tools once, use across all prompts in the pack
- **🎨 Template System** - Consistent variable templating with reusable fragments

## 🏛️ Governance and RFC Process

PromptPack follows an open governance model inspired by CNCF projects:

- **📋 [Governance Model](./GOVERNANCE.md)** - How decisions are made
- **🔄 [RFC Process](https://promptpack.org/docs/processes/rfc-process)** - Proposing specification changes
- **📊 [RFC Index](https://promptpack.org/docs/processes/rfc-index)** - Active and completed RFCs

### Maintainers

- **Core Maintainers:** Oversee specification development and governance
- **Spec Editors:** Review and approve changes to the specification
- **Contributors:** Community members contributing to the project

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

1. **📖 Read:** [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md)
2. **💬 Discuss:** Join [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
3. **🐛 Report Issues:** Use our [issue templates](.github/ISSUE_TEMPLATE/)
4. **🔄 Submit RFCs:** Propose specification changes via RFC process

**New contributors welcome!** Look for issues labeled `good first issue`.

## 🚀 Roadmap and Governance

Track our progress and upcoming features:

- **📊 [Project Roadmap](https://github.com/orgs/altairalabs/projects/1)** - Development roadmap
- **🎯 [Milestones](https://github.com/altairalabs/promptpack-spec/milestones)** - Release planning
- **📈 [Community Standards](https://github.com/altairalabs/promptpack-spec/community)** - Health metrics

## 💡 Why PromptPacks?

**The Problem**: Building production conversational AI requires multiple specialized prompts, external tools, shared resources, safety guardrails, and version management. Without standardization, AI applications become fragmented and hard to maintain.

**The Solution**: PromptPacks package everything into a single JSON file with:

- **Multiple specialized prompts** (support, sales, technical) that outperform generic prompts
- **Shared tools and fragments** to eliminate duplication and ensure consistency  
- **Built-in testing metadata** to track model performance and success rates
- **Portable format** that works across providers (OpenAI, Anthropic, local models)

## 🏗️ Implementation Status

| Component | Status | Description |
|-----------|--------|-------------|
| **Core Specification** | ✅ v1 Draft | Complete JSON-based specification with examples |
| **JSON Schema** | ✅ Available | Validation schema with automatic versioning |
| **Documentation Site** | ✅ Live | Comprehensive docs at promptpack.org |
| **Reference Runtime** | 🚧 In Development | [PromptKit](https://promptpack.org/docs/ecosystem/promptkit-runtime) |
| **Testing Framework** | 🚧 In Development | [Arena Testing](https://promptpack.org/docs/ecosystem/arena-testing) |

## 📊 Community

- **🌐 Website:** [promptpack.org](https://promptpack.org)
- **💬 Discussions:** [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- **🐛 Issues:** [Issue Tracker](https://github.com/altairalabs/promptpack-spec/issues)
- **📧 Contact:** [community@altairalabs.com](mailto:community@altairalabs.com)

## 📄 License

This project is licensed under the [MIT License](./LICENSE) - see the LICENSE file for details.

---

**Built by [AltairaLabs](https://altairalabs.com) with ❤️ for the conversational AI community.**