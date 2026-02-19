# EvoLog AI 🚀

**EvoLog AI** is your AI-powered VS Code extension that turbocharges your development workflow using **Ollama**. It automatically generates commit messages and changelogs so you can focus on coding. 🤖

## ✨ Features

### 🤖 Generate Commit Messages with AI
*   **Smart Commit Crafting:** Generate meaningful commit messages using Ollama AI instead of writing them manually ✍️
*   **Intelligent Categorization:** AI automatically categorizes commits (like feat, fix, chore, docs, etc.) 🏷️
*   **Context-Aware:** Uses your actual code changes to create relevant commit messages 🔍

### 📄 Generate Changelogs from Git History
*   **Automated Changelog Generation:** AI analyzes your entire commit history to create comprehensive changelogs 📊
*   **Smart Categorization:** Auto-detects changes such as Added, Refactored, Modified, Deleted, and more 📈
*   **Incremental Updates:** Adds new entries without disrupting your existing changelog format 🔄

### 🎨 Customizable Templates
*   **Flexible Templates:** Choose from popular formats or create custom templates for both commit messages and changelogs 🎯

### ⚡ Smart Versioning and Updates
*   **Smart Versioning:** Suggests semantic version bumps (Major, Minor, Patch) based on change impact 📦
*   **Duplicate Protection:** Prevents logging the same commit twice across releases 🛡️

## 🚀 Quick Start

1.  **Install Ollama:** Get [Ollama](https://ollama.ai) running on your machine 💻
2.  **Setup Model:** Run `ollama run llama3` (or your preferred model) 🤖
3.  **Open Project:** Open your Git repository in VS Code 📂
4.  **Generate Commit Messages:** Stage your changes and use EvoLog to generate a commit message 💬
5.  **Generate Changelogs:** Select commits from source control and let EvoLog create your changelog 📝

## ⚙️ Configuration

You can configure the extension in VS Code settings (`Settings > Extensions > EvoLog AI`):

*   `evolog.ollamaHost`: Set the Ollama API endpoint (default: `http://localhost:11434`) 🌐
*   `evolog.ollamaModel`: Choose your preferred AI model (default: `llama3`) 🧠
*   `evolog.commitTemplate`: Customize the commit message template (default: `conventional`) 💬
*   `evolog.changelogTemplate`: Customize the changelog format (default: `keep-a-changelog`) 📄
*   `evolog.smartCategorization`: Enable/disable AI-powered categorization (default: `true`) 🧠

## 📖 How to Use

### For Commit Messages:
1.  Stage your changes in the Source Control view 📁
2.  Right-click and select "Generate Commit Message with AI" 🤖
3.  Review the generated message and commit ✅

### For Changelogs:
1.  Open the EvoLog sidebar and select the commits you want to include 🔍
2.  Click the generate button to create the changelog 🎯
3.  Save the result to your `CHANGELOG.md` file 💾

## 🔒 Privacy

EvoLog AI is privacy-focused. All AI processing happens locally using Ollama—your code never leaves your machine. 🛡️

---

**Built with ❤️ for developers who want to spend more time coding and less time writing docs.** 🎉