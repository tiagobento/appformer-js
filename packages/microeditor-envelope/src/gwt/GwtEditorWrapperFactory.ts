import { AppFormerGwtApi } from "./AppFormerGwtApi";
import { LanguageData } from "appformer-js-microeditor-router/src";
import * as AppFormer from "appformer-js-core";
import { GwtEditorWrapper } from "./GwtEditorWrapper";
import { EditorFactory } from "../EditorFactory";

export class GwtEditorWrapperFactory implements EditorFactory {
  private readonly appFormerGwtApi: AppFormerGwtApi;

  constructor(appFormerGwtApi: AppFormerGwtApi) {
    this.appFormerGwtApi = appFormerGwtApi;
  }

  public createEditor(languageData: LanguageData) {
    return new Promise<AppFormer.Editor>(res => {
      this.appFormerGwtApi.setErraiDomain(languageData.erraiDomain); //needed only for backend communication

      this.appFormerGwtApi.onFinishedLoading(() => {
        res(new GwtEditorWrapper(this.appFormerGwtApi.getEditor(languageData.editorId)));
        return Promise.resolve();
      });

      this.appFormerGwtApi.loadResources(languageData.resources);
    });
  }
}
