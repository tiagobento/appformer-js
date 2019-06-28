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
import { router } from "appformer-js-microeditor-router";
import { EnvelopeBusConsumer } from "appformer-js-microeditor-envelope-protocol";

export class KogitoEditor {
  public readonly path: string;
  public readonly envelopeBusConsumer: EnvelopeBusConsumer;
  public panel?: vscode.WebviewPanel;

  public constructor(path: string) {
    this.path = path;
    this.envelopeBusConsumer = new EnvelopeBusConsumer(_this => ({
      send: msg => {
        if (this.panel) {
          this.panel.webview.postMessage(msg);
        }
      },
      pollInit: () => {
        _this.request_initResponse("vscode");
      },
      receive_languageRequest: () => {
        _this.respond_languageRequest(router.get(this.path.split(".").pop()!));
      },
      receive_getContentResponse: (content: string) => {
        fs.writeFileSync(this.path, content);
        vscode.window.setStatusBarMessage("Saved successfully!", 3000);
      },
      receive_setContentRequest: () => {
        _this.respond_setContentRequest(fs.readFileSync(this.path).toString());
      }
    }));
  }

  public open() {
    this.panel = vscode.window.createWebviewPanel(
        "kogito-editor", // Identifies the type of the webview. Used internally
        this.fileNameWithExtension() + " 🦉", // Title of the panel displayed to the user
        { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, // Editor column to show the new webview panel in.
        { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );
  }

  public setupMessageBus(context: vscode.ExtensionContext) {
    this.envelopeBusConsumer.init();
    context.subscriptions.push(
      this.panel!.webview.onDidReceiveMessage(msg => this.envelopeBusConsumer.receive(msg), this, context.subscriptions)
    );
  }

  public setupPanelViewStateChanged(
    context: vscode.ExtensionContext,
    onPanelViewStateChanged: (isPanelActive: boolean) => void
  ) {
    return this.panel!.onDidChangeViewState(
      () => onPanelViewStateChanged(this.panel!.active),
      this,
      context.subscriptions
    );
  }

  public requestSave() {
    if (this.path.length > 0) {
      this.envelopeBusConsumer.request_getContentResponse();
    }
  }

  private fileNameWithExtension() {
    return this.path.split("/").pop()!;
  }

  public setupWebviewContent(context: vscode.ExtensionContext) {
    const webviewIndexPath = vscode.Uri.file(__path.join(context.extensionPath, "dist", "webview", "index.js")).with({
      scheme: "vscode-resource"
    });

    this.panel!.webview.html = `
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
