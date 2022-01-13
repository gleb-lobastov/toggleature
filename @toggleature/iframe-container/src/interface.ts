export enum Align {
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
}

export interface IframeContainerOptions {
  featuresUrl: URL;
  align?: Align;
}

export interface IframeContainerControls {
  featureTogglesIframe: HTMLIFrameElement;
  destroyFeatureTogglesIframe: () => void;
}

export type IframeContainerReturnTuple =
  | [IframeContainerControls, null]
  | [null, Error];

export interface ResizeMessageCallbackValues {
  height: number;
  width: number;
}

export interface ResizeMessageCallback {
  ({ height, width }: ResizeMessageCallbackValues): void;
}
