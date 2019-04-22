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

import { LanguageData } from "./LanguageData";

export * from "./LanguageData";

export const services = {
  microeditor_envelope: "http://localhost:9000",
  web: "http://localhost:9001",
  web_backend: "http://localhost:9002",
  microeditors: "http://localhost:9003",
  functions: "http://localhost:9004"
};

export const router = new Map<string, LanguageData>([
  [
    "dmn",
    {
      editorId: "DMNDiagramEditor",
      gwtModuleName: "org.kie.workbench.common.dmn.showcase.DMNShowcase",
      erraiDomain: services.microeditors,
      resources: [
        {
          type: "css",
          paths: [`${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/css/patternfly.min.css`]
        },
        {
          type: "js",
          paths: [
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/ace.js`,
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/theme-chrome.js`,
            `${
              services.microeditors
            }/org.kie.workbench.common.dmn.showcase.DMNShowcase/org.kie.workbench.common.dmn.showcase.DMNShowcase.nocache.js`
          ]
        }
      ]
    }
  ],
  //FIXME: We're creating a `bpmn` entry pointing to the same entry of `dmn`. When we have a working bpmn editor, we can change that.
  [
    "bpmn",
    {
      editorId: "DMNDiagramEditor",
      gwtModuleName: "org.kie.workbench.common.dmn.showcase.DMNShowcase",
      erraiDomain: services.microeditors,
      resources: [
        {
          type: "css",
          paths: [`${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/css/patternfly.min.css`]
        },
        {
          type: "js",
          paths: [
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/ace.js`,
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/theme-chrome.js`,
            `${
              services.microeditors
            }/org.kie.workbench.common.dmn.showcase.DMNShowcase/org.kie.workbench.common.dmn.showcase.DMNShowcase.nocache.js`
          ]
        }
      ]
    }
  ],
  //FIXME: We're creating a `bpmn2` entry pointing to the same entry of `dmn`. When we have a working bpmn2 editor, we can change that.
  [
    "bpmn2",
    {
      editorId: "DMNDiagramEditor",
      gwtModuleName: "org.kie.workbench.common.dmn.showcase.DMNShowcase",
      erraiDomain: services.microeditors,
      resources: [
        {
          type: "css",
          paths: [`${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/css/patternfly.min.css`]
        },
        {
          type: "js",
          paths: [
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/ace.js`,
            `${services.microeditors}/org.kie.workbench.common.dmn.showcase.DMNShowcase/ace/theme-chrome.js`,
            `${
              services.microeditors
            }/org.kie.workbench.common.dmn.showcase.DMNShowcase/org.kie.workbench.common.dmn.showcase.DMNShowcase.nocache.js`
          ]
        }
      ]
    }
  ]
]);
