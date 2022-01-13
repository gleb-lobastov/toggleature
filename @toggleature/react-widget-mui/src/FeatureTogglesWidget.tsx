import React, { useCallback, useState } from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import PickedFeature from "./components/PickedFeature";
import useFeatures from "./useFeatures";
import useFeatureTogglePicker from "./useFeatureTogglePicker";
import FeatureFlagsWidgetPanel from "./components/FeatureTogglesWidgetPanel";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#FFF",
    opacity: "0.8",
    overflow: "auto",
  },
  transparent: {
    backgroundColor: "rgba(255,255,255,0)",
  },
  changed: {
    color: theme.palette.secondary.main,
  },
  expanded: {
    padding: "16px",
  },
}));

export default function FeatureTogglesWidget<Features extends string>() {
  const classes = useStyles();

  const {
    featureTogglesConfig,
    featureTogglesState,
    updateFeatureToggles,
    resetFeatureToggles,
    connected,
    changed,
    isFeatureChanged,
  } = useFeatures<Features>();

  const [isExpanded, setIsExpanded] = useState(false);

  const {
    pickedFeatureToggleName,
    handlePickFeatureToggle,
    handleResetPickedFeatureToggle,
  } = useFeatureTogglePicker<Features>();

  const handleToggleFeature = useCallback(
    (
      event: KeyboardEvent | React.SyntheticEvent,
      featureToggleName: Features,
      checked: boolean
    ) => {
      const updates: Partial<Record<Features, boolean>> = {};
      updates[featureToggleName] = checked;
      return updateFeatureToggles(updates);
    },
    []
  );

  if (!connected || !featureTogglesConfig || !featureTogglesState) {
    return null;
  }

  if (pickedFeatureToggleName) {
    return (
      <div className={cls(classes.container, classes.transparent)}>
        <PickedFeature<Features>
          changedClassName={classes.changed}
          featureToggleName={pickedFeatureToggleName}
          caption={featureTogglesConfig[pickedFeatureToggleName].caption}
          checked={featureTogglesState[pickedFeatureToggleName]}
          changed={isFeatureChanged(pickedFeatureToggleName)}
          onToggleFeature={handleToggleFeature}
          onReset={() => {
            handleResetPickedFeatureToggle();
            setIsExpanded(true);
          }}
        />
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div className={cls(classes.container, classes.transparent)}>
        <IconButton onClick={() => setIsExpanded(true)}>
          <ToggleOffIcon className={cls({ [classes.changed]: changed })} />
        </IconButton>
      </div>
    );
  }

  return (
    <FeatureFlagsWidgetPanel<Features>
      className={cls(classes.container, classes.expanded)}
      featureTogglesConfig={featureTogglesConfig}
      featureTogglesState={featureTogglesState}
      isFeatureChanged={isFeatureChanged}
      onToggleFeature={handleToggleFeature}
      onPickFeature={(event, featureToggleName) =>
        handlePickFeatureToggle(featureToggleName)
      }
      onResetFeatures={resetFeatureToggles}
      onCollapseWidget={() => setIsExpanded(false)}
    />
  );
}

// function groupByStatus(featureFlagsEntries, config) {
//   return groupBy(featureFlagsEntries, ([key]) => {
//     if (config[key]?.hidden) {
//       return "hiddenFeatures";
//     }
//     return config[key]?.testReady ? "readyFeatures" : "wipFeatures";
//   });
// }
//
// function checkIsChanged(featureFlags, defaultFeatureFlags, featureToggleName) {
//   return featureFlags[featureToggleName] !== defaultFeatureFlags[featureToggleName];
// }
