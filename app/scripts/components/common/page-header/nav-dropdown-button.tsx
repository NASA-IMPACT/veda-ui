import React from 'react';
import { USWDSNavDropDownButton } from '../uswds/header/nav-drop-down-button';
import { USWDSMenu } from '../uswds/header/menu';

interface NavDropDownButtonProps {
  item: { title: string; children: any[] };
  isOpen: boolean[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  onToggle: (
    index: number,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => void;
  index: number;
  CreateNavMenu: (children: any[]) => React.ReactNode;
}

export const NavDropDownButton: React.FC<NavDropDownButtonProps> = ({
  item,
  isOpen,
  setIsOpen,
  onToggle,
  index,
  CreateNavMenu
}) => {
  return (
    <React.Fragment key={item.title}>
      <USWDSNavDropDownButton
        onToggle={() => onToggle(index, setIsOpen)}
        menuId={item.title}
        isOpen={isOpen[index]}
        label={item.title}
      />
      <USWDSMenu
        items={CreateNavMenu(item.children)}
        isOpen={isOpen[index]}
        id={`${item.title}-dropdown`}
      />
    </React.Fragment>
  );
};
