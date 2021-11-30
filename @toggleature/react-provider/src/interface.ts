import React from "react";

export interface FeatureToggleProps<Features> {
  featureName: Features;
  children: React.ReactNode | React.ReactNode[];
}

export interface FeatureToggleFallbackProps<Features> {
  featureName?: Features;
  children: React.ReactNode | React.ReactNode[];
}

export interface UseFeatureToggle<Feature extends string> {
  (featureName: null): false;
  (featureName: Feature): boolean;
}
