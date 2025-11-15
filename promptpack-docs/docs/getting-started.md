---
sidebar_position: 2
---

# Getting Started with PromptPack

PromptPack is an open specification for packaging conversational AI systems. This guide helps you get started based on your goals.

## What You Can Do Today

### 1. Learn the Specification

**Best for**: Understanding what PromptPack is and how it works

- Read the [Specification Overview](/docs/spec/overview)
- Review [Real-World Examples](/docs/spec/examples)
- Explore the [JSON Schema Reference](/docs/spec/schema-reference)

**Time investment**: 30-60 minutes

### 2. Create a PromptPack

**Best for**: Packaging your prompts in PromptPack format

- Use the [JSON Schema](https://promptpack.org/schema/latest/promptpack.schema.json) for validation
- Reference the [File Format guide](/docs/spec/file-format)
- Start with a simple pack and expand

**Example - Minimal Valid PromptPack**:

```json
{
  "$schema": "https://promptpack.org/schema/latest/promptpack.schema.json",
  "id": "my-assistant",
  "name": "My Assistant",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "default": {
      "id": "default",
      "name": "Default Assistant",
      "version": "1.0.0",
      "system_template": "You are a helpful assistant."
    }
  }
}
```

Validate against the schema using any JSON Schema validator.

**Time investment**: 1-2 hours for first pack

### 3. Test with PromptArena

**Best for**: Multi-provider testing and evaluation

PromptArena is a CLI tool for testing conversational AI systems:

```bash
# Install (see PromptKit repository for latest instructions)
# Create test scenarios
# Run tests across multiple providers
promptarena run --provider openai,anthropic --format html
```

[PromptArena Guide →](/docs/ecosystem/arena-testing)

**Time investment**: 2-4 hours including setup

### 4. Contribute to the Spec

**Best for**: Shaping the future of PromptPack

- Join [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- Review [open RFCs](/docs/processes/rfc-index)
- Submit feedback on proposed changes
- Propose new features via [RFC process](/docs/processes/rfc-process)

**Time investment**: Ongoing participation

## What's Coming

**PromptKit Runtime**: Reference implementation for loading and executing PromptPacks. When available, will enable:

- CLI validation and linting
- SDK libraries for Python and JavaScript
- Direct execution of PromptPacks

[Track PromptKit Development →](/docs/ecosystem/promptkit-runtime)

## Need Help?

- **Questions**: [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- **Issues**: [GitHub Issues](https://github.com/altairalabs/promptpack-spec/issues)
- **Email**: [community@altairalabs.com](mailto:community@altairalabs.com)

## Next Steps

Choose your path:

- **Learn**: [Specification Overview](/docs/spec/overview)
- **Build**: [Examples](/docs/spec/examples)
- **Test**: [Arena Testing](/docs/ecosystem/arena-testing)
- **Contribute**: [RFC Process](/docs/processes/rfc-process)
