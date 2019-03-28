import * as vscode from "vscode";
import { CustomEditor } from "./CustomEditor";

import { BackendExecutor } from "./backend";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  CustomEditor.registerCommand(context);
  CustomEditor.registerCustomSaveCommand(context);
  BackendExecutor.run();
}

export function deactivate() {}
