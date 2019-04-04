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

interface Space {id: number, name: string, info: any};

const qb = squel.useFlavour('postgres');
const pool = new Pool(config.development.database);
const spacesTable = "spaces";

export const getAllSpaces = (request: any, response: any) => {
    const sql = qb.select()
        .from(spacesTable);

    pool.query(sql.toString(), (error, results) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(200).json(results.rows);
        }
    });
};

export const getSpaceByNameService = (request: any, response: any) => {
    const name = request.params.name;

    getSpaceByName(name).then(space => {
        if (space) {
            response.status(200).json(space);
        } else {
            response.status(404).end();
        }
    }).catch(error => {
        response.status(422).send(error);
    });
};

export const getSpaceByName = (name: string) => {
    const sql = qb.select()
        .from(spacesTable)
        .where(`name = '${name}'`);

    return new Promise<Space>(res => {
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

export const createSpace = (request: any, response: any) => {
    const name = request.body.name;

    const sql = qb.insert()
        .into(spacesTable)
        .set("name", name)
        .set("info", JSON.stringify(request.body));

    pool.query(sql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(201).end();
        }
    });
};

export const updateSpace = (request: any, response: any) => {
    const name = request.params.name;
    const content = JSON.stringify(request.body);

    const sql = qb.update()
        .table(spacesTable)
        .set("info", content)
        .where(`name = '${name}'`);

    pool.query(sql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            response.status(200).end();
        }
    });
};

export const deleteSpace = (request: any, response: any) => {
    const name = request.params.name;

    const spaceSelect = qb.select()
        .field('id')
        .from('spaces', 's')
        .where(`s.name = '${name}'`);
    const deleteProjectsSql = qb.delete()
        .from("projects")
        .where(`space_id = (${spaceSelect.toString()})`);

    pool.query(deleteProjectsSql.toString(), (error) => {
        if (error) {
            response.status(422).send(error);
        } else {
            const deleteSpaceSql = qb.delete()
                .from(spacesTable)
                .where(`name = '${name}'`);

            pool.query(deleteSpaceSql.toString(), (error2) => {
                if (error2) {
                    response.status(422).send(error2);
                } else {
                    response.status(200).end();
                }
            });
        }
    });
};
