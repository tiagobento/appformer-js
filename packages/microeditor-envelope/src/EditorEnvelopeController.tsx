import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { EditorEnvelopeView } from "./EditorEnvelopeView";
import { EnvelopeBusInnerMessageHandler } from "./EnvelopeBusInnerMessageHandler";
import { EnvelopeBusApi } from "appformer-js-microeditor-envelope-protocol";
import { LanguageData } from "appformer-js-microeditor-router";
import { EditorFactory } from "./EditorFactory";
import { SpecialDomElements } from "./SpecialDomElements";

export class EditorEnvelopeController {
  private static ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT = 100;

  private readonly envelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;
  private readonly editorFactory: EditorFactory;

  private editorEnvelopeView?: EditorEnvelopeView;

  constructor(busApi: EnvelopeBusApi, editorFactory: EditorFactory) {
    this.editorFactory = editorFactory;
    this.envelopeBusInnerMessageHandler = new EnvelopeBusInnerMessageHandler(busApi, self => ({
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
        this.editorFactory
          .createEditor(languageData)
          .then(editor => this.open(editor))
          .then(() => self.request_contentResponse());
      }
    }));
  }

  private waitForEmptySetContentThenSetLoadingFinished() {
    return new Promise(res => {
      setTimeout(
        () => this.editorEnvelopeView!.setLoadingFinished().then(res),
        EditorEnvelopeController.ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT
      );
    });
  }

  //TODO: Create messages to control the lifecycle of enveloped components?
  //TODO: No-op when same Editor class?
  //TODO: Can I open an editor if there's already an open one?
  //TODO: What about close and shutdown methods?
  private open(editor: AppFormer.Editor) {
    return this.editorEnvelopeView!.setEditor(editor).then(() => {
      editor.af_onStartup();
      editor.af_onOpen();
    });
  }

  private getEditor() {
    return this.editorEnvelopeView!.getEditor();
  }

  public renderView(container: HTMLElement, specialDomElements: SpecialDomElements) {
    return new Promise<EditorEnvelopeController>(resolve =>
      ReactDOM.render(
        <EditorEnvelopeView
          exposing={self => (this.editorEnvelopeView = self)}
          loadingScreenContainer={specialDomElements.loadingScreenContainer}
        />,
        container,
        () => {
          this.envelopeBusInnerMessageHandler.startListening();
          resolve();
        }
      )
    );
  }
}
