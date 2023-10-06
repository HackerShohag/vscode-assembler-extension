const path = require('path');
const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const child_process = require('child_process');
const extension = require('../extension');
const { runTests } = require('@vscode/test-electron');

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../');

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exit(1);
	}

	suite('Extension Test Suite', () => {
		vscode.window.showInformationMessage('Start all tests.');

		test('activate function should register commands', () => {
			const context = {
				subscriptions: [],
				workspaceState: {
					get: () => { },
					update: () => { }
				},
				globalState: {
					get: () => { },
					update: () => { }
				},
				extensionPath: ''
			};
			extension.activate(context);
			assert.strictEqual(context.subscriptions.length, 3);
		});

		test('runAssemblyCode function should show warning message if no active text editor', () => {
			const editor = vscode.window.activeTextEditor;
			vscode.window.activeTextEditor = undefined;
			const warningMessage = sinon.stub(vscode.window, 'showWarningMessage');
			extension.runAssemblyCode();
			assert(warningMessage.calledOnceWith('No active text editor.'));
			vscode.window.activeTextEditor = editor;
		});

		test('runAssemblyCode function should create a new terminal if no terminals exist', () => {
			const editor = vscode.window.activeTextEditor;
			vscode.window.activeTextEditor = {
				document: {
					fileName: '/path/to/file.asm'
				}
			};
			const createTerminal = sinon.stub(vscode.window, 'createTerminal');
			const sendText = sinon.stub();
			const show = sinon.stub();
			createTerminal.returns({
				sendText,
				show
			});
			vscode.window.terminals = [];
			extension.runAssemblyCode();
			assert(createTerminal.calledOnceWith('Assembly Terminal'));
			assert(sendText.calledWith(`cd "/path/to"`, true));
			assert(sendText.calledWith(`${path.join(__dirname, 'scripts', 'assemble')} "/path/to/file.asm"`, true));
			assert(show.calledOnce);
			vscode.window.activeTextEditor = editor;
		});

		test('runAssemblyCode function should use the last terminal if terminals exist', () => {
			const editor = vscode.window.activeTextEditor;
			vscode.window.activeTextEditor = {
				document: {
					fileName: '/path/to/file.asm'
				}
			};
			const createTerminal = sinon.stub(vscode.window, 'createTerminal');
			const sendText = sinon.stub();
			const show = sinon.stub();
			createTerminal.returns({
				sendText,
				show
			});
			vscode.window.terminals = [
				{
					name: 'Terminal 1'
				},
				{
					name: 'Terminal 2'
				}
			];
			extension.runAssemblyCode();
			assert(createTerminal.notCalled);
			assert(sendText.calledWith(`cd "/path/to"`, true));
			assert(sendText.calledWith(`${path.join(__dirname, 'scripts', 'assemble')} "/path/to/file.asm"`, true));
			assert(show.calledOnce);
			vscode.window.activeTextEditor = editor;
		});

		test('modifyExecutorMapByFileExtension function should update code-runner configuration', async () => {
			const userSettings = vscode.workspace.getConfiguration();
			const update = sinon.stub(userSettings, 'update');
			const get = sinon.stub(userSettings, 'get');
			get.withArgs('code-runner.executorMapByFileExtension').returns({});
			await extension.modifyExecutorMapByFileExtension();
			assert(update.calledOnceWith('code-runner.executorMapByFileExtension', {
				'.asm': `cd $dir && ${path.join(__dirname, 'scripts', 'assemble')} $fileName`
			}, vscode.ConfigurationTarget.Global));
		});

		test('installNASMndGCC function should install NASM and GCC on Windows', () => {
			process.platform = 'win32';
			const exec = sinon.stub(child_process, 'exec');
			exec.withArgs('winget install -e --id NASM.NASM').yields(null, '', '');
			exec.withArgs('winget install -e --id GCC.GCC').yields(null, '', '');
			const showErrorMessage = sinon.stub(vscode.window, 'showErrorMessage');
			const showInformationMessage = sinon.stub(vscode.window, 'showInformationMessage');
			extension.installNASMndGCC();
			assert(showInformationMessage.calledTwice);
			assert(showErrorMessage.notCalled);
		});

		test('installNASMndGCC function should install NASM and GCC on macOS', () => {
			process.platform = 'darwin';
			const exec = sinon.stub(child_process, 'exec');
			exec.withArgs('brew install nasm').yields(null, '', '');
			exec.withArgs('brew install gcc').yields(null, '', '');
			const showErrorMessage = sinon.stub(vscode.window, 'showErrorMessage');
			const showInformationMessage = sinon.stub(vscode.window, 'showInformationMessage');
			extension.installNASMndGCC();
			assert(showInformationMessage.calledTwice);
			assert(showErrorMessage.notCalled);
		});

		test('installNASMndGCC function should show error message on other platforms', () => {
			process.platform = 'linux';
			const showErrorMessage = sinon.stub(vscode.window, 'showErrorMessage');
			const showInformationMessage = sinon.stub(vscode.window, 'showInformationMessage');
			extension.installNASMndGCC();
			assert(showInformationMessage.notCalled);
			assert(showErrorMessage.calledOnceWith('Please install the software manually.'));
		});
	});
}

main();