import * as vscode from "vscode";
import { KieEditorsExtension } from "./KieEditorsExtension";
import { MicroEditorsExecutor } from "./MicroEditorsExecutor";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  KieEditorsExtension.subscribeToActiveTextEditorChanges(context);
  KieEditorsExtension.registerCustomSaveCommand(context);
  MicroEditorsExecutor.run(context);
}

export function deactivate() {
  //FIXME: For some reason, this method is not being called :(
  return new Promise(res => {
    MicroEditorsExecutor.cleanup(res);
  })
}
