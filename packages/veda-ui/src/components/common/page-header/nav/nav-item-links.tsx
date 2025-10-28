import React from 'react';
import { ExternalNavLink, InternalNavLink } from '../../types';
import { useVedaUI } from '$context/veda-ui-provider';

interface NavItemExternalLinkProps {
  item: ExternalNavLink;
}

interface NavItemInternalLinkProps {
  item: InternalNavLink;
}

export const NavItemExternalLink = ({ item }: NavItemExternalLinkProps) => {
  const defaultClassName = 'usa-nav__link';
  return (
    <a
      key={item.id}
      target='_blank'
      rel='noopener noreferrer'
      href={item.href}
      className={item.customClassNames || defaultClassName}
      id={item.id}
    >
      <span>{item.title}</span>
    </a>
  );
};

export const NavItemInternalLink = ({ item }: NavItemInternalLinkProps) => {
  const {
    navigation: { LinkComponent, linkProps }
  } = useVedaUI();

  const path = {
    [linkProps.pathAttributeKeyName]: (item as InternalNavLink).to
  };
  const defaultClassName = 'usa-nav__link';
  return (
    <LinkComponent
      key={item.id}
      {...path}
      className={item.customClassNames || defaultClassName}
      id={item.id}
    >
      <span>{item.title}</span>
    </LinkComponent>
  );
};
