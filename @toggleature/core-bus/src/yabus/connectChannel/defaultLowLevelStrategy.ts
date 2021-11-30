import { LowLevelStrategy } from "./connectChannel.interface";

const defaultLowLevelStrategy: LowLevelStrategy = {
  listen: function listen(handler: (event: MessageEvent) => void) {
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  },
  broadcast(message) {
    const iframeMode = window !== window.parent;

    window.postMessage(message, "*");
    if (iframeMode) {
      return window.parent.postMessage(message, "*");
    } else {
      Array.from(document.querySelectorAll("iframe")).forEach((iframe) =>
        iframe.contentWindow?.postMessage(message, "*")
      );
    }
  },
};

export default defaultLowLevelStrategy;
