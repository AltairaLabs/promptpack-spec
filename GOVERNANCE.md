# PromptPack Governance

This document describes the governance model for the PromptPack specification and ecosystem.

## 🎯 Mission and Values

**Mission**: To create and maintain an open, vendor-neutral specification for packaging, testing, and running multi-prompt conversational systems.

**Values**:
- **Openness**: Transparent decision-making and inclusive participation  
- **Interoperability**: Enable seamless integration across platforms and tools
- **Quality**: Maintain high standards for specification clarity and completeness
- **Community**: Foster a welcoming, diverse, and collaborative community
- **Innovation**: Support experimentation while ensuring stability

## 🏗️ Governance Structure

### Core Maintainers

**Role**: Provide overall project leadership and technical direction

**Responsibilities**:
- Set strategic direction for PromptPack specification
- Make final decisions on contentious issues
- Manage releases and versioning
- Oversee community health and code of conduct enforcement
- Coordinate with external organizations (CNCF, standards bodies)

**Current Core Maintainers**:
- **AltairaLabs Team** (@altairalabs/core-maintainers)
  - Primary contact: [conduct@altairalabs.ai](mailto:conduct@altairalabs.ai)

### Spec Editors

**Role**: Maintain technical quality and consistency of the specification

**Responsibilities**:
- Review and approve RFC proposals
- Ensure specification clarity and completeness
- Maintain JSON schema and validation rules
- Coordinate breaking changes and migration guides
- Provide technical expertise in specification discussions

**Current Spec Editors**:
- **AltairaLabs Spec Team** (@altairalabs/spec-editors)

### Contributors

**Role**: Community members who contribute to the project

**Recognition**:
- All contributors are listed in project documentation
- Significant contributors may be invited to become maintainers
- Recognition in release notes and community updates

**Path to Maintainership**:
1. Consistent high-quality contributions over 6+ months
2. Demonstrated understanding of PromptPack principles
3. Positive community interactions and mentoring
4. Invitation by existing core maintainers (consensus required)

## 📋 Decision Making Process

### RFC (Request for Comments) Process

Not every specification change needs an RFC. Which path a change takes depends
on what it touches, not on how large the diff is.

**An RFC is required when the change:**

- **Adds or removes an entity type** — prompts, tools, workflows, agents,
  skills, compositions, evals, and their peers
- **Introduces new runtime semantics** — anything a conforming runtime must
  newly *do*, including new validation or processing requirements
- **Changes, deprecates, or removes existing behavior**
- **Breaks backward compatibility** in any schema or behavior

**A normal issue or pull request is enough when the change:**

- Fixes documentation, typos, or examples
- Clarifies wording without changing meaning
- Adds an optional schema field that carries **no new runtime semantics** —
  annotation, description, or metadata a runtime may ignore

The third bullet on each side is where the line actually falls, and it is the
one that catches people out. A single optional field still needs an RFC if a
conforming runtime has to behave differently because of it. Diff size is not
the test; new behavior is.

When in doubt, open a thread in
[Ideas](https://github.com/AltairaLabs/promptpack-spec/discussions/categories/ideas)
first. That is cheaper than a draft RFC and easier to abandon.

**RFC stages**:

1. **Discussion**: Initial idea discussion in GitHub Discussions
2. **Draft RFC**: Create RFC using the template
3. **Community Review**: 2-week minimum review period
4. **Spec Editor Review**: Technical review and feedback
5. **Core Maintainer Approval**: Final decision by core maintainers
6. **Implementation**: Update specification and schema

**Approval bar**: the scrutiny an RFC needs scales with its impact. These
categories describe *approval*, and are independent of the
[SemVer](https://promptpack.org/docs/processes/versioning) bump the change
eventually ships in — a Minor RFC can land in a MINOR release, but a
deprecation approved at the Minor bar still removes the field in the next
MAJOR.

- **Major**: Breaking changes, new major features (requires broad consensus)
- **Minor**: New non-breaking features (requires spec editor approval)  
- **Patch**: Bug fixes, clarifications (can be fast-tracked)

### Voting and Consensus

**Consensus Model**: We strive for consensus but use voting when necessary

**Voting Rights**:
- Core Maintainers: Binding votes on all decisions
- Spec Editors: Binding votes on technical/specification matters
- Contributors: Advisory votes and input

**Quorum**: Majority of active core maintainers must participate

**Tie-breaking**: Project lead (AltairaLabs) has final decision authority

## 🚀 Release Process

### Versioning

PromptPack follows semantic versioning (SemVer):
- **Major (X.0.0)**: Breaking changes requiring migration
- **Minor (X.Y.0)**: New features, backwards compatible
- **Patch (X.Y.Z)**: Bug fixes, clarifications

### Release Cadence

- **Major Releases**: Annual or bi-annual (based on significant changes)
- **Minor Releases**: Quarterly (based on accumulated features)
- **Patch Releases**: As needed for critical fixes

### Release Approval

- **Patch**: Spec editors can approve
- **Minor**: Requires core maintainer consensus  
- **Major**: Requires broad community review + core maintainer consensus

## 👥 Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General discussion, questions, ideas
- **Email**: [conduct@altairalabs.ai](mailto:conduct@altairalabs.ai) for governance matters
- **Security**: [security@altairalabs.ai](mailto:security@altairalabs.ai) for security issues

### Participation Guidelines

- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Be respectful and inclusive in all interactions
- Provide constructive feedback and criticism
- Help newcomers get involved
- Focus on what's best for the community and specification

### Conflict Resolution

1. **Direct Discussion**: Encourage direct communication between parties
2. **Community Input**: Seek broader community perspective
3. **Maintainer Mediation**: Core maintainers help resolve disputes
4. **Code of Conduct**: Enforcement for violations
5. **Final Decision**: Core maintainers make final decisions if needed

## 🔄 Governance Evolution

This governance model may evolve as the project grows:

### Future Considerations
- **Advisory Board**: Industry representatives providing guidance
- **Working Groups**: Specialized groups for specific areas (security, tooling, etc.)
- **Foundation Transition**: Potential transition to CNCF or similar foundation
- **Expanded Leadership**: More maintainers as community grows

### Amendment Process
1. Proposal via RFC process
2. Community discussion period (4 weeks minimum)
3. Core maintainer consensus required
4. Update governance documentation

## 📊 Transparency and Accountability

### Regular Updates
- **Monthly**: Project status updates
- **Quarterly**: Governance review and community metrics
- **Annually**: Retrospective and planning for next year

### Public Information
- All RFC discussions and decisions
- Maintainer meeting notes (when applicable)
- Community metrics and health indicators
- Financial information (if applicable)

### Feedback Mechanisms
- Regular community surveys
- Open office hours with maintainers
- Anonymous feedback channels
- Exit interviews for departing maintainers

## 🔗 External Relations

### Standards Bodies
- Monitor relevant standards development (OpenAPI, JSON Schema, etc.)
- Participate in industry working groups
- Ensure alignment with ecosystem trends

### CNCF and Foundations
- Explore foundation adoption as project matures
- Align with CNCF principles and best practices
- Consider sandbox/incubation pathways

---

## Questions or Feedback?

For questions about governance or to provide feedback:
- Create a discussion in [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- Email the community team: [conduct@altairalabs.ai](mailto:conduct@altairalabs.ai)
- Join our community meetings (schedule posted in discussions)

**Last Updated**: October 2024