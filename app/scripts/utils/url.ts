import React from 'react';
import { LinkProps } from 'react-router-dom';

export function isExternalLink(link: string): boolean {
  return /^https?:\/\//.test(link) && !link.includes(window.location.hostname);
}

export const getLinkProps = (
  linkTo: string,
  as?: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >
) => {
  // Open the link in a new tab when link is external
  const isExternalLink = /^(https?:\/\/|mailto:)/i.test(linkTo);

  return (isExternalLink)
    ? {
        href: linkTo,
        to: linkTo,
        ...{ target: '_blank', rel: 'noopener noreferrer' },
      }
    : {
        ...(as ? { as: as } : {}),
        to: linkTo,
      };
};
