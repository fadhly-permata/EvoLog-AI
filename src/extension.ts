import * as vscode from 'vscode';
import { EvoLogAISettingsProvider } from './lib/view';
import { registerCommands } from './lib/command';
import { outputChannel } from './lib/utility';

export function activate(context: vscode.ExtensionContext) {
	outputChannel.appendLine('EvoLog-AI: Extension "evolog-ai" is now active!');

	const settingsProvider = new EvoLogAISettingsProvider();

	registerCommands(context, settingsProvider);
}

export function deactivate() { }
