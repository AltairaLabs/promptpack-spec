# Security Policy

## Supported Versions

The PromptPack specification follows semantic versioning. Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes            |
| < 1.0   | ❌ No (Development only) |

## Reporting a Vulnerability

We take the security of PromptPack seriously. If you discover a security vulnerability, please report it responsibly.

### 🔒 For Security Issues

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

Instead, please report security issues by emailing:
**[security@altairalabs.com](mailto:security@altairalabs.com)**

### 📋 What to Include

When reporting a security vulnerability, please include:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact and affected components
3. **Reproduction**: Step-by-step instructions to reproduce
4. **Environment**: Relevant system/environment details
5. **Mitigation**: Any temporary workarounds you've identified

### 🕐 Response Timeline

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 5 business days
- **Progress Updates**: Every 10 business days until resolved
- **Resolution**: Depends on severity and complexity

### 🔍 Vulnerability Types

We are particularly interested in vulnerabilities related to:

- **Schema Validation Bypass**: Issues that allow invalid PromptPack files to pass validation
- **Injection Attacks**: Template injection or code execution vulnerabilities
- **Data Exposure**: Unintended exposure of sensitive information
- **Denial of Service**: Issues that could cause excessive resource consumption
- **Supply Chain**: Vulnerabilities in dependencies or build process

### 🏆 Recognition

We believe in recognizing security researchers who help improve PromptPack security:

- **Public Thanks**: Recognition in security advisories (if desired)
- **Hall of Fame**: Listed in our security contributors page
- **Responsible Disclosure**: Coordinated disclosure timeline

### 📊 Scope

This security policy covers:

- ✅ **PromptPack Specification**: Core specification documents and schema
- ✅ **Reference Implementation**: PromptKit runtime and related tools
- ✅ **Documentation Site**: promptpack.org and associated infrastructure
- ✅ **Build/Release Process**: CI/CD pipelines and automation

Out of scope:
- ❌ Third-party implementations (please report to respective maintainers)
- ❌ General web vulnerabilities in external services
- ❌ Issues requiring physical access to systems

### 🛡️ Security Best Practices

When implementing PromptPack:

#### For Developers
- **Validate Input**: Always validate PromptPack files against the official schema
- **Sanitize Templates**: Properly escape template variables to prevent injection
- **Limit Resources**: Implement appropriate timeouts and resource limits
- **Update Dependencies**: Keep PromptPack libraries and tools up to date

#### For Organizations
- **Access Control**: Limit who can modify PromptPack files in production
- **Code Review**: Review all PromptPack files and templates before deployment  
- **Monitoring**: Monitor for unusual behavior in PromptPack-powered applications
- **Incident Response**: Have a plan for responding to security incidents

### 📚 Resources

- **Security Advisories**: [GitHub Security Advisories](https://github.com/altairalabs/promptpack-spec/security/advisories)
- **CVE Database**: We participate in CVE assignment for confirmed vulnerabilities
- **Security Guide**: See documentation for implementation security guidelines

### 🤝 Safe Harbor

We support security research conducted:
- In good faith to improve PromptPack security
- Without violating privacy or disrupting services
- With responsible disclosure practices
- In compliance with applicable laws

Researchers acting in good faith will not face legal action for:
- Security testing of PromptPack implementations
- Responsible disclosure of vulnerabilities
- Reasonable attempts to contact our security team

---

**Thank you for helping keep PromptPack and our community safe!**

For non-security issues, please use our [standard issue reporting process](https://github.com/altairalabs/promptpack-spec/issues).