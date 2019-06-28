import * as React from "react";
import * as AppFormer from "appformer-js-core";
import { ComponentWrapper } from "./ComponentWrapper";

export function Main(props: { editor?: AppFormer.Editor }) {
  return (
    <main role="main">
      <section>
        <div>
          {props.editor && <ComponentWrapper key={props.editor.af_componentId} component={props.editor} />}
          {!props.editor && (
            <div
              style={{
                textAlign: "center",
                width: "100vw",
                height: "100vh",
                backgroundColor: "black",
                padding: "40px 0 0 0"
              }}
            >
              <span style={{color: "white"}}>Loading..</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
