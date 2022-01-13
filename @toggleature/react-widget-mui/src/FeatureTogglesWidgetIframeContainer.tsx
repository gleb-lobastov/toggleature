import { makeStyles } from "@material-ui/core/styles";
import FeatureTogglesWidget from "./FeatureTogglesWidget";
import useContentResizeEventEmitterForIframe, {
  CHANNEL_KEY,
} from "./useContentResizeEventEmitterForIframe";

const useStyles = makeStyles({
  container: {
    position: "absolute",
    width: "max-content",
  },
});

export default function FeatureTogglesWidgetFixedContainer() {
  const classes = useStyles();
  const { containerRef } = useContentResizeEventEmitterForIframe();

  return (
    <div ref={containerRef} className={classes.container}>
      <FeatureTogglesWidget />
    </div>
  );
}

FeatureTogglesWidgetFixedContainer.CHANNEL_KEY = CHANNEL_KEY;
