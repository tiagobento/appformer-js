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

import { Component, Element, Perspective, Screen } from "appformer-js-core";
import { marshall, Portable } from "./marshalling";
import { AppFormerGwt } from "./AppFormerGwt";

export * from "appformer-js-core";
export * from "./marshalling";
export * from "./java-wrappers";
export * from "./util";

const self = this;

declare global {
  export interface Window {
    appFormerGwtBridge: AppFormerGwt;
  }
  export interface AppFormer {
    Gwt: typeof self;
  }
}

const singleton = window.appFormerGwtBridge;

export function register(component: Component) {
  if (component.type === "screen") {
    singleton!.registerScreen(component as Screen);
  } else if (component.type === "perspective") {
    singleton!.registerPerspective(component as Perspective);
  }
}

export function goTo(af_componentId: string) {
  singleton.goTo(af_componentId);
}

export function close(af_componentId: string) {
  singleton.close(af_componentId);
}

export function translate(key: string, args: string[]) {
  return singleton.translate(key, args);
}

export function render(element: Element, container: HTMLElement, callback = (): void => undefined) {
  singleton.render(element, container, callback);
}

export function fireEvent<T>(obj: Portable<T>) {
  singleton.fireEvent(marshall(obj) as any);
}

export function rpc(path: string, args: Array<Portable<any>>) {
  return singleton.rpc(path, args);
}

// Exposes this module as a global variable
window.AppFormer.Gwt = this;
