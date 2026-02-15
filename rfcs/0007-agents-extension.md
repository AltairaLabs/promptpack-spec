# RFC 0007: Agents Extension

- **Status:** Draft
- **Author(s):** AltairaLabs Team
- **Created:** 2026-02-15
- **Updated:** 2026-02-15
- **Related Issues:** N/A

## Summary

Extend the PromptPack specification to declare which prompts in a pack represent autonomous agents that can be discovered and invoked by other agents via the A2A (Agent-to-Agent) protocol. The extension is minimal: a new top-level `agents` section that maps prompt keys to agent roles, derives Agent Card metadata from existing prompt fields, and designates an entry point. No new communication protocol, skill definition format, or orchestration language is introduced — the extension builds entirely on existing PromptPack concepts and the A2A protocol.

## Motivation

Multi-agent systems are a dominant pattern in production AI deployments. A coordinator agent delegates work to specialist agents, each focused on a specific domain. This pattern appears across frameworks (LangGraph, Strands, CrewAI, Google ADK) and infrastructure platforms (AWS Bedrock AgentCore, Azure AI Agent Service).

PromptPack already has the building blocks:

- **Multiple prompts** in a single pack, each with its own system template, tools, parameters, and validators
- **A2A protocol support** in PromptKit, where agent skills are discovered via Agent Cards and registered as tools in the calling agent's tool registry
- **Tool definitions** that describe callable interfaces with JSON Schema parameters

What's missing is a way to declare **"this prompt is an agent"** inside the pack. Today, exposing a prompt as an A2A agent requires code — manually constructing an `AgentCard`, starting an `A2AServer`, and wiring discovery. This forces multi-agent topology out of the pack and into runtime code, breaking PromptPack's portability promise.

### Current Limitations

Without agent declarations, developers must:

- Write runtime code to expose prompts as A2A agents
- Manually construct Agent Cards that duplicate prompt metadata (name, description)
- Define skill IDs outside the pack, creating drift between prompt definitions and agent interfaces
- Hardcode agent topology in application code rather than declaring it portably

This leads to:

- **Reduced portability** — multi-agent systems can't be shared as a single pack
- **Metadata duplication** — Agent Card fields repeat what prompts already declare
- **Scattered topology** — which agents exist and how they relate is implicit in code
- **Testing friction** — arena configs define mock A2A agents separately from the prompts they represent

### Goals

- Allow authors to declare which prompts are agents within a pack
- Derive Agent Card metadata (name, description, skills) from existing prompt fields — no duplication
- Designate an entry point agent that receives external requests
- Keep the spec declarative — define topology, not orchestration logic
- Enable runtimes to deploy multi-agent systems from a single pack
- Maintain full backward compatibility with existing packs

### Non-Goals

- Define orchestration semantics (parallel vs sequential, fan-out strategies)
- Specify deployment topology (same process, separate containers, separate runtimes)
- Introduce a new communication protocol — A2A is the mechanism
- Define how agents share memory or state
- Prescribe specific coordinator/supervisor patterns
- Replace or subsume RFC 0005 (Workflow Extension) — workflows are intra-agent, agents are inter-agent

## Detailed Design

### Core Insight

A prompt already contains everything an A2A Agent Card needs:

| Prompt field | Agent Card field | Notes |
|---|---|---|
| prompt key (e.g., `researcher`) | `AgentSkill.id` | The prompt key becomes the skill ID |
| `name` | `AgentSkill.name` | Human-readable name |
| `description` | `AgentSkill.description` / `AgentCard.description` | What this agent does |
| `version` | `AgentCard.version` | Agent version |
| `parameters` | *(runtime config)* | LLM parameters for this agent |
| `tools` | *(internal to agent)* | Tools the agent uses, not exposed externally |

An agent prompt exposes **one skill** — the prompt itself. The skill ID is the prompt key. This is the simplest mapping: one prompt = one agent = one skill. If an agent needs multiple skills, it can be modeled as multiple prompts behind a lightweight router, or as a single prompt whose LLM routes internally based on the query.

