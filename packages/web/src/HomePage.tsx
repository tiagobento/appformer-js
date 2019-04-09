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
  List,
  ListItem,
  CardHeader,
  CardFooter,
  Text,
  TextContent,
  TextVariants
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { Pf4Label } from "./Pf4Label";
import { DesktopIcon, CodeIcon, FileImageIcon, RepositoryIcon } from "@patternfly/react-icons";

interface Space {
  name: string;
}

export function Homepage() {
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
      <PageSection variant={PageSectionVariants.dark}>
        <Title headingLevel="h1" size="3xl">
          The next generation of business editor tooling
        </Title>
      </PageSection>
      <PageSection variant="dark" className="pf-m-fill">
        <Gallery gutter="lg">
          <Card>
            <CardHeader>
              <Title size="2xl">Desktop</Title>
            </CardHeader>
            <CardBody>
              <TextContent className="pf-u-mb-xl">
                <Text component={TextVariants.p}>
                  Quickly create business diagrams using a desktop application. Store files locally using the desktop
                  file system.
                </Text>
                <Text component="p" />
              </TextContent>
              <List>
                <ListItem>Add</ListItem>
                <ListItem>Add</ListItem>
                <ListItem>Local file storage</ListItem>
              </List>
            </CardBody>
            <CardFooter>
              <Split>
                <SplitItem isMain={true}>
                  <DesktopIcon size="lg" />
                </SplitItem>
                <SplitItem isMain={false}>
                  <Button variant="primary">Get desktop</Button>
                </SplitItem>
              </Split>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Title size="2xl">Web</Title>
            </CardHeader>
            <CardBody>
              <TextContent className="pf-u-mb-xl">
                <Text component={TextVariants.p}>
                  Easily access online tooling and storage. The web experience offers direct access to online business
                  process and decision editors.
                </Text>
                <Text component="p" />
              </TextContent>
              <List>
                <ListItem>Online access to projects and editors</ListItem>
                <ListItem>Quick file navigation</ListItem>
              </List>
            </CardBody>
            <CardFooter>
              <Split>
                <SplitItem isMain={true}>
                  <CodeIcon size="lg" />
                </SplitItem>
                <SplitItem isMain={false}>
                  <Button variant="primary">Go to web</Button>
                </SplitItem>
              </Split>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Title size="2xl">Browser extensions</Title>
            </CardHeader>
            <CardBody>
              <TextContent className="pf-u-mb-xl">
                <Text component={TextVariants.p}>
                  Online direct access to editors in the preferred developer source code host
                </Text>
                <Text component="p" />
              </TextContent>
              <List>
                <ListItem>Community focused</ListItem>
                <ListItem>Integrate directly into source code host (GitHub)</ListItem>
              </List>
            </CardBody>
            <CardFooter>
              <Split>
                <SplitItem isMain={true}>
                  <RepositoryIcon size="lg" />
                </SplitItem>
                <SplitItem isMain={false}>
                  <Button variant="primary">Get browser extension</Button>
                </SplitItem>
              </Split>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Title size="2xl">IDE extensions</Title>
            </CardHeader>
            <CardBody>
              <TextContent className="pf-u-mb-xl">
                <Text component={TextVariants.p}>
                  Integrate directly with developer IDEs. Edit files directly in a developer IDE environment.
                </Text>
                <Text component="p" />
              </TextContent>
              <List>
                <ListItem>Edit multiple files at a time</ListItem>
                <ListItem>Tree view "file explorer"</ListItem>
                <ListItem>Integrate directly into developer IDE</ListItem>
              </List>
            </CardBody>
            <CardFooter>
              <Split>
                <SplitItem isMain={true}>
                  <FileImageIcon size="lg" />
                </SplitItem>
                <SplitItem isMain={false}>
                  <Button variant="primary">Get IDE extension</Button>
                </SplitItem>
              </Split>
            </CardFooter>
          </Card>
        </Gallery>
      </PageSection>
      <PageSection variant="light">
        <Gallery gutter="lg">
          <List>
            <ListItem>Add a project</ListItem>
            <ListItem>Add a file</ListItem>
            <ListItem>Create a space</ListItem>
          </List>
          <List>
            <ListItem>loadApplication.dmn</ListItem>
            <ListItem>applicantApproval.bpm</ListItem>
            <ListItem>contact.txt</ListItem>
          </List>
          <List>
            <ListItem>GitHub repository</ListItem>
            <ListItem>Community videos</ListItem>
          </List>
          <List>
            <ListItem>OMG DMN specifications</ListItem>
            <ListItem>Drools documentation</ListItem>
          </List>

        </Gallery>
      </PageSection>
    </>
  );
}
