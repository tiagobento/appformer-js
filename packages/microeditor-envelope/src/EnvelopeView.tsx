import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";
import { LoadingScreen } from "./LoadingScreen";

interface Props {
  exposing: (self: EnvelopeView) => void;
}

interface State {
  editor?: AppFormer.Editor;
  loading: boolean;
}

export class EnvelopeView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { editor: undefined, loading: true };
    this.props.exposing(this);
  }

  public setEditor(editor: AppFormer.Editor) {
    return new Promise(res => this.setState({ editor: editor }, res));
  }

  public getEditor() {
    return this.state.editor;
  }

  public setLoadingFinished() {
    return new Promise(res => this.setState({ loading: false }, res));
  }

  private LoadingScreenPortal() {
    const container = document.getElementById("loading-screen");
    if (!container) {
      throw new Error("Loading screen container is not available");
    }

    return ReactDOM.createPortal(<LoadingScreen visible={this.state.loading} />, container!);
  }

  public render() {
    return (
      <>
        {this.LoadingScreenPortal()}
        {this.state.editor && this.state.editor.af_isReact && this.state.editor.af_componentRoot()}
      </>
    );
  }
}