### Schema Changes

#### New Top-Level Field: `agents`

```json
{
  "agents": {
    "type": "object",
    "description": "Declares which prompts in this pack are autonomous agents that can be discovered and invoked via the A2A protocol. When present, the pack represents a multi-agent system.",
    "required": ["entry"],
    "additionalProperties": false,
    "properties": {
      "entry": {
        "type": "string",
        "description": "The prompt key of the agent that receives external requests. This agent typically acts as the coordinator or router for the system.",
        "examples": ["coordinator", "router", "main"]
      },
      "members": {
        "type": "object",
        "description": "Map of prompt keys to agent configuration. Each key must reference a valid prompt in the prompts object. Prompts not listed here are internal (e.g., workflow phases) and are not exposed as agents.",
        "additionalProperties": {
          "$ref": "#/$defs/AgentDef"
        }
      }
    }
  }
}
```

#### New Definition: `AgentDef`

```json
{
  "AgentDef": {
    "type": "object",
    "description": "Agent-specific configuration for a prompt. Extends the prompt's existing metadata with A2A-specific properties.",
    "additionalProperties": false,
    "properties": {
      "description": {
        "type": "string",
        "description": "Override the prompt's description for the Agent Card skill description. Use this when the agent's external-facing description should differ from the prompt's internal description. If omitted, the prompt's description is used."
      },
      "tags": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Tags for agent/skill categorization and discovery filtering.",
        "examples": [["research", "web", "academic"]]
      },
      "input_modes": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Supported input content types. Defaults to ['text/plain'] if omitted.",
        "examples": [["text/plain", "image/*"]]
      },
      "output_modes": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Supported output content types. Defaults to ['text/plain'] if omitted.",
        "examples": [["text/plain"]]
      }
    }
  }
}
```

### How Agent Discovery Works

When a runtime processes a pack with an `agents` section:

1. **For each agent member**, generate an `AgentCard`:
   - `AgentCard.name` ← prompt's `name`
   - `AgentCard.description` ← prompt's `description`
   - `AgentCard.version` ← prompt's `version` (or pack version)
   - `AgentCard.skills[0].id` ← the prompt key
   - `AgentCard.skills[0].name` ← prompt's `name`
   - `AgentCard.skills[0].description` ← agent def's `description` override, or prompt's `description`
   - `AgentCard.skills[0].tags` ← agent def's `tags`
   - `AgentCard.skills[0].inputModes` ← agent def's `input_modes` or `["text/plain"]`
   - `AgentCard.skills[0].outputModes` ← agent def's `output_modes` or `["text/plain"]`

2. **For the entry agent**, its prompt's `tools` list may reference skill IDs of other agent members. The runtime resolves these as A2A tool calls via the standard `ToolBridge` → `ToolDescriptor` → `a2a.Executor` pipeline.

3. **The topology is implicit in tool references.** If the coordinator prompt lists `tools: [research, analyze]` and `research` and `analyze` are agent member prompt keys, the runtime knows the coordinator delegates to those agents. No separate graph definition is needed.

### Specification Impact

- The `agents` field is added to the top-level pack schema as an optional property
- The `AgentDef` definition is added to `$defs`
- All existing fields and definitions remain unchanged
- Packs without `agents` are unaffected

### Validation Rules

1. **Entry validation**: The `entry` value must reference a key in the `prompts` object
2. **Member validation**: Every key in `members` must reference a key in the `prompts` object
3. **Entry in members**: The `entry` prompt should be listed in `members` (or implicitly included — see Unresolved Questions)
4. **Tool reference validation**: If the entry agent's `tools` list contains a name matching a member prompt key, warn if that member is not in `members` (possible misconfiguration)
5. **No self-reference**: An agent's tools list should not include its own prompt key
6. **Backward compatibility**: The `agents` field is optional; existing packs without it remain valid

## Examples

### Example 1: Coordinator with Two Specialists

