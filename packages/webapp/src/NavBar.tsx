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
import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "./User";

export function NavBar(props: { user: User }) {
  const [loginPopover, setLoginPopover] = useState(false);
  return (
    <header role="banner" className="pf-c-page__header">
      <div className="pf-c-page__header-brand">
        <Link className="pf-c-page__header-brand-link" to={"/"}>
          Practicioner UI
        </Link>
      </div>
      <div className="pf-c-page__header-tools">
        <div className="pf-c-page__header-tools-group">
          <div className="pf-m-user pf-screen-reader">
            <div className="pf-c-dropdown">
              <button
                onClick={() => setLoginPopover(true)}
                className="pf-c-dropdown__toggle pf-m-plain"
                id="page-layout-expandable-nav-dropdown-button"
                aria-expanded="false"
              >
                <span className="pf-c-dropdown__toggle-text">{props.user.name}</span>
                <i className="fas fa-caret-down pf-c-dropdown__toggle-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <img
          className="pf-c-avatar"
          src="https://pf4.patternfly.org//assets/images/img_avatar.svg"
          alt="Avatar Image"
        />
      </div>
    </header>
  );
}
