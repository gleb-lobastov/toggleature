import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { FeatureToggleState } from "@toggleature/core-bus";
import FeatureToggleSwitchLabel from "./FeatureToggleSwitchLabel";

const useStyles = makeStyles({
  container: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginBottom: "5px",
    "&:hover $flagPicker": {
      opacity: 1,
      transition: "opacity 0 ease-in-out",
    },
  },
  toggleContainer: {
    display: "flex",
    flexGrow: 1,
    margin: 0,
  },
  toggleContainerLabel: {
    flexGrow: 1,
  },
  flagPicker: {
    opacity: 0,
    transition: "opacity 100ms ease-in-out",
  },
});

interface FeatureSwitchProps<Features extends string> {
  featureToggleName: Features;
  featureToggleConfig: FeatureToggleState;
  changed: boolean;
  value: boolean;
  onChange: (
    event: React.ChangeEvent,
    featureToggleName: Features,
    value: boolean
  ) => void;
  onPickFeature: (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    featureToggleName: Features
  ) => void;
}

export default function FeatureToggleSwitch<Features extends string>({
  featureToggleName,
  featureToggleConfig,
  changed,
  value,
  onChange,
  onPickFeature,
}: FeatureSwitchProps<Features>) {
  const classes = useStyles();

  const handleChange = useCallback(
    (event) => onChange(event, event.target.name, event.target.checked),
    []
  );

  return (
    <div className={classes.container}>
      <FormControlLabel
        className={classes.toggleContainer}
        classes={{ label: classes.toggleContainerLabel }}
        control={
          <Switch
            name={featureToggleName}
            checked={value}
            onChange={handleChange}
          />
        }
        label={
          <FeatureToggleSwitchLabel
            {...featureToggleConfig}
            featureToggleName={featureToggleName}
            caption={featureToggleConfig?.caption ?? featureToggleName}
            changed={changed}
          />
        }
      />
      <IconButton
        className={classes.flagPicker}
        size="small"
        onClick={(event) => onPickFeature(event, featureToggleName)}
      >
        <CenterFocusStrongIcon />
      </IconButton>
    </div>
  );
}

FeatureToggleSwitch.defaultProps = {};
