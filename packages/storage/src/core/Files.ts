import { File } from "../api/File";
import { Provider } from "../api/Provider";
import { StorageTypes } from "../api/StorageTypes";

export class Files {

  private static providers = new Map<StorageTypes, Provider>();

  public static register(provider: Provider) {
    this.providers.set(provider.type, provider);
  }

  public static listFiles(file: File): Promise<File[]> {
    const provider = this.providers.get(file.storage);
    if (provider) {
      return provider.listFiles(file);
    }
    return Promise.resolve([]);
  }

  public static write(file: File, content: string): Promise<void> {
    const provider = this.providers.get(file.storage);
    if (provider) {
      return provider.write(file, content);
    }
    return Promise.resolve();

  }

  public static read(file: File): Promise<string> {
    const provider = this.providers.get(file.storage);
    if (provider) {
      return provider.read(file);
    }
    return Promise.resolve("");
  }
}
