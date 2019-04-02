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
import * as db from "./query";
import { config } from "./config";

const app = express();
const port = config.development.server.port;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/spaces', db.getAll("spaces"));
app.get('/spaces/:name', db.getByName("spaces"));
app.post('/spaces', db.create("spaces"));
app.put('/spaces/:name', db.update("spaces"));
app.delete('/spaces/:name', db.deleteRow("spaces"));

app.get('/projects', db.getAll("projects"));
app.get('/projects/:name', db.getByName("projects"));
app.post('/projects', db.create("projects"));
app.put('/projects/:name', db.update("projects"));
app.delete('/projects/:name', db.deleteRow("projects"));

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})