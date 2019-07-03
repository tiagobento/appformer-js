import * as vscode from "vscode";
import { KogitoEditorStore } from "./KogitoEditorStore";
import { KogitoEditor } from "./KogitoEditor";
import { LocalRouter } from "./LocalRouter";

export class KogitoEditorFactory {
  private readonly context: vscode.ExtensionContext;
  private readonly editorStore: KogitoEditorStore;
  private readonly router: LocalRouter;

  constructor(context: vscode.ExtensionContext, router: LocalRouter, editorStore: KogitoEditorStore) {
    this.context = context;
    this.editorStore = editorStore;
    this.router = router;
  }

  public openNew(path: string) {
    const panelTitle = path.split("/").pop()! + " 🦉";

    //this will open a panel on vscode's UI.
    const panel = vscode.window.createWebviewPanel(
      "kogito-editor",
      panelTitle,
      { viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
      { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );

    const editor = new KogitoEditor(path, panel, this.context, this.router, this.editorStore);
    this.editorStore.addAsActive(editor);
    editor.setupPanelActiveStatusChange();
    editor.setupEnvelopeBus();
    editor.setupWebviewContent();
    return editor;
  }
}
