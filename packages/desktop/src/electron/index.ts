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

import { app, BrowserWindow, ipcMain } from "electron";

import * as path from "path";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  ipcMain.on("mainWindowLoaded", () => {
    console.info("LOADED!");
  });

  ipcMain.on("requestFiles", () => {
    //FIXME: Read using appformer-js-storage from Home folder.
    const files = [{ path: "tiago.dmn" }, { path: "pom.xml" }] as File[];
    mainWindow.webContents.send("returnFiles", files);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
