---
title: "RFC Process"
sidebar:
  order: 1
---

The PromptPack specification evolves through a Request for Comments (RFC) process that allows community members to propose, discuss, and implement changes.

## Overview

The RFC process provides a structured way to:

- Propose new features and capabilities
- Modify existing specification behavior  
- Deprecate or remove functionality
- Document design decisions and rationale

## When to Submit an RFC

Which path a change takes depends on what it touches, not on how large the diff is.

**Submit an RFC when the change:**

- **Adds or removes an entity type** — prompts, tools, workflows, agents, skills, compositions, evals, and their peers
- **Introduces new runtime semantics** — anything a conforming runtime must newly *do*, including new validation or processing requirements
- **Changes, deprecates, or removes existing behavior**
- **Breaks backward compatibility** in any schema or behavior

**A normal issue or pull request is enough when the change:**

- Fixes documentation, typos, or examples
- Clarifies wording without changing meaning
- Adds an optional schema field that carries **no new runtime semantics** — annotation, description, or metadata a runtime may ignore

The third bullet on each side is where the line actually falls, and it is the one that catches people out. A single optional field still needs an RFC if a conforming runtime has to behave differently because of it. Diff size is not the test; new behavior is.

:::note[Worked example]
Adding an optional `control` property to workflow states looks like a one-field addition. But `control: agent` tells the runtime to run another agent round instead of yielding to the user — new turn-taking behavior a conforming runtime must implement. That needs an RFC. Adding an optional `description` to the same state would not.
:::

To float an idea *before* writing an RFC, open a thread in [Ideas](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/ideas). That is cheaper than a draft RFC and easier to abandon.

## RFC Lifecycle

### 1. Pre-RFC Discussion

Before writing a formal RFC, consider:

1. **Search existing issues** to see if your idea has been discussed
2. **Open a discussion issue** to gauge community interest  
3. **Prototype your idea** to validate feasibility
4. **Gather feedback** from other community members

### 2. RFC Submission

1. **Fork the repository** - `altairalabs/promptpack-spec`
2. **Copy the RFC template** from `rfcs/0000-template.md`
3. **Name your file** - `rfcs/0000-my-feature.md` (use next available number)
4. **Fill out the template** with detailed proposal information
5. **Submit a pull request** with your RFC

### 3. Community Review

- **Public discussion** happens in the pull request comments
- **Clarifications** and revisions are made based on feedback
- **Technical concerns** are addressed through discussion
- **Alternative approaches** may be suggested and evaluated

### 4. Decision Process

The specification maintainers will:

1. **Review technical merit** and alignment with project goals
2. **Consider implementation complexity** and maintenance burden  
3. **Evaluate community consensus** and feedback
4. **Make a final decision** to accept, reject, or defer

### 5. Implementation

For accepted RFCs:

1. **RFC is merged** and assigned a permanent number
2. **Implementation work** begins (may be done by RFC author or others)
3. **Specification updates** are made in separate pull requests
4. **Implementation is reviewed** and tested
5. **Changes are released** in the next version

## RFC Template

Each RFC should follow this structure:

```markdown
# RFC 0000: [Title]

- **Status:** Draft | Under Review | Accepted | Rejected | Implemented
- **Author(s):** [Your name and email]
- **Created:** [Date]
- **Updated:** [Date]

## Summary

[One paragraph explanation of the feature]

## Motivation

[Why are we doing this? What use cases does it support?]

## Detailed Design

[This is the bulk of the RFC. Explain the design in enough detail 
for someone to implement it.]

## Examples

[Provide concrete examples of how this would work]

## Drawbacks

[What are the drawbacks of this approach?]

## Alternatives

[What other approaches were considered?]

## Unresolved Questions

[What parts of the design are still TBD?]
```

## Review Criteria

RFCs are evaluated based on:

### Technical Quality
- **Correctness** - Does the proposal solve the stated problem?
- **Completeness** - Are all edge cases and interactions considered?
- **Clarity** - Is the specification unambiguous and implementable?

### Alignment  
- **Goals** - Does it align with PromptPack's mission and values?
- **Consistency** - Is it consistent with existing specification patterns?
- **Scope** - Is it appropriately scoped (not too narrow or broad)?

### Impact
- **Breaking changes** - What is the migration path for existing users?
- **Implementation cost** - How much work is required to implement?
- **Maintenance burden** - What ongoing maintenance is required?

### Community
- **Demand** - Is there clear community need for this feature?
- **Consensus** - Is there general agreement on the approach?
- **Feedback** - Has community feedback been addressed?

## Getting Help

- **Discussion Forum** - Use GitHub Discussions for questions
- **Office Hours** - Attend monthly community calls
- **Mentorship** - Request guidance from experienced contributors

## RFC Index

For a complete list of submitted and accepted RFCs, see the [RFC Index](/docs/rfcs).
