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
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "./Login";
import { NavBar } from "./NavBar";
import { routes } from "./Routes";
import { Spaces } from "./Spaces";
import { Projects } from "./Projects";
import { Files } from "./Files";
import { Editor } from "./Editor";
import { AppContext } from "./App";
import { Welcome } from "./Welcome";

export function Main() {
  const appContext = useContext(AppContext);
  return (
    <Router>
      {!appContext.user && <Login />}
      {appContext.user && (
        <>
          <NavBar user={appContext.user} />
          <main role="main" className={"pf-c-page__main"}>
            <section className={"pf-c-page__main-section pf-m-light"}>
              <div className={"pf-c-content"} style={{ height: "100%" }}>
                <Route path={routes.welcome()} exact={true} component={Welcome} />
                <Route path={routes.spaces()} exact={true} component={Spaces} />
                <Route path={routes.projects({ space: ":space" })} exact={true} component={Projects} />
                <Route path={routes.files({ space: ":space", project: ":project" })} exact={true} component={Files} />
                <Route
                  path={routes.file({ space: ":space", project: ":project", filePath: ":filePath" })}
                  component={Editor}
                />
              </div>
            </section>
          </main>
        </>
      )}
    </Router>
  );
}
