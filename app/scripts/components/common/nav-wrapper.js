import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import PageHeader from './page-header';

import PageLocalNav from '$components/common/page-local-nav';
import useScrollDirection from '$utils/use-scroll-direction';

const NavWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const AnimatedPageHeader = styled(PageHeader)`
  transition: margin-top 0.32s ease-out;
  margin-top: 0;
  &.up {
    margin-top: 0;
  }
  &.down {
    margin-top: calc(
      -2.5rem - (1rem * var(--base-space-multiplier, 1) * 0.75 * 2)
    );
  }
`;

function PageNavWrapper({ localNavProps }) {
  // Not all the pages have two navigations.
  // We do not need to use scroll direction/animation if there is a single nav
  const renderLocalNav = !!localNavProps;
  const scrollDir = useScrollDirection(renderLocalNav);

  return (
    <NavWrapper>
      <AnimatedPageHeader className={renderLocalNav ? scrollDir : ''} />
      {renderLocalNav && <PageLocalNav {...localNavProps} />}
    </NavWrapper>
  );
}

PageNavWrapper.propTypes = {
  localNavProps: T.object
};

export default PageNavWrapper;
