import React from 'react';
import { ExternalNavLink, InternalNavLink } from '../../types';
import { LinkProperties } from '$types/veda';

interface NavItemExternalLinkProps {
  item: ExternalNavLink;
}

interface NavItemInternalLinkProps {
  item: InternalNavLink;
  linkProperties: LinkProperties;
}

export const NavItemExternalLink = ({ item }: NavItemExternalLinkProps) => {
  return (
    <a
      key={item.id}
      target='_blank'
      rel='noopener noreferrer'
      href={item.href}
      className='usa-nav__link'
      id={item.id}
    >
      <span>{item.title}</span>
    </a>
  );
};

export const NavItemInternalLink = ({
  item,
  linkProperties
}: NavItemInternalLinkProps) => {
  if (linkProperties.LinkElement) {
    const path = {
      [linkProperties.pathAttributeKeyName]: (item as InternalNavLink).to
    };
    const LinkElement = linkProperties.LinkElement;
    return (
      <LinkElement
        key={item.id}
        {...path}
        className='usa-nav__link'
        id={item.id}
      >
        <span>{item.title}</span>
      </LinkElement>
    );
  }
  // If the link provided is invalid, do not render the element
  return null;
};
