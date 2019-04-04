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

export function getSpaces() {
    return fetch("http://localhost:9002/spaces");
}

export function postSpace(space: { name: string }) {
  return fetch("http://localhost:9002/spaces/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(space)
  });
}

export function getProjects(space: string) {
  return fetch(`http://localhost:9002/spaces/${space}/projects`);
}

export function postProject(spaceName: string, project: { name: string; url: string }) {
  return fetch(`http://localhost:9002/spaces/${spaceName}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });
}

export function getFiles(space: string, project: string) {
  return fetch(`http://localhost:9002/spaces/${space}/projects/${project}/files`);
}

export function getFileContentService(space: string, project: string, path: string) {
  return fetch(`http://localhost:9002/spaces/${space}/projects/${project}/file?path=${path}`);
}

export function setFileContentService(spaceName: string, project: string, path: string, content: string) {
  return fetch(`http://localhost:9002/spaces/${spaceName}/projects/${project}/file?path=${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain"
    },
    body: content
  });
}