import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

export const ParentDatasetTitle = styled.h2<{ size?: string }>`
  color: ${themeVal('color.primary')};
  text-align: left;
  font-size: ${(props) => (props.size == 'small' ? '0.75rem' : '1rem')};
  line-height: 0.75rem;
  font-weight: normal;
  ${(props) => (props.size == 'small' ? '400' : 'normal')};
  display: flex;
  min-width: 0;
  justify-content: center;
  gap: 0.1rem;
  align-items: center;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    fill: ${themeVal('color.primary')};
    min-width: ${(props) => (props.size == 'small' ? '1rem' : 'auto')};
  }
`;
