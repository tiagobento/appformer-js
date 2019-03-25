import * as AppFormer from "appformer-js-core";
import { JsonEditor } from "./JsonEditor";
import { AppFormerSubmarine } from "appformer-js-submarine";
import { DomBasedEditor } from "./DomBasedEditor";

//This function can be replaced by an async import
function asyncLoadReactEditorModule(): Promise<{ Editor: { new (): AppFormer.Editor } }> {
  return new Promise(res => setTimeout(() => res({ Editor: JsonEditor }), 1200));
}

//This function can be replaced by an async import
function asyncLoadDomEditorModule(): Promise<{ Editor: { new (): AppFormer.Editor } }> {
  return new Promise(res => setTimeout(() => res({ Editor: DomBasedEditor }), 3000));
}

AppFormerSubmarine.init(document.getElementById("app")!).then(appFormer => {
  return asyncLoadReactEditorModule()
    .then(editorModule => appFormer.registerEditor(editorModule.Editor))
    .then(editor => editor.setContent(`{"foo": "this is a test"}`))
    .then(() => asyncLoadDomEditorModule())
    .then(editorModule => appFormer.registerEditor(editorModule.Editor))
    .then(editor => editor.setContent(`{"foo": "this is a test"}`));
});
