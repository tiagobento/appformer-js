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
import { useContext, useState } from "react";
import { upper } from "./Util";
import { LoginForm, LoginPage } from "@patternfly/react-core";
import { AppContext } from "./AppContext";

export function Login() {
  const appContext = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <LoginPage loginTitle={"Login"}>
      <LoginForm
        usernameValue={username}
        passwordValue={password}
        onChangePassword={(e: string) => setPassword(e)}
        onChangeUsername={(e: string) => setUsername(e)}
        onLoginButtonClick={() => appContext.setUser({ name: upper(username) })}
      />
    </LoginPage>
  );
}
