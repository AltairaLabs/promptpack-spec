---
title: "Adopters"
description: "Who is building on PromptPack, and how to get listed. Entries are named and attributable."
sidebar:
  order: 9
---

{/*
  Editorial rule for this page: every entry is a named organisation that has
  confirmed its own usage. No anonymous testimonials, no aggregate counts, no
  logos we have not been given permission to show. An adopters page that
  overstates is worth less than a short one — and this is the page an evaluator
  checks first. See planning/branding: "No fabricated proof."
*/}

# Adopters

PromptPack v1.5.1 is published and running in production at AltairaLabs, with a
reference implementation and a LangChain.js integration. Entries below are named
and attributable.

If you are running PromptPack, [tell us](https://github.com/altairalabs/promptpack-spec/discussions)
and we will list you.

## AltairaLabs

| | |
| --- | --- |
| **Industry** | AI development tools |
| **Use case** | Authoring and operating the PromptKit reference toolkit |
| **Scale** | Production use across testing, CI/CD and runtime workloads |

AltairaLabs created PromptPack and uses it for:

- Operating the PromptKit reference toolkit (runtime, `promptarena`, `packc`)
- Internal agent engineering workflows
- Testing agent behavior across providers
- The examples and documentation on this site

[altairalabs.ai →](https://altairalabs.ai)

## Reference implementation

### PromptKit

A Go runtime plus npm-distributed CLIs for testing, validating and compiling
packs.

- Full PromptPack v1.5.1 support — agent loops, workflows, compositions,
  multi-agent, skills, evals
- Provider integrations: Claude, OpenAI, Gemini, Azure, local models
- `promptarena` testing CLI and `packc` compiler CLI
- GitHub Actions for CI/CD

[View on GitHub →](https://github.com/AltairaLabs/PromptKit)

### LangChain.js integration

[`@promptpack/langchain`](https://github.com/AltairaLabs/promptpack-langchainjs)
loads packs directly into LangChain.js.

## Worked examples

The [examples in the specification](/docs/spec/examples) are written to
demonstrate the format — a support router, a code-review loop, a content
pipeline, a tutor. They are illustrative, not case studies of deployments by
third parties.

## Getting listed

We are as interested in what the format got wrong as in an endorsement — the
first is more useful to the RFC process.

**What qualifies:** production or substantial development use of the
specification, and willingness to share enough implementation detail that the
entry means something to a reader.

**How:** open a [GitHub Discussion](https://github.com/altairalabs/promptpack-spec/discussions)
with your organization, use case and scale. We will follow up to confirm details
before listing you.

## Next

- [Getting Started](/docs/getting-started) — build your first pack
- [Specification Overview](/docs/spec/overview) — what the format contains
- [RFC Process](/docs/processes/rfc-process) — propose a change
