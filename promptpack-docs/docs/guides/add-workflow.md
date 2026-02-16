---
sidebar_position: 1
title: "How to Add a Workflow"
---

# How to Add a Workflow

Add state-machine orchestration to an existing PromptPack so that transitions between prompts happen automatically based on events, without the caller deciding which prompt to invoke.

## Prerequisites

- A PromptPack with at least 2 prompts (v1.3 schema)
- Understanding of [Pack Structure](/docs/spec/structure)
- Familiarity with the prompts you want to orchestrate

## Step 1: Identify Your States

Each state in the workflow maps to a prompt. Look at your existing prompts and decide:

1. **Which prompt receives initial input?** → This becomes the entry state.
2. **What events cause transitions?** → These become `on_event` keys.
3. **Which states are terminal?** → These have an empty `on_event: {}`.

For example, if you have `triage`, `billing`, `technical`, and `closing` prompts:

```
triage (entry) ──[billing]──→ billing_state ──[resolved]──→ closing_state
               ──[technical]─→ tech_state   ──[resolved]──→ closing_state
```

## Step 2: Define Entry and Events

Add the `workflow` top-level field with a `version`, `entry`, and `states`:

```json
{
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "description": "Classify and route incoming requests",
        "on_event": {
          "billing": "billing_state",
          "technical": "tech_state"
        }
      }
    }
  }
}
```

Key rules:
- `entry` must reference a key in `states`
- `prompt_task` must reference a key in `prompts`
- `on_event` values must reference other state keys

## Step 3: Configure Persistence

Each state can be `transient` (default) or `persistent`:

- **`transient`**: Conversation context resets when entering this state. Good for classification/routing states where prior context isn't needed.
- **`persistent`**: Conversation context is preserved across turns. Good for states where the agent needs to remember what was discussed.

```json
{
  "billing_state": {
    "prompt_task": "billing",
    "on_event": { "resolved": "closing_state", "escalate": "escalation" },
    "persistence": "persistent"
  }
}
```

:::warning
Persistent states consume more tokens because the full conversation history is maintained. Use `transient` for stateless operations like classification or routing.
:::

## Step 4: Set Orchestration Mode

Each state can declare how it interacts with external systems:

- **`internal`** (default): The runtime handles execution entirely within the pack
- **`external`**: The state hands off to an external system (e.g., human-in-the-loop)
- **`hybrid`**: The runtime executes the prompt but may also coordinate with external systems

```json
{
  "escalation": {
    "prompt_task": "closing",
    "on_event": {},
    "orchestration": "external"
  }
}
```

## Step 5: Add Terminal States

Terminal states have an empty `on_event` object. The workflow ends when it reaches a terminal state:

```json
{
  "closing_state": {
    "prompt_task": "closing",
    "on_event": {},
    "orchestration": "internal"
  }
}
```

## Complete Example

Here's a PromptPack **before** adding a workflow (caller must choose which prompt to use):

```json
{
  "id": "support-pack",
  "name": "Support Pack",
  "version": "1.0.0",
  "template_engine": { "version": "v1", "syntax": "{{variable}}" },
  "prompts": {
    "triage": {
      "id": "triage",
      "name": "Triage",
      "version": "1.0.0",
      "system_template": "Classify the request as billing or technical.",
      "parameters": { "temperature": 0.3 }
    },
    "billing": {
      "id": "billing",
      "name": "Billing",
      "version": "1.0.0",
      "system_template": "Handle billing inquiries.",
      "parameters": { "temperature": 0.5 }
    },
    "technical": {
      "id": "technical",
      "name": "Technical",
      "version": "1.0.0",
      "system_template": "Provide technical troubleshooting.",
      "parameters": { "temperature": 0.4 }
    },
    "closing": {
      "id": "closing",
      "name": "Closing",
      "version": "1.0.0",
      "system_template": "Summarize the resolution.",
      "parameters": { "temperature": 0.6 }
    }
  }
}
```

And **after** adding workflow orchestration:

```json
{
  "id": "support-pack",
  "name": "Support Pack",
  "version": "2.0.0",
  "template_engine": { "version": "v1", "syntax": "{{variable}}" },
  "prompts": {
    "triage": {
      "id": "triage",
      "name": "Triage",
      "version": "1.0.0",
      "system_template": "Classify the request as billing or technical. Respond with exactly one word: billing or technical.",
      "parameters": { "temperature": 0.3 }
    },
    "billing": {
      "id": "billing",
      "name": "Billing",
      "version": "1.0.0",
      "system_template": "Handle billing inquiries. When the issue is resolved, respond with: resolved. If you cannot resolve it, respond with: escalate.",
      "parameters": { "temperature": 0.5 }
    },
    "technical": {
      "id": "technical",
      "name": "Technical",
      "version": "1.0.0",
      "system_template": "Provide technical troubleshooting. When the issue is resolved, respond with: resolved. If you cannot resolve it, respond with: escalate.",
      "parameters": { "temperature": 0.4 }
    },
    "closing": {
      "id": "closing",
      "name": "Closing",
      "version": "1.0.0",
      "system_template": "Summarize the resolution and ask if there's anything else.",
      "parameters": { "temperature": 0.6 }
    }
  },
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "description": "Classify and route incoming requests",
        "on_event": {
          "billing": "billing_state",
          "technical": "tech_state"
        }
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": {
          "resolved": "closing_state",
          "escalate": "escalation"
        },
        "persistence": "persistent"
      },
      "tech_state": {
        "prompt_task": "technical",
        "on_event": {
          "resolved": "closing_state",
          "escalate": "escalation"
        },
        "persistence": "persistent"
      },
      "closing_state": {
        "prompt_task": "closing",
        "on_event": {},
        "orchestration": "internal"
      },
      "escalation": {
        "prompt_task": "closing",
        "on_event": {},
        "orchestration": "external"
      }
    }
  }
}
```

## Validation Checklist

- [ ] `workflow.entry` references a valid state key
- [ ] Every `prompt_task` references a valid prompt key
- [ ] Every `on_event` value references a valid state key
- [ ] At least one state has an empty `on_event: {}` (terminal state)
- [ ] All states are reachable from the entry state
- [ ] Pack validates against the v1.3 JSON schema

:::warning Common Mistakes
- **Circular loops without exit**: Make sure there's always a path to a terminal state. A `billing → triage → billing` cycle with no `resolved` event creates an infinite loop.
- **Missing prompt_task**: Every state must have a `prompt_task` that matches a key in `prompts`. A typo here will fail schema validation.
- **Prompt doesn't emit expected events**: The workflow routes based on events like `"billing"` or `"resolved"`, but these must actually appear in the prompt's output. Update your `system_template` to instruct the model to emit the right event strings.
:::

## Next Steps

- [How to Set Up Agents](/docs/guides/setup-agents) — combine workflow with A2A discovery
- [Architecture Patterns](/docs/spec/architecture-patterns) — Router+Specialists, Pipeline, and other patterns
- [RFC 0005: Workflow Extension](/docs/rfcs/workflow-extension) — design rationale
