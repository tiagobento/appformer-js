import { AppFormerBusMessage } from "appformer-js-submarine";
import { router } from "appformer-js-router";

function init() {
  const githubEditor = document.querySelector(".js-code-editor") as HTMLElement;

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
            const editor = document.querySelector(".file-editor-textarea + .CodeMirror") as any;
            //FIXME: get value from `editor.CodeMirror.getValue()`
            const wrongWay = editor.textContent;
            const setContentReturnMessage = { type: "RETURN_SET_CONTENT", data: "" };
            gwtiframe.contentWindow!.postMessage(setContentReturnMessage, iframeDomain);
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
    gwtiframe.style.cssText = "width:100%;height:100%;";

    //Insert iframe where the default GitHub editor was
    const oldEditor = document.querySelector(".file");
    oldEditor!.parentElement!.insertBefore(gwtiframe, oldEditor);
  } else {
    console.log("not github");
  }
}

init();
