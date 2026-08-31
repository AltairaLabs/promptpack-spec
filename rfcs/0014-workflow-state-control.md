# RFC 0014: Workflow State Control

- **Status:** Implemented
- **Author(s):** Charlie Holland
- **Created:** 2026-08-31
- **Updated:** 2026-08-31
- **Discussion:** [RFC Comments](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/rfc-comments)
- **Related Issues:** [#45](https://github.com/AltairaLabs/promptpack-spec/issues/45)

## Summary

Add an optional `control` property to workflow state definitions, with values `user` (default) and `agent`. The property declares who holds the next turn after the conversation enters that state. `control: user` yields to the user, which is what every state does today. `control: agent` tells the runtime to run another agent round in the new state instead of yielding — letting a pack express transient states that route or process without asking the user for anything.

## Motivation

The workflow state machine introduced in [RFC 0005](./0005-workflow-extension.md) assumes the user holds the next turn after every transition. The agent calls `workflow__transition`, the state changes, and the conversation yields. That assumption is correct for interactive, IVR-shaped flows, and it is wrong for **transient states** that exist to process or route rather than to converse:

- **Iterative loops.** A codegen pack moving through `compile → test → fix → compile` should not require the user to say "continue" between each round.
- **Multi-intent messages.** A caller says "I need my balance, my ID is ACC-12345" in one breath. The agent verifies in `verifying`, transitions to `triage`, sees intent already stated, transitions to `resolution`, and answers. One user message, two transitions, three states.
- **Decision points.** A `route` state that exists purely to dispatch on context. Holding the floor for the user there adds a dead turn to every conversation that passes through it.

Today each of these needs a workaround: collapse several logical states into one, or move the routing into a tool result so the state machine never sees it. Both discard the clarity the workflow primitive exists to provide, and both make state-level assertions useless because the states no longer correspond to anything.

The pack author knows at design time which states are transient. `control` is where they say so.

### Goals

- Let a pack declare that a state does not yield to the user after entry.
- Keep the decision **declarative and per-state**, so every agent entering a state behaves identically.
- Remain fully backward compatible: a pack with no `control` behaves exactly as it does today.
- Reuse the existing loop bounds (`terminal`, `max_visits`, workflow `engine.budget`) rather than inventing new ones.

### Non-Goals

- Changing who *initiates* a transition. That is `orchestration`, and it is a separate axis (see below).
- Defining a new looping or iteration primitive. `control: agent` composes with the agent loop from [RFC 0009](./0009-agent-loops.md); it does not replace it.
- Letting the model choose whether to yield at call time. That is the alternative this RFC rejects.

## Detailed Design

`control` is an optional string property on each entry in `workflow.states`. Valid values are `user` and `agent`. The default is `user`.

After the runtime enters a state as the result of an agent-initiated transition, it consults the new state's `control`:

- **`control: user`** — the conversation yields. The accumulated assistant response is returned to the user. This is today's behavior in all cases.
- **`control: agent`** — the runtime runs another agent round in the new state, rebuilding the pipeline for that state's `prompt_task`, tools, and validators. The agent then either calls another tool (including another `workflow__transition`, continuing the loop) or emits a final text response.

Text emitted in a `control: agent` state is appended to the response that eventually reaches the user, rather than being discarded or delivered on its own. A pack that routes through three states produces one user-visible reply assembled from the rounds that had something to say.

The loop terminates when the conversation reaches a state with `control: user`, reaches a `terminal: true` state, or trips an existing bound — `max_visits` on a state, or the workflow's `engine.budget`. No new limits are introduced. A pack whose states all declare `control: agent` and never reach a terminal state is bounded by budget in exactly the way an unbounded agent loop already is.

### Relationship to `orchestration`

`orchestration` already exists on state definitions with values `internal`, `external`, and `hybrid`. It answers a different question — **who initiates the transition** — and the two axes are orthogonal:

| `orchestration` | `control` | Meaning |
|---|---|---|
| `internal` (default) | `user` (default) | Today's behavior: agent transitions, conversation yields |
| `internal` | `agent` | Agent transitions and keeps the floor |
| `external` | not applicable | An external system drives transitions; the agent did not trigger one, so there is no turn to hand back |

`control` is only consulted on an agent-initiated transition. On a state whose `orchestration` is `external`, the property is inert: the runtime is not mid-turn, so there is nothing to yield. Declaring it there is not an error — the state may be reachable both ways under `hybrid` — but it has no effect on the externally driven path.

### Schema Changes

Added to `$defs/WorkflowState`:

```json
{
  "control": {
    "type": "string",
    "enum": ["user", "agent"],
    "default": "user",
    "description": "Who holds the next turn after entering this state. 'user' yields the conversation to the user (default). 'agent' runs another agent round in this state without yielding, for transient routing or processing states."
  }
}
```

No entry is added to any `required` array.

### Specification Impact

- `docs/spec/structure.md` — the workflow state property table gains `control`.
- `docs/spec/schema-guide.md` — a section on transient states, and the `control` / `orchestration` distinction.
- `docs/spec/architecture-patterns.md` — the multi-intent and iterative-loop patterns become expressible.
- `docs/guides/add-workflow.md` — worth a short subsection; the failure mode of an all-`agent` cycle belongs there.

### Validation Rules

1. `control` MUST be one of `user` or `agent` when present. Any other value is a schema violation.
2. An absent `control` is equivalent to `control: user`. A runtime MUST NOT distinguish the two.
3. `control` on a `terminal: true` state has no effect — a terminal state ends the conversation regardless. Validators SHOULD warn on `control: agent` combined with `terminal: true`, as it almost certainly indicates author confusion.
4. A pack MAY declare `control: agent` on every non-terminal state. This is not a validation error; it is bounded at runtime by `max_visits` and `engine.budget`. Validators SHOULD warn when a cycle of `control: agent` states has no reachable `control: user` or terminal state and no `max_visits` on any member.

### Runtime Support Levels

- **Level 0 — Ignore.** Treat `control` as an unknown field and yield after every transition. Packs carrying it remain valid and behave as they do today. Correct for any runtime that has not implemented multi-round transitions.
- **Level 1 — Validate.** Schema-validate the value and surface it to tooling, without changing execution. A Level 1 runtime SHOULD warn that transient states will yield anyway, since a pack designed around `control: agent` will produce extra user turns.
- **Level 2 — Execute.** Honor the property: run another agent round on entering a `control: agent` state, accumulate assistant text across rounds, and terminate on a `control: user` state, a terminal state, `max_visits`, or budget exhaustion.

## Examples

> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). Equally valid as JSON.

