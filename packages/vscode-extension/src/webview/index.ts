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

import { AppFormerBusMessage, AppFormerSubmarine } from "appformer-js-submarine";
import { AppFormerGwtEditor, BusinessCentralClientEditorFactory } from "./AppFormerGwtEditor";
import { LanguageData, Resource } from "appformer-js-router";

//Exposed API of AppFormerGwt
declare global {
  interface Window {
    gwtEditorBeans: Map<string, BusinessCentralClientEditorFactory>;
    appFormerGwtFinishedLoading: () => any;
    erraiBusApplicationRoot: string;
  }
}

function removeWorkbenchHeaderPanel() {
  const elementById = document.getElementById("workbenchHeaderPanel");
  if (elementById) {
    const parentNode = elementById.parentNode as HTMLElement;
    if (parentNode) {
      parentNode.remove();
    }
  }
}

function messageHandler(appFormer: AppFormerSubmarine, event: { data: AppFormerBusMessage<any> }) {
  const message = event.data;
  const editor = appFormer.getEditor();

  function loadResource(resource: Resource) {
    resource.paths.forEach(path => {
      switch (resource.type) {
        case "css":
          const link = document.createElement("link");
          link.href = path;
          link.rel = "text/css";
          document.body.appendChild(link);
          break;
        case "js":
          const script = document.createElement("script");
          script.src = path;
          script.type = "text/javascript";
          document.body.appendChild(script);
          break;
        default:
      }
    });
  }

  switch (message.type) {
    case "RETURN_LANGUAGE":
      const languageData = message.data as LanguageData;
      window.erraiBusApplicationRoot = languageData.erraiDomain;
      window.appFormerGwtFinishedLoading = () => {
        Promise.resolve()
          .then(() => removeWorkbenchHeaderPanel())
          .then(() => appFormer.registerEditor(() => new AppFormerGwtEditor(languageData.editorId)))
          .then(() => appFormer.postMessage({ type: "REQUEST_SET_CONTENT", data: undefined }));
      };

      languageData.resources.forEach(resource => {
        loadResource(resource);
      });

      return Promise.resolve();
    case "RETURN_SET_CONTENT":
      if (!editor) {
        console.info(`Message was received when no editor was registered: "${message.type}"`);
        return Promise.resolve();
      }
      return editor.setContent(message.data);
    case "REQUEST_GET_CONTENT":
      if (!editor) {
        console.info(`Message was received when no editor was registered: "${message.type}"`);
        return Promise.resolve();
      }
      return editor.getContent().then(content => appFormer.postMessage({ type: "RETURN_GET_CONTENT", data: content }));
    default:
      console.info(`Unknown message type received: ${message.type}"`);
      return Promise.resolve();
  }
}

AppFormerSubmarine.init(document.getElementById("app")!).then(appFormer => {
  appFormer.handleMessages(messageHandler).then(() => {
    return appFormer.postMessage({ type: "REQUEST_LANGUAGE", data: undefined });
  });
});
