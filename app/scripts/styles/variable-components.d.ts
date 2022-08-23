import { DefaultTheme, StyledComponent } from 'styled-components';
import { HeadingProps, Heading, Lead, Prose } from '@devseed-ui/typography';

export const VarHeading: StyledComponent<
  typeof Heading,
  DefaultTheme,
  HeadingProps,
  never
>;

export const VarLead: StyledComponent<
  typeof Lead,
  DefaultTheme,
  HeadingProps,
  never
>;

export const VarProse: StyledComponent<
  typeof Prose,
  DefaultTheme,
  HeadingProps,
  never
>;
