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
import { upper } from "./Util";
import { PatternFlyPopup } from "./PatternFlyPopup";
import {
  ActionGroup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  TextInput,
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  Split,
  SplitItem,
  Title,
  PageSection,
  PageSectionVariants,
  Badge
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { routes } from "./Routes";
import { getProjects, postProject } from "./service/Service";
import { Pf4Label } from "./Pf4Label";

interface Project {
  name: string;
  url: string;
}

export function Space(props: { match: match<{ space: string }> }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [projects, setProjects] = useState([] as Project[]);

  const updateProjects = () => {
    getProjects(props.match.params.space)
      .then(res => res.json())
      .then(json => setProjects(json));
  };

  const addProject = async (e: any) => {
    e.preventDefault();
    const createProject = await postProject(props.match.params.space, { name: newProjectName, url: newProjectUrl });
    if (createProject.status === 201) {
      updateProjects();
      setIsPopupOpen(false);
    } else {
      console.info("Error creating project.");
    }
  };

  const openNewProjectPopup = (e: any) => {
    e.preventDefault();
    setIsPopupOpen(true);
    setNewProjectName("");
    setNewProjectUrl("");
  };

  useEffect(() => {
    updateProjects();
  }, []);

  return (
    <>
      {isPopupOpen && (
        <PatternFlyPopup title={"New Project"} onClose={() => setIsPopupOpen(false)}>
          <Form>
            <FormGroup fieldId={"name"}>
              <Pf4Label required={true} text={"Name"} />
              <TextInput
                aria-label={"name"}
                placeholder={"Name"}
                onInput={(e: any) => setNewProjectName(e.target.value)}
                value={newProjectName}
              />
              <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                Only numbers, letters, and underscores.
              </p>
            </FormGroup>
            <FormGroup fieldId={"url"}>
              <Pf4Label text={"URL"} required={true} />
              <TextInput
                aria-label={"url"}
                placeholder={"URL"}
                onInput={(e: any) => setNewProjectUrl(e.target.value)}
                value={newProjectUrl}
              />
            </FormGroup>

            <ActionGroup>
              <Button onClick={addProject} variant={"primary"} type={"submit"}>
                Add
              </Button>
              <Button onClick={() => setIsPopupOpen(false)} variant={"secondary"}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </PatternFlyPopup>
      )}
      <PageSection variant={PageSectionVariants.light}>
        <Breadcrumb>
          <BreadcrumbItem to="#">Section Home</BreadcrumbItem>
          <BreadcrumbItem to="#">Section Title</BreadcrumbItem>
          <BreadcrumbItem to="#">Section Title</BreadcrumbItem>
          <BreadcrumbItem to="#" isActive={true}>
            Section Landing
          </BreadcrumbItem>
        </Breadcrumb>
        <Split>
          <SplitItem isMain={true}>
            <Title headingLevel="h1" size="3xl">
              Projects
            </Title>
          </SplitItem>
          <SplitItem isMain={false}>
            <Button onClick={openNewProjectPopup} variant={"primary"} type={"submit"}>
              Add Project
            </Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection>
        <Gallery gutter="md">
          {projects.map(project => (
            <GalleryItem>
              <Link to={routes.project({ space: props.match.params.space, project: project.name })}>
                <Card>
                  <CardBody>
                    <Split>
                      <SplitItem isMain={true}>{upper(project.name)}</SplitItem>
                      <SplitItem isMain={false}>
                        <Badge isRead={true}>1</Badge>
                      </SplitItem>
                    </Split>
                  </CardBody>
                </Card>
              </Link>
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>

      {/* <div>
        <h1>
          <span>{upper(props.match.params.space)} / Projects</span>
          <span> - </span>
          <span>
            <a href={"#"} onClick={openNewProjectPopup}>
              New
            </a>
          </span>
        </h1>
        {projects.map(project => (
          <div key={project.name}>
            <Link to={routes.project({ space: props.match.params.space, project: project.name })}>
              {upper(project.name)}
            </Link>
            <br />
          </div>
        ))}
      </div> */}
    </>
  );
}
