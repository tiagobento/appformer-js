import * as vscode from "vscode";
import { KogitoEditorsExtension } from "./KogitoEditorsExtension";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  const kieEditorsExtension = new KogitoEditorsExtension(context);
  kieEditorsExtension.subscribeToActiveTextEditorChanges();
  kieEditorsExtension.registerCustomSaveCommand();
  console.info("Extension is successfully setup.");
}

export function deactivate() {
  //FIXME: For some reason, this method is not being called :(
  console.info("Extension is deactivating");
}
