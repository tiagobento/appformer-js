import * as MicroEditorEnvelope from "appformer-js-microeditor-envelope";

declare global {
  export const acquireVsCodeApi: any;
}

MicroEditorEnvelope.init({
  container: document.getElementById("microeditor-envelope-container")!,
  busApi: acquireVsCodeApi(),
  clientSideOnly: true
});
