import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import Announcement from './announcement';

import MetaTags from './meta-tags';
import PageFooter from './page-footer';

import { useGoogleTagManager } from '$utils/use-google-tag-manager';
import { useSlidingStickyHeader } from '$utils/use-sliding-sticky-header';
import NavWrapper from '$components/common/nav-wrapper';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;
export const PAGE_BODY_ID = 'pagebody';
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

function LayoutRoot(props: { children?: ReactNode }) {
  const { children } = props;

  useGoogleTagManager();

  const { title, thumbnail, description, hideFooter } =
    useContext(LayoutRootContext);

  const truncatedTitle =
    title?.length > 32 ? `${title.slice(0, 32)}...` : title;

  const fullTitle = truncatedTitle ? `${truncatedTitle} — ` : '';
  return (
    <Page>
      <MetaTags
        title={`${fullTitle}${appTitle}`}
        description={description || appDescription}
        thumbnail={thumbnail}
      />
      <Announcement />
      <NavWrapper />
      <PageBody id={PAGE_BODY_ID} tabIndex={-1}>
        <Outlet />
        {children}
      </PageBody>
      <PageFooter isHidden={hideFooter} />
    </Page>
  );
}

export default LayoutRoot;

interface LayoutRootContextProps extends Record<string, any> {
  setLayoutProps: Dispatch<SetStateAction<Record<string, any>>>;
  isHeaderHidden: boolean;
  headerHeight: number;
  wrapperHeight: number;
  feedbackModalRevealed: boolean;
  setFeedbackModalRevealed: Dispatch<SetStateAction<boolean>>;
}

// Context
export const LayoutRootContext = createContext({} as LayoutRootContextProps);

export function LayoutRootContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [layoutProps, setLayoutProps] = useState<Record<string, any>>({});
  const [feedbackModalRevealed, setFeedbackModalRevealed] =
    useState<boolean>(false);

  // Put the header size and visibility status in the context so that children
  // elements can access them for positioning purposes.
  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeader();

  const ctx = {
    ...layoutProps,
    setLayoutProps,
    isHeaderHidden,
    headerHeight,
    wrapperHeight,
    feedbackModalRevealed,
    setFeedbackModalRevealed
  };

  return (
    <LayoutRootContext.Provider value={ctx}>
      {children}
    </LayoutRootContext.Provider>
  );
}

export function LayoutProps(props) {
  const { setLayoutProps } = useContext(LayoutRootContext);

  useDeepCompareEffect(() => {
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

/**
 * Hook to access the feedback modal.
 */
export function useFeedbackModal() {
  const { feedbackModalRevealed, setFeedbackModalRevealed } =
    useContext(LayoutRootContext);

  return {
    isRevealed: feedbackModalRevealed,
    show: useCallback(
      () => setFeedbackModalRevealed(true),
      [setFeedbackModalRevealed]
    ),
    hide: useCallback(
      () => setFeedbackModalRevealed(false),
      [setFeedbackModalRevealed]
    )
  };
}
