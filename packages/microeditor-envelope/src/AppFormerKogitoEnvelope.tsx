import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { Envelope } from "./app/Envelope";
import { EnvelopeBusInnerMessageHandler } from "./EnvelopeBusInnerMessageHandler";
import { Resource } from "appformer-js-microeditor-router";
import { EnvelopeBusApi } from "appformer-js-microeditor-envelope-protocol";
import { LanguageData } from "appformer-js-microeditor-router/src";
import { GwtAppFormerEditor } from "./GwtAppFormerEditor";

export class AppFormerKogitoEnvelope {
  private envelope?: Envelope;
  public readonly envelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;

  constructor(busApi: EnvelopeBusApi) {
    this.envelopeBusInnerMessageHandler = new EnvelopeBusInnerMessageHandler(busApi, self =>
      this.setupEnvelopeBusInnerMessageHandler(self)
    );
  }

  private setupEnvelopeBusInnerMessageHandler(self: EnvelopeBusInnerMessageHandler) {
    return {
      receive_setContentResponse: (content: string) => {
        const editor = this.getEditor();
        if (editor) {
          editor.setContent(content);
        }
      },
      receive_getContentRequest: () => {
        const editor = this.getEditor();
        if (editor) {
          editor.getContent().then(content => self.respond_getContentRequest(content));
        }
      },
      receive_languageResponse: (languageData: LanguageData) => {
        window.erraiBusApplicationRoot = languageData.erraiDomain; //needed only for backend communication

        window.appFormerGwtFinishedLoading = () => {
          return Promise.resolve()
            .then(() => this.registerEditor(() => new GwtAppFormerEditor(languageData.editorId)))
            .then(() => self.request_setContentResponse());
        };

        languageData.resources.forEach(resource => {
          this.loadResource(resource);
        });
      }
    };
  }

  public startListeningOnMessageBus() {
    this.envelopeBusInnerMessageHandler.startListening();
  }

  public registerEditor(editorDelegate: () => AppFormer.Editor) {
    //TODO: Create messages to control the lifecycle of enveloped components?
    //TODO: No-op when same Editor class?

    const editor = editorDelegate.apply(this);
    const previousEditor = this.getEditor();

    if (previousEditor) {
      previousEditor.af_onClose();
      console.info(`${previousEditor.af_componentId} - CLOSE`);

      previousEditor!.af_onShutdown();
      console.info(`${previousEditor!.af_componentId} - SHUTDOWN`);
    }

    editor.af_onStartup();
    console.info(`${editor.af_componentId} - STARTUP`);

    return this.envelope!.register(editor).then(() => {
      editor.af_onOpen();
      console.info(`${editor.af_componentId} - OPEN`);

      return editor;
    });
  }

  private getEditor(): AppFormer.Editor | undefined {
    return this.envelope!.getEditor();
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

  public static init(args: Args): Promise<AppFormerKogitoEnvelope> {
    window.erraiBusRemoteCommunicationEnabled = !args.clientSideOnly;

    const kogitoEnvelope = new AppFormerKogitoEnvelope(args.busApi);

    return Promise.resolve()
      .then(() => this.renderEnvelope(kogitoEnvelope, args.container))
      .then(() => kogitoEnvelope.startListeningOnMessageBus())
      .then(() => (window.AppFormer.KogitoEnvelope = kogitoEnvelope));
  }

  private static renderEnvelope(kogitoEnvelope: AppFormerKogitoEnvelope, container: HTMLElement) {
    return new Promise(res =>
      ReactDOM.render(<Envelope exposing={self => (kogitoEnvelope.envelope = self)} />, container, res)
    );
  }
}

export interface Args {
  container: HTMLElement;
  busApi: EnvelopeBusApi;
  clientSideOnly: boolean;
}
