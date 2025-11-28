import { themeVal } from '@devseed-ui/theme-provider';
import styled from 'styled-components';

export const ShortcutCode = styled.code`
  background: ${themeVal('color.surface-200a')};
  font-size: 0.75rem;
  padding: 0.125rem 0.25rem;
  line-height: 0.75rem;
  border-radius: ${themeVal('shape.rounded')};
  font-weight: ${themeVal('type.base.regular')};
`;
