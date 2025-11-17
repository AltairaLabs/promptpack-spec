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

## Active RFCs

| Number | Title | Status | Author | Created |
|--------|-------|--------|--------|---------|
| 0005 | [Workflow Specification Extension](0005-workflow-extension.md) | Draft | AltairaLabs | 2025-11-17 |

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

## GitHub Issue Templates

For convenience, you can also use the GitHub issue templates to start RFC discussions:

- [RFC Proposal Issue Template](../.github/ISSUE_TEMPLATE/rfc-proposal.md)
- [Detailed RFC Issue Template](../.github/ISSUE_TEMPLATE/rfc_proposal.md)

These templates help gather initial feedback before creating a formal RFC file.
