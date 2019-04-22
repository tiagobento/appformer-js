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
import { useEffect, useState } from "react";
import { match } from "react-router";
import { History, Location } from "history";
import { PatternFlyPopup } from "./PatternFlyPopup";
import { ActionGroup, Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
import { routes } from "./Routes";
import { getProjectByUrl, postProject, postSpace } from "./service/Service";
import { Pf4Label } from "./Pf4Label";

export function Import(props: { history: History; location: Location; match: match }) {
  const path = new URLSearchParams(props.location.search).get("path");
  if (!path || !path.startsWith("https://github.com")) {
    return (
      <PatternFlyPopup
        title={"Oops!"}
        onClose={() => {
          /**/
        }}
      >
        "{path}" doesn't look like something we can import.
      </PatternFlyPopup>
    );
  }

  const uriSplit = path.replace("https://github.com/", "").split("/");
  const [space, setSpace] = useState(uriSplit[0]);
  const [project, setProject] = useState(uriSplit[1]);
  const [isLoadingImportPath, setIsLoadingImportPath] = useState(true);

  const pathSplit = path.split("/edit");
  const projectUrl = pathSplit[0];
  const fileUrl = pathSplit[1];

  const importProject = async (e: any) => {
    e.preventDefault();
    await postSpace({ name: space });
    const createProject = await postProject(space, { name: project, url: projectUrl });
    if (createProject.status === 201) {
      props.history.push(routes.project({ space, project }));
    } else {
      console.info("Error creating project");
    }
  };

  const cancel = () => {
    props.history.push(routes.spaces());
  };

  useEffect(() => {
    getProjectByUrl(projectUrl).then(res => {
      if (res.status === 200) {
        props.history.push(routes.project({ space, project }));
      } else {
        setIsLoadingImportPath(false);
      }
    });
  }, []);

  return (
    <>
      {isLoadingImportPath && <></>}
      {!isLoadingImportPath && (
        <PatternFlyPopup onClose={cancel} title={"Import"}>
          <p>
            You are importing a project from GitHub. Below you can change the Space where it's going to be added as well
            as the Project name.
          </p>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <Pf4Label required={true} text={"Space"} />
              <TextInput
                aria-label={space}
                placeholder={"Space"}
                onInput={(e: any) => setSpace(e.target.value)}
                value={space}
              />
            </FormGroup>
            <FormGroup fieldId={"url"} className="pf-c-form__group">
              <Pf4Label required={true} text={"Project"} />
              <TextInput
                aria-label={"project"}
                placeholder={"Project"}
                onInput={(e: any) => setProject(e.target.value)}
                value={project}
              />
            </FormGroup>

            <ActionGroup>
              <Button onClick={importProject} variant={"primary"} type={"submit"}>
                Import
              </Button>
              <Button onClick={cancel} variant={"secondary"}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </PatternFlyPopup>
      )}
    </>
  );
}
