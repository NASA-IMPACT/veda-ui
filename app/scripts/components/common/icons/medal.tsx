import React from 'react';
import { createCollecticon } from '@devseed-ui/collecticons';
import styled from 'styled-components';

export const CollecticonMedal = styled(
  createCollecticon((props: any) => (
    <svg {...props}>
      <title>{props.title || 'A medal icon'}</title>
      <path
        id='medal'
        d='M4,10.471L4,16L8,14L12,16L12,10.471C13.227,9.372 14,7.775 14,6C14,2.689 11.311,0 8,0C4.689,0 2,2.689 2,6C2,7.775 2.773,9.372 4,10.471ZM8,3C9.656,3 11,4.344 11,6C11,7.656 9.656,9 8,9C6.344,9 5,7.656 5,6C5,4.344 6.344,3 8,3Z'
      />
    </svg>
  ))
)`
  /* icons must be styled-components */
`;
