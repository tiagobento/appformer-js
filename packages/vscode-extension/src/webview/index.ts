import * as MicroEditorEnvelope from "appformer-js-microeditor-envelope";

declare global {
  interface Window {
    erraiBusRemoteCommunicationEnabled: boolean;
  }
}

//FIXME: move that to somewhere else? channels should not know about existence of errai..
window.erraiBusRemoteCommunicationEnabled = false;
MicroEditorEnvelope.init(document.getElementById("microeditor-envelope-container")!);
