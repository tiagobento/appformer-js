import { EnvelopeBusInnerMessageHandler } from "../EnvelopeBusInnerMessageHandler";
import { AppFormerKogitoEnvelope } from "../AppFormerKogitoEnvelope";
import { EnvelopeBusMessage } from "appformer-js-microeditor-envelope-protocol/src";

let envelopeBusInnerMessageHandler: EnvelopeBusInnerMessageHandler;

describe("new instance", () => {
  test("does nothing", () => {
    const busApi = {
      postMessage<T>(message: EnvelopeBusMessage<T>, targetOrigin?: any, _?: any): any {
        //do nothing;
      }
    };
    const appFormerKogitoEnvelope = new AppFormerKogitoEnvelope(busApi);
    envelopeBusInnerMessageHandler = new EnvelopeBusInnerMessageHandler(appFormerKogitoEnvelope, busApi);
  });
});
