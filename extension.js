// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

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

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "assembler" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('assembler.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Running Assembly Code!');
	});

	context.subscriptions.push(disposable);
}

// Register a command to run the 'assemble' script on the currently open assembly file
vscode.commands.registerCommand('extension.runAssembly', () => {
	// Get the active text editor
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		// Get the file path of the active assembly file
		const filePath = editor.document.fileName;

		// Run the 'assemble' script with the assembly file as an argument
		exec(`./assemble ${filePath}`, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Error: ${error.message}`);
				return;
			}

			// Display the output in the VSCode output channel
			vscode.window.createOutputChannel('Assembly Output').appendLine(stdout);
			vscode.window.createOutputChannel('Assembly Output').appendLine(stderr);
		});
	} else {
		vscode.window.showWarningMessage('No active text editor.');
	}
});

// Function to copy the 'assemble' script to the runtime path and make it executable
function installAssembleScript() {
	try {
		// Get the extension's installation path
		const extensionPath = vscode.extensions.getExtension('yourusername.vscode-assemble-extension').extensionPath;

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