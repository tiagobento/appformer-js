import * as AppFormer from "appformer-js-core";
import { App } from "./app/App";

export class AppFormerSubmarine implements AppFormer.AppFormer {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  public goTo(af_componentId: string, args?: Map<string, any>): void {
    //
  }

  public registerPerspective(perspective: AppFormer.Perspective): void {
    throw new Error("Perspectives are not supported by this AppFormer.js distribution.");
  }

  public registerScreen(screen: AppFormer.Screen): void {
    throw new Error("Screens are not supported by this AppFormer.js distribution.");
  }

  public registerEditor(editor: AppFormer.Editor): void {
    this.app.register(editor);
  }

  public getEditor(): AppFormer.Editor | undefined {
    return this.app.getEditor();
  }
}
