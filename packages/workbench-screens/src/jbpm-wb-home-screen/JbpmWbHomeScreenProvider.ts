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

import * as HomeApi from "../home-screen-api";
import { Profile } from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import * as AppFormer from "appformer-js";

export class JbpmWbHomeScreenProvider implements HomeApi.HomeScreenProvider {
  public get(profile: Profile): HomeApi.HomeScreen {
    const welcomeText = AppFormer.translate("Heading", []);
    const description = AppFormer.translate("SubHeading", []);
    const backgroundImageUrl = "images/home_bg.jpg";

    const cards = [this.designCard(), this.devOpsCard(), this.manageCard(), this.trackCard()];

    return new HomeApi.HomeScreen(welcomeText, description, backgroundImageUrl, cards);
  }

  private designCard() {
    const cssClasses = ["pficon", "pficon-blueprint"];
    const title = AppFormer.translate("Design", []);

    const descriptionTextMask = AppFormer.translate("DesignDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "LibraryPerspective");
  }

  private devOpsCard() {
    const cssClasses = ["fa", "fa-gears"];
    const title = AppFormer.translate("DevOps", []);

    const descriptionTextMask = AppFormer.translate("DevOpsDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "ServerManagementPerspective");
  }

  private manageCard() {
    const cssClasses = ["fa", "fa-briefcase"];
    const title = AppFormer.translate("Manage", []);

    const descriptionTextMask = AppFormer.translate("ManageDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "ProcessInstances");
  }

  private trackCard() {
    const cssClasses = ["pficon", "pficon-trend-up"];
    const title = AppFormer.translate("Track", []);

    const descriptionTextMask = AppFormer.translate("TrackDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "ProcessDashboardPerspective");
  }
}
