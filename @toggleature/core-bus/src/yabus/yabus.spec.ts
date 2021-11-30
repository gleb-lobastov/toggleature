/**
 * @jest-environment jsdom
 */
import yabus from "./yabus";
import { ConnectOptions } from "./yabus.interface";

interface TestState {
  never?: true;
  testPropNum: number;
  testPropStr: string;
}

let postMessageSpy: jest.SpyInstance;

beforeEach(() => {
  postMessageSpy = jest.spyOn(window, "postMessage");
});

afterEach(() => {
  console.log(postMessageSpy.mock.calls);
  postMessageSpy.mockRestore();
});

describe("single yabus instance", () => {
  it("should initialize, update and disconnect properly", async () => {
    expect.assertions(9);

    const channelKey = "testChannelKey";
    const initialState = { testPropNum: 1, testPropStr: "whatever" };
    const updates = { testPropNum: 2 };
    const onUpdate = jest.fn();
    const onError = jest.fn();
    const yabusConnection = yabus<TestState>({
      initialState,
      channelKey,
      onUpdate,
      onError,
    });

    expect(yabusConnection.connected).toBe(true);

    await delay();

    expect(yabusConnection.state).toEqual(initialState);
    expect(onError).not.toBeCalled();
    expect(onUpdate).not.toBeCalled(); // ignore own events

    const success = yabusConnection.update(updates);
    expect(success).toBe(true);

    await delay();

    expect(yabusConnection.state).toEqual({ ...initialState, ...updates });
    expect(onError).not.toBeCalled();
    expect(onUpdate).not.toBeCalled(); // ignore own events by default

    yabusConnection.disconnect();
    expect(yabusConnection.connected).toBe(false);
  });
});

describe("two yabus instances", () => {
  it("should acknowledge and sync newbie", async () => {
    expect.assertions(9);

    const channelKey = "testChannelKey";
    const initialState = { testPropNum: 1, testPropStr: "whatever" };
    const updates = { testPropNum: 2 };
    const onUpdateNewbie = jest.fn();
    const onErrorNewbie = jest.fn();
    const yabusConnectionOldie = yabus<TestState>({
      initialState,
      channelKey,
      onUpdate: jest.fn(),
      onError: jest.fn(),
    });

    const yabusConnectionNewbie = yabus<TestState>({
      channelKey,
      onUpdate: onUpdateNewbie,
      onError: onErrorNewbie,
    });

    expect(yabusConnectionNewbie.connected).toBe(true);

    await delay();

    expect(yabusConnectionNewbie.state).toEqual(initialState);
    expect(onErrorNewbie).not.toBeCalled();
    expect(onUpdateNewbie).toBeCalledWith({
      state: initialState,
      updates: null,
    });

    const success = yabusConnectionOldie.update(updates);
    expect(success).toBe(true);

    await delay();

    expect(yabusConnectionNewbie.state).toEqual({
      ...initialState,
      ...updates,
    });
    expect(onErrorNewbie).not.toBeCalled();
    expect(onUpdateNewbie).toBeCalledWith({
      state: { ...initialState, ...updates },
      updates,
    });

    yabusConnectionNewbie.disconnect();
    expect(yabusConnectionNewbie.connected).toBe(false);
  });

  it("should sync oldie, when newbie comes with initial state", async () => {
    expect.assertions(5);

    const channelKey = "testChannelKey";
    const initialState = { testPropNum: 1, testPropStr: "whatever" };

    const onUpdateOldie = jest.fn();
    const onErrorOldie = jest.fn();
    const yabusConnectionOldie = yabus<TestState>({
      channelKey,
      onUpdate: onUpdateOldie,
      onError: onErrorOldie,
    });

    const onUpdateNewbie = jest.fn();
    const onErrorNewbie = jest.fn();
    yabus<TestState>({
      channelKey,
      initialState,
      onUpdate: onUpdateNewbie,
      onError: onErrorNewbie,
    });

    await delay();

    expect(yabusConnectionOldie.state).toEqual(initialState);
    expect(onErrorOldie).not.toBeCalled();
    expect(onUpdateOldie).toBeCalledWith({
      state: initialState,
      updates: null,
    });
    expect(onUpdateNewbie).not.toBeCalled();
    expect(onErrorNewbie).not.toBeCalled();
  });

  it("should update both ways", async () => {
    expect.assertions(4);

    const channelKey = "testChannelKey";
    const initialState = { testPropNum: 1, testPropStr: "whatever" };
    const oldieUpdates = { testPropNum: 2 };
    const newbieUpdate = { testPropStr: "breaking change" };

    const yabusConnectionOldie = yabus<TestState>({
      channelKey,
      initialState,
      onUpdate: jest.fn(),
      onError: jest.fn(),
    });
    const yabusConnectionNewbie = yabus<TestState>({
      channelKey,
      initialState,
      onUpdate: jest.fn(),
      onError: jest.fn(),
    });

    await delay();

    yabusConnectionOldie.update(oldieUpdates);

    await delay();

    yabusConnectionNewbie.update(newbieUpdate);

    await delay();

    expect(yabusConnectionOldie.state).toEqual({
      ...initialState,
      ...oldieUpdates,
      ...newbieUpdate,
    });
    expect(yabusConnectionNewbie.state).toEqual({
      ...initialState,
      ...oldieUpdates,
      ...newbieUpdate,
    });

    const resetState = { testPropNum: 3, testPropStr: "brand new" };
    yabusConnectionOldie.reset(resetState);

    await delay();

    expect(yabusConnectionOldie.state).toEqual(resetState);
    expect(yabusConnectionNewbie.state).toEqual(resetState);
  });
});

describe("yabus instances pool", () => {
  it("should work", async () => {
    const poolSize = 10; // >= 8
    expect.assertions(poolSize * 4);

    const channelKey = "testChannelKey";
    const initialState = { testPropNum: 1, testPropStr: "good" };
    const updatesFoo = { testPropNum: 31337 };
    const updatesBar = { testPropStr: "excellent" };

    const poolOptions = Array.from({ length: poolSize }).map(() => ({
      channelKey,
      onUpdate: jest.fn(),
      onError: jest.fn(),
    })) as unknown as ConnectOptions<TestState, Partial<TestState>>[];

    poolOptions[2].initialState = {
      testPropNum: -1,
      testPropStr: "not so good",
      never: true,
    };
    poolOptions[5].initialState = initialState;
    const pool = poolOptions.map(yabus);

    await delay();

    pool.forEach((yabusConnection) => {
      expect(yabusConnection.state).toEqual(initialState);
    });

    pool[8].update(updatesFoo);

    await delay();

    const fooState = { ...initialState, ...updatesFoo };
    pool.forEach((yabusConnection) => {
      expect(yabusConnection.state).toEqual(fooState);
    });

    const disconnectIndex = 7;
    pool[disconnectIndex].disconnect();
    pool[4].update(updatesBar);

    await delay();

    const barState = { ...fooState, ...updatesBar };
    pool.forEach((yabusConnection, index) => {
      if (index !== disconnectIndex) {
        expect(yabusConnection.state).toEqual(barState);
      } else {
        expect(yabusConnection.state).toEqual(fooState);
      }
      expect(poolOptions[index].onError).not.toBeCalled();
    });
  });
});

function delay(timeout = 0) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
