import React from 'react';
import { makeUSWDSIcon } from '../utils';

const ExpandMoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    {...props}
  >
    <path d='M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z' />
  </svg>
);

ExpandMoreIcon.displayName = 'ExpandMoreIcon';

export const ExpandMore = makeUSWDSIcon(ExpandMoreIcon);
