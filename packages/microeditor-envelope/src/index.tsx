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

import { EnvelopeBusMessage } from "appformer-js-microeditor-envelope-protocol";
import { AppFormerKogitoEnvelope } from "./AppFormerKogitoEnvelope";
import { BusinessCentralClientEditorFactory, GwtMicroEditor } from "./GwtMicroEditor";
import { LanguageData, Resource } from "appformer-js-microeditor-router";
import { EnvelopeBusMessageType } from "appformer-js-microeditor-envelope-protocol";

declare global {
  export interface AppFormer {
    KogitoEnvelope: AppFormerKogitoEnvelope;
  }
}

//Exposed API of AppFormerGwt
declare global {
  interface Window {
    gwtEditorBeans: Map<string, BusinessCentralClientEditorFactory>;
    appFormerGwtFinishedLoading: () => any;
    erraiBusApplicationRoot: string;
  }
}

function removeBusinessCentralHeaderPanel() {
  const headerPanel = document.getElementById("workbenchHeaderPanel");
  if (headerPanel) {
    const parentNode = headerPanel.parentNode as HTMLElement;
    if (parentNode) {
      parentNode.remove();
    }
  }
}
function removeBusinessCentralPanelHeader() {
  setTimeout(() => {
    const panelHeader = document.querySelector(".panel-heading.uf-listbar-panel-header");
    if (panelHeader) {
      panelHeader.remove();
    }
  }, 1000);
}

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

let initializing = false;

function messageHandler(kogitoEnvelope: AppFormerKogitoEnvelope, event: { data: EnvelopeBusMessage<any> }) {
  const message = event.data;
  const editor = kogitoEnvelope.getEditor();

  switch (message.type) {
    case EnvelopeBusMessageType.REQUEST_INIT:
      if (!initializing) {
        initializing = true;
        const targetOrigin = message.data as string;
        kogitoEnvelope.setTargetOrigin(targetOrigin);
        return kogitoEnvelope.postMessage({ type: EnvelopeBusMessageType.RETURN_INIT, data: undefined }).then(() => {
          return kogitoEnvelope.postMessage({ type: EnvelopeBusMessageType.REQUEST_LANGUAGE, data: undefined });
        });
      }
      return Promise.resolve();
    case EnvelopeBusMessageType.RETURN_LANGUAGE:
      const languageData = message.data as LanguageData;
      window.erraiBusApplicationRoot = languageData.erraiDomain; //needed only for backend communication

      window.appFormerGwtFinishedLoading = () => {
        Promise.resolve()
          .then(() => removeBusinessCentralHeaderPanel())
          .then(() => kogitoEnvelope.registerEditor(() => new GwtMicroEditor(languageData.editorId)))
          .then(() => kogitoEnvelope.postMessage({ type: EnvelopeBusMessageType.REQUEST_SET_CONTENT, data: undefined }))
          .then(() => removeBusinessCentralPanelHeader());
      };

      languageData.resources.forEach(resource => {
        loadResource(resource);
      });

      return Promise.resolve();
    case EnvelopeBusMessageType.RETURN_SET_CONTENT:
      if (!editor) {
        console.info(`Message was received when no editor was registered: "${message.type}"`);
        return Promise.resolve();
      }
      return editor.setContent(message.data);
    case EnvelopeBusMessageType.REQUEST_GET_CONTENT:
      if (!editor) {
        console.info(`Message was received when no editor was registered: "${message.type}"`);
        return Promise.resolve();
      }
      return editor
        .getContent()
        .then(content => kogitoEnvelope.postMessage({ type: EnvelopeBusMessageType.RETURN_GET_CONTENT, data: content }));
    default:
      console.info(`Unknown message type received: ${message.type}"`);
      return Promise.resolve();
  }
}

export function init(container: HTMLElement) {
  AppFormerKogitoEnvelope.init(container).then(kogitoEnvelope => {
    return kogitoEnvelope.handleMessages(messageHandler);
  });
}
