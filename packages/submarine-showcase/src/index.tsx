import { JsonEditor } from "./JsonEditor";
import { AppFormerSubmarine } from "appformer-js-submarine";

AppFormerSubmarine
  .init(document.getElementById("app")!)
  .then(appFormer => asyncLoadEditor(appFormer))
  .then(editor => console.info(editor));

function asyncLoadEditor(appFormer: AppFormerSubmarine) {
  return new Promise(res => setTimeout(() => appFormer.registerEditor(JsonEditor).then(res), 1200));
}
