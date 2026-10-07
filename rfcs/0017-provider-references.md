# RFC 0017: Provider References

- **Status:** Draft
- **Author(s):** Charlie Holland
- **Created:** 2026-10-07
- **Updated:** 2026-10-07
- **Discussion:** [RFC Comments](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/rfc-comments)
- **Related Issues:** TBD

## Summary

Add an optional `provider` property to prompts and to composition `prompt` and `agent` steps. Its value is the `key` of a provider requirement declared under `requires.providers` ([RFC 0012](./0012-provider-requirements.md)). It says which of the pack's logical providers runs that call. An absent `provider` means `default`, which is what every call uses today. With it, one pack can classify a request on a fast typed classifier, draft a templated reply on a cheap model, and keep a strong model for the open-ended agent step — and the host still decides which concrete provider stands behind each key.

## Motivation

RFC 0012 lets a pack declare that it needs more than one provider: a primary LLM, an embedding model, a judge, a `role: inference` classifier. Nothing in the pack can say which of them a given call uses. Every prompt, every workflow state, and every composition `prompt` or `agent` step runs on the primary model. The extra requirements are reachable only by runtime convention — an eval handler that reads a provider key out of its open `params` bag, for instance.

That leaves a gap between what a pack declares and what it can express:

- **Not every step needs an LLM.** A composition that routes support tickets spends most of its latency and cost deciding a category, an urgency, and whether the message is abusive. A typed-decision or classification model answers those questions in a few hundred milliseconds with calibrated scores. A pack cannot send that step to one.
- **Not every LLM step needs the same LLM.** A templated confirmation reply and an open-ended troubleshooting agent have very different requirements. A pack that declares a `drafter` and a `default` requirement cannot route either call to either model.
- **Prompts are already written for a class of model.** `parameters`, `model_overrides`, and `tested_models` all couple a prompt to the models it was authored against. A prompt framed as typed questions for a classifier is useless on a chat model, and the reverse. The pack knows this at authoring time and has nowhere to write it down.

Runtimes can work around the gap — PromptKit, for example, lets a host substitute one provider for a whole composition — but each workaround is runtime-specific, so the pack stops being portable at exactly the point it gets interesting.

### Goals

- Let a pack name, per call site, which declared provider requirement serves it.
- Keep binding where RFC 0012 put it: the pack names a logical key; the host decides the concrete provider and may rebind it freely.
- Make a provider that cannot serve a call site a load-time error rather than a first-request failure.
- Let a provider whose role is not `llm` serve a call site whose output is fully structured, without a new step kind.
- Remain fully backward compatible: a pack with no `provider` behaves exactly as it does today.

### Non-Goals

- Naming concrete providers, vendors, models, endpoints, or credentials. That stays a runtime and deployment concern, as in RFC 0012.
- Defining how a non-chat provider answers an `output_schema`. The spec states the requirement; each runtime owns the mapping.
- Formalizing the provider key on evals. Several runtimes already read a provider key from an eval's open `params` bag; this RFC uses the same name, `provider`, so the two read alike, but leaves `params` untouched.
- Choosing a model for remote agent members ([RFC 0007](./0007-agents-extension.md)). A remote member is served by another runtime that picks its own model.
- Defining what a workflow state means when its prompt runs on a provider that cannot hold a conversation — a "decision state" whose classifier selects the next `on_event`. That needs its own RFC.

## Detailed Design

### Core Concept

A **provider reference** is a `provider` property whose value is the `key` of a provider requirement. The pack already declares *what* it needs under `requires.providers`. A provider reference says *where* each need is used.

Resolution has two steps, and the spec governs only the first:

1. **Pack → key.** The call site's `provider` names a requirement key. This is portable and validated against the pack.
2. **Key → concrete provider.** The host binds the key to a provider it has. This is the runtime's job, exactly as in RFC 0012.

### Where `provider` Appears

| Location | Property | Meaning |
|---|---|---|
| `prompts.<key>` | `provider` | The requirement that runs this prompt. Absent means `default`. |
| Composition `prompt` step | `provider` | Overrides the provider of the step's `prompt_task` for this step only. |
| Composition `agent` step | `provider` | Same, for an agent step. |

Every other call site inherits from the prompt it runs:

