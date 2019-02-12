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
import {
  Profile,
  ProfilePreferences,
  ProfilePreferencesPortableGeneratedImpl
} from "@kiegroup-ts-generated/kie-wb-common-profile-api";
import { PreferenceBeanServerStore } from "@kiegroup-ts-generated/uberfire-preferences-api-rpc";
import { CardView } from "./CardView";
import { HomeScreen, HomeScreenProvider } from "../model";

interface Props {
  contentProvider: HomeScreenProvider;
}

interface State {
  model?: HomeScreen;
}

export class HomeScreenView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};

    this.retrieveCurrentProfile(new PreferenceBeanServerStore())
      .then(profile => {
        this.setState({ model: props.contentProvider.get(profile) });
      })
      .catch(() => new Error("Could not retrieve profile preferences."));
  }

  public render() {
    if (!this.state.model) {
      return <></>;
    }

    const containerStyle = { backgroundImage: `url(${this.state.model.backgroundImageUrl})` };

    // TODO: link with HomeView.less
    return (
      <div id="home-page">
        <div className="kie-page">
          <div
            data-field="container"
            className="kie-page__content kie-content--bg-image kie-blank-slate"
            style={containerStyle}
          >
            <div className="container-fluid kie-container-fluid--blank-slate">
              <div className="blank-slate-pf row">
                <h1 data-field="welcome">{this.state.model.welcomeText}</h1>

                <p data-field="description">{this.state.model.description}</p>

                <div data-field="shortcuts" className="blank-slate-pf-secondary-action">
                  {this.state.model.cards.map((card, idx) => (
                    <CardView model={card} key={idx} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private retrieveCurrentProfile(preferencesStore: PreferenceBeanServerStore): Promise<Profile> {
    const args = { emptyPortablePreference: new ProfilePreferencesPortableGeneratedImpl({}) };

    return preferencesStore
      .load2<ProfilePreferences, ProfilePreferencesPortableGeneratedImpl>(args)
      .then(pref => pref.profile!);
  }
}
