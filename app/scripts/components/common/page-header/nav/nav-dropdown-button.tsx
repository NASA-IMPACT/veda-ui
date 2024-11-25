import React from 'react';
import { USWDSNavDropDownButton } from '../../uswds/header/nav-drop-down-button';
import { USWDSMenu } from '../../uswds/header/menu';
import { DropdownNavLink } from '../types';
import { createDynamicNavMenuList } from './create-dynamic-nav-menu-list';
import { LinkProperties } from '$types/veda';

interface NavDropDownButtonProps {
  item: DropdownNavLink;
  isOpen: boolean[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  index: number;
  linkProperties: LinkProperties;
}

export const NavDropDownButton: React.FC<NavDropDownButtonProps> = ({
  item,
  isOpen,
  setIsOpen,
  index,
  linkProperties
}) => {
  const onToggle = (
    index: number,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  ): void => {
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
