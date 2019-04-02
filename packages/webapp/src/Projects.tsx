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
import { match } from "react-router";
import { upper } from "./Util";
import { useState } from "react";
import { PatternFlyPopup } from "./PatternFlyPopup";
import { ActionGroup, Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { routes } from "./Routes";

export function Projects(props: { match: match<{ space: string }> }) {
  const [popup, setPopup] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [projects, setProjects] = useState([
    { name: "foo", url: "https://github.com/tiagobento/foo" },
    { name: "bar", url: "https://github.com/tiagobento/bar" }
  ]);

  const addProject = () => {
    setProjects([...projects, { name: newProjectName, url: newProjectUrl }]);
    setPopup(false);
  };

  return (
    <>
      {popup && (
        <PatternFlyPopup title={"New Project"} onClose={() => setPopup(false)}>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <label className="pf-c-form__label" htmlFor="help-text-simple-form-name">
                Name
                <span className="pf-c-form__label-required" aria-hidden="true">
                  *
                </span>
              </label>
              <TextInput
                placeholder={"Name"}
                onInput={(e: any) => setNewProjectName(e.target.value)}
                value={newProjectName}
              />
              <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                Only numbers, letters, and underscores.
              </p>
            </FormGroup>
            <FormGroup fieldId={"url"} className="pf-c-form__group">
              <label className="pf-c-form__label" htmlFor="help-text-simple-form-name">
                URL
                <span className="pf-c-form__label-required" aria-hidden="true">
                  *
                </span>
              </label>
              <TextInput
                placeholder={"URL"}
                onInput={(e: any) => setNewProjectUrl(e.target.value)}
                value={newProjectUrl}
              />
            </FormGroup>

            <ActionGroup>
              <Button onClick={() => addProject()} variant={"primary"} type={"submit"}>
                Add
              </Button>
              <Button onClick={() => setPopup(false)} variant={"secondary"}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </PatternFlyPopup>
      )}
      <div>
        <h1>
          <span>{upper(props.match.params.space)} / Projects</span>
          <span> - </span>
          <span>
            <a
              href={"#"}
              onClick={() => {
                setPopup(true);
                setNewProjectName("");
                setNewProjectUrl("");
              }}
            >
              new
            </a>
          </span>
        </h1>
        {projects.map(project => (
          <div key={project.name}>
            <Link to={routes.files({ space: props.match.params.space, project: project.name })}>
              {upper(project.name)}
            </Link>
            <br />
          </div>
        ))}
      </div>
    </>
  );
}
