import React from 'react';
import { createCollecticon } from '@devseed-ui/collecticons';
import styled from 'styled-components';

export const CollecticonMagnifierPlus = styled(
  createCollecticon((props: any) => (
    <svg {...props}>
      <title>{props.title || 'Magnifier with plus icon'}</title>
      <path
        d='M7.5 7.5H9.5V5.5H7.5V3.5H5.5V5.5H3.5V7.5H5.5V9.5H7.5V7.5Z'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.708 13.587L12.033 9.912C12.646 8.92 13 7.751 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C7.751 13 8.92 12.646 9.912 12.033L13.587 15.708C13.976 16.097 14.612 16.097 15.001 15.708L15.708 15.001C16.097 14.612 16.097 13.976 15.708 13.587ZM2 6.5C2 7.702 2.468 8.832 3.318 9.682C4.168 10.532 5.298 11 6.5 11C7.702 11 8.832 10.532 9.682 9.682C10.532 8.832 11 7.702 11 6.5C11 5.298 10.532 4.168 9.682 3.318C8.832 2.468 7.702 2 6.5 2C5.298 2 4.168 2.468 3.318 3.318C2.468 4.168 2 5.298 2 6.5Z'
      />
    </svg>
  ))
)`
  /* icons must be styled-components */
`;
