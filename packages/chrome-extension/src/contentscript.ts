import { AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-router";

declare global {
  export const CodeMirror: any;
}

function getGitHubEditor() {
  const realEditor = document.querySelector(".file-editor-textarea + .CodeMirror") as any;
  if (!realEditor) {
    throw new Error("GitHub editor was not found. GitHub must've change its DOM structure.");
  }
  return realEditor;
}

function enableCommitButton() {
  const commitButton = document.getElementById("submit-file")!;
  if (!commitButton) {
    throw new Error("Commit button was not found. GitHub must've changed its DOM structure");
  }
  commitButton.removeAttribute("disabled");
}

function insertInGitHubPage(...elements: HTMLElement[]) {
  const targetContainer = document.querySelector(".file");
  elements.forEach(e => {
    targetContainer!.parentElement!.insertBefore(e, targetContainer);
    targetContainer!.parentElement!.insertBefore(e, targetContainer);
  });
}

function init() {
  const githubEditor = document.querySelector(".js-code-editor") as HTMLElement;
  if (!githubEditor) {
    console.info("Not GitHub.");
    return;
  }

  const splitLocationHref = window.location.href.split(".");
  const openFileLanguage = splitLocationHref[splitLocationHref.length - 1];
  if (!router.has(openFileLanguage)) {
    console.info(`No enhanced editor available for "${openFileLanguage}" format.`);
    return;
  }

  //**!!!!**
  //REMEMBER: open /Applications/Google\ Chrome.app --args --allow-running-insecure-content
  //**!!!!**

  //Sanity check
  console.log("Extension is running! 4");

  //Bootstrap GitHub native editor
  //FIXME: Do we really have to do this?
  CodeMirror(document.body);
  CodeMirror.fromTextArea(document.querySelector(".file-editor-textarea"));

  const iframeDomain = "http://localhost:9000";
  const iframeSrc = "http://localhost:9000";
  const embeddedEditorIframe = document.createElement("iframe");

  function startInitPolling() {
    return setInterval(() => {
      const initMessage = {type: "REQUEST_INIT", data: window.location.origin};
      const contentWindow = embeddedEditorIframe.contentWindow;
      if (contentWindow) {
        contentWindow.postMessage(initMessage, iframeDomain);
      }
    }, 1000);
  }

  let initPolling = startInitPolling();

  window.addEventListener(
    "message",
    (event: MessageEvent) => {
      const message = event.data as AppFormerBusMessage<any>;
      switch (message.type) {
        case "RETURN_INIT":
          clearInterval(initPolling);
          break;
        case "REQUEST_LANGUAGE":
          const languageReturnMessage = { type: "RETURN_LANGUAGE", data: router.get(openFileLanguage) };
          embeddedEditorIframe.contentWindow!.postMessage(languageReturnMessage, iframeDomain);
          break;
        case "REQUEST_SET_CONTENT":
          const githubEditorContent = getGitHubEditor().CodeMirror.getValue() || "";
          const setContentReturnMessage = { type: "RETURN_SET_CONTENT", data: githubEditorContent };
          embeddedEditorIframe.contentWindow!.postMessage(setContentReturnMessage, iframeDomain);
          break;
        case "RETURN_GET_CONTENT":
          const gwtEditorContent = message.data;
          enableCommitButton();
          getGitHubEditor().CodeMirror.setValue(gwtEditorContent);
          break;
        default:
          console.info("Unknown message type " + message.type);
          break;
      }
    },
    false
  );

  //hide GitHub editor
  githubEditor.style.display = "none";

  //Insert iframe to isolate CSS and JS contexts
  embeddedEditorIframe.id = "gwt-iframe";
  embeddedEditorIframe.src = iframeSrc;
  embeddedEditorIframe.style.cssText = "margin-top: 10px; width:100%; height:600px; border-radius:4px; border:1px solid lightgray;";

  //Insert button after default GitHub editor
  const fullScreenButton = document.createElement("button");
  fullScreenButton.textContent = "Fullscreen";
  fullScreenButton.onclick = e => {
    e.preventDefault();
    document.body.appendChild(embeddedEditorIframe);
    initPolling = startInitPolling();
    embeddedEditorIframe.style.cssText =
      "width:100vw; height:100vh; position:absolute; top:0px; z-index:999; border:none;";
  };

  //FIXME: Find a way to request editor content just when necessary
  setInterval(
    () => {
      enableCommitButton();
      const requestGetContent = { type: "REQUEST_GET_CONTENT" };
      embeddedEditorIframe.contentWindow!.postMessage(requestGetContent, iframeDomain);
    },
    1000,
    3000
  );

  insertInGitHubPage(embeddedEditorIframe, fullScreenButton);
}

init();
