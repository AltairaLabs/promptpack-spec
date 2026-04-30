---
sidebar_position: 2
title: "How to Set Up Agents"
---

# How to Set Up Agents

Make your PromptPack prompts discoverable via the A2A (Agent-to-Agent) protocol so external systems can find and invoke them. Agents can be used with or without a workflow.

## Prerequisites

- A PromptPack with at least 1 prompt (v1.3+ schema)
- Understanding of [Pack Structure](/docs/spec/structure)

## Step 1: Choose Which Prompts Become Agents

Not every prompt needs to be an agent. Consider which prompts should be externally discoverable:

| Make it an agent if... | Skip if... |
|------------------------|------------|
| External systems need to invoke it directly | It's only used internally (e.g., a closing summary) |
| It provides a distinct, discoverable capability | It's a utility prompt used by other prompts |
| It should appear in an A2A Agent Card | It's a workflow-only state with no external value |

## Step 2: Add the Agents Block

Add the `agents` top-level field with `entry` and `members`:

```json
{
  "agents": {
    "entry": "researcher",
    "members": {
      "researcher": {
        "description": "Gathers information from multiple sources on a given topic"
      }
    }
  }
}
```

Key rules:
- `entry` must reference a key in `members`
- Each key in `members` must match a key in `prompts`
- `description` is technically optional in the schema but **strongly recommended** — it becomes the agent's A2A Agent Card description and is what registries and routers use for discovery

## Step 3: Configure Tags and MIME Types

Add metadata that helps external systems discover and understand your agents:

```json
{
  "agents": {
    "entry": "researcher",
    "members": {
      "researcher": {
        "description": "Gathers information from multiple sources on a given topic",
        "tags": ["research", "information-gathering"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain", "application/json"]
      }
    }
  }
}
```

- **`tags`**: Discovery labels for categorizing agents. External systems can search by tag.
- **`input_modes`**: MIME types the agent accepts. Defaults to `["text/plain"]` if omitted.
- **`output_modes`**: MIME types the agent can produce. Defaults to `["text/plain"]` if omitted.

## Step 4 (Optional): Combine with Workflow

Agents and workflow are orthogonal — use both when you need internal routing *and* external discovery:

```json
{
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "on_event": { "billing": "billing_state" }
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing" },
        "persistence": "persistent"
      },
      "closing": {
        "prompt_task": "closing",
        "on_event": {}
      }
    }
  },
  "agents": {
    "entry": "triage",
    "members": {
      "triage": {
        "description": "Routes requests to the right specialist",
        "tags": ["router"]
      },
      "billing": {
        "description": "Handles billing inquiries and payment issues",
        "tags": ["billing", "payments"],
        "output_modes": ["text/plain", "application/json"]
      }
    }
  }
}
```

In this pattern:
- The **workflow** handles internal routing (triage → billing → closing)
- The **agents** section makes `triage` and `billing` discoverable via A2A
- `closing` is not an agent — it's an internal-only workflow state

## Step 5 (Alternative): Standalone Agent Pattern

For agents that collaborate dynamically (no fixed sequence), skip the workflow entirely. Agents discover and invoke each other through tool references in their prompts:

```json
{
  "prompts": {
    "researcher": {
      "id": "researcher",
      "name": "Researcher",
      "version": "1.0.0",
      "system_template": "Research the topic. Use fact_checker for verification.",
      "tools": ["web_search", "fact_checker"]
    },
    "fact_checker": {
      "id": "fact_checker",
      "name": "Fact Checker",
      "version": "1.0.0",
      "system_template": "Verify claims by cross-referencing sources.",
      "tools": ["web_search"]
    }
  },
  "agents": {
    "entry": "researcher",
    "members": {
      "researcher": {
        "description": "Researches topics from multiple sources",
        "tags": ["research"]
      },
      "fact_checker": {
        "description": "Verifies factual claims with confidence scores",
        "tags": ["verification"],
        "input_modes": ["text/plain", "application/json"],
        "output_modes": ["application/json"]
      }
    }
  }
}
```

The `researcher` references `fact_checker` as a tool. The runtime resolves this: if `fact_checker` is a member prompt key, it routes via A2A. Otherwise, it routes via MCP/HTTP.

## Complete Example

A full pack with three standalone agents:

```json
{
  "id": "content-team",
  "name": "Content Team",
  "version": "1.3.0",
  "template_engine": { "version": "v1", "syntax": "{{variable}}" },

  "prompts": {
    "planner": {
      "id": "planner",
      "name": "Content Planner",
      "version": "1.0.0",
      "system_template": "Plan a content strategy for {{topic}}. Use the writer to draft content and the reviewer to check quality.",
      "variables": [
        { "name": "topic", "type": "string", "required": true }
      ],
      "tools": ["writer", "reviewer"],
      "parameters": { "temperature": 0.7 }
    },
    "writer": {
      "id": "writer",
      "name": "Content Writer",
      "version": "1.0.0",
      "system_template": "Write content based on the brief provided. Produce polished, engaging copy.",
      "parameters": { "temperature": 0.8, "max_tokens": 2000 }
    },
    "reviewer": {
      "id": "reviewer",
      "name": "Content Reviewer",
      "version": "1.0.0",
      "system_template": "Review the content for accuracy, clarity, and brand alignment. Return structured feedback.",
      "tools": ["writer"],
      "parameters": { "temperature": 0.3 }
    }
  },

  "agents": {
    "entry": "planner",
    "members": {
      "planner": {
        "description": "Plans content strategy and coordinates writer and reviewer",
        "tags": ["planning", "content-strategy"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain", "application/json"]
      },
      "writer": {
        "description": "Writes polished content from briefs and outlines",
        "tags": ["writing", "content-creation"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain"]
      },
      "reviewer": {
        "description": "Reviews content for quality, accuracy, and brand alignment",
        "tags": ["review", "quality-assurance"],
        "input_modes": ["text/plain"],
        "output_modes": ["application/json"]
      }
    }
  }
}
```

## Validation Checklist

- [ ] `agents.entry` references a valid key in `members`
- [ ] Every key in `members` matches a key in `prompts`
- [ ] Every member has a `description` *(optional in schema, but required in practice for A2A discovery)*
- [ ] If using workflow + agents, `workflow.entry` and `agents.entry` can differ (they serve different purposes)
- [ ] MIME types in `input_modes`/`output_modes` are valid
- [ ] Pack validates against the v1.3+ JSON schema

:::warning Common Mistakes
- **Agent key doesn't match prompt key**: `members.billing_agent` won't work if the prompt key is `billing`. The keys must match exactly.
- **Missing description**: The schema technically allows agent members without a `description`, but you almost always want one — it becomes the A2A Agent Card's description and is what registries and routers use for discovery.
- **Confusing workflow entry with agent entry**: `workflow.entry` is the first *state* in the state machine. `agents.entry` is the default agent for *incoming external requests*. They can reference different prompts.
:::

## Next Steps

- [How to Add a Workflow](/docs/guides/add-workflow) — add state-machine orchestration
- [How to Add Evals](/docs/guides/add-evals) — monitor agent quality
- [Architecture Patterns](/docs/spec/architecture-patterns) — Agent Mesh, Hybrid, and other patterns
- [RFC 0007: Agents Extension](/docs/rfcs/agents-extension) — design rationale
