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

import { OptaplannerWbHomeScreenProvider } from "../OptaplannerWbHomeScreenProvider";
import { Profile } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import { AppFormer } from "appformer-js";
import { CardDescriptionTextElement } from "../../home-screen-api/model";

const translationMap = new Map<string, string>([
  ["HomeProducer.Heading", "Welcome to KIE Workbench"],
  [
    "HomeProducer.SubHeading",
    "KIE Workbench offers a set of flexible tools, that support the way you need to work. Select a tool below to " +
      "get started."
  ],
  ["HomeProducer.Design", "Design"],
  ["HomeProducer.DesignDescription", "Model, build, and publish your artifacts."],
  ["HomeProducer.DevOps", "DevOps"],
  ["HomeProducer.DevOpsDescription", "Run and manage servers and active instances."]
]);

describe("OptaplannerWbHomeScreenProvider", () => {
  describe("get", () => {
    beforeEach(() => {
      AppFormer.prototype.translate = jest.fn((key: string): string => translationMap.get(key)!);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test("with FULL and PLANNER_AND_RULES profile", () => {
      [Profile.FULL, Profile.PLANNER_AND_RULES].forEach(profile => {
        const model = new OptaplannerWbHomeScreenProvider().get(profile);

        expect(model.welcomeText).toEqual("Welcome to KIE Workbench");
        expect(model.description).toEqual(
          "KIE Workbench offers a set of flexible tools, that support the way you need to work. " +
            "Select a tool below to get started."
        );
        expect(model.backgroundImageUrl).toEqual("images/home_bg.jpg");

        const cards = model.cards;
        expect(cards).toHaveLength(2);

        const designCard = model.cards[0];
        expect(designCard.iconCssClasses).toStrictEqual(["pficon", "pficon-blueprint"]);
        expect(designCard.title).toEqual("Design");
        expect(designCard.perspectiveId).toEqual("LibraryPerspective");
        expect(designCard.onMayClick).toBeUndefined();
        expect(designCard.description.elements).toHaveLength(1);
        expect(designCard.description.elements[0].isText()).toBeTruthy();
        expect((designCard.description.elements[0] as CardDescriptionTextElement).text).toEqual(
          "Model, build, and publish your artifacts."
        );

        const devOpsCard = model.cards[1];
        expect(devOpsCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(devOpsCard.title).toEqual("DevOps");
        expect(devOpsCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(devOpsCard.onMayClick).toBeUndefined();
        expect(devOpsCard.description.elements).toHaveLength(1);
        expect(devOpsCard.description.elements[0].isText()).toBeTruthy();
        expect((devOpsCard.description.elements[0] as CardDescriptionTextElement).text).toEqual(
          "Run and manage servers and active instances."
        );
      });
    });
  });
});
