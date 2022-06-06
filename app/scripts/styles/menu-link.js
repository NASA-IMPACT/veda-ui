import { css } from 'styled-components';

import { glsp, media } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const GlobalMenuLinkCSS = css`
  appearance: none;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  padding: ${variableGlsp(0, 1)};
  transition: all 0.32s ease 0s;

  ${media.xlargeUp`
    padding: ${glsp(0.5, 0)};
  `}

  &:hover {
    opacity: 0.64;
  }

  > * {
    flex-shrink: 0;
  }

  /* Menu link line decoration */

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0.125rem;
    height: 0;
    background: currentColor;

    ${media.xlargeUp`
      width: 0;
      height: 0.125rem;
    `}
  }

  &.active::after {
    ${media.largeDown`
      height: 100%;
    `}

    ${media.xlargeUp`
      width: 100%;
    `}
  }
`;

export default GlobalMenuLinkCSS;
