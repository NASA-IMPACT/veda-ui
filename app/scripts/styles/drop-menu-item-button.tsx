import styled, { css } from 'styled-components';
import { DropMenuItem } from '@devseed-ui/dropdown';
import { rgba, themeVal } from '@devseed-ui/theme-provider';

const rgbaFixed = rgba as any;

const DropMenuItemButton = styled(DropMenuItem).attrs({
  as: 'button',
  'data-dropdown': 'click.close'
})`
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;

  ${({ active }) =>
    active &&
    css`
      &,
      &:visited {
        background-color: ${rgbaFixed(themeVal('color.link'), 0.08)};
      }
    `}
`;

export default DropMenuItemButton;
