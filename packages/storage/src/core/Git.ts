import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as git from "isomorphic-git";
import { File, FileType, Provider, StorageTypes } from "../api";
import { FS } from "./FS";

export class Git implements Provider {
  private _myfs = new FS();
  public readonly type = StorageTypes.GIT;
  private cache = new Map<string, string>();

  public constructor() {
    git.listFiles({ fs, dir: __dirname }).then(s => console.log(JSON.stringify(s)));
  }

  public listFiles(file: File): Promise<File[]> {
    return this.resolve(file.origin)
      .then(s => {
        return this._myfs.listFiles(FS.newFile(s, s))
          .then(files => files.filter(f => !f.relative_name.startsWith(".git/") || f.relative_name === ".git" ).map(f => Git._newFile(file.origin, s, f)));
      });
  }

  public read(file: File): Promise<string> {
    return this.resolve(file.origin).then(s => {
      return this._myfs.read(FS.newFile(s, file.full_name));
    });
  }

  public write(file: File, content: string): Promise<void> {
    return this._myfs.write(FS.convert(file), content)
      .then(() => console.log("commit and push"));
  }

  private resolve(repo: string): Promise<string> {
    const _result = this.cache.get(repo);
    if (_result === undefined) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-"));
      this.cache.set(repo, dir);
      console.error("repo: " + dir);
      return git.clone({
        fs: fs,
        dir: dir,
        url: repo,
        ref: "master",
        singleBranch: true,
        depth: 1
      }).then(() => {
        return dir;
      });
    } else {
      return Promise.resolve(_result);
    }
  }

  public static newFile(origin: string) {
    return new File("/",
      "/",
      "/",
      FileType.FOLDER,
      origin,
      StorageTypes.GIT,
      origin,
      origin);
  }

  private static _newFile(origin: string, rootPath: string, file: File) {
    return new File(path.basename(file.full_name),
      file.full_name,
      file.relative_name,
      file.type,
      origin,
      StorageTypes.GIT,
      origin,
      file.id);
  }
}

