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
import { postSpace, getSpaces } from "./service/Service";
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
              Spaces
            </Title>
          </SplitItem>
          <SplitItem isMain={false}>
            <Button onClick={openNewSpacePopup} variant={"primary"} type={"submit"}>
              Add Space
            </Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection>
        <Gallery gutter="md">
          {spaces.map(space => (
            <GalleryItem>
              <Link to={routes.space({ space: space.name })}>
                <Card>
                  <CardBody>
                    <Split>
                      <SplitItem isMain={true}>{upper(space.name)}</SplitItem>
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
    </>
  );
}
