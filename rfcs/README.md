# PromptPack RFCs

This directory contains all Request for Comments (RFC) documents for the PromptPack specification.

## Overview

RFCs are used to propose substantial changes to the PromptPack specification. The RFC process ensures that all stakeholders have an opportunity to review and provide feedback on significant changes before they are implemented.

## RFC Numbering

RFCs are numbered sequentially starting from 0001. When creating a new RFC:

1. Copy `0000-template.md` to a new file
2. Name it with the next available number: `0001-my-feature.md`
3. Fill out all sections of the template
4. Submit as a pull request

## RFC Status

Each RFC has one of the following statuses:

- **Draft** - Initial proposal under active development
- **Under Review** - Formal community review period
- **Accepted** - Approved for implementation
- **Implemented** - Changes merged into specification
- **Rejected** - Not accepted (with documented reasoning)
- **Deferred** - Postponed to future consideration
- **Superseded** - Replaced by another RFC

## Implemented RFCs

| Number | Title | Status | Author | Created |
|--------|-------|--------|--------|---------|
| 0001 | [Core PromptPack Schema](0001-core-schema.md) | Implemented | AltairaLabs | 2024-10-01 |
| 0002 | [YAML File Format](0002-yaml-format.md) | Implemented | AltairaLabs | 2024-10-05 |
| 0003 | [Template Variable System](0003-template-variables.md) | Implemented | AltairaLabs | 2024-10-10 |
| 0004 | [Multimodal Content Support](0004-multimodal-support.md) | Implemented | AltairaLabs | 2024-11-06 |
| 0005 | [Workflow Specification Extension](0005-workflow-extension.md) | Implemented | AltairaLabs | 2025-11-17 |
| 0006 | [Evals Extension](0006-evals-extension.md) | Implemented | AltairaLabs | 2026-02-14 |
| 0007 | [Agents Extension](0007-agents-extension.md) | Implemented | AltairaLabs | 2026-02-15 |
| 0008 | [Skills Extension](0008-skills-extension.md) | Implemented | AltairaLabs | 2026-02-21 |
| 0009 | [Agent Loop Extension](0009-agent-loops.md) | Implemented | AltairaLabs | 2026-03-26 |
| 0010 | [Workflow Composition Extension](0010-workflow-composition.md) | Implemented | Charlie Holland | 2026-04-28 |
| 0011 | [Workflow States as Agents](0011-workflow-states-as-agents.md) | Implemented | Charlie Holland | 2026-06-13 |
| 0012 | [Provider Requirements](0012-provider-requirements.md) | Implemented | Charlie Holland | 2026-06-25 |

## Active RFCs

| Number | Title | Status | Author | Created |
|--------|-------|--------|--------|---------|
| 0013 | [Governance Declarations](0013-governance-declarations.md) | Draft | Charlie Holland | 2026-08-28 |

## Process

See [RFC Process Documentation](../promptpack-docs/docs/processes/rfc-process.md) for complete details on:

- When to submit an RFC
- RFC lifecycle stages
- Review criteria
- Implementation process

## Quick Links

- [RFC Template](0000-template.md)
- [RFC Process Guide](../promptpack-docs/docs/processes/rfc-process.md)
- [RFC Index](../promptpack-docs/docs/processes/rfc-index.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Commenting on an RFC

Feedback on a published RFC goes in the **[RFC Comments](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/rfc-comments)** discussion category, not in this repository's issues. Each RFC page on [promptpack.org](https://promptpack.org/docs/rfcs/) links to its thread, or to a pre-filled one if nobody has started it yet.

An RFC that has a thread names it in its header:

```markdown
- **Discussion:** https://github.com/AltairaLabs/promptpack-spec/discussions/NN
```

To float an idea *before* writing an RFC, open a discussion in [Ideas](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/ideas). That is cheaper than a draft RFC and easier to abandon.
