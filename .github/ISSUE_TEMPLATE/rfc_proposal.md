---
name: 📋 RFC Proposal
about: Propose a formal RFC (Request for Comments) for significant changes to PromptPack
title: '[RFC] '
labels: ['rfc', 'proposal', 'needs-discussion']
assignees: []

---

## 📋 RFC Summary

**RFC Title**: [Clear, descriptive title]

**Status**: Proposal (Not yet accepted)

**Author(s)**: @[your-github-username]

## 🎯 Motivation

### Problem Statement

Clearly describe the problem this RFC aims to solve:

- What limitations exist in the current specification?
- What use cases are not well supported?
- What pain points do users experience?

### Goals

What are the specific goals this RFC aims to achieve?

- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### Non-Goals

What is explicitly out of scope for this RFC?

- Non-goal 1
- Non-goal 2

## 📖 Detailed Design

### Proposed Changes

Provide a detailed description of the proposed changes to the PromptPack specification:

```json
{
  "// Example of the proposed syntax/structure": {
    "newFeature": "example_value",
    "existingFeature": "modified_behavior"
  }
}
```

### Schema Changes

If this RFC requires changes to the JSON schema, describe them here:

- What new properties would be added?
- What existing properties would be modified?
- How would validation work?

### Backward Compatibility

How will this change affect existing PromptPacks?

- [ ] Fully backward compatible
- [ ] Requires migration
- [ ] Breaking change

If not fully backward compatible, describe the migration path.

## 🔄 Alternatives Considered

What other approaches were considered and why were they rejected?

1. **Alternative 1**: Description and why it was rejected
2. **Alternative 2**: Description and why it was rejected

## 📊 Impact Assessment

### Benefits

- Benefit 1: Description
- Benefit 2: Description

### Risks

- Risk 1: Description and mitigation
- Risk 2: Description and mitigation

### Ecosystem Impact

How will this affect:

- **Runtime implementations**: 
- **Existing PromptPacks**: 
- **Tooling**: 
- **Documentation**: 

## 🧪 Testing Strategy

How will this feature be tested and validated?

- Unit tests for schema validation
- Integration tests with sample PromptPacks
- Community feedback and validation

## 📚 Documentation Plan

What documentation needs to be created or updated?

- [ ] Specification updates
- [ ] Schema documentation
- [ ] Examples and tutorials
- [ ] Migration guide (if needed)

## ⏱️ Implementation Timeline

Proposed timeline for implementation:

- **Phase 1** (Week 1-2): Design finalization
- **Phase 2** (Week 3-4): Schema updates
- **Phase 3** (Week 5-6): Documentation
- **Phase 4** (Week 7-8): Community review and feedback

## 🤝 Community Input

Questions for the community:

1. Question 1?
2. Question 2?
3. Question 3?

---

### 📝 RFC Process Notes

**For maintainers and reviewers**

- [ ] RFC follows the established template
- [ ] Technical design is sound
- [ ] Backward compatibility considered
- [ ] Community input gathered
- [ ] Implementation plan is reasonable
- [ ] Documentation plan is complete

**Next Steps**: After community discussion, this RFC will be either accepted, rejected, or require revisions based on feedback.
