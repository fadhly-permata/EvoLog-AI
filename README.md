# EvoLog AI 🚀

**EvoLog AI** is a game-changing VS Code extension that uses local AI power via **Ollama** to automate professional changelog creation. Say goodbye to manual writing—let AI analyze your Git history and craft meaningful release notes in seconds.

[![Version](https://img.shields.io/visual-studio-marketplace/v/yourpublisher.evolog-ai.svg)](https://marketplace.visualstudio.com/items?itemName=yourpublisher.evolog-ai)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/yourpublisher.evolog-ai.svg)](https://marketplace.visualstudio.com/items?itemName=yourpublisher.evolog-ai)
[![License](https://img.shields.io/github/license/yourusername/evolog-ai.svg)](LICENSE)

## ✨ Next-Level Features

### 🤖 Supercharged AI Analysis
*   **Local Ollama Magic:** Runs AI models locally (Llama 3, Mistral, Phi-3) so your code stays private
*   **Smart Message Analysis:** AI actually understands what you built—not just copying commit messages
*   **Model Swapping:** Switch between your favorite AI models on the fly for better results

### 🎨 Ultimate Customization
*   **Template Gallery:** Choose from popular formats like Keep a Changelog, Conventional Commits, or custom templates
*   **Flexible Sections:** Add your own categories—Security, Performance, Breaking Changes, you name it!
*   **Multi-format Exports:** Get changelogs in Markdown, JSON, YAML, HTML, PDF, or DOCX
*   **i18n Ready:** Generate changelogs in different languages

### ⚡ Smart Automation
*   **Git Hook Integration:** Auto-generate on commit/push hooks
*   **CI/CD Ready:** Comes with GitHub Actions and GitLab CI templates out of the box
*   **Package.json Sync:** Automatically updates versions in your package.json
*   **Release Drafter:** Auto-drafts GitHub releases from your changelog

### 🔍 Intelligent Processing
*   **Smart Categorization:** Auto-detect features, fixes, docs, performance, and breaking changes
*   **Commit Grouping:** Organize by feature, component, or branch
*   **Contributor Spotlight:** Automatically recognize and credit your team
*   **Dependency Tracking:** Highlight important dependency updates

### 📊 Visual Goodness
*   **Live Preview:** See exactly what you'll get before saving
*   **Diff Highlighting:** Visual comparison with previous versions
*   **Timeline View:** Pretty graphical timeline of your releases
*   **Export Wizard:** Easy multi-format exports

## 🔄 Automatic Version Updates
*   **Smart Versioning:** AI suggests version bumps (Major, Minor, Patch) based on your changes
*   **Incremental Updates:** Adds new entries without messing up your existing format
*   **Duplicate Protection:** Never log the same commit twice

## 🛠️ Flexible Commit Management
*   **Commit Picker:** Choose exactly which commits go into each release
*   **Git Native:** Seamless integration with VS Code's Git features

## 🚀 Quick Start (Seriously, It's Fast)

1.  **Install Ollama:** Get [Ollama](https://ollama.ai) on your machine
2.  **Grab a Model:** Run `ollama run llama3` (or whatever model you prefer)
3.  **Open Project:** Open your Git repo in VS Code
4.  **Go!:** Click the EvoLog icon, pick commits, hit **Generate**

## ⚙️ Configuration (Make It Yours)

Tweak everything in `Settings > Extensions > EvoLog AI`:

| Setting | What it does | Default |
|:---|:---|:---|
| `evolog.ollamaHost` | Ollama API endpoint | `http://localhost:11434` |
| `evolog.ollamaModel` | Your preferred AI model | `llama3` |
| `evolog.writePosition` | Where new entries go (`start`/`end`) | `start` |
| `evolog.versionType` | Version strategy (`patch`/`smart`) | `smart` |
| `evolog.templateType` | Changelog format style | `keep-a-changelog` |
| `evolog.autoGenerate` | Auto-gen on git hooks | `false` |
| `evolog.exportFormats` | Available export formats | `["md", "json"]` |

## 📖 How to Use (It's Simple)

1.  **Pick Your Commits:** Check which commits you want in the EvoLog sidebar
2.  **Generate Magic:** Click generate—AI works its magic on your commit history
3.  **Preview & Polish:** Edit the live preview until it's perfect
4.  **Save & Share:** Save to CHANGELOG.md and export to other formats

## 🛡️ Privacy & Security (Your Code Stays Yours)

EvoLog AI takes privacy seriously. Since we use **Ollama**, all your commit data is processed **100% locally** on your machine. No code snippets or commit messages ever leave your computer.

---

**Built with ❤️ for developers who want to spend more time coding and less time writing docs.**

*Love this extension? Give it a ⭐ on the Marketplace and share it with your team!*