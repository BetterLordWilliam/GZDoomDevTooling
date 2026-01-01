// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('GZDoom Dev Tooling extension is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('gzdoomdevtooling.getEnginePath', async () => {
		let enginePath = vscode.workspace.getConfiguration('gzdoomdevtooling').get('gzdoomenginepath');
		if (enginePath) {
			vscode.window.showInformationMessage(enginePath);
		} else {
			vscode.window.showWarningMessage('GZDoom Engine Path is not set. Please configure it in the settings.');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('gzdoomdevtooling.setEnginePath', async () => {
		let newEnginePath = await vscode.window.showInputBox({ prompt: 'Enter GZDoom Engine Path', placeHolder: 'e.g., C:\\Program Files\\GZDoom\\my-gzdoom-version\\gzdoom.exe' });

		if (!newEnginePath) {
			vscode.window.showWarningMessage('No path entered. GZDoom Engine Path not updated.');
			return;
		}

		let globalUpdate = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Set GZDoom Engine Path Globally?' });

		await vscode.workspace.getConfiguration('gzdoomdevtooling').update('gzdoomenginepath', newEnginePath, globalUpdate === 'Yes');
	}));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
