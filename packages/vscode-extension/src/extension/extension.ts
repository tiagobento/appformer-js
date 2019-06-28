import * as vscode from "vscode";
import { KieEditorsExtension } from "./KieEditorsExtension";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  const kieEditorsExtension = new KieEditorsExtension();
  kieEditorsExtension.subscribeToActiveTextEditorChanges(context);
  kieEditorsExtension.registerCustomSaveCommand(context);
}

export function deactivate() {
  //FIXME: For some reason, this method is not being called :(
  console.info("Extension is deactivating")
}
