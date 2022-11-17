import styled from 'styled-components';
import { DropMenuItem } from '@devseed-ui/dropdown';

const DropMenuItemButton = styled(DropMenuItem).attrs({
  as: 'button',
  'data-dropdown': 'click.close'
})`
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
`;

export default DropMenuItemButton;
