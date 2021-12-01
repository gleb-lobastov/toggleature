import { useLayoutEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";

const DEBOUNCE_DELAY_MS = 100;
export const CHANNEL_KEY = "@@toggleature:widget:resize_observer";

export default function useContentResizeEventEmitterForIframe() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const containerRef = useCallback((node: HTMLElement | null) => {
    setContainer(node);
  }, []);

  useLayoutEffect(() => {
    if (!isIframe() || !container) {
      return;
    }
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        handleResize(entries[0]?.contentRect?.height);
      }, DEBOUNCE_DELAY_MS)
    );
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();

    function handleResize(nextHeight: number) {
      window.parent.postMessage(`${CHANNEL_KEY}:${nextHeight}`, "*");
    }
  }, [container]);

  return { containerRef };
}

function isIframe() {
  return window !== window.parent;
}
