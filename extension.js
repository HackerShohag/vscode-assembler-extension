const vscode = require('vscode');
// const { exec } = require('child_process');
const path = require('path');
const extensionID = 'HackerShohag.assembler';

function activate(context) {

	const isActived = vscode.extensions.getExtension(extensionID).isActive;
	const codeRunnerExt = vscode.extensions.getExtension("formulahendry.code-runner");
	const platform = process.platform;

	if (platform == "win32") {
		vscode.window.showWarningMessage('Assembler: Warning: Windows Machines are not properly supported yet.');
	}

	if (!codeRunnerExt) {
		vscode.window.showErrorMessage('Assembler: Code Runner Extension needs to be installed.');
		return;
	}

	if (isActived)
		return;

	modifyExecutorMapByFileExtension();

	// context.subscriptions.push(vscode.commands.registerCommand('extension.runAssembly', () => {
	// 	vscode.commands.executeCommand('extension.runAssembly');
	// }));
}

function runAssemblyCode() {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.fileName;
		const destinationPath = path.join(__dirname, 'scripts', 'assemble');
		const terminals = vscode.window.terminals;
		let terminal;

		vscode.window.showInformationMessage('Assembler: Running Assembly Code!');

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
		vscode.window.showWarningMessage('Assembler: No active text editor.');
	}
};

function modifyExecutorMapByFileExtension() {
	const userSettings = vscode.workspace.getConfiguration();
	const codeRunnerExtConf = userSettings.get("code-runner.executorMapByFileExtension");
	const platform = process.platform;
	let destinationPath;

	if (platform === 'darwin')
		destinationPath = path.join(__dirname, 'scripts', 'assemble.sh');
	else if (platform == 'win32')
		destinationPath = path.join(__dirname, 'scripts', 'assemble.bat');
	else
		destinationPath = path.join(__dirname, 'scripts', 'assemble');

	if (codeRunnerExtConf[".asm"] == "cd $dir && " + `${destinationPath}` + " $fileName")
		return;

	codeRunnerExtConf[".asm"] = "cd $dir && " + `${destinationPath}` + " $fileName";
	userSettings.update("code-runner.executorMapByFileExtension", codeRunnerExtConf, vscode.ConfigurationTarget.Global)
		.then(() => {
			vscode.window.showInformationMessage('Assembler: Updated Code Runner Configuration for Assembly Language (.asm).');
		})
		.catch(error => {
			vscode.window.showErrorMessage(`Assembler: Error updating Assembly Configuration: ${error.message}`);
		});
}

function deactivate() { }

// register the commands
vscode.commands.registerCommand('extension.runAssembly', runAssemblyCode);
vscode.commands.registerCommand('extension.modifyExecutorMap', modifyExecutorMapByFileExtension);

module.exports = {
	activate,
	deactivate,
	runAssemblyCode,
	modifyExecutorMapByFileExtension,
};