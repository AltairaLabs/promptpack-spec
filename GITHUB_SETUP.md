# GitHub Repository Settings Configuration Guide

This document outlines the manual GitHub repository settings that need to be configured to complete the production-ready setup for the PromptPack specification repository.

## 📋 Repository Settings Checklist

### General Settings

**Repository Details:**
- **Description**: `A standardized JSON specification for packaging multiple AI prompts with shared tools, testing metadata, and safety guardrails into portable, reusable units`
- **Website**: `https://promptpack.org`
- **Topics**: `promptpack`, `ai`, `llm`, `prompts`, `specification`, `json-schema`, `conversational-ai`, `production-ai`, `packaging`, `deployment`

**Features to Enable:**
- ✅ **Issues** (for bug reports, feature requests, RFCs)
- ✅ **Discussions** (for community engagement)
- ❌ **Projects** (not needed initially)
- ❌ **Wiki** (documentation is handled via docs site)
- ✅ **Sponsorships** (optional - if wanting to accept donations)

### Pages Configuration

**Source:**
- **Branch**: `main`
- **Folder**: `/ (root)` (handled by GitHub Actions)
- **Custom domain**: `promptpack.org`
- **Enforce HTTPS**: ✅ Enabled
- **Build and deployment**: GitHub Actions

### Security & Analysis

**Private vulnerability reporting:** ✅ Enabled

**Dependabot alerts:** ✅ Enabled

**Dependabot security updates:** ✅ Enabled

**Dependabot version updates:** ✅ Enabled (create `.github/dependabot.yml`)

**Code scanning:** ✅ Enabled (CodeQL analysis)

### Branch Protection Rules

**Branch name pattern:** `main`

**Protection rules:**
- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - Required status checks: `deploy`, `build`
- ✅ **Restrict pushes that create files larger than 100 MB**
- ❌ **Allow force pushes** (disabled for security)
- ❌ **Allow deletions** (disabled for security)

### Collaborators and Teams

**Repository access:**
- **Admin**: Core maintainers (AltairaLabs team)
- **Maintain**: Trusted community maintainers (as needed)
- **Triage**: Community moderators (as needed)

### Notifications

**Email notifications:** Configure for:
- Issues and pull requests
- Security alerts
- Discussions (optional)

## 🔧 Additional Configuration Files

The following files have been created to support these settings:

### Dependabot Configuration
Location: `.github/dependabot.yml`
Purpose: Automated dependency updates for npm packages

### Discussion Templates
Location: `.github/DISCUSSION_TEMPLATE/`
- `ideas.yml` - For brainstorming and feature ideas
- `help.yml` - For questions and support
- `show-and-tell.yml` - For sharing community creations

### Issue Templates
Location: `.github/ISSUE_TEMPLATE/`
- `config.yml` - Issue template configuration
- `bug_report.md` - Bug report template
- `feature_request.md` - Feature request template  
- `rfc_proposal.md` - RFC proposal template

### Security Configuration
- `.well-known/security.txt` - Security contact information
- `SECURITY.md` - Security policy and vulnerability reporting

### SEO and Crawler Configuration
- `robots.txt` - Search engine crawler instructions
- `sitemap.xml` - Generated automatically by Docusaurus

## 🚀 Post-Setup Validation

After configuring the above settings, validate:

1. **GitHub Pages**: Visit `https://promptpack.org` to ensure the site loads
2. **Issue Templates**: Create a test issue to verify templates work
3. **Discussions**: Create a test discussion in each category
4. **Branch Protection**: Test that direct pushes to main are blocked
5. **Security Alerts**: Verify vulnerability reporting works
6. **Dependencies**: Check that Dependabot is monitoring dependencies

## 📊 Monitoring and Maintenance

**Regular Checks:**
- Review Dependabot security alerts weekly
- Monitor GitHub Pages deployment status
- Check community engagement in Issues and Discussions
- Review and triage new issues and RFCs monthly

**Metrics to Track:**
- Documentation site uptime and performance
- Community engagement (issues, discussions, PRs)
- Schema validation usage from versioned URLs
- Adoption metrics from ecosystem tools

---

**Next Steps:** Manual configuration of GitHub repository settings by repository admin.