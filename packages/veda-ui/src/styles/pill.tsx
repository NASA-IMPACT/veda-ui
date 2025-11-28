import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const renderPillVariation = ({ variation }: PillProps) => {
  switch (variation) {
    case 'achromic':
      return css`
        color: ${themeVal('color.surface')};
        background: ${themeVal('color.surface-100a')};
      `;
    case 'warning':
      return css`
        color: ${themeVal('color.danger-500')};
        background: ${themeVal('color.danger-200a')};
      `;
    case 'primary':
    default:
      return css`
        color: ${themeVal('color.primary')};
        background: ${themeVal('color.primary-100a')};
      `;
  }
};

interface PillProps {
  variation?: 'primary' | 'achromic' | 'warning';
}
export const Pill = styled.span<PillProps>`
  display: inline-flex;
  vertical-align: top;
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0.125, 0.75)};
  transition: all 0.24s ease 0s;
  font-size: 0.75rem;
  line-height: 1.25rem;
  font-weight: ${themeVal('type.base.bold')};
  white-space: nowrap;

  /* stylelint-disable-next-line selector-type-no-unknown */
  ${renderPillVariation}

  :is(a) {
    pointer-events: auto;

    &,
    &:visited {
      text-decoration: none;
    }

    &:hover {
      opacity: 0.64;
    }
  }
`;
