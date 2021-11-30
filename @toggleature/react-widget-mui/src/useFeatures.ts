import { useState, useEffect, useRef, useCallback } from "react";
import toggleatureBus, {
  FeatureToggleState,
  FeatureTogglesState,
  FeatureTogglesUpdates,
  ToggleatureBusConnection,
} from "@toggleature/core-bus";

type FeaturesEnabledState<Features extends string> = Record<Features, boolean>;

interface FeaturesProvisionBase<Features extends string> {
  updateFeatureToggles: (updates: FeatureTogglesUpdates<Features>) => boolean;
  resetFeatureToggles: () => boolean;
  isFeatureChanged: (featureToggleName: Features) => boolean;
}

interface FeaturesProvisionIdle<Features extends string>
  extends FeaturesProvisionBase<Features> {
  connected: false;
  featureTogglesConfig: null;
  featureTogglesState: null;
  changed: false;
}

interface FeaturesProvisionConnected<Features extends string>
  extends FeaturesProvisionBase<Features> {
  connected: true;
  featureTogglesConfig: FeatureTogglesState<Features>;
  featureTogglesState: FeaturesEnabledState<Features>;
  changed: boolean;
}

type FeaturesProvision<Features extends string> =
  | FeaturesProvisionIdle<Features>
  | FeaturesProvisionConnected<Features>;

export default function useFeatures<
  Features extends string
>(): FeaturesProvision<Features> {
  const [featureTogglesState, setFeatureTogglesState] =
    useState<FeaturesEnabledState<Features> | null>(null);

  const featureTogglesConfigRef = useRef<FeatureTogglesState<Features> | null>(
    null
  );
  const defaultFeatureTogglesStateRef =
    useRef<FeaturesEnabledState<Features> | null>(null);

  const connectionRef = useRef<ToggleatureBusConnection<Features> | null>(null);

  useEffect(() => {
    connectionRef.current = toggleatureBus({
      onUpdate: function handleUpdateFeatureToggles({ state: wholeConfig }) {
        const activeState = mapConfigToActiveState(wholeConfig);
        if (!defaultFeatureTogglesStateRef.current) {
          featureTogglesConfigRef.current = wholeConfig;
          defaultFeatureTogglesStateRef.current = activeState;
        }
        // todo: надо обновляться тут во всех случаях
        setFeatureTogglesState(activeState);
      },
    });

    return () => connectionRef.current?.disconnect();
  }, []);

  const isFeatureChanged = useCallback(
    (featureName: Features) => {
      if (!featureTogglesState || !featureTogglesConfigRef.current) {
        return false;
      }
      return (
        featureTogglesState[featureName] !==
        featureTogglesConfigRef.current[featureName].enabled
      );
    },
    [featureTogglesState]
  );

  const updateFeatureToggles = (updates: FeatureTogglesUpdates<Features>) => {
    const updated = connectionRef.current?.update(updates) ?? false;
    if (updated && connectionRef.current?.state) {
      // todo удалить эти обновления
      setFeatureTogglesState(
        mapConfigToActiveState(connectionRef.current.state)
      );
    }
    return updated;
  };

  const resetFeatureToggles = () => {
    if (!defaultFeatureTogglesStateRef.current) {
      return false;
    }
    const updated =
      connectionRef.current?.update(defaultFeatureTogglesStateRef.current) ??
      false;
    if (updated && connectionRef.current?.state) {
      // todo удалить эти обновления
      setFeatureTogglesState(
        mapConfigToActiveState(connectionRef.current.state)
      );
    }
    return updated;
  };

  if (
    featureTogglesConfigRef.current === null ||
    defaultFeatureTogglesStateRef.current === null ||
    featureTogglesState === null
  ) {
    return {
      connected: false,
      featureTogglesConfig: null,
      featureTogglesState: null,
      changed: false,
      updateFeatureToggles,
      resetFeatureToggles,
      isFeatureChanged,
    };
  }

  return {
    connected: true,
    featureTogglesConfig: featureTogglesConfigRef.current,
    featureTogglesState,
    changed: Object.keys(featureTogglesConfigRef.current).some(
      (featureToggleName) => isFeatureChanged(featureToggleName as Features)
    ),
    updateFeatureToggles,
    resetFeatureToggles,
    isFeatureChanged,
  };
}

function mapConfigToActiveState<Features extends string>(
  featureTogglesConfig: FeatureTogglesState<Features>
): FeaturesEnabledState<Features> {
  const entries = Object.entries<FeatureToggleState>(featureTogglesConfig) as [
    Features,
    FeatureToggleState
  ][];
  return Object.fromEntries(
    entries.map(([key, { enabled }]) => [key, enabled])
  ) as FeaturesEnabledState<Features>;
}
