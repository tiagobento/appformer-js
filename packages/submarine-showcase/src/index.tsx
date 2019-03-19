import { JsonEditor } from "./JsonEditor";
import * as AppFormer from "appformer-js-core";
import { AppFormerSubmarine } from "appformer-js-submarine";

//This function can be replaced by an async import
function asyncLoadEditorModule(): Promise<{ Editor: { new (): AppFormer.Editor } }> {
  return new Promise(res => setTimeout(() => res({ Editor: JsonEditor }), 1200));
}

AppFormerSubmarine.init(document.getElementById("app")!)
  .then(appFormer => asyncLoadEditorModule().then(editorModule => appFormer.registerEditor(editorModule.Editor)))
  .then(editor => editor.setContent(`{"foo": "this is a test"}`));
