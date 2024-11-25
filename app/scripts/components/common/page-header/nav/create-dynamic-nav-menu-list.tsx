import React from 'react';
import { NavItem, NavItemType } from '../types';
import { NavDropDownButton } from './nav-dropdown-button';
import { NavItemExternalLink, NavItemInternalLink } from './nav-item-links';
import { NavItemCTA } from './nav-item-cta';
import { LinkProperties } from '$types/veda';

export const createDynamicNavMenuList = (
  navItems: NavItem[],
  linkProperties: LinkProperties,
  isOpen: boolean[] | undefined = undefined,
  setIsOpen:
    | React.Dispatch<React.SetStateAction<boolean[]>>
    | undefined = undefined
): JSX.Element[] => {
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
        return (
          linkProperties && (
            <NavItemInternalLink {...{ item, linkProperties }} />
          )
        );

      case NavItemType.EXTERNAL_LINK:
        return <NavItemExternalLink item={item} />;

      case NavItemType.ACTION:
        return <NavItemCTA item={item} />;

      default:
        return <></>;
    }
  });
};