### Example 1: Basic Usage

A support flow where `triage` is a pure decision point.

```yaml
workflow:
  version: 2
  entry: verifying
  states:
    verifying:
      prompt_task: verifying
      control: user            # default; shown for contrast
      on_event:
        AccountVerified: triage

    triage:
      prompt_task: triage
      control: agent           # transient — route without asking
      on_event:
        ServeBalance: resolution
        EscalateToAgent: handoff

    resolution:
      prompt_task: resolution
      control: user
      terminal: true

    handoff:
      prompt_task: handoff
      terminal: true
```

A caller who says "I need my balance, my ID is ACC-12345" is verified, routed through `triage`, and answered in `resolution` — one user message, one reply, three states, and every transition still visible to state-level assertions.

### Example 2: Advanced Usage

A codegen loop, bounded by `max_visits` rather than by a user turn.

```yaml
workflow:
  version: 2
  entry: compile
  states:
    compile:
      prompt_task: compile
      control: agent
      max_visits: 5
      on_event:
        CompileFailed: fix
        CompileOk: test

    test:
      prompt_task: test
      control: agent
      max_visits: 5
      on_event:
        TestsFailed: fix
        TestsPassed: report

    fix:
      prompt_task: fix
      control: agent
      max_visits: 10
      on_max_visits: report
      on_event:
        PatchApplied: compile

    report:
      prompt_task: report
      control: user
      terminal: true
```

