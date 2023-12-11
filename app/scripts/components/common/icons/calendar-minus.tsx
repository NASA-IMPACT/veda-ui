import React from 'react';
import { createCollecticon } from '@devseed-ui/collecticons';
import styled from 'styled-components';

export const CollecticonCalendarMinus = styled(
  createCollecticon((props: any) => (
    <svg {...props}>
      <title>{props.title || 'Calendar with minus icon'}</title>
      <path
        d='M11.5 0H10V3H9V1H5V0H3.5V3H2.5V1H1C0.447715 1 0 1.44772 0 2V12C0 12.5523 0.447716 13 1 13H5.34141C5.12031 12.3744 5 11.7013 5 11H2V5H12C13 5 13.3926 5.36838 14 5.71974V2C14 1.44772 13.5523 1 13 1H11.5V0Z'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11C6 8.23858 8.23858 6 11 6C13.7614 6 16 8.23858 16 11ZM8.5 11.625V10.375H13.5V11.625H8.5Z'
      />
    </svg>
  ))
)`
  /* icons must be styled-components */
`;
