import React, { isValidElement, ReactElement, ReactNode } from "react";
import {
  UseFeatureToggle,
  FeatureToggleProps,
  FeatureToggleFallbackProps,
} from "./interface";

export default function createFeatureToggleComponent<Features extends string>(
  useFeatureToggle: UseFeatureToggle<Features>
) {
  function FeatureToggle({
    featureName,
    children,
  }: FeatureToggleProps<Features>): JSX.Element {
    const enabled = useFeatureToggle(featureName);
    return (
      <>
        {React.Children.map<ReactElement, ReactNode>(children, (child) => {
          if (!isValidElement(child)) {
            return enabled ? child : null;
          }

          const compatibleFallback =
            child &&
            child.type === FeatureToggleFallback &&
            (!child.props.featureName ||
              child.props.featureName === featureName);

          if (enabled && compatibleFallback) {
            return null;
          }
          if (enabled) {
            return child;
          }
          if (compatibleFallback) {
            return child.props.children ?? null;
          }
          return null;
        }) ?? null}
      </>
    );
  }

  function FeatureToggleFallback({
    featureName,
    children,
  }: FeatureToggleFallbackProps<Features>): JSX.Element | null {
    // Hook should be always called, but parameter is optional.
    // On other hand FeatureToggleFallback without feature name
    // is typically used as child of FeatureToggle, but in that case
    // it will never rendered, because FeatureToggle deal with render
    // itself. So the trick main purpose to calm down the typescript
    const enabled = featureName
      ? useFeatureToggle(featureName)
      : useFeatureToggle(null);

    if (enabled) {
      return null;
    }
    return <>{children}</>;
  }

  FeatureToggle.Fallback = FeatureToggleFallback;

  return {
    FeatureToggle,
    FeatureToggleFallback,
  };
}
