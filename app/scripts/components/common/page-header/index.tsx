import React, { useCallback, useState, useMemo } from 'react';

import { NavItem } from './types';
import LogoContainer from './logo-container';
import useMobileMenuFix from './use-mobile-menu-fix';
import { createDynamicNavMenuList } from './nav/create-dynamic-nav-menu-list';
import {
  USWDSHeader,
  USWDSHeaderTitle,
  USWDSNavMenuButton,
  USWDSExtendedNav
} from '$components/common/uswds';
import { LinkProperties } from '$types/veda';
import './styles.scss';

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logoSvg?: SVGElement | JSX.Element;
  linkProperties: LinkProperties;
  title: string;
  version?: string;
  accessibilityHomeShortCutText?: string;
}

export default function PageHeader({
  mainNavItems,
  subNavItems,
  logoSvg: Logo,
  linkProperties,
  title,
  version,
  accessibilityHomeShortCutText
}: PageHeaderProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  useMobileMenuFix(expanded, setExpanded);

  const [isOpen, setIsOpen] = useState<boolean[]>(
    mainNavItems.map(() => false)
  );

  const toggleExpansion: () => void = useCallback(() => {
    setExpanded((prvExpanded) => {
      return !prvExpanded;
    });
  }, []);

  const primaryItems = useMemo(
    () =>
      createDynamicNavMenuList(mainNavItems, linkProperties, isOpen, setIsOpen),
    [mainNavItems, linkProperties, isOpen]
  );

  const secondaryItems = useMemo(
    () => createDynamicNavMenuList(subNavItems, linkProperties),
    [subNavItems, linkProperties]
  );

  const skipNav = (e) => {
    e.preventDefault();
    const pageBody = document.getElementById('pagebody');
    if (pageBody) {
      pageBody.focus();
    }
  }

  return (
    <>
      <button
        className='usa-skipnav'
        onClick={skipNav}
      >
        {accessibilityHomeShortCutText || 'Skip to main content'}
      </button>
      <USWDSHeader extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>
            <LogoContainer
              linkProperties={linkProperties}
              LogoSvg={Logo}
              title={title}
              version={version}
            />
          </USWDSHeaderTitle>
          <USWDSNavMenuButton onClick={toggleExpansion} label='Menu' />
        </div>
        <USWDSExtendedNav
          primaryItems={primaryItems}
          secondaryItems={secondaryItems}
          mobileExpanded={expanded}
          onToggleMobileNav={toggleExpansion}
        />
      </USWDSHeader>
    </>
  );
}
