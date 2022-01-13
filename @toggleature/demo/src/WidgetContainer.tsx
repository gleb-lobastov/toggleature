import { useEffect } from "react";
import { createIframe } from "@toggleature/iframe-container";
import FeatureTogglesWidget from "@toggleature/react-widget-mui";
import { useFeatureToggle } from "./featureToggles";

export default function WidgetContainer() {
  const shouldWrapWidgetInIframe = useFeatureToggle("iframeContainer");
  useEffect(() => {
    if (shouldWrapWidgetInIframe) {
      const [controls, error] = createIframe({
        featuresUrl: new URL(window.location.href),
      });

      if (error === null && controls) {
        const { destroyFeatureTogglesIframe } = controls;
        return destroyFeatureTogglesIframe;
      }
    }
  }, [shouldWrapWidgetInIframe]);

  return shouldWrapWidgetInIframe ? null : <FeatureTogglesWidget />;
}