- A **workflow state** ([RFC 0005](./0005-workflow-extension.md)) runs its `prompt_task`, so it uses that prompt's `provider`. States on different providers need no new state property.
- An **in-process agent member** (RFC 0007) or a **state exposed as an agent** ([RFC 0011](./0011-workflow-states-as-agents.md)) runs a prompt, and inherits the same way.
- A composition step with no `provider` uses its `prompt_task`'s `provider`.

The precedence for a composition step is therefore: step `provider`, then the prompt's `provider`, then `default`.

`tool`, `branch`, and `parallel` steps make no model call and do not take a `provider`.

### Serving a Call Site

A call site is **served** by a provider when the provider can produce what that call site must produce. The spec defines this in terms of the call site, never in terms of a vendor:

| Call site | Must produce | Typically served by |
|---|---|---|
| Prompt in a conversational workflow state | A conversational reply | `role: llm` |
| Composition `agent` step | A bounded tool-calling loop | `role: llm` with `capabilities.tool_use` |
| Composition `prompt` step without `output_schema` | Free text | `role: llm` |
| Composition `prompt` step with `output_schema` | A JSON value conforming to the schema | `role: llm` with structured output, or any provider able to answer the schema |

The last row is the one this RFC opens up. A `prompt` step with an `output_schema` already means "produce this structured answer to this task". An LLM produces it by generating JSON. A classifier or typed-decision provider can produce it when every leaf of the schema is something it can answer — a choice among enumerated values, a bounded score, a boolean. How a runtime maps a schema onto such a provider's questions, and how it maps the answers back into JSON, is runtime-defined. What the spec requires is that the value handed to later steps conforms to `output_schema`, so a branch predicate or a downstream step reads it exactly as it would read an LLM's output.

A free-text field in the schema cannot be answered by a provider that does not generate text. That combination is an error, and it is detected at load time (see Validation Rules).

### Schema Changes

Added to `$defs/Prompt`:

```json
{
  "provider": {
    "type": "string",
    "description": "Key of the provider requirement (requires.providers[].key, RFC 0012) that runs this prompt. Absent means 'default'. The host binds the key to a concrete provider (RFC 0017).",
    "examples": ["default", "triage", "drafter"]
  }
}
```

Added to `$defs/PromptStep` and `$defs/AgentStep`:

```json
{
  "provider": {
    "type": "string",
    "description": "Key of the provider requirement that runs this step, overriding the provider of the step's prompt_task. Absent means the prompt's provider (RFC 0017)."
  }
}
```

The `PromptStep` description changes from "a one-shot LLM invocation" to "a one-shot model invocation", since it may now be served by a provider that is not an LLM.

No entry is added to any `required` array.

### Specification Impact

- `docs/spec/structure.md` — the prompt property table and the composition step tables gain `provider`.
- `docs/spec/schema-guide.md` — a section on provider references, the precedence rule, and the call-site table above.
- The RFC 0012 provider requirements page — a note that requirement keys are now referenced from call sites, not only resolved by the host.
- `docs/spec/architecture-patterns.md` — the mixed-provider composition in Example 2 is a pattern worth documenting.

### Validation Rules

