---
sidebar_position: 3
title: Ecosystem Overview
---

# PromptPack Ecosystem

PromptPack is a **specification**, not a product or framework. The ecosystem consists of the spec itself and tools that work with it.

## Core Components

### PromptPack Specification

**Status**: ✅ v1.1 Available  
**Repository**: [altairalabs/promptpack-spec](https://github.com/altairalabs/promptpack-spec)

The open specification defining the JSON format for packaging conversational AI systems. Includes:

- Complete schema definition
- RFC process for evolution
- Documentation and examples
- Governance model

[View Specification →](/docs/spec/overview)

### PromptKit Runtime

**Status**: 🚧 In Development  
**Separate Project**: Related but independent

Reference implementation for loading and executing PromptPacks. When complete, will provide:

- CLI tools for validation and testing
- SDK libraries (Python, JavaScript)
- PromptPack execution runtime
- Integration examples

[Learn more →](/docs/ecosystem/promptkit-runtime)

### PromptArena Testing

**Status**: ✅ Available Now  
**Separate Tool**: Related but independent

CLI tool for systematic testing of conversational AI across multiple providers:

- Multi-provider comparison (OpenAI, Anthropic, Google, etc.)
- Multi-turn conversation testing
- Multimodal content testing (images, audio, video)
- Self-play mode for realistic simulations
- Comprehensive reporting (HTML, JSON, JUnit, Markdown)
- CI/CD integration

[Get Started with Arena →](/docs/ecosystem/arena-testing)

## Relationship Between Components

```
┌─────────────────────────────────────┐
│   PromptPack Specification (This)   │
│   - Defines JSON format             │
│   - Schema and validation           │
│   - Documentation                   │
└───────────┬─────────────────────────┘
            │ implements & tests
            ↓
┌─────────────────────────────────────┐
│         PromptKit Runtime           │
│   - Executes PromptPacks            │
│   - SDK libraries                   │
│   - Validation tools                │
└───────────┬─────────────────────────┘
            │ uses for testing
            ↓
┌─────────────────────────────────────┐
│         PromptArena Testing         │
│   - Multi-provider testing          │
│   - Conversation simulation         │
│   - Report generation               │
└─────────────────────────────────────┘
```

These are **separate but related projects**:

- **PromptPack Spec**: Defines the standard (open governance, RFC process)
- **PromptKit**: Reference implementation (actively developed by AltairaLabs)
- **PromptArena**: Testing tool (available now, separate repository)

## Community Tools

As PromptPack adoption grows, we expect community-contributed tools including:

- Alternative runtimes in different languages
- Framework integrations (LangChain, LlamaIndex, Transformers)
- IDE plugins and extensions
- Deployment tools and platforms
- Monitoring and observability solutions

**Want to build PromptPack tooling?** The specification is open—anyone can build compatible tools. See our [Contributing Guide](/docs/processes/contributing) to get involved.

## Planned Integrations

### LLM Providers

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- Azure OpenAI
- Local models (Ollama, LM Studio)

### Orchestration Frameworks

- LangChain adapter (proposal in backlog)
- LlamaIndex adapter (proposal in backlog)
- Transformers adapter (proposal in backlog)
- Custom framework integrations

### Development Tools

- VS Code Extension
- CLI validation and linting tools
- Testing frameworks
- CI/CD pipeline integrations

## Integration Philosophy

PromptPack is a **file format specification**, not an implementation. It defines how to structure prompts, tools, and workflows in a standardized JSON format. The specification does NOT include LLM provider SDKs, API integrations, or hosted services.

Any tool can implement PromptPack support by:

1. Reading PromptPack JSON files
2. Validating against the JSON Schema
3. Building their own runtime/execution engine
4. Implementing their own provider integrations

## Future Plans

The PromptPack ecosystem roadmap includes:

- Completing PromptKit reference runtime
- Growing the compatible tools ecosystem
- Framework adapter development
- Potential PromptPack Hub for community sharing
- Continued specification evolution via RFC process

We're in the early stages of building an ecosystem. **Join us in shaping it.**

[View Roadmap →](https://github.com/altairalabs/promptpack-spec/milestones)

## Contributing

Interested in building an integration?

1. **Check the Specification** - Ensure you understand the format
2. **Build Your Integration** - As a separate project/package
3. **Share with the Community** - Via discussions or PRs to add documentation
4. **Maintain Compatibility** - Follow semantic versioning of the spec

See our [Contributing Guide](/docs/processes/contributing) to get involved.
