import createFeatureToggles from "@toggleature/react-provider";
import featuresConfig from "./featuresConfig.json";
import { FeatureTogglesState } from "@toggleature/core-bus";

export type Features = "demoFeature" | "iframeContainer";

const DEFAULT_LOCAL_STORAGE_KEY = "@@toggleature:browser:state";
const DEFAULT_SEARCH_PARAMS_KEY = "@@toggleature:browser:state";

const params = new URL(document.location.href).searchParams;

const { useFeatureToggle, FeatureToggleProvider, FeatureToggle } =
  createFeatureToggles<Features>(
    featuresConfig as FeatureTogglesState<Features>,
    {
      localStorageKey:
        params.get("localStorageKey") ?? DEFAULT_LOCAL_STORAGE_KEY,
      searchParamsKey: DEFAULT_SEARCH_PARAMS_KEY,
    }
  );

export { useFeatureToggle, FeatureToggleProvider, FeatureToggle };
