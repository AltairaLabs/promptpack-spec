# RFC 0012: Provider Requirements

- **Status:** Implemented
- **Author(s):** Charlie Holland (@chaholl)
- **Created:** 2026-06-25
- **Updated:** 2026-06-25
- **Related Issues:** TBD (deploy provider-binding ergonomics)

## Summary

A promptpack can only run if the host runtime supplies the model providers it depends on — a primary LLM, often an embedding model for retrieval, sometimes a judge model for evals. Today a pack never declares these needs, so every runtime and every deployment rediscovers them by hand and fails late when a binding is missing, mistyped, or points at the wrong kind of model. This RFC adds an **optional, runtime-agnostic `requires.providers` block**: a pack declares the *logical* providers it needs — by `key`, `role`, and a human-readable `description` — and each runtime resolves those requirements to its own concrete providers. The block is optional (fully backward compatible), but when present it is validated strictly.

## Motivation

Promptpacks are portable, but their provider needs are implicit. A pack is tested against concrete models (`tested_models`), yet nothing in the pack states *what it needs to run* in machine-readable form. The gap shows up most painfully at deployment, where a logical need must be mapped to a concrete provider with no contract to check against:

- **Wrong or missing bindings fail late.** A deployer hand-maps "the LLM" to a provider name; a typo or a non-existent provider only surfaces at first request, not at validation time.
- **No coverage check.** A pack that needs an embedding provider (RAG) deploys "healthy" and then fails when retrieval runs, because nothing declared the dependency.
- **No test/deploy parity.** A pack tested on `anthropic/claude-haiku` can be deployed against `openai/gpt-4o` silently — the `tested_models` provenance exists, but there is no *requirement* to compare a resolved provider against.
- **No basis for automation.** Tooling cannot auto-bind, scaffold, or warn without knowing the pack's logical needs.

Declaring requirements once, in the portable pack, lets every runtime and deployer validate coverage, resolve bindings, auto-configure, and warn on divergence — instead of re-deriving the same information by hand.

### Goals

- Let a pack declare, **runtime-agnostically**, the model providers it requires to run.
- Make requirements **human-legible** (a `description`) so operators can wire up the right capabilities.
- Give runtimes and deployers a machine-readable contract for **coverage checks, resolution/auto-binding, and test/deploy parity**.
- Be **fully backward compatible**: optional block, strict validation only when present.

### Non-Goals

- Defining concrete provider configuration — endpoints, API keys, model identifiers, regions. Those are runtime/deployment concerns, not part of the portable pack.
- Mandating an inference algorithm. Requirements are **authored**; a runtime *may* infer or pre-populate them as a convenience, but the spec does not require or define inference.
- A *full* provider-capability taxonomy. This RFC adds a small, optional `capabilities` set (modalities, context window, tool-use, structured output, embedding dimensions); broader concerns (pricing, region/residency, version pinning) are left to a future RFC (see Future Considerations).

## Detailed Design

### Core Concept

A **provider requirement** is a logical dependency on a model provider, identified by:

- **`key`** — the logical name the pack/runtime resolves the provider by (e.g. `default`, `embeddings`, `judge`).
- **`role`** — the *kind* of model required (`llm`, `embedding`, `tts`, `stt`, `image`, …).
- **`description`** *(optional)* — a human-readable explanation of what the provider is for and which capabilities it should have.
- **`required`** *(optional, default `true`)* — whether the pack can run at all without it.
- **`capabilities`** *(optional)* — structured, advisory capabilities (modalities, minimum context window, tool-use, structured output, embedding dimensions) for automatic matching; the `description` remains the primary human guidance.

A requirement declares **what the pack needs**, never **which concrete provider satisfies it** — resolution is the host runtime's job.

`default` is a **reserved key** meaning "the primary LLM": a pack need not declare one, but if it has a primary model it SHOULD use `key: default`, and runtimes SHOULD treat `default` as primary (matching existing runtime conventions for "the agent's main model"). `key` is the **sole discriminator** between requirements — two models of the same role (e.g. a fast and a strong `llm`) are simply two requirements with different keys, distinguished for humans by `description` and for machines by `capabilities`.

This is deliberately distinct from RFC 0003's variable `binding` (`kind: context|session|env|header`), which populates *template variables* from per-request context. A provider requirement is a *pack-level runtime dependency*, not a template-variable source.

