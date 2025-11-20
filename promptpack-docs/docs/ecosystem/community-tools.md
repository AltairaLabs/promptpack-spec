---
sidebar_position: 4
---

# Community Tools

:::caution Status
🚧 **Community-Driven** - This ecosystem is in early stages
:::

## Overview

PromptPack is a specification for structuring prompts, tools, and workflows in YAML files. As an **open specification**, the community is encouraged to build tools, libraries, and integrations.

**Current Reality:** There are currently **no official community tools**. This page describes what could be built and how the community can contribute.

## What Exists Today

### Available Now

✅ **PromptPack Specification** - The file format is defined and documented  
✅ **JSON Schema** - For validation of `.promptpack.yml` files  
✅ **PromptArena** - CLI testing tool (see [Arena Testing](./arena-testing))  
✅ **LangChain.js Integration** - [`@promptpack/langchain`](https://github.com/AltairaLabs/promptpack-langchainjs) npm package  
✅ **Documentation** - This site and the specification docs

### LangChain.js Integration

The first official integration is now available! Use PromptPacks directly with LangChain.js:

```bash
npm install @promptpack/langchain
```

**Key Features:**

- Load PromptPacks from JSON/YAML files
- Native LangChain template integration
- Tool calling with governance policies
- Response validation and guardrails
- Full TypeScript support

[View Integration →](https://github.com/AltairaLabs/promptpack-langchainjs) | [See Examples →](./integrations#langchainjs-integration)

### Future Work

The following sections describe **additional tools** that could be built by the community.

## Potential Development Tools

### Editors and IDE Support

**Opportunities:**

- VS Code extension for syntax highlighting and validation
- IntelliJ/PyCharm plugin for YAML schema support
- Vim/Neovide plugins for PromptPack files
- Emacs modes with inline validation

**How to Build:**

1. Use the JSON Schema from this repository
2. Implement YAML language server features
3. Add PromptPack-specific linting rules
4. Publish to extension marketplaces

### CLI Utilities

**Potential Features:**

- Validate PromptPack files against schema
- Lint for best practices and conventions
- Generate boilerplate templates
- Convert between formats

**Example Implementation:**

```bash
# What could exist (doesn't exist yet)
promptpack validate my-file.promptpack.yml
promptpack lint --fix my-file.promptpack.yml
promptpack init --template basic
```

## Runtime Implementations

### JavaScript/TypeScript

**Available Now:**  
✅ **LangChain.js Integration** - [`@promptpack/langchain`](https://github.com/AltairaLabs/promptpack-langchainjs)

- Parses PromptPack JSON/YAML files
- Integrates with LangChain's LLM providers
- Implements tool calling and validation
- Full TypeScript support

### Potential Additional Implementations

The specification could be implemented in other languages:

#### Python

- Integration with LangChain, LlamaIndex, etc.
- Jupyter notebook support
- FastAPI/Flask endpoints
- CLI utilities

#### Other Languages

- Go - High-performance runtime
- Rust - Memory-safe implementation
- Java/Kotlin - Enterprise integrations

**Key Point:** Each implementation would need to:

1. Parse the PromptPack YAML format
2. Provide its own LLM provider integrations
3. Implement workflow execution logic
4. Handle tool calling

## Validation Tools

### What You Can Do Today

Use existing JSON Schema validators:

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate a PromptPack file
ajv validate \
  -s schema/promptpack.schema.json \
  -d my-file.promptpack.yml
```

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Validate PromptPack Files
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        
      - name: Install validator
        run: npm install -g ajv-cli
        
      - name: Validate files
        run: |
          for file in **/*.promptpack.yml; do
            ajv validate -s schema/promptpack.schema.json -d "$file"
          done
```

## How to Contribute

### Building a Tool

If you want to build something for the PromptPack ecosystem:

1. **Understand the Spec** - Read the specification thoroughly
2. **Use the Schema** - Leverage the JSON Schema for validation
3. **Start Small** - Build one focused tool rather than everything
4. **Document Well** - Clear examples and usage instructions
5. **Share Early** - Get feedback from the community

### What's Needed

High-value contributions:

#### Validation & Linting

- Pre-commit hooks for PromptPack files
- CI/CD action for validation
- Best practices linter

#### Developer Experience

- VS Code extension (most requested)
- Schema generators from examples
- File format converters

#### Reference Implementations

- Python library for parsing PromptPack files
- JavaScript/TypeScript parser
- Example runtimes

### Where to Discuss

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bugs in the specification or schema
- **Pull Requests** - Contributions to docs or schema

## Important Notes

### Scope Boundaries

PromptPack is a **file format specification**, not a framework. It:

✅ Defines how to structure prompts in files
✅ Provides JSON Schema for validation
✅ Documents best practices

❌ Does NOT provide LLM provider integrations
❌ Does NOT include a runtime/execution engine
❌ Does NOT offer hosted services

### Provider Integrations

**Critical:** Provider integrations (OpenAI, Anthropic, etc.) are **outside the scope** of PromptPack.

Each tool/library that uses PromptPack needs to:

- Choose which providers to support
- Implement its own API integrations
- Handle authentication and rate limiting
- Manage provider-specific features

PromptPack just defines the **file format** for prompts.

## Getting Started

### As a Tool Builder

1. Clone the repository: `git clone https://github.com/AltairaLabs/promptpack-spec`
2. Read the specification in `docs/`
3. Study the JSON Schema in `schema/`
4. Look at example files
5. Start building!

### As a User

1. Write PromptPack files following the spec
2. Validate them using JSON Schema tools
3. Test with PromptArena (if applicable)
4. Implement your own runtime or wait for community tools

## Future Vision

Over time, the ecosystem could include:

- **Tool Registry** - Discover community tools
- **Example Library** - Reusable PromptPack files
- **Best Practices** - Guides and patterns
- **Integration Directory** - Tools that support PromptPack

These are aspirational goals, not commitments.

## Questions?

- **Specification Questions** - Open a GitHub Discussion
- **Tool Ideas** - Start a Discussion to gauge interest
- **Bug Reports** - Open an Issue if you find spec problems
- **Contributions** - Submit a PR with improvements

[Visit GitHub Repository →](https://github.com/AltairaLabs/promptpack-spec)

---

**Note:** This page describes potential community tools and contribution opportunities. Most tools do not exist yet. If you're interested in building something, please join the discussion on GitHub!
