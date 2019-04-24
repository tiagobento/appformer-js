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
import { CubesIcon, SearchIcon } from "@patternfly/react-icons";
import { PatternFlyPopup } from "./PatternFlyPopup";
import {
  ActionGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Form,
  FormGroup,
  Gallery,
  GalleryItem,
  InputGroup,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  TextInput,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { routes } from "./Routes";
import { getProjects, postProject } from "./service/Service";
import { Pf4Label } from "./Pf4Label";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";

interface Project {
  name: string;
  url: string;
}

export function Space(props: { match: match<{ space: string }> }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [projects, setProjects] = useState([] as Project[]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const projectsInSearchQuery = (project: Project) => {
    return searchQuery.length <= 0 || project.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const AddProjectButton = () => {
    return (
      <Button onClick={openNewProjectPopup} variant={"primary"} type={"submit"}>
        Add Project
      </Button>
    );
  };

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

      <div className="pf-c-page__main-nav">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={routes.spaces()}>Spaces</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive={true}>
            <Link to={routes.space({ space: props.match.params.space })}>{props.match.params.space}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <PageSection variant={PageSectionVariants.light} className="pf-u-pt-sm">
        <Split>
          <SplitItem isMain={true}>
            <Title headingLevel="h1" size="3xl">
              Projects
            </Title>
          </SplitItem>
          <SplitItem isMain={false}>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarItem>
                  <InputGroup>
                    <TextInput
                      placeholder="Filter projects"
                      name="textInputSearch"
                      id="textInputSearch"
                      type="search"
                      aria-label="search projects"
                      value={searchQuery}
                      onInput={(e: any) => setSearchQuery(e.target.value)}
                    />
                    <Button variant={"tertiary"} aria-label="search button for search input">
                      <SearchIcon />
                    </Button>
                  </InputGroup>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>{<AddProjectButton />}</ToolbarItem>
              </ToolbarGroup>
            </Toolbar>
          </SplitItem>
        </Split>
      </PageSection>

      {projects.length > 0 && (
        <PageSection>
          <Gallery gutter="md">
            {projects.filter(projectsInSearchQuery).map(project => (
              <GalleryItem key={project.url}>
                <Link to={routes.project({ space: props.match.params.space, project: project.name })}>
                  <Card>
                    <CardBody>
                      <Split>
                        <SplitItem isMain={true}>
                          <Title headingLevel="h2" size="xl">
                            {upper(project.name)}
                          </Title>
                        </SplitItem>
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
      )}

      {projects.length === 0 && (
        <PageSection style={{ display: "flex", justifyContent: "space-around" }}>
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h5" size="lg">
              Oops! Looks like you don't have any Projects yet.
            </Title>
            <EmptyStateBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec orci enim, cursus nec dolor a, efficitur
              ullamcorper lorem. Aenean blandit est consequat mollis euismod.
            </EmptyStateBody>
            {<AddProjectButton />}
          </EmptyState>
        </PageSection>
      )}
    </>
  );
}
