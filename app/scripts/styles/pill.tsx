import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

export const Pill = styled.span`
  display: inline-flex;
  vertical-align: top;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0.125, 0.75)};
  background: ${themeVal('color.surface-100a')};
  transition: all 0.24s ease 0s;
  font-size: 0.75rem;
  line-height: 1.25rem;
  font-weight: ${themeVal('type.base.bold')};
  white-space: nowrap;

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
