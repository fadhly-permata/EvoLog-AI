import * as vscode from 'vscode';
import * as http from 'node:http';

const DEFAULT_OLLAMA_HOST = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "mistral-large-3:675b-cloud";

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

class EvoLogAISettingsProvider implements vscode.TreeDataProvider<EvoLogAISettingsItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<EvoLogAISettingsItem | undefined | null | void> = new vscode.EventEmitter<EvoLogAISettingsItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<EvoLogAISettingsItem | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: EvoLogAISettingsItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: EvoLogAISettingsItem): Promise<EvoLogAISettingsItem[]> {
		if (element) {
			return [];
		}

		const config = vscode.workspace.getConfiguration('evolog-ai');
		const host = config.get<string>('ollamaHost') || DEFAULT_OLLAMA_HOST;
		const model = config.get<string>('ollamaModel') || DEFAULT_OLLAMA_MODEL;

		return [
			new EvoLogAISettingsItem(
				`Host: ${host}`,
				'ollama-host',
				vscode.TreeItemCollapsibleState.None,
				{
					command: 'evolog-ai.editHost',
					title: 'Edit Host',
					arguments: []
				}
			),
			new EvoLogAISettingsItem(
				`Model: ${model}`,
				'ollama-model',
				vscode.TreeItemCollapsibleState.None,
				{
					command: 'evolog-ai.editModel',
					title: 'Edit Model',
					arguments: []
				}
			)
		];
	}
}

class EvoLogAISettingsItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.tooltip = this.label;
		this.contextValue = type;
	}
}

export function activate(context: vscode.ExtensionContext) {
	outputChannel.appendLine('EvoLog-AI: Extension "evolog-ai" is now active!');

	const settingsProvider = new EvoLogAISettingsProvider();

	// Register the tree data provider
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('evolog-ai-settings', settingsProvider)
	);

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('evolog-ai.helloWorld', () => {
			vscode.window.showInformationMessage('EvoLog-AI: Hello World!');
			outputChannel.appendLine('Hello World command executed.');
		}),

		vscode.commands.registerCommand('evolog-ai.generateCommitMessage', () =>
			handleGenerateCommitMessage()
		),

		vscode.commands.registerCommand('evolog-ai.generateCommitAndChangelog', () => {
			vscode.window.showInformationMessage('EvoLog-AI: Commit & Changelog feature coming soon!');
		}),

		vscode.commands.registerCommand('evolog-ai.settings', () => {
			vscode.commands.executeCommand('workbench.view.scm');
			setTimeout(() => {
				vscode.commands.executeCommand('evolog-ai-settings.focus');
			}, 300);
		}),

		vscode.commands.registerCommand('evolog-ai.editHost', async () => {
			const config = vscode.workspace.getConfiguration('evolog-ai');
			const currentHost = config.get<string>('ollamaHost') || DEFAULT_OLLAMA_HOST;

			const newHost = await vscode.window.showInputBox({
				prompt: 'Enter Ollama Host URL',
				value: currentHost,
				placeHolder: DEFAULT_OLLAMA_HOST
			});

			if (newHost !== undefined) {
				await config.update('ollamaHost', newHost, vscode.ConfigurationTarget.Global);
				settingsProvider.refresh();
				vscode.window.showInformationMessage(`Ollama Host updated to: ${newHost}`);
			}
		}),

		vscode.commands.registerCommand('evolog-ai.editModel', async () => {
			const config = vscode.workspace.getConfiguration('evolog-ai');
			const currentModel = config.get<string>('ollamaModel') || DEFAULT_OLLAMA_MODEL;

			const models = [
				'mistral-large-3:675b-cloud',
				'llama3.1:8b',
				'codellama:7b',
				'phi3:medium',
				'gemma2:2b'
			];

			const newModel = await vscode.window.showQuickPick(models, {
				placeHolder: 'Select Ollama Model',
				canPickMany: false
			});

			if (newModel) {
				await config.update('ollamaModel', newModel, vscode.ConfigurationTarget.Global);
				settingsProvider.refresh();
				vscode.window.showInformationMessage(`Ollama Model updated to: ${newModel}`);
			}
		})
	);
}

export function deactivate() { }

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

async function handleGenerateCommitMessage() {
	try {
		const config = vscode.workspace.getConfiguration('evolog-ai');
		const host = config.get<string>('ollamaHost') || DEFAULT_OLLAMA_HOST;
		const model = config.get<string>('ollamaModel') || DEFAULT_OLLAMA_MODEL;

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