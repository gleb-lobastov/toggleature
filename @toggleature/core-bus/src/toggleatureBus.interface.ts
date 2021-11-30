import { ConnectOptions, YabusConnection } from "./yabus/yabus.interface";

interface FeatureToggleStateBase {
  caption: string;
  description?: string;
  responsible?: string;
  enabled: boolean;
}

interface FeatureToggleStateWip extends FeatureToggleStateBase {
  enabled: boolean;
  testReady: false;
  inRelease: false;
}

interface FeatureToggleStateDone extends FeatureToggleStateBase {
  enabled: boolean;
  testReady: true;
  inRelease: boolean;
}

export type FeatureToggleState = FeatureToggleStateWip | FeatureToggleStateDone;
export type FeatureTogglesState<Features extends string> = {
  [key in Features]: FeatureToggleState;
};
export type FeatureTogglesUpdates<Features extends string> = Partial<{
  [key in Features]: boolean;
}>;

export interface ToggleatureBusOptions<Features extends string>
  extends Omit<
    ConnectOptions<
      FeatureTogglesState<Features>,
      FeatureTogglesUpdates<Features>
    >,
    "mergeStrategy"
  > {}

export interface ToggleatureBusConnection<Features extends string>
  extends YabusConnection<
    FeatureTogglesState<Features>,
    FeatureTogglesUpdates<Features>
  > {}
