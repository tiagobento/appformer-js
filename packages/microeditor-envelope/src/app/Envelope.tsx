import * as React from "react";
import * as AppFormer from "appformer-js-core";
import { Main } from "./Main";

interface Props {
  exposing: (self: Envelope) => void;
}

interface State {
  editor?: AppFormer.Editor;
  title: string;
}

export interface AppContextDef {
  title: string;
  setTitle: (title: string) => Promise<void>;
  setTitleDefault: () => Promise<void>;
}

export const AppContext = React.createContext({
  title: "",
  setTitle: (title: string) => Promise.resolve(),
  setTitleDefault: () => Promise.resolve()
});

function Title(props: { text: string }) {
  document.title = props.text;
  return <></>;
}

export class Envelope extends React.Component<Props, State> {
  private static readonly defaultTitle = "AppFormer.js - QuickSilver";

  constructor(props: Props) {
    super(props);
    this.state = {
      editor: undefined,
      title: Envelope.defaultTitle
    };
    this.props.exposing(this);
  }

  public render() {
    return (
      <>
        <div>
          <AppContext.Provider
            value={{
              title: this.state.title,
              setTitle: (title: string) => new Promise(res => this.setState({ title: title }, res)),
              setTitleDefault: () => new Promise(res => this.setState({ title: Envelope.defaultTitle }, res))
            }}
          >
            <Title text={this.state.title} />
            <Main editor={this.state.editor} />
          </AppContext.Provider>
        </div>
      </>
    );
  }

  public register(editor: AppFormer.Editor) {
    return Promise.resolve().then(() => new Promise(res => this.setState({ editor: editor }, res)));
  }

  public getEditor() {
    return this.state.editor;
  }
}
