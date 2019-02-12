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

import { CardDescriptionLinkElement, CardDescriptionTextElement } from "../CardDescription";
import { CardDescriptionBuilder } from "../CardDescriptionBuilder";

test("without links, should return only one element, with type text.", () => {
  const description = new CardDescriptionBuilder("You can click nowhere!").build();

  const expectedElements = [new CardDescriptionTextElement("You can click nowhere!")];

  expect(description.elements).toEqual(expectedElements);
});

test("without text, should return only one element, with type link.", () => {
  const description = new CardDescriptionBuilder("{0}").addLink("link", "target").build();

  const expectedElements = [new CardDescriptionLinkElement("link", "target")];

  expect(description.elements).toEqual(expectedElements);
});

test("with links and indexes in order, should return a description with elements in correct order.", () => {
  const description = new CardDescriptionBuilder("You can click at {0} and {1}!")
    .addLink("link1", "foo")
    .addLink("link2", "bar")
    .build();

  const expectedElements = [
    new CardDescriptionTextElement("You can click at "),
    new CardDescriptionLinkElement("link1", "foo"),
    new CardDescriptionTextElement(" and "),
    new CardDescriptionLinkElement("link2", "bar"),
    new CardDescriptionTextElement("!")
  ];

  expect(description.elements).toEqual(expectedElements);
});

test("with links and indexes mixed order, should return a description with elements in correct order.", () => {
  const description = new CardDescriptionBuilder("You can click at {2} and {0} and {1}!")
    .addLink("link0", "target0")
    .addLink("link1", "target1")
    .addLink("link2", "target2")
    .build();

  const expectedElements = [
    new CardDescriptionTextElement("You can click at "),
    new CardDescriptionLinkElement("link2", "target2"),
    new CardDescriptionTextElement(" and "),
    new CardDescriptionLinkElement("link0", "target0"),
    new CardDescriptionTextElement(" and "),
    new CardDescriptionLinkElement("link1", "target1"),
    new CardDescriptionTextElement("!")
  ];

  expect(description.elements).toEqual(expectedElements);
});

test("starting with a link, should return elements in correct order.", () => {
  const description = new CardDescriptionBuilder("{0}!").addLink("link", "target").build();

  const expectedElements = [new CardDescriptionLinkElement("link", "target"), new CardDescriptionTextElement("!")];

  expect(description.elements).toEqual(expectedElements);
});

test("ending with a link, should return elements in correct order.", () => {
  const description = new CardDescriptionBuilder("Link: {0}").addLink("link", "target").build();

  const expectedElements = [new CardDescriptionTextElement("Link: "), new CardDescriptionLinkElement("link", "target")];

  expect(description.elements).toEqual(expectedElements);
});
