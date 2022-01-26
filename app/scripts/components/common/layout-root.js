import React, { createContext, useContext, useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageBody = styled.div`
  flex-grow: 1;
  animation: ${reveal} 0.48s ease 0s 1;
  display: flex;
  flex-direction: column;
`;

function LayoutRoot(props) {
  const { children } = props;
  const { title, hideFooter } = useContext(LayoutRootContext);

  const truncatedTitle =
    title?.length > 32 ? `${title.slice(0, 32)}...` : title;

  const fullTitle = truncatedTitle ? `${truncatedTitle} — ` : '';

  return (
    <Page>
      <MetaTags
        title={`${fullTitle}${appTitle}`}
        description={appDescription}
      />
      <PageHeader />
      <PageBody>
        <Outlet />
        {children}
      </PageBody>
      <PageFooter isHidden={hideFooter} />
    </Page>
  );
}

LayoutRoot.propTypes = {
  children: T.node
};

export default LayoutRoot;

// Context
export const LayoutRootContext = createContext({});

export function LayoutRootContextProvider({ children }) {
  const [layoutProps, setLayoutProps] = useState({});

  const ctx = {
    ...layoutProps,
    setLayoutProps
  };

  return (
    <LayoutRootContext.Provider value={ctx}>
      {children}
    </LayoutRootContext.Provider>
  );
}

LayoutRootContextProvider.propTypes = {
  children: T.node
};

export function LayoutProps(props) {
  const { setLayoutProps } = useContext(LayoutRootContext);

  useEffect(() => {
    setLayoutProps(props);
  }, [setLayoutProps, props]);

  return null;
}
