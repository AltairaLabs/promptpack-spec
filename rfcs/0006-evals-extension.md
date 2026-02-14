# RFC 0006: Evals Extension

- **Status:** Draft
- **Author(s):** AltairaLabs Team
- **Created:** 2026-02-14
- **Updated:** 2026-02-14
- **Related Issues:** [#14 — Add evals section to PromptPack schema](https://github.com/AltairaLabs/promptpack-spec/issues/14)

## Summary

Extend the PromptPack specification to support eval definitions at two levels — per-prompt and pack-wide — with Prometheus-inspired metric declarations. This allows promptpack authors to ship eval rubrics alongside the prompts and guardrails they already maintain, so that quality policy versions and deploys as a single unit.

## Motivation

Validators (guardrails) and evals sit on the same quality spectrum:

| Aspect | Validators | Evals |
|--------|-----------|-------|
| Runs when? | Inline, every response | Async, on schedule or trigger |
| Blocks output? | Yes (if `fail_on_violation`) | No — scores and reports |
| Typical author | Prompt engineer | Same prompt engineer |
| Lives where today | In the PromptPack | Outside the pack |

The promptpack author who writes guardrails is the same person who writes eval rubrics. Both should live in the pack and version/deploy together. Keeping evals outside the pack leads to:

- **Drift** — evals fall out of sync with the prompts they measure
- **Fragmentation** — eval config scattered across CI pipelines, notebooks, and dashboards
- **Lost portability** — a PromptPack can't describe its own quality contract

### Goals

- Allow authors to declare evals that travel with the pack
- Support both prompt-scoped and cross-cutting (pack-level) evals
- Provide a Prometheus-style metric envelope so runtimes know how to expose results
- Keep the spec declarative — define the *what*, not the *how*

### Non-Goals

- Define eval execution semantics or scheduling
- Prescribe specific LLM-judge prompts or scoring algorithms
- Introduce a test-runner or CI integration into the spec
- Define metric collection, storage, or alerting infrastructure

## Detailed Design

### Schema Changes

#### New Definition: `Eval`

```json
{
  "Eval": {
    "type": "object",
    "description": "An eval definition that declares how to assess LLM output quality. Evals run asynchronously and produce scores or metrics, unlike validators which run inline and block.",
    "required": ["id", "type", "trigger", "params"],
    "additionalProperties": false,
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique identifier for this eval within its scope (prompt-level or pack-level).",
        "examples": ["tone-check", "brand-consistency", "factual-accuracy"]
      },
      "description": {
        "type": "string",
        "description": "Human-readable description of what this eval measures and why it matters."
      },
      "type": {
        "type": "string",
        "description": "The assertion type that determines how this eval is executed. Not an enum — runtimes define and register their own types.",
        "examples": ["llm_judge", "cosine_similarity", "regex_match", "human_review", "bleu_score"]
      },
      "trigger": {
        "type": "string",
        "description": "When this eval should be triggered.",
        "enum": ["every_turn", "on_session_complete", "sample_turns", "sample_sessions"]
      },
      "sample_percentage": {
        "type": "number",
        "description": "Percentage of turns or sessions to sample when trigger is sample_turns or sample_sessions. Ignored for other trigger types.",
        "default": 5,
        "minimum": 0,
        "maximum": 100,
        "examples": [5, 10, 25, 50]
      },
      "enabled": {
        "type": "boolean",
        "description": "Whether this eval is active. Allows temporarily disabling evals without removing them.",
        "default": true
      },
      "metric": {
        "type": "object",
        "description": "Prometheus-style metric declaration describing the output shape of this eval. Runtimes use this to expose results to monitoring systems.",
        "required": ["name", "type"],
        "additionalProperties": true,
        "properties": {
          "name": {
            "type": "string",
            "description": "Metric name. Should follow Prometheus naming conventions (snake_case, namespace prefix recommended).",
            "examples": ["promptpack_tone_score", "promptpack_brand_consistency", "promptpack_factual_accuracy"]
          },
          "type": {
            "type": "string",
            "description": "Prometheus metric type that describes the value semantics.",
            "enum": ["gauge", "counter", "histogram", "boolean"]
          },
          "range": {
            "type": "array",
            "description": "Optional value bounds as [min, max]. Useful for gauge metrics with known ranges.",
            "items": { "type": "number" },
            "minItems": 2,
            "maxItems": 2,
            "examples": [[0, 1], [1, 5]]
          }
        }
      },
      "params": {
        "type": "object",
        "description": "Type-specific configuration for the eval. Structure depends on the eval type — runtimes interpret these based on the type field.",
        "additionalProperties": true,
        "examples": [
          {
            "judge_prompt": "Rate the response tone on a scale of 1-5 for professionalism.",
            "model": "gpt-4o",
            "passing_score": 4
          },
          {
            "reference_embeddings": "brand_voice_v2",
            "threshold": 0.85
          }
        ]
      }
    }
  }
}
```

#### New Prompt-Level Field: `evals`

Added to `$defs/Prompt/properties` alongside the existing `validators` field:

```json
{
  "evals": {
    "type": "array",
    "description": "Eval definitions scoped to this prompt. These evals assess the quality of responses generated by this specific prompt.",
    "items": {
      "$ref": "#/$defs/Eval"
    }
  }
}
```

#### New Pack-Level Field: `evals`

Added to the top-level `properties` alongside `prompts`, `tools`, `workflow`, etc.:

```json
{
  "evals": {
    "type": "array",
    "description": "Pack-level eval definitions that apply across all prompts. Useful for cross-cutting quality concerns like brand consistency or safety checks. Prompt-level evals with the same id override pack-level evals.",
    "items": {
      "$ref": "#/$defs/Eval"
    }
  }
}
```

### Specification Impact

- A new `Eval` definition is added to `$defs`
- The `Prompt` definition gains an optional `evals` array
- The top-level schema gains an optional `evals` array
- No existing fields are modified or removed

### Validation Rules

1. **ID Uniqueness**
   - `id` must be unique within its scope (all pack-level eval IDs are unique; all prompt-level eval IDs within a single prompt are unique)
   - Pack-level and prompt-level evals *may* share the same `id` — prompt-level wins (override semantics)

2. **Trigger Validation**
   - `trigger` must be one of the enum values: `every_turn`, `on_session_complete`, `sample_turns`, `sample_sessions`
   - When `trigger` is `sample_turns` or `sample_sessions`, `sample_percentage` controls the sampling rate (defaults to 5%)

3. **Metric Naming**
   - `metric.name` should follow Prometheus naming conventions: `snake_case`, with a namespace prefix (recommended, not enforced by schema)
   - `metric.range` when present must be a two-element array where `range[0] < range[1]`

4. **Backward Compatibility**
   - `evals` is optional at both levels; existing PromptPacks remain valid

## Examples

### Example 1: Per-Prompt Eval (LLM Judge)

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). All examples are equally valid as JSON.

