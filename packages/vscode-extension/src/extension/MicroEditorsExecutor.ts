import * as path from "path";
import * as vscode from "vscode";
import * as cp from "child_process";
import * as fs from "fs";

export class MicroEditorsExecutor {
  private static context: vscode.ExtensionContext;

  private static composeFile() {
    return this.context.asAbsolutePath(path.join("dmn-war", "docker-compose-prod.yml"));
  }

  private static dockerImage() {
    return this.context.asAbsolutePath(path.join("dmn-war", "kiegroup_microeditors.dockerimage"));
  }

  public static run(context: vscode.ExtensionContext) {
    this.context = context;
    console.info("Running Micro Editors..");
    if (fs.existsSync(this.dockerImage())) {
      console.info("Prod..");
      this.execute(`docker image load -i ${this.dockerImage()} && docker-compose -f ${this.composeFile()} up -d`);
    } else {
      console.info("Dev.. kiegroup/microeditors container should already be up..")
    }
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