```yaml
id: research-team
name: Research Team
version: 1.0.0
template_engine:
  version: v1
  syntax: "{{variable}}"

prompts:
  coordinator:
    id: coordinator
    name: Research Coordinator
    description: Orchestrates research tasks by delegating to specialist agents
    version: 1.0.0
    system_template: |
      You are a research coordinator. When asked a question:
      1. Use the 'research' tool to gather information
      2. Use the 'analyze' tool to analyze findings
      3. Synthesize the results into a coherent answer
    tools: [research, analyze]
    parameters:
      temperature: 0.3
      max_tokens: 2000

  researcher:
    id: researcher
    name: Deep Researcher
    description: Searches academic papers and web sources for information
    version: 1.0.0
    system_template: |
      You are a research specialist. Search for relevant information
      and return comprehensive findings with sources.
    tools: [web_search, arxiv_search]
    parameters:
      temperature: 0.7
      max_tokens: 4000

  analyst:
    id: analyst
    name: Data Analyst
    description: Analyzes data and produces structured insights
    version: 1.0.0
    system_template: |
      You are a data analyst. Analyze the provided information
      and return structured insights with supporting evidence.
    parameters:
      temperature: 0.2
      max_tokens: 3000

agents:
  entry: coordinator
  members:
    coordinator: {}
    researcher:
      tags: [research, web, academic]
    analyst:
      tags: [analysis, data]

tools:
  web_search:
    name: Web Search
    description: Search the web for information
    parameters:
      type: object
      properties:
        query:
          type: string
      required: [query]
  arxiv_search:
    name: ArXiv Search
    description: Search academic papers on ArXiv
    parameters:
      type: object
      properties:
        query:
          type: string
      required: [query]
```

The coordinator's `tools: [research, analyze]` references the prompt keys of the researcher and analyst agents. The runtime resolves these as A2A calls.

### Example 2: Customer Service Router

```yaml
id: customer-service
name: Customer Service System
version: 1.0.0
template_engine:
  version: v1
  syntax: "{{variable}}"

prompts:
  router:
    id: router
    name: Customer Service Router
    description: Routes customer inquiries to the appropriate specialist
    version: 1.0.0
    system_template: |
      You are a customer service router for {{company}}.
      Classify the customer's intent and use the appropriate tool:
      - 'billing' for billing and payment questions
      - 'technical' for technical support issues
      - 'orders' for order status and shipping
    tools: [billing, technical, orders]
    variables:
      - name: company
        type: string
        required: true
    parameters:
      temperature: 0.1

  billing_agent:
    id: billing_agent
    name: Billing Specialist
    description: Handles billing inquiries, refunds, and payment issues
    version: 1.0.0
    system_template: |
      You are a billing specialist for {{company}}.
      Help customers with invoices, payments, refunds, and account charges.
    tools: [lookup_invoice, process_refund]
    variables:
      - name: company
        type: string
        required: true

  tech_agent:
    id: tech_agent
    name: Technical Support
    description: Resolves technical issues and troubleshooting
    version: 1.0.0
    system_template: |
      You are a technical support specialist.
      Diagnose issues and provide step-by-step solutions.
    tools: [search_kb, create_ticket]

  order_agent:
    id: order_agent
    name: Order Specialist
    description: Tracks orders and handles shipping inquiries
    version: 1.0.0
    system_template: |
      You are an order management specialist.
      Help customers track orders, update shipping, and handle returns.
    tools: [track_order, update_shipping]

agents:
  entry: router
  members:
    router: {}
    billing_agent:
      description: Answers billing and payment questions
      tags: [billing, payments, refunds]
    tech_agent:
      description: Resolves technical problems
      tags: [technical, troubleshooting]
    order_agent:
      description: Tracks orders and shipping
      tags: [orders, shipping, returns]
```

Note: The router's tools `[billing, technical, orders]` use skill IDs that differ from the prompt keys (`billing_agent`, `tech_agent`, `order_agent`). This raises a design question — see Unresolved Questions #1.

### Example 3: Multimodal Agent

