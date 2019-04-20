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

export const config = {
    development: {
        database: {
            host: 'db', //postgres service name on docker-compose.yml
            user: 'me',
            database: 'submarine',
            password: 'password',
            port: 5432,
        },
        server: {
            host: '0.0.0.0',
            port: '9000'
        },
        git: {
            user: "porcelli-test",
            passw: "ut7KoMNbZaY+c",
            name: "Alexandre Porcelli",
            email: "alexandre.porcelli@gmail.com"
        }
    }
};