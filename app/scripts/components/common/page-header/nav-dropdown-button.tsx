import React from 'react';
import { LinkProperties } from '../card';
import { USWDSNavDropDownButton } from '../uswds/header/nav-drop-down-button';
import { USWDSMenu } from '../uswds/header/menu';
import { renderDynamicNavMenu } from './dynamic-nav-menu';

interface NavDropDownButtonProps {
  item: { title: string; children: any[] };
  isOpen: boolean[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  toggleExpansion: () => void;
  index: number;
  linkProperties: LinkProperties;
}

export const NavDropDownButton: React.FC<NavDropDownButtonProps> = ({
  item,
  isOpen,
  setIsOpen,
  toggleExpansion,
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

  const submenuItems = renderDynamicNavMenu({
    navItems: item.children,
    linkProperties,
    toggleExpansion,
    isOpen,
    setIsOpen
  });

  return (
    <React.Fragment key={item.title}>
      <USWDSNavDropDownButton
        onToggle={() => onToggle(index, setIsOpen)}
        menuId={item.title}
        isOpen={isOpen[index]}
        label={item.title}
      />
      <USWDSMenu
        items={submenuItems}
        isOpen={isOpen[index]}
        id={`${item.title}-dropdown`}
      />
    </React.Fragment>
  );
};
