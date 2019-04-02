import { Provider } from "../api/Provider";
import { File } from "../api/File";
import { FileType } from "../api/FileType";
import { StorageTypes } from "../api/StorageTypes";

import * as fs from "fs";
import * as path from "path";
import * as util from "util";

export class FS implements Provider {
  public readonly type = StorageTypes.FS;
  private readdir = util.promisify(fs.readdir);

  public listFiles(file: File): Promise<File[]> {
    if (file.storage.valueOf() === StorageTypes.FS.valueOf()) {
      return this._listFiles(file)
        .catch(reason => Promise.reject(reason));
    }
    return Promise.resolve([]);
  }

  private _listFiles(file: File): Promise<File[]> {
    return this.readdir(file.full_name, { withFileTypes: true })
      .then(dirents => {
        const files: File[] = [];

        return Promise.all(dirents.map(f => {
          const fullPath = file.full_name + "/" + f.name;
          if (f.isFile()) {
            files.push(new File(f.name,
              fullPath,
              FileType.FILE,
              `file://${fullPath}`,
              StorageTypes.FS,
              fullPath));
            return Promise.resolve();
          } else if (f.isDirectory()) {
            const d = new File(f.name,
              fullPath,
              FileType.FOLDER,
              `file://${fullPath}`,
              StorageTypes.FS,
              fullPath);
            return this._listFiles(d).then(nested => {
              files.push(...nested);
              return Promise.resolve();
            });
          } else {
            //Unknown type
            return Promise.resolve();
          }
        })).then(() => files);
      });
  }

  public read(file: File): Promise<string> {
    if (file.storage.valueOf() === StorageTypes.FS.valueOf()) {
      const readFile = util.promisify(fs.readFile);
      return readFile(file.full_name, "utf-8");
    }
    return Promise.resolve("");
  }

  public write(file: File, content: string): Promise<void> {
    if (file.storage.valueOf() === StorageTypes.FS.valueOf()) {
      const writeFile = util.promisify(fs.writeFile);
      return writeFile(file.full_name, content, "utf-8");
    }
    return Promise.resolve();
  }

  public static newFile(fullPath: string) {
    return new File(path.basename(fullPath),
      fullPath,
      fs.statSync(fullPath) ? FileType.FOLDER : FileType.FILE,
      `file://${fullPath}`,
      StorageTypes.FS,
      fullPath);
  }

}