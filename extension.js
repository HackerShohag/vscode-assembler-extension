const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const extensionID = 'HackerShohag.assembler';

function activate(context) {

	const isActived = vscode.extensions.getExtension(extensionID).isActive;

	if (isActived) {
		vscode.window.showInformationMessage('Extension is already activated.');
		return;
	}

	modifyExecutorMapByFileExtension();
	installNASMndGCC();

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
};

function modifyExecutorMapByFileExtension() {
	const destinationPath = path.join(__dirname, 'scripts', 'assemble');
	const userSettings = vscode.workspace.getConfiguration();
	const codeRunnerExtConf = userSettings.get("code-runner.executorMapByFileExtension");

	codeRunnerExtConf[".asm"] = "cd $dir && " + `${destinationPath}` + " $fileName";
	console.log(codeRunnerExtConf[".asm"]);

	userSettings.update("code-runner.executorMapByFileExtension", codeRunnerExtConf, vscode.ConfigurationTarget.Global)
		.then(() => {
			vscode.window.showInformationMessage('Updated Code Runner Configuration for Assembly Language (.asm).');
		})
		.catch(error => {
			vscode.window.showErrorMessage(`Error updating Assembly Configuration: ${error.message}`);
		});
}

function installNASMndGCC() {
	const platform = process.platform;

	if (platform === 'win32') {
		installOnWindows();
	} else if (platform === 'darwin') {
		installOnMacOS();
	} else {
		vscode.window.showErrorMessage('For Linux platform, install the software manually.');
	}
}

function installOnWindows() {
	exec('winget install -e --id NASM.NASM', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error installing NASM: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showErrorMessage(`Error installing NASM: ${stderr}`);
			return;
		}
		vscode.window.showInformationMessage('NASM installed successfully.');
	});

	exec('winget install -e --id GCC.GCC', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error installing GCC: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showErrorMessage(`Error installing GCC: ${stderr}`);
			return;
		}
		vscode.window.showInformationMessage('GCC installed successfully.');
	});
}

function installOnMacOS() {
	exec('brew install nasm', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error installing NASM: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showErrorMessage(`Error installing NASM: ${stderr}`);
			return;
		}
		vscode.window.showInformationMessage('NASM installed successfully.');
	});

	exec('brew install gcc', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error installing GCC: ${error.message}`);
			return;
		}
		if (stderr) {
			vscode.window.showErrorMessage(`Error installing GCC: ${stderr}`);
			return;
		}
		vscode.window.showInformationMessage('GCC installed successfully.');
	});
}

function deactivate() { }

// register the commands
vscode.commands.registerCommand('extension.runAssembly', runAssemblyCode);
vscode.commands.registerCommand('extension.installNASMndGCC', installNASMndGCC);
vscode.commands.registerCommand('extension.modifyExecutorMap', modifyExecutorMapByFileExtension);

module.exports = {
	activate,
	deactivate,
	runAssemblyCode,
	modifyExecutorMapByFileExtension,
	installNASMndGCC
};