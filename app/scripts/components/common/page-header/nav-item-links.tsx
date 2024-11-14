import React from 'react';
import { LinkProperties } from '../card';
import { ExternalNavLink, InternalNavLink } from './types';

interface NavItemExternalLinkProps {
  item: ExternalNavLink;
  toggleExpansion: () => void;
}

interface NavItemInternalLinkProps {
  item: InternalNavLink;
  linkProperties: LinkProperties;
}

export const NavItemExternalLink: React.FC<NavItemExternalLinkProps> = ({
  item,
  toggleExpansion
}): JSX.Element => {
  return (
    <a
      key={item.title}
      target='_blank'
      rel='noopener noreferrer'
      onClick={toggleExpansion}
      href={item.href}
      className='usa-nav__link'
    >
      <span>{item.title}</span>
    </a>
  );
};

export const NavItemInternalLink: React.FC<NavItemInternalLinkProps> = ({
  item,
  linkProperties
}): JSX.Element | null => {
  if (linkProperties.LinkElement) {
    const path = {
      [linkProperties.pathAttributeKeyName]: (item as InternalNavLink).to
    };
    const LinkElement = linkProperties.LinkElement;
    return (
      <LinkElement key={item.title} {...path} className='usa-nav__link'>
        <span>{item.title}</span>
      </LinkElement>
    );
  }
  // If the link provided is invalid, do not render the element
  return null;
};
