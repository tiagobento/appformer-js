import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { Envelope } from "./app/Envelope";
import { EnvelopeBusInnerMessageHandler } from "./EnvelopeBusInnerMessageHandler";
import { Resource } from "appformer-js-microeditor-router";

export class AppFormerKogitoEnvelope {
  private envelope?: Envelope;
  public readonly EnvelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;

  constructor() {
    this.EnvelopeBusInnerMessageHandler = new EnvelopeBusInnerMessageHandler(this);
  }

  public startListeningOnMessageBus() {
    this.EnvelopeBusInnerMessageHandler.startListening();
  }

  public registerEditor(editorDelegate: () => AppFormer.Editor) {
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

  public getEditor(): AppFormer.Editor | undefined {
    return this.envelope!.getEditor();
  }

  public loadResource(resource: Resource) {
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
        default:
      }
    });
  }

  public static init(container: HTMLElement): Promise<AppFormerKogitoEnvelope> {
    return Promise.resolve().then(() => {
      const kogitoEnvelope = new AppFormerKogitoEnvelope();
      return new Promise(res =>
        ReactDOM.render(<Envelope exposing={self => (kogitoEnvelope.envelope = self)} />, container, res)
      )
        .then(() => {
          kogitoEnvelope.startListeningOnMessageBus();
        })
        .then(() => (window.AppFormer.KogitoEnvelope = kogitoEnvelope));
    });
  }
}
