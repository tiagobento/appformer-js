import * as ReactDOM from "react-dom";
import * as React from "react";

import { App } from "./app/App";
import { JsonEditor } from "./app/JsonEditor";
import { AppFormerSubmarine } from "./AppFormerSubmarine";

declare global {
  export interface AppFormer {
    Submarine: AppFormerSubmarine;
  }
}

let app: App;
ReactDOM.render(<App exposing={self => (app = self)} />, document.getElementById("app"), init);

function init() {
  const appFormer = new AppFormerSubmarine(app);
  window.AppFormer.Submarine = appFormer;

  //Simulate loading of editor
  setTimeout(() => {
    appFormer.registerEditor(new JsonEditor());
  }, 1200);
}
