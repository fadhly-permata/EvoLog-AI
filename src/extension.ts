import * as vscode from 'vscode';
import * as http from 'node:http';

const OLLAMA_HOST = "http://localhost:11434";
const OLLAMA_MODEL = "mistral-large-3:675b-cloud";

const commitMsgTemplate = {
  language: "English",
  accent: "casual",
  docType: "markdown",
  rules: `
    - Start with conventional commit prefix (feat, fix, docs, style, refactor, test, perf, build, ci, chore, revert, security)
    - Focus only on the actual code changes
    - Be concise and direct
    - Avoid hallucinations or unrelated content
    - No unnecessary symbols or characters
    - Maximum 150 characters for the subject line
  `,
  examples: `
    - fix: login form validation error
    - docs: update API usage examples in README
    - style: format code with prettier
    - refactor: optimize calculateTotal function
    - test: add unit tests for userService
    - feat: implement user profile feature
    - perf: optimize database queries in report module
    - chore: update dependencies in package.json
  `,
  messages: `
    Follow the rules and examples to generate a commit message based on code changes.

    **Rules:**
    - Use {{language}} with {{accent}} tone
    - Write the message in {{docType}}
    {{rules}}

    **Examples:**
    {{examples}}

    **Code Changes:**
    {{gitChanges}}
  `
};

const outputChannel = vscode.window.createOutputChannel("EvoLog-AI");

export function activate(context: vscode.ExtensionContext) {
  outputChannel.appendLine('EvoLog-AI: Extension "evolog-ai" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('evolog-ai.helloWorld', () => {
      vscode.window.showInformationMessage('EvoLog-AI: Hello World!');
      outputChannel.appendLine('Hello World command executed.');
    }),

    vscode.commands.registerCommand('evolog-ai.generateCommitMessage', () =>
      handleGenerateCommitMessage(OLLAMA_HOST, OLLAMA_MODEL)
    )
  );
}

export function deactivate() {}

function commitMessageBuilder(gitChanges: string): string {
  return commitMsgTemplate.messages
    .replace("{{language}}", commitMsgTemplate.language)
    .replace("{{accent}}", commitMsgTemplate.accent)
    .replace("{{docType}}", commitMsgTemplate.docType)
    .replace("{{rules}}", commitMsgTemplate.rules)
    .replace("{{examples}}", commitMsgTemplate.examples)
    .replace("{{gitChanges}}", gitChanges);
}

async function callOllamaAPI(host: string, model: string, prompt: string): Promise<string> {
  const url = new URL('/api/generate', host);
  const postData = JSON.stringify({ model, prompt, stream: false });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 11434,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          response?.response
            ? resolve(response.response)
            : reject(new Error('EvoLog-AI: No response from Ollama'));
        } catch (err) { reject(err); }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getGitChanges() {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) throw new Error('Git extension not available');

    const api = gitExtension.getAPI(1);
    const repo = api.repositories[0];
    if (!repo) throw new Error('No git repository found');

    const [stagedDiff, unstagedDiff] = await Promise.all([
      repo.diff(true),
      repo.diff(false)
    ]);

    return {
      stagedChanges: stagedDiff || '',
      unstagedChanges: unstagedDiff || '',
      hasChanges: !!(stagedDiff?.length || unstagedDiff?.length)
    };
  } catch (err) {
    outputChannel.appendLine(`Failed to get git changes: ${err}`);
    return { stagedChanges: '', unstagedChanges: '', hasChanges: false };
  }
}

async function handleGenerateCommitMessage(host: string, model: string) {
  try {
    vscode.window.showInformationMessage('EvoLog-AI: Generating commit message...');
    outputChannel.appendLine('Starting commit message generation...');

    const { stagedChanges, unstagedChanges, hasChanges } = await getGitChanges();
    if (!hasChanges) {
      vscode.window.showWarningMessage('No changes detected.');
      return outputChannel.appendLine('No changes detected.');
    }

    const changes = stagedChanges || unstagedChanges;
    if (!changes.trim()) {
      vscode.window.showWarningMessage('No changes available to analyze.');
      return outputChannel.appendLine('No changes available to analyze.');
    }

    const message = await callOllamaAPI(host, model, commitMessageBuilder(changes));

    // langsung inline showCommitMessageResult
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const repo = gitExtension?.getAPI(1).repositories[0];
    let success = false;
    if (repo) {
      await vscode.commands.executeCommand('workbench.view.scm');
      await new Promise(r => setTimeout(r, 300));
      repo.inputBox.value = message;
      success = true;
    }

    const msg = success ? 'Commit message inserted!' : 'Failed to insert commit message.';
    vscode.window.showInformationMessage(msg);
    outputChannel.appendLine(`${msg} ${success ? message : ''}`);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to generate commit message: ${err}`);
    outputChannel.appendLine(`Error: ${err}`);
  }
}