```yaml
id: vision-assistant
name: Vision Assistant
version: 1.0.0
template_engine:
  version: v1
  syntax: "{{variable}}"

prompts:
  coordinator:
    id: coordinator
    name: Vision Coordinator
    description: Coordinates image analysis tasks
    version: 1.0.0
    system_template: |
      You help users understand images. Use the 'describe' tool
      to get detailed descriptions of images.
    tools: [describe]

  describer:
    id: describer
    name: Image Describer
    description: Provides detailed descriptions of images
    version: 1.0.0
    system_template: |
      You are an expert image analyst. Describe the image in detail,
      noting key objects, colors, composition, and context.
    media:
      enabled: true
      supported_types: [image]
      image:
        allowed_formats: [png, jpg, webp]
        max_size_mb: 10

agents:
  entry: coordinator
  members:
    coordinator: {}
    describer:
      input_modes: [text/plain, image/*]
      output_modes: [text/plain]
      tags: [vision, image-analysis]
```

## Drawbacks

### Minimal Abstraction Risk

The design is intentionally minimal — possibly too minimal. It doesn't address:

- Parallel fan-out (coordinator calling multiple agents simultaneously)
- Agent-to-agent communication patterns beyond tool calls
- Shared memory or context between agents
- Agent lifecycle management (startup order, health checks)

**Mitigation**: These are runtime concerns, not spec concerns. PromptPack defines *what*, runtimes define *how*. The implicit topology (via tool references) gives runtimes enough information to make deployment decisions.

### One Prompt = One Skill Limitation

Each agent prompt exposes exactly one skill. An agent that needs to advertise multiple skills requires multiple prompts.

**Mitigation**: In practice, most specialist agents have a single capability. A prompt's LLM can handle sub-routing internally. If multiple skills per agent become a common need, a future RFC can extend `AgentDef` with an explicit `skills` array.

### Implicit Topology May Be Too Implicit

The agent communication graph is inferred from tool references, not declared explicitly. This makes it harder to visualize or validate the topology statically.

**Mitigation**: Tooling can extract and visualize the graph from tool references. An explicit `connects_to` field could be added later if needed, but YAGNI for now.

## Alternatives

### Alternative 1: Separate Agent Manifest

Define agents in a separate file (`agents.yaml`) that references a PromptPack.

**Rejected**: Breaks PromptPack's single-file portability. The pack should be self-contained.

### Alternative 2: Explicit Skills on Each Prompt

Add a `skills` array directly on each prompt definition, similar to the Arena config's `A2ASkillConfig`.

```yaml
prompts:
  researcher:
    system_template: "..."
    agent:
      skills:
        - id: research
          name: Deep Research
          description: Searches and synthesizes
```

**Rejected**: Duplicates information already present on the prompt (name, description). The prompt *is* the skill — adding a nested skills array is redundant.

### Alternative 3: Reuse Workflow Extension (RFC 0005)

Map agents to workflow states, with the coordinator as the entry state and specialists as target states.

