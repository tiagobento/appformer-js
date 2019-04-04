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

import * as React from "react";
import { useEffect, useState } from "react";
import { Page } from "@patternfly/react-core";
import * as ReactDOM from "react-dom";
import * as electron from "electron";
import { File } from "../shared/Protocol";
import { AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-microeditor-router";

const ipc = electron.ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("app")!, () => {
    ipc.send("mainWindowLoaded");
  });
});

enum Pages {
  WELCOME,
  FILES,
  EDITOR
}

function App() {
  const [page, setPage] = useState(Pages.WELCOME);
  const [openFile, setOpenFile] = useState<File | undefined>(undefined);

  const Router = () => {
    switch (page) {
      case Pages.WELCOME:
        return <Welcome setPage={setPage} setOpenFile={setOpenFile} />;
      case Pages.FILES:
        return <Files setPage={setPage} setOpenFile={setOpenFile} />;
      case Pages.EDITOR:
        return <Editor openFile={openFile!} setPage={setPage} />;
      default:
        return <>Oops! Unknown page.</>;
    }
  };

  const Header = () => {
    return (
      <div
        style={{
          color: "white",
          backgroundColor: "black",
          height: "76px",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px"
        }}
      >
        <a style={{ color: "white" }} href={"#"} onClick={() => setPage(Pages.FILES)}>
          Files
        </a>

        <span style={{ color: "white" }}>{openFile && openFile.path}</span>

        <span />
      </div>
    );
  };

  return (
    <>
      <Header />
      <Page>
        <Router />
      </Page>
    </>
  );
}

function Welcome(props: { setPage: (s: Pages) => void; setOpenFile: (file: File | undefined) => void }) {
  const start = () => {
    props.setPage(Pages.FILES);
  };

  useEffect(() => {
    props.setOpenFile(undefined);
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={start}>Start</button>
    </div>
  );
}

function Files(props: { setPage: (page: Pages) => void; setOpenFile: (file: File | undefined) => void }) {
  const [files, setFiles] = useState([] as File[]);
  const [addFilePopup, setAddFilePopup] = useState(false);

  ipc.on("returnFiles", (event: any, fs: File[]) => {
    setFiles(fs);
  });

  useEffect(() => {
    props.setOpenFile(undefined);
    ipc.send("requestFiles");
  }, []);

  const openFile = (file: File) => {
    props.setOpenFile(file);
    props.setPage(Pages.EDITOR);
  };

  return (
    <>
      {addFilePopup && <div>Adding file</div>}
      <div style={{ padding: "10px" }}>
        {files.map(file => (
          <div key={file.path}>
            <a href="#" onClick={() => openFile(file)}>
              {file.path}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

function Editor(props: { openFile: File; setPage: (s: Pages) => void }) {
  let iframe: HTMLIFrameElement;
  const iframeDomain = "http://localhost:9000";

  const openFileExtension = props.openFile.path.split(".").pop() || "";
  const languageData = router.get(openFileExtension);
  if (!languageData) {
    return <>{"There's no enhanced editor available for the extension " + openFileExtension}</>;
  }

  useEffect(() => {
    const initPolling = setInterval(() => {
      const initMessage = { type: "REQUEST_INIT", data: window.location.origin };
      if (iframe && iframe.contentWindow) {
        const contentWindow = iframe.contentWindow;
        contentWindow.postMessage(initMessage, iframeDomain);
      }
    }, 1000);

    const handler = (event: MessageEvent) => {
      const message = event.data as AppFormerBusMessage<any>;
      switch (message.type) {
        case "RETURN_INIT":
          clearInterval(initPolling);
          break;
        case "REQUEST_LANGUAGE":
          const returnLanguageMessage = { type: "RETURN_LANGUAGE", data: languageData };
          iframe.contentWindow!.postMessage(returnLanguageMessage, iframeDomain);
          break;
        case "REQUEST_SET_CONTENT":
          const setContentReturnMessage = { type: "RETURN_SET_CONTENT", data: "" };
          iframe.contentWindow!.postMessage(setContentReturnMessage, iframeDomain);
          break;
        case "RETURN_GET_CONTENT":
          const iframeEditorContent = message.data;
          break;
        default:
          console.debug("Unknown message type " + message.type);
          break;
      }
    };

    window.addEventListener("message", handler, false);
    return () => window.removeEventListener("message", handler, false);
  }, []);

  return (
    <>
      <iframe
        ref={i => (iframe = i!)}
        style={{ width: "100%", height: "90%", border: "none" }}
        src={"http://localhost:9000"}
      />
    </>
  );
}
