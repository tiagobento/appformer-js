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
import { LocalRouter } from "./LocalRouter";
import { EnvelopeBusOuterMessageHandler } from "appformer-js-microeditor-envelope-protocol";

export class KogitoEditor {
  public readonly path: string;
  public readonly context: vscode.ExtensionContext;
  public readonly router: LocalRouter;
  public readonly envelopeBusOuterMessageHandler: EnvelopeBusOuterMessageHandler;
  public panel?: vscode.WebviewPanel;

  public constructor(path: string, context: vscode.ExtensionContext) {
    this.path = path;
    this.context = context;
    this.router = new LocalRouter(context);
    this.envelopeBusOuterMessageHandler = new EnvelopeBusOuterMessageHandler(self => ({
      send: msg => {
        if (this.panel) {
          this.panel.webview.postMessage(msg);
        } else {
          console.info("Message not delivered because panel is not set.");
        }
      },
      pollInit: () => {
        self.request_initResponse("vscode");
      },
      receive_languageRequest: () => {
        const fileExtension = this.path.split(".").pop()!;
        self.respond_languageRequest(this.router.getLanguageData(fileExtension));
      },
      receive_getContentResponse: (content: string) => {
        fs.writeFileSync(this.path, content);
        vscode.window.setStatusBarMessage("Saved successfully!", 3000);
      },
      receive_setContentRequest: () => {
        self.respond_setContentRequest(fs.readFileSync(this.path).toString());
      }
    }));
  }

  public open() {
    this.panel = vscode.window.createWebviewPanel(
      "kogito-editor", // Identifies the type of the webview. Used internally by VsCode
      this.panelTitle(), // Title of the panel displayed to the user
      { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, // Editor column to show the new webview panel in.
      { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );
  }

  public setupMessageBus() {
    this.envelopeBusOuterMessageHandler.startInitPolling();
    this.context.subscriptions.push(
      this.panel!.webview.onDidReceiveMessage(
        msg => this.envelopeBusOuterMessageHandler.receive(msg),
        this,
        this.context.subscriptions
      )
    );
  }

  public setupPanelViewStateChanged(onPanelViewStateChanged: (panelBecameActive: boolean) => void) {
    return this.panel!.onDidChangeViewState(
      () => onPanelViewStateChanged(this.panel!.active),
      this,
      this.context.subscriptions
    );
  }

  public requestSave() {
    if (this.path.length > 0) {
      this.envelopeBusOuterMessageHandler.request_getContentResponse();
    } else {
      console.info("Save skipped because path is empty.");
    }
  }

  private panelTitle() {
    return this.path.split("/").pop()! + " 🦉";
  }

  private getWebviewIndexJsPath() {
    return this.router.getRelativePathTo("dist/webview/index.js").toString();
  }

  public setupWebviewContent() {
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
            <div id="microeditor-envelope-container"></div>
            <script src="${this.getWebviewIndexJsPath()}"></script>
            </body>
        </html>
    `;
  }
}
