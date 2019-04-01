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

export const router = new Map<string, LanguageData>([
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
