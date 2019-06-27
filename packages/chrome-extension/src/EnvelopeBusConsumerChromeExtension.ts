import { AppFormerBusMessage, EnvelopeBusConsumer } from "appformer-js-submarine";
import { router } from "appformer-js-microeditor-router";

export class EnvelopeBusConsumerChromeExtension extends EnvelopeBusConsumer {
  private origin: string;
  private iframe: HTMLIFrameElement;
  private iframeDomain: string;
  private fileExtension: string;
  private getGitHubEditor: () => any;
  private enableCommitButton: () => void;

  constructor(
    origin: string,
    iframe: HTMLIFrameElement,
    iframeDomain: string,
    fileExtension: string,
    getGitHubEditor: () => any,
    enableCommitButton: () => void
  ) {
    super();
    this.origin = origin;
    this.iframe = iframe;
    this.iframeDomain = iframeDomain;
    this.fileExtension = fileExtension;
    this.getGitHubEditor = getGitHubEditor;
    this.enableCommitButton = enableCommitButton;
  }

  public receive_getContentResponse(content: string): void {
    const gwtEditorContent = content;
    this.enableCommitButton();
    this.getGitHubEditor().CodeMirror.setValue(gwtEditorContent);
  }

  public receive_languageRequest(): void {
    this.respond_languageRequest(router.get(this.fileExtension));
  }

  public receive_setContentRequest(): void {
    const githubEditorContent = this.getGitHubEditor().CodeMirror.getValue() || "";
    this.respond_setContentRequest(githubEditorContent);
  }

  public request_init(): void {
    this.request_initResponse(this.origin);
  }

  public send(msg: AppFormerBusMessage<any>): void {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(msg, this.iframeDomain);
    }
  }
}
