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
import { AppFormerBusMessage } from "appformer-js-submarine";
import { KieEditorsExtension } from "./KieEditorsExtension";

export class CustomEditor {
  public readonly _panel: vscode.WebviewPanel;
  public readonly _path: string;

  public constructor(panel: vscode.WebviewPanel, path: string) {
    this._panel = panel;
    this._path = path;
  }

  public setupPanelEvents(context: vscode.ExtensionContext) {
    const initPolling = setInterval(() => {
      const initMessage = { type: "REQUEST_INIT", data: "vscode" };
      this._panel.webview.postMessage(initMessage);
    }, 1000);

    context.subscriptions.push(
      this._panel.webview.onDidReceiveMessage(
        (message: AppFormerBusMessage<any>) => {
          switch (message.type) {
            case "RETURN_INIT":
              clearInterval(initPolling);
              break;
            case "REQUEST_LANGUAGE":
              const split = this._path.split(".");
              const languageData = router.get(split[split.length - 1]);
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
            KieEditorsExtension.activeCustomEditor = this;
          } else if (KieEditorsExtension.activeCustomEditor && KieEditorsExtension.activeCustomEditor._path === this._path) {
            KieEditorsExtension.activeCustomEditor = undefined;
          }
        },
        this,
        context.subscriptions
      )
    );
  }

  public requestSave() {
    this._panel.webview.postMessage({ type: "REQUEST_GET_CONTENT" })
  }

  public setupWebviewContent(context: vscode.ExtensionContext) {
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
