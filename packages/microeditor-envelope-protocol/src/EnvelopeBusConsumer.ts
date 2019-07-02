import { LanguageData } from "appformer-js-microeditor-router";
import { EnvelopeBusMessage } from "./EnvelopeBusMessage";
import { EnvelopeBusMessageType } from "./EnvelopeBusMessageType";

export interface EnvelopeBusConsumerImpl {
  send(msg: EnvelopeBusMessage<any>): void;
  pollInit(): void;
  receive_languageRequest(): void;
  receive_setContentRequest(): void;
  receive_getContentResponse(content: string): void;
}

export class EnvelopeBusConsumer {
  private static INIT_POLLING_TIMEOUT_IN_MS = 10000;

  private initPolling?: any;
  private initPollingTimeout?: any;
  private impl: EnvelopeBusConsumerImpl;

  public constructor(impl: (self: EnvelopeBusConsumer) => EnvelopeBusConsumerImpl) {
    this.impl = impl(this);
  }

  public init() {
    this.initPolling = setInterval(() => this.impl.pollInit(), 10);
    this.initPollingTimeout = setTimeout(() => {
      clearTimeout(this.initPolling);
      console.info("Init polling timed out. Looks like the microeditor-envelope is not responding accordingly.");
    }, EnvelopeBusConsumer.INIT_POLLING_TIMEOUT_IN_MS);
  }

  public receive_initResponse() {
    clearInterval(this.initPolling);
    clearTimeout(this.initPollingTimeout);
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
        this.receive_initResponse();
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
        return Promise.resolve();
    }
  }
}
