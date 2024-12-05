import React from 'react';
import { USWDSNavDropDownButton } from '../../uswds/header/nav-drop-down-button';
import { USWDSMenu } from '../../uswds/header/menu';
import { DropdownNavLink } from '../types';
import { createDynamicNavMenuList } from './create-dynamic-nav-menu-list';
import { SetState } from '$types/aliases';
import { LinkProperties } from '$types/veda';

interface NavDropDownButtonProps {
  item: DropdownNavLink;
  isOpen: boolean[];
  setIsOpen: SetState<boolean[]>;
  index: number;
  linkProperties: LinkProperties;
}

export const NavDropDownButton = ({
  item,
  isOpen,
  setIsOpen,
  index,
  linkProperties
}: NavDropDownButtonProps) => {
  const onToggle = (index: number, setIsOpen: SetState<boolean[]>): void => {
    setIsOpen((prevIsOpen) => {
      const newIsOpen = prevIsOpen.map(
        (prev, i) =>
          i === index
            ? !prev // toggle the current dropdown
            : false // close all other dropdowns
      );
      return newIsOpen;
    });
  };

  const submenuItems = createDynamicNavMenuList(item.children, linkProperties);

  return (
    <React.Fragment key={item.id}>
      <USWDSNavDropDownButton
        onToggle={() => onToggle(index, setIsOpen)}
        menuId={item.title}
        isOpen={isOpen[index]}
        label={item.title}
      />
      <USWDSMenu
        items={submenuItems}
        isOpen={isOpen[index]}
        id={`${item.id}-dropdown`}
      />
    </React.Fragment>
  );
};
