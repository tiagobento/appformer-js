import * as vscode from 'vscode';
import * as fs from 'fs';
import { CustomEditor } from "./CustomEditor";

import { BackendExecutor } from "./backend";

export function activate(context: vscode.ExtensionContext) {
	try {
		console.info("Extension is alive.");
		CustomEditor.registerCommand(context);
		CustomEditor.registerCustomSaveCommand(context);
		BackendExecutor.run();
	} catch (e) {
		console.info(e);
	}
}

export function deactivate() {
}