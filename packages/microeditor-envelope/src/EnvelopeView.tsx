import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";

const LOADING_SCREEN_FADE_OUT_DELAY = 400;
const ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT = 100;

function LoadingScreen(props: { visible: boolean }) {
  let cssAnimation;
  const [mustRender, setMustRender] = useState(true);

  if (props.visible) {
    cssAnimation = { opacity: 1 };
  } else {
    cssAnimation = { opacity: 0, transition: `opacity ${LOADING_SCREEN_FADE_OUT_DELAY}ms` };
    setTimeout(() => setMustRender(false), ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT);
  }

  return (
    <>
      {mustRender && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            textAlign: "center",
            backgroundColor: "#1e1e1e",
            padding: "40px 0 0 0",
            ...cssAnimation
          }}
        >
          <span style={{ fontFamily: "Helvetica", color: "white", fontSize: "12pt" }}>Loading...</span>
        </div>
      )}
    </>
  );
}

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

  public signalLoadingFinished() {
    return new Promise(res => {
      setTimeout(() => this.setState({ loading: false }, res), ESTIMATED_TIME_TO_WAIT_AFTER_EMPTY_SET_CONTENT);
    });
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
