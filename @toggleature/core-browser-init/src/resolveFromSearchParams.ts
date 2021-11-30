import { FeatureTogglesUpdates } from "@toggleature/core-bus/lib/types";

export default function resolveFromSearchParams<Features extends string>(
  searchParamsKey: string
): FeatureTogglesUpdates<Features> | null {
  try {
    // overrides вносят изменения поверх дефолтно определенных флагов,
    // а не задают набор флагов целиком. Т.к. иначе, когда со временем
    // набор доступных флагов будет изменятся и одна и та же ссылка
    // в разное время будет определять разную функциональность
    return (new URL(window.location.href).searchParams
      ?.get(searchParamsKey)
      ?.split(",")
      ?.reduce((accumulator, featureDirective) => {
        const negate = featureDirective.charAt(0) === "!";
        const featureName = negate
          ? featureDirective.substring(1)
          : featureDirective;
        accumulator[featureName as Features] = !negate;
        return accumulator;
      }, {} as FeatureTogglesUpdates<Features>) ??
      null) as FeatureTogglesUpdates<Features>;
  } catch (error) {
    return null;
  }
}

// could this func be useful?
// function isValidFeatureFlagName(value) {
//   return /^[a-zA-Z][a-zA-Z0-9]*$/.test(value);
// }
