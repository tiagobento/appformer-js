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
import { LanguageData } from "../shared/LanguageData";

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
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
        if (!textEditor) {
          return;
        }

        if (this.hasLanguage(textEditor)) {
          this.closeDefaultTextEditorAndOpenCustomWebviewEditor(textEditor, context);
        }
      })
    );
  }

  private static hasLanguage(textEditor: vscode.TextEditor) {
    const extension = vscode.extensions.getExtension("kiegroup.appformer-js-vscode-extension");
    if (!extension) {
      console.info("Extension configuration not found.");
    }

    const matchingLanguages = (extension!.packageJSON.contributes.languages as any[]).filter(
      language => language.extensions.indexOf("." + textEditor.document.languageId) > -1
    );

    return matchingLanguages.length > 0;
  }

  private static closeDefaultTextEditorAndOpenCustomWebviewEditor(
    textEditor: vscode.TextEditor,
    context: vscode.ExtensionContext
  ) {
    vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
      return CustomEditor.create(textEditor.document.uri.path, context);
    });
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

  private router = new Map<string, LanguageData>([
    [
      "dmn",
      {
        editorId: "DMNDiagramEditor",
        gwtModuleName: "org.kie.workbench.common.dmn.showcase.DMNShowcase",
        erraiDomain: "http://localhost:8080",
        resources: [
          {
            type: "css",
            paths: ["http://localhost:8080/org.kie.workbench.common.dmn.showcase.DMNShowcase/css/patternfly.min.css"]
          },
          {
            type: "js",
            paths: [
              "http://localhost:8080/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/ace.js",
              "http://localhost:8080/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/theme-chrome.js",
              "http://localhost:8080/org.kie.workbench.common.dmn.showcase.DMNShowcase/org.kie.workbench.common.dmn.showcase.DMNShowcase.nocache.js"
            ]
          }
        ]
      }
    ]
  ]);

  private setupPanelEvents(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      this._panel.webview.onDidReceiveMessage(
        (message: any) => {
          switch (message.type) {
            case "REQUEST_LANGUAGE":
              const split = this._path.split(".");
              const languageData = this.router.get(split[split.length - 1]);
              this._panel.webview.postMessage({ type: "RETURN_LANGUAGE", data: languageData });
              break;
            case "RETURN_GET_CONTENT":
              fs.writeFileSync(this._path, message.data);
              vscode.window.setStatusBarMessage("Saved successfully!", 3000);
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
            </head>
            <body>
            <div id="app"></div>
            <script src="${webviewIndexPath.toString()}"></script>
            </body>
        </html>
    `;
  }
}
