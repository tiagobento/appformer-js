import * as React from "react";
import * as AppFormer from "appformer-js-core";

interface Props {
  component: AppFormer.Component;
}

export class ComponentWrapper extends React.Component<Props, {}> {
  private ref: HTMLDivElement;

  public componentDidMount(): void {
    if (!this.props.component.af_isReact) {
      this.ref.appendChild(this.props.component.af_componentRoot() as any);
    }
  }

  public render() {
    return this.props.component.af_isReact ? (
      <>{this.props.component.af_componentRoot()}</>
    ) : (
      <div ref={e => (this.ref = e!)} />
    );
  }
}
