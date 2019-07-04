import { Resource } from "appformer-js-microeditor-router";
import { GwtEditor } from "./GwtEditor";

declare global {
  //Exposed API of AppFormerGwt
  interface Window {
    gwtEditorBeans: Map<string, { get(): GwtEditor }>;
    appFormerGwtFinishedLoading: () => any;
    erraiBusApplicationRoot: string;
    erraiBusRemoteCommunicationEnabled: boolean;
  }
}

export class AppFormerGwtApi {
  public setErraiDomain(backendDomain: string): void {
    window.erraiBusApplicationRoot = backendDomain;
  }

  public onFinishedLoading(callback: () => Promise<any>) {
    window.appFormerGwtFinishedLoading = callback;
  }

  public getEditor(editorId: string) {
    const gwtEditor = window.gwtEditorBeans.get(editorId);
    if (!gwtEditor) {
      throw new Error(`GwtEditor with id '${editorId}' was not found`);
    }

    return gwtEditor.get();
  }

  public setClientSideOnly(clientSideOnly: boolean) {
    window.erraiBusRemoteCommunicationEnabled = !clientSideOnly;
  }

  public loadResources(resources: Resource[]) {
    resources.forEach(resource => {
      this.loadResource(resource);
    });
  }

  private loadResource(resource: Resource) {
    resource.paths.forEach(path => {
      switch (resource.type) {
        case "css":
          const link = document.createElement("link");
          link.href = path;
          link.rel = "text/css";
          document.body.appendChild(link);
          break;
        case "js":
          const script = document.createElement("script");
          script.src = path;
          script.type = "text/javascript";
          document.body.appendChild(script);
          break;
      }
    });
  }
}
