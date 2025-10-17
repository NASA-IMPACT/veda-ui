import React from 'react';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import { makeUSWDSIcon } from './utils';

const ProgressTickMediumIconComponent = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M7,15.938L7,13.918C5.777,13.713 4.651,13.136 3.756,12.244C2.625,11.109 2,9.603 2,8C2,6.397 2.625,4.891 3.756,3.756C3.834,3.678 3.916,3.6 4,3.528L4,6L6,6L6,-0L0,0L0,2L2.709,2C1.047,3.466 0,5.609 0,8C0,12.081 3.053,15.446 7,15.938ZM11.478,12.892C10.739,13.419 9.895,13.768 9,13.918L9,15.938C10.461,15.756 11.799,15.18 12.906,14.32L11.478,12.892ZM15.938,9L13.918,9C13.768,9.895 13.419,10.739 12.892,11.478L14.32,12.906C15.18,11.8 15.756,10.461 15.938,9ZM10.784,4.916L12.269,6.253L7.1,12L3.856,8.794L5.262,7.372L7.016,9.103L10.784,4.916ZM14.32,3.094L12.893,4.521C13.42,5.26 13.769,6.104 13.918,7L15.938,7C15.756,5.539 15.18,4.201 14.32,3.094ZM11.478,3.108L12.906,1.68C11.551,0.627 9.849,-0 8,-0L8,2C9.264,2 10.469,2.388 11.478,3.108Z' />
  </svg>
);

ProgressTickMediumIconComponent.displayName = 'ProgressTickMediumIcon';

export const ProgressTickMediumIcon = makeUSWDSIcon(ProgressTickMediumIconComponent);