import React from 'react';
import styled, { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { NavLink } from 'react-router-dom';
import PageHeader from './page-header';
import PageHeaderUSWDS from './page-header-uswds';
import { useSlidingStickyHeaderProps } from './layout-root/useSlidingStickyHeaderProps';

import {
  HEADER_WRAPPER_ID,
  HEADER_TRANSITION_DURATION
} from '$utils/use-sliding-sticky-header';

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

function NavWrapper(props) {
  const { isHeaderHidden, headerHeight } = useSlidingStickyHeaderProps();
  return (
    <NavWrapperContainer
      id={HEADER_WRAPPER_ID}
      shouldSlideHeader={isHeaderHidden}
      headerHeight={headerHeight}
    >
      {process.env.FEATURE_FLAG_USWDS === 'TRUE' ? (
        <PageHeaderUSWDS
          {...props}
          linkProperties={{ LinkElement: NavLink, pathAttributeKeyName: 'to' }}
        />
      ) : (
        <PageHeader
          {...props}
          linkProperties={{ LinkElement: NavLink, pathAttributeKeyName: 'to' }}
        />
      )}
    </NavWrapperContainer>
  );
}

export default NavWrapper;
