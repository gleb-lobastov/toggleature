import {
  ResizeMessageCallback,
  IframeContainerOptions,
  IframeContainerReturnTuple,
  Align,
} from "./interface";

const CHANNEL_KEY = "@@toggleature:widget:resize_observer:";
const MIN_HEIGHT = 48;
const MIN_WIDTH = 48;

export default function createIframe(
  options: IframeContainerOptions
): IframeContainerReturnTuple {
  const { featuresUrl, align = Align.BOTTOM_RIGHT } = options;

  let unsubscribe: Function;
  let featureTogglesIframe: HTMLIFrameElement;

  try {
    featureTogglesIframe = document.createElement("iframe");
    unsubscribe = subscribeToResizeMessage(({ height, width }) => {
      console.log("height, width", height, width);
      featureTogglesIframe.style.height = `${height}px`;
      featureTogglesIframe.style.width = `${width}px`;
    });
    featureTogglesIframe.src = featuresUrl.href;
    featureTogglesIframe.setAttribute(
      "style",
      `
        border:0;
        position: fixed;
        bottom:20px;
        ${align === Align.BOTTOM_RIGHT ? "right" : "left"}:20px;
        width:${MIN_WIDTH}px;
        height:${MIN_HEIGHT}px;
        z-index: 100000;
      `
    );
    document.body.insertBefore(featureTogglesIframe, document.body.firstChild);
    return [{ featureTogglesIframe, destroyFeatureTogglesIframe }, null];
  } catch (error) {
    destroyFeatureTogglesIframe();
    return [
      null,
      error instanceof Error
        ? error
        : new Error(`Unknown error: "${String(error)}"`),
    ];
  }

  function destroyFeatureTogglesIframe() {
    if (unsubscribe) {
      unsubscribe();
    }
    if (featureTogglesIframe && document.body.contains(featureTogglesIframe)) {
      document.body.removeChild(featureTogglesIframe);
    }
  }
}

function subscribeToResizeMessage(callback: ResizeMessageCallback) {
  window.addEventListener("message", handleResizeMessage);
  return () => window.removeEventListener("message", handleResizeMessage);

  function handleResizeMessage(event: MessageEvent) {
    const { data } = event;
    if (typeof data === "string" && data.startsWith(CHANNEL_KEY)) {
      console.log({ data });
      const [nextWidth, nextHeight] = data.slice(CHANNEL_KEY.length).split("/");
      const actualHeight = Math.max(
        MIN_HEIGHT,
        Math.round(parseFloat(nextHeight) || 0)
      );
      const actualWidth = Math.max(
        MIN_WIDTH,
        Math.round(parseFloat(nextWidth) || 0)
      );
      callback({ height: actualHeight, width: actualWidth });
    }
  }
}
