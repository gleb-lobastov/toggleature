import yabus from "./yabus";

import {
  ToggleatureBusConnection,
  ToggleatureBusOptions,
  FeatureToggleState,
  FeatureTogglesState,
  FeatureTogglesUpdates,
} from "./toggleatureBus.interface";

export {
  FeatureToggleState,
  ToggleatureBusConnection,
  ToggleatureBusOptions,
  FeatureTogglesState,
  FeatureTogglesUpdates,
};

const DEFAULT_CHANNEL_KEY = "$$toggleature";

export default function toggleatureBus<Features extends string>(
  options: ToggleatureBusOptions<Features> = {}
): ToggleatureBusConnection<Features> {
  return yabus<FeatureTogglesState<Features>, FeatureTogglesUpdates<Features>>({
    channelKey: DEFAULT_CHANNEL_KEY,
    ...options,
    mergeStrategy,
  });

  function mergeStrategy(
    state: FeatureTogglesState<Features>,
    updates: FeatureTogglesUpdates<Features>
  ): FeatureTogglesState<Features> {
    return (Object.entries(updates) as Array<[Features, boolean]>).reduce(
      (acc, [toggleName, enabled]) => {
        acc[toggleName] = { ...acc[toggleName] };
        acc[toggleName].enabled = enabled;
        return acc;
      },
      { ...state }
    );
  }
}