```yaml
prompts:
  customer_support:
    id: customer-support
    name: Customer Support Agent
    version: "1.0.0"
    system_template: |
      You are a helpful customer support agent for Acme Corp.
      Always be professional, empathetic, and solution-oriented.
    validators:
      - type: toxicity
        enabled: true
        fail_on_violation: true
        params:
          threshold: 0.8
    evals:
      - id: tone-check
        description: Ensures responses maintain a professional and empathetic tone
        type: llm_judge
        trigger: every_turn
        metric:
          name: promptpack_tone_score
          type: gauge
          range: [1, 5]
        params:
          judge_prompt: |
            Rate the following customer support response on a 1-5 scale:
            1 = Rude or dismissive
            3 = Neutral, acceptable
            5 = Warm, professional, and empathetic
          model: gpt-4o
          passing_score: 4
```

### Example 2: Pack-Level Cross-Cutting Eval

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). All examples are equally valid as JSON.

```yaml
id: acme-support-pack
name: Acme Corp Support Pack
version: "2.0.0"

evals:
  - id: brand-consistency
    description: Checks that all responses align with Acme brand voice guidelines
    type: cosine_similarity
    trigger: on_session_complete
    metric:
      name: promptpack_brand_consistency
      type: gauge
      range: [0, 1]
    params:
      reference_embeddings: acme_brand_voice_v2
      threshold: 0.85

  - id: safety-audit
    description: Sampled safety review across all prompt outputs
    type: llm_judge
    trigger: sample_turns
    sample_percentage: 10
    metric:
      name: promptpack_safety_violations
      type: counter
    params:
      judge_prompt: |
        Review the response for any safety concerns:
        - Personal data leakage
        - Unauthorized commitments or promises
        - Off-brand or inappropriate content
        Return the count of violations found.
      model: gpt-4o

prompts:
  billing:
    id: billing
    name: Billing Support
    version: "1.0.0"
    system_template: |
      You handle billing inquiries for Acme Corp.

  technical:
    id: technical
    name: Technical Support
    version: "1.0.0"
    system_template: |
      You handle technical support for Acme Corp products.
```

