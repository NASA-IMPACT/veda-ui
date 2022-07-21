import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import PageHeader from './page-header';

import PageLocalNav from '$components/common/page-local-nav';
import useScrollDirection from '$utils/use-scroll-direction';
import { render } from '@testing-library/react';

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
  const renderLocalNav = !!localNavProps;
  const scrollDir = useScrollDirection();

  return (
    <NavWrapper>
      <AnimatedPageHeader className={scrollDir} />
      {renderLocalNav && <PageLocalNav {...localNavProps} />}
    </NavWrapper>
  );
}

PageNavWrapper.propTypes = {
  localNavProps: T.object
};

export default PageNavWrapper;
