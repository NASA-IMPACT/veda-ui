import React, { MouseEventHandler } from 'react';
import { getBoolean } from 'veda';
import { LinkProps } from 'react-router-dom';


export const getLinkProps = (
    linkTo: string,
    as?: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>,
    onClick?: (() => void) | MouseEventHandler
  ) => {
    const externalLinksInNewTab = getBoolean('externalLinksInNewTab');
    const isExternalLink = /^https?:\/\//.test(linkTo);
    return isExternalLink
    ? {
        href: linkTo,
        to: linkTo,
        ...(externalLinksInNewTab
          ? {target: '_blank', rel: 'noopener noreferrer'}
          : {}),
        ...(onClick ? {onClick: onClick} : {})
      }
    : {
        ...(as ? {as: as} : {}),
        to: linkTo,
        ...(onClick ? {onClick: onClick} : {})
      };
  };