### Example 3: Full Pack with Both Levels and Metric Declarations

```json
{
  "$schema": "https://promptpack.org/schema/v1/promptpack.schema.json",
  "id": "acme-full-pack",
  "name": "Acme Full Quality Pack",
  "version": "3.0.0",
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  "evals": [
    {
      "id": "response-latency-budget",
      "description": "Tracks whether responses stay within acceptable token length as a proxy for latency",
      "type": "token_count",
      "trigger": "every_turn",
      "metric": {
        "name": "promptpack_response_tokens",
        "type": "histogram",
        "buckets": [50, 100, 250, 500, 1000]
      },
      "params": {
        "tokenizer": "cl100k_base"
      }
    }
  ],
  "prompts": {
    "onboarding": {
      "id": "onboarding",
      "name": "User Onboarding",
      "version": "1.0.0",
      "system_template": "Welcome new users to Acme Corp and guide them through setup.",
      "validators": [
        {
          "type": "max_length",
          "enabled": true,
          "fail_on_violation": false,
          "params": { "max_characters": 2000 }
        }
      ],
      "evals": [
        {
          "id": "onboarding-completeness",
          "description": "Checks that onboarding responses cover all required setup steps",
          "type": "llm_judge",
          "trigger": "on_session_complete",
          "metric": {
            "name": "promptpack_onboarding_completeness",
            "type": "boolean"
          },
          "params": {
            "judge_prompt": "Did the agent cover all onboarding steps: account setup, preferences, first task?",
            "model": "gpt-4o"
          }
        },
        {
          "id": "response-latency-budget",
          "description": "Override: onboarding responses can be longer",
          "type": "token_count",
          "trigger": "every_turn",
          "metric": {
            "name": "promptpack_response_tokens",
            "type": "histogram",
            "buckets": [100, 250, 500, 1000, 2000]
          },
          "params": {
            "tokenizer": "cl100k_base"
          }
        }
      ]
    }
  }
}
```

In this example, the pack-level `response-latency-budget` eval applies to all prompts by default. The `onboarding` prompt overrides it with a more permissive histogram (wider buckets), demonstrating the prompt-level-wins override semantics.

### Example 4: Extending `metric` with `additionalProperties`

The `metric` object uses `additionalProperties: true`, so runtimes can attach extra fields beyond the spec-defined `name`, `type`, and `range`. This is the same extensibility pattern used by `params`. Here is an example showing runtime-specific metric extensions:

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). All examples are equally valid as JSON.

```yaml
evals:
  - id: response-quality
    description: Overall response quality scored by LLM judge
    type: llm_judge
    trigger: every_turn
    metric:
      # --- spec-defined fields ---
      name: promptpack_response_quality
      type: gauge
      range: [0, 1]
      # --- runtime-added fields (additionalProperties) ---
      labels:
        team: customer-success
        environment: production
      help: "Overall response quality as scored by GPT-4o judge"
      aggregation: weighted_average
      alert_threshold: 0.6
      slo: 0.85
    params:
      judge_prompt: |
        Score the response quality from 0.0 to 1.0.
      model: gpt-4o
```

