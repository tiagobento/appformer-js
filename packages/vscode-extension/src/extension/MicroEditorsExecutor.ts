import * as path from "path";
import * as vscode from "vscode";
import { ProgressLocation } from "vscode";
import { services } from "appformer-js-microeditor-router";
import * as cp from "child_process";
import * as fs from "fs";
import * as http from "http";

export class MicroEditorsExecutor {
  private static context: vscode.ExtensionContext;

  private static composeFile() {
    return this.context.asAbsolutePath(path.join("docker-compose-prod.yml"));
  }

  private static dmnEditorDockerImage() {
    return this.context.asAbsolutePath(path.join("dmn-war", "kiegroup_microeditors_dmn.dockerimage"));
  }

  private static bpmnEditorDockerImage() {
    return this.context.asAbsolutePath(path.join("bpmn-war", "kiegroup_microeditors_bpmn.dockerimage"));
  }

  public static run(context: vscode.ExtensionContext) {
    this.context = context;
    console.info("Running Micro Editors.....");
    vscode.window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Waiting for Micro Editors to be ready..",
        cancellable: false
      },
      (progress, token) => {
        return new Promise(resolve => {
          const microEditorsReadyPollingId = setInterval(() => {
            const dmn = new Promise((res, rej) => {
              http.get(`${services.microeditor_dmn}`, r => {
                r.statusCode === 200 ? res() : rej();
              });
            });

            const bpmn = new Promise((res, rej) => {
              http.get(`${services.microeditor_bpmn}`, r => {
                r.statusCode === 200 ? res() : rej();
              });
            });

            Promise.all([bpmn, dmn])
              .then(resolve)
              .then(() => clearInterval(microEditorsReadyPollingId));
          }, 500);
        });
      }
    );

    if (this.isProductionEnvironment()) {
      //FIXME: Change to docker stack deploy -c ?
      this.execute(`
        docker image load -i ${this.dmnEditorDockerImage()} &&
        docker image load -i ${this.bpmnEditorDockerImage()} &&
        docker-compose -f ${this.composeFile()} up -d
      `);
    } else {
      console.info("Dev.. kiegroup/microeditors_* containers should already be up..");
    }
  }

  private static isProductionEnvironment() {
    return fs.existsSync(this.dmnEditorDockerImage()) && fs.existsSync(this.bpmnEditorDockerImage());
  }

  public static cleanup(callback: () => any = () => undefined) {
    console.info("Cleaning up Micro Editors..");
    this.execute(`docker-compose -f ${this.composeFile()} down --rmi all`, callback);
  }

  private static execute(command: string, callback: () => any = () => undefined) {
    return cp.exec(command, (err: any, stdout: string, stderr: string) => {
      console.info("stdout: " + stdout);
      console.info("stderr: " + stderr);

      if (err) {
        console.info("error: " + err);
      }

      callback();
    });
  }
}
