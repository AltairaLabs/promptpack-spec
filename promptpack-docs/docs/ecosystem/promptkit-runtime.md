---
sidebar_position: 1
---

# PromptKit

:::info Status
PromptKit is under active development. Visit [promptkit.altairalabs.ai](https://promptkit.altairalabs.ai) for the latest information.
:::

PromptKit is the reference implementation for working with PromptPack specifications. It provides tools for authoring, validating, and testing PromptPacks.

## Overview

PromptKit helps you work with the PromptPack specification by providing:

- **PromptArena** - A testing and evaluation platform for comparing prompt performance across different models
- **Validation Tools** - Schema validation and format checking (planned)
- **SDK Libraries** - Python and JavaScript libraries for loading and using PromptPacks (planned)

## PromptArena

**Status:** ✅ Available

PromptArena is a web-based platform for testing and evaluating prompts across multiple LLM providers.

### Features

- **Side-by-side Testing** - Compare prompt responses from different models simultaneously
- **Multi-Provider Support** - Test with OpenAI, Anthropic, Google, and more
- **Evaluation Framework** - Score and rank prompt performance
- **Batch Testing** - Run multiple test cases across providers
- **Export Results** - Save evaluation data for analysis

### Access

Visit [promptkit.altairalabs.ai](https://promptkit.altairalabs.ai) to use PromptArena.

## Planned Features

The following features are under development:

### Validation Tools (Coming Soon)

Command-line tools for validating PromptPacks:

```bash
# Planned - not yet available
promptkit validate my-assistant.promptpack.json
promptkit lint my-assistant.promptpack.yml
```

### SDK Libraries (In Development)

Language-specific SDKs for loading and using PromptPacks:

**Python (Planned):**
```python
# Planned API - not yet available
from promptkit import load_pack

pack = load_pack("my-assistant.promptpack.json")
result = pack.execute("greeting", {"name": "Alice"})
```

**JavaScript (Planned):**
```javascript
// Planned API - not yet available
const { loadPack } = require('promptkit');

const pack = await loadPack('my-assistant.promptpack.json');
const result = await pack.execute('greeting', { name: 'Alice' });
```

## Get Involved

Interested in contributing to PromptKit development?

- **Repository:** [github.com/altairalabs/promptkit](https://github.com/altairalabs/promptkit) (coming soon)
- **Discussions:** [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- **Roadmap:** See [PromptPack GitHub Issues](https://github.com/altairalabs/promptpack-spec/issues) for planned features

## Contributing

We welcome contributions! Areas where you can help:

- **Runtime Implementations** - Build runtimes in different languages
- **Validation Tools** - Schema validators and linters
- **Testing Frameworks** - Automated testing tools
- **Documentation** - Examples, tutorials, and guides
- **Integrations** - Connect PromptPack to your favorite tools

See our [Contributing Guide](/docs/processes/contributing) to get started.

---

**Note:** This page describes the PromptKit reference implementation. The PromptPack specification is open, and anyone can build compatible tools and runtimes. See [Community Tools](./community-tools) for other implementations.

### Provider Setup
