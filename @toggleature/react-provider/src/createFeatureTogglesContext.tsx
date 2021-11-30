import React, { useContext, ComponentType } from "react";
import { StateLookupOptions } from "@toggleature/core-browser-init/lib/types/interface";
import { FeatureTogglesState } from "@toggleature/core-bus";
import useToggleatureBus from "./useToggleatureBus";
import { UseFeatureToggle } from "./interface";

export default function createFeatureTogglesContext<Features extends string>(
  initialState: FeatureTogglesState<Features>,
  lookup?: StateLookupOptions
) {
  const FeatureToggleContext =
    React.createContext<FeatureTogglesState<Features>>(initialState);

  return {
    useFeatureToggle: useFeatureToggle as UseFeatureToggle<Features>,
    withFeatureToggle,
    FeatureToggleProvider,
  };

  function FeatureToggleProvider({
    children,
  }: React.PropsWithChildren<Record<never, never>>) {
    const featureToggles = useToggleatureBus(initialState, lookup);
    return (
      <FeatureToggleContext.Provider value={featureToggles}>
        {children}
      </FeatureToggleContext.Provider>
    );
  }

  function useFeatureToggle(featureName: Features | null) {
    if (featureName === null) {
      return false;
    }
    const featureToggles = useContext(FeatureToggleContext);
    return featureToggles[featureName]?.enabled || false;
  }

  function withFeatureToggle<Props>(featureName: Features) {
    return function withFeatureToggleInternal(Component: ComponentType<Props>) {
      function ComponentWithFeatureToggle(props: Props) {
        const enabled = useFeatureToggle(featureName);
        const actualProps = { ...props, [featureName]: enabled };
        return <Component {...actualProps} />;
      }
      const componentName =
        Component.displayName ?? "ComponentWithFeatureToggle";
      ComponentWithFeatureToggle.displayName = `${componentName}_${featureName}`;
      return ComponentWithFeatureToggle;
    };
  }
}
