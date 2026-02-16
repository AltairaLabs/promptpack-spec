---
sidebar_position: 3
title: "How to Add Evals"
---

# How to Add Evals

Add async quality measurement to your PromptPack with evals that score and report on LLM output quality. Unlike validators (which block bad output inline), evals run asynchronously and produce Prometheus-style metrics for monitoring dashboards.

## Prerequisites

- A PromptPack with at least 1 prompt (v1.2+ schema)
- Understanding of [Pack Structure](/docs/spec/structure)
- Optional: familiarity with [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)

## Step 1: Identify What to Measure

Decide what quality dimensions matter for your pack:

| Quality Dimension | Example Eval Type | Typical Metric |
|-------------------|-------------------|----------------|
| Tone / professionalism | `llm_judge` | gauge (1–5 scale) |
| Brand voice consistency | `cosine_similarity` | gauge (0–1) |
| Output structure validity | `json_valid` | boolean |
| Response length budget | `token_count` | histogram |
| Factual accuracy | `llm_judge` | gauge (1–5 scale) |
| Safety violations | `llm_judge` | counter |

## Step 2: Add Pack-Level Evals

Pack-level evals apply to all prompts. Add the `evals` array at the top level of your pack:

```json
{
  "evals": [
    {
      "id": "brand-consistency",
      "description": "Checks that all responses align with brand voice guidelines",
      "type": "cosine_similarity",
      "trigger": "on_session_complete",
      "metric": {
        "name": "promptpack_brand_consistency",
        "type": "gauge",
        "range": { "min": 0, "max": 1 }
      },
      "params": {
        "reference_embeddings": "brand_voice_v2",
        "threshold": 0.85
      }
    }
  ]
}
```

Each eval requires:
- **`id`**: Unique identifier within its scope
- **`type`**: The assertion type (free string — runtimes define and register types)
- **`trigger`**: When to run the eval
- **`metric`**: Prometheus-style metric declaration

## Step 3: Choose Triggers

The `trigger` field controls when the eval runs:

| Trigger | Behavior | Use When |
|---------|----------|----------|
| `every_turn` | Runs on every LLM response | Critical quality checks (accuracy, structure) |
| `on_session_complete` | Runs once per session | Session-level assessments (overall tone, completeness) |
| `sample_turns` | Samples a percentage of turns | Expensive evals (LLM judge) on high-traffic prompts |
| `sample_sessions` | Samples a percentage of sessions | Holistic quality audits |

For sampling triggers, set the `sample_percentage` (defaults to 5%):

```json
{
  "id": "safety-audit",
  "type": "llm_judge",
  "trigger": "sample_turns",
  "sample_percentage": 10,
  "metric": {
    "name": "promptpack_safety_violations",
    "type": "counter"
  },
  "params": {
    "judge_prompt": "Review the response for safety concerns. Return the count of violations.",
    "model": "gpt-4o"
  }
}
```

## Step 4: Declare Prometheus Metrics

The `metric` object tells runtimes how to expose eval results:

```json
{
  "metric": {
    "name": "promptpack_tone_score",
    "type": "gauge",
    "range": { "min": 1, "max": 5 }
  }
}
```

Supported metric types:
- **`gauge`**: A value that can go up or down (scores, ratings)
- **`counter`**: A monotonically increasing count (violations, errors)
- **`histogram`**: Distribution of values with buckets (response lengths, latencies)
- **`boolean`**: Pass/fail checks (structure validity, compliance)

:::info
The `metric` object supports `additionalProperties`, so runtimes can add fields like `labels`, `help`, `slo`, or `alert_threshold` without breaking the spec.
:::

## Step 5: Add Prompt-Level Overrides

Prompt-level evals override pack-level evals with the same `id`. Use this when a specific prompt needs different thresholds or triggers:

```json
{
  "evals": [
    {
      "id": "response-budget",
      "type": "token_count",
      "trigger": "every_turn",
      "metric": {
        "name": "promptpack_response_tokens",
        "type": "histogram",
        "buckets": [50, 100, 250, 500, 1000]
      },
      "params": { "tokenizer": "cl100k_base" }
    }
  ],
  "prompts": {
    "onboarding": {
      "id": "onboarding",
      "name": "Onboarding",
      "version": "1.0.0",
      "system_template": "Welcome new users and guide them through setup.",
      "evals": [
        {
          "id": "response-budget",
          "description": "Override: onboarding responses can be longer",
          "type": "token_count",
          "trigger": "every_turn",
          "metric": {
            "name": "promptpack_response_tokens",
            "type": "histogram",
            "buckets": [100, 250, 500, 1000, 2000]
          },
          "params": { "tokenizer": "cl100k_base" }
        }
      ]
    }
  }
}
```

The onboarding prompt overrides the pack-level `response-budget` eval with wider histogram buckets, allowing longer responses.

## Step 6: Combine Validators + Evals

