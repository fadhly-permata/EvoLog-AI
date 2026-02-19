# Security Policy

## Supported Versions

We take security seriously and maintain the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in EvoLog-AI, please follow these guidelines:

### 🔒 Privacy Commitment
- **Local Processing**: All AI processing happens locally using Ollama - your code never leaves your machine
- **No Data Collection**: We don't collect or transmit any user code, git history, or personal information
- **Git Integration**: Only accesses your local git repository for generating commit messages and changelogs

### 🚨 Security Best Practices
1. **Keep Ollama Updated**: Ensure your local Ollama installation is up-to-date
2. **Monitor AI Models**: Only use trusted models from official sources
3. **Review Generated Content**: Always review AI-generated commit messages before committing

### 📧 How to Report
Email us at: [security@evolog-ai.dev]

Please include:
- Detailed description of the vulnerability
- Steps to reproduce
- Affected version number
- Any potential fixes you've identified

### ⏱️ Response Time
- We aim to acknowledge reports within 48 hours
- Critical vulnerabilities will be addressed within 7 days
- Regular updates will be provided throughout the resolution process

## Security Features

### Built-in Protections
- **Local-Only Processing**: No external API calls except to your local Ollama instance
- **Git Scope Limitation**: Only reads staged/unstaged changes for commit message generation
- **No Persistence**: Doesn't store or cache your code changes

### Configuration Security
- All extension settings are stored locally in VS Code
- No sensitive information is logged or transmitted
- Optional configuration allows you to customize Ollama host and model

## Development Security

### Code Review
- All code changes undergo review before merging
- Security considerations are part of our development process
- Regular dependency updates to address security vulnerabilities

### Dependencies
We maintain security through:
- Regular dependency audits using `npm audit`
- Prompt updates for security-related patches
- Transparent dependency management

## Security Updates

Security updates will be released as:
- **Patch versions** (0.0.x) for critical security fixes
- **Minor versions** for important security improvements
- **Major versions** for significant security enhancements

Stay updated by watching the repository or checking our releases page.

---

**Remember**: EvoLog-AI is designed with privacy and security in mind. Your code stays on your machine, and you remain in control of your AI interactions. 🛡️