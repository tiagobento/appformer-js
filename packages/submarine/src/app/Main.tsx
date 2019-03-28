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
              <img
                width={"20px"}
                alt={"loading-spinner"}
                src={"https://upload.wikimedia.org/wikipedia/commons/3/37/YouTube_loading_symbol_2_%28stable%29.gif"}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
