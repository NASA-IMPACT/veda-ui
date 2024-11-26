import React, { ReactElement, useCallback, useState, useMemo } from 'react';
import { NavItem } from './types';
import LogoContainer from './logo-container';
import { createDynamicNavMenuList } from './nav/create-dynamic-nav-menu-list';
import { LinkProperties } from '$types/veda';
import { USWDSHeader, USWDSHeaderTitle } from '$components/common/uswds/header';
import { USWDSNavMenuButton } from '$components/common/uswds/header/nav-menu-button';
import { USWDSExtendedNav } from '$components/common/uswds/header/extended-nav';
import './styles.scss';

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logoSvg?: SVGElement;
  linkProperties: LinkProperties;
  title: string;
  version?: string;
}

export default function PageHeader ({
  mainNavItems,
  subNavItems,
  logoSvg: Logo,
  linkProperties,
  title,
  version
}: PageHeaderProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean[]>(
    mainNavItems.map(() => false)
  );

  const toggleExpansion: () => void = useCallback(() => {
    setExpanded((prvExpanded) => {
      return !prvExpanded;
    });
  }, [expanded]);

  const primaryItems = useMemo(
    () =>
      createDynamicNavMenuList(mainNavItems, linkProperties, isOpen, setIsOpen),
    [mainNavItems, isOpen]
  );

  const secondaryItems = useMemo(
    () => createDynamicNavMenuList(subNavItems, linkProperties),
    [subNavItems]
  );

  return (
    <>
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
};