**Rejected**: Square peg, round hole. Workflow states are sequential phases within a single agent. Multi-agent coordination is fundamentally different:
- The coordinator stays active while delegating (it doesn't "transition" away)
- Multiple agents can run in parallel
- Agents are independent entities with their own identity
- Communication is request/response, not state transitions

### Alternative 4: Explicit Topology Graph

Declare the agent communication graph explicitly:

```yaml
agents:
  topology:
    coordinator:
      delegates_to: [researcher, analyst]
    researcher:
      reports_to: coordinator
```

**Rejected**: Duplicates information already present in tool references. If the coordinator's `tools` list includes `research` and `analyze`, the topology is already declared. A separate graph would need to be kept in sync with tool references.

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

The `agents` field is entirely optional. Existing packs without it remain valid. Runtimes that don't support agents ignore the field.

### Migration Path

No migration required. Adoption is incremental:

1. **Phase 1**: Continue using single-prompt packs (current behavior)
2. **Phase 2**: Use multi-prompt packs without `agents` (prompts selected by task_type at runtime)
3. **Phase 3**: Add `agents` section to declare multi-agent topology for A2A-aware runtimes

### Runtime Support Levels

- **Level 0**: Ignore `agents` field (backward compatible, single-prompt execution)
- **Level 1**: Validate `agents` structure but deploy as single runtime with prompt routing
- **Level 2**: Full multi-agent deployment with A2A Agent Cards and inter-agent communication

## Unresolved Questions

### 1. Skill ID vs Prompt Key

In Example 2, the router's `tools: [billing, technical, orders]` doesn't match the prompt keys `billing_agent`, `tech_agent`, `order_agent`. How should the runtime resolve this?

Options:
- **Option A**: Require tool names to match prompt keys exactly (simplest, most explicit)
- **Option B**: Allow an `skill_id` field on `AgentDef` that overrides the default (prompt key)
- **Option C**: Use the prompt key as the skill ID always — the coordinator just uses prompt keys as tool names

**Leaning toward Option A/C**: The prompt key IS the skill ID. Keep it simple. Example 2 would use `tools: [billing_agent, tech_agent, order_agent]`.

### 2. Should entry be listed in members?

If `entry: coordinator`, must `coordinator` appear in `members`? Or is the entry implicitly an agent?

**Proposal**: The entry prompt is implicitly an agent even if not in `members`. Members declares the *other* agents. But explicit listing doesn't hurt and may be clearer for validation.

### 3. Pack-level vs prompt-level tools for agents

When an agent's `tools` list contains a mix of regular tools (web_search) and agent references (researcher), should the spec distinguish them? Or is that purely a runtime resolution concern?

**Proposal**: No distinction in the spec. The runtime checks: "is this tool name a member prompt key? If yes, route via A2A. Otherwise, route via MCP/HTTP/mock."

### 4. Should agents declare their provider/model?

Should `AgentDef` include a `model` or `provider` field to specify which LLM the agent uses?

**Proposal**: No. This is a deployment concern. The pack defines behavior, the runtime/deployment config selects models. AgentCore's cross-framework pattern (different agents using different LLMs) is a runtime choice.

### 5. Relationship with RFC 0005 (Workflow)

Can a single prompt be both an agent (in `agents.members`) and participate in a workflow (in `workflow.states`)? For example, a specialist agent might internally use a workflow (intake → process → respond).

**Proposal**: Yes. These are orthogonal. A prompt can be an agent *and* use a workflow internally. The workflow manages intra-agent state; the agents section manages inter-agent topology.

## Future Considerations

### Multi-Skill Agents

If demand arises for agents that expose multiple skills, extend `AgentDef`:

```yaml
agents:
  members:
    researcher:
      skills:
        - id: search_papers
          description: Search academic papers
        - id: search_web
          description: Search the web
```

This would override the default one-prompt-one-skill mapping.

### Agent Groups and Scaling Hints

For large multi-agent systems, group agents by function and provide scaling hints:

```yaml
agents:
  groups:
    research_team:
      members: [researcher, analyst]
      scaling: parallel
    review_team:
      members: [reviewer, editor]
      scaling: sequential
```

### AgentCore Deployment Mapping

The `agents` section provides enough information for an AgentCore adapter to make deployment decisions:

- Entry agent → primary AgentCore Runtime
- Each member → separate AgentCore Runtime (or co-located, runtime's choice)
- Agent Cards → generated from prompt metadata
- Tool references between agents → A2A protocol wiring

---

## Revision History

- **2026-02-15:** Initial draft

## References

- [RFC 0005: Workflow Extension](./0005-workflow-extension.md)
- [RFC 0006: Evals Extension](./0006-evals-extension.md)
- [A2A Protocol Specification](https://google.github.io/A2A/)
- [AWS Bedrock AgentCore — A2A Protocol Support](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-a2a-protocol-contract.html)
- [PromptKit A2A Implementation](https://github.com/AltairaLabs/PromptKit/tree/main/runtime/a2a)
