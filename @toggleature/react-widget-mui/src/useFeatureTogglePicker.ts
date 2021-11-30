import { useCallback, useState } from "react";

export default function useFeatureTogglePicker<Features extends string>() {
  const [pickedFeatureToggleName, setPickedFeatureToggleName] =
    useState<Features | null>(null);

  const handlePickFeatureToggle = useCallback(
    (featureToggleName: Features) =>
      setPickedFeatureToggleName(featureToggleName),
    [setPickedFeatureToggleName]
  );

  const handleResetPickedFeatureToggle = useCallback(
    () => setPickedFeatureToggleName(null),
    [setPickedFeatureToggleName]
  );

  return {
    pickedFeatureToggleName,
    handlePickFeatureToggle,
    handleResetPickedFeatureToggle,
  };
}
