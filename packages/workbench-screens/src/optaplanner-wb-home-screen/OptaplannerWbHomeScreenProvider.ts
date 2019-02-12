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

export class OptaplannerWbHomeScreenProvider implements HomeApi.HomeScreenProvider {
  public get(profile: Profile): HomeApi.HomeScreen {
    const welcomeText = AppFormer.translate("HomeProducer.Heading", []);

    const description = AppFormer.translate("HomeProducer.SubHeading", []);

    const backgroundImageUrl = "images/home_bg.jpg";

    const cards = [this.designCard(), this.devOpsCard()];

    return new HomeApi.HomeScreen(welcomeText, description, backgroundImageUrl, cards);
  }

  private designCard() {
    const cssClasses = ["pficon", "pficon-blueprint"];
    const title = AppFormer.translate("HomeProducer.Design", []);

    const descriptionTextMask = AppFormer.translate("HomeProducer.DesignDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "LibraryPerspective");
  }

  private devOpsCard() {
    const cssClasses = ["fa", "fa-gears"];
    const title = AppFormer.translate("HomeProducer.DevOps", []);

    const descriptionTextMask = AppFormer.translate("HomeProducer.DevOpsDescription", []);
    const description = new HomeApi.CardDescriptionBuilder(descriptionTextMask).build();

    return new HomeApi.Card(cssClasses, title, description, "ServerManagementPerspective");
  }
}
