import { LanguageData } from "appformer-js-microeditor-router";
import { AppFormerBusMessage } from "./AppFormerSubmarine";

export abstract class EnvelopeBusConsumer {
  private static TIMEOUT = 20000; //ms

  private initPolling?: any;
  private initPollingTimeout?: any;

  public abstract send(msg: AppFormerBusMessage<any>): void;

  public abstract receive_languageRequest(): void;

  public abstract receive_getContentResponse(content: string): void;

  public abstract receive_setContentRequest(): void;

  public abstract request_init(): void;

  public init() {
    this.initPolling = setInterval(() => this.request_init(), 10);
    this.initPollingTimeout = setTimeout(() => {
      clearTimeout(this.initPolling);
      console.info("Init polling timed out. Looks like the microeditor-envelope is not responding accordingly.");
    }, EnvelopeBusConsumer.TIMEOUT);
  }

  public receive_initResponse() {
    clearInterval(this.initPolling);
    clearTimeout(this.initPollingTimeout);
  }

  public respond_languageRequest(languageData?: LanguageData) {
    this.send({ type: "RETURN_LANGUAGE", data: languageData });
  }

  public respond_setContentRequest(content: string) {
    this.send({ type: "RETURN_SET_CONTENT", data: content });
  }

  public request_getContentResponse() {
    this.send({ type: "REQUEST_GET_CONTENT", data: undefined });
  }

  public request_initResponse(origin: string) {
    this.send({ type: "REQUEST_INIT", data: origin });
  }

  public receive(message: AppFormerBusMessage<any>) {
    this.receive_initResponse();
    switch (message.type) {
      case "RETURN_INIT":
        this.receive_initResponse();
        break;
      case "REQUEST_LANGUAGE":
        this.receive_languageRequest();
        break;
      case "RETURN_GET_CONTENT":
        this.receive_getContentResponse(message.data as string);
        break;
      case "REQUEST_SET_CONTENT":
        this.receive_setContentRequest();
        break;
    }
  }
}
