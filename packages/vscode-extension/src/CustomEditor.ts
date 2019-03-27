import * as vscode from "vscode";
import * as fs from "fs";

export class CustomEditor {
  public static activeCustomEditor: CustomEditor | undefined;

  private _panel: vscode.WebviewPanel;
  private _path: string;

  private constructor(panel: vscode.WebviewPanel, path: string) {
    this._panel = panel;
    this._path = path;
  }

  public static create(path: string, context: vscode.ExtensionContext) {
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const panel = vscode.window.createWebviewPanel(
      "kie-submarine", // Identifies the type of the webview. Used internally
      fileName, // Title of the panel displayed to the user
      { viewColumn: vscode.ViewColumn.Active, preserveFocus: true }, // Editor column to show the new webview panel in.
      { enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true }
    );

    CustomEditor.activeCustomEditor = new CustomEditor(panel, path);
    CustomEditor.activeCustomEditor.setupPanelEvents(context);
    return CustomEditor.activeCustomEditor.setupWebviewContent(path);
  }

  public static registerCommand(context: vscode.ExtensionContext) {
    let openCustomEditorWhenOpeningTextDocumentCommand = vscode.window.onDidChangeActiveTextEditor(
      (textEditor?: vscode.TextEditor) => {
        if (!textEditor) {
          return;
        }

        if (textEditor.document.languageId !== "json") {
          return;
        }

        vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
          CustomEditor.create(textEditor.document.uri.path, context);
        });
      }
    );

    context.subscriptions.push(openCustomEditorWhenOpeningTextDocumentCommand);
  }

  public static registerCustomSaveCommand(context: vscode.ExtensionContext) {
    var customSaveCommand = vscode.commands.registerCommand("workbench.action.files.save", function() {
      // If a custom editor is active, its content is saved manually.
      if (CustomEditor.activeCustomEditor && CustomEditor.activeCustomEditor._path.length > 0) {
        CustomEditor.activeCustomEditor._panel.webview.postMessage({ type: "REQUEST_GET_CONTENT" });
      }

      // If a text editor is opened, we save it normally.
      if (vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.document.save();
      }

      return Promise.resolve();
    });

    context.subscriptions.push(customSaveCommand);
  }

  private setupPanelEvents(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      this._panel.webview.onDidReceiveMessage(
        (message: any) => {
          console.info("vscode: " + message.type);
          switch (message.type) {
            case "RETURN_GET_CONTENT":
              fs.writeFileSync(this._path, message.data);
              break;
            case "REQUEST_SET_CONTENT":
              const content = fs.readFileSync(this._path);
              this._panel.webview.postMessage({ type: "RETURN_SET_CONTENT", data: content.toString() });
              break;
          }
        },
        this,
        context.subscriptions
      )
    );

    context.subscriptions.push(
      this._panel.onDidChangeViewState(
        () => {
          if (this._panel.active) {
            CustomEditor.activeCustomEditor = this;
          } else if (CustomEditor.activeCustomEditor && CustomEditor.activeCustomEditor._path === this._path) {
            CustomEditor.activeCustomEditor = undefined;
          }
        },
        this,
        context.subscriptions
      )
    );
  }

  private async setupWebviewContent(path: string) {
    this._panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <style>
                html, body, session, main, div#app {
                    margin: 0;
                    border: 0;
                    padding: 0;
                    overflow: hidden;
                }
                </style>
    
                <title>KIE Editor</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
                <link rel="stylesheet" type="text/css" href="http://localhost:8080/org.uberfire.editor.StandaloneEditor/css/patternfly.min.css">
            </head>
            <body>
    
            <div id="app"></div>
            
            <script src="http://localhost:8080/org.uberfire.editor.StandaloneEditor/ace/ace.js" type="text/javascript" charset="utf-8"></script>
            <script src="http://localhost:8080/org.uberfire.editor.StandaloneEditor/ace/theme-chrome.js" type="text/javascript" charset="utf-8"></script>
            
            <script src="http://localhost:9000/index-vscode.js"></script>
            </body>
        </html>
    `;
  }
}
