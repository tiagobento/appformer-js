import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { Envelope } from "./app/Envelope";
import {EnvelopeBusMessage} from "appformer-js-microeditor-envelope-protocol";

//Exposed API of Visual Studio Code
declare global {
  export const acquireVsCodeApi: () => AppFormerKogitoEnvelopeBusApi;
}

export class AppFormerKogitoEnvelope {
  private envelope?: Envelope;
  private busApi: AppFormerKogitoEnvelopeBusApi;
  private targetOrigin: string;

  constructor() {
    this.busApi = this.initAppFormerKogitoEnvelopeBusApi();
  }

  public handleMessages(
    handler: (appFormer: AppFormerKogitoEnvelope, event: { data: EnvelopeBusMessage<any> }) => Promise<void>
  ) {
    window.addEventListener("message", event => handler(this, event));
    return Promise.resolve();
  }

  public registerEditor(editorFactory: () => AppFormer.Editor) {
    //TODO: No-op when same Editor class?

    const editor = editorFactory.apply(this);
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

  private initAppFormerKogitoEnvelopeBusApi() {
    const noAppFormerKogitoEnvelopeBusApi = {
      postMessage: <T extends {}>(message: EnvelopeBusMessage<T>) => {
        console.info(`MOCK: Sent message:`);
        console.info(message);
      }
    };

    try {
      if (acquireVsCodeApi) {
        return acquireVsCodeApi();
      } else {
        return (window.parent as AppFormerKogitoEnvelopeBusApi) || noAppFormerKogitoEnvelopeBusApi;
      }
    } catch (e) {
      return (window.parent as AppFormerKogitoEnvelopeBusApi) || noAppFormerKogitoEnvelopeBusApi;
    }
  }

  public postMessage<T>(message: EnvelopeBusMessage<T>) {
    if (!this.targetOrigin) {
      throw new Error("Tried to send message without targetOrigin set");
    }
    this.busApi.postMessage(message, this.targetOrigin);
    return Promise.resolve();
  }

  public setTargetOrigin(targetOrigin: string) {
    this.targetOrigin = targetOrigin;
  }

  public static init(container: HTMLElement): Promise<AppFormerKogitoEnvelope> {
    return Promise.resolve().then(() => {
      const kogitoEnvelope = new AppFormerKogitoEnvelope();
      return new Promise(res =>
        ReactDOM.render(<Envelope exposing={self => (kogitoEnvelope.envelope = self)} />, container, res)
      ).then(() => (window.AppFormer.KogitoEnvelope = kogitoEnvelope));
    });
  }
}

interface AppFormerKogitoEnvelopeBusApi {
  postMessage<T>(message: EnvelopeBusMessage<T>, targetOrigin?: any, fdfd?: any): any;
}
