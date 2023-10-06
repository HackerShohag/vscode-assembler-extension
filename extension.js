const vscode = require('vscode');
const path = require('path');
const extensionID = 'HackerShohag.assembler';

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	const isActived = vscode.extensions.getExtension(extensionID).isActive;

	if (isActived) {
		vscode.window.showInformationMessage('Extension is already activated.');
		return;
	}

	modifyExecutorMapByFileExtension();
	vscode.window.showInformationMessage('Assembler Extension is activated.');

	context.subscriptions.push(vscode.commands.registerCommand('extension.runAssembly', () => {
		vscode.commands.executeCommand('extension.runAssembly');
	}));
}

vscode.commands.registerCommand('extension.runAssembly', () => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.fileName;
		const destinationPath = path.join(__dirname, 'scripts', 'assemble');
		const terminals = vscode.window.terminals;
		let terminal;

		vscode.window.showInformationMessage('Running Assembly Code!');

		if (terminals.length === 0) {
			terminal = vscode.window.createTerminal('Assembly Terminal');
		} else {
			terminal = terminals[terminals.length - 1];
		}
		const fileDir = path.dirname(filePath);

		terminal.sendText(`cd "${fileDir}"`, true);
		terminal.sendText(`${destinationPath} "${filePath}"`, true);
		terminal.show();
	} else {
		vscode.window.showWarningMessage('No active text editor.');
	}
});

function modifyExecutorMapByFileExtension() {
	const destinationPath = path.join(__dirname, 'scripts', 'assemble');
	const userSettings = vscode.workspace.getConfiguration();
	const codeRunnerExtConf = userSettings.get("code-runner.executorMapByFileExtension");

	codeRunnerExtConf[".asm"] = "cd $dir && " + `${destinationPath}` + " $fileName";
	console.log(codeRunnerExtConf[".asm"]);

	userSettings.update("code-runner.executorMapByFileExtension", codeRunnerExtConf, vscode.ConfigurationTarget.Global)
		.then(() => {
			vscode.window.showInformationMessage('Successfully updated Assembly Code Runner Configuration.');
		})
		.catch(error => {
			vscode.window.showErrorMessage(`Error updating Assembly Configuration: ${error.message}`);
		});
}

vscode.commands.registerCommand('extension.modifyExecutorMap', modifyExecutorMapByFileExtension);

function deactivate() { }

module.exports = {
	activate,
	deactivate
};