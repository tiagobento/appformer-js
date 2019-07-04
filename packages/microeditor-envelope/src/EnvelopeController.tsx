import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { EnvelopeView } from "./EnvelopeView";
import { EnvelopeBusInnerMessageHandler } from "./EnvelopeBusInnerMessageHandler";
import { Resource } from "appformer-js-microeditor-router";
import { EnvelopeBusApi } from "appformer-js-microeditor-envelope-protocol";
import { LanguageData } from "appformer-js-microeditor-router/src";
import { GwtAppFormerEditor } from "./GwtAppFormerEditor";

export class EnvelopeController {
  private static ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT = 100;

  private readonly envelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;
  private envelopeView?: EnvelopeView;

  constructor(busApi: EnvelopeBusApi) {
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
        window.erraiBusApplicationRoot = languageData.erraiDomain; //needed only for backend communication

        window.appFormerGwtFinishedLoading = () => {
          return Promise.resolve()
            .then(() => this.openEditor(new GwtAppFormerEditor(languageData.editorId)))
            .then(() => self.request_contentResponse());
        };

        languageData.resources.forEach(resource => {
          this.loadResource(resource);
        });
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
    console.info(`${editor.af_componentId} - STARTUP`);

    return this.envelopeView!.setEditor(editor).then(() => {
      editor.af_onOpen();
      console.info(`${editor.af_componentId} - OPEN`);

      return editor;
    });
  }

  private getEditor(): AppFormer.Editor | undefined {
    return this.envelopeView!.getEditor();
  }

  private loadResource(resource: Resource) {
    resource.paths.forEach(path => {
      switch (resource.type) {
        case "css":
          const link = document.createElement("link");
          link.href = path;
          link.rel = "text/css";
          document.body.appendChild(link);
          break;
        case "js":
          const script = document.createElement("script");
          script.src = path;
          script.type = "text/javascript";
          document.body.appendChild(script);
          break;
      }
    });
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
