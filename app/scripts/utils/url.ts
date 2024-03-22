import { getBoolean } from 'veda';
import { Link, LinkProps } from 'react-router-dom';

export const getLinkProps = (
    isExternalLink: string[] | boolean,
    linkTo: string,
    as?: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>,
    onClick?: () => void
  ) => {
    const externalLinksInNewTab = getBoolean('externalLinksInNewTab');
    return isExternalLink
    ? {
        href: linkTo,
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
  }