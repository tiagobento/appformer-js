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

const qb = squel.useFlavour('postgres');

const pool = new Pool(config.development.database);

export const getAll = (table: string) => {
    return (request: any, response: any) => {
        const sql = qb.select()
            .from(table);

        pool.query(sql.toString(), (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    };
};

export const getByName = (table: string) => {
    return (request: any, response: any) => {
        const name = request.params.name;

        const sql = qb.select()
            .from(table)
            .where(`name = '${name}'`);

        pool.query(sql.toString(), (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    };
};

export const create = (table: string) => {
    return (request: any, response: any) => {
        const name = request.body.name;

        const sql = qb.insert()
            .into(table)
            .set("name", name)
            .set("content", JSON.stringify(request.body));

        pool.query(sql.toString(), (error) => {
            if (error) {
                throw error;
            }
            response.status(201).send();
        });
    };
};

export const update = (table: string) => {
    return (request: any, response: any) => {
        const name = request.params.name;
        const content = JSON.stringify(request.body);

        const sql = qb.update()
            .table(table)
            .set("content", content)
            .where(`name = '${name}'`);

        pool.query(sql.toString(), (error) => {
            if (error) {
                throw error;
            }
            response.status(200).send();
        });
    };
};

export const deleteRow = (table: string) => {
    return (request: any, response: any) => {
        const name = request.params.name;

        const sql = qb.delete()
            .from(table)
            .where(`name = '${name}'`);

        pool.query(sql.toString(), (error) => {
            if (error) {
                throw error;
            }
            response.status(200).send();
        });
    };
};
