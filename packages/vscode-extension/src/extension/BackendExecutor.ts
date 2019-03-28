import * as path from 'path';
import * as vscode from 'vscode';

export class BackendExecutor {

  public static run(context: vscode.ExtensionContext) {
    const cp = require('child_process');
    const jarDir = context.asAbsolutePath(path.join("resources", "standalone-editor-thorntail.jar"));
    const runJarCommand = `java -jar ${jarDir} -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true`;

    cp.exec(runJarCommand, (err: string, stdout: string, stderr: string) => {
      console.info('stdout: ' + stdout);
      console.info('stderr: ' + stderr);
      if (err) {
        console.info('error: ' + err);
      }
    });
  }
}