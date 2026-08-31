---
name: authoring-promptpack-rfcs
description: Use when proposing, drafting, submitting, or revising a change to the PromptPack specification in this repo — a new entity type, schema field, workflow/agent/eval/composition/skill extension, or any spec behavior change. Covers the RFC document, the index, the schema, and the docs-site landmines.
---

# Authoring PromptPack RFCs

## Overview

Substantial spec changes land as an **RFC** (`rfcs/NNNN-slug.md`) following `rfcs/0000-template.md`. The RFC PR is **markdown only** — it *proposes* the schema change; the schema itself lands in a **separate implementation PR** once the RFC is Accepted. Getting this split — and a handful of generated-file and CI landmines — right is what this skill captures.

**Design the change first.** For anything non-trivial, use `superpowers:brainstorming` before drafting: diagnose, weigh 2-3 approaches, converge. The RFC is the write-up of an agreed design, not the place to think.

## When to use

- New entity type (beyond prompts, tools, workflows, personas, fragments), new schema field, breaking change, or any change to validation/processing behavior → **RFC**.
- Doc fixes, clarifications, typo-level schema tweaks → a plain issue/PR, no RFC.

## Workflow

1. **Next number.** Highest existing `rfcs/NNNN-*.md` + 1, zero-padded. Slug is kebab-case and scope-accurate (rename later rather than overselling).
2. **Copy the template** `rfcs/0000-template.md`. Fill every section. Header: `Status: Draft`, real author, `Created`/`Updated` = today (absolute date).
3. **Write to house style** (see below). Examples in **YAML** with the line `> YAML shown for readability (per [RFC 0002](./0002-yaml-format.md)). Equally valid as JSON.`
4. **Diagram** only where it earns its keep. Use a compact `flowchart LR` (subgraphs fine). **Avoid `stateDiagram-v2` composite states with notes** — they break rendering and sprawl vertically. No theme-init block needed.
5. **Update the index** `rfcs/README.md` — **hand-maintained**. Add a row to the Active table (Draft) or Implemented table. Fix any drift you notice (status vs. the RFC file).
6. **Do NOT touch the docs site copies.** `promptpack-docs/docs/rfcs/index.md` and `promptpack-docs/docs/rfcs/*.md` are **auto-generated** by `promptpack-docs/scripts/sync-rfcs.js` (runs in `prebuild`; CI's docs-build regenerates them). Hand-editing them causes conflicts.
7. **Land it:** branch `rfc/NNNN-slug` off `main`, conventional commit `docs(rfc): add RFC NNNN — <title>`, PR to `main`.

## House style (match the existing RFCs)

| Convention | What to do |
|---|---|
| Backward compatibility | Strongly preferred. Check `[x] Fully backward compatible`; make new fields optional. If you must break, justify and give a migration path. |
| Runtime Support Levels | Include a Level 0 (ignore) / 1 (validate) / 2 (execute) section — every extension RFC has one. |
| `engine` escape hatch | Runtime-specific config goes in an opaque `engine` block, never in the core schema. |
| Extend, don't compete | Prefer adding a field/mode to an existing surface over a new top-level primitive (cf. RFC 0010 composition as a state mode; RFC 0011 a field on AgentDef). Call this out in Alternatives. |
| Honesty sections | Fill Drawbacks, Alternatives (2-3, each with why-rejected), and Unresolved Questions for real. Engineer-to-engineer, no hype. |

## The two PRs

A spec change lands in **two** PRs. Keep them separate.

**PR 1 — the RFC** (this skill's Workflow above). Markdown only, `Status: Draft`. It *proposes* the schema change; it does **not** touch `schema/promptpack.schema.json`.

**PR 2 — implementation** (after the RFC is Accepted). One PR carries **everything together, in lockstep** — never split these across PRs:

1. **Schema** — add the fields to `schema/promptpack.schema.json` and bump its top-level `version` (additive optional field = **minor** bump). Schema is the source of truth.
2. **RFC status** — set the RFC's `Status: Implemented`, bump `Updated`, add a Revision History line; move its row to the **Implemented** table in `rfcs/README.md`.
3. **README lockstep** — update the `Spec-vX.Y.Z-blue` badge **and** the versioned schema URL (`schema/vX.Y.Z/...`) to the new version. Enforced by `version-check` (`scripts/check-version-consistency.mjs`): schema version == badge == URL, or CI fails.
4. **Docs + version snapshot** — update the current spec docs (`promptpack-docs/docs/spec/*`) with the new feature, and perform the manual docs-version snapshot (see Docs site versioning below).
5. **`RFC_SPEC_VERSION` map** in `sync-rfcs.js` — add `NN: 'vX.Y'` (the spec version that ships it).

> Why all in one PR: RFC-0009 was once marked Implemented while its schema fields were never added. `version-check` and this rule exist to stop exactly that drift. An RFC reaching `Implemented` and the schema version bump are the **same event**.

**The full step-by-step for PR 2 is in [`release-runbook.md`](./release-runbook.md)** (this skill directory) — the detailed, de-drifted release checklist (schema, docs archive, versions, sidebars, README lockstep, sync-schema, RFC index, guide).

## Schema publishing (`latest` + versioned copies)

`schema/promptpack.schema.json` is the only source of truth. `npm run sync-schema` (runs automatically in the docs `prebuild`/`prestart`) copies it to **both** `static/schema/v<version>/` and `static/schema/latest/` — so `latest/` always mirrors the current schema; you never hand-point it. The authoritative public publish happens when a **`v*` git tag** is pushed: `publish-schema.yml` copies the schema into `static/schema/<tag>/` + `latest/` and commits to `main`. So the release flow is: merge PR 2 → tag `vX.Y.Z` → CI publishes the versioned + `latest` schema.

Never hand-edit `static/schema/**` or the generated `schema-reference` docs — they're produced by `sync-schema.js` / the schema-docs workflow.

## Docs site versioning

The docs site **is** versioned, but **manually** — only `docs/spec/` is versioned (processes, RFCs, ecosystem stay current). There is no framework versioning primitive (no `versioned_docs/`); deliberate choice. When the implementation PR bumps the spec version, you archive the outgoing `docs/spec/*` into `docs/spec/v<previous>/`, advance the current docs, and update `versions.md` + the `Archive` list in `promptpack-docs/astro.config.mjs` — all in that same PR. **[`release-runbook.md`](./release-runbook.md) (steps 3–6) has the exact per-file edits; `promptpack-docs/docs/spec/VERSIONING.md` is the canonical guide for badge markup.**

`static/schema/` (machine schema) and `docs/spec/` (human docs) version independently but in step — both advance in the implementation PR.

## Quick reference

| Path | Role |
|---|---|
| `rfcs/0000-template.md` | template to copy |
| `rfcs/NNNN-slug.md` | the RFC (hand) |
| `rfcs/README.md` | index tables (hand) |
| `promptpack-docs/docs/rfcs/*` | docs copies (auto — leave alone) |
| `promptpack-docs/scripts/sync-rfcs.js` | generator + `RFC_SPEC_VERSION` map (add `NN: 'vX.Y.Z'` or the site contradicts the RFC) |
| `promptpack-docs/astro.config.mjs` | sidebar, including the `Archive` list |
| `promptpack-docs/src/styles/site.css` | `.ppVersionBadge` rules |
| `schema/promptpack.schema.json` | schema source of truth (separate impl PR) |

## Common mistakes

- Hand-editing the docs-site RFC index → merge conflicts. It's generated.
- Writing `:::info` / `:::warning`, or a space-separated aside title. Starlight
  takes `note`/`tip`/`caution`/`danger` with a **bracketed** label
  (`:::note[Title]`); anything else renders as literal `:::` text mid-prose.
- Bundling the schema change into the RFC PR → diverges from the process; split it.
- Bumping the schema version without the README badge + URL → red CI.
- A `stateDiagram-v2` with notes on composite states → won't render. Use `flowchart LR`.
- Drafting before designing → use `superpowers:brainstorming` first. Turn the implementation/schema work into a plan with `superpowers:writing-plans`.
