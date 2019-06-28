/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from "vscode";
import { CustomEditor } from "./CustomEditor";

export class KieEditorsExtension {
  public activeCustomEditor?: CustomEditor;

  public subscribeToActiveTextEditorChanges(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
          if (!textEditor) {
            return;
          }

          if (this.hasLanguage(textEditor)) {
            this.replaceDefaultEditorByKieCustomEditor(textEditor, context);
          }
        })
    );
  }

  public registerCustomSaveCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("workbench.action.files.save", () => {
          // If a custom editor is active, its content is saved manually.
          if (this.activeCustomEditor && this.activeCustomEditor._path.length > 0) {
            this.activeCustomEditor.requestSave();
          }

          // If a text editor is opened, we save it normally.
          if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
          }

          return Promise.resolve();
        })
    );
  }

  private createCustomEditor(path: string, context: vscode.ExtensionContext) {
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const panel = vscode.window.createWebviewPanel(
      "kie-submarine", // Identifies the type of the webview. Used internally
      fileName, // Title of the panel displayed to the user
      { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, // Editor column to show the new webview panel in.
      { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );

    const customEditor = new CustomEditor(
      panel,
      path,
      editor => (this.activeCustomEditor = editor),
      editor => !!this.activeCustomEditor && this.activeCustomEditor._path === editor._path
    );

    customEditor.setupPanelEvents(context);
    customEditor.setupWebviewContent(context);
    return customEditor;
  }

  private hasLanguage(textEditor: vscode.TextEditor) {
    const extension = vscode.extensions.getExtension("kiegroup.appformer-js-vscode-extension");
    if (!extension) {
      console.info("Extension configuration not found.");
    }

    const matchingLanguages = (extension!.packageJSON.contributes.languages as any[]).filter(
      language => language.extensions.indexOf("." + textEditor.document.languageId) > -1
    );

    return matchingLanguages.length > 0;
  }

  private replaceDefaultEditorByKieCustomEditor(textEditor: vscode.TextEditor, context: vscode.ExtensionContext) {
    vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
      this.activeCustomEditor = this.createCustomEditor(textEditor.document.uri.path, context);
      return Promise.resolve();
    });
  }
}
