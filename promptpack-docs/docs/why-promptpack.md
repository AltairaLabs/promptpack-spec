---
sidebar_position: 1
---

# Why PromptPack?

## The Engineering Challenge

Prompts have become critical business logic. They orchestrate AI systems, integrate with tools, handle multi-turn conversations, and make decisions that impact users directly. But most prompt development lacks the discipline we apply to traditional software engineering.

Consider what we have for traditional code:
- Version control (Git)
- Package managers (npm, pip, Maven)
- Testing frameworks (Jest, pytest, JUnit)
- CI/CD pipelines
- Dependency management
- Reproducible builds

Now consider typical prompt development:
- Prompts scattered across codebases
- Copy-pasted between projects
- No standard format
- Framework lock-in
- Difficult to test systematically
- Hard to version independently

**PromptPack brings software engineering discipline to conversational AI.**

## Framework Independence

AI frameworks come and go. Your prompt logic shouldn't.

PromptPack is deliberately NOT a framework—it's a specification. Just as:
- OpenAPI specifies REST APIs independent of implementation
- Docker images are portable across orchestration platforms
- SQL is a standard across different databases

PromptPack provides a standard format that works across:
- Any LLM provider (OpenAI, Anthropic, Google, local models)
- Any runtime implementation (PromptKit, custom runtimes)
- Any orchestration framework (when they add PromptPack support)

## Multi-Prompt Architecture

Generic prompts trying to do everything perform worse than specialized prompts optimized for specific scenarios.

A production customer service AI needs:
- **Support prompt**: Optimized for empathy, ticket creation, escalation
- **Sales prompt**: Focused on product knowledge, opportunity detection
- **Technical prompt**: Detailed troubleshooting, diagnostic tools
- **Billing prompt**: Payment handling, invoice generation, PII protection

Each prompt:
- Uses appropriate temperature settings for its task
- Has specialized tools and validators
- Can evolve independently with its own version
- Shares common fragments and configuration

See real examples in our [Specification Examples](/docs/spec/examples).

## Production Ready

PromptPack isn't just for documentation—it's designed for production use:

**Testing**: Built-in test metadata tracks which models have been tested and their success rates. PromptArena provides systematic multi-provider testing.

**Safety**: Validators and guardrails travel with your prompts. Define content filters, length limits, and custom validation rules once.

**Observability**: Structured format enables monitoring, logging, and analytics across your prompt infrastructure.

**Governance**: Version every prompt independently. Track changes. Roll back when needed. Audit who changed what.

## Current Status and Roadmap

PromptPack is an emerging specification:

**✅ Available Now**:
- Complete v1.1 specification with multimodal support
- JSON Schema for validation
- Comprehensive documentation and real-world examples
- PromptArena testing tool for multi-provider evaluation
- RFC process for community-driven evolution

**🚧 Under Development**:
- PromptKit reference runtime implementation
- Language-specific SDK libraries (Python, JavaScript)
- Validation and linting tools

**🔮 Future Vision**:
- Growing ecosystem of compatible tools
- Community-contributed PromptPack library
- Framework integrations (LangChain, LlamaIndex, etc.)
- PromptPack Hub for sharing and discovering packs

We're building toward an ecosystem. Join us in shaping the future of prompt engineering.

## Getting Started

Ready to try PromptPack?

1. **Read the Spec**: Understand the [core concepts](/docs/spec/overview) and [structure](/docs/spec/structure)
2. **See Examples**: Review [real-world PromptPacks](/docs/spec/examples)
3. **Validate Your Ideas**: Use the [JSON Schema](/docs/spec/schema-reference) to validate your PromptPacks
4. **Test at Scale**: Try [PromptArena](/docs/ecosystem/arena-testing) for multi-provider testing
5. **Contribute**: Join the [RFC process](/docs/processes/rfc-process) to shape the specification

[Get Started →](/docs/getting-started)
