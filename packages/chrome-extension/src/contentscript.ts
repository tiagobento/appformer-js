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

function init() {
  const githubEditor = document.querySelector(".js-code-editor") as HTMLElement;

  CodeMirror(document.body);
  CodeMirror.fromTextArea(document.querySelector(".file-editor-textarea"));


  if (githubEditor) {
    //**!!!!**
    //REMEMBER: open /Applications/Google\ Chrome.app --args --allow-running-insecure-content
    //**!!!!**

    //Sanity check
    console.log("Extension is running! 4");

    const iframeDomain = "http://localhost:9000";
    const gwtiframe = document.createElement("iframe");

    window.addEventListener(
      "message",
      (event: MessageEvent) => {
        const message = event.data as AppFormerBusMessage<any>;
        switch (message.type) {
          case "REQUEST_LANGUAGE":
            const languageReturnMessage = { type: "RETURN_LANGUAGE", data: router.get("dmn") };
            gwtiframe.contentWindow!.postMessage(languageReturnMessage, iframeDomain);
            break;
          case "REQUEST_SET_CONTENT":
            const githubEditorContent = getGitHubEditor().CodeMirror.getValue() || "";
            const setContentReturnMessage = { type: "RETURN_SET_CONTENT", data: githubEditorContent };
            gwtiframe.contentWindow!.postMessage(setContentReturnMessage, iframeDomain);
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

    //hide current editor
    githubEditor.style.display = "none";

    //Inserts iframe to isolate CSS and JS contexts
    gwtiframe.id = "gwt-iframe";
    gwtiframe.src = "http://localhost:9000";
    gwtiframe.style.cssText = "width:100%; height:600px;";

    //Insert button after default GitHub editor
    const fullScreenButton = document.createElement("button");
    fullScreenButton.textContent = "Fullscreen";
    fullScreenButton.onclick = e => {
      e.preventDefault();
      document.body.appendChild(gwtiframe);
      gwtiframe.style.cssText = "width:100vw;height:100vh;position:absolute;top:0;z-index:999";
    };

    //FIXME: Find a way to request editor content just when necessary
    setInterval(() => {
      enableCommitButton();
      const requestGetContent = { type: "REQUEST_GET_CONTENT" };
      gwtiframe.contentWindow!.postMessage(requestGetContent, iframeDomain);
    }, 1000);

    const targetContainer = document.querySelector(".file");
    targetContainer!.parentElement!.insertBefore(gwtiframe, targetContainer);
    targetContainer!.parentElement!.insertBefore(fullScreenButton, targetContainer);
  } else {
    console.log("not github");
  }
}

init();
