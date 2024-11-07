import React, { ReactElement, useState } from 'react';
import { NavItem } from './types';
import { LinkProperties } from '$types/veda';
import {
  USWDSHeader,
  USWDSHeaderTitle
} from '$components/common/uswds/header';
import { USWDSMenu } from '../uswds/header/menu';
import { USWDSNavDropDownButton } from '$components/common/uswds/header/nav-drop-down-button';
import { USWDSNavMenuButton } from '$components/common/uswds/header/nav-menu-button';
import { USWDSExtendedNav } from '$components/common/uswds/header/extended-nav';

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logo: ReactElement;
  linkProperties: LinkProperties;
}

export default function PageHeader(props: PageHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded);

  const [isOpen, setIsOpen] = useState([false]);
  const onToggle = (
    index: number,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  ): void => {
    setIsOpen((prevIsOpen) => {
      const newIsOpen = [...prevIsOpen];
      newIsOpen[index] = !newIsOpen[index];
      return newIsOpen;
    });
  };

  const testMenuItems = [
    <a href='#linkOne' key='one'>
      Simple link one
    </a>,
    <a href='#linkTwo' key='two'>
      Simple link two
    </a>
  ];

  const testItemsMenu = [
    <>
      <USWDSNavDropDownButton
        onToggle={(): void => {
          onToggle(0, setIsOpen);
        }}
        menuId='testDropDownOne'
        isOpen={isOpen[0]}
        label='Nav Label'
        isCurrent={true}
      />
      <USWDSMenu
        key='one'
        items={testMenuItems}
        isOpen={isOpen[0]}
        id='testDropDownOne'
      />
    </>,
    <a href='#two' key='two' className='usa-nav__link'>
      <span>Parent link</span>
    </a>,
    <a href='#three' key='three' className='usa-nav__link'>
      <span>Parent link</span>
    </a>
  ];

  return (
    <>
      <USWDSHeader extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>Project Title</USWDSHeaderTitle>
          <USWDSNavMenuButton onClick={onClick} label='Menu' />
        </div>
        <USWDSExtendedNav
          primaryItems={testItemsMenu}
          secondaryItems={testMenuItems}
          mobileExpanded={expanded}
          onToggleMobileNav={onClick}
        />
      </USWDSHeader>
    </>
  );
}
