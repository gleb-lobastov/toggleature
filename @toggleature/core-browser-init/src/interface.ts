import {
  FeatureTogglesState,
  FeatureToggleState,
  FeatureTogglesUpdates,
  ToggleatureBusOptions,
} from "@toggleature/core-bus";

export { FeatureTogglesState, FeatureToggleState };

export interface StateLookupOptions {
  globalVariableName?: string;
  localStorageKey?: string;
  searchParamsKey?: string;
}

export interface StateOptions<Features extends string>
  extends Omit<ToggleatureBusOptions<Features>, "initialState"> {
  initialState:
    | FeatureTogglesState<Features>
    | Promise<FeatureTogglesState<Features>>;
  lookup?: StateLookupOptions;
}

export interface Overrides<Features extends string> {
  overrideLevel: "readyState" | "enabledState";
  state: FeatureTogglesUpdates<Features>;
}
