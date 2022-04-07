// Typescript overrides for @devseed-ui

// TODO: remove once @devseed-ui is updated

import { DefaultTheme, ThemedCssFunction } from 'styled-components';
import {
  media as _media,
  multiply as _multiply
} from '@devseed-ui/theme-provider';

type themeValReturn = (props: {
  theme: { [key: string]: string | number };
}) => string | number;

// Redeclare the media function to fix the types defined in the UI library.
export const media = _media as unknown as {
  [K in keyof typeof _media]: ThemedCssFunction<DefaultTheme>;
};

export const multiply = _multiply as <
  T extends number | string | themeValReturn
>(
  a: T,
  b: number | string
) => number | string;