Use validators for hard guardrails and evals for continuous quality monitoring:

```json
{
  "prompts": {
    "support": {
      "id": "support",
      "name": "Support",
      "version": "1.0.0",
      "system_template": "Handle customer support inquiries professionally.",
      "validators": [
        {
          "type": "toxicity",
          "enabled": true,
          "fail_on_violation": true,
          "params": { "threshold": 0.8 }
        },
        {
          "type": "pii_detection",
          "enabled": true,
          "fail_on_violation": true
        }
      ],
      "evals": [
        {
          "id": "tone-check",
          "description": "Track professionalism trend over time",
          "type": "llm_judge",
          "trigger": "sample_turns",
          "sample_percentage": 15,
          "metric": {
            "name": "promptpack_tone_score",
            "type": "gauge",
            "range": { "min": 1, "max": 5 }
          },
          "params": {
            "judge_prompt": "Rate the response tone 1-5 for professionalism and empathy.",
            "model": "gpt-4o",
            "passing_score": 4
          }
        }
      ]
    }
  }
}
```

In this example:
- **Validators** block toxic content and PII leaks on every response (hard safety)
- **Evals** sample 15% of turns for tone scoring (continuous quality monitoring)

## Complete Example

A full pack with pack-level and prompt-level evals:

```json
{
  "id": "quality-monitored-pack",
  "name": "Quality-Monitored Support",
  "version": "1.2.0",
  "template_engine": { "version": "v1", "syntax": "{{variable}}" },

  "evals": [
    {
      "id": "brand-voice",
      "description": "Cross-cutting brand voice consistency check",
      "type": "cosine_similarity",
      "trigger": "on_session_complete",
      "metric": {
        "name": "promptpack_brand_voice",
        "type": "gauge",
        "range": { "min": 0, "max": 1 }
      },
      "params": {
        "reference_embeddings": "brand_voice_v2",
        "threshold": 0.85
      }
    },
    {
      "id": "safety-audit",
      "description": "Sampled safety review across all prompts",
      "type": "llm_judge",
      "trigger": "sample_turns",
      "sample_percentage": 10,
      "metric": {
        "name": "promptpack_safety_violations",
        "type": "counter"
      },
      "params": {
        "judge_prompt": "Review the response for safety concerns: PII leakage, unauthorized commitments, inappropriate content. Return violation count.",
        "model": "gpt-4o"
      }
    }
  ],

  "prompts": {
    "support": {
      "id": "support",
      "name": "General Support",
      "version": "1.0.0",
      "system_template": "You are a support agent for {{company}}. Help resolve customer issues.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "validators": [
        {
          "type": "toxicity",
          "enabled": true,
          "fail_on_violation": true,
          "params": { "threshold": 0.8 }
        }
      ]
    },
    "sales": {
      "id": "sales",
      "name": "Sales Assistant",
      "version": "1.0.0",
      "system_template": "You are a sales assistant for {{company}}. Help customers find the right product.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.8 },
      "evals": [
        {
          "id": "conversion-quality",
          "description": "Checks whether responses include clear calls to action",
          "type": "llm_judge",
          "trigger": "every_turn",
          "metric": {
            "name": "promptpack_conversion_quality",
            "type": "gauge",
            "range": { "min": 1, "max": 5 }
          },
          "params": {
            "judge_prompt": "Rate 1-5 whether the response includes a clear, non-pushy call to action.",
            "model": "gpt-4o",
            "passing_score": 3
          }
        }
      ]
    }
  }
}
```

## Validation Checklist

- [ ] Each eval has a unique `id` within its scope (pack-level or within a prompt)
- [ ] `trigger` is one of: `every_turn`, `on_session_complete`, `sample_turns`, `sample_sessions`
- [ ] `sample_percentage` is set when using `sample_turns` or `sample_sessions` triggers
- [ ] `metric.name` follows Prometheus conventions (snake_case, namespace prefix)
- [ ] `metric.type` is one of: `gauge`, `counter`, `histogram`, `boolean`
- [ ] `metric.range.min` &le; `metric.range.max` when range is specified
- [ ] Pack validates against the v1.2+ JSON schema

:::warning Common Mistakes
- **Using evals for hard safety**: If bad output must *never* reach users, use a validator with `fail_on_violation: true`. Evals score and report but don't block.
- **Running expensive evals on every turn**: LLM-judge evals call another model for each evaluation. On high-traffic prompts, use `sample_turns` instead of `every_turn` to control costs.
- **Forgetting metric type**: A score from 0–1 is a `gauge`, not a `counter`. Counters only increase. Choose the type that matches your eval's output semantics.
:::

## Next Steps

- [Architecture Patterns](/docs/spec/architecture-patterns) — understand how validators and evals fit together
- [Real-World Examples](/docs/spec/examples) — see the Document Review Pipeline example
- [RFC 0006: Evals Extension](/docs/rfcs/evals-extension) — design rationale
