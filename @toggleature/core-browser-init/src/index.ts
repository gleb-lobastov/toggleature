import toggleatureBus, { FeatureTogglesUpdates } from "@toggleature/core-bus";
import resolveFromLocalStorage from "./resolveFromLocalStorage";
import resolveFromSearchParams from "./resolveFromSearchParams";
import {
  FeatureTogglesState,
  FeatureToggleState,
  StateOptions,
  Overrides,
} from "./interface";

declare global {
  interface Window {
    featureToggles: any;
  }
}

export default function init<Features extends string>({
  initialState,
  onUpdate,
  lookup: { globalVariableName, localStorageKey, searchParamsKey } = {},
  ...forwardingOptions
}: StateOptions<Features>) {
  return Promise.resolve(initialState).then((actualInitialState) => {
    const overrides: Overrides<Features>[] = [
      {
        overrideLevel: "enabledState",
        state: mapObject<FeatureToggleState, boolean>(
          actualInitialState,
          ([key]) => [key, false]
        ) as Record<Features, boolean>,
      },
    ];

    if (globalVariableName) {
      const globalVariableState = (window as { [key: string]: any })[
        globalVariableName
      ];
      if (globalVariableState) {
        overrides.push({
          overrideLevel: "readyState",
          state: globalVariableState,
        });
        overrides.push({
          overrideLevel: "enabledState",
          state: globalVariableState,
        });
      }
    }
    if (searchParamsKey) {
      const searchParamsState = resolveFromSearchParams(searchParamsKey);
      if (searchParamsState) {
        overrides.push({
          overrideLevel: "readyState",
          state: searchParamsState as FeatureTogglesUpdates<Features>,
        });
      }
    }
    if (localStorageKey) {
      const localStorageState = resolveFromLocalStorage(localStorageKey);
      if (localStorageState) {
        overrides.push({
          overrideLevel: "enabledState",
          state: localStorageState,
        });
      }
    }

    const resultConfig = overrides.reduce<FeatureTogglesState<Features>>(
      mergeOverridesState,
      actualInitialState
    );

    const connection = toggleatureBus({
      ...forwardingOptions,
      initialState: resultConfig,
      onUpdate: ({ state, updates }) => {
        if (localStorageKey) {
          preserveState({ state });
        }
        if (onUpdate) {
          onUpdate({ state, updates });
        }
      },
    });

    window.featureToggles = window.featureToggles || {
      get(featureName?: Features) {
        if (!featureName) {
          return connection.state;
        }
        return connection.state?.[featureName];
      },
      set(featureName: Features, enabled: boolean) {
        const result = connection.update({
          [featureName]: enabled,
        } as FeatureTogglesUpdates<Features>);
        if (onUpdate) {
          onUpdate({
            // @ts-ignore
            state: connection.state,
            // @ts-ignore
            updates: { [featureName]: enabled },
          });
        }
        return result;
      },
    };

    return connection;
  });

  function mergeOverridesState(
    config: FeatureTogglesState<Features>,
    overrides: Overrides<Features>
  ) {
    return mapObject<FeatureToggleState>(config, ([key, prevState]) => {
      const override = overrides.state[key as Features];
      if (override === undefined) {
        return [key, prevState];
      }
      const nextState = { ...prevState };
      switch (overrides.overrideLevel) {
        case "enabledState":
          nextState.enabled = override;
          return [key, nextState];
        case "readyState":
          nextState.testReady = override || prevState.testReady;
          nextState.inRelease = override;
          return [key, nextState];
        default:
          return [key, prevState];
      }
    }) as FeatureTogglesState<Features>;
  }

  function preserveState({ state }: { state: FeatureTogglesState<Features> }) {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(
        mapObject<FeatureToggleState, boolean>(state, ([key, value]) => [
          key,
          value.enabled,
        ])
      )
    );
  }
}

function mapObject<SourceValue, TargetValue = SourceValue>(
  object: Record<string, SourceValue>,
  callback: ([key, value]: [string, SourceValue]) => [
    key: string,
    value: TargetValue
  ]
) {
  return Object.fromEntries(Object.entries(object).map(callback));
}
