import * as vscode from 'vscode';
import * as http from 'node:http';
import { DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL, outputChannel } from './utility';

export class EvoLogAISettingsProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'evolog-ai-settings';
	private _view?: vscode.WebviewView;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public refresh(): void {
		if (this._view) {
			this._view.webview.html = this._getHtmlForWebview(this._view.webview);
		}
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case 'saveSettings': {
					const config = vscode.workspace.getConfiguration('evolog-ai');
					await config.update('ollamaHost', data.host, vscode.ConfigurationTarget.Global);
					await config.update('ollamaModel', data.model, vscode.ConfigurationTarget.Global);
					vscode.window.showInformationMessage('EvoLog-AI: Settings saved!');
					break;
				}
				case 'fetchModels': {
					const models = await this._fetchModels(data.host);
					webviewView.webview.postMessage({ type: 'modelsFetched', models });
					break;
				}
			}
		});
	}

	private async _fetchModels(host: string): Promise<string[]> {
		const url = new URL('/api/tags', host);
		return new Promise((resolve) => {
			const req = http.request({
				hostname: url.hostname,
				port: url.port || 11434,
				path: url.pathname,
				method: 'GET',
			}, res => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => {
					try {
						const response = JSON.parse(data);
						const models = response.models?.map((m: any) => m.name) || [];
						resolve(models);
					} catch (err) {
						outputChannel.appendLine(`Failed to parse models: ${err}`);
						resolve([]);
					}
				});
			});

			req.on('error', (err) => {
				outputChannel.appendLine(`Failed to fetch models: ${err}`);
				resolve([]);
			});
			req.end();
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const config = vscode.workspace.getConfiguration('evolog-ai');
		const host = config.get<string>('ollamaHost') || DEFAULT_OLLAMA_HOST;
		const model = config.get<string>('ollamaModel') || DEFAULT_OLLAMA_MODEL;

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					body {
						padding: 10px;
						color: var(--vscode-foreground);
						font-family: var(--vscode-font-family);
					}
					.field-group {
						margin-bottom: 15px;
					}
					label {
						display: block;
						margin-bottom: 5px;
						font-weight: bold;
					}
					input, select {
						width: 100%;
						padding: 8px;
						box-sizing: border-box;
						background: var(--vscode-input-background);
						color: var(--vscode-input-foreground);
						border: 1px solid var(--vscode-input-border);
						border-radius: 4px;
					}
					input:focus, select:focus {
						outline: 1px solid var(--vscode-focusBorder);
					}
					button {
						width: 100%;
						padding: 8px;
						background: var(--vscode-button-background);
						color: var(--vscode-button-foreground);
						border: none;
						border-radius: 4px;
						cursor: pointer;
					}
					button:hover {
						background: var(--vscode-button-hoverBackground);
					}
					.loading {
						font-size: 0.8em;
						font-style: italic;
						margin-top: 2px;
						display: none;
					}
				</style>
			</head>
			<body>
				<div class="field-group">
					<label for="host">Ollama Host :</label>
					<input type="text" id="host" value="${host}" placeholder="http://localhost:11434">
				</div>
				<div class="field-group">
					<label for="model">Ollama Model :</label>
					<select id="model">
						<option value="${model}">${model}</option>
					</select>
					<div id="loading" class="loading">Fetching models...</div>
				</div>
				<button id="save">Save Settings</button>

				<script>
					const vscode = acquireVsCodeApi();
					const hostInput = document.getElementById('host');
					const modelSelect = document.getElementById('model');
					const saveButton = document.getElementById('save');
					const loadingDiv = document.getElementById('loading');

					function fetchModels() {
						loadingDiv.style.display = 'block';
						vscode.postMessage({
							type: 'fetchModels',
							host: hostInput.value
						});
					}

					hostInput.addEventListener('change', fetchModels);
					
					saveButton.addEventListener('click', () => {
						vscode.postMessage({
							type: 'saveSettings',
							host: hostInput.value,
							model: modelSelect.value
						});
					});

					window.addEventListener('message', event => {
						const message = event.data;
						if (message.type === 'modelsFetched') {
							loadingDiv.style.display = 'none';
							const currentModel = modelSelect.value;
							modelSelect.innerHTML = '';
							
							if (message.models.length === 0) {
								const opt = document.createElement('option');
								opt.value = currentModel;
								opt.text = currentModel + ' (offline?)';
								modelSelect.appendChild(opt);
							} else {
								message.models.forEach(m => {
									const opt = document.createElement('option');
									opt.value = m;
									opt.text = m;
									if (m === currentModel) opt.selected = true;
									modelSelect.appendChild(opt);
								});
							}
						}
					});

					// Initial fetch
					fetchModels();
				</script>
			</body>
			</html>`;
	}
}
