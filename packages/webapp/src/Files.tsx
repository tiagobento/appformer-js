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
import {match} from "react-router";
import { useState} from "react";
import {storage} from "./Storage";
import {PatternFlyPopup} from "./PatternFlyPopup";
import {ActionGroup, Button, Form, FormGroup, TextInput} from "@patternfly/react-core";
import {Link} from "react-router-dom";
import {routes} from "./Routes";

export function Files(props: { match: match<{ space: string; project: string }> }) {
    const [popup, setPopup] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [files, setFiles] = useState(Array.from(storage.values()).map(s => ({name: s.name})));

    const addFile = () => {
        setFiles([...files, {name: newFileName}]);
        setPopup(false);
    };
    return (
        <>
            {popup && (
                <PatternFlyPopup title={"New file"} onClose={() => setPopup(false)}>
                    <Form>
                        <FormGroup fieldId={"name"} className="pf-c-form__group">
                            <label className="pf-c-form__label" htmlFor="help-text-simple-form-name">
                                Name
                                <span className="pf-c-form__label-required" aria-hidden="true">
                  *
                </span>
                            </label>
                            <TextInput onInput={(e: any) => setNewFileName(e.target.value)} value={newFileName}/>
                            <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper"
                               aria-live="polite">
                                Only numbers, letters, and underscores.
                            </p>

                            <ActionGroup>
                                <Button onClick={() => addFile()} variant={"primary"} type={"submit"}>
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
            <div>
                <h1>
          <span>
            {upper(props.match.params.space)} / {upper(props.match.params.project)} / Files
          </span>
                    <span> - </span>
                    <span>
            <a
                href={"#"}
                onClick={() => {
                    setPopup(true);
                    setNewFileName("");
                }}
            >
              new
            </a>
          </span>
                </h1>
                {files.map(file => (
                    <div key={file.name}>
                        <Link
                            to={routes.file({
                                space: props.match.params.space,
                                project: props.match.params.project,
                                filePath: file.name
                            })}
                        >
                            {upper(file.name)}
                        </Link>
                        <br/>
                    </div>
                ))}
            </div>
        </>
    );
}