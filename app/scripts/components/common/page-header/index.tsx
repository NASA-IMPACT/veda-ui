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
  const { mainNavItems, subNavItems, logo, linkProperties } = props;
  console.log(`mainNavItems: `, mainNavItems)
  console.log(`subNavItems: `, subNavItems)
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
      Simple link dog
    </a>,
    <a href='#linkTwo' key='two'>
      Simple link cat
    </a>
  ];

  const CreateNavMenu = (navItems: NavItem[]) => {
    return (
      navItems.map((item) => {
        if(item.type == NavItemType.DROPDOWN) {
          return (
            <>
              <USWDSNavDropDownButton
                onToggle={(): void => {
                  onToggle(0, setIsOpen);
                }}
                menuId={item.title}
                isOpen={isOpen[0]}
                label={item.title}
              />
              <USWDSMenu
                key='one'
                items={CreateNavMenu(item.children)}
                isOpen={isOpen[0]}
                id={`${item.title}-dropdown`}
              />
            </>
          )
        } else if (item.type == NavItemType.INTERNAL_LINK && linkProperties.LinkElement) {
          const path = {[linkProperties.pathAttributeKeyName]: (item as InternalNavLink).to}
          const LinkElement = linkProperties.LinkElement;
          return (
            <LinkElement {...path} className='usa-nav__link'>
              <span>
                {item.title}
              </span>
            </LinkElement>
          );
        } else if (item.type == NavItemType.EXTERNAL_LINK) {
          return (
            <a
              target='_blank'
              rel='noopener'
              onClick={onClick}
              href={(item as ExternalNavLink).href}
              className='usa-nav__link'
            >
              <span>
                {item.title}
              </span>
            </a>
          );
        }
    }))
  };
  
  return (
    <>
      <USWDSHeader extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>Project Title</USWDSHeaderTitle>
          <USWDSNavMenuButton onClick={onClick} label='Menu' />
        </div>
        <USWDSExtendedNav
          primaryItems={CreateNavMenu(mainNavItems)}
          secondaryItems={CreateNavMenu(subNavItems)}
          mobileExpanded={expanded}
          onToggleMobileNav={onClick}
        />
      </USWDSHeader>
    </>
  );
}
