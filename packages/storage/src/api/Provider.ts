import {StorageTypes} from "./StorageTypes";
import {File} from "./File";

export interface Provider {
    readonly type: StorageTypes;

    listFiles(file: File): Promise<File[]>;

    write(file: File, content: string): Promise<void>;

    read(file: File): Promise<string>;

}
