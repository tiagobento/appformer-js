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

import {File, Files, FileType, Git, StorageTypes} from "appformer-js-storage";
import {config} from "./config";
import * as projects from "./projects";
import * as path from "path";

const git = new Git(config.development.git);
Files.register(git);

export const listFiles = (gitUrl: string) => {
  return Files.listFiles(Git.newFile(gitUrl));
};

export const getProjectFiles = (spaceName: string, name: string) => {
    return projects.getProjectByName(spaceName, name).then(project => {
        return Files.listFiles(Git.newFile(project.url));
    });
};

export const getProjectFilesService = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;

    getProjectFiles(spaceName, name).then(files => {
        response.status(200).json(files.map(f => f.relative_name));
    });
};

export const getProjectFileContent = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;
    const fileRelativePath = request.query.path;

    getProjectFiles(spaceName, name).then(files => {
        const file = files.filter(f => f.relative_name === fileRelativePath).pop();
        Files.read(file!).then(fileContent => {
            response.status(200).send(fileContent);
        });
    });
};

export const setProjectFileContent = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;
    const fileRelativePath = request.query.path;
    const content = request.body;

    getProjectFiles(spaceName, name).then(files => {
        const file = files.filter(f => f.relative_name === fileRelativePath).pop();
        Files.write(file!, content).then(v => {
            response.status(200).end();
        }).catch(error => {
            response.status(500).send(error);
        });
    });
};

export const createProjectFile = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;
    const fileRelativePath = request.query.path;

    projects.getProjectByName(spaceName, name).then(project => {
        const file = new File("", "", fileRelativePath, FileType.FILE, project.url, StorageTypes.GIT, project.url, "");
        console.log("aaa");
        Files.write(file, "").then(v => {
            response.status(200).end();
        }).catch(error => {
            response.status(500).send(error);
        });
    });
};
