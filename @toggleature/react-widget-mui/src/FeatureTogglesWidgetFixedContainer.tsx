import { makeStyles } from "@material-ui/core/styles";
import FeatureTogglesWidget from "./FeatureTogglesWidget";
import FeatureTogglesWidgetIframeContainer from "./FeatureTogglesWidgetIframeContainer";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    maxHeight: "calc(90vh - 20px)",
    overflowY: "auto",
    zIndex: theme.zIndex.drawer,
  },
}));

export default function FeatureTogglesWidgetFixedContainer() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FeatureTogglesWidget />
    </div>
  );
}

FeatureTogglesWidgetFixedContainer.WithoutContainer = FeatureTogglesWidget;
FeatureTogglesWidgetFixedContainer.IframeContainer =
  FeatureTogglesWidgetIframeContainer;
