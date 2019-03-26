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

function loadGwtEditor(appformer: AppFormerSubmarine) {
  const script = document.createElement("script");
  script.src = "http://localhost:9000/org.uberfire.editor.StandaloneEditor/org.uberfire.editor.StandaloneEditor.nocache.js";
  script.onload = () => {
    console.info("Script loaded.");
  };
  document.body.appendChild(script);

  //FIXME: Listen to AppFormer.js ready event
  setTimeout(() => appformer.registerEditor(GwtEditor), 10000);
}

interface Porcelli {
    getView() : HTMLElement;
    getContent() : Promise<string>;
    setContent(content: string) : void;
    isDirty(): boolean;
}

class GwtEditor extends AppFormer.Editor {
  public af_componentTitle: string;
  private porcelliObject: Porcelli;

  constructor() {
    super("gwt-editor");
    this.af_componentTitle = "Aew";
    this.af_isReact = false;
    this.porcelliObject = (window as any).gwtEditorBeans.get("EditorPresenter").newInstance();
  }

  public af_componentRoot(): AppFormer.Element {
    return this.porcelliObject.getView();
  }

  public getContent(): Promise<string> {
    return this.porcelliObject.getContent();
  }

  public isDirty(): boolean {
    return this.porcelliObject.isDirty();
  }

  public setContent(content: string): void {
      this.porcelliObject.setContent(content);
  }
}

(window as any).erraiBusApplicationRoot = "http://localhost:8080";

AppFormerSubmarine.init(document.getElementById("app")!).then(appFormer => {
  return loadGwtEditor(appFormer);
});
