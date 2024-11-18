import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { LinkProperties } from '@types/veda';
import { NavItem } from './types';
import LogoContainer from './logo-container';
import { createDynamicNavMenuList } from './nav/create-dynamic-nav-menu-list';
import { USWDSHeader, USWDSHeaderTitle } from '$components/common/uswds/header';
import { USWDSNavMenuButton } from '$components/common/uswds/header/nav-menu-button';
import { USWDSExtendedNav } from '$components/common/uswds/header/extended-nav';
import './styles.scss';

const appTitle = process.env.APP_TITLE;
const appVersion = process.env.APP_VERSION;

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logo?: ReactElement;
  linkProperties: LinkProperties;
  mode?: 'dark' | 'light';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  mainNavItems,
  subNavItems,
  logo: Logo,
  linkProperties,
  mode
}) => {
  //@TODO: toggle expanded on window resize! Or on click anywhere?
  // weird, should be implemented on the library side of things, see https://vscode.dev/github/NASA-IMPACT/veda-ui/blob/1137-implement-new-ds-page-header/node_modules/%40uswds/uswds/packages/usa-header/src/index.js#L155-L156

  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = (): void =>
    setExpanded((prvExpanded) => {
      return !prvExpanded;
    });

  const [isOpen, setIsOpen] = useState<boolean[]>(
    mainNavItems.map(() => false)
  );

  const primaryItems = createDynamicNavMenuList(
    mainNavItems,
    linkProperties,
    isOpen,
    setIsOpen
  );

  const secondaryItems = createDynamicNavMenuList(subNavItems, linkProperties);
  // @TODO: we should close the menu when the user clicks on a link (internal or other cta)
  const themeMode = mode ? `mode-${mode}` : 'mode-light';
  return (
    <>
      <USWDSHeader id={themeMode} extended={true} showMobileOverlay={expanded}>
        <div className='usa-navbar'>
          <USWDSHeaderTitle>
            <LogoContainer
              linkProperties={{
                LinkElement: Link,
                pathAttributeKeyName: 'to'
              }}
              Logo={Logo}
              title='Earthdata VEDA Dashboard'
              subTitle={appTitle}
              version={appVersion}
              themeMode={themeMode}
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

export default PageHeader;