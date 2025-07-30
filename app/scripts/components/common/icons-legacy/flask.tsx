import React from 'react';
import { createCollecticon } from '@devseed-ui/collecticons';
import styled from 'styled-components';

export const CollecticonFlask = styled(
  createCollecticon((props: any) => (
    <svg {...props}>
      <title>{props.title || 'A flask icon'}</title>
      <path
        id='lab-flask'
        d='M5,2L5,6C5,6 2.583,10.028 0.817,12.971C0.447,13.589 0.437,14.358 0.792,14.985C1.147,15.612 1.812,16 2.532,16C5.694,16 10.306,16 13.468,16C14.188,16 14.853,15.612 15.208,14.985C15.563,14.358 15.553,13.589 15.183,12.971C13.417,10.028 11,6 11,6L11,2L12,2L12,0L4,0L4,2L5,2ZM11.068,10L4.932,10L7,6.554L7,2L9,2C9,2 9,6.554 9,6.554L11.068,10Z'
      />
    </svg>
  ))
)`
  /* icons must be styled-components */
`;
