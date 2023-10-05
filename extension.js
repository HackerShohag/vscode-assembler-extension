// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const extensionID = 'HackerShohag.assembler';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	const isActived = vscode.extensions.getExtension(extensionID).isActive;

	if (isActived) {
		vscode.window.showInformationMessage('Extension is already activated.');
		return;
	}

	// Register the 'extension.runAssembly' command
	context.subscriptions.push(vscode.commands.registerCommand('extension.runAssembly', () => {
		// Call the 'extension.runAssembly' command when triggered
		vscode.commands.executeCommand('extension.runAssembly');
	}));

	// Register the 'extension.installAssembleScript' command
	context.subscriptions.push(vscode.commands.registerCommand('extension.installAssembleScript', () => {
		// Call the 'extension.installAssembleScript' command when triggered
		vscode.commands.executeCommand('extension.installAssembleScript');
	}));
}

// Register a command to run the 'assemble' script on the currently open assembly file
vscode.commands.registerCommand('extension.runAssembly', () => {
	// Get the active text editor
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		// Get the file path of the active assembly file
		const filePath = editor.document.fileName;
		const destinationPath = path.join(__dirname, 'scripts', 'assemble');

		vscode.window.showInformationMessage('Running Assembly Code!');

		const terminal = vscode.window.createTerminal('Assembly Terminal');

		// Change to the directory of the assembly file
		const fileDir = path.dirname(filePath);
		terminal.sendText(`cd "${fileDir}"`, true);

		// Execute the 'assemble' command
		terminal.sendText(`${destinationPath} ${filePath}`, true);

		// Show the terminal
		terminal.show();
	} else {
		vscode.window.showWarningMessage('No active text editor.');
	}
});

// Function to copy the 'assemble' script to the runtime path and make it executable
function installAssembleScript() {
	try {
		// Get the extension's installation path
		const extensionPath = vscode.extensions.getExtension(extensionID).extensionPath;

		// Define the source and destination paths for the 'assemble' script
		const sourcePath = path.join(extensionPath, 'scripts', 'assemble');
		const destinationPath = path.join(__dirname, 'assemble');

		// Copy the 'assemble' script
		fs.copyFileSync(sourcePath, destinationPath);

		// Make the 'assemble' script executable
		execSync(`chmod +x ${destinationPath}`);

		vscode.window.showInformationMessage('Assemble script is now installed and executable.');
	} catch (error) {
		vscode.window.showErrorMessage(`Error: ${error.message}`);
	}
}

// Register a command to install the 'assemble' script
vscode.commands.registerCommand('extension.installAssembleScript', installAssembleScript);

// Rest of your extension code...


// This method is called when your extension is deactivated
function deactivate() { }

// exports.activate = activate;

module.exports = {
	activate,
	deactivate
};