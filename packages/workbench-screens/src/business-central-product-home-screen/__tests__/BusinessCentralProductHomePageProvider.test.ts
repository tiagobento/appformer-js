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

import { BusinessCentralProductHomePageProvider } from "../BusinessCentralProductHomePageProvider";
import { Profile } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import { AppFormer } from "appformer-js";
import { CardDescriptionLinkElement, CardDescriptionTextElement } from "../../home-screen-api/model";
import { AuthorizationManager } from "../../home-screen-api/util";

const translationMap = new Map<string, string>([
  ["Heading", "Welcome to Red Hat Process Automation Manager"],
  ["Heading.DecisionManager", "Welcome to Red Hat Decision Manager"],
  [
    "SubHeading",
    "Red Hat Process Automation Manager (RHPAM) offers a set of flexible tools that support the way you need to work. Select a tool below to get started."
  ],
  [
    "SubHeading.DecisionManager",
    "Red Hat Decision Manager (RHDM) offers a set of flexible tools that support the way you need to work. Select a tool below to get started."
  ],
  ["Design", "Design"],
  ["DesignDescription", "Create and modify {0}."],
  ["DesignDescription.Full", "Create and modify {0} and {1}."],
  ["DesignRuntimeDescription", "Create and modify {0}."],
  ["Deploy", "Deploy"],
  ["DeployDescription1", "Administer {0}."],
  ["DeployDescription2", "Administer {0} and {1}."],
  ["Manage", "Manage"],
  ["ManageDescription", "Access {0}, {1}, {2}, {3} and {4}."],
  ["Track", "Track"],
  ["TrackDescription", "View {0}, {1} and {2}."],
  ["HomeProducer.Projects", "projects"],
  ["HomeProducer.Pages", "pages"],
  ["HomeProducer.Provisioning", "provisioning"],
  ["HomeProducer.Servers", "servers"],
  ["HomeProducer.ProcessDefinitions", "process definitions"],
  ["HomeProducer.ProcessInstances", "process instances"],
  ["HomeProducer.Tasks", "tasks"],
  ["HomeProducer.Jobs", "jobs"],
  ["HomeProducer.ExecutionErrors", "executions errors"],
  ["HomeProducer.TaskInbox", "task inbox"],
  ["HomeProducer.TaskReports", "task reports"],
  ["HomeProducer.ProcessReports", "process reports"]
]);

