import { EnvelopeBusConsumer, AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-microeditor-router";
import { getFileContentService, setFileContentService } from "./service/Service";

export class EnvelopeBusConsumerWeb extends EnvelopeBusConsumer {
  private readonly origin: string;
  private readonly iframe: HTMLIFrameElement;
  private readonly iframeDomain: string;
  private readonly openFileExtension: string;
  private readonly path: string;
  private readonly space: string;
  private readonly project: string;
  private setEphemeralStatusBarStatus: (s: string) => void;

  constructor(
    origin: string,
    iframe: HTMLIFrameElement,
    iframeDomain: string,
    fileExtension: string,
    path: string,
    space: string,
    project: string,
    setEphemeralStatusBarStatus: (s: string) => void
  ) {
    super();
    this.origin = origin;
    this.iframe = iframe;
    this.iframeDomain = iframeDomain;
    this.openFileExtension = fileExtension;
    this.path = path;
    this.space = space;
    this.project = project;
    this.setEphemeralStatusBarStatus = setEphemeralStatusBarStatus;
  }

  public request_init(): void {
    this.request_initResponse(this.origin);
  }

  public receive_getContentResponse(content: string): void {
    setFileContentService(this.space, this.project, this.path, content).then(v => {
      this.setEphemeralStatusBarStatus("Saved.");
    });
  }

  public receive_languageRequest(): void {
    this.respond_languageRequest(router.get(this.openFileExtension));
  }

  public receive_setContentRequest(): void {
    getFileContentService(this.space, this.project, this.path)
      .then(res => res.text())
      .then(content => this.respond_setContentRequest(content.trim()));
  }

  public send(msg: AppFormerBusMessage<any>): void {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(msg, this.iframeDomain);
    }
  }

  public stopInitRequests() {
    this.receive_initResponse();
  }
}
