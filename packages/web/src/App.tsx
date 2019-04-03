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
import { User } from "./User";
import { Main } from "./Main";
import { AppContext } from "./AppContext";

export function App() {
  const [user, setUser]: [User, (u: User) => void] = useState({ name: "Tiago Bento" });
  return (
    <AppContext.Provider value={{ user: user, setUser: u => setUser(u) }}>
      <div className={"pf-c-background-image"} />
      <div className={"pf-c-page"}>
        <Main />
      </div>
    </AppContext.Provider>
  );
}
