import React from 'react';
import { NavItem, NavItemType } from '../types';
import { NavDropDownButton } from './nav-dropdown-button';
import { NavItemExternalLink, NavItemInternalLink } from './nav-item-links';
import { NavItemCTA } from './nav-item-cta';
import { LinkProperties } from '$types/veda';
import { SetState } from '$types/aliases';

export const createDynamicNavMenuList = (
  navItems: NavItem[],
  linkProperties: LinkProperties,
  isOpen?: boolean[],
  setIsOpen?: SetState<boolean[]>
): JSX.Element[] => {
  // @TODO:Need to elevate this functionality to outside of the header. Allow this function to take classname as an argument so we can dynamcally create different types of links across multiple compoenents and apply various visual styling.
  return navItems.map((item, index) => {
    switch (item.type) {
      case NavItemType.DROPDOWN:
        if (isOpen === undefined || setIsOpen === undefined) return <></>;
        return (
          <NavDropDownButton
            {...{
              item,
              isOpen,
              setIsOpen,
              index,
              linkProperties
            }}
          />
        );

      case NavItemType.INTERNAL_LINK:
        return <NavItemInternalLink {...{ item, linkProperties }} />;

      case NavItemType.EXTERNAL_LINK:
        return <NavItemExternalLink item={item} />;

      case NavItemType.ACTION:
        return <NavItemCTA item={item} />;

      default:
        return <></>;
    }
  });
};
