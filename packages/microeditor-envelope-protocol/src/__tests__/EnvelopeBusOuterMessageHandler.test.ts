import { EnvelopeBusOuterMessageHandler } from "../EnvelopeBusOuterMessageHandler";
import { EnvelopeBusMessage } from "../EnvelopeBusMessage";
import { EnvelopeBusMessageType } from "../EnvelopeBusMessageType";

let sentMessages: Array<EnvelopeBusMessage<any>>;
let receivedMessages: string[];
let envelopeBusOuterMessageHandler: EnvelopeBusOuterMessageHandler;
let initPollCount: number;

beforeEach(() => {
  sentMessages = [];
  receivedMessages = [];
  initPollCount = 0;

  envelopeBusOuterMessageHandler = new EnvelopeBusOuterMessageHandler(_this => ({
    send: (msg: EnvelopeBusMessage<any>) => {
      sentMessages.push(msg);
    },
    pollInit: () => {
      initPollCount++;
    },
    receive_languageRequest: () => {
      receivedMessages.push("languageRequest");
    },
    receive_setContentRequest: () => {
      receivedMessages.push("setContentRequest");
    },
    receive_getContentResponse: (content: string) => {
      receivedMessages.push("getContentResponse_" + content);
    }
  }));
});

const delay = (ms: number) => {
  return new Promise(res => setTimeout(res, ms));
};

describe("new instance", () => {
  test("does nothing", () => {
    expect(envelopeBusOuterMessageHandler.initPolling).toBeFalsy();
    expect(envelopeBusOuterMessageHandler.initPollingTimeout).toBeFalsy();
    expect(sentMessages.length).toEqual(0);
    expect(receivedMessages.length).toEqual(0);
  });
});

describe("init", () => {
  test("polls for init response", async () => {
    envelopeBusOuterMessageHandler.init();
    expect(envelopeBusOuterMessageHandler.initPolling).toBeTruthy();
    expect(envelopeBusOuterMessageHandler.initPollingTimeout).toBeTruthy();

    //less than the timeout
    await delay(100);

    envelopeBusOuterMessageHandler.receive({ type: EnvelopeBusMessageType.RETURN_INIT, data: undefined });

    expect(initPollCount).toBeGreaterThan(0);
    expect(envelopeBusOuterMessageHandler.initPolling).toBeFalsy();
    expect(envelopeBusOuterMessageHandler.initPollingTimeout).toBeFalsy();
  });

  test("stops polling after timeout", async () => {
    EnvelopeBusOuterMessageHandler.INIT_POLLING_TIMEOUT_IN_MS = 200;

    envelopeBusOuterMessageHandler.init();
    expect(envelopeBusOuterMessageHandler.initPolling).toBeTruthy();
    expect(envelopeBusOuterMessageHandler.initPollingTimeout).toBeTruthy();

    //more than the timeout
    await delay(300);

    expect(initPollCount).toBeGreaterThan(0);
    expect(envelopeBusOuterMessageHandler.initPolling).toBeFalsy();
    expect(envelopeBusOuterMessageHandler.initPollingTimeout).toBeFalsy();
  });
});

describe("receive", () => {
  test("language request", () => {
    envelopeBusOuterMessageHandler.receive({ type: EnvelopeBusMessageType.REQUEST_LANGUAGE, data: undefined });
    expect(receivedMessages).toEqual(["languageRequest"]);
  });

  test("set content request", () => {
    envelopeBusOuterMessageHandler.receive({ type: EnvelopeBusMessageType.REQUEST_SET_CONTENT, data: undefined });
    expect(receivedMessages).toEqual(["setContentRequest"]);
  });

  test("get content response", () => {
    envelopeBusOuterMessageHandler.receive({ type: EnvelopeBusMessageType.RETURN_GET_CONTENT, data: "foo" });
    expect(receivedMessages).toEqual(["getContentResponse_foo"]);
  });
});

describe("request", () => {
  test("getContentResponse", () => {
    envelopeBusOuterMessageHandler.request_getContentResponse();

    expect(sentMessages.length).toEqual(1);
    expect(sentMessages[0].type).toBe(EnvelopeBusMessageType.REQUEST_GET_CONTENT);
    expect(sentMessages[0].data).toBe(undefined);
  });

  test("setContentRequest", () => {
    envelopeBusOuterMessageHandler.request_initResponse("test-origin");

    expect(sentMessages.length).toEqual(1);
    expect(sentMessages[0].type).toBe(EnvelopeBusMessageType.REQUEST_INIT);
    expect(sentMessages[0].data).toBe("test-origin");
  });
});

describe("respond", () => {
  test("languageRequest", () => {
    const languageData = { editorId: "id", gwtModuleName: "name", erraiDomain: "domain", resources: [] };
    envelopeBusOuterMessageHandler.respond_languageRequest(languageData);

    expect(sentMessages.length).toEqual(1);
    expect(sentMessages[0].type).toBe(EnvelopeBusMessageType.RETURN_LANGUAGE);
    expect(sentMessages[0].data).toBe(languageData);
  });

  test("setContentRequest", () => {
    envelopeBusOuterMessageHandler.respond_setContentRequest("bar");

    expect(sentMessages.length).toEqual(1);
    expect(sentMessages[0].type).toBe(EnvelopeBusMessageType.RETURN_SET_CONTENT);
    expect(sentMessages[0].data).toBe("bar");
  });
});
