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

import * as React from "react";
import * as AppFormer from "appformer-js-core";

export class DomBasedEditor extends AppFormer.Editor {
  public af_componentTitle: string;
  public contentDiv: HTMLDivElement;

  constructor() {
    super("dom-based-editor");
    this.af_isReact = false;
    this.af_componentTitle = "XML Editor";
    this.contentDiv = document.createElement("div");
    this.contentDiv.innerHTML = "";
  }

  public af_componentRoot(): AppFormer.Element {
    const div = document.createElement("div");
    div.appendChild(this.contentDiv);

    return div;
  }

  public isDirty(): boolean {
    return false;
  }

  public getContent() : Promise<string> {
    return Promise.resolve(this.contentDiv.innerHTML!);
  }

  public setContent(content: string): void {
    this.contentDiv.innerHTML = content;
  }
}
