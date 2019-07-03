import { KogitoEditor } from "./KogitoEditor";

export class KogitoEditorStore {
  public activeKogitoEditor?: KogitoEditor;

  public addAsActive(editor: KogitoEditor) {
    this.activeKogitoEditor = editor;
  }

  public setActive(editor: KogitoEditor) {
    this.activeKogitoEditor = editor;
  }

  public isActive(editor: KogitoEditor) {
    return this.activeKogitoEditor && this.activeKogitoEditor.sameAs(editor);
  }

  public setNoneActive() {
    this.activeKogitoEditor = undefined;
  }

  public withActive(consumer: (activeEditor: KogitoEditor) => void) {
    if (this.activeKogitoEditor) {
      consumer(this.activeKogitoEditor);
    }
  }
}
