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

import { AuthorizationManager } from "../../util";
import { Card, CardDescriptionBuilder } from "../../model";
import { shallow } from "enzyme";
import { CardView } from "../CardView";
import * as React from "react";
import * as AppFormer from "appformer-js";
import { CardDescriptionView } from "../CardDescriptionView";

describe("CardView", () => {
  describe("behaviour", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("with access granted, should render consistently and set an onClick function", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check root div properties
      expect(component.prop("data-field")).toEqual("card");
      expect(component.prop("className")).toEqual("kie-hero-card");
      expect(component.prop("role")).toEqual("button");
      expect(component.prop("id")).toEqual("home-action-welcome!");
      expect(component.prop("onClick")).toBeDefined();

      expect(component.children()).toHaveLength(2);

      const iconElement = component.childAt(0);
      expect(iconElement.children()).toHaveLength(0);
      expect(iconElement.prop("data-field")).toEqual("icon");
      expect(iconElement.prop("className")).toEqual(
        "kie-hero-card__icon kie-circle-icon kie-circle-icon--lg foo-clasz bar-clasz"
      );

      const textElement = component.childAt(1);
      expect(textElement.prop("className")).toEqual("kie-hero-card__text");
      expect(textElement.children()).toHaveLength(2);

      const titleElement = textElement.childAt(0);
      expect(titleElement.prop("data-field")).toEqual("heading");
      expect(titleElement.text()).toEqual("welcome!");

      const descriptionElement = textElement.childAt(1);
      expect(descriptionElement.type()).toEqual(CardDescriptionView);
      expect(descriptionElement.prop("description")).toEqual(description);
    });

    test("with access not granted, should render consistently and don't set an onClick function", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => false);

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check root div properties
      expect(component.prop("data-field")).toEqual("card");
      expect(component.prop("className")).toEqual("kie-hero-card");
      expect(component.prop("role")).toEqual("button");
      expect(component.prop("id")).toEqual("home-action-welcome!");
      expect(component.prop("onClick")).toBeUndefined();

      expect(component.children()).toHaveLength(2);

      const iconElement = component.childAt(0);
      expect(iconElement.children()).toHaveLength(0);
      expect(iconElement.prop("data-field")).toEqual("icon");
      expect(iconElement.prop("className")).toEqual(
        "kie-hero-card__icon kie-circle-icon kie-circle-icon--lg foo-clasz bar-clasz"
      );

      const textElement = component.childAt(1);
      expect(textElement.prop("className")).toEqual("kie-hero-card__text");
      expect(textElement.children()).toHaveLength(2);

      const titleElement = textElement.childAt(0);
      expect(titleElement.prop("data-field")).toEqual("heading");
      expect(titleElement.text()).toEqual("welcome!");

      const descriptionElement = textElement.childAt(1);
      expect(descriptionElement.type()).toEqual(CardDescriptionView);
      expect(descriptionElement.prop("description")).toEqual(description);
    });

    test("with access granted and onMayClick returning true, should call goTo to target perspective", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);
      const goToSpy = jest.spyOn(AppFormer, "goTo");

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check card onClick's behaviour
      component.simulate("click");
      expect(onMayClick).toBeCalledTimes(1);
      expect(goToSpy).toBeCalledTimes(1);
      expect(goToSpy).toHaveBeenCalledWith("foo-perspective");
    });

    test("with access granted and onMayClick returning false, should not call goTo to target perspective", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);
      const goToSpy = jest.spyOn(AppFormer, "goTo");

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => false);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check card onClick's behaviour
      component.simulate("click");
      expect(onMayClick).toBeCalledTimes(1);
      expect(goToSpy).not.toBeCalled();
    });

    test("with access granted and onMayClick undefined, should not call goTo to target perspective", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);
      const goToSpy = jest.spyOn(AppFormer, "goTo");

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";

      const model = new Card(iconCssClasses, title, description, perspectiveId);

      const component = shallow(<CardView model={model} />);

      // check card onClick's behaviour
      component.simulate("click");
      expect(goToSpy).toHaveBeenCalledTimes(1);
    });

    test("with access granted and onMayClick returning false, should not call goTo to target perspective", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);
      const goToSpy = jest.spyOn(AppFormer, "goTo");

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => false);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check card onClick's behaviour
      component.simulate("click");
      expect(onMayClick).toBeCalledTimes(1);
      expect(goToSpy).not.toBeCalled();
    });

    test("with access not granted, should call goTo to target perspective", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => false);
      const goToSpy = jest.spyOn(AppFormer, "goTo");

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      // check card onClick's behaviour
      component.simulate("click");
      expect(onMayClick).not.toBeCalled();
      expect(goToSpy).not.toBeCalled();
    });
  });

  describe("snapshot", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("with access granted, should render consistently", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      expect(component).toMatchSnapshot();
    });

    test("with access not granted, should render consistently", () => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => false);

      const iconCssClasses = ["foo-clasz", "bar-clasz"];
      const title = "welcome!";
      const description = new CardDescriptionBuilder("hey!").build();
      const perspectiveId = "foo-perspective";
      const onMayClick = jest.fn(() => true);

      const model = new Card(iconCssClasses, title, description, perspectiveId, onMayClick);

      const component = shallow(<CardView model={model} />);

      expect(component).toMatchSnapshot();
    });
  });
});
