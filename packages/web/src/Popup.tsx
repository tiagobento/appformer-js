/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

interface Props {
  onClose: () => void;
  focusOnFirstInput?: boolean;
}

export class Popup extends React.Component<Props, {}> {
  private ref: HTMLDivElement;

  private closeWhenClickingOverlay(e: any) {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  }

  private escapeKeyListener = (e: any) => {
    if (e.key === "Escape") {
      this.props.onClose();
    }
  };

  public componentDidMount(): void {
    if (!this.props.focusOnFirstInput) {
      return;
    }

    const firstInput = this.ref.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }

    window.addEventListener("keydown", this.escapeKeyListener);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("keydown", this.escapeKeyListener);
  }

  public render() {
    //FIXME: Place this css somewhere else. This will speed up the component creation.
    return (
      <div
        ref={e => (this.ref = e!)}
        onClick={e => this.closeWhenClickingOverlay(e)}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
          backgroundColor: "rgba(0,0,0, 0.5)",
          zIndex: 10
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "25%",
            right: "25%",
            top: "25%",
            bottom: "75%",
            margin: "auto"
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
