---
sidebar_position: 1
---

# Why PromptPack?

## The Engineering Challenge

Prompts have become critical business logic. They drive AI agents, orchestrate tool calls, run multi-step workflows, and make decisions that impact users directly. But most prompt development lacks the discipline we apply to traditional software engineering.

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

**PromptPack brings software engineering discipline to AI agent behavior.**

## Framework Independence

AI frameworks come and go. Your agent logic shouldn't.

PromptPack is deliberately NOT a framework—it's a specification. Just as:
- OpenAPI specifies REST APIs independent of implementation
- Docker images are portable across orchestration platforms
- SQL is a standard across different databases

PromptPack provides a standard format that works across:
- Any LLM provider (OpenAI, Anthropic, Google, local models)
- Any runtime implementation (PromptKit, custom runtimes)
- Any orchestration framework (when they add PromptPack support)

## What You Can Build

PromptPack expresses a wide range of agent shapes — from single-prompt assistants to multi-state autonomous loops — in one declarative file. You populate the sections your agent needs and leave the rest out.

### Agent Loops *(v1.4+)*

For agents that plan, act, observe, and revise, PromptPack ships a workflow state machine with the guardrails real loops need: terminal states, per-state visit limits, artifacts that carry structured results across iterations, and a global execution budget.

A code-generation agent might run `plan → implement → test → review`, cap `implement` at 5 retries, redirect to `review` if it loops, and ceiling the whole workflow at 50 transitions and 200 tool calls. Every artifact is captured at every transition — you get a replayable execution trace for free.

### Multi-Prompt Routing

Generic prompts trying to do everything perform worse than specialized prompts optimized for specific scenarios. A pack can carry several prompts that share tools and fragments — for example, a customer service pack with separate prompts for support, sales, technical, and billing inquiries, each tuned for its task.

### Multi-Agent Orchestration *(v1.3+)*

A2A-compatible agent definitions let one pack expose multiple agents, or coordinate handoffs between specialized agents — useful for delegation, review patterns, and federated agent systems.

### Evals and Guardrails

Each prompt can carry validators (guardrails) that block unsafe output inline, and evals (automated checks) that score quality asynchronously with Prometheus metric export. Quality policy ships with the pack.

See real examples in our [Specification Examples](/docs/spec/examples).

## Production Ready

PromptPack isn't just for documentation—it's designed for production use:

**Testing**: Built-in test metadata tracks which models have been tested and their success rates. PromptArena provides systematic multi-provider testing.

**Safety**: Validators and guardrails travel with your prompts. Define content filters, length limits, and custom validation rules once.

**Observability**: Structured format enables monitoring, logging, and analytics across your prompt infrastructure.

**Governance**: Version every prompt independently. Track changes. Roll back when needed. Audit who changed what.

## Current Status and Roadmap

PromptPack is an actively evolving specification:

** Available Now**:
- Complete v1.5.1 specification with agent loops, workflows, compositions, provider requirements, multi-agent definitions, skills, evals, and multimodal support
- JSON Schema for validation
- PromptKit reference runtime and PromptArena testing tool
- LangChain.js and LangChain Python adapter libraries
- RFC process for community-driven evolution

** Under Development**:
- Additional framework integrations (LlamaIndex, Transformers)
- Pack registry design

** Future Vision**:
- Growing ecosystem of compatible tools and runtimes
- Community-contributed PromptPack library
- PromptPack Hub for sharing and discovering packs

We're building toward an ecosystem. Join us in shaping the future of agent engineering.

## Getting Started

Ready to try PromptPack?

1. **Read the Spec**: Understand the [core concepts](/docs/spec/overview) and [structure](/docs/spec/structure)
2. **See Examples**: Review [real-world PromptPacks](/docs/spec/examples)
3. **Validate Your Ideas**: Use the [JSON Schema](/docs/spec/schema-reference) to validate your PromptPacks
4. **Test at Scale**: Try [PromptArena](/docs/ecosystem/arena-testing) for multi-provider testing
5. **Contribute**: Join the [RFC process](/docs/processes/rfc-process) to shape the specification

[Get Started →](/docs/getting-started)
