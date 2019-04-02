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
import {match} from "react-router";
import {storage} from "./Storage";
import {router} from "appformer-js-router";
import {useEffect} from "react";
import {AppFormerBusMessage} from "appformer-js-submarine";

export function Editor(props: { match: match<{ space: string; project: string; filePath: string }> }) {
    const file = storage.get(props.match.params.filePath);
    if (!file) {
        return <div>{"Oops, file not found: " + props.match.params.filePath}</div>;
    }
    const fileExtension = props.match.params.filePath.split(".").pop()!;
    const languageData = router.get(fileExtension);
    if (!languageData) {
        return <div>{"Oops, no enhanced editor was found for extension " + fileExtension}</div>;
    }

    let iframe: HTMLIFrameElement;
    const iframeDomain = "http://localhost:9000";
    const iframeSrc = "http://localhost:9000";

    const initPolling = setInterval(() => {
        const initMessage = {type: "REQUEST_INIT", data: window.location.origin};
        if (iframe && iframe.contentWindow) {
            const contentWindow = iframe.contentWindow;
            contentWindow.postMessage(initMessage, iframeDomain);
        }
    }, 1000);

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            const message = event.data as AppFormerBusMessage<any>;
            switch (message.type) {
                case "RETURN_INIT":
                    clearInterval(initPolling);
                    break;
                case "REQUEST_LANGUAGE":
                    const returnLanguageMessage = {type: "RETURN_LANGUAGE", data: languageData};
                    iframe.contentWindow!.postMessage(returnLanguageMessage, iframeDomain);
                    break;
                case "REQUEST_SET_CONTENT":
                    const fileContent = file.contents;
                    const setContentReturnMessage = {type: "RETURN_SET_CONTENT", data: fileContent};
                    iframe.contentWindow!.postMessage(setContentReturnMessage, iframeDomain);
                    break;
                case "RETURN_GET_CONTENT":
                    const iframeEditorContent = message.data;
                    file.contents = iframeEditorContent;
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
            <h1>
                {upper(props.match.params.space)} / {upper(props.match.params.project)} / {upper(props.match.params.filePath)}
            </h1>
            <iframe style={{width: "100%", height: "100%"}} ref={i => (iframe = i!)} src={iframeSrc}/>
        </>
    );
}