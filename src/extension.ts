import * as vscode from 'vscode';
import * as http from 'node:http';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let ollamaHost = "http://localhost:11434";
	let ollamaModel = "mistral-large-3:675b-cloud";
	let commitMessagePrompt =
		`
		Generate commit messages based on code changes following conventional commit format:

		**Rules:**
		- Use English with casual tone
		- Start with conventional commit prefix (feat, fix, docs, style, refactor, test, perf, build, ci, chore, revert, security)
		- Focus only on the actual code changes
		- Be concise and direct
		- Avoid hallucinations or unrelated content
		- No unnecessary symbols or characters
		- Maximum 50 characters for the subject line

		**Examples:**
		- fix: login form validation error
		- docs: update API usage examples in README
		- style: format code with prettier
		- refactor: optimize calculateTotal function
		- test: add unit tests for userService
		- feat: implement user profile feature
		- perf: optimize database queries in report module
		- chore: update dependencies in package.json

		**Instructions:**
		Analyze the code changes and generate appropriate commit messages based on what was actually modified.
		`;

	console.log('EvoLog-AI: Congratulations, your extension "evolog-ai" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloDisposable = vscode.commands.registerCommand('evolog-ai.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('EvoLog-AI: Hello World from EvoLog-AI!');
	});

	// Command baru untuk Generate Commit Message menggunakan Ollama
	const generateCommitMessageDisposable = vscode.commands.registerCommand('evolog-ai.generateCommitMessage', async () => {
		await handleGenerateCommitMessage(ollamaHost, ollamaModel, commitMessagePrompt);
	});

	context.subscriptions.push(helloDisposable, generateCommitMessageDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

// Function to call Ollama API
async function callOllamaAPI(host: string, model: string, prompt: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const url = new URL('/api/generate', host);

		const postData = JSON.stringify({
			model: model,
			prompt: prompt,
			stream: false
		});

		const options = {
			hostname: url.hostname,
			port: url.port || 11434,
			path: url.pathname,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData)
			}
		};

		const req = http.request(options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				try {
					const response = JSON.parse(data);
					if (response.response) {
						resolve(response.response);
					} else {
						reject(new Error('EvoLog-AI: No response from Ollama'));
					}
				} catch (error) {
					reject(error);
				}
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		req.write(postData);
		req.end();
	});
}

// Function to get git changes (staged and unstaged)
async function getGitChanges(): Promise<{ stagedChanges: string; unstagedChanges: string; hasChanges: boolean }> {
	try {
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		if (!gitExtension) {
			throw new Error('EvoLog-AI: Git extension not available');
		}

		const api = gitExtension.getAPI(1);
		const repository = api.repositories[0];

		if (!repository) {
			throw new Error('EvoLog-AI: No git repository found');
		}

		// Get staged changes (changes that will be committed)
		const stagedDiff = await repository.diff(true);

		// Get unstaged changes (changes that haven't been staged yet)
		const unstagedDiff = await repository.diff(false);

		const hasStagedChanges = !!stagedDiff && stagedDiff.length > 0;
		const hasUnstagedChanges = !!unstagedDiff && unstagedDiff.length > 0;
		const hasChanges = hasStagedChanges || hasUnstagedChanges;

		return {
			stagedChanges: stagedDiff || '',
			unstagedChanges: unstagedDiff || '',
			hasChanges: hasChanges
		};

	} catch (error) {
		vscode.window.showErrorMessage(`EvoLog-AI: Failed to get git changes: ${error}`);
		return {
			stagedChanges: '',
			unstagedChanges: '',
			hasChanges: false
		};
	}
}

// Function to handle the commit message generation process
async function handleGenerateCommitMessage(host: string, model: string, basePrompt: string): Promise<void> {
	try {
		vscode.window.showInformationMessage('EvoLog-AI: Generating commit message using Ollama...');

		// Get git changes
		const gitChanges = await getGitChanges();

		if (!gitChanges.hasChanges) {
			vscode.window.showWarningMessage('EvoLog-AI: No changes detected. Please make some changes first.');
			return;
		}

		// Check if there are staged changes
		const hasStagedChanges = gitChanges.stagedChanges.length > 0;
		const hasOnlyUnstagedChanges = gitChanges.unstagedChanges.length > 0 && !hasStagedChanges;

		if (hasOnlyUnstagedChanges) {
			const userChoice = await vscode.window.showWarningMessage(
				'EvoLog-AI: You have unstaged changes. Would you like to stage them first?',
				'Stage Changes and Continue',
				'Use Unstaged Changes',
				'Cancel'
			);

			if (userChoice === 'Stage Changes and Continue') {
				// Stage all changes
				const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
				const api = gitExtension.getAPI(1);
				const repository = api.repositories[0];

				await repository.add([]); // Stage all changes
				vscode.window.showInformationMessage('Changes staged successfully!');

				// Refresh changes after staging
				const refreshedChanges = await getGitChanges();
				return await processGitChanges(host, model, basePrompt, refreshedChanges.stagedChanges);

			} else if (userChoice === 'Use Unstaged Changes') {
				return await processGitChanges(host, model, basePrompt, gitChanges.unstagedChanges);
			} else {
				return; // User canceled
			}
		}

		// If we have staged changes, use them (prioritize staged over unstaged)
		const changesToUse = hasStagedChanges ? gitChanges.stagedChanges : gitChanges.unstagedChanges;
		await processGitChanges(host, model, basePrompt, changesToUse);

	} catch (error) {
		vscode.window.showErrorMessage(`EvoLog-AI: Failed to generate commit message: ${error}`);
	}
}

// Function to process git changes and generate commit message
async function processGitChanges(host: string, model: string, basePrompt: string, gitDiff: string): Promise<void> {
	if (!gitDiff || gitDiff.trim().length === 0) {
		vscode.window.showWarningMessage('EvoLog-AI: No changes available to analyze.');
		return;
	}

	// Construct full prompt with git diff
	const fullPrompt = `${basePrompt}\n\nGit Changes:\n${gitDiff}`;

	// Call Ollama API
	const commitMessage = await callOllamaAPI(host, model, fullPrompt);

	// Show the generated commit message
	await showCommitMessageResult(commitMessage);
}

// Function to display the commit message result
// Function to display the commit message result
async function showCommitMessageResult(message: string): Promise<void> {
	// Try to insert directly into SCM input box first
	const success = await insertIntoSCMInput(message);

	if (success) {
		vscode.window.showInformationMessage('EvoLog-AI: Commit message inserted into SCM input!');
	}
}

// Function to insert commit message directly into SCM input
// Function to insert commit message directly into SCM input
async function insertIntoSCMInput(message: string): Promise<boolean> {
	try {
		// Get the Git extension
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		if (!gitExtension) {
			return false;
		}

		const api = gitExtension.getAPI(1);
		const repository = api.repositories[0];

		if (!repository) {
			return false;
		}

		// Focus on SCM view
		await vscode.commands.executeCommand('workbench.view.scm');

		// Wait a moment for SCM view to load
		await new Promise(resolve => setTimeout(resolve, 500));

		// Set the commit message in the repository's input box
		repository.inputBox.value = message;
		return true;

	} catch (error) {
		console.error('EvoLog-AI: Failed to insert into SCM input:', error);
		return false;
	}
}