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

import { Pool } from "pg";
import * as squel from "squel";
import { config } from "./config";
import {join} from "path";
import {getSpaceByName} from "./spaces";

const qb = squel.useFlavour('postgres');
const pool = new Pool(config.development.database);
const projectsTable = "projects";

interface Project {id: number, name: string, url: string, info: any};

export const getProjectByUrl = (request: any, response: any) => {
    const url = request.query.url;

    const sql = qb.select()
        .from(projectsTable)
        .where(`url = '${url}'`);

    pool.query(sql.toString(), (error, results) => {
        if (error) {
            response.status(422).send(error);
        } else if (results.rows.length === 0) {
            response.status(404).end();
        } else {
            response.status(200).json(results.rows[0]);
        }
    });
};

export const getAllProjectsFromSpace = (request: any, response: any) => {
    const spaceName = request.params.spaceName;

    const sql = qb.select()
        .field("p.*")
        .from(projectsTable, "p")
        .join("spaces", "s",
            qb.expr()
                .and("s.id = p.space_id")
                .and(`s.name = '${spaceName}'`)
        );

    pool.query(sql.toString(), (error, results) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

export const getProjectByNameService = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;

    getProjectByName(spaceName, name).then(project => {
        if (project) {
            response.status(200).json(project);
        } else {
            response.status(404).end();
        }
    }).catch(error => {
        response.status(422).send(error);
    });
};

export const getProjectByName = (spaceName: string, name: string) => {
    const sql = qb.select()
        .field("p.*")
        .from(projectsTable, "p")
        .join("spaces", "s",
            qb.expr()
                .and("s.id = p.space_id")
                .and(`s.name = '${spaceName}'`)
        )
        .where(`p.name = '${name}'`);

    return new Promise<Project>(res => {
        pool.query(sql.toString(), (error, results) => {
            if (error) {
                throw error;
            } else if (results.rows.length === 0) {
                res(undefined);
            } else {
                res(results.rows[0]);
            }
        });
    });
};

export const createProject = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.body.name;
    const url = request.body.url;

    const sql = qb.insert()
        .into(projectsTable)
        .set("name", name)
        .set("url", url)
        .set("info", JSON.stringify(request.body))
        .set("space_id", qb.select().field('id').from('spaces', 's').where(`s.name = '${spaceName}'`));

    pool.query(sql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(201).send();
        }
    });
};

export const updateProject = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;
    const info = JSON.stringify(request.body);

    const sql = qb.update()
        .table(projectsTable)
        .from("spaces")
        .set("info", info)
        .where(`projects.name = '${name}'`)
        .where(`spaces.name = '${spaceName}'`)
        .where("projects.space_id = spaces.id");

    pool.query(sql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(200).send();
        }
    });
};

export const deleteProject = (request: any, response: any) => {
    const spaceName = request.params.spaceName;
    const name = request.params.name;

    const spaceSelect = qb.select()
        .field('id')
        .from('spaces', 's')
        .where(`s.name = '${spaceName}'`);
    const deleteProjectsSql = qb.delete()
        .from("projects")
        .where(`space_id = (${spaceSelect.toString()})`)
        .where(`name = '${name}'`);

    pool.query(deleteProjectsSql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(200).send();
        }
    });
};
