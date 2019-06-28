import { LanguageData } from "appformer-js-microeditor-router";
import { AppFormerBusMessage } from "appformer-js-submarine";

export interface EnvelopeBusConsumerImpl {
  send(msg: AppFormerBusMessage<any>): void;
  pollInit(): void;
  receive_languageRequest(): void;
  receive_setContentRequest(): void;
  receive_getContentResponse(content: string): void;
}

export class EnvelopeBusConsumer {
  private static INIT_POLLING_TIMEOUT_IN_MS = 20000;

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
    this.impl.send({ type: "RETURN_LANGUAGE", data: languageData });
  }

  public respond_setContentRequest(content: string) {
    this.impl.send({ type: "RETURN_SET_CONTENT", data: content });
  }

  public request_getContentResponse() {
    this.impl.send({ type: "REQUEST_GET_CONTENT", data: undefined });
  }

  public request_initResponse(origin: string) {
    this.impl.send({ type: "REQUEST_INIT", data: origin });
  }

  public receive(message: AppFormerBusMessage<any>) {
    this.receive_initResponse();
    switch (message.type) {
      case "RETURN_INIT":
        this.receive_initResponse();
        break;
      case "REQUEST_LANGUAGE":
        this.impl.receive_languageRequest();
        break;
      case "RETURN_GET_CONTENT":
        this.impl.receive_getContentResponse(message.data as string);
        break;
      case "REQUEST_SET_CONTENT":
        this.impl.receive_setContentRequest();
        break;
    }
  }
}
