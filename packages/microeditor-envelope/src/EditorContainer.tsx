import * as React from "react";
import { useEffect } from "react";
import * as AppFormer from "appformer-js-core";

function InitialLoadingScreen() {
  return (
    <div
      style={{
        textAlign: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        padding: "40px 0 0 0"
      }}
    >
      <span style={{ color: "white" }}>Loading..</span>
    </div>
  );
}

function ComponentWrapper(props: { component: AppFormer.Component }) {
  let ref: HTMLDivElement;

  function renderDomComponent() {
    while (ref.firstChild) {
      ref.removeChild(ref.firstChild);
    }
    ref.appendChild(props.component.af_componentRoot() as HTMLElement);
  }

  useEffect(() => {
    if (!props.component.af_isReact) {
      renderDomComponent();
    }
  }, []);

  return props.component.af_isReact ? <>{props.component.af_componentRoot()}</> : <div ref={e => (ref = e!)} />;
}

export function EditorContainer(props: { editor?: AppFormer.Editor }) {
  return (
    <main role="main">
      <section>
        <div>
          {!props.editor && <InitialLoadingScreen />}
          {props.editor && <ComponentWrapper key={props.editor.af_componentId} component={props.editor} />}
        </div>
      </section>
    </main>
  );
}
