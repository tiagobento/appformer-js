import { LanguageData } from "appformer-js-microeditor-router";
import { EnvelopeBusMessage } from "./EnvelopeBusMessage";
import { EnvelopeBusMessageType } from "./EnvelopeBusMessageType";
import { EnvelopeBusApi } from "./EnvelopeBusApi";

export interface EnvelopeBusOuterMessageHandlerImpl {
  pollInit(): void;
  receive_languageRequest(): void;
  receive_setContentRequest(): void;
  receive_getContentResponse(content: string): void;
}

export class EnvelopeBusOuterMessageHandler {
  public static INIT_POLLING_TIMEOUT_IN_MS = 10000;
  public static INIT_POLLING_INTERVAL_IN_MS = 10;

  public initPolling: any | false;
  public initPollingTimeout: any | false;
  public impl: EnvelopeBusOuterMessageHandlerImpl;
  public busApi: EnvelopeBusApi;

  public constructor(
    busApi: EnvelopeBusApi,
    impl: (self: EnvelopeBusOuterMessageHandler) => EnvelopeBusOuterMessageHandlerImpl
  ) {
    this.busApi = busApi;
    this.impl = impl(this);
    this.initPolling = false;
    this.initPollingTimeout = false;
  }

  public startInitPolling() {
    this.initPolling = setInterval(
      () => this.impl.pollInit(),
      EnvelopeBusOuterMessageHandler.INIT_POLLING_INTERVAL_IN_MS
    );

    this.initPollingTimeout = setTimeout(() => {
      this.stopInitPolling();
      console.info("Init polling timed out. Looks like the microeditor-envelope is not responding accordingly.");
    }, EnvelopeBusOuterMessageHandler.INIT_POLLING_TIMEOUT_IN_MS);
  }

  public stopInitPolling() {
    clearInterval(this.initPolling as number);
    this.initPolling = false;
    clearTimeout(this.initPollingTimeout as number);
    this.initPollingTimeout = false;
  }

  public respond_languageRequest(languageData?: LanguageData) {
    this.busApi.postMessage({ type: EnvelopeBusMessageType.RETURN_LANGUAGE, data: languageData });
  }

  public respond_setContentRequest(content: string) {
    this.busApi.postMessage({ type: EnvelopeBusMessageType.RETURN_SET_CONTENT, data: content });
  }

  public request_getContentResponse() {
    this.busApi.postMessage({ type: EnvelopeBusMessageType.REQUEST_GET_CONTENT, data: undefined });
  }

  public request_initResponse(origin: string) {
    this.busApi.postMessage({ type: EnvelopeBusMessageType.REQUEST_INIT, data: origin });
  }

  public receive(message: EnvelopeBusMessage<any>) {
    switch (message.type) {
      case EnvelopeBusMessageType.RETURN_INIT:
        this.stopInitPolling();
        break;
      case EnvelopeBusMessageType.REQUEST_LANGUAGE:
        this.impl.receive_languageRequest();
        break;
      case EnvelopeBusMessageType.RETURN_GET_CONTENT:
        this.impl.receive_getContentResponse(message.data as string);
        break;
      case EnvelopeBusMessageType.REQUEST_SET_CONTENT:
        this.impl.receive_setContentRequest();
        break;
      default:
        console.info(`Unknown message type received: ${message.type}"`);
        break;
    }
  }
}
