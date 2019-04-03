import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as git from "isomorphic-git";
import { File, FileType, Provider, StorageTypes } from "../api";
import { FS } from "./FS";

export class Git implements Provider {
  private static CACHE = new Map<string, string>();
  private _myfs = new FS();
  public readonly type = StorageTypes.GIT;
  private args: { user: string, passw: string, name: string, email: string };

  public constructor(args: { user: string, passw: string, name: string, email: string }) {
    this.args = args;
    git.listFiles({ fs, dir: __dirname }).then(s => console.log(JSON.stringify(s)));
  }

  public listFiles(file: File): Promise<File[]> {
    return this.resolve(file.origin)
      .then(s => {
        return this._myfs.listFiles(FS.newFile(s, s))
          .then(files => files.filter(f => !f.relative_name.startsWith(".git/") || f.relative_name === ".git").map(f => Git._newFile(file.origin, s, f)));
      });
  }

  public read(file: File): Promise<string> {
    return this.resolve(file.origin).then(s => {
      return this._myfs.read(FS.newFile(s, file.full_name));
    });
  }

  public write(file: File, content: string): Promise<void> {
    return this._myfs.write(FS.convert(file), content)
      .then(() => this.commitAndPush(file.origin, file.relative_name));
  }

  private resolve(repo: string): Promise<string> {
    const _result = Git.CACHE.get(repo);
    if (_result === undefined) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-"));
      Git.CACHE.set(repo, dir);
      console.log("repo: " + dir);
      return git.clone({
        fs: fs,
        dir: dir,
        url: repo,
        ref: "master",
        singleBranch: true,
        depth: 1,
        username: this.args.user,
        password: this.args.passw
      }).then(() => {
        return dir;
      });
    } else {
      return Promise.resolve(_result);
    }
  }

  private async commitAndPush(repo: string, fileName: string) {
    const dir = await this.resolve(repo);
    await git.add({ fs, dir, filepath: fileName });
    await git.commit({
      fs,
      dir,
      message: "changes",
      author: {
        name: this.args.name,
        email: this.args.email
      }
    });
    await git.push({
      fs: fs,
      dir: dir,
      username: this.args.user,
      password: this.args.passw
    });
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