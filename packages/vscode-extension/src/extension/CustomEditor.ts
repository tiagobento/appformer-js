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
import { EnvelopeBusConsumer } from "./EnvelopeBusConsumer";

export class CustomEditor {
  public readonly _panel: vscode.WebviewPanel;
  public readonly _path: string;
  public readonly envelopeBusConsumer: EnvelopeBusConsumer;
  private readonly setActiveCustomEditor: (c?: CustomEditor) => void;
  private readonly isActiveCustomEditor: (e: CustomEditor) => boolean;

  public constructor(
    panel: vscode.WebviewPanel,
    path: string,
    setActiveCustomEditor: (c: CustomEditor) => void,
    isActiveCustomEditor: (e: CustomEditor) => boolean
  ) {
    this._panel = panel;
    this._path = path;
    this.setActiveCustomEditor = setActiveCustomEditor;
    this.isActiveCustomEditor = isActiveCustomEditor;
    this.envelopeBusConsumer = new EnvelopeBusConsumer(_this => ({
      send: msg => {
        this._panel.webview.postMessage(msg);
      },
      request_init: () => {
        _this.request_initResponse("vscode");
      },
      receive_languageRequest: () => {
        const split = this._path.split(".");
        _this.respond_languageRequest(router.get(split[split.length - 1]));
      },
      receive_getContentResponse: (content: string) => {
        fs.writeFileSync(this._path, content);
        vscode.window.setStatusBarMessage("Saved successfully!", 3000);
      },
      receive_setContentRequest: () => {
        const content = fs.readFileSync(this._path);
        _this.respond_setContentRequest(content.toString());
      }
    }));
  }

  public setupPanelEvents(context: vscode.ExtensionContext) {
    this.envelopeBusConsumer.init();
    context.subscriptions.push(this.setupEnvelopeBusConsumerAsMessageHandler(context));
    context.subscriptions.push(this.setupPanelViewStateChanged(context));
  }

  private setupEnvelopeBusConsumerAsMessageHandler(context: vscode.ExtensionContext) {
    return this._panel.webview.onDidReceiveMessage(
      msg => this.envelopeBusConsumer.receive(msg),
      this,
      context.subscriptions
    );
  }

  private setupPanelViewStateChanged(context: vscode.ExtensionContext) {
    return this._panel.onDidChangeViewState(
      () => {
        if (this._panel.active) {
          this.setActiveCustomEditor(this);
        } else if (this.isActiveCustomEditor(this)) {
          this.setActiveCustomEditor(undefined);
        }
      },
      this,
      context.subscriptions
    );
  }

  public requestSave() {
    this.envelopeBusConsumer.request_getContentResponse();
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
