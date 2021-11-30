import { LowLevelStrategy } from "./connectChannel.interface";

const defaultLowLevelStrategy: LowLevelStrategy = {
  listen: function listen(handler: (event: MessageEvent) => void) {
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  },
  broadcast: (message) => window.postMessage(message, "*"),
};

export default defaultLowLevelStrategy;
