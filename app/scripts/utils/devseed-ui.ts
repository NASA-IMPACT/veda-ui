// Typescript overrides for @devseed-ui

// TODO: remove once @devseed-ui is updated

import { DefaultTheme, ThemedCssFunction } from 'styled-components';
import {
  media as _media,
  multiply as _multiply
} from '@devseed-ui/theme-provider';
import {
  Toolbar as _Toolbar,
  ToolbarIconButton as _ToolbarIconButton
} from '@devseed-ui/toolbar';
import { ButtonProps } from '@devseed-ui/button';

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


interface ToolbarProps {
  /**
   * Size property to pass to contextual enabled elements, namely
   * ToolbarButton and ToolbarIconButton.
   * @default medium
   */
  size?: ButtonProps['size'];
}


export const Toolbar = _Toolbar as unknown as React.FC<ToolbarProps>;
export const ToolbarIconButton = _ToolbarIconButton as unknown as React.FC<Omit<ButtonProps, 'fitting'>>;
