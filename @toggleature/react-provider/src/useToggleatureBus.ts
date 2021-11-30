import { useEffect, useState } from "react";
import initToggleatureBus from "@toggleature/core-browser-init";
import { FeatureTogglesState } from "@toggleature/core-bus";
import { StateLookupOptions } from "@toggleature/core-browser-init/lib/types/interface";

export default function useToggleatureBus<Features extends string>(
  initialState: FeatureTogglesState<Features>,
  lookup: StateLookupOptions = {}
) {
  const [featureToggles, setFeatureToggles] =
    useState<FeatureTogglesState<Features>>(initialState);

  useEffect(() => {
    const connectionPromise = initToggleatureBus<Features>({
      initialState,
      lookup,
      onUpdate: ({
        state: nextFeaturesConfig,
      }: {
        state: FeatureTogglesState<Features>;
      }) => setFeatureToggles(nextFeaturesConfig),
    });
    return () => {
      connectionPromise.then((connection) => connection.disconnect());
    };
  }, []);

  return featureToggles;
}
