export type StateVariable<State> = State | null;
export type UpdateStatus<State> =
  | { updated: false; state: StateVariable<State> }
  | { updated: boolean; state: State };

export interface Store<State, Updates = Partial<State>> {
  syncedState: StateVariable<State>;
  sync: (values: State, forced?: boolean) => UpdateStatus<State>;
  update: (updates: Updates) => UpdateStatus<State>;
}

export interface MergeStrategy<State, Updates> {
  (prevState: State, updates: Updates): State;
}

export interface StoreOptions<State, Updates> {
  initialState?: State;
  mergeStrategy?: MergeStrategy<State, Updates>;
}
