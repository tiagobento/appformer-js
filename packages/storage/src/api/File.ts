import {StorageTypes} from "./StorageTypes";
import {FileType} from "./FileType";

export class File {
    public readonly name: string;
    public readonly full_name: string;
    public readonly type: FileType;
    public readonly uri: string;
    public readonly storage: StorageTypes;
    public readonly id?: string;


    constructor(name: string, full_name: string, type: FileType, uri: string, storage: StorageTypes, id: string) {
        this.name = name;
        this.full_name = full_name;
        this.type = type;
        this.uri = uri;
        this.storage = storage;
        this.id = id;
    }
}
