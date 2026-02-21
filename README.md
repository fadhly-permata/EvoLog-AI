# EvoLog-AI 🚀

**EvoLog-AI** is your AI-powered VS Code extension that turbocharges your development workflow using **Ollama**. It automatically generates professional commit messages so you can focus on coding. 🤖

## ✨ Features

### 🤖 Generate Commit Messages with AI
*   **Smart Commit Crafting:** Generate meaningful commit messages using Ollama AI instead of writing them manually ✍️
*   **Conventional Commits:** AI automatically categorizes commits using standard prefixes (feat, fix, docs, etc.) 🏷️
*   **Context-Aware:** Analyzes your actual code changes (staged or unstaged) to create relevant messages 🔍
*   **Local Processing:** All AI processing happens locally on your machine for maximum privacy 🛡️

### 📄 Generate Changelogs (Coming Soon)
*   **Automated Changelog Generation:** AI will analyze your commit history to create comprehensive changelogs 📊
*   **Smart Categorization:** Auto-detects changes such as Added, Refactored, Modified, Deleted, and more 📈

## 🚀 Quick Start

1.  **Install Ollama:** Get [Ollama](https://ollama.ai) running on your machine 💻
2.  **Setup Model:** Run `ollama run mistral-large-3:675b-cloud` (or your preferred model) 🤖
3.  **Open Project:** Open your Git repository in VS Code 📂
4.  **Generate Commit Messages:** Click the lightbulb icon in the Source Control view title bar and select **Generate Commit Message** 💬

## ⚙️ Configuration

You can configure the extension in VS Code settings (`Settings > Extensions > EvoLog-AI`):

*   `evolog-ai.ollamaHost`: Set the Ollama API endpoint (default: `http://localhost:11434`) 🌐
*   `evolog-ai.ollamaModel`: Choose your preferred AI model (default: `mistral-large-3:675b-cloud`) 🧠
*   `evolog-ai.enabled`: Enable or disable the extension (default: `true`) ✅

## 📖 How to Use

### For Commit Messages:
1.  Open the **Source Control** view (`Ctrl+Shift+G`) 📁
2.  (Optional) Stage the changes you want to include. If no changes are staged, EvoLog will analyze unstaged changes.
3.  Click the **EvoLog-AI** (lightbulb) icon in the Source Control title bar.
4.  Select **EvoLog-AI: Generate Commit Message** 🤖
5.  Review the generated message in the commit input box and commit ✅

### Settings Sidebar:
EvoLog-AI provides a convenient settings view directly in the Source Control sidebar where you can quickly:
*   View and edit the current Ollama Host.
*   Switch between different AI models.

## 🔒 Privacy

EvoLog-AI is privacy-focused. All AI processing happens locally using Ollama—your code never leaves your machine. 🛡️

---

**Built with ❤️ for developers who want to spend more time coding and less time writing docs.** 🎉

## 🛠 Development

### Build & Test
- Install dependencies: `npm install`
- Compile TypeScript: `npm run compile`
- Run tests: `npm test`

### Contributing
Contributions are welcome! Please see [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

## 📦 Implementation Details

- Default Ollama host is defined in [`src/lib/utility.ts:4`](src/lib/utility.ts:4) as `http://localhost:11434`.
- Default model is defined in [`src/lib/utility.ts:5`](src/lib/utility.ts:5) as `mistral-large-3:675b-cloud`.
- Commit message generation uses [`handleGenerateCommitMessage`](src/lib/utility.ts:110) which gathers git changes via the VS Code Git extension.
- Settings UI is provided by [`EvoLogAISettingsProvider`](src/lib/view.ts:4) and registered in [`src/extension.ts:9`](src/extension.ts:9).