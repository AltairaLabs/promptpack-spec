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

## Landmines

- **Schema change ≠ RFC PR.** The RFC PR is markdown only. `schema/promptpack.schema.json` changes in a separate implementation PR after the RFC is Accepted. The RFC's "Documentation Impact / schema" box stays unchecked until then.
- **`version-check` CI is a three-way lockstep.** When the implementation PR bumps `schema/promptpack.schema.json` `version`, you MUST also update the **README spec badge** and the **versioned schema URL in README** to the same version, or CI fails. (Additive optional field = minor bump.)
- **`RFC_SPEC_VERSION` map** in `sync-rfcs.js` is hand-maintained — add `NN: 'vX.Y'` when the RFC ships in a spec release (only matters at Implemented).
- **Schema-reference docs and `static/schema/<ver>/` copies are generated** — never hand-edit.

## Quick reference

| Path | Role |
|---|---|
| `rfcs/0000-template.md` | template to copy |
| `rfcs/NNNN-slug.md` | the RFC (hand) |
| `rfcs/README.md` | index tables (hand) |
| `promptpack-docs/docs/rfcs/*` | docs copies (auto — leave alone) |
| `promptpack-docs/scripts/sync-rfcs.js` | generator + `RFC_SPEC_VERSION` map |
| `schema/promptpack.schema.json` | schema source of truth (separate impl PR) |

## Common mistakes

- Hand-editing the docs-site RFC index → merge conflicts. It's generated.
- Bundling the schema change into the RFC PR → diverges from the process; split it.
- Bumping the schema version without the README badge + URL → red CI.
- A `stateDiagram-v2` with notes on composite states → won't render. Use `flowchart LR`.
- Drafting before designing → use `superpowers:brainstorming` first. Turn the implementation/schema work into a plan with `superpowers:writing-plans`.
