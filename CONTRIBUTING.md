# Contributing to EvoLog-AI 🤝

Hey there! Thanks for your interest in contributing to **EvoLog-AI** 🚀 We're excited to have you on board! This guide will help you get started with contributing to our project.

## 💡 How Can You Help?

There are many ways to contribute:

- **🐛 Report Bugs:** Found something broken? Let us know!
- **✨ Suggest Features:** Got ideas to make EvoLog-AI even better?
- **🔧 Fix Issues:** Want to dive into the code? Pick an issue and start coding!
- **📝 Improve Documentation:** Help make our docs clearer and more helpful
- **🧪 Add Tests:** Help us improve test coverage and reliability

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have:
- **Node.js** (v18 or higher)
- **VS Code** (for development)
- **Git** (of course!)
- **Ollama** (optional, for local AI testing)

### Setup Steps

1. **Fork the repository** and clone it locally:
```bash
git clone https://github.com/your-username/EvoLog-AI.git
cd EvoLog-AI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the extension:**
```bash
npm run compile
```

4. **Open in VS Code:**
```bash
code .
```

5. **Press `F5`** to run the extension in a new Extension Development Host window

## 🏗️ Project Structure

Here's how our code is organized:
```
src/
├── extension.ts          # Main extension file
├── test/
│   └── extension.test.ts # Tests for the extension
```

### Key Files to Know:
- **`src/extension.ts`** - Main extension logic with all the cool AI features
- **`package.json`** - Extension manifest and dependencies
- **`README.md`** - Project documentation and usage guide

## 🔧 Development Workflow

### Making Changes
1. **Find an issue** or create a new one describing what you want to work on
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** - code with passion! 🔥
4. **Run tests:** `npm test`
5. **Build the extension:** `npm run compile`
6. **Test locally** by pressing `F5` in VS Code

### Commit Guidelines
We love meaningful commit messages! Here's our preferred format:

```
type: short description

- Optional longer description
- Bullet points if needed
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

**Example:**
```
feat: add commit message validation

- Add validation for conventional commit format
- Improve error handling for missing git repo
- Update tests for new functionality
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Add tests in `src/test/extension.test.ts`
- Follow existing patterns for testing VS Code extensions
- Make sure tests are reliable and cover edge cases

## 📦 Building & Publishing

### Build for Development
```bash
npm run compile
```

### Build for Release
```bash
npm run compile
vsce package
```

### Publishing (Maintainers Only)
```bash
npm run publish-patch    # For bug fixes
npm run publish-minor    # For new features
npm run publish-major    # For breaking changes