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
import * as fs from "fs";
import * as __path from "path";

export class CustomEditor {
  public static activeCustomEditor: CustomEditor | undefined;

  private _panel: vscode.WebviewPanel;
  private readonly _path: string;

  private constructor(panel: vscode.WebviewPanel, path: string) {
    this._panel = panel;
    this._path = path;
  }

  public static create(path: string, context: vscode.ExtensionContext) {
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const panel = vscode.window.createWebviewPanel(
      "kie-submarine", // Identifies the type of the webview. Used internally
      fileName, // Title of the panel displayed to the user
      { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, // Editor column to show the new webview panel in.
      { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );

    CustomEditor.activeCustomEditor = new CustomEditor(panel, path);
    CustomEditor.activeCustomEditor.setupPanelEvents(context);
    return CustomEditor.activeCustomEditor.setupWebviewContent(context);
  }

  public static registerCommand(context: vscode.ExtensionContext) {
    let openCustomEditorWhenOpeningTextDocumentCommand = vscode.window.onDidChangeActiveTextEditor(
      (textEditor?: vscode.TextEditor) => {
        if (!textEditor) {
          return;
        }
        
        const languages = vscode.extensions.getExtension("undefined_publisher.appformer-js-vscode-extension")!.packageJSON.contributes.languages;
        for (const language of languages) {
          if (language.extensions.indexOf("." + textEditor.document.languageId) > -1) {
            vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
              return CustomEditor.create(textEditor.document.uri.path, context);
            });
            break;
          }
        }
      }
    );

    context.subscriptions.push(openCustomEditorWhenOpeningTextDocumentCommand);
  }

  public static registerCustomSaveCommand(context: vscode.ExtensionContext) {
    const customSaveCommand = vscode.commands.registerCommand("workbench.action.files.save", function() {
      // If a custom editor is active, its content is saved manually.
      if (CustomEditor.activeCustomEditor && CustomEditor.activeCustomEditor._path.length > 0) {
        CustomEditor.activeCustomEditor._panel.webview.postMessage({ type: "REQUEST_GET_CONTENT" });
      }

      // If a text editor is opened, we save it normally.
      if (vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.document.save();
      }

      return Promise.resolve();
    });

    context.subscriptions.push(customSaveCommand);
  }

  private setupPanelEvents(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      this._panel.webview.onDidReceiveMessage(
        (message: any) => {
          switch (message.type) {
            case "RETURN_GET_CONTENT":
              fs.writeFileSync(this._path, message.data);
              break;
            case "REQUEST_SET_CONTENT":
              const content = fs.readFileSync(this._path);
              this._panel.webview.postMessage({ type: "RETURN_SET_CONTENT", data: content.toString() });
              break;
          }
        },
        this,
        context.subscriptions
      )
    );

    context.subscriptions.push(
      this._panel.onDidChangeViewState(
        () => {
          if (this._panel.active) {
            CustomEditor.activeCustomEditor = this;
          } else if (CustomEditor.activeCustomEditor && CustomEditor.activeCustomEditor._path === this._path) {
            CustomEditor.activeCustomEditor = undefined;
          }
        },
        this,
        context.subscriptions
      )
    );
  }

  private async setupWebviewContent(context: vscode.ExtensionContext) {

    const webviewIndexPath = vscode.Uri.file(__path.join(context.extensionPath, "dist", "webview", "index.js")).with({
      scheme: "vscode-resource"
    });

    this._panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <style>
                html, body, session, main, div#app {
                    margin: 0;
                    border: 0;
                    padding: 0;
                    overflow: hidden;
                }
                </style>
    
                <title></title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
                <link rel="stylesheet" type="text/css" href="http://localhost:8080/org.uberfire.editor.StandaloneEditor/css/patternfly.min.css">
            </head>
            <body>
    
            <div id="app"></div>
            
            
            <script src="http://localhost:8080/org.uberfire.editor.StandaloneEditor/ace/ace.js" type="text/javascript" charset="utf-8"></script>
            <script src="http://localhost:8080/org.uberfire.editor.StandaloneEditor/ace/theme-chrome.js" type="text/javascript" charset="utf-8"></script>
            
            <script src="${webviewIndexPath.toString()}"></script>
            </body>
        </html>
    `;
  }
}
