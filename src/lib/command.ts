import * as vscode from 'vscode';
import { EvoLogAISettingsProvider } from './view';
import { handleGenerateCommitMessage, outputChannel, DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL } from './utility';

export function registerCommands(context: vscode.ExtensionContext, settingsProvider: EvoLogAISettingsProvider) {
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
