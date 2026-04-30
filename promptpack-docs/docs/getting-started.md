---
sidebar_position: 2
---

# Getting Started with PromptPack

Build a complete customer feedback system step-by-step, learning each PromptPack feature as you go. By the end of this tutorial you'll have a production-ready pack with multiple prompts, shared resources, validators, evals, a workflow, and agent definitions. Once you're comfortable, see [Agent Loops](/docs/spec/structure#agent-loops-v14) for the v1.4 fields (`terminal`, `max_visits`, `artifacts`, `engine.budget`) that turn an unbounded workflow into a production-safe iterative agent.

**Time investment**: ~45 minutes

**What you'll build**: A customer feedback system that collects feedback, analyzes sentiment, drafts responses, and monitors quality — all in a single PromptPack.

## Step 1: Create a Minimal Pack

Every PromptPack starts with a pack identity and at least one prompt. Create a file called `feedback-system.promptpack.json`:

```json
{
  "$schema": "https://promptpack.org/schema/latest/promptpack.schema.json",
  "id": "feedback-system",
  "name": "Customer Feedback System",
  "version": "1.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "prompts": {
    "collector": {
      "id": "collector",
      "name": "Feedback Collector",
      "version": "1.0.0",
      "system_template": "You are a customer feedback collector. Ask the customer about their experience and categorize their feedback as positive, neutral, or negative."
    }
  }
}
```

This is a valid PromptPack. The required fields are:
- **`id`**: Unique identifier for the pack
- **`name`**: Human-readable name
- **`version`**: Semantic version
- **`template_engine`**: Defines the templating system
- **`prompts`**: At least one prompt

Validate it against the schema using any JSON Schema validator.

## Step 2: Add Variables and a Second Prompt

Variables make prompts reusable. Add a `{{company}}` variable to the collector and create an `analyzer` prompt:

```json
{
  "prompts": {
    "collector": {
      "id": "collector",
      "name": "Feedback Collector",
      "version": "1.0.0",
      "system_template": "You are a feedback collector for {{company}}. Ask the customer about their experience and categorize their feedback as positive, neutral, or negative.",
      "variables": [
        {
          "name": "company",
          "type": "string",
          "required": true,
          "example": "Acme Corp"
        }
      ],
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 300
      }
    },
    "analyzer": {
      "id": "analyzer",
      "name": "Sentiment Analyzer",
      "version": "1.0.0",
      "system_template": "You are a sentiment analysis specialist for {{company}}.\n\nAnalyze the customer feedback and return a JSON object with: sentiment (positive/neutral/negative), confidence (0-1), key_themes (array), and suggested_action.",
      "variables": [
        {
          "name": "company",
          "type": "string",
          "required": true
        }
      ],
      "parameters": {
        "temperature": 0.2,
        "max_tokens": 500
      }
    }
  }
}
```

Notice how each prompt has its own `parameters` — the collector uses higher temperature for natural conversation, while the analyzer uses low temperature for consistent classifications.

## Step 3: Share Resources with Fragments and Tools

Fragments let you reuse text across prompts. Tools define capabilities prompts can invoke. Add both to your pack:

```json
{
  "fragments": {
    "company_context": "{{company}} values every customer interaction. Our goal is to understand, learn, and improve from all feedback.",
    "response_guidelines": "Be empathetic and professional. Acknowledge the customer's experience. Never be dismissive."
  },
  "tools": {
    "log_feedback": {
      "name": "log_feedback",
      "description": "Log customer feedback to the database",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" },
          "sentiment": { "type": "string", "enum": ["positive", "neutral", "negative"] },
          "summary": { "type": "string" }
        },
        "required": ["sentiment", "summary"]
      }
    },
    "lookup_customer": {
      "name": "lookup_customer",
      "description": "Retrieve customer account information",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" }
        },
        "required": ["customer_id"]
      }
    }
  }
}
```

Now reference fragments in your prompt templates with `{{fragments.company_context}}` and assign tools to prompts:

```json
{
  "collector": {
    "system_template": "You are a feedback collector for {{company}}.\n\n{{fragments.company_context}}\n\n{{fragments.response_guidelines}}\n\nAsk about their experience and categorize feedback as positive, neutral, or negative.",
    "tools": ["lookup_customer", "log_feedback"]
  }
}
```

Fragments are defined once and used by any prompt — update the company context in one place and every prompt gets the change.

## Step 4: Add Safety with Validators

Validators are inline guardrails that check every response. Add them to prompts that interact with customers:

```json
{
  "collector": {
    "validators": [
      {
        "type": "banned_words",
        "enabled": true,
        "fail_on_violation": true,
        "params": {
          "words": ["don't care", "not my problem", "deal with it"]
        }
      },
      {
        "type": "pii_detection",
        "enabled": true,
        "fail_on_violation": true
      }
    ]
  }
}
```

- **`banned_words`**: Prevents dismissive language in customer-facing responses
- **`pii_detection`**: Blocks responses that accidentally include personal data

When `fail_on_violation` is `true`, the runtime blocks the response entirely.

## Step 5: Add Quality Monitoring with Evals

Evals run asynchronously and produce metrics — they don't block responses. Add a pack-level eval for cross-cutting quality and a prompt-level eval for the analyzer:

```json
{
  "evals": [
    {
      "id": "empathy-score",
      "description": "Monitors empathy level across all customer-facing responses",
      "type": "llm_judge",
      "trigger": "sample_turns",
      "sample_percentage": 20,
      "metric": {
        "name": "promptpack_empathy_score",
        "type": "gauge",
        "range": { "min": 1, "max": 5 }
      },
      "params": {
        "judge_prompt": "Rate the empathy level of this customer interaction from 1 (cold/robotic) to 5 (warm/genuinely caring).",
        "model": "gpt-4o",
        "passing_score": 4
      }
    }
  ]
}
```

This pack-level eval samples 20% of turns across all prompts, tracking empathy trends on a Prometheus gauge.

For the analyzer, add a prompt-level eval:

```json
{
  "analyzer": {
    "evals": [
      {
        "id": "classification-accuracy",
        "description": "Checks whether sentiment classification matches the feedback content",
        "type": "llm_judge",
        "trigger": "every_turn",
        "metric": {
          "name": "promptpack_classification_accuracy",
          "type": "boolean"
        },
        "params": {
          "judge_prompt": "Does the sentiment classification (positive/neutral/negative) accurately reflect the customer's feedback? Answer true or false.",
          "model": "gpt-4o"
        }
      }
    ]
  }
}
```

:::info
Validators block bad output inline. Evals score and report asynchronously. Use both together — validators for hard safety, evals for continuous quality monitoring. See [Architecture Patterns](/docs/spec/architecture-patterns) for more on this distinction.
:::

## Step 6: Orchestrate with a Workflow

Add a workflow so requests flow automatically: collect feedback → analyze sentiment → draft a response.

Add a `responder` prompt for drafting follow-up responses, then wire everything together with a workflow:

```json
{
  "prompts": {
    "responder": {
      "id": "responder",
      "name": "Response Drafter",
      "version": "1.0.0",
      "system_template": "You are a customer response specialist for {{company}}.\n\n{{fragments.response_guidelines}}\n\nDraft a personalized follow-up response based on the feedback analysis.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.6, "max_tokens": 500 }
    }
  },
  "workflow": {
    "version": 1,
    "entry": "collect",
    "states": {
      "collect": {
        "prompt_task": "collector",
        "description": "Collect and categorize customer feedback",
        "on_event": {
          "positive": "analyze",
          "neutral": "analyze",
          "negative": "analyze"
        }
      },
      "analyze": {
        "prompt_task": "analyzer",
        "description": "Perform sentiment analysis on collected feedback",
        "on_event": {
          "analyzed": "respond"
        },
        "persistence": "persistent"
      },
      "respond": {
        "prompt_task": "responder",
        "description": "Draft a follow-up response",
        "on_event": {},
        "persistence": "persistent"
      }
    }
  }
}
```

The workflow defines a pipeline: collect → analyze → respond. Each state references a prompt via `prompt_task`, and transitions happen based on events emitted by the prompt.

## Step 7: Expose as Agents

Make your prompts discoverable by external systems via the A2A protocol:

```json
{
  "agents": {
    "entry": "collector",
    "members": {
      "collector": {
        "description": "Collects and categorizes customer feedback through conversation",
        "tags": ["feedback", "customer-service"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain"]
      },
      "analyzer": {
        "description": "Analyzes customer feedback sentiment and extracts key themes",
        "tags": ["analysis", "sentiment"],
        "input_modes": ["text/plain"],
        "output_modes": ["application/json"]
      },
      "responder": {
        "description": "Drafts personalized follow-up responses to customer feedback",
        "tags": ["response", "customer-service"],
        "input_modes": ["text/plain", "application/json"],
        "output_modes": ["text/plain"]
      }
    }
  }
}
```

Each agent gets an A2A Agent Card with description, tags, and MIME types — external systems can discover and invoke them directly.

## Step 8: The Complete Pack

Here's the full `feedback-system.promptpack.json` combining everything from the previous steps:

```json
{
  "$schema": "https://promptpack.org/schema/latest/promptpack.schema.json",
  "id": "feedback-system",
  "name": "Customer Feedback System",
  "version": "1.4.0",
  "description": "Complete customer feedback collection, analysis, and response system",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "evals": [
    {
      "id": "empathy-score",
      "description": "Monitors empathy level across all customer-facing responses",
      "type": "llm_judge",
      "trigger": "sample_turns",
      "sample_percentage": 20,
      "metric": {
        "name": "promptpack_empathy_score",
        "type": "gauge",
        "range": { "min": 1, "max": 5 }
      },
      "params": {
        "judge_prompt": "Rate the empathy level of this customer interaction from 1 (cold/robotic) to 5 (warm/genuinely caring).",
        "model": "gpt-4o",
        "passing_score": 4
      }
    }
  ],

  "prompts": {
    "collector": {
      "id": "collector",
      "name": "Feedback Collector",
      "version": "1.0.0",
      "system_template": "You are a feedback collector for {{company}}.\n\n{{fragments.company_context}}\n\n{{fragments.response_guidelines}}\n\nAsk about their experience and categorize feedback as positive, neutral, or negative.",
      "variables": [
        { "name": "company", "type": "string", "required": true, "example": "Acme Corp" }
      ],
      "tools": ["lookup_customer", "log_feedback"],
      "parameters": { "temperature": 0.7, "max_tokens": 300 },
      "validators": [
        {
          "type": "banned_words",
          "enabled": true,
          "fail_on_violation": true,
          "params": { "words": ["don't care", "not my problem", "deal with it"] }
        },
        {
          "type": "pii_detection",
          "enabled": true,
          "fail_on_violation": true
        }
      ]
    },
    "analyzer": {
      "id": "analyzer",
      "name": "Sentiment Analyzer",
      "version": "1.0.0",
      "system_template": "You are a sentiment analysis specialist for {{company}}.\n\nAnalyze the customer feedback and return a JSON object with: sentiment (positive/neutral/negative), confidence (0-1), key_themes (array), and suggested_action.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.2, "max_tokens": 500 },
      "evals": [
        {
          "id": "classification-accuracy",
          "description": "Checks whether sentiment classification matches the feedback content",
          "type": "llm_judge",
          "trigger": "every_turn",
          "metric": {
            "name": "promptpack_classification_accuracy",
            "type": "boolean"
          },
          "params": {
            "judge_prompt": "Does the sentiment classification accurately reflect the customer's feedback? Answer true or false.",
            "model": "gpt-4o"
          }
        }
      ]
    },
    "responder": {
      "id": "responder",
      "name": "Response Drafter",
      "version": "1.0.0",
      "system_template": "You are a customer response specialist for {{company}}.\n\n{{fragments.response_guidelines}}\n\nDraft a personalized follow-up response based on the feedback analysis.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.6, "max_tokens": 500 }
    }
  },

  "workflow": {
    "version": 1,
    "entry": "collect",
    "states": {
      "collect": {
        "prompt_task": "collector",
        "description": "Collect and categorize customer feedback",
        "on_event": {
          "positive": "analyze",
          "neutral": "analyze",
          "negative": "analyze"
        }
      },
      "analyze": {
        "prompt_task": "analyzer",
        "description": "Perform sentiment analysis",
        "on_event": { "analyzed": "respond" },
        "persistence": "persistent"
      },
      "respond": {
        "prompt_task": "responder",
        "description": "Draft follow-up response",
        "on_event": {},
        "persistence": "persistent"
      }
    }
  },

  "agents": {
    "entry": "collector",
    "members": {
      "collector": {
        "description": "Collects and categorizes customer feedback through conversation",
        "tags": ["feedback", "customer-service"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain"]
      },
      "analyzer": {
        "description": "Analyzes customer feedback sentiment and extracts key themes",
        "tags": ["analysis", "sentiment"],
        "input_modes": ["text/plain"],
        "output_modes": ["application/json"]
      },
      "responder": {
        "description": "Drafts personalized follow-up responses to customer feedback",
        "tags": ["response", "customer-service"],
        "input_modes": ["text/plain", "application/json"],
        "output_modes": ["text/plain"]
      }
    }
  },

  "tools": {
    "lookup_customer": {
      "name": "lookup_customer",
      "description": "Retrieve customer account information",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string", "description": "Customer account ID" }
        },
        "required": ["customer_id"]
      }
    },
    "log_feedback": {
      "name": "log_feedback",
      "description": "Log customer feedback to the database",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" },
          "sentiment": { "type": "string", "enum": ["positive", "neutral", "negative"] },
          "summary": { "type": "string" }
        },
        "required": ["sentiment", "summary"]
      }
    }
  },

  "fragments": {
    "company_context": "{{company}} values every customer interaction. Our goal is to understand, learn, and improve from all feedback.",
    "response_guidelines": "Be empathetic and professional. Acknowledge the customer's experience. Never be dismissive."
  }
}
```

## What's Next

You've built a PromptPack that uses every major feature. Here's where to go from here:

- **Understand the architecture**: [Architecture Patterns](/docs/spec/architecture-patterns) — how workflows, agents, validators, evals, and agent loops fit together
- **Build an agent loop *(v1.4+)***: declare `terminal: true` on exit states, bound re-enterable states with `max_visits` + `on_max_visits`, flow structured state across visits via `artifacts`, and add an `engine.budget` as a global safety net. See the [code-generation loop example](/docs/spec/examples#code-generation-loop-with-test-feedback-v14)
- **Dive deeper into features**: [How to Add a Workflow](/docs/guides/add-workflow) (covers agent-loop fields) · [How to Set Up Agents](/docs/guides/setup-agents) · [How to Add Skills](/docs/guides/add-skills) · [How to Add Evals](/docs/guides/add-evals)
- **See more examples**: [Real-World Examples](/docs/spec/examples)
- **Explore the full schema**: [Schema Reference](/docs/spec/schema-reference) · [Schema Guide](/docs/spec/schema-guide)
- **Test your pack**: [PromptArena Testing](/docs/ecosystem/arena-testing)
- **Contribute**: [RFC Process](/docs/processes/rfc-process) · [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)

## Need Help?

- **Questions**: [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- **Issues**: [GitHub Issues](https://github.com/altairalabs/promptpack-spec/issues)
- **Email**: [community@altairalabs.com](mailto:community@altairalabs.com)
