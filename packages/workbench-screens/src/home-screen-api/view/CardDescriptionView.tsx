/*
 *  Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from "react";
import * as AppFormer from "appformer-js";
import { CardDescription, CardDescriptionLinkElement, CardDescriptionTextElement } from "../model";
import { AuthorizationManager } from "../util";

interface Props {
  description: CardDescription;
}

export class CardDescriptionView extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <>
        {this.props.description.elements.map((element, idx) => {
          if (element.isText()) {
            return <TextElement model={element} key={idx} />;
          }

          if (element.isLink()) {
            return <LinkElement model={element} hasAccess={this.hasAccessToLink(element.targetId)} key={idx} />;
          }
        })}
      </>
    );
  }

  private hasAccessToLink(targetId: string): boolean {
    return AuthorizationManager.hasAccessToPerspective(targetId);
  }
}

export function TextElement(props: { model: CardDescriptionTextElement }) {
  return <span data-field="text">{props.model.text}</span>;
}

export function LinkElement(props: { model: CardDescriptionLinkElement; hasAccess: boolean }) {
  const disabledClass = props.hasAccess ? "" : "disabled";
  const onClickFunc = props.hasAccess
    ? (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        AppFormer.goTo(props.model.targetId);
      }
    : undefined;

  return (
    <a data-field="link" className={`kie-hero-card__link ${disabledClass}`} onClick={onClickFunc}>
      {props.model.text}
    </a>
  );
}
