import * as MicroEditorEnvelope from "appformer-js-microeditor-envelope";

(window as any).erraiBusRemoteCommunicationEnabled = false;
MicroEditorEnvelope.init(document.getElementById("microeditor-envelope-container")!);