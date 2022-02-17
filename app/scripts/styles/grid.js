import styled from 'styled-components';
import { media } from '@devseed-ui/theme-provider';

export const GridIsFull = styled.div`
  grid-column: 1 / span 4;

  ${media.mediumUp`
    grid-column: 1 / span 8;
  `}

  ${media.largeUp`
    grid-column: 1 / span 12;
  `}
`;

export const GridIsHalf = styled.div`
  grid-column: ${(props) => (props.num - 1) * 2 + 1} / span 2;
  ${media.mediumUp`
  grid-column:${(props) => (props.num - 1) * 4 + 1} / span 4;
  `}
  ${media.largeUp`
    grid-column:${(props) => (props.num - 1) * 6 + 1} / span 6;
  `}
`;

export const GridIsQuarter = styled.div`
  grid-column: ${(props) => props.num} / span 1;
  ${media.mediumUp`
  grid-column: ${(props) => (props.num - 1) * 2 + 1} / span 2;
  `}
  ${media.largeUp`
  grid-column: ${(props) => (props.num - 1) * 3 + 1} / span 3;
  `}
`;