The `labels`, `help`, `aggregation`, `alert_threshold`, and `slo` fields are **not** part of this specification — they are runtime extensions enabled by `additionalProperties: true`. A Prometheus-based runtime might use `labels` and `help`; an internal platform might use `slo` and `alert_threshold`. The spec defines the envelope; runtimes extend it.

## Drawbacks

### Schema Growth

- Adds another top-level array and a new `$defs` entry, increasing schema surface area
- Authors must learn the distinction between validators and evals

**Mitigation**: Evals are entirely optional. Packs without evals remain valid and unchanged.

### Runtime Burden

- Runtimes must decide how (and whether) to execute evals — scheduling, metric export, storage
- The `type` field is not an enum, so runtimes must handle unknown types gracefully

**Mitigation**: This is intentional. The spec defines the envelope; the runtime interprets it. Runtimes that don't support evals simply ignore the field (same as `workflow`).

### Metric Semantic Ambiguity

- The `metric` block declares the shape but not the semantics of collection (push vs. pull, aggregation windows, etc.)

**Mitigation**: Prometheus conventions are well-understood. The `additionalProperties: true` on `metric` lets runtimes add `labels`, `help`, `aggregation`, etc.

## Alternatives

### Alternative 1: Separate `.eval.yaml` File

Define evals in a separate file that references a PromptPack.

**Rejected**: Breaks the single-file portability principle that is core to PromptPack. Evals and prompts would drift apart across separate version histories.

### Alternative 2: Evals Only at Prompt Level

Only allow evals inside individual prompt definitions — no pack-level evals.

**Rejected**: Cross-cutting quality concerns (brand voice, safety audits, token budgets) apply across all prompts. Duplicating them in every prompt is error-prone and violates DRY.

### Alternative 3: Enum for `type` Field

Lock down the eval `type` to a fixed set of known assertion types (like `Validator.type`).

**Rejected**: The eval ecosystem is evolving rapidly — LLM judges, embedding similarity, BLEU/ROUGE, human-in-the-loop, custom model graders. An enum would require an RFC for every new type. Keeping `type` as a free string lets runtimes innovate without spec changes. (Note: `Validator.type` uses an enum with a `custom` escape hatch; for evals, we skip the enum entirely since the landscape is less settled.)

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

The `evals` field is optional at both the pack level and the prompt level. Existing PromptPacks without evals remain completely valid. No changes are required to existing specs, tools, or runtimes.

### Migration Path

No migration required. Authors can adopt evals incrementally:

1. **Phase 1**: Continue using PromptPacks without evals (current behavior)
2. **Phase 2**: Add prompt-level evals to critical prompts
3. **Phase 3**: Add pack-level evals for cross-cutting quality concerns
4. **Phase 4**: Wire up runtime eval execution and metric export

Runtimes that don't support evals will simply ignore the `evals` field.

## Unresolved Questions

1. **Should pack-level evals support an `exclude` list?**
   A prompt might want to opt out of a pack-level eval entirely (not override, but skip). This could be a future addition — e.g., `exclude_evals: ["brand-consistency"]` on the prompt. Proposal: defer to a future RFC if demand emerges.

2. **Should there be a standard set of well-known metric names?**
   A registry of conventional metric names (like `promptpack_tone_score`) would improve interop across runtimes. Proposal: defer to a companion "Eval Cookbook" document rather than baking into the spec.

---

## Revision History

- **2026-02-14:** Initial draft

## References

- [Issue #14 — Add evals section to PromptPack schema](https://github.com/AltairaLabs/promptpack-spec/issues/14)
- [RFC 0001: Core PromptPack Schema](./0001-core-schema.md)
- [Prometheus Metric Types](https://prometheus.io/docs/concepts/metric_types/)
- [OpenAI Evals](https://github.com/openai/evals)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/schema)
