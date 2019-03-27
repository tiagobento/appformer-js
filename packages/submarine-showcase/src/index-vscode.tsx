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

import { AppFormerSubmarine } from "appformer-js-submarine";
import { AppFormerGwtEditor, BusinessCentralClientEditorFactory } from "./vscode-ext2/AppFormerGwtEditor";

//Exposed API of AppFormerGwt
declare global {
  interface Window {
    gwtEditorBeans: Map<string, BusinessCentralClientEditorFactory>;
    appFormerGwtFinishedLoading: () => any;
    erraiBusApplicationRoot: string;
  }
}

//Exposed API of Visual Studio Code
declare global {
  export const acquireVsCodeApi: () => any;
}

function loadGwtEditor(gwtModuleName: string): Promise<void> {
  const script = document.createElement("script");
  script.src = `${window.erraiBusApplicationRoot}/${gwtModuleName}/${gwtModuleName}.nocache.js`;
  document.body.appendChild(script);
  return Promise.resolve();
}

function handleEvents(vscode: any, appFormer: AppFormerSubmarine, event: any) {
  const message = event.data; // The JSON data VsCode sent
  const editor = appFormer.getEditor();

  if (!editor) {
    console.info(`Message was received when no editor was registered: "${message.type}"`);
    return;
  }

  console.info("index: " + message.type);
  switch (message.type) {
    case "RETURN_SET_CONTENT":
      editor.setContent(message.data);
      break;
    case "REQUEST_GET_CONTENT":
      editor.getContent().then(content => vscode.postMessage({ type: "RETURN_GET_CONTENT", data: content }));
      break;
  }
}

AppFormerSubmarine.init(document.getElementById("app")!).then(appFormer => {
  let vscode: any;
  try {
    vscode = acquireVsCodeApi ? acquireVsCodeApi() : undefined;
  } catch (e) {
    vscode = { postMessage: (...args: any[]) => { /**/ } };
  }

  window.erraiBusApplicationRoot = "http://localhost:8080";
  window.appFormerGwtFinishedLoading = () => {
    appFormer
      .registerEditor(() => new AppFormerGwtEditor("EditorPresenter"))
      .then(() => vscode.postMessage({ type: "REQUEST_SET_CONTENT" }));
  };

  return loadGwtEditor("org.uberfire.editor.StandaloneEditor").then(() => {
    window.addEventListener("message", event => handleEvents(vscode, appFormer, event));
  });
});