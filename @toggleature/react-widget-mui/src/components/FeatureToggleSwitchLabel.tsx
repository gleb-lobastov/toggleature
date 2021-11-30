import React from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles(() => ({
  tooltipTrigger: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoIcon: {
    marginLeft: 8,
  },
  description: {
    marginBottom: 8,
  },
  notChanged: {
    visibility: "hidden",
  },
  featureInProgress: {
    color: "gray",
  },
}));

interface SwitchLabelProps<Features extends string> {
  featureToggleName: Features;
  caption: string;
  responsible: string;
  description: string;
  changed: boolean;
  testReady: boolean;
}

export default function FeatureToggleSwitchLabel<Features extends string>({
  caption,
  changed,
  description,
  featureToggleName,
  responsible,
  testReady,
}: SwitchLabelProps<Features>) {
  const classes = useStyles();

  const labelNode = (
    <Typography
      variant="body1"
      component="span"
      className={cls({ [classes.featureInProgress]: !testReady })}
    >
      {caption}{" "}
      <span className={cls({ [classes.notChanged]: !changed })}>(изменен)</span>
    </Typography>
  );

  const tooltipNode = (
    <>
      {Boolean(description) && (
        <Typography variant="body1" className={classes.description}>
          {description}
        </Typography>
      )}
      <Typography variant="body1">{`Название: ${featureToggleName}`}</Typography>
      {Boolean(responsible) && (
        <Typography variant="body1">{`Ответственный: ${responsible}`}</Typography>
      )}
    </>
  );

  return (
    <Tooltip title={tooltipNode}>
      <span className={classes.tooltipTrigger}>
        {labelNode}
        {Boolean(description) && (
          <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
        )}
      </span>
    </Tooltip>
  );
}

FeatureToggleSwitchLabel.defaultProps = {
  description: null,
  responsible: null,
  changed: false,
  testReady: false,
};
