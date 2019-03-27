import * as React from "react";
import * as AppFormer from "appformer-js-core";
import { ComponentWrapper } from "./ComponentWrapper";

export function Main(props: { editor?: AppFormer.Editor }) {
  return (
    <main role="main">
      <section>
        <div>
          {props.editor && <ComponentWrapper key={props.editor.af_componentId} component={props.editor} />}
          {!props.editor && <span>No Editors registered...</span>}
        </div>
      </section>
    </main>
  );
}
