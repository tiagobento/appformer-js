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

import { DroolsWbHomeScreenProvider } from "../DroolsWbHomeScreenProvider";
import { Profile } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import { CardDescriptionLinkElement, CardDescriptionTextElement } from "../../home-screen-api/model";

describe("DroolsWbHomeScreenProvider", () => {
  describe("get", () => {
    test("with FULL and PLANNER_AND_RULES profile should return a consistent home screen", () => {
      [Profile.FULL, Profile.PLANNER_AND_RULES].forEach(profile => {
        const model = new DroolsWbHomeScreenProvider().get(profile);

        expect(model.welcomeText).toEqual("Welcome to KIE Workbench");
        expect(model.description).toEqual(
          "KIE Workbench offers a set of flexible tools, that support the way you need to work. " +
            "Select a tool below to get started."
        );
        expect(model.backgroundImageUrl).toEqual("images/home_bg.jpg");

        const cards = model.cards;
        expect(cards).toHaveLength(2);

        const designCard = cards[0];
        expect(designCard.iconCssClasses).toStrictEqual(["pficon", "pficon-blueprint"]);
        expect(designCard.title).toEqual("Design");
        expect(designCard.perspectiveId).toEqual("LibraryPerspective");
        expect(designCard.onMayClick).toBeUndefined();

        const designDescription = designCard.description.elements;
        expect(designDescription).toHaveLength(5);

        expect(designDescription[0].isText()).toBeTruthy();
        expect((designDescription[0] as CardDescriptionTextElement).text).toEqual("Create and modify ");

        expect(designDescription[1].isLink()).toBeTruthy();
        expect((designDescription[1] as CardDescriptionLinkElement).text).toEqual("projects");
        expect((designDescription[1] as CardDescriptionLinkElement).targetId).toEqual("LibraryPerspective");

        expect(designDescription[2].isText()).toBeTruthy();
        expect((designDescription[2] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(designDescription[3].isLink()).toBeTruthy();
        expect((designDescription[3] as CardDescriptionLinkElement).text).toEqual("pages");
        expect((designDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ContentManagerPerspective");

        expect(designDescription[4].isText()).toBeTruthy();
        expect((designDescription[4] as CardDescriptionTextElement).text).toEqual(".");

        const devOpsCard = cards[1];
        expect(devOpsCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(devOpsCard.title).toEqual("DevOps");
        expect(devOpsCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(devOpsCard.onMayClick).toBeUndefined();

        const devOpsDescription = devOpsCard.description.elements;
        expect(devOpsDescription).toHaveLength(5);

        expect(devOpsDescription[0].isText()).toBeTruthy();
        expect((devOpsDescription[0] as CardDescriptionTextElement).text).toEqual("Administer ");

        expect(devOpsDescription[1].isLink()).toBeTruthy();
        expect((devOpsDescription[1] as CardDescriptionLinkElement).text).toEqual("provisioning");
        expect((devOpsDescription[1] as CardDescriptionLinkElement).targetId).toEqual(
          "ProvisioningManagementPerspective"
        );

        expect(devOpsDescription[2].isText()).toBeTruthy();
        expect((devOpsDescription[2] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(devOpsDescription[3].isLink()).toBeTruthy();
        expect((devOpsDescription[3] as CardDescriptionLinkElement).text).toEqual("servers");
        expect((devOpsDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ServerManagementPerspective");

        expect(devOpsDescription[4].isText()).toBeTruthy();
        expect((devOpsDescription[4] as CardDescriptionTextElement).text).toEqual(".");
      });
    });
  });
});
