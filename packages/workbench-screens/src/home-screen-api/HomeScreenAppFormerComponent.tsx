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

import * as AppFormer from "appformer-js";
import * as React from "react";
import { HomeScreenView } from "./view/HomeScreenView";
import { HomeScreenProvider } from "./model";

export class HomeScreenAppFormerComponent extends AppFormer.Screen {
  private readonly provider: HomeScreenProvider;

  public constructor(modelProvider: HomeScreenProvider) {
    super("org.kie.workbench.common.screens.home.client.HomePresenter");
    this.af_isReact = true;
    this.af_componentTitle = AppFormer.translate("homeName", []);

    this.provider = modelProvider;
  }

  public af_componentRoot(children?: any): AppFormer.Element {
    return <HomeScreenView contentProvider={this.provider} />;
  }
}
