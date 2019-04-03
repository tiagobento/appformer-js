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

import * as express from "express";
import * as bodyParser from "body-parser";
import * as spaces from "./spaces";
import * as projects from "./projects";
import { config } from "./config";

const app = express();
const port = config.development.server.port;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/spaces', spaces.getAllSpaces);
app.get('/spaces/:name', spaces.getSpaceByName);
app.post('/spaces', spaces.createSpace);
app.put('/spaces/:name', spaces.updateSpace);
app.delete('/spaces/:name', spaces.deleteSpace);

app.get('/projects', projects.getProjectByUrl);
app.get('/spaces/:spaceName/projects', projects.getAllProjectsFromSpace);
app.get('/spaces/:spaceName/projects/:name', projects.getProjectByName);
app.post('/spaces/:spaceName/projects', projects.createProject);
app.put('/spaces/:spaceName/projects/:name', projects.updateProject);
app.delete('/spaces/:spaceName/projects/:name', projects.deleteProject);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
