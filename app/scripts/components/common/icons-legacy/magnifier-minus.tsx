import React from 'react';
import { createCollecticon } from '@devseed-ui/collecticons';
import styled from 'styled-components';

export const CollecticonMagnifierMinus = styled(
  createCollecticon((props: any) => (
    <svg {...props}>
      <title>{props.title || 'Magnifier with minus icon'}</title>
      <path d='M9.5 5.5V7.5L3.5 7.5V5.5H9.5Z' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12.033 9.912L15.708 13.587C16.097 13.976 16.097 14.612 15.708 15.001L15.001 15.708C14.612 16.097 13.976 16.097 13.587 15.708L9.912 12.033C8.92 12.646 7.751 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.751 12.646 8.92 12.033 9.912ZM3.318 9.682C2.468 8.832 2 7.702 2 6.5C2 5.298 2.468 4.168 3.318 3.318C4.168 2.468 5.298 2 6.5 2C7.702 2 8.832 2.468 9.682 3.318C10.532 4.168 11 5.298 11 6.5C11 7.702 10.532 8.832 9.682 9.682C8.832 10.532 7.702 11 6.5 11C5.298 11 4.168 10.532 3.318 9.682Z'
      />
    </svg>
  ))
)`
  /* icons must be styled-components */
`;
