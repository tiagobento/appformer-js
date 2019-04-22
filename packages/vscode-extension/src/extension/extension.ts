import * as vscode from "vscode";
import { KieEditorsExtension } from "./KieEditorsExtension";
import { BackendExecutor } from "./BackendExecutor";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  KieEditorsExtension.subscribeToActiveTextEditorChanges(context);
  KieEditorsExtension.registerCustomSaveCommand(context);
  // BackendExecutor.run(context);
}

export function deactivate() {
  //
}
