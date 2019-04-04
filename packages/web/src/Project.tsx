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
import { useState } from "react";
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
  DataList,
  DataListCell,
  DataListItem,
  Card,
  CardBody,
  Split,
  SplitItem,
  Title,
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { routes } from "./Routes";
import { Pf4Label } from "./Pf4Label";
import { useEffect } from "react";
import { getFiles, createFileService } from "./service/Service";
import { FileImageIcon } from "@patternfly/react-icons";

export function Project(props: { match: match<{ space: string; project: string }> }) {
  const [popup, setPopup] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [files, setFiles] = useState([] as string[]);

  const updateFiles = () => {
    getFiles(props.match.params.space, props.match.params.project)
      .then(res => res.json())
      .then(json => setFiles(json));
  };

  const addFile = (e:any) => {
    e.preventDefault();
    createFileService(props.match.params.space, props.match.params.project, newFileName)
        .then(() => {
            setFiles([...files, newFileName]);
            setPopup(false);
        });
  };

  const openNewFilePopup = () => {
    setPopup(true);
  };

  useEffect(() => {
    updateFiles();
    return () => {
      /**/
    };
  }, []);

  return (
    <>
      {popup && (
        <PatternFlyPopup title={"New file"} onClose={() => setPopup(false)}>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <Pf4Label required={true} text={"Name"} />
              <TextInput onInput={(e: any) => setNewFileName(e.target.value)} value={newFileName} />
              <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                Only numbers, letters, and underscores.
              </p>

              <ActionGroup>
                <Button onClick={addFile} variant={"primary"} type={"submit"}>
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
          <BreadcrumbItem>
            <Link to={routes.spaces()}>Spaces</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to={routes.space({space: props.match.params.space})}>{props.match.params.space}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem  isActive={true}>
            <Link to={routes.project({space: props.match.params.space, project: props.match.params.project})}>{props.match.params.project}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Split>
          <SplitItem isMain={true}>
            <Title headingLevel="h1" size="3xl">
              Files
            </Title>
          </SplitItem>
          <SplitItem isMain={false}>
            <Button onClick={openNewFilePopup} variant={"primary"} type={"submit"}>
              Add File
            </Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection>
        <DataList aria-label="List of project files">
          {files.map(file => (
            <DataListItem key={file} aria-labelledby="simple-item1" isExpanded={false}>
              <DataListCell width={1}>
                <FileImageIcon size="md" />
              </DataListCell>
              <DataListCell width={4}>
                <Link
                  to={routes.file({
                    space: props.match.params.space,
                    project: props.match.params.project,
                    filePath: file
                  })}
                >
                  {upper(file)}
                </Link>
              </DataListCell>
              <DataListCell width={2}>DMN</DataListCell>
              <DataListCell width={4}>Last modified 1 week ago</DataListCell>
              <DataListCell width={4}>Created 3 weeks ago</DataListCell>
            </DataListItem>
          ))}
        </DataList>
      </PageSection>
    </>
  );
}
