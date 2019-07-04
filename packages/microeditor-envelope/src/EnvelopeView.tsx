import * as React from "react";
import * as AppFormer from "appformer-js-core";

function LoadingScreen() {
  return (
    <div
      style={{
        textAlign: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#221c1b",
        padding: "40px 0 0 0"
      }}
    >
      <span
        style={{
          fontFamily: "Helvetica",
          color: "white",
          fontSize: "12pt"
        }}
      >
        Loading...
      </span>
    </div>
  );
}

interface Props {
  exposing: (self: EnvelopeView) => void;
}

interface State {
  editor?: AppFormer.Editor;
}

export class EnvelopeView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { editor: undefined };
    this.props.exposing(this);
  }

  public setEditor(editor: AppFormer.Editor) {
    return new Promise(res => this.setState({ editor: editor }, res));
  }

  public getEditor() {
    return this.state.editor;
  }

  public render() {
    return (
      <main role="main">
        <section>
          <div>
            {!this.state.editor && <LoadingScreen />}
            {this.state.editor && this.state.editor.af_isReact && <>{this.state.editor.af_componentRoot()}</>}
          </div>
        </section>
      </main>
    );
  }
}
