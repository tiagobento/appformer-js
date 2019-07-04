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
import {
  ActionGroup,
  BackgroundImage,
  BackgroundImageSrc,
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Form,
  FormGroup,
  Gallery,
  GalleryItem,
  Page,
  PageHeader,
  PageSection,
  Split,
  SplitItem,
  TextInput,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
import * as ReactDOM from "react-dom";
import * as electron from "electron";
import { CubesIcon } from "@patternfly/react-icons";
import { File } from "../shared/Protocol";
import { router, services } from "appformer-js-microeditor-router";
import { PatternFlyPopup } from "./PatternFlyPopup";
import { Pf4Label } from "./Pf4Label";
import { EnvelopeBusOuterMessageHandler } from "appformer-js-microeditor-envelope-protocol";

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
  const [popup, setPopup] = useState(false);

  const Router = () => {
    switch (page) {
      case Pages.WELCOME:
        return <Welcome setPage={setPage} />;
      case Pages.FILES:
        return <Files setPopup={setPopup} popup={popup} setPage={setPage} setOpenFile={setOpenFile} />;
      case Pages.EDITOR:
        return <Editor openFile={openFile!} setPage={setPage} />;
      default:
        return <>Unknown page</>;
    }
  };

  function Header(props: { setPage: (page: Pages) => void }) {
    return (
      <PageHeader
        logo={
          <>
            <a style={{ color: "white" }} onClick={() => props.setPage(Pages.FILES)}>
              Files
            </a>
          </>
        }
        toolbar={
          <Toolbar>
            <ToolbarGroup>
              <ToolbarItem>
                {page === Pages.FILES && (
                  <a style={{ color: "white" }} onClick={() => setPopup(true)}>
                    Add File
                  </a>
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        }
      />
    );
  }

  const bgImages = {
    [BackgroundImageSrc.lg]: "/assets/images/pfbg_1200.jpg",
    [BackgroundImageSrc.sm]: "/assets/images/pfbg_768.jpg",
    [BackgroundImageSrc.sm2x]: "/assets/images/pfbg_768@2x.jpg",
    [BackgroundImageSrc.xs]: "/assets/images/pfbg_576.jpg",
    [BackgroundImageSrc.xs2x]: "/assets/images/pfbg_576@2x.jpg",
    [BackgroundImageSrc.filter]: "/assets/images/background-filter.svg#image_overlay"
  };

  return (
    <>
      <BackgroundImage src={bgImages} />
      <Page header={<Header setPage={setPage} />} style={{ height: "100%" }}>
        <Router />
      </Page>
    </>
  );
}

function Welcome(props: { setPage: (s: Pages) => void }) {
  const start = () => {
    props.setPage(Pages.FILES);
  };

  return (
    <PageSection>
      <h1>Welcome</h1>
      <Button onClick={start}>Start</Button>
    </PageSection>
  );
}

function Files(props: {
  popup: boolean;
  setPopup: (b: boolean) => void;
  setPage: (page: Pages) => void;
  setOpenFile: (file: File) => void;
}) {
  const [files, setFiles] = useState([] as File[]);
  const [newFileName, setNewFileName] = useState("");

  const updateFiles = () => {
    ipc.send("requestFiles");
  };

  useEffect(() => {
    ipc.on("returnFiles", (event: any, fs: File[]) => {
      setFiles(fs);
    });

    ipc.on("fileCreated", (event: any) => {
      updateFiles();
    });

    updateFiles();

    return () => {
      ipc.removeAllListeners("returnFiles");
      ipc.removeAllListeners("fileCreated");
    };
  }, []);

  const openFile = (file: File) => {
    props.setOpenFile(file);
    props.setPage(Pages.EDITOR);
  };

  const addFile = (e: any) => {
    e.preventDefault();
    console.info("Creating file " + newFileName);
    ipc.send("createFile", { relativePath: newFileName });
    updateFiles();
    props.setPopup(false);
    setNewFileName("");
  };

  return (
    <>
      {props.popup && (
        <PatternFlyPopup title={"Add file"} onClose={() => props.setPopup(false)}>
          <Form>
            <FormGroup fieldId={"name"} className="pf-c-form__group">
              <Pf4Label required={true} text={"Name"} />
              <TextInput aria-label={"name"} onInput={(e: any) => setNewFileName(e.target.value)} value={newFileName} />
              <ActionGroup>
                <Button onClick={addFile} variant={"primary"} type={"submit"}>
                  Add File
                </Button>
                <Button onClick={() => props.setPopup(false)} variant={"secondary"}>
                  Cancel
                </Button>
              </ActionGroup>
            </FormGroup>
          </Form>
        </PatternFlyPopup>
      )}
      {files.length > 0 && (
        <PageSection>
          <Gallery gutter="md">
            {files.map(file => (
              <a key={file.path} href={"#"}>
                <GalleryItem onClick={() => openFile(file)}>
                  <Card>
                    <CardBody>
                      <Split>
                        <SplitItem isMain={true}>{file.path}</SplitItem>
                        <SplitItem isMain={false}>
                          <Badge isRead={true}>1</Badge>
                        </SplitItem>
                      </Split>
                    </CardBody>
                  </Card>
                </GalleryItem>
              </a>
            ))}
          </Gallery>
        </PageSection>
      )}
      {files.length === 0 && (
        <PageSection style={{ display: "flex", justifyContent: "space-around" }}>
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h5" size="lg">
              Oops! Looks like you don't have any Files yet.
            </Title>
            <EmptyStateBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec orci enim, cursus nec dolor a, efficitur
              ullamcorper lorem. Aenean blandit est consequat mollis euismod.
            </EmptyStateBody>
            <Button variant={"primary"} type={"submit"} onClick={() => props.setPopup(true)}>
              Add File
            </Button>
          </EmptyState>
        </PageSection>
      )}
    </>
  );
}

function Editor(props: { openFile: File; setPage: (s: Pages) => void }) {
  let iframe: HTMLIFrameElement;
  const iframeDomain = services.microeditor_envelope;

  const openFileExtension = props.openFile.path.split(".").pop() || "";
  const languageData = router.get(openFileExtension);
  if (!languageData) {
    return <>{"There's no enhanced editor available for the extension " + openFileExtension}</>;
  }

  useEffect(() => {
    const envelopeBusOuterMessageHandler = new EnvelopeBusOuterMessageHandler(
      {
        postMessage: msg => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, iframeDomain);
          }
        }
      },
      self => ({
        pollInit: () => {
          self.request_initResponse(window.location.origin);
        },
        receive_languageRequest: () => {
          self.respond_languageRequest(router.get(openFileExtension));
        },
        receive_contentResponse: (content: string) => {
          ipc.send("writeContent", { path: props.openFile.path, content: content });
        },
        receive_contentRequest: () => {
          ipc.send("requestContent", { relativePath: props.openFile.path });
        }
      })
    );

    envelopeBusOuterMessageHandler.startInitPolling();

    ipc.on("returnContent", (event: any, content: string) =>
      envelopeBusOuterMessageHandler.respond_contentRequest(content)
    );
    ipc.on("requestSave", () => envelopeBusOuterMessageHandler.request_contentResponse());

    const handler = (msg: any) => {
      envelopeBusOuterMessageHandler.receive(msg.data);
    };

    window.addEventListener("message", handler, false);

    return () => {
      ipc.removeAllListeners("returnContent");
      ipc.removeAllListeners("requestSave");
      window.removeEventListener("message", handler, false);
      envelopeBusOuterMessageHandler.stopInitPolling();
    };
  }, []);

  return (
    <PageSection style={{ padding: "0" }}>
      <iframe
        ref={i => (iframe = i!)}
        style={{ width: "100%", height: "100%", border: "none" }}
        src={services.microeditor_envelope}
      />
    </PageSection>
  );
}
