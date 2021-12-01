import { makeStyles } from "@material-ui/core/styles";
import FeatureTogglesWidget from "./FeatureTogglesWidget";
import useContentResizeEventEmitterForIframe, {
  CHANNEL_KEY,
} from "./useContentResizeEventEmitterForIframe";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: theme.zIndex.drawer, // для отображения панели с фича флагами поверх страницы
    "&:hover": {
      opacity: "0.8",
    },
  },
}));

export default function FeatureTogglesWidgetContainer() {
  const classes = useStyles();
  const { containerRef } = useContentResizeEventEmitterForIframe();

  return (
    <div ref={containerRef} className={classes.container}>
      <FeatureTogglesWidget />
    </div>
  );
}

FeatureTogglesWidgetContainer.CHANNEL_KEY = CHANNEL_KEY;