1. `provider`, when present, MUST equal the `key` of an entry in `requires.providers`, with one exception: `default` is always valid, because RFC 0012 reserves it for the primary LLM and does not require it to be declared. JSON Schema cannot express this cross-reference; validators enforce it, as they do for `prompt_task` references.
2. An absent `provider` is equivalent to `provider: default` on a prompt, and to the prompt's `provider` on a step. A runtime MUST NOT distinguish the two.
3. A runtime MUST reject the pack at load time, before serving any request, when the provider bound to a referenced key cannot serve a call site that references it. The serving rules are in §"Serving a Call Site". A runtime SHOULD report which of three faults occurred, since they belong to different people:
   - the key is not declared by the pack (the pack author's error);
   - the key is declared but nothing is bound to it (the host's error);
   - the key is bound to a provider that cannot serve the call site (the host's error).
4. A `provider` reference to a requirement with `required: false` is valid. When that requirement is unbound, the runtime MUST reject the pack at load time if any call site references it — an optional requirement degrades features that consult it at run time, but a call site that names it has no fallback to degrade to. Validators SHOULD warn when an optional requirement is referenced from a prompt or step.
5. Validators SHOULD warn when a prompt referenced by a conversational workflow state names a requirement whose `role` is not `llm`, and when a `prompt` step names one and has no `output_schema`. Both almost always indicate a mistake, but `role` is an open set (RFC 0012), so the spec cannot make them errors.

### Runtime Support Levels

- **Level 0 — Ignore.** Treat `provider` as an unknown field and run every call on the primary model. Packs carrying it remain valid. This is correct only for packs whose references all resolve to the same concrete provider; a Level 0 runtime SHOULD warn when a pack references more than one key.
- **Level 1 — Validate.** Enforce rules 1 and 2 and surface the references to tooling, without routing calls. A Level 1 runtime SHOULD warn that every call will still run on the primary model.
- **Level 2 — Route LLM calls.** Resolve each reference to its bound provider and run the call there, for providers that produce text. Enforce rules 3 and 4 for those call sites.
- **Level 3 — Route structured calls to non-LLM providers.** Additionally serve `prompt` steps with an `output_schema` from providers whose role is not `llm`, mapping the schema to the provider's questions and the answers back to conforming JSON.

## Examples

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). Equally valid as JSON.

### Example 1: Basic Usage

Two LLMs, one pack. The templated reply runs on a cheaper model; everything else stays on the primary.

```yaml
requires:
  providers:
    - default
    - key: drafter
      role: llm
      description: "Cheap, fast model for short templated replies."

prompts:
  support:
    id: support
    name: Support agent
    version: 1.0.0
    system_template: "You are a support agent for {{company}}..."
    # no provider → default

  refund_confirmation:
    id: refund_confirmation
    name: Refund confirmation
    version: 1.0.0
    provider: drafter
    system_template: "Write a two-sentence refund confirmation for order {{order_id}}."
```

A workflow state whose `prompt_task` is `refund_confirmation` runs on whatever the host binds to `drafter`. On a Level 0 runtime the same pack runs entirely on the primary model.

### Example 2: Advanced Usage

A ticket-handling composition that mixes an inference provider, a cheap LLM, and the primary LLM.

```yaml
requires:
  providers:
    - default
    - key: triage
      role: inference
      description: "Fast typed classifier: choices, scores and yes/no questions."
    - key: drafter
      role: llm
      description: "Cheap model for templated replies."

prompts:
  classify_request:
    id: classify_request
    name: Classify request
    version: 1.0.0
    provider: triage
    system_template: "Customer message: {{input}}"
  refund_reply:
    id: refund_reply
    name: Refund reply
    version: 1.0.0
    provider: drafter
    system_template: "Write a refund confirmation for: {{input}}"
  support_agent:
    id: support_agent
    name: Support agent
    version: 1.0.0
    system_template: "You are a support agent. Resolve the customer's issue."

compositions:
  handle_ticket:
    version: 1
    steps:
      - id: intent
        kind: prompt
        prompt_task: classify_request
        output_schema: schemas/intent.json
      - id: gate
        kind: branch
        predicate: { path: "${intent.output.category}", op: equals, value: refund }
        then: refund
        else: escalate
      - id: refund
        kind: prompt
        prompt_task: refund_reply
        input: "${input}"
      - id: escalate
        kind: agent
        prompt_task: support_agent
        tools: [crm_lookup]
        termination: { max_steps: 6 }
```

`schemas/intent.json`:

```json
{
  "type": "object",
  "required": ["category", "urgency", "is_abusive"],
  "additionalProperties": false,
  "properties": {
    "category":   { "type": "string", "enum": ["refund", "billing", "technical", "other"] },
    "urgency":    { "type": "number", "minimum": 0, "maximum": 1 },
    "is_abusive": { "type": "boolean" }
  }
}
```

Every leaf of `intent.json` is an enumerated choice, a bounded score, or a boolean, so a Level 3 runtime can serve the `intent` step from the provider bound to `triage`. The `gate` branch reads `${intent.output.category}` without knowing which kind of provider produced it. Had the schema included a free-text `summary` field, rule 3 would reject the pack at load time.

The same composition on a host that binds `triage` to an LLM with structured output also runs, unchanged. That is the point of naming a key rather than a role at the call site.

### Example 3: Step Override

One prompt, two models. The same summarization prompt runs on the cheap model for the first pass and on the primary model for the final one.

```yaml
steps:
  - id: draft
    kind: prompt
    prompt_task: summarize
    provider: drafter
  - id: final
    kind: prompt
    prompt_task: summarize
    input: "${draft.output}"
    # no provider → the prompt's provider, here default
```

## Drawbacks

- **The pack now encodes a routing decision.** A pack that says `provider: drafter` asserts that the drafter is good enough for that prompt. A host can still rebind the key to anything, but the pack author has put a judgment into the portable artifact that used to be made at deployment.
- **Serving rules depend on runtime capability.** Whether a given provider can answer a given `output_schema` is decided by the runtime's mapping, so the same pack and the same binding can load on one Level 3 runtime and be rejected by another. The spec mitigates this only by requiring the rejection to happen at load time, not at first request.
- **Level 0 runtimes silently change cost and quality.** A pack designed to send classification to a fast provider runs it on the primary model instead. The output still conforms, but latency and cost do not.
- **Two places to look.** A step's effective provider is on the step or on its prompt. The precedence is simple, but a reader has to check both.

## Alternatives

### Alternative 1: `provider` on composition steps only

Simpler, and enough for compositions. Rejected because workflow states and agent members would then need their own property to reach the same result, and because the prompt — not the step — is the unit already written for a class of model. A step-only property would let a typed-question prompt be pointed at a chat model one step at a time.

### Alternative 2: A new step kind for inference

A `kind: infer` (or `classify`) step with its own question vocabulary. Rejected because `prompt` with `output_schema` already means "produce this structured answer". A new kind would duplicate it, push the choice of provider kind into the graph structure, and stop a host from serving the same step with an LLM. It would also add typed-question vocabulary to the spec that no pack needs once `output_schema` carries the shape.

### Alternative 3: `provider_key` or `requires_key`

Rejected for consistency. Runtimes that let an eval name its judge or classifier already read it from `params.provider`, and a second spelling for the same idea would be a trap.

### Alternative 4: Name the role at the call site

`provider: { role: inference }`, with the runtime choosing any provider of that role. Rejected because it reintroduces the ambiguity RFC 0012 settled with `key` as the sole discriminator: a pack with a fast and a strong LLM could not say which a call uses.

## Adoption Strategy

Existing packs need no change. `provider` is optional, its absence means `default`, and a pack that declares no `requires.providers` can only reference `default` — which is what it does today.

Adoption is per call site. An author adds a requirement under `requires.providers`, names it from the prompts that should use it, and lets each host bind it. Packs that used a runtime-specific mechanism to send one composition to another model can replace it with a reference, and become portable in the process.

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration (describe migration path)
- [ ] Breaking change (describe impact and migration)

### Migration Path

Not applicable.

## Unresolved Questions

- **Is the step override needed in v1?** Example 3 is the only use case found so far. Shipping the prompt property alone would be smaller; adding the step property later is backward compatible.
- **`model_overrides` keys.** `model_overrides` is keyed by model name. Once a prompt names a logical key and the host picks the model, a runtime has to match the bound provider's model against those names. Does the spec need to say anything about that, or is it already a runtime matter?
- **Should the spec define the schema subset a non-LLM provider is expected to answer?** Leaving it runtime-defined keeps the spec small but makes Level 3 behavior vary. Naming a minimal portable subset — enumerated strings, bounded numbers, booleans, and objects of those — would let validators warn earlier.
- **Rule 4 and optional requirements.** Rejecting the pack when a referenced optional requirement is unbound is strict. The alternative is falling back to `default`, which hides a deployment mistake but keeps the pack running.

---

## Revision History

- **2026-10-07:** Initial draft.

## References

- [RFC 0012: Provider Requirements](./0012-provider-requirements.md) — the keys this RFC references
- [RFC 0010: Workflow Composition Extension](./0010-workflow-composition.md) — the `prompt` and `agent` steps that gain `provider`
- [RFC 0001: Core PromptPack Schema](./0001-core-schema.md) — the `Prompt` definition that gains `provider`
- [RFC 0005: Workflow Specification Extension](./0005-workflow-extension.md) — states inherit through `prompt_task`
- [RFC 0006: Evals Extension](./0006-evals-extension.md) — eval `params`, where runtimes already read a provider key
- [RFC 0007: Agents Extension](./0007-agents-extension.md) and [RFC 0011: Workflow States as Agents](./0011-workflow-states-as-agents.md) — agent members inherit through their prompts
