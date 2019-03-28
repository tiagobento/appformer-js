import * as vscode from "vscode";
import { CustomEditor } from "./CustomEditor";
import { BackendExecutor } from "./BackendExecutor";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  CustomEditor.registerCommand(context);
  CustomEditor.registerCustomSaveCommand(context);
  //BackendExecutor.run(context);
}

export function deactivate() {}
