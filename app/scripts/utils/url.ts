import React, { MouseEventHandler } from 'react';
import { LinkProps } from 'react-router-dom';

export function isExternalLink(link: string): boolean {
  return /^https?:\/\//.test(link) && !link.includes(window.location.hostname);
}

export const getLinkProps = (
  linkTo: string,
  isLinkExternal?: boolean,
  as?: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >,
  onClick?: (() => void) | MouseEventHandler
) => {
  // Open the link in a new tab when link is external
  const isExternalLink = isLinkExternal ?? /^https?:\/\//.test(linkTo);
  return isExternalLink
    ? {
        href: linkTo,
        to: linkTo,
        ...{ target: '_blank', rel: 'noopener noreferrer' },
        ...(onClick ? { onClick: onClick } : {})
      }
    : {
        ...(as ? { as: as } : {}),
        to: linkTo,
        ...(onClick ? { onClick: onClick } : {})
      };
};
