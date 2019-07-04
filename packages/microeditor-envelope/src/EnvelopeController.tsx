import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { EnvelopeView } from "./EnvelopeView";
import { EnvelopeBusInnerMessageHandler } from "./EnvelopeBusInnerMessageHandler";
import { EnvelopeBusApi } from "appformer-js-microeditor-envelope-protocol";
import { LanguageData } from "appformer-js-microeditor-router/src";
import { GwtEditorWrapper } from "./GwtEditorWrapper";
import { AppFormerGwtApi } from "./AppFormerGwtApi";

export class EnvelopeController {
  private static ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT = 100;

  private readonly envelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;
  private envelopeView?: EnvelopeView;
  private appFormerGwtApi: AppFormerGwtApi;

  constructor(busApi: EnvelopeBusApi, appFormerGwtApi: AppFormerGwtApi) {
    this.appFormerGwtApi = appFormerGwtApi;
    this.envelopeBusInnerMessageHandler = new EnvelopeBusInnerMessageHandler(busApi, self =>
      this.setupEnvelopeBusInnerMessageHandler(self)
    );
  }

  private setupEnvelopeBusInnerMessageHandler(self: EnvelopeBusInnerMessageHandler) {
    return {
      receive_contentResponse: (content: string) => {
        const editor = this.getEditor();
        if (editor) {
          editor
            .setContent("")
            .then(() => this.waitForEmptySetContentThenSetLoadingFinished())
            .then(() => editor.setContent(content));
        }
      },
      receive_contentRequest: () => {
        const editor = this.getEditor();
        if (editor) {
          editor.getContent().then(content => self.respond_contentRequest(content));
        }
      },
      receive_languageResponse: (languageData: LanguageData) => {
        this.appFormerGwtApi.setErraiDomain(languageData.erraiDomain); //needed only for backend communication

        this.appFormerGwtApi.onFinishedLoading(() => {
          return Promise.resolve()
            .then(() => this.openEditor(new GwtEditorWrapper(this.appFormerGwtApi.getEditor(languageData.editorId))))
            .then(() => self.request_contentResponse());
        });

        this.appFormerGwtApi.loadResources(languageData.resources);
      }
    };
  }

  private waitForEmptySetContentThenSetLoadingFinished() {
    return new Promise(res => {
      setTimeout(
        () => this.envelopeView!.setLoadingFinished().then(res),
        EnvelopeController.ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT
      );
    });
  }

  private openEditor(editor: AppFormer.Editor) {
    //TODO: Create messages to control the lifecycle of enveloped components?
    //TODO: No-op when same Editor class?
    //TODO: What about close and shutdown methods?

    editor.af_onStartup();
    return this.envelopeView!.setEditor(editor).then(() => editor.af_onOpen());
  }

  private getEditor() {
    return this.envelopeView!.getEditor();
  }

  public renderView(container: HTMLElement) {
    return new Promise<EnvelopeController>(resolve =>
      ReactDOM.render(<EnvelopeView exposing={self => (this.envelopeView = self)} />, container, () => {
        this.envelopeBusInnerMessageHandler.startListening();
        resolve();
      })
    );
  }
}
