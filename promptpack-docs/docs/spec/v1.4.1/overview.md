---
title: "Specification Overview"
sidebar:
  label: "Specification Overview (v1.4.1)"
  order: 2
---

<span className="ppVersionBadge ppVersionBadge--archived">v1.4.1 · stable</span>

:::caution[Archived Version]
This is the **v1.4.1** documentation. For the latest features, see [v1.5.0 docs →](../overview)
:::

PromptPack is a portable specification for packaging AI agent behavior into reusable, testable bundles. Think of it as a "container format" for AI applications—similar to how Docker containers package software, PromptPacks package everything an agent needs to run: prompts, tools, workflows, guardrails, and evals.

## Why PromptPacks?

### The Challenge

Production AI agents involve more than a single prompt. You need:

- **Specialized prompts** for different scenarios or workflow stages
- **External tools** the agent can call (databases, APIs, calculators)
- **Workflows** that coordinate multi-step or iterative behavior
- **Shared resources** like reusable fragments and configuration
- **Safety guardrails** to constrain output
- **Version management** to track changes and ensure compatibility
- **Testing** to validate behavior across providers and models

Without a standard format, AI applications fragment, become hard to maintain, and lock in to a single framework or provider.

### The Solution

A PromptPack is a **single JSON file** that contains everything needed to run an AI agent. Here's an autonomous coding agent expressed as a pack — a `plan → implement → test → review` loop with bounded retries and a hard execution budget:

```json
{
 "id": "code-agent",
 "name": "Code Generation Agent",
 "version": "1.0.0",
 "prompts": {
 "plan": { /* break a task into steps */ },
 "implement": { /* write code for the current step */ },
 "test": { /* run and interpret tests */ },
 "review": { /* summarize what's left if the loop is exhausted */ }
 },
 "workflow": {
 "entry": "plan",
 "states": {
 "plan": { "prompt_task": "plan", "on_event": { "PlanReady": "implement" } },
 "implement": {
 "prompt_task": "implement",
 "max_visits": 5,
 "on_max_visits": "review",
 "on_event": { "CodeReady": "test" }
 },
 "test": { "prompt_task": "test", "on_event": { "TestsFailed": "implement", "TestsPassed": "done" } },
 "done": { "prompt_task": "review", "terminal": true },
 "review": { "prompt_task": "review", "terminal": true }
 },
 "engine": { "budget": { "max_total_visits": 50, "max_tool_calls": 200, "max_wall_time_sec": 600 } }
 },
 "tools": { /* shared external functions */ },
 "fragments": { /* reusable text components */ },
 "evals": [ /* automated quality checks (v1.2+) */ ],
 "agents": { /* A2A agent definitions (v1.3+) */ },
 "skills": [ /* progressive-disclosure knowledge (v1.3.1+) */ ]
}
```

The same spec format expresses simpler shapes too — a single-prompt assistant, a multi-prompt router, or a multi-agent system — depending on which sections you populate.

## Core Capabilities

### Agent Loops *(v1.4+)*

Build iterative, self-correcting agents on top of the workflow state machine. Terminal states (`terminal: true`) mark exit points explicitly. Per-state visit limits (`max_visits` plus optional `on_max_visits` redirect) cap individual loops without killing the whole workflow. Named artifact slots flow structured metadata across visits, and a global execution budget (`engine.budget`) provides a safety net for total visits, tool calls, and wall time. Artifacts captured at every transition give you a complete, replayable execution trace — time-travel debugging for free.

### Workflows & Multi-Agent Orchestration *(v1.3+)*

Define state-machine workflows over prompts with event-driven transitions. Combine with A2A-compatible agent definitions to coordinate multi-agent systems — route between specialized prompts or agents based on events, with configurable persistence and orchestration modes.

### Multi-Prompt Architecture

Instead of one generic prompt trying to handle everything, PromptPacks let you create **specialized prompts** for specific tasks. A customer service pack might route between billing, technical support, and sales inquiries — each prompt optimized for its purpose while sharing tools and configuration.

### Skills *(v1.3.1+)*

Declare modular knowledge sources that agents load progressively on demand. Skills can be file paths, package references, or inline definitions — keeping system templates lean while giving agents deep domain expertise when needed. Workflow states can scope which skills are available in each context.

### Tool Integration

Define external tools once, reference them from any prompt in the pack. Whether it's looking up data, performing calculations, or calling external APIs, tools are reusable across all prompts and workflow states.

### Built-in Safety

Each prompt can have its own validators (guardrails) to block unsafe output inline. Define content filters, length limits, and custom validation rules that travel with the pack.

### Evals & Testability *(v1.2+)*

Ship quality policy alongside your prompts. Evals run asynchronously and produce scores via Prometheus metrics. Testing metadata tracks which models have been tested and how well they performed.

### Complete Packaging

Everything needed to run your agent — prompts, workflow, tools, fragments, evals, agents, skills — lives in one file. Deploy once, run anywhere.

### Reusability & Sharing

PromptPacks are portable. Build a pack once, then use it across different applications, teams, or organizations. Share best practices through standardized, tested packages.

## Real-World Use Cases

### Autonomous Agent Loops

A code-generation agent runs `plan → implement → test → review` with `implement` capped at 5 retries (redirecting to `review` if it loops), `test` bouncing back on failures, and a global ceiling of 50 transitions and 200 tool calls. Artifacts capture each generated commit and test report for replay and post-hoc review.

### Multi-Prompt Customer Service

A customer service pack includes specialized prompts for general support, sales inquiries, and technical troubleshooting, with shared fragments for company policies and escalation procedures — and validators that enforce PII handling on the billing path.

### Content Creation

A content generation pack contains a blog-writing prompt with SEO optimization tools, a social-media prompt with character-limit validators, and an email-marketing prompt with A/B testing tools — all sharing brand voice fragments.

### Educational Assistant

A tutoring pack pairs an adaptive-questioning prompt, an assessment prompt with grading rubrics, and a research prompt with citation tools — all anchored to curriculum fragments aligned with learning standards.

## Design Philosophy

PromptPacks follow a few principles:

**Modularity**: Each prompt handles one domain well rather than trying to do everything

**Composability**: Shared tools, fragments, and configuration reduce duplication

**Portability**: Works across different AI providers and runtime environments

**Versioning**: Track changes and maintain compatibility as your agents evolve

**Observability**: Built-in evals, validators, and testing metadata make behavior measurable

## Getting Started

The PromptPack format is designed to be both human-readable and machine-executable. Whether you're hand-crafting prompts or generating them programmatically, the JSON structure provides the flexibility and power needed for production agents.

Ready to dive deeper? Explore the [structure guide](./structure) to understand how packs are organized, or jump to [examples](./examples) to see complete, real-world PromptPacks in action.
