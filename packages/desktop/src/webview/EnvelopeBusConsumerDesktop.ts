import * as Electron from "electron";
import { EnvelopeBusConsumer, AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-microeditor-router";

export class EnvelopeBusConsumerDesktop extends EnvelopeBusConsumer {
  private readonly origin: string;
  private readonly iframe: HTMLIFrameElement;
  private readonly iframeDomain: string;
  private readonly ipc: Electron.IpcRenderer;
  private readonly openFileExtension: string;
  private readonly path: string;

  constructor(
    origin: string,
    iframe: HTMLIFrameElement,
    iframeDomain: string,
    ipc: Electron.IpcRenderer,
    openFileExtension: string,
    path: string
  ) {
    super();
    this.origin = origin;
    this.iframe = iframe;
    this.iframeDomain = iframeDomain;
    this.ipc = ipc;
    this.openFileExtension = openFileExtension;
    this.path = path;
  }

  public request_init(): void {
    this.request_initResponse(this.origin);
  }

  public receive_getContentResponse(content: string): void {
    this.ipc.send("writeContent", { path: this.path, content: content });
  }

  public receive_languageRequest(): void {
    this.respond_languageRequest(router.get(this.openFileExtension));
  }

  public receive_setContentRequest(): void {
    this.ipc.send("requestContent", { relativePath: this.path });
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
