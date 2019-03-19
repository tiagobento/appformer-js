import * as React from "react";
import { FormEvent } from "react";
import * as AppFormer from "appformer-js-core";
import JSONEditor from "jsoneditor";
import { AppContext, AppContextDef } from "./App";

export class JsonEditor extends AppFormer.Editor {
  public af_componentTitle: string;
  public self: MyJsonEditor;

  constructor() {
    super("xml-editor");
    this.af_isReact = true;
    this.af_componentTitle = "XML Editor";
  }

  public af_componentRoot(): AppFormer.Element {
    return <MyJsonEditor exposing={self => (this.self = self)} />;
  }

  public isDirty(): boolean {
    return false;
  }

  public getContent(): string {
    return this.self.getContent();
  }

  public setContent(content: string): void {
    this.self.setContent(content);
  }
}

interface Props {
  exposing: (self: MyJsonEditor) => void;
}

interface State {
  relativePath: string;
  loading: boolean;
}

class MyJsonEditor extends React.Component<Props, State> {
  private ref: HTMLDivElement;
  private editor: JSONEditor;

  private base = "https://raw.githubusercontent.com/tiagobento/appformer/afjs/appformer-js/";

  constructor(props: Props) {
    super(props);
    this.props.exposing(this);
    this.state = {
      relativePath: "",
      loading: false
    };
  }

  public getContent(): string {
    return this.editor.getText();
  }

  public setContent(content: string): void {
    this.editor.setText(content);
  }

  public componentDidMount(): void {
    this.editor = new JSONEditor(this.ref, {});
  }

  private refreshContent(e: FormEvent, appContext: AppContextDef) {
    e.preventDefault();
    this.setState({ loading: true }, () =>
      fetch(this.base + this.state.relativePath)
        .then(res => (res.status === 200 ? res.json() : Promise.reject(res)))
        .then(obj => this.editor.set(obj))
        .then(() => appContext.setTitle(this.state.relativePath))
        .catch(() => appContext.setTitleDefault().then(() => this.setContent("{}")))
        .finally(() => this.setState({ loading: false }))
    );
  }

  public render() {
    return (
      <>
        <p>
          This input fetches data from {<a>{this.base}</a>}. Type the file's relative path and edit its content using
          the editor below.
        </p>

        <p>
          <b>NOTE:</b> Only JSON is supported!
        </p>

        <AppContext.Consumer>
          {ctx => (
            <form onSubmit={e => this.refreshContent(e, ctx)}>
              <input type={"text"} onInput={(e: any) => this.setState({ relativePath: e.target.value })} />
              &nbsp;&nbsp;&nbsp;
              <input type={"submit"} value={"Go"} />
              &nbsp;&nbsp;&nbsp;
              <span hidden={!this.state.loading}>Loading...</span>
            </form>
          )}
        </AppContext.Consumer>

        <div style={{ height: "400px" }} ref={e => (this.ref = e!)} />
      </>
    );
  }
}
