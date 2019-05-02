import { AppFormerBusMessage } from "appformer-js-submarine";
import { router, services } from "appformer-js-microeditor-router";

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

function insertRightToBreadcrumb(...elements: HTMLElement[]) {
  const targetContainer = document.querySelector(".breadcrumb.d-flex.flex-items-center");
  elements.forEach(e => {
    targetContainer!.appendChild(e);
  });
}

function insertAfterGitHubEditor(...elements: HTMLElement[]) {
  const targetContainer = document.querySelector(".file");
  elements.forEach(e => {
    targetContainer!.parentElement!.insertBefore(e, targetContainer);
  });
}

function requestGetContent(embeddedEditorIframe: HTMLIFrameElement, iframeDomain: string) {
  const requestGetContentMessage = { type: "REQUEST_GET_CONTENT", data: undefined };
  embeddedEditorIframe.contentWindow!.postMessage(requestGetContentMessage, iframeDomain);
}

function insertActionButtons(pageHeadActions: Element, openFileLanguage: string) {
  const kiegroupDropdown = document.createElement("li");
  kiegroupDropdown.style.cssText = "position:relative;";
  kiegroupDropdown.innerHTML = `
  <details>
    <summary class="float-left btn btn-sm">
      <span data-menu-button="">kiegroup</span>
    </summary>

    <details-menu class="dropdown-menu dropdown-menu-sw select-menu-modal position-absolute" role="menu">
      <div class="select-menu-list">
          <button id="open-on-kie-web-button" type="submit" name="do" value="included" class="select-menu-item width-full" aria-checked="false" role="menuitemradio">
            <div class="select-menu-item-text">
              <span class="select-menu-item-heading">Open repository on KIE Web</span>
              <span class="description">Import this repository into KIE's web interface</span>
            </div>
          </button>

          <button id="dmn-sample-button" type="submit" name="do" value="release_only" class="select-menu-item width-full" aria-checked="false" role="menuitemradio">
            <div class="select-menu-item-text">
              <span class="select-menu-item-heading">Setup repository as DMN sample</span>
              <span class="description">Open a Pull Request turning this repository into a DMN project</span>
            </div>
          </button>

          <button id="bpmn-sample-button" type="submit" name="do" value="release_only" class="select-menu-item width-full" aria-checked="false" role="menuitemradio">
            <div class="select-menu-item-text">
              <span class="select-menu-item-heading">Setup repository as BPMN sample</span>
              <span class="description">Open a Pull Request turning this repository into a BPMN project</span>
            </div>
          </button>
      </div>
    </details-menu>
  </details>
  `;

  const separatorLi = document.createElement("li");
  separatorLi.style.cssText = "margin-left: 20px;";
  separatorLi.innerHTML = "&nbsp;";
  pageHeadActions.appendChild(separatorLi);

  if (openFileLanguage === "dmn") {
    const runDmnButton = document.createElement("button");
    runDmnButton.className = "btn btn-sm btn-primary";
    runDmnButton.style.cssText = "float:right;";
    runDmnButton.textContent = "Run";
    runDmnButton.onclick = e => {
      fetch(`${services.dmn_knative}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Driver: {
            Points: 2
          },
          Violation: {
            Type: "speed",
            "Actual Speed": 120,
            "Speed Limit": 100
          }
        })
      });
    };

    const runDmnButtonLi = document.createElement("li");
    runDmnButtonLi.appendChild(runDmnButton);
    pageHeadActions.appendChild(runDmnButtonLi);
  }

  pageHeadActions.appendChild(kiegroupDropdown);
  document.getElementById("open-on-kie-web-button")!.onclick = e => {
    window.open(`${services.web}/import?path=${window.location}`);
  };

  document.getElementById("bpmn-sample-button")!.onclick = e => {
    fetch(`${services.functions}/init?path=${window.location}&type=function`);
  };

  document.getElementById("dmn-sample-button")!.onclick = e => {
    fetch(`${services.functions}/init?path=${window.location}&type=project`);
  };
}

function initContentScript() {
  const splitLocationHref = window.location.href.split(".");
  const openFileLanguage = splitLocationHref[splitLocationHref.length - 1];

  const pageHeadActions = document.querySelector("ul.pagehead-actions")!;
  if (pageHeadActions) {
    insertActionButtons(pageHeadActions, openFileLanguage);
  }

  const githubEditor = document.querySelector(".js-code-editor") as HTMLElement;
  if (!githubEditor) {
    console.info("Not GitHub edit page.");
    return;
  }

  if (!router.has(openFileLanguage)) {
    console.info(`No enhanced editor available for "${openFileLanguage}" format.`);
    return;
  }

  //**!!!!**
  //REMEMBER: open /Applications/Google\ Chrome.app --args --allow-running-insecure-content
  //**!!!!**

  //Bootstrap GitHub native editor
  //FIXME: Do we really have to do this?
  CodeMirror(document.body);
  CodeMirror.fromTextArea(document.querySelector(".file-editor-textarea"));

  const iframeDomain = services.microeditor_envelope;
  const iframeSrc = services.microeditor_envelope;
  const embeddedEditorIframe = document.createElement("iframe");

  function startInitPolling() {
    return setInterval(() => {
      const initMessage = { type: "REQUEST_INIT", data: window.location.origin };
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
  embeddedEditorIframe.style.cssText =
    "margin-top: 10px; width:100%; height:600px; border-radius:4px; border:1px solid lightgray;";

  //Setup Fullscreen button
  const fullScreenButton = document.createElement("button");
  fullScreenButton.className = "btn btn-sm";
  fullScreenButton.style.cssText = "float: right";
  fullScreenButton.textContent = "Fullscreen";
  fullScreenButton.onclick = e => {
    e.preventDefault();
    document.body.appendChild(embeddedEditorIframe);
    initPolling = startInitPolling();
    const originalCss = embeddedEditorIframe.style.cssText;
    embeddedEditorIframe.style.cssText =
      "width:100vw; height:100vh; position:absolute; top:0px; z-index:999; border:none;";

    const buttonsDiv = document.createElement("div");
    const closeFullscreenDivA = document.createElement("a");
    closeFullscreenDivA.style.cssText = "color: white";
    closeFullscreenDivA.textContent = "Close";
    buttonsDiv.appendChild(closeFullscreenDivA);
    buttonsDiv.style.cssText =
      "padding-bottom: 5px; cursor: pointer; z-index: 1000; color: white;text-align: center; position:fixed; width: 80px; top:0; left: 50%; margin-left: -40px; background-color: #363636; border-radius: 0 0 5px 5px";
    buttonsDiv.onclick = evt => {
      evt.preventDefault();
      initPolling = startInitPolling();
      insertAfterGitHubEditor(embeddedEditorIframe);
      embeddedEditorIframe.style.cssText = originalCss;
      requestGetContent(embeddedEditorIframe, iframeDomain);
      buttonsDiv.remove();
    };

    document.body.appendChild(buttonsDiv);
  };

  //Insert Fullscreen button
  const fullScreenDiv = document.createElement("div");
  fullScreenDiv.style.cssText = "margin-left: auto;";
  fullScreenDiv.appendChild(fullScreenButton);

  //Insert iframe and Fullscreen button
  insertAfterGitHubEditor(embeddedEditorIframe);
  insertRightToBreadcrumb(fullScreenDiv);

  //FIXME: Find a way to request editor content just when necessary
  setInterval(
    () => {
      enableCommitButton();
      requestGetContent(embeddedEditorIframe, iframeDomain);
    },
    1000,
    3000
  );
}

initContentScript();
