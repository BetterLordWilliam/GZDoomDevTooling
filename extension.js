const vscode = require('vscode');
const path = require('path');

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

	context.subscriptions.push(vscode.commands.registerCommand('gzdoomdevtooling.launchGZDoom', async () => {
		let enginePath = vscode.workspace.getConfiguration('gzdoomdevtooling').get('gzdoomenginepath');
		let launchArgs = vscode.workspace.getConfiguration('gzdoomdevtooling').get('launchargs');

		if (!enginePath) {
			vscode.window.showErrorMessage('Cannot launch GZDoom: Engine path is not set.');
			return;
		}

		let engineExecPathSegs = enginePath.split(path.sep);
		engineExecPathSegs = engineExecPathSegs.map((seg) => {
			return (seg.includes(' ')) ? `"${seg}"` :  seg;
		});
		let engineExecPath = engineExecPathSegs.join(path.sep);

		let terminal = vscode.window.createTerminal('GZDoom Launch');

		vscode.window.showInformationMessage('Launching GZDoom Engine...');

		terminal.sendText(`${engineExecPath} ${launchArgs}`);
		terminal.show();
	}));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
