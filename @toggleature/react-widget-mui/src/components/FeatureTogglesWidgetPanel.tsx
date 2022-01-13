import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { FeatureTogglesState } from "@toggleature/core-bus";
import FeatureToggleSwitch from "./FeatureToggleSwitch";

const useStyles = makeStyles({
  flags: {
    marginBottom: 24,
  },
  controlPanel: {
    display: "flex",
    margin: 6,
  },
  control: {
    flexGrow: 1,
    margin: "0 6px",
  },
});

interface FeatureFlagsWidgetPanelProps<Features extends string> {
  className: string | undefined;
  onPickFeature: (event: React.MouseEvent, featureToggleName: Features) => void;
  onCollapseWidget: () => void;
  onResetFeatures: () => void;
  onToggleFeature: (
    event: React.ChangeEvent,
    featureToggleName: Features,
    enabled: boolean
  ) => void;
  featureTogglesState: Record<Features, boolean>;
  featureTogglesConfig: FeatureTogglesState<Features>;
  isFeatureChanged: (toggleName: Features) => boolean;
}

export default function FeatureFlagsWidgetPanel<Features extends string>({
  className,
  onToggleFeature,
  onPickFeature,
  onCollapseWidget,
  onResetFeatures,
  featureTogglesState,
  featureTogglesConfig,
  isFeatureChanged,
}: FeatureFlagsWidgetPanelProps<Features>) {
  const classes = useStyles();

  return (
    <Paper className={className}>
      <div className={classes.flags}>
        {Object.entries<boolean>(featureTogglesState).map(
          ([featureToggleName, value]) => (
            <FeatureToggleSwitch<Features>
              key={featureToggleName}
              featureToggleName={featureToggleName as Features}
              featureToggleConfig={
                featureTogglesConfig[featureToggleName as Features]
              }
              changed={isFeatureChanged(featureToggleName as Features)}
              value={value}
              onChange={onToggleFeature}
              onPickFeature={onPickFeature}
            />
          )
        )}
      </div>
      <div className={classes.controlPanel}>
        <Button
          className={classes.control}
          onClick={() => onCollapseWidget()}
          variant="contained"
          fullWidth
        >
          Скрыть
        </Button>
        <Button
          className={classes.control}
          onClick={onResetFeatures}
          variant="contained"
          fullWidth
        >
          Сбросить
        </Button>
      </div>
    </Paper>
  );
}
