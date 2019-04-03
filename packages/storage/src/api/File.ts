import { StorageTypes } from "./StorageTypes";
import { FileType } from "./FileType";

export class File {
  public readonly name: string;
  public readonly full_name: string;
  public readonly relative_name: string;
  public readonly type: FileType;
  public readonly uri: string;
  public readonly storage: StorageTypes;
  public readonly origin: string;
  public readonly id: string;

  constructor(name: string, full_name: string, relative_name: string, type: FileType, uri: string, storage: StorageTypes, origin: string, id: string) {
    this.name = name;
    this.full_name = full_name;
    this.relative_name = relative_name;
    this.type = type;
    this.uri = uri;
    this.storage = storage;
    this.origin = origin;
    this.id = id;
  }
}