### Schema Changes

#### New Top-Level Field: `requires`

```json
{
  "requires": {
    "type": "object",
    "description": "External resources the pack needs to run. Optional; when present, validated strictly. Reserved for future requirement categories (e.g. tools, skills).",
    "additionalProperties": false,
    "properties": {
      "providers": {
        "type": "array",
        "description": "Logical model-provider requirements. Each entry is a string shorthand (an 'llm' requirement with that key) or a ProviderRequirement object.",
        "items": { "$ref": "#/$defs/ProviderRequirement" }
      }
    }
  }
}
```

#### New Definition: `ProviderRequirement`

```json
{
  "ProviderRequirement": {
    "oneOf": [
      {
        "type": "string",
        "description": "Shorthand: the requirement key. Expands to an llm requirement: { key: <string>, role: \"llm\", required: true }. E.g. \"default\"."
      },
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["key", "role"],
        "properties": {
          "key": {
            "type": "string",
            "pattern": "^[a-zA-Z0-9_-]+$",
            "description": "Logical name the runtime resolves this provider by (e.g. 'default', 'embeddings', 'judge')."
          },
          "role": {
            "type": "string",
            "description": "The kind of model required. An OPEN set: runtimes MAY recognise additional roles. Suggested values (PromptKit's provider roles): 'llm', 'embedding', 'tts', 'stt', 'image', 'inference'.",
            "examples": ["llm", "embedding", "tts", "stt", "image", "inference"]
          },
          "required": {
            "type": "boolean",
            "default": true,
            "description": "Whether the pack cannot run without this provider. Optional requirements degrade features rather than blocking startup."
          },
          "description": {
            "type": "string",
            "description": "Human-readable explanation of the provider's purpose and the capabilities it should have, e.g. 'Primary chat model; needs strong tool-use and >=32k context.'"
          },
          "capabilities": { "$ref": "#/$defs/ProviderCapabilities" }
        }
      }
    ]
  }
}
```

#### New Definition: `ProviderCapabilities`

Optional, structured, **advisory** capabilities the satisfying provider should have. The human `description` remains the primary guidance; `capabilities` lets runtimes match and warn automatically. The `modalities` vocabulary deliberately reuses the media-type set from RFC 0004 (`MediaConfig.supported_types`) rather than inventing a parallel one.

Crucially, the object is **open**. The fields below are the spec's *well-known* capabilities, validated when present — but they can't anticipate every provider. A `role: inference` provider, in particular, may expose capabilities the spec never imagined, so additional keys are allowed and carry no fixed shape. Custom keys SHOULD be namespaced (an `x-` prefix or a vendor scope) so they never collide with capabilities the spec may standardise later.

```json
{
  "ProviderCapabilities": {
    "type": "object",
    "additionalProperties": true,
    "description": "Structured, advisory capabilities the satisfying provider should have. The well-known fields below are validated when present, but the object is OPEN: provider- or role-specific capabilities (a 'role: inference' provider may expose anything) may be added as extra keys with any shape. Custom keys SHOULD be namespaced (e.g. 'x-' prefix or vendor scope) to avoid clashing with fields the spec may define later. All listed fields are optional.",
    "properties": {
      "modalities": {
        "type": "array",
        "description": "Media types the provider must handle. Reuses the media-type vocabulary (see RFC 0004 MediaConfig.supported_types). Common: 'text', 'image', 'audio', 'video', 'document'.",
        "items": { "type": "string", "pattern": "^[a-z0-9_]+$" }
      },
      "min_context_tokens": {
        "type": "integer",
        "minimum": 1,
        "description": "Minimum context window, in tokens, the provider must support."
      },
      "tool_use": {
        "type": "boolean",
        "description": "Whether the provider must support tool/function calling."
      },
      "structured_output": {
        "type": "boolean",
        "description": "Whether the provider must support structured/JSON output."
      },
      "embedding_dimensions": {
        "type": "integer",
        "minimum": 1,
        "description": "Required embedding vector dimensionality (for role 'embedding')."
      }
    }
  }
}
```

Why `requires` rather than a top-level `providers`: a top-level `providers` reads as *concrete provider definitions*; `requires` unambiguously denotes *dependencies the host must satisfy*, and leaves room for future `requires.tools` / `requires.skills` without another top-level key.

