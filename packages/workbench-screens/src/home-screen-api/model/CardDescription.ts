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

export class CardDescriptionElement {
  public isText(): this is CardDescriptionTextElement {
    return this instanceof CardDescriptionTextElement;
  }

  public isLink(): this is CardDescriptionLinkElement {
    return this instanceof CardDescriptionLinkElement;
  }
}

export class CardDescriptionTextElement extends CardDescriptionElement {
  public readonly text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }
}

export class CardDescriptionLinkElement extends CardDescriptionElement {
  public readonly text: string;
  public readonly targetId: string;

  constructor(text: string, targetId: string) {
    super();
    this.text = text;
    this.targetId = targetId;
  }
}

export class CardDescription {
  public readonly elements: CardDescriptionElement[];

  constructor(elements: CardDescriptionElement[]) {
    this.elements = elements;
  }
}
