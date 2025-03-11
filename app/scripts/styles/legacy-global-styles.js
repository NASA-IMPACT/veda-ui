import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

export const legacyGlobalStyleCSSBlock = css`
  font-size: 16px;
  font-family: ${themeVal('type.base.family')};
  line-height: calc(0.5rem + 1em);
`;
