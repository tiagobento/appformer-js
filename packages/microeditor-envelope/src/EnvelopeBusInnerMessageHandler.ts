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

  public startListening() {
    window.addEventListener("message", event => this.receive(event.data));
  }

  // send
  private respond_initRequest() {
    return this.send({ type: EnvelopeBusMessageType.RETURN_INIT, data: undefined });
  }

  private respond_getContentRequest(content: string) {
    return this.send({ type: EnvelopeBusMessageType.RETURN_GET_CONTENT, data: content });
  }

  private request_languageResponse() {
    return this.send({ type: EnvelopeBusMessageType.REQUEST_LANGUAGE, data: undefined });
  }

  private request_setContentResponse() {
    return this.send({ type: EnvelopeBusMessageType.REQUEST_SET_CONTENT, data: undefined });
  }

  //receive
  private receive_initRequest(targetOrigin: string) {
    if (this.initializing) {
      return;
    }

    this.initializing = true;
    this.targetOrigin = targetOrigin;

    this.respond_initRequest();
    this.request_languageResponse();
  }

  private receive_setContentReturn(content: string) {
    const editor = this.kogitoEnvelope.getEditor();
    if (!editor) {
      console.info(`Message was received when no editor was registered: setContentReturn"`);
      return;
    }
    editor.setContent(content);
  }

  private receive_languageResponse(languageData: LanguageData) {
    window.erraiBusApplicationRoot = languageData.erraiDomain; //needed only for backend communication

    window.appFormerGwtFinishedLoading = () => {
      return Promise.resolve()
        .then(() => this.kogitoEnvelope.registerEditor(() => new GwtAppFormerEditor(languageData.editorId)))
        .then(() => this.request_setContentResponse());
    };

    languageData.resources.forEach(resource => {
      this.kogitoEnvelope.loadResource(resource);
    });
  }

  private receive_getContentRequest() {
    const editor = this.kogitoEnvelope.getEditor();
    if (!editor) {
      console.info(`Message was received when no editor was registered: "getContentRequest"`);
      return;
    }

    editor.getContent().then(content => this.respond_getContentRequest(content));
  }

  //

  private send<T>(message: EnvelopeBusMessage<T>) {
    if (!this.targetOrigin) {
      throw new Error("Tried to send message without targetOrigin set");
    }
    this.envelopeBusApi.postMessage(message, this.targetOrigin);
  }

  private receive(message: EnvelopeBusMessage<any>) {
    switch (message.type) {
      case EnvelopeBusMessageType.REQUEST_INIT:
        this.receive_initRequest(message.data as string);
        break;
      case EnvelopeBusMessageType.RETURN_LANGUAGE:
        this.receive_languageResponse(message.data as LanguageData);
        break;
      case EnvelopeBusMessageType.RETURN_SET_CONTENT:
        this.receive_setContentReturn(message.data as string);
        break;
      case EnvelopeBusMessageType.REQUEST_GET_CONTENT:
        this.receive_getContentRequest();
        break;
      default:
        console.info(`Unknown message type received: ${message.type}"`);
        break;
    }
  }

  private initEnvelopeBusApi() {
    try {
      return this.obtainEnvelopeBusApi();
    } catch (e) {
      console.error("Error while obtaining EnvelopeBus API.");
      console.error(e);
      return this.noOpEnvelopeBusApi();
    }
  }

  private obtainEnvelopeBusApi() {
    if (acquireVsCodeApi) {
      return acquireVsCodeApi();
    }

    if (window.parent) {
      return window.parent as EnvelopeBusApi;
    }

    console.info("No EnvelopeBus API available. Fallback is a no-op implementation.");
    return this.noOpEnvelopeBusApi();
  }

  private noOpEnvelopeBusApi() {
    return {
      postMessage: (message: EnvelopeBusMessage<any>) => {
        console.info(`[no-op EnvelopeBus API] Sending message:`);
        console.info(message);
      }
    };
  }
}