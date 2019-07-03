import { LanguageData } from "appformer-js-microeditor-router";
import { EnvelopeBusMessage } from "./EnvelopeBusMessage";
import { EnvelopeBusMessageType } from "./EnvelopeBusMessageType";

export interface EnvelopeBusOuterMessageHandlerImpl {
  send(msg: EnvelopeBusMessage<any>): void;
  pollInit(): void;
  receive_languageRequest(): void;
  receive_setContentRequest(): void;
  receive_getContentResponse(content: string): void;
}

export class EnvelopeBusOuterMessageHandler {
  public static INIT_POLLING_TIMEOUT_IN_MS = 10000;
  public static INIT_POLLING_INTERVAL_IN_MS = 10;

  public initPolling: number | false;
  public initPollingTimeout: number | false;
  public impl: EnvelopeBusOuterMessageHandlerImpl;

  public constructor(impl: (self: EnvelopeBusOuterMessageHandler) => EnvelopeBusOuterMessageHandlerImpl) {
    this.impl = impl(this);
    this.initPolling = false;
    this.initPollingTimeout = false;
  }

  public init() {
    this.initPolling = window.setInterval(
      () => this.impl.pollInit(),
      EnvelopeBusOuterMessageHandler.INIT_POLLING_INTERVAL_IN_MS
    );

    this.initPollingTimeout = window.setTimeout(() => {
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
    this.impl.send({ type: EnvelopeBusMessageType.RETURN_LANGUAGE, data: languageData });
  }

  public respond_setContentRequest(content: string) {
    this.impl.send({ type: EnvelopeBusMessageType.RETURN_SET_CONTENT, data: content });
  }

  public request_getContentResponse() {
    this.impl.send({ type: EnvelopeBusMessageType.REQUEST_GET_CONTENT, data: undefined });
  }

  public request_initResponse(origin: string) {
    this.impl.send({ type: EnvelopeBusMessageType.REQUEST_INIT, data: origin });
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
