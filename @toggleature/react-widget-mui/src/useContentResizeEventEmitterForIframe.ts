import { useLayoutEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";

const DEBOUNCE_DELAY_MS = 50;
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
      debounce(
        (entries) => {
          if (entries[0]?.contentRect) {
            handleResize(entries[0].contentRect);
          }
        },
        DEBOUNCE_DELAY_MS,
        { leading: true }
      )
    );
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();

    function handleResize(rect: DOMRectReadOnly) {
      const { height: nextHeight, width: nextWidth } = rect;
      window.parent.postMessage(
        `${CHANNEL_KEY}:${Math.ceil(nextWidth)}/${Math.ceil(nextHeight)}`,
        "*"
      );
    }
  }, [container]);

  return { containerRef };
}

function isIframe() {
  return window !== window.parent;
}
