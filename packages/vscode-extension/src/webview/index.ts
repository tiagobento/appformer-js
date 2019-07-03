import * as MicroEditorEnvelope from "appformer-js-microeditor-envelope";

declare global {
  export const acquireVsCodeApi: any;
}

//**
//FIXME: move that to somewhere else? channels should not know about existence of errai..
declare global {
  interface Window {
    erraiBusRemoteCommunicationEnabled: boolean;
  }
}
window.erraiBusRemoteCommunicationEnabled = false;
//**

MicroEditorEnvelope.init({
  container: document.getElementById("microeditor-envelope-container")!,
  busApi: acquireVsCodeApi()
});