The agent cycles `compile → fix → compile → test` without user turns. `max_visits` on `fix` with `on_max_visits: report` gives the loop a floor: after ten attempts it reports instead of spinning. On a Level 0 runtime this same pack still works — it just asks the user to continue between rounds.

## Drawbacks

- **A pack can describe a loop that does not obviously terminate.** `control: agent` cycles are bounded by budget rather than by structure, so a badly authored pack burns tokens where today it would have stopped and asked. The validator warning in rule 4 mitigates this but does not prevent it.
- **Behavior differs across runtimes in a user-visible way.** A Level 0 runtime yields where a Level 2 runtime does not, so the same pack has a different conversational shape depending on where it runs. This is true of every extension RFC, but here the difference is visible to end users rather than to tooling.
- **Response assembly is now a spec concern.** Text emitted across several rounds has to be concatenated into one reply. Packs that expect each state to produce a standalone message will read oddly when several states contribute.
- **One more property on an already large `WorkflowState`.** It now carries twelve properties, and the `control` / `orchestration` / `terminal` interaction takes a paragraph to explain.

## Alternatives

### Alternative 1: A `yield` argument on the `workflow__transition` tool

Let the model decide per call whether to hand back the turn.

Rejected for three reasons. It pushes a structural decision into prompt engineering, where the model has to remember to set it and will sometimes not. Two different agents entering the same state would then behave differently, which is precisely the determinism a state machine exists to provide. And it does not compose with `external` orchestration, where no tool call happens at all.

### Alternative 2: Infer transience from state shape

Treat any state with no `prompt_task` — or one whose only transitions are unconditional — as transient, and auto-continue.

Rejected because it is implicit. The pack author gets no way to say "this state routes but should still yield," and a runtime cannot distinguish a deliberately terse interactive state from a transient one. Inference also makes the behavior of a pack change when an unrelated property is added, which is a poor property for a portable artifact.

### Alternative 3: A separate `transient: true` boolean

Functionally equivalent for today's two cases and simpler to read.

Rejected in favor of the enum because it does not extend. `control` names an axis — who holds the turn — with room for values this RFC does not define, `system` being the obvious candidate for a state driven by a scheduler or an external event loop. A boolean would have to be deprecated to get there. This follows the "extend, don't compete" preference: a new value on an existing axis rather than a second flag that interacts with the first.

## Adoption Strategy

Existing packs need no change. `control` is optional and its default is the current behavior, so a pack authored before this RFC and a pack that explicitly writes `control: user` everywhere are indistinguishable to a runtime.

Adoption is incremental and per-state: an author identifies a state that always immediately transitions again, adds `control: agent`, and removes whatever workaround stood in for it. Packs that collapsed several logical states into one to avoid dead turns can now split them back apart, which restores state-level assertions on the intermediate steps.

### Backward Compatibility

- [x] Fully backward compatible
- [ ] Requires migration (describe migration path)
- [ ] Breaking change (describe impact and migration)

### Migration Path

Not applicable.

## Unresolved Questions

- Should a `control: agent` state be permitted to have no `prompt_task`? A pure routing state arguably needs no prompt of its own, but the runtime still has to build a pipeline for the round, and it is unclear what it would prompt with.
- Should text emitted in a `control: agent` state be suppressed rather than accumulated? Concatenation is the conservative choice — it never loses output — but a routing state that narrates its reasoning would leak that narration into the user's reply.
- Is a `system` value worth defining now for externally driven event loops, or should it wait for a concrete use case? This RFC leaves the enum at two values deliberately.

---

## Revision History

- **2026-08-31:** Initial version, authored at Implemented under the fast-track path in GOVERNANCE.md (design and implementation shipped together in spec v1.7.0).

## References

- [RFC 0005: Workflow Specification Extension](./0005-workflow-extension.md) — the state machine this extends
- [RFC 0009: Agent Loop Extension](./0009-agent-loops.md) — the loop `control: agent` continues
- [RFC 0011: Workflow States as Agents](./0011-workflow-states-as-agents.md) — the other property that crosses states and agents
- [Issue #45](https://github.com/AltairaLabs/promptpack-spec/issues/45) — original proposal
