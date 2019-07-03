import * as vscode from "vscode";
import { KogitoEditorsExtension } from "./KogitoEditorsExtension";
import { KogitoEditorStore } from "./KogitoEditorStore";
import { KogitoEditorFactory } from "./KogitoEditorFactory";
import {LocalRouter} from "./LocalRouter";

export function activate(context: vscode.ExtensionContext) {
  console.info("Extension is alive.");
  const router = new LocalRouter(context);
  const kogitoEditorStore = new KogitoEditorStore();
  const kogitoEditorFactory = new KogitoEditorFactory(context, router, kogitoEditorStore);
  const kieEditorsExtension = new KogitoEditorsExtension(context, kogitoEditorStore, kogitoEditorFactory);
  kieEditorsExtension.startReplacingTextEditorsByKogitoEditorsAsTheyOpenIfLanguageIsSupported();
  kieEditorsExtension.registerCustomSaveCommand();
  console.info("Extension is successfully setup.");
}

export function deactivate() {
  //FIXME: For some reason, this method is not being called :(
  console.info("Extension is deactivating");
}
