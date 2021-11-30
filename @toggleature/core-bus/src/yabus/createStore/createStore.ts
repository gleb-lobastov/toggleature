import {
  Store,
  StateVariable,
  StoreOptions,
  MergeStrategy,
} from "./createStore.interface";

export default function createStore<State, Updates = Partial<State>>({
  initialState,
  mergeStrategy = <MergeStrategy<State, Updates>>(
    function defaultMergeStrategy(prevState, updates) {
      return { ...prevState, ...updates };
    }
  ),
}: StoreOptions<State, Updates> = {}): Store<State, Updates> {
  let state: StateVariable<State> = initialState ?? null;
  return {
    get syncedState() {
      return state;
    },
    sync(toState, forced) {
      if (!state || forced) {
        state = toState;
        return { updated: true, state };
      }
      return { updated: false, state };
    },
    update(updates) {
      if (state) {
        state = mergeStrategy(state, updates);
        return { updated: true, state };
      }
      return { updated: false, state: null };
    },
  };
}
