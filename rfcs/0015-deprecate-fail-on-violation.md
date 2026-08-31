# RFC 0015: Deprecate `fail_on_violation`

- **Status:** Implemented
- **Author(s):** Charlie Holland
- **Created:** 2026-08-31
- **Updated:** 2026-08-31
- **Discussion:** [RFC Comments](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/rfc-comments)
- **Related Issues:** [#46](https://github.com/AltairaLabs/promptpack-spec/issues/46)

## Summary

Deprecate `fail_on_violation` on `$defs/Validator`, moving validators to always-enforce semantics. Declaring a validator will mean "rewrite or block the response on a hit," with no configuration that makes it do nothing. Authors who want observation rather than enforcement declare an eval and assert on its score. The field is marked deprecated in spec v1.7.0 and removed in v2.0.0, no earlier than 2027-08-31 per the twelve-month minimum in the [versioning policy](https://promptpack.org/docs/processes/versioning).

## Motivation

The specification currently defines `fail_on_violation: false` as "violations are logged but allowed." That single flag conflates two things the rest of the specification keeps carefully apart:

- A **guardrail** is an enforcement rule. It mutates the assistant message on a hit — truncating, replacing, or blocking. It belongs to production.
- An **eval** is a measurement. It records a score. It belongs to tests, and optionally to telemetry.

A validator configured with `fail_on_violation: false` is an eval wearing a guardrail's clothes. It is declared in the pack as a validator, it runs through the guardrail hook chain, and it produces no behavior. That is confusing on its own, but the real problem is the direction of the confusion: a pack author reading the spec reasonably assumes that a validator with `enabled: true` validates. The escape hatch makes that assumption silently wrong, and it fails open — the case where a security-shaped feature quietly does nothing is the worst available default.

There is also a live divergence to close. The PromptKit reference runtime already implements always-enforce semantics: `runtime/hooks/guardrails/adapter.go` unmarshals `fail_on_violation` for spec compliance and then ignores the value, with an inline comment recording the deliberate deviation. Today the specification documents a flag the reference implementation disregards, which is the worst of both worlds — implementers who follow the spec produce behavior that differs from the reference, and the spec offers a guarantee nothing honors.

### Goals

- Make the validator contract unambiguous: declaring one means it enforces.
- Give observation a correct home — `evals` — rather than a degenerate guardrail.
- Close the standing divergence between the specification and the reference runtime.
- Remove the field on the schedule the versioning policy already mandates, with the deprecation window running its full length.

### Non-Goals

- Renaming `Validator` to `Guardrail`. That collision with input-validation terminology is real, but it is a separate change with a separate migration cost, and bundling it here would make a narrow deprecation into a broad rename. See Unresolved Questions.
- Changing what validators *do* on a hit. Truncation and replacement semantics are untouched.
- Changing eval semantics. This RFC points authors at `evals`; it does not modify them.

## Detailed Design

`fail_on_violation` is marked deprecated in v1.7.0. The field remains present, remains schema-valid, and remains parseable for the entire deprecation window. What changes in v1.7.0 is what the specification *says* it means, and what tooling reports.

From v1.7.0:

- A validator that triggers MUST be enforced, regardless of the value of `fail_on_violation`. The value is no longer consulted.
- The `enabled` property is unaffected and remains the supported way to turn a validator off. `enabled: false` disables the validator entirely; it does not run and cannot trigger. This is the only remaining way to have a declared validator produce no behavior, and it is honest about it.
- Validation tooling SHOULD emit a deprecation warning when `fail_on_violation` is present, naming the migration.

In v2.0.0 the property is removed from the schema. A pack still carrying it then fails validation under `additionalProperties: false` on `Validator`.

The timeline is set by the versioning policy's twelve-month minimum, not by this RFC: deprecated 2026-08-31, removable no earlier than 2027-08-31, and shipping in whichever v2.0.0 follows that date.

### Schema Changes

`$defs/Validator.fail_on_violation` gains a `deprecated` annotation and a description that states the replacement:

```json
{
  "fail_on_violation": {
    "type": "boolean",
    "deprecated": true,
    "default": false,
    "description": "DEPRECATED (v1.7.0), removed in v2.0.0. Ignored — validators always enforce. A triggered validator rewrites or blocks the assistant message regardless of this value. To disable a validator, use 'enabled: false'. For observation without enforcement, declare an eval and assert on its score instead. See RFC 0015."
  }
}
```

`deprecated` is a standard JSON Schema 2020-12 annotation, so this carries no validation change — a pack with the field remains valid, and generic tooling that understands the keyword surfaces the warning without any PromptPack-specific knowledge.

### Specification Impact

- `docs/spec/structure.md` — the validator property table marks the field deprecated.
- `docs/spec/schema-guide.md` — the guardrails section states always-enforce, and carries the migration.
- `docs/spec/overview.md` — the v1.7.0 "What's New" box notes the deprecation, since it is the first deprecation the spec has issued.
- `docs/spec/versions.md` — a deprecation row with the v2.0.0 removal target.

### Validation Rules

1. `fail_on_violation` remains schema-valid through the v1.x series. Its presence MUST NOT cause validation failure before v2.0.0.
2. A runtime MUST NOT consult the value. A triggered validator is enforced whether the field says `true`, says `false`, or is absent.
3. Validation tooling SHOULD warn when the field is present, and the warning SHOULD name `evals` as the replacement for the `false` case specifically.
4. From v2.0.0 the property is removed and its presence is a validation error under `Validator`'s `additionalProperties: false`.

### Runtime Support Levels

- **Level 0 — Ignore.** Parse and discard the field. Since the specified behavior is now to ignore it, Level 0 and Level 2 agree on execution; a Level 0 runtime simply does not warn. This is the one deprecation where doing nothing is conformant.
- **Level 1 — Validate and surface.** Additionally warn that the field is deprecated, and report packs carrying `fail_on_violation: false` as needing migration, since those are the packs whose behavior changes.
- **Level 2 — Enforce.** Always enforce a triggered validator, and treat `enabled: false` as the only supported way to disable one.

## Examples

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). Equally valid as JSON.

### Example 1: Basic Usage

A pack that used the flag for its intended purpose needs no change — the validator already enforced, and now says so without the redundant flag.

```yaml
# Before (v1.6.0)
prompts:
  support:
    validators:
      - type: banned_words
        fail_on_violation: true
        message: "Response contains banned words"
        params:
          words: [inappropriate, banned]

# After (v1.7.0) — the flag is simply dropped
prompts:
  support:
    validators:
      - type: banned_words
        message: "Response contains banned words"
        params:
          words: [inappropriate, banned]
```

### Example 2: Advanced Usage

The case that actually migrates: a validator used for observation becomes an eval, and the assertion moves to the test scenario where it belongs.

```yaml
# Before (v1.6.0) — a guardrail that does nothing in production
prompts:
  support:
    validators:
      - type: length_check
        fail_on_violation: false
        params:
          max_characters: 1000

# After (v1.7.0) — measurement declared as measurement
prompts:
  support:
    evals:
      - id: response_length
        type: length_check
        trigger: on_response
        params:
          max_characters: 1000
        metric: within_limit
        threshold: 0.95
```

The eval scores every response and reports; nothing is blocked. A test scenario asserts on `response_length` to fail the build when the pack regresses. The observation that used to happen silently in production is now explicit in both places, and the production path no longer carries a guardrail that never fires.

## Drawbacks

- **Packs relying on `fail_on_violation: false` change behavior.** Any pack that used the flag to park a rule in observe-only mode will start enforcing it. On a runtime that already ignored the field this is not a change at all, but on a spec-faithful runtime it is a real behavior difference, and it arrives as blocked or rewritten responses rather than as an error. This is the sharpest edge in the RFC.
- **The migration is not mechanical.** Moving a validator to `evals` means choosing a `metric`, a `threshold`, and a trigger, and then writing a scenario assertion. It is not a rename.
- **It removes a genuinely convenient switch.** Toggling `fail_on_violation` was a fast way to stage a new guardrail — deploy it observing, watch the logs, then turn it on. That workflow now spans two declarations.
- **Two-step removal is a long tail.** The field lives on for at least a year, so the spec documents something inert for the whole v1.x series.

## Alternatives

### Alternative 1: Keep the field and make it work

Require runtimes to honor `fail_on_violation: false` properly, and fix the reference runtime to match the spec rather than the other way around.

Rejected because it preserves the conflation rather than resolving it. A conforming runtime would then have two mechanisms for measurement — evals, and validators-that-do-not-validate — with different declaration sites, different result shapes, and no guidance on which to reach for. It also entrenches the fail-open reading of a security-shaped feature.

### Alternative 2: Redefine `false` as "warn but continue"

Keep the field and give it real, non-degenerate semantics: on a hit, emit a warning to telemetry and let the response through unmodified.

Rejected because that is what an eval is. The distinguishing property of a guardrail is that it changes the message; a rule that only reports is a measurement no matter which array it is declared in. This alternative renames the problem.

### Alternative 3: Remove it immediately in v1.7.0

Drop the property now rather than deprecating it.

Rejected because the versioning policy forbids it. Removing a field is a breaking change that belongs in a MAJOR release, and the deprecation process sets a twelve-month minimum window with migration guidance. Fast-tracking the RFC's *approval* does not fast-track a removal the policy schedules.

## Adoption Strategy

Nothing breaks on upgrade to v1.7.0 — the field stays valid and packs keep loading. Authors see a deprecation warning from validation tooling and migrate at their own pace over the window.

Two populations, with very different work:

- **`fail_on_violation: true`, or the field absent.** No change required, ever. The validator already enforces. Delete the line when convenient; it is inert either way.
- **`fail_on_violation: false`.** This is the migration. Move the rule to `evals` on the same prompt, keeping the same `type` and `params`, choose a metric and threshold, and add an assertion on the eval score in the test scenarios that covered it. Then delete the validator.

Tooling should make the second population findable — a pack scan for the literal `fail_on_violation: false` identifies every affected declaration, which is why rule 3 asks validators to report that case specifically rather than warning uniformly.

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration (describe migration path)
- [ ] Breaking change (describe impact and migration)

The v1.7.0 change is backward compatible in the schema sense: every pack that validated before still validates, and the reference runtime's behavior does not change at all. The subsequent removal in v2.0.0 is the breaking change, and it is scoped to that release.

### Migration Path

For `fail_on_violation: false`:

1. Copy the validator's `type` and `params` into a new entry under `evals` on the same prompt.
2. Give it an `id`, a `metric`, a `threshold`, and a `trigger`.
3. Add an assertion on that eval's score in the test scenarios that relied on the validator.
4. Delete the validator entry.

For `fail_on_violation: true` or absent: delete the line. No other change.

## Unresolved Questions

- **Should `Validator` be renamed to `Guardrail` — and the `validators` key to `guardrails` — in v2.0.0?** "Validator" collides with input-validation concepts in most frameworks, and "guardrail" matches how the industry now talks about this. The rename would be natural to bundle with the removal, since both are breaking and both land in the same release. Deliberately left open here: it deserves its own RFC and its own migration tooling rather than riding along on a deprecation.
- **Are there production packs depending on `fail_on_violation: false`?** The question was asked when [#46](https://github.com/AltairaLabs/promptpack-spec/issues/46) was filed and never answered. If any exist, the twelve-month window is where they get found; a registry-wide scan for the literal would answer it sooner.
- **Should the deprecation warning be an error under a strict validation mode?** A `--strict` flag that promotes deprecation warnings would let teams enforce migration ahead of v2.0.0, but no such mode exists in the spec today.

---

## Revision History

- **2026-08-31:** Initial version, authored at Implemented under the fast-track path in GOVERNANCE.md (deprecation annotation shipped in spec v1.7.0; removal targeted at v2.0.0, no earlier than 2027-08-31).

## References

- [RFC 0006: Evals Extension](./0006-evals-extension.md) — where observation belongs
- [Versioning policy](https://promptpack.org/docs/processes/versioning) — the twelve-month deprecation minimum and the MAJOR-release removal rule
- [Issue #46](https://github.com/AltairaLabs/promptpack-spec/issues/46) — original proposal, including the PromptKit divergence