### Specification Impact

- New **optional** root property `requires`, alongside `tools`, `skills`, `evals`, `workflow`, `agents`. The root `required` list is unchanged.
- **Relationship to `tested_models`.** `tested_models` records what a prompt was *tested against* (provenance); `requires.providers` records what the pack *needs* (contract). They are complementary and independent — neither implies the other. A runtime MAY cross-check the provider it resolves for a requirement against `tested_models` to warn on test/deploy divergence (parity).
- The `default` key is documented as the conventional primary LLM.

### Validation Rules

- `requires` is optional; when present, `additionalProperties: false`.
- `requires.providers` is an optional array; each item is a string or a `ProviderRequirement` object.
- **Object form:** `key` and `role` are required; `key` matches `^[a-zA-Z0-9_-]+$`; `additionalProperties: false`.
- **String form** expands to `{ "key": <string>, "role": "llm", "required": true }`.
- `key` values within `requires.providers` MUST be **unique** (`key` is the sole discriminator).
- `required` defaults to `true` when omitted.
- `capabilities`, when present, is an **open** object (`additionalProperties: true`): the well-known fields are validated when present, and additional provider/role-specific keys are allowed with any shape. Custom keys SHOULD be namespaced (`x-`/vendor) to avoid clashing with future spec fields. Every capability is optional and **advisory** (a hint for matching, not a hard constraint the spec enforces).
- `default` is a reserved key denoting the primary LLM; a pack is not required to declare it.
- `role` is an open string; validators MUST NOT reject unknown roles, but MAY warn.
- A consuming runtime/deployer **SHOULD** treat an unsatisfied `required` requirement as an error and an unsatisfied optional requirement as a warning. The spec defines the declaration and this SHOULD; enforcement and resolution are implementation-defined.

## Examples

### Example 1: Basic Usage

A plain conversational pack that needs only a primary LLM:

```yaml
requires:
  providers:
    - default
```

This expands to one required requirement: `{key: default, role: llm, required: true}`.

### Example 2: Advanced Usage

A retrieval-augmented support pack with an optional eval judge:

```yaml
requires:
  providers:
    - key: default
      role: llm
      description: Primary support agent. Needs tool-use and a large context window.
      capabilities:
        min_context_tokens: 32000
        tool_use: true
    - key: embeddings
      role: embedding
      description: Embeds the knowledge base for retrieval.
      capabilities:
        embedding_dimensions: 1536
    - key: reranker
      role: inference
      required: false
      description: Cross-encoder that reorders retrieved passages by relevance.
      capabilities:
        # open, provider-specific capabilities — namespaced to avoid future clashes
        x-task: reranking
        x-max-documents: 100
    - key: judge
      role: llm
      required: false
      description: Optional LLM judge for the eval suite; a strong reasoning model.
```

A deployer can now: verify the workspace provides an `llm` and an `embedding` provider (coverage), resolve each `key` to a concrete provider (binding), and warn if the resolved `default` model is absent from the pack's `tested_models` (parity).

## Drawbacks

- Another optional section for authors to maintain; it can drift from actual usage unless a runtime infers or validates it.
- An open `role` vocabulary means runtimes may diverge on non-core roles.
- `capabilities` is open and advisory: the spec defines only a few well-known fields, so nuanced or provider-specific matching still leans on the prose `description` and namespaced custom keys — and because the object is open, an unrecognised key (including a typo of a well-known field) is silently accepted rather than flagged.

## Alternatives

### Alternative 1: Infer requirements at runtime (no schema change)

Each runtime infers needs from features it can already see (evals with an LLM judge → needs `judge`; semantic memory/RAG → needs `embedding`; always → `default` llm). Rejected as the *normative* model: an open, multi-runtime spec cannot mandate inference rules, inferred needs are invisible and non-portable across tools, and authors lose the ability to state intent (and the human `description`). Inference is retained only as an optional runtime convenience that MAY pre-populate or supplement authored requirements.

### Alternative 2: Reuse the variable `binding` mechanism (a `provider` kind)

Extend RFC 0003's variable `binding` with a `provider` kind. Rejected: variable bindings populate *template variables* from per-request context (`context`/`session`/`env`/`header`); provider *requirements* are pack-level runtime dependencies. The two operate at different layers and lifetimes; conflating them overloads one construct with two meanings.

