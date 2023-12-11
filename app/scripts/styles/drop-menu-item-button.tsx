import styled, { css } from 'styled-components';
import { DropMenuItem, DropMenuItemProps } from '@devseed-ui/dropdown';
import { themeVal } from '@devseed-ui/theme-provider';

interface DropMenuItemButtonProps extends DropMenuItemProps {
  variation?:
    | 'base'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info';
}

const DropMenuItemButton = styled(DropMenuItem).attrs({
  as: 'button',
  'data-dropdown': 'click.close'
})<DropMenuItemButtonProps>`
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;

  ${(props) => renderVariation(props)}
`;

export default DropMenuItemButton;

function renderVariation(props: DropMenuItemButtonProps) {
  const { variation = 'base', active } = props;

  return css`
    color: ${themeVal(`color.${variation}`)};

    &:hover {
      color: ${themeVal(`color.${variation}`)};
      background-color: ${themeVal(`color.${variation}-50a`)};
    }

    /* Print & when prop is passed */
    ${active && '&,'}
    &.active {
      background-color: ${themeVal(`color.${variation}-100a`)};
    }

    &:focus-visible {
      outline-color: ${themeVal(`color.${variation}-200a`)};
    }
  `;
}
