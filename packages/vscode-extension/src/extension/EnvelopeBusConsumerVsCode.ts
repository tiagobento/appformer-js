import { EnvelopeBusConsumer, AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-microeditor-router";
import * as fs from "fs";
import * as vscode from "vscode";

export class EnvelopeBusConsumerVsCode extends EnvelopeBusConsumer {
  private readonly panel: vscode.WebviewPanel;
  private readonly path: string;

  constructor(panel: vscode.WebviewPanel, path: string) {
    super();
    this.panel = panel;
    this.path = path;
  }

  public request_init(): void {
    this.request_initResponse("vscode");
  }

  public receive_languageRequest() {
    const split = this.path.split(".");
    super.respond_languageRequest(router.get(split[split.length - 1]));
  }

  public receive_getContentResponse(content: string) {
    fs.writeFileSync(this.path, content);
    vscode.window.setStatusBarMessage("Saved successfully!", 3000);
  }

  public receive_setContentRequest() {
    const content = fs.readFileSync(this.path);
    super.respond_setContentRequest(content.toString());
  }

  public send(msg: AppFormerBusMessage<any>) {
    this.panel.webview.postMessage(msg);
  }
}