### Alternative 3: Top-level `providers` block

Rejected: `providers` reads as concrete provider definitions (endpoints/models), which the portable pack must not contain. `requires.providers` is clearer about intent and extensible to other requirement categories.

## Adoption Strategy

### Backward Compatibility

- [x] Fully backward compatible

`requires` is optional. Packs without it validate and behave exactly as today: runtimes apply their existing defaults (typically a single `default` llm). Adding the block is purely additive.

### Migration Path

None required. Authors opt in when they want explicit requirements, coverage checks, or auto-binding. Tooling MAY offer to generate a `requires.providers` block from a runtime's inferred needs as a convenience.

## Unresolved Questions

The questions raised in the initial draft are resolved in this revision (see Detailed Design):

- **`role` openness** — an **open string**, with PromptKit's roles (`llm`, `embedding`, `tts`, `stt`, `image`, `inference`) as suggested values; runtimes may extend, validators must not reject unknown roles.
- **Structured capabilities** — included now as an optional `ProviderCapabilities` object, reusing RFC 0004's media-type vocabulary for modalities.
- **`default` reservation** — a reserved key meaning "primary LLM", but optional.
- **Same-role discrimination** — `key` is the sole discriminator; `description` + `capabilities` carry the distinction.

None outstanding.

## Implementation Plan (Optional)

1. **Phase 1: Schema**
   - [ ] Add `requires` (root) and `ProviderRequirement` (`$defs`) to `promptpack.schema.json`.
   - [ ] Validation test fixtures (valid + invalid).

2. **Phase 2: Documentation**
   - [ ] New "Provider Requirements" section in `promptpack-docs`, with the `default` convention and the `tested_models` relationship.

3. **Phase 3: Runtime adoption (non-normative)**
   - [ ] Reference implementations read `requires.providers`.
   - [ ] Deployers validate coverage, resolve/auto-bind by `role`, and warn on `tested_models` parity.

## Testing Strategy (Optional)

### Validation Tests

- A pack with **no** `requires` validates (backward compatibility).
- String shorthand `"default"` expands to an llm requirement.
- Object form with `key` + `role` validates; missing `key` or `role` is invalid.
- Unknown property under `requires` or a requirement object is invalid (`additionalProperties: false`).
- Duplicate `key` values are invalid.

### Compatibility Tests

- All existing example packs (RFCs 0001–0011) validate unchanged.

## Documentation Impact (Optional)

- [ ] New spec section: "Provider Requirements".
- [ ] Examples in `promptpack-docs`.
- [ ] Document the `default` primary-LLM convention and the `requires` vs `tested_models` distinction.

## Future Considerations (Optional)

### Richer capability matching

`ProviderCapabilities` covers the common cases (modalities, context window, tool-use, structured output, embedding dimension). A follow-up RFC could extend it — a shared role/modality registry, version or pricing constraints, or region/residency requirements — once concrete matching needs emerge.

### Other requirement categories

`requires` is intentionally a container. Future RFCs could add `requires.tools` or `requires.skills` for other host-supplied dependencies, reusing the same optional-but-strict pattern.

---

## Revision History

- **2026-06-25:** Initial draft.
- **2026-06-25:** Resolved open questions — open `role` set (PromptKit values incl. `inference`); added optional structured `ProviderCapabilities` reusing RFC 0004 media types; `default` reserved-but-optional; `key` as sole discriminator.
- **2026-06-25:** Made `ProviderCapabilities` an open object (`additionalProperties: true`) so open-ended providers (e.g. `role: inference`) can express arbitrary, namespaced capabilities; well-known fields still validated.
- **2026-06-25:** Implemented in spec v1.5.1 — added the optional top-level `requires` block with `requires.providers`, and the `ProviderRequirement` and `ProviderCapabilities` `$defs`, to `schema/promptpack.schema.json`. Patch bump: the field is optional and advisory (no runtime behavior change). Status → Implemented.

## References

- RFC 0003 (Template Variables) — the variable `binding` model, a distinct concern.
- RFC 0006 (Evals) — the judge-model dependency this formalises.
- RFC 0008 (Skills) — precedent for an optional top-level extension block.
- `tested_models` metadata — provenance, complementary to requirements.
