---
sidebar_position: 9
---

# Adopters

Who is building on PromptPack, and how to get listed.

:::info The honest position
PromptPack is a young specification. Today there is **one adopter — AltairaLabs,
who wrote it** — and one reference implementation. This page lists what is
actually true rather than what would look better, and grows as real adopters
appear.
:::

## AltairaLabs

**Industry:** AI development tools
**Use case:** authoring and operating the PromptKit reference toolkit
**Scale:** production use across testing, CI/CD and runtime workloads

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

If you are running PromptPack somewhere real, we would like to hear about it —
particularly what the format got wrong, which is more useful to a young spec
than an endorsement.

**What qualifies:** production or substantial development use of the
specification, and willingness to share enough implementation detail that the
entry means something to a reader.

**How:** open a [GitHub Discussion](https://github.com/altairalabs/promptpack-spec/discussions)
with your organization, use case and scale. We will follow up to check details
before listing you.

Entries are named and attributable. This page will not carry anonymous quotes
or aggregate counts.

## Next

- [Getting Started](/docs/getting-started) — build your first pack
- [Specification Overview](/docs/spec/overview) — what the format contains
- [RFC Process](/docs/processes/rfc-process) — propose a change
