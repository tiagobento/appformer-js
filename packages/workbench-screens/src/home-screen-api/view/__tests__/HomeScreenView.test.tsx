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

import { Card, CardDescriptionBuilder, HomeScreen, HomeScreenProvider } from "../../model";
import { Profile, ProfilePreferencesPortableGeneratedImpl } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import { shallow } from "enzyme";
import * as React from "react";
import { HomeScreenView } from "../HomeScreenView";
import { PreferenceBeanServerStore } from "@kiegroup-ts-generated/uberfire-preferences-api-rpc";

describe("behaviour", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("with a profile, should call provider passing the correct profile", async () => {
    const provider = new FooHomeScreenProvider();

    const getSpy = jest.spyOn(provider, "get");

    const pref = new ProfilePreferencesPortableGeneratedImpl({ profile: Profile.FULL });
    const promise = Promise.resolve(pref);

    PreferenceBeanServerStore.prototype.load2 = jest.fn(() => promise);

    const component = shallow(<HomeScreenView contentProvider={provider} />);

    await Promise.all([promise]);

    expect(PreferenceBeanServerStore.prototype.load2).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith(Profile.FULL);

    expect(component.prop("id")).toEqual("home-page");
    expect(component.children()).toHaveLength(1);

    const kiePage = component.childAt(0);
    expect(kiePage.prop("className")).toEqual("kie-page");
    expect(kiePage.children()).toHaveLength(1);

    const background = kiePage.childAt(0);
    expect(background.prop("data-field")).toEqual("container");
    expect(background.prop("className")).toEqual("kie-page__content kie-content--bg-image kie-blank-slate");
    expect(background.children()).toHaveLength(1);
    expect(background.prop("style")).toStrictEqual({
      backgroundImage: "url(foo_bg.png)"
    });

    const container = background.childAt(0);
    expect(container.prop("className")).toEqual("container-fluid kie-container-fluid--blank-slate");
    expect(container.children()).toHaveLength(1);

    const row = container.childAt(0);
    expect(row.prop("className")).toEqual("blank-slate-pf row");
    expect(row.children()).toHaveLength(3);

    const welcomeElement = row.childAt(0);
    expect(welcomeElement.prop("data-field")).toEqual("welcome");
    expect(welcomeElement.text()).toEqual("welcome!");

    const descriptionElement = row.childAt(1);
    expect(descriptionElement.prop("data-field")).toEqual("description");
    expect(descriptionElement.text()).toEqual("this is a description");

    const shortcutsElement = row.childAt(2);
    expect(shortcutsElement.prop("data-field")).toEqual("shortcuts");
    expect(shortcutsElement.prop("className")).toEqual("blank-slate-pf-secondary-action");
    expect(shortcutsElement.children()).toHaveLength(2);

    const homeScreenContent = new FooHomeScreenProvider().get(Profile.FULL);

    const firstCardElement = shortcutsElement.childAt(0);
    expect(firstCardElement.key()).toEqual("0");
    expect(firstCardElement.prop("model")).toEqual(homeScreenContent.cards[0]);

    const secondCardElement = shortcutsElement.childAt(1);
    expect(secondCardElement.key()).toEqual("1");
    expect(secondCardElement.prop("model")).toEqual(homeScreenContent.cards[1]);
  });
});

describe("snapshot", () => {
  test("with a profile, should render consistently", async () => {
    const provider = new FooHomeScreenProvider();

    const pref = new ProfilePreferencesPortableGeneratedImpl({ profile: Profile.FULL });
    const promise = Promise.resolve(pref);

    PreferenceBeanServerStore.prototype.load2 = jest.fn(() => promise);

    const component = shallow(<HomeScreenView contentProvider={provider} />);

    await Promise.all([promise]);

    expect(component).toMatchSnapshot();
  });
});

class FooHomeScreenProvider implements HomeScreenProvider {
  public get(profile: Profile): HomeScreen {
    const welcomeText = "welcome!";
    const description = "this is a description";
    const backgroundImageUrl = "foo_bg.png";

    const cardDescription = new CardDescriptionBuilder("main card description").build();
    const card1 = new Card([], "first card", cardDescription, "main-perspective");
    const card2 = new Card([], "second card", cardDescription, "main-perspective");

    return new HomeScreen(welcomeText, description, backgroundImageUrl, [card1, card2]);
  }
}
