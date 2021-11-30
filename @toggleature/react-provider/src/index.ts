import { FeatureTogglesState } from "@toggleature/core-bus";
import { StateLookupOptions } from "@toggleature/core-browser-init/lib/types/interface";
import createFeatureToggleComponents from "./createFeatureToggleComponents";
import createFeatureTogglesContext from "./createFeatureTogglesContext";

export default function createFeatureToggles<Features extends string>(
  initialState: FeatureTogglesState<Features>,
  lookup?: StateLookupOptions
) {
  const { FeatureToggleProvider, useFeatureToggle, withFeatureToggle } =
    createFeatureTogglesContext<Features>(initialState, lookup);
  const { FeatureToggle, FeatureToggleFallback } =
    createFeatureToggleComponents<Features>(useFeatureToggle);

  return {
    FeatureToggleProvider,
    FeatureToggle,
    FeatureToggleFallback,
    useFeatureToggle,
    withFeatureToggle,
  };
}
