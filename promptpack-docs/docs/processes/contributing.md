---
sidebar_position: 4
---

# Contributing

How to contribute to the PromptPack specification and ecosystem.

## Welcome Contributors! 🎉

Thank you for your interest in contributing to PromptPack! This guide will help you get started with contributing to the specification, documentation, and surrounding ecosystem.

## Ways to Contribute

### 📝 Documentation

- **Fix Typos**: Small corrections are always welcome
- **Improve Examples**: Add better code examples and use cases
- **Write Tutorials**: Help others learn PromptPack
- **Translate Content**: Internationalization support

### 🔧 Specification

- **Propose RFCs**: Suggest new features or improvements
- **Review RFCs**: Provide feedback on proposed changes
- **Update Schemas**: Maintain JSON schemas and validation
- **Test Examples**: Ensure examples work correctly

### 🌟 Ecosystem

- **Build Tools**: Create PromptPack development tools
- **Write Integrations**: Connect PromptPack to other systems
- **Share Examples**: Real-world PromptPack implementations
- **Community Support**: Help others in discussions

## Getting Started

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/altairalabs/promptpack-spec.git
cd promptpack-spec

# Install documentation dependencies
cd promptpack-docs
npm install

# Start development server
npm start
```

### 2. Understand the Structure

```
promptpack-spec/
├── docs/                    # Specification documents
├── examples/               # Example PromptPack files
├── schemas/               # JSON schemas
├── promptpack-docs/       # Documentation website
└── tools/                 # Development utilities
```

### 3. Join the Community

- **GitHub Discussions**: Ask questions and share ideas
- **RFC Process**: Participate in specification decisions
- **Issue Tracker**: Find bugs to fix or features to implement

## Contribution Process

### For Documentation Changes

1. **Fork Repository**: Create your own copy
2. **Create Branch**: `git checkout -b docs/improve-examples`
3. **Make Changes**: Edit markdown files
4. **Test Locally**: Run `npm start` to preview
5. **Submit PR**: Create pull request with description

### For Specification Changes

1. **Start Discussion**: Open GitHub discussion about your idea
2. **Write RFC**: Use the RFC template for formal proposals
3. **Gather Feedback**: Iterate based on community input
4. **Implementation**: Code the approved changes
5. **Update Documentation**: Ensure docs reflect changes

### For Code Contributions

1. **Check Issues**: Look for `good first issue` labels
2. **Claim Issue**: Comment that you're working on it
3. **Follow Standards**: Match existing code style
4. **Add Tests**: Include test coverage
5. **Update Docs**: Document new features

## Code Standards

### Documentation

- **Markdown**: Use standard markdown formatting
- **Links**: Prefer relative links for internal content
- **Examples**: Include working code examples
- **Structure**: Follow existing page organization

### YAML Examples

```yaml
# Good: Clear, complete, realistic
apiVersion: v1
kind: PromptPack
metadata:
  name: customer-support
  version: 1.0.0
  description: Customer support automation system
spec:
  prompts:
    - name: greeting
      template: "Hello {{customer_name}}, how can I help you?"
      variables:
        - name: customer_name
          type: string
          required: true
```

### Code Style

- **Formatting**: Use Prettier for consistent formatting
- **Naming**: Use descriptive, kebab-case names
- **Comments**: Explain complex logic and decisions
- **Testing**: Write comprehensive test cases

## Review Process

### What We Look For

- **Correctness**: Changes are technically sound
- **Clarity**: Documentation is easy to understand
- **Completeness**: Examples work and are well-documented
- **Compatibility**: Changes don't break existing usage
- **Tests**: Appropriate test coverage included

### Review Timeline

- **Documentation**: Usually reviewed within 3 days
- **Minor Changes**: Reviewed within 1 week
- **Major Changes**: May take 2-3 weeks for thorough review
- **RFCs**: Timeline varies based on complexity

### Feedback Process

1. **Initial Review**: Maintainers provide first feedback
2. **Iteration**: Address feedback and update PR
3. **Approval**: Get approval from required reviewers
4. **Merge**: Changes are merged to main branch
5. **Release**: Included in next version release

## Recognition

### Contributor Credits

- **Documentation**: Listed in contributor section
- **Code**: Git history and release notes
- **RFCs**: Author attribution on accepted proposals
- **Community**: Recognition in community discussions

### Maintainer Path

Active contributors may be invited to become maintainers with:
- **Commit Access**: Direct repository access
- **RFC Approval**: Vote on specification changes
- **Release Management**: Help with version releases
- **Community Leadership**: Guide project direction

## Resources

### Documentation

- [RFC Process](/docs/processes/rfc-process) - How to propose changes
- [Governance](/docs/processes/governance) - Project governance model
- [Schema Reference](/docs/spec/schema-reference) - Complete field reference

### Development Tools

- [JSON Schema Validator](https://github.com/ajv-validator/ajv)
- [YAML Linter](https://yamllint.readthedocs.io/)
- [Markdown Linter](https://github.com/markdownlint/markdownlint)
- [Prettier](https://prettier.io/) - Code formatting

### Community

- [GitHub Discussions](https://github.com/altairalabs/promptpack-spec/discussions)
- [Issue Tracker](https://github.com/altairalabs/promptpack-spec/issues)
- [Pull Requests](https://github.com/altairalabs/promptpack-spec/pulls)

## Questions?

Don't hesitate to ask! We're here to help:

1. **Start Small**: Look for `good first issue` labels
2. **Ask Questions**: Use GitHub discussions for help
3. **Join Community**: Connect with other contributors
4. **Be Patient**: Good contributions take time

Thank you for helping make PromptPack better! 🚀
