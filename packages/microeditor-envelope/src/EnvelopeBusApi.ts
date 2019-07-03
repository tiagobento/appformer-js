import { EnvelopeBusMessage } from "appformer-js-microeditor-envelope-protocol";

export interface EnvelopeBusApi {
  postMessage<T>(message: EnvelopeBusMessage<T>, targetOrigin?: any, _?: any): any;
}
