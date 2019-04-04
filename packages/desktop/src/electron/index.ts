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
import { Files, FS } from "appformer-js-storage";
import * as os from "os";
import * as fs from "fs";

app.on("ready", () => {
  Files.register(new FS());

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
    console.info("Desktop app is loaded.");
  });

  const rootPath = path.join(app.getPath("documents"), "KieSubmarine");
  ipcMain.on("requestFiles", () => {

    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }

    Files.listFiles(FS.newFile(rootPath, rootPath)).then(files => {
      const filteredFiles = files.filter(f => !f.name.startsWith(".")).map(f => ({ path: f.relative_name }));
      mainWindow.webContents.send("returnFiles", filteredFiles);
    });
  });

  ipcMain.on("writeContent", () => {});

  ipcMain.on("requestContent", (file: File) => {
    Files.read(FS.newFile(rootPath, file.path)).then(contents => {
        mainWindow.webContents.send("returnContents", contents);
    })
  });

  ipcMain.on("createFile", () => {});

  ipcMain.on("deleteFile", () => {});

  ipcMain.on("renameFile", () => {});
});

app.on("window-all-closed", () => {
  app.quit();
});
