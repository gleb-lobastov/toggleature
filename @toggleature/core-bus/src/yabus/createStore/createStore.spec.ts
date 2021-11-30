import createStore from "./createStore";
import { MergeStrategy } from "./createStore.interface";

describe("createStore", () => {
  it("should hold null instead of state until synced", () => {
    const store = createStore();

    expect(store.syncedState).toBeNull();
  });

  it("should not update until synced", () => {
    const store = createStore();
    const testUpdate = { update: "update" };

    const { updated, state } = store.update(testUpdate);

    expect(updated).toBe(false);
    expect(state).toBeNull();
  });

  it("should hold state, when synced", function () {
    const store = createStore();
    const testInitialState = { state: "whatever" };

    const { updated, state } = store.sync(testInitialState);

    expect(updated).toBe(true);
    expect(state).toEqual(testInitialState);
    expect(store.syncedState).toEqual(testInitialState);
  });

  it("should not sync twice", function () {
    const store = createStore();
    const testInitialState = { state: "whatever" };

    store.sync(testInitialState);
    const { updated, state } = store.sync({ haha: "whatever" });

    expect(updated).toBe(false);
    expect(state).toEqual(testInitialState);
    expect(store.syncedState).toEqual(testInitialState);
  });

  it("should update state", function () {
    const store = createStore();
    const testInitialState = { state: "whatever" };
    const testUpdate = { update: "update" };

    store.sync(testInitialState);
    const { updated, state } = store.update(testUpdate);

    expect(updated).toBe(true);
    expect(state).toEqual({ ...testInitialState, ...testUpdate });
    expect(store.syncedState).toEqual({ ...testInitialState, ...testUpdate });
  });

  it("should use arbitrary merge strategy", function () {
    type State = Record<string, { flag: boolean }>;
    type Updates = Record<keyof State, boolean>;
    const mergeStrategy = <MergeStrategy<State, Updates>>(
      function mergeStrategy(state, updates) {
        return Object.entries(updates).reduce(
          (acc, [key, value]) => {
            acc[key] = { ...acc[key] };
            acc[key].flag = value;
            return acc;
          },
          { ...state }
        );
      }
    );
    const initialState = {
      valueA: { flag: false },
      valueB: { flag: true },
    };

    const store = createStore<State, Updates>({ initialState, mergeStrategy });
    store.update({ valueA: true, valueC: true });
    expect(store.syncedState).toEqual({
      valueA: { flag: true },
      valueB: { flag: true },
      valueC: { flag: true },
    });
  });
});
