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

import {
  CardDescription,
  CardDescriptionElement,
  CardDescriptionLinkElement,
  CardDescriptionTextElement
} from "./CardDescription";

export class CardDescriptionBuilder {
  private static readonly linkTokenRegex = new RegExp(/{(\d+)}/g);

  private readonly textMask: string;
  private readonly links: CardDescriptionLinkElement[];

  constructor(textMask: string) {
    this.textMask = textMask;
    this.links = [];
  }

  public addLinkIf(predicate: () => boolean, text: string, targetId: string): CardDescriptionBuilder {
    if (!predicate()) {
      return this;
    }
    return this.addLink(text, targetId);
  }

  public addLink(text: string, targetId: string): CardDescriptionBuilder {
    this.links.push(new CardDescriptionLinkElement(text, targetId));
    return this;
  }

  public build(): CardDescription {
    const linkTokens = this.textMask.match(CardDescriptionBuilder.linkTokenRegex);

    if (linkTokens === null || linkTokens.length === 0) {
      return new CardDescription([new CardDescriptionTextElement(this.textMask)]);
    }

    const elements: CardDescriptionElement[] = [];
    for (let i = 0; i < linkTokens.length; i++) {
      const textBeforeLink = this.getTextUntilLinkAt(this.textMask, linkTokens, i);

      if (textBeforeLink.length > 0) {
        elements.push(new CardDescriptionTextElement(textBeforeLink));
      }

      elements.push(this.links[this.linkIdxFromToken(linkTokens[i])]);
    }

    const lastElement = new CardDescriptionTextElement(
      this.getTextUntilLinkAt(this.textMask, linkTokens, linkTokens.length)
    );

    if (lastElement.text.length > 0) {
      elements.push(lastElement);
    }

    return new CardDescription(elements);
  }

  private getTextUntilLinkAt(textMask: string, tokens: RegExpMatchArray, i: number) {
    const prevLinkIdx = i === 0 ? 0 : this.linkIdxFromToken(tokens[i - 1]);
    const prevLinkTkn = `{${prevLinkIdx}}`;

    const textTokenStart = i === 0 ? 0 : textMask.indexOf(prevLinkTkn) + prevLinkTkn.length;
    const textTokenEnd = i === tokens.length ? textMask.length : textMask.indexOf(tokens[i]);

    return textMask.substring(textTokenStart, textTokenEnd);
  }

  private linkIdxFromToken(tkn: string) {
    return parseInt(tkn.replace("{", "").replace("}", ""), 10);
  }
}
