import * as vscode from 'vscode';
import { DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL } from './utility';

export class EvoLogAISettingsProvider implements vscode.TreeDataProvider<EvoLogAISettingsItem> {
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

export class EvoLogAISettingsItem extends vscode.TreeItem {
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
