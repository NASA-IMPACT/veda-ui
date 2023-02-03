import { VEDA_OVERRIDE_THEME } from "$styles/theme";

// Convert object keys to string paths.
type PropertyStringPath<T, Prefix = ''> = {
  [K in keyof T]: T[K] extends number | string
    ? `${string & Prefix}${string & K}`
    : PropertyStringPath<T[K], `${string & Prefix}${string & K}.`>;
}[keyof T];

declare module '@devseed-ui/theme-provider' {
  type ThemeValPathExtend =
    | ThemeValPath
    | PropertyStringPath<typeof VEDA_OVERRIDE_THEME>;

  function themeVal(path: ThemeValPathExtend): ThemeValReturn;
}