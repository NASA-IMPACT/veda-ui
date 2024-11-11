import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkProperties } from '$types/veda';
import { USWDSMenu } from '../uswds/header/menu';
import GoogleForm from '../google-form';
import {
  NavItem,
  NavItemType,
  InternalNavLink,
  ExternalNavLink,
  ButtonNavLink
} from './types';
import Logo from './logo';
import { USWDSHeader, USWDSHeaderTitle } from '$components/common/uswds/header';
import { USWDSNavDropDownButton } from '$components/common/uswds/header/nav-drop-down-button';
import { USWDSNavMenuButton } from '$components/common/uswds/header/nav-menu-button';
import { USWDSExtendedNav } from '$components/common/uswds/header/extended-nav';
import { USWDSButton } from '$components/common/uswds';

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logo?: ReactElement;
  linkProperties: LinkProperties;
}

export default function PageHeader(props: PageHeaderProps) {
  const { mainNavItems, subNavItems, logo, linkProperties } = props;
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

  const CreateNavMenu = (navItems: NavItem[]) => {
    return navItems.map((item) => {
      if (item.type == NavItemType.DROPDOWN) {
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
        );
      } else if (
        item.type == NavItemType.INTERNAL_LINK &&
        linkProperties.LinkElement
      ) {
        const path = {
          [linkProperties.pathAttributeKeyName]: (item as InternalNavLink).to
        };
        const LinkElement = linkProperties.LinkElement;
        return (
          <LinkElement {...path} className='usa-nav__link'>
            <span>{item.title}</span>
          </LinkElement>
        );
      } else if (item.type == NavItemType.EXTERNAL_LINK) {
        return (
          <a
            target='_blank'
            rel='noopener noreferrer'
            onClick={onClick}
            href={(item as ExternalNavLink).href}
            className='usa-nav__link'
          >
            <span>{item.title}</span>
          </a>
        );
      } else if (
        item.type == NavItemType.BUTTON &&
        item.title.toLocaleLowerCase() == 'contact us'
      ) {
        // @NOTE: This is a workaround right now because we can't provide a callback that returns some jsx element from veda.config.js where this nav config is being defined
        // This ideally would just go away once we migrate the instances over and there is no need for the veda.config file. The nav config can just specify the action attribute directly

        // @NOTE: Also GoogleForm component is coupled with the button component already, Ideally it would be broken out, possible @TECH-DEBT but since it is currently coupled...
        // we either have to decouple it or we would create another Nav Item Type where it is a more generic component type
        return (
          <GoogleForm title={item.title} src={(item as ButtonNavLink).src} />
        );
      } else if (item.type == NavItemType.BUTTON) {
        return (
          <USWDSButton
            onClick={item.action}
            outline={true}
            type='button'
            size='small'
          >
            {item.title}
          </USWDSButton>
        );
      }
    });
  };

  return (
    <>
      <USWDSHeader extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>
            {logo ?? (
              <Logo
                linkProperties={{
                  LinkElement: Link,
                  pathAttributeKeyName: 'to'
                }}
              />
            )}
          </USWDSHeaderTitle>
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
