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

import { routes } from "./Routes";
import * as React from "react";
import { useEffect, useState } from "react";
import { upper } from "./Util";
import { getSpaces, postSpace } from "./service/Service";
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
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  TextInput,
  Title
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { CubesIcon } from "@patternfly/react-icons";
import { Pf4Label } from "./Pf4Label";

interface Space {
  name: string;
}

export function Spaces() {
  const [popup, setPopup] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [spaces, setSpaces] = useState([] as Space[]);

  const updateSpaces = () => {
    getSpaces()
      .then(res => res.json())
      .then(json => setSpaces(json as Space[]));
  };

  const addSpace = (e: any) => {
    e.preventDefault();
    return postSpace({ name: newSpaceName }).then(res => {
      if (res.status === 201) {
        setPopup(false);
        updateSpaces();
      } else {
        console.info("Error creating space");
      }
    });
  };

  const openNewSpacePopup = () => {
    setPopup(true);
    setNewSpaceName("");
  };

  useEffect(() => {
    updateSpaces();
  }, []);

  const AddSpaceButton = () => {
    return (
      <Button onClick={openNewSpacePopup} variant={"primary"} type={"submit"}>
        Add Space
      </Button>
    );
  };

  return (
    <>
      {popup && (
        <PatternFlyPopup title={"New Space"} onClose={() => setPopup(false)}>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <Pf4Label required={true} text={"Name"} />
              <TextInput
                aria-label={"name"}
                onInput={(e: any) => setNewSpaceName(e.target.value)}
                value={newSpaceName}
              />
              <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                Only numbers, letters, and underscores.
              </p>

              <ActionGroup>
                <Button onClick={addSpace} variant={"primary"} type={"submit"}>
                  Add
                </Button>
                <Button onClick={() => setPopup(false)} variant={"secondary"}>
                  Cancel
                </Button>
              </ActionGroup>
            </FormGroup>
          </Form>
        </PatternFlyPopup>
      )}

      <div className="pf-c-page__main-nav">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={routes.spaces()}>Spaces</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <PageSection variant={PageSectionVariants.light} className="pf-u-pt-sm">
        <Split>
          <SplitItem isMain={true}>
            <Title headingLevel="h1" size="3xl">
              Spaces
            </Title>
          </SplitItem>
          <SplitItem isMain={false}>{<AddSpaceButton />}</SplitItem>
        </Split>
      </PageSection>

      {spaces.length > 0 && (
        <PageSection>
          <Gallery gutter="md">
            {spaces.map(space => (
              <GalleryItem key={space.name}>
                <Link to={routes.space({ space: space.name })}>
                  <Card>
                    <CardBody>
                      <Split>
                        <SplitItem isMain={true}>
                          <Title headingLevel="h2" size="xl">
                            {upper(space.name)}
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

      {spaces.length === 0 && (
        <PageSection style={{ display: "flex", justifyContent: "space-around" }}>
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h5" size="lg">
              Oops! Looks like you don't have any Spaces yet.
            </Title>
            <EmptyStateBody>
              Spaces are logical groups of Projects. Once you add your first space you can create projects or event
              import projects from GitHub.
            </EmptyStateBody>
            {<AddSpaceButton />}
          </EmptyState>
        </PageSection>
      )}
    </>
  );
}
