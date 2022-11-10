import React, { createContext, useContext, useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';

import MetaTags from './meta-tags';

import PageFooter from './page-footer';

import { useThematicArea } from '$utils/thematics';
import { useGoogleAnalytics } from '$utils/use-google-analytics';
import { useSlidingStickyHeader } from '$utils/use-sliding-sticky-header';
import NavWrapper from '$components/common/nav-wrapper';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-anchor: none;
`;

const PageBody = styled.div`
  flex-grow: 1;
  animation: ${reveal} 0.48s ease 0s 1;
  display: flex;
  flex-direction: column;
  overflow-anchor: auto;
`;

function LayoutRoot(props) {
  const { children } = props;

  useGoogleAnalytics();

  const { title, thumbnail, description, hideFooter, localNavProps } =
    useContext(LayoutRootContext);

  const thematic = useThematicArea();

  const truncatedTitle =
    title?.length > 32 ? `${title.slice(0, 32)}...` : title;

  const fullTitle = truncatedTitle ? `${truncatedTitle} — ` : '';
  const thematicTitle = thematic ? `: ${thematic.data.name}` : '';
  return (
    <Page>
      <MetaTags
        title={`${fullTitle}${appTitle}${thematicTitle}`}
        description={description || appDescription}
        thumbnail={thumbnail}
      />
      <NavWrapper localNavProps={localNavProps} />
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

interface LayoutRootContextProps extends Record<string, any> {
  setLayoutProps: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isHeaderHidden: boolean;
  headerHeight: number;
  wrapperHeight: number;
}

// Context
export const LayoutRootContext = createContext({} as LayoutRootContextProps);

export function LayoutRootContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [layoutProps, setLayoutProps] = useState<Record<string, any>>({});

  // Put the header size and visibility status in the context so that children
  // elements can access them for positioning purposes.
  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeader();

  const ctx = {
    ...layoutProps,
    setLayoutProps,
    isHeaderHidden,
    headerHeight,
    wrapperHeight
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

/**
 * Hook to access the values needed to position the sticky headers.
 */
export function useSlidingStickyHeaderProps() {
  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useContext(LayoutRootContext);

  return {
    isHeaderHidden,
    headerHeight,
    wrapperHeight
  };
}
