import React from 'react';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import { makeUSWDSIcon } from './utils';

const ProgressTickLowIconComponent = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M4.522,12.892L3.094,14.32C4.2,15.18 5.539,15.756 7,15.938L7,13.918C6.105,13.768 5.261,13.419 4.522,12.892ZM11.478,12.892C10.739,13.419 9.895,13.768 9,13.918L9,15.938C10.461,15.756 11.799,15.18 12.906,14.32L11.478,12.892ZM13.918,9C13.768,9.895 13.419,10.739 12.892,11.478L14.32,12.906C15.18,11.8 15.756,10.461 15.938,9L13.918,9ZM2.082,9L0.062,9C0.244,10.461 0.82,11.799 1.68,12.906L3.108,11.478C2.581,10.739 2.232,9.895 2.082,9ZM10.784,4.916L12.269,6.253L7.1,12L3.856,8.794L5.262,7.372L7.016,9.103L10.784,4.916ZM14.32,3.094L12.893,4.521C13.42,5.26 13.769,6.104 13.918,7L15.938,7C15.756,5.539 15.18,4.201 14.32,3.094ZM0.062,7L2.082,7C2.287,5.777 2.864,4.651 3.756,3.756C3.834,3.678 3.916,3.6 4,3.528L4,6L6,6L6,-0L0,0L0,2L2.709,2C1.283,3.258 0.309,5.015 0.062,7ZM11.478,3.108L12.906,1.68C11.551,0.627 9.849,-0 8,-0L8,2C9.264,2 10.469,2.388 11.478,3.108Z' />
  </svg>
);

ProgressTickLowIconComponent.displayName = 'ProgressTickLowIcon';

export const ProgressTickLowIcon = makeUSWDSIcon(ProgressTickLowIconComponent);