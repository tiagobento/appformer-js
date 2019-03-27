import * as AppFormer from "appformer-js-core";
import { JsonEditor } from "./JsonEditor";
import { AppFormerSubmarine } from "appformer-js-submarine";

//This function can be replaced by an async import
function asyncLoadReactEditorModule(): Promise<{ JsonEditor: { new (): AppFormer.Editor } }> {
  return new Promise(res => setTimeout(() => res({ JsonEditor: JsonEditor }), 1000));
}

AppFormerSubmarine.init(document.getElementById("app")!).then(appFormer => {
  return asyncLoadReactEditorModule()
    .then(editorModule => appFormer.registerEditor(() => new editorModule.JsonEditor()))
    .then(editor => editor.setContent(`{"foo": "this is a test"}`));
});
