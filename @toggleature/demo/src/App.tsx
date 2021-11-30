import "./App.css";
import FeatureFlagsWidget from "@toggleature/react-widget-mui";
import { FeatureToggleProvider, FeatureToggle } from "./featureToggles";

export default function App() {
  return (
    <>
      <FeatureToggleProvider>
        <div style={{ fontSize: 48 }}>
          <span style={{ marginRight: 8, color: "white" }}>
            The feature is:
          </span>
          <FeatureToggle featureName="demoFeature">
            <span style={{ color: "#2ECC40" }}>ENABLED!</span>
            <FeatureToggle.Fallback>
              <span style={{ color: "#FF4136" }}>disabled :(</span>
            </FeatureToggle.Fallback>
          </FeatureToggle>
        </div>
      </FeatureToggleProvider>
      <FeatureFlagsWidget />
    </>
  );
}
