import React from 'react';
import styled, { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { NavLink } from 'react-router-dom';
import { default as PageHeaderLegacy } from './page-header-legacy';
import PageHeader from './page-header';
import { useSlidingStickyHeaderProps } from './layout-root/useSlidingStickyHeaderProps';
import NasaLogoColor from './nasa-logo-color';
import {
  HEADER_WRAPPER_ID,
  HEADER_TRANSITION_DURATION
} from '$utils/use-sliding-sticky-header';
import { checkEnvFlag } from '$utils/utils';

const NavWrapperContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${themeVal('zIndices.sticky')};

  transition: top ${HEADER_TRANSITION_DURATION}ms ease-out;
  ${({ shouldSlideHeader, headerHeight }) =>
    // Hide the header by translating the nav by the header's height. The
    // translate is in the NavWrapper and not the header because in this way the
    // localNav (also inside the NavWrapper) will stick to the top.
    shouldSlideHeader &&
    css`
      top: -${headerHeight}px;
    `}
`;
// Hiding configurable map for now until Instances are ready to adapt it
const isUSWDSEnabled = checkEnvFlag(process.env.ENABLE_USWDS_PAGE_HEADER);
const appTitle = isUSWDSEnabled ? 'Earthdata VEDA Dashboard' : process.env.APP_TITLE;

function NavWrapper(props) {
  const { isHeaderHidden, headerHeight } = useSlidingStickyHeaderProps();

  return (
    isUSWDSEnabled ? (
      <PageHeader
        {...props}
        logo={<NasaLogoColor />}
        linkProperties={{ LinkElement: NavLink, pathAttributeKeyName: 'to' }}
        title={appTitle}
      />
    ) : (
      <NavWrapperContainer
        id={HEADER_WRAPPER_ID}
        shouldSlideHeader={isHeaderHidden}
        headerHeight={headerHeight}
      >
        <PageHeaderLegacy
          {...props}
          linkProperties={{ LinkElement: NavLink, pathAttributeKeyName: 'to' }}
        />
      </NavWrapperContainer>
    )
  )
}

export default NavWrapper;
