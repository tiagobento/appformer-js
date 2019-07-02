import { EnvelopeBusMessage, EnvelopeBusMessageType } from "appformer-js-microeditor-envelope-protocol";
import { AppFormerKogitoEnvelope } from "./AppFormerKogitoEnvelope";
import { GwtAppFormerEditor } from "./GwtAppFormerEditor";
import { LanguageData } from "appformer-js-microeditor-router";

//Exposed API of Visual Studio Code
declare global {
  export const acquireVsCodeApi: () => EnvelopeBusApi;
}

interface EnvelopeBusApi {
  postMessage<T>(message: EnvelopeBusMessage<T>, targetOrigin?: any, _?: any): any;
}

export class EnvelopeBusInnerMessageHandler {
  private initializing = false;
  private targetOrigin: string;
  private readonly kogitoEnvelope: AppFormerKogitoEnvelope;
  private readonly envelopeBusApi: EnvelopeBusApi;

  constructor(kogitoEnvelope: AppFormerKogitoEnvelope) {
    this.kogitoEnvelope = kogitoEnvelope;
    this.envelopeBusApi = this.initEnvelopeBusApi();
  }

  //respond
  private respond_initRequest() {
    return this.send({ type: EnvelopeBusMessageType.RETURN_INIT, data: undefined });
  }

  private respond_getContentRequest(content: string) {
    return this.send({ type: EnvelopeBusMessageType.RETURN_GET_CONTENT, data: content });
  }

  //request
  private request_languageResponse() {
    return this.send({ type: EnvelopeBusMessageType.REQUEST_LANGUAGE, data: undefined });
  }

  private request_setContentResponse() {
    return this.send({ type: EnvelopeBusMessageType.REQUEST_SET_CONTENT, data: undefined });
  }

  //receive
  private receive_initRequest(targetOrigin: string) {
    if (this.initializing) {
      return Promise.resolve();
    }

    this.initializing = true;
    this.targetOrigin = targetOrigin;
    return this.respond_initRequest().then(() => this.request_languageResponse());
  }

  private receive_setContentReturn(content: string) {
    const editor = this.kogitoEnvelope.getEditor();
    if (!editor) {
      console.info(`Message was received when no editor was registered: setContentReturn"`);
      return Promise.resolve();
    }
    return editor.setContent(content);
  }

  private receive_languageResponse(languageData: LanguageData) {
    window.erraiBusApplicationRoot = languageData.erraiDomain; //needed only for backend communication

    window.appFormerGwtFinishedLoading = () => {
      this.kogitoEnvelope
        .registerEditor(() => new GwtAppFormerEditor(languageData.editorId))
        .then(() => this.request_setContentResponse());
    };

    languageData.resources.forEach(resource => {
      this.kogitoEnvelope.loadResource(resource);
    });

    return Promise.resolve();
  }

  private receive_getContentRequest() {
    const editor = this.kogitoEnvelope.getEditor();
    if (!editor) {
      console.info(`Message was received when no editor was registered: "getContentRequest"`);
      return Promise.resolve();
    }

    return editor.getContent().then(content => this.respond_getContentRequest(content));
  }

  //

  public send<T>(message: EnvelopeBusMessage<T>) {
    if (!this.targetOrigin) {
      throw new Error("Tried to send message without targetOrigin set");
    }
    this.envelopeBusApi.postMessage(message, this.targetOrigin);
    return Promise.resolve();
  }

  //

  public receive(event: { data: EnvelopeBusMessage<any> }): Promise<void> {
    const message = event.data;

    switch (message.type) {
      case EnvelopeBusMessageType.REQUEST_INIT:
        return this.receive_initRequest(message.data as string);
      case EnvelopeBusMessageType.RETURN_LANGUAGE:
        return this.receive_languageResponse(message.data as LanguageData);
      case EnvelopeBusMessageType.RETURN_SET_CONTENT:
        return this.receive_setContentReturn(message.data as string);
      case EnvelopeBusMessageType.REQUEST_GET_CONTENT:
        return this.receive_getContentRequest();
      default:
        console.info(`Unknown message type received: ${message.type}"`);
        return Promise.resolve();
    }
  }

  private initEnvelopeBusApi() {

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
        return (window.parent as EnvelopeBusApi) || noAppFormerKogitoEnvelopeBusApi;
      }
    } catch (e) {
      return (window.parent as EnvelopeBusApi) || noAppFormerKogitoEnvelopeBusApi;
    }
  }

  public startListening() {
    window.addEventListener("message", event => this.receive(event));
  }
}
