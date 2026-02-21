import * as vscode from 'vscode';
import { EvoLogAISettingsProvider } from './view';
import { handleGenerateCommitMessage, outputChannel, DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL } from './utility';

/**
 * Configuration keys for the extension
 */
const CONFIG_SECTION = 'evolog-ai';
const CONFIG_KEY_HOST = 'ollamaHost';
const CONFIG_KEY_MODEL = 'ollamaModel';

/**
 * Registers all commands for the EvoLog-AI extension.
 */
export function registerCommands(context: vscode.ExtensionContext, settingsProvider: EvoLogAISettingsProvider) {
	// Register the tree data provider for the settings view
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('evolog-ai-settings', settingsProvider)
	);

	// Define command mappings
	const commands = [
		vscode.commands.registerCommand('evolog-ai.helloWorld', handleHelloWorld),
		vscode.commands.registerCommand('evolog-ai.generateCommitMessage', handleGenerateCommitMessage),
		vscode.commands.registerCommand('evolog-ai.generateCommitAndChangelog', handleComingSoon),
		vscode.commands.registerCommand('evolog-ai.settings', handleOpenSettings),
		vscode.commands.registerCommand('evolog-ai.editHost', () => handleEditHost(settingsProvider)),
		vscode.commands.registerCommand('evolog-ai.editModel', () => handleEditModel(settingsProvider))
	];

	context.subscriptions.push(...commands);
}

/**
 * Handler for the Hello World command.
 */
function handleHelloWorld() {
	vscode.window.showInformationMessage('EvoLog-AI: Hello World!');
	outputChannel.appendLine('Hello World command executed.');
}

/**
 * Handler for features that are not yet implemented.
 */
function handleComingSoon() {
	vscode.window.showInformationMessage('EvoLog-AI: Commit & Changelog feature coming soon!');
}

/**
 * Opens the SCM view and focuses the EvoLog-AI settings.
 */
async function handleOpenSettings() {
	await vscode.commands.executeCommand('workbench.view.scm');
	// Small delay to ensure the SCM view is active before focusing the sub-view
	setTimeout(() => {
		vscode.commands.executeCommand('evolog-ai-settings.focus');
	}, 300);
}

/**
 * Handler for editing the Ollama Host URL.
 */
async function handleEditHost(settingsProvider: EvoLogAISettingsProvider) {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const currentHost = config.get<string>(CONFIG_KEY_HOST) || DEFAULT_OLLAMA_HOST;

	const newHost = await vscode.window.showInputBox({
		prompt: 'Enter Ollama Host URL',
		value: currentHost,
		placeHolder: DEFAULT_OLLAMA_HOST,
		validateInput: (value) => {
			try {
				new URL(value);
				return null;
			} catch {
				return 'Please enter a valid URL (e.g., http://localhost:11434)';
			}
		}
	});

	if (newHost !== undefined && newHost !== currentHost) {
		try {
			await config.update(CONFIG_KEY_HOST, newHost, vscode.ConfigurationTarget.Global);
			settingsProvider.refresh();
			vscode.window.showInformationMessage(`Ollama Host updated to: ${newHost}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to update Ollama Host: ${error}`);
		}
	}
}

/**
 * Handler for selecting the Ollama Model.
 */
async function handleEditModel(settingsProvider: EvoLogAISettingsProvider) {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const currentModel = config.get<string>(CONFIG_KEY_MODEL) || DEFAULT_OLLAMA_MODEL;

	// TODO: In the future, fetch these dynamically from the Ollama API
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

	if (newModel && newModel !== currentModel) {
		try {
			await config.update(CONFIG_KEY_MODEL, newModel, vscode.ConfigurationTarget.Global);
			settingsProvider.refresh();
			vscode.window.showInformationMessage(`Ollama Model updated to: ${newModel}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to update Ollama Model: ${error}`);
		}
	}
}
