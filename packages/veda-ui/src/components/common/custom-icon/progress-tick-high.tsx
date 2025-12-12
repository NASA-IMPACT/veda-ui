import React from 'react';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import { makeUSWDSIcon } from './utils';

const ProgressTickHighIconComponent = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M15.938,9L13.918,9C13.713,10.223 13.136,11.349 12.244,12.244C11.109,13.375 9.603,14 8,14C6.397,14 4.891,13.375 3.756,12.244C2.625,11.109 2,9.603 2,8C2,6.397 2.625,4.891 3.756,3.756C3.834,3.678 3.916,3.6 4,3.528L4,6L6,6L6,-0L0,0L0,2L2.709,2C1.047,3.466 0,5.609 0,8C0,12.419 3.581,16 8,16C12.081,16 15.446,12.947 15.938,9ZM10.784,4.916L12.269,6.253L7.1,12L3.856,8.794L5.262,7.372L7.016,9.103L10.784,4.916ZM14.32,3.094L12.893,4.521C13.42,5.26 13.769,6.104 13.918,7L15.938,7C15.756,5.539 15.18,4.201 14.32,3.094ZM11.478,3.108L12.906,1.68C11.551,0.627 9.849,-0 8,-0L8,2C9.264,2 10.469,2.388 11.478,3.108Z' />
  </svg>
);

ProgressTickHighIconComponent.displayName = 'ProgressTickHighIcon';

export const ProgressTickHighIcon = makeUSWDSIcon(ProgressTickHighIconComponent);
