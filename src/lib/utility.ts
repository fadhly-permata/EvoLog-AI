import * as vscode from 'vscode';
import * as http from 'node:http';

export const DEFAULT_OLLAMA_HOST = "http://localhost:11434";
export const DEFAULT_OLLAMA_MODEL = "mistral-large-3:675b-cloud";

export const outputChannel = vscode.window.createOutputChannel("EvoLog-AI");

export const commitMsgTemplate = {
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

export function commitMessageBuilder(gitChanges: string): string {
	return commitMsgTemplate.messages
		.replace("{{language}}", commitMsgTemplate.language)
		.replace("{{accent}}", commitMsgTemplate.accent)
		.replace("{{docType}}", commitMsgTemplate.docType)
		.replace("{{rules}}", commitMsgTemplate.rules)
		.replace("{{examples}}", commitMsgTemplate.examples)
		.replace("{{gitChanges}}", gitChanges);
}

export async function callOllamaAPI(host: string, model: string, prompt: string): Promise<string> {
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
					response?.response ? resolve(response.response) : reject(new Error('EvoLog-AI: No response from Ollama'));
				} catch (err) { reject(err); }
			});
		});

		req.on('error', reject);
		req.write(postData);
		req.end();
	});
}

export async function getGitChanges() {
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

export async function handleGenerateCommitMessage() {
	try {
		const config = vscode.workspace.getConfiguration('evolog-ai');
		const host = config.get<string>('ollamaHost') || DEFAULT_OLLAMA_HOST;
		const model = config.get<string>('ollamaModel') || DEFAULT_OLLAMA_MODEL;

		vscode.window.showInformationMessage('EvoLog-AI: Generating commit message...');
		outputChannel.appendLine('Starting commit message generation...');

		let { stagedChanges, unstagedChanges, hasChanges } = await getGitChanges();
		if (!hasChanges) {
			vscode.window.showWarningMessage('No changes detected.');
			return outputChannel.appendLine('No changes detected.');
		}

		let changes = stagedChanges;

		if (!changes) {
			const choice = await vscode.window.showInformationMessage(
				'No files are staged. What would you like to do?',
				'Stage All & Generate',
				'Read Unstaged',
				'Cancel'
			);

			if (choice === 'Stage All & Generate') {
				const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
				const repo = gitExtension?.getAPI(1).repositories[0];
				if (repo) {
					await vscode.commands.executeCommand('git.stageAll');
					// Re-fetch staged changes after staging all
					const stagedDiff = await repo.diff(true);
					changes = stagedDiff || '';
				}
			} else if (choice === 'Read Unstaged') {
				changes = unstagedChanges;
			} else {
				return outputChannel.appendLine('Operation cancelled by user.');
			}
		}

		if (!changes || !/\S/.test(changes)) {
			const warningMsg = 'No changes available to analyze.';
			vscode.window.showWarningMessage(warningMsg);
			outputChannel.appendLine(warningMsg);
			return;
		}

		const message = await callOllamaAPI(host, model, commitMessageBuilder(changes));

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
