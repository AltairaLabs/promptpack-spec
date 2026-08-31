---
title: "PromptPack in Regulated Environments"
description: "How a PromptPack maps onto inventory, change control, model risk, and supervisory evidence — and where the specification's responsibility ends."
sidebar:
  order: 3
---

Most of this site is written for the engineer who has to build the thing. This
page is written for the person who has to answer for it.

Nothing here is a different specification. It is the same format described
throughout these docs, read through the four questions an oversight function
usually asks first: **what do we have, how does it change, what could it get
wrong, and what can we show a supervisor.**

:::note[What this page is not]
PromptPack is a **file format**, not a control framework and not a compliance
product. It does not certify anything, does not map to any named regulation,
and cannot enforce a policy on its own — enforcement is the runtime's job. What
it does is make the things you need to govern **declared, versioned, and
machine-readable** instead of scattered across application code. See
[Boundaries](#boundaries) for what it deliberately leaves to you.
:::

## The underlying property

An agent's behaviour is usually spread across prompt strings in source files,
tool wiring, retry logic, model choices in config, and test fixtures. That is
difficult to inventory and harder to review, because there is no single thing
to point at.

A promptpack is one declarative JSON file, validated against a
[published schema](./spec/schema-reference.md), that holds the agent's prompts,
tools, orchestration, limits and quality checks together. Every property below
follows from that: it is an artifact, so it can be listed, diffed, reviewed,
versioned and attached to a change record like any other controlled document.

## Inventory

*What agents do we have, and what do they depend on?*

| You need | Where it lives |
| --- | --- |
| Stable identifier | `id` |
| Human-readable name and purpose | `name`, `description` |
| Version of this agent | `version` (Semantic Versioning) |
| Categorisation for a register | `metadata.domain`, `metadata.tags`, `metadata.language` |
| Model dependencies | `requires.providers` |
| Expected running cost | `metadata.cost_estimate` |

`requires.providers` (added in v1.5.1) is the one worth dwelling on. A pack
declares the *logical* model providers it needs — each with a `key`, a `role`
(`llm`, `embedding`, `judge`, …) and optional capability floors — but never
which vendor satisfies them. That separation is deliberate, and it is useful
to an oversight function: the pack states its model dependencies in a form you
can enumerate across a fleet, while the binding to a specific vendor stays a
deployment decision you can review separately.

Because packs are files, the inventory question becomes a repository query
rather than a survey of teams.

## Change control

*How does behaviour change, and who agreed to it?*

The format itself carries version and provenance:

- **`version`** — the pack's own Semantic Version, independent of the
  application that runs it.
- **`compilation`** — build provenance: `compiled_with` (compiler version),
  `created_at` (ISO 8601), `schema` (pack format version), and `source` (the
  configuration it was built from).
- **Schema validation** — a pack is either valid against the published schema
  or it is not, so conformance is a gate you can run in CI rather than a
  judgement call in review.

The rest is inherited from the fact that it is a text file. A behaviour change
is a diff. It goes through whatever review, approval and release process
already governs your repository, and the resulting history is the audit trail —
who changed what, when, and who approved it. No separate prompt-management
system has to be trusted to reproduce that.

The specification itself changes under a published
[RFC process](./processes/rfc-process.md) with documented
[governance](./processes/governance.md) — relevant if your concern extends to
the stability of the standard you are depending on.

## Model risk

*What could it get wrong, and what constrains it?*

Four distinct mechanisms, all declared in the pack rather than implied by code:

**Declared model dependencies.** `requires.providers` states the model roles the
pack needs and the capabilities it assumes, so a reviewer can see what class of
model the behaviour was designed around.

**Evidence of what was actually tested.** Each prompt may carry
`tested_models` — an array where every entry records `provider`, `model` and
`date` (all required), plus optional `success_rate`, `avg_tokens`, `avg_cost`,
`avg_latency_ms` and `notes`. This is a record of which models were exercised
and when, travelling with the artifact instead of living in a spreadsheet.

**Quality and safety assertions.** [`evals`](./guides/add-evals.md) are defined
in the pack, at pack or prompt level. Each has an `id`, a `type`, and a
`trigger` determining when it runs, and may carry a `threshold` for pass/fail,
a Prometheus-style `metric` declaring its output shape, `sample_percentage` for
sampled execution, `groups` for filtering, and a `when` condition. The
significance for oversight is that the acceptance criteria ship *with* the
behaviour they judge — a pack cannot be deployed having quietly left its checks
behind.

**Bounded authority.** Agents that act need limits on how far they may go:

- `tool_policy` (per prompt) — `tool_choice`, `max_rounds`,
  `max_tool_calls_per_turn`, and a `blocklist` of forbidden tools.
- `workflow.engine.budget` — `max_total_visits`, `max_tool_calls`, and
  `max_wall_time_sec` across an entire workflow run.
- Terminal states in the [agent loop](./guides/add-workflow.md), so an
  autonomous loop has a declared stopping condition rather than an implicit one.

These are declarations. A runtime must honour them for them to bind — but
because they are declared, a reviewer can read the intended limits without
reading the implementation, and a runtime can be tested against them.

## Supervisory evidence

*What can we show someone who asks?*

- **The artifact itself.** A single reviewable file describing the deployed
  behaviour, at a known version, rather than a reconstruction from source.
- **Its history.** The repository record of how that file reached its current
  state.
- **Declared metrics.** Evals carry Prometheus-style `metric` declarations, so
  the quality signals are named in the pack and can be collected consistently
  wherever it runs.
- **Artifacts produced by execution.** Workflow states may declare
  `artifacts` — each with a MIME `type`, a `description`, and a `mode`
  governing how it is updated across visits — which is how a run leaves behind
  structured, typed output rather than only prose.

Together these support the claim most often needed: *this specific behaviour,
at this version, was checked in this way, and here is what it produced.*

## Boundaries {#boundaries}

Being precise about this matters more than the rest of the page, because a
governance story that overstates itself is worse than none.

A promptpack **does not**:

- **Enforce anything.** It declares limits, policies and checks. A runtime
  executes them. A pack with a strict `tool_policy` run by a runtime that
  ignores it is unconstrained.
- **Produce audit logs.** Runtimes and platforms do. The pack declares what
  should be measured; it does not record what happened.
- **Cover identity, access control, data residency, or personal data.** These
  are outside the format's scope and remain the responsibility of the
  surrounding system.
- **Sign or attest to itself.** There is no signature or checksum field in the
  schema. Integrity and provenance beyond the `compilation` block come from
  your repository, registry and supply-chain controls.
- **Map to any named regulation.** The vocabulary on this page — inventory,
  change control, model risk, supervisory evidence — is deliberately generic.
  Deciding which obligations apply, and whether these mechanisms satisfy them,
  is work for your own compliance and legal functions.

What the specification offers an oversight function is narrower and, we think,
more honest than a compliance claim: the things you need to review are written
down, in one place, in a documented format, versioned like code.

## Where to go next

- [Specification Overview](./spec/overview.md) — what the format contains
- [Pack Structure & Design](./spec/structure.md) — every top-level section
- [Schema Reference](./spec/schema-reference.md) — field-level detail
- [Adding Evals](./guides/add-evals.md) — how quality checks are declared
- [Governance](./processes/governance.md) — how the specification itself is run