describe("BusinessCentralProductHomePageProvider", () => {
  describe("get", () => {
    beforeEach(() => {
      jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => true);
      AppFormer.prototype.translate = jest.fn((key: string): string => translationMap.get(key)!);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("with FULL profile", () => {
      const profile = Profile.FULL;

      test("should return consistent main data", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        expect(model.welcomeText).toEqual("Welcome to Red Hat Process Automation Manager");
        expect(model.description).toEqual(
          "Red Hat Process Automation Manager (RHPAM) offers a set of flexible tools that support the way you need " +
            "to work. Select a tool below to get started."
        );
        expect(model.backgroundImageUrl).toEqual("images/product_home_bg.png");

        const cards = model.cards;
        expect(cards).toHaveLength(4);
      });

      test("should return a correct design card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const designCard = model.cards[0];
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
      });

      test("with deployment authorized, should return a correct deploy card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const deployCard = model.cards[1];
        expect(deployCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(deployCard.title).toEqual("Deploy");
        expect(deployCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(deployCard.onMayClick).toBeUndefined();

        const deployDescription = deployCard.description.elements;
        expect(deployDescription).toHaveLength(5);

        expect(deployDescription[0].isText()).toBeTruthy();
        expect((deployDescription[0] as CardDescriptionTextElement).text).toEqual("Administer ");

        expect(deployDescription[1].isLink()).toBeTruthy();
        expect((deployDescription[1] as CardDescriptionLinkElement).text).toEqual("provisioning");
        expect((deployDescription[1] as CardDescriptionLinkElement).targetId).toEqual(
          "ProvisioningManagementPerspective"
        );

        expect(deployDescription[2].isText()).toBeTruthy();
        expect((deployDescription[2] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(deployDescription[3].isLink()).toBeTruthy();
        expect((deployDescription[3] as CardDescriptionLinkElement).text).toEqual("servers");
        expect((deployDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ServerManagementPerspective");

        expect(deployDescription[4].isText()).toBeTruthy();
        expect((deployDescription[4] as CardDescriptionTextElement).text).toEqual(".");
      });

      test("with deployment unauthorized, should return a correct deploy card", () => {
        jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => false);

        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const deployCard = model.cards[1];
        expect(deployCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(deployCard.title).toEqual("Deploy");
        expect(deployCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(deployCard.onMayClick).toBeUndefined();

        //Administer {0}.
        const deployDescription = deployCard.description.elements;
        expect(deployDescription).toHaveLength(3);

        expect(deployDescription[0].isText()).toBeTruthy();
        expect((deployDescription[0] as CardDescriptionTextElement).text).toEqual("Administer ");

        expect(deployDescription[1].isLink()).toBeTruthy();
        expect((deployDescription[1] as CardDescriptionLinkElement).text).toEqual("servers");
        expect((deployDescription[1] as CardDescriptionLinkElement).targetId).toEqual("ServerManagementPerspective");

        expect(deployDescription[2].isText()).toBeTruthy();
        expect((deployDescription[2] as CardDescriptionTextElement).text).toEqual(".");
      });

      test("should return a correct manage card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const manageCard = model.cards[2];
        expect(manageCard.iconCssClasses).toStrictEqual(["fa", "fa-briefcase"]);
        expect(manageCard.title).toEqual("Manage");
        expect(manageCard.perspectiveId).toEqual("ProcessInstances");
        expect(manageCard.onMayClick).toBeUndefined();

        const manageDescription = manageCard.description.elements;
        expect(manageDescription).toHaveLength(11);

        expect(manageDescription[0].isText()).toBeTruthy();
        expect((manageDescription[0] as CardDescriptionTextElement).text).toEqual("Access ");

        expect(manageDescription[1].isLink()).toBeTruthy();
        expect((manageDescription[1] as CardDescriptionLinkElement).text).toEqual("process definitions");
        expect((manageDescription[1] as CardDescriptionLinkElement).targetId).toEqual("ProcessDefinitions");

        expect(manageDescription[2].isText()).toBeTruthy();
        expect((manageDescription[2] as CardDescriptionTextElement).text).toEqual(", ");

        expect(manageDescription[3].isLink()).toBeTruthy();
        expect((manageDescription[3] as CardDescriptionLinkElement).text).toEqual("process instances");
        expect((manageDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ProcessInstances");

        expect(manageDescription[4].isText()).toBeTruthy();
        expect((manageDescription[4] as CardDescriptionTextElement).text).toEqual(", ");

        expect(manageDescription[5].isLink()).toBeTruthy();
        expect((manageDescription[5] as CardDescriptionLinkElement).text).toEqual("tasks");
        expect((manageDescription[5] as CardDescriptionLinkElement).targetId).toEqual("TaskAdmin");

        expect(manageDescription[6].isText()).toBeTruthy();
        expect((manageDescription[6] as CardDescriptionTextElement).text).toEqual(", ");

        expect(manageDescription[7].isLink()).toBeTruthy();
        expect((manageDescription[7] as CardDescriptionLinkElement).text).toEqual("jobs");
        expect((manageDescription[7] as CardDescriptionLinkElement).targetId).toEqual("Requests");

        expect(manageDescription[8].isText()).toBeTruthy();
        expect((manageDescription[8] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(manageDescription[9].isLink()).toBeTruthy();
        expect((manageDescription[9] as CardDescriptionLinkElement).text).toEqual("executions errors");
        expect((manageDescription[9] as CardDescriptionLinkElement).targetId).toEqual("ExecutionErrors");

        expect(manageDescription[10].isText()).toBeTruthy();
        expect((manageDescription[10] as CardDescriptionTextElement).text).toEqual(".");
      });

      test("should return a correct track card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const trackCard = model.cards[3];
        expect(trackCard.iconCssClasses).toStrictEqual(["pficon", "pficon-trend-up"]);
        expect(trackCard.title).toEqual("Track");
        expect(trackCard.perspectiveId).toEqual("ProcessDashboardPerspective");
        expect(trackCard.onMayClick).toBeUndefined();

        const trackDescription = trackCard.description.elements;
        expect(trackDescription).toHaveLength(7);

        expect(trackDescription[0].isText()).toBeTruthy();
        expect((trackDescription[0] as CardDescriptionTextElement).text).toEqual("View ");

        expect(trackDescription[1].isLink()).toBeTruthy();
        expect((trackDescription[1] as CardDescriptionLinkElement).text).toEqual("task inbox");
        expect((trackDescription[1] as CardDescriptionLinkElement).targetId).toEqual("Tasks");

        expect(trackDescription[2].isText()).toBeTruthy();
        expect((trackDescription[2] as CardDescriptionTextElement).text).toEqual(", ");

        expect(trackDescription[3].isLink()).toBeTruthy();
        expect((trackDescription[3] as CardDescriptionLinkElement).text).toEqual("process reports");
        expect((trackDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ProcessDashboardPerspective");

        expect(trackDescription[4].isText()).toBeTruthy();
        expect((trackDescription[4] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(trackDescription[5].isLink()).toBeTruthy();
        expect((trackDescription[5] as CardDescriptionLinkElement).text).toEqual("task reports");
        expect((trackDescription[5] as CardDescriptionLinkElement).targetId).toEqual("TaskDashboardPerspective");

        expect(trackDescription[6].isText()).toBeTruthy();
        expect((trackDescription[6] as CardDescriptionTextElement).text).toEqual(".");
      });
    });

    describe("with PLANNER_AND_RULES profile", () => {
      const profile = Profile.PLANNER_AND_RULES;

      test("should return consistent main data", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        expect(model.welcomeText).toEqual("Welcome to Red Hat Decision Manager");
        expect(model.description).toEqual(
          "Red Hat Decision Manager (RHDM) offers a set of flexible tools that support the way you need to work. " +
            "Select a tool below to get started."
        );
        expect(model.backgroundImageUrl).toEqual("images/product_home_bg.png");

        const cards = model.cards;
        expect(cards).toHaveLength(2);
      });

      test("should return a correct design card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const designCard = model.cards[0];
        expect(designCard.iconCssClasses).toStrictEqual(["pficon", "pficon-blueprint"]);
        expect(designCard.title).toEqual("Design");
        expect(designCard.perspectiveId).toEqual("LibraryPerspective");
        expect(designCard.onMayClick).toBeUndefined();

        const designDescription = designCard.description.elements;
        expect(designDescription).toHaveLength(3);

        expect(designDescription[0].isText()).toBeTruthy();
        expect((designDescription[0] as CardDescriptionTextElement).text).toEqual("Create and modify ");

        expect(designDescription[1].isLink()).toBeTruthy();
        expect((designDescription[1] as CardDescriptionLinkElement).text).toEqual("projects");
        expect((designDescription[1] as CardDescriptionLinkElement).targetId).toEqual("LibraryPerspective");

        expect(designDescription[2].isText()).toBeTruthy();
        expect((designDescription[2] as CardDescriptionTextElement).text).toEqual(".");
      });

      test("with deployment authorized, should return a correct deploy card", () => {
        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const deployCard = model.cards[1];
        expect(deployCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(deployCard.title).toEqual("Deploy");
        expect(deployCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(deployCard.onMayClick).toBeUndefined();

        const deployDescription = deployCard.description.elements;
        expect(deployDescription).toHaveLength(5);

        expect(deployDescription[0].isText()).toBeTruthy();
        expect((deployDescription[0] as CardDescriptionTextElement).text).toEqual("Administer ");

        expect(deployDescription[1].isLink()).toBeTruthy();
        expect((deployDescription[1] as CardDescriptionLinkElement).text).toEqual("provisioning");
        expect((deployDescription[1] as CardDescriptionLinkElement).targetId).toEqual(
          "ProvisioningManagementPerspective"
        );

        expect(deployDescription[2].isText()).toBeTruthy();
        expect((deployDescription[2] as CardDescriptionTextElement).text).toEqual(" and ");

        expect(deployDescription[3].isLink()).toBeTruthy();
        expect((deployDescription[3] as CardDescriptionLinkElement).text).toEqual("servers");
        expect((deployDescription[3] as CardDescriptionLinkElement).targetId).toEqual("ServerManagementPerspective");

        expect(deployDescription[4].isText()).toBeTruthy();
        expect((deployDescription[4] as CardDescriptionTextElement).text).toEqual(".");
      });

      test("with deployment unauthorized, should return a correct deploy card", () => {
        jest.spyOn(AuthorizationManager, "hasAccessToPerspective").mockImplementation(() => false);

        const model = new BusinessCentralProductHomePageProvider().get(profile);

        const deployCard = model.cards[1];
        expect(deployCard.iconCssClasses).toStrictEqual(["fa", "fa-gears"]);
        expect(deployCard.title).toEqual("Deploy");
        expect(deployCard.perspectiveId).toEqual("ServerManagementPerspective");
        expect(deployCard.onMayClick).toBeUndefined();

        //Administer {0}.
        const deployDescription = deployCard.description.elements;
        expect(deployDescription).toHaveLength(3);

        expect(deployDescription[0].isText()).toBeTruthy();
        expect((deployDescription[0] as CardDescriptionTextElement).text).toEqual("Administer ");

        expect(deployDescription[1].isLink()).toBeTruthy();
        expect((deployDescription[1] as CardDescriptionLinkElement).text).toEqual("servers");
        expect((deployDescription[1] as CardDescriptionLinkElement).targetId).toEqual("ServerManagementPerspective");

        expect(deployDescription[2].isText()).toBeTruthy();
        expect((deployDescription[2] as CardDescriptionTextElement).text).toEqual(".");
      });
    });
  });
});
