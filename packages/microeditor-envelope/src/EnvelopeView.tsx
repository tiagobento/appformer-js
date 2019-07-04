import * as React from "react";
import * as ReactDOM from "react-dom";
import * as AppFormer from "appformer-js-core";

const FADE_OUT_DELAY = 400;
function LoadingScreen(props: { visible: boolean }) {
  const fadeOut = {
    opacity: 0,
    transition: `opacity ${FADE_OUT_DELAY}ms`,
    willChange: "opacity"
  };

  const fadeIn = { opacity: 1 };

  const css = props.visible ? fadeIn : fadeOut;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#1e1e1e",
        padding: "40px 0 0 0",
        ...css
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
  loading: boolean;
  loadingScreen: boolean;
}

export class EnvelopeView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { editor: undefined, loading: true, loadingScreen: true };
    this.props.exposing(this);
  }

  public setEditor(editor: AppFormer.Editor) {
    return new Promise(res => this.setState({ editor: editor }, res));
  }

  public signalLoadingFinished() {
    return new Promise(res =>
      setTimeout(() => {
        this.setState({ loading: false }, () => {
          res();
          setTimeout(() => {
            this.setState({ loadingScreen: false });
          }, FADE_OUT_DELAY);
        });
      }, 100)
    );
  }

  public getEditor() {
    return this.state.editor;
  }

  public render() {
    return (
      <main role="main">
        <section>
          <div>
            {this.state.loadingScreen && this.LoadingScreenPortal()}
            {this.state.editor && this.state.editor.af_isReact && <>{this.state.editor.af_componentRoot()}</>}
          </div>
        </section>
      </main>
    );
  }

  private LoadingScreenPortal() {
    const container = document.getElementById("loading-screen");
    if (container) {
      return ReactDOM.createPortal(<LoadingScreen visible={this.state.loading} />, container!);
    } else {
      return <LoadingScreen visible={true} />;
    }
  }
}
