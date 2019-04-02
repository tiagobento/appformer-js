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
import { PatternFlyPopup } from "./PatternFlyPopup";
import { ActionGroup, Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
import { Link } from "react-router-dom";

interface Space {
  name: string;
}
export function Spaces() {
  const [popup, setPopup] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [spaces, setSpaces] = useState([] as Space[]);

  const updateSpaces = () => {
    fetch("http://localhost:9002/spaces")
      .then(res => res.json())
      .then(json => setSpaces(json as Space[]));
  };

  const addSpace = (e: any) => {
    e.preventDefault();
    return fetch("http://localhost:9002/spaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newSpaceName })
    }).then(() => {
      setPopup(false);
      updateSpaces();
    });
  };

  useEffect(() => updateSpaces(), [setSpaces]);

  return (
    <>
      {popup && (
        <PatternFlyPopup title={"New Space"} onClose={() => setPopup(false)}>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <label className="pf-c-form__label" htmlFor="help-text-simple-form-name">
                Name
                <span className="pf-c-form__label-required" aria-hidden="true">
                  *
                </span>
              </label>
              <TextInput
                aria-label={"name"}
                onInput={(e: any) => setNewSpaceName(e.target.value)}
                value={newSpaceName}
              />
              <p className="pf-c-form__helper-text" id="help-text-simple-form-name-helper" aria-live="polite">
                Only numbers, letters, and underscores.
              </p>

              <ActionGroup>
                <Button onClick={e => addSpace(e)} variant={"primary"} type={"submit"}>
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
          <span>Spaces</span>
          <span> - </span>
          <span>
            <a
              href={"#"}
              onClick={() => {
                setPopup(true);
                setNewSpaceName("");
              }}
            >
              new
            </a>
          </span>
        </h1>
        {spaces.map(space => (
          <div key={space.name}>
            <Link to={routes.projects({ space: space.name })}>{upper(space.name)}</Link>
            <br />
          </div>
        ))}
      </div>
    </>
  );
}
