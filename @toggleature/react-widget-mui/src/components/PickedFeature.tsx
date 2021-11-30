import React, { useEffect } from "react";
import cls from "classnames";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

interface PickedFeatureProps<Features extends string> {
  featureToggleName: Features;
  caption: string;
  checked: boolean;
  changed: boolean;
  changedClassName: string | undefined;
  onToggleFeature: (
    event:
      | KeyboardEvent /* dom event, not react one */
      | React.MouseEvent<HTMLButtonElement>,
    featureToggleName: Features,
    checked: boolean
  ) => void;
  onReset: () => void;
}

export default function PickedFeature<Features extends string>({
  featureToggleName,
  caption,
  checked,
  changed,
  changedClassName,
  onToggleFeature,
  onReset,
}: PickedFeatureProps<Features>) {
  const Icon = checked ? ToggleOnIcon : ToggleOffIcon;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "KeyF" && event.altKey) {
        onToggleFeature(event, featureToggleName, !checked);
      }
    };
    window.document.addEventListener("keyup", listener, false);
    return () => {
      window.document.removeEventListener("keyup", listener);
    };
  });
  return (
    <>
      <Button
        onClick={(event) => onToggleFeature(event, featureToggleName, !checked)}
        endIcon={
          <Icon className={cls({ [changedClassName as any]: changed })} />
        }
      >
        {caption ?? featureToggleName}
      </Button>
      <IconButton onClick={onReset}>
        <HighlightOffIcon />
      </IconButton>
    </>
  );
}

PickedFeature.defaultProps = {
  changed: false,
  checked: false,
};
