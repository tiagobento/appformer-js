/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "./Login";
import { NavBar } from "./NavBar";
import { routes } from "./Routes";
import { Spaces } from "./Spaces";
import { Space } from "./Space";
import { Project } from "./Project";
import { Editor } from "./Editor";
import { AppContext } from "./AppContext";
import { Welcome } from "./Welcome";
import { Import } from "./Import";
import { Avatar, Brand, Page, PageHeader } from "@patternfly/react-core";
// import avatarImg from 'https://pf4.patternfly.org//assets/images/img_avatar.svg';

export function Main() {

  const Header = (
    <PageHeader
      logo={<Brand src={"/submarine-white.svg"} alt="Kogito"/>}
      toolbar={NavBar}
      avatar={<Avatar src={"https://pf4.patternfly.org//assets/images/img_avatar.svg"} alt="Avatar image" />}
    />
  );

  const appContext = useContext(AppContext);
  return (
    <Router>
      {!appContext.user && <Login />}
      {appContext.user && (
        <>
          <Page header={Header} style={{ height: "100%" }}>
            {/* <NavBar user={appContext.user} /> */}
            <Switch>
              <Route exact={true} path={routes.welcome()} component={Welcome} />
              <Route exact={true} path={routes.spaces()} component={Spaces} />
              <Route exact={true} path={routes.import()} component={Import} />
              <Route exact={true} path={routes.space({ space: ":space" })} component={Space} />
              <Route exact={true} path={routes.project({ space: ":space", project: ":project" })} component={Project} />
              <Route
                exact={true}
                path={routes.file({ space: ":space", project: ":project", filePath: ":filePath" })}
                component={Editor}
              />
            </Switch>
          </Page>
        </>
      )}
    </Router>
  );
}
