## Description

Brief description of changes made in this PR.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] RFC implementation
- [ ] Spec change or clarification

## RFC implementation checklist

Complete this section if this PR marks an RFC as **Implemented** or **Accepted**, OR if it changes the schema's `version` field. Skip otherwise.

- [ ] All schema fields described by the RFC are present in `schema/promptpack.schema.json`
- [ ] `schema/promptpack.schema.json` `version` is bumped to match the release that includes this RFC
- [ ] README badge `Spec-vX.Y.Z-blue` matches the schema version
- [ ] README has a `## <Feature> *(vX.Y)*` section describing the new fields with an example
- [ ] Versioned schema URL in README (`https://promptpack.org/schema/vX.Y.Z/...`) matches the new version
- [ ] RFC document's `Status:` field reflects reality (`Implemented` only when schema **and** runtime support is in)

> **Why this exists:** RFC-0009 was marked Implemented in PR #38 because the runtime supported it, but the schema fields weren't added. The badge and per-feature markers drifted from the schema state. This checklist closes that gap.

## Related Issues

Closes #(issue number)
Relates to #(issue number)

## Testing

- [ ] I have tested these changes locally
- [ ] Documentation builds successfully (`npm run build`)
- [ ] All links are working correctly
- [ ] Changes are compatible with the PromptPack specification

## Documentation

- [ ] I have updated relevant documentation
- [ ] I have added examples where appropriate
- [ ] I have updated the changelog (if applicable)

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own changes
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] Any dependent changes have been merged and published

## Additional Notes

Any additional information, context, or screenshots that reviewers should know about.