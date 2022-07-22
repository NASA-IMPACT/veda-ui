import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import PageHeader from './page-header';

import PageLocalNav from '$components/common/page-local-nav';

const NavWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`;

function PageNavWrapper({ localNavProps }) {
  const renderLocalNav = !!localNavProps;

  return (
    <NavWrapper>
      <PageHeader />
      {renderLocalNav && <PageLocalNav {...localNavProps} />}
    </NavWrapper>
  );
}

PageNavWrapper.propTypes = {
  localNavProps: T.object
};

export default PageNavWrapper;
