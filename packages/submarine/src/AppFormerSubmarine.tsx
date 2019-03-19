import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";

import { App } from "./app/App";

export class AppFormerSubmarine implements AppFormer.AppFormer {
  private app?: App;

  public goTo(af_componentId: string, args?: Map<string, any>): void {
    throw new Error("Go-tos are not supported by this AppFormer.js distribution.");
  }

  public registerPerspective(perspective: AppFormer.Perspective): void {
    throw new Error("Perspectives are not supported by this AppFormer.js distribution.");
  }

  public registerScreen(screen: AppFormer.Screen): void {
    throw new Error("Screens are not supported by this AppFormer.js distribution.");
  }

  public registerEditor(Editor: { new (): AppFormer.Editor }) {
    const editor = new Editor();
    return this.app!.register(editor).then(() => editor);
  }

  public getEditor(): AppFormer.Editor | undefined {
    return this.app!.getEditor();
  }

  public static init(container: HTMLElement): Promise<AppFormerSubmarine> {
    return Promise.resolve().then(() => {
      const appFormerSubmarine = new AppFormerSubmarine();
      return new Promise(res =>
        ReactDOM.render(<App exposing={self => (appFormerSubmarine.app = self)} />, container, res)
      ).then(() => (window.AppFormer.Submarine = appFormerSubmarine));
    });
  }
}
