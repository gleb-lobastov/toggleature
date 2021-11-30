import createFeatureToggles from "@toggleature/react-provider";
import featuresConfig from "./featuresConfig.json";
import { FeatureTogglesState } from "@toggleature/core-bus";

export type Features = "demoFeature" | "enabledByDefaultFeature";

const { useFeatureToggle, FeatureToggleProvider, FeatureToggle } =
  createFeatureToggles<Features>(
    featuresConfig as FeatureTogglesState<Features>
  );

export { useFeatureToggle, FeatureToggleProvider, FeatureToggle };