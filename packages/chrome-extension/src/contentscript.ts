import { router, services } from "appformer-js-microeditor-router";
import { EnvelopeBusConsumer } from "appformer-js-microeditor-envelope-protocol";

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

function insertActionButtons(pageHeadActions: Element) {
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

  const url = window.location.href;
  let branch: string;
  let repo: string;

  if (url.includes("/tree/")) {
    repo = url.split("/tree/")[0];
    branch = url.split("/tree/")[1].split("/")[0];
  } else if (url.includes("/blob/")) {
    repo = url.split("/blob/")[0];
    branch = url.split("/blob/")[1].split("/")[0];
  } else {
    repo = url;
    branch = "master";
  }

  const runDmnButton = document.createElement("button");
  runDmnButton.className = "btn btn-sm btn-primary";
  runDmnButton.style.cssText = "float:right;";
  runDmnButton.textContent = "KNative Build";
  runDmnButton.onclick = e => {
    const name = repo.split("/")[repo.split("/").length - 1];
    const version = "v1";
    const endpoint = `${services.dmn_knative}/deploy/${name}/${version}`;

    console.info(`Deploying to ${endpoint}`);

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        repo: repo,
        branch: branch,
        workDir: ""
      })
    });
  };

  const runDmnButtonLi = document.createElement("li");
  runDmnButtonLi.appendChild(runDmnButton);
  pageHeadActions.appendChild(runDmnButtonLi);

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
  const openFileExtension = splitLocationHref[splitLocationHref.length - 1];

  const pageHeadActions = document.querySelector("ul.pagehead-actions")!;
  if (pageHeadActions) {
    insertActionButtons(pageHeadActions);
  }

  const githubEditor = document.querySelector(".js-code-editor") as HTMLElement;
  if (!githubEditor) {
    console.info("Not GitHub edit page.");
    return;
  }

  if (!router.has(openFileExtension)) {
    console.info(`No enhanced editor available for "${openFileExtension}" format.`);
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

  const envelopeBusConsumer = new EnvelopeBusConsumer(_this => ({
    send: msg => {
      if (embeddedEditorIframe && embeddedEditorIframe.contentWindow) {
        embeddedEditorIframe.contentWindow.postMessage(msg, iframeDomain);
      }
    },
    pollInit: () => {
      _this.request_initResponse(window.location.origin);
    },
    receive_languageRequest: () => {
      _this.respond_languageRequest(router.get(openFileExtension));
    },
    receive_getContentResponse: (content: string) => {
      enableCommitButton();
      getGitHubEditor().CodeMirror.setValue(content);
    },
    receive_setContentRequest: () => {
      const githubEditorContent = getGitHubEditor().CodeMirror.getValue() || "";
      _this.respond_setContentRequest(githubEditorContent);
    }
  }));

  envelopeBusConsumer.init();
  window.addEventListener("message", msg => envelopeBusConsumer.receive(msg.data), false);

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
    envelopeBusConsumer.init();
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
      envelopeBusConsumer.init();
      insertAfterGitHubEditor(embeddedEditorIframe);
      embeddedEditorIframe.style.cssText = originalCss;
      envelopeBusConsumer.request_getContentResponse();
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
      envelopeBusConsumer.request_getContentResponse();
    },
    1000,
    3000
  );
}

initContentScript();
