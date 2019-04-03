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
      return this._listFiles(file, file)
        .catch(reason => Promise.reject(reason));
    }
    return Promise.resolve([]);
  }

  private _listFiles(root: File, file: File): Promise<File[]> {
    return this.readdir(file.full_name, { withFileTypes: true })
      .then(dirents => {
        const files: File[] = [];

        return Promise.all(dirents.map(f => {
          const fullPath = file.full_name + "/" + f.name;
          if (f.isFile()) {
            files.push(FS._newFile(root.full_name, fullPath, FileType.FILE));
            return Promise.resolve();
          } else if (f.isDirectory()) {
            const d = FS._newFile(root.full_name, fullPath, FileType.FOLDER);
            return this._listFiles(root, d).then(nested => {
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

  public static convert(file: File) {
    return FS._newFile(file.name, file.full_name, file.type);
  }

  public static newFile(rootPath: string, fullPath: string) {
    return FS._newFile(rootPath, fullPath, fs.statSync(fullPath) ? FileType.FOLDER : FileType.FILE);
  }

  public static _newFile(rootPath: string, fullPath: string, fileType: FileType) {
    return new File(path.basename(fullPath),
      fullPath,
      path.relative(rootPath, fullPath),
      fileType,
      `file://${fullPath}`,
      StorageTypes.FS,
      rootPath,
      fullPath);
  }
}