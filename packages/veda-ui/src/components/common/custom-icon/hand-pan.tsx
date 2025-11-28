import React from 'react';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import { makeUSWDSIcon } from './utils';

const HandPanIconComponent = (props: IconProps) => (
  <svg
    viewBox='0 0 16 16'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <title>{props['aria-label'] || 'Hand pan icon'}</title>
    <path d='M8,8L8,1C8,0.448 8.448,0 9,0C9.552,0 10,0.448 10,1L10,8L11,8L11,2C11,1.448 11.448,1 12,1C12.552,1 13,1.448 13,2L13,8L14,8L14,5C14,4.448 14.448,4 15,4C15.552,4 16,4.448 16,5L16,9L16,9.001L16,14C16,14.53 15.789,15.039 15.414,15.414C15.039,15.789 14.53,16 14,16C11.883,16 8.628,16 7,16C6.37,16 5.778,15.704 5.4,15.2C3.88,13.174 0,8 0,8C0,8 0,8 0,8C0.574,7.426 1.482,7.362 2.131,7.848L5,10L5,3C5,2.448 5.448,2 6,2C6.552,2 7,2.448 7,3L7,8L8,8Z' />
  </svg>
);

HandPanIconComponent.displayName = 'HandPanIcon';
export const HandPanIcon = makeUSWDSIcon(HandPanIconComponent);
