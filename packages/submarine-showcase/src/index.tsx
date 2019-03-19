import { JsonEditor } from "./JsonEditor";
import * as AppFormer from "appformer-js-core";
import { AppFormerSubmarine } from "appformer-js-submarine";

function asyncLoadEditor(appFormer: AppFormerSubmarine) : Promise<AppFormer.Editor>{
  return new Promise(res => setTimeout(() => appFormer.registerEditor(JsonEditor).then(res), 1200));
}

AppFormerSubmarine.init(document.getElementById("app")!)
  .then(appFormer => asyncLoadEditor(appFormer))
  .then(editor => editor.setContent(`{"foo": "this is a test"}`));
