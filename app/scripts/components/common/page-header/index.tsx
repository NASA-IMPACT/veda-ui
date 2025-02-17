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
} from '$uswds';

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logoSvg?: SVGElement | JSX.Element;
  title: string;
  version?: string;
  accessibilityHomeShortCutText?: string;
}

export default function PageHeader({
  mainNavItems,
  subNavItems,
  logoSvg: Logo,
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
    () => createDynamicNavMenuList(mainNavItems, isOpen, setIsOpen),
    [mainNavItems, isOpen]
  );

  const secondaryItems = useMemo(
    () => createDynamicNavMenuList(subNavItems),
    [subNavItems]
  );

  const skipNav = (e) => {
    e.preventDefault();
    const pageBody = document.getElementById('pagebody');
    if (pageBody) {
      pageBody.focus();
    }
  };

  return (
    <>
      <button type='button' className='usa-skipnav' onClick={skipNav}>
        {accessibilityHomeShortCutText || 'Skip to main content'}
      </button>
      <USWDSHeader extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>
            <LogoContainer
              LogoSvg={Logo}
              title={title}
              version={version}
              className='mobile-lg:display-block display-none'
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
