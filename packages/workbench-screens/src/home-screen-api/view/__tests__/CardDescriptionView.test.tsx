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
import { CardDescriptionBuilder, CardDescriptionLinkElement, CardDescriptionTextElement } from "../../model";
import { CardDescriptionView, LinkElement, TextElement } from "../CardDescriptionView";
import * as AppFormer from "appformer-js";
import { AuthorizationManager } from "../../util";
import { shallow } from "enzyme";

describe("LinkElement", () => {
  describe("behaviour", () => {
    let goToSpy: any;
    beforeEach(() => {
      goToSpy = jest.spyOn(AppFormer, "goTo");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("with a link element with access", () => {
      const model = new CardDescriptionLinkElement("click_me", "target");

      const component = shallow(<LinkElement model={model} hasAccess={true} />);

      expect(component.type()).toEqual("a");
      expect(component.text()).toEqual(model.text);
      expect(component.hasClass("kie-hero-card__link")).toBeTruthy();
      expect(component.hasClass("disabled")).toBeFalsy();

      expect(component.find('[data-field="link"]').at(0)).toEqual(component);

      component.simulate("click", { stopPropagation: () => undefined });
      expect(goToSpy).toBeCalledTimes(1);
      expect(goToSpy).toHaveBeenCalledWith("target");
    });

    test("with a link element without access", () => {
      const model = new CardDescriptionLinkElement("click_me", "target");

      const component = shallow(<LinkElement model={model} hasAccess={false} />);

      expect(component.type()).toEqual("a");
      expect(component.text()).toEqual(model.text);
      expect(component.hasClass("kie-hero-card__link")).toBeTruthy();
      expect(component.hasClass("disabled")).toBeTruthy();

      expect(component.find('[data-field="link"]').at(0)).toEqual(component);

      component.simulate("click", { stopPropagation: () => undefined });
      expect(goToSpy).not.toBeCalled();
    });
  });

  describe("snapshot", () => {
    test("with a link element with access", () => {
      const model = new CardDescriptionLinkElement("click_me", "target");

      const component = shallow(<LinkElement model={model} hasAccess={true} />);

      expect(component).toMatchSnapshot();
    });

    test("with a link element without access", () => {
      const model = new CardDescriptionLinkElement("click_me", "target");

      const component = shallow(<LinkElement model={model} hasAccess={false} />);

      expect(component).toMatchSnapshot();
    });
  });
});

describe("TextElement", () => {
  describe("behaviour", () => {
    test("with a text element", () => {
      const model = new CardDescriptionTextElement("foo");

      const component = shallow(<TextElement model={model} />);

      expect(component.type()).toEqual("span");
      expect(component.text()).toEqual(model.text);
      expect(component.find('[data-field="text"]').at(0)).toEqual(component);
    });
  });

  describe("snapshot", () => {
    test("with a text element", () => {
      const model = new CardDescriptionTextElement("foo");

      const component = shallow(<TextElement model={model} />);

      expect(component).toMatchSnapshot();
    });
  });
});

describe("CardDescriptionView", () => {
  describe("behaviour", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("with a description, should render correct description elements", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => true);

      const model = new CardDescriptionBuilder("This is a description with a link to {0}.")
        .addLink("click_me", "foo")
        .build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component.children()).toHaveLength(3);

      const firstToken = component.childAt(0);
      expect(firstToken.key()).toEqual("0");
      expect(firstToken.type()).toEqual(TextElement);
      expect(firstToken.shallow().text()).toEqual("This is a description with a link to ");

      const secondToken = component.childAt(1);
      expect(secondToken.key()).toEqual("1");
      expect(secondToken.type()).toEqual(LinkElement);
      expect(secondToken.shallow().text()).toEqual("click_me");

      const thirdToken = component.childAt(2);
      expect(thirdToken.key()).toEqual("2");
      expect(thirdToken.type()).toEqual(TextElement);
      expect(thirdToken.shallow().text()).toEqual(".");
    });

    test("with a description containing a link element with access, should set correct parameter to child component", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => true);

      const model = new CardDescriptionBuilder("{0}").addLink("click_me", "foo").build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component.children()).toHaveLength(1);

      const token = component.childAt(0);
      expect(token.key()).toEqual("0");
      expect(token.type()).toEqual(LinkElement);
      expect(token.prop("hasAccess")).toBeTruthy();
    });

    test("with a description containing a link element without access, should set correct parameter to child component", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => false);

      const model = new CardDescriptionBuilder("{0}").addLink("click_me", "foo").build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component.children()).toHaveLength(1);

      const token = component.childAt(0);
      expect(token.key()).toEqual("0");
      expect(token.type()).toEqual(LinkElement);
      expect(token.prop("hasAccess")).toBeFalsy();
    });
  });

  describe("snapshot", () => {
    test("with a description, should render correct description elements", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => true);

      const model = new CardDescriptionBuilder("This is a description with a link to {0}.")
        .addLink("click_me", "foo")
        .build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component).toMatchSnapshot();
    });

    test("with a description containing a link element with access, should set correct parameter to child component", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => true);

      const model = new CardDescriptionBuilder("{0}").addLink("click_me", "foo").build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component).toMatchSnapshot();
    });

    test("with a description containing a link element without access, should set correct parameter to child component", () => {
      const spy = jest.spyOn(AuthorizationManager, "hasAccessToPerspective");
      spy.mockImplementation(() => false);

      const model = new CardDescriptionBuilder("{0}").addLink("click_me", "foo").build();

      const component = shallow(<CardDescriptionView description={model} />);

      expect(component).toMatchSnapshot();
    });
  });
});
