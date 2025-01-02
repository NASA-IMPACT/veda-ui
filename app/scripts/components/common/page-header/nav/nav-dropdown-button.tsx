import React, { useCallback } from 'react';
import { USWDSNavDropDownButton, USWDSMenu } from '$uswds';
import { DropdownNavLink } from '../types';
import { createDynamicNavMenuList } from './create-dynamic-nav-menu-list';
import { SetState } from '$types/aliases';
import { LinkProperties } from '$types/veda';
import { useClickOutside } from '$utils/use-click-outside';

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
  const handleClickOutside = useCallback(() => {
    if (isOpen[index]) {
      setIsOpen((prevIsOpen) => {
        const newIsOpen = [...prevIsOpen];
        newIsOpen[index] = false;
        return newIsOpen;
      });
    }
  }, [index, isOpen, setIsOpen]);
  const dropdownRef = useClickOutside(handleClickOutside);
  const submenuItems = createDynamicNavMenuList(item.children, linkProperties);

  return (
    <div key={item.id} ref={dropdownRef}>
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
    </div>
  );
};
