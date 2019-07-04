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

export interface BusinessCentralClientEditorFactory {
  get(): BusinessCentralClientEditor;
}

export interface BusinessCentralClientEditor {
  getContent(): Promise<string>;
  setContent(content: string): void;
  isDirty(): boolean;
}

export class GwtAppFormerEditor extends AppFormer.Editor {
  public af_componentTitle: string;

  private businessCentralClientEditor: BusinessCentralClientEditor;

  constructor(erraiCdiBeanName: string) {
    super("appformer-gwt-client-editor");
    this.af_componentTitle = "GwtMicroEditor";
    this.af_isReact = true;
    this.businessCentralClientEditor = window.gwtEditorBeans.get(erraiCdiBeanName)!.get();
  }

  public af_onOpen(): void {
    this.removeBusinessCentralHeaderPanel();
    this.removeBusinessCentralPanelHeader();
  }

  public af_componentRoot(): AppFormer.Element {
    //Component will already be rendered when the script loads.
    return <></>;
  }

  public getContent(): Promise<string> {
    return this.businessCentralClientEditor.getContent();
  }

  public isDirty(): boolean {
    return this.businessCentralClientEditor.isDirty();
  }

  public setContent(content: string): Promise<void> {
    this.businessCentralClientEditor.setContent(content.trim());
    return Promise.resolve();
  }

  private removeBusinessCentralHeaderPanel() {
    const headerPanel = document.getElementById("workbenchHeaderPanel");
    if (headerPanel) {
      const parentNode = headerPanel.parentNode as HTMLElement;
      if (parentNode) {
        parentNode.remove();
      }
    }
  }

  private removeBusinessCentralPanelHeader() {
    setTimeout(() => {
      const panelHeader = document.querySelector(".panel-heading.uf-listbar-panel-header");
      if (panelHeader) {
        panelHeader.remove();
      }
    }, 100);
  }
}
